// Contenido íntegramente ficticio de "FisioNova", negocio de demostración.
// No corresponde a ninguna clínica real.
// Fully fictional content for "FisioNova", a demo business.
// Does not correspond to any real clinic.

import type { Locale } from "@/lib/i18n/config";

export const FISIONOVA_NAME = "FisioNova";
export const FISIONOVA_LOCATION = "Murcia";

export type NavLink = { href: string; label: string };

const NAV_LINKS: Record<Locale, NavLink[]> = {
  es: [
    { href: "#inicio", label: "Inicio" },
    { href: "#tratamientos", label: "Tratamientos" },
    { href: "#clinica", label: "La clínica" },
    { href: "#faq", label: "Preguntas frecuentes" },
    { href: "#contacto", label: "Contacto" },
  ],
  en: [
    { href: "#inicio", label: "Home" },
    { href: "#tratamientos", label: "Treatments" },
    { href: "#clinica", label: "The clinic" },
    { href: "#faq", label: "FAQ" },
    { href: "#contacto", label: "Contact" },
  ],
};

export function getNavLinks(locale: Locale): NavLink[] {
  return NAV_LINKS[locale];
}

export type TrustSignal = { title: string; description: string };

const TRUST_SIGNALS: Record<Locale, TrustSignal[]> = {
  es: [
    { title: "Atención personalizada", description: "Cada sesión se adapta a tu evolución, no a un protocolo fijo." },
    { title: "Plan adaptado a cada paciente", description: "Valoramos tu caso antes de proponer cualquier tratamiento." },
    { title: "Seguimiento de la evolución", description: "Revisamos contigo el progreso en cada visita." },
    { title: "Cita previa", description: "Sin esperas: reservas tu franja horaria con antelación." },
  ],
  en: [
    { title: "Personalized care", description: "Each session adapts to your progress, not a fixed protocol." },
    { title: "A plan tailored to each patient", description: "We assess your case before proposing any treatment." },
    { title: "Progress tracking", description: "We review your progress together at every visit." },
    { title: "Appointment booking", description: "No waiting: you book your own time slot in advance." },
  ],
};

export function getTrustSignals(locale: Locale): TrustSignal[] {
  return TRUST_SIGNALS[locale];
}

export type Treatment = {
  id: string;
  title: string;
  summary: string;
  detail: string;
};

const TREATMENTS: Record<Locale, Treatment[]> = {
  es: [
    {
      id: "deportiva",
      title: "Fisioterapia deportiva",
      summary: "Prevención y recuperación para quienes entrenan de forma habitual.",
      detail:
        "Trabajamos la readaptación tras una lesión deportiva y el acondicionamiento para reducir el riesgo de recaída, adaptando la carga a tu nivel y disciplina.",
    },
    {
      id: "espalda",
      title: "Dolor de espalda",
      summary: "Abordaje del dolor cervical, dorsal y lumbar en su origen.",
      detail:
        "Valoramos postura, movilidad y hábitos diarios para plantear un plan que no se limite a aliviar el síntoma, sino a entender por qué aparece.",
    },
    {
      id: "lesiones",
      title: "Recuperación de lesiones",
      summary: "Acompañamiento tras esguinces, roturas o intervenciones.",
      detail:
        "Diseñamos una progresión de ejercicios y técnicas manuales acorde a cada fase de recuperación, en coordinación con las indicaciones de tu médico.",
    },
    {
      id: "movilidad",
      title: "Movilidad y prevención",
      summary: "Mantenimiento articular y muscular para el día a día.",
      detail:
        "Sesiones orientadas a mejorar rango de movimiento y prevenir molestias antes de que se conviertan en un problema recurrente.",
    },
  ],
  en: [
    {
      id: "deportiva",
      title: "Sports physiotherapy",
      summary: "Prevention and recovery for people who train regularly.",
      detail:
        "We work on rehabilitation after a sports injury and conditioning to reduce the risk of relapse, adapting the workload to your level and discipline.",
    },
    {
      id: "espalda",
      title: "Back pain",
      summary: "Addressing neck, mid-back and lower-back pain at its root.",
      detail:
        "We assess posture, mobility and daily habits to put together a plan that doesn't just ease the symptom, but helps understand why it appears.",
    },
    {
      id: "lesiones",
      title: "Injury recovery",
      summary: "Support after sprains, fractures or surgical procedures.",
      detail:
        "We design a progression of exercises and manual techniques suited to each recovery phase, in coordination with your doctor's guidance.",
    },
    {
      id: "movilidad",
      title: "Mobility and prevention",
      summary: "Joint and muscle maintenance for everyday life.",
      detail:
        "Sessions focused on improving range of motion and preventing discomfort before it becomes a recurring problem.",
    },
  ],
};

