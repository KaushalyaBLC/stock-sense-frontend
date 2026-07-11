import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiNews, ApiSignal, Overview } from "@/lib/server-market";

export type PricePoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type PriceData = {
  ticker: string;
  range: string;
  points: PricePoint[];
};

/**
 * Client-side reads for dashboard sub-pages. Calls the same-origin BFF
 * (/api/market/*), which forwards to core with the httpOnly access-token cookie.
 */
export const marketApi = createApi({
  reducerPath: "marketApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/market", credentials: "include" }),
  endpoints: (builder) => ({
    getOverview: builder.query<Overview, void>({
      query: () => "/dashboard/overview",
      transformResponse: (r: { data: Overview }) => r.data,
    }),
    getSignals: builder.query<ApiSignal[], { tone?: string; sector?: string; limit?: number } | void>({
      query: (args) => {
        const p = new URLSearchParams();
        if (args?.tone) p.set("tone", args.tone);
        if (args?.sector) p.set("sector", args.sector);
        if (args?.limit) p.set("limit", String(args.limit));
        const qs = p.toString();
        return `/signals${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (r: { data: ApiSignal[] }) => r.data,
    }),
    getNews: builder.query<ApiNews[], { sig?: string; limit?: number } | void>({
      query: (args) => {
        const p = new URLSearchParams();
        if (args?.sig) p.set("sig", args.sig);
        if (args?.limit) p.set("limit", String(args.limit));
        const qs = p.toString();
        return `/news${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (r: { data: ApiNews[] }) => r.data,
    }),
    // Infinite list: RTK accumulates pages in the cache keyed by the FILTERS
    // (page excluded from the cache key), so the component never setState-s to
    // accumulate. Bumping `page` fetches & merges the next page.
    getNewsFeed: builder.query<
      { data: ApiNews[]; page: number; hasMore: boolean },
      NewsFeedArgs
    >({
      query: (args) => {
        const p = new URLSearchParams();
        p.set("page", String(args.page ?? 0));
        p.set("page_size", String(args.pageSize ?? 12));
        if (args.sig) p.set("sig", args.sig);
        if (args.sector) p.set("sector", args.sector);
        if (args.search) p.set("search", args.search);
        if (args.range) p.set("range", args.range);
        return `/news/feed?${p.toString()}`;
      },
      serializeQueryArgs: ({ queryArgs }) => {
        // Cache key = filters only (not page), so pages merge into one entry.
        return {
          sig: queryArgs.sig,
          sector: queryArgs.sector,
          search: queryArgs.search,
          range: queryArgs.range,
          pageSize: queryArgs.pageSize,
        };
      },
      merge: (current, incoming) => {
        if (incoming.page === 0) return incoming;
        const seen = new Set(current.data.map((n) => n.id));
        return {
          data: [...current.data, ...incoming.data.filter((n) => !seen.has(n.id))],
          page: incoming.page,
          hasMore: incoming.hasMore,
        };
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page,
    }),
    getSectors: builder.query<string[], void>({
      query: () => "/sectors",
      transformResponse: (r: { data: string[] }) => r.data,
    }),
    getPrices: builder.query<PriceData, { ticker: string; range?: string }>({
      query: ({ ticker, range = "3M" }) => `/prices/${ticker}?range=${range}`,
      transformResponse: (r: { data: PriceData }) => r.data,
    }),
  }),
});

export type NewsFeedArgs = {
  page?: number;
  pageSize?: number;
  sig?: string;
  sector?: string;
  search?: string;
  range?: string;
};

export const {
  useGetOverviewQuery,
  useGetSignalsQuery,
  useGetNewsQuery,
  useGetNewsFeedQuery,
  useGetSectorsQuery,
  useGetPricesQuery,
} = marketApi;
