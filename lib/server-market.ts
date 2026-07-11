import "server-only";
import { cookies } from "next/headers";
import { API_BASE } from "@/lib/api";
import { ACCESS_COOKIE } from "@/lib/auth-cookies";
import type { SignalKind } from "@/lib/dashboard-data";

export type ApiSignal = {
  ticker: string;
  company: string;
  sector: string;
  signal: SignalKind;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  magnitude: string;
  reason: string;
  article_id: number;
  analyzed_at: string;
};

export type ApiNews = {
  id: number;
  title: string;
  source: string;
  url: string | null;
  published_at: string | null;
  time: string;
  signal: SignalKind;
  magnitude: string;
  confidence: number;
  summary: string;
  affected_tickers: string[];
};

export type Overview = {
  metrics: {
    news_analyzed_week: number;
    companies_affected: number;
    high_confidence_signals: number;
    watchlist_alerts: number;
  };
  brief: { mood: string; summary: string; badges: string[] };
  top_positive: ApiSignal[];
  top_negative: ApiSignal[];
  latest_news: ApiNews[];
};

export type NewsCompany = ApiSignal & {
  bull_case: string | null;
  bear_case: string | null;
  time_horizon: string | null;
};

export type TrailStep = {
  step: string;
  decision: string;
  reason: string;
  details?: Record<string, unknown>;
  elapsed_ms?: number;
};

export type NewsDetail = {
  id: number;
  title: string;
  source: string;
  url: string | null;
  published_at: string | null;
  content: string | null;
  affects_cse: boolean | null;
  affected_sectors: string[];
  classification_reasoning: string | null;
  macro_context: string | null;
  decision_trail: { steps?: TrailStep[]; final_verdict?: string } | null;
  companies: NewsCompany[];
};

/** Server-side GET against core's market API, authed by the access-token cookie. */
async function marketFetch<T>(path: string): Promise<T | null> {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/api/market${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data ?? null) as T | null;
  } catch {
    return null;
  }
}

/** Dashboard overview. */
export function getOverview() {
  return marketFetch<Overview>("/dashboard/overview");
}

/** Full analysis for one article (the View Analysis page). */
export function getNewsDetail(id: number) {
  return marketFetch<NewsDetail>(`/news/${id}`);
}

/** All current signals (one per ticker), newest/most-confident first. */
export function getSignals(params?: { tone?: string; limit?: number }) {
  const q = new URLSearchParams();
  if (params?.tone) q.set("tone", params.tone);
  if (params?.limit) q.set("limit", String(params.limit));
  const qs = q.toString();
  return marketFetch<ApiSignal[]>(`/signals${qs ? `?${qs}` : ""}`);
}

/** Recent analyzed news. */
export function getNews(params?: { limit?: number }) {
  const q = new URLSearchParams();
  if (params?.limit) q.set("limit", String(params.limit));
  const qs = q.toString();
  return marketFetch<ApiNews[]>(`/news${qs ? `?${qs}` : ""}`);
}
