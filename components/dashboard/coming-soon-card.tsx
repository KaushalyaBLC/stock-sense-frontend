"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Client leaf: entrance motion for the ComingSoon card. Takes pre-rendered children
 *  (icons etc. are rendered server-side) so no non-serializable props cross the boundary. */
export function ComingSoonCard({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="grid place-items-center rounded-[10px] border border-border bg-card p-12 text-center"
    >
      {children}
    </motion.div>
  );
}
