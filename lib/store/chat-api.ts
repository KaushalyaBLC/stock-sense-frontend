import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type ChatResponse = {
  answer: string;
  sources?: {
    companies?: string[];
    news?: { article_id: number; title: string }[];
  };
  company?: string;
  article?: { id: number; title: string };
};

type GeneralArgs = { message: string; history?: ChatTurn[] };
type NewsArgs = { id: number; message: string; history?: ChatTurn[] };
type CompanyArgs = { ticker: string; message: string; history?: ChatTurn[] };

/** Chat mutations → same-origin BFF (/api/chat/*) → core with the cookie token. */
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/chat", credentials: "include" }),
  endpoints: (builder) => ({
    generalChat: builder.mutation<ChatResponse, GeneralArgs>({
      query: (body) => ({ url: "/general", method: "POST", body }),
      transformResponse: (r: { data: ChatResponse }) => r.data,
    }),
    newsChat: builder.mutation<ChatResponse, NewsArgs>({
      query: ({ id, ...body }) => ({ url: `/news/${id}`, method: "POST", body }),
      transformResponse: (r: { data: ChatResponse }) => r.data,
    }),
    companyChat: builder.mutation<ChatResponse, CompanyArgs>({
      query: ({ ticker, ...body }) => ({ url: `/company/${ticker}`, method: "POST", body }),
      transformResponse: (r: { data: ChatResponse }) => r.data,
    }),
  }),
});

export const {
  useGeneralChatMutation,
  useNewsChatMutation,
  useCompanyChatMutation,
} = chatApi;
