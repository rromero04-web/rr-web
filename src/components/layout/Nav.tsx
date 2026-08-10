"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#proceso", label: "Proceso" },
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#contacto", label: "Contacto" },
];

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
    const goingDown = latest > lastScrollY.current;
    setHidden(goingDown && latest > 200);
    lastScrollY.current = latest;
  });

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.querySelector(link.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-line/70 bg-cream/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="container-page flex h-20 items-center justify-between py-4">
        <a
          href="#inicio"
          className="flex items-center gap-2.5 text-navy"
          aria-label="Raúl Romero — Web & Growth, inicio"
        >
          <Image
            src="/brand/logo-mark.png"
            alt=""
            width={700}
            height={588}
            priority
            className="h-8 w-auto shrink-0"
          />
          <span className="text-sm font-bold tracking-[0.14em] uppercase">
            Raúl Romero
          </span>
        </a>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium text-navy">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "relative py-1 transition-colors hover:text-cobalt",
                    activeSection === link.href && "text-cobalt"
                  )}
                >
                  {link.label}
                  {activeSection === link.href && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-cobalt"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#contacto"
          className="hidden items-center border border-navy bg-navy px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cobalt hover:border-cobalt md:inline-flex"
        >
          Cuéntame tu proyecto
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          className="inline-flex h-10 w-10 items-center justify-center border border-navy/20 text-navy md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-line/70 bg-cream md:hidden"
        >
          <nav aria-label="Navegación móvil" className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-line/60 py-3.5 text-base font-medium text-navy last:border-none"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={() => setMenuOpen(false)}
              className="mt-3 inline-flex items-center justify-center bg-navy px-5 py-3 text-sm font-semibold text-cream"
            >
              Cuéntame tu proyecto
            </a>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
