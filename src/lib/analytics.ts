export const analyticsConsentCookie = "adopta.analytics_consent";

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

export function trackEvent(name: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name);
}
