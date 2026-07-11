import {
  Newspaper,
  Target,
  Compass,
  Globe,
  Activity,
  Route,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  newspaper: Newspaper,
  target: Target,
  compass: Compass,
  globe: Globe,
  activity: Activity,
  route: Route,
};

// Bento rhythm: first card spans 2 cols on large screens, rest are 1.
const SPAN = ["lg:col-span-2", "", "", "", "", ""];

export function Features() {
  return (
    <section id="features" className="border-t border-border py-20 sm:py-28">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to read the market with clarity.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.features.map((f, i) => {
            const Icon = ICONS[f.icon] ?? Target;
            return (
              <Reveal
                key={f.title}
                delay={(i % 3) * 0.06}
                className={cn(
                  "group rounded-[10px] border border-border bg-card p-6 transition-colors hover:border-primary/40",
                  SPAN[i],
                )}
              >
                <span className="grid size-11 place-items-center rounded-[8px] bg-surface-2 text-primary transition-colors group-hover:bg-brand-soft">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">
                  {f.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
