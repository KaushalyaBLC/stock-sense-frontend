"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Sparkles } from "lucide-react";

/** Weekly-summary hero: pointer-reactive glow, same technique as the dashboard brief. */
export function SummaryBrief({
  mood,
  summary,
  badges,
}: {
  mood: string;
  summary: string;
  badges: string[];
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
      className="relative mt-6 overflow-hidden rounded-[10px] bg-navy p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.22] blur-2xl"
        style={{ background: glowBg }}
        aria-hidden
      />

      <div className="relative max-w-2xl">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md bg-primary/20 text-blue-400">
            <Sparkles className="size-4" />
          </span>
          <span className="text-[13px] font-medium uppercase tracking-wide text-slate-400">
            AI Market Brief
          </span>
        </div>
        <div className="mb-3 text-[26px] font-semibold leading-tight tracking-tight text-white sm:text-[30px]">
          Market mood is <span className="text-amber-400">{mood}</span>
        </div>
        <p className="text-[14.5px] leading-relaxed text-slate-300">{summary}</p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {badges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-slate-300"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
