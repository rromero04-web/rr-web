"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { SolutionShowcase } from "@/components/ui/SolutionShowcase";
import { AmbientDepth } from "@/components/ui/AmbientDepth";
import { Magnetic } from "@/components/ui/Magnetic";
import { localizePath, type Locale } from "@/lib/i18n/config";

const COPY = {
  es: {
    eyebrow: "Marketing + Diseño + Desarrollo",
    title: "Webs y aplicaciones que hacen avanzar",
    accent: "tu negocio.",
    description: "Combino estrategia, diseño y desarrollo para crear soluciones digitales que captan clientes, simplifican procesos y ayudan a crecer.",
    contact: "Cuéntame tu proyecto", demos: "Probar las demos", builder: "Configura tu proyecto",
    signature: "Raúl Romero · Web & Growth",
    notes: ["Diseño con intención", "Tecnología que resuelve", "Trato directo, de principio a fin"],
    scroll: "Descubre lo que podemos crear",
  },
  en: {
    eyebrow: "Marketing + Design + Development",
    title: "Websites and applications that move",
    accent: "your business forward.",
    description: "I combine strategy, design and development to create digital solutions that attract customers, simplify processes and support business growth.",
    contact: "Tell me about your project", demos: "View live demos", builder: "Build your project",
    signature: "Raúl Romero · Web & Growth",
    notes: ["Purposeful design", "Technology that solves problems", "Direct collaboration, start to finish"],
    scroll: "Discover what we can create",
  },
};

export function Hero({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  // Profundidad cinematográfica sutil: al hacer scroll, la vista del
  // showcase se desplaza y escala ligeramente más despacio que el resto
  // (parallax), como si tuviera su propio plano en el espacio.
  const showcaseY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const showcaseScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 30]);

  return (
    <section id="inicio" ref={sectionRef} className="studio-hero studio-depth-perspective relative">
      <AmbientDepth tone="light" />
      <div className="container-page relative z-10">
        <div className="studio-hero-grid">
          <motion.div style={{ y: contentY }} className="min-w-0 motion-reduce:!transform-none">
            <p className="studio-eyebrow"><span className="studio-status-dot" />{t.eyebrow}</p>
            <h1 className="studio-hero-title">{t.title} <span>{t.accent}</span></h1>
            <p className="studio-hero-description">{t.description}</p>
            <div className="studio-hero-actions">
              <Magnetic>
                <a href="#contacto" className="studio-button studio-button-primary">{t.contact}<ArrowUpRight size={18} aria-hidden="true" /></a>
              </Magnetic>
              <a href="#servicios" className="studio-button studio-button-outline">{t.demos}<ArrowDown size={16} aria-hidden="true" /></a>
            </div>
            <Link href={localizePath("/configurador", locale)} className="studio-builder-link">
              <SlidersHorizontal size={16} aria-hidden="true" />{t.builder}<ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </motion.div>
          <motion.div style={{ y: showcaseY, scale: showcaseScale }} className="studio-hero-parallax motion-reduce:!transform-none">
            <SolutionShowcase locale={locale} />
          </motion.div>
        </div>
        <div className="studio-hero-foot">
          <span className="studio-hero-signature">{t.signature}</span>
          <div className="studio-hero-notes">{t.notes.map((note) => <span key={note}>{note}</span>)}</div>
          <a href="#servicios" aria-label={t.scroll} className="studio-scroll-link"><ArrowDown size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
