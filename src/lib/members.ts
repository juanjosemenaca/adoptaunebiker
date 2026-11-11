import { cache } from "react";
import { AvatarError, avatarExt, checkAvatarFile } from "@/lib/avatar";
import { logServerError } from "@/lib/log";
import { isSeedDemoMember } from "@/lib/demo-auth";
import {
  garageNames,
  newMemberBike,
  parseMemberBikes,
  parseMemberGarage,
  primaryBike,
  primaryBikeName,
  serializeGarage,
  type MemberBike,
} from "@/lib/bikes";
import { isDiscipline, parsePracticeList } from "@/lib/labels";
import { parseSignupPlace } from "@/lib/places";
import { decodeSignupMeta } from "@/lib/signup-meta";
import { getSignupRequest, updateSignupInboxStatus } from "@/lib/signup-requests";
import { memberStamp } from "@/lib/stamp";
import { getAuthContext } from "@/lib/supabase/auth-context";
import { configuredSupabaseUrl, hasSupabaseEnv } from "@/lib/supabase/env";
import type { Discipline, MemberStatus, Practice, SessionUser } from "@/lib/types";

export type CommunityMember = {
  id: string;
  slug: string;
  name: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  veteranIn: Practice[];
  beginnerIn: Practice[];
  interestedIn: Discipline[];
  bike: string;
  bikes: string[];
  garage: MemberBike[];
  bio: string;
  lookingFor: string;
  avatarUrl: string;
  avatarPath: string;
  createdAt: string;
  memberStatus: MemberStatus;
};

export type MemberNote = {
  id: string;
  body: string;
  authorName: string;
  createdAt: string;
};

export type MemberProfileInput = {
  name: string;
  lastName: string;
  country: string;
  city: string;
  veteranIn: Practice[];
  beginnerIn: Practice[];
  interestedIn: Discipline[];
  bike?: string;
  bikes?: string[];
  bio: string;
  lookingFor: string;
};

type MemberRow = {
  id: string;
  slug: string;
  display_name: string;
  last_name?: string | null;
  email?: string | null;
  city: string;
  country?: string | null;
  veteran_in?: string[] | null;
  beginner_in?: string[] | null;
  interested_in?: string[] | null;
  bike?: string | null;
  bikes?: string[] | null;
  bike_garage?: unknown;
  bio?: string | null;
  looking_for?: string | null;
  avatar_url?: string | null;
  avatar_path?: string | null;
  created_at?: string | null;
  member_status?: string | null;
};

function memberDiscipline(veteranIn: Practice[], beginnerIn: Practice[], interestedIn: Discipline[]) {
  const fromLevels = [...veteranIn, ...beginnerIn].find(isDiscipline);
  return fromLevels ?? interestedIn[0] ?? "carretera";
}

function missingProfileColumn(error: { code?: string } | null) {
  const code = error?.code ?? "";
  return code === "PGRST204" || code === "42703";
}

function bikePhotoUrl(path: string) {
  const base = configuredSupabaseUrl().replace(/\/$/, "");
  const clean = path.replace(/^\/+/, "");
  return clean && base ? `${base}/storage/v1/object/public/bike-photos/${clean}` : "";
}

function hydrateGarage(row: MemberRow): MemberBike[] {
  const names = parseMemberBikes(row.bikes ?? (row.bike ? [row.bike] : []));
  return parseMemberGarage(row.bike_garage, names).map((item) => ({
    ...item,
    photoUrl: item.photoUrl || bikePhotoUrl(item.photoPath),
  }));
}

function toMember(row: MemberRow): CommunityMember {
  const garage = hydrateGarage(row);
  const names = garageNames(garage);
  return {
    id: row.id,
    slug: row.slug,
    name: row.display_name,
    lastName: row.last_name ?? "",
    email: row.email ?? "",
    city: row.city,
    country: row.country ?? "",
    veteranIn: parsePracticeList(row.veteran_in ?? []),
    beginnerIn: parsePracticeList(row.beginner_in ?? []),
    interestedIn: (row.interested_in ?? []).filter(isDiscipline),
    bike: primaryBikeName(garage, row.bike ?? ""),
    bikes: names.length ? names : parseMemberBikes(row.bikes ?? (row.bike ? [row.bike] : [])),
    garage,
    bio: row.bio ?? "",
    lookingFor: decodeSignupMeta(row.looking_for ?? "").lookingFor,
    avatarUrl: row.avatar_url ?? "",
    avatarPath: row.avatar_path ?? "",
    createdAt: row.created_at ?? "",
    memberStatus: row.member_status === "inactive" ? "inactive" : "active",
  };
}

export { memberStamp };

