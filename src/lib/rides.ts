import { logServerError } from "@/lib/log";
import { getAuthContext } from "@/lib/supabase/auth-context";
import type {
  GroupRide,
  RideFilters,
  RideJoinRequest,
  RideJoinStatus,
  RideMessage,
} from "@/lib/types";
import { checkAvatarFile, avatarExt } from "@/lib/avatar";
import { configuredSupabaseUrl } from "@/lib/supabase/env";
import {
  disciplineFromSurface,
  isRideJoinStatus,
  isRideLevel,
  isRideStatus,
  isRideSurface,
  legacyRideLevel,
  matchesRideFilters,
  RIDE_PHOTO_MAX,
  surfaceFromDiscipline,
  type RideDraft,
} from "@/lib/ride-helpers";

export {
  canManageHostedRide,
  canRequestRideSpot,
  canSeeRideChat,
  durationLabel,
  isRideFull,
  madridDateParts,
  madridDayKey,
  matchesRideFilters,
  parseRideDraft,
  parseRideFilters,
  parseRideView,
  rideStamp,
} from "@/lib/ride-helpers";
export type { RideDraft, RideDraftError, RideQuery } from "@/lib/ride-helpers";

const RIDE_COLUMNS_BASE =
  "id, host_id, title, starts_at, duration_min, discipline, bike_kind, level, place, meeting_point, notes, max_riders, status, created_at";
const RIDE_COLUMNS_EXTRA =
  "distance_km, elevation_m, route_url, surface, host_bike, photo_paths";
const RIDE_COLUMNS_PIN = "meeting_lat, meeting_lng";
let extraRideColumns = true;
let pinRideColumns = true;

function rideColumns() {
  const parts = [RIDE_COLUMNS_BASE];
  if (extraRideColumns) parts.push(RIDE_COLUMNS_EXTRA);
  if (pinRideColumns) parts.push(RIDE_COLUMNS_PIN);
  return parts.join(", ");
}

function missingRideColumns(error: { code?: string } | null) {
  if (error?.code !== "PGRST204" && error?.code !== "42703") return false;
  if (pinRideColumns) {
    pinRideColumns = false;
    return true;
  }
  if (extraRideColumns) {
    extraRideColumns = false;
    return true;
  }
  return false;
}

async function withRideColumnRetry<T>(run: () => PromiseLike<{ data: T; error: { code?: string } | null }>) {
  let result = await run();
  if (missingRideColumns(result.error)) result = await run();
  if (missingRideColumns(result.error)) result = await run();
  return result;
}

type HostEmbed = { display_name: string | null; slug: string | null };
type RiderEmbed = { display_name: string | null; slug: string | null };

type RideRow = {
  id: string;
  host_id: string;
  title: string;
  starts_at: string;
  duration_min: number;
  discipline: string;
  bike_kind: string;
  level: string;
  place: string;
  meeting_point: string | null;
  notes: string | null;
  max_riders: number | null;
  distance_km?: number | null;
  elevation_m?: number | null;
  route_url?: string | null;
  surface?: string | null;
  host_bike?: string | null;
  photo_paths?: string[] | null;
  meeting_lat?: number | null;
  meeting_lng?: number | null;
  status: string;
  created_at: string;
  host?: HostEmbed | HostEmbed[] | null;
  signups?: Array<{ id: string; status: string }> | null;
};

type JoinRow = {
  id: string;
  ride_id: string;
  rider_id: string;
  message: string | null;
  status: string;
  created_at: string;
  rider?: RiderEmbed | RiderEmbed[] | null;
  ride?: RideRow | RideRow[] | null;
};

type MessageRow = {
  id: string;
  ride_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author?: HostEmbed | HostEmbed[] | null;
};

function oneEmbed<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function ridePhotoUrl(path: string) {
  const base = configuredSupabaseUrl().replace(/\/$/, "");
  const clean = path.replace(/^\/+/, "");
  return clean && base ? `${base}/storage/v1/object/public/ride-photos/${clean}` : "";
}

function asCoord(value: unknown) {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(n) ? n : null;
}

function mappedLevel(value: string): "suave" | "dura" | "exigente" {
  const level = value === "media" ? "dura" : value;
  return isRideLevel(level) ? level : "dura";
}

