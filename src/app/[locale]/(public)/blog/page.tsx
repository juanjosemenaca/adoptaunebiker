import type { Metadata } from "next";
import { ArticleCard } from "@/components/blog/article-card";
import { BlogPagination } from "@/components/blog/pagination";
import { PublicJsonLd } from "@/components/public-json-ld";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getPublicArticles, paginate, parsePage, publicArticlesForLocale } from "@/lib/blog";
import { hrefs } from "@/lib/paths";
import { publicMetadata } from "@/lib/seo";
import { localePath } from "@/lib/site";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return publicMetadata({
    locale,
    path: "/blog",
    title: t.blog.metaTitle,
    description: t.blog.metaDescription,
    absoluteTitle: true,
  });
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page } = await searchParams;
  const t = getDictionary(locale);
  const lang = isLocale(locale) ? locale : "es";
  const url = localePath(lang, "/blog");
  const articles = publicArticlesForLocale(await getPublicArticles(), lang);
  const { items, info } = paginate(articles, parsePage(page));

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16">
      <PublicJsonLd
        locale={locale}
        url={url}
        t={t}
        variant="page"
        pageTitle={t.blog.title}
        crumbs={[
          { name: t.nav.home, url: localePath(lang) },
          { name: t.blog.title, url },
        ]}
      />
      <p className="text-[11px] font-medium tracking-[0.16em] text-mist uppercase">{t.nav.blog}</p>
      <h1 className="display mt-3 max-w-4xl text-4xl text-bone sm:text-6xl">{t.blog.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-mist">{t.blog.lead}</p>

      {items.length === 0 ? (
        <p className="mt-12 max-w-xl text-base leading-7 text-mist">{t.blog.empty}</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} locale={lang} />
          ))}
        </div>
      )}

      <BlogPagination basePath={hrefs(lang).blog} info={info} t={t} />
    </div>
  );
}
