import { defaultLocale, locales, type Locale } from "@/i18n/config";

export const contactEmail = "hola@adoptaunebiker.com";

export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const origin = raw && /^https?:\/\//i.test(raw) ? raw : "https://adoptaunebiker.com";
  return origin.replace(/\/$/, "");
}

export function localePath(locale: Locale, path = "") {
  const rest = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}/${locale}${rest}`;
}

export function languageAlternates(path = "") {
  const rest = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const languages: Record<string, string> = {
    "x-default": localePath(defaultLocale, rest),
  };
  for (const locale of locales) {
    languages[locale] = localePath(locale, rest);
  }
  return languages;
}
