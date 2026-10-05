import type { Dictionary } from "@/i18n/types";
import type { SignupInboxStatus } from "@/lib/types";

export function inboxStatusLabel(t: Dictionary, status: SignupInboxStatus) {
  if (status === "unread") return t.admin.statusUnread;
  if (status === "read") return t.admin.statusRead;
  if (status === "in_analysis") return t.admin.statusAnalysis;
  if (status === "rejected") return t.admin.statusRejected;
  return t.admin.statusAccepted;
}
