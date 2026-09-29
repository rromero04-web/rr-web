import Image from "next/image";
import Link from "next/link";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getServices } from "@/content/services";
import { HeroServiceLinks } from "@/components/sections/HeroServiceLinks";

const COPY: Record<Locale, {
  lines: string[];
  lead: string;
  contact: string;
  builder: string;
  person: string;
  role: string;
  servicesLabel: string;
  services: string[];
  mock: { url: string; cta: string; panel: string; rows: string[]; toast: string };
}> = {
  es: {
    lines: ["Webs y aplicaciones", "que hacen avanzar", "tu negocio."],
    lead: "Diseño y desarrollo webs y herramientas a medida para que te encuentren, te escriban y trabajes con menos papeleo.",
    contact: "Cuéntame tu proyecto",
    builder: "Configura tu proyecto",
    person: "Hablas directamente conmigo",
    role: "Raúl Romero, diseño y desarrollo web",
    servicesLabel: "Servicios",
    services: ["Web profesional", "Web de captación", "Aplicaciones a medida"],
    mock: {
      url: "tunegocio.com",
      cta: "Reservar cita",
      panel: "Panel de gestión",
      rows: ["Reserva confirmada", "Nuevo contacto", "Tarea completada"],
      toast: "Nueva consulta recibida",
    },
  },
  en: {
    lines: ["Websites and apps", "that move your", "business forward."],
    lead: "I design and build websites and custom tools so people find you, get in touch, and you spend less time on paperwork.",
    contact: "Tell me about your project",
    builder: "Build your project",
    person: "You talk directly to me",
    role: "Raúl Romero, web design and development",
    servicesLabel: "Services",
    services: ["Professional websites", "Lead-generation websites", "Custom applications"],
    mock: {
      url: "yourbusiness.com",
      cta: "Book a visit",
      panel: "Management panel",
      rows: ["Booking confirmed", "New contact", "Task completed"],
      toast: "New inquiry received",
    },
  },
};

const CHART = [38, 62, 48, 80, 56, 92, 70];

export function Hero({ locale }: { locale: Locale }) {
  const t = COPY[locale];

  return (
    <section id="inicio" className="rr-hero">
      <div className="rr-hero-bg" aria-hidden="true" />
      <div className="container-page">
        <div className="rr-hero-grid">
          <div>
            <h1 className="rr-display rr-hero-title">
              {t.lines.map((line, index) => (
                <span key={line} className="rr-hero-line">
                  <span style={{ animationDelay: `${0.1 + index * 0.09}s` }}>{line}</span>
                </span>
              ))}
            </h1>
            <p className="rr-hero-lead">{t.lead}</p>
            <div className="rr-hero-actions">
              <a href="#contacto" className="rr-button">{t.contact}</a>
              <Link href={localizePath("/configurador", locale)} className="rr-link">{t.builder}</Link>
            </div>
          </div>

          {/* Composición ilustrativa de interfaces: decorativa. */}
          <div className="rr-hero-visual" aria-hidden="true">
            <div className="rr-hero-stage">
              <div className="rr-mock rr-mock-browser">
                <div className="rr-mock-bar"><i /><i /><i /><span>{t.mock.url}</span></div>
                <div className="rr-mock-page">
                  <div className="rr-mock-h" />
                  <div className="rr-mock-h" />
                  <div className="rr-mock-p" />
                  <div className="rr-mock-p" />
                  <span className="rr-mock-cta">{t.mock.cta}</span>
                  <div className="rr-mock-cards"><span /><span /><span /></div>
                </div>
              </div>
              <div className="rr-mock rr-mock-panel">
                <h3>{t.mock.panel}</h3>
                <div className="rr-mock-chart">
                  {CHART.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
                </div>
                <ul className="rr-mock-rows">
                  {t.mock.rows.map((row) => <li key={row}>{row}</li>)}
                </ul>
              </div>
              <div className="rr-mock rr-mock-toast"><b>✓</b>{t.mock.toast}</div>
            </div>
          </div>
        </div>

        <div className="rr-hero-foot">
          <div className="rr-hero-person">
            <Image src="/brand/raul-photo.jpg" alt="" width={112} height={112} sizes="52px" className="rr-hero-avatar" priority />
            <p><strong>{t.person}</strong>{t.role}</p>
          </div>
          <HeroServiceLinks
            label={t.servicesLabel}
            links={getServices(locale).map((service, index) => ({ id: `servicio-${service.slug}`, title: t.services[index] }))}
          />
        </div>
      </div>
    </section>
  );
}
