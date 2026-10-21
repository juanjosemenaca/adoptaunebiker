import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { redactLogText, safeErrorMessage } from "./log.ts";

describe("log redaction", () => {
  it("strips emails, JWTs and token fields", () => {
    const redacted = redactLogText(
      "user admin@adopta.local token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.aaa.bbb access_token=abc123",
    );
    assert.equal(redacted.includes("admin@adopta.local"), false);
    assert.equal(redacted.includes("eyJ"), false);
    assert.equal(redacted.includes("abc123"), false);
    assert.equal(redacted.includes("[redacted]"), true);
  });

  it("does not log PostgREST details or hints", () => {
    const message = safeErrorMessage({
      name: "PostgrestError",
      code: "42501",
      message: "permission denied for table strava_accounts",
      details: "access_token=super-secret",
      hint: "contact admin@adopta.local",
    });
    assert.equal(message.includes("super-secret"), false);
    assert.equal(message.includes("admin@adopta.local"), false);
    assert.match(message, /PostgrestError/);
  });
});
