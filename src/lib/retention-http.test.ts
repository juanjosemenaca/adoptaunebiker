import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  authorizedRetentionRequest,
  readRetentionIntent,
  summarizeRetentionRows,
  timingSafeSecretEqual,
} from "./retention-http.ts";

const original = {
  secret: process.env.RETENTION_CRON_SECRET,
  cron: process.env.CRON_SECRET,
  apply: process.env.RETENTION_PURGE_APPLY,
};

afterEach(() => {
  process.env.RETENTION_CRON_SECRET = original.secret;
  process.env.CRON_SECRET = original.cron;
  process.env.RETENTION_PURGE_APPLY = original.apply;
});

describe("retention HTTP guards", () => {
  it("rejects missing or wrong bearer secrets", () => {
    delete process.env.RETENTION_CRON_SECRET;
    delete process.env.CRON_SECRET;
    assert.equal(authorizedRetentionRequest(new Request("https://adoptaunebiker.com/api/retention/purge")), false);

    process.env.RETENTION_CRON_SECRET = "expected-secret";
    assert.equal(
      authorizedRetentionRequest(
        new Request("https://adoptaunebiker.com/api/retention/purge", {
          headers: { authorization: "Bearer wrong-secret" },
        }),
      ),
      false,
    );
    assert.equal(
      authorizedRetentionRequest(
        new Request("https://adoptaunebiker.com/api/retention/purge", {
          headers: { authorization: "Bearer expected-secret" },
        }),
      ),
      true,
    );
  });

  it("does not treat query-string confirm as apply", async () => {
    const intent = await readRetentionIntent(
      new Request("https://adoptaunebiker.com/api/retention/purge?apply=1&confirm=purge", {
        method: "POST",
      }),
    );
    assert.equal(intent.apply, false);
  });

  it("applies only with an explicit JSON confirm on POST", async () => {
    const denied = await readRetentionIntent(
      new Request("https://adoptaunebiker.com/api/retention/purge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ confirm: "no" }),
      }),
    );
    const allowed = await readRetentionIntent(
      new Request("https://adoptaunebiker.com/api/retention/purge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ confirm: "purge" }),
      }),
    );
    assert.equal(denied.apply, false);
    assert.equal(allowed.apply, true);
  });

  it("keeps GET as dry-run unless the weekly apply flag is set", async () => {
    delete process.env.RETENTION_PURGE_APPLY;
    const dry = await readRetentionIntent(new Request("https://adoptaunebiker.com/api/retention/purge"));
    process.env.RETENTION_PURGE_APPLY = "1";
    const apply = await readRetentionIntent(new Request("https://adoptaunebiker.com/api/retention/purge"));
    assert.equal(dry.apply, false);
    assert.equal(apply.apply, true);
  });

  it("compares secrets in constant time and summarizes RPC rows without extra fields", () => {
    assert.equal(timingSafeSecretEqual("abc", "abc"), true);
    assert.equal(timingSafeSecretEqual("abc", "abd"), false);
    const summary = summarizeRetentionRows([
      { action: "would_delete", entity_type: "signup_request", entity_id: "11111111-1111-1111-1111-111111111111", reason: "rejected_older_than_six_months" },
      { action: "would_delete", entity_type: "member", entity_id: "22222222-2222-2222-2222-222222222222", reason: "inactive_older_than_six_months" },
      { action: "would_anonymize", entity_type: "signup_request", entity_id: "33333333-3333-3333-3333-333333333333", reason: "accepted_orphan_anonymize" },
    ]);
    assert.equal(summary.rejected, 1);
    assert.equal(summary.members, 1);
    assert.equal(summary.anonymized, 1);
    assert.equal("email" in summary.candidates[0], false);
  });
});
