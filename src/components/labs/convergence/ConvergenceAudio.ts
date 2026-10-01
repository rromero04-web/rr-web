"use client";

// Procedural score. No audio files and no continuous noise: everything that
// sounds is pitched to the chord of the current chapter.
//
// Pad           a slowly breathing chord that follows the chapters (Dm → D)
// Scroll        glassy grains whose density follows scroll speed
// Attention     water-drop tones under the moving pointer
// Form          a quiet arpeggio: structure you can hear
// Behavior      a sparse 16th-note data pattern
// Convergence   a tonal riser and an impact; the product resolves in D major
// Hold/release  a rising gravity drone, then a burst

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

const CHORDS = [
  [38, 45, 50, 53, 57], // Dm
  [38, 45, 52, 53, 60], // Dm(add9)
  [34, 41, 50, 57, 60], // Bbmaj7
  [36, 43, 52, 55, 59], // Cmaj7
  [33, 40, 45, 49, 52], // A
  [38, 45, 54, 57, 64], // D(add9)
];
// Upper-register colour tones per chapter, used by grains, drops and bells.
const SPARKLE = [
  [62, 65, 69, 72, 74, 77],
  [62, 64, 65, 69, 72, 76],
  [62, 65, 69, 70, 74, 77],
  [64, 67, 71, 72, 74, 79],
  [64, 69, 71, 73, 76, 81],
  [66, 69, 71, 74, 78, 81],
];
const ROUTE_SCALE = [[62, 66, 69], [64, 67, 71], [69, 73, 76]];
const DATA_PATTERN = [1, 0, 0.6, 1, 0, 0.6, 0, 1, 1, 0, 0.6, 0, 1, 0.6, 0, 0.6];

export type AudioFrame = {
  stage: number; velocity: number; pointerX: number; pointerSpeed: number;
  hold: boolean; calm: boolean; mobile: boolean;
};

type Voice = { a: OscillatorNode; b: OscillatorNode };

export class ConvergenceAudio {
  private readonly ctx: AudioContext;
  private readonly master: GainNode;
  private readonly dry: GainNode;
  private readonly reverbSend: GainNode;
  private readonly delaySend: GainNode;
  private readonly padFilter: BiquadFilterNode;
  private readonly padGain: GainNode;
  private readonly voices: Voice[] = [];
  private readonly sub: OscillatorNode;
  private readonly subGain: GainNode;
  private readonly well: { a: OscillatorNode; b: OscillatorNode; gain: GainNode; filter: BiquadFilterNode };
  private readonly noise: AudioBuffer;
  private enabled = false;
  private disposed = false;
  private chord = -1;
  private chapter = 0;
  private lastStage = 0;
  private lastUpdate = 0;
  private grainAt = 0;
  private dropAt = 0;
  private stepAt = 0;
  private step = 0;
  private bellAt = 0;
  private holdSince = -1;
  private suspendTimer: number | null = null;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.ratio.value = 3;
    compressor.connect(ctx.destination);
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(compressor);
    this.dry = ctx.createGain();
    this.dry.gain.value = 0.75;
    this.dry.connect(this.master);

