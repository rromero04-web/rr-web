import type { Metadata } from "next";
import { BalanceSite } from "@/components/demo/balance/BalanceSite";

const TITLE = "Lead-generation website demo";
const DESCRIPTION =
  "Explore a lead-generation website demo designed by Raúl Romero to turn visits into business inquiries.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/demo/web-captacion",
    languages: { es: "/demo/web-captacion", en: "/en/demo/web-captacion" },
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Raúl Romero — Web & Growth" }],
    title: `${TITLE} | Raúl Romero`,
    description: DESCRIPTION,
    url: "/en/demo/web-captacion",
  },
};

export default function WebCaptacionDemoPage() {
  return <BalanceSite locale="en" />;
}
