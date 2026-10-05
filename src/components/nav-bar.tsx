"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";

type NavLink = { href: string; label: string };

export function NavBar({
  links,
  cta,
  locale,
  menuLabel,
  menuOnly = false,
}: {
  links: NavLink[];
  cta: { href: string; label: string };
  locale: Locale;
  menuLabel: string;
  menuOnly?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");
  const home = `/${locale}`;

  useEffect(() => {
    setOpen(false);
    function sync() {
      setHash(window.location.hash);
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  function hashId(href: string) {
    const index = href.indexOf("#");
    return index >= 0 ? href.slice(index + 1) : "";
  }

  function goTo(href: string) {
    setOpen(false);
    const id = hashId(href);
    if (id && document.getElementById(id)) {
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setHash(`#${id}`);
      });
    }
  }

  function active(href: string) {
    if (!href) return false;
    const id = hashId(href);
    if (id) {
      if (hash === `#${id}`) return true;
      return id === "inicio" && hash === "" && (pathname === home || pathname === `${home}/`);
    }
    if (href === home) return pathname === home || pathname === `${home}/`;
    if (href === `${home}/admin`) {
      return pathname === href || pathname === `${href}/`;
    }
    if (href === `${home}/intranet` || href === `${home}/entrar`) {
      return pathname === href || pathname.startsWith(`${href}/`);
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const menu = (
    <div className={`absolute top-full right-0 z-40 mt-2 w-72 border border-line bg-rubber p-3 ${menuOnly ? "" : "xl:hidden"}`}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex min-h-11 items-center px-2 py-2 text-sm tracking-[0.08em] ${
            active(link.href) ? "text-sodium" : "text-mist"
          }`}
          onClick={(event) => {
            const id = hashId(link.href);
            if (!id || !document.getElementById(id)) return;
            event.preventDefault();
            history.replaceState(null, "", `#${id}`);
            goTo(link.href);
          }}
        >
          {link.label}
        </Link>
      ))}
      <Link
        href={cta.href}
        className="mt-2 flex min-h-11 items-center justify-center bg-sodium px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-bone"
        onClick={(event) => {
          const id = hashId(cta.href);
          if (!id || !document.getElementById(id)) return;
          event.preventDefault();
          history.replaceState(null, "", `#${id}`);
          goTo(cta.href);
        }}
      >
        {cta.label}
      </Link>
    </div>
  );

  return (
    <div className="relative flex items-center gap-3">
      {menuOnly ? null : (
        <>
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
        </>
      )}
      <button
        type="button"
        className={`grid h-11 w-11 place-items-center border border-line text-bone ${menuOnly ? "" : "xl:hidden"}`}
        aria-expanded={open}
        aria-label={menuLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex flex-col gap-1.5">
          <span className="block h-px w-4 bg-bone" />
          <span className="block h-px w-4 bg-bone" />
          <span className="block h-px w-4 bg-bone" />
        </span>
      </button>
      {open ? menu : null}
    </div>
  );
}
