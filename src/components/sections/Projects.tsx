import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { getProjects } from "@/content/projects";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { DepthReveal } from "@/components/ui/DepthReveal";
import { TiltCard } from "@/components/ui/TiltCard";
import type { Locale } from "@/lib/i18n/config";

const COPY = {
  es: { eyebrow: "02 / Proyectos", title: "De un problema real\na una solución digital.", intro: "Tres proyectos conceptuales para mostrar cómo abordo necesidades de negocio. Son ejemplos de propuesta, no trabajos para clientes reales.", badge: "Proyecto conceptual", problem: "El punto de partida", solution: "La solución propuesta", result: "Objetivo del concepto", details: "Explorar el planteamiento", alt: "Vista del concepto:" },
  en: { eyebrow: "02 / Projects", title: "From a real problem\nto a digital solution.", intro: "Three concept projects showing how I approach business challenges. These are proposed solutions, not work delivered for real clients.", badge: "Concept project", problem: "The starting point", solution: "The proposed solution", result: "Concept objective", details: "Explore the approach", alt: "Concept preview:" },
};

export function Projects({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <section id="proyectos" className="studio-section studio-projects">
      <div className="container-page">
        <div className="studio-section-heading">
          <DepthReveal><p className="studio-eyebrow">{t.eyebrow}</p><h2 className="studio-section-title">{t.title}</h2></DepthReveal>
          <p className="studio-section-intro">{t.intro}</p>
        </div>
        <div className="studio-project-list">
          {getProjects(locale).map((project, index) => <RevealOnScroll key={project.slug}>
            <article className="studio-project">
              <TiltCard maxTilt={7} className="studio-project-image">
                <Image src={project.image} alt={t.alt + " " + project.name} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
                <span className="studio-concept-badge">{t.badge}</span>
              </TiltCard>
              <div className="studio-project-content">
                <div className="studio-project-meta"><span>{project.sector}</span><span>0{index + 1}</span></div>
                <h3>{project.name}</h3>
                <p className="studio-project-solution">{project.solution}</p>
                <ul className="studio-tech-list">{project.tech.map((tech) => <li key={tech}>{tech}</li>)}</ul>
                <details className="studio-project-details"><summary>{t.details}<ArrowDownRight size={20} aria-hidden="true" /></summary><dl><dt>{t.problem}</dt><dd>{project.problem}</dd><dt>{t.result}</dt><dd>{project.result}</dd></dl></details>
              </div>
            </article>
          </RevealOnScroll>)}
        </div>
      </div>
    </section>
  );
}
