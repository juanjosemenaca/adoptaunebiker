import type { SessionUser } from "@/lib/types";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitch } from "@/components/language-switch";
import { LogoutButton } from "@/components/logout-button";
import { NavBar } from "@/components/nav-bar";
import { anchors, hrefs, publicSectionKeys } from "@/lib/paths";

export function SiteHeader({
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
  const logoHref =
    variant === "public" ? jump.home : variant === "admin" ? links.admin : links.intranet;

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
            <NavBar
              locale={locale}
              menuLabel={t.nav.menu}
              menuOnly
              links={publicLinks}
              cta={{ href: links.entrar, label: t.nav.enter }}
            />
          ) : (
            <LogoutButton locale={locale} label={t.nav.logoff} />
          )}
        </div>
      </div>
    </header>
  );
}
