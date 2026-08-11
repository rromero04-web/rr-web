// Contenido íntegramente ficticio de "FisioNova", negocio de demostración.
// No corresponde a ninguna clínica real.

export const FISIONOVA_NAME = "FisioNova";
export const FISIONOVA_LOCATION = "Murcia";

export const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#tratamientos", label: "Tratamientos" },
  { href: "#clinica", label: "La clínica" },
  { href: "#faq", label: "Preguntas frecuentes" },
  { href: "#contacto", label: "Contacto" },
];

export const TRUST_SIGNALS = [
  { title: "Atención personalizada", description: "Cada sesión se adapta a tu evolución, no a un protocolo fijo." },
  { title: "Plan adaptado a cada paciente", description: "Valoramos tu caso antes de proponer cualquier tratamiento." },
  { title: "Seguimiento de la evolución", description: "Revisamos contigo el progreso en cada visita." },
  { title: "Cita previa", description: "Sin esperas: reservas tu franja horaria con antelación." },
];

export type Treatment = {
  id: string;
  title: string;
  summary: string;
  detail: string;
};

export const TREATMENTS: Treatment[] = [
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
];

export const HOW_IT_WORKS = [
  { title: "Primera valoración", description: "Hablamos de tu historia, tus molestias y tus objetivos antes de proponer nada." },
  { title: "Plan personalizado", description: "Diseñamos un plan de sesiones ajustado a tu caso, no una plantilla genérica." },
  { title: "Seguimiento y evolución", description: "Ajustamos el plan según cómo respondas, revisando contigo el progreso." },
];

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
};

export const TEAM: TeamMember[] = [
  { id: "laura", name: "Laura Medina", role: "Fisioterapia general", initials: "LM" },
  { id: "carlos", name: "Carlos Ríos", role: "Recuperación deportiva", initials: "CR" },
];

export const FAQ_ITEMS = [
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
];

export const CONSULTATION_REASONS = [
  "Primera valoración",
  "Dolor de espalda",
  "Lesión deportiva",
  "Seguimiento de tratamiento",
  "Otro motivo",
];

export const TIME_PREFERENCES = ["Mañana", "Mediodía", "Tarde", "Indiferente"];
