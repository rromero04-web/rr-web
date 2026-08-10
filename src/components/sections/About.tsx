import Image from "next/image";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function About() {
  return (
    <section id="sobre-mi" className="border-b border-line/70 py-24 md:py-32">
      <div className="container-page grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <RevealOnScroll>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm border border-line/70 bg-navy">
            <Image
              src="/brand/raul-photo.jpg"
              alt="Raúl Romero"
              width={900}
              height={1125}
              className="h-full w-full object-cover"
              priority={false}
            />
            <span
              aria-hidden="true"
              className="absolute -right-3 -bottom-3 h-16 w-16 skew-x-[-12deg] bg-cobalt"
            />
          </div>
        </RevealOnScroll>

        <div>
          <RevealOnScroll>
            <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
              Sobre mí
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Hablas directamente con quien diseña y construye tu proyecto.
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
              Soy Raúl Romero. Combino mi formación en Marketing con el
              desarrollo de webs y aplicaciones para convertir necesidades de
              negocio en soluciones digitales claras, útiles y medibles.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.18}>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate">
              No soy una agencia ni hay un equipo detrás: cuando trabajas
              conmigo, la persona que entiende tu negocio, diseña la solución
              y escribe el código es la misma en todo momento.
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
