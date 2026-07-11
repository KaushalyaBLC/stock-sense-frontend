import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth-cookies";

/** Clears the auth cookies. (core logout/token-revocation can be wired later.) */
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  return NextResponse.json({ success: true });
}
