import { ScrollProgress } from "@/components/scroll-progress";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Features } from "@/components/sections/features";
import { Showcase } from "@/components/sections/showcase";
import { Why } from "@/components/sections/why";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <Showcase />
        <Why />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
