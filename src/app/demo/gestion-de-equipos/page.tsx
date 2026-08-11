import type { Metadata } from "next";
import { DemoApp } from "@/components/demo/DemoApp";

const TITLE = "Demo de gestión de empleados y fichajes";
const DESCRIPTION =
  "Prueba una simulación interactiva de una aplicación interna para gestionar empleados, horarios, fichajes, tareas e incidencias.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/demo/gestion-de-equipos",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${TITLE} | Raúl Romero`,
    description: DESCRIPTION,
    url: "/demo/gestion-de-equipos",
  },
};

export default function GestionDeEquiposDemoPage() {
  return <DemoApp />;
}
