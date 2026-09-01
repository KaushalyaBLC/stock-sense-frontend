import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Newspaper,
  Building2,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { ApiSignal, Overview } from "@/lib/server-market";
import { confidenceLabel } from "@/lib/plain-language";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

/**
 * Dashboard KPI bento - outcome-first for general users. The standout stock
 * (real name, not a count) gets a large featured cell; counts are smaller
 * supporting cells. Deliberately asymmetric, not four equal boxes.
 */
export function MetricTiles({
  overview,
}: {
  overview: Overview | null | undefined;
}) {
  const topPos = overview?.top_positive?.[0];
  const topNeg = overview?.top_negative?.[0];
  const newsWeek = overview?.metrics?.news_analyzed_week;
  const companies = overview?.metrics?.companies_affected;
  const highConfidence = overview?.metrics?.high_confidence_signals;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Reveal className="sm:col-span-2 lg:col-span-1 lg:row-span-2">
        <FeaturedTile signal={topPos} kind="up" />
      </Reveal>
      <Reveal delay={0.06}>
        <FeaturedTile signal={topNeg} kind="down" compact />
      </Reveal>
      <Reveal delay={0.1}>
        <CountTile
          label="News analyzed"
          caption="this week"
          value={newsWeek}
          icon={Newspaper}
          tone="brand"
        />
      </Reveal>
      <Reveal delay={0.14}>
        <CountTile
          label="Companies covered"
          caption="with fresh signals"
          value={companies}
          icon={Building2}
          tone="warn"
        />
      </Reveal>
      <Reveal delay={0.18}>
        <CountTile
          label="High-confidence signals"
          caption="70%+ certainty"
          value={highConfidence}
          icon={Target}
          tone="up"
        />
      </Reveal>
    </div>
  );
}

/** The large featured cell naming the standout positive stock. */
function FeaturedTile({
  signal,
  kind,
  compact = false,
}: {
  signal: ApiSignal | undefined;
  kind: "up" | "down";
  compact?: boolean;
}) {
  const up = kind === "up";
  const Icon = up ? TrendingUp : TrendingDown;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  const accent = up ? "text-up-strong bg-up/10" : "text-down-strong bg-down/10";

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[10px] border border-border bg-card p-5 shadow-[0_1px_0_0_var(--border)] transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0_1px_0_0_var(--border),0_20px_48px_-16px_rgba(15,23,42,0.16)]",
        compact ? "" : "sm:p-6",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-text-secondary">
          {up ? "Most positive this week" : "Most negative this week"}
        </span>
        <span className={cn("grid size-8 place-items-center rounded-md", accent)}>
          <Icon className="size-[17px]" />
        </span>
      </div>

      {signal ? (
        <Link
          href={`/dashboard/news/${signal.article_id}`}
          className={cn(
            "mt-4 flex flex-1 flex-col justify-end transition-transform duration-200 active:translate-y-px",
            compact ? "" : "sm:mt-8",
          )}
        >
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "font-mono font-semibold tracking-tight",
                compact ? "text-[22px]" : "text-[34px]",
              )}
            >
              {signal.ticker}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
                up ? "bg-up/10 text-up-strong" : "bg-down/10 text-down-strong",
              )}
            >
              <Arrow className="size-3.5" />
            </span>
          </div>
          <div className="mt-1 truncate text-[13px] text-text-muted">
            {signal.company}
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-text-secondary">
              <span>Confidence</span>
              <span className="font-mono font-medium text-foreground">
                {signal.confidence}% · {confidenceLabel(signal.confidence)}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className={cn("h-full rounded-full", up ? "bg-up" : "bg-down")}
                style={{ width: `${signal.confidence}%` }}
              />
            </div>
          </div>
        </Link>
      ) : (
        <div className="mt-4 flex flex-1 items-end text-[13px] text-text-muted">
          None this week
        </div>
      )}
    </div>
  );
}

/** A tile for a plain count with a friendly caption. */
function CountTile({
  label,
  caption,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  caption: string;
  value: number | undefined;
  icon: typeof Newspaper;
  tone: "brand" | "warn" | "up";
}) {
  const accent =
    tone === "brand"
      ? "bg-brand-soft text-primary"
      : tone === "warn"
        ? "bg-warn/12 text-warn"
        : "bg-up/10 text-up-strong";

  return (
    <div className="flex h-full flex-col justify-between rounded-[10px] border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_0_0_var(--border),0_16px_40px_-16px_rgba(15,23,42,0.14)]">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-text-secondary">
          {label}
        </span>
        <span className={cn("grid size-8 place-items-center rounded-md", accent)}>
          <Icon className="size-[17px]" />
        </span>
      </div>
      <div>
        <div className="font-mono text-[32px] font-semibold leading-none tracking-tight">
          {value == null ? "—" : value}
        </div>
        <div className="mt-1.5 text-[11.5px] text-text-muted">{caption}</div>
      </div>
    </div>
  );
}
