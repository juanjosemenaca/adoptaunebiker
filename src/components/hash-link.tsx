"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function HashLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (!href.startsWith("#")) return;
        event.preventDefault();
        history.replaceState(null, "", href);
        window.requestAnimationFrame(() => {
          document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
        });
      }}
    >
      {children}
    </Link>
  );
}
