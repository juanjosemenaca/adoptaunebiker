"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { DEMO_PASSWORD, demoSessionFromLogin, isEmail, normalizeEmail } from "@/lib/auth";
import { logServerError } from "@/lib/log";
import { getDictionary } from "@/i18n/get-dictionary";
import { defaultLocale, isLocale } from "@/i18n/config";
import { complementaryPractices, isDiscipline, parsePracticeList } from "@/lib/labels";
import {
  OTHER_PLACE,
  countryById,
  formatSignupPlace,
  storedCityName,
  storedCountryName,
} from "@/lib/places";
import { hrefs, loginHref, safeIntranetPath } from "@/lib/paths";
import { encodeSignupMeta } from "@/lib/signup-meta";
import { AvatarError } from "@/lib/avatar";
import {
  addMemberNote,
  approveSignupRequest,
  deleteMemberNote,
  removeMemberAvatar,
  resetMemberPassword,
  setMemberStatus,
  saveMemberGarage,
  updateMember,
  uploadMemberAvatar,
} from "@/lib/members";
import {
  BIKE_NAME_MAX,
  BIKE_NAME_MIN,
  parseGarageFields,
} from "@/lib/bikes";
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
import {
  createBlogPost,
  deleteBlogAsset,
  deleteBlogPost,
  updateBlogPost,
  uploadBlogAsset,
} from "@/lib/blog-admin";
import { disconnectStrava, stravaConnectHref, syncStravaActivities } from "@/lib/strava";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Bond, BondStatus, MemberStatus, Role } from "@/lib/types";
import { isSignupWorkflowStatus } from "@/lib/types";
import { verifyAltchaPayload } from "@/lib/altcha";

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
  const beginnerIn = complementaryPractices(
    veteranIn,
    formData.getAll("beginner").map((item) => String(item)),
  );
  const interestedIn = formData
    .getAll("interested")
    .map((item) => String(item))
    .filter(isDiscipline);
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const trap = String(formData.get("website") ?? "").trim();
  const startedAt = Number(formData.get("startedAt"));
  const altcha = String(formData.get("altcha") ?? "");
  const tooFast = Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 2000;

  if (trap || (tooFast && !altcha.trim())) {
    return { ok: true as const };
  }
  if (formData.get("legal") !== "1") {
    return { error: t.errors.legal };
  }
  const humanOk = await verifyAltchaPayload(altcha);
  if (!humanOk) {
    return { error: t.errors.robot };
  }

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
    logServerError("[joinCommunity]", error);
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
        if (requested.includes("/api/strava/connect")) {
          redirect(stravaConnectHref(locale));
        }
        redirect(
          requested.includes("/intranet") ? safeIntranetPath(requested, locale) : links.intranet,
        );
      }
      await supabase.auth.signOut();
    }
  }

  const demo = demoSessionFromLogin(email, password);
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
  if (requested.includes("/api/strava/connect")) {
    redirect(stravaConnectHref(locale));
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
    logServerError("[setSignupWorkflowStatus]", error);
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
    logServerError("[rejectSignupRequestAction]", error);
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
    logServerError("[deleteSignupRequestAction]", error);
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
    logServerError("[approveSignupRequestAction]", error);
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
    logServerError("[changePasswordAction]", error);
    return { error: t.errors.passwordChange };
  }

  const { error: flagError } = await supabase
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", session.id);
  if (flagError) {
    logServerError("[changePasswordAction] flag", flagError);
    return { error: t.errors.passwordChange };
  }

  revalidateCommunity();
  if (String(formData.get("next") ?? "") === "cuenta") {
    redirect(`${hrefs(locale).cuenta}?clave=ok`);
  }
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
    logServerError("[setMemberStatusAction]", error);
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
    logServerError("[resetMemberPasswordAction]", error);
    return { error: t.admin.memberResetError };
  }

  revalidateMembers(locale, id);
  redirect(`${hrefs(locale).adminMember(id)}?clave=ok&correo=${mailFlag}`);
}

