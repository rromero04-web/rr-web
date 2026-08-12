import type { Locale } from "@/lib/i18n/config";
import type { StepId } from "./types";

export const STEP_ORDER: StepId[] = [
  "type",
  "goal",
  "client",
  "modules",
  "features",
  "style",
  "status",
  "result",
];

export const STEP_META: Record<StepId, { es: { title: string; subtitle: string }; en: { title: string; subtitle: string } }> = {
  type: {
    es: { title: "¿Qué quieres construir?", subtitle: "Elige el tipo de proyecto que más se acerca a lo que necesitas." },
    en: { title: "What do you want to build?", subtitle: "Pick the project type that's closest to what you need." },
  },
  goal: {
    es: { title: "¿Cuál es tu objetivo principal?", subtitle: "Esto nos ayuda a priorizar qué construir primero." },
    en: { title: "What's your main goal?", subtitle: "This helps us prioritize what to build first." },
  },
  client: {
    es: { title: "¿Quién eres?", subtitle: "El tipo de cliente cambia cómo planteamos la solución." },
    en: { title: "Who are you?", subtitle: "The type of client shapes how we approach the solution." },
  },
  modules: {
    es: { title: "¿Qué secciones o módulos necesitas?", subtitle: "Elige todos los que apliquen. Puedes cambiarlo después." },
    en: { title: "What sections or modules do you need?", subtitle: "Pick as many as apply. You can change this later." },
  },
  features: {
    es: { title: "¿Qué funciones necesita?", subtitle: "Marca las capacidades técnicas que tu proyecto requiere." },
    en: { title: "What functionality does it need?", subtitle: "Select the technical capabilities your project requires." },
  },
  style: {
    es: { title: "¿Qué estilo visual buscas?", subtitle: "Define el tono, color, contraste y densidad." },
    en: { title: "What visual style are you after?", subtitle: "Define the tone, color, contrast and density." },
  },
  status: {
    es: { title: "¿En qué punto estás?", subtitle: "Y qué plazo tienes en mente." },
    en: { title: "Where are you starting from?", subtitle: "And what timeline you have in mind." },
  },
  result: {
    es: { title: "Tu proyecto, resumido", subtitle: "Así quedaría configurado según tus respuestas." },
    en: { title: "Your project, summarized", subtitle: "Here's how it looks based on your answers." },
  },
};

export const NAV_STRINGS: Record<Locale, {
  back: string;
  next: string;
  restart: string;
  stepOf: (current: number, total: number) => string;
  progressLabel: string;
  editAnswer: string;
  requiredHint: string;
}> = {
  es: {
    back: "Atrás",
    next: "Siguiente",
    restart: "Reiniciar",
    stepOf: (current, total) => `Paso ${current} de ${total}`,
    progressLabel: "Progreso del configurador",
    editAnswer: "Editar",
    requiredHint: "Selecciona una opción para continuar.",
  },
  en: {
    back: "Back",
    next: "Next",
    restart: "Restart",
    stepOf: (current, total) => `Step ${current} of ${total}`,
    progressLabel: "Configurator progress",
    editAnswer: "Edit",
    requiredHint: "Select an option to continue.",
  },
};

export const PREVIEW_STRINGS: Record<Locale, {
  title: string;
  deviceLabel: string;
  desktop: string;
  tablet: string;
  mobile: string;
  architectureCta: string;
  emptyState: string;
  logTitle: string;
  logEmpty: string;
}> = {
  es: {
    title: "Vista previa en vivo",
    deviceLabel: "Tamaño de pantalla",
    desktop: "Escritorio",
    tablet: "Tablet",
    mobile: "Móvil",
    architectureCta: "Ver arquitectura",
    emptyState: "Elige un tipo de proyecto para empezar a ver el mockup.",
    logTitle: "Actividad",
    logEmpty: "Aquí verás cada decisión que tomes.",
  },
  en: {
    title: "Live preview",
    deviceLabel: "Screen size",
    desktop: "Desktop",
    tablet: "Tablet",
    mobile: "Mobile",
    architectureCta: "View architecture",
    emptyState: "Pick a project type to start seeing the mockup.",
    logTitle: "Activity",
    logEmpty: "Every decision you make will show up here.",
  },
};

