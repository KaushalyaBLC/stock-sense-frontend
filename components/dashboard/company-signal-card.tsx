"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SignalBadge, MetaChip } from "@/components/dashboard/signal-badge";
import { symbolFull, type Company } from "@/lib/dashboard-data";
import { confidenceLabel, riskLabel } from "@/lib/plain-language";
import { cn } from "@/lib/utils";

/** Fields the card actually renders (a subset of Company) + optional article link. */
export type SignalCardData = Pick<
  Company,
  "sym" | "name" | "sector" | "sig" | "conf" | "risk" | "reason"
> & { articleId?: number | null };

/** Dashboard signal card: colored edge, elevation, animated confidence bar. */
export function CompanySignalCard({
  c,
  delay = 0,
}: {
  c: SignalCardData;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const riskTone = c.risk === "High" ? "red" : c.risk === "Medium" ? "amber" : "muted";
  const confTone = c.conf >= 75 ? "brand" : "muted";
  const positive = c.sig.includes("positive");
  const negative = c.sig.includes("negative");
  const barColor = positive ? "bg-up" : negative ? "bg-down" : "bg-primary";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-[10px] border border-border bg-card p-4 shadow-[0_1px_0_0_var(--border)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_1px_0_0_var(--border),0_18px_44px_-16px_rgba(15,23,42,0.16)]"
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold tracking-tight">{c.name}</div>
          <div className="mt-0.5 font-mono text-[11.5px] text-text-muted">
            {symbolFull(c.sym)} · {c.sector}
          </div>
        </div>
        <SignalBadge sig={c.sig} />
      </div>

      <div className="mt-3.5">
        <div className="flex items-center justify-between text-[11px] text-text-secondary">
          <span>Confidence</span>
          <span className="font-mono font-medium text-foreground">
            {c.conf}% · {confidenceLabel(c.conf)}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <motion.div
            className={cn("h-full rounded-full", barColor)}
            initial={reduce ? false : { width: 0 }}
            whileInView={{ width: `${c.conf}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <MetaChip tone={riskTone}>{riskLabel(c.risk)}</MetaChip>
        {c.conf >= 75 ? <MetaChip tone={confTone}>High confidence</MetaChip> : null}
      </div>

      <p className="mb-3.5 mt-3 text-[13px] leading-relaxed text-text-secondary">{c.reason}</p>

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
    </motion.div>
  );
}
