"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getDictionary } from "@/i18n/get-dictionary";
import { defaultLocale, isLocale } from "@/i18n/config";
import { hrefs, loginHref } from "@/lib/paths";
import {
  canManageHostedRide,
  canRequestRideSpot,
  canSeeRideChat,
  cancelRideRecord,
  getMyRideRequest,
  getRide,
  insertJoinRequest,
  insertRide,
  insertRideMessage,
  isRideFull,
  listRideJoinRequests,
  parseRideDraft,
  saveRidePhotos,
  updateJoinRequestStatus,
  updateRideRecord,
} from "@/lib/rides";
import { notifyRideMembers } from "@/lib/admin-inbox";
import { appendMemberBike } from "@/lib/members";
import { getSession, isAdmin } from "@/lib/session";

function localeFromForm(formData: FormData) {
  const value = String(formData.get("locale") ?? "");
  return isLocale(value) ? value : defaultLocale;
}

function rideError(locale: string, key: string) {
  const t = getDictionary(locale);
  if (key === "title") return t.errors.rideTitle;
  if (key === "start") return t.errors.rideStart;
  if (key === "duration") return t.errors.rideDuration;
  if (key === "surface") return t.errors.rideSurface;
  if (key === "hostBike") return t.errors.rideBike;
  if (key === "level") return t.errors.rideLevel;
  if (key === "place") return t.errors.city;
  if (key === "maxRiders") return t.errors.rideAforo;
  if (key === "distance") return t.errors.rideDistance;
  if (key === "elevation") return t.errors.rideElevation;
  if (key === "routeUrl") return t.errors.rideUrl;
  if (key === "meetingPin") return t.errors.meetingPin;
  if (key === "rideHost") return t.errors.rideHost;
  if (key === "rideFull") return t.errors.rideFull;
  if (key === "rideClosed") return t.errors.rideClosed;
  if (key === "rideExists") return t.errors.rideExists;
  if (key === "rideChat") return t.errors.rideChat;
  return t.errors.ride;
}

function revalidateRides(locale: string, rideId?: string) {
  const lang = isLocale(locale) ? locale : defaultLocale;
  revalidatePath(`/${lang}/intranet`);
  revalidatePath(`/${lang}/intranet/salidas`);
  revalidatePath(`/${lang}/intranet/apuntadas`);
  revalidatePath(`/${lang}/intranet/comunicacion`);
  revalidatePath(`/${lang}/admin/quedadas`);
  revalidatePath(`/${lang}/admin/mensajes`);
  if (rideId) revalidatePath(`/${lang}/intranet/salidas/${rideId}`);
}

function rideDraftFromForm(formData: FormData) {
  return parseRideDraft({
    title: String(formData.get("title") ?? ""),
    startsAtIso: String(formData.get("startsAtIso") ?? ""),
    startsAt: String(formData.get("startsAt") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    startTime: String(formData.get("startTime") ?? ""),
    durationMin: String(formData.get("durationMin") ?? ""),
    surface: String(formData.get("surface") ?? ""),
    hostBike: String(formData.get("hostBike") ?? ""),
    hostBikeNew: String(formData.get("hostBikeNew") ?? ""),
    level: String(formData.get("level") ?? ""),
    place: String(formData.get("place") ?? ""),
    meetingPoint: String(formData.get("meetingPoint") ?? ""),
    meetingLat: String(formData.get("meetingLat") ?? ""),
    meetingLng: String(formData.get("meetingLng") ?? ""),
    meetingMaps: String(formData.get("meetingMaps") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    maxRiders: String(formData.get("maxRiders") ?? ""),
    distanceKm: String(formData.get("distanceKm") ?? ""),
    elevationM: String(formData.get("elevationM") ?? ""),
    routeUrl: String(formData.get("routeUrl") ?? ""),
  });
}

async function memberSession(locale: string) {
  const session = await getSession();
  if (!session || isAdmin(session)) {
    redirect(loginHref(locale, hrefs(locale).intranet));
  }
  return session;
}

export async function createRideAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const session = await memberSession(locale);
  const parsed = rideDraftFromForm(formData);
  if (!parsed.ok) return { error: rideError(locale, parsed.error) };
  const photos = formData
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);
  try {
    const id = await insertRide(session.id, parsed.draft);
    await saveRidePhotos(id, session.id, photos);
    if (parsed.draft.hostBike) await appendMemberBike(session.id, parsed.draft.hostBike);
    revalidateRides(locale, id);
    revalidatePath(`/${locale}/intranet/cuenta`);
    redirect(hrefs(locale).ride(id));
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: rideError(locale, "ride") };
  }
}

