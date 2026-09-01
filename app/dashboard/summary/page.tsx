import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Newspaper,
  Building2,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { SummaryBrief } from "@/components/dashboard/summary-brief";
import { SummarySignalRow } from "@/components/dashboard/summary-signal-row";
import { NewsStrip } from "@/components/dashboard/news-strip";
import { getOverview, getSignals, getNews } from "@/lib/server-market";

export const metadata: Metadata = { title: "Weekly Market Summary - StockSense" };

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
  const maxSectorTotal = Math.max(1, ...sectors.map((s) => s.total));

  const newsItems = (news ?? []).map((n) => ({
    id: n.id,
    title: n.title,
    source: n.source,
    time: n.time,
    signal: n.signal,
    summary: n.summary,
  }));

  return (
    <div className="mx-auto max-w-[1000px]">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-[13.5px] text-text-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      <div className="mb-1 text-[13px] font-medium text-text-muted">{today()}</div>
      <h1 className="text-[26px] font-semibold tracking-tight">Weekly Market Summary</h1>
      <p className="mt-1.5 text-[14px] text-text-secondary">
        Your AI brief of this week&apos;s CSE signals, sectors, and news.
      </p>

      {/* Brief hero */}
      <SummaryBrief
        mood={brief?.mood ?? "Mixed"}
        summary={brief?.summary ?? "No summary available yet."}
        badges={brief?.badges ?? []}
      />

      {/* Metrics - bento layout, one featured cell */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal className="sm:col-span-2 lg:col-span-2">
          <FeaturedStat
            label="Positive signals this week"
            value={positives.length}
            icon={TrendingUp}
            tone="up"
          />
        </Reveal>
        <Reveal delay={0.06}>
          <Stat label="News analyzed" value={metrics?.news_analyzed_week} icon={Newspaper} />
        </Reveal>
        <Reveal delay={0.1}>
          <Stat label="Companies affected" value={metrics?.companies_affected} icon={Building2} />
        </Reveal>
        <Reveal delay={0.14} className="sm:col-span-2 lg:col-span-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <Stat label="High confidence" value={metrics?.high_confidence_signals} icon={ShieldCheck} />
            <Stat
              label="Negative signals this week"
              value={negatives.length}
              icon={TrendingDown}
              tone="down"
            />
          </div>
        </Reveal>
      </div>

      {/* Sector rollup */}
      {sectors.length > 0 && (
        <Reveal delay={0.06} className="mt-8">
          <Card title="Sectors in focus">
            <div className="flex flex-col gap-3">
              {sectors.map((s) => (
                <div key={s.name}>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]">
                    <span className="font-medium">{s.name}</span>
                    <span className="flex items-center gap-3 font-mono text-xs">
                      {s.pos > 0 && <span className="text-up-strong">▲ {s.pos}</span>}
                      {s.neg > 0 && <span className="text-down-strong">▼ {s.neg}</span>}
                    </span>
                  </div>
                  <div className="flex h-1.5 overflow-hidden rounded-full bg-surface-2">
                    {s.pos > 0 && (
                      <div
                        className="h-full bg-up"
                        style={{ width: `${(s.pos / maxSectorTotal) * 100}%` }}
                      />
                    )}
                    {s.neg > 0 && (
                      <div
                        className="h-full bg-down"
                        style={{ width: `${(s.neg / maxSectorTotal) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      )}

      {/* Signals: positive + negative */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SignalColumn title="Positive Signals" tone="up" items={positives} />
        <SignalColumn title="Negative Signals" tone="down" items={negatives} />
      </div>

      {/* This week's news */}
      {newsItems.length > 0 && (
        <Reveal delay={0.1} className="mt-8">
          <div className="mb-3.5 text-[13px] font-semibold tracking-tight">
            This Week&apos;s Analyzed News
          </div>
          <NewsStrip items={newsItems} />
        </Reveal>
      )}

      {/* Subscribe nudge */}
      <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-border bg-card p-6">
        <div>
          <div className="text-[14.5px] font-semibold tracking-tight">
            Get this summary every morning.
          </div>
          <div className="mt-1 text-[13px] text-text-secondary">
            We&apos;ll send the brief, top signals, and watchlist updates to your inbox.
          </div>
        </div>
        <Button>Subscribe</Button>
      </Reveal>

      <div className="mt-5 flex items-center gap-2.5 rounded-[10px] border border-warn/25 bg-warn/[0.06] px-4 py-3 text-[12.5px] text-text-secondary">
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
  tone?: "up" | "down";
}) {
  const accent =
    tone === "up"
      ? "bg-up/10 text-up-strong"
      : tone === "down"
        ? "bg-down/10 text-down-strong"
        : "bg-brand-soft text-primary";

  return (
    <div className="flex h-full flex-col justify-between rounded-[10px] border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_0_0_var(--border),0_16px_40px_-16px_rgba(15,23,42,0.14)]">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-text-secondary">{label}</span>
        <span className={`grid size-8 place-items-center rounded-md ${accent}`}>
          <Icon className="size-[17px]" />
        </span>
      </div>
      <div className="font-mono text-[28px] font-semibold leading-none tracking-tight">
        {value ?? "—"}
      </div>
    </div>
  );
}

function FeaturedStat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Newspaper;
  tone: "up" | "down";
}) {
  const accent = tone === "up" ? "bg-up/10 text-up-strong" : "bg-down/10 text-down-strong";
  const textColor = tone === "up" ? "text-up-strong" : "text-down-strong";

  return (
    <div className="flex h-full flex-col justify-between rounded-[10px] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_0_0_var(--border),0_20px_48px_-16px_rgba(15,23,42,0.16)]">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-text-secondary">{label}</span>
        <span className={`grid size-8 place-items-center rounded-md ${accent}`}>
          <Icon className="size-[17px]" />
        </span>
      </div>
      <div className={`font-mono text-[40px] font-semibold leading-none tracking-tight ${textColor}`}>
        {value}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[10px] border border-border bg-card p-6">
      <h2 className="mb-4 text-[13px] font-semibold tracking-tight">{title}</h2>
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
      <div className="mb-3.5 flex items-center gap-2">
        <Icon className={`size-4 ${tone === "up" ? "text-up-strong" : "text-down-strong"}`} />
        <span className="text-[13px] font-semibold tracking-tight">{title}</span>
        <span className="font-mono text-xs text-text-muted">({items.length})</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {items.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-border bg-surface/50 p-5 text-center text-[13px] text-text-secondary">
            None today.
          </div>
        ) : (
          items.map((s, i) => (
            <SummarySignalRow key={s.ticker} item={s} delay={i * 0.06} />
          ))
        )}
      </div>
    </div>
  );
}
