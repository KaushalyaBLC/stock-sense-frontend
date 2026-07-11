import { MapPin, MessageSquareText, Clock, ShieldCheck, type LucideIcon } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

const ICONS: LucideIcon[] = [MapPin, MessageSquareText, Clock, ShieldCheck];

export function Why() {
  return (
    <section className="border-t border-border py-20 sm:py-28">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
            Why StockSense
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Made for CSE investors who want an edge they can trust.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[10px] border border-border bg-border sm:grid-cols-2">
          {site.why.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal
                key={item.title}
                delay={(i % 2) * 0.08}
                className="bg-card p-7"
              >
                <span className="grid size-10 place-items-center rounded-[8px] bg-brand-soft text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
                  {item.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
