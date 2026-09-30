"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BrandLogoProps = {
  className?: string;
  size?: "header" | "footer";
  priority?: boolean;
};

const sizes = {
  header: "h-12 w-24 sm:h-14 sm:w-[7.5rem]",
  footer: "h-16 w-32 sm:h-[4.5rem] sm:w-36",
};

export function BrandLogo({
  className,
  size = "header",
  priority = false,
}: BrandLogoProps) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      className={`relative inline-block shrink-0 ${sizes[size]} ${className ?? ""}`}
      aria-label="Adopta un eBiker, ir al inicio"
      onClick={() => {
        if (pathname === "/") window.scrollTo(0, 0);
      }}
    >
      <Image
        src="/logo.png"
        alt="Adopta un eBiker"
        fill
        sizes="120px"
        className="object-contain object-left"
        priority={priority}
      />
    </Link>
  );
}
