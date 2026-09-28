"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { FisioNovaLogo } from "./FisioNovaLogo";
import { getNavLinks } from "./content";

const STRINGS: Record<Locale, {
  logoAria: string;
  navAria: string;
  mobileNavAria: string;
  requestAppointment: string;
  openMenu: string;
  closeMenu: string;
}> = {
  es: {
    logoAria: "FisioNova, inicio",
    navAria: "Navegación principal",
    mobileNavAria: "Navegación móvil",
    requestAppointment: "Solicitar cita",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  en: {
    logoAria: "FisioNova, home",
    navAria: "Main navigation",
    mobileNavAria: "Mobile navigation",
    requestAppointment: "Book an appointment",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
};

export function FisioNovaHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = STRINGS[locale];
  const navLinks = getNavLinks(locale);

  return (
    <header className="sticky top-0 z-30 border-b border-[#D6E2DD] bg-[#FBFCFA]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#inicio" aria-label={t.logoAria}>
          <FisioNovaLogo />
        </a>

        <nav aria-label={t.navAria} className="hidden md:block">
          <ul className="flex items-center gap-7 text-base text-[#0F4C45]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-[#1C7F9C]">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#contacto"
          className="hidden min-h-11 items-center rounded-full bg-[#0F4C45] px-6 text-base font-semibold text-white transition-colors hover:bg-[#0A3A34] md:inline-flex"
        >
          {t.requestAppointment}
        </a>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="fisionova-mobile-menu"
          aria-label={open ? t.closeMenu : t.openMenu}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D6E2DD] text-[#0F4C45] md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div id="fisionova-mobile-menu" className="border-t border-[#D6E2DD] bg-[#FBFCFA] md:hidden">
          <nav aria-label={t.mobileNavAria} className="flex flex-col gap-1 px-5 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-[#D6E2DD] py-3.5 text-lg text-[#0F4C45] last:border-none"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0F4C45] px-6 text-base font-semibold text-white"
            >
              {t.requestAppointment}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
