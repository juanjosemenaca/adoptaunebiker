import Image from "next/image";
import { publicMedia, type PublicMediaSlot } from "@/lib/public-media";

export function PublicPhoto({
  slot,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  alt,
}: {
  slot: PublicMediaSlot;
  className?: string;
  priority?: boolean;
  sizes?: string;
  alt?: string;
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
          alt={alt ?? media.alt}
          fill
          priority={priority}
          className={`object-cover ${className}`}
          sizes={sizes}
        />
      ) : null}
    </>
  );
}
