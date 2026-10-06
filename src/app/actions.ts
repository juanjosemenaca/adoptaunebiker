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
import { isDiscipline, parsePracticeList } from "@/lib/labels";
import {
  OTHER_PLACE,
  countryById,
  formatSignupPlace,
  storedCityName,
  storedCountryName,
} from "@/lib/places";
import { hrefs, loginHref, safeIntranetPath } from "@/lib/paths";
import { encodeSignupMeta } from "@/lib/signup-meta";
import {
  addMemberNote,
  approveSignupRequest,
  deleteMemberNote,
  resetMemberPassword,
  setMemberStatus,
  updateMember,
} from "@/lib/members";
import { sendMemberResetEmail, sendMemberWelcomeEmail } from "@/lib/mail";
import {
  findSignupByEmail,
  rejectSignupRequest,
  removeSignupRequest,
  saveSignupRequest,
  updateSignupInboxStatus,
} from "@/lib/signup-requests";
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
import type { Bond, BondStatus, MemberStatus, Role } from "@/lib/types";
import { isSignupWorkflowStatus } from "@/lib/types";

function localeFromForm(formData: FormData) {
  const value = String(formData.get("locale") ?? "");
  return isLocale(value) ? value : defaultLocale;
}

function revalidateCommunity() {
  revalidatePath("/", "layout");
}

function revalidateMembers(locale: string, id?: string) {
  const lang = isLocale(locale) ? locale : defaultLocale;
  revalidatePath(`/${lang}/admin`);
  revalidatePath(`/${lang}/admin/miembros`);
  if (id) revalidatePath(`/${lang}/admin/miembros/${id}`);
  revalidatePath(`/${lang}/intranet`, "layout");
}

function revalidateSignupInbox(locale: string) {
  const lang = isLocale(locale) ? locale : defaultLocale;
  revalidatePath(`/${lang}/admin`);
  revalidatePath(`/${lang}/admin/solicitudes`);
  revalidatePath(`/${lang}/admin/miembros`);
  revalidatePath(`/${lang}/intranet`, "layout");
}

export async function joinCommunity(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const countryId = String(formData.get("country") ?? "").trim();
  const countryOther = String(formData.get("countryOther") ?? "").trim();
  const cityChoice = String(formData.get("city") ?? "").trim();
  const cityOther = String(formData.get("cityOther") ?? "").trim();
  const country = storedCountryName(countryId, countryOther);
  const city = storedCityName(countryId, cityChoice, cityOther);
  const bike = String(formData.get("bike") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const lookingForText = String(formData.get("lookingFor") ?? "").trim();
  const veteranIn = parsePracticeList(
    formData.getAll("veteran").map((item) => String(item)),
  );
  const beginnerIn = parsePracticeList(
    formData.getAll("beginner").map((item) => String(item)),
  ).filter((item) => !veteranIn.includes(item));
  const interestedIn = formData
    .getAll("interested")
    .map((item) => String(item))
    .filter(isDiscipline);
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);

  if (name.length < 2) {
    return { error: t.errors.name };
  }
  if (!isEmail(email)) {
    return { error: t.errors.email };
  }
  const knownCountry = Boolean(countryById(countryId));
  if ((!knownCountry && countryId !== OTHER_PLACE) || !country) {
    return { error: t.errors.country };
  }
  if (!city) {
    return { error: t.errors.city };
  }
  if (veteranIn.length === 0 && beginnerIn.length === 0) {
    return { error: t.errors.role };
  }
  if (interestedIn.length === 0) {
    return { error: t.errors.interested };
  }
  if ((await emailHasProfile(email)) || (await findSignupByEmail(email))) {
    return { error: t.errors.pendingExists };
  }

  const role: Role = veteranIn.length ? "mentor" : "ebiker";
  const practice = veteranIn[0] ?? beginnerIn[0];

  try {
    await saveSignupRequest({
      name,
      lastName,
      email,
      city: formatSignupPlace(city, country),
      role,
      discipline: interestedIn[0],
      practice,
      veteranIn,
      beginnerIn,
      interestedIn,
      bike,
      bio,
      lookingFor: encodeSignupMeta(veteranIn, beginnerIn, interestedIn, lookingForText, lastName),
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
        if (session.kind !== "admin" && session.memberStatus === "inactive") {
          await supabase.auth.signOut();
          return { error: t.errors.loginInactive };
        }
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

export async function setSignupWorkflowStatus(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).admin));
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !isSignupWorkflowStatus(status)) return { error: t.admin.statusError };

  try {
    await updateSignupInboxStatus(id, status);
  } catch (error) {
    console.error("[setSignupWorkflowStatus]", error);
    return { error: t.admin.statusError };
  }
  revalidateSignupInbox(locale);
  redirect(hrefs(locale).adminRequest(id));
}

export async function rejectSignupRequestAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).admin));
  }

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: t.admin.rejectError };

  try {
    await rejectSignupRequest(id);
  } catch (error) {
    console.error("[rejectSignupRequestAction]", error);
    return { error: t.admin.rejectError };
  }
  revalidateSignupInbox(locale);
  redirect(hrefs(locale).adminRequest(id));
}

