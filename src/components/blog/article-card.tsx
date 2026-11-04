import Image from "next/image";
import Link from "next/link";
import { dateLocale, type Locale } from "@/i18n/config";
import { formatBlogDate, type PublicArticle } from "@/lib/blog";
import { hrefs } from "@/lib/paths";

export function ArticleCard({
  article,
  locale,
}: {
  article: PublicArticle;
  locale: Locale;
}) {
  return (
    <Link
      href={`${hrefs(locale).blog}/${article.slug}`}
      className="group flex flex-col overflow-hidden border border-line bg-rubber transition hover:border-bone/25"
    >
      {article.coverUrl ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-panel">
          <Image
            src={article.coverUrl}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <time
          dateTime={article.publishedAt}
          className="text-[11px] font-medium tracking-[0.16em] text-mist uppercase"
        >
          {formatBlogDate(article.publishedAt, dateLocale[locale])}
        </time>
        <h2 className="mt-3 text-lg font-semibold tracking-tight text-bone transition group-hover:text-mist">
          {article.title}
        </h2>
        {article.subtitle || article.excerpt ? (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-mist">
            {article.subtitle || article.excerpt}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
