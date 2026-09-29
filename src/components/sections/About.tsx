import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";

const STRINGS: Record<Locale, {
  heading: string;
  paragraph1: string;
  paragraph2: string;
  role: string;
  photoAlt: string;
}> = {
  es: {
    heading: "Hablas directamente con quien diseña y construye tu proyecto.",
    paragraph1:
      "Soy Raúl Romero, desarrollador y diseñador web. No hay intermediarios ni equipos comerciales: cuando me escribes, hablas conmigo, y cuando trabajo en tu proyecto, lo hago yo directamente.",
    paragraph2:
      "Me interesa entender primero el problema real de tu negocio y, a partir de ahí, plantear la solución más adecuada, ya sea una web que capte clientes o una aplicación que simplifique tareas internas.",
    role: "Diseño y desarrollo web",
    photoAlt: "Retrato de Raúl Romero",
  },
  en: {
    heading: "You talk directly with the person who designs and builds your project.",
    paragraph1:
      "I'm Raúl Romero, a web developer and designer. There are no intermediaries or sales teams: when you write to me, you talk to me, and when I work on your project, I do it myself.",
    paragraph2:
      "I like to understand your business's real problem first, and from there propose the most suitable solution, whether that's a website that attracts customers or an application that simplifies internal tasks.",
    role: "Web design and development",
    photoAlt: "Portrait of Raúl Romero",
  },
};

export function About({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];

  return (
    <section id="sobre-mi" className="rr-section rr-section-alt">
      <div className="container-page rr-about">
        <div className="rr-about-photo">
          <div className="rr-about-photo-frame">
            <Image src="/brand/raul-photo.jpg" alt={t.photoAlt} fill sizes="(min-width: 860px) 32vw, 360px" className="object-cover" />
          </div>
        </div>
        <div className="rr-about-text">
          <h2 className="rr-display rr-section-title">{t.heading}</h2>
          <p>{t.paragraph1}</p>
          <p>{t.paragraph2}</p>
          <div className="rr-about-sign">Raúl Romero<span>{t.role}</span></div>
        </div>
      </div>
    </section>
  );
}
