import type { Metadata } from "next";
import { LabsIndex } from "@/components/labs/LabsIndex";

export const metadata: Metadata = {
  title: "Labs — Experimentos digitales",
  description: "Experimentos interactivos de estrategia, diseño y tecnología de Raúl Romero.",
  alternates: { canonical: "/labs" },
  openGraph: {
    title: "Labs — Raúl Romero",
    description: "Experimentos interactivos de estrategia, diseño y tecnología.",
    url: "/labs",
  },
};

export default function LabsPage() {
  return <LabsIndex />;
}
