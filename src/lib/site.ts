import { defaultLocale, locales, type Locale } from "@/i18n/config";

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://adoptaunebiker.com").replace(
    /\/$/,
    "",
  );
}

export function localePath(locale: Locale, path = "") {
  const rest = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}/${locale}${rest}`;
}

export function languageAlternates(path = "") {
  const rest = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const languages: Record<string, string> = {
    "x-default": `/${defaultLocale}${rest}`,
  };
  for (const locale of locales) {
    languages[locale] = `/${locale}${rest}`;
  }
  return languages;
}