export async function deleteSignupRequestAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).admin));
  }

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: t.admin.deleteError };

  try {
    await removeSignupRequest(id);
  } catch (error) {
    console.error("[deleteSignupRequestAction]", error);
    return { error: t.admin.deleteError };
  }
  revalidateSignupInbox(locale);
  redirect(hrefs(locale).adminRequests);
}

export async function approveSignupRequestAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).admin));
  }

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: t.admin.approveError };

  let mailFlag: "ok" | "fail" = "fail";
  try {
    const result = await approveSignupRequest(id);
    const mail = await sendMemberWelcomeEmail({
      to: result.request.email,
      name: result.request.name,
      locale: result.request.locale || locale,
    });
    mailFlag = mail.sent ? "ok" : "fail";
  } catch (error) {
    console.error("[approveSignupRequestAction]", error);
    return { error: t.admin.approveError };
  }

  revalidateSignupInbox(locale);
  redirect(`${hrefs(locale).adminRequest(id)}&alta=ok&correo=${mailFlag}`);
}

export async function changePasswordAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session) {
    redirect(loginHref(locale, hrefs(locale).intranet));
  }

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 6) {
    return { error: t.errors.password };
  }
  if (password !== confirm) {
    return { error: t.errors.passwordMismatch };
  }
  if (password === DEMO_PASSWORD) {
    return { error: t.errors.passwordSame };
  }

  if (!hasSupabaseEnv()) {
    return { error: t.errors.passwordChange };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error("[changePasswordAction]", error);
    return { error: t.errors.passwordChange };
  }

  const { error: flagError } = await supabase
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", session.id);
  if (flagError) {
    console.error("[changePasswordAction] flag", flagError);
    return { error: t.errors.passwordChange };
  }

  revalidateCommunity();
  redirect(hrefs(locale).intranet);
}

export async function setMemberStatusAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).admin));
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || (status !== "active" && status !== "inactive")) {
    return { error: t.admin.memberStatusError };
  }

  try {
    await setMemberStatus(id, status as MemberStatus);
  } catch (error) {
    console.error("[setMemberStatusAction]", error);
    return { error: t.admin.memberStatusError };
  }

  revalidateMembers(locale, id);
  redirect(`${hrefs(locale).adminMember(id)}?estado=ok`);
}

export async function resetMemberPasswordAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).admin));
  }

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: t.admin.memberResetError };

  let mailFlag: "ok" | "fail" = "fail";
  try {
    const member = await resetMemberPassword(id);
    const mail = await sendMemberResetEmail({
      to: member.email,
      name: member.name,
      locale,
    });
    mailFlag = mail.sent ? "ok" : "fail";
  } catch (error) {
    console.error("[resetMemberPasswordAction]", error);
    return { error: t.admin.memberResetError };
  }

  revalidateMembers(locale, id);
  redirect(`${hrefs(locale).adminMember(id)}?clave=ok&correo=${mailFlag}`);
}

export async function updateMemberAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).admin));
  }

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const bike = String(formData.get("bike") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const lookingFor = String(formData.get("lookingFor") ?? "").trim();
  const veteranIn = parsePracticeList(formData.getAll("veteran").map((item) => String(item)));
  const beginnerIn = parsePracticeList(
    formData.getAll("beginner").map((item) => String(item)),
  ).filter((item) => !veteranIn.includes(item));
  const interestedIn = formData
    .getAll("interested")
    .map((item) => String(item))
    .filter(isDiscipline);

  if (!id) return { error: t.admin.memberSaveError };
  if (name.length < 2) return { error: t.errors.name };
  if (!city) return { error: t.errors.city };
  if (veteranIn.length === 0 && beginnerIn.length === 0) return { error: t.errors.role };
  if (interestedIn.length === 0) return { error: t.errors.interested };

  try {
    await updateMember(id, {
      name,
      lastName,
      country,
      city,
      veteranIn,
      beginnerIn,
      interestedIn,
      bike,
      bio,
      lookingFor,
    });
  } catch (error) {
    console.error("[updateMemberAction]", error);
    return { error: t.admin.memberSaveError };
  }

  revalidateMembers(locale, id);
  redirect(`${hrefs(locale).adminMember(id)}?datos=ok`);
}

export async function addMemberNoteAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).admin));
  }

  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "");
  if (!id) return { error: t.admin.memberNoteError };

  try {
    await addMemberNote(id, body, session.name);
  } catch (error) {
    console.error("[addMemberNoteAction]", error);
    return { error: t.admin.memberNoteError };
  }

  revalidateMembers(locale, id);
  redirect(`${hrefs(locale).adminMember(id)}?nota=ok`);
}

export async function deleteMemberNoteAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).admin));
  }

  const id = String(formData.get("id") ?? "");
  const noteId = String(formData.get("noteId") ?? "");
  if (!id || !noteId) return { error: t.admin.memberNoteError };

  try {
    await deleteMemberNote(noteId);
  } catch (error) {
    console.error("[deleteMemberNoteAction]", error);
    return { error: t.admin.memberNoteError };
  }

  revalidateMembers(locale, id);
  redirect(hrefs(locale).adminMember(id));
}