export const ARCHITECTURE_STRINGS: Record<Locale, { title: string; intro: string; close: string }> = {
  es: {
    title: "Arquitectura orientativa",
    intro: "Estas son las piezas técnicas relevantes según lo que has configurado.",
    close: "Cerrar",
  },
  en: {
    title: "High-level architecture",
    intro: "These are the relevant technical pieces based on your configuration.",
    close: "Close",
  },
};

export const RESULT_STRINGS: Record<Locale, {
  recommendedType: string;
  goal: string;
  modules: string;
  features: string;
  complexity: string;
  timeline: string;
  weeks: (min: number, max: number) => string;
  nextStep: string;
  nextStepBody: string;
  priceEstimate: string;
  priceDisclaimer: string;
  noPriceNote: string;
  share: string;
  shareCopied: string;
  complexityLabel: Record<"simple" | "media" | "alta" | "muy-alta", string>;
  none: string;
}> = {
  es: {
    recommendedType: "Tipo recomendado",
    goal: "Objetivo",
    modules: "Módulos",
    features: "Funciones",
    complexity: "Complejidad",
    timeline: "Plazo estimado",
    weeks: (min, max) => (min === max ? `${min} semanas` : `${min}–${max} semanas`),
    nextStep: "Próximo paso",
    nextStepBody: "Envíame esta configuración y te responderé con una propuesta concreta y los siguientes pasos.",
    priceEstimate: "Presupuesto orientativo",
    priceDisclaimer: "Estimación orientativa; el alcance y presupuesto definitivos se confirmarán tras revisar el proyecto.",
    noPriceNote: "Estimación orientativa; el alcance y presupuesto definitivos se confirmarán tras revisar el proyecto.",
    share: "Copiar enlace de esta configuración",
    shareCopied: "Enlace copiado.",
    complexityLabel: { simple: "Simple", media: "Media", alta: "Alta", "muy-alta": "Muy alta" },
    none: "Ninguno seleccionado",
  },
  en: {
    recommendedType: "Recommended type",
    goal: "Goal",
    modules: "Modules",
    features: "Features",
    complexity: "Complexity",
    timeline: "Estimated timeline",
    weeks: (min, max) => (min === max ? `${min} weeks` : `${min}–${max} weeks`),
    nextStep: "Next step",
    nextStepBody: "Send me this configuration and I'll get back to you with a concrete proposal and next steps.",
    priceEstimate: "Estimated budget",
    priceDisclaimer: "Ballpark estimate; final scope and budget will be confirmed after reviewing the project.",
    noPriceNote: "Ballpark estimate; final scope and budget will be confirmed after reviewing the project.",
    share: "Copy a link to this configuration",
    shareCopied: "Link copied.",
    complexityLabel: { simple: "Simple", media: "Medium", alta: "High", "muy-alta": "Very high" },
    none: "None selected",
  },
};

export const FORM_STRINGS: Record<Locale, {
  title: string;
  intro: string;
  honeypotLabel: string;
  name: string;
  email: string;
  project: string;
  comment: string;
  commentPlaceholder: string;
  consent: string;
  submit: string;
  submitting: string;
}> = {
  es: {
    title: "Enviar mi proyecto a Raúl",
    intro: "Te escribo con esta configuración para que me des tu opinión y los siguientes pasos.",
    honeypotLabel: "No rellenar este campo",
    name: "Nombre",
    email: "Correo electrónico",
    project: "Empresa o proyecto",
    comment: "Comentario adicional",
    commentPlaceholder: "Añade cualquier detalle que quieras que sepa.",
    consent: "He leído la Política de privacidad y entiendo cómo se tratarán mis datos.",
    submit: "Enviar mi proyecto",
    submitting: "Enviando...",
  },
  en: {
    title: "Send my project to Raúl",
    intro: "I'm sending you this configuration so you can share your thoughts and next steps.",
    honeypotLabel: "Leave this field empty",
    name: "Name",
    email: "Email address",
    project: "Company or project",
    comment: "Additional comment",
    commentPlaceholder: "Add any detail you'd like me to know.",
    consent: "I have read the Privacy Policy and understand how my data will be handled.",
    submit: "Send my project",
    submitting: "Sending...",
  },
};

