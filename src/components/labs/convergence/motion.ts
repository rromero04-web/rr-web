export type Spring = { value: number; velocity: number };

// Exact critically damped solution for a fixed target during this frame.
// Its timing is stable at 30, 60 and 120 fps.
export function approach(state: Spring, target: number, frequency: number, dt: number) {
  const step = Math.min(Math.max(dt, 0), .05);
  const omega = Math.max(.001, frequency);
  const offset = state.value - target;
  const tangent = state.velocity + omega * offset;
  const decay = Math.exp(-omega * step);
  state.value = target + (offset + tangent * step) * decay;
  state.velocity = (state.velocity - omega * tangent * step) * decay;
  return state.value;
}

export function decay(value: number, target: number, rate: number, dt: number) {
  return target + (value - target) * Math.exp(-rate * Math.min(Math.max(dt, 0), .05));
}

export function windowed(value: number, start: number, end: number) {
  const x = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return x * x * (3 - 2 * x);
}

export type MotionState = {
  raw: number;
  playhead: Spring;
  rawVelocity: number;
  previousRaw: number;
  direction: number;
  scrollEnergy: number;
  cameraSpeed: number;
  time: number;
  impactAge: number;
  impactSerial: number;
  previousPlayhead: number;
  pointerX: number;
  pointerY: number;
  pointerVx: number;
  pointerVy: number;
  pointerWake: number;
  alignment: number;
  previousAlignment: number;
  alignmentAge: number;
  fieldEnergy: number;
  previousPointerX: number;
  previousPointerY: number;
  pulseAge: number;
  pulseSerial: number;
  selectedSignal: number | null;
};

export function createMotionState(): MotionState {
  return {
    raw: 0, playhead: { value: 0, velocity: 0 }, rawVelocity: 0, previousRaw: 0,
    direction: 0, scrollEnergy: 0, cameraSpeed: 0, time: 0,
    impactAge: 20, impactSerial: 0, previousPlayhead: 0,
    pointerX: 0, pointerY: 0, pointerVx: 0, pointerVy: 0, pointerWake: 0,
    alignment: 0, previousAlignment: 0, alignmentAge: 20, fieldEnergy: 0,
    previousPointerX: 0, previousPointerY: 0, pulseAge: 20, pulseSerial: 0,
    selectedSignal: null,
  };
}
