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
      <Hero locale="en" />
      <Services locale="en" />
      <Projects locale="en" />
      <Process locale="en" />
      <About locale="en" />
      <Faq locale="en" />
      <Contact locale="en" />
    </>
  );
}
