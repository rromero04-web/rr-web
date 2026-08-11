"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BalanceLogo } from "./BalanceLogo";
import { NAV_LINKS } from "./content";

export function BalanceHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[#16233A]/10 bg-[#F6F4EF]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#hero" aria-label="Balance Asesores, inicio">
          <BalanceLogo />
        </a>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm font-medium text-[#16233A]">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-[#2F8F5B]">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#valoracion"
          className="hidden items-center bg-[#2F8F5B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#26744A] md:inline-flex"
        >
          Solicitar valoración
        </a>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="balance-mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="inline-flex h-10 w-10 items-center justify-center border border-[#16233A]/15 text-[#16233A] md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div id="balance-mobile-menu" className="border-t border-[#16233A]/10 bg-[#F6F4EF] md:hidden">
          <nav aria-label="Navegación móvil" className="flex flex-col gap-1 px-5 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-[#16233A]/10 py-3 text-base font-medium text-[#16233A] last:border-none"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#valoracion"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center bg-[#2F8F5B] px-5 py-3 text-sm font-semibold text-white"
            >
              Solicitar valoración
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
