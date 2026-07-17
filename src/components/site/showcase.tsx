import { Feature } from "@/components/site/feature";
import { features } from "@/lib/projects";

export function Showcase() {
  return (
    <>
      {features.map((feature, i) => (
        <Feature
          key={feature.id}
          feature={feature}
          plateSide={i % 2 === 0 ? "left" : "right"}
        />
      ))}
    </>
  );
}
