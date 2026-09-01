"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Dashboard hero: pointer-reactive glow + staggered entrance, mirrors the marketing Hero's language. */
export function MarketBrief({
  mood,
  summary,
  badges,
  positiveCount,
  negativeCount,
}: {
  mood: string;
  summary: string;
  badges: string[];
  positiveCount: number;
  negativeCount: number;
}) {
  const reduce = useReducedMotion();

  const px = useMotionValue(20);
  const py = useMotionValue(20);
  const gx = useSpring(px, { stiffness: 60, damping: 20 });
  const gy = useSpring(py, { stiffness: 60, damping: 20 });
  const glowBg = useTransform(
    [gx, gy],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, var(--color-brand) 0%, transparent 55%)`,
  );

  function onPointerMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 100);
    py.set(((e.clientY - r.top) / r.height) * 100);
  }

  return (
    <motion.div
      onPointerMove={onPointerMove}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-8 overflow-hidden rounded-[10px] bg-navy"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.22] blur-2xl"
        style={{ background: glowBg }}
        aria-hidden
      />

      <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.6fr_1fr] lg:items-center lg:gap-10">
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-primary/20 text-blue-400">
              <Sparkles className="size-4" />
            </span>
            <span className="text-[13px] font-medium uppercase tracking-wide text-slate-400">
              This Week&apos;s AI Market Brief
            </span>
          </div>
          <div className="mb-3 text-[26px] font-semibold leading-tight tracking-tight text-white sm:text-[30px]">
            Market mood is{" "}
            <span className="text-amber-400">{mood}</span>
          </div>
          <p className="max-w-xl text-[14.5px] leading-relaxed text-slate-300">
            {summary}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-slate-300"
              >
                {b}
              </span>
            ))}
            <Button
              size="sm"
              variant="ghost"
              className="ml-1 h-7 gap-1 px-2 text-xs font-semibold text-blue-400 hover:bg-white/[0.06] hover:text-blue-300"
              asChild
            >
              <Link href="/dashboard/summary">
                Full summary
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Featured stat pair - the asymmetric right-hand block */}
        <div className="grid grid-cols-2 gap-3 lg:border-l lg:border-white/10 lg:pl-8">
          <StatBlock
            value={positiveCount}
            label="Positive signals"
            tone="up"
            delay={0.1}
            reduce={!!reduce}
          />
          <StatBlock
            value={negativeCount}
            label="Negative signals"
            tone="down"
            delay={0.18}
            reduce={!!reduce}
          />
        </div>
      </div>
    </motion.div>
  );
}

function StatBlock({
  value,
  label,
  tone,
  delay,
  reduce,
}: {
  value: number;
  label: string;
  tone: "up" | "down";
  delay: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4"
    >
      <div
        className={`font-mono text-[30px] font-semibold leading-none tracking-tight ${
          tone === "up" ? "text-up" : "text-down"
        }`}
      >
        {tone === "up" ? "+" : "−"}
        {value}
      </div>
      <div className="mt-2 text-[11.5px] text-slate-400">{label}</div>
    </motion.div>
  );
}
