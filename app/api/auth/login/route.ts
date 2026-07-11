import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE, type LoginResult } from "@/lib/api";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth-cookies";

/** BFF: log in against core, set httpOnly cookies, return only the public user. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { error: { code: "invalid_request", message: "Email and password are required." } },
      { status: 400 },
    );
  }

  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
  });

  const data = (await res.json().catch(() => null)) as LoginResult | { error: unknown } | null;

  if (!res.ok || !data || "error" in data) {
    return NextResponse.json(
      (data as { error: unknown }) ?? {
        error: { code: "login_failed", message: "Sign in failed." },
      },
      { status: res.status || 500 },
    );
  }

  const { user, session } = data as LoginResult;
  const cookieStore = await cookies();
  const { access, refresh } = sessionCookieOptions(session);
  cookieStore.set(ACCESS_COOKIE, access.value, access.opts);
  cookieStore.set(REFRESH_COOKIE, refresh.value, refresh.opts);

  return NextResponse.json({ user });
}
