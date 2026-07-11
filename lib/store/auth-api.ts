import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PublicUser } from "@/lib/api";

export type SignupArgs = { email: string; password: string; name?: string };
export type LoginArgs = { email: string; password: string };

export type LoginResponse = { user: PublicUser };
export type SignupResponse = {
  user: PublicUser | null;
  email_confirmation_required: boolean;
};

export type ApiErrorBody = {
  error: { code: string; message: string; details?: unknown };
};

/**
 * Talks to the Next BFF route handlers (same-origin), which proxy to core and
 * set httpOnly cookies. Tokens never reach client JS. `credentials: "include"`
 * ensures the Set-Cookie response is stored.
 */
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/auth", credentials: "include" }),
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupArgs>({
      query: (body) => ({ url: "/signup", method: "POST", body }),
    }),
    login: builder.mutation<LoginResponse, LoginArgs>({
      query: (body) => ({ url: "/login", method: "POST", body }),
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: "/logout", method: "POST" }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation } = authApi;

/** Pull a friendly message + code out of an RTK Query error. */
export function parseRtkError(err: unknown): { code: string; message: string } {
  if (err && typeof err === "object" && "status" in err) {
    const e = err as { status: number | string; data?: unknown };
    if (e.status === "FETCH_ERROR") {
      return {
        code: "network_error",
        message: "Couldn't reach the server. Check your connection and try again.",
      };
    }
    const body = e.data as ApiErrorBody | undefined;
    if (body?.error) return { code: body.error.code, message: body.error.message };
  }
  return { code: "unknown", message: "Something went wrong. Please try again." };
}
