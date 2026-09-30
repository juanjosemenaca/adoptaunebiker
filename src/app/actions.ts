"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { riders } from "@/data/riders";
import {
  DEMO_PASSWORD,
  demoUserByEmail,
  hashPassword,
  isEmail,
  MEMBERS_COOKIE,
  normalizeEmail,
} from "@/lib/auth";
import { isDiscipline } from "@/lib/labels";
import { paths, safeIntranetPath } from "@/lib/paths";
import {
  BONDS_COOKIE,
  cookieOptions,
  encodeCookie,
  getBonds,
  getMembers,
  getSession,
  SESSION_COOKIE,
} from "@/lib/session";
import type { Bond, BondStatus, Discipline, Role, SessionUser } from "@/lib/types";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

function revalidateCommunity() {
  revalidatePath("/", "layout");
  revalidatePath(paths.intranet, "layout");
}

async function takenSlugs() {
  const members = await getMembers();
  const taken = new Set(riders.map((rider) => rider.slug));
  for (const member of members) taken.add(member.user.slug);
  const session = await getSession();
  if (session) taken.add(session.slug);
  return taken;
}

async function emailTaken(email: string) {
  if (demoUserByEmail(email)) return true;
  const members = await getMembers();
  return members.some((member) => member.email === email);
}

export async function joinCommunity(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const city = String(formData.get("city") ?? "").trim();
  const bike = String(formData.get("bike") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const lookingFor = String(formData.get("lookingFor") ?? "").trim();
  const role = String(formData.get("role") ?? "") as Role;
  const disciplineRaw = String(formData.get("discipline") ?? "");
  const next = safeIntranetPath(String(formData.get("next") ?? ""));

  if (name.length < 2) {
    return { error: "Pon un nombre o alias que se pueda decir en un bar." };
  }
  if (!isEmail(email)) {
    return { error: "Necesitamos un correo para volver a entrar." };
  }
  if (password.length < 6) {
    return { error: "La clave, mínimo seis caracteres." };
  }
  if (!city) {
    return { error: "Sin ciudad no hay quedada." };
  }
  if (role !== "mentor" && role !== "ebiker") {
    return { error: "Elige si sales a adoptar o a que te adopten." };
  }
  if (!isDiscipline(disciplineRaw)) {
    return { error: "Elige modalidad: MTB, carretera o gravel." };
  }
  if (await emailTaken(email)) {
    return { error: "Ese correo ya tiene plaza. Entra con tu clave." };
  }

  const discipline: Discipline = disciplineRaw;
  const taken = await takenSlugs();
  const base = slugify(name) || "rider";
  let slug = base;
  let n = 2;
  while (taken.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }

  const user: SessionUser = {
    id: crypto.randomUUID(),
    slug,
    name,
    role,
    discipline,
    city,
    bike:
      bike ||
      (role === "mentor"
        ? "Bici de veterano, aún sin ficha"
        : "eBike aún sin ficha"),
    bio: bio || "Recién aterrizado. Todavía huele a caja.",
    lookingFor: lookingFor || "Alguien con quien salir el próximo sábado.",
    email,
  };

  const members = await getMembers();
  const store = await cookies();
  store.set(
    MEMBERS_COOKIE,
    encodeCookie([...members, { email, passwordHash: hashPassword(password), user }]),
    cookieOptions,
  );
  store.set(SESSION_COOKIE, encodeCookie(user), cookieOptions);
  revalidateCommunity();
  redirect(next);
}

export async function loginCommunity(formData: FormData) {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const next = safeIntranetPath(String(formData.get("next") ?? ""));

  if (!isEmail(email) || password.length < 1) {
    return { error: "Correo y clave, sin teatro." };
  }

  const demo = demoUserByEmail(email);
  if (demo && hashPassword(password) === hashPassword(DEMO_PASSWORD)) {
    const store = await cookies();
    store.set(SESSION_COOKIE, encodeCookie(demo), cookieOptions);
    revalidateCommunity();
    redirect(next);
  }

  const members = await getMembers();
  const member = members.find((item) => item.email === email);
  if (!member || member.passwordHash !== hashPassword(password)) {
    return { error: "Esa plaza no encaja. Revisa correo y clave." };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, encodeCookie(member.user), cookieOptions);
  revalidateCommunity();
  redirect(next);
}

export async function logoutCommunity() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  revalidateCommunity();
  redirect(paths.home);
}

export async function requestAdoption(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect(paths.entrar);
  }

  const toId = String(formData.get("toId") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  if (!toId || toId === session.id) {
    return { error: "Esa adopción no tiene sentido." };
  }

  const bonds = await getBonds();
  const exists = bonds.find(
    (bond) =>
      (bond.fromId === session.id && bond.toId === toId) ||
      (bond.fromId === toId && bond.toId === session.id),
  );
  if (exists && exists.status !== "declined") {
    return { error: "Ya hay un vínculo abierto con esta persona." };
  }

  const bond: Bond = {
    id: crypto.randomUUID(),
    fromId: session.id,
    toId,
    message: message.slice(0, 280),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const next = exists
    ? bonds.map((item) => (item.id === exists.id ? bond : item))
    : [bond, ...bonds];

  const store = await cookies();
  store.set(BONDS_COOKIE, encodeCookie(next), cookieOptions);
  revalidateCommunity();
  return { ok: true as const };
}

export async function respondBond(formData: FormData) {
  const session = await getSession();
  if (!session) redirect(paths.entrar);

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as BondStatus;
  if (status !== "accepted" && status !== "declined") return;

  const bonds = await getBonds();
  const next = bonds.map((bond) => {
    if (bond.id !== id || bond.toId !== session.id) return bond;
    return { ...bond, status };
  });

  const store = await cookies();
  store.set(BONDS_COOKIE, encodeCookie(next), cookieOptions);
  revalidateCommunity();
}
