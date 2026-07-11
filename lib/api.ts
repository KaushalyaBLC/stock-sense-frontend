/**
 * Thin client for the StockSense `core` backend.
 * Base URL from NEXT_PUBLIC_API_URL, falling back to the deployed core service.
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://core-stocksense-backend.vercel.app";

export type ApiError = { code: string; message: string; details?: unknown };

export type Session = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
};

export type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
};

export type SignupResult = {
  user: PublicUser | null;
  session: Session | null;
  email_confirmation_required: boolean;
};

export type LoginResult = { user: PublicUser; session: Session };

class ApiRequestError extends Error {
  code: string;
  status: number;
  details?: unknown;
  constructor(status: number, err: ApiError) {
    super(err.message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = err.code;
    this.details = err.details;
  }
}

async function request<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiRequestError(0, {
      code: "network_error",
      message: "Couldn't reach the server. Check your connection and try again.",
    });
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err: ApiError = data?.error ?? {
      code: "unknown",
      message: "Something went wrong. Please try again.",
    };
    throw new ApiRequestError(res.status, err);
  }
  return data as T;
}

export const auth = {
  signup: (input: { email: string; password: string; name?: string }) =>
    request<SignupResult>("/api/auth/signup", input),
  login: (input: { email: string; password: string }) =>
    request<LoginResult>("/api/auth/login", input),
};

export { ApiRequestError };
