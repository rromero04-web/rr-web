// Contenido íntegramente ficticio de "Balance Asesores", negocio de
// demostración. No corresponde a ninguna asesoría real.
// Fully fictional content for "Balance Asesores", a demo business. Does not
// correspond to any real advisory firm.

import type { Locale } from "@/lib/i18n/config";

export const BALANCE_NAME = "Balance Asesores";

export type NavLink = { href: string; label: string };

const NAV_LINKS: Record<Locale, NavLink[]> = {
  es: [
    { href: "#servicios", label: "Servicios" },
    { href: "#para-quien", label: "Para quién" },
    { href: "#como-funciona", label: "Cómo funciona" },
    { href: "#faq", label: "Preguntas frecuentes" },
  ],
  en: [
    { href: "#servicios", label: "Services" },
    { href: "#para-quien", label: "Who it's for" },
    { href: "#como-funciona", label: "How it works" },
    { href: "#faq", label: "FAQ" },
  ],
};

export function getNavLinks(locale: Locale): NavLink[] {
  return NAV_LINKS[locale];
}

export type Situation = { id: SituationId; label: string; message: string };

const SITUATION_IDS = ["nuevo", "cambio", "empresa", "puntual"] as const;
export type SituationId = (typeof SITUATION_IDS)[number];

const SITUATIONS: Record<Locale, Situation[]> = {
  es: [
    {
      id: "nuevo",
      label: "Voy a comenzar como autónomo",
      message: "Te ayudamos a darte de alta y a arrancar con la gestión ordenada desde el primer día.",
    },
    {
      id: "cambio",
      label: "Ya soy autónomo y necesito cambiar de asesoría",
      message: "Nos encargamos de la transición y centralizamos tu documentación sin sobresaltos.",
    },
    {
      id: "empresa",
      label: "Tengo una pequeña empresa",
      message: "Adaptamos la gestión fiscal y contable al tamaño y ritmo real de tu empresa.",
    },
    {
      id: "puntual",
      label: "Necesito resolver una cuestión puntual",
      message: "No hace falta un cambio completo de asesoría para resolver una duda concreta.",
    },
  ],
  en: [
    {
      id: "nuevo",
      label: "I'm about to start as a freelancer",
      message: "We help you register and start off with organized management from day one.",
    },
    {
      id: "cambio",
      label: "I'm already a freelancer and need to switch advisors",
      message: "We handle the transition and centralize your documentation without any surprises.",
    },
    {
      id: "empresa",
      label: "I have a small business",
      message: "We adapt tax and accounting management to your business's real size and pace.",
    },
    {
      id: "puntual",
      label: "I need to sort out a specific issue",
      message: "You don't need to switch advisors completely to resolve a specific question.",
    },
  ],
};

export function getSituations(locale: Locale): Situation[] {
  return SITUATIONS[locale];
}

export type ProblemItem = { problem: string; solution: string };

const PROBLEMS: Record<Locale, ProblemItem[]> = {
  es: [
    {
      problem: "No saber qué impuestos corresponden",
      solution: "Identificamos tus obligaciones exactas según tu actividad y régimen.",
    },
    {
      problem: "Recibir información poco clara",
      solution: "Te explicamos cada gestión en términos sencillos, sin jerga innecesaria.",
    },
    {
      problem: "Entregar documentación por distintos canales",
      solution: "Centralizamos todo en un único canal de comunicación.",
    },
    {
      problem: "Detectar obligaciones demasiado tarde",
      solution: "Te avisamos con antelación de cada fecha relevante.",
    },
    {
      problem: "No tener una visión ordenada de la situación",
      solution: "Mantienes visibilidad clara del estado de tu gestión en todo momento.",
    },
  ],
  en: [
    {
      problem: "Not knowing which taxes apply to you",
      solution: "We identify your exact obligations based on your activity and tax regime.",
    },
    {
      problem: "Getting unclear information",
      solution: "We explain every step in plain terms, without unnecessary jargon.",
    },
    {
      problem: "Sending documents through different channels",
      solution: "We centralize everything in a single communication channel.",
    },
    {
      problem: "Finding out about obligations too late",
      solution: "We notify you ahead of time for every relevant deadline.",
    },
    {
      problem: "Having no organized view of your situation",
      solution: "You keep clear visibility of the status of your management at all times.",
    },
  ],
};

export function getProblems(locale: Locale): ProblemItem[] {
  return PROBLEMS[locale];
}

export type ServiceItem = { title: string; description: string };

const SERVICES: Record<Locale, ServiceItem[]> = {
  es: [
    { title: "Alta y gestión de autónomos", description: "Trámites de inicio de actividad y gestión continuada." },
    { title: "Fiscalidad y contabilidad", description: "Cumplimiento fiscal y contable adaptado a tu actividad." },
    { title: "Presentación de impuestos", description: "Preparación y presentación de los modelos que te correspondan." },
    { title: "Gestión documental", description: "Un canal único para centralizar tu documentación." },
    { title: "Consultas y seguimiento", description: "Resolución de dudas puntuales y seguimiento continuo." },
  ],
  en: [
    { title: "Freelancer registration and management", description: "Business start-up formalities and ongoing management." },
    { title: "Tax and accounting", description: "Tax and accounting compliance adapted to your activity." },
    { title: "Tax filing", description: "Preparation and filing of the forms that apply to you." },
    { title: "Document management", description: "A single channel to centralize your documentation." },
    { title: "Questions and follow-up", description: "Resolving specific questions with ongoing follow-up." },
  ],
};

