"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Newspaper, BrainCircuit, Signal } from "lucide-react";
import { Container } from "@/components/container";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const ICONS = [Newspaper, BrainCircuit, Signal];
const INTERVAL = 3200;

export function HowItWorks() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance while in view and not hovered/reduced.
  useEffect(() => {
    if (reduce || !inView || paused) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % site.how.length),
      INTERVAL,
    );
    return () => clearInterval(id);
  }, [reduce, inView, paused]);

  return (
    <section
      id="how"
      ref={sectionRef}
      className="border-t border-border py-20 sm:py-28"
    >
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            From breaking news to a clear call - in three steps.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {site.how.map((step, i) => {
            const Icon = ICONS[i];
            const isActive = i === active;
            return (
              <button
                key={step.step}
                type="button"
                onMouseEnter={() => {
                  setPaused(true);
                  setActive(i);
                }}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => {
                  setPaused(true);
                  setActive(i);
                }}
                onBlur={() => setPaused(false)}
                aria-current={isActive}
                className={cn(
                  "relative overflow-hidden rounded-[10px] border bg-card p-6 text-left transition-all duration-300",
                  isActive
                    ? "border-primary/50 shadow-[0_18px_50px_-22px_rgba(37,99,235,0.45)]"
                    : "border-border hover:border-primary/30",
                )}
              >
                {/* active accent bar */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 top-0 h-0.5 origin-left bg-primary transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0",
                  )}
                />
                <div className="flex items-center justify-between">
                  <motion.span
                    animate={
                      reduce ? undefined : { scale: isActive ? 1 : 0.92 }
                    }
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className={cn(
                      "grid size-11 place-items-center rounded-[8px] transition-colors duration-300",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-brand-soft text-primary",
                    )}
                  >
                    <Icon className="size-5" />
                  </motion.span>
                  <span className="font-mono text-sm text-text-muted">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {step.body}
                </p>
              </button>
            );
          })}
        </div>

        {/* progress dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {site.how.map((s, i) => (
            <button
              key={s.step}
              type="button"
              aria-label={`Go to step ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active ? "w-8 bg-primary" : "w-1.5 bg-border hover:bg-text-muted",
              )}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
