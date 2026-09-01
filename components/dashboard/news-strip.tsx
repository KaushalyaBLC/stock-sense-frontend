"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { SignalBadge } from "@/components/dashboard/signal-badge";
import type { SignalKind } from "@/lib/dashboard-data";

export type NewsStripItem = {
  id: number;
  title: string;
  source: string;
  time: string;
  signal: SignalKind;
  summary: string;
};

/** Horizontal scroll-snap strip - a different layout family than the signal cards above. */
export function NewsStrip({ items }: { items: NewsStripItem[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
      {items.map((n, i) => (
        <motion.div
          key={n.id}
          initial={reduce ? false : { opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="w-[280px] shrink-0 snap-start"
        >
          <Link
            href={`/dashboard/news/${n.id}`}
            className="group flex h-full flex-col rounded-[10px] border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_1px_0_0_var(--border),0_16px_36px_-16px_rgba(15,23,42,0.16)]"
          >
            <div className="mb-2 flex items-center gap-2">
              <SignalBadge sig={n.signal} className="px-2 py-0.5" />
              <span className="truncate text-[11px] text-text-muted">
                {n.source}
                {n.time ? ` · ${n.time}` : ""}
              </span>
            </div>
            <div className="mb-1.5 text-[13.5px] font-semibold leading-snug tracking-tight">
              {n.title}
            </div>
            <p className="line-clamp-3 flex-1 text-[12px] leading-relaxed text-text-secondary">
              {n.summary}
            </p>
            <span className="mt-3 text-[12px] font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              View analysis →
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
