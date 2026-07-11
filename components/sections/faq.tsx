import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { site } from "@/lib/site";

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border py-20 sm:py-28">
      <Container className="max-w-3xl">
        <Reveal className="text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions, answered.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {site.faq.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-text-secondary">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
