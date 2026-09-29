"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

// Un único trazo continuo —como la mano de un diseñador que no levanta la
// pluma— recorre las cinco fases y se redibuja en cada una:
//   01 entender  → garabato de notas que se desenreda en un «?»
//   02 definir   → mapa de ideas; las ramas descartadas se apagan y queda
//                  iluminado el camino elegido
//   03 diseñar   → boceto de una pantalla con guías de construcción
//   04 construir → el boceto se rellena y cada pieza recibe su ✓
//   05 lanzar    → la pantalla se pliega en un avión de papel que despega
// Todas las escenas son polilíneas remuestreadas al mismo número de puntos,
// así que pasar de una a otra es interpolar punto a punto.
// Decorativo: los pasos de arriba ya lo cuentan en texto.

const STAGES = 5;
const STAGE_MS = 3400;
const HOLD_MS = 1600;
const HEIGHT = 190;
const CY = 95;
const M = 280;
const MORPH_S = 1.5;
// Retraso de la transformación a lo largo de la línea (0 = todos a la vez).
const WAVE = 0.65;
// Altura (en unidades de S) del arco que describe el trazo al viajar.
const TRAVEL_ARC = 0.38;
const TAU = Math.PI * 2;

type V = [number, number, number?]; // x, y (unidades de S) y marca de resaltado del tramo que acaba aquí
type Pts = { x: Float32Array; y: Float32Array; hl: Uint8Array };

function resample(poly: V[]): Pts {
  const lengths = [0];
  for (let i = 1; i < poly.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]));
  }
  const total = lengths[lengths.length - 1] || 1;
  const out: Pts = { x: new Float32Array(M), y: new Float32Array(M), hl: new Uint8Array(M) };
  let j = 0;
  for (let k = 0; k < M; k++) {
    const target = (total * k) / (M - 1);
    while (j < poly.length - 2 && lengths[j + 1] < target) j++;
    const seg = lengths[j + 1] - lengths[j] || 1;
    const u = Math.min(1, Math.max(0, (target - lengths[j]) / seg));
    out.x[k] = poly[j][0] + (poly[j + 1][0] - poly[j][0]) * u;
    out.y[k] = poly[j][1] + (poly[j + 1][1] - poly[j][1]) * u;
    out.hl[k] = poly[j + 1][2] ?? 0;
  }
  return out;
}

const arc = (cx: number, cy: number, r: number, a0: number, a1: number, steps = 40): V[] =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / steps;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as V;
  });

// Redondea las esquinas de una polilínea (los giros de 180° se dejan igual).
function roundCorners(poly: V[], radius: number, steps = 7): V[] {
  const out: V[] = [poly[0]];
  for (let i = 1; i < poly.length - 1; i++) {
    const [ax, ay] = poly[i - 1];
    const [px, py, tagIn] = poly[i];
    const [bx, by, tagOut] = poly[i + 1];
    const lin = Math.hypot(px - ax, py - ay);
    const lout = Math.hypot(bx - px, by - py);
    if (lin === 0 || lout === 0) { out.push(poly[i]); continue; }
    const din = [(px - ax) / lin, (py - ay) / lin];
    const dout = [(bx - px) / lout, (by - py) / lout];
    const dot = din[0] * dout[0] + din[1] * dout[1];
    if (dot < -0.95 || dot > 0.999) { out.push(poly[i]); continue; }
    const r = Math.min(radius, lin * 0.45, lout * 0.45);
    const p0: [number, number] = [px - din[0] * r, py - din[1] * r];
    const p1: [number, number] = [px + dout[0] * r, py + dout[1] * r];
    out.push([p0[0], p0[1], tagIn]);
    for (let k = 1; k <= steps; k++) {
      const t = k / steps;
      const u = 1 - t;
      out.push([u * u * p0[0] + 2 * u * t * px + t * t * p1[0], u * u * p0[1] + 2 * u * t * py + t * t * p1[1], t < 0.5 ? tagIn : tagOut]);
    }
  }
  out.push(poly[poly.length - 1]);
  return out;
}

