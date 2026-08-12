import type { Locale } from "@/lib/i18n/config";

export type Service = {
  slug: string;
  number: string;
  title: string;
  audience: string;
  problem: string;
  includes: string[];
  nextStep: string;
  demoHref?: string;
  demoLabel?: string;
};

const SERVICES: Record<Locale, Service[]> = {
  es: [
    {
      slug: "web-profesional",
      number: "01",
      title: "Web profesional",
      audience: "Negocios locales, autónomos y profesionales que aún no tienen una presencia digital clara.",
      problem: "Sin una web propia, un cliente potencial no puede confirmar que existes, qué haces o si puede confiar en ti antes de llamarte.",
      includes: [
        "Diseño a medida basado en tu negocio, no en una plantilla",
        "Estructura clara: quién eres, qué ofreces y cómo contactarte",
        "Optimizada para buscadores y para verse bien en cualquier dispositivo",
        "Panel sencillo para que puedas actualizar textos e imágenes",
      ],
      nextStep: "Cuéntame tu negocio y te propongo una estructura concreta.",
      demoHref: "/demo/web-profesional",
      demoLabel: "Ver demo de web profesional",
    },
    {
      slug: "web-de-captacion",
      number: "02",
      title: "Web de captación",
      audience: "Negocios que ya tienen visitas o tráfico, pero pocas consultas o ventas reales.",
      problem: "Tener visitas no sirve de mucho si la web no guía al visitante hacia una acción concreta: pedir presupuesto, reservar o comprar.",
      includes: [
        "Diseño orientado a la conversión, con mensajes claros y llamadas a la acción",
        "Formularios y flujos pensados para reducir la fricción",
        "Medición básica para saber qué funciona y qué no",
        "Iteración tras el lanzamiento con datos reales",
      ],
      nextStep: "Reviso tu situación actual y te digo qué cambiaría primero.",
      demoHref: "/demo/web-captacion",
      demoLabel: "Ver demo de web de captación",
    },
    {
      slug: "aplicaciones-a-medida",
      number: "03",
      title: "Aplicaciones a medida",
      audience: "Negocios con procesos manuales — hojas de cálculo, WhatsApp, papel — que podrían digitalizarse.",
      problem: "Gestionar reservas, presupuestos o clientes a mano cuesta tiempo y provoca errores que una herramienta sencilla puede evitar.",
      includes: [
        "Sistemas de reservas, portales de cliente o paneles internos",
        "Herramientas de presupuestos o gestión adaptadas a tu forma de trabajar",
        "Automatización de tareas repetitivas",
        "Acompañamiento tras el lanzamiento para ajustar lo que haga falta",
      ],
      nextStep: "Hablamos del proceso que quieres mejorar y valoramos si tiene sentido digitalizarlo.",
      demoHref: "/demo/gestion-de-equipos",
      demoLabel: "Probar demo de gestión de equipos",
    },
  ],
  en: [
    {
      slug: "web-profesional",
      number: "01",
      title: "Professional websites",
      audience: "Local businesses, freelancers and professionals who don't yet have a clear digital presence.",
      problem: "Without a website of your own, a potential customer can't confirm you exist, what you do, or whether they can trust you before reaching out.",
      includes: [
        "Custom design built around your business, not a template",
        "Clear structure: who you are, what you offer and how to reach you",
        "Optimized for search engines and for looking great on any device",
        "Simple panel so you can update text and images yourself",
      ],
      nextStep: "Tell me about your business and I'll propose a concrete structure.",
      demoHref: "/demo/web-profesional",
      demoLabel: "View professional website demo",
    },
    {
      slug: "web-de-captacion",
      number: "02",
      title: "Lead-generation websites",
      audience: "Businesses that already get visits or traffic, but few real inquiries or sales.",
      problem: "Traffic doesn't help much if the website doesn't guide visitors toward a specific action: requesting a quote, booking or buying.",
      includes: [
        "Conversion-focused design with clear messaging and calls to action",
        "Forms and flows designed to reduce friction",
        "Basic tracking to understand what works and what doesn't",
        "Iteration after launch based on real data",
      ],
      nextStep: "I'll review your current situation and tell you what I'd change first.",
      demoHref: "/demo/web-captacion",
      demoLabel: "View lead-generation website demo",
    },
    {
      slug: "aplicaciones-a-medida",
      number: "03",
      title: "Custom internal applications",
      audience: "Businesses with manual processes — spreadsheets, WhatsApp, paper — that could be digitized.",
      problem: "Managing bookings, quotes or clients by hand costs time and causes mistakes that a simple tool can prevent.",
      includes: [
        "Booking systems, client portals or internal dashboards",
        "Quoting or management tools adapted to how you actually work",
        "Automation of repetitive tasks",
        "Support after launch to adjust whatever needs it",
      ],
      nextStep: "Let's talk about the process you want to improve and see if it's worth digitizing.",
      demoHref: "/demo/gestion-de-equipos",
      demoLabel: "Try the team management demo",
    },
  ],
};

export function getServices(locale: Locale): Service[] {
  return SERVICES[locale];
}
