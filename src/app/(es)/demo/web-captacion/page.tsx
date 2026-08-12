import type { Metadata } from "next";
import { BalanceSite } from "@/components/demo/balance/BalanceSite";

const TITLE = "Demo de web de captación";
const DESCRIPTION =
  "Explora una demostración de web de captación diseñada por Raúl Romero para convertir visitas en solicitudes comerciales.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/demo/web-captacion",
    languages: { es: "/demo/web-captacion", en: "/en/demo/web-captacion" },
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: `${TITLE} | Raúl Romero`,
    description: DESCRIPTION,
    url: "/demo/web-captacion",
  },
};

export default function WebCaptacionDemoPage() {
  return <BalanceSite locale="es" />;
}
