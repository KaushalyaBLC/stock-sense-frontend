"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  animate,
} from "motion/react";

/**
 * Counts up to `value` when scrolled into view. Uses a motion value + imperative
 * DOM write (no React state per tick) so it stays smooth and lint-clean.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.4,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);

  const format = (n: number) =>
    `${prefix}${n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useEffect(() => {
    if (!ref.current) return;
    if (reduce || !inView) {
      if (ref.current && (reduce || inView)) ref.current.textContent = format(value);
      return;
    }
    const controls = animate(mv, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className={className}>
      {format(reduce ? value : 0)}
    </span>
  );
}
