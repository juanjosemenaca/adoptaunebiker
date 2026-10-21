import { timingSafeEqual } from "node:crypto";

export const retentionConfirmValue = "purge";

export function timingSafeSecretEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function retentionSecrets() {
  return [process.env.RETENTION_CRON_SECRET, process.env.CRON_SECRET]
    .map((value) => value?.trim() ?? "")
    .filter(Boolean);
}

export function authorizedRetentionRequest(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  const provided = match?.[1]?.trim() ?? "";
  if (!provided) return false;
  return retentionSecrets().some((expected) => timingSafeSecretEqual(provided, expected));
}

export function weeklyApplyEnabled() {
  return process.env.RETENTION_PURGE_APPLY?.trim() === "1";
}

export async function readRetentionIntent(request: Request) {
  if (request.method === "GET") {
    return { apply: weeklyApplyEnabled() };
  }
  if (request.method !== "POST") {
    return { apply: false, methodNotAllowed: true as const };
  }
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return { apply: false };
  }
  const body = (await request.json().catch(() => null)) as { confirm?: unknown } | null;
  return { apply: body?.confirm === retentionConfirmValue };
}

export type RetentionRpcRow = {
  action?: string;
  entity_type?: string;
  entity_id?: string;
  reason?: string;
};

export function summarizeRetentionRows(rows: RetentionRpcRow[]) {
  const candidates = rows
    .filter((row) => row.entity_type && row.entity_id)
    .map((row) => ({
      entityType: row.entity_type,
      entityId: row.entity_id,
      reason: row.reason ?? "",
      action: row.action ?? "",
    }));
  return {
    rejected: candidates.filter((row) => row.entityType === "signup_request" && row.action.includes("delete")).length,
    members: candidates.filter((row) => row.entityType === "member").length,
    anonymized: candidates.filter((row) => row.action.includes("anonymiz")).length,
    candidates,
  };
}
