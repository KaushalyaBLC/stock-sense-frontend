import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE } from "@/lib/api";
import { ACCESS_COOKIE } from "@/lib/auth-cookies";

/**
 * BFF passthrough: forwards GET /api/market/* to core with the access-token
 * cookie as a Bearer header. Keeps the token server-side (httpOnly), so the
 * browser can call same-origin market endpoints without seeing the token.
 */
export async function GET(
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
  const search = new URL(req.url).search;
  const target = `${API_BASE}/api/market/${path.join("/")}${search}`;

  const res = await fetch(target, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
