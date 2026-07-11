import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignalBadge } from "@/components/dashboard/signal-badge";
import { CompanySignalCard } from "@/components/dashboard/company-signal-card";
import { MetricTiles } from "@/components/dashboard/metric-tiles";
import { getCurrentUser } from "@/lib/server-auth";
import { getOverview } from "@/lib/server-market";
import {
  NEWS as MOCK_NEWS,
  topNegative as mockNeg,
  topPositive as mockPos,
  type Company,
} from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "Dashboard — StockSense" };

// Adapt an API signal (or mock Company) into the CompanySignalCard shape.
type CardData = Pick<Company, "sym" | "name" | "sector" | "sig" | "conf" | "risk" | "reason"> & {
  articleId?: number | null;
};
function toCard(s: {
  ticker?: string;
  sym?: string;
  name?: string;
  company?: string;
  sector: string;
  signal?: string;
  sig?: string;
  confidence?: number;
  conf?: number;
  risk: string;
  reason: string;
  article_id?: number;
}): CardData {
  return {
    sym: s.ticker ?? s.sym ?? "",
    name: s.company ?? s.name ?? "",
    sector: s.sector,
    sig: (s.signal ?? s.sig) as Company["sig"],
    conf: s.confidence ?? s.conf ?? 0,
    risk: s.risk as Company["risk"],
    reason: s.reason,
    articleId: s.article_id ?? null,
  };
}

export default async function DashboardPage() {
  const [user, overview] = await Promise.all([getCurrentUser(), getOverview()]);
  const firstName = user?.name?.split(" ")[0] || "there";

  // Live data when available; mock fallback keeps the screen meaningful otherwise.
  const positives = (overview?.top_positive?.length ? overview.top_positive : mockPos()).map(toCard);
  const negatives = (overview?.top_negative?.length ? overview.top_negative : mockNeg()).map(toCard);
  const brief = overview?.brief;

  // Normalize live (ApiNews: `signal`) vs mock (NewsItem: `sig`) to one shape.
  const news = (overview?.latest_news?.length ? overview.latest_news : MOCK_NEWS).map(
    (n) => ({
      id: n.id,
      title: n.title,
      source: "source" in n ? n.source : "CSE News",
      time: "time" in n ? n.time : "",
      signal: ("signal" in n ? n.signal : n.sig) as Company["sig"],
      summary: n.summary,
    }),
  );

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-5">
        <h1 className="text-[27px] font-extrabold tracking-tight">
          Good morning, {firstName}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Here&apos;s what AI found in the market this week.
        </p>
      </div>

      {/* A. Market Brief */}
      <div className="mb-5 overflow-hidden rounded-[18px] bg-navy p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="mb-2.5 flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-[9px] bg-primary/25 text-blue-400">
                <Sparkles className="size-4" />
              </span>
              <span className="text-[15px] font-bold text-white">
                This Week&apos;s AI Market Brief
              </span>
            </div>
            <div className="mb-2 text-xl font-bold text-white">
              Market mood:{" "}
              <span className="text-amber-400">{brief?.mood ?? "Mixed"}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {brief?.summary ??
                "Tourism-related companies show positive signals. The banking sector has mixed news impact."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(brief?.badges ?? ["Mixed market mood", "Signals updated"]).map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-xs font-semibold text-slate-200"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          <Button className="whitespace-nowrap" asChild>
            <Link href="/dashboard/summary">View Weekly Summary</Link>
          </Button>
        </div>
      </div>

      {/* B. Metric tiles — outcome-first for general users */}
      <MetricTiles overview={overview} />

      {/* C/D. Signals two-column */}
      <div className="mb-5 grid items-start gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-base font-bold">Top Positive Signals</span>
            <span className="size-2 rounded-full bg-up" aria-hidden />
          </div>
          <div className="flex flex-col gap-3">
            {positives.length ? (
              positives.map((c) => <CompanySignalCard key={c.sym} c={c} />)
            ) : (
              <EmptyCard text="No positive signals yet." />
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-base font-bold">Top Negative Signals</span>
            <span className="size-2 rounded-full bg-down" aria-hidden />
          </div>
          <div className="flex flex-col gap-3">
            {negatives.map((c) => (
              <CompanySignalCard key={c.sym} c={c} />
            ))}

            <div className="rounded-[14px] border border-border bg-card p-4 shadow-[var(--shadow,0_1px_2px_rgba(15,23,42,0.05))]">
              <div className="mb-2.5 text-sm font-bold">Watchlist Alerts</div>
              <p className="text-[12.5px] text-text-secondary">
                Add companies to your watchlist to get high-impact alerts here.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* F. Latest news */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-base font-bold">Latest News</span>
        <Link href="/dashboard/news" className="text-sm font-semibold text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="mb-5 flex flex-col gap-2.5">
        {news.map((n) => (
          <div
            key={n.id}
            className="flex flex-wrap items-start gap-3.5 rounded-[14px] border border-border bg-card p-4 shadow-[var(--shadow,0_1px_2px_rgba(15,23,42,0.05))]"
          >
            <div className="min-w-[200px] flex-1">
              <div className="mb-1.5 flex items-center gap-2">
                <SignalBadge sig={n.signal} className="px-2 py-0.5" />
                <span className="text-[11.5px] text-text-muted">
                  {n.source}
                  {n.time ? ` · ${n.time}` : ""}
                </span>
              </div>
              <div className="mb-1 text-[14.5px] font-bold">{n.title}</div>
              <div className="text-[12.5px] leading-relaxed text-text-secondary">
                {n.summary}
              </div>
            </div>
            <Button variant="outline" size="sm" className="whitespace-nowrap" asChild>
              <Link href={`/dashboard/news/${n.id}`}>View Analysis</Link>
            </Button>
          </div>
        ))}
      </div>

      {/* G. Daily summary CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3.5 rounded-[16px] border border-border bg-gradient-to-r from-card to-surface-2 p-[22px] shadow-[var(--shadow,0_1px_2px_rgba(15,23,42,0.05))]">
        <div>
          <div className="text-base font-bold">
            Get your AI market summary every morning.
          </div>
          <div className="mt-1 text-[13.5px] text-text-secondary">
            Top signals, affected sectors, and watchlist updates in one simple brief.
          </div>
        </div>
        <div className="flex gap-2.5">
          <Button asChild>
            <Link href="/dashboard/summary">View Weekly Summary</Link>
          </Button>
        </div>
      </div>

      <div className="mt-[18px] flex items-center gap-2 rounded-[12px] border border-warn/30 bg-warn/[0.08] px-4 py-3 text-[12.5px] text-text-secondary">
        <TriangleAlert className="size-4 shrink-0 text-warn" />
        StockSense provides AI-powered decision support only. It is not financial advice.
      </div>
    </div>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-[14px] border border-dashed border-border bg-surface/50 p-6 text-center text-[13px] text-text-secondary">
      {text}
    </div>
  );
}
