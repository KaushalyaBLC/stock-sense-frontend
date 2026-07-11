import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE } from "@/lib/api";
import { ACCESS_COOKIE } from "@/lib/auth-cookies";

/**
 * BFF passthrough for chat: forwards POST /api/chat/* to core with the
 * access-token cookie as a Bearer header. Keeps the token httpOnly.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Not signed in." } },
      { status: 401 },
    );
  }

  const { path } = await params;
  const body = await req.text(); // pass through as-is
  const target = `${API_BASE}/api/chat/${path.join("/")}`;

  const res = await fetch(target, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body,
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
