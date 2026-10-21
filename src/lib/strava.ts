import { defaultLocale, isLocale } from "@/i18n/config";
import { hrefs, loginHref } from "@/lib/paths";
import { getAuthContext } from "@/lib/supabase/auth-context";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const BIKE_SPORTS = new Set([
  "Ride",
  "EBikeRide",
  "EMountainBikeRide",
  "GravelRide",
  "MountainBikeRide",
  "VirtualRide",
  "Handcycle",
  "Velomobile",
]);

export type StravaStatus = {
  athleteId: number;
  athleteName: string;
  syncedAt: string;
};

export type StravaRide = {
  id: string;
  name: string;
  sportType: string;
  distanceM: number;
  elevationM: number;
  movingTimeS: number;
  startAt: string;
  summaryPolyline: string;
  stravaUrl: string;
  private: boolean;
};

type StravaAccountRow = {
  member_id: string;
  athlete_id: number;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  athlete_name: string | null;
  connected_at: string;
  synced_at: string | null;
};

type ActivityRow = {
  id: number | string;
  name: string | null;
  sport_type: string | null;
  distance_m: number | string | null;
  elevation_m: number | string | null;
  moving_time_s: number | null;
  start_at: string | null;
  summary_polyline: string | null;
  strava_url: string | null;
  private: boolean | null;
};

type StravaTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  athlete?: { id?: number; firstname?: string; lastname?: string };
};

type StravaActivityResponse = {
  id?: number;
  name?: string;
  sport_type?: string;
  type?: string;
  distance?: number;
  total_elevation_gain?: number;
  moving_time?: number;
  start_date?: string;
  private?: boolean;
  map?: { summary_polyline?: string | null };
};

export function hasStravaConfig() {
  return Boolean(stravaClientId() && stravaClientSecret());
}

export function stravaCallbackPath() {
  return "/api/strava/callback";
}

export function stravaConnectHref(locale: string) {
  const lang = isLocale(locale) ? locale : defaultLocale;
  return `/api/strava/connect?locale=${lang}`;
}

export function stravaCuentaRedirect(locale: string, flag: string) {
  const lang = isLocale(locale) ? locale : defaultLocale;
  return `${hrefs(lang).cuenta}?strava=${flag}`;
}

export function stravaLoginRedirect(locale: string) {
  const lang = isLocale(locale) ? locale : defaultLocale;
  return loginHref(lang, stravaConnectHref(lang));
}

function stravaClientId() {
  return process.env.STRAVA_CLIENT_ID?.trim() ?? "";
}

function stravaClientSecret() {
  return process.env.STRAVA_CLIENT_SECRET?.trim() ?? "";
}

export function stravaAuthorizeUrl(origin: string, state: string) {
  const params = new URLSearchParams({
    client_id: stravaClientId(),
    response_type: "code",
    redirect_uri: `${origin}${stravaCallbackPath()}`,
    approval_prompt: "force",
    scope: "read,activity:read",
    state,
  });
  return `https://www.strava.com/oauth/authorize?${params.toString()}`;
}

function athleteName(athlete: StravaTokenResponse["athlete"]) {
  return [athlete?.firstname, athlete?.lastname].filter(Boolean).join(" ").trim();
}

function toRide(row: ActivityRow): StravaRide {
  return {
    id: String(row.id),
    name: String(row.name ?? "Salida"),
    sportType: String(row.sport_type ?? ""),
    distanceM: Number(row.distance_m ?? 0),
    elevationM: Number(row.elevation_m ?? 0),
    movingTimeS: Number(row.moving_time_s ?? 0),
    startAt: String(row.start_at ?? ""),
    summaryPolyline: String(row.summary_polyline ?? ""),
    stravaUrl: String(row.strava_url ?? ""),
    private: Boolean(row.private),
  };
}

async function stravaAccountForMe() {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) return null;
  const { data, error } = await supabase.rpc("strava_account_for_me");
  if (error || !data?.[0]) return null;
  return data[0] as StravaAccountRow;
}

export async function getMyStravaStatus(): Promise<StravaStatus | null> {
  if (!hasSupabaseEnv()) return null;
  const account = await stravaAccountForMe();
  if (!account) return null;
  return {
    athleteId: Number(account.athlete_id),
    athleteName: account.athlete_name ?? "",
    syncedAt: account.synced_at ?? "",
  };
}

export async function listMemberRides(
  memberId: string,
  options: { includePrivate?: boolean } = {},
): Promise<StravaRide[]> {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) return [];
  let query = supabase
    .from("strava_activities")
    .select(
      "id, name, sport_type, distance_m, elevation_m, moving_time_s, start_at, summary_polyline, strava_url, private",
    )
    .eq("member_id", memberId)
    .order("start_at", { ascending: false })
    .limit(40);
  if (!options.includePrivate) {
    query = query.eq("private", false);
  }
  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((row) => toRide(row as ActivityRow));
}

