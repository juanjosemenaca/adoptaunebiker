import type { Metadata } from "next";
import { defaultLocale, isLocale, locales, ogLocale, type Locale } from "@/i18n/config";
import { languageAlternates, localePath } from "@/lib/site";

const noIndex: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true },
};

export function resolveLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function publicMetadata({
  locale,
  path = "",
  title,
  description,
  absoluteTitle = false,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
}): Metadata {
  const lang = resolveLocale(locale);
  const url = localePath(lang, path);
  const rest = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: `/${lang}${rest}`,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      locale: ogLocale[lang],
      alternateLocale: locales.filter((item) => item !== lang).map((item) => ogLocale[item]),
      url,
      siteName: "Adopta un eBiker",
      title,
      description,
      images: [{ url: "/logo.png", width: 852, height: 456, alt: "Adopta un eBiker" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.png"],
    },
    robots: { index: true, follow: true },
  };
}

export function privateMetadata(title: string, description?: string): Metadata {
  return {
    title,
    description,
    robots: noIndex,
  };
}
