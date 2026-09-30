import type { SessionUser } from "@/lib/types";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitch } from "@/components/language-switch";
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
  const intranetLinks = [
    { href: links.intranet, label: t.nav.panel },
    { href: links.explorar, label: t.nav.peloton },
    { href: links.cuenta, label: t.nav.account },
  ];
  const adminLinks = [{ href: links.admin, label: t.nav.requests }];
  const menuLinks =
    variant === "public" ? publicLinks : variant === "admin" ? adminLinks : intranetLinks;
  const loggedCta =
    session?.kind === "admin"
      ? { href: links.admin, label: t.nav.admin }
      : { href: links.intranet, label: t.nav.intranet };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-asphalt/95 backdrop-blur-md">
      {variant === "intranet" || variant === "admin" ? (
        <p className="bg-volt px-4 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-bone">
          {variant === "admin"
            ? t.nav.admin
            : `${t.nav.intranet} · ${session?.name ?? t.nav.community}`}
        </p>
      ) : null}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <BrandLogo priority href={variant === "public" ? jump.home : links.home} />
        <div className="flex items-center gap-3">
          <LanguageSwitch locale={locale} label={t.nav.language} />
          <NavBar
            locale={locale}
            menuLabel={t.nav.menu}
            menuOnly={variant === "public"}
            links={menuLinks}
            cta={
              variant === "intranet" || variant === "admin"
                ? { href: links.home, label: t.nav.publicSite }
                : session
                  ? loggedCta
                  : { href: links.entrar, label: t.nav.enter }
            }
          />
        </div>
      </div>
    </header>
  );
}
