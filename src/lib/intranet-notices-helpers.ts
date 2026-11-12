export type IntranetNoticeKind = "join" | "chat" | "inbox";

export type IntranetNotice = {
  id: string;
  kind: IntranetNoticeKind;
  targetId: string;
  title: string;
  name: string;
  at: string;
};

export type JoinNoticeSeed = {
  id: string;
  rideId: string;
  rideTitle: string;
  riderName: string;
  at: string;
};

export type ChatNoticeSeed = {
  rideId: string;
  rideTitle: string;
  at: string;
};

export type InboxNoticeSeed = {
  id: string;
  subject: string;
  at: string;
};

export function mergeIntranetNotices(input: {
  joins: JoinNoticeSeed[];
  chats: ChatNoticeSeed[];
  inbox: InboxNoticeSeed[];
}): IntranetNotice[] {
  const notices: IntranetNotice[] = [
    ...input.joins.map((item) => ({
      id: `join:${item.id}`,
      kind: "join" as const,
      targetId: item.rideId,
      title: item.rideTitle,
      name: item.riderName,
      at: item.at,
    })),
    ...input.chats.map((item) => ({
      id: `chat:${item.rideId}`,
      kind: "chat" as const,
      targetId: item.rideId,
      title: item.rideTitle,
      name: "",
      at: item.at,
    })),
    ...input.inbox.map((item) => ({
      id: `inbox:${item.id}`,
      kind: "inbox" as const,
      targetId: item.id,
      title: item.subject,
      name: "",
      at: item.at,
    })),
  ];
  return notices.sort((a, b) => {
    if (a.kind !== b.kind) {
      const order = { join: 0, chat: 1, inbox: 2 };
      return order[a.kind] - order[b.kind];
    }
    return (b.at || "").localeCompare(a.at || "");
  });
}
