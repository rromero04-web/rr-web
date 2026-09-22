import type { Metadata } from "next";
import { ConvergenceExperience } from "@/components/labs/convergence/ConvergenceExperience";

export const metadata: Metadata = {
  title: "Convergence — Lab 001",
  description: "Attention becomes form. Form becomes behavior. Three disciplines converge into a living digital product.",
  alternates: { canonical: "/labs/convergence" },
  openGraph: {
    title: "Convergence — Lab 001",
    description: "The interesting part happens between disciplines.",
    url: "/labs/convergence",
    type: "website",
    images: [{ url: "/labs/convergence/opengraph.png", width: 1200, height: 630, alt: "Convergence — The interesting part happens between disciplines" }],
  },
  twitter: { card: "summary_large_image", images: ["/labs/convergence/opengraph.png"] },
};

export default function ConvergencePage() {
  return <ConvergenceExperience />;
}
