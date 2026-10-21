import { demoAuthEnabled } from "./demo-auth.ts";
import { isDiscipline } from "./labels.ts";
import type { AccountKind, SessionUser } from "./types.ts";

export function profileAccountKind(kind: string): AccountKind {
  return kind === "admin" ? "admin" : "user";
}

function parseJson<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(decodeURIComponent(value)) as T;
  } catch {
    return fallback;
  }
}

export function parseLegacySessionCookie(value: string | undefined): SessionUser | null {
  const parsed = parseJson<Partial<SessionUser> | null>(value, null);
  if (!parsed?.id || !parsed.slug || !parsed.name || !parsed.role || !parsed.city) {
    return null;
  }
  const disciplineRaw = String(parsed.discipline ?? "");
  const session: SessionUser = {
    id: parsed.id,
    slug: parsed.slug,
    name: parsed.name,
    role: parsed.role === "ebiker" ? "ebiker" : "mentor",
    discipline: isDiscipline(disciplineRaw) ? disciplineRaw : "carretera",
    city: parsed.city,
    country: parsed.country,
    bike: parsed.bike ?? "",
    bio: parsed.bio ?? "",
    lookingFor: parsed.lookingFor ?? "",
    email: parsed.email,
    kind: parsed.kind === "admin" ? "admin" : "user",
    mustChangePassword: Boolean(parsed.mustChangePassword),
    memberStatus: parsed.memberStatus === "inactive" ? "inactive" : "active",
  };
  if (session.kind !== "admin" && session.memberStatus === "inactive") return null;
  return session;
}

export function resolveMemberSession(input: {
  profile: SessionUser | null;
  cookieValue?: string;
  nodeEnv?: string;
}): SessionUser | null {
  if (input.profile) {
    if (input.profile.kind !== "admin" && input.profile.memberStatus === "inactive") {
      return null;
    }
    return input.profile;
  }
  if (!demoAuthEnabled(input.nodeEnv)) return null;
  return parseLegacySessionCookie(input.cookieValue);
}
