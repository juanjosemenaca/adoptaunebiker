import { BlogClient, type BlogArticleSummary } from "babylovegrowth-next-js-blog";
import type { Locale } from "@/i18n/config";

export const BLOG_PATH = "/blog";
export const PAGE_SIZE = 12;
export const REVALIDATE_SECONDS = process.env.NODE_ENV === "development" ? 10 : 86400;

export const blog = new BlogClient({
  apiKey: process.env.BABYLOVEGROWTH_BLOG_API_KEY,
  baseUrl: process.env.BABYLOVEGROWTH_BLOG_API_URL,
  revalidate: REVALIDATE_SECONDS,
});

export function hasBlogKey() {
  return Boolean(process.env.BABYLOVEGROWTH_BLOG_API_KEY?.trim());
}

export function formatBlogDate(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface PageInfo {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function paginate<T>(items: T[], page: number, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    info: {
      page: current,
      totalPages,
      hasPrev: current > 1,
      hasNext: current < totalPages,
    } satisfies PageInfo,
  };
}

export function pageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

export function articlesForLocale(articles: BlogArticleSummary[], locale: Locale) {
  const matching = articles.filter((article) => {
    const lang = (article.languageCode || "").toLowerCase().split(/[-_]/)[0];
    return lang === locale;
  });
  return matching.length > 0 ? matching : articles;
}

async function withBlog<T>(fallback: T, run: () => Promise<T>) {
  if (!hasBlogKey()) return fallback;
  try {
    return await run();
  } catch {
    return fallback;
  }
}

export function getPublishedArticles() {
  return withBlog([], () => blog.getAllArticles());
}

export function getPublishedArticle(slug: string) {
  return withBlog(null, async () => {
    const article = await blog.getArticleBySlug(slug);
    if (!article || !article.published) return null;
    return article;
  });
}

export function getBlogTags() {
  return withBlog([], () => blog.getTags());
}

export function getArticlesByTag(tagSlug: string) {
  return withBlog([], () => blog.getArticlesByTag(tagSlug));
}

export function getBlogSitemapEntries() {
  return withBlog([], () => blog.getSitemapEntries());
}
