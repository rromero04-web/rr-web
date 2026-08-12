import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SITE_URL } from "@/lib/i18n/config";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Raúl Romero | Websites and applications for businesses",
    template: "%s | Raúl Romero",
  },
  description:
    "I design and build websites and applications that help small businesses and professionals attract customers, digitize processes and grow.",
  keywords: [
    "web design",
    "web development",
    "custom applications",
    "process automation",
    "websites for businesses",
    "Raúl Romero",
  ],
  authors: [{ name: "Raúl Romero" }],
  creator: "Raúl Romero",
  alternates: {
    canonical: "/en",
    languages: {
      es: "/",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/en`,
    siteName: "Raúl Romero — Web & Growth",
    title: "Raúl Romero | Websites and applications for businesses",
    description:
      "I design and build websites and applications that help small businesses and professionals attract customers, digitize processes and grow.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raúl Romero | Websites and applications for businesses",
    description:
      "I design and build websites and applications that help small businesses and professionals attract customers, digitize processes and grow.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Raúl Romero — Web & Growth",
    url: `${SITE_URL}/en`,
    email: "info@raulromero.es",
    telephone: "+34684772973",
    description:
      "Custom website and application design and development for small businesses, freelancers and professionals.",
    founder: {
      "@type": "Person",
      name: "Raúl Romero",
    },
    areaServed: "ES",
    knowsAbout: [
      "Web design",
      "Web development",
      "Digital marketing",
      "Custom applications",
      "Process automation",
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-navy">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
