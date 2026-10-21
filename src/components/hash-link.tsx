"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

export function HashLink({
  href,
  className,
  children,
  eventName,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  eventName?: AnalyticsEvent;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (eventName) trackEvent(eventName);
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
