"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  DEMO_PASSWORD,
  adminSession,
  demoUserByEmail,
  hashPassword,
  isAdminEmail,
  isEmail,
  normalizeEmail,
} from "@/lib/auth";
import { getDictionary } from "@/i18n/get-dictionary";
import { defaultLocale, isLocale } from "@/i18n/config";
import { isDiscipline } from "@/lib/labels";
import { hrefs, loginHref, safeIntranetPath } from "@/lib/paths";
import {
  findSignupByEmail,
  saveSignupRequest,
} from "@/lib/signup-requests";
import { isAdmin } from "@/lib/session";
import {
  BONDS_COOKIE,
  cookieOptions,
  encodeCookie,
  getBonds,
  getMembers,
  getSession,
  SESSION_COOKIE,
} from "@/lib/session";
import type { Bond, BondStatus, Role } from "@/lib/types";

function localeFromForm(formData: FormData) {
  const value = String(formData.get("locale") ?? "");
  return isLocale(value) ? value : defaultLocale;
}

function revalidateCommunity() {
  revalidatePath("/", "layout");
}

async function emailTaken(email: string) {
  if (isAdminEmail(email) || demoUserByEmail(email)) return true;
  const members = await getMembers();
  return members.some((member) => member.email === email);
}

export async function joinCommunity(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const city = String(formData.get("city") ?? "").trim();
  const bike = String(formData.get("bike") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const lookingFor = String(formData.get("lookingFor") ?? "").trim();
  const role = String(formData.get("role") ?? "") as Role;
  const disciplineRaw = String(formData.get("discipline") ?? "");
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);

  if (name.length < 2) {
    return { error: t.errors.name };
  }
  if (!isEmail(email)) {
    return { error: t.errors.email };
  }
  if (!city) {
    return { error: t.errors.city };
  }
  if (role !== "mentor" && role !== "ebiker") {
    return { error: t.errors.role };
  }
  if (!isDiscipline(disciplineRaw)) {
    return { error: t.errors.discipline };
  }
  if (await emailTaken(email) || (await findSignupByEmail(email))) {
    return { error: t.errors.pendingExists };
  }

  try {
    await saveSignupRequest({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name,
      email,
      city,
      role,
      discipline: disciplineRaw,
      bike,
      bio,
      lookingFor,
      locale,
    });
  } catch {
    return { error: t.errors.send };
  }

  revalidateCommunity();
  return { ok: true as const };
}

export async function loginCommunity(formData: FormData) {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const links = hrefs(locale);
  const requested = String(formData.get("next") ?? "");

  if (!isEmail(email) || password.length < 1) {
    return { error: t.errors.loginEmpty };
  }

  const passwordOk = hashPassword(password) === hashPassword(DEMO_PASSWORD);

  if (isAdminEmail(email)) {
    if (!passwordOk) {
      return { error: t.errors.loginBad };
    }
    const store = await cookies();
    store.set(SESSION_COOKIE, encodeCookie(adminSession()), cookieOptions);
    revalidateCommunity();
    redirect(
      requested.includes("/admin") ? safeIntranetPath(requested, locale) : links.admin,
    );
  }

  const demo = demoUserByEmail(email);
  if (demo && passwordOk) {
    const store = await cookies();
    store.set(SESSION_COOKIE, encodeCookie({ ...demo, kind: "user" as const }), cookieOptions);
    revalidateCommunity();
    redirect(
      requested.includes("/intranet")
        ? safeIntranetPath(requested, locale)
        : links.intranet,
    );
  }

  const members = await getMembers();
  const member = members.find((item) => item.email === email);
  if (!member || member.passwordHash !== hashPassword(password)) {
    return { error: t.errors.loginBad };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, encodeCookie(member.user), cookieOptions);
  revalidateCommunity();
  redirect(
    member.user.kind === "admin"
      ? requested.includes("/admin")
        ? safeIntranetPath(requested, locale)
        : links.admin
      : requested.includes("/intranet")
        ? safeIntranetPath(requested, locale)
        : links.intranet,
  );
}

export async function logoutCommunity(formData: FormData) {
  const locale = localeFromForm(formData);
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  revalidateCommunity();
  redirect(hrefs(locale).home);
}

export async function requestAdoption(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session || isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).intranet));
  }

  const toId = String(formData.get("toId") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  if (!toId || toId === session.id) {
    return { error: t.errors.adoptSelf };
  }

  const bonds = await getBonds();
  const exists = bonds.find(
    (bond) =>
      (bond.fromId === session.id && bond.toId === toId) ||
      (bond.fromId === toId && bond.toId === session.id),
  );
  if (exists && exists.status !== "declined") {
    return { error: t.errors.bondExists };
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
  const locale = localeFromForm(formData);
  const session = await getSession();
  if (!session || isAdmin(session)) redirect(loginHref(locale, hrefs(locale).intranet));

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