export async function updateMemberAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session) {
    redirect(loginHref(locale, hrefs(locale).intranet));
  }

  const id = String(formData.get("id") ?? "");
  const selfEdit = id === session.id;
  if (!isAdmin(session) && !selfEdit) {
    return { error: t.admin.memberSaveError };
  }
  const name = String(formData.get("name") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
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
      bio,
      lookingFor,
    });
  } catch (error) {
    logServerError("[updateMemberAction]", error);
    return { error: t.admin.memberSaveError };
  }

  revalidateMembers(locale, id);
  if (String(formData.get("next") ?? "") === "cuenta" || (selfEdit && !isAdmin(session))) {
    redirect(`${hrefs(locale).cuenta}?datos=ok`);
  }
  redirect(`${hrefs(locale).adminMember(id)}?datos=ok`);
}

function avatarActionError(error: unknown, t: ReturnType<typeof getDictionary>) {
  if (error instanceof AvatarError) {
    if (error.code === "type") return { error: t.errors.photoType };
    if (error.code === "size") return { error: t.errors.photoSize };
    if (error.code === "missing") return { error: t.errors.photoType };
  }
  return { error: t.errors.photo };
}

export async function uploadAvatarAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session) {
    redirect(loginHref(locale, hrefs(locale).cuenta));
  }
  const file = formData.get("photo");
  if (!(file instanceof File)) return { error: t.errors.photoType };
  try {
    await uploadMemberAvatar(file);
  } catch (error) {
    logServerError("[uploadAvatarAction]", error);
    return avatarActionError(error, t);
  }
  revalidateMembers(locale, session.id);
  redirect(`${hrefs(locale).cuenta}?foto=ok`);
}

export async function removeAvatarAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session) {
    redirect(loginHref(locale, hrefs(locale).cuenta));
  }
  try {
    await removeMemberAvatar();
  } catch (error) {
    logServerError("[removeAvatarAction]", error);
    return avatarActionError(error, t);
  }
  revalidateMembers(locale, session.id);
  redirect(`${hrefs(locale).cuenta}?foto=off`);
}

export async function saveGarageAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session) {
    redirect(loginHref(locale, hrefs(locale).cuenta));
  }

  const id = String(formData.get("id") ?? "");
  const selfEdit = id === session.id;
  if (!id || (!isAdmin(session) && !selfEdit)) {
    return { error: t.errors.bikes };
  }

  const names = formData.getAll("bikeName").map((item) => String(item));
  for (const raw of names) {
    const name = raw.trim();
    if (!name) continue;
    if (name.length < BIKE_NAME_MIN || name.length > BIKE_NAME_MAX) {
      return { error: t.errors.bikeName };
    }
  }

  const garage = parseGarageFields({
    ids: formData.getAll("bikeId").map((item) => String(item)),
    names,
    kinds: formData.getAll("bikeKind").map((item) => String(item)),
    notes: formData.getAll("bikeNote").map((item) => String(item)),
    photoPaths: formData.getAll("bikePhotoPath").map((item) => String(item)),
    photoUrls: formData.getAll("bikePhotoUrl").map((item) => String(item)),
  });
  const files = garage.flatMap((bike) => {
    const file = formData.get(`photo-${bike.id}`);
    return file instanceof File && file.size > 0 ? [{ bikeId: bike.id, file }] : [];
  });
  const clearIds = formData.getAll("clearPhoto").map((item) => String(item));

  try {
    await saveMemberGarage(id, garage, files, clearIds);
  } catch (error) {
    logServerError("[saveGarageAction]", error);
    if (error instanceof AvatarError) return avatarActionError(error, t);
    return { error: t.errors.bikes };
  }

  revalidateMembers(locale, id);
  if (String(formData.get("next") ?? "") === "cuenta" || (selfEdit && !isAdmin(session))) {
    redirect(`${hrefs(locale).cuenta}?bici=ok`);
  }
  redirect(`${hrefs(locale).adminMember(id)}?bici=ok`);
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
    logServerError("[addMemberNoteAction]", error);
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
    logServerError("[deleteMemberNoteAction]", error);
    return { error: t.admin.memberNoteError };
  }

  revalidateMembers(locale, id);
  redirect(hrefs(locale).adminMember(id));
}

