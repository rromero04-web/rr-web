"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PHASES, SIGNALS, phaseAt, type Phase, type Quality } from "./model";
import styles from "./convergence.module.css";

const ConvergenceCanvas = dynamic(
  () => import("./ConvergenceCanvas").then((module) => module.ConvergenceCanvas),
  { ssr: false, loading: () => <div className={styles.canvasLoading}>CALIBRATING SYSTEM</div> },
);

type Order = "arrival" | "priority";

export function ConvergenceExperience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [calmOverride, setCalmOverride] = useState(false);
  const [forcedColors, setForcedColors] = useState(false);
  const [reading, setReading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState(false);
  const [quality, setQuality] = useState<Quality>("medium");
  const [order, setOrder] = useState<Order>("arrival");
  const [selected, setSelected] = useState<number | null>(null);
  const [routed, setRouted] = useState<number[]>([]);
  const [pulse, setPulse] = useState(0);
  const [productReady, setProductReady] = useState(false);
  const phase = phaseAt(progress);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = window.matchMedia("(forced-colors: active)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const update = () => { setReduced(media.matches); setForcedColors(forcedColors.matches); };
    const raf = requestAnimationFrame(() => {
      update();
      setQuality(coarse || window.innerWidth < 820 ? "low" : window.devicePixelRatio > 1.5 ? "high" : "medium");
      if (window.innerHeight < 480 && window.innerWidth > window.innerHeight) setReading(true);
      setMounted(true);
    });
    media.addEventListener("change", update);
    forcedColors.addEventListener("change", update);
    return () => { cancelAnimationFrame(raf); media.removeEventListener("change", update); forcedColors.removeEventListener("change", update); };
  }, []);

  useEffect(() => {
    if (!mounted || reading) return;
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

  const playCue = useCallback((cue: "alignment" | "anticipation" | "escape" | "connection" | "impact" | "formation") => {
    if (!sound || !audioRef.current || paused) return;
    const ctx = audioRef.current;
    const cues = {
      alignment: { from: 178, to: 126, duration: .2, volume: .028, waveform: "sine" },
      escape: { from: 83, to: 264, duration: .48, volume: .022, waveform: "triangle" },
      connection: { from: 288, to: 174, duration: .38, volume: .027, waveform: "sine" },
      anticipation: { from: 58, to: 43, duration: .42, volume: .015, waveform: "sine" },
      impact: { from: 82, to: 34, duration: .26, volume: .085, waveform: "sine" },
      formation: { from: 126, to: 188, duration: 1.05, volume: .018, waveform: "sine" },
    } as const;
    const spec = cues[cue];
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = spec.waveform;
    oscillator.frequency.setValueAtTime(spec.from, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(spec.to, ctx.currentTime + spec.duration);
    gain.gain.setValueAtTime(.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(spec.volume, ctx.currentTime + (cue === "impact" ? .012 : .065));
    gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + spec.duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + spec.duration + .02);
  }, [sound, paused]);

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
    window.scrollTo({ top: top + travel * (start === 0 ? 0 : start + (start >= .82 ? .08 : .045)), behavior: "auto" });
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

  if (!mounted || forcedColors || reading) {
    return (
      <StaticExperience
        reading={reading}
        onEnter={mounted && !forcedColors ? () => setReading(false) : undefined}
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
        <div className={styles.stage} data-phase={phase}>
          <div className={styles.sceneWindow}>
          <ConvergenceCanvas
            progress={progress}
            paused={paused}
            quality={quality}
            selected={selected}
            routed={routed}
            pulse={pulse}
            calm={reduced || calmOverride}
            onSlow={reduceQuality}
            onProductReady={setProductReady}
            onCue={playCue}
          />
          </div>
          <div className={styles.vignette} aria-hidden="true" />

          <header className={styles.topbar}>
            <Link href="/labs" className={styles.back}>← Back to Labs</Link>
            <span className={styles.labMark}>RAÚL ROMERO / LAB 001</span>
            <div className={styles.toolbar}>
              <button onClick={() => setPaused((value) => !value)} aria-pressed={paused}>{paused ? "Resume" : "Pause"}</button>
              <button onClick={toggleSound} aria-pressed={sound}>Sound {sound ? "on" : "off"}</button>
              <button onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); setReading(true); }}>Reading mode</button>
            </div>
          </header>

          <div className={styles.progressRail} aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>

          <div className={styles.chapters} aria-live="off">
            {PHASES.map((item) => (
              <section key={item.id} className={styles.chapter} data-phase={item.id} data-active={phase === item.id && (item.id !== "product" || productReady)} aria-hidden={phase !== item.id || (item.id === "product" && !productReady)}>
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
                    <h2 className={styles.finalTitle}>THREE INPUTS.<br />ONE WORKING<br />SYSTEM.</h2>
                    <p className={styles.lede}>Select a signal. Give it direction.</p>
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

          {phase === "product" && productReady && (
            <ProductPanel
              signals={displaySignals}
              order={order}
              setOrder={setOrder}
              selected={selected}
              setSelected={setSelected}
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

          <div className={styles.quality} aria-label="Experience settings">
            <button onClick={() => setQuality(quality === "high" ? "medium" : quality === "medium" ? "low" : "high")}>QUALITY / {quality.toUpperCase()}</button>
            <button onClick={() => setCalmOverride((value) => !value)} aria-pressed={reduced || calmOverride} disabled={reduced}>CALM / {reduced || calmOverride ? "ON" : "OFF"}</button>
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
      <section className={styles.staticHero}><p>THREE DISCIPLINES. ONE SYSTEM.</p><h1>CONVERGENCE</h1><span>Strategy × Design × Technology</span><div className={styles.staticHeroImage} aria-hidden="true"><StaticArt phase="attention" /></div></section>
      {PHASES.slice(1, 5).map((phase, index) => (
        <section key={phase.id} className={styles.staticChapter}>
          <span>{String(index + 1).padStart(2, "0")} / {phase.id === "attention" ? "MARKETING" : phase.id === "form" ? "DESIGN" : phase.id === "behavior" ? "DEVELOPMENT" : "SYSTEM"}</span>
          <h2>{phase.label}</h2><p>{phase.line}</p><div className={styles.staticDiagram} aria-hidden="true"><StaticArt phase={phase.id} /></div>
        </section>
      ))}
      <section className={styles.staticProduct}>
        <p>CONVERGENCE / LIVE SYSTEM</p><h2>THREE INPUTS. ONE WORKING SYSTEM.</h2>
        <p>Marketing brings attention.<br />Design gives it form.<br />Development makes it real.</p>
        <div className={styles.staticProductImage} aria-hidden="true"><StaticArt phase="product" /></div>
        <ProductPanel {...props} />
      </section>
    </main>
  );
}

function StaticArt({ phase }: { phase: Phase }) {
  return <div className={styles.staticArt} data-art={phase}>
    {(phase === "attention" || phase === "convergence") && <div className={styles.staticParticles}>{Array.from({ length: 108 }, (_, i) => <i key={i} style={{ left: `${(((Math.sin(i * 127.1) * 43758.5 % 1 + 1) % 1) * 100).toFixed(3)}%`, top: `${(((Math.sin(i * 38.7) * 8321.1 % 1 + 1) % 1) * 100).toFixed(3)}%`, opacity: Number((.18 + (i % 7) * .1).toFixed(2)), transform: `scale(${(.5 + i % 5 * .27).toFixed(2)})` }} />)}</div>}
    {(phase === "form" || phase === "convergence") && <div className={styles.staticGrid}><b>01 / HIERARCHY</b><em>INFORMATION HAS SHAPE</em></div>}
    {(phase === "behavior" || phase === "convergence") && <svg className={styles.staticRoutes} viewBox="0 0 600 480" fill="none" aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => <g key={i}><path d={`M 25 ${55 + i * 60} L 200 ${55 + i * 60} L 255 ${75 + i * 60} L 410 ${75 + i * 60} L 460 ${55 + i * 60} L 575 ${55 + i * 60}`} stroke="#acd8e6" strokeOpacity=".5" strokeWidth="1.3" /><circle cx="255" cy={75 + i * 60} r="5" fill="#b9e7f1" /><circle cx="460" cy={55 + i * 60} r="4" fill="#d8f0f5" /></g>)}
    </svg>}
    {phase === "product" && <div className={styles.staticSculpture}><div className={styles.staticOrbit} /><div className={styles.staticInlet} />{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ top: `${18 + i * 11}%`, transform: `rotate(${(i - 3) * 3}deg)` }} />)}</div>}
  </div>;
}
