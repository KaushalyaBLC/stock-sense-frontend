"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { SignalBadge, MetaChip } from "@/components/dashboard/signal-badge";
import { symbolFull, type SignalKind } from "@/lib/dashboard-data";
import { confidenceLabel, riskLabel } from "@/lib/plain-language";
import { cn } from "@/lib/utils";

export type SummarySignalItem = {
  ticker: string;
  company: string;
  sector: string;
  signal: SignalKind;
  confidence: number;
  risk: string;
  article_id: number;
};

/** Weekly-summary signal row: elevation + animated confidence bar, no left color edge. */
export function SummarySignalRow({
  item,
  delay = 0,
}: {
  item: SummarySignalItem;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const positive = item.signal.includes("positive");
  const negative = item.signal.includes("negative");
  const barColor = positive ? "bg-up" : negative ? "bg-down" : "bg-primary";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/dashboard/news/${item.article_id}`}
        className="group block rounded-[10px] border border-border bg-card p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_1px_0_0_var(--border),0_16px_36px_-16px_rgba(15,23,42,0.16)]"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-semibold tracking-tight">
              {item.company}
            </div>
            <div className="mt-0.5 font-mono text-[11.5px] text-text-muted">
              {symbolFull(item.ticker)} · {item.sector}
            </div>
          </div>
          <SignalBadge sig={item.signal} />
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-text-secondary">
            <span>Confidence</span>
            <span className="font-mono font-medium text-foreground">
              {item.confidence}% · {confidenceLabel(item.confidence)}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className={cn("h-full rounded-full", barColor)}
              initial={reduce ? false : { width: 0 }}
              whileInView={{ width: `${item.confidence}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <div className="mt-2.5 flex gap-1.5">
          <MetaChip tone={item.risk === "High" ? "red" : item.risk === "Medium" ? "amber" : "muted"}>
            {riskLabel(item.risk)}
          </MetaChip>
        </div>
      </Link>
    </motion.div>
  );
}
