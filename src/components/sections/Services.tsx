import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { getServices } from "@/content/services";
import { getProjects } from "@/content/projects";
import { localizePath, type Locale } from "@/lib/i18n/config";

const COPY = {
  es: {
    title: "Qué puedo hacer por tu negocio.",
    intro: "Una web que transmite confianza, una web que convierte visitas en consultas o una herramienta que te ahorra trabajo. Cada una tiene una demo que puedes probar ahora.",
    includes: "Qué incluye",
    concept: "Proyecto conceptual:",
    alt: "Vista del proyecto conceptual",
    builderTitle: "¿No sabes cuál encaja contigo?",
    builderText: "Responde unas preguntas en el configurador y verás una propuesta orientativa de alcance y plazos.",
    builder: "Configura tu proyecto",
    newTab: "(se abre en una pestaña nueva)",
  },
  en: {
    title: "What I can do for your business.",
    intro: "A website that builds trust, a website that turns visits into enquiries, or a tool that saves you work. Each one has a demo you can try right now.",
    includes: "What's included",
    concept: "Concept project:",
    alt: "Preview of the concept project",
    builderTitle: "Not sure which one fits?",
    builderText: "Answer a few questions in the project builder and get an indicative proposal for scope and timeline.",
    builder: "Build your project",
    newTab: "(opens in a new tab)",
  },
};

export function Services({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const projects = getProjects(locale);

  return (
    <section id="servicios" className="rr-section">
      <div className="container-page">
        <div className="rr-section-head">
          <h2 className="rr-display rr-section-title">{t.title}</h2>
          <p className="rr-section-intro">{t.intro}</p>
        </div>

        <div className="rr-offer-list">
          {getServices(locale).map((service, index) => {
            const project = projects[index];
            return (
              <article key={service.slug} className="rr-offer">
                <div>
                  <h3 className="rr-display">{service.title}</h3>
                  <p className="rr-offer-audience">{service.audience}</p>
                  {service.demoHref && (
                    <div className="rr-offer-actions">
                      <a href={localizePath(service.demoHref, locale)} target="_blank" rel="noopener noreferrer" className="rr-link">
                        {service.demoLabel}
                        <span className="sr-only"> {t.newTab}</span>
                      </a>
                    </div>
                  )}
                </div>
                <div className="rr-offer-includes">
                  <h4>{t.includes}</h4>
                  <ul>
                    {service.includes.map((item) => (
                      <li key={item}><Check size={16} aria-hidden="true" /><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
                {project && (
                  <figure>
                    <div className="rr-offer-image">
                      <Image src={project.image} alt={`${t.alt}: ${project.name}`} fill sizes="(min-width: 1060px) 24vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
                    </div>
                    <figcaption>{t.concept} {project.name}</figcaption>
                  </figure>
                )}
              </article>
            );
          })}
        </div>

        <div className="rr-builder-note">
          <p><strong>{t.builderTitle}</strong>{t.builderText}</p>
          <Link href={localizePath("/configurador", locale)} className="rr-button">{t.builder}</Link>
        </div>
      </div>
    </section>
  );
}
