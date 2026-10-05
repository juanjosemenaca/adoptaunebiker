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

  const envNames = Object.keys(process.env)
    .filter((name) => /supabase|site_url/i.test(name))
    .sort();

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
      envNames,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
