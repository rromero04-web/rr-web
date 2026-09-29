"use client";

import type { MouseEvent } from "react";

// Atajos del hero a cada tarjeta de servicio. El ancla nativa alinearía la
// tarjeta arriba; aquí se desplaza hasta dejarla centrada en la pantalla.
export function HeroServiceLinks({ label, links }: { label: string; links: { id: string; title: string }[] }) {
  function goTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    // Centro de la zona visible bajo la cabecera fija (scrollIntoView con
    // block: "center" aplicaría el scroll-padding-top y quedaría más abajo).
    const header = document.querySelector<HTMLElement>(".rr-header")?.offsetHeight ?? 0;
    const rect = target.getBoundingClientRect();
    const visibleCenter = header + (window.innerHeight - header) / 2;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: window.scrollY + rect.top + rect.height / 2 - visibleCenter,
      behavior: reduced ? "auto" : "smooth",
    });
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav aria-label={label} className="rr-hero-services">
      {links.map((link) => (
        <a key={link.id} href={`#${link.id}`} onClick={(event) => goTo(event, link.id)}>
          {link.title}
        </a>
      ))}
    </nav>
  );
}
