import { connection } from "next/server";
import { configuredSupabaseKey, configuredSupabaseUrl } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  await connection();

  const url = configuredSupabaseUrl();
  const key = configuredSupabaseKey();
  let host = "";
  try {
    host = url ? new URL(url).host : "";
  } catch {
    host = "invalid";
  }

  return Response.json(
    {
      vercel: Boolean(process.env.VERCEL),
      sha: process.env.VERCEL_GIT_COMMIT_SHA ?? "",
      vercelEnv: process.env.VERCEL_ENV ?? "",
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
      present: {
        NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: Boolean(
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        ),
        NEXT_PUBLIC_SITE_URL: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
        SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
        SUPABASE_PUBLISHABLE_KEY: Boolean(process.env.SUPABASE_PUBLISHABLE_KEY),
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
