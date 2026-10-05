import { riders } from "@/data/riders";
import type { AccountKind, SessionUser } from "@/lib/types";

export const DEMO_PASSWORD = "adopta";

export const demoAccounts = [
  {
    email: "veterano@adopta.local",
    riderId: "r-nuria",
  },
  {
    email: "ebiker@adopta.local",
    riderId: "r-leo",
  },
] as const;

export const demoAdmin = {
  email: "admin@adopta.local",
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
