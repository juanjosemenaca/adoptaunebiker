"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { locales, localeLabel, localeName, type Locale } from "@/i18n/config";
import { stripLocale, withLocale } from "@/lib/paths";

export function LanguageSwitch({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const rest = stripLocale(pathname);
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    function sync() {
      setHash(window.location.hash);
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onPointer(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        className="inline-flex h-11 min-w-[5.75rem] items-center justify-center gap-2 border border-line px-3 text-bone"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        aria-label={`${label}: ${localeName[locale]}`}
        onClick={() => setOpen((value) => !value)}
      >
        <LocaleFlag locale={locale} />
        <span className="text-[11px] font-semibold tracking-[0.14em]">{localeLabel[locale]}</span>
        <span
          aria-hidden
          className={`text-[9px] text-mist transition ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      {open ? (
        <ul
          id={menuId}
          role="menu"
          className="absolute top-full right-0 z-40 mt-2 min-w-48 border border-line bg-rubber py-1"
        >
          {locales.map((item) => (
            <li key={item} role="none">
              <Link
                href={`${withLocale(item, rest)}${hash}`}
                hrefLang={item}
                role="menuitem"
                aria-current={item === locale ? "true" : undefined}
                className={`flex min-h-11 items-center gap-3 px-3 py-2.5 text-sm ${
                  item === locale
                    ? "bg-asphalt text-sodium"
                    : "text-bone hover:bg-asphalt"
                }`}
                onClick={() => setOpen(false)}
              >
                <LocaleFlag locale={item} />
                <span className="flex-1">{localeName[item]}</span>
                <span className="text-[10px] font-semibold tracking-[0.16em] text-mist">
                  {localeLabel[item]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function LocaleFlag({ locale }: { locale: Locale }) {
  return (
    <span className="block h-4 w-6 shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(28,24,20,0.18)]">
      <svg viewBox="0 0 24 16" className="h-full w-full" aria-hidden>
        {flagGraphic[locale]}
      </svg>
    </span>
  );
}

const flagGraphic: Record<Locale, ReactNode> = {
  es: (
    <>
      <rect width="24" height="16" fill="#aa151b" />
      <rect y="4" width="24" height="8" fill="#f1bf00" />
    </>
  ),
  ca: (
    <>
      <rect width="24" height="16" fill="#fcd116" />
      <rect y="1.78" width="24" height="1.78" fill="#da121a" />
      <rect y="5.33" width="24" height="1.78" fill="#da121a" />
      <rect y="8.89" width="24" height="1.78" fill="#da121a" />
      <rect y="12.44" width="24" height="1.78" fill="#da121a" />
    </>
  ),
  en: (
    <>
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="3.2" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#c8102e" strokeWidth="1.4" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5.2" />
      <path d="M12 0v16M0 8h24" stroke="#c8102e" strokeWidth="3" />
    </>
  ),
  fr: (
    <>
      <rect width="8" height="16" fill="#002395" />
      <rect x="8" width="8" height="16" fill="#fff" />
      <rect x="16" width="8" height="16" fill="#ed2939" />
    </>
  ),
  de: (
    <>
      <rect width="24" height="5.34" fill="#000" />
      <rect y="5.33" width="24" height="5.34" fill="#dd0000" />
      <rect y="10.66" width="24" height="5.34" fill="#ffce00" />
    </>
  ),
};
