"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../../public/logo.png";

type BrandLogoProps = {
  className?: string;
  size?: "header" | "footer";
  priority?: boolean;
  href?: string;
};

const sizes = {
  header: "h-10 w-[7.25rem] sm:h-12 sm:w-[10.75rem]",
  footer: "h-14 w-[10rem] sm:h-16 sm:w-[11.5rem]",
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
        const samePage = pathname === href || pathname === `${href}/`;
        if (!samePage) return;
        window.scrollTo(0, 0);
        if (window.location.hash) {
          history.replaceState(null, "", href);
        }
      }}
    >
      <Image
        src={logo}
        alt="Adopta un eBiker"
        fill
        sizes="200px"
        className="object-contain object-left"
        priority={priority}
      />
    </Link>
  );
}