export const LOG_MESSAGES: Record<Locale, {
  start: string;
  type: (label: string) => string;
  goal: (label: string) => string;
  client: (label: string) => string;
  moduleAdded: (label: string) => string;
  moduleRemoved: (label: string) => string;
  featureAdded: (label: string) => string;
  featureRemoved: (label: string) => string;
  style: (label: string) => string;
  color: (label: string) => string;
  contrast: (label: string) => string;
  density: (label: string) => string;
  readiness: (label: string) => string;
  urgency: (label: string) => string;
  device: (label: string) => string;
  architectureOpened: string;
  reset: string;
  stepBack: (label: string) => string;
  stepNext: (label: string) => string;
  shared: string;
  submitted: string;
}> = {
  es: {
    start: "Configurador iniciado.",
    type: (label) => `Tipo de proyecto: ${label}.`,
    goal: (label) => `Objetivo: ${label}.`,
    client: (label) => `Cliente: ${label}.`,
    moduleAdded: (label) => `Módulo añadido: ${label}.`,
    moduleRemoved: (label) => `Módulo quitado: ${label}.`,
    featureAdded: (label) => `Función añadida: ${label}.`,
    featureRemoved: (label) => `Función quitada: ${label}.`,
    style: (label) => `Estilo: ${label}.`,
    color: (label) => `Color principal: ${label}.`,
    contrast: (label) => `Contraste: ${label}.`,
    density: (label) => `Densidad: ${label}.`,
    readiness: (label) => `Punto de partida: ${label}.`,
    urgency: (label) => `Plazo deseado: ${label}.`,
    device: (label) => `Vista previa cambiada a ${label}.`,
    architectureOpened: "Arquitectura consultada.",
    reset: "Configuración reiniciada.",
    stepBack: (label) => `Vuelta al paso: ${label}.`,
    stepNext: (label) => `Avance al paso: ${label}.`,
    shared: "Enlace de configuración copiado.",
    submitted: "Proyecto enviado a Raúl.",
  },
  en: {
    start: "Configurator started.",
    type: (label) => `Project type: ${label}.`,
    goal: (label) => `Goal: ${label}.`,
    client: (label) => `Client: ${label}.`,
    moduleAdded: (label) => `Module added: ${label}.`,
    moduleRemoved: (label) => `Module removed: ${label}.`,
    featureAdded: (label) => `Feature added: ${label}.`,
    featureRemoved: (label) => `Feature removed: ${label}.`,
    style: (label) => `Style: ${label}.`,
    color: (label) => `Main color: ${label}.`,
    contrast: (label) => `Contrast: ${label}.`,
    density: (label) => `Density: ${label}.`,
    readiness: (label) => `Starting point: ${label}.`,
    urgency: (label) => `Desired timeline: ${label}.`,
    device: (label) => `Preview switched to ${label}.`,
    architectureOpened: "Architecture viewed.",
    reset: "Configuration reset.",
    stepBack: (label) => `Went back to step: ${label}.`,
    stepNext: (label) => `Moved to step: ${label}.`,
    shared: "Configuration link copied.",
    submitted: "Project sent to Raúl.",
  },
};

export const CTA_STRINGS: Record<Locale, { label: string; supportingText: string }> = {
  es: {
    label: "Configura tu proyecto",
    supportingText: "Responde unas preguntas y mira en tiempo real cómo tomaría forma tu web o aplicación.",
  },
  en: {
    label: "Build your project",
    supportingText: "Answer a few questions and watch your website or application take shape in real time.",
  },
};

