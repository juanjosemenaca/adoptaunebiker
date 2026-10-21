import Link from "next/link";
import type { SessionUser } from "@/lib/types";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitch } from "@/components/language-switch";
import { LogoutButton } from "@/components/logout-button";
import { NavBar } from "@/components/nav-bar";
import { anchors, hrefs, publicSectionKeys } from "@/lib/paths";

export function SiteHeader({
  session,
  variant,
  locale,
  t,
}: {
  session: SessionUser | null;
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
  const publicLinks = publicSectionKeys.map((section) => ({
    href: `${links.home}${hrefByKey[section.key]}`,
    label: t.nav[section.key],
  }));
  const logoHref = links.home;

  return (
    <header
      className={`sticky top-0 z-30 shrink-0 border-b border-line ${
        variant === "public" ? "bg-asphalt/95 backdrop-blur-md" : "bg-rubber"
      }`}
    >
      {variant === "admin" ? (
        <p className="flex h-7 items-center justify-center bg-[#c1121f] px-4 text-center text-[10px] font-black uppercase tracking-[0.22em] text-black">
          {t.nav.admin}
        </p>
      ) : null}
      <div
        className={`flex h-20 items-center justify-between gap-4 px-4 sm:px-6 ${
          variant === "public" ? "mx-auto max-w-6xl" : ""
        }`}
      >
        <BrandLogo priority href={logoHref} />
        <div className="flex items-center gap-3">
          <LanguageSwitch locale={locale} label={t.nav.language} />
          {variant === "public" ? (
            session ? (
              <>
                <Link
                  href={links.intranet}
                  className="hidden min-h-11 items-center bg-sodium px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-bone sm:inline-flex lg:text-xs lg:tracking-[0.2em]"
                >
                  {t.home.ctaIn}
                </Link>
                <NavBar
                  locale={locale}
                  menuLabel={t.nav.menu}
                  menuOnly
                  links={publicLinks}
                  cta={{ href: links.intranet, label: t.home.ctaIn }}
                />
              </>
            ) : (
              <>
                <Link
                  href={links.entrar}
                  className="hidden min-h-11 items-center text-xs uppercase tracking-[0.2em] text-mist hover:text-bone sm:inline-flex"
                >
                  {t.nav.enter}
                </Link>
                <Link
                  href={`${links.home}${jump.join}`}
                  className="hidden min-h-11 items-center bg-sodium px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-bone sm:inline-flex lg:text-xs lg:tracking-[0.2em]"
                >
                  {t.home.ctaOut}
                </Link>
                <NavBar
                  locale={locale}
                  menuLabel={t.nav.menu}
                  menuOnly
                  links={[...publicLinks, { href: links.entrar, label: t.nav.enter }]}
                  cta={{ href: `${links.home}${jump.join}`, label: t.home.ctaOut }}
                />
              </>
            )
          ) : (
            <LogoutButton locale={locale} label={t.nav.logoff} />
          )}
        </div>
      </div>
    </header>
  );
}