const MEMBER_COLUMNS =
  "id, slug, display_name, last_name, email, city, country, veteran_in, beginner_in, interested_in, bike, bikes, bike_garage, bio, looking_for, avatar_url, avatar_path, created_at, member_status";
const MEMBER_COLUMNS_NO_GARAGE =
  "id, slug, display_name, last_name, email, city, country, veteran_in, beginner_in, interested_in, bike, bikes, bio, looking_for, avatar_url, avatar_path, created_at, member_status";
const MEMBER_COLUMNS_NO_BIKES =
  "id, slug, display_name, last_name, email, city, country, veteran_in, beginner_in, interested_in, bike, bio, looking_for, avatar_url, avatar_path, created_at, member_status";
const MEMBER_COLUMNS_MIN =
  "id, slug, display_name, last_name, email, city, country, veteran_in, beginner_in, interested_in, bike, bio, looking_for, created_at";

async function selectProfileRows(id?: string): Promise<MemberRow[]> {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) return [];
  const selects = [MEMBER_COLUMNS, MEMBER_COLUMNS_NO_GARAGE, MEMBER_COLUMNS_NO_BIKES, MEMBER_COLUMNS_MIN];
  for (const columns of selects) {
    const query = supabase.from("profiles").select(columns);
    if (id) {
      const { data, error } = await query.eq("id", id).maybeSingle();
      if (!error) return data ? [data as unknown as MemberRow] : [];
      if (!missingProfileColumn(error)) return [];
      continue;
    }
    const { data, error } = await query.eq("kind", "user").order("created_at", { ascending: false });
    if (!error && data) return data as unknown as MemberRow[];
    if (!missingProfileColumn(error)) return [];
  }
  return [];
}

export const listMembers = cache(async (): Promise<CommunityMember[]> => {
  const rows = await selectProfileRows();
  return rows.filter((row) => !isSeedDemoMember(row)).map((row) => toMember(row));
});

export async function getMember(id: string): Promise<CommunityMember | null> {
  const members = await listMembers();
  return members.find((item) => item.id === id) ?? null;
}

export function memberFromSession(session: SessionUser): CommunityMember {
  const discipline = session.discipline;
  return {
    id: session.id,
    slug: session.slug,
    name: session.name,
    lastName: session.lastName ?? "",
    email: session.email ?? "",
    city: session.city,
    country: session.country ?? "",
    veteranIn: session.role === "mentor" ? [discipline] : [],
    beginnerIn: session.role === "mentor" ? [] : [discipline],
    interestedIn: [discipline],
    bike: session.bike,
    bikes: parseMemberBikes(session.bike ? [session.bike] : []),
    garage: parseMemberGarage([], session.bike ? [session.bike] : []),
    bio: session.bio,
    lookingFor: decodeSignupMeta(session.lookingFor).lookingFor,
    avatarUrl: "",
    avatarPath: "",
    createdAt: "",
    memberStatus: session.memberStatus === "inactive" ? "inactive" : "active",
  };
}

export async function getMemberById(id: string): Promise<CommunityMember | null> {
  const rows = await selectProfileRows(id);
  return rows[0] ? toMember(rows[0]) : null;
}

export async function uploadMemberAvatar(file: File) {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) throw new AvatarError("failed");
  const problem = checkAvatarFile(file);
  if (problem) throw new AvatarError(problem);
  const ext = avatarExt(file.type, file.name) || "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const current = await supabase
    .from("profiles")
    .select("avatar_path")
    .eq("id", user.id)
    .maybeSingle();
  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (uploadError) throw new AvatarError("failed");
  const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(path);
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl.publicUrl, avatar_path: path })
    .eq("id", user.id);
  if (error) {
    await supabase.storage.from("avatars").remove([path]);
    throw new AvatarError("failed");
  }
  const previous = String(current.data?.avatar_path ?? "");
  if (previous && previous !== path) {
    await supabase.storage.from("avatars").remove([previous]);
  }
}

export async function removeMemberAvatar() {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) throw new AvatarError("failed");
  const current = await supabase
    .from("profiles")
    .select("avatar_path")
    .eq("id", user.id)
    .maybeSingle();
  const previous = String(current.data?.avatar_path ?? "");
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null, avatar_path: null })
    .eq("id", user.id);
  if (error) throw new AvatarError("failed");
  if (previous) await supabase.storage.from("avatars").remove([previous]);
}

