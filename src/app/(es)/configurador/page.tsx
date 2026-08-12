import type { Metadata } from "next";
import { ConfiguratorApp } from "@/components/configurator/ConfiguratorApp";

const TITLE = "Configurador de proyecto";
const DESCRIPTION =
  "Responde unas preguntas y mira en tiempo real cómo tomaría forma tu web o aplicación, con complejidad y plazo orientativos.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/configurador",
    languages: { es: "/configurador", en: "/en/project-builder" },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${TITLE} | Raúl Romero`,
    description: DESCRIPTION,
    url: "/configurador",
  },
};

export default function ConfiguradorPage() {
  return <ConfiguratorApp locale="es" />;
}
