import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { paths, publicSections } from "@/lib/paths";

export function SiteFooter({ variant }: { variant: "public" | "intranet" }) {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <BrandLogo size="footer" />
          <p className="display mt-5 text-4xl text-bone">No vas solo.</p>
          <p className="mt-2 max-w-sm text-sm text-mist">
            La misma pasión. Distintas bicicletas. Una sola comunidad. Aquí no
            hay tracks: hay gente.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-[0.2em] text-mist">
          {variant === "public"
            ? publicSections.map((section) => (
                <Link key={section.href} href={section.href} className="hover:text-bone">
                  {section.nav}
                </Link>
              ))
            : null}
          {variant === "intranet" ? (
            <>
              <Link href={paths.explorar} className="hover:text-bone">
                Pelotón
              </Link>
              <Link href={paths.cuenta} className="hover:text-bone">
                Tu plaza
              </Link>
            </>
          ) : null}
          <Link
            href={variant === "intranet" ? paths.home : paths.intranet}
            className="hover:text-bone"
          >
            {variant === "intranet" ? "Web pública" : "Intranet"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
