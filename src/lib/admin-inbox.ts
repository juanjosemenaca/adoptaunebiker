import { logServerError } from "@/lib/log";
import { getAuthContext } from "@/lib/supabase/auth-context";
import {
  canReplyToThread,
  isInboxKind,
  isInboxStatus,
  parseInboxDraft,
  parseInboxReply,
  type InboxKind,
  type InboxMessage,
  type InboxStatus,
  type InboxThread,
} from "@/lib/admin-inbox-helpers";

export {
  INBOX_KINDS,
  MEMBER_INBOX_KINDS,
  canReplyToThread,
  isInboxKind,
  parseInboxDraft,
  parseInboxReply,
  threadIsUnread,
} from "@/lib/admin-inbox-helpers";
export type { InboxDraft, InboxDraftError, InboxKind, InboxMessage, InboxStatus, InboxThread } from "@/lib/admin-inbox-helpers";

type ProfileEmbed = { display_name: string | null; slug: string | null; kind?: string | null };

type ThreadRow = {
  id: string;
  member_id: string;
  subject: string;
  kind: string;
  status: string;
  unread_for_admin: boolean;
  unread_for_member: boolean;
  created_at: string;
  updated_at: string;
  member?: ProfileEmbed | ProfileEmbed[] | null;
};

type MessageRow = {
  id: string;
  thread_id: string;
  author_id: string;
  body: string;
  created_at: string;
  from_admin?: boolean | null;
  author?: ProfileEmbed | ProfileEmbed[] | null;
};

let extraFromAdminColumn = true;

const THREAD_SELECT =
  "id, member_id, subject, kind, status, unread_for_admin, unread_for_member, created_at, updated_at, member:profiles!admin_threads_member_id_fkey ( display_name, slug, kind )";

function oneEmbed<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function queryFailed(label: string, error: { code?: string; message?: string } | null) {
  if (!error) return;
  if (error.code === "42P01" || error.code === "PGRST205" || error.code === "42883") return;
  logServerError(label, error);
}

async function client() {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) return null;
  return { supabase, user };
}

function mapThread(row: ThreadRow): InboxThread {
  const member = oneEmbed(row.member);
  return {
    id: row.id,
    memberId: row.member_id,
    memberName: member?.display_name ?? "",
    subject: row.subject,
    kind: isInboxKind(row.kind) ? row.kind : "otro",
    status: isInboxStatus(row.status) ? row.status : "open",
    unreadForAdmin: Boolean(row.unread_for_admin),
    unreadForMember: Boolean(row.unread_for_member),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMessage(row: MessageRow, adminLabel: string): InboxMessage {
  const author = oneEmbed(row.author);
  const fromAdmin = Boolean(row.from_admin) || author?.kind === "admin";
  return {
    id: row.id,
    threadId: row.thread_id,
    authorId: row.author_id,
    authorName: fromAdmin ? adminLabel : author?.display_name ?? "",
    fromAdmin,
    body: row.body,
    createdAt: row.created_at,
  };
}

function messageSelect() {
  const extra = extraFromAdminColumn ? ", from_admin" : "";
  return `id, thread_id, author_id, body, created_at${extra}, author:profiles!admin_messages_author_id_fkey ( display_name, slug, kind )`;
}

export async function listMemberInbox(): Promise<InboxThread[]> {
  const auth = await client();
  if (!auth) return [];
  const { data, error } = await auth.supabase
    .from("admin_threads")
    .select(THREAD_SELECT)
    .eq("member_id", auth.user.id)
    .order("updated_at", { ascending: false });
  if (error || !data) {
    queryFailed("[listMemberInbox]", error);
    return [];
  }
  return data.map((row) => mapThread(row as ThreadRow));
}

export async function listAdminInbox(): Promise<InboxThread[]> {
  const auth = await client();
  if (!auth) return [];
  const { data, error } = await auth.supabase
    .from("admin_threads")
    .select(THREAD_SELECT)
    .order("unread_for_admin", { ascending: false })
    .order("updated_at", { ascending: false });
  if (error || !data) {
    queryFailed("[listAdminInbox]", error);
    return [];
  }
  return data.map((row) => mapThread(row as ThreadRow));
}

export async function countAdminInboxUnread() {
  const auth = await client();
  if (!auth) return 0;
  const { count, error } = await auth.supabase
    .from("admin_threads")
    .select("id", { count: "exact", head: true })
    .eq("unread_for_admin", true);
  if (error) {
    queryFailed("[countAdminInboxUnread]", error);
    return 0;
  }
  return count ?? 0;
}

export async function getInboxThread(id: string): Promise<InboxThread | null> {
  const auth = await client();
  if (!auth) return null;
  const { data, error } = await auth.supabase.from("admin_threads").select(THREAD_SELECT).eq("id", id).maybeSingle();
  if (error || !data) {
    queryFailed("[getInboxThread]", error);
    return null;
  }
  return mapThread(data as ThreadRow);
}

export async function listInboxMessages(threadId: string, adminLabel: string): Promise<InboxMessage[]> {
  const auth = await client();
  if (!auth) return [];
  let { data, error } = await auth.supabase
    .from("admin_messages")
    .select(messageSelect())
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  if (error?.code === "PGRST204" && extraFromAdminColumn) {
    extraFromAdminColumn = false;
    ({ data, error } = await auth.supabase
      .from("admin_messages")
      .select(messageSelect())
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true }));
  }
  if (error || !data) {
    queryFailed("[listInboxMessages]", error);
    return [];
  }
  return data.map((row) => mapMessage(row as unknown as MessageRow, adminLabel));
}

