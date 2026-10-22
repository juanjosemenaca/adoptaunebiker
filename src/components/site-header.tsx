import Link from "next/link";
import type { SessionUser } from "@/lib/types";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { BrandLogo } from "@/components/brand-logo";
import { HashLink } from "@/components/hash-link";
import { LanguageSwitch } from "@/components/language-switch";
import { LogoutButton } from "@/components/logout-button";
import { NavBar } from "@/components/nav-bar";
import { PublicCtaIcon } from "@/components/public-cta-icon";
import { analyticsEvents } from "@/lib/analytics";
import { anchors, hrefs } from "@/lib/paths";

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
  const publicLinks = [
    { href: `${links.home}${jump.home}`, label: t.nav.home },
    { href: `${links.home}${hrefByKey.how}`, label: t.nav.how },
    { href: `${links.home}${hrefByKey.community}`, label: t.nav.community },
    { href: `${links.home}${hrefByKey.beginner}`, label: t.nav.beginner },
    { href: `${links.home}${hrefByKey.veteran}`, label: t.nav.veteran },
    { href: `${links.home}${hrefByKey.code}`, label: t.nav.code },
    { href: `${links.home}${hrefByKey.faq}`, label: t.nav.faq },
  ];
  const logoHref = links.home;
  const joinHref = `${links.home}${jump.join}`;

  if (variant !== "public") {
    return (
      <header className="sticky top-0 z-50 shrink-0 border-b border-line bg-rubber">
        {variant === "admin" ? (
          <p className="flex h-7 items-center justify-center bg-[#c1121f] px-4 text-center text-[10px] font-black uppercase tracking-[0.22em] text-black">
            {t.nav.admin}
          </p>
        ) : null}
        <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6">
          <BrandLogo priority href={logoHref} />
          <div className="flex items-center gap-3">
            <LanguageSwitch locale={locale} label={t.nav.language} />
            <LogoutButton locale={locale} label={t.nav.logoff} />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-line bg-asphalt/92 backdrop-blur-md">
      <div className="mx-auto flex h-[5.25rem] max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-6">
        <BrandLogo priority href={logoHref} />
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-x-4 xl:flex">
          {publicLinks.map((link) => (
            <HashLink
              key={link.href}
              href={link.href}
              className="shrink-0 text-sm text-mist transition-colors hover:text-bone"
            >
              {link.label}
            </HashLink>
          ))}
        </nav>
        <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
          <LanguageSwitch locale={locale} label={t.nav.language} />
          {session ? (
            <>
              <Link href={links.intranet} className="public-cta max-w-[9rem] sm:max-w-none">
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
              <HashLink
                href={joinHref}
                eventName={analyticsEvents.signUpCtaClick}
                className="public-cta shrink-0 px-3 sm:px-5"
              >
                {t.home.ctaOutShort}
                <PublicCtaIcon />
              </HashLink>
              <NavBar
                locale={locale}
                menuLabel={t.nav.menu}
                menuOnly
                links={[...publicLinks, { href: links.entrar, label: t.nav.enter }]}
                cta={{ href: joinHref, label: t.home.ctaOut }}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
