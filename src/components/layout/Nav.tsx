"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const LINKS = {
  es: ["Qué hago", "Sobre mí", "Proceso", "Preguntas"],
  en: ["What I do", "About", "Process", "FAQ"],
};
const IDS = ["servicios", "sobre-mi", "proceso", "faq"];
const COPY = {
  es: { home: "Raúl Romero, inicio", cta: "Hablemos", contact: "Cuéntame tu proyecto", open: "Abrir menú", close: "Cerrar menú", nav: "Navegación principal", builder: "Configura tu proyecto" },
  en: { home: "Raúl Romero, home", cta: "Let's talk", contact: "Tell me about your project", open: "Open menu", close: "Close menu", nav: "Main navigation", builder: "Build your project" },
};

export function Nav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const home = localizePath("/", locale);
  const isHome = pathname === home;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const t = COPY[locale];
  const anchor = (id: string) => isHome ? "#" + id : home + "#" + id;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-30% 0px -60% 0px" });
    IDS.forEach((id) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, [isHome, pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") { setMenuOpen(false); toggleRef.current?.focus(); }
      if (event.key !== "Tab") return;
      const links = menuRef.current?.querySelectorAll<HTMLElement>("a, button");
      if (!links?.length) return;
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === toggleRef.current) { event.preventDefault(); last.focus(); }
      else if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); toggleRef.current?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggleRef.current?.focus(); }
      else if (!event.shiftKey && document.activeElement === toggleRef.current) { event.preventDefault(); links[0].focus(); }
    }
    const desktop = window.matchMedia("(min-width: 961px)");
    const onResize = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", onResize);
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", handleKey); desktop.removeEventListener("change", onResize); };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className={cn("rr-header", scrolled && "is-scrolled", menuOpen && "is-open")}>
      <div className="container-page rr-header-inner">
        <a href={anchor("inicio")} className="rr-brand" aria-label={t.home}>
          <Image src="/brand/logo-mark.png" alt="" width={700} height={588} sizes="34px" priority className="h-7 w-auto shrink-0" />
          <span>Raúl Romero</span>
        </a>
        <nav aria-label={t.nav} className="rr-nav">
          {IDS.map((id, index) => <a key={id} href={anchor(id)} aria-current={isHome && active === id ? "location" : undefined}>{LINKS[locale][index]}</a>)}
        </nav>
        <div className="rr-header-actions">
          <LanguageSwitcher locale={locale} />
          <a href={anchor("contacto")} className="rr-button">{t.cta}</a>
          <button ref={toggleRef} type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? t.close : t.open} className="rr-menu-toggle">
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {menuOpen && <div id="mobile-menu" ref={menuRef} className="rr-mobile-menu">
        <nav aria-label={t.nav} className="container-page">
          {IDS.map((id, index) => <a key={id} href={anchor(id)} onClick={close}>{LINKS[locale][index]}</a>)}
          <a href={anchor("contacto")} onClick={close} className="rr-button">{t.contact}</a>
          <Link href={localizePath("/configurador", locale)} onClick={close} className="rr-link">{t.builder}</Link>
        </nav>
      </div>}
    </header>
  );
}
