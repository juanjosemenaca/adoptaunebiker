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

export function isSignupInboxStatus(value: string): value is SignupInboxStatus {
  return SIGNUP_INBOX_STATUSES.includes(value as SignupInboxStatus);
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
