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

// Illustrative sample data only - not a real company, price, or recommendation.
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

export function Hero() {
  const reduce = useReducedMotion();

  // Pointer-reactive glow (motion values -> no re-renders).
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
        className="pointer-events-none absolute inset-0 opacity-[0.14] blur-2xl"
        style={{ background: glowBg }}
        aria-hidden
      />

      <Container className="relative flex flex-col items-center pt-20 pb-20 text-center sm:pt-24 sm:pb-28 lg:pb-32">
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-balance max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Understand every{" "}
          <span className="text-primary">CSE headline.</span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary"
        >
          {site.hero.subtitle}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Magnetic strength={0.3}>
            <Button
              size="lg"
              className="group h-12 px-7 text-[15px] transition-transform active:scale-[0.98]"
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
            className="h-12 px-7 text-[15px] transition-transform active:scale-[0.98]"
            asChild
          >
            <a href="#how">{site.cta.secondary}</a>
          </Button>
        </motion.div>

        {/* Product shot: the signal card as the singular hero visual */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16 w-full max-w-[420px] sm:mt-20"
        >
          <div
            className="pointer-events-none absolute -inset-x-20 -inset-y-16 -z-10 opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--color-brand) 0%, transparent 65%)",
            }}
            aria-hidden
          />
          <SignalCard signal={HERO_SIGNAL} className="shadow-2xl" />
        </motion.div>
      </Container>
    </section>
  );
}
