import { slugify } from "babylovegrowth-next-js-blog";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getSession, isAdmin } from "@/lib/session";
import { getAuthContext } from "@/lib/supabase/auth-context";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { SupabaseClient } from "@supabase/supabase-js";

export type BlogAssetKind = "image" | "video" | "file";

export type BlogAsset = {
  id: string;
  postId: string;
  kind: BlogAssetKind;
  name: string;
  path: string;
  url: string;
  mime: string;
  size: number;
};

export type BlogPost = {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  subtitle: string;
  body: string;
  coverUrl: string;
  coverPath: string;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  assets: BlogAsset[];
};

export type BlogPostInput = {
  title: string;
  subtitle: string;
  body: string;
  locale: string;
  published: boolean;
  publishedAt: string;
};

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const FILE_TYPES = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const LIMITS: Record<BlogAssetKind, number> = {
  image: 8 * 1024 * 1024,
  video: 50 * 1024 * 1024,
  file: 15 * 1024 * 1024,
};

type PostRow = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  cover_url: string | null;
  cover_path: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type AssetRow = {
  id: string;
  post_id: string;
  kind: string;
  name: string;
  path: string;
  url: string;
  mime: string | null;
  size: number | null;
};

function fail(message: string): never {
  const error = new Error(message);
  error.name = "BlogAdminError";
  throw error;
}

function toAsset(row: AssetRow): BlogAsset {
  return {
    id: row.id,
    postId: row.post_id,
    kind: row.kind === "video" ? "video" : row.kind === "file" ? "file" : "image",
    name: row.name,
    path: row.path,
    url: row.url,
    mime: row.mime ?? "",
    size: row.size ?? 0,
  };
}

function toPost(row: PostRow, assets: BlogAsset[] = []): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    locale: isLocale(row.locale) ? row.locale : defaultLocale,
    title: row.title,
    subtitle: row.subtitle ?? "",
    body: row.body ?? "",
    coverUrl: row.cover_url ?? "",
    coverPath: row.cover_path ?? "",
    published: Boolean(row.published),
    publishedAt: row.published_at ?? row.created_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    assets,
  };
}

async function adminClient() {
  const session = await getSession();
  if (!isAdmin(session)) fail("not_admin");
  const { supabase, user } = await getAuthContext();
  if (supabase && user) return { supabase, userId: user.id };
  const service = createServiceClient();
  if (!service) fail("no_supabase");
  return { supabase: service, userId: session?.id ?? null };
}

async function publicClient() {
  try {
    return await createClient();
  } catch {
    return createServiceClient();
  }
}

async function assetsFor(supabase: SupabaseClient, postIds: string[]) {
  if (postIds.length === 0) return new Map<string, BlogAsset[]>();
  const { data } = await supabase
    .from("blog_assets")
    .select("id, post_id, kind, name, path, url, mime, size")
    .in("post_id", postIds)
    .order("created_at", { ascending: true });
  const map = new Map<string, BlogAsset[]>();
  for (const row of (data ?? []) as AssetRow[]) {
    const list = map.get(row.post_id) ?? [];
    list.push(toAsset(row));
    map.set(row.post_id, list);
  }
  return map;
}

export async function listAdminBlogPosts(): Promise<BlogPost[]> {
  const { supabase } = await adminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, locale, title, subtitle, body, cover_url, cover_path, published, published_at, created_at, updated_at",
    )
    .order("updated_at", { ascending: false });
  if (error) fail(error.message);
  const rows = (data ?? []) as PostRow[];
  const assets = await assetsFor(supabase, rows.map((row) => row.id));
  return rows.map((row) => toPost(row, assets.get(row.id) ?? []));
}

export async function getAdminBlogPost(id: string): Promise<BlogPost | null> {
  const { supabase } = await adminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, locale, title, subtitle, body, cover_url, cover_path, published, published_at, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  const assets = await assetsFor(supabase, [data.id]);
  return toPost(data as PostRow, assets.get(data.id) ?? []);
}

export async function listPublishedLocalPosts(): Promise<BlogPost[]> {
  const supabase = await publicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, locale, title, subtitle, body, cover_url, cover_path, published, published_at, created_at, updated_at",
    )
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  const rows = data as PostRow[];
  const assets = await assetsFor(supabase, rows.map((row) => row.id));
  return rows.map((row) => toPost(row, assets.get(row.id) ?? []));
}

export async function getPublishedLocalPost(slug: string): Promise<BlogPost | null> {
  const supabase = await publicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, locale, title, subtitle, body, cover_url, cover_path, published, published_at, created_at, updated_at",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  const assets = await assetsFor(supabase, [data.id]);
  return toPost(data as PostRow, assets.get(data.id) ?? []);
}

