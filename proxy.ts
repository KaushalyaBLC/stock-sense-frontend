import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_BASE } from "@/lib/api";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth-cookies";

const AUTH_PAGES = ["/login", "/signup"];
const PROTECTED = ["/dashboard"];

/**
 * Route protection + silent token refresh (Next 16 proxy).
 *
 *  - Access cookie present            → allow.
 *  - Access gone but refresh present  → refresh against core, set new cookies,
 *                                        then allow (no bounce to /login).
 *  - Neither, on a protected route    → redirect to /login (?next=).
 *  - Signed-in on an auth page        → redirect to /dashboard.
 *
 * proxy CAN set cookies (via the response), which is why refresh lives here and
 * not in the server-component guard (server components can't set cookies).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccess = Boolean(request.cookies.get(ACCESS_COOKIE)?.value);
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  // Try a silent refresh when the access token is gone but we still have a
  // refresh token — for both protected pages and auth pages (so a returning
  // user with only a refresh cookie lands on the dashboard, not the login form).
  if (!hasAccess && refreshToken && (isProtected || isAuthPage)) {
    const refreshed = await tryRefresh(refreshToken);
    if (refreshed) {
      // Make the refreshed access token visible to THIS request's server
      // components (getCurrentUser) by rewriting the forwarded request cookie.
      request.cookies.set(ACCESS_COOKIE, refreshed.access_token);
      const res = isAuthPage
        ? NextResponse.redirect(new URL("/dashboard", request.url))
        : NextResponse.next({ request: { headers: request.headers } });
      applySession(res, refreshed);
      return res;
    }
    // Refresh failed — clear the stale refresh cookie so we don't loop.
    if (isProtected) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      const res = NextResponse.redirect(url);
      res.cookies.delete(ACCESS_COOKIE);
      res.cookies.delete(REFRESH_COOKIE);
      return res;
    }
  }

  if (isProtected && !hasAccess) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && hasAccess) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

/** Exchange a refresh token for a new session against core. */
async function tryRefresh(refreshToken: string) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.session ?? null;
  } catch {
    return null;
  }
}

/** Write the new access/refresh cookies onto a proxy response. */
function applySession(
  res: NextResponse,
  session: {
    access_token: string;
    refresh_token: string;
    expires_in?: number;
  },
) {
  const { access, refresh } = sessionCookieOptions(session as never);
  res.cookies.set(ACCESS_COOKIE, access.value, access.opts);
  res.cookies.set(REFRESH_COOKIE, refresh.value, refresh.opts);
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
