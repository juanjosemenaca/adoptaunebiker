export const MEMBER_INBOX_KINDS = ["idea", "sugerencia", "queja", "propuesta", "otro"] as const;
export const INBOX_KINDS = [...MEMBER_INBOX_KINDS, "aviso"] as const;
export type MemberInboxKind = (typeof MEMBER_INBOX_KINDS)[number];
export type InboxKind = (typeof INBOX_KINDS)[number];
export type InboxStatus = "open" | "closed";

export type InboxDraft = {
  subject: string;
  kind: InboxKind;
  body: string;
};

export type InboxDraftError = "subject" | "kind" | "body";

export type InboxThread = {
  id: string;
  memberId: string;
  memberName: string;
  subject: string;
  kind: InboxKind;
  status: InboxStatus;
  unreadForAdmin: boolean;
  unreadForMember: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InboxMessage = {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  fromAdmin: boolean;
  body: string;
  createdAt: string;
};

export function isInboxKind(value: string): value is InboxKind {
  return INBOX_KINDS.includes(value as InboxKind);
}

export function isInboxStatus(value: string): value is InboxStatus {
  return value === "open" || value === "closed";
}

export type AdminInboxDraft = {
  memberId: string;
  subject: string;
  kind: InboxKind;
  body: string;
};

export type AdminInboxDraftError = "subject" | "body" | "member";

export type InboxMemberFolder = {
  memberId: string;
  memberName: string;
  unread: number;
  threadCount: number;
  updatedAt: string;
  threads: InboxThread[];
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseInboxDraft(input: {
  subject?: string;
  kind?: string;
  body?: string;
}): InboxDraft | { error: InboxDraftError } {
  const subject = input.subject?.trim() ?? "";
  const body = input.body?.trim() ?? "";
  const kind = input.kind?.trim() ?? "";
  if (subject.length < 2 || subject.length > 120) return { error: "subject" };
  if (!MEMBER_INBOX_KINDS.includes(kind as MemberInboxKind)) return { error: "kind" };
  if (body.length < 1 || body.length > 2000) return { error: "body" };
  return { subject, kind: kind as MemberInboxKind, body };
}

export function parseInboxReply(body: string) {
  const text = body.trim();
  if (!text || text.length > 2000) return { error: "body" as const };
  return { body: text };
}

export function threadIsUnread(thread: Pick<InboxThread, "unreadForAdmin" | "unreadForMember">, admin: boolean) {
  return admin ? thread.unreadForAdmin : thread.unreadForMember;
}

export function canReplyToThread(status: InboxStatus) {
  return status === "open";
}

export function parseAdminInboxDraft(input: {
  memberId?: string;
  subject?: string;
  body?: string;
}): AdminInboxDraft | { error: AdminInboxDraftError } {
  const memberId = input.memberId?.trim() ?? "";
  const subject = input.subject?.trim() ?? "";
  const body = input.body?.trim() ?? "";
  if (!UUID_RE.test(memberId)) return { error: "member" };
  if (subject.length < 2 || subject.length > 120) return { error: "subject" };
  if (body.length < 1 || body.length > 2000) return { error: "body" };
  return { memberId, subject, body, kind: "aviso" };
}

export function groupInboxByMember(threads: InboxThread[]): InboxMemberFolder[] {
  const folders = new Map<string, InboxMemberFolder>();
  for (const thread of threads) {
    const current = folders.get(thread.memberId);
    if (!current) {
      folders.set(thread.memberId, {
        memberId: thread.memberId,
        memberName: thread.memberName,
        unread: thread.unreadForAdmin ? 1 : 0,
        threadCount: 1,
        updatedAt: thread.updatedAt,
        threads: [thread],
      });
      continue;
    }
    current.threads.push(thread);
    current.threadCount += 1;
    if (thread.unreadForAdmin) current.unread += 1;
    if (thread.updatedAt > current.updatedAt) current.updatedAt = thread.updatedAt;
    if (!current.memberName && thread.memberName) current.memberName = thread.memberName;
  }
  return [...folders.values()].sort((a, b) => {
    if (Boolean(a.unread) !== Boolean(b.unread)) return a.unread ? -1 : 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}
