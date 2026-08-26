import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";

const POINTS = [
  "News-driven signals for CSE stocks",
  "Direction and confidence, explained",
  "A transparent decision trail, never a black box",
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
      <div className="relative flex flex-col bg-background">
        {/* subtle top grid texture for depth */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-grid opacity-50" aria-hidden />

        <header className="relative flex items-center px-6 py-6 sm:px-12">
          <Link href="/" aria-label="StockSense home" className="inline-flex">
            <Logo />
          </Link>
        </header>

        <div className="relative flex flex-1 items-center justify-center px-6 pb-16 sm:px-12">
          <div className="w-full max-w-[380px]">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight">
                {title}
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
                {subtitle}
              </p>
            </div>

            <div className="rounded-[12px] border border-border bg-card p-6 sm:p-7">
              {children}
            </div>

            <p className="mt-6 text-center text-sm text-text-secondary">{footer}</p>

            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-text-muted">
              <Link href="/" className="hover:text-foreground">
                Back to home
              </Link>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" />
                Not financial advice
              </span>
            </div>
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
        <div className="relative flex h-full flex-col justify-center px-16">
          <h2 className="max-w-md text-4xl font-semibold leading-[1.15] tracking-tight text-white">
            Read the market with clarity.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-400">
            Turn breaking CSE news into clear, explained direction signals, so
            you can act with confidence.
          </p>
          <ul className="mt-10 space-y-5">
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
