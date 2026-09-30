import Link from "next/link";
import { publicSections } from "@/lib/paths";

export function SectionIndex({ current }: { current: string }) {
  return (
    <ol className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
      {publicSections.map((section) => {
        const active = section.href === current;
        return (
          <li key={section.href}>
            <Link
              href={section.href}
              className={`block h-full p-5 ${active ? "bg-rubber" : "bg-asphalt hover:bg-rubber"}`}
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-mist">
                {section.n} · {section.kicker}
              </p>
              <p
                className={`display mt-3 text-2xl sm:text-3xl ${active ? "text-sodium" : "text-bone"}`}
              >
                {section.nav}
              </p>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
