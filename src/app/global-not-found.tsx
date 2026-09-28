import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "Página no encontrada | Raúl Romero",
  description: "La página que buscas no existe.",
};

// No sabemos en qué idioma llegó el visitante, así que la página es
// bilingüe: español primero (idioma principal del sitio) e inglés debajo.
export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${instrumentSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <div className="rr-site flex min-h-screen flex-col">
          <header className="container-page flex h-[72px] items-center">
            <Link href="/" className="rr-brand">
              <Image src="/brand/logo-mark.png" alt="" width={700} height={588} className="h-7 w-auto" />
              <span>Raúl Romero</span>
            </Link>
          </header>
          <main className="container-page flex flex-1 flex-col justify-center py-24">
            <h1 className="rr-display rr-legal-title">Esta página no existe.</h1>
            <p className="mt-6 max-w-[34em] text-slate">
              Puede que el enlace esté mal escrito o que la página se haya movido.
            </p>
            <p className="mt-2 max-w-[34em] text-slate" lang="en">
              This page doesn&apos;t exist. The link may be mistyped or the page may have moved.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/" className="rr-button">Volver al inicio</Link>
              <Link href="/en" className="rr-link" lang="en">Go to the English site</Link>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
