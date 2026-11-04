import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleJsonLd } from "@/components/blog/article-json-ld";
import { TagList } from "@/components/blog/tag-list";
import { dateLocale, isLocale, locales, ogLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatBlogDate, getPublishedArticle, getPublishedArticles } from "@/lib/blog";
import { hrefs } from "@/lib/paths";
import { resolveLocale } from "@/lib/seo";
import { languageAlternates, localePath } from "@/lib/site";
import "../blog-content.css";

export const revalidate = 86400;

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return {};

  const lang = resolveLocale(locale);
  const path = `/blog/${article.slug}`;
  const url = localePath(lang, path);
  const images = article.hero_image_url
    ? [{ url: article.hero_image_url }]
    : [{ url: "/logo.png", width: 1000, height: 350, alt: "Adopta un eBiker" }];

  return {
    title: { absolute: `${article.title} · Adopta un eBiker` },
    description: article.meta_description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "article",
      locale: ogLocale[lang],
      alternateLocale: locales.filter((item) => item !== lang).map((item) => ogLocale[item]),
      url,
      siteName: "Adopta un eBiker",
      title: article.title,
      description: article.meta_description,
      images,
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.meta_description,
      images: article.hero_image_url ? [article.hero_image_url] : ["/logo.png"],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  const t = getDictionary(locale);
  const lang = isLocale(locale) ? locale : "es";
  const links = hrefs(lang);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16">
      <ArticleJsonLd data={article.jsonLd} />
      <ArticleJsonLd data={article.faqJsonLd} />

      <Link
        href={links.blog}
        className="inline-flex min-h-11 items-center text-[11px] font-medium tracking-[0.16em] text-mist uppercase hover:text-bone"
      >
        {t.blog.back}
      </Link>

      <article className="mt-6">
        <header className="mb-8">
          <h1 className="display text-4xl text-bone sm:text-5xl">{article.title}</h1>
          <time dateTime={article.published_at} className="mt-4 block text-sm text-mist">
            {formatBlogDate(article.published_at, dateLocale[lang])}
          </time>
        </header>

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: article.content_html }} />

        <footer className="mt-12 border-t border-line pt-6">
          <TagList keywords={[article.seedKeyword ?? "", ...article.keywords]} locale={lang} />
        </footer>
      </article>
    </div>
  );
}
