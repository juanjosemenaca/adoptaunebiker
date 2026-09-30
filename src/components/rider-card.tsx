import Link from "next/link";
import type { Rider } from "@/lib/types";
import { disciplineLabel, roleLabel } from "@/lib/labels";
import { paths } from "@/lib/paths";

export function RiderCard({ rider }: { rider: Rider }) {
  const isMentor = rider.role === "mentor";

  return (
    <Link
      href={paths.rider(rider.slug)}
      className="group relative flex flex-col border border-line bg-rubber p-5 transition hover:border-bone/30"
    >
      <span
        className={`absolute top-0 left-0 h-full w-[3px] ${isMentor ? "bg-sodium" : "bg-volt"}`}
      />
      <div className="flex items-start justify-between gap-3">
        <p className="plate text-xs text-mist">{disciplineLabel[rider.discipline]}</p>
        <p
          className={`text-[10px] uppercase tracking-[0.22em] ${isMentor ? "text-sodium" : "text-volt"}`}
        >
          {roleLabel[rider.role]}
        </p>
      </div>
      <h2 className="display mt-6 text-4xl text-bone group-hover:text-sodium">
        {rider.name}
      </h2>
      <p className="mt-2 text-sm text-mist">
        {rider.city} · {rider.bike}
      </p>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-bone/80">
        {rider.bio}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {rider.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="border border-line px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-mist"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
