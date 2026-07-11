"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Scroll-into-view reveal. Respects prefers-reduced-motion. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "span" | "section";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