function revalidateStrava(locale: string, slug?: string) {
  const lang = isLocale(locale) ? locale : defaultLocale;
  revalidatePath(`/${lang}/intranet/cuenta`);
  revalidatePath(`/${lang}/intranet`, "layout");
  if (slug) revalidatePath(`/${lang}/intranet/rider/${slug}`);
}

export async function syncStravaAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session) {
    redirect(loginHref(locale, hrefs(locale).cuenta));
  }

  try {
    await syncStravaActivities();
  } catch (error) {
    logServerError("[syncStravaAction]", error);
    return { error: t.errors.stravaSync };
  }

  revalidateStrava(locale, session.slug);
  redirect(`${hrefs(locale).cuenta}?strava=ok`);
}

export async function disconnectStravaAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const t = getDictionary(locale);
  const session = await getSession();
  if (!session) {
    redirect(loginHref(locale, hrefs(locale).cuenta));
  }

  try {
    await disconnectStrava();
  } catch (error) {
    logServerError("[disconnectStravaAction]", error);
    return { error: t.errors.strava };
  }

  revalidateStrava(locale, session.slug);
  redirect(`${hrefs(locale).cuenta}?strava=off`);
}

function revalidateBlog(locale: string, slug?: string) {
  const lang = isLocale(locale) ? locale : defaultLocale;
  revalidatePath(`/${lang}/admin`);
  revalidatePath(`/${lang}/admin/blog`);
  revalidatePath(`/${lang}/blog`);
  if (slug) revalidatePath(`/${lang}/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/blog/sitemap.xml");
}

function blogInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    metaDescription: String(formData.get("metaDescription") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    body: String(formData.get("body") ?? ""),
    locale: String(formData.get("postLocale") ?? formData.get("locale") ?? ""),
    published: formData.get("published") === "1",
    publishedAt: String(formData.get("publishedAt") ?? ""),
  };
}

function blogError(locale: string, error: unknown) {
  const t = getDictionary(locale);
  const message = error instanceof Error ? error.message : "";
  if (message === "not_admin" || message === "no_supabase") return t.errors.blog;
  if (message === "title") return t.errors.name;
  if (message === "file" || message === "file_type" || message === "file_size") return t.errors.blogUpload;
  return t.errors.blog;
}

export async function saveBlogPostAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).adminBlog));
  }
  const id = String(formData.get("id") ?? "");
  try {
    const post = id
      ? await updateBlogPost(id, blogInput(formData))
      : await createBlogPost(blogInput(formData));
    revalidateBlog(locale, post.slug);
    redirect(`${hrefs(locale).adminBlogPost(post.id)}?ok=1`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    logServerError("[saveBlogPostAction]", error);
    return { error: blogError(locale, error) };
  }
}

export async function deleteBlogPostAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).adminBlog));
  }
  try {
    await deleteBlogPost(String(formData.get("id") ?? ""));
  } catch (error) {
    logServerError("[deleteBlogPostAction]", error);
    return { error: blogError(locale, error) };
  }
  revalidateBlog(locale);
  redirect(hrefs(locale).adminBlog);
}

export async function uploadBlogAssetAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    return { error: getDictionary(locale).errors.blog };
  }
  const id = String(formData.get("id") ?? "");
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: getDictionary(locale).errors.blogUpload };
  }
  try {
    const asset = await uploadBlogAsset(id, file, formData.get("asCover") === "1");
    revalidateBlog(locale);
    return { ok: true as const, url: asset.url, kind: asset.kind, name: asset.name };
  } catch (error) {
    logServerError("[uploadBlogAssetAction]", error);
    return { error: blogError(locale, error) };
  }
}

export async function deleteBlogAssetAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    return { error: getDictionary(locale).errors.blog };
  }
  try {
    await deleteBlogAsset(String(formData.get("id") ?? ""), String(formData.get("assetId") ?? ""));
    revalidateBlog(locale);
    return { ok: true as const };
  } catch (error) {
    logServerError("[deleteBlogAssetAction]", error);
    return { error: blogError(locale, error) };
  }
}
