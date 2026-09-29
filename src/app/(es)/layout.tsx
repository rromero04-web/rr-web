import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Manrope } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { IntroSplash } from "@/components/layout/IntroSplash";
import { INTRO_BOOT_SCRIPT } from "@/lib/intro";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Titulares en Space Grotesk (geométrica, con carácter); texto en Manrope.
const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://raulromero.es";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Raúl Romero | Webs y aplicaciones para negocios",
    template: "%s | Raúl Romero",
  },
  description:
    "Diseño y desarrollo webs y aplicaciones que ayudan a pequeñas empresas y profesionales a captar clientes, digitalizar procesos y crecer.",
  keywords: [
    "diseño web",
    "desarrollo web",
    "aplicaciones a medida",
    "digitalización de procesos",
    "webs para negocios",
    "Raúl Romero",
  ],
  authors: [{ name: "Raúl Romero" }],
  creator: "Raúl Romero",
  alternates: {
    canonical: "/",
    languages: {
      es: "/",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "Raúl Romero — Web & Growth",
    title: "Raúl Romero | Webs y aplicaciones para negocios",
    description:
      "Diseño y desarrollo webs y aplicaciones que ayudan a pequeñas empresas y profesionales a captar clientes, digitalizar procesos y crecer.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raúl Romero | Webs y aplicaciones para negocios",
    description:
      "Diseño y desarrollo webs y aplicaciones que ayudan a pequeñas empresas y profesionales a captar clientes, digitalizar procesos y crecer.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Raúl Romero — Web & Growth",
    url: siteUrl,
    email: "info@raulromero.es",
    telephone: "+34684772973",
    description:
      "Diseño y desarrollo de webs y aplicaciones a medida para pequeñas empresas, autónomos y profesionales.",
    founder: {
      "@type": "Person",
      name: "Raúl Romero",
    },
    areaServed: "ES",
    knowsAbout: [
      "Diseño web",
      "Desarrollo web",
      "Marketing digital",
      "Aplicaciones a medida",
      "Digitalización de procesos",
    ],
  };

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
      // El script de arranque del intro añade data-intro a <html> antes de
      // hidratar; sin esto React avisaría de un atributo no coincidente.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-cream text-navy">
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <IntroSplash />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
