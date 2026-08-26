import { Check } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SignalCard, type Signal } from "@/components/signal-card";

// Illustrative sample data only - not a real company, price, or recommendation.
const SHOWCASE_SIGNAL: Signal = {
  ticker: "SAMPLE.C",
  company: "Example Bank PLC",
  price: "Rs 108.75",
  change: "+3.4% · 7-day outlook",
  direction: "up",
  confidence: 68,
  sentiment: "Positive",
  risk: "Low",
  headline: "Example: a policy rate cut is expected to lift credit growth and margins.",
};

const TRAIL = [
  {
    step: "Novelty",
    detail: "Fresh story - not a repeat of earlier coverage.",
  },
  {
    step: "Classification",
    detail: "Affects CSE · Banks, Finance & Insurance sector.",
  },
  {
    step: "Macro context",
    detail: "Rate-cutting cycle · supportive for credit-sensitive names.",
  },
  {
    step: "Company impact",
    detail: "Positive · medium magnitude on net interest margin.",
  },
  {
    step: "Risk & confidence",
    detail: "Low risk · confidence scored from source and specificity.",
  },
];

export function Showcase() {
  return (
    <section className="border-t border-border bg-surface-2/40 py-24 sm:py-36">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left: the card */}
          <Reveal>
            <div className="mx-auto max-w-md">
              <SignalCard signal={SHOWCASE_SIGNAL} />
            </div>
          </Reveal>

          {/* Right: the explanation / decision trail */}
          <Reveal delay={0.1}>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Never a black box.
            </h2>
            <p className="mt-4 max-w-md text-text-secondary">
              Every signal comes with the reasoning behind it, so you can judge
              it for yourself, not just take a number on faith.
            </p>

            <ul className="mt-8 space-y-4">
              {TRAIL.map((t) => (
                <li key={t.step} className="flex gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-up/15 text-up-strong">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <div>
                    <span className="text-sm font-medium">{t.step}</span>
                    <span className="text-sm text-text-secondary"> - {t.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
