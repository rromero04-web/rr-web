"use client";
/* eslint-disable react-hooks/immutability -- R3F animates scene graph objects in the render loop. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { range, type Quality } from "./model";
import { approach, createMotionState, decay, windowed, type MotionState, type Spring } from "./motion";

type SceneProps = {
  progress: number; paused: boolean; quality: Quality; selected: number | null;
  routed: number[]; pulse: number; calm: boolean; onSlow: () => void; onCue: (cue: "alignment" | "anticipation" | "impact") => void;
};

const WARM = new THREE.Color("#f4ad58");
const VIOLET = new THREE.Color("#b9a9e4");
const COLD = new THREE.Color("#a9dded");
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
  useFrame((state, frameDelta) => {
    const dt = Math.min(frameDelta, .05);
    const inputVelocity = clamp((props.progress - motion.previousRaw) / Math.max(dt, .001), -4, 4);
    motion.previousRaw = props.progress;
    motion.raw = props.progress;
    motion.rawVelocity = decay(motion.rawVelocity, inputVelocity, 11, dt);
    motion.direction = Math.sign(motion.rawVelocity);
    motion.scrollEnergy = decay(motion.scrollEnergy, Math.min(1, Math.abs(motion.rawVelocity) * 1.3), 5, dt);
    const frequency = size.width < 820 ? 21 : 13 + motion.scrollEnergy * 6;
    const previous = motion.playhead.value;
    approach(motion.playhead, props.progress, frequency, dt);
    if (Math.abs(props.progress - motion.playhead.value) < .00002 && Math.abs(motion.playhead.velocity) < .0002) {
      motion.playhead.value = props.progress;
      motion.playhead.velocity = 0;
    }
    if (previous < .695 && motion.playhead.value >= .695 && motion.direction >= 0) props.onCue("anticipation");
    if (motion.previousAlignment < .82 && motion.alignment >= .82 && motion.direction >= 0) {
      motion.alignmentAge = 0;
      props.onCue("alignment");
    }
    motion.previousAlignment = motion.alignment;
    if (previous < .763 && motion.playhead.value >= .763 && motion.direction >= 0) {
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
    <Collision {...props} />
    <SpatialProduct {...props} />
  </MotionContext.Provider>;
}

// Each hold is a real shot: the camera crosses the field, tracks past the grid,
// retreats for the three-body reveal and finally approaches the finished object.
const shots = [
  { at: 0, pos: [3.9, .5, 3.4], aim: [1.9, 0, -1.6], fov: 52 },
  { at: .12, pos: [3.5, .1, 2.1], aim: [1.8, 0, -2.1], fov: 62 },
  { at: .245, pos: [2.8, .5, 10.8], aim: [1.5, 0, 0], fov: 43 },
  { at: .34, pos: [4.2, 1.4, 8.2], aim: [1.5, 0, 0], fov: 40 },
  { at: .44, pos: [2.4, .1, 11.2], aim: [1.6, 0, 0], fov: 40 },
  { at: .55, pos: [4.8, 2.2, 9.8], aim: [1.5, 0, 0], fov: 42 },
  { at: .635, pos: [2.5, .2, 11], aim: [1.4, 0, 0], fov: 42 },
  { at: .685, pos: [0, 3.2, 22], aim: [0, 0, 0], fov: 43 },
  { at: .738, pos: [2.1, 2.8, 20], aim: [0, 0, 0], fov: 43 },
  { at: .765, pos: [1.1, .7, 15.5], aim: [0, 0, 0], fov: 47 },
  { at: .805, pos: [0, 0, 18], aim: [0, 0, 0], fov: 42 },
  { at: .88, pos: [3.6, 1.7, 11], aim: [1.4, 0, 0], fov: 40 },
  { at: 1, pos: [4.3, 1.2, 10.6], aim: [1.4, 0, 0], fov: 40 },
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
    if (mobile) {
      desired.z *= progress >= .81 ? 1.85 : progress >= .64 ? 1.55 : 1.38;
      look.x += progress >= .64 && progress < .81 ? 2 : 0;
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
    const fovTarget = THREE.MathUtils.lerp(a.fov, b.fov, ease(t)) * (mobile ? 1.1 : 1) + (calm ? 0 : Math.min(1.8, motion.scrollEnergy * 1.8)) + impact * (calm ? 0 : 1.1);
    perspective.fov = approach(lens.current, fovTarget, 8.7, delta);
    perspective.updateProjectionMatrix();
    motion.cameraSpeed = decay(motion.cameraSpeed, camera.position.distanceTo(previous.current) / Math.max(delta, .001), 7, delta);
    previous.current.copy(camera.position);
    gl.toneMappingExposure = 1.25 + impact * (calm ? .18 : .65);
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
uniform float uTime,uProgress,uSatellite,uStreak,uAlignment;
varying float vAlpha,vHeat,vAlignment;
void main(){
  vec3 p=position;
  if(uSatellite>.5){
    float influence=smoothstep(.65,.73,uProgress);
    float brake=smoothstep(.727,.744,uProgress)*(1.-smoothstep(.745,.758,uProgress));
    float a=influence*(1.-brake)*1.5+uTime*.12*(1.-brake);
    p=vec3(-5.3+p.x*.72,1.1+p.y*.7,p.z*.5);
    p.xy=mat2(cos(a),-sin(a),sin(a),cos(a))*p.xy;
    p.xy=mix(p.xy,vec2(3.,0.),smoothstep(.742,.764,uProgress)*.92);
  }
  vec4 view=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*view;
  float perspective=7./max(1.,-view.z);
  gl_PointSize=clamp((2.1+fract(aSeed*91.)*2.7)*perspective*(1.+uStreak*.32)*(uSatellite>.5?2.1:1.),1.,11.);
  vHeat=fract(aSeed*43.);
  vAlignment=uSatellite>.5?0.:uAlignment;
  vAlpha=(.27+.33*fract(aSeed*23.))*(uSatellite>.5?1.35:1.);
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
  const satellite = useRef<THREE.ShaderMaterial>(null);
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
    const satelliteGeometry = new THREE.BufferGeometry();
    satelliteGeometry.setAttribute("position", new THREE.BufferAttribute(original, 3));
    satelliteGeometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return { positions, original, targets, velocity, thresholds, seeds, geometry, satelliteGeometry, position };
  }, [count]);
  useEffect(() => () => { field.geometry.dispose(); field.satelliteGeometry.dispose(); }, [field]);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uProgress: { value: 0 }, uSatellite: { value: 0 },
    uOpacity: { value: 1 }, uStreak: { value: 0 }, uAlignment: { value: 0 },
  }), []);
  const satelliteUniforms = useMemo(() => ({
    uTime: { value: 0 }, uProgress: { value: 0 }, uSatellite: { value: 1 },
    uOpacity: { value: 0 }, uStreak: { value: 0 }, uAlignment: { value: 0 },
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
      u.uOpacity.value = 1 - range(p, .49, .68) * .85;
    }
    if (satellite.current) {
      const u = satellite.current.uniforms;
      u.uTime.value = motion.time; u.uProgress.value = p;
      u.uStreak.value = calm ? 0 : motion.scrollEnergy * .7;
      u.uOpacity.value = 3.8 * range(p, .61, .69) * (1 - range(p, .79, .87));
    }
  });
  return <>
    <points geometry={field.geometry} frustumCulled={false} visible={progress < .95}>
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={fieldVertex} fragmentShader={fieldFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
    <points geometry={field.satelliteGeometry} frustumCulled={false} visible={progress > .55 && progress < .89}>
      <shaderMaterial ref={satellite} uniforms={satelliteUniforms} vertexShader={fieldVertex} fragmentShader={fieldFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
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

function BehaviorNetwork({ progress, paused, calm }: SceneProps) {
  const motion = useMotion();
  const root = useRef<THREE.Group>(null);
  const fixtures = useRef<THREE.Group>(null);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const nodes = useRef<(THREE.Mesh | null)[]>([]);
  const nodeSprings = useRef<Spring[]>(Array.from({ length: 14 }, () => ({ value: 0, velocity: 0 })));
  const previousSerial = useRef(0);
  const introduced = useRef(false);
  const event = useRef({ at: -100, route: 3 });
  useFrame((_, delta) => {
    if (!root.current) return;
    const p = motion.playhead.value;
    if (p < .43) introduced.current = false;
    if (p > .475 && !introduced.current) {
      introduced.current = true;
      event.current = { at: motion.time, route: 3 };
    }
    if (previousSerial.current !== motion.pulseSerial) {
      previousSerial.current = motion.pulseSerial;
      event.current = { at: motion.time, route: motion.selectedSignal === null ? 3 : (motion.selectedSignal - 1) % 7 };
    }
    const age = motion.time - event.current.at;
    const presence = range(p, .43, .53) * (1 - range(p, .73, .86));
    fixtures.current?.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || !(object.material instanceof THREE.MeshBasicMaterial)) return;
      const mat = object.material;
      if (mat.userData.baseOpacity === undefined) mat.userData.baseOpacity = mat.opacity;
      mat.transparent = true;
      mat.opacity = mat.userData.baseOpacity * presence;
    });
    root.current.position.x = 2.2;
    root.current.position.z = -.12;
    root.current.scale.setScalar(.88);
    root.current.rotation.y = decay(root.current.rotation.y, -.17 + (calm ? 0 : motion.pointerWake * motion.pointerX * .012), 8, delta);
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
function Collision({ progress, paused, calm }: SceneProps) {
  const motion = useMotion();
  const { size } = useThree();
  const root = useRef<THREE.Group>(null);
  const form = useRef<THREE.Group>(null), behavior = useRef<THREE.Group>(null), ring = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null), light = useRef<THREE.PointLight>(null);
  const shards = useRef<(THREE.Mesh | null)[]>([]);
  const bodies = useRef([
    [{ value: -2.8, velocity: 0 }, { value: 2.2, velocity: 0 }, { value: 0, velocity: 0 }],
    [{ value: 2.1, velocity: 0 }, { value: -2.3, velocity: 0 }, { value: 0, velocity: 0 }],
  ] as Spring[][]);
  const seenImpact = useRef(0);
  const debrisVelocity = useRef(Array.from({ length: 38 }, () => new THREE.Vector3()));
  useFrame((_, delta) => {
    if (!root.current || !form.current || !behavior.current || !ring.current || !core.current || !light.current) return;
    const p = motion.playhead.value;
    const dt = paused ? 0 : Math.min(delta, .05);
    const entrance = range(p, .61, .685);
    const orbit = range(p, .66, .728);
    const hold = range(p, .724, .739) * (1 - range(p, .743, .751));
    const compression = range(p, .744, .766);
    const exit = range(p, .8, .87);
    const presence = entrance * (1 - exit * .98);
    root.current.position.x = 3;
    root.current.scale.setScalar(size.width < 820 ? .62 : 1);
    const motionBrake = 1 - hold * .93;
    const angle = orbit * 1.5 + (calm ? 0 : motion.time * .035 * orbit * motionBrake);
    const radius = 5.5 * (1 - compression * .93);
    [form.current, behavior.current].forEach((body, index) => {
      const phase = index === 0 ? 2.1 : -1.2;
      const targetX = Math.cos(angle + phase) * radius;
      const targetY = Math.sin(angle + phase) * radius * .47;
      const frequency = hold > .5 ? 11 : compression > .1 ? 15 : index === 0 ? 5.4 : 6.8;
      const state = bodies.current[index];
      body.position.set(approach(state[0], targetX, frequency, dt), approach(state[1], targetY, frequency, dt), -.8);
      body.rotation.z = approach(state[2], (index === 0 ? 1 : -1) * (angle * .65 + compression * 1.1), 6.5, dt);
      body.scale.setScalar((index === 0 ? 1.45 : 1.5) * (1 + (motion.impactAge < .3 ? Math.exp(-motion.impactAge * 11) * .045 : 0)));
    });
    root.current.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || object.userData.effect) return;
      const mat = object.material;
      if (!(mat instanceof THREE.MeshBasicMaterial)) return;
      if (mat.userData.baseOpacity === undefined) mat.userData.baseOpacity = mat.opacity;
      mat.transparent = true;
      mat.opacity = mat.userData.baseOpacity * presence;
    });
    const age = motion.impactAge;
    if (seenImpact.current !== motion.impactSerial) {
      seenImpact.current = motion.impactSerial;
      shards.current.forEach((mesh, i) => {
        if (!mesh) return;
        mesh.position.set(0, 0, 0);
        const a = i * 2.399;
        const speed = 4.2 + (i % 7) * .55;
        debrisVelocity.current[i].set(Math.cos(a) * speed, Math.sin(a) * speed, Math.sin(a * 2) * speed * .3);
      });
    }
    const wave = age > .035 && age < .72 ? (age - .035) / .685 : -1;
    ring.current.scale.setScalar(wave < 0 ? .001 : .4 + wave * (calm ? 6 : 12));
    (ring.current.material as THREE.MeshBasicMaterial).opacity = wave < 0 ? 0 : (1 - wave) * (1 - wave) * (calm ? .27 : .62);
    core.current.scale.setScalar(age < .13 ? .05 + Math.sin(Math.min(1, age / .13) * Math.PI) * (calm ? .42 : .72) : .001);
    (core.current.material as THREE.MeshBasicMaterial).opacity = age < .13 ? Math.sin(Math.min(1, age / .13) * Math.PI) * (calm ? .28 : .8) : 0;
    light.current.intensity = age < .32 ? Math.exp(-age * 16) * (calm ? 9 : 48) : 0;
    shards.current.forEach((mesh, i) => {
      if (!mesh) return;
      const v = debrisVelocity.current[i];
      const drag = Math.exp(-dt * (3.1 + i % 4 * .22));
      const move = dt > 0 ? (1 - drag) / (3.1 + i % 4 * .22) : 0;
      mesh.position.addScaledVector(v, move);
      v.multiplyScalar(drag);
      mesh.rotation.x += dt * (i % 2 ? 1.7 : -.9);
      mesh.rotation.y += dt * (i % 3 ? .8 : -1.2);
      const fade = age < .12 ? age / .12 : Math.max(0, 1 - (age - .12) / .75);
      mesh.scale.setScalar(age < .88 ? Math.max(0, fade) * (calm ? .35 : .65) : 0);
    });
  });
  return <group ref={root} visible={progress > .58 && progress < .89}>
    <group ref={form} scale={1.45}>
      {Array.from({ length: 6 }, (_, i) => {
        const w = 1.2 + i * .16, h = 1.75 + i * .13, z = -.7 + i * .25;
        return <group key={i} rotation={[i * .04, i * .09, i * .025]}>
          <Segment from={[-w, -h, z]} to={[w, -h, z]} color="#d7c4ef" opacity={.35 + i * .08} radius={.012} />
          <Segment from={[w, -h, z]} to={[w, h, z]} color="#e2d3f4" opacity={.35 + i * .08} radius={.012} />
          <Segment from={[w, h, z]} to={[-w, h, z]} color="#d7c4ef" opacity={.35 + i * .08} radius={.012} />
          <Segment from={[-w, h, z]} to={[-w, -h, z]} color="#e2d3f4" opacity={.35 + i * .08} radius={.012} />
        </group>;
      })}
      <mesh position={[0, 0, .3]} rotation={[0, -.25, 0]}><planeGeometry args={[1.8, 2.4]} /><meshBasicMaterial color="#cbbde8" transparent opacity={.12} side={THREE.DoubleSide} /></mesh>
      <Segment from={[-2.1, 0, .2]} to={[2.1, 0, .2]} color="#fff3ff" opacity={.83} radius={.019} />
      <Segment from={[0, -2.25, .2]} to={[0, 2.25, .2]} color="#fff3ff" opacity={.83} radius={.019} />
    </group>
    <group ref={behavior} scale={1.5}>
      {Array.from({ length: 17 }, (_, i) => {
        const angle = i * 2.399, radius = 1.1 + (i % 4) * .34;
        const node: [number, number, number] = [Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(i * 1.7) * .8];
        const nextAngle = (i + 5) * 2.399, nextRadius = 1.1 + ((i + 5) % 4) * .34;
        const next: [number, number, number] = [Math.cos(nextAngle) * nextRadius, Math.sin(nextAngle) * nextRadius, Math.sin((i + 5) * 1.7) * .8];
        return <group key={i}>
          <Segment from={node} to={next} color="#9fd9e9" opacity={.48} radius={.013} />
          <mesh position={node}><octahedronGeometry args={[i % 4 === 0 ? .14 : .075]} /><meshBasicMaterial color={i % 4 === 0 ? "#e0f8ff" : "#87c1d3"} /></mesh>
        </group>;
      })}
      <mesh><icosahedronGeometry args={[.34, 1]} /><meshBasicMaterial color="#bbebf5" wireframe /></mesh>
    </group>
    <Segment from={[-6.1, 1.2, -1.5]} to={[-2.4, 1.8, -1.2]} color="#d6a875" opacity={.3} radius={.014} />
    <Segment from={[-2.3, 1.8, -1.2]} to={[1.8, -.9, -.8]} color="#d7c5ed" opacity={.35} radius={.012} />
    <mesh ref={ring} userData={{ effect: true }}><ringGeometry args={[.97, 1, 96]} /><meshBasicMaterial color="#fffaf0" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh ref={core} userData={{ effect: true }}><sphereGeometry args={[1, 32, 20]} /><meshBasicMaterial color="#fff8e8" transparent opacity={0} depthWrite={false} /></mesh>
    {Array.from({ length: 38 }, (_, i) => <mesh key={i} userData={{ effect: true }} ref={(element) => { shards.current[i] = element; }}><tetrahedronGeometry args={[.07 + i % 4 * .025]} /><meshBasicMaterial color={i % 3 === 0 ? WARM : i % 3 === 1 ? VIOLET : COLD} transparent opacity={.8} /></mesh>)}
    <pointLight ref={light} color="#ffffff" intensity={0} distance={18} decay={2} />
  </group>;
}

function productRoutePoint(age: number, signal: number) {
  const index = Math.max(0, Math.min(5, signal - 1));
  const angle = -.75 + index * .31;
  const fin = new THREE.Vector3(1.05 + Math.cos(angle) * 1.15, Math.sin(angle) * 2.45, .52 + index * .08);
  const points = [
    { at: 0, point: new THREE.Vector3(-2.65, .15, .55) },
    { at: .29, point: new THREE.Vector3(-.1, 0, .25) },
    { at: .42, point: new THREE.Vector3(-.1, 0, .25) },
    { at: .79, point: fin },
    { at: 1.13, point: new THREE.Vector3(3.05, -2.1 + index * .68, .2) },
  ];
  for (let i = 0; i < points.length - 1; i++) {
    if (age <= points[i + 1].at) {
      const t = clamp((age - points[i].at) / (points[i + 1].at - points[i].at), 0, 1);
      return points[i].point.lerp(points[i + 1].point, ease(t));
    }
  }
  return points[points.length - 1].point;
}

function SpatialProduct({ progress, paused, calm, selected, routed }: SceneProps) {
  const motion = useMotion();
  const { size } = useThree();
  const root = useRef<THREE.Group>(null), stream = useRef<THREE.Group>(null), marker = useRef<THREE.Mesh>(null);
  const trails = useRef<(THREE.Mesh | null)[]>([]);
  const fins = useRef<(THREE.Group | null)[]>([]);
  const hub = useRef<THREE.Mesh>(null), output = useRef<THREE.Mesh>(null);
  const birth = useRef<Spring>({ value: 0, velocity: 0 });
  const x = useRef<Spring>({ value: 3, velocity: 0 }), yaw = useRef<Spring>({ value: 1.15, velocity: 0 });
  const finSprings = useRef(Array.from({ length: 6 }, () => ({ value: 0, velocity: 0 })));
  useFrame((_, delta) => {
    if (!root.current || !stream.current || !marker.current || !hub.current || !output.current) return;
    const p = motion.playhead.value;
    const entry = range(p, .755, .855);
    const formed = approach(birth.current, entry, 11, delta);
    const mobileScale = size.width < 820 ? .68 : .8;
    root.current.scale.setScalar((.74 + formed * .26) * mobileScale);
    root.current.position.set(approach(x.current, size.width < 820 ? 2.05 : 2.6, 6.8, delta), -.12, 0);
    root.current.rotation.y = approach(yaw.current, -.27 + (calm ? 0 : Math.sin(motion.time * .17) * .018), 6.7, delta);
    stream.current.rotation.z += paused ? 0 : delta * (calm ? .018 : .055);
    root.current.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || object.userData.effect) return;
      const mat = object.material;
      if (!(mat instanceof THREE.MeshBasicMaterial || mat instanceof THREE.MeshStandardMaterial)) return;
      if (mat.userData.baseOpacity === undefined) mat.userData.baseOpacity = mat.opacity;
      mat.transparent = true;
      mat.opacity = mat.userData.baseOpacity * formed;
    });
    fins.current.forEach((fin, i) => {
      if (!fin) return;
      const angle = -.75 + i * .31;
      const baseY = Math.sin(angle) * 2.45;
      const response = motion.selectedSignal === i + 1 && motion.pulseAge > .45 && motion.pulseAge < 1.05
        ? Math.sin((motion.pulseAge - .45) / .6 * Math.PI) * .22 : 0;
      fin.position.y = approach(finSprings.current[i], baseY * (.45 + formed * .55) + response, 13.5, delta);
      fin.position.z = .28 + i * .08 - (1 - formed) * .85;
    });
    const age = motion.pulseAge;
    const route = motion.selectedSignal ?? selected ?? 1;
    const markerMesh = marker.current;
    markerMesh.visible = age < 1.13 && p > .78;
    if (markerMesh.visible) markerMesh.position.copy(productRoutePoint(age, route));
    trails.current.forEach((mesh, i) => {
      if (!mesh) return;
      const lag = (i + 1) * .045;
      mesh.visible = markerMesh.visible && age > lag;
      if (mesh.visible) mesh.position.copy(productRoutePoint(age - lag, route));
    });
    const hubResponse = age > .22 && age < .52 ? Math.sin((age - .22) / .3 * Math.PI) : 0;
    (hub.current.material as THREE.MeshStandardMaterial).emissiveIntensity = .08 + Math.max(0, hubResponse) * (calm ? .3 : 1.3);
    const outputResponse = age > .9 && age < 1.4 ? Math.sin((age - .9) / .5 * Math.PI) : 0;
    output.current.scale.setScalar(1 + Math.max(0, outputResponse) * .65);
  });
  return <group ref={root} visible={progress > .72}>
    <mesh rotation={[.16, .24, -.18]}><torusGeometry args={[2.45, .075, 12, 96, Math.PI * 1.83]} /><meshStandardMaterial color="#d2ccc2" metalness={.82} roughness={.23} /></mesh>
    <mesh position={[0, 0, -.2]} rotation={[.1, .26, -.18]}><torusGeometry args={[2.17, .014, 8, 96]} /><meshBasicMaterial color="#918fa4" transparent opacity={.75} /></mesh>
    <mesh position={[0, 0, -.7]} rotation={[.08, .3, -.18]}><torusGeometry args={[2.72, .012, 8, 96, Math.PI * 1.68]} /><meshBasicMaterial color="#718f9b" transparent opacity={.6} /></mesh>
    <group ref={stream} position={[-2.6, .15, .35]}>
      <mesh rotation={[0, .2, 0]}><torusGeometry args={[1.35, .018, 8, 96, Math.PI * 1.6]} /><meshBasicMaterial color="#f1b577" /></mesh>
      {Array.from({ length: 42 }, (_, i) => <mesh key={i} position={[Math.sin(i * 2.4) * 1.27, Math.cos(i * 2.4) * 1.27, Math.sin(i * 3.2) * .35]}><sphereGeometry args={[.022 + i % 4 * .01, 6, 6]} /><meshBasicMaterial color={i % 3 ? "#e6b483" : "#fff1d3"} /></mesh>)}
    </group>
    <mesh ref={marker} userData={{ effect: true }} visible={false}><sphereGeometry args={[.12, 12, 12]} /><meshBasicMaterial color="#fff4de" /></mesh>
    {Array.from({ length: 3 }, (_, i) => <mesh key={i} userData={{ effect: true }} ref={(element) => { trails.current[i] = element; }} visible={false} scale={1 - i * .18}><sphereGeometry args={[.075, 10, 10]} /><meshBasicMaterial color="#eac694" transparent opacity={.24 - i * .06} depthWrite={false} /></mesh>)}
    <mesh ref={hub} position={[-.1, 0, -.17]} rotation={[.1, .25, -.18]}><cylinderGeometry args={[.36, .36, .14, 48]} /><meshStandardMaterial color="#efece3" emissive="#f2d0aa" emissiveIntensity={.08} metalness={.42} roughness={.34} /></mesh>
    <mesh position={[-.1, 0, -.03]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.25, .025, 8, 48]} /><meshBasicMaterial color="#d4c6e9" /></mesh>
    <TypePlane text="SIGNAL / COMPOSER" position={[1.5, 2.65, .28]} width={3.5} color="#ede8dd" />
    {Array.from({ length: 6 }, (_, i) => {
      const active = selected === i + 1, done = routed.includes(i + 1);
      const angle = -.75 + i * .31;
      const x = 1.05 + Math.cos(angle) * 1.15, y = Math.sin(angle) * 2.45;
      return <group key={i} ref={(element) => { fins.current[i] = element; }} position={[x, y, .28 + i * .08]} rotation={[.09, -.25 + i * .045, angle * .32]}>
        <mesh><boxGeometry args={[2.85, .31, .12]} /><meshStandardMaterial color={active ? "#c7b8d7" : done ? "#a3c1ca" : "#777f84"} metalness={.64} roughness={.3} /></mesh>
        <mesh position={[-1.18, 0, .08]}><boxGeometry args={[.22, .05, .025]} /><meshBasicMaterial color={done ? "#f1c98d" : active ? "#fff6ea" : "#202f37"} /></mesh>
        <mesh position={[1.3, 0, .09]}><sphereGeometry args={[.045, 10, 10]} /><meshBasicMaterial color={done ? "#e5faff" : active ? "#f5c289" : "#303f48"} /></mesh>
      </group>;
    })}
    <Segment from={[3.05, -2.1, .1]} to={[3.05, 2.2, .1]} color="#96dce7" opacity={.65} radius={.016} />
    <mesh ref={output} position={[3.05, -2.1 + routed.length * .68, .15]}><sphereGeometry args={[.11, 12, 12]} /><meshBasicMaterial color="#bdeef3" /></mesh>
    <TypePlane text="IN / STRUCTURE / OUT" position={[1.5, -2.65, .15]} width={3.5} color="#a9bac2" />
  </group>;
}
