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
      <Hero locale="es" />
      <Marquee locale="es" />
      <Services locale="es" />
      <div className="studio-diagonal-divider" aria-hidden="true" />
      <Projects locale="es" />
      <Process locale="es" />
      <About locale="es" />
      <Faq locale="es" />
      <Contact locale="es" />
    </>
  );
}
