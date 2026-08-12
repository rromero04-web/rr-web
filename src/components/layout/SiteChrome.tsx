"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { getLocaleFromPathname } from "@/lib/i18n/config";

const SKIP_LINK_TEXT = { es: "Saltar al contenido principal", en: "Skip to main content" };

// Las rutas /demo/* (y /en/demo/*) son una aplicación de demostración con su
// propio shell (aviso fijo, navegación lateral) y no deben llevar el
// nav/footer del sitio principal.
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const locale = getLocaleFromPathname(pathname);
  const isDemo = /^\/(en\/)?demo(\/|$)/.test(pathname);

  if (isDemo) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#inicio"
        className="fixed left-3 top-3 z-[100] -translate-y-20 border border-cobalt bg-cream px-4 py-2 text-sm font-semibold text-navy transition-transform focus:translate-y-0"
      >
        {SKIP_LINK_TEXT[locale]}
      </a>
      <ScrollProgressBar />
      <Nav locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
