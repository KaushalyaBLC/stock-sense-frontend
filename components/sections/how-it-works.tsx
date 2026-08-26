import { Newspaper, BrainCircuit, Signal } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

const ICONS = [Newspaper, BrainCircuit, Signal];

export function HowItWorks() {
  return (
    <section id="how" className="border-t border-border py-24 sm:py-36">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            From breaking news to a clear call.
          </h2>
        </Reveal>

        <div className="mx-auto mt-20 grid max-w-4xl gap-16 sm:grid-cols-3 sm:gap-8">
          {site.how.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={step.step} delay={i * 0.1} className="text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-soft text-primary">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mx-auto mt-3 max-w-[26ch] text-sm leading-relaxed text-text-secondary">
                  {step.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
