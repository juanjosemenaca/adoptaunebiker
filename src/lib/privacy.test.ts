import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyPrivacyChoice,
  createPrivacyPrefs,
  expireCookieAssignment,
  legacyAnalyticsConsentCookie,
  parsePrivacyCookie,
  privacyCookieName,
  privacyPolicyVersion,
  serializePrivacyCookie,
} from "./privacy.ts";

describe("privacy preferences", () => {
  it("round-trips a rejection without enabling analytics", () => {
    const prefs = createPrivacyPrefs(false, new Date("2026-10-21T08:00:00.000Z"));
    const parsed = parsePrivacyCookie(serializePrivacyCookie(prefs));
    assert.equal(parsed?.analytics, false);
    assert.equal(parsed?.version, privacyPolicyVersion);
  });

  it("does not treat an old or broken cookie as consent", () => {
    assert.equal(parsePrivacyCookie("v=0|analytics=1|ts=2026-01-01"), null);
    assert.equal(parsePrivacyCookie("analytics=1"), null);
    assert.equal(parsePrivacyCookie(""), null);
  });

  it("keeps an analytics preference as a preference only, not as a measurement ID", () => {
    const prefs = createPrivacyPrefs(true);
    assert.equal(prefs.analytics, true);
    assert.equal(parsePrivacyCookie(serializePrivacyCookie(prefs))?.analytics, true);
  });

  it("writes a rejection cookie and expires leftover optional cookies", () => {
    const { prefs, assignments } = applyPrivacyChoice(
      false,
      false,
      new Date("2026-10-21T08:00:00.000Z"),
    );
    assert.equal(prefs.analytics, false);
    assert.match(assignments[0] ?? "", new RegExp(`^${privacyCookieName}=`));
    assert.ok(assignments.some((item) => item.startsWith(`${legacyAnalyticsConsentCookie}=`)));
    assert.match(expireCookieAssignment(legacyAnalyticsConsentCookie), /Max-Age=0/);
  });

  it("does not treat accepting analytics as enough to name a vendor", () => {
    const { assignments } = applyPrivacyChoice(true, true);
    assert.equal(assignments.length, 1);
    assert.doesNotMatch(assignments[0] ?? "", /G-/);
  });
});
