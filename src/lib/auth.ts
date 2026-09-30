import { createHash } from "node:crypto";
import { riders } from "@/data/riders";
import type { SessionUser } from "@/lib/types";

export const MEMBERS_COOKIE = "adopta.members";
export const DEMO_PASSWORD = "adopta";

export type MemberRecord = {
  email: string;
  passwordHash: string;
  user: SessionUser;
};

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

export function hashPassword(password: string) {
  return createHash("sha256")
    .update(`adopta-un-ebiker:${password}`)
    .digest("hex");
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
  };
}

export function demoUserByEmail(email: string): SessionUser | null {
  const demo = demoAccounts.find((item) => item.email === email);
  if (!demo) return null;
  return riderToSession(demo.riderId, email);
}
