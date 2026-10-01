import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./experiments.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["italic"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://raulromero.es";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Convergence — Lab 001", template: "%s | Raúl Romero" },
  description: "Un estudio interactivo sobre atención, forma y comportamiento convertidos en un producto digital vivo.",
  robots: { index: true, follow: true },
};

export default function ExperimentsLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
