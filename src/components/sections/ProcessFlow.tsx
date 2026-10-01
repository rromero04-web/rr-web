"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { CalendarCheck, Check, Lock, Pause, Play } from "lucide-react";
import type { ProcessStep } from "@/content/process";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

// Un mismo proyecto atraviesa las cinco fases dentro de una ventana, y cada
// fase está hecha con el material de la anterior: los mensajes de la primera
// llamada se convierten en los puntos de la propuesta, esos puntos en las
// cajas del boceto, el boceto en la web construida (con el ajuste que pide
// el cliente) y la web, ya publicada, empieza a recibir reservas.
// Las piezas .p1–.p3 son los mismos nodos en todas las fases; el CSS
// (site.css, «Proceso animado») las coloca y viste según data-stage.

const DURATIONS = [3800, 3800, 3600, 4600, 4600];
const LAST = DURATIONS.length - 1;

const COPY = {
  es: {
    captions: [
      "Me cuentas cómo trabajas y qué te frena. De ahí sale todo lo demás.",
      "La conversación se convierte en una propuesta con alcance claro: qué entra y qué se deja para después.",
      "La propuesta toma forma de boceto, ordenado según lo que tu cliente viene a hacer.",
      "Lo construyo y lo ves funcionando. Si algo no te convence, se ajusta antes de cerrar.",
      "Se publica y empieza a trabajar para ti desde el primer día.",
    ],
    bar: ["Primera llamada", "propuesta.pdf", "Boceto", "Versión de prueba", "tuclinica.com"],
    live: "En línea",
    chat: ["Tengo una clínica de fisio. Paso el día al teléfono.", "¿Dando citas?", "Sí, y los pacientes nuevos no me encuentran."],
    brief: "Lo que vamos a construir",
    rows: ["Web clara que dé confianza", "Reserva de citas online", "Horarios libres a la vista"],
    later: ["Tienda online", "Más adelante"],
    note: "Reserva en un toque",
    brand: "Tu clínica",
    hero: ["Tu espalda, en buenas manos", "Fisioterapia en el centro"],
    cta: "Reservar cita",
    slots: "Horarios libres hoy",
    comment: ["¿Y si el botón es más grande?", "¡Así, perfecto!"],
    toast: "Nueva reserva",
    toastTimes: ["Hoy, 10:30", "Hoy, 17:15"],
    controls: "Fases del proceso",
    pause: "Pausar animación",
    play: "Reproducir animación",
  },
  en: {
    captions: [
      "You tell me how you work and what holds you back. Everything else comes from that.",
      "The conversation becomes a proposal with a clear scope: what's in, and what waits for later.",
      "The proposal takes shape as a wireframe, laid out around what your customer comes to do.",
      "I build it and you see it working. If something doesn't convince you, we adjust it before signing off.",
      "It goes live and starts working for you from day one.",
    ],
    bar: ["First call", "proposal.pdf", "Wireframe", "Preview", "yourclinic.com"],
    live: "Live",
    chat: ["I run a physio clinic. I'm on the phone all day.", "Booking appointments?", "Yes, and new patients can't find me."],
    brief: "What we'll build",
    rows: ["A clear site that builds trust", "Online booking", "Free slots at a glance"],
    later: ["Online shop", "Later"],
    note: "Book in one tap",
    brand: "Your clinic",
    hero: ["Your back, in good hands", "Physiotherapy downtown"],
    cta: "Book an appointment",
    slots: "Free slots today",
    comment: ["What if the button were bigger?", "That's perfect!"],
    toast: "New booking",
    toastTimes: ["Today, 10:30", "Today, 17:15"],
    controls: "Process phases",
    pause: "Pause animation",
    play: "Play animation",
  },
};

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(callback: () => void) {
  const mql = window.matchMedia(REDUCED_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const getReducedServer = () => false;

export function ProcessFlow({ locale, steps }: { locale: Locale; steps: ProcessStep[] }) {
  const t = COPY[locale];
  const wrapRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  // Cada vez que una fase (re)empieza cambia `run`, para reiniciar el
  // temporizador y la barra de progreso aunque la fase sea la misma.
  const [run, setRun] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState<boolean | null>(null);
  const [resetting, setResetting] = useState(false);
  const [instant, setInstant] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getReducedServer);
  // Con movimiento reducido no arranca sola, pero se puede reproducir a mano.
  const isPaused = paused ?? reduced;
  const running = visible && !isPaused && !resetting;

  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const go = useCallback((next: number) => {
    setStage(next);
    setRun((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      if (stage < LAST) { go(stage + 1); return; }
      // Vuelta al principio: se funde la pantalla en vez de deshacer el camino.
      setResetting(true);
    }, DURATIONS[stage]);
    return () => window.clearTimeout(timer);
  }, [running, stage, run, go]);

  useEffect(() => {
    if (!resetting) return;
    const timer = window.setTimeout(() => {
      setInstant(true);
      go(0);
      setResetting(false);
    }, 380);
    return () => window.clearTimeout(timer);
  }, [resetting, go]);

  // Las piezas saltan a la fase 1 sin transición y, ya pintadas, se reactivan.
  useEffect(() => {
    if (!instant) return;
    let frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => setInstant(false)); });
    return () => cancelAnimationFrame(frame);
  }, [instant]);

  const togglePlay = () => {
    if (isPaused) setRun((value) => value + 1);
    setPaused(!isPaused);
  };

  const step = steps[stage];

  return (
    <div
      ref={wrapRef}
      className={cn("rr-flow", resetting && "is-resetting", instant && "is-instant", isPaused && "is-paused")}
      data-stage={stage}
    >
      <div className="rr-flow-copy">
        <p className="rr-flow-count"><span>{step.number}</span> / {String(steps.length).padStart(2, "0")}</p>
        <p className="rr-flow-title">{step.title}</p>
        <p className="rr-flow-caption">{t.captions[stage]}</p>
        <div className="rr-flow-controls">
          <div className="rr-flow-progress" role="group" aria-label={t.controls}>
            {steps.map((item, index) => (
              <button
                key={item.number}
                type="button"
                onClick={() => go(index)}
                aria-label={`${item.number}. ${item.title}`}
                aria-current={index === stage ? "step" : undefined}
                className={cn(index < stage && "is-done")}
              >
                <span>
                  {index === stage && <i key={run} style={{ "--d": `${DURATIONS[index]}ms` } as CSSProperties} />}
                </span>
              </button>
            ))}
          </div>
          <button type="button" onClick={togglePlay} className="rr-flow-toggle" aria-label={isPaused ? t.play : t.pause}>
            {isPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Ilustración: el texto de al lado ya cuenta la fase. */}
      <div className="rr-flow-device" aria-hidden="true">
        <div className="rr-flow-bar">
          <i /><i /><i />
          <span className="rr-flow-url">
            {t.bar.map((label, index) => (
              <em key={label} data-on={index}>{index === LAST && <Lock size={11} />}{label}</em>
            ))}
          </span>
          <b className="rr-flow-live">{t.live}</b>
        </div>

        <div className="rr-flow-screen">
          <div className="rr-flow-guides"><i /><i /><i /><i /></div>

          <div className="rr-flow-piece p0">
            <span data-on="1" className="rr-flow-label">{t.brief}</span>
            <span data-on="3 4" className="rr-flow-nav"><b><i />{t.brand}</b><s /></span>
          </div>

          <div className="rr-flow-piece p1">
            <span data-on="0" className="rr-flow-text">{t.chat[0]}</span>
            <span data-on="1" className="rr-flow-row"><Check size={14} />{t.rows[0]}</span>
            <span data-on="2" className="rr-flow-wire"><i /><i /><i /></span>
            <span data-on="3 4" className="rr-flow-hero"><strong>{t.hero[0]}</strong><small>{t.hero[1]}</small></span>
          </div>

          <div className="rr-flow-piece p2">
            <span data-on="0" className="rr-flow-text">{t.chat[1]}</span>
            <span data-on="1" className="rr-flow-row"><Check size={14} />{t.rows[1]}</span>
            <span data-on="3 4" className="rr-flow-cta">{t.cta}</span>
          </div>

          <div className="rr-flow-piece p3">
            <span data-on="0" className="rr-flow-text">{t.chat[2]}</span>
            <span data-on="1" className="rr-flow-row"><Check size={14} />{t.rows[2]}</span>
            <span data-on="2" className="rr-flow-wire is-slots"><i /><i /><i /></span>
            <span data-on="3 4" className="rr-flow-slots"><small>{t.slots}</small><span><b>10:30</b><b>12:00</b><b>17:15</b></span></span>
          </div>

          <div className="rr-flow-piece p4"><span className="rr-flow-later">{t.later[0]}<small>{t.later[1]}</small></span></div>
          <div className="rr-flow-piece p5">{t.note}</div>
          <div className="rr-flow-piece p6">
            <i>C</i>
            <span className="is-a">{t.comment[0]}</span>
            <span className="is-b">{t.comment[1]}</span>
          </div>
          {t.toastTimes.map((time, index) => (
            <div key={time} className={cn("rr-flow-piece rr-flow-toast", index === 0 ? "p7" : "p8")}>
              <CalendarCheck size={18} />
              <span><b>{t.toast}</b>{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
