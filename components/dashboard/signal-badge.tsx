import { signalMeta, type SignalKind } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  up: "bg-up/12 text-up-strong",
  down: "bg-down/12 text-down-strong",
  neutral: "bg-muted text-text-secondary",
};

/** Signal pill — color + glyph (a11y: never color alone). */
export function SignalBadge({ sig, className }: { sig: SignalKind; className?: string }) {
  const m = signalMeta(sig);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
        TONE[m.tone],
        className,
      )}
    >
      <span aria-hidden>{m.arrow}</span>
      {m.label}
    </span>
  );
}

/** Small labeled chip (confidence, risk). */
export function MetaChip({
  children,
  tone = "brand",
}: {
  children: React.ReactNode;
  tone?: "brand" | "amber" | "red" | "muted";
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-soft text-primary",
    amber: "bg-warn/15 text-warn",
    red: "bg-down/12 text-down-strong",
    muted: "bg-muted text-text-secondary",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