function mapRide(row: RideRow): GroupRide {
  const host = oneEmbed(row.host);
  const signups = row.signups ?? [];
  const surfaceRaw = row.surface ?? "";
  return {
    id: row.id,
    hostId: row.host_id,
    hostName: host?.display_name ?? "",
    hostSlug: host?.slug ?? "",
    title: row.title,
    startsAt: row.starts_at,
    durationMin: row.duration_min,
    surface: isRideSurface(surfaceRaw) ? surfaceRaw : surfaceFromDiscipline(row.discipline),
    hostBike: (row.host_bike ?? "").trim(),
    level: mappedLevel(row.level),
    place: row.place,
    meetingPoint: row.meeting_point ?? "",
    meetingLat: asCoord(row.meeting_lat),
    meetingLng: asCoord(row.meeting_lng),
    notes: row.notes ?? "",
    maxRiders: row.max_riders,
    distanceKm: row.distance_km ?? null,
    elevationM: row.elevation_m ?? null,
    routeUrl: (row.route_url ?? "").trim(),
    photoUrls: (row.photo_paths ?? []).map(ridePhotoUrl).filter(Boolean),
    status: isRideStatus(row.status) ? row.status : "open",
    createdAt: row.created_at,
    acceptedCount: signups.filter((item) => item.status === "accepted").length,
  };
}

function mapJoin(row: JoinRow): RideJoinRequest {
  const rider = oneEmbed(row.rider);
  return {
    id: row.id,
    rideId: row.ride_id,
    riderId: row.rider_id,
    riderName: rider?.display_name ?? "",
    riderSlug: rider?.slug ?? "",
    message: row.message ?? "",
    status: isRideJoinStatus(row.status) ? row.status : "pending",
    createdAt: row.created_at,
  };
}

function mapMessage(row: MessageRow): RideMessage {
  const author = oneEmbed(row.author);
  return {
    id: row.id,
    rideId: row.ride_id,
    authorId: row.author_id,
    authorName: author?.display_name ?? "",
    body: row.body,
    createdAt: row.created_at,
  };
}

function rideSelect() {
  return `${rideColumns()}, host:profiles!rides_host_id_fkey ( display_name, slug ), signups:ride_join_requests ( id, status )`;
}

async function memberClient() {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) return null;
  return { supabase, user };
}

function rideQueryFailed(label: string, error: { code?: string; message?: string } | null) {
  if (!error) return;
  if (error.code === "42P01" || error.code === "PGRST205") return;
  logServerError(label, error);
}

export async function listOpenRides(filters: RideFilters = {}): Promise<GroupRide[]> {
  const auth = await memberClient();
  if (!auth) return [];
  const run = () => {
    let query = auth.supabase
      .from("rides")
      .select(rideSelect())
      .eq("status", "open")
      .order("starts_at", { ascending: true });
    if (filters.place) query = query.ilike("place", `%${filters.place}%`);
    return query;
  };
  const { data, error } = await withRideColumnRetry(run);
  if (error) {
    rideQueryFailed("[listOpenRides]", error);
    return [];
  }
  return ((data ?? []) as unknown as RideRow[])
    .map(mapRide)
    .filter((ride) => matchesRideFilters(ride, filters));
}

export async function countOpenRides() {
  const rides = await listOpenRides();
  return rides.length;
}

export async function listHostedRides(hostId: string, upcoming = false): Promise<GroupRide[]> {
  const auth = await memberClient();
  if (!auth) return [];
  const run = () => {
    let query = auth.supabase
      .from("rides")
      .select(rideSelect())
      .eq("host_id", hostId)
      .order("starts_at", { ascending: true });
    if (upcoming) {
      query = query.eq("status", "open").gte("starts_at", new Date().toISOString());
    }
    return query;
  };
  const { data, error } = await withRideColumnRetry(run);
  if (error) {
    rideQueryFailed("[listHostedRides]", error);
    return [];
  }
  return ((data ?? []) as unknown as RideRow[]).map(mapRide);
}

export async function getRide(id: string): Promise<GroupRide | null> {
  const auth = await memberClient();
  if (!auth || !id) return null;
  const { data, error } = await withRideColumnRetry(() =>
    auth.supabase.from("rides").select(rideSelect()).eq("id", id).maybeSingle(),
  );
  if (error) {
    rideQueryFailed("[getRide]", error);
    return null;
  }
  return data ? mapRide(data as unknown as RideRow) : null;
}

