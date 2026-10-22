import { parsePrivacyCookie, privacyCookieName } from "./privacy.ts";

export const analyticsConsentCookie = privacyCookieName;
export const analyticsScriptId = "ga4";
export const gtmScriptId = "gtm";
export const defaultGtmContainerId = "GTM-MX2JCJFR";

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

export function isValidGtmId(value: string | undefined | null) {
  return Boolean(value && /^GTM-[A-Z0-9]+$/i.test(value.trim()));
}

export function gtmContainerId(raw = process.env.NEXT_PUBLIC_GTM_ID ?? defaultGtmContainerId) {
  const value = raw?.trim() ?? "";
  return isValidGtmId(value) ? value.trim().toUpperCase() : "";
}

export function isAnalyticsConfigured() {
  return Boolean(gaMeasurementId() || gtmContainerId());
}

export function hasAnalyticsCategoryConsent(prefs: { analytics?: boolean } | null | undefined) {
  return prefs?.analytics === true;
}

export function canLoadAnalytics(
  prefs: { analytics?: boolean } | null | undefined,
  measurementId = gaMeasurementId(),
  containerId = gtmContainerId(),
) {
  return Boolean(
    hasAnalyticsCategoryConsent(prefs) &&
      (Boolean(gaMeasurementId(measurementId)) || Boolean(gtmContainerId(containerId))),
  );
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

export function gtmInlineBootstrap(containerId = gtmContainerId()) {
  const id = gtmContainerId(containerId);
  if (!id) return "";
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`;
}

export function gtmNoscriptSrc(containerId = gtmContainerId()) {
  const id = gtmContainerId(containerId);
  return id ? `https://www.googletagmanager.com/ns.html?id=${id}` : "";
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

export function trackEvent(
  name: AnalyticsEvent,
  measurementId = gaMeasurementId(),
  containerId = gtmContainerId(),
) {
  if (typeof window === "undefined") return;
  if (!canLoadAnalytics({ analytics: readBrowserAnalyticsConsent() }, measurementId, containerId)) {
    return;
  }
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", name);
    return;
  }
  const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
  if (Array.isArray(dataLayer)) {
    dataLayer.push({ event: name });
  }
}
