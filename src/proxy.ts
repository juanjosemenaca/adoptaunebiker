import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { copyAuthCookies, updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const first = pathname.split("/")[1] ?? "";
  const locale = isLocale(first) ? first : defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-adopta-locale", locale);

  const supabaseResponse = hasSupabaseEnv()
    ? await updateSession(request, requestHeaders)
    : NextResponse.next({ request: { headers: requestHeaders } });

  if (isLocale(first)) {
    supabaseResponse.cookies.set("NEXT_LOCALE", first, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return supabaseResponse;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  const redirect = NextResponse.redirect(url);
  redirect.cookies.set("NEXT_LOCALE", defaultLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return copyAuthCookies(supabaseResponse, redirect);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
