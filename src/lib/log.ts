const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const JWT = /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]+/g;
const BEARER = /bearer\s+[A-Za-z0-9._\-+=/]+/gi;
const SECRET = /(access_token|refresh_token|client_secret|password|api[_-]?key)\s*[:=]\s*\S+/gi;

export function redactLogText(value: string) {
  return value
    .replace(EMAIL, "[redacted]")
    .replace(JWT, "[redacted]")
    .replace(BEARER, "Bearer [redacted]")
    .replace(SECRET, "$1=[redacted]")
    .slice(0, 240);
}

export function safeErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const record = error as {
      message?: unknown;
      code?: unknown;
      status?: unknown;
      name?: unknown;
    };
    const parts = [
      typeof record.name === "string" ? record.name : "",
      typeof record.code === "string" || typeof record.code === "number" ? String(record.code) : "",
      typeof record.status === "number" ? String(record.status) : "",
      typeof record.message === "string" ? record.message : "",
    ].filter(Boolean);
    if (parts.length) return redactLogText(parts.join(" "));
  }
  if (typeof error === "string") return redactLogText(error);
  return "unknown";
}

export function logServerError(scope: string, error: unknown) {
  console.error(scope, safeErrorMessage(error));
}