export async function notifyRideMembers(rideId: string, change: "updated" | "cancelled") {
  const auth = await client();
  if (!auth) return;
  const { error } = await auth.supabase.rpc("notify_ride_members", {
    p_ride_id: rideId,
    p_change: change,
  });
  if (!error) return;
  if (error.code === "PGRST202" || error.code === "42883") return;
  queryFailed("[notifyRideMembers]", error);
}

export async function createInboxThread(subject: string, kind: InboxKind, body: string) {
  const auth = await client();
  if (!auth) throw new Error("inbox");
  const draft = parseInboxDraft({ subject, kind, body });
  if ("error" in draft) throw new Error(draft.error);
  const { data, error } = await auth.supabase.rpc("open_admin_thread", {
    p_subject: draft.subject,
    p_kind: draft.kind,
    p_body: draft.body,
  });
  if (error || !data) {
    queryFailed("[createInboxThread]", error);
    throw new Error("inbox");
  }
  return String(data);
}

export async function insertInboxMessage(threadId: string, body: string) {
  const auth = await client();
  if (!auth) throw new Error("inbox");
  const parsed = parseInboxReply(body);
  if ("error" in parsed) throw new Error(parsed.error);
  const thread = await getInboxThread(threadId);
  if (!thread || !canReplyToThread(thread.status)) throw new Error("inboxClosed");
  const { error } = await auth.supabase.from("admin_messages").insert({
    thread_id: threadId,
    author_id: auth.user.id,
    body: parsed.body,
  });
  if (error) {
    queryFailed("[insertInboxMessage]", error);
    throw new Error("inbox");
  }
}

export async function markInboxThreadRead(threadId: string) {
  const auth = await client();
  if (!auth) return;
  const { error } = await auth.supabase.rpc("mark_admin_thread_read", { target: threadId });
  queryFailed("[markInboxThreadRead]", error);
}

export async function setInboxThreadStatus(threadId: string, status: InboxStatus) {
  const auth = await client();
  if (!auth) throw new Error("inbox");
  const { error } = await auth.supabase.rpc("set_admin_thread_status", {
    target: threadId,
    next_status: status,
  });
  if (error) {
    queryFailed("[setInboxThreadStatus]", error);
    throw new Error("inbox");
  }
}
