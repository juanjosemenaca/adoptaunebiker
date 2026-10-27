import Link from "next/link";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { BrandLogo } from "@/components/brand-logo";
import { CookieSettingsButton } from "@/components/privacy-provider";
import { hrefs } from "@/lib/paths";

const linkClass = "inline-flex min-h-11 items-center hover:text-bone";
const publicLinkClass =
  "inline-flex min-h-8 items-center text-[11px] font-medium tracking-[0.16em] uppercase hover:text-bone";

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

  const publicFooter = variant === "public";

  return (
    <footer className={`${publicFooter ? "mt-0 bg-asphalt" : "mt-20 border-t border-line"}`}>
      <div
        className={`mx-auto flex flex-col gap-8 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6 ${
          publicFooter ? "max-w-7xl py-14" : "max-w-6xl"
        }`}
      >
        <div>
          <BrandLogo size="footer" href={links.home} />
          <p className={`mt-5 text-bone ${publicFooter ? "display text-3xl sm:text-4xl" : "display text-4xl"}`}>
            {t.footer.alone}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-mist">{t.footer.blurb}</p>
        </div>
        <nav
          aria-label={t.legal.nav.menu}
          className={
            publicFooter
              ? "flex flex-col gap-0.5 text-mist sm:items-end"
              : "flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-mist sm:items-end"
          }
        >
          <Link href={links.avisoLegal} className={publicFooter ? publicLinkClass : linkClass}>
            {t.legal.nav.notice}
          </Link>
          <Link href={links.privacidad} className={publicFooter ? publicLinkClass : linkClass}>
            {t.legal.nav.privacy}
          </Link>
          <Link href={links.cookies} className={publicFooter ? publicLinkClass : linkClass}>
            {t.legal.nav.cookies}
          </Link>
          <Link href={links.condiciones} className={publicFooter ? publicLinkClass : linkClass}>
            {t.legal.nav.terms}
          </Link>
          <CookieSettingsButton
            label={t.legal.nav.settings}
            className={publicFooter ? publicLinkClass : undefined}
          />
        </nav>
      </div>
    </footer>
  );
}
