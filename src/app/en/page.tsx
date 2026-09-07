import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Marquee } from "@/components/ui/Marquee";

export default function Home() {
  return (
    <>
      <Hero locale="en" />
      <Marquee locale="en" />
      <Services locale="en" />
      <div className="studio-diagonal-divider" aria-hidden="true" />
      <Projects locale="en" />
      <Process locale="en" />
      <About locale="en" />
      <Faq locale="en" />
      <Contact locale="en" />
    </>
  );
}
