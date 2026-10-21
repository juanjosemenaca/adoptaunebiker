import { riders } from "@/data/riders";
import {
  DEMO_ADMIN_EMAIL,
  DEMO_MEMBER_EMAILS,
  DEMO_PASSWORD,
  demoAuthEnabled,
  isDemoLoginAllowed,
} from "@/lib/demo-auth";
import type { AccountKind, SessionUser } from "@/lib/types";

export { DEMO_PASSWORD, demoAuthEnabled };

export const demoAccounts = [
  {
    email: DEMO_MEMBER_EMAILS[0],
    riderId: "r-nuria",
  },
  {
    email: DEMO_MEMBER_EMAILS[1],
    riderId: "r-leo",
  },
] as const;

export const demoAdmin = {
  email: DEMO_ADMIN_EMAIL,
  name: "Administración",
} as const;

export function adminSession(): SessionUser {
  return {
    id: "admin",
    slug: "administracion",
    name: demoAdmin.name,
    role: "mentor",
    discipline: "carretera",
    city: "—",
    bike: "",
    bio: "",
    lookingFor: "",
    email: demoAdmin.email,
    kind: "admin",
  };
}

export function isAdminEmail(email: string) {
  return normalizeEmail(email) === demoAdmin.email;
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isAccountKind(value: string): value is AccountKind {
  return value === "admin" || value === "user";
}

export function riderToSession(riderId: string, email?: string): SessionUser | null {
  const rider = riders.find((item) => item.id === riderId);
  if (!rider) return null;
  return {
    id: rider.id,
    slug: rider.slug,
    name: rider.name,
    role: rider.role,
    discipline: rider.discipline,
    city: rider.city,
    bike: rider.bike,
    bio: rider.bio,
    lookingFor: rider.lookingFor,
    email,
    kind: "user",
  };
}

export function demoUserByEmail(email: string): SessionUser | null {
  const demo = demoAccounts.find((item) => item.email === email);
  if (!demo) return null;
  return riderToSession(demo.riderId, email);
}

export function demoSessionFromLogin(
  email: string,
  password: string,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): SessionUser | null {
  if (!isDemoLoginAllowed(email, password, nodeEnv)) return null;
  if (isAdminEmail(email)) return adminSession();
  return demoUserByEmail(email);
}
