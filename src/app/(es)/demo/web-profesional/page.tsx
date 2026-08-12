import type { Metadata } from "next";
import { FisioNovaSite } from "@/components/demo/fisionova/FisioNovaSite";

const TITLE = "Demo de web profesional";
const DESCRIPTION =
  "Explora una demostración de web profesional diseñada por Raúl Romero para transmitir confianza y facilitar el contacto.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/demo/web-profesional",
    languages: { es: "/demo/web-profesional", en: "/en/demo/web-profesional" },
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: `${TITLE} | Raúl Romero`,
    description: DESCRIPTION,
    url: "/demo/web-profesional",
  },
};

export default function WebProfesionalDemoPage() {
  return <FisioNovaSite locale="es" />;
}
