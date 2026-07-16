import { Section } from "@/components/site/section";
import { Reveal } from "@/components/motion/reveal";
import { Hero } from "@/components/site/hero";
import { Showcase } from "@/components/site/showcase";
import { About } from "@/components/site/about";

export default function Home() {
  return (
    <>
      <Hero />

      <Showcase />

      <About />

      <Section id="contact" index="03" eyebrow="Contact" title="Let's talk">
        <Reveal className="mt-10">
          <p className="max-w-xl text-lg text-ink-muted">
            Email, LinkedIn, and GitHub land in Phase 005.
          </p>
        </Reveal>
      </Section>
    </>
  );
}
