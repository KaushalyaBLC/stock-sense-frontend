import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export function Why() {
  return (
    <section className="border-t border-border py-24 sm:py-36">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Made for CSE investors who want an edge they can trust.
          </h2>
        </Reveal>

        <div className="mt-16 divide-y divide-border">
          {site.why.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 0.06}
              className="grid gap-2 py-8 sm:grid-cols-[minmax(0,280px)_1fr] sm:items-baseline sm:gap-10"
            >
              <h3 className="text-xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="max-w-xl text-text-secondary">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
