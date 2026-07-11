"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down";

export interface Signal {
  ticker: string;
  company: string;
  price: string;
  /** Numeric base for the live-ticking display (optional). */
  priceValue?: number;
  change: string;
  direction: Direction;
  confidence: number; // 0–100
  sentiment: "Positive" | "Negative" | "Neutral";
  risk: "Low" | "Medium" | "High";
  headline: string;
}

/** Imperatively flickers a price like a live quote - no per-tick React state. */
function useLivePrice(base: number | undefined, enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!enabled || base == null || !ref.current) return;
    const el = ref.current;
    let raf = 0;
    const id = setInterval(() => {
      const drift = base * (1 + (Math.random() - 0.5) * 0.004);
      raf = requestAnimationFrame(() => {
        el.textContent = `Rs ${drift.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
        el.animate(
          [{ opacity: 0.55 }, { opacity: 1 }],
          { duration: 350, easing: "ease-out" },
        );
      });
    }, 2200);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [base, enabled]);
  return ref;
}

/**
 * Animated signal card - the product's core unit. Direction is encoded with
 * BOTH color and a glyph (a11y / colorblind rule). Numbers use tabular mono.
 */
export function SignalCard({
  signal,
  className,
  animate = true,
}: {
  signal: Signal;
  className?: string;
  animate?: boolean;
}) {
  const reduce = useReducedMotion();
  const up = signal.direction === "up";
  const DirIcon = up ? ArrowUpRight : ArrowDownRight;
  const priceRef = useLivePrice(signal.priceValue, animate && !reduce);

  return (
    <div
      className={cn(
        "group/card rounded-[10px] border border-border bg-card p-5 shadow-[0_1px_0_0_var(--border),0_12px_40px_-12px_rgba(15,23,42,0.18)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_1px_0_0_var(--border),0_24px_60px_-18px_rgba(37,99,235,0.35)]",
        className,
      )}
    >
      {/* Header: ticker + live dot */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold tracking-wide">
              {signal.ticker}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-up-strong">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-up opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-up" />
              </span>
              LIVE
            </span>
          </div>
          <p className="mt-0.5 text-xs text-text-secondary">{signal.company}</p>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-[6px] px-2 py-1 text-xs font-semibold",
            up
              ? "bg-up/10 text-up-strong"
              : "bg-down/10 text-down-strong",
          )}
        >
          <DirIcon className="size-3.5" />
          {up ? "BUY" : "SELL"}
        </div>
      </div>

      {/* Price */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div
            ref={priceRef}
            className="font-mono text-2xl font-semibold tracking-tight tabular-nums"
          >
            {signal.price}
          </div>
          <div
            className={cn(
              "mt-0.5 flex items-center gap-1 font-mono text-xs font-medium",
              up ? "text-up-strong" : "text-down-strong",
            )}
          >
            <DirIcon className="size-3" />
            {signal.change}
          </div>
        </div>
        <MiniSpark direction={signal.direction} animate={animate && !reduce} />
      </div>

      {/* Confidence */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] text-text-secondary">
          <span>Model confidence</span>
          <span className="font-mono font-medium text-foreground">
            {signal.confidence}%
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={animate && !reduce ? { width: 0 } : false}
            whileInView={{ width: `${signal.confidence}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </div>
      </div>

      {/* Chips */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Chip label="Sentiment" value={signal.sentiment} />
        <Chip label="Risk" value={signal.risk} />
      </div>

      {/* Source headline */}
      <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-text-secondary">
        <span className="text-text-muted">Triggered by:</span> {signal.headline}
      </p>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-border bg-surface-2 px-2 py-1 text-[11px]">
      <span className="text-text-muted">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  );
}

/** Tiny inline sparkline that draws itself in. */
function MiniSpark({
  direction,
  animate,
}: {
  direction: Direction;
  animate: boolean;
}) {
  const up = direction === "up";
  const d = up
    ? "M0 26 L14 22 L28 24 L42 14 L56 16 L70 6"
    : "M0 6 L14 12 L28 9 L42 18 L56 16 L70 26";
  const stroke = up ? "var(--color-up)" : "var(--color-down)";

  return (
    <svg width="74" height="32" viewBox="0 0 74 32" fill="none" aria-hidden>
      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : false}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 }}
      />
    </svg>
  );
}
