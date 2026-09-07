"use client";

import { useId, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, LayoutDashboard, PanelTop, Target } from "lucide-react";
import { localizePath, type Locale } from "@/lib/i18n/config";

const ROUTES = ["/demo/web-profesional", "/demo/web-captacion", "/demo/gestion-de-equipos"];
const ICONS = [PanelTop, Target, LayoutDashboard];
const COPY = {
  es: {
    label: "Ideas que puedes explorar", interactive: "Vista interactiva", tabs: ["Web", "Captación", "Aplicación"],
    caption: ["Una presencia que inspira confianza.", "Cada visita, un siguiente paso.", "Menos tareas. Más control."],
    link: "Explorar esta demo", concept: "Concepto interactivo · Datos ficticios",
    brand: "Tu negocio", menu: "Servicios / Nosotros / Contacto", headline: "Lo que haces,\nbien contado.",
    subtitle: "Una web a la altura de tu negocio.", action: "Hablemos", offer: "De la primera visita\na la primera conversación.",
    leadLabel: "¿Qué necesitas?", choices: ["Una web profesional", "Más contactos", "Simplificar procesos"], next: "Elegir una solución",
    dashboard: "Tu equipo, conectado.", today: "Vista de equipo", statuses: ["En curso", "Completado", "Pendiente"],
    rows: ["Organizar turnos", "Revisar solicitudes", "Coordinar tareas"], column: "Actividad", state: "Estado",
    metric: ["Personas", "Áreas", "Espacio compartido"], card: ["Estrategia", "Diseño", "Experiencia"],
  },
  en: {
    label: "Ideas you can explore", interactive: "Interactive preview", tabs: ["Website", "Leads", "Application"],
    caption: ["A presence that inspires trust.", "Give every visit a next step.", "Fewer tasks. More control."],
    link: "Explore this demo", concept: "Interactive concept · Fictional data",
    brand: "Your business", menu: "Services / About / Contact", headline: "What you do,\nbeautifully told.",
    subtitle: "A website that does your business justice.", action: "Let's talk", offer: "From a first visit\nto a first conversation.",
    leadLabel: "What do you need?", choices: ["A professional website", "More enquiries", "Simpler processes"], next: "Explore a solution",
    dashboard: "Your team, connected.", today: "Team overview", statuses: ["In progress", "Completed", "Pending"],
    rows: ["Organise shifts", "Review enquiries", "Coordinate tasks"], column: "Activity", state: "Status",
    metric: ["People", "Areas", "Shared workspace"], card: ["Strategy", "Design", "Experience"],
  },
};

export function SolutionShowcase({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const [choice, setChoice] = useState(0);
  const id = useId();
  const t = COPY[locale];
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % 3;
    else if (event.key === "ArrowLeft") next = (index + 2) % 3;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 2;
    else return;
    event.preventDefault();
    setActive(next);
    document.getElementById(id + "-tab-" + next)?.focus();
  }
  return (
    <div className="studio-showcase">
      <div className="studio-showcase-heading"><span>{t.label}</span><ArrowUpRight size={19} aria-hidden="true" /></div>
      <div className="studio-showcase-window">
        <div className="studio-window-bar"><span className="studio-window-dots" aria-hidden="true"><i /><i /><i /></span><span>{t.interactive}</span><span className="studio-window-index">0{active + 1} / 03</span></div>
        <div role="tablist" aria-label={t.label} className="studio-showcase-tabs">
          {t.tabs.map((tab, index) => {
            const Icon = ICONS[index];
            return <button key={tab} type="button" role="tab" id={id + "-tab-" + index} aria-controls={id + "-panel"} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onKeyDown={(event) => onTabKey(event, index)} onClick={() => setActive(index)}><Icon size={15} aria-hidden="true" />{tab}</button>;
          })}
        </div>
        <div id={id + "-panel"} role="tabpanel" aria-labelledby={id + "-tab-" + active} tabIndex={0} className="studio-preview-panel">
          <div key={active} className="studio-preview-content">
            {active === 0 ? (
              <div className="studio-mini-web">
                <div className="studio-mini-nav"><strong>{t.brand}<span>.</span></strong><span>{t.menu}</span></div>
                <div className="studio-mini-web-hero">
                  <div><p className="studio-mini-kicker">WEB & GROWTH</p><p className="studio-mini-title">{t.headline}</p><p className="studio-mini-copy">{t.subtitle}</p><Link href={localizePath(ROUTES[0], locale)} className="studio-mini-action">{t.action}<ArrowUpRight size={13} aria-hidden="true" /></Link></div>
                  <div className="studio-logo-sculpture"><div className="studio-logo-orbit" /><Image src="/brand/logo-mark.png" alt="" width={700} height={588} sizes="130px" className="h-auto w-full" priority /></div>
                </div>
                <div className="studio-mini-services">{t.card.map((label, index) => <div key={label}><span>0{index + 1}</span><strong>{label}</strong><div className="studio-mini-rule" /></div>)}</div>
              </div>
            ) : active === 1 ? (
              <div className="studio-mini-leads">
                <p className="studio-mini-kicker">WEB & GROWTH / 02</p><p className="studio-mini-title">{t.offer}</p>
                <fieldset><legend>{t.leadLabel}</legend><div className="studio-mini-options">{t.choices.map((label, index) => <button type="button" key={label} aria-pressed={choice === index} onClick={() => setChoice(index)}><span>{choice === index ? <Check size={12} aria-hidden="true" /> : null}</span>{label}</button>)}</div></fieldset>
                <Link href={localizePath(ROUTES[choice === 2 ? 2 : choice === 0 ? 0 : 1], locale)} className="studio-mini-action">{t.next}<ArrowUpRight size={13} aria-hidden="true" /></Link>
              </div>
            ) : (
              <div className="studio-mini-app">
                <div className="studio-mini-app-heading"><div><p className="studio-mini-kicker">{t.today}</p><p className="studio-mini-title">{t.dashboard}</p></div><span className="studio-mini-avatar">RR</span></div>
                <div className="studio-mini-metrics">{["6", "3", "1"].map((number, index) => <div key={number}><strong>{number}</strong><span>{t.metric[index]}</span></div>)}</div>
                <div className="studio-mini-table"><div><span>{t.column}</span><span>{t.state}</span></div>{t.rows.map((row, index) => <div key={row}><span>{row}</span><span className={"studio-mini-state state-" + index}>{t.statuses[index]}</span></div>)}</div>
              </div>
            )}
          </div>
        </div>
        <div className="studio-showcase-caption" aria-live="polite"><span>{t.caption[active]}</span><span className="studio-caption-line" /></div>
      </div>
      <div className="studio-showcase-bottom"><span>{t.concept}</span><Link href={localizePath(ROUTES[active], locale)}>{t.link}<ArrowUpRight size={15} aria-hidden="true" /></Link></div>
    </div>
  );
}
