import type { Discipline, Practice, Role } from "@/lib/types";

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
export const practices: Practice[] = ["carretera", "mtb", "gravel", "ebike"];

export function isDiscipline(value: string): value is Discipline {
  return value === "mtb" || value === "carretera" || value === "gravel";
}

export function isPractice(value: string): value is Practice {
  return isDiscipline(value) || value === "ebike";
}

export function parsePracticeList(values: string[]) {
  return [...new Set(values.map((item) => item.trim()).filter(isPractice))];
}
