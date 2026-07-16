import { Section } from "@/components/site/section";
import { Reveal } from "@/components/motion/reveal";
import { HeroPlaceholder } from "@/components/site/hero-placeholder";

export default function Home() {
  return (
    <>
      <HeroPlaceholder />

      <Section id="work" index="01" eyebrow="Selected work" title="Products I've shipped">
        <Reveal className="mt-10">
          <p className="max-w-xl text-lg text-ink-muted">
            Showcase lands in Phase 003 — WRDB (flagship) with a pinned scroll
            sequence, plus minimal cards for migraine and TravelGuide.
          </p>
        </Reveal>
      </Section>

      <Section id="about" index="02" eyebrow="About" title="Who I am">
        <Reveal className="mt-10">
          <p className="max-w-xl text-lg text-ink-muted">
            Bio, education, skills, and the downloadable CV arrive in Phase 002.
          </p>
        </Reveal>
      </Section>

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
