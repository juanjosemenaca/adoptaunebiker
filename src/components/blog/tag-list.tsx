import Link from "next/link";
import { slugify } from "babylovegrowth-next-js-blog";
import type { Locale } from "@/i18n/config";
import { hrefs } from "@/lib/paths";

export function TagList({ keywords, locale }: { keywords: string[]; locale: Locale }) {
  const unique = Array.from(
    new Map(
      keywords
        .map((keyword) => keyword.trim())
        .filter(Boolean)
        .map((keyword) => [slugify(keyword), keyword] as const),
    ).entries(),
  ).filter(([slug]) => slug.length > 0);

  if (unique.length === 0) return null;

  const base = hrefs(locale).blog;

  return (
    <div className="flex flex-wrap gap-2">
      {unique.map(([slug, label]) => (
        <Link
          key={slug}
          href={`${base}/tag/${slug}`}
          className="rounded-full border border-line px-3 py-1 text-[11px] font-medium tracking-[0.12em] text-mist uppercase transition hover:border-bone/30 hover:text-bone"
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
