"use client";
/* eslint-disable react-hooks/immutability -- R3F animates scene graph objects in the render loop. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { range, type Quality } from "./model";
import { approach, createMotionState, decay, windowed, type MotionState, type Spring } from "./motion";
import { HeroSequence } from "./HeroSequence";
import type { AudioCue, AudioSnapshot, SignalEvent } from "./ConvergenceAudio";

type SceneProps = {
  progress: number; paused: boolean; quality: Quality; selected: number | null;
  routed: number[]; pulse: number; calm: boolean; onSlow: () => void; onProductReady: (ready: boolean) => void;
  onCue: (cue: AudioCue) => void; onSignal: (event: SignalEvent) => void;
  onAudioFrame: (snapshot: AudioSnapshot) => void;
};

const clamp = THREE.MathUtils.clamp;
const ease = (t: number) => t * t * (3 - 2 * t);
const MotionContext = createContext<MotionState | null>(null);
function useMotion() {
  const motion = useContext(MotionContext);
  if (!motion) throw new Error("Convergence motion system is missing");
  return motion;
}

export function ConvergenceCanvas(props: SceneProps) {
  return <Canvas aria-hidden="true" dpr={props.quality === "high" ? [1, 1.5] : props.quality === "medium" ? [1, 1.25] : 1}
    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    camera={{ position: [0, 0, 12], fov: 42, near: .05, far: 130 }}
    onCreated={({ gl }) => { gl.setClearColor("#080a10", 0); gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.35; }}
    fallback={<div>Realtime graphics unavailable. Use Reading mode.</div>}>
    <Scene {...props} />
  </Canvas>;
}

function Scene(props: SceneProps) {
  const motion = useMemo(() => createMotionState(), []);
  const { size } = useThree();
  const previousPulse = useRef(props.pulse);
  const previousFormation = useRef(0);
  const formStep = useRef(0);
  useFrame((state, frameDelta) => {
    const dt = Math.min(frameDelta, .5);
    const inputVelocity = clamp((props.progress - motion.previousRaw) / Math.max(dt, .001), -4, 4);
    motion.previousRaw = props.progress;
    motion.raw = props.progress;
    motion.rawVelocity = decay(motion.rawVelocity, inputVelocity, 11, dt);
    motion.direction = Math.sign(motion.rawVelocity);
    motion.scrollEnergy = decay(motion.scrollEnergy, Math.min(1, Math.abs(motion.rawVelocity) * 1.3), 5, dt);
    const frequency = size.width < 820 ? 21 : 13 + motion.scrollEnergy * 6;
    const previous = motion.playhead.value;
    approach(motion.playhead, props.progress, frequency, dt);
    if (motion.impactArmed && props.progress > .762 && motion.playhead.value > .76 && motion.stillAge < .36 && motion.direction >= 0) {
      motion.playhead.value = .76;
      motion.playhead.velocity = 0;
    }
    if (Math.abs(props.progress - motion.playhead.value) < .00002 && Math.abs(motion.playhead.velocity) < .0002) {
      motion.playhead.value = props.progress;
      motion.playhead.velocity = 0;
    }
    if (previous < .695 && motion.playhead.value >= .695 && motion.direction >= 0) props.onCue("anticipation");
    if (previous < .595 && motion.playhead.value >= .595 && motion.direction >= 0) props.onCue("escape");
    if (previous < .675 && motion.playhead.value >= .675 && motion.direction >= 0) props.onCue("connection");
    if (previousFormation.current < .55 && motion.heroFormation >= .55 && motion.direction >= 0) props.onCue("formation");
    previousFormation.current = motion.heroFormation;
    if (motion.playhead.value < .27) formStep.current = 0;
    if (motion.direction >= 0 && motion.playhead.value >= .28 && motion.playhead.value < .46) {
      const nextStep = motion.alignment >= .62 ? 2 : motion.alignment >= .32 ? 1 : 0;
      if (nextStep > formStep.current) props.onCue("formStep");
      formStep.current = Math.max(formStep.current, nextStep);
    }
    if (motion.previousAlignment < .82 && motion.alignment >= .82 && motion.direction >= 0) {
      motion.alignmentAge = 0;
      props.onCue("alignment");
    }
    motion.previousAlignment = motion.alignment;
    if (motion.playhead.value < .72) {
      motion.impactArmed = true;
      motion.impactAge = 20;
      motion.stillAge = 20;
    } else if (previous < .738 && motion.playhead.value >= .738) {
      motion.stillAge = 0;
    }
    if (motion.playhead.value >= .763 && motion.impactArmed && motion.stillAge >= .28 && motion.direction >= 0) {
      motion.impactArmed = false;
      motion.impactSerial++;
      motion.impactAge = 0;
      props.onCue("impact");
    }
    motion.previousPlayhead = motion.playhead.value;
    if (props.pulse !== previousPulse.current) {
      previousPulse.current = props.pulse;
      motion.pulseSerial++;
      motion.pulseAge = 0;
      motion.selectedSignal = props.selected;
    }
    if (!props.paused) {
      motion.time += dt;
      motion.alignmentAge += dt;
      motion.impactAge += dt;
      motion.stillAge += dt;
      motion.pulseAge += dt;
    }
    const x = state.pointer.x, y = state.pointer.y;
    const vx = (x - motion.previousPointerX) / Math.max(dt, .001);
    const vy = (y - motion.previousPointerY) / Math.max(dt, .001);
    motion.previousPointerX = x; motion.previousPointerY = y;
    motion.pointerVx = decay(motion.pointerVx, clamp(vx, -9, 9), 7, dt);
    motion.pointerVy = decay(motion.pointerVy, clamp(vy, -9, 9), 7, dt);
    motion.pointerX = decay(motion.pointerX, x, 9, dt);
    motion.pointerY = decay(motion.pointerY, y, 9, dt);
    motion.pointerWake = decay(motion.pointerWake, Math.min(1, Math.hypot(vx, vy) * .11), 2.2, dt);
  }, -10);
  return <MotionContext.Provider value={motion}>
    <ambientLight intensity={.28} />
    <directionalLight position={[2, 7, 5]} intensity={2.2} color="#f5f1ed" />
    <directionalLight position={[-5, -2, 2]} intensity={1.2} color="#9ba9d8" />
    <Director calm={props.calm} />
    <PerformanceGovernor quality={props.quality} onSlow={props.onSlow} />
    <AttentionField {...props} />
    <FormArchitecture {...props} />
    <BehaviorNetwork {...props} />
    <HeroSequence {...props} motion={motion} />
    <AudioBridge motion={motion} paused={props.paused} onAudioFrame={props.onAudioFrame} />
  </MotionContext.Provider>;
}

function AudioBridge({ motion, paused, onAudioFrame }: {
  motion: MotionState; paused: boolean; onAudioFrame: (snapshot: AudioSnapshot) => void;
}) {
  const { size } = useThree();
  useFrame(() => onAudioFrame({
    progress: motion.playhead.value, direction: motion.direction, scrollEnergy: motion.scrollEnergy,
    pointerX: motion.pointerX, pointerWake: motion.pointerWake, alignment: motion.alignment,
    fieldEnergy: motion.fieldEnergy, cameraSpeed: motion.cameraSpeed,
    signalX: motion.heroSignalX, signalVelocity: motion.heroSignalVelocity,
    connection: motion.heroConnection, field: motion.heroField, compression: motion.heroCompression,
    stillness: motion.heroStill, darkness: motion.heroDarkness, formation: motion.heroFormation,
    paused, mobile: size.width < 820,
  }));
  return null;
}

// The camera follows the outgoing signal, discovers the three worlds, then moves
// inward with the field before it discovers the resolved system.
const shots = [
  { at: 0, pos: [3.9, .5, 3.4], aim: [1.9, 0, -1.6], fov: 52 },
  { at: .12, pos: [3.5, .1, 2.1], aim: [1.8, 0, -2.1], fov: 62 },
  { at: .245, pos: [2.8, .5, 10.8], aim: [1.5, 0, 0], fov: 43 },
  { at: .34, pos: [4.2, 1.4, 8.2], aim: [1.5, 0, 0], fov: 40 },
  { at: .44, pos: [2.4, .1, 11.2], aim: [1.6, 0, 0], fov: 40 },
  { at: .55, pos: [4.8, 2.2, 9.8], aim: [1.5, 0, 0], fov: 42 },
  { at: .605, pos: [6.1, .6, 5.5], aim: [5.1, .2, -2], fov: 47 },
  { at: .655, pos: [2.4, 2.2, 13.8], aim: [1.2, 0, -5.5], fov: 47 },
  { at: .705, pos: [-1.5, 3.9, 12.8], aim: [.2, 0, -6], fov: 46 },
  { at: .745, pos: [1.3, 1.6, 10.8], aim: [.35, 0, -6], fov: 42 },
  { at: .78, pos: [1.5, .8, 10.5], aim: [.35, 0, -6], fov: 42 },
  { at: .84, pos: [3.4, 1.4, 13.2], aim: [1.3, 0, -2.2], fov: 43 },
  { at: .92, pos: [4.2, 1.6, 9.8], aim: [1.2, 0, -2.2], fov: 39 },
  { at: 1, pos: [4.4, 1.25, 9.1], aim: [1.2, 0, -2.2], fov: 39 },
] as const;
function shotValue(index: number, key: "pos" | "aim", axis: number, t: number) {
  const a = shots[index], b = shots[index + 1];
  const before = shots[Math.max(0, index - 1)], after = shots[Math.min(shots.length - 1, index + 2)];
  const va = a[key][axis], vb = b[key][axis];
  const duration = b.at - a.at;
  const ma = (vb - before[key][axis]) / (b.at - before.at) * duration;
  const mb = (after[key][axis] - va) / (after.at - a.at) * duration;
  const t2 = t * t, t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * va + (t3 - 2 * t2 + t) * ma + (-2 * t3 + 3 * t2) * vb + (t3 - t2) * mb;
}

function Director({ calm }: { calm: boolean }) {
  const { camera, size, gl } = useThree();
  const motion = useMotion();
  const position = useRef<Spring[]>([
    { value: shots[0].pos[0], velocity: 0 }, { value: shots[0].pos[1], velocity: 0 }, { value: shots[0].pos[2], velocity: 0 },
  ]);
  const aim = useRef<Spring[]>([
    { value: shots[0].aim[0], velocity: 0 }, { value: shots[0].aim[1], velocity: 0 }, { value: shots[0].aim[2], velocity: 0 },
  ]);
  const lens = useRef<Spring>({ value: shots[0].fov, velocity: 0 });
  const roll = useRef<Spring>({ value: 0, velocity: 0 });
  const previous = useRef(new THREE.Vector3(...shots[0].pos));
  useFrame((_, delta) => {
    const progress = motion.playhead.value;
    let i = shots.findIndex((s) => s.at > progress) - 1;
    i = clamp(i, 0, shots.length - 2);
    const a = shots[i], b = shots[i + 1];
    const t = clamp((progress - a.at) / (b.at - a.at), 0, 1);
    const mobile = size.width < 820;
    const desired = new THREE.Vector3(...[0, 1, 2].map(axis => shotValue(i, "pos", axis, t)) as [number, number, number]);
    const look = new THREE.Vector3(...[0, 1, 2].map(axis => shotValue(i, "aim", axis, t)) as [number, number, number]);
    const follow = range(progress, .548, .58) * (1 - range(progress, .625, .66));
    if (follow > 0) {
      const signal = new THREE.Vector3(motion.heroSignalX, motion.heroSignalY, motion.heroSignalZ);
      desired.lerp(signal.clone().add(new THREE.Vector3(1.8, .85, 5.8)), follow * .78);
      look.lerp(signal, follow * .88);
    }
    if (progress > .67 && progress < .79 && !calm) {
      const orbit = motion.heroField * (1 - motion.heroCompression * .65);
      desired.x += Math.sin(motion.time * .33) * orbit * .48;
      desired.y += Math.cos(motion.time * .27) * orbit * .21;
      desired.z -= motion.heroCompression * 1.2;
    }
    if (mobile) {
      desired.z *= progress >= .82 ? 1.65 : progress >= .64 ? 1.75 : 1.38;
      look.x += progress >= .82 ? 1.25 : progress >= .64 ? .55 : 0;
      look.y += .45;
    }
    if (calm) {
      desired.lerp(new THREE.Vector3(2.3, .8, 12), .57);
      look.lerp(new THREE.Vector3(1.4, 0, 0), .57);
    }
    const impact = motion.impactAge < .5 ? Math.exp(-motion.impactAge * 14) : 0;
    desired.z -= impact * (calm ? .12 : .75);
    desired.z -= motion.alignmentAge < .45 ? Math.exp(-motion.alignmentAge * 14) * (calm ? .03 : .17) : 0;
    const frequency = mobile ? 13 : 8 + motion.scrollEnergy * 3;
    const actual = position.current;
    camera.position.set(
      approach(actual[0], desired.x, frequency * .88, delta),
      approach(actual[1], desired.y, frequency * .82, delta),
      approach(actual[2], desired.z, frequency, delta),
    );
    const lookAt = new THREE.Vector3(
      approach(aim.current[0], look.x, frequency * 1.22, delta),
      approach(aim.current[1], look.y, frequency * 1.13, delta),
      approach(aim.current[2], look.z, frequency * 1.19, delta),
    );
    const rollTarget = calm ? 0 : clamp(-motion.playhead.velocity * .022, -.022, .022) + impact * Math.sin(motion.impactAge * 39) * .006;
    const actualRoll = approach(roll.current, rollTarget, 13, delta);
    camera.up.set(Math.sin(actualRoll), Math.cos(actualRoll), 0);
    camera.lookAt(lookAt);
    const perspective = camera as THREE.PerspectiveCamera;
    const fovTarget = THREE.MathUtils.lerp(a.fov, b.fov, ease(t)) * (mobile ? 1.1 : 1)
      + (calm ? 0 : Math.min(1.8, motion.scrollEnergy * 1.8) + Math.min(3.2, motion.heroSignalVelocity * .13) * follow)
      + impact * (calm ? 0 : 1.1);
    perspective.fov = approach(lens.current, fovTarget, 8.7, delta);
    perspective.updateProjectionMatrix();
    motion.cameraSpeed = decay(motion.cameraSpeed, camera.position.distanceTo(previous.current) / Math.max(delta, .001), 7, delta);
    previous.current.copy(camera.position);
    gl.toneMappingExposure = (1.25 + impact * (calm ? .12 : .42)) * (1 - motion.heroDarkness * .93);
  });
  return null;
}

function PerformanceGovernor({ quality, onSlow }: { quality: Quality; onSlow: () => void }) {
  const sample = useRef({ frames: 0, seconds: 0 });
  useEffect(() => { sample.current = { frames: 0, seconds: 0 }; }, [quality]);
  useFrame((_, delta) => {
    if (delta > .2) return;
    sample.current.frames++; sample.current.seconds += delta;
    if (sample.current.frames >= 180) {
      if (quality !== "low" && sample.current.seconds / sample.current.frames > .027) onSlow();
      sample.current = { frames: 0, seconds: 0 };
    }
  });
  return null;
}

const fieldVertex = `
attribute float aSeed;
uniform float uTime,uProgress,uStreak,uAlignment;
varying float vAlpha,vHeat,vAlignment;
void main(){
  vec3 p=position;
  vec4 view=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*view;
  float perspective=7./max(1.,-view.z);
  gl_PointSize=clamp((2.1+fract(aSeed*91.)*2.7)*perspective*(1.+uStreak*.32),1.,11.);
  vHeat=fract(aSeed*43.);
  vAlignment=uAlignment;
  vAlpha=(.27+.33*fract(aSeed*23.));
}`;
const fieldFragment = `
varying float vAlpha,vHeat,vAlignment;
uniform float uOpacity,uStreak;
void main(){
  vec2 q=gl_PointCoord-.5;
  q.x/=1.+uStreak*.55;
  float r=length(q);
  float core=1.-smoothstep(.06,.48,r);
  float halo=exp(-r*r*17.)*.22;
  vec3 warm=mix(vec3(.95,.48,.2),vec3(1.,.91,.7),vHeat);
  vec3 color=mix(warm,vec3(.77,.7,.95),vAlignment*.88);
  gl_FragColor=vec4(color,(core+halo)*vAlpha*uOpacity);
}`;

function AttentionField({ progress, quality, paused, calm }: SceneProps) {
  const motion = useMotion();
  const count = quality === "low" ? 1600 : quality === "medium" ? 3000 : 4800;
  const material = useRef<THREE.ShaderMaterial>(null);
  const release = useRef({ active: false, until: -1 });
  const field = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const original = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const velocity = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const thresholds = new Float32Array(count);
    const hash = (i: number, k: number) => {
      const v = Math.sin(i * k + k * 17.23) * 43758.5453;
      return v - Math.floor(v);
    };
    for (let i = 0; i < count; i++) {
      const seed = hash(i, 23.7);
      const angle = hash(i, 17.1) * Math.PI * 4;
      const lane = Math.floor(seed * 3);
      const radius = 1.7 + Math.pow(hash(i, 41.7), .7) * 1.2;
      const a = angle + lane * Math.PI * 2 / 3;
      const x = Math.cos(a) * radius + 1.1;
      const y = Math.sin(a) * radius * .76;
      const z = (angle / (Math.PI * 4) - .5) * 11 + (hash(i, 8.13) - .5) * 1.5;
      positions.set([x, y, z], i * 3);
      original.set([x, y, z], i * 3);
      velocity.set([-Math.sin(a) * .3, Math.cos(a) * .23, .18], i * 3);
      const col = i % 68, row = Math.floor(i / 68) % 42, layer = Math.floor(i / (68 * 42));
      const tx = -2.4 + col * .115, ty = -2.45 + row * .12;
      targets.set([tx, ty, -layer * 1.4 + Math.sin(col * .18) * .12], i * 3);
      seeds[i] = seed;
      thresholds[i] = .06 + seed * .66 + Math.hypot(tx, ty) * .012;
    }
    const geometry = new THREE.BufferGeometry();
    const position = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", position);
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return { positions, original, targets, velocity, thresholds, seeds, geometry, position };
  }, [count]);
  useEffect(() => () => field.geometry.dispose(), [field]);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uProgress: { value: 0 },
    uOpacity: { value: 1 }, uStreak: { value: 0 }, uAlignment: { value: 0 },
  }), []);
  useFrame((_, frameDelta) => {
    const dt = paused ? 0 : Math.min(frameDelta, .032);
    const p = motion.playhead.value;
    const alignmentIntent = range(p, .235, .405);
    if (alignmentIntent > .8) release.current.active = false;
    if (motion.direction < 0 && p < .28 && motion.alignment > .12 && !release.current.active) {
      release.current = { active: true, until: motion.time + 1.15 };
    }
    let aligned = 0, kinetic = 0;
    const { positions, original, targets, velocity, thresholds, seeds } = field;
    const pointerX = 1.5 + motion.pointerX * 4.1;
    const pointerY = motion.pointerY * 2.8;
    const turbulence = calm ? .23 : 1 + motion.scrollEnergy * .52;
    const wake = calm ? 0 : motion.pointerWake;
    for (let i = 0; i < count; i++) {
      const j = i * 3;
      let x = positions[j], y = positions[j + 1], z = positions[j + 2];
      let vx = velocity[j], vy = velocity[j + 1], vz = velocity[j + 2];
      const capture = windowed(alignmentIntent, thresholds[i], thresholds[i] + .24);
      const free = 1 - capture;
      const releaseForce = release.current.active && motion.time < release.current.until ? windowed(.31 - p, 0, .18) * 25 : 0;
      const time = motion.time;
      const curlX = Math.sin(y * .7 + time * .34) - Math.cos(z * .43 - time * .22);
      const curlY = Math.cos(z * .58 + time * .2) - Math.sin(x * .51);
      const curlZ = Math.sin(x * .48 + time * .15) - Math.cos(y * .55);
      const dx = x - pointerX, dy = y - pointerY;
      const radius2 = dx * dx + dy * dy + z * z * .09;
      const pointerForce = wake * Math.exp(-radius2 * .24) * (1 + Math.min(2, Math.hypot(motion.pointerVx, motion.pointerVy) * .1));
      const orbitX = -(y * .22), orbitY = (x - 1.1) * .2;
      const drag = 1.45 + capture * 10.5;
      const pull = capture * (24 + capture * 34);
      vx += ((curlX * .67 + orbitX) * turbulence * free + dx * pointerForce * .9 - dy * pointerForce * .3 + (targets[j] - x) * pull + (original[j] - x) * releaseForce - vx * drag) * dt;
      vy += ((curlY * .55 + orbitY) * turbulence * free + dy * pointerForce * .9 + dx * pointerForce * .3 + (targets[j + 1] - y) * pull + (original[j + 1] - y) * releaseForce - vy * drag) * dt;
      vz += ((curlZ * .45 + .2 + seeds[i] * .08) * turbulence * free + (targets[j + 2] - z) * pull + (original[j + 2] - z) * releaseForce - vz * drag) * dt;
      x += vx * dt; y += vy * dt; z += vz * dt;
      // A soft boundary recirculates uncaptured matter without a visible wrap.
      if (free > .1) {
        vx -= Math.max(0, Math.abs(x - 1.1) - 4.5) * Math.sign(x - 1.1) * dt * 2;
        vy -= Math.max(0, Math.abs(y) - 3.5) * Math.sign(y) * dt * 2;
        vz -= Math.max(0, Math.abs(z) - 6.1) * Math.sign(z) * dt * 1.8;
      }
      positions[j] = x; positions[j + 1] = y; positions[j + 2] = z;
      velocity[j] = vx; velocity[j + 1] = vy; velocity[j + 2] = vz;
      const distance2 = (targets[j] - x) ** 2 + (targets[j + 1] - y) ** 2 + (targets[j + 2] - z) ** 2;
      aligned += capture * Math.exp(-distance2 * .32) * Math.exp(-(vx * vx + vy * vy + vz * vz) * .015);
      kinetic += Math.abs(vx) + Math.abs(vy) + Math.abs(vz);
    }
    if (dt > 0) field.position.needsUpdate = true;
    motion.alignment = decay(motion.alignment, aligned / count, 13, frameDelta);
    motion.fieldEnergy = decay(motion.fieldEnergy, kinetic / count, 4, frameDelta);
    if (material.current) {
      const u = material.current.uniforms;
      u.uTime.value = motion.time; u.uProgress.value = p;
      u.uAlignment.value = motion.alignment;
      u.uStreak.value = calm ? 0 : Math.min(1, motion.scrollEnergy * .9 + motion.cameraSpeed * .015);
      u.uOpacity.value = 1 - range(p, .49, .7);
    }
  });
  return <>
    <points geometry={field.geometry} frustumCulled={false} visible={progress < .95}>
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={fieldVertex} fragmentShader={fieldFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  </>;
}
function Segment({ from, to, color, opacity = 1, radius = .01, route, step }: { from: [number, number, number]; to: [number, number, number]; color: string; opacity?: number; radius?: number; route?: number; step?: number }) {
  const a = useMemo(() => new THREE.Vector3(...from), [from]);
  const b = useMemo(() => new THREE.Vector3(...to), [to]);
  const length = a.distanceTo(b);
  const middle = a.clone().add(b).multiplyScalar(.5);
  const quaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()), [a, b]);
  return <mesh position={middle} quaternion={quaternion} userData={{ route, step }}><cylinderGeometry args={[radius, radius, length, 6]} /><meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} /></mesh>;
}

const formLines: { a: [number, number, number]; b: [number, number, number]; opacity: number }[] = [];
for (let y = -18; y <= 18; y += 3) formLines.push({ a: [-4.3, y * .14, 0], b: [4.3, y * .14, 0], opacity: y % 6 === 0 ? .45 : .15 });
for (let x = -28; x <= 28; x += 4) formLines.push({ a: [x * .14, -2.8, 0], b: [x * .14, 2.8, 0], opacity: x % 8 === 0 ? .36 : .12 });

function FormArchitecture({ progress, calm }: SceneProps) {
  const motion = useMotion();
  const root = useRef<THREE.Group>(null);
  const plane = useRef<THREE.Mesh>(null);
  const lines = useRef<THREE.Group>(null);
  const depth = useRef<Spring>({ value: 2.3, velocity: 0 });
  const yaw = useRef<Spring>({ value: -.62, velocity: 0 });
  const presence = useRef<Spring>({ value: 0, velocity: 0 });
  useFrame((_, delta) => {
    if (!root.current || !plane.current || !lines.current) return;
    const p = motion.playhead.value;
    const capture = motion.alignment;
    const inherited = windowed(p, .24, .34);
    const exit = windowed(p, .43, .50);
    const targetPresence = Math.max(capture, inherited * .35) * (1 - exit);
    const visible = approach(presence.current, targetPresence, 10.5, delta);
    root.current.scale.setScalar(.94 + visible * .06);
    root.current.position.x = 1.5;
    root.current.rotation.y = approach(yaw.current, -.57 + windowed(p, .3, .45) * .54 + (calm ? 0 : motion.pointerWake * motion.pointerX * .025), 9, delta);
    root.current.position.z = approach(depth.current, -1.7 + (1 - capture) * 2.3, 9.5, delta);
    const flex = calm ? 0 : motion.pointerWake * .012 + Math.min(.012, motion.pulseAge < .65 ? Math.exp(-motion.pulseAge * 9) * .012 : 0);
    plane.current.rotation.z = decay(plane.current.rotation.z, -flex * motion.pointerX, 8, delta);
    lines.current.visible = visible > .005;
    root.current.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const mat = object.material;
      if (!(mat instanceof THREE.MeshBasicMaterial)) return;
      if (mat.userData.baseOpacity === undefined) mat.userData.baseOpacity = mat.opacity;
      mat.transparent = true;
      const lockResponse = motion.alignmentAge < .3 ? Math.exp(-motion.alignmentAge * 15) * .32 : 0;
      mat.opacity = mat.userData.baseOpacity * visible * (1 + lockResponse);
    });
  });
  return <group ref={root} visible={progress > .21 && progress < .94}>
    <mesh ref={plane} position={[0, 0, -.25]}><planeGeometry args={[8.7, 5.7]} /><meshBasicMaterial color="#9291ae" transparent opacity={.055} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <group ref={lines}>{formLines.map((line, i) => <Segment key={i} from={line.a} to={line.b} color="#d1c5ed" opacity={line.opacity} radius={i % 3 ? .006 : .012} />)}</group>
    {[-3.8, -2.45, -.9, .7, 2.1, 3.55].map((x, i) => <group key={i} position={[x, 0, i % 2 ? .6 : -.4]}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[.022, i % 2 ? 6.8 : 5.5, .025]} /><meshBasicMaterial color="#f1e9ff" transparent opacity={i % 2 ? .78 : .48} /></mesh>
      <mesh position={[0, i % 2 ? 2.8 : -2.3, .03]}><boxGeometry args={[.3, .025, .03]} /><meshBasicMaterial color="#f1e9ff" /></mesh>
    </group>)}
    <Segment from={[-4.3, 2.8, .1]} to={[4.3, 2.8, .1]} color="#e4d8f4" opacity={.72} radius={.016} />
    <Segment from={[-4.3, -2.8, .1]} to={[4.3, -2.8, .1]} color="#e4d8f4" opacity={.72} radius={.016} />
    <TypePlane text="01 / HIERARCHY" position={[-2.55, 2.35, .13]} width={2.3} color="#e9dcff" />
    <TypePlane text="INFORMATION HAS SHAPE" position={[1.6, -2.35, .13]} width={3.2} color="#d6cce8" />
    <mesh position={[-1.35, .18, .25]}><planeGeometry args={[2.45, 3.35]} /><meshBasicMaterial color="#dfd4f4" transparent opacity={.085} side={THREE.DoubleSide} /></mesh>
    <mesh position={[1.75, -.45, -.65]}><planeGeometry args={[3, 2.2]} /><meshBasicMaterial color="#c9b7ed" transparent opacity={.07} side={THREE.DoubleSide} /></mesh>
  </group>;
}

function TypePlane({ text, position, width, color }: { text: string; position: [number, number, number]; width: number; color: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = 1024; canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 1024, 128); ctx.fillStyle = color; ctx.font = "bold 56px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, 512, 64);
    const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace; return map;
  }, [text, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={position}><planeGeometry args={[width, width / 8]} /><meshBasicMaterial map={texture} transparent depthWrite={false} /></mesh>;
}

const routes: [number, number, number][][] = Array.from({ length: 7 }, (_, i) => {
  const y = 2.4 - i * .8;
  return [[-4.6, y, -1], [-2.8, y, -.2], [-2.05, y + (i % 2 ? .32 : -.32), .4], [-.25, y + (i % 2 ? .32 : -.32), .4], [.55, y, .75], [2.6, y, .2], [4.4, y, -.8]];
});

function BehaviorNetwork({ progress, paused, calm, onSignal }: SceneProps) {
  const motion = useMotion();
  const root = useRef<THREE.Group>(null);
  const fixtures = useRef<THREE.Group>(null);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const nodes = useRef<(THREE.Mesh | null)[]>([]);
  const nodeSprings = useRef<Spring[]>(Array.from({ length: 14 }, () => ({ value: 0, velocity: 0 })));
  const previousSerial = useRef(0);
  const introduced = useRef(false);
  const event = useRef({ at: -100, route: 3 });
  const lastTravel = useRef(-1);
  useFrame((_, delta) => {
    if (!root.current) return;
    const p = motion.playhead.value;
    if (p < .43) introduced.current = false;
    if (p > .475 && !introduced.current) {
      introduced.current = true;
      event.current = { at: motion.time, route: 3 };
      lastTravel.current = -1;
      if (p < .66) onSignal({ stage: "input", route: 3, pan: -.48, energy: .68 });
    }
    if (previousSerial.current !== motion.pulseSerial) {
      previousSerial.current = motion.pulseSerial;
      event.current = { at: motion.time, route: motion.selectedSignal === null ? 3 : (motion.selectedSignal - 1) % 7 };
      lastTravel.current = -1;
      if (p < .66) onSignal({ stage: "input", route: event.current.route, pan: -.48, energy: 1 });
    }
    const age = motion.time - event.current.at;
    const travel = age * (calm ? 4.4 : 5.8);
    if (p >= .46 && p < .67 && !paused) {
      const crossed = [
        { distance: 2, stage: "route" as const, pan: -.13, energy: .72 },
        { distance: 4, stage: "split" as const, pan: .18, energy: .67 },
        { distance: 6, stage: "terminal" as const, pan: .48, energy: .83 },
      ].filter(node => lastTravel.current < node.distance && travel >= node.distance);
      crossed.forEach((node, index) => onSignal({
        stage: node.stage, route: event.current.route, pan: node.pan,
        energy: node.energy, delay: index * .065,
      }));
    }
    lastTravel.current = travel;
    const presence = range(p, .43, .53) * (1 - range(p, .73, .86));
    fixtures.current?.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || !(object.material instanceof THREE.MeshBasicMaterial)) return;
      const mat = object.material;
      if (mat.userData.baseOpacity === undefined) mat.userData.baseOpacity = mat.opacity;
      mat.transparent = true;
      mat.opacity = mat.userData.baseOpacity * presence;
    });
    const field = motion.heroField;
    const compression = motion.heroCompression;
    root.current.position.x = 2.2 - field * 1.25 - compression * 1.1;
    root.current.position.y = field * .42;
    root.current.position.z = -.12 - field * 1.9 - compression * 1.8;
    root.current.scale.setScalar(.88 * (1 - compression * .53));
    root.current.rotation.y = decay(root.current.rotation.y, -.17 + field * .45 + (calm ? 0 : motion.pointerWake * motion.pointerX * .012), 8, delta);
    root.current.rotation.z = decay(root.current.rotation.z, field * .17 + compression * .28, 8, delta);
    const activeRoute = event.current.route;
    root.current.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || typeof object.userData.route !== "number") return;
      const material = object.material;
      if (!(material instanceof THREE.MeshBasicMaterial)) return;
      const lane = object.userData.route as number;
      const step = object.userData.step as number;
      const delay = lane === activeRoute ? 0 : Math.abs(lane - activeRoute) === 1 ? .46 : 100;
      const travel = (age - delay) * (calm ? 4.4 : 5.8);
      const wave = Math.exp(-Math.pow((travel - step - .3) * 1.5, 2));
      const tail = travel > step ? Math.exp(-(travel - step) * 1.2) * .22 : 0;
      material.opacity = presence * (.18 + wave * .78 + tail);
      material.color.setRGB(.56 + wave * .32, .76 + wave * .21, .83 + wave * .17);
    });
    packets.current.forEach((mesh, lane) => {
      if (!mesh) return;
      const delay = lane === activeRoute ? 0 : Math.abs(lane - activeRoute) === 1 ? .46 : 100;
      const t = (age - delay) * (calm ? .73 : .97);
      mesh.visible = presence > .03 && t >= 0 && t <= 1;
      if (!mesh.visible) return;
      const segment = Math.min(5, Math.floor(t * 6));
      const f = t * 6 - segment;
      const from = routes[lane][segment], to = routes[lane][segment + 1];
      mesh.position.set(from[0] + (to[0] - from[0]) * f, from[1] + (to[1] - from[1]) * f, from[2] + (to[2] - from[2]) * f);
      mesh.scale.setScalar(lane === activeRoute ? 1.1 : .7);
    });
    nodes.current.forEach((mesh, index) => {
      if (!mesh) return;
      const lane = Math.floor(index / 2);
      const step = index % 2 === 0 ? 2 : 4;
      const delay = lane === activeRoute ? 0 : Math.abs(lane - activeRoute) === 1 ? .46 : 100;
      const travel = (age - delay) * (calm ? 4.4 : 5.8);
      const response = Math.exp(-Math.pow((travel - step) * 2, 2));
      const displacement = approach(nodeSprings.current[index], calm ? response * .035 : response * .1, 17, paused ? 0 : delta);
      mesh.position.z = routes[lane][step][2] + displacement;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.transparent = true;
      mat.opacity = presence;
      mat.emissiveIntensity = .2 + response * 1.6;
    });
  });
  return <group ref={root} visible={progress >= .46 && progress < .88}>
    {routes.map((route, i) => <group key={i}>
      {route.slice(0, -1).map((point, j) => <Segment key={j} from={point as [number, number, number]} to={route[j + 1] as [number, number, number]} color="#a5d6e6" opacity={.18} radius={.012} route={i} step={j} />)}
      <mesh ref={(element) => { packets.current[i] = element; }} visible={false}><sphereGeometry args={[.1, 12, 8]} /><meshBasicMaterial color="#e4faff" /></mesh>
      <mesh ref={(element) => { nodes.current[i * 2] = element; }} position={route[2]}><octahedronGeometry args={[.17]} /><meshStandardMaterial color="#9bbfcb" emissive="#69c1db" emissiveIntensity={.2} metalness={.65} roughness={.27} /></mesh>
      <mesh ref={(element) => { nodes.current[i * 2 + 1] = element; }} position={route[4]}><octahedronGeometry args={[.12]} /><meshStandardMaterial color="#9bbfcb" emissive="#69c1db" emissiveIntensity={.2} metalness={.65} roughness={.27} /></mesh>
    </group>)}
    <group ref={fixtures}>
    {[-4.7, 4.5].map(x => <group key={x} position={[x, 0, -.8]}>
      <mesh><boxGeometry args={[.045, 6.1, .045]} /><meshBasicMaterial color="#b5dbe8" transparent opacity={.38} /></mesh>
      <mesh position={[0, 3.05, 0]}><sphereGeometry args={[.09, 10, 10]} /><meshBasicMaterial color="#e4faff" /></mesh>
    </group>)}
    <TypePlane text="INPUT / STATE / RESPONSE" position={[0, -3.3, .5]} width={4.7} color="#bde1ec" />
    </group>
  </group>;
}
