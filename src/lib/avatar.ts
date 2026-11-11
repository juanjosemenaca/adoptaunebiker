export const AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export type AvatarFileError = "missing" | "type" | "size";

export type AvatarBlob = {
  type: string;
  size: number;
  name: string;
};

export function avatarExt(mime: string, name: string) {
  if (mime === "image/jpeg" || /\.jpe?g$/i.test(name)) return "jpg";
  if (mime === "image/png" || /\.png$/i.test(name)) return "png";
  if (mime === "image/webp" || /\.webp$/i.test(name)) return "webp";
  return "";
}

export function checkAvatarFile(file: AvatarBlob | null | undefined): AvatarFileError | null {
  if (!file || file.size < 1) return "missing";
  const ext = avatarExt(file.type, file.name);
  if (!AVATAR_TYPES.has(file.type) && !ext) return "type";
  if (file.size > AVATAR_MAX_BYTES) return "size";
  return null;
}

export function avatarInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  return letters || "?";
}

export class AvatarError extends Error {
  code: AvatarFileError | "failed";
  constructor(code: AvatarFileError | "failed") {
    super(code);
    this.name = "AvatarError";
    this.code = code;
  }
}
