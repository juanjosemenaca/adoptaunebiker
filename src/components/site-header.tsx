import type { SessionUser } from "@/lib/types";
import { BrandLogo } from "@/components/brand-logo";
import { NavBar } from "@/components/nav-bar";
import { paths, publicSections } from "@/lib/paths";

export function SiteHeader({
  session,
  variant,
}: {
  session: SessionUser | null;
  variant: "public" | "intranet";
}) {
  const publicLinks = publicSections.map((section) => ({
    href: section.href,
    label: section.nav,
  }));
  const intranetLinks = [
    { href: paths.intranet, label: "Panel" },
    { href: paths.explorar, label: "Pelotón" },
    { href: paths.cuenta, label: "Tu plaza" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-asphalt/95 backdrop-blur-md">
      {variant === "intranet" ? (
        <p className="bg-volt px-4 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-bone">
          Intranet · {session?.name ?? "comunidad"}
        </p>
      ) : null}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <BrandLogo priority />
        <NavBar
          links={variant === "public" ? publicLinks : intranetLinks}
          cta={
            variant === "intranet"
              ? { href: paths.home, label: "Web pública" }
              : session
                ? { href: paths.intranet, label: "Intranet" }
                : { href: paths.entrar, label: "Entrar" }
          }
        />
      </div>
    </header>
  );
}
