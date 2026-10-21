"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/types";
import {
  dayKey,
  monthCells,
  monthFromRides,
  ridesInMonth,
  ridesOnDay,
  shiftMonth,
  yearBounds,
} from "@/lib/ride-calendar";
import { memberStamp } from "@/lib/stamp";

export type RideView = {
  id: string;
  name: string;
  distanceM: number;
  elevationM: number;
  movingTimeS: number;
  startAt: string;
  summaryPolyline: string;
  stravaUrl: string;
};

const RideMap = dynamic(() => import("@/components/ride-map").then((mod) => mod.RideMap), {
  ssr: false,
});

function kmLabel(meters: number) {
  return `${(meters / 1000).toFixed(1)} km`;
}

function elevationLabel(meters: number) {
  return `${Math.round(meters)} m`;
}

function durationLabel(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours <= 0) return `${minutes} min`;
  return `${hours} h ${minutes} min`;
}

export function RiderRides({ rides, t }: { rides: RideView[]; t: Dictionary }) {
  const start = monthFromRides(rides);
  const [year, setYear] = useState(start.year);
  const [month, setMonth] = useState(start.month);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [openRideId, setOpenRideId] = useState("");

  const monthRides = useMemo(() => ridesInMonth(rides, year, month), [rides, year, month]);
  const cells = useMemo(() => monthCells(year, month), [year, month]);
  const dayRides = openDay ? ridesOnDay(rides, openDay) : [];
  const current = rides.find((ride) => ride.id === openRideId) ?? null;
  const totals = {
    distanceM: monthRides.reduce((sum, ride) => sum + ride.distanceM, 0),
    elevationM: monthRides.reduce((sum, ride) => sum + ride.elevationM, 0),
    movingTimeS: monthRides.reduce((sum, ride) => sum + ride.movingTimeS, 0),
  };

  const years = useMemo(() => {
    const bounds = yearBounds(rides);
    const from = Math.min(bounds.min, year);
    const to = Math.max(bounds.max, year);
    const list: number[] = [];
    for (let value = from; value <= to; value += 1) list.push(value);
    return list;
  }, [rides, year]);

  function jump(nextYear: number, nextMonth: number) {
    setYear(nextYear);
    setMonth(nextMonth);
    setOpenDay(null);
    setOpenRideId("");
  }

  function go(delta: number) {
    const next = shiftMonth(year, month, delta);
    jump(next.year, next.month);
  }

  function openDayKey(key: string) {
    const listed = ridesOnDay(rides, key);
    if (listed.length === 0) return;
    setOpenDay(key);
    setOpenRideId(listed[0]?.id ?? "");
  }

  return (
    <div className="mt-6 space-y-6">
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

      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-mist">
          {t.intranet.calendarSummary}
        </p>
        <dl className="mt-3 grid grid-cols-3 gap-4">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.18em] text-mist">
            {t.intranet.stravaKm}
          </dt>
          <dd className="display mt-1 text-3xl">{kmLabel(totals.distanceM)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.18em] text-mist">
            {t.intranet.stravaElevation}
          </dt>
          <dd className="display mt-1 text-3xl">{elevationLabel(totals.elevationM)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.18em] text-mist">
            {t.intranet.stravaTime}
          </dt>
          <dd className="display mt-1 text-3xl">{durationLabel(totals.movingTimeS)}</dd>
        </div>
      </dl>
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
              <div key={`empty-${index}`} className="min-h-14 border-b border-r border-line bg-rubber" />
            );
          }
          const key = dayKey(year, month, day);
          const listed = ridesOnDay(rides, key);
          const hasRides = listed.length > 0;
          const active = openDay === key;
          if (!hasRides) {
            return (
              <div
                key={key}
                className="flex min-h-14 flex-col items-center justify-center border-b border-r border-line bg-rubber text-sm text-mist"
              >
                {day}
              </div>
            );
          }
          return (
            <button
              key={key}
              type="button"
              onClick={() => openDayKey(key)}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 border-b border-r border-line text-sm ${
                active ? "bg-panel text-sodium" : "bg-rubber text-bone hover:bg-panel"
              }`}
            >
              <span className="font-semibold">{day}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-sodium" />
              {listed.length > 1 ? (
                <span className="text-[9px] uppercase tracking-[0.12em] text-mist">
                  {listed.length}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {dayRides.length > 1 ? (
        <ul className="divide-y divide-line border border-line">
          {dayRides.map((ride) => {
            const active = ride.id === current?.id;
            return (
              <li key={ride.id}>
                <button
                  type="button"
                  onClick={() => setOpenRideId(ride.id)}
                  className={`flex w-full flex-col gap-1 px-4 py-3 text-left ${
                    active ? "bg-panel" : "bg-rubber hover:bg-panel"
                  }`}
                >
                  <span className="text-sm text-bone">{ride.name}</span>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-mist">
                    {kmLabel(ride.distanceM)} · {elevationLabel(ride.elevationM)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {current ? (
        <article className="space-y-4 border border-line bg-rubber p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-mist">
                {current.startAt ? memberStamp(current.startAt) : ""}
              </p>
              <h3 className="mt-1 text-lg text-bone">{current.name}</h3>
              <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-mist">
                {kmLabel(current.distanceM)} · {elevationLabel(current.elevationM)} ·{" "}
                {durationLabel(current.movingTimeS)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpenRideId("");
                setOpenDay(null);
              }}
              className="text-[10px] uppercase tracking-[0.16em] text-mist hover:text-bone"
            >
              {t.intranet.calendarClose}
            </button>
          </div>
          {current.summaryPolyline ? (
            <RideMap polyline={current.summaryPolyline} />
          ) : (
            <p className="text-sm text-mist">{t.intranet.stravaNoPolyline}</p>
          )}
          {current.stravaUrl ? (
            <a
              href={current.stravaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-sodium"
            >
              {t.intranet.stravaOpen}
            </a>
          ) : null}
        </article>
      ) : rides.length === 0 ? (
        <p className="text-sm text-mist">{t.intranet.stravaEmpty}</p>
      ) : null}
    </div>
  );
}
