"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BalanceLogo } from "./BalanceLogo";
import { getNavLinks } from "./content";
import type { Locale } from "@/lib/i18n/config";

const STRINGS: Record<Locale, {
  homeAria: string;
  mainNavAria: string;
  mobileNavAria: string;
  openMenu: string;
  closeMenu: string;
  cta: string;
}> = {
  es: {
    homeAria: "Balance Asesores, inicio",
    mainNavAria: "Navegación principal",
    mobileNavAria: "Navegación móvil",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    cta: "Solicitar valoración",
  },
  en: {
    homeAria: "Balance Asesores, home",
    mainNavAria: "Main navigation",
    mobileNavAria: "Mobile navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    cta: "Request an assessment",
  },
};

export function BalanceHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = STRINGS[locale];
  const navLinks = getNavLinks(locale);

  return (
    <header className="sticky top-0 z-30 border-b border-[#CFE0D3] bg-[#F5F7F2]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#hero" aria-label={t.homeAria}>
          <BalanceLogo />
        </a>

        <nav aria-label={t.mainNavAria} className="hidden md:block">
          <ul className="flex items-center gap-7 text-base text-[#14213D]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-[#1F6F4A]">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#valoracion"
          className="hidden min-h-11 items-center rounded-md bg-[#1F6F4A] px-5 text-base font-semibold text-white transition-colors hover:bg-[#185A3C] md:inline-flex"
        >
          {t.cta}
        </a>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="balance-mobile-menu"
          aria-label={open ? t.closeMenu : t.openMenu}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#14213D]/15 text-[#14213D] md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div id="balance-mobile-menu" className="border-t border-[#CFE0D3] bg-[#F5F7F2] md:hidden">
          <nav aria-label={t.mobileNavAria} className="flex flex-col gap-1 px-5 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-[#CFE0D3] py-3.5 text-lg text-[#14213D] last:border-none"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#valoracion"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex min-h-12 items-center justify-center rounded-md bg-[#1F6F4A] px-5 text-base font-semibold text-white"
            >
              {t.cta}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
