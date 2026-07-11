"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/magnetic";
import { SignalCard, type Signal } from "@/components/signal-card";
import { site } from "@/lib/site";

// Illustrative sample data only - not real companies, prices, or recommendations.
const HERO_SIGNAL: Signal = {
  ticker: "SAMPLE.A",
  company: "Sample Holdings PLC",
  price: "Rs 21.40",
  priceValue: 21.4,
  change: "+2.8% · 7-day outlook",
  direction: "up",
  confidence: 74,
  sentiment: "Positive",
  risk: "Low",
  headline: "Example: group reports stronger first-half earnings across its segments.",
};

const SECONDARY_SIGNAL: Signal = {
  ticker: "SAMPLE.B",
  company: "Example Beverages PLC",
  price: "Rs 1,042.00",
  priceValue: 1042,
  change: "-1.6% · 7-day outlook",
  direction: "down",
  confidence: 61,
  sentiment: "Negative",
  risk: "Medium",
  headline: "Example: a new excise adjustment is expected to pressure margins.",
};

export function Hero() {
  const reduce = useReducedMotion();

  // Pointer-reactive glow (motion values → no re-renders).
  const px = useMotionValue(50);
  const py = useMotionValue(30);
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
    <section
      id="top"
      onPointerMove={onPointerMove}
      className="relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.16] blur-2xl"
        style={{ background: glowBg }}
        aria-hidden
      />

      <Container className="relative grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        {/* Left: copy */}
        <div>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            Understand what every{" "}
            <span className="text-primary">CSE headline</span> means for your
            stocks.
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary"
          >
            {site.hero.subtitle}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Magnetic strength={0.3}>
              <Button
                size="lg"
                className="group h-12 px-6 text-[15px] transition-transform active:scale-[0.98]"
                asChild
              >
                <a href="/signup">
                  {site.cta.primary}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Button>
            </Magnetic>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6 text-[15px] transition-transform active:scale-[0.98]"
              asChild
            >
              <a href="#how">{site.cta.secondary}</a>
            </Button>
          </motion.div>
        </div>

        {/* Right: signal card stack */}
        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <SignalCard signal={HERO_SIGNAL} />
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24, x: 24 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-14 -right-2 hidden w-64 sm:block"
          >
            <div className="rotate-2">
              <SignalCard signal={SECONDARY_SIGNAL} className="scale-95 shadow-2xl" />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