export async function listRideJoinRequests(rideId: string): Promise<RideJoinRequest[]> {
  const auth = await memberClient();
  if (!auth || !rideId) return [];
  const { data, error } = await auth.supabase
    .from("ride_join_requests")
    .select(
      "id, ride_id, rider_id, message, status, created_at, rider:profiles!ride_join_requests_rider_id_fkey ( display_name, slug )",
    )
    .eq("ride_id", rideId)
    .order("created_at", { ascending: true });
  if (error) {
    rideQueryFailed("[listRideJoinRequests]", error);
    return [];
  }
  return ((data ?? []) as JoinRow[]).map(mapJoin);
}

export async function getMyRideRequest(rideId: string, riderId: string) {
  const requests = await listRideJoinRequests(rideId);
  return requests.find((item) => item.riderId === riderId) ?? null;
}

export async function listMyJoinRequests(riderId: string): Promise<Array<RideJoinRequest & { ride: GroupRide | null }>> {
  const auth = await memberClient();
  if (!auth) return [];
  const joinSelect = () =>
    `id, ride_id, rider_id, message, status, created_at,
       rider:profiles!ride_join_requests_rider_id_fkey ( display_name, slug ),
       ride:rides!ride_join_requests_ride_id_fkey ( ${rideColumns()}, host:profiles!rides_host_id_fkey ( display_name, slug ), signups:ride_join_requests ( id, status ) )`;
  const { data, error } = await withRideColumnRetry(() =>
    auth.supabase
      .from("ride_join_requests")
      .select(joinSelect())
      .eq("rider_id", riderId)
      .order("created_at", { ascending: false }),
  );
  if (error) {
    rideQueryFailed("[listMyJoinRequests]", error);
    return [];
  }
  return ((data ?? []) as unknown as JoinRow[]).map((row) => {
    const rideRow = oneEmbed(row.ride);
    return {
      ...mapJoin(row),
      ride: rideRow ? mapRide(rideRow) : null,
    };
  });
}

export async function countPendingForHost(hostId: string) {
  const hosted = await listHostedRides(hostId);
  const openIds = hosted.filter((ride) => ride.status === "open").map((ride) => ride.id);
  if (openIds.length === 0) return 0;
  const auth = await memberClient();
  if (!auth) return 0;
  const { data, error } = await auth.supabase
    .from("ride_join_requests")
    .select("id")
    .in("ride_id", openIds)
    .eq("status", "pending");
  if (error) {
    rideQueryFailed("[countPendingForHost]", error);
    return 0;
  }
  return data?.length ?? 0;
}

export async function listRideMessages(rideId: string): Promise<RideMessage[]> {
  const auth = await memberClient();
  if (!auth || !rideId) return [];
  const { data, error } = await auth.supabase
    .from("ride_messages")
    .select(
      "id, ride_id, author_id, body, created_at, author:profiles!ride_messages_author_id_fkey ( display_name, slug )",
    )
    .eq("ride_id", rideId)
    .order("created_at", { ascending: true });
  if (error) {
    rideQueryFailed("[listRideMessages]", error);
    return [];
  }
  return ((data ?? []) as MessageRow[]).map(mapMessage);
}

export async function insertRide(hostId: string, draft: RideDraft) {
  const auth = await memberClient();
  if (!auth) throw new Error("ride");
  const base = {
    host_id: hostId,
    title: draft.title,
    starts_at: draft.startsAt,
    duration_min: draft.durationMin,
    discipline: disciplineFromSurface(draft.surface),
    bike_kind: "mixto",
    level: legacyRideLevel(draft.level),
    place: draft.place,
    meeting_point: draft.meetingPoint,
    notes: draft.notes,
    max_riders: draft.maxRiders,
    status: "open",
  };
  const withExtra = {
    ...base,
    level: draft.level,
    surface: draft.surface,
    host_bike: draft.hostBike,
    distance_km: draft.distanceKm,
    elevation_m: draft.elevationM,
    route_url: draft.routeUrl,
    photo_paths: [] as string[],
  };
  const withPin = {
    ...withExtra,
    meeting_lat: draft.meetingLat,
    meeting_lng: draft.meetingLng,
  };
  let { data, error } = await auth.supabase.from("rides").insert(withPin).select("id").single();
  if (missingRideColumns(error)) {
    ({ data, error } = await auth.supabase.from("rides").insert(withExtra).select("id").single());
  }
  if (missingRideColumns(error)) {
    ({ data, error } = await auth.supabase.from("rides").insert(base).select("id").single());
  }
  if (error || !data) {
    logServerError("[insertRide]", error);
    throw new Error("ride");
  }
  return data.id as string;
}

