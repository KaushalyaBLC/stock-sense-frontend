import type { Metadata } from "next";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanySignalCard } from "@/components/dashboard/company-signal-card";
import { MetricTiles } from "@/components/dashboard/metric-tiles";
import { MarketBrief } from "@/components/dashboard/market-brief";
import { NewsStrip } from "@/components/dashboard/news-strip";
import { Reveal } from "@/components/reveal";
import { getCurrentUser } from "@/lib/server-auth";
import { getOverview } from "@/lib/server-market";
import {
  NEWS as MOCK_NEWS,
  topNegative as mockNeg,
  topPositive as mockPos,
  type Company,
} from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "Dashboard - StockSense" };

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
      <Reveal className="mb-8">
        <h1 className="text-[26px] font-semibold tracking-tight">
          Good morning, {firstName}
        </h1>
        <p className="mt-1.5 text-[14px] text-text-secondary">
          Here&apos;s what AI found in the market this week.
        </p>
      </Reveal>

      {/* A. Market Brief */}
      <MarketBrief
        mood={brief?.mood ?? "Mixed"}
        summary={
          brief?.summary ??
          "Tourism-related companies show positive signals. The banking sector has mixed news impact."
        }
        badges={brief?.badges ?? ["Mixed market mood", "Signals updated"]}
        positiveCount={positives.length}
        negativeCount={negatives.length}
      />

      {/* B. Metric tiles - outcome-first for general users, bento layout */}
      <MetricTiles overview={overview} />

      {/* C/D. Signals two-column */}
      <div className="mb-8 grid items-start gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3.5 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-up" aria-hidden />
            <span className="text-[13px] font-semibold tracking-tight">Top Positive Signals</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {positives.length ? (
              positives.map((c, i) => (
                <CompanySignalCard key={c.sym} c={c} delay={i * 0.08} />
              ))
            ) : (
              <EmptyCard text="No positive signals yet." />
            )}
          </div>
        </div>

        <div>
          <div className="mb-3.5 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-down" aria-hidden />
            <span className="text-[13px] font-semibold tracking-tight">Top Negative Signals</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {negatives.map((c, i) => (
              <CompanySignalCard key={c.sym} c={c} delay={i * 0.08} />
            ))}

            <Reveal delay={negatives.length * 0.08}>
              <div className="rounded-[10px] border border-dashed border-border bg-surface/50 p-4">
                <div className="mb-1.5 text-[13px] font-semibold">Watchlist Alerts</div>
                <p className="text-[12.5px] leading-relaxed text-text-secondary">
                  Add companies to your watchlist to get high-impact alerts here.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* F. Latest news - horizontal strip, a different layout family */}
      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-[13px] font-semibold tracking-tight">Latest News</span>
        <Link href="/dashboard/news" className="text-[13px] font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="mb-8">
        <NewsStrip items={news} />
      </div>

      {/* G. Daily summary CTA */}
      <Reveal className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-border bg-card p-6">
        <div>
          <div className="text-[14.5px] font-semibold tracking-tight">
            Get your AI market summary every morning.
          </div>
          <div className="mt-1 text-[13px] text-text-secondary">
            Top signals, affected sectors, and watchlist updates in one simple brief.
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/summary">View Weekly Summary</Link>
        </Button>
      </Reveal>

      <div className="mt-5 flex items-center gap-2.5 rounded-[10px] border border-warn/25 bg-warn/[0.06] px-4 py-3 text-[12.5px] text-text-secondary">
        <TriangleAlert className="size-4 shrink-0 text-warn" />
        StockSense provides AI-powered decision support only. It is not financial advice.
      </div>
    </div>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-[10px] border border-dashed border-border bg-surface/50 p-6 text-center text-[13px] text-text-secondary">
      {text}
    </div>
  );
}
