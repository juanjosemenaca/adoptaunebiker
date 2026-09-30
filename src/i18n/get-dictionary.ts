import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { ca } from "@/i18n/ca";
import { de } from "@/i18n/de";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es";
import { fr } from "@/i18n/fr";
import type { Dictionary } from "@/i18n/types";

const dictionaries: Record<Locale, Dictionary> = { es, ca, en, fr, de };

export function getDictionary(locale: string): Dictionary {
  return dictionaries[isLocale(locale) ? locale : defaultLocale];
}

export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}
