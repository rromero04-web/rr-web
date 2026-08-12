import type { Locale } from "@/lib/i18n/config";

export type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: Record<Locale, FaqItem[]> = {
  es: [
    {
      question: "¿Cuánto cuesta una web?",
      answer:
        "Depende del alcance: no es lo mismo una web informativa que una aplicación con reservas o gestión de clientes. Prefiero entender primero qué necesitas y darte un presupuesto ajustado a eso, en lugar de un precio cerrado que no refleje tu caso.",
    },
    {
      question: "¿Cuánto tarda un proyecto?",
      answer:
        "Una web profesional suele tardar unas semanas; una aplicación a medida, más, según su complejidad. Te doy una estimación realista antes de empezar y te mantengo informado del avance en cada fase.",
    },
    {
      question: "¿Trabajas con negocios de cualquier sector?",
      answer:
        "Sí. Lo importante no es el sector, sino entender bien el problema que quieres resolver. Si en algún caso creo que no puedo ayudarte de forma honesta, te lo diré desde el principio.",
    },
    {
      question: "¿Podré actualizar la web?",
      answer:
        "Sí. Diseño las webs para que puedas editar textos e imágenes sin depender de mí para cada cambio pequeño. Si prefieres que me encargue yo, también es una opción.",
    },
    {
      question: "¿Ofreces mantenimiento?",
      answer:
        "Sí, como servicio opcional: actualizaciones, pequeños cambios y resolución de incidencias. Lo definimos según lo que necesite tu proyecto una vez lanzado.",
    },
    {
      question: "¿También desarrollas aplicaciones internas?",
      answer:
        "Sí. Sistemas de reservas, paneles de gestión, herramientas de presupuestos u otros procesos internos que hoy hagas a mano o con hojas de cálculo.",
    },
    {
      question: "¿Cómo empezamos?",
      answer:
        "Rellena el formulario de contacto o escríbeme por correo contándome tu idea o problema. Te respondo con los siguientes pasos y una primera valoración, sin compromiso.",
    },
  ],
  en: [
    {
      question: "How much does a website cost?",
      answer:
        "It depends on scope: an informational website isn't the same as an application with bookings or client management. I prefer to understand what you actually need first and give you a quote that matches your case, rather than a fixed price that doesn't reflect it.",
    },
    {
      question: "How long does a project take?",
      answer:
        "A professional website usually takes a few weeks; a custom application takes longer, depending on complexity. I'll give you a realistic estimate before we start and keep you updated at every stage.",
    },
    {
      question: "Do you work with businesses in any industry?",
      answer:
        "Yes. What matters isn't the industry, but understanding the problem you want to solve. If I ever feel I can't help you honestly, I'll say so from the start.",
    },
    {
      question: "Will I be able to update the website myself?",
      answer:
        "Yes. I design websites so you can edit text and images without depending on me for every small change. If you'd rather I handle it, that's an option too.",
    },
    {
      question: "Do you offer maintenance?",
      answer:
        "Yes, as an optional service: updates, small changes and fixing issues. We define it based on what your project needs once it's live.",
    },
    {
      question: "Do you also build internal applications?",
      answer:
        "Yes. Booking systems, management dashboards, quoting tools or other internal processes you currently handle manually or with spreadsheets.",
    },
    {
      question: "How do we get started?",
      answer:
        "Fill in the contact form or email me telling me your idea or problem. I'll reply with the next steps and an initial assessment, with no commitment.",
    },
  ],
};

export function getFaqItems(locale: Locale): FaqItem[] {
  return FAQ_ITEMS[locale];
}
