export type Spring = { value: number; velocity: number };

// Exact critically damped solution for a fixed target during this frame.
// Its timing is stable at 30, 60 and 120 fps.
export function approach(state: Spring, target: number, frequency: number, dt: number) {
  const step = Math.min(Math.max(dt, 0), .5);
  const omega = Math.max(.001, frequency);
  const offset = state.value - target;
  const tangent = state.velocity + omega * offset;
  const decayed = Math.exp(-omega * step);
  state.value = target + (offset + tangent * step) * decayed;
  state.velocity = (state.velocity - omega * tangent * step) * decayed;
  return state.value;
}

export function decay(value: number, target: number, rate: number, dt: number) {
  return target + (value - target) * Math.exp(-rate * Math.min(Math.max(dt, 0), .5));
}
