export const locales = ["es", "ca", "en", "fr", "de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export const localeLabel: Record<Locale, string> = {
  es: "ES",
  ca: "CA",
  en: "EN",
  fr: "FR",
  de: "DE",
};

export const localeName: Record<Locale, string> = {
  es: "Español",
  ca: "Català",
  en: "English",
  fr: "Français",
  de: "Deutsch",
};

export const htmlLang: Record<Locale, string> = {
  es: "es",
  ca: "ca",
  en: "en",
  fr: "fr",
  de: "de",
};

export const ogLocale: Record<Locale, string> = {
  es: "es_ES",
  ca: "ca_ES",
  en: "en_GB",
  fr: "fr_FR",
  de: "de_DE",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
