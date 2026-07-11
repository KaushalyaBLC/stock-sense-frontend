import type { Session } from "@/lib/api";

export const ACCESS_COOKIE = "ss_at";
export const REFRESH_COOKIE = "ss_rt";

const isProd = process.env.NODE_ENV === "production";

type CookieOpts = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
};

function base(maxAge: number): CookieOpts {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

/** Cookie options for the access + refresh tokens derived from a session. */
export function sessionCookieOptions(session: Session) {
  // access token lives ~ until expiry; refresh token longer (30 days).
  const accessMaxAge = Math.max(60, (session.expires_in ?? 3600) - 30);
  return {
    access: { value: session.access_token, opts: base(accessMaxAge) },
    refresh: { value: session.refresh_token, opts: base(60 * 60 * 24 * 30) },
  };
}

export function clearedCookieOptions() {
  return { ...base(0), maxAge: 0 };
}
