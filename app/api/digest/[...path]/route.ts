import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE } from "@/lib/api";
import { ACCESS_COOKIE } from "@/lib/auth-cookies";

/**
 * BFF passthrough: forwards GET/POST /api/digest/* to core with the
 * access-token cookie as a Bearer header. Keeps the token server-side
 * (httpOnly), so the browser can call same-origin digest endpoints without
 * seeing the token. Mirrors app/api/market/[...path]/route.ts.
 */
async function proxy(req: Request, path: string[], method: "GET" | "POST") {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Not signed in." } },
      { status: 401 },
    );
  }

  const search = new URL(req.url).search;
  const target = `${API_BASE}/api/digest/${path.join("/")}${search}`;

  const res = await fetch(target, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(req, path, "GET");
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(req, path, "POST");
}
