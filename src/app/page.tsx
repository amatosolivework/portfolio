import { Masthead } from "@/components/site/masthead";
import { Showcase } from "@/components/site/showcase";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";

export default function Home() {
  return (
    <>
      <Masthead />
      <Showcase />
      <About />
      <Contact />
    </>
  );
}
