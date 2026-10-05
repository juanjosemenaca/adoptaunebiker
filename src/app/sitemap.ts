import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { languageAlternates, localePath, siteUrl } from "@/lib/site";

const publicPages = [
  { path: "", changeFrequency: "weekly" as const, priority: 1 },
];

function languagesFor(path: string) {
  const relative = languageAlternates(path);
  const origin = siteUrl();
  return Object.fromEntries(
    Object.entries(relative).map(([lang, href]) => [lang, `${origin}${href}`]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return publicPages.flatMap((page) =>
    locales.map((locale: Locale) => ({
      url: localePath(locale, page.path),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: languagesFor(page.path) },
    })),
  );
}