export async function saveRidePhotos(rideId: string, hostId: string, files: File[]) {
  const auth = await memberClient();
  if (!auth || files.length === 0) return;
  const paths: string[] = [];
  for (const file of files.slice(0, RIDE_PHOTO_MAX)) {
    if (checkAvatarFile(file)) continue;
    const ext = avatarExt(file.type, file.name) || "jpg";
    const path = `${hostId}/${rideId}/${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await auth.supabase.storage.from("ride-photos").upload(path, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
    if (error) {
      logServerError("[saveRidePhotos]", error);
      continue;
    }
    paths.push(path);
  }
  if (paths.length === 0) return;
  const { error } = await auth.supabase.from("rides").update({ photo_paths: paths }).eq("id", rideId).eq("host_id", hostId);
  if (error) logServerError("[saveRidePhotos]", error);
}

export async function updateRideRecord(rideId: string, hostId: string, draft: RideDraft) {
  const auth = await memberClient();
  if (!auth) throw new Error("ride");
  const base = {
    title: draft.title,
    starts_at: draft.startsAt,
    duration_min: draft.durationMin,
    discipline: disciplineFromSurface(draft.surface),
    bike_kind: "mixto",
    level: legacyRideLevel(draft.level),
    place: draft.place,
    meeting_point: draft.meetingPoint,
    notes: draft.notes,
    max_riders: draft.maxRiders,
  };
  const withExtra = {
    ...base,
    level: draft.level,
    surface: draft.surface,
    host_bike: draft.hostBike,
    distance_km: draft.distanceKm,
    elevation_m: draft.elevationM,
    route_url: draft.routeUrl,
  };
  const withPin = {
    ...withExtra,
    meeting_lat: draft.meetingLat,
    meeting_lng: draft.meetingLng,
  };
  let { error } = await auth.supabase
    .from("rides")
    .update(withPin)
    .eq("id", rideId)
    .eq("host_id", hostId)
    .eq("status", "open");
  if (missingRideColumns(error)) {
    ({ error } = await auth.supabase
      .from("rides")
      .update(withExtra)
      .eq("id", rideId)
      .eq("host_id", hostId)
      .eq("status", "open"));
  }
  if (missingRideColumns(error)) {
    ({ error } = await auth.supabase
      .from("rides")
      .update(base)
      .eq("id", rideId)
      .eq("host_id", hostId)
      .eq("status", "open"));
  }
  if (error) {
    logServerError("[updateRideRecord]", error);
    throw new Error("ride");
  }
}

export async function cancelRideRecord(rideId: string, hostId: string) {
  const auth = await memberClient();
  if (!auth) throw new Error("ride");
  const { error } = await auth.supabase
    .from("rides")
    .update({ status: "cancelled" })
    .eq("id", rideId)
    .eq("host_id", hostId)
    .eq("status", "open");
  if (error) {
    logServerError("[cancelRideRecord]", error);
    throw new Error("ride");
  }
}

export async function insertJoinRequest(rideId: string, riderId: string, message: string) {
  const auth = await memberClient();
  if (!auth) throw new Error("ride");
  const { error } = await auth.supabase.from("ride_join_requests").insert({
    ride_id: rideId,
    rider_id: riderId,
    message: message.slice(0, 280),
    status: "pending",
  });
  if (error) {
    logServerError("[insertJoinRequest]", error);
    if (error.code === "23505") throw new Error("rideExists");
    throw new Error("ride");
  }
}

export async function updateJoinRequestStatus(
  requestId: string,
  status: Extract<RideJoinStatus, "accepted" | "declined" | "cancelled">,
) {
  const auth = await memberClient();
  if (!auth) throw new Error("ride");
  const { error } = await auth.supabase
    .from("ride_join_requests")
    .update({ status })
    .eq("id", requestId);
  if (error) {
    logServerError("[updateJoinRequestStatus]", error);
    throw new Error("ride");
  }
}

export async function insertRideMessage(rideId: string, authorId: string, body: string) {
  const auth = await memberClient();
  if (!auth) throw new Error("ride");
  const text = body.trim();
  if (!text) throw new Error("rideChat");
  const { error } = await auth.supabase.from("ride_messages").insert({
    ride_id: rideId,
    author_id: authorId,
    body: text.slice(0, 2000),
  });
  if (error) {
    logServerError("[insertRideMessage]", error);
    throw new Error("rideChat");
  }
}

