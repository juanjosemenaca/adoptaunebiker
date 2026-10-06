import { cache } from "react";
import { isDiscipline, parsePracticeList } from "@/lib/labels";
import { parseSignupPlace } from "@/lib/places";
import { decodeSignupMeta } from "@/lib/signup-meta";
import { getSignupRequest, updateSignupInboxStatus } from "@/lib/signup-requests";
import { memberStamp } from "@/lib/stamp";
import { getAuthContext } from "@/lib/supabase/auth-context";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Discipline, MemberStatus, Practice } from "@/lib/types";

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
  bio: string;
  lookingFor: string;
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
  bike: string;
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
  bio?: string | null;
  looking_for?: string | null;
  created_at?: string | null;
  member_status?: string | null;
};

function memberDiscipline(veteranIn: Practice[], beginnerIn: Practice[], interestedIn: Discipline[]) {
  const fromLevels = [...veteranIn, ...beginnerIn].find(isDiscipline);
  return fromLevels ?? interestedIn[0] ?? "carretera";
}

function toMember(row: MemberRow): CommunityMember {
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
    bike: row.bike ?? "",
    bio: row.bio ?? "",
    lookingFor: decodeSignupMeta(row.looking_for ?? "").lookingFor,
    createdAt: row.created_at ?? "",
    memberStatus: row.member_status === "inactive" ? "inactive" : "active",
  };
}

export { memberStamp };

export const listMembers = cache(async (): Promise<CommunityMember[]> => {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) return [];
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, slug, display_name, last_name, email, city, country, veteran_in, beginner_in, interested_in, bike, bio, looking_for, created_at, member_status",
    )
    .eq("kind", "user")
    .order("created_at", { ascending: false });
  if (!error && data) return data.map((row) => toMember(row as MemberRow));

  const fallback = await supabase
    .from("profiles")
    .select(
      "id, slug, display_name, last_name, email, city, country, veteran_in, beginner_in, interested_in, bike, bio, looking_for, created_at",
    )
    .eq("kind", "user")
    .order("created_at", { ascending: false });
  if (fallback.error || !fallback.data) return [];
  return fallback.data.map((row) => toMember(row as MemberRow));
});

export async function getMember(id: string): Promise<CommunityMember | null> {
  const members = await listMembers();
  return members.find((item) => item.id === id) ?? null;
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
  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: input.name.trim(),
      last_name: input.lastName.trim() || null,
      country: input.country.trim() || null,
      city: input.city.trim(),
      role: veteranIn.length ? "mentor" : "ebiker",
      discipline,
      veteran_in: veteranIn,
      beginner_in: beginnerIn,
      interested_in: interestedIn,
      bike: input.bike.trim() || null,
      bio: input.bio.trim() || null,
      looking_for: lookingFor || null,
      tags: interestedIn.length ? interestedIn : [discipline],
    })
    .eq("id", id)
    .eq("kind", "user")
    .select("id");
  if (error || !data?.length) {
    const failed = new Error(error?.message || "update_failed");
    failed.name = "MemberAdminError";
    throw failed;
  }
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
  const { data, error } = await supabase
    .from("profiles")
    .update({ member_status: status })
    .eq("id", id)
    .eq("kind", "user")
    .select("id");
  if (error || !data?.length) {
    const failed = new Error(error?.message || "status_failed");
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
