import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero locale="es" />
      <Services locale="es" />
      <Projects locale="es" />
      <Process locale="es" />
      <About locale="es" />
      <Faq locale="es" />
      <Contact locale="es" />
    </>
  );
}
