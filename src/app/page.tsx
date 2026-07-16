import { Section } from "@/components/site/section";
import { Reveal } from "@/components/motion/reveal";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";

export default function Home() {
  return (
    <>
      <Hero />

      <Section id="work" index="01" eyebrow="Selected work" title="Products I've shipped">
        <Reveal className="mt-10">
          <p className="max-w-xl text-lg text-ink-muted">
            Showcase lands in Phase 003 — WRDB (flagship) with a pinned scroll
            sequence, plus minimal cards for migraine and TravelGuide.
          </p>
        </Reveal>
      </Section>

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
