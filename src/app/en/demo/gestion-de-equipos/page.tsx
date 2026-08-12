import type { Metadata } from "next";
import { DemoApp } from "@/components/demo/DemoApp";

const TITLE = "Employee and clock-in management demo";
const DESCRIPTION =
  "Try an interactive simulation of an internal application for managing employees, schedules, clock-ins, tasks and incidents.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/demo/gestion-de-equipos",
    languages: { es: "/demo/gestion-de-equipos", en: "/en/demo/gestion-de-equipos" },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${TITLE} | Raúl Romero`,
    description: DESCRIPTION,
    url: "/en/demo/gestion-de-equipos",
  },
};

export default function GestionDeEquiposDemoPage() {
  return <DemoApp locale="en" />;
}
