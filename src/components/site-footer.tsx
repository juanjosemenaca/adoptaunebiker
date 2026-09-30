import Link from "next/link";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { BrandLogo } from "@/components/brand-logo";
import { anchors, hrefs, publicSectionKeys } from "@/lib/paths";

export function SiteFooter({
  variant,
  locale,
  t,
}: {
  variant: "public" | "intranet" | "admin";
  locale: Locale;
  t: Dictionary;
}) {
  const links = hrefs(locale);
  const jump = anchors();
  const hrefByKey = {
    community: jump.community,
    beginner: jump.beginner,
    veteran: jump.veteran,
    how: jump.how,
    code: jump.code,
    faq: jump.faq,
  };

  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <BrandLogo size="footer" href={variant === "public" ? jump.home : links.home} />
          <p className="display mt-5 text-4xl text-bone">{t.footer.alone}</p>
          <p className="mt-2 max-w-sm text-sm text-mist">{t.footer.blurb}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-[0.2em] text-mist">
          {variant === "public"
            ? publicSectionKeys.map((section) => (
                <Link
                  key={section.key}
                  href={`${links.home}${hrefByKey[section.key]}`}
                  className="hover:text-bone"
                >
                  {t.nav[section.key]}
                </Link>
              ))
            : null}
          {variant === "intranet" ? (
            <>
              <Link href={links.explorar} className="hover:text-bone">
                {t.nav.peloton}
              </Link>
              <Link href={links.cuenta} className="hover:text-bone">
                {t.nav.account}
              </Link>
            </>
          ) : null}
          {variant === "admin" ? (
            <Link href={links.admin} className="hover:text-bone">
              {t.nav.requests}
            </Link>
          ) : null}
          <Link
            href={variant === "public" ? links.entrar : links.home}
            className="hover:text-bone"
          >
            {variant === "public" ? t.nav.enter : t.nav.publicSite}
          </Link>
        </div>
      </div>
    </footer>
  );
}
