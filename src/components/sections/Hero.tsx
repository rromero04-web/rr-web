import Image from "next/image";
import Link from "next/link";
import { localizePath, type Locale } from "@/lib/i18n/config";

const COPY: Record<Locale, {
  lines: string[];
  lead: string;
  contact: string;
  builder: string;
  person: string;
  role: string;
  servicesLabel: string;
  services: string[];
}> = {
  es: {
    lines: ["Webs y aplicaciones", "que hacen avanzar", "tu negocio."],
    lead: "Diseño y desarrollo webs y herramientas a medida para que te encuentren, te escriban y trabajes con menos papeleo.",
    contact: "Cuéntame tu proyecto",
    builder: "Configura tu proyecto",
    person: "Hablas directamente conmigo",
    role: "Raúl Romero, diseño y desarrollo en Cartagena",
    servicesLabel: "Servicios",
    services: ["Web profesional", "Web de captación", "Aplicaciones a medida"],
  },
  en: {
    lines: ["Websites and apps", "that move your", "business forward."],
    lead: "I design and build websites and custom tools so people find you, get in touch, and you spend less time on paperwork.",
    contact: "Tell me about your project",
    builder: "Build your project",
    person: "You talk directly to me",
    role: "Raúl Romero, design and development in Cartagena, Spain",
    servicesLabel: "Services",
    services: ["Professional websites", "Lead-generation websites", "Custom applications"],
  },
};

export function Hero({ locale }: { locale: Locale }) {
  const t = COPY[locale];

  return (
    <section id="inicio" className="rr-hero">
      <div className="container-page">
        {/* El único momento orquestado de la página: las líneas del titular
            suben una tras otra al cargar. */}
        <h1 className="rr-display rr-hero-title">
          {t.lines.map((line, index) => (
            <span key={line} className="rr-hero-line">
              <span style={{ animationDelay: `${0.1 + index * 0.09}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="rr-hero-body">
          <p className="rr-hero-lead">{t.lead}</p>
          <div className="rr-hero-actions">
            <a href="#contacto" className="rr-button">{t.contact}</a>
            <Link href={localizePath("/configurador", locale)} className="rr-link">{t.builder}</Link>
          </div>
        </div>

        <div className="rr-hero-foot">
          <div className="rr-hero-person">
            <Image src="/brand/raul-photo.jpg" alt="" width={112} height={112} sizes="56px" className="rr-hero-avatar" priority />
            <p><strong>{t.person}</strong>{t.role}</p>
          </div>
          <nav aria-label={t.servicesLabel} className="rr-hero-services">
            {t.services.map((service) => <a key={service} href="#servicios">{service}</a>)}
          </nav>
        </div>
      </div>
    </section>
  );
}
