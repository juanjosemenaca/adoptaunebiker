import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog/article-card";
import { BlogPagination } from "@/components/blog/pagination";
import { PublicJsonLd } from "@/components/public-json-ld";
import { isLocale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import {
  articlesForLocale,
  getArticlesByTag,
  getBlogTags,
  paginate,
  parsePage,
} from "@/lib/blog";
import { hrefs } from "@/lib/paths";
import { publicMetadata } from "@/lib/seo";
import { localePath } from "@/lib/site";

export const revalidate = 86400;

export async function generateStaticParams() {
  const tags = await getBlogTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const title = fill(t.blog.tagged, { tag: slug });
  return publicMetadata({
    locale,
    path: `/blog/tag/${slug}`,
    title,
    description: t.blog.metaDescription,
    absoluteTitle: true,
  });
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale, slug } = await params;
  const { page } = await searchParams;
  const t = getDictionary(locale);
  const lang = isLocale(locale) ? locale : "es";
  const articles = articlesForLocale(await getArticlesByTag(slug), lang);
  if (articles.length === 0) notFound();

  const { items, info } = paginate(articles, parsePage(page));
  const links = hrefs(lang);
  const path = `/blog/tag/${slug}`;
  const url = localePath(lang, path);
  const title = fill(t.blog.tagged, { tag: slug });

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16">
      <PublicJsonLd
        locale={locale}
        url={url}
        t={t}
        variant="page"
        pageTitle={title}
        crumbs={[
          { name: t.nav.home, url: localePath(lang) },
          { name: t.blog.title, url: localePath(lang, "/blog") },
          { name: title, url },
        ]}
      />
      <Link
        href={links.blog}
        className="inline-flex min-h-11 items-center text-[11px] font-medium tracking-[0.16em] text-mist uppercase hover:text-bone"
      >
        {t.blog.back}
      </Link>
      <h1 className="display mt-4 max-w-4xl text-4xl text-bone sm:text-6xl">{title}</h1>
      <p className="mt-4 text-sm text-mist">{fill(t.blog.articlesCount, { count: articles.length })}</p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => (
          <ArticleCard key={article.id} article={article} locale={lang} />
        ))}
      </div>

      <BlogPagination basePath={`${links.blog}/tag/${slug}`} info={info} t={t} />
    </div>
  );
}
