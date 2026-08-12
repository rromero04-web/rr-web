import Image from "next/image";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import type { Locale } from "@/lib/i18n/config";

const STRINGS: Record<Locale, {
  eyebrow: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  photoAlt: string;
}> = {
  es: {
    eyebrow: "Sobre mí",
    heading: "Hablas directamente con quien diseña y construye tu proyecto.",
    paragraph1:
      "Soy Raúl Romero, desarrollador y diseñador web en Cartagena, Murcia. No hay intermediarios ni equipos comerciales: cuando me escribes, hablas conmigo, y cuando trabajo en tu proyecto, lo hago yo directamente.",
    paragraph2:
      "Me interesa entender primero el problema real de tu negocio y, a partir de ahí, plantear la solución más adecuada — ya sea una web que capte clientes o una aplicación que simplifique tareas internas.",
    photoAlt: "Raúl Romero",
  },
  en: {
    eyebrow: "About me",
    heading: "You talk directly with the person who designs and builds your project.",
    paragraph1:
      "I'm Raúl Romero, a web developer and designer based in Cartagena, Spain. There are no intermediaries or sales teams: when you write to me, you talk to me, and when I work on your project, I do it myself.",
    paragraph2:
      "I like to understand your business's real problem first, and from there propose the most suitable solution — whether that's a website that attracts customers or an application that simplifies internal tasks.",
    photoAlt: "Raúl Romero",
  },
};

export function About({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];

  return (
    <section id="sobre-mi" className="border-b border-line/70 py-24 md:py-32">
      <div className="container-page grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <RevealOnScroll>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden border border-line/70 bg-navy">
            <Image
              src="/brand/raul-photo.jpg"
              alt={t.photoAlt}
              fill
              sizes="(min-width: 768px) 33vw, 80vw"
              className="object-cover"
            />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
            {t.eyebrow}
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {t.heading}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate">
            {t.paragraph1}
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate">
            {t.paragraph2}
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
