import type {
  Discipline,
  GroupRide,
  RideFilters,
  RideJoinStatus,
  RideLevel,
  RideMark,
  RideStatus,
  RideSurface,
} from "./types.ts";
import { RIDE_LEVELS, RIDE_SURFACES } from "./types.ts";
import { parseMapsPin, parseMeetingCoords, type MeetingPin } from "./meeting-pin.ts";
import { parseMemberBikes } from "./bikes.ts";

export const MADRID_TZ = "Europe/Madrid";

export const RIDE_DURATION_OPTIONS = [60, 90, 120, 150, 180, 210, 240, 300, 360, 420, 480] as const;
export const RIDE_PHOTO_MAX = 4;
export const TRACK_MAX_BYTES = 5 * 1024 * 1024;

export type RideDraft = {
  title: string;
  startsAt: string;
  durationMin: number;
  surface: RideSurface;
  hostBike: string;
  level: RideLevel;
  place: string;
  meetingPoint: string;
  meetingLat: number | null;
  meetingLng: number | null;
  notes: string;
  maxRiders: number | null;
  distanceKm: number | null;
  elevationM: number | null;
  routeUrl: string;
};

export type RideDraftError =
  | "title"
  | "start"
  | "duration"
  | "surface"
  | "hostBike"
  | "level"
  | "place"
  | "maxRiders"
  | "distance"
  | "elevation"
  | "routeUrl"
  | "meetingPin";

export type RideQuery = {
  from?: string | string[];
  to?: string | string[];
  modalidad?: string | string[];
  bici?: string | string[];
  ritmo?: string | string[];
  lugar?: string | string[];
  vista?: string | string[];
};

