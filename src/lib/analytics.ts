import { parsePrivacyCookie, privacyCookieName } from "./privacy.ts";

export const analyticsConsentCookie = privacyCookieName;

export const analyticsEvents = {
  signUpCtaClick: "sign_up_cta_click",
  registrationStart: "registration_start",
  registrationComplete: "registration_complete",
  contactClick: "contact_click",
} as const;

export type AnalyticsEvent = (typeof analyticsEvents)[keyof typeof analyticsEvents];

export function gaMeasurementId() {
  const value = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return value && /^G-[A-Z0-9]+$/i.test(value) ? value : "";
}

export function canLoadAnalytics(prefs: { analytics?: boolean } | null | undefined) {
  return Boolean(gaMeasurementId() && prefs?.analytics);
}

export function readBrowserAnalyticsConsent(cookieHeader = typeof document !== "undefined" ? document.cookie : "") {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${privacyCookieName}=([^;]*)`));
  if (!match?.[1]) return false;
  try {
    return Boolean(parsePrivacyCookie(decodeURIComponent(match[1]))?.analytics);
  } catch {
    return false;
  }
}

export function trackEvent(name: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  if (!canLoadAnalytics({ analytics: readBrowserAnalyticsConsent() })) return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name);
}
