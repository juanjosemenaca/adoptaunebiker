"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavLink = { href: string; label: string };

export function NavBar({
  links,
  cta,
}: {
  links: NavLink[];
  cta: { href: string; label: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function active(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/intranet") return pathname === "/intranet";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="relative flex items-center gap-3">
      <nav className="hidden items-center gap-4 text-[13px] uppercase tracking-[0.14em] text-mist xl:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={active(link.href) ? "text-sodium" : "hover:text-bone"}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Link
        href={cta.href}
        className="hidden border border-sodium bg-sodium px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-bone xl:inline-flex"
      >
        {cta.label}
      </Link>
      <button
        type="button"
        className="grid h-10 w-10 place-items-center border border-line text-bone xl:hidden"
        aria-expanded={open}
        aria-label="Abrir menú"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex flex-col gap-1.5">
          <span className="block h-px w-4 bg-bone" />
          <span className="block h-px w-4 bg-bone" />
          <span className="block h-px w-4 bg-bone" />
        </span>
      </button>
      {open ? (
        <div className="absolute top-full right-0 mt-2 w-56 border border-line bg-rubber p-3 xl:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-2 py-2 text-sm uppercase tracking-[0.16em] text-mist"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={cta.href}
            className="mt-2 block bg-sodium px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-bone"
            onClick={() => setOpen(false)}
          >
            {cta.label}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
