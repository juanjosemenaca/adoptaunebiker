import type { ReactNode } from "react";
import type { SessionUser } from "@/lib/types";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function AppShell({
  children,
  session,
  variant,
  locale,
  t,
}: {
  children: ReactNode;
  session: SessionUser | null;
  variant: "public" | "intranet" | "admin";
  locale: Locale;
  t: Dictionary;
}) {
  return (
    <div className="relative flex min-h-full flex-col">
      <div className="grain" aria-hidden />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-sodium focus:px-3 focus:py-2 focus:text-bone"
      >
        {t.nav.skip}
      </a>
      <SiteHeader session={session} variant={variant} locale={locale} t={t} />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter variant={variant} locale={locale} t={t} />
    </div>
  );
}
