import type { ReactNode } from "react";
import type { SessionUser } from "@/lib/types";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function AppShell({
  children,
  session,
  variant,
}: {
  children: ReactNode;
  session: SessionUser | null;
  variant: "public" | "intranet";
}) {
  return (
    <div className="relative flex min-h-full flex-col">
      <div className="grain" aria-hidden />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-sodium focus:px-3 focus:py-2 focus:text-bone"
      >
        Saltar al contenido
      </a>
      <SiteHeader session={session} variant={variant} />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter variant={variant} />
    </div>
  );
}
