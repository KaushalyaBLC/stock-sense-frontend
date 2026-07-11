import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignalBadge, MetaChip } from "@/components/dashboard/signal-badge";
import { symbolFull, type Company } from "@/lib/dashboard-data";
import { confidenceLabel, riskLabel } from "@/lib/plain-language";

/** Fields the card actually renders (a subset of Company) + optional article link. */
export type SignalCardData = Pick<
  Company,
  "sym" | "name" | "sector" | "sig" | "conf" | "risk" | "reason"
> & { articleId?: number | null };

/** Dashboard signal card: company, signal, confidence/risk chips, reason, actions. */
export function CompanySignalCard({ c }: { c: SignalCardData }) {
  const riskTone = c.risk === "High" ? "red" : c.risk === "Medium" ? "amber" : "muted";
  const confTone = c.conf >= 75 ? "brand" : "muted";

  return (
    <div className="rounded-[14px] border border-border bg-card p-4 shadow-[var(--shadow,0_1px_2px_rgba(15,23,42,0.05))]">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <div className="truncate text-[14.5px] font-bold">{c.name}</div>
          <div className="font-mono text-xs text-text-muted">
            {symbolFull(c.sym)} · {c.sector}
          </div>
        </div>
        <SignalBadge sig={c.sig} />
      </div>

      <div className="my-3 flex flex-wrap gap-2">
        <MetaChip tone={confTone}>{c.conf}% · {confidenceLabel(c.conf)}</MetaChip>
        <MetaChip tone={riskTone}>{riskLabel(c.risk)}</MetaChip>
      </div>

      <p className="mb-3 text-[13px] leading-relaxed text-text-secondary">{c.reason}</p>

      <div className="flex gap-2">
        {c.articleId ? (
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/dashboard/news/${c.articleId}`}>View Analysis</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="flex-1">
            View Analysis
          </Button>
        )}
      </div>
    </div>
  );
}
