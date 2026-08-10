export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
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
];
