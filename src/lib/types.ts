export type Role = "mentor" | "ebiker";
export type AccountKind = "admin" | "user";
export type Discipline = "mtb" | "carretera" | "gravel";
export type Practice = Discipline | "ebike";
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

export type MemberStatus = "active" | "inactive";

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
  lastName?: string;
  country?: string;
  mustChangePassword?: boolean;
  memberStatus?: MemberStatus;
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

export type RideSurface = "asfalto" | "tierra" | "mixto";
export type RideBikeKind = "muscular" | "ebike" | "mixto";
export type RideLevel = "suave" | "dura" | "exigente";
export type RideStatus = "open" | "cancelled";
export type RideJoinStatus = "pending" | "accepted" | "declined" | "cancelled";
export type RideMark = "hosted" | "joined" | "open";

export const RIDE_SURFACES: RideSurface[] = ["asfalto", "tierra", "mixto"];
export const RIDE_BIKE_KINDS: RideBikeKind[] = ["muscular", "ebike", "mixto"];
export const RIDE_LEVELS: RideLevel[] = ["suave", "dura", "exigente"];

export type GroupRide = {
  id: string;
  hostId: string;
  hostName: string;
  hostSlug: string;
  title: string;
  startsAt: string;
  durationMin: number;
  surface: RideSurface;
  hostBike: string;
  level: RideLevel;
  place: string;
  meetingPoint: string;
  meetingLat: number | null;
  meetingLng: number | null;
  notes: string;
  maxRiders: number | null;
  distanceKm: number | null;
  elevationM: number | null;
  routeUrl: string;
  photoUrls: string[];
  status: RideStatus;
  createdAt: string;
  acceptedCount: number;
};

export type RideJoinRequest = {
  id: string;
  rideId: string;
  riderId: string;
  riderName: string;
  riderSlug: string;
  message: string;
  status: RideJoinStatus;
  createdAt: string;
};

export type RideMessage = {
  id: string;
  rideId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type RideFilters = {
  from?: string;
  to?: string;
  surface?: RideSurface;
  level?: RideLevel;
  place?: string;
};
