import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  ListChecks,
  Globe,
  TriangleAlert,
} from "lucide-react";
import { SignalBadge, MetaChip } from "@/components/dashboard/signal-badge";
import { confidenceLabel, riskLabel, plainMeaning } from "@/lib/plain-language";
import { getNewsDetail } from "@/lib/server-market";
import { symbolFull } from "@/lib/dashboard-data";
import type { Company } from "@/lib/dashboard-data";

export default async function NewsAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (Number.isNaN(articleId)) notFound();

  const detail = await getNewsDetail(articleId);
  if (!detail) notFound();

  const trailSteps = detail.decision_trail?.steps ?? [];

  return (
    <div className="mx-auto max-w-[900px]">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[12.5px] text-text-muted">
          <span className="font-medium">{detail.source}</span>
          {detail.published_at && <span>· {detail.published_at}</span>}
          {detail.affects_cse !== null && (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                detail.affects_cse
                  ? "bg-brand-soft text-primary"
                  : "bg-muted text-text-secondary"
              }`}
            >
              {detail.affects_cse ? "Affects CSE" : "No CSE impact"}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold leading-tight tracking-tight">
          {detail.title}
        </h1>

        {detail.affected_sectors.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {detail.affected_sectors.map((s) => (
              <span
                key={s}
                className="rounded-full bg-surface-2 px-2.5 py-1 text-[11.5px] font-medium text-text-secondary"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {detail.url && (
          <a
            href={detail.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
          >
            Read original article <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>

      {/* AI summary / reasoning */}
      {detail.classification_reasoning && (
        <Section title="AI Analysis" icon={ListChecks}>
          <p className="text-sm leading-relaxed text-text-secondary">
            {detail.classification_reasoning}
          </p>
        </Section>
      )}

      {/* Macro context */}
      {detail.macro_context && (
        <Section title="Macro Context" icon={Globe}>
          <p className="text-sm leading-relaxed text-text-secondary">
            {detail.macro_context}
          </p>
        </Section>
      )}

      {/* Affected companies */}
      {detail.companies.length > 0 && (
        <Section title="Affected Companies" icon={TrendingUp}>
          <div className="flex flex-col gap-3">
            {detail.companies.map((c) => (
              <CompanyImpact key={c.ticker} c={c} />
            ))}
          </div>
        </Section>
      )}

      {/* Decision trail */}
      {trailSteps.length > 0 && (
        <Section title="Decision Trail" icon={ListChecks}>
          <p className="mb-4 text-[13px] text-text-secondary">
            How the AI reached its conclusion, step by step.
          </p>
          <ol className="relative flex flex-col gap-4 border-l border-border pl-5">
            {trailSteps.map((s, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[26px] top-0.5 grid size-4 place-items-center rounded-full border-2 border-primary bg-card" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-semibold capitalize">
                    {s.step.replace(/_/g, " ")}
                  </span>
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-text-muted">
                    {s.decision}
                  </span>
                </div>
                {s.reason && (
                  <p className="mt-1 text-[12.5px] leading-relaxed text-text-secondary">
                    {s.reason}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Disclaimer */}
      <div className="mt-6 flex items-center gap-2 rounded-lg border border-warn/30 bg-warn/[0.08] px-4 py-3 text-[12.5px] text-text-secondary">
        <TriangleAlert className="size-4 shrink-0 text-warn" />
        StockSense provides AI-powered decision support only. It is not financial advice.
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof ListChecks;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-[18px] text-primary" />
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function CompanyImpact({
  c,
}: {
  c: {
    ticker: string;
    company: string;
    sector: string;
    signal: Company["sig"];
    confidence: number;
    risk: string;
    magnitude: string;
    reason: string;
    bull_case: string | null;
    bear_case: string | null;
    time_horizon: string | null;
  };
}) {
  const riskTone = c.risk === "High" ? "red" : c.risk === "Medium" ? "amber" : "muted";
  return (
    <div className="rounded-lg border border-border bg-surface-2/50 p-4">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <div className="text-[14.5px] font-semibold">{c.company}</div>
          <div className="font-mono text-xs text-text-muted">
            {symbolFull(c.ticker)} · {c.sector}
          </div>
        </div>
        <SignalBadge sig={c.signal} />
      </div>

      <div className="my-3 flex flex-wrap gap-2">
        <MetaChip tone={c.confidence >= 75 ? "brand" : "muted"}>
          {c.confidence}% · {confidenceLabel(c.confidence)}
        </MetaChip>
        <MetaChip tone={riskTone}>{riskLabel(c.risk)}</MetaChip>
        <MetaChip tone="muted">{c.magnitude} impact</MetaChip>
        {c.time_horizon && <MetaChip tone="muted">{c.time_horizon}</MetaChip>}
      </div>

      {/* Plain-language takeaway */}
      <p className="mb-2 rounded-md bg-brand-soft/60 px-3 py-2 text-[12.5px] font-medium text-foreground">
        {plainMeaning({ company: c.company, sig: c.signal, confidence: c.confidence })}
      </p>

      <p className="text-[13px] leading-relaxed text-text-secondary">{c.reason}</p>

      {(c.bull_case || c.bear_case) && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {c.bull_case && (
            <div className="rounded-md border border-up/20 bg-up/[0.06] p-3">
              <div className="mb-1 flex items-center gap-1.5 text-[11.5px] font-semibold text-up-strong">
                <TrendingUp className="size-3.5" /> Best case
              </div>
              <p className="text-[12.5px] leading-relaxed text-text-secondary">
                {c.bull_case}
              </p>
            </div>
          )}
          {c.bear_case && (
            <div className="rounded-md border border-down/20 bg-down/[0.06] p-3">
              <div className="mb-1 flex items-center gap-1.5 text-[11.5px] font-semibold text-down-strong">
                <TrendingDown className="size-3.5" /> Worst case
              </div>
              <p className="text-[12.5px] leading-relaxed text-text-secondary">
                {c.bear_case}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
