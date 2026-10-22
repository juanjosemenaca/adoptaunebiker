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
        const id = href.includes("#") ? href.slice(href.indexOf("#") + 1) : "";
        if (!id || !document.getElementById(id)) return;
        event.preventDefault();
        history.replaceState(null, "", `#${id}`);
        window.requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        });
      }}
    >
      {children}
    </Link>
  );
}