export function getBalanceServices(locale: Locale): ServiceItem[] {
  return SERVICES[locale];
}

const BEFORE_ITEMS: Record<Locale, string[]> = {
  es: [
    "Documentos por distintos canales",
    "Dudas sin seguimiento",
    "Fechas dispersas",
    "Poca visibilidad",
  ],
  en: [
    "Documents scattered across channels",
    "Questions with no follow-up",
    "Scattered deadlines",
    "Little visibility",
  ],
};

export function getBeforeItems(locale: Locale): string[] {
  return BEFORE_ITEMS[locale];
}

const AFTER_ITEMS: Record<Locale, string[]> = {
  es: [
    "Canal de comunicación claro",
    "Documentación organizada",
    "Próximas obligaciones visibles",
    "Seguimiento de consultas",
  ],
  en: [
    "Clear communication channel",
    "Organized documentation",
    "Upcoming obligations visible",
    "Follow-up on every question",
  ],
};

export function getAfterItems(locale: Locale): string[] {
  return AFTER_ITEMS[locale];
}

export type ProcessStep = { title: string; description: string };

const PROCESS_STEPS: Record<Locale, ProcessStep[]> = {
  es: [
    { title: "Cuéntanos tu situación", description: "Nos explicas tu caso a través del formulario de valoración." },
    { title: "Revisamos la información inicial", description: "Analizamos tu situación fiscal y tus necesidades reales." },
    { title: "Recibes una propuesta adaptada", description: "Te proponemos cómo podríamos ayudarte, sin compromiso." },
    { title: "Comienza la colaboración", description: "Si decides seguir adelante, empezamos a trabajar juntos." },
  ],
  en: [
    { title: "Tell us about your situation", description: "You explain your case through the assessment form." },
    { title: "We review the initial information", description: "We analyze your tax situation and your real needs." },
    { title: "You receive a tailored proposal", description: "We suggest how we could help you, with no obligation." },
    { title: "The collaboration begins", description: "If you decide to move forward, we start working together." },
  ],
};

export function getProcessSteps(locale: Locale): ProcessStep[] {
  return PROCESS_STEPS[locale];
}

export type FaqItem = { question: string; answer: string };

const FAQ_ITEMS: Record<Locale, FaqItem[]> = {
  es: [
    {
      question: "¿La valoración tiene compromiso?",
      answer: "No. La primera valoración es orientativa y no implica ningún compromiso de contratación.",
    },
    {
      question: "¿Trabajáis con autónomos y empresas?",
      answer: "Sí, adaptamos el servicio tanto a autónomos individuales como a pequeñas empresas.",
    },
    {
      question: "¿Puedo cambiar de asesoría?",
      answer: "Sí, nos encargamos de gestionar la transición y de centralizar tu documentación anterior.",
    },
    {
      question: "¿Cómo envío la documentación?",
      answer: "A través de un canal centralizado que te indicamos una vez iniciada la colaboración.",
    },
    {
      question: "¿Qué ocurre después de solicitar información?",
      answer: "Revisamos tu caso y te contactamos con los siguientes pasos y una primera valoración.",
    },
  ],
  en: [
    {
      question: "Does the assessment come with any obligation?",
      answer: "No. The first assessment is purely informative and doesn't involve any obligation to hire us.",
    },
    {
      question: "Do you work with freelancers and businesses?",
      answer: "Yes, we adapt the service for both individual freelancers and small businesses.",
    },
    {
      question: "Can I switch advisors?",
      answer: "Yes, we take care of managing the transition and centralizing your previous documentation.",
    },
    {
      question: "How do I send documentation?",
      answer: "Through a centralized channel we'll point you to once the collaboration begins.",
    },
    {
      question: "What happens after I request information?",
      answer: "We review your case and get back to you with next steps and an initial assessment.",
    },
  ],
};

export function getFaqItems(locale: Locale): FaqItem[] {
  return FAQ_ITEMS[locale];
}

const NEED_OPTIONS: Record<Locale, string[]> = {
  es: [
    "Gestión fiscal recurrente",
    "Contabilidad",
    "Cambio de asesoría",
    "Alta de actividad",
    "Otra necesidad",
  ],
  en: [
    "Recurring tax management",
    "Accounting",
    "Switching advisors",
    "Business registration",
    "Something else",
  ],
};

export function getNeedOptions(locale: Locale): string[] {
  return NEED_OPTIONS[locale];
}

const CONTACT_PREFERENCES: Record<Locale, string[]> = {
  es: ["Correo electrónico", "Teléfono", "Indiferente"],
  en: ["Email", "Phone", "No preference"],
};

export function getContactPreferences(locale: Locale): string[] {
  return CONTACT_PREFERENCES[locale];
}

const SITUATION_OPTIONS: Record<Locale, string[]> = {
  es: ["Autónomo", "Empresa", "Próxima alta", "Consulta puntual"],
  en: ["Freelancer", "Business", "About to register", "One-off question"],
};

export function getSituationOptions(locale: Locale): string[] {
  return SITUATION_OPTIONS[locale];
}