export const WEB_PREVIEW_STRINGS: Record<Locale, {
  addressBar: string;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
  sectionTitle: Record<"servicios" | "sobre-nosotros" | "casos" | "portfolio" | "faq" | "blog" | "catalogo", string>;
  cardTitle: (n: number) => string;
  cardBody: string;
  faqQuestion: (n: number) => string;
  faqAnswer: string;
  contactTitle: string;
  contactName: string;
  contactEmail: string;
  contactMessage: string;
  contactSubmit: string;
  footerText: string;
}> = {
  es: {
    addressBar: "tunegocio.com",
    heroEyebrow: "Vista previa",
    heroTitle: "Un titular claro sobre lo que ofreces.",
    heroBody: "Una frase breve que explica el beneficio principal para quien te visita.",
    ctaPrimary: "Contactar",
    ctaSecondary: "Ver más",
    sectionTitle: {
      servicios: "Servicios",
      "sobre-nosotros": "Sobre nosotros",
      casos: "Casos de éxito",
      portfolio: "Portfolio",
      faq: "Preguntas frecuentes",
      blog: "Blog",
      catalogo: "Catálogo",
    },
    cardTitle: (n) => `Elemento ${n}`,
    cardBody: "Descripción breve de este elemento.",
    faqQuestion: (n) => `Pregunta frecuente ${n}`,
    faqAnswer: "Respuesta breve y clara.",
    contactTitle: "Contacto",
    contactName: "Nombre",
    contactEmail: "Correo electrónico",
    contactMessage: "Mensaje",
    contactSubmit: "Enviar",
    footerText: "© Tu negocio. Todos los derechos reservados.",
  },
  en: {
    addressBar: "yourbusiness.com",
    heroEyebrow: "Live preview",
    heroTitle: "A clear headline about what you offer.",
    heroBody: "A short sentence explaining the main benefit for your visitor.",
    ctaPrimary: "Get in touch",
    ctaSecondary: "Learn more",
    sectionTitle: {
      servicios: "Services",
      "sobre-nosotros": "About us",
      casos: "Case studies",
      portfolio: "Portfolio",
      faq: "FAQ",
      blog: "Blog",
      catalogo: "Catalog",
    },
    cardTitle: (n) => `Item ${n}`,
    cardBody: "A short description of this item.",
    faqQuestion: (n) => `Frequently asked question ${n}`,
    faqAnswer: "A short, clear answer.",
    contactTitle: "Contact",
    contactName: "Name",
    contactEmail: "Email address",
    contactMessage: "Message",
    contactSubmit: "Send",
    footerText: "© Your business. All rights reserved.",
  },
};

export const APP_PREVIEW_STRINGS: Record<Locale, {
  brand: string;
  metricLabels: string[];
  tableTitle: string;
  tableHeaders: string[];
  filterAll: string;
  filterOpen: string;
  filterDone: string;
  statusOpen: string;
  statusInProgress: string;
  statusDone: string;
  rowName: (n: number) => string;
}> = {
  es: {
    brand: "Panel",
    metricLabels: ["Usuarios activos", "Registros hoy", "Pendientes"],
    tableTitle: "Registros recientes",
    tableHeaders: ["Nombre", "Estado", "Fecha"],
    filterAll: "Todos",
    filterOpen: "Abiertos",
    filterDone: "Resueltos",
    statusOpen: "Abierto",
    statusInProgress: "En curso",
    statusDone: "Resuelto",
    rowName: (n) => `Registro ${n}`,
  },
  en: {
    brand: "Panel",
    metricLabels: ["Active users", "Records today", "Pending"],
    tableTitle: "Recent records",
    tableHeaders: ["Name", "Status", "Date"],
    filterAll: "All",
    filterOpen: "Open",
    filterDone: "Done",
    statusOpen: "Open",
    statusInProgress: "In progress",
    statusDone: "Done",
    rowName: (n) => `Record ${n}`,
  },
};

export const AI_PREVIEW_STRINGS: Record<Locale, {
  inputLabel: string;
  inputValue: string;
  processingSteps: string[];
  responseTitle: string;
  responseBullets: string[];
  actions: string[];
  historyTitle: string;
  historyItems: string[];
}> = {
  es: {
    inputLabel: "Consulta de ejemplo",
    inputValue: "¿Cuántas incidencias hay abiertas esta semana?",
    processingSteps: ["Analizando la consulta", "Consultando los datos", "Generando la respuesta"],
    responseTitle: "Respuesta",
    responseBullets: [
      "3 incidencias abiertas, 1 marcada como urgente.",
      "El tiempo medio de resolución esta semana es de 2 días.",
      "El departamento con más incidencias es Operaciones.",
    ],
    actions: ["Crear informe", "Enviar resumen por email"],
    historyTitle: "Historial",
    historyItems: [
      "¿Qué empleados fichan hoy?",
      "Resume las tareas pendientes de esta semana.",
    ],
  },
  en: {
    inputLabel: "Example query",
    inputValue: "How many incidents are open this week?",
    processingSteps: ["Analyzing the query", "Looking up the data", "Generating the response"],
    responseTitle: "Response",
    responseBullets: [
      "3 open incidents, 1 flagged as urgent.",
      "Average resolution time this week is 2 days.",
      "Operations is the department with the most incidents.",
    ],
    actions: ["Create report", "Email summary"],
    historyTitle: "History",
    historyItems: [
      "Which employees are clocked in today?",
      "Summarize this week's pending tasks.",
    ],
  },
};
