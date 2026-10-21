export const privacyCookieName = "adopta.privacy";
/** Bump this when Analytics or another optional tool is actually switched on, so visitors are asked again. */
export const privacyPolicyVersion = 1;
export const privacyCookieMaxAge = 60 * 60 * 24 * 180;
export const legacyAnalyticsConsentCookie = "adopta.analytics_consent";

export type PrivacyPrefs = {
  version: number;
  analytics: boolean;
  updatedAt: string;
};

export function parsePrivacyCookie(value: string | undefined | null): PrivacyPrefs | null {
  if (!value) return null;
  const parts = Object.fromEntries(
    value.split("|").map((part) => {
      const index = part.indexOf("=");
      if (index < 0) return [part, ""];
      return [part.slice(0, index), part.slice(index + 1)];
    }),
  );
  const version = Number(parts.v);
  if (!Number.isInteger(version) || version !== privacyPolicyVersion) return null;
  if (parts.analytics !== "0" && parts.analytics !== "1") return null;
  if (!parts.ts) return null;
  return {
    version,
    analytics: parts.analytics === "1",
    updatedAt: parts.ts,
  };
}

export function serializePrivacyCookie(prefs: PrivacyPrefs) {
  return `v=${prefs.version}|analytics=${prefs.analytics ? "1" : "0"}|ts=${prefs.updatedAt}`;
}

export function createPrivacyPrefs(analytics: boolean, now = new Date()): PrivacyPrefs {
  return {
    version: privacyPolicyVersion,
    analytics,
    updatedAt: now.toISOString(),
  };
}

export function privacyCookieOptions(secure: boolean) {
  return {
    path: "/",
    maxAge: privacyCookieMaxAge,
    sameSite: "lax" as const,
    secure,
    httpOnly: false,
  };
}

export const optionalFirstPartyCookies = [legacyAnalyticsConsentCookie];

export function expireCookieAssignment(name: string, secure = false) {
  return `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure ? "; Secure" : ""}`;
}

export function privacyCookieAssignment(prefs: PrivacyPrefs, secure: boolean) {
  const options = privacyCookieOptions(secure);
  return `${privacyCookieName}=${serializePrivacyCookie(prefs)}; Path=${options.path}; Max-Age=${options.maxAge}; SameSite=Lax${secure ? "; Secure" : ""}`;
}

export function optionalCookieCleanup(secure: boolean) {
  return optionalFirstPartyCookies.map((name) => expireCookieAssignment(name, secure));
}

export function applyPrivacyChoice(analytics: boolean, secure: boolean, now = new Date()) {
  const prefs = createPrivacyPrefs(analytics, now);
  const assignments = [privacyCookieAssignment(prefs, secure)];
  if (!analytics) assignments.push(...optionalCookieCleanup(secure));
  return { prefs, assignments };
}
