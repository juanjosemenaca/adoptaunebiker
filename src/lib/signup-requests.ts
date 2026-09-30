import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
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

const dataDir = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "solicitudes.json");

async function readAll(): Promise<SignupRequest[]> {
  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as SignupRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function listSignupRequests(): Promise<SignupRequest[]> {
  const items = await readAll();
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function findSignupByEmail(email: string) {
  const items = await readAll();
  return items.find((item) => item.email === email) ?? null;
}

export async function saveSignupRequest(request: SignupRequest) {
  const items = await readAll();
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify([request, ...items], null, 2), "utf8");
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
