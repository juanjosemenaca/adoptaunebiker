import { riders } from "@/data/riders";
import { isAdminEmail } from "@/lib/auth";
import { isDiscipline } from "@/lib/labels";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Bond, Rider, SessionUser } from "@/lib/types";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "adopta.session";
export const BONDS_COOKIE = "adopta.bonds";

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 60,
};

function parseJson<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(decodeURIComponent(value)) as T;
  } catch {
    return fallback;
  }
}

export function encodeCookie(value: unknown) {
  return encodeURIComponent(JSON.stringify(value));
}

type ProfileRow = {
  id: string;
  slug: string;
  display_name: string;
  role: string;
  discipline: string;
  city: string;
  bike: string | null;
  bio: string | null;
  looking_for: string | null;
  tags: string[] | null;
  km_month: number | null;
  years: number | null;
  kind: string;
  email: string | null;
};

function profileToSession(row: ProfileRow, email?: string): SessionUser {
  return {
    id: row.id,
    slug: row.slug,
    name: row.display_name,
    role: row.role === "ebiker" ? "ebiker" : "mentor",
    discipline: isDiscipline(row.discipline) ? row.discipline : "carretera",
    city: row.city,
    bike: row.bike ?? "",
    bio: row.bio ?? "",
    lookingFor: row.looking_for ?? "",
    email: email ?? row.email ?? undefined,
    kind: row.kind === "admin" || isAdminEmail(email ?? row.email ?? "") ? "admin" : "user",
  };
}

function profileToRider(row: ProfileRow): Rider {
  return {
    id: row.id,
    slug: row.slug,
    name: row.display_name,
    role: row.role === "ebiker" ? "ebiker" : "mentor",
    discipline: isDiscipline(row.discipline) ? row.discipline : "carretera",
    city: row.city,
    bike: row.bike ?? "",
    kmMonth: row.km_month ?? 0,
    years: row.years ?? 0,
    bio: row.bio ?? "",
    lookingFor: row.looking_for ?? "",
    tags: row.tags?.length ? row.tags : [row.discipline],
    plate: row.kind === "admin" ? "AD" : row.slug.slice(0, 6).toUpperCase(),
  };
}

export async function getSession(): Promise<SessionUser | null> {
  if (!hasSupabaseEnv()) return getLegacyCookieSession();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const profile = await getProfileSession(user.id, user.email ?? undefined);
    if (profile) return profile;
  }
  return getLegacyCookieSession();
}

async function getLegacyCookieSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const parsed = parseJson<Partial<SessionUser> | null>(
    store.get(SESSION_COOKIE)?.value,
    null,
  );
  if (!parsed?.id || !parsed.slug || !parsed.name || !parsed.role || !parsed.city) {
    return null;
  }
  const disciplineRaw = String(parsed.discipline ?? "");
  return {
    id: parsed.id,
    slug: parsed.slug,
    name: parsed.name,
    role: parsed.role === "ebiker" ? "ebiker" : "mentor",
    discipline: isDiscipline(disciplineRaw) ? disciplineRaw : "carretera",
    city: parsed.city,
    bike: parsed.bike ?? "",
    bio: parsed.bio ?? "",
    lookingFor: parsed.lookingFor ?? "",
    email: parsed.email,
    kind: parsed.kind === "admin" ? "admin" : "user",
  };
}

export async function getProfileSession(userId: string, email?: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (!data) return null;
  return profileToSession(data as ProfileRow, email);
}

export function isAdmin(session: SessionUser | null) {
  return session?.kind === "admin";
}

export async function getBonds(): Promise<Bond[]> {
  const store = await cookies();
  const bonds = parseJson<Bond[]>(store.get(BONDS_COOKIE)?.value, []);
  return Array.isArray(bonds) ? bonds : [];
}

export function sessionToRider(session: SessionUser): Rider {
  return {
    id: session.id,
    slug: session.slug,
    name: session.name,
    role: session.role,
    discipline: session.discipline,
    city: session.city,
    bike: session.bike,
    kmMonth: 0,
    years: 0,
    bio: session.bio,
    lookingFor: session.lookingFor,
    tags: ["nuevo", session.discipline],
    plate: "TU-01",
  };
}

export async function listCommunityProfiles(): Promise<Rider[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("kind", "user");
  if (error || !data) return [];
  return data.map((row) => profileToRider(row as ProfileRow));
}

export async function emailHasProfile(email: string) {
  if (!hasSupabaseEnv()) return false;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}

export async function listRiders(): Promise<Rider[]> {
  const [session, community] = await Promise.all([getSession(), listCommunityProfiles()]);
  const extras: Rider[] = [];
  const seen = new Set(riders.map((rider) => rider.slug));

  for (const rider of community) {
    if (seen.has(rider.slug)) continue;
    seen.add(rider.slug);
    extras.push(rider);
  }

  if (session && session.kind !== "admin" && !seen.has(session.slug)) {
    extras.unshift(sessionToRider(session));
  }

  return [...extras, ...riders];
}

export async function findRider(slug: string): Promise<Rider | null> {
  const all = await listRiders();
  return all.find((rider) => rider.slug === slug) ?? null;
}