export async function saveStravaTokens(input: {
  athleteId: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  athleteName: string;
}) {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) {
    const denied = new Error("not_signed_in");
    denied.name = "StravaError";
    throw denied;
  }
  const { error } = await supabase.rpc("save_strava_account", {
    p_athlete_id: input.athleteId,
    p_access_token: input.accessToken,
    p_refresh_token: input.refreshToken,
    p_expires_at: input.expiresAt,
    p_athlete_name: input.athleteName,
  });
  if (error) {
    const failed = new Error(error.message.includes("athlete_taken") ? "athlete_taken" : error.message);
    failed.name = "StravaError";
    throw failed;
  }
}

async function revokeStravaAccess(accessToken: string) {
  try {
    await fetch("https://www.strava.com/oauth/deauthorize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: accessToken }),
    });
  } catch {
    // Local disconnect still proceeds if Strava is unreachable.
  }
}

export async function disconnectStrava() {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) {
    const denied = new Error("not_signed_in");
    denied.name = "StravaError";
    throw denied;
  }
  const account = await stravaAccountForMe();
  if (account?.access_token) {
    await revokeStravaAccess(account.access_token);
  }
  const { error } = await supabase.rpc("clear_strava_account");
  if (error) {
    const failed = new Error(error.message || "disconnect_failed");
    failed.name = "StravaError";
    throw failed;
  }
}

async function exchangeStravaToken(body: Record<string, string>) {
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: stravaClientId(),
      client_secret: stravaClientSecret(),
      ...body,
    }),
  });
  const payload = (await response.json()) as StravaTokenResponse;
  if (!response.ok || !payload.access_token || !payload.refresh_token || !payload.expires_at) {
    const failed = new Error("token_failed");
    failed.name = "StravaError";
    throw failed;
  }
  return payload;
}

export async function exchangeStravaCode(origin: string, code: string) {
  const payload = await exchangeStravaToken({
    code,
    grant_type: "authorization_code",
    redirect_uri: `${origin}${stravaCallbackPath()}`,
  });
  const athleteId = Number(payload.athlete?.id);
  if (!athleteId) {
    const failed = new Error("athlete_missing");
    failed.name = "StravaError";
    throw failed;
  }
  await saveStravaTokens({
    athleteId,
    accessToken: payload.access_token as string,
    refreshToken: payload.refresh_token as string,
    expiresAt: new Date((payload.expires_at as number) * 1000).toISOString(),
    athleteName: athleteName(payload.athlete),
  });
}

async function accessTokenForMe() {
  const account = await stravaAccountForMe();
  if (!account) return null;
  const expiresAt = new Date(account.expires_at).getTime();
  if (expiresAt > Date.now() + 60_000) {
    return { account, token: account.access_token };
  }
  const payload = await exchangeStravaToken({
    grant_type: "refresh_token",
    refresh_token: account.refresh_token,
  });
  const athleteId = Number(payload.athlete?.id ?? account.athlete_id);
  await saveStravaTokens({
    athleteId,
    accessToken: payload.access_token as string,
    refreshToken: payload.refresh_token as string,
    expiresAt: new Date((payload.expires_at as number) * 1000).toISOString(),
    athleteName: athleteName(payload.athlete) || account.athlete_name || "",
  });
  return { account, token: payload.access_token as string };
}

function isBikeActivity(item: StravaActivityResponse) {
  const sport = item.sport_type || item.type || "";
  return BIKE_SPORTS.has(sport);
}

export async function syncStravaActivities() {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) {
    const denied = new Error("not_signed_in");
    denied.name = "StravaError";
    throw denied;
  }
  const session = await accessTokenForMe();
  if (!session) {
    const missing = new Error("not_connected");
    missing.name = "StravaError";
    throw missing;
  }

  const response = await fetch(
    "https://www.strava.com/api/v3/athlete/activities?per_page=40",
    { headers: { Authorization: `Bearer ${session.token}` } },
  );
  if (!response.ok) {
    const failed = new Error("sync_failed");
    failed.name = "StravaError";
    throw failed;
  }
  const payload = (await response.json()) as StravaActivityResponse[];
  const activities = (Array.isArray(payload) ? payload : [])
    .filter(isBikeActivity)
    .slice(0, 40)
    .map((item) => ({
      id: item.id,
      name: item.name || "Salida",
      sport_type: item.sport_type || item.type || "Ride",
      distance_m: item.distance ?? 0,
      elevation_m: item.total_elevation_gain ?? 0,
      moving_time_s: item.moving_time ?? 0,
      start_at: item.start_date ?? null,
      summary_polyline: item.map?.summary_polyline || "",
      strava_url: item.id ? `https://www.strava.com/activities/${item.id}` : "",
      private: Boolean(item.private),
    }));

  const { error } = await supabase.rpc("replace_strava_activities", { activities });
  if (error) {
    const failed = new Error(error.message || "sync_failed");
    failed.name = "StravaError";
    throw failed;
  }
}
