import Link from "next/link";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { BrandLogo } from "@/components/brand-logo";
import { CookieSettingsButton } from "@/components/privacy-provider";
import { anchors, hrefs } from "@/lib/paths";

const linkClass = "inline-flex min-h-11 items-center hover:text-bone";

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

  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <BrandLogo size="footer" href={variant === "public" ? jump.home : links.home} />
          <p className="display mt-5 text-4xl text-bone">{t.footer.alone}</p>
          <p className="mt-2 max-w-sm text-sm text-mist">{t.footer.blurb}</p>
        </div>
        <nav
          aria-label={t.legal.nav.menu}
          className="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-mist sm:items-end"
        >
          <Link href={links.avisoLegal} className={linkClass}>
            {t.legal.nav.notice}
          </Link>
          <Link href={links.privacidad} className={linkClass}>
            {t.legal.nav.privacy}
          </Link>
          <Link href={links.cookies} className={linkClass}>
            {t.legal.nav.cookies}
          </Link>
          <Link href={links.condiciones} className={linkClass}>
            {t.legal.nav.terms}
          </Link>
          <CookieSettingsButton label={t.legal.nav.settings} />
        </nav>
      </div>
    </footer>
  );
}
