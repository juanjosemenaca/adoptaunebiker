"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  DEMO_PASSWORD,
  adminSession,
  demoUserByEmail,
  isAdminEmail,
  isEmail,
  normalizeEmail,
} from "@/lib/auth";
import { getDictionary } from "@/i18n/get-dictionary";
import { defaultLocale, isLocale } from "@/i18n/config";
import { isDiscipline } from "@/lib/labels";
import { hrefs, loginHref, safeIntranetPath } from "@/lib/paths";
import { findSignupByEmail, saveSignupRequest } from "@/lib/signup-requests";
import {
  BONDS_COOKIE,
  SESSION_COOKIE,
  cookieOptions,
  emailHasProfile,
  encodeCookie,
  getBonds,
  getProfileSession,
  getSession,
  isAdmin,
} from "@/lib/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Bond, BondStatus, Role } from "@/lib/types";

function localeFromForm(formData: FormData) {
  const value = String(formData.get("locale") ?? "");
  return isLocale(value) ? value : defaultLocale;
}

function revalidateCommunity() {
  revalidatePath("/", "layout");
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
  if ((await emailHasProfile(email)) || (await findSignupByEmail(email))) {
    return { error: t.errors.pendingExists };
  }

  try {
    await saveSignupRequest({
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
  } catch (error) {
    if (error instanceof Error && error.name === "SignupExists") {
      return { error: t.errors.pendingExists };
    }
    console.error("[joinCommunity]", error);
    return { error: t.errors.send };
  }

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

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      const session = await getProfileSession(data.user.id, data.user.email ?? email);
      if (session) {
        revalidateCommunity();
        if (isAdmin(session)) {
          redirect(
            requested.includes("/admin") ? safeIntranetPath(requested, locale) : links.admin,
          );
        }
        redirect(
          requested.includes("/intranet") ? safeIntranetPath(requested, locale) : links.intranet,
        );
      }
      await supabase.auth.signOut();
    }
  }

  if (password !== DEMO_PASSWORD) {
    return { error: t.errors.loginBad };
  }

  const demo = isAdminEmail(email) ? adminSession() : demoUserByEmail(email);
  if (!demo) {
    return { error: t.errors.loginBad };
  }

  const store = await cookies();
  store.set(
    SESSION_COOKIE,
    encodeCookie({ ...demo, kind: demo.kind ?? "user" }),
    cookieOptions,
  );
  revalidateCommunity();
  if (isAdmin(demo)) {
    redirect(
      requested.includes("/admin") ? safeIntranetPath(requested, locale) : links.admin,
    );
  }
  redirect(
    requested.includes("/intranet") ? safeIntranetPath(requested, locale) : links.intranet,
  );
}

export async function logoutCommunity(formData: FormData) {
  const locale = localeFromForm(formData);
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete("adopta.members");
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
