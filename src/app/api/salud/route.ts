import { configuredSupabaseKey, configuredSupabaseUrl } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = configuredSupabaseUrl();
  const key = configuredSupabaseKey();
  let host = "";
  try {
    host = url ? new URL(url).host : "";
  } catch {
    host = "invalid";
  }

  return Response.json({
    vercel: Boolean(process.env.VERCEL),
    hasUrl: Boolean(url),
    hasKey: Boolean(key),
    host,
    keyKind: key.startsWith("sb_publishable_")
      ? "publishable"
      : key.startsWith("eyJ")
        ? "jwt"
        : key
          ? "other"
          : "missing",
    blockedErp: url.includes("grasrjavkbeboynacvzp"),
  });
}
