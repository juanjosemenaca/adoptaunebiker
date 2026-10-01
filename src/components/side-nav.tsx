"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/types";
import { hrefs } from "@/lib/paths";

export type SideNavItem = { href: string; key: keyof Dictionary["nav"] };

const collapsedWidth = 44;

export function SideNav({
  locale,
  t,
  items,
  homeHref,
  storageKey,
}: {
  locale: string;
  t: Dictionary;
  items: SideNavItem[];
  homeHref: string;
  storageKey: string;
}) {
  const pathname = usePathname();
  const links = hrefs(locale);
  const measure = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [fitWidth, setFitWidth] = useState(collapsedWidth);

  const labels = [...items.map((item) => t.nav[item.key]), t.nav.publicSite];

  useEffect(() => {
    setOpen(window.localStorage.getItem(storageKey) === "open");
  }, [storageKey]);

  useLayoutEffect(() => {
    const node = measure.current;
    if (!node) return;
    setFitWidth(Math.ceil(node.scrollWidth));
  }, [labels.join("|")]);

  function toggle() {
    setOpen((value) => {
      const next = !value;
      window.localStorage.setItem(storageKey, next ? "open" : "closed");
      return next;
    });
  }

  function active(href: string) {
    if (href === homeHref) {
      return pathname === href || pathname === `${href}/`;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside
      className="relative h-full shrink-0 overflow-hidden border-r border-line bg-rubber"
      style={{ width: open ? fitWidth : collapsedWidth }}
    >
      <div
        ref={measure}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0 px-3 text-[11px] uppercase tracking-[0.16em]"
      >
        {labels.map((label) => (
          <div key={label} className="whitespace-nowrap">
            {label}
          </div>
        ))}
      </div>
      <nav className="flex h-full flex-col">
        <button
          type="button"
          className="grid h-10 w-full shrink-0 place-items-center border-b border-line text-bone"
          aria-expanded={open}
          aria-label={open ? t.nav.collapseMenu : t.nav.menu}
          onClick={toggle}
        >
          <span className="text-xs tracking-[0.16em]">{open ? "‹" : "›"}</span>
        </button>
        {items.map((item) => {
          const label = t.nav[item.key];
          return (
            <Link
              key={item.href}
              href={item.href}
              title={label}
              className={`px-3 py-2 uppercase tracking-[0.16em] whitespace-nowrap ${
                open ? "text-left text-[11px]" : "text-center text-[10px]"
              } ${active(item.href) ? "text-sodium" : "text-mist hover:text-bone"}`}
            >
              {open ? label : label.slice(0, 1)}
            </Link>
          );
        })}
        <Link
          href={links.home}
          title={t.nav.publicSite}
          className={`mt-auto px-3 py-2 uppercase tracking-[0.16em] whitespace-nowrap text-mist hover:text-bone ${
            open ? "text-left text-[11px]" : "text-center text-[10px]"
          }`}
        >
          {open ? t.nav.publicSite : t.nav.publicSite.slice(0, 1)}
        </Link>
      </nav>
    </aside>
  );
}
