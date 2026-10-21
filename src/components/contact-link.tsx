"use client";

import { analyticsEvents, trackEvent } from "@/lib/analytics";

export function ContactLink({ email, label }: { email: string; label: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.2em] text-mist hover:text-bone"
      onClick={() => trackEvent(analyticsEvents.contactClick)}
    >
      {label}
    </a>
  );
}