async function uniqueSlug(supabase: SupabaseClient, title: string, currentId?: string) {
  const base = slugify(title) || `articulo-${Date.now().toString(36)}`;
  let slug = base;
  let n = 2;
  while (true) {
    const { data } = await supabase.from("blog_posts").select("id").eq("slug", slug).maybeSingle();
    if (!data || data.id === currentId) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

function publishedAtValue(input: BlogPostInput) {
  const raw = input.publishedAt.trim();
  if (raw) {
    const date = new Date(raw);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return input.published ? new Date().toISOString() : null;
}

export async function createBlogPost(input: BlogPostInput) {
  const title = input.title.trim();
  if (title.length < 2) fail("title");
  const { supabase, userId } = await adminClient();
  const slug = await uniqueSlug(supabase, title);
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      slug,
      locale: isLocale(input.locale) ? input.locale : defaultLocale,
      title,
      subtitle: input.subtitle.trim(),
      body: input.body,
      published: input.published,
      published_at: publishedAtValue(input),
      created_by: userId,
    })
    .select(
      "id, slug, locale, title, subtitle, body, cover_url, cover_path, published, published_at, created_at, updated_at",
    )
    .single();
  if (error || !data) fail(error?.message || "save");
  return toPost(data as PostRow);
}

export async function updateBlogPost(id: string, input: BlogPostInput) {
  const title = input.title.trim();
  if (title.length < 2) fail("title");
  const { supabase } = await adminClient();
  const slug = await uniqueSlug(supabase, title, id);
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      slug,
      locale: isLocale(input.locale) ? input.locale : defaultLocale,
      title,
      subtitle: input.subtitle.trim(),
      body: input.body,
      published: input.published,
      published_at: publishedAtValue(input),
    })
    .eq("id", id)
    .select(
      "id, slug, locale, title, subtitle, body, cover_url, cover_path, published, published_at, created_at, updated_at",
    )
    .single();
  if (error || !data) fail(error?.message || "save");
  const assets = await assetsFor(supabase, [id]);
  return toPost(data as PostRow, assets.get(id) ?? []);
}

export async function deleteBlogPost(id: string) {
  const { supabase } = await adminClient();
  const post = await getAdminBlogPost(id);
  if (!post) fail("missing");
  const paths = [
    ...post.assets.map((asset) => asset.path),
    post.coverPath,
  ].filter(Boolean);
  if (paths.length) await supabase.storage.from("blog").remove(paths);
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) fail(error.message);
}

function kindFor(mime: string, name: string): BlogAssetKind {
  if (IMAGE_TYPES.has(mime) || /\.(jpe?g|png|webp|gif|avif)$/i.test(name)) return "image";
  if (VIDEO_TYPES.has(mime) || /\.(mp4|webm|mov)$/i.test(name)) return "video";
  return "file";
}

function allowed(kind: BlogAssetKind, mime: string) {
  if (kind === "image") return IMAGE_TYPES.has(mime);
  if (kind === "video") return VIDEO_TYPES.has(mime);
  return FILE_TYPES.has(mime) || mime.startsWith("application/") || mime === "text/plain";
}

export async function uploadBlogAsset(postId: string, file: File, asCover = false) {
  if (!file || file.size < 1) fail("file");
  const { supabase } = await adminClient();
  const post = await getAdminBlogPost(postId);
  if (!post) fail("missing");
  const kind = kindFor(file.type, file.name);
  if (file.size > LIMITS[kind]) fail("file_size");
  if (kind !== "file" && !allowed(kind, file.type)) fail("file_type");
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const path = `${postId}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage.from("blog").upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (uploadError) fail(uploadError.message);
  const { data: publicUrl } = supabase.storage.from("blog").getPublicUrl(path);
  const url = publicUrl.publicUrl;
  if (asCover && kind === "image") {
    if (post.coverPath) await supabase.storage.from("blog").remove([post.coverPath]);
    const { error } = await supabase
      .from("blog_posts")
      .update({ cover_url: url, cover_path: path })
      .eq("id", postId);
    if (error) fail(error.message);
    return { kind, url, name: file.name, id: "cover" };
  }
  const { data, error } = await supabase
    .from("blog_assets")
    .insert({
      post_id: postId,
      kind,
      name: file.name,
      path,
      url,
      mime: file.type,
      size: file.size,
    })
    .select("id, post_id, kind, name, path, url, mime, size")
    .single();
  if (error || !data) fail(error?.message || "upload");
  return toAsset(data as AssetRow);
}

export async function deleteBlogAsset(postId: string, assetId: string) {
  const { supabase } = await adminClient();
  if (assetId === "cover") {
    const post = await getAdminBlogPost(postId);
    if (!post) fail("missing");
    if (post.coverPath) await supabase.storage.from("blog").remove([post.coverPath]);
    const { error } = await supabase
      .from("blog_posts")
      .update({ cover_url: "", cover_path: "" })
      .eq("id", postId);
    if (error) fail(error.message);
    return;
  }
  const { data } = await supabase
    .from("blog_assets")
    .select("id, path")
    .eq("id", assetId)
    .eq("post_id", postId)
    .maybeSingle();
  if (!data) fail("missing");
  await supabase.storage.from("blog").remove([data.path]);
  const { error } = await supabase.from("blog_assets").delete().eq("id", assetId);
  if (error) fail(error.message);
}
