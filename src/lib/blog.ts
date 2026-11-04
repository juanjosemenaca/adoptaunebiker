import {
  BlogClient,
  deriveTags,
  slugify,
  type BlogArticle,
  type BlogArticleSummary,
} from "babylovegrowth-next-js-blog";
import type { Locale } from "@/i18n/config";
import type { BlogAsset, BlogPost } from "./blog-admin.ts";
import { excerptFrom, markdownToHtml } from "./blog-markdown.ts";

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

let publishedArticles: Promise<BlogArticleSummary[]> | null = null;

export function getPublishedArticles() {
  publishedArticles ??= withBlog([], () => blog.getAllArticles());
  return publishedArticles;
}

export function getPublishedArticle(slug: string) {
  return withBlog(null, async () => {
    const article = await blog.getArticleBySlug(slug);
    if (!article || !article.published) return null;
    return article;
  });
}

export async function getBlogTags() {
  return deriveTags(await getPublishedArticles());
}

export async function getArticlesByTag(tagSlug: string) {
  const normalized = slugify(tagSlug);
  const articles = await getPublishedArticles();
  return articles.filter((article) => {
    const candidates = [article.seedKeyword, ...article.keywords].filter(
      (keyword): keyword is string => Boolean(keyword),
    );
    return candidates.some((keyword) => slugify(keyword) === normalized);
  });
}

export async function getBlogSitemapEntries() {
  const articles = await getPublicArticles();
  return articles.map((article) => ({
    slug: article.slug,
    created_at: article.publishedAt,
    updated_at: article.updatedAt,
    published_at: article.publishedAt,
    languageCode: article.locale,
  }));
}

export type PublicArticle = {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  subtitle: string;
  excerpt: string;
  coverUrl: string;
  publishedAt: string;
  updatedAt: string;
  locale: string;
  html: string;
  attachments: BlogAsset[];
  keywords: string[];
  jsonLd: Record<string, unknown> | null;
  faqJsonLd: Record<string, unknown> | null;
};

function isFullArticle(article: BlogArticleSummary | BlogArticle): article is BlogArticle {
  return "content_html" in article;
}

function fromLocal(post: BlogPost): PublicArticle {
  return {
    id: `local-${post.id}`,
    slug: post.slug,
    title: post.title,
    seoTitle: post.seoTitle.trim(),
    subtitle: post.subtitle,
    excerpt: excerptFrom(post.metaDescription || post.subtitle, post.body),
    coverUrl: post.coverUrl,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    locale: post.locale,
    html: markdownToHtml(post.body),
    attachments: post.assets,
    keywords: [],
    jsonLd: null,
    faqJsonLd: null,
  };
}

function fromRemote(article: BlogArticleSummary | BlogArticle): PublicArticle {
  const full = isFullArticle(article) ? article : null;
  return {
    id: `blg-${article.id}`,
    slug: article.slug,
    title: article.title,
    seoTitle: article.title,
    subtitle: "",
    excerpt: article.meta_description || article.excerpt,
    coverUrl: article.hero_image_url,
    publishedAt: article.published_at,
    updatedAt: article.updated_at,
    locale: article.languageCode,
    html: full?.content_html ?? "",
    attachments: [],
    keywords: [article.seedKeyword ?? "", ...article.keywords].filter(Boolean),
    jsonLd: full?.jsonLd ?? null,
    faqJsonLd: full?.faqJsonLd ?? null,
  };
}

export async function getPublicArticles(): Promise<PublicArticle[]> {
  const { listPublishedLocalPosts } = await import("./blog-admin.ts");
  const [local, remote] = await Promise.all([listPublishedLocalPosts(), getPublishedArticles()]);
  const localSlugs = new Set(local.map((post) => post.slug));
  const merged = [
    ...local.map(fromLocal),
    ...remote.filter((article) => !localSlugs.has(article.slug)).map((article) => fromRemote(article)),
  ];
  return merged.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function publicArticlesForLocale(articles: PublicArticle[], locale: Locale) {
  const matching = articles.filter((article) => {
    const lang = (article.locale || "").toLowerCase().split(/[-_]/)[0];
    return lang === locale;
  });
  return matching.length > 0 ? matching : articles;
}

export async function getPublicArticle(slug: string): Promise<PublicArticle | null> {
  const { getPublishedLocalPost } = await import("./blog-admin.ts");
  const local = await getPublishedLocalPost(slug);
  if (local) return fromLocal(local);
  const remote = await getPublishedArticle(slug);
  return remote ? fromRemote(remote) : null;
}