export function getTreatments(locale: Locale): Treatment[] {
  return TREATMENTS[locale];
}

export type HowItWorksStep = { title: string; description: string };

const HOW_IT_WORKS: Record<Locale, HowItWorksStep[]> = {
  es: [
    { title: "Primera valoración", description: "Hablamos de tu historia, tus molestias y tus objetivos antes de proponer nada." },
    { title: "Plan personalizado", description: "Diseñamos un plan de sesiones ajustado a tu caso, no una plantilla genérica." },
    { title: "Seguimiento y evolución", description: "Ajustamos el plan según cómo respondas, revisando contigo el progreso." },
  ],
  en: [
    { title: "First assessment", description: "We talk about your history, your symptoms and your goals before proposing anything." },
    { title: "Personalized plan", description: "We design a session plan tailored to your case, not a generic template." },
    { title: "Tracking and progress", description: "We adjust the plan based on how you respond, reviewing your progress together." },
  ],
};

export function getHowItWorks(locale: Locale): HowItWorksStep[] {
  return HOW_IT_WORKS[locale];
}

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
};

const TEAM: Record<Locale, TeamMember[]> = {
  es: [
    { id: "laura", name: "Laura Medina", role: "Fisioterapia general", initials: "LM" },
    { id: "carlos", name: "Carlos Ríos", role: "Recuperación deportiva", initials: "CR" },
  ],
  en: [
    { id: "laura", name: "Laura Medina", role: "General physiotherapy", initials: "LM" },
    { id: "carlos", name: "Carlos Ríos", role: "Sports recovery", initials: "CR" },
  ],
};

export function getTeam(locale: Locale): TeamMember[] {
  return TEAM[locale];
}

export type FaqItem = { question: string; answer: string };

const FAQ_ITEMS: Record<Locale, FaqItem[]> = {
  es: [
    {
      question: "¿Necesito diagnóstico médico?",
      answer:
        "No es imprescindible para la primera valoración, aunque si ya dispones de un informe médico nos ayuda a orientar mejor el plan de tratamiento.",
    },
    {
      question: "¿Cuánto dura una sesión?",
      answer:
        "Habitualmente entre 45 y 60 minutos, según el tratamiento y la fase de recuperación en la que te encuentres.",
    },
    {
      question: "¿Qué debo llevar?",
      answer:
        "Ropa cómoda que permita moverte con libertad y, si los tienes, los informes médicos o pruebas relacionadas con tu consulta.",
    },
    {
      question: "¿Cómo solicito una cita?",
      answer:
        "A través del formulario de contacto de esta página, indicando tu disponibilidad horaria y el motivo de la consulta.",
    },
    {
      question: "¿Trabajáis con lesiones deportivas?",
      answer:
        "Sí, es una de nuestras áreas principales, tanto en fase aguda como en la readaptación posterior para volver a entrenar con seguridad.",
    },
  ],
  en: [
    {
      question: "Do I need a medical diagnosis?",
      answer:
        "It isn't essential for the first assessment, though if you already have a medical report it helps us better tailor the treatment plan.",
    },
    {
      question: "How long does a session last?",
      answer:
        "Usually between 45 and 60 minutes, depending on the treatment and the recovery phase you're in.",
    },
    {
      question: "What should I bring?",
      answer:
        "Comfortable clothing that lets you move freely and, if you have them, any medical reports or tests related to your consultation.",
    },
    {
      question: "How do I request an appointment?",
      answer:
        "Through the contact form on this page, letting us know your availability and the reason for your consultation.",
    },
    {
      question: "Do you treat sports injuries?",
      answer:
        "Yes, it's one of our main areas, both in the acute phase and in the later rehabilitation to get you back to training safely.",
    },
  ],
};

export function getFaqItems(locale: Locale): FaqItem[] {
  return FAQ_ITEMS[locale];
}

const CONSULTATION_REASONS: Record<Locale, string[]> = {
  es: ["Primera valoración", "Dolor de espalda", "Lesión deportiva", "Seguimiento de tratamiento", "Otro motivo"],
  en: ["First assessment", "Back pain", "Sports injury", "Treatment follow-up", "Other reason"],
};

export function getConsultationReasons(locale: Locale): string[] {
  return CONSULTATION_REASONS[locale];
}

const TIME_PREFERENCES: Record<Locale, string[]> = {
  es: ["Mañana", "Mediodía", "Tarde", "Indiferente"],
  en: ["Morning", "Midday", "Afternoon", "No preference"],
};

export function getTimePreferences(locale: Locale): string[] {
  return TIME_PREFERENCES[locale];
}
