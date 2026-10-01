export type Quality = "high" | "medium" | "low";
export type Discipline = 0 | 1 | 2;

export const DISCIPLINES = ["Marketing", "Design", "Development"] as const;

export const CHAPTERS = [
  { id: "prelude", index: "00", label: "Prelude" },
  { id: "attention", index: "01", label: "Attention" },
  { id: "form", index: "02", label: "Form" },
  { id: "behavior", index: "03", label: "Behavior" },
  { id: "convergence", index: "04", label: "Convergence" },
  { id: "product", index: "05", label: "Product" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

export const SIGNALS: { id: number; label: string; discipline: Discipline }[] = [
  { id: 1, label: "Clarify the offer", discipline: 0 },
  { id: 2, label: "Make the structure visible", discipline: 1 },
  { id: 3, label: "Respond to intent", discipline: 2 },
  { id: 4, label: "Earn the first glance", discipline: 0 },
  { id: 5, label: "Reveal the next step", discipline: 1 },
  { id: 6, label: "Remove the friction", discipline: 2 },
];

// Mutable state shared between the DOM and the render loop. Writing to it
// never re-renders React; the scene reads it once per frame.
export type SceneState = {
  stage: number;
  scrollVelocity: number;
  pointerX: number;
  pointerY: number;
  pointerActive: number;
  pulseAt: number;
  routeAt: number;
  routeGroup: number;
  routed: [number, number, number];
  complete: number;
  calm: boolean;
  paused: boolean;
  // Capture mode skips smoothing so stills can be rendered on slow machines.
  snap: boolean;
  // When the visitor entered; the intro is timed from here.
  introAt: number;
};

export function createSceneState(): SceneState {
  return {
    stage: 0, scrollVelocity: 0, pointerX: 0, pointerY: 0, pointerActive: 0,
    pulseAt: -100, routeAt: -100, routeGroup: 0, routed: [0, 0, 0], complete: 0,
    calm: false, paused: false, snap: false, introAt: -1,
  };
}
