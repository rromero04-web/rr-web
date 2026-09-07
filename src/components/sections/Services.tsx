import Link from "next/link";
import { ArrowUpRight, Check, PanelTop, Target, LayoutDashboard, SlidersHorizontal } from "lucide-react";
import { getServices } from "@/content/services";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { DepthReveal } from "@/components/ui/DepthReveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { Magnetic } from "@/components/ui/Magnetic";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { CTA_STRINGS } from "@/lib/configurator/strings";

const COPY = {
  es: {
    eyebrow: "01 / Servicios", title: "Lo que necesita tu negocio.\nHecho a tu medida.",
    intro: "Una presencia que transmite confianza, una web que genera oportunidades o una herramienta que te hace el día más fácil.",
    tags: ["Presencia", "Conversión", "Productividad"],
    benefits: ["Que te encuentren. Que te elijan.", "Convierte el interés en oportunidades.", "Tu forma de trabajar, mejor conectada."],
    details: "Qué puede incluir", contact: "Hablemos de tu proyecto",
    note: "Prueba ejemplos interactivos del tipo de solución que puedo crear para tu negocio.",
  },
  en: {
    eyebrow: "01 / Services", title: "What your business needs.\nMade for you.",
    intro: "A presence that builds trust, a website that creates opportunities, or an internal tool that makes your day easier.",
    tags: ["Presence", "Conversion", "Productivity"],
    benefits: ["Get found. Become the first choice.", "Turn interest into opportunities.", "A more connected way to work."],
    details: "What it can include", contact: "Let's discuss your project",
    note: "Explore the live demos. Test three interactive examples and see how a professional website, a lead-generation experience and a custom internal application could work.",
  },
};
const ICONS = [PanelTop, Target, LayoutDashboard];

export function Services({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <section id="servicios" className="studio-section studio-services">
      <div className="container-page">
        <div className="studio-section-heading">
          <DepthReveal><p className="studio-eyebrow">{t.eyebrow}</p><h2 className="studio-section-title">{t.title}</h2></DepthReveal>
          <p className="studio-section-intro">{t.intro}</p>
        </div>
        <div className="studio-service-grid">
          {getServices(locale).map((service, index) => {
            const Icon = ICONS[index];
            return <TiltCard key={service.slug} maxTilt={6} className="h-full">
              <article className={"studio-service-card service-" + index}>
                <div className="studio-service-top"><span>{service.number} / {t.tags[index]}</span><Icon size={25} strokeWidth={1.4} aria-hidden="true" /></div>
                <h3>{service.title}</h3>
                <p className="studio-service-benefit">{t.benefits[index]}</p>
                <p className="studio-service-audience">{service.audience}</p>
                <details className="studio-service-details"><summary>{t.details}<span aria-hidden="true">+</span></summary><p>{service.problem}</p><ul>{service.includes.map((item) => <li key={item}><Check size={14} aria-hidden="true" /><span>{item}</span></li>)}</ul></details>
                <div className="studio-service-actions">
                  {service.demoHref && <Link href={localizePath(service.demoHref, locale)} className="studio-service-demo">{service.demoLabel}<ArrowUpRight size={18} aria-hidden="true" /></Link>}
                  <a href="#contacto" className="studio-service-contact" title={service.nextStep}>{t.contact}<ArrowUpRight size={14} aria-hidden="true" /></a>
                </div>
              </article>
            </TiltCard>;
          })}
        </div>
        <p className="studio-demo-note">{t.note}</p>
        <RevealOnScroll>
          <div className="studio-builder-banner">
            <span className="studio-builder-symbol" aria-hidden="true"><SlidersHorizontal size={28} /></span>
            <div><h3>{CTA_STRINGS[locale].label}</h3><p>{CTA_STRINGS[locale].supportingText}</p></div>
            <Magnetic strength={0.2}>
              <Link href={localizePath("/configurador", locale)} className="studio-button studio-button-light">{CTA_STRINGS[locale].label}<ArrowUpRight size={18} aria-hidden="true" /></Link>
            </Magnetic>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
