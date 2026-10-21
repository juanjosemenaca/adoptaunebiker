import { connection } from "next/server";
import { logServerError } from "@/lib/log";
import {
  authorizedRetentionRequest,
  readRetentionIntent,
  summarizeRetentionRows,
  type RetentionRpcRow,
} from "@/lib/retention-http";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store" };

function unauthorized() {
  return Response.json({ error: "unauthorized" }, { status: 401, headers: noStore });
}

async function handle(request: Request) {
  await connection();

  if (!authorizedRetentionRequest(request)) {
    return unauthorized();
  }

  const intent = await readRetentionIntent(request);
  if ("methodNotAllowed" in intent && intent.methodNotAllowed) {
    return Response.json({ error: "method_not_allowed" }, { status: 405, headers: noStore });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return Response.json(
      { error: "service_role_missing", dryRun: true, deployed: false },
      { status: 501, headers: noStore },
    );
  }

  const apply = intent.apply;
  const { data, error } = await supabase.rpc("purge_expired_personal_data", {
    p_dry_run: !apply,
    p_confirm: apply ? "purge" : null,
  });

  if (error) {
    logServerError("[retention.purge]", error);
    return Response.json({ error: "purge_failed", dryRun: !apply }, { status: 500, headers: noStore });
  }

  const summary = summarizeRetentionRows((Array.isArray(data) ? data : []) as RetentionRpcRow[]);

  if (apply) {
    console.info(
      "[retention.purge] applied",
      `rejected=${summary.rejected}`,
      `members=${summary.members}`,
      `anonymized=${summary.anonymized}`,
    );
  }

  return Response.json(
    {
      dryRun: !apply,
      applied: apply,
      rejected: summary.rejected,
      members: summary.members,
      anonymized: summary.anonymized,
      candidates: summary.candidates,
    },
    { headers: noStore },
  );
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
