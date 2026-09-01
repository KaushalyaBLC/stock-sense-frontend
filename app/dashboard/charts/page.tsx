"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BarChart2, Loader2, AlertCircle, Search } from "lucide-react";
import { useGetPricesQuery, useGetSignalsQuery } from "@/lib/store/market-api";
import { PriceChart } from "@/components/charts/price-chart";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

// Hardcoded tracked tickers (mirrors core/src/modules/prices/cseTickers.js)
const TICKERS = [
  "JKH", "HAYL", "SHL", "SUN",
  "COMB", "SAMP", "HNB", "NTB", "LFIN",
  "ASIR", "DIAL", "SLTL",
  "CTC", "LION", "CARG",
  "AEL", "TKYO", "DIMO",
  "LGAZ", "LIOC", "HSIG", "TJL",
];

export default function ChartsPage() {
  const [ticker, setTicker] = useState("JKH");
  const [range, setRange] = useState("3M");
  const [search, setSearch] = useState("");
  const reduce = useReducedMotion();

  const { data, isFetching, isError } = useGetPricesQuery(
    { ticker, range },
    { skip: !ticker },
  );

  // Get signal data to show alongside price
  const { data: signals } = useGetSignalsQuery();
  const signal = signals?.find((s) => s.ticker === ticker);

  const filteredTickers = TICKERS.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-[1100px]">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-semibold tracking-tight">Price Charts</h1>
        <p className="mt-1.5 text-[14px] text-text-secondary">
          Historical OHLCV price data for CSE-listed companies.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Ticker sidebar */}
        <aside className="flex flex-col gap-2">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-[7px] border border-border bg-background px-3 py-2 transition-colors focus-within:border-primary/40">
            <Search className="size-3.5 shrink-0 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticker..."
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-text-muted"
            />
          </div>

          {/* Ticker list */}
          <div className="rounded-[10px] border border-border bg-card p-1.5">
            {filteredTickers.length === 0 ? (
              <p className="px-2 py-3 text-center text-xs text-text-muted">No match</p>
            ) : (
              filteredTickers.map((t) => {
                const sig = signals?.find((s) => s.ticker === t);
                const isPos = sig?.signal.includes("positive");
                const isNeg = sig?.signal.includes("negative");
                const active = ticker === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTicker(t)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-[7px] px-3 py-2 text-left text-[13.5px] transition-colors duration-150",
                      active
                        ? "bg-brand-soft font-medium text-primary"
                        : "text-text-secondary hover:bg-surface-2 hover:text-foreground",
                    )}
                  >
                    <span className="font-mono">{t}</span>
                    {sig && (
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          isPos ? "bg-up" : isNeg ? "bg-down" : "bg-n300",
                        )}
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Chart panel */}
        <Reveal className="rounded-[10px] border border-border bg-card p-5 sm:p-6">
          {/* Ticker header */}
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-md bg-brand-soft text-primary">
                <BarChart2 className="size-[18px]" />
              </span>
              <div>
                <h2 className="font-mono text-[17px] font-semibold leading-tight tracking-tight">
                  {ticker}
                </h2>
                {signal && (
                  <p className="text-[12.5px] text-text-secondary">{signal.company}</p>
                )}
              </div>
            </div>
            {signal && (
              <div className="flex flex-wrap gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11.5px] font-medium",
                    signal.signal.includes("positive")
                      ? "bg-up/10 text-up-strong"
                      : signal.signal.includes("negative")
                        ? "bg-down/10 text-down-strong"
                        : "bg-surface-2 text-text-secondary",
                  )}
                >
                  {signal.signal.replace("-", " ")}
                </span>
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-[11.5px] font-medium text-text-secondary">
                  {signal.confidence}% confidence
                </span>
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11.5px] font-medium text-text-secondary">
                  {signal.sector}
                </span>
              </div>
            )}
          </div>

          {/* State: loading */}
          {isFetching && (
            <div className="flex h-72 items-center justify-center gap-2 text-[13.5px] text-text-secondary">
              <Loader2 className="size-4 animate-spin" />
              Loading price data...
            </div>
          )}

          {/* State: error */}
          {isError && !isFetching && (
            <div className="flex h-72 flex-col items-center justify-center gap-2 text-[13.5px] text-text-secondary">
              <AlertCircle className="size-5 text-down" />
              <p>Could not load price data. Please try again.</p>
            </div>
          )}

          {/* State: no data */}
          {!isFetching && !isError && data && data.points.length === 0 && (
            <div className="flex h-72 flex-col items-center justify-center gap-2 text-[13.5px] text-text-secondary">
              <BarChart2 className="size-6 opacity-30" />
              <p>No historical price data available for <strong>{ticker}</strong> in this range.</p>
            </div>
          )}

          {/* Chart */}
          {!isFetching && !isError && data && data.points.length > 0 && (
            <motion.div
              key={`${ticker}-${range}`}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <PriceChart
                data={data}
                range={range}
                onRangeChange={setRange}
              />
            </motion.div>
          )}

          {/* AI signal context */}
          {signal?.reason && (
            <div className="mt-5 rounded-[7px] border border-border bg-surface-2 p-3.5">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Latest AI Signal Reason
              </p>
              <p className="text-[13px] leading-relaxed text-foreground">{signal.reason}</p>
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}