export async function updateMember(id: string, input: MemberProfileInput) {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) {
    const denied = new Error("not_admin");
    denied.name = "MemberAdminError";
    throw denied;
  }
  const veteranIn = parsePracticeList(input.veteranIn);
  const beginnerIn = parsePracticeList(input.beginnerIn).filter((item) => !veteranIn.includes(item));
  const interestedIn = input.interestedIn.filter(isDiscipline);
  const discipline = memberDiscipline(veteranIn, beginnerIn, interestedIn);
  const lookingFor = decodeSignupMeta(input.lookingFor).lookingFor.trim();
  const payload: Record<string, unknown> = {
    display_name: input.name.trim(),
    last_name: input.lastName.trim() || null,
    country: input.country.trim() || null,
    city: input.city.trim(),
    role: veteranIn.length ? "mentor" : "ebiker",
    discipline,
    veteran_in: veteranIn,
    beginner_in: beginnerIn,
    interested_in: interestedIn,
    bio: input.bio.trim() || null,
    looking_for: lookingFor || null,
    tags: interestedIn.length ? interestedIn : [discipline],
  };
  if (input.bikes || input.bike) {
    const bikes = parseMemberBikes(input.bikes?.length ? input.bikes : input.bike ? [input.bike] : []);
    payload.bike = primaryBike(bikes) || null;
    payload.bikes = bikes;
  }
  let { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", id)
    .eq("kind", "user")
    .select("id");
  if (error && missingProfileColumn(error) && "bikes" in payload) {
    const { bikes: _bikes, ...withoutBikes } = payload;
    ({ data, error } = await supabase
      .from("profiles")
      .update(withoutBikes)
      .eq("id", id)
      .eq("kind", "user")
      .select("id"));
  }
  if (error || !data?.length) {
    const failed = new Error(error?.message || "update_failed");
    failed.name = "MemberAdminError";
    throw failed;
  }
}

export async function appendMemberBike(memberId: string, name: string) {
  const member = await getMemberById(memberId);
  if (!member) return;
  const extra = parseMemberBikes([name])[0];
  if (!extra) return;
  if (member.garage.some((item) => item.name.toLowerCase() === extra.toLowerCase())) return;
  const garage = [...member.garage, { ...newMemberBike(extra), name: extra }];
  try {
    await writeMemberGarage(memberId, garage);
  } catch (error) {
    logServerError("[appendMemberBike]", error);
  }
}

type GarageFile = { bikeId: string; file: File };

export async function saveMemberGarage(memberId: string, garage: MemberBike[], files: GarageFile[], clearIds: string[]) {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) {
    const denied = new Error("not_admin");
    denied.name = "MemberAdminError";
    throw denied;
  }
  const member = await getMemberById(memberId);
  const previous = member?.garage ?? [];
  const canUpload = user.id === memberId;
  const kept = new Set(garage.map((item) => item.id));
  const next = garage.map((item) => ({ ...item }));
  const stalePaths: string[] = [];

  for (const item of previous) {
    if (!kept.has(item.id) && item.photoPath) stalePaths.push(item.photoPath);
  }

  for (const item of next) {
    const clear = clearIds.includes(item.id);
    const incoming = canUpload ? files.find((file) => file.bikeId === item.id) : undefined;
    if (incoming) {
      const problem = checkAvatarFile(incoming.file);
      if (problem) throw new AvatarError(problem);
      const uploaded = await uploadBikePhoto(supabase, memberId, item.id, incoming.file);
      if (item.photoPath && item.photoPath !== uploaded.path) stalePaths.push(item.photoPath);
      item.photoPath = uploaded.path;
      item.photoUrl = uploaded.url;
      continue;
    }
    if (clear) {
      if (item.photoPath) stalePaths.push(item.photoPath);
      item.photoPath = "";
      item.photoUrl = "";
    }
  }

  await writeMemberGarage(memberId, next);
  if (canUpload && stalePaths.length) {
    await supabase.storage.from("bike-photos").remove(stalePaths);
  }
}

async function writeMemberGarage(memberId: string, garage: MemberBike[]) {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) return;
  const names = garageNames(garage);
  const payload = {
    bike: primaryBikeName(garage) || null,
    bikes: names,
    bike_garage: serializeGarage(garage),
  };
  let { error } = await supabase.from("profiles").update(payload).eq("id", memberId).eq("kind", "user");
  if (error && missingProfileColumn(error)) {
    const { bike_garage: _garage, ...withoutGarage } = payload;
    ({ error } = await supabase.from("profiles").update(withoutGarage).eq("id", memberId).eq("kind", "user"));
  }
  if (error && missingProfileColumn(error)) {
    ({ error } = await supabase
      .from("profiles")
      .update({ bike: payload.bike })
      .eq("id", memberId)
      .eq("kind", "user"));
  }
  if (error) {
    logServerError("[writeMemberGarage]", error);
    const failed = new Error(error.message || "garage_failed");
    failed.name = "MemberAdminError";
    throw failed;
  }
}

