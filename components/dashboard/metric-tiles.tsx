import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Newspaper,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { ApiSignal, Overview } from "@/lib/server-market";
import { confidenceLabel } from "@/lib/plain-language";
import { cn } from "@/lib/utils";

/**
 * Dashboard KPI row - outcome-first for general users:
 *  - Most positive / most negative STOCK (real name, not a count)
 *  - News analyzed this week, Companies covered (with plain-language captions)
 * Falls back gracefully when a section is empty.
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

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <OutcomeTile signal={topPos} kind="up" />
      <OutcomeTile signal={topNeg} kind="down" />

      <CountTile
        label="News analyzed"
        caption="this week"
        value={newsWeek}
        icon={Newspaper}
      />
      <CountTile
        label="Companies covered"
        caption="with fresh signals"
        value={companies}
        icon={Building2}
      />
    </div>
  );
}

/** A tile that names the standout positive/negative stock. */
function OutcomeTile({
  signal,
  kind,
}: {
  signal: ApiSignal | undefined;
  kind: "up" | "down";
}) {
  const up = kind === "up";
  const Icon = up ? TrendingUp : TrendingDown;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  const accent = up
    ? "text-up-strong bg-up/12"
    : "text-down-strong bg-down/12";

  return (
    <div className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors duration-300 hover:border-primary/30">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-text-secondary">
          {up ? "Most positive this week" : "Most negative this week"}
        </span>
        <span className={cn("grid size-[34px] place-items-center rounded-md", accent)}>
          <Icon className="size-[18px]" />
        </span>
      </div>

      {signal ? (
        <Link
          href={`/dashboard/news/${signal.article_id}`}
          className="mt-2.5 flex flex-1 flex-col justify-end"
        >
          <div className="flex items-baseline gap-1.5">
            <span className="text-[22px] font-extrabold tracking-tight">
              {signal.ticker}
            </span>
            <span className={cn("inline-flex items-center text-xs font-bold", up ? "text-up-strong" : "text-down-strong")}>
              <Arrow className="size-3.5" />
            </span>
          </div>
          <div className="mt-0.5 truncate text-[12px] text-text-muted">
            {signal.company}
          </div>
          <div className="mt-1 text-[11.5px] font-medium text-text-secondary">
            {signal.confidence}% · {confidenceLabel(signal.confidence)}
          </div>
        </Link>
      ) : (
        <div className="mt-2.5 flex flex-1 items-end text-[13px] text-text-muted">
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
}: {
  label: string;
  caption: string;
  value: number | undefined;
  icon: typeof Newspaper;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-5 transition-colors duration-300 hover:border-primary/30">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-text-secondary">
          {label}
        </span>
        <span className="grid size-[34px] place-items-center rounded-md bg-brand-soft text-primary">
          <Icon className="size-[18px]" />
        </span>
      </div>
      <div className="mt-2.5 font-mono text-[30px] font-extrabold leading-none tracking-tight">
        {value == null ? "—" : value}
      </div>
      <div className="mt-1 text-[11.5px] text-text-muted">{caption}</div>
    </div>
  );
}
