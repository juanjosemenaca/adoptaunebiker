export const DEMO_PASSWORD = "adopta";
export const DEMO_ADMIN_EMAIL = "admin@adopta.local";
export const DEMO_MEMBER_EMAILS = ["veterano@adopta.local", "ebiker@adopta.local"] as const;
export const SEED_DEMO_USER_IDS = [
  "22222222-2222-2222-2222-222222222222",
  "33333333-3333-3333-3333-333333333333",
] as const;

export function isSeedDemoMember(input: { id?: string; email?: string | null; slug?: string | null }) {
  const email = (input.email ?? "").trim().toLowerCase();
  if (email.endsWith("@adopta.local") && email !== DEMO_ADMIN_EMAIL) return true;
  if (input.id && SEED_DEMO_USER_IDS.includes(input.id as (typeof SEED_DEMO_USER_IDS)[number])) {
    return true;
  }
  const slug = (input.slug ?? "").trim().toLowerCase();
  return slug === "nuria-valls" || slug === "leo-andrade";
}

export function demoAuthEnabled(nodeEnv: string | undefined = process.env.NODE_ENV) {
  return nodeEnv === "development";
}

export function isDemoLoginAllowed(
  email: string,
  password: string,
  nodeEnv: string | undefined = process.env.NODE_ENV,
) {
  if (!demoAuthEnabled(nodeEnv)) return false;
  if (password !== DEMO_PASSWORD) return false;
  return email === DEMO_ADMIN_EMAIL || DEMO_MEMBER_EMAILS.includes(email as (typeof DEMO_MEMBER_EMAILS)[number]);
}
