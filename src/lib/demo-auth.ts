export const DEMO_PASSWORD = "adopta";
export const DEMO_ADMIN_EMAIL = "admin@adopta.local";
export const DEMO_MEMBER_EMAILS = ["veterano@adopta.local", "ebiker@adopta.local"] as const;

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
