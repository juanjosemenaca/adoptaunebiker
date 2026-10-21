export const retentionMonths = 6;

export type RetentionSignupStatus = "pending" | "approved" | "rejected";
export type RetentionInboxStatus = "unread" | "read" | "in_analysis" | "rejected" | "accepted";
export type RetentionMemberStatus = "active" | "inactive";
export type RetentionAccountKind = "admin" | "user";

export type RetentionSignupRow = {
  id: string;
  createdAt: string;
  status?: RetentionSignupStatus | null;
  inboxStatus?: RetentionInboxStatus | null;
  rejectedAt?: string | null;
  retentionHold?: boolean;
  acceptedMemberId?: string | null;
  anonymizedAt?: string | null;
  hasMatchingMember?: boolean;
};

export type RetentionMemberRow = {
  id: string;
  kind: RetentionAccountKind;
  memberStatus: RetentionMemberStatus;
  deactivatedAt?: string | null;
  retentionHold?: boolean;
};

export type RetentionDecision = {
  id: string;
  entityType: "signup_request" | "member";
  purge: boolean;
  anonymize: boolean;
  reason: string;
};

const pendingInbox: RetentionInboxStatus[] = ["unread", "read", "in_analysis"];

/** Matches PostgreSQL `timestamp - interval 'N months'` (clamps 31-day months). */
export function monthsAgo(now: Date, months: number) {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() - months;
  const day = now.getUTCDate();
  const first = new Date(
    Date.UTC(year, month, 1, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()),
  );
  const lastDay = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  first.setUTCDate(Math.min(day, lastDay));
  return first;
}

export function retentionHorizon(now = new Date()) {
  return monthsAgo(now, retentionMonths);
}

function parseInstant(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isPastHorizon(value: string | null | undefined, now: Date) {
  const instant = parseInstant(value);
  if (!instant) return false;
  return instant.getTime() <= retentionHorizon(now).getTime();
}

export function isRejectedSignup(row: RetentionSignupRow) {
  if (row.inboxStatus === "accepted" || row.status === "approved") return false;
  return row.inboxStatus === "rejected" || row.status === "rejected";
}

export function isPendingSignup(row: RetentionSignupRow) {
  if (isRejectedSignup(row)) return false;
  if (row.inboxStatus === "accepted" || row.status === "approved") return false;
  return !row.inboxStatus || pendingInbox.includes(row.inboxStatus) || row.status === "pending";
}

export function isAcceptedSignup(row: RetentionSignupRow) {
  return row.inboxStatus === "accepted" || row.status === "approved";
}

export function decideRejectedSignup(row: RetentionSignupRow, now = new Date()): RetentionDecision {
  if (isAcceptedSignup(row)) {
    return { id: row.id, entityType: "signup_request", purge: false, anonymize: false, reason: "accepted_kept" };
  }
  if (isPendingSignup(row)) {
    return { id: row.id, entityType: "signup_request", purge: false, anonymize: false, reason: "pending_kept" };
  }
  if (!isRejectedSignup(row)) {
    return { id: row.id, entityType: "signup_request", purge: false, anonymize: false, reason: "not_rejected" };
  }
  if (row.retentionHold) {
    return { id: row.id, entityType: "signup_request", purge: false, anonymize: false, reason: "retention_hold" };
  }
  if (!parseInstant(row.rejectedAt)) {
    return { id: row.id, entityType: "signup_request", purge: false, anonymize: false, reason: "rejected_at_missing" };
  }
  if (!isPastHorizon(row.rejectedAt, now)) {
    return { id: row.id, entityType: "signup_request", purge: false, anonymize: false, reason: "rejected_too_recent" };
  }
  return {
    id: row.id,
    entityType: "signup_request",
    purge: true,
    anonymize: false,
    reason: "rejected_older_than_six_months",
  };
}

export function decideAcceptedSignup(row: RetentionSignupRow, now = new Date()): RetentionDecision {
  if (!isAcceptedSignup(row)) {
    return { id: row.id, entityType: "signup_request", purge: false, anonymize: false, reason: "not_accepted" };
  }
  if (row.retentionHold) {
    return { id: row.id, entityType: "signup_request", purge: false, anonymize: false, reason: "retention_hold" };
  }
  if (row.anonymizedAt) {
    return { id: row.id, entityType: "signup_request", purge: false, anonymize: false, reason: "already_anonymized" };
  }
  if (row.acceptedMemberId || row.hasMatchingMember) {
    return { id: row.id, entityType: "signup_request", purge: false, anonymize: false, reason: "accepted_linked_kept" };
  }
  if (!isPastHorizon(row.createdAt, now)) {
    return { id: row.id, entityType: "signup_request", purge: false, anonymize: false, reason: "accepted_too_recent" };
  }
  return {
    id: row.id,
    entityType: "signup_request",
    purge: false,
    anonymize: true,
    reason: "accepted_orphan_anonymize",
  };
}

export function decideInactiveMember(row: RetentionMemberRow, now = new Date()): RetentionDecision {
  if (row.kind === "admin") {
    return { id: row.id, entityType: "member", purge: false, anonymize: false, reason: "admin_kept" };
  }
  if (row.memberStatus !== "inactive") {
    return { id: row.id, entityType: "member", purge: false, anonymize: false, reason: "active_kept" };
  }
  if (row.retentionHold) {
    return { id: row.id, entityType: "member", purge: false, anonymize: false, reason: "retention_hold" };
  }
  if (!parseInstant(row.deactivatedAt)) {
    return { id: row.id, entityType: "member", purge: false, anonymize: false, reason: "deactivated_at_missing" };
  }
  if (!isPastHorizon(row.deactivatedAt, now)) {
    return { id: row.id, entityType: "member", purge: false, anonymize: false, reason: "inactive_too_recent" };
  }
  return {
    id: row.id,
    entityType: "member",
    purge: true,
    anonymize: true,
    reason: "inactive_older_than_six_months",
  };
}

export function planRetentionPurge(
  input: { signups?: RetentionSignupRow[]; members?: RetentionMemberRow[] },
  now = new Date(),
) {
  const signups = (input.signups ?? []).map((row) =>
    isAcceptedSignup(row) ? decideAcceptedSignup(row, now) : decideRejectedSignup(row, now),
  );
  const members = (input.members ?? []).map((row) => decideInactiveMember(row, now));
  return {
    now: now.toISOString(),
    horizon: retentionHorizon(now).toISOString(),
    dryRun: true as const,
    signups,
    members,
    purgeSignupIds: signups.filter((item) => item.purge).map((item) => item.id),
    purgeMemberIds: members.filter((item) => item.purge).map((item) => item.id),
    anonymizeSignupIds: signups.filter((item) => item.anonymize).map((item) => item.id),
  };
}

export function summarizeRetentionPlan(plan: ReturnType<typeof planRetentionPurge>) {
  return {
    dryRun: plan.dryRun,
    horizon: plan.horizon,
    rejectedWouldDelete: plan.purgeSignupIds.length,
    membersWouldDelete: plan.purgeMemberIds.length,
    acceptedWouldAnonymize: plan.anonymizeSignupIds.length,
    rejectedKept: plan.signups.filter((item) => !item.purge && !item.anonymize).length,
    membersKept: plan.members.filter((item) => !item.purge).length,
  };
}

export function toRetentionCandidate(decision: RetentionDecision) {
  return {
    entityType: decision.entityType,
    entityId: decision.id,
    reason: decision.reason,
    action: decision.purge ? "would_delete" : decision.anonymize ? "would_anonymize" : "kept",
  };
}
