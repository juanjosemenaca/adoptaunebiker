import { createAltchaChallenge } from "@/lib/altcha";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const challenge = await createAltchaChallenge();
    return Response.json(challenge, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}
