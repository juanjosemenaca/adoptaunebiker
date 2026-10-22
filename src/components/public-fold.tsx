"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function PublicFold({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  const root = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function sync() {
      if (root.current && window.location.hash === `#${id}`) {
        root.current.open = true;
      }
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [id]);

  return (
    <details
      id={id}
      ref={root}
      className="group scroll-mt-28 border-t border-line py-7 sm:py-9"
    >
      <summary className="cursor-pointer list-none marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--public-accent)]">
        <span className="flex items-center justify-between gap-4">
          <h2 className="display text-3xl text-bone sm:text-[2.5rem]">{title}</h2>
          <span className="text-2xl leading-none text-mist transition group-open:rotate-45">+</span>
        </span>
      </summary>
      {lead ? <p className="mt-5 max-w-2xl text-base leading-8 text-mist">{lead}</p> : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </details>
  );
}
