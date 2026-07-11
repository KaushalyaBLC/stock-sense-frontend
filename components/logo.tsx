import { cn } from "@/lib/utils";

/** StockSense wordmark with a compact candlestick mark. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-[6px] bg-primary text-primary-foreground"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="4" width="2" height="8" rx="1" fill="currentColor" />
          <rect x="7" y="2" width="2" height="12" rx="1" fill="currentColor" />
          <rect x="11" y="6" width="2" height="5" rx="1" fill="currentColor" />
        </svg>
      </span>
      <span className="text-[17px] font-semibold tracking-tight">
        Stock<span className="text-primary">Sense</span>
      </span>
    </span>
  );
}
