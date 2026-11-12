import { cache } from "react";
import { listMemberInbox } from "@/lib/admin-inbox";
import {
  mergeIntranetNotices,
  type ChatNoticeSeed,
  type InboxNoticeSeed,
  type IntranetNotice,
  type JoinNoticeSeed,
} from "@/lib/intranet-notices-helpers";
import { logServerError } from "@/lib/log";
import { listHostedRides, listMyJoinRequests } from "@/lib/rides";
import { getAuthContext } from "@/lib/supabase/auth-context";

export type { IntranetNotice, IntranetNoticeKind } from "@/lib/intranet-notices-helpers";
export { mergeIntranetNotices } from "@/lib/intranet-notices-helpers";

function missingTable(error: { code?: string } | null) {
  return error?.code === "42P01" || error?.code === "PGRST205";
}

function queryFailed(label: string, error: { code?: string; message?: string } | null) {
  if (!error) return;
  if (missingTable(error) || error.code === "PGRST204" || error.code === "42883") return;
  logServerError(label, error);
}

export const listIntranetNotices = cache(async (): Promise<IntranetNotice[]> => {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) return [];

  const [hosted, mine, inbox] = await Promise.all([
    listHostedRides(user.id),
    listMyJoinRequests(user.id),
    listMemberInbox(),
  ]);

  const hostedOpen = hosted.filter((ride) => ride.status === "open");
  const hostedIds = hostedOpen.map((ride) => ride.id);
  const titles = new Map(hosted.map((ride) => [ride.id, ride.title]));
  const groupIds = new Set(hostedIds);

  for (const row of mine) {
    if (row.status !== "accepted" || !row.ride || row.ride.status === "cancelled") continue;
    groupIds.add(row.ride.id);
    titles.set(row.ride.id, row.ride.title);
  }

  let joins: JoinNoticeSeed[] = [];
  if (hostedIds.length > 0) {
    const { data, error } = await supabase
      .from("ride_join_requests")
      .select(
        "id, ride_id, created_at, rider:profiles!ride_join_requests_rider_id_fkey ( display_name )",
      )
      .in("ride_id", hostedIds)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (error) {
      queryFailed("[listIntranetNotices joins]", error);
    } else {
      joins = (data ?? []).map((row) => {
        const rider = Array.isArray(row.rider) ? row.rider[0] : row.rider;
        return {
          id: String(row.id),
          rideId: String(row.ride_id),
          rideTitle: titles.get(String(row.ride_id)) ?? "",
          riderName: String(rider?.display_name ?? "").trim(),
          at: String(row.created_at ?? ""),
        };
      });
    }
  }

  const chats = await unreadRideChats(supabase, user.id, [...groupIds], titles);
  const inboxSeeds: InboxNoticeSeed[] = inbox
    .filter((thread) => thread.unreadForMember)
    .map((thread) => ({
      id: thread.id,
      subject: thread.subject,
      at: thread.updatedAt,
    }));

  return mergeIntranetNotices({ joins, chats, inbox: inboxSeeds });
});

async function unreadRideChats(
  supabase: NonNullable<Awaited<ReturnType<typeof getAuthContext>>["supabase"]>,
  userId: string,
  rideIds: string[],
  titles: Map<string, string>,
): Promise<ChatNoticeSeed[]> {
  if (rideIds.length === 0) return [];

  const [{ data: messages, error: messageError }, { data: reads, error: readError }] = await Promise.all([
    supabase
      .from("ride_messages")
      .select("ride_id, created_at")
      .in("ride_id", rideIds)
      .neq("author_id", userId)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("ride_chat_reads").select("ride_id, seen_at").eq("user_id", userId).in("ride_id", rideIds),
  ]);

  if (messageError) {
    queryFailed("[listIntranetNotices chats]", messageError);
    return [];
  }
  if (readError) {
    queryFailed("[listIntranetNotices reads]", readError);
    if (missingTable(readError)) return [];
  }

  const seen = new Map<string, string>();
  for (const row of reads ?? []) {
    seen.set(String(row.ride_id), String(row.seen_at ?? ""));
  }

  const latest = new Map<string, string>();
  for (const row of messages ?? []) {
    const rideId = String(row.ride_id);
    if (latest.has(rideId)) continue;
    latest.set(rideId, String(row.created_at ?? ""));
  }

  const chats: ChatNoticeSeed[] = [];
  for (const [rideId, at] of latest) {
    const lastSeen = seen.get(rideId) ?? "";
    if (lastSeen && lastSeen >= at) continue;
    chats.push({ rideId, rideTitle: titles.get(rideId) ?? "", at });
  }
  return chats;
}

export async function markRideChatSeen(rideId: string) {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user || !rideId) return;
  const { error } = await supabase.from("ride_chat_reads").upsert({
    user_id: user.id,
    ride_id: rideId,
    seen_at: new Date().toISOString(),
  });
  queryFailed("[markRideChatSeen]", error);
}
