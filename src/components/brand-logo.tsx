"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BrandLogoProps = {
  className?: string;
  size?: "header" | "footer";
  priority?: boolean;
  href?: string;
};

const sizes = {
  header: "h-14 w-[7rem] sm:h-16 sm:w-[8.5rem]",
  footer: "h-[4.5rem] w-[8.5rem] sm:h-20 sm:w-[10.5rem]",
};

export function BrandLogo({
  className,
  size = "header",
  priority = false,
  href = "/",
}: BrandLogoProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`relative inline-block shrink-0 ${sizes[size]} ${className ?? ""}`}
      aria-label="Adopta un eBiker"
      onClick={() => {
        if (pathname === href) window.scrollTo(0, 0);
      }}
    >
      <Image
        src="/logo.png"
        alt="Adopta un eBiker"
        fill
        sizes="170px"
        className="object-contain object-left"
        priority={priority}
      />
    </Link>
  );
}
