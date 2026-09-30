import type { Discipline, Role } from "@/lib/types";

export const roleLabel: Record<Role, string> = {
  mentor: "Veterano",
  ebiker: "Principiante",
};

export const disciplineLabel: Record<Discipline, string> = {
  mtb: "MTB",
  carretera: "Carretera",
  gravel: "Gravel",
};

export const disciplines: Discipline[] = ["mtb", "carretera", "gravel"];

export function isDiscipline(value: string): value is Discipline {
  return value === "mtb" || value === "carretera" || value === "gravel";
}
