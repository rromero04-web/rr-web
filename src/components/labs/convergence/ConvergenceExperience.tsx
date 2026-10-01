"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Lenis from "lenis";
import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ConvergenceAudio } from "./ConvergenceAudio";
import { CHAPTERS, DISCIPLINES, SIGNALS, createSceneState, type Quality, type SceneState } from "./model";
import styles from "./convergence.module.css";

const ConvergenceScene = dynamic(() => import("./ConvergenceScene").then((m) => m.ConvergenceScene), { ssr: false });

const seconds = () => performance.now() / 1000;
const smooth = (v: number) => { const x = Math.min(1, Math.max(0, v)); return x * x * (3 - 2 * x); };

export function ConvergenceExperience() {
  // Shared with the render loop; only touched in effects and event handlers.
  const stateRef = useRef<SceneState>(createSceneState());
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const audioRef = useRef<ConvergenceAudio | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [count, setCount] = useState(0);
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [calm, setCalm] = useState(false);
  const [sound, setSound] = useState(false);
  const [quality, setQuality] = useState<Quality>("medium");
  const [chapter, setChapter] = useState(0);
  const [routed, setRouted] = useState<number[]>([]);
  const [finePointer, setFinePointer] = useState(false);

  // Capabilities and preferences.
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forced = window.matchMedia("(forced-colors: active)");
    const fine = window.matchMedia("(pointer: fine)");
    const update = () => { setReduced(motion.matches); setFinePointer(fine.matches); };
    const raf = requestAnimationFrame(() => {
      update();
      let ok = !forced.matches;
      if (ok) {
        try {
          const probe = document.createElement("canvas");
          ok = Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
        } catch { ok = false; }
      }
      setWebgl(ok);
      const small = window.innerWidth < 820 || window.matchMedia("(pointer: coarse)").matches;
      const forcedQuality = new URLSearchParams(window.location.search).get("quality");
      setQuality(forcedQuality === "low" || forcedQuality === "medium" || forcedQuality === "high" ? forcedQuality
        : small ? "low" : window.devicePixelRatio > 1.5 && window.innerWidth > 1600 ? "high" : "medium");
    });
    const state = stateRef.current;
    state.snap = new URLSearchParams(window.location.search).has("capture");
    if (state.snap) (window as unknown as { __convergence: unknown }).__convergence = state;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    motion.addEventListener("change", update);
    fine.addEventListener("change", update);
    return () => { cancelAnimationFrame(raf); motion.removeEventListener("change", update); fine.removeEventListener("change", update); };
  }, []);

  useEffect(() => { stateRef.current.calm = reduced || calm; }, [reduced, calm]);

  // Preloader counter: honest about the scene, never stuck if WebGL is absent.
  const loaded = webgl === false || sceneReady;
  useEffect(() => {
    if (entered) return;
    let raf = 0;
    const start = performance.now();
    const tick = () => {
      setCount((current) => {
        const elapsed = (performance.now() - start) / 1000;
        const ceiling = loaded ? 100 : Math.min(92, 40 + elapsed * 30);
        const next = Math.min(ceiling, current + Math.max(0.6, (ceiling - current) * (reduced ? 1 : 0.07)));
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loaded, entered, reduced]);
  const ready = loaded && count >= 99.5;
  const enterRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (ready && !entered) enterRef.current?.focus({ preventScroll: true }); }, [ready, entered]);

  const enter = useCallback(async (withSound: boolean) => {
    if (withSound) {
      try {
        audioRef.current ??= new ConvergenceAudio(new AudioContext());
        await audioRef.current.enable();
        setSound(true);
      } catch { setSound(false); }
    }
    setEntered(true);
  }, []);

  useEffect(() => () => { void audioRef.current?.dispose(); }, []);

  const toggleSound = useCallback(async () => {
    if (sound) { audioRef.current?.disable(); setSound(false); return; }
    try {
      audioRef.current ??= new ConvergenceAudio(new AudioContext());
      await audioRef.current.enable();
      setSound(true);
    } catch { setSound(false); }
  }, [sound]);

  // Smooth scroll, the scroll → stage mapping, and every per-frame DOM write.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const state = stateRef.current;
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-stage]"));
    const lenis = reduced ? null : new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    if (lenis && !entered) lenis.stop();
    document.documentElement.dataset.locked = entered ? "false" : "true";

    let raf = 0;
    let last = performance.now();
    let lastY = window.scrollY;
    let velocity = 0;
    let marqueeX = 0;
    let pointerIdle = 0;
    let currentChapter = -1;
    const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2, tx: window.innerWidth / 2, ty: window.innerHeight / 2 };

    const onMove = (event: PointerEvent) => {
      if (state.snap) return;
      cursor.tx = event.clientX; cursor.ty = event.clientY;
      state.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      state.pointerY = -(event.clientY / window.innerHeight) * 2 + 1;
      state.pointerActive = event.pointerType === "mouse" ? 1 : 0.7;
      pointerIdle = 0;
      if (cursorRef.current) cursorRef.current.dataset.visible = "true";
    };
    const onLeave = () => { state.pointerActive = 0; };
    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("a, button");
      const el = cursorRef.current;
      if (!el) return;
      el.dataset.hover = target ? "true" : "false";
      const dot = el.firstElementChild as HTMLElement | null;
      if (dot) dot.dataset.label = target?.dataset.cursor ?? "";
      if (target && !target.hasAttribute("disabled")) audioRef.current?.hover();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerover", onOver);

    const loop = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000);
      last = time;
      lenis?.raf(time);
      const y = lenis ? lenis.scroll : window.scrollY;
      const vh = window.innerHeight;
      const instant = dt > 0 ? (y - lastY) / dt / vh : 0;
      lastY = y;
      velocity += (instant - velocity) * Math.min(1, dt * 8);
      state.scrollVelocity = velocity;

      // Each section owns one stage. The morph happens as the next section arrives.
      const tops = sections.map((el) => el.getBoundingClientRect().top + window.scrollY);
      let stage = 0;
      for (let i = 0; i < 5; i++) {
        const a = tops[i], b = tops[i + 1];
        if (y >= a) stage = i + smooth((y - a - (b - a) * 0.45) / ((b - a) * 0.55));
      }
      if (y >= tops[5]) stage = 5;
      state.stage = stage;

      sections.forEach((el, i) => {
        const p = (y + vh - tops[i]) / (el.offsetHeight + vh);
        el.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(4));
      });

      const nextChapter = Math.min(5, Math.round(stage));
      if (nextChapter !== currentChapter) { currentChapter = nextChapter; setChapter(nextChapter); }
      const total = document.documentElement.scrollHeight - vh;
      const progress = total > 0 ? y / total : 0;
      if (percentRef.current) percentRef.current.textContent = String(Math.round(progress * 100)).padStart(3, "0");
      if (railRef.current) railRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;

      // The marquee runs on its own and accelerates with scroll.
      if (marqueeRef.current) {
        marqueeX -= (40 + Math.abs(velocity) * 900) * dt * (state.calm ? 0.3 : 1);
        const width = marqueeRef.current.scrollWidth / 2;
        if (width > 0 && -marqueeX > width) marqueeX += width;
        marqueeRef.current.style.transform = `translate3d(${marqueeX.toFixed(1)}px,0,0) skewX(${(state.calm ? 0 : Math.max(-12, Math.min(12, -velocity * 18))).toFixed(2)}deg)`;
      }

      pointerIdle += dt;
      if (pointerIdle > 2.5) state.pointerActive = Math.max(0, state.pointerActive - dt * 0.6);

      const c = cursorRef.current;
      if (c) {
        cursor.x += (cursor.tx - cursor.x) * Math.min(1, dt * 14);
        cursor.y += (cursor.ty - cursor.y) * Math.min(1, dt * 14);
        c.style.transform = `translate3d(${cursor.x.toFixed(1)}px, ${cursor.y.toFixed(1)}px, 0)`;
      }

      audioRef.current?.update({
        stage, velocity, pointer: state.pointerActive * Math.min(1, pointerIdle < 0.12 ? 1 : 0),
        calm: state.calm, mobile: window.innerWidth < 820,
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenisRef.current = null;
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerover", onOver);
    };
  }, [reduced, entered]);

  // Text enters once, as each block reaches the viewport.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { (entry.target as HTMLElement).dataset.in = "true"; observer.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });
    if (entered) root.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entered]);

  const sendPulse = () => {
    stateRef.current.pulseAt = seconds();
    audioRef.current?.pulse();
  };

  const route = (id: number) => {
    if (routed.includes(id)) return;
    const signal = SIGNALS.find((s) => s.id === id);
    if (!signal) return;
    const next = [...routed, id];
    setRouted(next);
    const state = stateRef.current;
    state.routeAt = seconds();
    state.routeGroup = signal.discipline;
    state.routed[signal.discipline] += 1;
    audioRef.current?.route(signal.discipline, next.length);
    if (next.length === SIGNALS.length) { state.complete = 1; audioRef.current?.complete(); }
  };

  const reset = () => {
    setRouted([]);
    stateRef.current.routed = [0, 0, 0];
    stateRef.current.complete = 0;
    audioRef.current?.click();
  };

  const scrollTo = (index: number) => {
    const el = rootRef.current?.querySelector<HTMLElement>(`[data-stage="${index}"]`);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 2.2 });
    else el.scrollIntoView();
  };

  const complete = routed.length === SIGNALS.length;

  return (
    <div ref={rootRef} className={styles.root} data-entered={entered} data-calm={reduced || calm} data-chapter={CHAPTERS[chapter].id}>
      <a className={styles.skip} href="#composer">Skip to the signal composer</a>

      <div className={styles.stage} aria-hidden="true">
        {webgl && <ConvergenceScene stateRef={stateRef} quality={quality} onReady={() => setSceneReady(true)} onSlow={() => setQuality((q) => (q === "high" ? "medium" : "low"))} />}
        {webgl === false && <div className={styles.fallback} />}
      </div>

      {/* Preloader */}
      <div className={styles.loader} data-ready={ready} data-gone={entered} aria-hidden={entered}>
        <div className={styles.loaderTop}>
          <span>Raúl Romero</span>
          <span>Lab 001 — Convergence</span>
          <span>Strategy × Design × Technology</span>
        </div>
        <div className={styles.loaderCenter}>
          <svg className={styles.loaderRing} viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="48" pathLength={1} />
            <circle cx="50" cy="50" r="48" pathLength={1} style={{ strokeDashoffset: 1 - count / 100 }} />
          </svg>
          <p className={styles.loaderNote}>{ready ? "The system is ready." : "Calibrating the field"}</p>
          <div className={styles.loaderChoice} data-show={ready}>
            <button ref={enterRef} onClick={() => enter(true)} data-cursor="Enter" tabIndex={ready ? 0 : -1}>
              <SoundBars on /> Enter with sound
            </button>
            <button onClick={() => enter(false)} data-cursor="Enter" tabIndex={ready ? 0 : -1}>Enter in silence</button>
          </div>
        </div>
        <div className={styles.loaderBottom}>
          <span className={styles.loaderHint}>Best with headphones · Scroll to converge</span>
          <span className={styles.loaderCount}>{String(Math.floor(count)).padStart(3, "0")}</span>
        </div>
        <span className={styles.loaderBar} style={{ transform: `scaleX(${count / 100})` }} />
      </div>

      {/* Persistent interface */}
      <header className={styles.hud}>
        <Link href="/labs" className={styles.back} data-cursor="Labs"><span aria-hidden="true">←</span> Labs</Link>
        <span className={styles.mark}>Convergence <em>Lab 001</em></span>
        <div className={styles.controls}>
          <button onClick={() => setCalm((v) => !v)} aria-pressed={reduced || calm} disabled={reduced} data-cursor="Motion">
            Motion: {reduced || calm ? "calm" : "full"}
          </button>
          <button onClick={toggleSound} aria-pressed={sound} data-cursor="Sound" aria-label={sound ? "Mute sound" : "Turn sound on"}>
            <SoundBars on={sound} /> <span>Sound {sound ? "on" : "off"}</span>
          </button>
        </div>
      </header>
      <div className={styles.hudBottom} aria-hidden="true">
        <span className={styles.chapterIndex}>
          <b key={chapter}>{CHAPTERS[chapter].index}</b> / 05 — <i key={`l${chapter}`}>{CHAPTERS[chapter].label}</i>
        </span>
        <span className={styles.rail}><span ref={railRef} /></span>
        <span className={styles.percent}><span ref={percentRef}>000</span>%</span>
      </div>

      {finePointer && <div ref={cursorRef} className={styles.cursor} aria-hidden="true"><span /></div>}

      <main className={styles.content}>
        {/* 00 — Prelude */}
        <section data-stage={0} className={`${styles.section} ${styles.hero}`} aria-labelledby="title">
          <div className={styles.heroMeta}>
            <span>(Lab 001)</span>
            <span>An interactive study of what happens<br />when three disciplines become one system.</span>
            <span>2026</span>
          </div>
          <h1 id="title" className={styles.heroTitle} aria-label="Convergence">
            {"Convergence".split("").map((ch, i) => (
              <span key={i} className={styles.char} style={{ "--i": i } as CSSProperties} aria-hidden="true">{ch}</span>
            ))}
          </h1>
          <div className={styles.heroFoot}>
            <p className={styles.heroLede}>
              Marketing brings <Serif>attention</Serif>. Design gives it <Serif>form</Serif>. Development makes it <Serif>behave</Serif>.
            </p>
            <button className={styles.scrollCue} onClick={() => scrollTo(1)} data-cursor="Begin">
              <span>Scroll to converge</span><i aria-hidden="true" />
            </button>
          </div>
        </section>

        {/* 01 — Attention */}
        <Chapter
          stage={1} align="left" index="01" discipline="Marketing" title="Attention"
          statement="Attention without direction is *noise.*"
          body="Every product begins as scattered interest: glances, clicks, half-intentions. On its own it goes nowhere. Move your cursor through the field and watch it gather around you. That pull is the raw material."
          aside={<><Dot color="ember" /> Input · Unstructured signal<br /><span>Move the cursor to gather the field</span></>}
        />

        {/* 02 — Form */}
        <Chapter
          stage={2} align="right" index="02" discipline="Design" title="Form"
          statement="Structure turns attention into *meaning.*"
          body="Design is not decoration. It is deciding where each thing goes, and why. The same matter, now aligned into layers, grids and hierarchy: something a person can read at a glance."
          aside={<><Dot color="lilac" /> Layers 05 · Grid 12 col<br /><span>Hierarchy · Rhythm · Contrast</span></>}
        />

        {/* 03 — Behavior */}
        <Chapter
          stage={3} align="left" index="03" discipline="Development" title="Behavior"
          statement="Ideas become real when they can *respond.*"
          body="Code gives form a pulse. Information starts to move, branch and react to the people using it. Send a signal through the system."
          aside={<><Dot color="aqua" /> Input → State → Response<br /><span>72 channels · 1 node</span></>}
          action={<button className={styles.pill} onClick={sendPulse} data-cursor="Send"><span>Send a signal</span><i aria-hidden="true">→</i></button>}
        />

        {/* 04 — Convergence */}
        <section data-stage={4} className={`${styles.section} ${styles.convergence}`} aria-labelledby="convergence-title">
          <div className={styles.sticky}>
            <div className={styles.marquee} aria-hidden="true">
              <div ref={marqueeRef} className={styles.marqueeTrack}>
                {Array.from({ length: 4 }, (_, i) => (
                  <Fragment key={i}>
                    <span>Attention</span><em>×</em><span>Form</span><em>×</em><span>Behavior</span><em>×</em>
                  </Fragment>
                ))}
              </div>
            </div>
            <div className={styles.convergenceCopy}>
              <p className={styles.eyebrow} data-reveal><span>04</span> Convergence</p>
              <h2 id="convergence-title" className={styles.statement} data-reveal>
                <Words text="The system becomes more than its *parts.*" />
              </h2>
              <p className={styles.body} data-reveal>
                When the three stop working in sequence and start working as one, the result is not a sum. It is a product that is alive.
              </p>
            </div>
          </div>
        </section>

        {/* 05 — Product */}
        <section data-stage={5} id="composer" className={`${styles.section} ${styles.product}`} aria-labelledby="product-title">
          <div className={styles.productCopy}>
            <p className={styles.eyebrow} data-reveal><span>05</span> Product</p>
            <h2 id="product-title" className={styles.statement} data-reveal>
              <Words text="Three inputs. One *living* system." />
            </h2>
            <p className={styles.body} data-reveal>Route each signal into the system. Every discipline lights its own orbit, and the whole responds.</p>

            <div className={styles.composer} data-reveal data-complete={complete}>
              <div className={styles.composerHead}>
                <span>Signal composer</span>
                <span aria-hidden="true"><b>{String(routed.length).padStart(2, "0")}</b> / 06 routed</span>
              </div>
              <ul>
                {SIGNALS.map((signal) => {
                  const done = routed.includes(signal.id);
                  return (
                    <li key={signal.id}>
                      <button onClick={() => route(signal.id)} aria-pressed={done} data-discipline={signal.discipline} data-cursor={done ? "Routed" : "Route"}>
                        <span className={styles.sigIndex}>{String(signal.id).padStart(2, "0")}</span>
                        <span className={styles.sigLabel}>{signal.label}</span>
                        <span className={styles.sigTag}>{DISCIPLINES[signal.discipline]}</span>
                        <span className={styles.sigState} aria-hidden="true">{done ? "Routed" : "Route →"}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className={styles.composerFoot}>
                <p aria-live="polite">
                  {complete ? "All six signals routed. This is what a working system feels like."
                    : routed.length ? `${routed.length} of 6 signals routed.` : "Select a signal to route it."}
                </p>
                <button onClick={reset} disabled={!routed.length} data-cursor="Reset">Reset</button>
              </div>
            </div>
          </div>
        </section>

        {/* Outro */}
        <section className={`${styles.section} ${styles.outro}`} aria-labelledby="outro-title">
          <h2 id="outro-title" className={styles.outroTitle} data-reveal>
            <Words text="The interesting part happens *between* disciplines." />
          </h2>
          <div className={styles.outroActions} data-reveal>
            <Link href="/#contacto" className={styles.pill} data-cursor="Talk">
              <span>Start a project</span><i aria-hidden="true">→</i>
            </Link>
            <Link href="/#proceso" className={styles.link} data-cursor="Read">See how I work</Link>
            <button className={styles.link} onClick={() => scrollTo(0)} data-cursor="Again">Replay ↑</button>
          </div>
          <footer className={styles.credits}>
            <span>Concept, design &amp; code — Raúl Romero</span>
            <span>WebGL · GLSL · Web Audio · 2026</span>
            <Link href="/labs">Back to Labs</Link>
          </footer>
        </section>
      </main>
    </div>
  );
}

function Chapter(props: {
  stage: number; align: "left" | "right"; index: string; discipline: string;
  title: string; statement: string; body: string; aside: ReactNode; action?: ReactNode;
}) {
  const id = `chapter-${props.index}`;
  return (
    <section data-stage={props.stage} className={`${styles.section} ${styles.chapter}`} data-align={props.align} aria-labelledby={id}>
      <div className={styles.sticky}>
      <div className={styles.chapterGhost} aria-hidden="true">{props.title}</div>
      <div className={styles.chapterInner}>
        <p className={styles.eyebrow} data-reveal><span>{props.index}</span> {props.title} — {props.discipline}</p>
        <h2 id={id} className={styles.statement} data-reveal><Words text={props.statement} /></h2>
        <p className={styles.body} data-reveal>{props.body}</p>
        {props.action && <div className={styles.action} data-reveal>{props.action}</div>}
        <p className={styles.aside} data-reveal>{props.aside}</p>
      </div>
      </div>
    </section>
  );
}

// Splits a sentence into masked words; *word* is set in the italic serif.
function Words({ text }: { text: string }) {
  const words: { word: string; serif: boolean }[] = [];
  let serif = false;
  for (const raw of text.split(" ")) {
    if (raw.startsWith("*")) serif = true;
    words.push({ word: raw.replace(/\*/g, ""), serif });
    if (/\*[.,]?$/.test(raw)) serif = false;
  }
  return (
    <>
      {words.map(({ word, serif: italic }, i) => (
        <Fragment key={i}>
          <span className={styles.word}>
            <span style={{ "--i": i } as CSSProperties} className={italic ? styles.serif : undefined}>{word}</span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

function Serif({ children }: { children: ReactNode }) {
  return <em className={styles.serif}>{children}</em>;
}

function Dot({ color }: { color: "ember" | "lilac" | "aqua" }) {
  return <i className={styles.dot} data-color={color} aria-hidden="true" />;
}

function SoundBars({ on }: { on: boolean }) {
  return <span className={styles.bars} data-on={on} aria-hidden="true"><i /><i /><i /><i /></span>;
}
