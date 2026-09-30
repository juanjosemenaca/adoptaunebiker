import type { Qa } from "@/i18n/types";

export function Faq({ items }: { items: readonly Qa[] }) {
  return (
    <dl className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="cursor-pointer list-none text-base font-medium text-bone marker:content-none">
            <span className="flex items-start justify-between gap-4">
              {item.q}
              <span className="text-sodium group-open:rotate-45">+</span>
            </span>
          </summary>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-mist">{item.a}</p>
        </details>
      ))}
    </dl>
  );
}