function oneQuery(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function isDiscipline(value: string): value is Discipline {
  return value === "mtb" || value === "carretera" || value === "gravel";
}

export function isRideSurface(value: string): value is RideSurface {
  return RIDE_SURFACES.includes(value as RideSurface);
}

export function isRideLevel(value: string): value is RideLevel {
  return RIDE_LEVELS.includes(value as RideLevel);
}

export function surfaceFromDiscipline(value: string): RideSurface {
  if (value === "carretera") return "asfalto";
  if (value === "mtb") return "tierra";
  if (value === "gravel") return "mixto";
  return isRideSurface(value) ? value : "mixto";
}

export function disciplineFromSurface(value: RideSurface): Discipline {
  if (value === "asfalto") return "carretera";
  if (value === "tierra") return "mtb";
  return "gravel";
}

export function legacyRideLevel(value: RideLevel) {
  return value === "dura" ? "media" : value;
}

export function isRideJoinStatus(value: string): value is RideJoinStatus {
  return value === "pending" || value === "accepted" || value === "declined" || value === "cancelled";
}

export function isRideStatus(value: string): value is RideStatus {
  return value === "open" || value === "cancelled";
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function madridDayKey(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MADRID_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function rideStamp(iso: string, locale: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    timeZone: MADRID_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function madridDateParts(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return { date: "", time: "" };
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: MADRID_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "08";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  return {
    date: madridDayKey(iso),
    time: `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`,
  };
}

export function canManageHostedRide(
  userId: string,
  ride: { hostId: string; status: RideStatus; startsAt?: string },
  now = new Date(),
) {
  if (ride.hostId !== userId || ride.status !== "open") return false;
  if (ride.startsAt && isRidePast(ride.startsAt, now)) return false;
  return true;
}

export function canCancelHostedRide(userId: string, ride: { hostId: string; status: RideStatus }) {
  return ride.hostId === userId && ride.status === "open";
}

export function canHardDeleteRide(userId: string, ride: { hostId: string; status: RideStatus }) {
  return ride.hostId === userId && ride.status === "cancelled";
}

export function canReuseRide(input: {
  userId: string;
  hostId: string;
  status: RideStatus;
  joinStatus: RideJoinStatus | null;
  startsAt: string;
  now?: Date;
}) {
  if (!canSeeRideChat(input.userId, input.hostId, input.joinStatus)) return false;
  return input.status === "cancelled" || isRidePast(input.startsAt, input.now);
}

export function canArchiveRide(input: {
  userId: string;
  hostId: string;
  status: RideStatus;
  joinStatus: RideJoinStatus | null;
  startsAt: string;
  now?: Date;
}) {
  if (input.status === "cancelled") return false;
  if (!canSeeRideChat(input.userId, input.hostId, input.joinStatus)) return false;
  return isRidePast(input.startsAt, input.now);
}

export function durationLabel(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours <= 0) return `${minutes} min`;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${rest} min`;
}

export function isRideFull(acceptedCount: number, maxRiders: number | null) {
  if (maxRiders == null) return false;
  return acceptedCount + 1 >= maxRiders;
}

export function rideMark(
  ride: { id: string; hostId: string },
  userId: string,
  joinedIds: Set<string>,
): RideMark {
  if (ride.hostId === userId) return "hosted";
  if (joinedIds.has(ride.id)) return "joined";
  return "open";
}

export function joinedRideIds(requests: Array<{ rideId: string; status: RideJoinStatus }>) {
  return new Set(
    requests.filter((item) => item.status === "accepted" || item.status === "pending").map((item) => item.rideId),
  );
}

export function canSeeRideChat(
  userId: string,
  hostId: string,
  joinStatus: RideJoinStatus | null,
) {
  return userId === hostId || joinStatus === "accepted";
}

export function canCommentOnRide(input: {
  userId: string;
  hostId: string;
  status: RideStatus;
  joinStatus: RideJoinStatus | null;
}) {
  if (input.status === "cancelled") return false;
  return canSeeRideChat(input.userId, input.hostId, input.joinStatus);
}

export function canAddRideAlbum(input: {
  userId: string;
  hostId: string;
  status: RideStatus;
  joinStatus: RideJoinStatus | null;
  startsAt: string;
  now?: Date;
}) {
  if (input.status === "cancelled") return false;
  if (!canSeeRideChat(input.userId, input.hostId, input.joinStatus)) return false;
  return isRidePast(input.startsAt, input.now);
}

export function canRequestRideSpot(input: {
  userId: string;
  hostId: string;
  status: RideStatus;
  joinStatus: RideJoinStatus | null;
  acceptedCount: number;
  maxRiders: number | null;
  startsAt: string;
  now?: Date;
}) {
  if (input.userId === input.hostId) return false;
  if (input.status !== "open") return false;
  if (input.joinStatus) return false;
  if (isRidePast(input.startsAt, input.now)) return false;
  if (isRideFull(input.acceptedCount, input.maxRiders)) return false;
  return true;
}

export function parseRideFilters(query: RideQuery): RideFilters {
  const from = oneQuery(query.from);
  const to = oneQuery(query.to);
  const surface = oneQuery(query.modalidad);
  const level = oneQuery(query.ritmo);
  const place = oneQuery(query.lugar);
  const filters: RideFilters = {};
  if (DATE_RE.test(from)) filters.from = from;
  if (DATE_RE.test(to)) filters.to = to;
  if (isRideSurface(surface)) filters.surface = surface;
  if (isRideLevel(level)) filters.level = level;
  if (place) filters.place = place;
  return filters;
}

export function parseRideView(query: RideQuery): "calendar" | "list" {
  return oneQuery(query.vista) === "lista" ? "list" : "calendar";
}

export function matchesRideFilters(
  ride: Pick<GroupRide, "startsAt" | "surface" | "level" | "place">,
  filters: RideFilters,
) {
  const day = madridDayKey(ride.startsAt);
  if (filters.from && day < filters.from) return false;
  if (filters.to && day > filters.to) return false;
  if (filters.surface && ride.surface !== filters.surface) return false;
  if (filters.level && ride.level !== filters.level) return false;
  if (filters.place && !ride.place.toLowerCase().includes(filters.place.toLowerCase())) {
    return false;
  }
  return true;
}

function parseStartsAt(rawIso: string, rawLocal: string, datePart = "", timePart = "") {
  const iso = rawIso.trim();
  if (iso) {
    const date = new Date(iso);
    if (!Number.isNaN(date.getTime())) return date;
  }
  const local = rawLocal.trim() || [datePart.trim(), timePart.trim()].filter(Boolean).join("T");
  if (!local) return null;
  const match = local.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return null;
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseOptionalInt(
  raw: string,
  min: number,
  max: number,
): { ok: true; value: number | null } | { ok: false } {
  const text = raw.trim();
  if (!text) return { ok: true, value: null };
  const value = Number(text);
  if (!Number.isInteger(value) || value < min || value > max) return { ok: false };
  return { ok: true, value };
}

export function parseRideLink(raw: string): { ok: true; url: string } | { ok: false } {
  const text = raw.trim();
  if (!text) return { ok: true, url: "" };
  if (text.length > 300) return { ok: false };
  try {
    const url = new URL(text);
    if (url.protocol !== "http:" && url.protocol !== "https:") return { ok: false };
    return { ok: true, url: url.toString() };
  } catch {
    return { ok: false };
  }
}

export function trackExt(mime: string, name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".gpx") || mime === "application/gpx+xml") return "gpx";
  if (lower.endsWith(".kml") || mime === "application/vnd.google-earth.kml+xml") return "kml";
  return "";
}

export function checkTrackFile(file: { type: string; size: number; name: string } | null | undefined) {
  if (!file || file.size < 1) return "missing" as const;
  if (!trackExt(file.type, file.name)) return "type" as const;
  if (file.size > TRACK_MAX_BYTES) return "size" as const;
  return null;
}

export function parseRideDraft(input: {
  title?: string;
  startsAtIso?: string;
  startsAt?: string;
  startDate?: string;
  startTime?: string;
  durationMin?: string;
  surface?: string;
  hostBike?: string;
  hostBikeNew?: string;
  level?: string;
  place?: string;
  meetingPoint?: string;
  meetingLat?: string;
  meetingLng?: string;
  meetingMaps?: string;
  notes?: string;
  maxRiders?: string;
  distanceKm?: string;
  elevationM?: string;
  routeUrl?: string;
}): { ok: true; draft: RideDraft } | { ok: false; error: RideDraftError } {
  const title = (input.title ?? "").trim();
  if (title.length < 3 || title.length > 80) return { ok: false, error: "title" };
  const start = parseStartsAt(
    input.startsAtIso ?? "",
    input.startsAt ?? "",
    input.startDate ?? "",
    input.startTime ?? "",
  );
  if (!start || start.getTime() < Date.now() - 60 * 60 * 1000) {
    return { ok: false, error: "start" };
  }
  const durationMin = Number(input.durationMin);
  if (!Number.isFinite(durationMin) || durationMin < 30 || durationMin > 1440) {
    return { ok: false, error: "duration" };
  }
  const surface = (input.surface ?? "").trim();
  if (!isRideSurface(surface)) return { ok: false, error: "surface" };
  const hostBike = parseMemberBikes([input.hostBikeNew ?? "", input.hostBike ?? ""])[0] ?? "";
  if (!hostBike) return { ok: false, error: "hostBike" };
  const level = (input.level ?? "").trim();
  if (!isRideLevel(level)) return { ok: false, error: "level" };
  const place = (input.place ?? "").trim();
  if (place.length < 2 || place.length > 80) return { ok: false, error: "place" };
  const maxRaw = (input.maxRiders ?? "").trim();
  let maxRiders: number | null = null;
  if (maxRaw) {
    const value = Number(maxRaw);
    if (!Number.isInteger(value) || value < 2 || value > 80) {
      return { ok: false, error: "maxRiders" };
    }
    maxRiders = value;
  }
  const distance = parseOptionalInt(input.distanceKm ?? "", 5, 400);
  if (!distance.ok) return { ok: false, error: "distance" };
  const elevation = parseOptionalInt(input.elevationM ?? "", 0, 8000);
  if (!elevation.ok) return { ok: false, error: "elevation" };
  const route = parseRideLink(input.routeUrl ?? "");
  if (!route.ok) return { ok: false, error: "routeUrl" };
  const mapsRaw = (input.meetingMaps ?? "").trim();
  let meetingPin: MeetingPin | null = parseMeetingCoords(input.meetingLat ?? "", input.meetingLng ?? "");
  if (!meetingPin && mapsRaw) {
    meetingPin = parseMapsPin(mapsRaw);
    if (!meetingPin) return { ok: false, error: "meetingPin" };
  }
  return {
    ok: true,
    draft: {
      title,
      startsAt: start.toISOString(),
      durationMin: Math.round(durationMin),
      surface,
      hostBike,
      level,
      place,
      meetingPoint: (input.meetingPoint ?? "").trim().slice(0, 120),
      meetingLat: meetingPin?.lat ?? null,
      meetingLng: meetingPin?.lng ?? null,
      notes: (input.notes ?? "").trim().slice(0, 1000),
      maxRiders,
      distanceKm: distance.value,
      elevationM: elevation.value,
      routeUrl: route.url,
    },
  };
}

export function isRidePast(iso: string, now = new Date()) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() < now.getTime();
}

export function isUpcomingRide(
  ride: { startsAt: string; status: RideStatus },
  now = new Date(),
) {
  return ride.status !== "cancelled" && !isRidePast(ride.startsAt, now);
}

export function splitUpcomingPast<T extends { startsAt: string; status: RideStatus }>(
  rides: T[],
  now = new Date(),
) {
  const upcoming: T[] = [];
  const past: T[] = [];
  for (const ride of rides) {
    if (isUpcomingRide(ride, now)) upcoming.push(ride);
    else past.push(ride);
  }
  upcoming.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  past.sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  return { upcoming, past };
}

export type RideHides = {
  dismissed: Set<string>;
  purged: Set<string>;
};

export function partitionMyRides<T extends { id: string; startsAt: string; status: RideStatus }>(
  hosted: T[],
  joined: Array<{ status: RideJoinStatus; ride: T | null }>,
  now = new Date(),
  hides: RideHides = { dismissed: new Set(), purged: new Set() },
) {
  const hidden = (id: string) => hides.purged.has(id) || hides.dismissed.has(id);
  const ridden = (ride: T) =>
    ride.status !== "cancelled" && isRidePast(ride.startsAt, now) && !hidden(ride.id);
  const hostedUpcoming = hosted
    .filter((ride) => isUpcomingRide(ride, now))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const withRide = joined.filter((item): item is typeof item & { ride: T } => Boolean(item.ride));
  const going = withRide
    .filter((item) => item.status === "accepted" && isUpcomingRide(item.ride, now))
    .map((item) => item.ride)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const pending = withRide
    .filter((item) => item.status === "pending" && isUpcomingRide(item.ride, now))
    .map((item) => item.ride)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const done = mergeRides(
    hosted.filter(ridden),
    withRide.filter((item) => item.status === "accepted" && ridden(item.ride)).map((item) => item.ride),
  );
  const mine = mergeRides(
    hosted,
    withRide.filter((item) => item.status === "accepted").map((item) => item.ride),
  );
  const removed = mine.filter(
    (ride) =>
      !hides.purged.has(ride.id) &&
      (ride.status === "cancelled" || hides.dismissed.has(ride.id)),
  );
  return { hostedUpcoming, going, pending, done, removed };
}

function mergeRides<T extends { id: string; startsAt: string }>(hosted: T[], joined: T[]) {
  const seen = new Set(hosted.map((ride) => ride.id));
  const rides = [...hosted];
  for (const ride of joined) {
    if (seen.has(ride.id)) continue;
    seen.add(ride.id);
    rides.push(ride);
  }
  return rides.sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}

export { isDiscipline };
