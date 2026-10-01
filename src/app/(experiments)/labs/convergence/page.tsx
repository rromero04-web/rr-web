import type { Metadata } from "next";
import { ConvergenceExperience } from "@/components/labs/convergence/ConvergenceExperience";

export const metadata: Metadata = {
  title: "Convergence — Lab 001",
  description: "La atención se convierte en forma y la forma en comportamiento: una experiencia interactiva en WebGL sobre marketing, diseño y desarrollo. En español e inglés.",
  alternates: { canonical: "/labs/convergence" },
  openGraph: {
    title: "Convergence — Lab 001",
    description: "Lo interesante ocurre entre disciplinas. / The interesting part happens between disciplines.",
    locale: "es_ES",
    alternateLocale: ["en_US"],
    url: "/labs/convergence",
    type: "website",
    images: [{ url: "/labs/convergence/opengraph.png", width: 1200, height: 630, alt: "Convergence — Lab 001. Marketing brings attention, design gives it form, development makes it behave." }],
  },
  twitter: { card: "summary_large_image", images: ["/labs/convergence/opengraph.png"] },
};

export default function ConvergencePage() {
  return <ConvergenceExperience />;
}
