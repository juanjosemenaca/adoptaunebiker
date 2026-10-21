import { parsePrivacyCookie, privacyCookieName } from "./privacy.ts";

export const analyticsConsentCookie = privacyCookieName;
export const analyticsScriptId = "ga4";

export const analyticsEvents = {
  signUpCtaClick: "sign_up_cta_click",
  registrationStart: "registration_start",
  registrationComplete: "registration_complete",
  contactClick: "contact_click",
} as const;

export type AnalyticsEvent = (typeof analyticsEvents)[keyof typeof analyticsEvents];

export function isValidGaMeasurementId(value: string | undefined | null) {
  return Boolean(value && /^G-[A-Z0-9]+$/i.test(value.trim()));
}

export function gaMeasurementId(raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
  const value = raw?.trim() ?? "";
  return isValidGaMeasurementId(value) ? value : "";
}

export function hasAnalyticsCategoryConsent(prefs: { analytics?: boolean } | null | undefined) {
  return prefs?.analytics === true;
}

export function canLoadAnalytics(
  prefs: { analytics?: boolean } | null | undefined,
  measurementId = gaMeasurementId(),
) {
  return Boolean(measurementId && hasAnalyticsCategoryConsent(prefs));
}

export function analyticsScriptSrc(measurementId: string) {
  const id = gaMeasurementId(measurementId);
  return id ? `https://www.googletagmanager.com/gtag/js?id=${id}` : "";
}

export function analyticsInlineConfig(measurementId: string) {
  const id = gaMeasurementId(measurementId);
  if (!id) return "";
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});`;
}

export function readBrowserAnalyticsConsent(cookieHeader = typeof document !== "undefined" ? document.cookie : "") {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${privacyCookieName}=([^;]*)`));
  if (!match?.[1]) return false;
  try {
    return hasAnalyticsCategoryConsent(parsePrivacyCookie(decodeURIComponent(match[1])));
  } catch {
    return false;
  }
}

function analyticsDisableKey(measurementId: string) {
  return `ga-disable-${measurementId}`;
}

export function disableBrowserAnalytics(measurementId = gaMeasurementId()) {
  const id = gaMeasurementId(measurementId);
  if (typeof window === "undefined" || !id) return;
  (window as unknown as Record<string, unknown>)[analyticsDisableKey(id)] = true;
}

export function enableBrowserAnalytics(measurementId = gaMeasurementId()) {
  const id = gaMeasurementId(measurementId);
  if (typeof window === "undefined" || !id) return;
  delete (window as unknown as Record<string, unknown>)[analyticsDisableKey(id)];
}

export function trackEvent(name: AnalyticsEvent, measurementId = gaMeasurementId()) {
  if (typeof window === "undefined") return;
  if (!canLoadAnalytics({ analytics: readBrowserAnalyticsConsent() }, measurementId)) return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name);
}
