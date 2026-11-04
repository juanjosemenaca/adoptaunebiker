import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleJsonLd } from "@/components/blog/article-json-ld";
import { TagList } from "@/components/blog/tag-list";
import { dateLocale, isLocale, locales, ogLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatBlogDate, getPublicArticle } from "@/lib/blog";
import { hrefs } from "@/lib/paths";
import { resolveLocale } from "@/lib/seo";
import { languageAlternates, localePath } from "@/lib/site";
import "../blog-content.css";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getPublicArticle(slug);
  if (!article) return {};

  const lang = resolveLocale(locale);
  const path = `/blog/${article.slug}`;
  const url = localePath(lang, path);
  const images = article.coverUrl
    ? [{ url: article.coverUrl }]
    : [{ url: "/logo.png", width: 1000, height: 350, alt: "Adopta un eBiker" }];

  return {
    title: { absolute: `${article.title} · Adopta un eBiker` },
    description: article.excerpt,
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
      description: article.excerpt,
      images,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.coverUrl ? [article.coverUrl] : ["/logo.png"],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getPublicArticle(slug);
  if (!article) notFound();

  const t = getDictionary(locale);
  const lang = isLocale(locale) ? locale : "es";
  const links = hrefs(lang);
  const files = article.attachments.filter((asset) => asset.kind === "file");

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
          {article.subtitle ? <p className="mt-4 text-lg leading-8 text-mist">{article.subtitle}</p> : null}
          <time dateTime={article.publishedAt} className="mt-4 block text-sm text-mist">
            {formatBlogDate(article.publishedAt, dateLocale[lang])}
          </time>
        </header>

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: article.html }} />

        {files.length > 0 ? (
          <aside className="mt-10 border-t border-line pt-6">
            <p className="text-[11px] font-medium tracking-[0.16em] text-mist uppercase">{t.blog.files}</p>
            <ul className="mt-3 space-y-2">
              {files.map((file) => (
                <li key={file.id}>
                  <a
                    href={file.url}
                    className="text-sm text-bone underline underline-offset-4 hover:text-mist"
                    rel="noopener noreferrer"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        <footer className="mt-12 border-t border-line pt-6">
          <TagList keywords={article.keywords} locale={lang} />
        </footer>
      </article>
    </div>
  );
}
