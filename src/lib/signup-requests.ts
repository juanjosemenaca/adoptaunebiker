import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { hasSupabaseEnv, supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";
import { getAuthContext } from "@/lib/supabase/auth-context";
import { isDiscipline } from "@/lib/labels";
import {
  isSignupInboxStatus,
  type Discipline,
  type Role,
  type SignupInboxStatus,
} from "@/lib/types";
import { cache } from "react";

export type SignupRequest = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  city: string;
  role: Role;
  discipline: Discipline;
  bike: string;
  bio: string;
  lookingFor: string;
  locale: string;
  inboxStatus: SignupInboxStatus;
};

type SignupRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  city: string;
  role: Role;
  discipline: string;
  bike: string | null;
  bio: string | null;
  looking_for: string | null;
  locale: string;
  inbox_status?: string | null;
};

const dataDir = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "solicitudes.json");
const selectBase =
  "id, created_at, name, email, city, role, discipline, bike, bio, looking_for, locale";
const selectWithInbox = `${selectBase}, inbox_status`;

function parseInboxStatus(value: unknown): SignupInboxStatus {
  return isSignupInboxStatus(String(value)) ? (value as SignupInboxStatus) : "unread";
}

function toRequest(row: SignupRow): SignupRequest {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    city: row.city,
    role: row.role === "ebiker" ? "ebiker" : "mentor",
    discipline: isDiscipline(row.discipline) ? row.discipline : "carretera",
    bike: row.bike ?? "",
    bio: row.bio ?? "",
    lookingFor: row.looking_for ?? "",
    locale: row.locale,
    inboxStatus: parseInboxStatus(row.inbox_status),
  };
}

function isMissingTable(error: { code?: string; message?: string }) {
  return (
    error.code === "PGRST205" ||
    Boolean(error.message?.includes("Could not find the table")) ||
    Boolean(error.message?.includes("schema cache"))
  );
}

function isMissingInboxColumn(error: { code?: string; message?: string }) {
  return error.code === "PGRST204" || Boolean(error.message?.includes("inbox_status"));
}

async function readLocal(): Promise<SignupRequest[]> {
  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as Array<Partial<SignupRequest>>;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      id: String(item.id ?? crypto.randomUUID()),
      createdAt: String(item.createdAt ?? new Date().toISOString()),
      name: String(item.name ?? ""),
      email: String(item.email ?? ""),
      city: String(item.city ?? ""),
      role: item.role === "ebiker" ? "ebiker" : "mentor",
      discipline: isDiscipline(String(item.discipline ?? ""))
        ? (item.discipline as Discipline)
        : "carretera",
      bike: String(item.bike ?? ""),
      bio: String(item.bio ?? ""),
      lookingFor: String(item.lookingFor ?? ""),
      locale: String(item.locale ?? "es"),
      inboxStatus: parseInboxStatus(item.inboxStatus),
    }));
  } catch {
    return [];
  }
}

async function writeLocalList(items: SignupRequest[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(items, null, 2), "utf8");
}

async function writeLocal(request: SignupRequest) {
  const items = await readLocal();
  if (items.some((item) => item.email === request.email && item.inboxStatus !== "rejected")) {
    const duplicate = new Error("duplicate");
    duplicate.name = "SignupExists";
    throw duplicate;
  }
  await writeLocalList([request, ...items]);
}

async function supabaseUserClient() {
  const { supabase, user } = await getAuthContext();
  if (!supabase || !user) return null;
  return supabase;
}

type UserClient = NonNullable<Awaited<ReturnType<typeof supabaseUserClient>>>;

async function fetchSignupRows(supabase: UserClient) {
  const withInbox = await supabase
    .from("signup_requests")
    .select(selectWithInbox)
    .order("created_at", { ascending: false });
  if (!withInbox.error && withInbox.data) return withInbox.data as SignupRow[];
  if (withInbox.error && isMissingInboxColumn(withInbox.error)) {
    const without = await supabase
      .from("signup_requests")
      .select(selectBase)
      .order("created_at", { ascending: false });
    if (!without.error && without.data) return without.data as SignupRow[];
  }
  return null;
}

async function fetchSignupRow(supabase: UserClient, id: string) {
  const withInbox = await supabase
    .from("signup_requests")
    .select(selectWithInbox)
    .eq("id", id)
    .maybeSingle();
  if (!withInbox.error && withInbox.data) return toRequest(withInbox.data as SignupRow);
  if (withInbox.error && isMissingInboxColumn(withInbox.error)) {
    const without = await supabase
      .from("signup_requests")
      .select(selectBase)
      .eq("id", id)
      .maybeSingle();
    if (!without.error && without.data) return toRequest(without.data as SignupRow);
  }
  return null;
}

