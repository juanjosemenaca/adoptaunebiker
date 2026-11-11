"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

export const rideActionClass =
  "inline-flex min-h-11 items-center justify-center bg-sodium px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone";

function askedTwice(first: string, again?: string) {
  if (!window.confirm(first)) return false;
  if (again && !window.confirm(again)) return false;
  return true;
}

export function ConfirmSubmit({
  message,
  again,
  className,
  href,
  disabled,
  children,
}: {
  message: string;
  again?: string;
  className?: string;
  href?: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  function confirm(event: MouseEvent) {
    if (disabled || !askedTwice(message, again)) event.preventDefault();
  }

  if (href) {
    return (
      <Link href={href} className={className} onClick={confirm} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  return (
    <button type="submit" className={className} disabled={disabled} onClick={confirm}>
      {children}
    </button>
  );
}
