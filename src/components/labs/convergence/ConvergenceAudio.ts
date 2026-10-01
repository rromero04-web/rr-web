"use client";

// Procedural score. No audio files: a pad whose harmony follows the chapters,
// air that responds to scroll speed, and a few authored events.

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

// One voicing per stage. The piece starts suspended in D minor and resolves to D major.
const CHORDS = [
  [38, 45, 50, 53, 57], // Dm
  [38, 45, 52, 53, 60], // Dm(add9) – restless
  [34, 41, 50, 57, 60], // Bbmaj7 – structure
  [36, 43, 52, 55, 59], // Cmaj7 – motion
  [33, 40, 45, 49, 52], // A – tension
  [38, 45, 54, 57, 64], // D(add9) – resolution
];

// Two signals per discipline, each discipline in its own register.
const ROUTE_SCALE = [[62, 66, 69], [64, 67, 71], [69, 73, 76]];

export type AudioFrame = { stage: number; velocity: number; pointer: number; calm: boolean; mobile: boolean };

export class ConvergenceAudio {
  private readonly ctx: AudioContext;
  private readonly master: GainNode;
  private readonly dry: GainNode;
  private readonly wet: GainNode;
  private readonly padFilter: BiquadFilterNode;
  private readonly padGain: GainNode;
  private readonly voices: { a: OscillatorNode; b: OscillatorNode }[] = [];
  private readonly airGain: GainNode;
  private readonly airFilter: BiquadFilterNode;
  private readonly subGain: GainNode;
  private readonly sub: OscillatorNode;
  private readonly noise: AudioBuffer;
  private readonly send: GainNode;
  private enabled = false;
  private disposed = false;
  private chord = -1;
  private lastStage = 0;
  private tickAt = 0;
  private lastUpdate = 0;
  private suspendTimer: number | null = null;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.ratio.value = 3;
    compressor.connect(ctx.destination);
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(compressor);

    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    // A generated hall: decaying stereo noise as impulse response.
    const reverb = ctx.createConvolver();
    const length = Math.round(ctx.sampleRate * 4.2);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const channel = impulse.getChannelData(c);
      for (let i = 0; i < length; i++) channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3.2);
    }
    reverb.buffer = impulse;
    this.dry = ctx.createGain(); this.dry.gain.value = 0.7;
    this.wet = ctx.createGain(); this.wet.gain.value = 0.55;
    this.dry.connect(this.master);
    reverb.connect(this.wet).connect(this.master);
    const send = ctx.createGain();
    send.connect(reverb);
    this.send = send;

    this.padFilter = ctx.createBiquadFilter();
    this.padFilter.type = "lowpass";
    this.padFilter.frequency.value = 600;
    this.padFilter.Q.value = 0.6;
    this.padGain = ctx.createGain();
    this.padGain.gain.value = 0.0;
    this.padFilter.connect(this.padGain);
    this.padGain.connect(this.dry);
    this.padGain.connect(send);
    CHORDS[0].forEach((note, i) => {
      const a = ctx.createOscillator();
      const b = ctx.createOscillator();
      a.type = "sawtooth"; b.type = "triangle";
      a.frequency.value = hz(note); b.frequency.value = hz(note);
      a.detune.value = -6 - i; b.detune.value = 7 + i;
      const g = ctx.createGain();
      g.gain.value = 0.05 / (1 + i * 0.35);
      const pan = ctx.createStereoPanner();
      pan.pan.value = (i / (CHORDS[0].length - 1) - 0.5) * 0.8;
      a.connect(g); b.connect(g); g.connect(pan).connect(this.padFilter);
      a.start(); b.start();
      this.voices.push({ a, b });
    });

    const air = ctx.createBufferSource();
    air.buffer = this.noise; air.loop = true;
    this.airFilter = ctx.createBiquadFilter();
    this.airFilter.type = "bandpass"; this.airFilter.frequency.value = 900; this.airFilter.Q.value = 0.7;
    this.airGain = ctx.createGain(); this.airGain.gain.value = 0;
    air.connect(this.airFilter).connect(this.airGain);
    this.airGain.connect(this.dry); this.airGain.connect(send);
    air.start();

    this.sub = ctx.createOscillator();
    this.sub.type = "sine"; this.sub.frequency.value = hz(26);
    this.subGain = ctx.createGain(); this.subGain.gain.value = 0;
    this.sub.connect(this.subGain).connect(this.dry);
    this.sub.start();
  }

  private glide(param: AudioParam, value: number, time = 0.1) {
    param.setTargetAtTime(value, this.ctx.currentTime, time);
  }

  async enable() {
    if (this.disposed) return;
    if (this.suspendTimer !== null) window.clearTimeout(this.suspendTimer);
    await this.ctx.resume();
    this.enabled = true;
    this.glide(this.master.gain, 0.9, 0.4);
  }

  disable() {
    this.enabled = false;
    this.glide(this.master.gain, 0, 0.08);
    this.suspendTimer = window.setTimeout(() => {
      if (!this.enabled && !this.disposed) void this.ctx.suspend();
    }, 600);
  }

  update(frame: AudioFrame) {
    if (!this.enabled || this.disposed) return;
    const now = this.ctx.currentTime;
    if (now - this.lastUpdate < 0.03) return;
    this.lastUpdate = now;
    const s = clamp(frame.stage, 0, 5);
    const nearest = Math.round(s);
    if (nearest !== this.chord) {
      this.chord = nearest;
      CHORDS[nearest].forEach((note, i) => {
        const v = this.voices[i];
        this.glide(v.a.frequency, hz(note), 0.6);
        this.glide(v.b.frequency, hz(note), 0.75);
      });
    }
    const speed = clamp(Math.abs(frame.velocity));
    const core = Math.exp(-Math.pow((s - 4) * 2.2, 2));
    const product = clamp(s - 4.5, 0, 0.5) * 2;
    this.glide(this.padGain.gain, 0.32 + product * 0.12 - core * 0.12, 0.3);
    this.glide(this.padFilter.frequency, 380 + s * 160 + speed * 1400 + product * 700 + frame.pointer * 300, 0.15);
    this.glide(this.airGain.gain, (0.012 + speed * 0.09 + core * 0.05) * (frame.calm ? 0.5 : 1), 0.08);
    this.glide(this.airFilter.frequency, 500 + speed * 2600 + core * 1800, 0.1);
    this.glide(this.subGain.gain, core * 0.22, 0.2);
    this.glide(this.sub.frequency, hz(26) * (1 + core * 0.06), 0.2);

    // Attention: pointer movement crackles. Form: a quiet metronome of alignment.
    const attention = clamp(1 - Math.abs(s - 1) * 1.4);
    const form = clamp(1 - Math.abs(s - 2) * 1.6);
    if (now >= this.tickAt) {
      if (attention > 0.2 && frame.pointer > 0.05) {
        this.noiseHit(2400 + Math.random() * 3000, 0.02, 0.05 * attention * frame.pointer, (Math.random() - 0.5) * 1.2);
        this.tickAt = now + 0.04 + Math.random() * 0.12 / (0.2 + frame.pointer);
      } else if (form > 0.4) {
        this.tone(hz(81), hz(81), 0.08, 0.018 * form, 0, "sine", 0.3);
        this.tickAt = now + 0.5;
      } else {
        this.tickAt = now + 0.1;
      }
    }

    // A riser into the core and an impact when it releases.
    if (this.lastStage < 3.55 && s >= 3.55) this.riser();
    if (this.lastStage < 4.55 && s >= 4.55) this.impact();
    this.lastStage = s;
  }

  private tone(from: number, to: number, duration: number, level: number, pan = 0,
    shape: OscillatorType = "sine", wet = 0.5, start = this.ctx.currentTime) {
    if (!this.enabled || this.disposed) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const p = this.ctx.createStereoPanner();
    const w = this.ctx.createGain();
    o.type = shape;
    o.frequency.setValueAtTime(from, start);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, to), start + duration);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, level), start + Math.min(0.02, duration * 0.2));
    g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    p.pan.value = clamp(pan, -1, 1);
    w.gain.value = wet;
    o.connect(g).connect(p);
    p.connect(this.dry); p.connect(w).connect(this.send);
    o.onended = () => { o.disconnect(); g.disconnect(); p.disconnect(); w.disconnect(); };
    o.start(start); o.stop(start + duration + 0.02);
  }

  private noiseHit(freq: number, duration: number, level: number, pan = 0, start = this.ctx.currentTime, sweepTo?: number) {
    if (!this.enabled || this.disposed) return;
    const src = this.ctx.createBufferSource();
    const f = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    const p = this.ctx.createStereoPanner();
    src.buffer = this.noise;
    f.type = "bandpass"; f.Q.value = 1.2;
    f.frequency.setValueAtTime(freq, start);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, start + duration);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, level), start + (sweepTo ? duration * 0.9 : 0.004));
    g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    p.pan.value = clamp(pan, -1, 1);
    src.connect(f).connect(g).connect(p);
    p.connect(this.dry); p.connect(this.send);
    src.onended = () => { src.disconnect(); f.disconnect(); g.disconnect(); p.disconnect(); };
    src.start(start, Math.random(), duration + 0.02);
  }

  private riser() {
    this.noiseHit(300, 1.6, 0.12, 0, this.ctx.currentTime, 4200);
    this.tone(hz(45), hz(57), 1.6, 0.05, 0, "sawtooth", 0.8);
  }

  impact() {
    const t = this.ctx.currentTime;
    this.tone(hz(38), hz(26), 1.4, 0.6, 0, "sine", 0.2, t);
    this.tone(hz(50), hz(38), 0.5, 0.16, 0, "triangle", 0.6, t);
    this.noiseHit(1800, 0.9, 0.18, 0, t, 300);
    [62, 66, 69, 74].forEach((n, i) => this.tone(hz(n), hz(n), 2.6, 0.035, (i - 1.5) * 0.4, "sine", 1, t + 0.18 + i * 0.07));
  }

  pulse() {
    const t = this.ctx.currentTime;
    [55, 59, 62, 67, 71].forEach((n, i) => this.tone(hz(n), hz(n), 0.4, 0.07, -0.8 + i * 0.4, "triangle", 0.6, t + i * 0.11));
  }

  route(discipline: number, routedCount: number) {
    const t = this.ctx.currentTime;
    const scale = ROUTE_SCALE[discipline] ?? ROUTE_SCALE[0];
    const lift = routedCount > 3 ? 12 : 0;
    scale.forEach((n, i) => this.tone(hz(n + lift), hz(n + lift), 0.9, 0.08, (discipline - 1) * 0.6, "sine", 0.7, t + i * 0.09));
    this.noiseHit(5200, 0.06, 0.04, (discipline - 1) * 0.6, t);
  }

  complete() {
    const t = this.ctx.currentTime + 0.5;
    [50, 57, 62, 66, 69, 74, 78].forEach((n, i) => this.tone(hz(n), hz(n), 4, 0.05, (i - 3) * 0.25, "sine", 1, t + i * 0.12));
  }

  hover() {
    this.tone(hz(93), hz(93), 0.05, 0.012, 0, "sine", 0.2);
  }

  click() {
    this.tone(hz(86), hz(81), 0.09, 0.04, 0, "triangle", 0.3);
  }

  async dispose() {
    this.disposed = true;
    if (this.suspendTimer !== null) window.clearTimeout(this.suspendTimer);
    try { await this.ctx.close(); } catch { /* already closed */ }
  }
}
