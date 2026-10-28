import { createChallenge, randomInt, verifySolution } from "altcha-lib";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";
import type { Challenge, Payload, Solution } from "altcha-lib/types";

const CHALLENGE_TTL_MS = 10 * 60 * 1000;

export function altchaHmacSecret(
  env: NodeJS.ProcessEnv = process.env,
): string {
  const explicit = env.ALTCHA_HMAC_KEY?.trim();
  if (explicit) return explicit;
  const existing =
    env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    env.CRON_SECRET?.trim() ||
    env.RETENTION_CRON_SECRET?.trim();
  if (existing) return `adopta-altcha:${existing}`;
  if (env.NODE_ENV !== "production") return "adopta-dev-altcha";
  return "";
}

export async function createAltchaChallenge(secret = altchaHmacSecret()) {
  if (!secret) {
    throw new Error("missing-altcha-secret");
  }
  return createChallenge({
    algorithm: "PBKDF2/SHA-256",
    cost: 3_000,
    counter: randomInt(6_000, 1_000),
    deriveKey,
    expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS),
    hmacKeySignatureSecret: `${secret}.key`,
    hmacSignatureSecret: secret,
  });
}

function decodePayload(raw: string): Payload | null {
  const value = raw.trim();
  if (!value) return null;
  const candidates = [value];
  try {
    candidates.unshift(Buffer.from(value, "base64").toString("utf8"));
  } catch {
    // The widget usually sends Base64; plain JSON is accepted as fallback.
  }
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as Partial<Payload>;
      if (parsed.challenge && parsed.solution) {
        return parsed as Payload;
      }
    } catch {
      // Try the next encoding.
    }
  }
  return null;
}

export async function verifyAltchaPayload(
  raw: string,
  secret = altchaHmacSecret(),
): Promise<boolean> {
  if (!secret) return false;
  const payload = decodePayload(raw);
  if (!payload) return false;
  try {
    const result = await verifySolution({
      challenge: payload.challenge as Challenge,
      deriveKey,
      hmacKeySignatureSecret: `${secret}.key`,
      hmacSignatureSecret: secret,
      solution: payload.solution as Solution,
    });
    return result.verified === true;
  } catch {
    return false;
  }
}
