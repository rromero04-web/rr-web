export type Service = {
  slug: string;
  number: string;
  title: string;
  audience: string;
  problem: string;
  includes: string[];
  nextStep: string;
};

export const services: Service[] = [
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
  },
];
