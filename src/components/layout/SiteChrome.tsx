"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";

// Las rutas /demo/* son una aplicación de demostración con su propio shell
// (aviso fijo, navegación lateral) y no deben llevar el nav/footer del sitio
// principal. Se decide aquí, en un único layout raíz, para no duplicar
// fuentes/metadata en un segundo root layout.
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDemo = pathname?.startsWith("/demo");

  if (isDemo) {
    return <>{children}</>;
  }

  return (
    <>
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
    </>
  );
}
