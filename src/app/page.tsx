import { Hero } from "@/components/site/hero";
import { Showcase } from "@/components/site/showcase";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Showcase />
      <About />
      <Contact />
    </>
  );
}
