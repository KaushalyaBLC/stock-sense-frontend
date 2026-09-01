"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { PriceData } from "@/lib/store/market-api";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const RANGE_OPTIONS = [
  { label: "1W", value: "1W" },
  { label: "1M", value: "1M" },
  { label: "3M", value: "3M" },
  { label: "6M", value: "6M" },
  { label: "1Y", value: "1Y" },
];

const closeConfig: ChartConfig = {
  close: { label: "Close Price (LKR)", color: "var(--color-brand)" },
};
const volumeConfig: ChartConfig = {
  volume: { label: "Volume", color: "var(--color-n400)" },
};

function fmt(n: number) {
  return n.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtVol(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
function fmtDate(iso: string, compact = false) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-LK", compact ? { month: "short", day: "numeric" } : { year: "2-digit", month: "short", day: "numeric" });
}

interface Props {
  data: PriceData;
  range: string;
  onRangeChange: (r: string) => void;
}

export function PriceChart({ data, range, onRangeChange }: Props) {
  const [tab, setTab] = useState<"price" | "volume">("price");
  const points = data.points ?? [];

  // Compute summary stats
  const first = points[0]?.close ?? 0;
  const last = points[points.length - 1]?.close ?? 0;
  const change = last - first;
  const changePct = first > 0 ? (change / first) * 100 : 0;
  const high = Math.max(...points.map((p) => p.high));
  const low = Math.min(...points.map((p) => p.low));
  const avgVol = points.length > 0 ? points.reduce((s, p) => s + (p.volume ?? 0), 0) / points.length : 0;
  const isPos = change >= 0;
  const isNeutral = change === 0;

  const compact = points.length > 60;

  return (
    <div className="flex flex-col gap-4">
      {/* Header row: price + change */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-[30px] font-semibold leading-none tracking-tight tabular-nums">
              {fmt(last)}
            </span>
            <span className="text-[13px] text-text-secondary">LKR</span>
          </div>
          <div className={cn("mt-1.5 flex items-center gap-1 font-mono text-[13px] font-medium",
            isNeutral ? "text-text-secondary" : isPos ? "text-up-strong" : "text-down-strong"
          )}>
            {isNeutral ? <Minus className="size-3.5" /> : isPos ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
            <span>{isPos && !isNeutral ? "+" : ""}{fmt(change)}</span>
            <span>({isPos && !isNeutral ? "+" : ""}{changePct.toFixed(2)}%)</span>
            <span className="ml-1 font-sans font-normal text-text-muted">over {range}</span>
          </div>
        </div>

        {/* Range picker */}
        <div className="flex items-center gap-1 rounded-[7px] border border-border bg-surface-2 p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onRangeChange(opt.value)}
              className={cn(
                "rounded-[5px] px-3 py-1 text-[12.5px] font-medium transition-colors",
                range === opt.value
                  ? "bg-card text-foreground shadow-[0_1px_0_0_var(--border)]"
                  : "text-text-secondary hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 border-b border-border">
        {(["price", "volume"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "-mb-px border-b-2 px-1 pb-2 text-[12.5px] font-medium capitalize transition-colors",
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-foreground",
            )}
          >
            {t === "price" ? "Price" : "Volume"}
          </button>
        ))}
      </div>

      {/* Chart */}
      {points.length === 0 ? (
        <div className="flex h-60 items-center justify-center text-sm text-text-secondary">
          No price data available for this range.
        </div>
      ) : tab === "price" ? (
        <ChartContainer config={closeConfig} className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPos ? "var(--color-up)" : "var(--color-down)"} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={isPos ? "var(--color-up)" : "var(--color-down)"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => fmtDate(v, compact)}
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(v) => fmt(v)}
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                tickLine={false}
                axisLine={false}
                width={72}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [fmt(Number(value)), "Close"]}
                    labelFormatter={(label) => fmtDate(label)}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={isPos ? "var(--color-up)" : "var(--color-down)"}
                strokeWidth={2}
                fill="url(#priceGrad)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : (
        <ChartContainer config={volumeConfig} className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={points} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => fmtDate(v, compact)}
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={fmtVol}
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                tickLine={false}
                axisLine={false}
                width={56}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [fmtVol(Number(value)), "Volume"]}
                    labelFormatter={(label) => fmtDate(label)}
                  />
                }
              />
              <Bar dataKey="volume" fill="var(--color-n300)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}

      {/* OHLCV summary row */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Period High", value: `LKR ${fmt(high)}` },
          { label: "Period Low", value: `LKR ${fmt(low)}` },
          { label: "Avg Volume", value: fmtVol(avgVol) },
          { label: "Data Points", value: `${points.length} days` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-[7px] border border-border bg-surface-2 px-3 py-2.5 transition-colors duration-200 hover:border-primary/25"
          >
            <p className="text-[11px] text-text-muted">{label}</p>
            <p className="mt-0.5 font-mono text-[13.5px] font-semibold tabular-nums">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
