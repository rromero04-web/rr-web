import type { Metadata } from "next";
import { ConfiguratorApp } from "@/components/configurator/ConfiguratorApp";

const TITLE = "Project builder";
const DESCRIPTION =
  "Answer a few questions and watch your website or application take shape in real time, with a ballpark complexity and timeline.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/project-builder",
    languages: { es: "/configurador", en: "/en/project-builder" },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${TITLE} | Raúl Romero`,
    description: DESCRIPTION,
    url: "/en/project-builder",
  },
};

export default function ProjectBuilderPage() {
  return <ConfiguratorApp locale="en" />;
}
