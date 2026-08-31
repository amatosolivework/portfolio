import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Labs",
  description:
    "Small, honest data studies on open data — real numbers, published failures, reproducible pipelines. Wildfires from orbit, Barcelona's bike tide, Spain's electricity clock.",
};

const LABS = [
  {
    n: "01",
    href: "/labs/incendio",
    topic: "Earth observation",
    title: "The fire you can't unsee",
    blurb:
      "The La Mierla wildfire through Landsat's thermal eye: in optical it's a stain you'd mistake for shadow; in thermal it's a 17σ anomaly with a scar still at 60 °C after control.",
    img: "/data/incendio/comparator_lst.png",
    imgAlt: "Thermal view of the La Mierla wildfire",
  },
  {
    n: "02",
    href: "/labs/bicing",
    topic: "Urban data",
    title: "The tide you can ride",
    blurb:
      "A year of Barcelona's Bicing, snapshot by snapshot: the daily tide of bikes draining downhill, the trucks that push back at 1 AM, and a predictor whose failures are published.",
    img: "/data/bicing/a_gate_marea_barrios.png",
    imgAlt: "The Bicing tide, neighbourhood by neighbourhood",
  },
  {
    n: "04",
    href: "/labs/luz",
    topic: "Energy data",
    title: "The washing-machine hour",
    blurb:
      "Two years of Spain's hourly electricity tariff: the solar valley that flipped the cheap hours to midday, and a rule that fits on a post-it, backtested against perfect information.",
    img: null,
    imgAlt: "",
  },
];

export default function LabsIndexPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-32 md:px-10 md:pt-40">
      <div className="flex items-baseline justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
        <span>Labs</span>
        <span className="text-ink-faint">open data, honest numbers</span>
      </div>

      <h1
        className="mt-12 max-w-[18ch] font-semibold leading-[0.95] tracking-[-0.03em] text-ink"
        style={{ fontSize: "var(--text-display)", fontWeight: 800 }}
      >
        Small studies, real data.
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Each lab takes one public dataset and works it until it tells the
        truth: reproducible pipelines, invariants that abort loudly, and the
        failures published next to the findings.
      </p>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {LABS.map((lab) => (
          <Reveal key={lab.n}>
            <Link
              href={lab.href}
              className="group block overflow-hidden rounded-2xl bg-[#17130E] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#100D09]">
                {lab.img ? (
                  <Image
                    src={lab.img}
                    alt={lab.imgAlt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover object-top opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                  />
                ) : (
                  <div className="px-8 text-center">
                    <div className="font-mono text-6xl font-bold tracking-tight text-[#FF7A2F]">
                      23:00 → 13:00
                    </div>
                    <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F4EDE3]/45">
                      when the cheap hours moved
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-[#F4EDE3]/50">
                  <span>Labs · {lab.n}</span>
                  <span>{lab.topic}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-[#F4EDE3]">
                  {lab.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#F4EDE3]/55">
                  {lab.blurb}
                </p>
                <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#FF7A2F]">
                  Open lab →
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
