import Image from "next/image";
import Link from "next/link";
import type { BlogArticleSummary } from "babylovegrowth-next-js-blog";
import { dateLocale, type Locale } from "@/i18n/config";
import { formatBlogDate } from "@/lib/blog";
import { hrefs } from "@/lib/paths";

export function ArticleCard({
  article,
  locale,
}: {
  article: BlogArticleSummary;
  locale: Locale;
}) {
  return (
    <Link
      href={`${hrefs(locale).blog}/${article.slug}`}
      className="group flex flex-col overflow-hidden border border-line bg-rubber transition hover:border-bone/25"
    >
      {article.hero_image_url ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-panel">
          <Image
            src={article.hero_image_url}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <time
          dateTime={article.published_at}
          className="text-[11px] font-medium tracking-[0.16em] text-mist uppercase"
        >
          {formatBlogDate(article.published_at, dateLocale[locale])}
        </time>
        <h2 className="mt-3 text-lg font-semibold tracking-tight text-bone transition group-hover:text-mist">
          {article.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-mist">{article.meta_description}</p>
      </div>
    </Link>
  );
}
