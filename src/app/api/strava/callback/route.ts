import { connection } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";
import { logServerError } from "@/lib/log";
import { getSession } from "@/lib/session";
import {
  exchangeStravaCode,
  hasStravaConfig,
  stravaCuentaRedirect,
  stravaLoginRedirect,
  syncStravaActivities,
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

function localeFromState(state: string) {
  const locale = state.split(".")[0] ?? "";
  return isLocale(locale) ? locale : defaultLocale;
}

export async function GET(request: NextRequest) {
  await connection();
  const url = request.nextUrl;
  const state = url.searchParams.get("state") ?? "";
  const code = url.searchParams.get("code") ?? "";
  const error = url.searchParams.get("error") ?? "";
  const saved = request.cookies.get(STATE_COOKIE)?.value ?? "";
  const locale = localeFromState(state || saved);

  const finish = (flag: string) => {
    const response = NextResponse.redirect(new URL(stravaCuentaRedirect(locale, flag), request.url));
    response.cookies.set(STATE_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  };

  if (error || !code) return finish("denied");
  if (!state || !saved || state !== saved) return finish("error");
  if (!hasStravaConfig()) return finish("noconfig");

  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL(stravaLoginRedirect(locale), request.url));
  }

  try {
    await exchangeStravaCode(originFrom(request), code);
    await syncStravaActivities();
    return finish("ok");
  } catch (cause) {
    logServerError("[strava callback]", cause);
    const message = cause instanceof Error ? cause.message : "";
    if (message === "athlete_taken") return finish("taken");
    return finish("error");
  }
}
