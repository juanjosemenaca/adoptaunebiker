import type { ReactNode } from "react";
import type { SessionUser } from "@/lib/types";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { SideNav } from "@/components/side-nav";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { adminNav, hrefs, intranetNav } from "@/lib/paths";

export function AppShell({
  children,
  session,
  variant,
  locale,
  t,
  locked = false,
}: {
  children: ReactNode;
  session: SessionUser | null;
  variant: "public" | "intranet" | "admin";
  locale: Locale;
  t: Dictionary;
  locked?: boolean;
}) {
  const links = hrefs(locale);
  const withSideNav = (variant === "admin" || variant === "intranet") && !locked;

  return (
    <div className={`relative flex flex-col ${withSideNav ? "h-dvh overflow-hidden" : "min-h-full"}`}>
      <div className="grain" aria-hidden />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-sodium focus:px-3 focus:py-2 focus:text-bone"
      >
        {t.nav.skip}
      </a>
      <SiteHeader session={session} variant={variant} locale={locale} t={t} />
      {withSideNav ? (
        <div className="flex min-h-0 flex-1 flex-row">
          <SideNav
            locale={locale}
            t={t}
            items={variant === "admin" ? adminNav(locale) : intranetNav(locale)}
            homeHref={variant === "admin" ? links.admin : links.intranet}
            storageKey={variant === "admin" ? "adopta.adminNav" : "adopta.intranetNav"}
          />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
            <main id="contenido" className="flex-1">
              {children}
            </main>
            <SiteFooter variant={variant} locale={locale} t={t} />
          </div>
        </div>
      ) : (
        <>
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <SiteFooter variant={variant} locale={locale} t={t} />
        </>
      )}
    </div>
  );
}
