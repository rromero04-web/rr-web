export type Project = {
  slug: string;
  name: string;
  sector: string;
  problem: string;
  solution: string;
  tech: string[];
  result: string;
  image: string;
  conceptual: true;
};

// Contenido provisional. Ningún cliente, cifra o resultado aquí es real:
// son proyectos conceptuales para ilustrar el tipo de trabajo, y se
// sustituirán por casos reales (desde Supabase o este mismo archivo)
// a medida que existan.
export const projects: Project[] = [
  {
    slug: "reservas-clinica-dental",
    name: "Sistema de reservas para clínica dental",
    sector: "Salud",
    problem: "Las citas se gestionaban por teléfono y WhatsApp, con solapes y huecos sin cubrir.",
    solution: "Panel de reservas online con disponibilidad en tiempo real y recordatorios automáticos por email.",
    tech: ["Next.js", "Supabase", "TypeScript"],
    result: "Reducción del tiempo administrativo dedicado a gestionar citas.",
    image: "/projects/reservas-clinica-dental.jpg",
    conceptual: true,
  },
  {
    slug: "web-captacion-asesoria",
    name: "Web de captación para asesoría fiscal",
    sector: "Servicios profesionales",
    problem: "La web existente no generaba consultas: no explicaba servicios ni facilitaba el contacto.",
    solution: "Rediseño centrado en los problemas del cliente tipo, con formulario de valoración inicial.",
    tech: ["Next.js", "Tailwind CSS", "Zod"],
    result: "Un flujo de contacto claro pensado para convertir visitas en consultas.",
    image: "/projects/web-captacion-asesoria.jpg",
    conceptual: true,
  },
  {
    slug: "panel-presupuestos-reformas",
    name: "Panel de presupuestos para empresa de reformas",
    sector: "Construcción y reformas",
    problem: "Cada presupuesto se armaba a mano en documentos distintos, sin control de versiones.",
    solution: "Herramienta interna para crear, editar y enviar presupuestos con una plantilla consistente.",
    tech: ["Next.js", "Supabase", "React"],
    result: "Un proceso de presupuestos estandarizado y más rápido de preparar.",
    image: "/projects/panel-presupuestos-reformas.jpg",
    conceptual: true,
  },
];
