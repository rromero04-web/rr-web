import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./experiments.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://raulromero.es";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Convergence — Lab 001", template: "%s | Raúl Romero" },
  description: "An interactive study of attention, form and behavior becoming one living digital product.",
  robots: { index: true, follow: true },
};

export default function ExperimentsLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
