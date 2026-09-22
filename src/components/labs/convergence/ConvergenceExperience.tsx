"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PHASES, SIGNALS, phaseAt, type Quality } from "./model";
import styles from "./convergence.module.css";

const ConvergenceCanvas = dynamic(
  () => import("./ConvergenceCanvas").then((module) => module.ConvergenceCanvas),
  { ssr: false, loading: () => <div className={styles.canvasLoading}>CALIBRATING SYSTEM</div> },
);

type Order = "arrival" | "priority";

export function ConvergenceExperience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const previousProgress = useRef(0);
  const previousAudioProgress = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [reading, setReading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState(false);
  const [quality, setQuality] = useState<Quality>("medium");
  const [order, setOrder] = useState<Order>("arrival");
  const [selected, setSelected] = useState<number | null>(null);
  const [routed, setRouted] = useState<number[]>([]);
  const [pulse, setPulse] = useState(0);
  const phase = phaseAt(progress);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = window.matchMedia("(forced-colors: active)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const update = () => setReduced(media.matches);
    const raf = requestAnimationFrame(() => {
      update();
      setQuality(coarse || window.innerWidth < 820 ? "low" : window.devicePixelRatio > 1.5 ? "high" : "medium");
      if (window.innerHeight < 480 && window.innerWidth > window.innerHeight) setReading(true);
      if (forcedColors.matches) setReduced(true);
      setMounted(true);
    });
    media.addEventListener("change", update);
    return () => { cancelAnimationFrame(raf); media.removeEventListener("change", update); };
  }, []);

  useEffect(() => {
    if (!mounted || reduced || reading) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const travel = track.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const next = Math.max(0, Math.min(1, -rect.top / travel));
      setProgress(next);
      previousProgress.current = next;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mounted, reduced, reading]);

  useEffect(() => {
    if (!sound || !audioRef.current || paused) return;
    if (previousAudioProgress.current < .735 && progress >= .735 && progress < .79) {
      const ctx = audioRef.current;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(82, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(46, ctx.currentTime + .18);
      gain.gain.setValueAtTime(.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.12, ctx.currentTime + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .2);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + .21);
    }
    previousAudioProgress.current = progress;
  }, [progress, sound, paused]);

  useEffect(() => () => { void audioRef.current?.close(); }, []);

  const toggleSound = useCallback(async () => {
    if (!audioRef.current) audioRef.current = new AudioContext();
    if (audioRef.current.state === "suspended") await audioRef.current.resume();
    setSound((value) => !value);
  }, []);

  const reduceQuality = useCallback(() => {
    setQuality((current) => current === "high" ? "medium" : "low");
  }, []);

  const goTo = useCallback((start: number) => {
    const track = trackRef.current;
    if (!track) return;
    const top = window.scrollY + track.getBoundingClientRect().top;
    const travel = track.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * start, behavior: "auto" });
  }, []);

  const displaySignals = useMemo(() => {
    const copy = [...SIGNALS];
    if (order === "priority") copy.sort((a, b) => a.priority - b.priority);
    return copy;
  }, [order]);

  const routeSignal = () => {
    if (selected === null || routed.includes(selected)) return;
    setRouted((current) => [...current, selected]);
    setPulse((value) => value + 1);
  };

  if (!mounted || reduced || reading) {
    return (
      <StaticExperience
        reading={reading}
        onEnter={mounted && !reduced ? () => setReading(false) : undefined}
        order={order}
        setOrder={setOrder}
        selected={selected}
        setSelected={setSelected}
        routed={routed}
        routeSignal={routeSignal}
        reset={() => { setSelected(null); setRouted([]); setOrder("arrival"); }}
        signals={displaySignals}
      />
    );
  }

  return (
    <main className={styles.experience}>
      <a className={styles.skip} href="#chapter-nav">Skip to chapter navigation</a>
      <div ref={trackRef} className={styles.track}>
        <div className={styles.stage}>
          <ConvergenceCanvas
            progress={progress}
            paused={paused}
            quality={quality}
            selected={selected}
            routed={routed}
            pulse={pulse}
            onSlow={reduceQuality}
          />
          <div className={styles.vignette} aria-hidden="true" />

          <header className={styles.topbar}>
            <Link href="/labs" className={styles.back}>← Back to Labs</Link>
            <span className={styles.labMark}>RAÚL ROMERO / LAB 001</span>
            <div className={styles.toolbar}>
              <button onClick={() => setPaused((value) => !value)} aria-pressed={paused}>{paused ? "Resume" : "Pause"}</button>
              <button onClick={toggleSound} aria-pressed={sound}>Sound {sound ? "on" : "off"}</button>
              <button onClick={() => setReading(true)}>Reading mode</button>
            </div>
          </header>

          <div className={styles.progressRail} aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>

          <div className={styles.chapters} aria-live="off">
            {PHASES.map((item) => (
              <section key={item.id} className={styles.chapter} data-active={phase === item.id} aria-hidden={phase !== item.id}>
                {item.id === "prelude" ? (
                  <>
                    <p className={styles.kicker}>THREE DISCIPLINES. ONE SYSTEM.</p>
                    <h1>CONVERGENCE</h1>
                    <p className={styles.lede}>Marketing brings attention.<br />Design gives it form.<br />Development makes it real.</p>
                    <p className={styles.scrollHint}>SCROLL TO CONVERGE <span>↓</span></p>
                  </>
                ) : item.id === "product" ? (
                  <>
                    <p className={styles.kicker}>CONVERGENCE / LIVE SYSTEM</p>
                    <h2 className={styles.finalTitle}>THE INTERESTING PART<br />HAPPENS BETWEEN DISCIPLINES.</h2>
                    <p className={styles.lede}>Marketing brings attention.<br />Design gives it form.<br />Development makes it real.</p>
                  </>
                ) : (
                  <>
                    <p className={styles.kicker}>{item.id === "attention" ? "MARKETING" : item.id === "form" ? "DESIGN" : item.id === "behavior" ? "DEVELOPMENT" : "ATTENTION × FORM × BEHAVIOR"}</p>
                    <h2>{item.label}</h2>
                    <p className={styles.statement}>{item.line}</p>
                  </>
                )}
              </section>
            ))}
          </div>

          {phase === "behavior" && (
            <button className={styles.behaviorTrigger} onClick={() => setPulse((value) => value + 1)}>Send test signal <span>→</span></button>
          )}

          {phase === "product" && (
            <ProductPanel
              signals={displaySignals}
              order={order}
              setOrder={setOrder}
              selected={selected}
              setSelected={(id) => { setSelected(id); setPulse((value) => value + 1); }}
              routed={routed}
              routeSignal={routeSignal}
              reset={() => { setSelected(null); setRouted([]); setOrder("arrival"); }}
            />
          )}

          <nav id="chapter-nav" className={styles.chapterNav} aria-label="Experience chapters">
            {PHASES.map((item, index) => (
              <button key={item.id} onClick={() => goTo(item.start)} aria-current={phase === item.id ? "step" : undefined} aria-label={`Go to ${item.label}`}>
                <span>{String(index + 1).padStart(2, "0")}</span><i />
              </button>
            ))}
          </nav>

          <div className={styles.quality} aria-label={`Graphics quality: ${quality}`}>
            <button onClick={() => setQuality(quality === "high" ? "medium" : quality === "medium" ? "low" : "high")}>QUALITY / {quality.toUpperCase()}</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function ProductPanel(props: {
  signals: typeof SIGNALS; order: Order; setOrder: (order: Order) => void;
  selected: number | null; setSelected: (id: number) => void; routed: number[];
  routeSignal: () => void; reset: () => void;
}) {
  return (
    <div className={styles.productPanel}>
      <div className={styles.productHead}>
        <span>SIGNAL COMPOSER</span><span>{String(props.routed.length).padStart(2, "0")} ROUTED</span>
      </div>
      <div className={styles.orderControl} aria-label="Signal order">
        <button data-active={props.order === "arrival"} onClick={() => props.setOrder("arrival")}>ARRIVAL</button>
        <button data-active={props.order === "priority"} onClick={() => props.setOrder("priority")}>PRIORITY</button>
      </div>
      <div className={styles.signalList}>
        {props.signals.map((signal) => (
          <button key={signal.id} data-selected={props.selected === signal.id} data-routed={props.routed.includes(signal.id)} onClick={() => props.setSelected(signal.id)}>
            <span>{String(signal.id).padStart(2, "0")}</span>{signal.label}<i />
          </button>
        ))}
      </div>
      <div className={styles.productActions}>
        <button onClick={props.routeSignal} disabled={props.selected === null || props.routed.includes(props.selected)}>Route signal →</button>
        <button onClick={props.reset}>Reset</button>
        <Link href="/#proceso">See how I work →</Link>
      </div>
      <p className={styles.srStatus} aria-live="polite">{props.routed.length ? `${props.routed.length} signals routed.` : "Select a signal to begin."}</p>
    </div>
  );
}

function StaticExperience(props: {
  reading: boolean; onEnter?: () => void; signals: typeof SIGNALS; order: Order; setOrder: (order: Order) => void;
  selected: number | null; setSelected: (id: number) => void; routed: number[]; routeSignal: () => void; reset: () => void;
}) {
  return (
    <main className={styles.staticPage}>
      <header className={styles.staticHeader}><Link href="/labs">← Back to Labs</Link><span>RAÚL ROMERO / LAB 001</span>{props.onEnter && <button onClick={props.onEnter}>Enter interactive experience</button>}</header>
      <section className={styles.staticHero}><p>THREE DISCIPLINES. ONE SYSTEM.</p><h1>CONVERGENCE</h1><span>Strategy × Design × Technology</span></section>
      {PHASES.slice(1, 5).map((phase, index) => (
        <section key={phase.id} className={styles.staticChapter}>
          <span>{String(index + 1).padStart(2, "0")} / {phase.id === "attention" ? "MARKETING" : phase.id === "form" ? "DESIGN" : phase.id === "behavior" ? "DEVELOPMENT" : "SYSTEM"}</span>
          <h2>{phase.label}</h2><p>{phase.line}</p><div className={styles.staticDiagram} data-phase={phase.id} aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        </section>
      ))}
      <section className={styles.staticProduct}>
        <p>THE INTERESTING PART</p><h2>HAPPENS BETWEEN DISCIPLINES.</h2>
        <p>Marketing brings attention.<br />Design gives it form.<br />Development makes it real.</p>
        <ProductPanel {...props} />
      </section>
    </main>
  );
}
