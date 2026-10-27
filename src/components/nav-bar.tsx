"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";

type NavLink = { href: string; label: string };

export function NavBar({
  links,
  locale,
  menuLabel,
}: {
  links: NavLink[];
  locale: Locale;
  menuLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
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
    if (href === `${home}/intranet` || href === `${home}/entrar`) {
      return pathname === href || pathname.startsWith(`${href}/`);
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-bone"
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
      {open ? (
        <nav
          className="absolute top-full right-0 z-50 mt-2 w-80 border border-line bg-rubber p-4"
          aria-label={menuLabel}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex min-h-12 items-center px-2 py-2.5 text-base ${
                active(link.href) ? "text-bone" : "text-mist"
              }`}
              onClick={(event) => {
                const hashIndex = link.href.indexOf("#");
                if (hashIndex === -1) {
                  event.preventDefault();
                  setOpen(false);
                  router.push(link.href);
                  return;
                }
                const path = link.href.slice(0, hashIndex);
                const id = link.href.slice(hashIndex + 1);
                const samePage =
                  !path ||
                  path === pathname ||
                  path === `${pathname}/` ||
                  ((pathname === home || pathname === `${home}/`) && path === home);
                if (!samePage || !id || !document.getElementById(id)) {
                  event.preventDefault();
                  setOpen(false);
                  router.push(link.href);
                  return;
                }
                event.preventDefault();
                history.replaceState(null, "", `#${id}`);
                goTo(link.href);
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
