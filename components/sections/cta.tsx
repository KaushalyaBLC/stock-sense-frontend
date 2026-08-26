import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function CTA() {
  return (
    <section className="py-24 sm:py-36">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[16px] border border-border bg-navy px-6 py-20 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />
          <div
            className="pointer-events-none absolute -bottom-24 left-1/2 size-[480px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--color-brand) 0%, transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Start reading the market with clarity.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-slate-300">
              Join investors using AI-driven, explained signals to stay ahead of
              CSE news.
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg" className="group h-12 px-7 text-[15px]" asChild>
                <a href="/signup">
                  {site.cta.primary}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
