"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignalBadge } from "@/components/dashboard/signal-badge";
import {
  useGetNewsFeedQuery,
  useGetSectorsQuery,
} from "@/lib/store/market-api";
import { cn } from "@/lib/utils";

const SIGNALS = [
  { label: "All", value: "" },
  { label: "Positive", value: "positive" },
  { label: "Negative", value: "negative" },
  { label: "Neutral", value: "neutral" },
];

const RANGES = [
  { label: "All time", value: "" },
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
];

const PAGE_SIZE = 12;

export default function NewsPage() {
  const [sig, setSig] = useState("");
  const [sector, setSector] = useState("");
  const [range, setRange] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data: sectors } = useGetSectorsQuery();

  // Debounce the search box; reset to page 0 when the term lands.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Filter handlers reset to page 0 directly (no setState-in-effect).
  const onFilter = (set: (v: string) => void) => (v: string) => {
    set(v);
    setPage(0);
  };

  const { data, isFetching, isError } = useGetNewsFeedQuery({
    page,
    pageSize: PAGE_SIZE,
    sig: sig || undefined,
    sector: sector || undefined,
    range: range || undefined,
    search: search || undefined,
  });

  // RTK Query merges pages into data.data via the endpoint's `merge`.
  const items = data?.data ?? [];
  const hasMore = data?.hasMore ?? false;
  const loadingFirst = isFetching && page === 0;

  const activeFilters = Boolean(sig || sector || range || search);

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="mb-5">
        <h1 className="text-[27px] font-extrabold tracking-tight">Market News</h1>
        <p className="mt-1 text-sm text-text-secondary">
          AI-analyzed CSE news, filtered and searchable.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 rounded-[14px] border border-border bg-card p-4">
        {/* Search */}
        <div className="flex items-center gap-2.5 rounded-[10px] border border-border bg-bg px-3.5 py-2.5">
          <Search className="size-4 text-text-muted" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search headlines…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <FilterGroup label="Signal" options={SIGNALS} value={sig} onChange={onFilter(setSig)} />
          <FilterGroup label="Date" options={RANGES} value={range} onChange={onFilter(setRange)} />
          {/* Sector dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Sector
            </span>
            <select
              value={sector}
              onChange={(e) => onFilter(setSector)(e.target.value)}
              className="rounded-[8px] border border-border bg-bg px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
            >
              <option value="">All sectors</option>
              {(sectors ?? []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {activeFilters && (
            <button
              onClick={() => {
                setSig("");
                setSector("");
                setRange("");
                setSearchInput("");
                setSearch("");
                setPage(0);
              }}
              className="text-[13px] font-semibold text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loadingFirst ? (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[92px] animate-pulse rounded-[14px] border border-border bg-surface-2/50"
            />
          ))}
        </div>
      ) : isError ? (
        <Empty text="Couldn't load news. Please try again." />
      ) : items.length === 0 ? (
        <Empty text="No news matches these filters." />
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((n) => (
            <Link
              key={n.id}
              href={`/dashboard/news/${n.id}`}
              className="group flex flex-wrap items-start gap-3.5 rounded-[14px] border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="min-w-[200px] flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <SignalBadge sig={n.signal} className="px-2 py-0.5" />
                  <span className="text-[11.5px] text-text-muted">
                    {n.source}
                    {n.time ? ` · ${n.time}` : ""}
                  </span>
                  {n.affected_tickers?.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10.5px] font-medium text-text-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mb-1 text-[14.5px] font-bold">{n.title}</div>
                <div className="line-clamp-2 text-[12.5px] leading-relaxed text-text-secondary">
                  {n.summary}
                </div>
              </div>
              <span className="self-center whitespace-nowrap text-[12.5px] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                View Analysis →
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Load more */}
      {!loadingFirst && hasMore && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Loading…
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}

      {!loadingFirst && !hasMore && items.length > 0 && (
        <p className="mt-6 text-center text-[12.5px] text-text-muted">
          You&apos;ve reached the end.
        </p>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[12.5px] font-semibold transition-colors",
              value === o.value
                ? "bg-primary text-primary-foreground"
                : "bg-surface-2 text-text-secondary hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="grid place-items-center rounded-[14px] border border-dashed border-border bg-surface/50 p-12 text-center">
      <Newspaper className="size-8 text-text-muted" />
      <p className="mt-3 text-sm text-text-secondary">{text}</p>
    </div>
  );
}
