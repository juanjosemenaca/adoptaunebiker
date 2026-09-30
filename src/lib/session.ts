import { cookies } from "next/headers";
import { riders } from "@/data/riders";
import { MEMBERS_COOKIE, type MemberRecord } from "@/lib/auth";
import { isDiscipline } from "@/lib/labels";
import type { Bond, Rider, SessionUser } from "@/lib/types";

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

export async function getSession(): Promise<SessionUser | null> {
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
  };
}

export async function getBonds(): Promise<Bond[]> {
  const store = await cookies();
  const bonds = parseJson<Bond[]>(store.get(BONDS_COOKIE)?.value, []);
  return Array.isArray(bonds) ? bonds : [];
}

export async function getMembers(): Promise<MemberRecord[]> {
  const store = await cookies();
  const members = parseJson<MemberRecord[]>(store.get(MEMBERS_COOKIE)?.value, []);
  return Array.isArray(members) ? members : [];
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

export async function listRiders(): Promise<Rider[]> {
  const [session, members] = await Promise.all([getSession(), getMembers()]);
  const extras: Rider[] = [];
  const seen = new Set(riders.map((rider) => rider.id));

  for (const member of members) {
    if (seen.has(member.user.id) || riders.some((rider) => rider.slug === member.user.slug)) {
      continue;
    }
    seen.add(member.user.id);
    extras.push(sessionToRider(member.user));
  }

  if (
    session &&
    !seen.has(session.id) &&
    !riders.some((rider) => rider.slug === session.slug)
  ) {
    extras.unshift(sessionToRider(session));
  }

  return [...extras, ...riders];
}

export async function findRider(slug: string): Promise<Rider | null> {
  const all = await listRiders();
  return all.find((rider) => rider.slug === slug) ?? null;
}
