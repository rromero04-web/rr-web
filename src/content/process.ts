import type { Locale } from "@/lib/i18n/config";

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

const PROCESS_STEPS: Record<Locale, ProcessStep[]> = {
  es: [
    {
      number: "01",
      title: "Entender el negocio",
      description: "Hablamos de qué haces, quiénes son tus clientes y qué problema concreto quieres resolver. Sin esto, cualquier diseño es solo decoración.",
    },
    {
      number: "02",
      title: "Definir la solución",
      description: "Traduzco esa conversación en una propuesta concreta: qué construir, con qué alcance y qué resultado puedes esperar.",
    },
    {
      number: "03",
      title: "Diseñar la experiencia",
      description: "Diseño la estructura y la interfaz pensando primero en cómo la va a usar tu cliente, no en lo que queda más vistoso.",
    },
    {
      number: "04",
      title: "Construir y validar",
      description: "Desarrollo la web o aplicación por fases, para que puedas ver avances reales y dar feedback antes de que esté todo cerrado.",
    },
    {
      number: "05",
      title: "Lanzar y mejorar",
      description: "Publicamos, revisamos que todo funcione en condiciones reales y dejamos definido cómo seguir mejorando con el tiempo.",
    },
  ],
  en: [
    {
      number: "01",
      title: "Understand the business",
      description: "We talk about what you do, who your customers are and the specific problem you want to solve. Without this, any design is just decoration.",
    },
    {
      number: "02",
      title: "Define the solution",
      description: "I turn that conversation into a concrete proposal: what to build, what scope it covers and what result you can expect.",
    },
    {
      number: "03",
      title: "Design the experience",
      description: "I design the structure and interface thinking first about how your customer will use it, not what looks flashiest.",
    },
    {
      number: "04",
      title: "Build and validate",
      description: "I develop the website or application in stages, so you can see real progress and give feedback before anything is locked in.",
    },
    {
      number: "05",
      title: "Launch and improve",
      description: "We launch, check that everything works under real conditions, and set out how to keep improving over time.",
    },
  ],
};

export function getProcessSteps(locale: Locale): ProcessStep[] {
  return PROCESS_STEPS[locale];
}
