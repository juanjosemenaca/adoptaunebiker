import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  analyticsEvents,
  analyticsInlineConfig,
  analyticsScriptId,
  analyticsScriptSrc,
  canLoadAnalytics,
  disableBrowserAnalytics,
  enableBrowserAnalytics,
  gaMeasurementId,
  hasAnalyticsCategoryConsent,
  isValidGaMeasurementId,
  readBrowserAnalyticsConsent,
  trackEvent,
} from "./analytics.ts";
import { applyPrivacyChoice, privacyPolicyVersion, serializePrivacyCookie } from "./privacy.ts";

const validId = "G-TESTID01";

describe("analytics gating", () => {
  it("stays off without a measurement ID even if the visitor accepted analytics", () => {
    assert.equal(gaMeasurementId(), "");
    assert.equal(canLoadAnalytics({ analytics: true }), false);
    assert.equal(canLoadAnalytics({ analytics: false }), false);
    assert.equal(canLoadAnalytics(null), false);
    assert.equal(analyticsScriptSrc(""), "");
    assert.equal(analyticsInlineConfig(""), "");
  });

  it("rejects IDs that are not a GA4 measurement ID", () => {
    assert.equal(isValidGaMeasurementId("GTM-XXXX"), false);
    assert.equal(isValidGaMeasurementId("UA-123-1"), false);
    assert.equal(isValidGaMeasurementId("G-"), false);
    assert.equal(gaMeasurementId("not-an-id"), "");
  });

  it("does not treat a missing privacy cookie as analytics consent", () => {
    assert.equal(readBrowserAnalyticsConsent(""), false);
    assert.equal(readBrowserAnalyticsConsent("NEXT_LOCALE=es"), false);
    assert.equal(hasAnalyticsCategoryConsent(null), false);
    assert.equal(hasAnalyticsCategoryConsent({}), false);
  });

  it("requires the analytics category, not just any saved cookie", () => {
    const rejected = serializePrivacyCookie({
      version: privacyPolicyVersion,
      analytics: false,
      updatedAt: "2026-10-21T08:00:00.000Z",
    });
    const accepted = serializePrivacyCookie({
      version: privacyPolicyVersion,
      analytics: true,
      updatedAt: "2026-10-21T08:00:00.000Z",
    });
    assert.equal(readBrowserAnalyticsConsent(`adopta.privacy=${rejected}`), false);
    assert.equal(canLoadAnalytics({ analytics: false }, validId), false);
    assert.equal(canLoadAnalytics({ analytics: true }, validId), true);
    assert.equal(
      canLoadAnalytics({ analytics: readBrowserAnalyticsConsent(`adopta.privacy=${accepted}`) }, validId),
      true,
    );
  });

  it("does not load after the visitor withdraws analytics consent", () => {
    const accepted = applyPrivacyChoice(true, false, new Date("2026-10-21T08:00:00.000Z"));
    const withdrawn = applyPrivacyChoice(false, false, new Date("2026-10-21T09:00:00.000Z"));
    assert.equal(canLoadAnalytics(accepted.prefs, validId), true);
    assert.equal(withdrawn.prefs.analytics, false);
    assert.equal(canLoadAnalytics(withdrawn.prefs, validId), false);
    assert.equal(
      readBrowserAnalyticsConsent(`adopta.privacy=${serializePrivacyCookie(withdrawn.prefs)}`),
      false,
    );
  });

  it("uses a single inline script id and one gtag config", () => {
    const inline = analyticsInlineConfig(validId);
    assert.equal(analyticsScriptId, "ga4");
    assert.equal(analyticsScriptSrc(validId), `https://www.googletagmanager.com/gtag/js?id=${validId}`);
    assert.equal(inline.includes("gtag('config'"), true);
    assert.equal(inline.split("gtag('config'").length - 1, 1);
    assert.equal(inline.split("gtag/js").length - 1, 0);
  });

  it("does not send events before consent or without gtag", () => {
    const calls: unknown[][] = [];
    const previousWindow = globalThis.window;
    const previousDocument = (globalThis as { document?: unknown }).document;
    (globalThis as { window?: unknown }).window = {
      gtag: (...args: unknown[]) => calls.push(args),
    };
    (globalThis as { document?: { cookie: string } }).document = { cookie: "" };
    try {
      trackEvent(analyticsEvents.signUpCtaClick, validId);
      assert.deepEqual(calls, []);
    } finally {
      if (previousWindow) (globalThis as { window?: unknown }).window = previousWindow;
      else delete (globalThis as { window?: unknown }).window;
      if (previousDocument) (globalThis as { document?: unknown }).document = previousDocument;
      else delete (globalThis as { document?: unknown }).document;
    }
  });

  it("sends one event per call only after analytics consent and a valid ID", () => {
    const calls: unknown[][] = [];
    const previousWindow = globalThis.window;
    const previousDocument = (globalThis as { document?: unknown }).document;
    const accepted = serializePrivacyCookie({
      version: privacyPolicyVersion,
      analytics: true,
      updatedAt: "2026-10-21T08:00:00.000Z",
    });
    (globalThis as { window?: unknown }).window = {
      gtag: (...args: unknown[]) => calls.push(args),
    };
    (globalThis as { document?: { cookie: string } }).document = {
      cookie: `adopta.privacy=${accepted}`,
    };
    try {
      trackEvent(analyticsEvents.contactClick, validId);
      assert.deepEqual(calls, [["event", analyticsEvents.contactClick]]);
      trackEvent(analyticsEvents.contactClick, "");
      assert.deepEqual(calls, [["event", analyticsEvents.contactClick]]);
    } finally {
      if (previousWindow) (globalThis as { window?: unknown }).window = previousWindow;
      else delete (globalThis as { window?: unknown }).window;
      if (previousDocument) (globalThis as { document?: unknown }).document = previousDocument;
      else delete (globalThis as { document?: unknown }).document;
    }
  });

  it("sets the GA disable flag when consent is withdrawn in the browser", () => {
    const previous = globalThis.window;
    const store: Record<string, unknown> = {};
    (globalThis as { window?: unknown }).window = store;
    try {
      disableBrowserAnalytics(validId);
      assert.equal(store[`ga-disable-${validId}`], true);
      enableBrowserAnalytics(validId);
      assert.equal(`ga-disable-${validId}` in store, false);
    } finally {
      if (previous) (globalThis as { window?: unknown }).window = previous;
      else delete (globalThis as { window?: unknown }).window;
    }
  });
});
