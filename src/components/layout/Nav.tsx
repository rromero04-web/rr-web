"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Magnetic } from "@/components/ui/Magnetic";

const LINKS = {
  es: ["Servicios", "Proyectos", "Proceso", "Sobre mí"],
  en: ["Services", "Projects", "Process", "About"],
};
const IDS = ["servicios", "proyectos", "proceso", "sobre-mi"];
const COPY = {
  es: { home: "Raúl Romero — Inicio", cta: "Hablemos", contact: "Cuéntame tu proyecto", open: "Abrir menú", close: "Cerrar menú", nav: "Navegación principal", builder: "Configura tu proyecto", intro: "Tu siguiente paso empieza con una conversación." },
  en: { home: "Raúl Romero — Home", cta: "Let's talk", contact: "Tell me about your project", open: "Open menu", close: "Close menu", nav: "Main navigation", builder: "Build your project", intro: "Your next step starts with a conversation." },
};

export function Nav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const home = localizePath("/", locale);
  const isHome = pathname === home;
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const t = COPY[locale];
  const anchor = (id: string) => isHome ? "#" + id : home + "#" + id;

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-20% 0px -55% 0px" });
    IDS.forEach((id) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, [isHome, pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLAnchorElement>("a");
    first?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") { setMenuOpen(false); toggleRef.current?.focus(); }
      if (event.key !== "Tab") return;
      const links = menuRef.current?.querySelectorAll<HTMLElement>('a, button');
      if (!links?.length) return;
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === toggleRef.current) { event.preventDefault(); last.focus(); }
      else if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); toggleRef.current?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggleRef.current?.focus(); }
      else if (!event.shiftKey && document.activeElement === toggleRef.current) { event.preventDefault(); links[0].focus(); }
    }
    const desktop = window.matchMedia("(min-width: 1100px)");
    const onResize = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", onResize);
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", handleKey); desktop.removeEventListener("change", onResize); };
  }, [menuOpen]);

  return (
    <header className="studio-header">
      <div className="container-page studio-header-inner">
        <a href={anchor("inicio")} className="studio-brand" aria-label={t.home}>
          <Image src="/brand/logo-mark.png" alt="" width={700} height={588} sizes="38px" priority className="h-8 w-auto shrink-0" />
          <span><strong>Raúl Romero</strong><small>WEB & GROWTH</small></span>
        </a>
        <nav aria-label={t.nav} className="studio-desktop-nav">
          {IDS.map((id, index) => <a key={id} href={anchor(id)} aria-current={isHome && active === id ? "location" : undefined} className={cn(isHome && active === id && "is-active")}>{LINKS[locale][index]}</a>)}
        </nav>
        <div className="studio-header-actions">
          <div className="studio-header-languages"><LanguageSwitcher locale={locale} /></div>
          <Magnetic strength={0.25}>
            <a href={anchor("contacto")} className="studio-header-cta">{t.cta}<ArrowUpRight size={16} aria-hidden="true" /></a>
          </Magnetic>
          <button ref={toggleRef} type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? t.close : t.open} className="studio-menu-toggle">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </div>
      {menuOpen && <div id="mobile-menu" ref={menuRef} className="studio-mobile-menu">
        <nav aria-label={t.nav} className="container-page">
          {IDS.map((id, index) => <a key={id} href={anchor(id)} onClick={() => setMenuOpen(false)} className="studio-mobile-link"><span>0{index + 1}</span>{LINKS[locale][index]}<ArrowUpRight size={21} aria-hidden="true" /></a>)}
          <a href={anchor("contacto")} onClick={() => setMenuOpen(false)} className="studio-button studio-button-primary">{t.contact}<ArrowUpRight size={18} aria-hidden="true" /></a>
          <a href={localizePath("/configurador", locale)} onClick={() => setMenuOpen(false)} className="studio-mobile-builder">{t.builder}<ArrowUpRight size={16} aria-hidden="true" /></a>
          <p className="studio-mobile-note">{t.intro}</p>
        </nav>
      </div>}
    </header>
  );
}
