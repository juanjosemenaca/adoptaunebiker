export type CalendarRide = {
  id: string;
  startAt: string;
};

export function rideDayKey(iso: string) {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : "";
}

export function currentCalendarMonth(now = new Date()) {
  return { year: now.getFullYear(), month: now.getMonth() };
}

export function todayDayKey(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function calendarYearBounds(rides: CalendarRide[], now = new Date()) {
  const current = now.getFullYear();
  let min = current - 1;
  let max = current + 2;
  for (const ride of rides) {
    const year = Number(ride.startAt.slice(0, 4));
    if (!Number.isFinite(year)) continue;
    min = Math.min(min, year);
    max = Math.max(max, year);
  }
  return { min, max };
}

export function monthFromRides(rides: CalendarRide[]) {
  for (const ride of rides) {
    const match = ride.startAt.match(/^(\d{4})-(\d{2})/);
    if (match) return { year: Number(match[1]), month: Number(match[2]) - 1 };
  }
  return currentCalendarMonth();
}

export function yearBounds(rides: CalendarRide[]) {
  let min = 2026;
  let max = 2026;
  let found = false;
  for (const ride of rides) {
    const match = ride.startAt.match(/^(\d{4})/);
    if (!match) continue;
    const value = Number(match[1]);
    if (!found) {
      min = value;
      max = value;
      found = true;
      continue;
    }
    if (value < min) min = value;
    if (value > max) max = value;
  }
  return { min: min - 2, max: max + 2 };
}

export function monthHasRides(rides: CalendarRide[], year: number, month: number) {
  return ridesInMonth(rides, year, month).length > 0;
}

export function shiftMonth(year: number, month: number, delta: number) {
  const next = month + delta;
  if (next < 0) return { year: year - 1, month: 11 };
  if (next > 11) return { year: year + 1, month: 0 };
  return { year, month: next };
}

export function dayKey(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export function monthCells(year: number, month: number) {
  const pad = (new Date(year, month, 1).getDay() + 6) % 7;
  const last = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [];
  for (let i = 0; i < pad; i += 1) cells.push(null);
  for (let day = 1; day <= last; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function ridesOnDay<T extends CalendarRide>(rides: T[], key: string) {
  return rides.filter((ride) => rideDayKey(ride.startAt) === key);
}

export function ridesInMonth<T extends CalendarRide>(rides: T[], year: number, month: number) {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
  return rides.filter((ride) => ride.startAt.startsWith(prefix));
}