async function uploadBikePhoto(
  supabase: Awaited<ReturnType<typeof getAuthContext>>["supabase"],
  ownerId: string,
  bikeId: string,
  file: File,
) {
  if (!supabase) throw new AvatarError("failed");
  const ext = avatarExt(file.type, file.name) || "jpg";
  const path = `${ownerId}/${bikeId}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from("bike-photos").upload(path, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) {
    logServerError("[uploadBikePhoto]", error);
    throw new AvatarError("failed");
  }
  const { data } = supabase.storage.from("bike-photos").getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function listMemberNotes(memberId: string): Promise<MemberNote[]> {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) return [];
  const { data, error } = await supabase
    .from("member_notes")
    .select("id, body, author_name, created_at")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id as string,
    body: String(row.body ?? ""),
    authorName: String(row.author_name ?? ""),
    createdAt: String(row.created_at ?? ""),
  }));
}

export async function addMemberNote(memberId: string, body: string, authorName: string) {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) {
    const denied = new Error("not_admin");
    denied.name = "MemberAdminError";
    throw denied;
  }
  const text = body.trim();
  if (!text) {
    const empty = new Error("note_empty");
    empty.name = "MemberAdminError";
    throw empty;
  }
  const { error } = await supabase.from("member_notes").insert({
    member_id: memberId,
    author_id: user.id,
    author_name: authorName.trim() || "Admin",
    body: text.slice(0, 2000),
  });
  if (error) {
    const failed = new Error(error.message || "note_failed");
    failed.name = "MemberAdminError";
    throw failed;
  }
}

export async function deleteMemberNote(noteId: string) {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) {
    const denied = new Error("not_admin");
    denied.name = "MemberAdminError";
    throw denied;
  }
  const { error } = await supabase.from("member_notes").delete().eq("id", noteId);
  if (error) {
    const failed = new Error(error.message || "note_delete_failed");
    failed.name = "MemberAdminError";
    throw failed;
  }
}

export async function setMemberStatus(id: string, status: MemberStatus) {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) {
    const denied = new Error("not_admin");
    denied.name = "MemberAdminError";
    throw denied;
  }
  const stamped =
    status === "inactive"
      ? { member_status: status, deactivated_at: new Date().toISOString() }
      : { member_status: status, deactivated_at: null };
  const withStamp = await supabase
    .from("profiles")
    .update(stamped)
    .eq("id", id)
    .eq("kind", "user")
    .select("id");
  if (!withStamp.error && withStamp.data?.length) return;

  const { data, error } = await supabase
    .from("profiles")
    .update({ member_status: status })
    .eq("id", id)
    .eq("kind", "user")
    .select("id");
  if (error || !data?.length) {
    const failed = new Error(error?.message || withStamp.error?.message || "status_failed");
    failed.name = "MemberAdminError";
    throw failed;
  }
}

export async function resetMemberPassword(id: string) {
  const member = await getMember(id);
  if (!member) {
    const missing = new Error("member_missing");
    missing.name = "MemberAdminError";
    throw missing;
  }
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) {
    const denied = new Error("not_admin");
    denied.name = "MemberAdminError";
    throw denied;
  }
  const { error } = await supabase.rpc("reset_member_password", { member_id: id });
  if (error) {
    const failed = new Error(error.message || "reset_failed");
    failed.name = "MemberAdminError";
    throw failed;
  }
  return member;
}

export async function approveSignupRequest(id: string) {
  const request = await getSignupRequest(id);
  if (!request) {
    const missing = new Error("request_missing");
    missing.name = "ApproveSignupError";
    throw missing;
  }
  if (request.inboxStatus === "accepted") {
    return { request, created: false as const };
  }

  const place = parseSignupPlace(request.city);
  const veteranIn = request.veteranIn;
  const beginnerIn = request.beginnerIn;
  const interestedIn = request.interestedIn;
  const displayName = request.name.trim();

  if (!hasSupabaseEnv()) {
    await updateSignupInboxStatus(id, "accepted");
    return { request, created: true as const, local: true as const };
  }

  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) {
    const denied = new Error("not_admin");
    denied.name = "ApproveSignupError";
    throw denied;
  }

  const { error } = await supabase.rpc("approve_signup_request", {
    request_id: id,
    member_display_name: displayName,
    member_last_name: request.lastName,
    member_country: place.country,
    member_city: place.city || request.city,
    member_role: request.role,
    member_discipline: memberDiscipline(veteranIn, beginnerIn, interestedIn),
    member_veteran_in: veteranIn,
    member_beginner_in: beginnerIn,
    member_interested_in: interestedIn,
    member_bike: request.bike,
    member_bio: request.bio,
    member_looking_for: request.lookingFor,
  });

  if (error) {
    const failed = new Error(error.message || "approve_failed");
    failed.name = "ApproveSignupError";
    throw failed;
  }

  return { request, created: true as const };
}