export const listSignupRequests = cache(async (): Promise<SignupRequest[]> => {
  const supabase = await supabaseUserClient();
  if (supabase) {
    const rows = await fetchSignupRows(supabase);
    if (rows) return rows.map((row) => toRequest(row));
  }
  const items = await readLocal();
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});

export async function countUnreadSignupRequests() {
  const supabase = await supabaseUserClient();
  if (supabase) {
    const { count, error } = await supabase
      .from("signup_requests")
      .select("id", { count: "exact", head: true })
      .eq("inbox_status", "unread");
    if (!error) return count ?? 0;
  }
  const items = await listSignupRequests();
  return items.filter((item) => item.inboxStatus === "unread").length;
}

export async function getSignupRequest(id: string): Promise<SignupRequest | null> {
  const supabase = await supabaseUserClient();
  if (supabase) {
    return fetchSignupRow(supabase, id);
  }
  const items = await readLocal();
  return items.find((item) => item.id === id) ?? null;
}

export async function updateSignupInboxStatus(id: string, status: SignupInboxStatus) {
  const supabase = await supabaseUserClient();
  if (supabase) {
    const { error } = await supabase
      .from("signup_requests")
      .update({ inbox_status: status })
      .eq("id", id);
    if (error) throw error;
    return;
  }
  const items = await readLocal();
  const next = items.map((item) => (item.id === id ? { ...item, inboxStatus: status } : item));
  await writeLocalList(next);
}

export async function removeSignupRequest(id: string) {
  const supabase = await supabaseUserClient();
  if (supabase) {
    const { error } = await supabase.from("signup_requests").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  const items = await readLocal();
  await writeLocalList(items.filter((item) => item.id !== id));
}

export async function markSignupRequestRead(id: string): Promise<SignupRequest | null> {
  const supabase = await supabaseUserClient();
  const item = supabase
    ? await fetchSignupRow(supabase, id)
    : ((await readLocal()).find((row) => row.id === id) ?? null);
  if (!item) return item;
  const nextStatus: SignupInboxStatus | null =
    item.inboxStatus === "unread" ? "read" : null;
  if (!nextStatus) return item;
  try {
    if (supabase) {
      const { error } = await supabase
        .from("signup_requests")
        .update({ inbox_status: nextStatus })
        .eq("id", id);
      if (error) throw error;
    } else {
      await updateSignupInboxStatus(id, nextStatus);
    }
    return { ...item, inboxStatus: nextStatus };
  } catch {
    return item;
  }
}

export async function findSignupByEmail(email: string) {
  const items = await readLocal();
  return items.find((item) => item.email === email) ?? null;
}

export async function saveSignupRequest(request: {
  name: string;
  email: string;
  city: string;
  role: Role;
  discipline: Discipline;
  bike: string;
  lookingFor: string;
  bio: string;
  locale: string;
}) {
  if (hasSupabaseEnv()) {
    const response = await fetch(`${supabaseUrl()}/rest/v1/signup_requests`, {
      method: "POST",
      headers: {
        apikey: supabasePublishableKey(),
        Authorization: `Bearer ${supabasePublishableKey()}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: request.name,
        email: request.email,
        city: request.city,
        role: request.role,
        discipline: request.discipline,
        bike: request.bike,
        bio: request.bio,
        looking_for: request.lookingFor,
        locale: request.locale,
      }),
    });

    if (response.ok) return;

    const payload = await response.text();
    const duplicate =
      response.status === 409 || payload.includes("23505") || payload.includes("duplicate");
    if (duplicate) {
      const error = new Error("duplicate");
      error.name = "SignupExists";
      throw error;
    }

    const failed = new Error(payload || `signup insert ${response.status}`);
    if (!isMissingTable({ message: payload }) || process.env.VERCEL) {
      throw failed;
    }
  } else if (process.env.VERCEL) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en Vercel");
  }

  await writeLocal({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    inboxStatus: "unread",
    ...request,
  });
}

export function formatSignupMessage(request: SignupRequest) {
  const role = request.role === "mentor" ? "Veterano" : "Principiante";
  return [
    "Solicitud de alta — Adopta un eBiker",
    "",
    `Nombre: ${request.name}`,
    `Correo: ${request.email}`,
    `Ciudad: ${request.city}`,
    `Tipo: ${role}`,
    `Modalidad: ${request.discipline}`,
    `Bici: ${request.bike || "—"}`,
    `Cómo sale: ${request.bio || "—"}`,
    `Qué busca: ${request.lookingFor || "—"}`,
  ].join("\n");
}
