import type { SessionUser } from "@/lib/types";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitch } from "@/components/language-switch";
import { LogoutButton } from "@/components/logout-button";
import { NavBar } from "@/components/nav-bar";
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
  const publicLinks = [
    { href: `${links.home}${jump.home}`, label: t.nav.home },
    { href: `${links.home}${jump.operate}`, label: t.home.operateKicker },
    { href: `${links.home}${jump.offer}`, label: t.home.offerKicker },
    { href: `${links.home}${jump.how}`, label: t.nav.how },
    { href: `${links.home}${jump.join}`, label: t.enter.fresh },
    session
      ? { href: links.intranet, label: t.nav.intranet }
      : { href: links.entrar, label: t.nav.enter },
  ];
  const logoHref = links.home;

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
      <div className="mx-auto flex h-[5.75rem] max-w-7xl items-center gap-3 px-4 sm:px-6">
        <BrandLogo priority href={logoHref} />
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LanguageSwitch locale={locale} label={t.nav.language} />
          <NavBar locale={locale} menuLabel={t.nav.menu} links={publicLinks} />
        </div>
      </div>
    </header>
  );
}
