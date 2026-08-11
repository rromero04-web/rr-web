"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { FisioNovaLogo } from "./FisioNovaLogo";
import { NAV_LINKS } from "./content";

export function FisioNovaHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[#E4DFD3] bg-[#FAF9F5]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#inicio" aria-label={`${"FisioNova"}, inicio`}>
          <FisioNovaLogo />
        </a>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm font-medium text-[#123832]">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-[#0E6E64]">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#contacto"
          className="hidden items-center bg-[#0E6E64] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B4F49] md:inline-flex"
        >
          Solicitar cita
        </a>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="fisionova-mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="inline-flex h-10 w-10 items-center justify-center border border-[#E4DFD3] text-[#123832] md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div id="fisionova-mobile-menu" className="border-t border-[#E4DFD3] bg-[#FAF9F5] md:hidden">
          <nav aria-label="Navegación móvil" className="flex flex-col gap-1 px-5 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-[#E4DFD3] py-3 text-base font-medium text-[#123832] last:border-none"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center bg-[#0E6E64] px-5 py-3 text-sm font-semibold text-white"
            >
              Solicitar cita
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
