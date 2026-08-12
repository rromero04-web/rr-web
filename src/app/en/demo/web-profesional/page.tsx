import type { Metadata } from "next";
import { FisioNovaSite } from "@/components/demo/fisionova/FisioNovaSite";

const TITLE = "Professional website demo";
const DESCRIPTION =
  "Explore a professional website demo designed by Raúl Romero to build trust and make it easy for visitors to get in touch.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/demo/web-profesional",
    languages: { es: "/demo/web-profesional", en: "/en/demo/web-profesional" },
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: `${TITLE} | Raúl Romero`,
    description: DESCRIPTION,
    url: "/en/demo/web-profesional",
  },
};

export default function WebProfesionalDemoPage() {
  return <FisioNovaSite locale="en" />;
}