// Rama curva entre dos nodos (tangentes horizontales, como un mapa mental).
const branch = (a: readonly [number, number], b: readonly [number, number], tag: number, steps = 26): V[] =>
  Array.from({ length: steps }, (_, k) => {
    const t = (k + 1) / steps;
    const u = 1 - t;
    const dx = (b[0] - a[0]) * 0.55;
    const c1 = [a[0] + dx, a[1]];
    const c2 = [b[0] - dx, b[1]];
    return [
      u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0],
      u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1],
      tag,
    ] as V;
  });

const SCRIBBLE: V[] = Array.from({ length: 500 }, (_, i) => {
  const t = (i / 500) * TAU;
  return [0.95 * Math.sin(3 * t + 0.2) + 0.28 * Math.sin(7 * t + 1), 0.5 * Math.sin(4 * t + 0.5) + 0.2 * Math.cos(9 * t)] as V;
});

const QUESTION: V[] = [
  ...arc(0, -0.3, 0.36, Math.PI * 1.05, Math.PI * 2.35),
  [0.02, 0.1],
  [0.02, 0.3],
  [0.02, 0.44],
  ...arc(0.02, 0.53, 0.08, -Math.PI / 2, Math.PI * 1.5, 24),
];

// Mapa de ideas: raíz a la izquierda, tres ramas; el camino raíz → b → b2 → b2a
// es la solución (se recorre al final para que la pluma termine en ella).
const NODES = {
  root: [-1.25, 0], a: [-0.45, -0.62], b: [-0.45, 0], c: [-0.45, 0.62],
  b1: [0.45, -0.38], b2: [0.45, 0.34], b2a: [1.25, 0.08],
} as const satisfies Record<string, readonly [number, number]>;
const TREE_NODES: [number, number, boolean][] = [
  [...NODES.root, true], [...NODES.a, false], [...NODES.b, true], [...NODES.c, false],
  [...NODES.b1, false], [...NODES.b2, true], [...NODES.b2a, true],
];
const TREE: V[] = [
  [...NODES.root],
  ...branch(NODES.root, NODES.a, 0), ...branch(NODES.a, NODES.root, 0),
  ...branch(NODES.root, NODES.c, 0), ...branch(NODES.c, NODES.root, 0),
  ...branch(NODES.root, NODES.b, 1), ...branch(NODES.b, NODES.b1, 0), ...branch(NODES.b1, NODES.b, 0),
  ...branch(NODES.b, NODES.b2, 1), ...branch(NODES.b2, NODES.b2a, 1),
];

// Boceto de pantalla: marco, cabecera, bloque principal y tres tarjetas.
const WIRE: V[] = [
  [-1.2, -0.8], [1.2, -0.8], [1.2, 0.8], [-1.2, 0.8], [-1.2, -0.8],
  [-1.2, -0.52], [1.2, -0.52],
  [0.98, -0.38], [-0.98, -0.38], [-0.98, 0.12], [0.98, 0.12], [0.98, -0.38], [0.98, 0.12],
  [0.98, 0.28], [0.98, 0.62], [0.36, 0.62], [0.36, 0.28], [0.26, 0.28], [0.26, 0.62], [-0.36, 0.62],
  [-0.36, 0.28], [-0.46, 0.28], [-0.46, 0.62], [-0.98, 0.62], [-0.98, 0.28], [0.98, 0.28],
];
// x0, y0, x1, y1 e instante (s) en que se rellena cada pieza en la fase 4.
const WIRE_FILLS: [number, number, number, number, number][] = [
  [-0.98, -0.38, 0.98, 0.12, 0.7],
  [-0.98, 0.28, -0.46, 0.62, 1.15],
  [-0.36, 0.28, 0.26, 0.62, 1.4],
  [0.36, 0.28, 0.98, 0.62, 1.65],
];

const PLANE: V[] = [
  [1.15, -0.1], [-0.95, -0.62], [-0.4, 0.02], [1.15, -0.1], [-0.62, 0.52], [-0.4, 0.02], [-0.3, 0.3],
];

