import Image from "next/image";
import { publicMedia, type PublicMediaSlot } from "@/lib/public-media";

export function PublicPhoto({
  slot,
  className = "",
  priority = false,
}: {
  slot: PublicMediaSlot;
  className?: string;
  priority?: boolean;
}) {
  const media = publicMedia[slot];

  return (
    <>
      <div
        className="public-photo-slot absolute inset-0"
        data-public-photo={slot}
        aria-hidden
      />
      {media.src ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          className={`object-cover ${className}`}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      ) : null}
    </>
  );
}
