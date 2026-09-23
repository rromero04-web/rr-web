"use client";

// One quiet procedural instrument serves the entire experience. No audio asset
// or particle owns a voice: visual activity is reduced to a handful of controls.
export type AudioSnapshot = {
  progress: number;
  direction: number;
  scrollEnergy: number;
  pointerX: number;
  pointerWake: number;
  alignment: number;
  fieldEnergy: number;
  cameraSpeed: number;
  signalX: number;
  signalVelocity: number;
  connection: number;
  field: number;
  compression: number;
  stillness: number;
  darkness: number;
  formation: number;
  paused: boolean;
  mobile: boolean;
};

export type AudioCue = "formStep" | "alignment" | "anticipation" | "escape" | "connection" | "impact" | "formation";
export type SignalStage = "input" | "route" | "split" | "terminal";
export type SignalEvent = { stage: SignalStage; route: number; pan: number; energy: number; delay?: number; composer?: boolean };

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const smooth = (value: number, a: number, b: number) => {
  const t = clamp((value - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const bell = (value: number, a: number, b: number, c: number, d: number) => smooth(value, a, b) * (1 - smooth(value, c, d));

type Bus = "ambience" | "interaction" | "signals" | "impact" | "ui";

export class ConvergenceAudio {
  private readonly ctx: AudioContext;
  private readonly master: GainNode;
  private readonly buses: Record<Bus, GainNode>;
  private readonly noise: AudioBuffer;
  private readonly airSource: AudioBufferSourceNode;
  private readonly airFilter: BiquadFilterNode;
  private readonly airPan: StereoPannerNode;
  private readonly airGain: GainNode;
  private readonly toneA: OscillatorNode;
  private readonly toneB: OscillatorNode;
  private readonly toneGain: GainNode;
  private readonly pressure: OscillatorNode;
  private readonly pressureGain: GainNode;
  private enabled = false;
  private disposed = false;
  private mobile = false;
  private voiceIntervals: { start: number; end: number }[] = [];
  private randomState = 0x45a217;
  private lastUpdate = -1;
  private grainAt = 0;
  private patternAt = 0;
  private suspension: number | null = null;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);
    const makeBus = (level: number) => {
      const gain = ctx.createGain();
      gain.gain.value = level;
      gain.connect(this.master);
      return gain;
    };
    this.buses = {
      ambience: makeBus(1), interaction: makeBus(.72), signals: makeBus(.86),
      impact: makeBus(1), ui: makeBus(.45),
    };
    this.noise = ctx.createBuffer(1, Math.round(ctx.sampleRate * 2), ctx.sampleRate);
    const samples = this.noise.getChannelData(0);
    let filtered = 0;
    for (let i = 0; i < samples.length; i++) {
      filtered = filtered * .68 + (this.random() * 2 - 1) * .32;
      samples[i] = filtered;
    }
    this.airSource = ctx.createBufferSource();
    this.airSource.buffer = this.noise;
    this.airSource.loop = true;
    this.airFilter = ctx.createBiquadFilter();
    this.airFilter.type = "bandpass";
    this.airFilter.frequency.value = 750;
    this.airFilter.Q.value = .38;
    this.airPan = ctx.createStereoPanner();
    this.airGain = ctx.createGain();
    this.airGain.gain.value = 0;
    this.airSource.connect(this.airFilter).connect(this.airPan).connect(this.airGain).connect(this.buses.ambience);
    this.airSource.start();

    this.toneA = ctx.createOscillator();
    this.toneA.type = "sine";
    this.toneA.frequency.value = 164;
    this.toneB = ctx.createOscillator();
    this.toneB.type = "sine";
    this.toneB.frequency.value = 246;
    this.toneGain = ctx.createGain();
    this.toneGain.gain.value = 0;
    this.toneA.connect(this.toneGain);
    this.toneB.connect(this.toneGain);
    this.toneGain.connect(this.buses.ambience);
    this.toneA.start(); this.toneB.start();

    this.pressure = ctx.createOscillator();
    this.pressure.type = "triangle";
    this.pressure.frequency.value = 74;
    this.pressureGain = ctx.createGain();
    this.pressureGain.gain.value = 0;
    this.pressure.connect(this.pressureGain).connect(this.buses.ambience);
    this.pressure.start();
  }

  private random() {
    this.randomState = (Math.imul(this.randomState, 1664525) + 1013904223) >>> 0;
    return this.randomState / 4294967296;
  }

  private routeBase(route: number) {
    const intervals = [0, 2, 3, 5, 7, 10, 12];
    return 153 * Math.pow(2, intervals[Math.round(clamp(route, 0, 6))] / 12);
  }

  private target(param: AudioParam, value: number, seconds = .08) {
    param.setTargetAtTime(value, this.ctx.currentTime, seconds);
  }

  private reserveVoice(start: number, end: number, bus: Bus) {
    this.voiceIntervals = this.voiceIntervals.filter(voice => voice.end > this.ctx.currentTime);
    const overlaps = this.voiceIntervals.reduce((count, voice) =>
      count + Number(voice.start < end && voice.end > start), 0);
    if (bus !== "impact" && overlaps >= (this.mobile ? 16 : 24)) return false;
    this.voiceIntervals.push({ start, end });
    return true;
  }

  async enable() {
    if (this.disposed) return;
    if (this.suspension !== null) window.clearTimeout(this.suspension);
    this.suspension = null;
    await this.ctx.resume();
    this.enabled = true;
    this.target(this.master.gain, .58, .045);
    this.tone(330, 294, .12, .012, "ui", 0, this.ctx.currentTime, "sine");
  }

  disable() {
    this.enabled = false;
    this.target(this.master.gain, 0, .025);
    if (this.suspension !== null) window.clearTimeout(this.suspension);
    this.suspension = window.setTimeout(() => {
      if (!this.enabled && !this.disposed) void this.ctx.suspend();
    }, 240);
  }

  update(state: AudioSnapshot) {
    if (!this.enabled || this.disposed || this.ctx.state !== "running") return;
    const now = this.ctx.currentTime;
    if (now - this.lastUpdate < .032) return;
    this.lastUpdate = now;
    this.mobile = state.mobile;
    const p = state.progress;
    const attention = bell(p, .065, .12, .245, .34);
    const form = bell(p, .23, .31, .42, .52);
    const behavior = bell(p, .425, .48, .59, .69);
    const convergence = bell(p, .605, .67, .785, .88);
    const product = smooth(p, .825, .91);
    const silence = clamp(Math.max(state.stillness, state.darkness, state.paused ? 1 : 0));
    const audible = (1 - silence) * (1 - silence * .55);
    const activity = clamp(state.fieldEnergy * .65 + state.pointerWake * .28);
    const speed = clamp(state.signalVelocity * .028 + state.cameraSpeed * .006 + state.scrollEnergy * .35);

    this.target(this.airGain.gain, (.00045 + attention * (.004 + activity * .003)
      + behavior * .0015 + convergence * (.003 + speed * .004) + product * .0018) * audible, .09);
    this.target(this.airFilter.frequency, 680 + attention * (1500 + activity * 1500)
      + behavior * 850 + convergence * (1200 + speed * 2600) + product * 460, .09);
    this.target(this.airPan.pan, clamp(state.pointerX * attention * .25 + state.signalX / 10 * behavior * .32, -.38, .38), .16);
    this.target(this.toneGain.gain, (form * .0038 + convergence * (.0015 + state.connection * .003)
      + product * .0036) * audible, .13);
    this.target(this.toneA.frequency, 164 + form * state.alignment * 1.8 + convergence * state.field * 6 - product * 0, .19);
    this.target(this.toneB.frequency, 246 + convergence * state.compression * 9 + product * .4, .19);
    this.target(this.pressureGain.gain, (convergence * (.002 + state.compression * .013)
      + product * .0016) * audible, .12);
    this.target(this.pressure.frequency, 74 + convergence * state.compression * 12 - product * 1, .12);
    this.target(this.buses.signals.gain, .86 * audible, silence > .7 ? .022 : .07);
    this.target(this.buses.interaction.gain, .72 * audible, silence > .7 ? .022 : .07);

    const grainRate = (attention * (1.7 + activity * 5.4) + convergence * (1.3 + state.field * 3.5))
      * (state.mobile ? .58 : 1) * audible;
    if (grainRate > .15 && now >= this.grainAt) {
      const coherent = clamp(state.alignment * .7 + state.connection * .55);
      const pan = (this.random() * 2 - 1) * (.58 - coherent * .36) + state.pointerX * .12;
      this.noiseTick(1850 + coherent * 920 + this.random() * 1750, .017 + this.random() * .02,
        .005 + activity * .003, pan, "ambience", now);
      this.grainAt = now + (1 / grainRate) * (1.35 - coherent * .68 + this.random() * (1 - coherent) * .5);
    }
    const tension = convergence * state.field * (1 - state.compression * .3) * audible;
    if (tension > .1 && now >= this.patternAt) {
      const rate = 1.3 + tension * 7.8;
      this.tone(144 + state.compression * 31, 150 + state.compression * 27,
        .065, .006 + tension * .007, "signals", (this.random() - .5) * (1 - state.compression) * .6, now, "triangle");
      this.patternAt = now + 1 / rate;
    }
  }

  private tone(from: number, to: number, duration: number, level: number, bus: Bus,
    pan: number, start: number, shape: OscillatorType = "sine") {
    if (this.disposed) return;
    const begin = Math.max(start, this.ctx.currentTime + .003);
    if (!this.reserveVoice(begin, begin + duration + .012, bus)) return;
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const stereo = this.ctx.createStereoPanner();
    oscillator.type = shape;
    oscillator.frequency.setValueAtTime(Math.max(20, from), begin);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, to), begin + duration);
    gain.gain.setValueAtTime(.0001, begin);
    gain.gain.exponentialRampToValueAtTime(Math.max(.0002, level), begin + Math.min(.025, duration * .16));
    gain.gain.exponentialRampToValueAtTime(.0001, begin + duration);
    stereo.pan.value = clamp(pan, -.72, .72);
    oscillator.connect(gain).connect(stereo).connect(this.buses[bus]);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); stereo.disconnect(); };
    oscillator.start(begin);
    oscillator.stop(begin + duration + .012);
  }

  private noiseTick(cutoff: number, duration: number, level: number, pan: number, bus: Bus, start: number) {
    if (this.disposed) return;
    const begin = Math.max(start, this.ctx.currentTime + .003);
    if (!this.reserveVoice(begin, begin + duration + .004, bus)) return;
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    const stereo = this.ctx.createStereoPanner();
    source.buffer = this.noise;
    filter.type = "bandpass"; filter.frequency.value = cutoff; filter.Q.value = 1.5;
    gain.gain.setValueAtTime(.0001, begin);
    gain.gain.exponentialRampToValueAtTime(Math.max(.0002, level), begin + .004);
    gain.gain.exponentialRampToValueAtTime(.0001, begin + duration);
    stereo.pan.value = clamp(pan, -.72, .72);
    source.connect(filter).connect(gain).connect(stereo).connect(this.buses[bus]);
    source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); stereo.disconnect(); };
    source.start(begin, this.random() * 1.6, duration + .004);
  }

  cue(cue: AudioCue) {
    if (!this.enabled || this.ctx.state !== "running") return;
    const now = this.ctx.currentTime;
    switch (cue) {
      case "formStep":
        this.noiseTick(2450, .014, .009, -.12, "interaction", now);
        this.tone(205, 199, .14, .008, "interaction", -.08, now + .008);
        break;
      case "alignment":
        this.noiseTick(2850, .024, .027, .08, "interaction", now);
        this.tone(174, 165, .31, .027, "interaction", .02, now + .007);
        break;
      case "escape":
        this.tone(143, 181, .26, .021, "signals", .42, now, "triangle");
        break;
      case "connection":
        this.tone(246, 219, .38, .021, "signals", -.16, now);
        this.noiseTick(1850, .027, .009, -.35, "signals", now + .055);
        break;
      case "anticipation":
        this.tone(112, 109, .16, .012, "signals", 0, now);
        break;
      case "impact":
        // Suction precedes a compact low-mid pressure pulse, then leaves space.
        this.noiseTick(3300, .031, .065, 0, "impact", now);
        this.tone(182, 96, .105, .095, "impact", 0, now + .023, "triangle");
        this.tone(76, 43, .26, .17, "impact", 0, now + .046);
        this.tone(126, 84, .15, .055, "impact", 0, now + .047);
        break;
      case "formation":
        // The system resolves into the same interval family used by its signals.
        this.tone(164.8, 164.8, .48, .025, "interaction", -.12, now);
        this.tone(207.65, 207.65, .47, .027, "interaction", 0, now + .12);
        this.tone(246.94, 246.94, .75, .034, "interaction", .12, now + .25);
        this.tone(493.88, 493.88, .3, .006, "interaction", .12, now + .26);
        break;
    }
  }

  signal(event: SignalEvent, start = this.ctx.currentTime) {
    if (!this.enabled || this.ctx.state !== "running") return;
    const route = clamp(event.route, 0, 6);
    const energy = clamp(event.energy, .2, 1.4);
    // A shared interval family gives each route a distinct destination without
    // turning six signals into unrelated instruments.
    const base = this.routeBase(route);
    const ratio = event.stage === "route" ? 1.12 : event.stage === "split" ? 1.32
      : event.stage === "terminal" ? .84 : 1;
    const pan = clamp(event.pan, -.66, .66);
    if (event.composer && event.stage === "terminal") {
      // A short rising resolution reads as completed work, even on small speakers.
      this.tone(base * 1.25, base * 1.25, .26, .034 * energy, "signals", pan, start);
      this.tone(base * 1.5, base * 1.5, .42, .036 * energy, "signals", pan, start + .095);
      this.tone(base * 2, base * 2, .28, .009 * energy, "signals", pan, start + .19);
      return;
    }
    const duration = event.stage === "terminal" ? .27 : .15;
    if (!event.composer) this.noiseTick(event.stage === "terminal" ? 1250 : 2400, .018, .008 * energy, pan, "signals", start);
    this.tone(base * ratio, base * ratio * (event.stage === "terminal" ? .93 : 1.025),
      duration, .026 * energy, "signals", pan, start + .006, event.stage === "split" ? "triangle" : "sine");
    if (event.stage === "split" && !this.mobile) {
      this.tone(base * 1.51, base * 1.49, .115, .01 * energy, "signals", pan + .25, start + .082);
    }
  }

  signalEvent(event: SignalEvent) {
    this.signal(event, this.ctx.currentTime + (event.delay ?? 0));
  }

  select(id: number) {
    if (!this.enabled || this.ctx.state !== "running") return;
    this.tone(this.routeBase(id - 1) * 1.5, this.routeBase(id - 1) * 1.5,
      .11, .014, "ui", -.1 + id * .035, this.ctx.currentTime);
  }

  route(id: number, priorRoutes: number) {
    if (!this.enabled || this.ctx.state !== "running") return;
    const now = this.ctx.currentTime + .01;
    const route = clamp(id - 1, 0, 5);
    const energy = .82 + Math.min(.26, priorRoutes * .045);
    const baseAngle = route / 9 * Math.PI * 2 - .18;
    const panAt = (fraction: number) => clamp((2.35 + Math.cos(baseAngle + fraction * 1.14) * (.3 + fraction * 2.55)) / 5.2, -.55, .55);
    this.signal({ stage: "input", route, pan: -.04, energy, composer: true }, now);
    this.signal({ stage: "route", route, pan: .44, energy: energy * .79, composer: true }, now + .42);
    this.signal({ stage: "split", route, pan: panAt(.5), energy: energy * .71, composer: true }, now + .76);
    this.signal({ stage: "terminal", route, pan: panAt(1), energy: energy * .88, composer: true }, now + 1.14);
  }

  async dispose() {
    this.disposed = true;
    if (this.suspension !== null) window.clearTimeout(this.suspension);
    this.airSource.stop(); this.toneA.stop(); this.toneB.stop(); this.pressure.stop();
    await this.ctx.close();
  }
}
