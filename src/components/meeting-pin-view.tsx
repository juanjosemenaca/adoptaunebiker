"use client";

import { googleMapsEmbedUrl, googleMapsOpenUrl, type MeetingPin } from "@/lib/meeting-pin";

export function MeetingPinView({
  pin,
  label,
  openLabel,
  locale,
}: {
  pin: MeetingPin | null;
  label: string;
  openLabel: string;
  locale: string;
}) {
  const embed = googleMapsEmbedUrl(pin, label, locale);
  const open = googleMapsOpenUrl(pin, label);
  if (!embed) return label ? <p className="mt-1 text-sm text-mist">{label}</p> : null;

  return (
    <div className="mt-4 space-y-3">
      {label ? <p className="text-sm text-mist">{label}</p> : null}
      <iframe
        title="Google Maps"
        src={embed}
        className="h-80 w-full border border-line bg-panel sm:h-96"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {open ? (
        <a
          href={open}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center text-sm text-sodium hover:text-bone"
        >
          {openLabel}
        </a>
      ) : null}
    </div>
  );
}
