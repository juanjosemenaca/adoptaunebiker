import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createChallenge, solveChallenge } from "altcha-lib";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";
import {
  altchaHmacSecret,
  createAltchaChallenge,
  verifyAltchaPayload,
} from "./altcha.ts";

describe("altcha hmac secret", () => {
  it("prefers an explicit key and does not invent one in production", () => {
    assert.equal(altchaHmacSecret({ ALTCHA_HMAC_KEY: " given " }), "given");
    assert.equal(altchaHmacSecret({ NODE_ENV: "production" }), "");
    assert.equal(altchaHmacSecret({ NODE_ENV: "development" }), "adopta-dev-altcha");
  });

  it("can reuse an existing server secret without publishing it", () => {
    assert.equal(
      altchaHmacSecret({
        NODE_ENV: "production",
        SUPABASE_SERVICE_ROLE_KEY: "sb-secret",
      }),
      "adopta-altcha:sb-secret",
    );
  });
});

describe("altcha payload", () => {
  it("accepts a solved challenge and rejects empty or broken payloads", async () => {
    const secret = "test-altcha-secret";
    const challenge = await createChallenge({
      algorithm: "PBKDF2/SHA-256",
      cost: 200,
      counter: 80,
      deriveKey,
      hmacKeySignatureSecret: `${secret}.key`,
      hmacSignatureSecret: secret,
    });
    const solution = await solveChallenge({ challenge, deriveKey });
    assert.ok(solution);
    const payload = Buffer.from(
      JSON.stringify({
        challenge: { parameters: challenge.parameters, signature: challenge.signature },
        solution,
      }),
    ).toString("base64");

    assert.equal(await verifyAltchaPayload(payload, secret), true);
    assert.equal(await verifyAltchaPayload("", secret), false);
    assert.equal(await verifyAltchaPayload("not-a-payload", secret), false);
    assert.equal(await verifyAltchaPayload(payload, "other-secret"), false);
  });

  it("issues a signed challenge when a secret exists", async () => {
    const challenge = await createAltchaChallenge("test-altcha-secret");
    assert.equal(challenge.parameters.algorithm, "PBKDF2/SHA-256");
    assert.ok(challenge.signature);
  });
});
