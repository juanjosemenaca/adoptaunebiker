import { connection } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getSession } from "@/lib/session";
import {
  hasStravaConfig,
  stravaAuthorizeUrl,
  stravaCuentaRedirect,
  stravaLoginRedirect,
} from "@/lib/strava";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STATE_COOKIE = "adopta.strava_oauth";

function originFrom(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const proto =
    request.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function GET(request: NextRequest) {
  await connection();
  const localeRaw = request.nextUrl.searchParams.get("locale") ?? "";
  const locale = isLocale(localeRaw) ? localeRaw : defaultLocale;
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL(stravaLoginRedirect(locale), request.url));
  }
  if (!hasStravaConfig()) {
    return NextResponse.redirect(new URL(stravaCuentaRedirect(locale, "noconfig"), request.url));
  }

  const state = `${locale}.${crypto.randomUUID()}`;
  const response = NextResponse.redirect(stravaAuthorizeUrl(originFrom(request), state));
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
