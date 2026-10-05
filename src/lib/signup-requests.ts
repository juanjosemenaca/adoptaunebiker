import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { hasSupabaseEnv, supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { isDiscipline } from "@/lib/labels";
import type { Discipline, Role } from "@/lib/types";

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
};

const dataDir = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "solicitudes.json");

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
  };
}

function isMissingTable(error: { code?: string; message?: string }) {
  return (
    error.code === "PGRST205" ||
    Boolean(error.message?.includes("Could not find the table")) ||
    Boolean(error.message?.includes("schema cache"))
  );
}

async function readLocal(): Promise<SignupRequest[]> {
  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as SignupRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocal(request: SignupRequest) {
  const items = await readLocal();
  if (items.some((item) => item.email === request.email)) {
    const duplicate = new Error("duplicate");
    duplicate.name = "SignupExists";
    throw duplicate;
  }
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify([request, ...items], null, 2), "utf8");
}

export async function listSignupRequests(): Promise<SignupRequest[]> {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("signup_requests")
        .select(
          "id, created_at, name, email, city, role, discipline, bike, bio, looking_for, locale",
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((row) => toRequest(row as SignupRow));
      }
    }
  }
  const items = await readLocal();
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
  bio: string;
  lookingFor: string;
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
