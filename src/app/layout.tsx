import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://raulromero.es";

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-navy">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#inicio"
          className="fixed left-3 top-3 z-[100] -translate-y-20 border border-cobalt bg-cream px-4 py-2 text-sm font-semibold text-navy transition-transform focus:translate-y-0"
        >
          Saltar al contenido principal
        </a>
        <ScrollProgressBar />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
