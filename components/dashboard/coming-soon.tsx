import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComingSoonCard } from "@/components/dashboard/coming-soon-card";

/** Friendly placeholder for dashboard features that aren't built yet. */
export function ComingSoon({
  title,
  description,
  icon: Icon,
  eta = "Coming soon",
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  eta?: string;
}) {
  return (
    <div className="mx-auto max-w-[560px] py-10">
      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center gap-1.5 text-[13.5px] text-text-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      <ComingSoonCard>
        <span className="grid size-14 place-items-center rounded-[10px] bg-brand-soft text-primary">
          <Icon className="size-7" />
        </span>
        <span className="mt-5 rounded-full bg-warn/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-warn">
          {eta}
        </span>
        <h1 className="mt-4 text-[22px] font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-text-secondary">
          {description}
        </p>
        <Button asChild className="mt-6 transition-transform active:scale-[0.98]">
          <Link href="/dashboard">Explore your dashboard</Link>
        </Button>
      </ComingSoonCard>
    </div>
  );
}
