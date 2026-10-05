import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

const REFRESH_WINDOW_MS = 120_000;

function decodeSessionCookie(raw: string) {
  const candidates = [raw];
  if (raw.startsWith("base64-")) {
    const padded = raw.slice(7).replace(/-/g, "+").replace(/_/g, "/");
    candidates.push(atob(padded));
  }
  try {
    candidates.push(decodeURIComponent(raw));
  } catch {
    /* ignore */
  }
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as { expires_at?: number };
    } catch {
      /* try next */
    }
  }
  throw new Error("unreadable");
}

function isAccessTokenCookie(name: string) {
  return /auth-token(?:\.\d+)?$/.test(name);
}

function authExpiresAt(request: NextRequest) {
  const grouped = new Map<string, { name: string; value: string }[]>();
  for (const cookie of request.cookies.getAll()) {
    if (!isAccessTokenCookie(cookie.name)) continue;
    const base = cookie.name.replace(/\.\d+$/, "");
    const chunks = grouped.get(base) ?? [];
    chunks.push(cookie);
    grouped.set(base, chunks);
  }
  if (grouped.size === 0) return null;

  for (const chunks of grouped.values()) {
    chunks.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    try {
      const parsed = decodeSessionCookie(chunks.map((chunk) => chunk.value).join(""));
      if (typeof parsed.expires_at !== "number") continue;
      return parsed.expires_at > 1e12 ? parsed.expires_at : parsed.expires_at * 1000;
    } catch {
      return 0;
    }
  }
  return 0;
}

export function shouldRefreshAuth(request: NextRequest) {
  const expiresAt = authExpiresAt(request);
  if (expiresAt === null) return false;
  if (expiresAt === 0) return true;
  return expiresAt - Date.now() < REFRESH_WINDOW_MS;
}

export async function updateSession(request: NextRequest, requestHeaders?: Headers) {
  const incoming = requestHeaders ?? request.headers;
  let supabaseResponse = NextResponse.next({
    request: { headers: incoming },
  });

  const supabase = createServerClient(supabaseUrl(), supabasePublishableKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request: { headers: incoming },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value),
        );
      },
    },
  });

  await supabase.auth.getUser();
  return supabaseResponse;
}

export function copyAuthCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = from.headers.get(header);
    if (value) to.headers.set(header, value);
  }
  return to;
}
