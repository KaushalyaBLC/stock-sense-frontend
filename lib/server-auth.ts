import "server-only";
import { cookies } from "next/headers";
import { API_BASE, type PublicUser } from "@/lib/api";
import { ACCESS_COOKIE } from "@/lib/auth-cookies";

/**
 * Server-side: resolve the current user from the access-token cookie by calling
 * core's /api/auth/me. Returns null if no/invalid token. Used by the layout to
 * seed client state and by the dashboard as a guard.
 */
export async function getCurrentUser(): Promise<PublicUser | null> {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.user ?? null) as PublicUser | null;
  } catch {
    return null;
  }
}