    // Only used for very short transients.
    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    // A dark generated hall: filtered decaying noise, stereo.
    const reverb = ctx.createConvolver();
    const length = Math.round(ctx.sampleRate * 5);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const channel = impulse.getChannelData(c);
      let smooth = 0;
      for (let i = 0; i < length; i++) {
        const progress = i / length;
        smooth += ((Math.random() * 2 - 1) - smooth) * (0.5 - progress * 0.42);
        channel[i] = smooth * Math.pow(1 - progress, 2.6);
      }
    }
    reverb.buffer = impulse;
    const wet = ctx.createGain();
    wet.gain.value = 0.9;
    reverb.connect(wet).connect(this.master);
    this.reverbSend = ctx.createGain();
    this.reverbSend.connect(reverb);

    // Ping-pong delay for grains and bells.
    this.delaySend = ctx.createGain();
    const left = ctx.createDelay(1), right = ctx.createDelay(1);
    left.delayTime.value = 0.375; right.delayTime.value = 0.5;
    const feedback = ctx.createGain(); feedback.gain.value = 0.38;
    const tone = ctx.createBiquadFilter(); tone.type = "lowpass"; tone.frequency.value = 3200;
    const merge = ctx.createChannelMerger(2);
    this.delaySend.connect(left);
    left.connect(right); right.connect(tone).connect(feedback).connect(left);
    left.connect(merge, 0, 0); right.connect(merge, 0, 1);
    const delayOut = ctx.createGain(); delayOut.gain.value = 0.55;
    merge.connect(delayOut);
    delayOut.connect(this.master); delayOut.connect(this.reverbSend);

    // Pad: two detuned oscillators per note, through a breathing low-pass.
    this.padFilter = ctx.createBiquadFilter();
    this.padFilter.type = "lowpass";
    this.padFilter.frequency.value = 500;
    this.padFilter.Q.value = 0.7;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.06;
    const lfoDepth = ctx.createGain(); lfoDepth.gain.value = 220;
    lfo.connect(lfoDepth).connect(this.padFilter.frequency); lfo.start();
    this.padGain = ctx.createGain();
    this.padGain.gain.value = 0;
    this.padFilter.connect(this.padGain);
    this.padGain.connect(this.dry); this.padGain.connect(this.reverbSend);
    CHORDS[0].forEach((note, i) => {
      const a = ctx.createOscillator(), b = ctx.createOscillator();
      a.type = "sawtooth"; b.type = "triangle";
      a.frequency.value = hz(note); b.frequency.value = hz(note);
      a.detune.value = -7 - i * 1.5; b.detune.value = 6 + i * 1.5;
      const g = ctx.createGain(); g.gain.value = 0.045 / (1 + i * 0.3);
      const pan = ctx.createStereoPanner(); pan.pan.value = (i / 4 - 0.5) * 0.9;
      a.connect(g); b.connect(g); g.connect(pan).connect(this.padFilter);
      a.start(); b.start();
      this.voices.push({ a, b });
    });

    this.sub = ctx.createOscillator(); this.sub.type = "sine"; this.sub.frequency.value = hz(26);
    this.subGain = ctx.createGain(); this.subGain.gain.value = 0;
    this.sub.connect(this.subGain).connect(this.dry); this.sub.start();

    // Gravity well: silent until the visitor holds.
    const wa = ctx.createOscillator(), wb = ctx.createOscillator();
    wa.type = "sawtooth"; wb.type = "sawtooth";
    wa.frequency.value = hz(38); wb.frequency.value = hz(38); wb.detune.value = 12;
    const wf = ctx.createBiquadFilter(); wf.type = "lowpass"; wf.frequency.value = 200; wf.Q.value = 6;
    const wg = ctx.createGain(); wg.gain.value = 0;
    wa.connect(wf); wb.connect(wf); wf.connect(wg); wg.connect(this.dry); wg.connect(this.reverbSend);
    wa.start(); wb.start();
    this.well = { a: wa, b: wb, gain: wg, filter: wf };
  }

  private glide(param: AudioParam, value: number, time = 0.1) {
    param.setTargetAtTime(value, this.ctx.currentTime, time);
  }

  private get live() { return this.enabled && !this.disposed && this.ctx.state === "running"; }

  async enable() {
    if (this.disposed) return;
    if (this.suspendTimer !== null) window.clearTimeout(this.suspendTimer);
    await this.ctx.resume();
    this.enabled = true;
    this.glide(this.master.gain, 1.4, 0.5);
  }

  disable() {
    this.enabled = false;
    this.glide(this.master.gain, 0, 0.08);
    this.suspendTimer = window.setTimeout(() => {
      if (!this.enabled && !this.disposed) void this.ctx.suspend();
    }, 600);
  }

  update(frame: AudioFrame) {
    if (!this.live) return;
    const now = this.ctx.currentTime;
    if (now - this.lastUpdate < 0.025) return;
    this.lastUpdate = now;
    const s = clamp(frame.stage, 0, 5);
    const nearest = Math.round(s);
    this.chapter = nearest;
    if (nearest !== this.chord) {
      this.chord = nearest;
      CHORDS[nearest].forEach((note, i) => {
        this.glide(this.voices[i].a.frequency, hz(note), 0.7);
        this.glide(this.voices[i].b.frequency, hz(note), 0.85);
      });
      this.glide(this.sub.frequency, hz(CHORDS[nearest][0] - 12), 0.6);
    }
    const speed = clamp(Math.abs(frame.velocity) * 0.9);
    const core = Math.exp(-Math.pow((s - 4) * 2.2, 2));
    const product = clamp((s - 4.5) * 2);
    const calm = frame.calm ? 0.6 : 1;
    this.glide(this.padGain.gain, (0.3 + product * 0.1 - core * 0.1) * calm, 0.4);
    this.glide(this.padFilter.frequency, 420 + s * 140 + speed * 900 + product * 600, 0.25);
    this.glide(this.subGain.gain, 0.05 + core * 0.2, 0.3);

    const attention = clamp(1 - Math.abs(s - 1) * 1.5);
    const form = clamp(1 - Math.abs(s - 2) * 1.6);
    const behavior = clamp(1 - Math.abs(s - 3) * 1.6);

    // Scroll grains: the faster the scroll, the denser the shimmer.
    if (speed > 0.04 && now >= this.grainAt) {
      const notes = SPARKLE[nearest];
      const note = notes[Math.floor(Math.random() * notes.length)] + (Math.random() < 0.3 ? 12 : 0);
      this.bell(hz(note), 0.02 + speed * 0.05, (Math.random() - 0.5) * 1.4, 0.9 + Math.random() * 1.2, now);
      this.grainAt = now + (0.05 + Math.random() * 0.08) / (0.25 + speed * (frame.mobile ? 0.8 : 1.4));
    }

    // Attention: drops under the moving pointer.
    if (attention > 0.2 && frame.pointerSpeed > 0.08 && now >= this.dropAt) {
      const notes = SPARKLE[1];
      const note = notes[Math.floor(Math.random() * notes.length)] - 12 * (Math.random() < 0.4 ? 1 : 0);
      this.drop(hz(note), 0.1 * attention * (0.4 + frame.pointerSpeed), frame.pointerX * 0.8, now);
      this.dropAt = now + 0.07 + (1 - frame.pointerSpeed) * 0.25 + Math.random() * 0.06;
    }

    // Form and Behavior share a 16th-note clock.
    if (now >= this.stepAt) {
      const sixteenth = 0.125;
      if (form > 0.25) {
        const chord = CHORDS[2];
        const order = [2, 3, 4, 3, 2, 1, 2, 4];
        if (this.step % 2 === 0) this.pluck(hz(chord[order[(this.step / 2) % order.length]] + 12), 0.08 * form * calm, (this.step % 4 === 0 ? -0.3 : 0.3), now);
      }
      if (behavior > 0.25) {
        const hit = DATA_PATTERN[this.step % DATA_PATTERN.length];
        if (hit > 0 && Math.random() < 0.85) {
          const notes = SPARKLE[3];
          this.blip(hz(notes[(this.step * 5) % notes.length] + 12), 0.05 * behavior * hit * calm, ((this.step % 3) - 1) * 0.6, now);
        }
        if (this.step % 8 === 0) this.pluck(hz(CHORDS[3][0] + 12), 0.09 * behavior * calm, 0, now, 0.5);
      }
      this.step++;
      this.stepAt = Math.max(now, this.stepAt) + sixteenth;
    }

    // Product: sparse bells around the living system.
    if (product > 0.5 && now >= this.bellAt) {
      const notes = SPARKLE[5];
      this.bell(hz(notes[Math.floor(Math.random() * notes.length)]), 0.04 * calm, (Math.random() - 0.5) * 1.2, 2.4, now);
      this.bellAt = now + 1.4 + Math.random() * 1.8;
    }

    // Gravity well: rises while held.
    if (frame.hold && this.holdSince >= 0) {
      const held = clamp((now - this.holdSince) / 2.5);
      const root = hz(CHORDS[nearest][0]);
      this.glide(this.well.a.frequency, root * (1 + held * 0.5), 0.2);
      this.glide(this.well.b.frequency, root * (1 + held * 0.5) * 1.5, 0.2);
      this.glide(this.well.filter.frequency, 200 + held * 2200, 0.2);
      this.glide(this.well.gain.gain, 0.03 + held * 0.06, 0.15);
    }

    if (this.lastStage < 3.55 && s >= 3.55) this.riser();
    if (this.lastStage < 4.55 && s >= 4.55) this.impact();
    this.lastStage = s;
  }

  // --- voices -------------------------------------------------------------

  private out(node: AudioNode, pan: number, reverb: number, delay = 0) {
    const p = this.ctx.createStereoPanner();
    p.pan.value = clamp(pan, -1, 1);
    node.connect(p);
    p.connect(this.dry);
    const r = this.ctx.createGain(); r.gain.value = reverb; p.connect(r).connect(this.reverbSend);
    const d = this.ctx.createGain(); d.gain.value = delay; p.connect(d).connect(this.delaySend);
    return () => { p.disconnect(); r.disconnect(); d.disconnect(); };
  }

  private env(gain: GainNode, start: number, attack: number, level: number, decay: number) {
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, level), start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + decay);
  }

  private osc(type: OscillatorType, freq: number, start: number, stop: number, pan: number, reverb: number, delay: number,
    shape: (gain: GainNode, osc: OscillatorNode) => void) {
    if (!this.live) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, start);
    shape(g, o);
    o.connect(g);
    const release = this.out(g, pan, reverb, delay);
    o.onended = () => { o.disconnect(); g.disconnect(); release(); };
    o.start(start); o.stop(stop);
  }

  // Glassy, slow decay: two partials.
  private bell(freq: number, level: number, pan: number, decay: number, start = this.ctx.currentTime) {
    this.osc("sine", freq, start, start + decay + 0.1, pan, 0.8, 0.5, (g) => this.env(g, start, 0.006, level, decay));
    this.osc("sine", freq * 2.76, start, start + decay * 0.4 + 0.1, pan, 0.6, 0.3, (g) => this.env(g, start, 0.003, level * 0.18, decay * 0.4));
  }

  // A water drop: a quick upward sweep that fades.
  private drop(freq: number, level: number, pan: number, start = this.ctx.currentTime) {
    this.osc("sine", freq, start, start + 0.35, pan, 0.6, 0.35, (g, o) => {
      o.frequency.setValueAtTime(freq * 0.7, start);
      o.frequency.exponentialRampToValueAtTime(freq * 1.25, start + 0.05);
      this.env(g, start, 0.004, level, 0.22);
    });
  }

  private pluck(freq: number, level: number, pan: number, start = this.ctx.currentTime, decay = 0.35) {
    this.osc("triangle", freq, start, start + decay + 0.1, pan, 0.35, 0.25, (g) => this.env(g, start, 0.004, level, decay));
  }

  private blip(freq: number, level: number, pan: number, start = this.ctx.currentTime) {
    this.osc("square", freq, start, start + 0.08, pan, 0.25, 0.4, (g) => this.env(g, start, 0.002, level * 0.5, 0.05));
  }

  private tick(start: number, level: number, pan: number, freq = 3000) {
    if (!this.live) return;
    const src = this.ctx.createBufferSource();
    const f = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    src.buffer = this.noise;
    f.type = "bandpass"; f.frequency.value = freq; f.Q.value = 1.4;
    this.env(g, start, 0.002, level, 0.03);
    src.connect(f).connect(g);
    const release = this.out(g, pan, 0.4);
    src.onended = () => { src.disconnect(); f.disconnect(); g.disconnect(); release(); };
    src.start(start, Math.random() * 0.5, 0.06);
  }

  // --- events -------------------------------------------------------------

  private riser() {
    const t = this.ctx.currentTime;
    [0, 7, 12].forEach((interval, i) => {
      this.osc("sawtooth", hz(45 + interval), t, t + 1.9, (i - 1) * 0.5, 0.7, 0.2, (g, o) => {
        o.frequency.exponentialRampToValueAtTime(hz(57 + interval), t + 1.8);
        o.detune.value = (i - 1) * 9;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.03, t + 1.6);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.85);
      });
    });
  }

  impact() {
    if (!this.live) return;
    const t = this.ctx.currentTime;
    this.osc("sine", hz(38), t, t + 1.6, 0, 0.2, 0, (g, o) => {
      o.frequency.exponentialRampToValueAtTime(hz(26), t + 1.2);
      this.env(g, t, 0.005, 0.55, 1.4);
    });
    this.tick(t, 0.25, 0, 1800);
    [62, 66, 69, 74, 78].forEach((n, i) => this.bell(hz(n), 0.03, (i - 2) * 0.35, 3.2, t + 0.15 + i * 0.06));
  }

  pulse() {
    const t = this.ctx.currentTime;
    [55, 59, 62, 67, 71, 74].forEach((n, i) => this.pluck(hz(n), 0.06, -0.9 + i * 0.36, t + i * 0.08, 0.5));
  }

  holdStart() {
    if (!this.live) return;
    this.holdSince = this.ctx.currentTime;
    this.glide(this.well.gain.gain, 0.03, 0.2);
  }

  holdEnd() {
    this.holdSince = -1;
    if (this.disposed) return;
    this.glide(this.well.gain.gain, 0, 0.08);
    this.glide(this.well.filter.frequency, 200, 0.1);
  }

  burst(power: number, x: number) {
    if (!this.live) return;
    const t = this.ctx.currentTime;
    const p = clamp(power / 1.6);
    const root = CHORDS[this.chapter][0];
    this.osc("sine", hz(root + 12), t, t + 0.9, 0, 0.2, 0, (g, o) => {
      o.frequency.exponentialRampToValueAtTime(hz(root - 12), t + 0.5);
      this.env(g, t, 0.004, 0.18 + p * 0.3, 0.8);
    });
    this.tick(t, 0.08 + p * 0.12, x * 0.6, 2400);
    const notes = SPARKLE[this.chapter];
    const count = 2 + Math.round(p * 4);
    for (let i = 0; i < count; i++) {
      this.bell(hz(notes[(i * 2) % notes.length] + (i > 3 ? 12 : 0)), 0.02 + p * 0.015, x * 0.5 + (i % 2 ? 0.4 : -0.4), 1.8, t + 0.04 + i * 0.05);
    }
  }

  route(discipline: number, routedCount: number) {
    const t = this.ctx.currentTime;
    const scale = ROUTE_SCALE[discipline] ?? ROUTE_SCALE[0];
    const lift = routedCount > 3 ? 12 : 0;
    scale.forEach((n, i) => this.bell(hz(n + lift), 0.06, (discipline - 1) * 0.6, 1.6, t + i * 0.09));
  }

  complete() {
    const t = this.ctx.currentTime + 0.5;
    [50, 57, 62, 66, 69, 74, 78].forEach((n, i) => this.bell(hz(n), 0.045, (i - 3) * 0.25, 4, t + i * 0.12));
  }

  hover() {
    this.osc("sine", hz(93), this.ctx.currentTime, this.ctx.currentTime + 0.08, 0, 0.2, 0, (g) => this.env(g, this.ctx.currentTime, 0.003, 0.01, 0.05));
  }

  click() {
    const t = this.ctx.currentTime;
    this.osc("triangle", hz(86), t, t + 0.12, 0, 0.3, 0, (g, o) => {
      o.frequency.exponentialRampToValueAtTime(hz(81), t + 0.09);
      this.env(g, t, 0.003, 0.04, 0.08);
    });
  }

  async dispose() {
    this.disposed = true;
    if (this.suspendTimer !== null) window.clearTimeout(this.suspendTimer);
    try { await this.ctx.close(); } catch { /* already closed */ }
  }
}
