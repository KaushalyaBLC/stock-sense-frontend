import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type DigestStatus = { subscribed: boolean };

/**
 * Daily/weekly email digest opt-in. Same-origin BFF (/api/digest/*), which
 * forwards to core with the httpOnly access-token cookie. One-shot reads, no
 * polling — subscribe/unsubscribe return the new state directly.
 */
export const digestApi = createApi({
  reducerPath: "digestApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/digest", credentials: "include" }),
  endpoints: (builder) => ({
    getDigestStatus: builder.query<DigestStatus, void>({
      query: () => "/status",
      transformResponse: (r: { data: DigestStatus }) => r.data,
    }),
    subscribeToDigest: builder.mutation<DigestStatus, void>({
      query: () => ({ url: "/subscribe", method: "POST" }),
      transformResponse: (r: { data: DigestStatus }) => r.data,
    }),
    unsubscribeFromDigest: builder.mutation<DigestStatus, void>({
      query: () => ({ url: "/unsubscribe", method: "POST" }),
      transformResponse: (r: { data: DigestStatus }) => r.data,
    }),
  }),
});

export const {
  useGetDigestStatusQuery,
  useSubscribeToDigestMutation,
  useUnsubscribeFromDigestMutation,
} = digestApi;
