import Link from "next/link";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { BrandLogo } from "@/components/brand-logo";
import { ContactLink } from "@/components/contact-link";
import { CookieSettingsButton } from "@/components/privacy-provider";
import { anchors, hrefs, publicSectionKeys } from "@/lib/paths";
import { contactEmail } from "@/lib/site";

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
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
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
                    className="inline-flex min-h-11 items-center hover:text-bone"
                  >
                    {t.nav[section.key]}
                  </Link>
                ))
              : null}
            <Link
              href={variant === "public" ? links.entrar : links.home}
              className="inline-flex min-h-11 items-center hover:text-bone"
            >
              {variant === "public" ? t.nav.enter : t.nav.publicSite}
            </Link>
          </div>
        </div>
        {variant === "public" ? (
          <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <nav
              aria-label={t.nav.home}
              className="flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-[0.2em] text-mist"
            >
              <Link href={links.principiante} className="inline-flex min-h-11 items-center hover:text-bone">
                {t.nav.beginner}
              </Link>
              <Link href={links.veterano} className="inline-flex min-h-11 items-center hover:text-bone">
                {t.nav.veteran}
              </Link>
              <Link href={links.comunidad} className="inline-flex min-h-11 items-center hover:text-bone">
                {t.nav.community}
              </Link>
              <Link href={links.barcelona} className="inline-flex min-h-11 items-center hover:text-bone">
                {t.nav.barcelona}
              </Link>
            </nav>
            <ContactLink email={contactEmail} label={`${t.footer.contact}: ${contactEmail}`} />
          </div>
        ) : null}
        <nav
          aria-label={t.legal.nav.menu}
          className="flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6 text-xs uppercase tracking-[0.2em] text-mist"
        >
          <Link href={links.avisoLegal} className="inline-flex min-h-11 items-center hover:text-bone">
            {t.legal.nav.notice}
          </Link>
          <Link href={links.privacidad} className="inline-flex min-h-11 items-center hover:text-bone">
            {t.legal.nav.privacy}
          </Link>
          <Link href={links.cookies} className="inline-flex min-h-11 items-center hover:text-bone">
            {t.legal.nav.cookies}
          </Link>
          <Link href={links.condiciones} className="inline-flex min-h-11 items-center hover:text-bone">
            {t.legal.nav.terms}
          </Link>
          <CookieSettingsButton label={t.legal.nav.settings} />
        </nav>
      </div>
    </footer>
  );
}
