import Link from "next/link";
import type { Dictionary } from "@/i18n/types";
import { fill } from "@/i18n/get-dictionary";
import { pageHref, type PageInfo } from "@/lib/blog";

const linkClass =
  "inline-flex min-h-11 items-center text-[11px] font-medium tracking-[0.16em] uppercase text-mist hover:text-bone";

export function BlogPagination({
  basePath,
  info,
  t,
}: {
  basePath: string;
  info: PageInfo;
  t: Dictionary;
}) {
  if (info.totalPages <= 1) return null;

  return (
    <nav className="mt-12 flex items-center justify-between gap-4" aria-label={t.nav.blog}>
      {info.hasPrev ? (
        <Link href={pageHref(basePath, info.page - 1)} className={linkClass}>
          {t.blog.prev}
        </Link>
      ) : (
        <span className={`${linkClass} cursor-not-allowed opacity-40`}>{t.blog.prev}</span>
      )}
      <span className="text-sm text-mist">
        {fill(t.blog.pageOf, { page: info.page, total: info.totalPages })}
      </span>
      {info.hasNext ? (
        <Link href={pageHref(basePath, info.page + 1)} className={linkClass}>
          {t.blog.next}
        </Link>
      ) : (
        <span className={`${linkClass} cursor-not-allowed opacity-40`}>{t.blog.next}</span>
      )}
    </nav>
  );
}
