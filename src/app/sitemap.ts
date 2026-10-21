import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { languageAlternates, localePath } from "@/lib/site";

const publicPages = [
  { path: "", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/comunidad", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/principiante", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/veterano", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/barcelona", changeFrequency: "monthly" as const, priority: 0.8 },
];

function languagesFor(path: string) {
  return languageAlternates(path);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();
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
