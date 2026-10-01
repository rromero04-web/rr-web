export type Quality = "high" | "medium" | "low";
export type Discipline = 0 | 1 | 2;

export const CHAPTERS = [
  { id: "prelude", index: "00" },
  { id: "attention", index: "01" },
  { id: "form", index: "02" },
  { id: "behavior", index: "03" },
  { id: "convergence", index: "04" },
  { id: "product", index: "05" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

// Labels live in copy.ts, by the same order.
export const SIGNALS: { id: number; discipline: Discipline }[] = [
  { id: 1, discipline: 0 },
  { id: 2, discipline: 1 },
  { id: 3, discipline: 2 },
  { id: 4, discipline: 0 },
  { id: 5, discipline: 1 },
  { id: 6, discipline: 2 },
];

// Mutable state shared between the DOM and the render loop. Writing to it
// never re-renders React; the scene reads it once per frame.
export type SceneState = {
  stage: number;
  scrollVelocity: number;
  pointerX: number;
  pointerY: number;
  pointerActive: number;
  pointerSpeed: number;
  // Press and hold: a gravity well at the pointer.
  pointerDown: boolean;
  // Release or tap: a burst from where the pointer was, scaled by the hold.
  burstAt: number;
  burstX: number;
  burstY: number;
  burstPower: number;
  // Horizontal drag in pixels, consumed by the scene as rotation.
  drag: number;
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
    stage: 0, scrollVelocity: 0, pointerX: 0, pointerY: 0, pointerActive: 0, pointerSpeed: 0,
    pointerDown: false, burstAt: -100, burstX: 0, burstY: 0, burstPower: 0, drag: 0,
    pulseAt: -100, routeAt: -100, routeGroup: 0, routed: [0, 0, 0], complete: 0,
    calm: false, paused: false, snap: false, introAt: -1,
  };
}
