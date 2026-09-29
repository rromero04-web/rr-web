"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

// Three.js solo se descarga cuando el intro realmente se muestra, así el
// resto de cargas no pagan su peso.
const ShaderAnimation = dynamic(
  () => import("@/components/ui/shader-animation").then((m) => m.ShaderAnimation),
  { ssr: false }
);

const VISIBLE_MS = 3000;
// Duración de la salida: el fondo se desvanece y el logo vuela a la cabecera
// mientras el hero empieza a construirse (ver .intro-* en globals.css).
const LEAVE_MS = 1000;

type Phase = "pending" | "leaving" | "done";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-intro"] });
  return () => observer.disconnect();
}

function getPhase(): Phase {
  const value = document.documentElement.dataset.intro;
  return value === "pending" || value === "leaving" ? value : "done";
}

function getServerPhase(): Phase {
  return "done";
}

export function IntroSplash() {
  const phase = useSyncExternalStore(subscribe, getPhase, getServerPhase);
  const markRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (phase === "done") return;

    if (phase === "leaving") {
      const timer = window.setTimeout(() => {
        document.documentElement.dataset.intro = "done";
      }, LEAVE_MS);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      // Calcula el desplazamiento del logo central hasta el logo de la
      // cabecera, para que al salir "aterrice" exactamente en su sitio.
      const mark = markRef.current;
      const target = document.querySelector<HTMLElement>(".rr-header .rr-brand img");
      if (mark && target) {
        const from = mark.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        if (from.height > 0 && to.height > 0) {
          const dx = to.left + to.width / 2 - (from.left + from.width / 2);
          const dy = to.top + to.height / 2 - (from.top + from.height / 2);
          mark.style.setProperty("--intro-fly", `translate(${dx}px, ${dy}px) scale(${to.height / from.height})`);
        }
      }
      document.documentElement.dataset.intro = "leaving";
    }, VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <div aria-hidden="true" className="intro-splash fixed inset-0 z-[200] items-center justify-center">
      <div className="intro-backdrop absolute inset-0 bg-black">
        {phase !== "done" && <ShaderAnimation className="absolute inset-0" />}
      </div>

      <div className="intro-logo relative z-10 flex flex-col items-center gap-5">
        <Image
          ref={markRef}
          src="/brand/logo-mark-inverse.png"
          alt=""
          width={800}
          height={672}
          priority
          className="intro-mark h-24 w-auto sm:h-32"
        />
        <span className="intro-wordmark text-sm font-bold tracking-[0.3em] text-cream uppercase">Raúl Romero</span>
      </div>
    </div>
  );
}
