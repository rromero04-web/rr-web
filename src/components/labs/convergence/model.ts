export type Phase = "prelude" | "attention" | "form" | "behavior" | "convergence" | "product";
export type Quality = "high" | "medium" | "low";

export const PHASES: { id: Phase; start: number; label: string; line: string }[] = [
  { id: "prelude", start: 0, label: "PRELUDE", line: "Three disciplines. One system." },
  { id: "attention", start: .08, label: "ATTENTION", line: "Attention without direction is noise." },
  { id: "form", start: .28, label: "FORM", line: "Structure turns attention into meaning." },
  { id: "behavior", start: .46, label: "BEHAVIOR", line: "Ideas become real when they can respond." },
  { id: "convergence", start: .64, label: "CONVERGENCE", line: "The system becomes more than its parts." },
  { id: "product", start: .82, label: "PRODUCT", line: "A living digital product." },
];

export const SIGNALS = [
  { id: 1, label: "Clarify the offer", priority: 3 },
  { id: 2, label: "Reveal the next step", priority: 1 },
  { id: 3, label: "Reduce friction", priority: 5 },
  { id: 4, label: "Make the structure visible", priority: 2 },
  { id: 5, label: "Respond to intent", priority: 4 },
  { id: 6, label: "Connect the system", priority: 6 },
];

export function phaseAt(progress: number): Phase {
  for (let i = PHASES.length - 1; i >= 0; i--) if (progress >= PHASES[i].start) return PHASES[i].id;
  return "prelude";
}

export function smoothstep(value: number) {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
}

export function range(value: number, start: number, end: number) {
  return smoothstep((value - start) / (end - start));
}
