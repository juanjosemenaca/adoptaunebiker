"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/types";
import {
  calendarYearBounds,
  currentCalendarMonth,
  dayKey,
  monthCells,
  ridesOnDay,
  shiftMonth,
  todayDayKey,
} from "@/lib/ride-calendar";
import { durationLabel, madridDayKey, rideStamp } from "@/lib/ride-helpers";
import type { GroupRide, RideMark } from "@/lib/types";
import { dateLocale } from "@/i18n/config";

const DOT: Record<RideMark, string> = {
  hosted: "bg-volt",
  joined: "bg-sodium",
  open: "bg-clay",
};

const MARK_ORDER: RideMark[] = ["hosted", "joined", "open"];

export type CalendarRideItem = GroupRide & { href: string; mark: RideMark };

type CalRide = CalendarRideItem & { startAt: string };

function markLabel(mark: RideMark, t: Dictionary) {
  if (mark === "hosted") return t.intranet.groupRides.markHosted;
  if (mark === "joined") return t.intranet.groupRides.markJoined;
  return t.intranet.groupRides.markOpen;
}

function DayNumber({
  day,
  isToday,
  todayLabel,
  className,
}: {
  day: number;
  isToday: boolean;
  todayLabel: string;
  className?: string;
}) {
  return (
    <span
      aria-current={isToday ? "date" : undefined}
      aria-label={isToday ? `${todayLabel} ${day}` : undefined}
      className={
        isToday
          ? "inline-flex h-8 w-8 items-center justify-center rounded-full bg-volt text-sm font-bold text-rubber"
          : className
      }
    >
      {day}
    </span>
  );
}

export function GroupRideCalendar({
  rides,
  locale,
  t,
  showLegend = true,
}: {
  rides: CalendarRideItem[];
  locale: string;
  t: Dictionary;
  showLegend?: boolean;
}) {
  const lang = dateLocale[locale as keyof typeof dateLocale] ?? locale;
  const items: CalRide[] = useMemo(
    () =>
      rides.map((ride) => ({
        ...ride,
        startAt: `${madridDayKey(ride.startsAt)}T12:00:00`,
      })),
    [rides],
  );
  const now = currentCalendarMonth();
  const todayKey = useMemo(() => todayDayKey(), []);
  const [year, setYear] = useState(now.year);
  const [month, setMonth] = useState(now.month);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const years = useMemo(() => {
    const bounds = calendarYearBounds(items);
    const list: number[] = [];
    for (let value = bounds.min; value <= bounds.max; value += 1) list.push(value);
    return list;
  }, [items]);
  const cells = monthCells(year, month);
  const dayRides = openDay ? ridesOnDay(items, openDay) : [];

  function go(delta: number) {
    const next = shiftMonth(year, month, delta);
    setYear(next.year);
    setMonth(next.month);
    setOpenDay(null);
  }

  function jump(nextYear: number, nextMonth: number) {
    setYear(nextYear);
    setMonth(nextMonth);
    setOpenDay(null);
  }

  return (
    <div className="space-y-6">
      {showLegend ? (
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.14em] text-mist">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-volt" />
            {t.intranet.groupRides.legendHosted}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sodium" />
            {t.intranet.groupRides.legendJoined}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-clay" />
            {t.intranet.groupRides.legendOpen}
          </li>
        </ul>
      ) : null}

      <div className="flex items-center justify-center gap-8">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={t.intranet.calendarPrev}
          className="px-3 text-2xl font-bold leading-none text-bone"
        >
          «
        </button>
        <div className="flex items-center gap-3">
          <select
            value={month}
            aria-label={t.intranet.calendarPickMonth}
            onChange={(event) => jump(year, Number(event.target.value))}
            className="border-0 bg-transparent py-1 text-sm text-bone"
          >
            {t.intranet.calendarMonths.map((label, index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={year}
            aria-label={t.intranet.calendarPickYear}
            onChange={(event) => jump(Number(event.target.value), month)}
            className="w-20 border-0 bg-transparent py-1 text-sm text-bone"
          >
            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={t.intranet.calendarNext}
          className="px-3 text-2xl font-bold leading-none text-bone"
        >
          »
        </button>
      </div>

      <div className="grid grid-cols-7 border-t border-l border-line">
        {t.intranet.calendarWeekdays.map((label, index) => (
          <p
            key={`${label}-${index}`}
            className="border-b border-r border-line bg-panel px-1 py-2 text-center text-[10px] uppercase tracking-[0.14em] text-mist"
          >
            {label}
          </p>
        ))}
        {cells.map((day, index) => {
          if (day === null) {
            return (
              <div key={`empty-${index}`} className="min-h-16 border-b border-r border-line bg-rubber" />
            );
          }
          const key = dayKey(year, month, day);
          const listed = ridesOnDay(items, key);
          const hasRides = listed.length > 0;
          const active = openDay === key;
          const isToday = key === todayKey;
          if (!hasRides) {
            return (
              <div
                key={key}
                className="flex min-h-16 flex-col items-center justify-center border-b border-r border-line bg-rubber text-sm text-mist"
              >
                <DayNumber day={day} isToday={isToday} todayLabel={t.intranet.calendarToday} />
              </div>
            );
          }
          const dots = MARK_ORDER.filter((mark) => listed.some((ride) => ride.mark === mark));
          return (
            <button
              key={key}
              type="button"
              onClick={() => setOpenDay(active ? null : key)}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 border-b border-r border-line text-sm ${
                active ? "bg-panel text-sodium" : "bg-rubber text-bone hover:bg-panel"
              }`}
            >
              <DayNumber
                day={day}
                isToday={isToday}
                todayLabel={t.intranet.calendarToday}
                className="font-semibold"
              />
              <span className="flex gap-0.5">
                {dots.map((mark) => (
                  <span key={mark} className={`h-1.5 w-1.5 rounded-full ${DOT[mark]}`} />
                ))}
              </span>
              {listed.length > 1 ? (
                <span className="text-[9px] uppercase tracking-[0.12em] text-mist">{listed.length}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {dayRides.length > 0 ? (
        <ul className="divide-y divide-line border border-line">
          {dayRides.map((ride) => (
            <li key={ride.id}>
              <Link
                href={ride.href}
                className="flex flex-col gap-1 bg-rubber px-4 py-3 hover:bg-panel sm:flex-row sm:items-center sm:justify-between"
              >
                <span>
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${DOT[ride.mark]}`} />
                    <span className="text-sm text-bone">{ride.title}</span>
                  </span>
                  <span className="mt-1 block text-[11px] uppercase tracking-[0.14em] text-mist">
                    {rideStamp(ride.startsAt, lang)} · {durationLabel(ride.durationMin)} · {ride.place}
                  </span>
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-mist">
                  {markLabel(ride.mark, t)} · {t.surfaces[ride.surface]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
