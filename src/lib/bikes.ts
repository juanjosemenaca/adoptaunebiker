export const MAX_MEMBER_BIKES = 8;
export const BIKE_NAME_MIN = 2;
export const BIKE_NAME_MAX = 40;
export const BIKE_NOTE_MAX = 80;

export type MemberBikeKind = "muscular" | "ebike";

export type MemberBike = {
  id: string;
  name: string;
  kind: MemberBikeKind;
  note: string;
  photoPath: string;
  photoUrl: string;
};

export function isMemberBikeKind(value: string): value is MemberBikeKind {
  return value === "muscular" || value === "ebike";
}

export function parseMemberBikes(values: string[]) {
  const bikes: string[] = [];
  for (const raw of values) {
    const name = raw.trim().replace(/\s+/g, " ");
    if (name.length < BIKE_NAME_MIN || name.length > BIKE_NAME_MAX) continue;
    if (bikes.some((item) => item.toLowerCase() === name.toLowerCase())) continue;
    bikes.push(name);
    if (bikes.length >= MAX_MEMBER_BIKES) break;
  }
  return bikes;
}

export function primaryBike(bikes: string[], fallback = "") {
  return bikes[0] ?? fallback.trim();
}

export function garageNames(garage: MemberBike[]) {
  return garage.map((item) => item.name);
}

export function primaryBikeName(garage: MemberBike[], fallback = "") {
  return garage[0]?.name ?? fallback.trim();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function parseMemberGarage(raw: unknown, fallbackNames: string[] = []): MemberBike[] {
  const list: MemberBike[] = [];
  const source = Array.isArray(raw) ? raw : [];
  for (const item of source) {
    if (typeof item === "string") {
      const name = parseMemberBikes([item])[0];
      if (name) list.push(namedBike(name));
      continue;
    }
    const row = asRecord(item);
    if (!row) continue;
    const name = parseMemberBikes([String(row.name ?? "")])[0];
    if (!name) continue;
    const kindRaw = String(row.kind ?? "");
    const kind = isMemberBikeKind(kindRaw) ? kindRaw : "muscular";
    list.push({
      id: String(row.id ?? "").trim() || namedBike(name).id,
      name,
      kind,
      note: String(row.note ?? "").trim().slice(0, BIKE_NOTE_MAX),
      photoPath: String(row.photoPath ?? row.photo_path ?? "").trim(),
      photoUrl: String(row.photoUrl ?? row.photo_url ?? "").trim(),
    });
    if (list.length >= MAX_MEMBER_BIKES) break;
  }
  if (list.length === 0) {
    for (const name of parseMemberBikes(fallbackNames)) list.push(namedBike(name));
  }
  const seen = new Set<string>();
  return list.filter((item) => {
    const key = item.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function newMemberBike(name = "", kind: MemberBikeKind = "muscular"): MemberBike {
  return {
    id: crypto.randomUUID(),
    name,
    kind,
    note: "",
    photoPath: "",
    photoUrl: "",
  };
}

export function namedBike(name: string, kind: MemberBikeKind = "muscular"): MemberBike {
  const clean = parseMemberBikes([name])[0] ?? name.trim();
  return {
    id: `n-${clean.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: clean,
    kind,
    note: "",
    photoPath: "",
    photoUrl: "",
  };
}

export function parseGarageFields(input: {
  ids: string[];
  names: string[];
  kinds: string[];
  notes: string[];
  photoPaths: string[];
  photoUrls: string[];
}) {
  const rows = input.ids.map((id, index) => ({
    id,
    name: input.names[index] ?? "",
    kind: input.kinds[index] ?? "muscular",
    note: input.notes[index] ?? "",
    photoPath: input.photoPaths[index] ?? "",
    photoUrl: input.photoUrls[index] ?? "",
  }));
  return parseMemberGarage(rows);
}

export function serializeGarage(garage: MemberBike[]) {
  return parseMemberGarage(garage).map((item) => ({
    id: item.id,
    name: item.name,
    kind: item.kind,
    note: item.note,
    photoPath: item.photoPath,
    photoUrl: item.photoUrl,
  }));
}
