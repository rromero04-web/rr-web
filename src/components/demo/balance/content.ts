// Contenido íntegramente ficticio de "Balance Asesores", negocio de
// demostración. No corresponde a ninguna asesoría real.

export const BALANCE_NAME = "Balance Asesores";

export const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#para-quien", label: "Para quién" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#faq", label: "Preguntas frecuentes" },
];

export const SITUATIONS = [
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
] as const;

export type SituationId = (typeof SITUATIONS)[number]["id"];

export const PROBLEMS = [
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
];

export const SERVICES = [
  { title: "Alta y gestión de autónomos", description: "Trámites de inicio de actividad y gestión continuada." },
  { title: "Fiscalidad y contabilidad", description: "Cumplimiento fiscal y contable adaptado a tu actividad." },
  { title: "Presentación de impuestos", description: "Preparación y presentación de los modelos que te correspondan." },
  { title: "Gestión documental", description: "Un canal único para centralizar tu documentación." },
  { title: "Consultas y seguimiento", description: "Resolución de dudas puntuales y seguimiento continuo." },
];

export const BEFORE_ITEMS = [
  "Documentos por distintos canales",
  "Dudas sin seguimiento",
  "Fechas dispersas",
  "Poca visibilidad",
];

export const AFTER_ITEMS = [
  "Canal de comunicación claro",
  "Documentación organizada",
  "Próximas obligaciones visibles",
  "Seguimiento de consultas",
];

export const PROCESS_STEPS = [
  { title: "Cuéntanos tu situación", description: "Nos explicas tu caso a través del formulario de valoración." },
  { title: "Revisamos la información inicial", description: "Analizamos tu situación fiscal y tus necesidades reales." },
  { title: "Recibes una propuesta adaptada", description: "Te proponemos cómo podríamos ayudarte, sin compromiso." },
  { title: "Comienza la colaboración", description: "Si decides seguir adelante, empezamos a trabajar juntos." },
];

export const FAQ_ITEMS = [
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
];

export const NEED_OPTIONS = [
  "Gestión fiscal recurrente",
  "Contabilidad",
  "Cambio de asesoría",
  "Alta de actividad",
  "Otra necesidad",
];

export const CONTACT_PREFERENCES = ["Correo electrónico", "Teléfono", "Indiferente"];