export async function updateRideAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const session = await memberSession(locale);
  const rideId = String(formData.get("rideId") ?? "");
  const ride = await getRide(rideId);
  if (!ride || !canManageHostedRide(session.id, ride)) return { error: rideError(locale, "ride") };
  const parsed = rideDraftFromForm(formData);
  if (!parsed.ok) return { error: rideError(locale, parsed.error) };
  const photos = formData
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);
  try {
    await updateRideRecord(rideId, session.id, parsed.draft);
    await saveRidePhotos(rideId, session.id, photos);
    if (parsed.draft.hostBike) await appendMemberBike(session.id, parsed.draft.hostBike);
    await notifyRideMembers(rideId, "updated");
    revalidateRides(locale, rideId);
    revalidatePath(`/${locale}/intranet/cuenta`);
    redirect(hrefs(locale).ride(rideId));
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: rideError(locale, "ride") };
  }
}

export async function cancelRideAction(formData: FormData): Promise<void> {
  const locale = localeFromForm(formData);
  const session = await memberSession(locale);
  const rideId = String(formData.get("rideId") ?? "");
  const ride = await getRide(rideId);
  if (!ride || !canManageHostedRide(session.id, ride)) return;
  try {
    await cancelRideRecord(rideId, session.id);
    await notifyRideMembers(rideId, "cancelled");
  } catch {
    return;
  }
  revalidateRides(locale, rideId);
  redirect(hrefs(locale).rides);
}

export async function requestRideSpotAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const session = await memberSession(locale);
  const rideId = String(formData.get("rideId") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  const ride = await getRide(rideId);
  if (!ride) return { error: rideError(locale, "ride") };
  const mine = await getMyRideRequest(rideId, session.id);
  if (
    !canRequestRideSpot({
      userId: session.id,
      hostId: ride.hostId,
      status: ride.status,
      joinStatus: mine?.status ?? null,
      acceptedCount: ride.acceptedCount,
      maxRiders: ride.maxRiders,
    })
  ) {
    if (session.id === ride.hostId) return { error: rideError(locale, "rideHost") };
    if (ride.status !== "open") return { error: rideError(locale, "rideClosed") };
    if (isRideFull(ride.acceptedCount, ride.maxRiders)) return { error: rideError(locale, "rideFull") };
    if (mine) return { error: rideError(locale, "rideExists") };
    return { error: rideError(locale, "ride") };
  }
  try {
    await insertJoinRequest(rideId, session.id, message);
  } catch (error) {
    const key = error instanceof Error ? error.message : "ride";
    return { error: rideError(locale, key) };
  }
  revalidateRides(locale, rideId);
  return { ok: true as const };
}

export async function cancelRideRequestAction(formData: FormData): Promise<void> {
  const locale = localeFromForm(formData);
  const session = await memberSession(locale);
  const requestId = String(formData.get("requestId") ?? "");
  const rideId = String(formData.get("rideId") ?? "");
  const mine = await getMyRideRequest(rideId, session.id);
  if (!mine || mine.id !== requestId || mine.status !== "pending") return;
  try {
    await updateJoinRequestStatus(requestId, "cancelled");
  } catch {
    return;
  }
  revalidateRides(locale, rideId);
}

export async function answerRideRequestAction(formData: FormData): Promise<void> {
  const locale = localeFromForm(formData);
  const session = await memberSession(locale);
  const requestId = String(formData.get("requestId") ?? "");
  const rideId = String(formData.get("rideId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (status !== "accepted" && status !== "declined") return;
  const ride = await getRide(rideId);
  if (!ride || ride.hostId !== session.id || ride.status !== "open") return;
  const requests = await listRideJoinRequests(rideId);
  const target = requests.find((item) => item.id === requestId);
  if (!target || target.status !== "pending") return;
  if (status === "accepted" && isRideFull(ride.acceptedCount, ride.maxRiders)) return;
  try {
    await updateJoinRequestStatus(requestId, status);
  } catch {
    return;
  }
  revalidateRides(locale, rideId);
}

export async function sendRideMessageAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const session = await memberSession(locale);
  const rideId = String(formData.get("rideId") ?? "");
  const body = String(formData.get("body") ?? "");
  const ride = await getRide(rideId);
  if (!ride) return { error: rideError(locale, "ride") };
  if (ride.status !== "open") return { error: rideError(locale, "rideClosed") };
  const mine = await getMyRideRequest(rideId, session.id);
  if (!canSeeRideChat(session.id, ride.hostId, mine?.status ?? null)) {
    return { error: rideError(locale, "rideChat") };
  }
  try {
    await insertRideMessage(rideId, session.id, body);
  } catch (error) {
    const key = error instanceof Error ? error.message : "rideChat";
    return { error: rideError(locale, key) };
  }
  revalidateRides(locale, rideId);
  return { ok: true as const };
}
