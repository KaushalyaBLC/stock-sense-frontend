import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Newspaper,
  Building2,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignalBadge, MetaChip } from "@/components/dashboard/signal-badge";
import { confidenceLabel, riskLabel } from "@/lib/plain-language";
import { getOverview, getSignals, getNews } from "@/lib/server-market";
import { symbolFull } from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "Weekly Market Summary — StockSense" };

const today = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default async function DailySummaryPage() {
  const [overview, signals, news] = await Promise.all([
    getOverview(),
    getSignals({ limit: 100 }),
    getNews({ limit: 8 }),
  ]);

  const brief = overview?.brief;
  const metrics = overview?.metrics;
  const allSignals = signals ?? [];
  const positives = allSignals.filter((s) => s.signal.includes("positive"));
  const negatives = allSignals.filter((s) => s.signal.includes("negative"));

  // Sector rollup
  const sectorMap = new Map<string, { pos: number; neg: number }>();
  for (const s of allSignals) {
    const e = sectorMap.get(s.sector) ?? { pos: 0, neg: 0 };
    if (s.signal.includes("positive")) e.pos += 1;
    else if (s.signal.includes("negative")) e.neg += 1;
    sectorMap.set(s.sector, e);
  }
  const sectors = Array.from(sectorMap.entries())
    .map(([name, v]) => ({ name, ...v, total: v.pos + v.neg }))
    .filter((s) => s.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="mx-auto max-w-[920px]">
      <Link
        href="/dashboard"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      <div className="mb-1 text-sm font-medium text-text-muted">{today()}</div>
      <h1 className="text-[28px] font-extrabold tracking-tight">
        Weekly Market Summary
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Your AI brief of this week&apos;s CSE signals, sectors, and news.
      </p>

      {/* Brief hero */}
      <div className="mt-6 overflow-hidden rounded-[18px] bg-navy p-6">
        <div className="mb-2.5 flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-[9px] bg-primary/25 text-blue-400">
            <Sparkles className="size-4" />
          </span>
          <span className="text-[15px] font-bold text-white">AI Market Brief</span>
        </div>
        <div className="mb-2 text-2xl font-bold text-white">
          Market mood:{" "}
          <span className="text-amber-400">{brief?.mood ?? "Mixed"}</span>
        </div>
        <p className="max-w-2xl text-[15px] leading-relaxed text-slate-300">
          {brief?.summary ?? "No summary available yet."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(brief?.badges ?? []).map((b) => (
            <span
              key={b}
              className="rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-xs font-semibold text-slate-200"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="News Analyzed This Week" value={metrics?.news_analyzed_week} icon={Newspaper} />
        <Stat label="Companies Affected" value={metrics?.companies_affected} icon={Building2} />
        <Stat label="Positive Signals" value={positives.length} icon={TrendingUp} tone="up" />
        <Stat label="High Confidence" value={metrics?.high_confidence_signals} icon={ShieldCheck} />
      </div>

      {/* Sector rollup */}
      {sectors.length > 0 && (
        <Card title="Sectors in focus">
          <div className="flex flex-col divide-y divide-border">
            {sectors.map((s) => (
              <div key={s.name} className="flex items-center justify-between py-2.5">
                <span className="text-sm font-medium">{s.name}</span>
                <div className="flex items-center gap-3 font-mono text-xs">
                  {s.pos > 0 && (
                    <span className="text-up-strong">▲ {s.pos}</span>
                  )}
                  {s.neg > 0 && (
                    <span className="text-down-strong">▼ {s.neg}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Signals: positive + negative */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <SignalColumn title="Positive Signals" tone="up" items={positives} />
        <SignalColumn title="Negative Signals" tone="down" items={negatives} />
      </div>

      {/* This week's news */}
      {news && news.length > 0 && (
        <Card title="This Week's Analyzed News">
          <div className="flex flex-col gap-2.5">
            {news.map((n) => (
              <Link
                key={n.id}
                href={`/dashboard/news/${n.id}`}
                className="flex items-start gap-3 rounded-[10px] border border-border bg-surface-2/40 p-3 transition-colors hover:border-primary/30"
              >
                <SignalBadge sig={n.signal} className="mt-0.5 shrink-0 px-2 py-0.5" />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold">{n.title}</div>
                  <div className="text-[12px] text-text-muted">
                    {n.source}
                    {n.time ? ` · ${n.time}` : ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Subscribe nudge */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3.5 rounded-[16px] border border-border bg-gradient-to-r from-card to-surface-2 p-[22px]">
        <div>
          <div className="text-base font-bold">Get this summary every morning.</div>
          <div className="mt-1 text-[13.5px] text-text-secondary">
            We&apos;ll send the brief, top signals, and watchlist updates to your inbox.
          </div>
        </div>
        <Button>Subscribe</Button>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-[12px] border border-warn/30 bg-warn/[0.08] px-4 py-3 text-[12.5px] text-text-secondary">
        <TriangleAlert className="size-4 shrink-0 text-warn" />
        StockSense provides AI-powered decision support only. It is not financial advice.
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | undefined;
  icon: typeof Newspaper;
  tone?: "up";
}) {
  return (
    <div className="rounded-[16px] border border-border bg-card p-[18px] shadow-[var(--shadow,0_1px_2px_rgba(15,23,42,0.05))]">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-text-secondary">{label}</span>
        <span
          className={`grid size-[34px] place-items-center rounded-[10px] ${
            tone === "up" ? "bg-up/12 text-up-strong" : "bg-brand-soft text-primary"
          }`}
        >
          <Icon className="size-[18px]" />
        </span>
      </div>
      <div className="mt-2.5 font-mono text-[30px] font-extrabold tracking-tight">
        {value ?? "—"}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 rounded-[16px] border border-border bg-card p-6 shadow-[var(--shadow,0_1px_2px_rgba(15,23,42,0.05))]">
      <h2 className="mb-4 text-base font-bold">{title}</h2>
      {children}
    </section>
  );
}

function SignalColumn({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "up" | "down";
  items: Array<{
    ticker: string;
    company: string;
    sector: string;
    signal: import("@/lib/dashboard-data").SignalKind;
    confidence: number;
    risk: string;
    article_id: number;
  }>;
}) {
  const Icon = tone === "up" ? TrendingUp : TrendingDown;
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`size-4 ${tone === "up" ? "text-up-strong" : "text-down-strong"}`} />
        <span className="text-base font-bold">{title}</span>
        <span className="font-mono text-sm text-text-muted">({items.length})</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {items.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-border bg-surface/50 p-5 text-center text-[13px] text-text-secondary">
            None today.
          </div>
        ) : (
          items.map((s) => (
            <Link
              key={s.ticker}
              href={`/dashboard/news/${s.article_id}`}
              className="rounded-[12px] border border-border bg-card p-3.5 transition-colors hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] font-bold">{s.company}</div>
                  <div className="font-mono text-[11.5px] text-text-muted">
                    {symbolFull(s.ticker)} · {s.sector}
                  </div>
                </div>
                <SignalBadge sig={s.signal} />
              </div>
              <div className="mt-2.5 flex gap-2">
                <MetaChip tone={s.confidence >= 75 ? "brand" : "muted"}>
                  {s.confidence}% · {confidenceLabel(s.confidence)}
                </MetaChip>
                <MetaChip tone={s.risk === "High" ? "red" : s.risk === "Medium" ? "amber" : "muted"}>
                  {riskLabel(s.risk)}
                </MetaChip>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