const SCENES = {
  scribble: resample(SCRIBBLE),
  question: resample(QUESTION),
  tree: resample(TREE),
  wire: resample(roundCorners(WIRE, 0.07)),
  plane: resample(roundCorners(PLANE, 0.06)),
};
const SCENE_BY_STAGE = [SCENES.question, SCENES.tree, SCENES.wire, SCENES.wire, SCENES.plane];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

function slotPositions(width: number, offset: number) {
  // En escritorio cada fase se centra bajo la columna de su paso (misma
  // rejilla de 5 columnas con 20px de hueco que .rr-steps).
  if (width >= 1000) {
    const column = (width - 4 * 20) / 5;
    return Array.from({ length: STAGES }, (_, i) => offset + i * (column + 20) + column / 2);
  }
  return Array.from({ length: STAGES }, (_, i) => offset + 70 + (i * (width - 140)) / (STAGES - 1));
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(callback: () => void) {
  const mql = window.matchMedia(REDUCED_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const getReducedServer = () => false;

export function ProcessStory() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState(-1);
  const visibleRef = useRef(false);
  const loopRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getReducedServer);

  useEffect(() => {
    visibleRef.current = visible;
    if (visible) loopRef.current?.start();
    else loopRef.current?.stop();
  }, [visible]);

  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let slots: number[] = [];
    let S = 46;

    const resize = () => {
      width = wrap.clientWidth;
      const steps = wrap.parentElement?.querySelector(".rr-steps");
      const canvasLeft = wrap.getBoundingClientRect().left;
      const stepsRect = steps?.getBoundingClientRect();
      const gridWidth = stepsRect?.width ?? width;
      slots = slotPositions(gridWidth, stepsRect ? stepsRect.left - canvasLeft : 0);
      S = gridWidth >= 700 ? 56 : 38;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(HEIGHT * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // ---------- Dibujo ----------
    type Frame = { cx: number; cy: number; scale: number; angle: number };
    const toWorld = (f: Frame, x: number, y: number): [number, number] => {
      const sx = x * S * f.scale;
      const sy = y * S * f.scale;
      const c = Math.cos(f.angle);
      const s = Math.sin(f.angle);
      return [f.cx + sx * c - sy * s, f.cy + sx * s + sy * c];
    };

    // Desplazamiento de cada punto mientras viaja entre fases (unidades de S)
    // y reloj del pulso de mano; los rellena el bucle de animación.
    const ox = new Float32Array(M);
    const oy = new Float32Array(M);
    let wobbleT = 0;

    // Posición final de un punto: forma + viaje + un temblor mínimo de mano
    // alzada para que el trazo nunca parezca un vector quieto.
    const pointAt = (f: Frame, pts: Pts, i: number): [number, number] =>
      toWorld(
        f,
        pts.x[i] + ox[i] + 0.011 * Math.sin(i * 0.09 + wobbleT * 1.4) + 0.006 * Math.sin(i * 0.23 - wobbleT * 0.8),
        pts.y[i] + oy[i] + 0.011 * Math.cos(i * 0.07 - wobbleT * 1.1) + 0.006 * Math.sin(i * 0.31 + wobbleT * 0.6),
      );

    const haloPath = (f: Frame, pts: Pts, count: number, filter: ((i: number) => boolean) | null) => {
      ctx.beginPath();
      for (let i = 1; i < count; i++) {
        if (filter && !filter(i)) continue;
        const [px, py] = pointAt(f, pts, i - 1);
        const [wx, wy] = pointAt(f, pts, i);
        if (i === 1 || filter) ctx.moveTo(px, py);
        ctx.lineTo(wx, wy);
      }
      ctx.stroke();
    };

    // Trazo de pincel: más grueso en el cuerpo, afinado en los extremos y con
    // una presión que varía suavemente a lo largo de la línea.
    const brush = (f: Frame, pts: Pts, count: number, base: number, filter: ((i: number) => boolean) | null) => {
      let [px, py] = pointAt(f, pts, 0);
      for (let i = 1; i < count; i++) {
        const [wx, wy] = pointAt(f, pts, i);
        if (!filter || filter(i)) {
          const taper = Math.min(1, i / 22, (count - 1 - i) / 14 + 0.25);
          const pressure = 0.82 + 0.3 * Math.sin(i * 0.045 + wobbleT * 0.7);
          ctx.lineWidth = base * (0.3 + 0.7 * Math.max(0, taper)) * pressure;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(wx, wy);
          ctx.stroke();
        }
        px = wx;
        py = wy;
      }
    };

    const drawLine = (f: Frame, pts: Pts, count: number, dim: number, hl: number) => {
      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      const glow = 1 - 0.6 * dim;
      ctx.lineWidth = 9;
      ctx.strokeStyle = `rgba(40, 85, 255, ${0.09 * glow})`;
      haloPath(f, pts, count, null);
      ctx.lineWidth = 3.6;
      ctx.strokeStyle = `rgba(123, 150, 255, ${0.16 * glow})`;
      haloPath(f, pts, count, null);
      ctx.strokeStyle = `rgba(238, 242, 255, ${0.95 - 0.68 * dim})`;
      brush(f, pts, count, 2, null);
      if (hl > 0.01) {
        const chosen = (i: number) => SCENES.tree.hl[i] === 1;
        ctx.lineWidth = 10;
        ctx.strokeStyle = `rgba(40, 85, 255, ${0.3 * hl})`;
        haloPath(f, pts, count, chosen);
        ctx.strokeStyle = `rgba(165, 184, 255, ${hl})`;
        brush(f, pts, count, 2.8, chosen);
      }
      ctx.restore();
    };

    const drawTreeNodes = (f: Frame, alpha: number, dim: number, pulse: number) => {
      if (alpha < 0.01) return;
      ctx.save();
      for (const [x, y, chosen] of TREE_NODES) {
        const [wx, wy] = toWorld(f, x, y);
        ctx.beginPath();
        ctx.arc(wx, wy, chosen ? 4 : 3, 0, TAU);
        ctx.fillStyle = chosen ? `rgba(143, 166, 255, ${alpha})` : `rgba(226, 232, 255, ${alpha * (1 - 0.7 * dim)})`;
        ctx.fill();
      }
      if (pulse > 0) {
        const [wx, wy] = toWorld(f, NODES.b2a[0], NODES.b2a[1]);
        ctx.strokeStyle = `rgba(143, 166, 255, ${alpha * (1 - pulse)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(wx, wy, 5 + pulse * 16, 0, TAU);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Guías de construcción del boceto: líneas discontinuas que sobresalen del
    // marco y una cota de anchura, como en una lámina de diseño.
    const drawGuides = (f: Frame, alpha: number) => {
      if (alpha < 0.01) return;
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(143, 166, 255, ${0.34 * alpha})`;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      for (const y of [-0.8, -0.52, 0.28, 0.8]) {
        const [x0, y0] = toWorld(f, -1.6, y);
        const [x1, y1] = toWorld(f, 1.6, y);
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }
      for (const x of [-1.2, 0, 1.2]) {
        const [x0, y0] = toWorld(f, x, -1.05);
        const [x1, y1] = toWorld(f, x, 1.05);
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(226, 232, 255, ${0.6 * alpha})`;
      ctx.beginPath();
      const [a0, ay] = toWorld(f, -1.2, -0.98);
      const [a1] = toWorld(f, 1.2, -0.98);
      ctx.moveTo(a0, ay);
      ctx.lineTo(a1, ay);
      ctx.moveTo(a0, ay - 4);
      ctx.lineTo(a0, ay + 4);
      ctx.moveTo(a1, ay - 4);
      ctx.lineTo(a1, ay + 4);
      ctx.stroke();
      ctx.restore();
    };

    // Relleno de las piezas del boceto y marca ✓ al validarlas.
    const drawFills = (f: Frame, time: number, fade: number) => {
      if (fade < 0.01) return;
      ctx.save();
      WIRE_FILLS.forEach(([x0, y0, x1, y1, at], index) => {
        const a = clamp01((time - at) / 0.35) * fade;
        if (a <= 0) return;
        const [wx0, wy0] = toWorld(f, x0, y0);
        const [wx1, wy1] = toWorld(f, x1, y1);
        ctx.fillStyle = index === 0 ? `rgba(40, 85, 255, ${0.32 * a})` : `rgba(143, 166, 255, ${0.16 * a})`;
        ctx.fillRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
        if (index === 0) {
          const [bx0, by0] = toWorld(f, -0.8, -0.1);
          const [bx1, by1] = toWorld(f, -0.3, 0.02);
          ctx.fillStyle = `rgba(143, 166, 255, ${0.9 * a})`;
          ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
        }
        const tick = clamp01((time - at - 0.3) / 0.25) * fade;
        if (tick > 0) {
          const [tx, ty] = toWorld(f, x1 - 0.14, y0 + 0.14);
          ctx.strokeStyle = `rgba(61, 220, 151, ${tick})`;
          ctx.lineWidth = 1.8;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(tx - 4, ty);
          ctx.lineTo(tx - 1, ty + 3);
          ctx.lineTo(tx + 5, ty - 4);
          ctx.stroke();
        }
      });
      ctx.restore();
    };

    const drawNib = (x: number, y: number, alpha: number) => {
      if (alpha < 0.01) return;
      ctx.save();
      const halo = ctx.createRadialGradient(x, y, 0, x, y, 14);
      halo.addColorStop(0, `rgba(143, 166, 255, ${0.6 * alpha})`);
      halo.addColorStop(1, "rgba(143, 166, 255, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, TAU);
      ctx.fill();
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, TAU);
      ctx.fill();
      ctx.restore();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, HEIGHT);
      slots.forEach((cx, k) => {
        const f = { cx, cy: CY, scale: 0.62, angle: k === 4 ? -0.2 : 0 };
        if (k === 2) drawGuides(f, 1);
        if (k === 3) drawFills(f, 10, 1);
        drawLine(f, SCENE_BY_STAGE[k], M, k === 1 ? 1 : 0, k === 1 ? 1 : 0);
        if (k === 1) drawTreeNodes(f, 1, 1, 0);
      });
    };

    if (reduced) {
      drawStatic();
      const onResize = () => { resize(); drawStatic(); };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    // ---------- Estado de la animación ----------
    const newPts = (): Pts => ({ x: new Float32Array(M), y: new Float32Array(M), hl: new Uint8Array(M) });
    const copy = (dst: Pts, src: Pts) => { dst.x.set(src.x); dst.y.set(src.y); };
    const disp = newPts();
    const from = newPts();
    let to: Pts = SCENES.scribble;
    copy(disp, SCENES.scribble);

    // El guion de fases vive aquí, en tiempo de simulación, para que la
    // ilustración y el paso iluminado arriba nunca se desincronicen.
    let current = -1;
    let lastStage = -2;
    let tStage = 0;
    let time = 0;
    let reveal = 0;
    let morph = 1;
    let posFrom = 0;
    let posTo = 0;
    let pos = -200;
    let questionDone = false;
    let dim = 0;
    let hl = 0;
    let guides = 0;
    let fillFade = 0;
    let flying = false;
    let flightT = 0;

    const startMorph = (target: Pts, nextPos: number) => {
      copy(from, disp);
      to = target;
      morph = 0;
      posFrom = pos;
      posTo = nextPos;
    };

    const setCurrent = (value: number) => {
      current = value;
      tStage = 0;
      setStage(value);
    };

    const update = (dt: number) => {
      time += dt;
      tStage += dt;
      if (current === -1 && tStage > 0.3) setCurrent(0);
      else if (current >= 0 && current < STAGES - 1 && !flying && tStage > STAGE_MS / 1000) setCurrent(current + 1);

      if (current !== lastStage) {
        lastStage = current;
        tStage = 0;
        if (current === 0) {
          copy(disp, SCENES.scribble);
          reveal = 0;
          morph = 1;
          pos = posFrom = posTo = slots[0];
          questionDone = false;
          flying = false;
        } else if (current > 0) {
          startMorph(SCENE_BY_STAGE[current], slots[current]);
        }
      }
      if (current < 0) return;

      if (current === 0) {
        reveal = Math.min(1, reveal + dt / 1.2);
        if (!questionDone && tStage > 1.7) {
          questionDone = true;
          startMorph(SCENES.question, slots[0]);
        }
      }

      wobbleT += dt;
      if (morph < 1) {
        morph = Math.min(1, morph + dt / MORPH_S);
        pos = posFrom + (posTo - posFrom) * ease(morph);
        const travels = posTo !== posFrom;
        for (let i = 0; i < M; i++) {
          // La transformación recorre la línea como una ola: empieza en la
          // punta de la pluma (final) y termina en la cola.
          const local = ease(clamp01(morph * (1 + WAVE) - WAVE * (1 - i / (M - 1))));
          disp.x[i] = from.x[i] + (to.x[i] - from.x[i]) * local;
          disp.y[i] = from.y[i] + (to.y[i] - from.y[i]) * local;
          // Al viajar, cada punto sigue su propio arco: el dibujo se estira
          // como una cinta y la cola llega detrás de la cabeza.
          ox[i] = travels ? (posFrom + (posTo - posFrom) * local - pos) / S : 0;
          oy[i] = travels ? -Math.sin(local * Math.PI) * TRAVEL_ARC : 0;
        }
      } else if (ox[0] !== 0 || oy[0] !== 0) {
        ox.fill(0);
        oy.fill(0);
      }

      const k = 1 - Math.exp(-dt * 4);
      dim += ((current === 1 && tStage > 1.4 ? 1 : 0) - dim) * k;
      hl += ((current === 1 && tStage > 1.2 ? 1 : 0) - hl) * k;
      guides += ((current === 2 && tStage > 0.9 ? 1 : 0) - guides) * k;
      fillFade += ((current === 3 ? 1 : 0) - fillFade) * k;

      if (current === STAGES - 1 && !flying && tStage > HOLD_MS / 1000 + MORPH_S) {
        flying = true;
        flightT = 0;
      }
      if (flying) {
        flightT += dt;
        if (flightT > 3.4) {
          flying = false;
          lastStage = -2;
          setCurrent(0);
        }
      }
    };

    // Despegue del avión: acelera hacia la derecha y sube en curva.
    const planeFrame = (): Frame => {
      const t = clamp01(flightT / 1.7);
      const e = t * t * t;
      return {
        cx: slots[STAGES - 1] + e * (width + 260 - slots[STAGES - 1]),
        cy: CY - 58 * Math.sin((t * Math.PI) / 2) * e,
        scale: 1 - 0.25 * e,
        angle: -0.32 * Math.min(1, t * 1.6),
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, HEIGHT);
      if (current < 0) return;

      const f: Frame = flying ? planeFrame() : { cx: pos, cy: CY, scale: 1, angle: 0 };

      drawGuides(f, guides);
      drawFills(f, current === 3 ? tStage : 10, fillFade);

      const count = Math.max(2, Math.floor(reveal * (M - 1)) + 1);
      drawLine(f, disp, count, dim, hl);
      drawTreeNodes(f, hl, dim, current === 1 && tStage > 1.6 ? ((tStage - 1.6) % 1.2) / 1.2 : 0);

      // Punta de la pluma: visible mientras el trazo se dibuja o se transforma.
      const drawing = reveal < 1 || morph < 1;
      const [nx, ny] = toWorld(f, disp.x[count - 1], disp.y[count - 1]);
      drawNib(nx, ny, drawing ? 1 : 0.35 + 0.15 * Math.sin(time * 3));
    };

    const STEP = 1 / 60;
    let accumulator = 0;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      accumulator += Math.min((now - last) / 1000, 1);
      last = now;
      while (accumulator >= STEP) {
        update(STEP);
        accumulator -= STEP;
      }
      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || !visibleRef.current || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    loopRef.current = { start, stop };
    start();
    return () => {
      loopRef.current = null;
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <div ref={wrapRef} aria-hidden="true" className={cn("rr-story", reduced && "is-static")} data-stage={reduced ? -1 : stage}>
      <canvas ref={canvasRef} />
    </div>
  );
}
