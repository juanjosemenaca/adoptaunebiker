export type Role = "mentor" | "ebiker";
export type AccountKind = "admin" | "user";
export type Discipline = "mtb" | "carretera" | "gravel";
export type SignupInboxStatus =
  | "unread"
  | "read"
  | "in_analysis"
  | "rejected"
  | "accepted";

export const SIGNUP_INBOX_STATUSES: SignupInboxStatus[] = [
  "unread",
  "read",
  "in_analysis",
  "rejected",
  "accepted",
];

export const SIGNUP_WORKFLOW_STATUSES = ["unread", "read", "in_analysis"] as const;

export type SignupWorkflowStatus = (typeof SIGNUP_WORKFLOW_STATUSES)[number];

export function isSignupInboxStatus(value: string): value is SignupInboxStatus {
  return SIGNUP_INBOX_STATUSES.includes(value as SignupInboxStatus);
}

export function isSignupWorkflowStatus(value: string): value is SignupWorkflowStatus {
  return SIGNUP_WORKFLOW_STATUSES.includes(value as SignupWorkflowStatus);
}

export type Rider = {
  id: string;
  slug: string;
  name: string;
  role: Role;
  discipline: Discipline;
  city: string;
  bike: string;
  kmMonth: number;
  years: number;
  bio: string;
  lookingFor: string;
  tags: string[];
  plate: string;
};

export type SessionUser = Pick<
  Rider,
  | "id"
  | "slug"
  | "name"
  | "role"
  | "discipline"
  | "city"
  | "bike"
  | "bio"
  | "lookingFor"
> & {
  email?: string;
  kind?: AccountKind;
};

export type BondStatus = "pending" | "accepted" | "declined";

export type Bond = {
  id: string;
  fromId: string;
  toId: string;
  message: string;
  status: BondStatus;
  createdAt: string;
};
