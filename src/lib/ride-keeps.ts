import { checkAvatarFile, avatarExt } from "@/lib/avatar";
import { logServerError } from "@/lib/log";
import { checkTrackFile, RIDE_PHOTO_MAX, trackExt } from "@/lib/ride-helpers";
import { configuredSupabaseUrl } from "@/lib/supabase/env";
import { getAuthContext } from "@/lib/supabase/auth-context";
import type { RideKeep, RideKeepKind } from "@/lib/types";

type KeepRow = {
  id: string;
  ride_id: string;
  author_id: string;
  kind: string;
  path: string | null;
  url: string | null;
  caption: string | null;
  created_at: string;
  author?: { display_name: string | null; slug: string | null } | Array<{
    display_name: string | null;
    slug: string | null;
  }> | null;
};

function oneEmbed<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function isKeepKind(value: string): value is RideKeepKind {
  return value === "photo" || value === "track" || value === "link";
}

function publicObjectUrl(bucket: string, path: string) {
  const clean = path.replace(/^\/+/, "");
  const base = configuredSupabaseUrl();
  return clean && base ? `${base}/storage/v1/object/public/${bucket}/${clean}` : "";
}

function mapKeep(row: KeepRow): RideKeep | null {
  if (!isKeepKind(row.kind)) return null;
  const author = oneEmbed(row.author);
  const stored = row.path
    ? publicObjectUrl(row.kind === "track" ? "ride-tracks" : "ride-photos", row.path)
    : "";
  return {
    id: row.id,
    rideId: row.ride_id,
    authorId: row.author_id,
    authorName: author?.display_name ?? "",
    kind: row.kind,
    url: stored || row.url || "",
    caption: row.caption ?? "",
    createdAt: row.created_at,
  };
}

async function memberClient() {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) return null;
  return { supabase, user };
}

function keepFailed(label: string, error: { code?: string; message?: string } | null) {
  if (!error) return;
  if (error.code === "42P01" || error.code === "PGRST205") return;
  logServerError(label, error);
}

export async function listRideKeeps(rideId: string): Promise<RideKeep[]> {
  const auth = await memberClient();
  if (!auth || !rideId) return [];
  const { data, error } = await auth.supabase
    .from("ride_keeps")
    .select(
      "id, ride_id, author_id, kind, path, url, caption, created_at, author:profiles!ride_keeps_author_id_fkey ( display_name, slug )",
    )
    .eq("ride_id", rideId)
    .order("created_at", { ascending: true });
  if (error) {
    keepFailed("[listRideKeeps]", error);
    return [];
  }
  return ((data ?? []) as KeepRow[]).map(mapKeep).filter((item): item is RideKeep => Boolean(item));
}

async function uploadKeepFile(
  auth: NonNullable<Awaited<ReturnType<typeof memberClient>>>,
  bucket: "ride-photos" | "ride-tracks",
  path: string,
  file: File,
) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await auth.supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) {
    logServerError("[uploadKeepFile]", error);
    throw new Error("rideAlbum");
  }
  const { data } = auth.supabase.storage.from(bucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function saveRideKeeps(
  rideId: string,
  authorId: string,
  input: { photos: File[]; track: File | null; link: string; caption: string },
) {
  const auth = await memberClient();
  if (!auth) throw new Error("rideAlbum");
  const caption = input.caption.trim().slice(0, 280);
  const rows: Array<{
    ride_id: string;
    author_id: string;
    kind: RideKeepKind;
    path: string;
    url: string;
    caption: string;
  }> = [];

  for (const file of input.photos.slice(0, RIDE_PHOTO_MAX)) {
    const bad = checkAvatarFile(file);
    if (bad) throw new Error(bad === "size" ? "photoSize" : "photoType");
    const ext = avatarExt(file.type, file.name) || "jpg";
    const path = `${authorId}/${rideId}/${crypto.randomUUID()}.${ext}`;
    const uploaded = await uploadKeepFile(auth, "ride-photos", path, file);
    rows.push({
      ride_id: rideId,
      author_id: authorId,
      kind: "photo",
      path: uploaded.path,
      url: uploaded.url,
      caption,
    });
  }

  if (input.track) {
    const bad = checkTrackFile(input.track);
    if (bad) throw new Error("rideTrack");
    const ext = trackExt(input.track.type, input.track.name) || "gpx";
    const path = `${authorId}/${rideId}/${crypto.randomUUID()}.${ext}`;
    const uploaded = await uploadKeepFile(auth, "ride-tracks", path, input.track);
    rows.push({
      ride_id: rideId,
      author_id: authorId,
      kind: "track",
      path: uploaded.path,
      url: uploaded.url,
      caption,
    });
  }

  if (input.link) {
    rows.push({
      ride_id: rideId,
      author_id: authorId,
      kind: "link",
      path: "",
      url: input.link,
      caption,
    });
  }

  if (rows.length === 0) throw new Error("rideKeepEmpty");

  const { error } = await auth.supabase.from("ride_keeps").insert(rows);
  if (error) {
    keepFailed("[saveRideKeeps]", error);
    throw new Error("rideAlbum");
  }
}
