import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { getPublishedArticles } from "@/lib/blog";
import { languageAlternates, localePath } from "@/lib/site";

const publicPages = [
  { path: "", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/comunidad", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/principiante", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/veterano", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/barcelona", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/aviso-legal", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/privacidad", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/condiciones-de-uso", changeFrequency: "yearly" as const, priority: 0.3 },
];

function languagesFor(path: string) {
  return languageAlternates(path);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date().toISOString();
  const pages = publicPages.flatMap((page) =>
    locales.map((locale: Locale) => ({
      url: localePath(locale, page.path),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: languagesFor(page.path) },
    })),
  );
  const articles = await getPublishedArticles();
  const articlePages = articles.flatMap((article) => {
    const path = `/blog/${article.slug}`;
    return locales.map((locale: Locale) => ({
      url: localePath(locale, path),
      lastModified: article.updated_at || lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: { languages: languagesFor(path) },
    }));
  });
  return [...pages, ...articlePages];
}
