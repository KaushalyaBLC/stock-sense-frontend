import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";

const POINTS = [
  "News-driven signals for CSE stocks",
  "Direction and confidence, explained",
  "A transparent decision trail — never a black box",
];

/** Two-pane auth layout: framed form card (left) + branded panel (right). */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-[1fr_1.05fr]">
      {/* Left: form */}
      <div className="relative flex flex-col bg-bg">
        {/* subtle top grid texture for depth */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-grid opacity-50" aria-hidden />

        <header className="relative flex items-center justify-between px-6 py-5 sm:px-10">
          <Link href="/" aria-label="StockSense home" className="inline-flex">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-sm text-text-secondary transition-colors hover:text-foreground"
          >
            ← Back to home
          </Link>
        </header>

        <div className="relative flex flex-1 items-center justify-center px-6 pb-10 sm:px-10">
          <div className="w-full max-w-[400px]">
            <div className="mb-7">
              <h1 className="text-[26px] font-semibold leading-tight tracking-tight">
                {title}
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                {subtitle}
              </p>
            </div>

            {/* Framed card */}
            <div className="rounded-[12px] border border-border bg-card p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.16)] sm:p-7">
              {children}
            </div>

            <p className="mt-5 text-center text-sm text-text-secondary">{footer}</p>

            <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-text-muted">
              <ShieldCheck className="size-3.5" />
              For informational purposes only — not financial advice.
            </p>
          </div>
        </div>
      </div>

      {/* Right: branded panel */}
      <div className="relative hidden overflow-hidden bg-navy lg:block">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div
          className="pointer-events-none absolute -top-24 right-0 size-[520px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--color-brand) 0%, transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative flex h-full flex-col justify-center px-14">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-slate-300">
            <span className="size-1.5 rounded-full bg-primary" />
            CSE · AI SIGNALS
          </span>
          <h2 className="mt-6 max-w-md text-3xl font-semibold leading-[1.2] tracking-tight text-white">
            Read the market with clarity.
          </h2>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-slate-400">
            Turn breaking CSE news into clear, explained direction signals — so
            you can act with confidence.
          </p>
          <ul className="mt-8 space-y-4">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-slate-200">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
