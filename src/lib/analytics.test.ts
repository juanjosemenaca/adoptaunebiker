import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canLoadAnalytics,
  gaMeasurementId,
  readBrowserAnalyticsConsent,
} from "./analytics.ts";
import { privacyPolicyVersion, serializePrivacyCookie } from "./privacy.ts";

describe("analytics gating", () => {
  it("stays off without a measurement ID even if the visitor accepted", () => {
    assert.equal(gaMeasurementId(), "");
    assert.equal(canLoadAnalytics({ analytics: true }), false);
    assert.equal(canLoadAnalytics({ analytics: false }), false);
    assert.equal(canLoadAnalytics(null), false);
  });

  it("does not treat a missing privacy cookie as analytics consent in the browser", () => {
    assert.equal(readBrowserAnalyticsConsent(""), false);
    assert.equal(readBrowserAnalyticsConsent("NEXT_LOCALE=es"), false);
  });

  it("reads only an explicit analytics preference from the privacy cookie", () => {
    const accepted = serializePrivacyCookie({
      version: privacyPolicyVersion,
      analytics: true,
      updatedAt: "2026-10-21T08:00:00.000Z",
    });
    const rejected = serializePrivacyCookie({
      version: privacyPolicyVersion,
      analytics: false,
      updatedAt: "2026-10-21T08:00:00.000Z",
    });
    assert.equal(readBrowserAnalyticsConsent(`adopta.privacy=${accepted}`), true);
    assert.equal(readBrowserAnalyticsConsent(`adopta.privacy=${rejected}`), false);
    assert.equal(
      canLoadAnalytics({
        analytics: readBrowserAnalyticsConsent(`adopta.privacy=${accepted}`),
      }),
      false,
    );
  });
});
