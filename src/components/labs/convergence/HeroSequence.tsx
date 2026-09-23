/* eslint-disable react-hooks/immutability -- The scene owns mutable WebGL buffers and motion state. */
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { range, type Quality } from "./model";
import { approach, decay, type MotionState, type Spring } from "./motion";

type Props = {
  motion: MotionState; progress: number; quality: Quality; paused: boolean;
  calm: boolean; selected: number | null; routed: number[]; onProductReady: (ready: boolean) => void;
};

const clamp = THREE.MathUtils.clamp;
const CENTER = new THREE.Vector3(.35, 0, -6);
const signalCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(3.7, -.05, .45),
  new THREE.Vector3(5.15, -.05, .3),
  new THREE.Vector3(6.25, -.05, -.8),
  new THREE.Vector3(7.05, .25, -1.8),
  new THREE.Vector3(7.5, .4, -4.5),
  new THREE.Vector3(4.1, .9, -6),
  new THREE.Vector3(.4, .4, -6),
  new THREE.Vector3(-4.8, .1, -7.4),
], false, "centripetal");

// The same central attraction/vorticity drives matter, structural displacement
// and the curvature of energy conduits, at different strengths and times.
export function convergenceForce(x: number, y: number, z: number, strength: number, compression: number) {
  const dx = CENTER.x - x, dy = CENTER.y - y, dz = CENTER.z - z;
  const r = Math.sqrt(dx * dx + dy * dy + dz * dz) + .01;
  const pull = strength * (1.1 + compression * 8) / (1 + r * .15);
  const vortex = strength * (1 - compression * .82) * .9 / (1 + r * .08);
  return [dx * pull - dy * vortex, dy * pull + dx * vortex, dz * pull * .62] as const;
}

const fieldWarp = `
vec3 bend(vec3 p, float field, float compression) {
  vec3 d = p - vec3(.35, 0., -6.);
  float r = length(d.xy) + .01;
  float influence = field / (1. + r * .11);
  float angle = influence * (1. - compression * .65) * .38;
  mat2 spin = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  d.xy = spin * d.xy * (1. - compression * .74 * influence);
  d.z *= 1. - compression * .56 * influence;
  return vec3(.35, 0., -6.) + d;
}
`;

export function HeroSequence(props: Props) {
  return <>
    <HeroController {...props} />
    <HeroLights motion={props.motion} />
    <HeroMatter {...props} />
    <HeroLattice {...props} />
    <HeroPanels {...props} />
    <HeroConduits {...props} />
    <HeroSignal {...props} />
    <Synthesis {...props} />
    <VoidCurtain motion={props.motion} />
  </>;
}

function HeroLights({ motion }: { motion: MotionState }) {
  const warm = useRef<THREE.PointLight>(null);
  const optical = useRef<THREE.PointLight>(null);
  const cold = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const energy = motion.heroConnection * (1 - motion.heroDarkness);
    if (warm.current) warm.current.intensity = energy * (1.2 + motion.heroField * .8);
    if (optical.current) optical.current.intensity = energy * (1.1 + motion.heroCompression * 1.8);
    if (cold.current) cold.current.intensity = energy * (1.6 + motion.heroSignalVelocity * .035);
  });
  return <>
    <pointLight ref={warm} position={[-5, 2, -6]} color="#f4a86f" intensity={0} distance={14} />
    <pointLight ref={optical} position={[.35, 1.4, -6]} color="#d0c9f2" intensity={0} distance={13} />
    <pointLight ref={cold} position={[6, .4, -3]} color="#9adfff" intensity={0} distance={13} />
  </>;
}

function HeroController({ motion, paused, calm, onProductReady }: Props) {
  const signal = useRef<Spring[]>([
    { value: 3.7, velocity: 0 }, { value: -.05, velocity: 0 }, { value: .45, velocity: 0 },
  ]);
  const revealed = useRef(false);
  useFrame((_, frameDelta) => {
    const p = motion.playhead.value;
    const dt = paused ? 0 : Math.min(frameDelta, .5);
    const t = range(p, .545, .717);
    const point = signalCurve.getPoint(t);
    const previous = new THREE.Vector3(motion.heroSignalX, motion.heroSignalY, motion.heroSignalZ);
    motion.heroSignalX = approach(signal.current[0], point.x, calm ? 14 : 19, dt);
    motion.heroSignalY = approach(signal.current[1], point.y, calm ? 14 : 19, dt);
    motion.heroSignalZ = approach(signal.current[2], point.z, calm ? 14 : 19, dt);
    motion.heroSignalVelocity = decay(motion.heroSignalVelocity,
      previous.distanceTo(new THREE.Vector3(motion.heroSignalX, motion.heroSignalY, motion.heroSignalZ)) / Math.max(dt, .001), 8, frameDelta);
    motion.heroConnection = range(p, .655, .705);
    motion.heroCompression = range(p, .713, .765);
    const buildup = range(p, .666, .75);
    motion.heroField = buildup * (1 - range(p, .765, .81) * .8);
    motion.heroStill = range(p, .738, .748) * (1 - range(p, .762, .772)) * (motion.stillAge < .45 ? 1 : .36);
    const age = motion.impactAge;
    motion.heroDarkness = age < .13 ? 0 : age < .3 ? range(age, .13, .3) * .96 : age < .69 ? .96 : age < 1.15 ? (1 - range(age, .69, 1.15)) * .96 : 0;
    const birth = age < .6 ? 0 : range(age, .6, 1.75);
    motion.heroFormation = p > .77 ? birth * range(p, .77, .86) : 0;
    const ready = p > .81 && motion.heroFormation > .46;
    if (ready !== revealed.current) {
      revealed.current = ready;
      onProductReady(ready);
    }
  }, -5);
  return null;
}

const matterVertex = `
attribute float aSeed;
attribute float aEnergy;
uniform float uField, uCompression, uStill, uFormation, uStreak;
varying float vHeat, vEnergy, vDepth;
void main() {
  vec3 p = position;
  vec4 view = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * view;
  float perspective = 10. / max(2., -view.z);
  gl_PointSize = clamp((3.2 + fract(aSeed * 37.) * 3.7) * perspective * (1. + uStreak * .35), 1.3, 10.);
  vHeat = fract(aSeed * 83.);
  vEnergy = aEnergy;
  vDepth = perspective;
}`;
const matterFragment = `
uniform float uOpacity, uStreak, uField, uFormation;
varying float vHeat, vEnergy, vDepth;
void main() {
  vec2 q = gl_PointCoord - .5;
  q.x /= 1. + uStreak * .65;
  float r = length(q);
  float edge = 1. - smoothstep(.08, .48, r);
  vec3 warm = mix(vec3(.94,.39,.13), vec3(1.,.84,.57), vHeat);
  vec3 mixed = mix(warm, vec3(.78,.77,1.), uField * .6);
  mixed = mix(mixed, vec3(.89,.96,1.), uFormation * .65);
  float alpha = edge * (.34 + vEnergy * .56) * uOpacity;
  gl_FragColor = vec4(mixed, alpha);
}`;

function HeroMatter({ motion, progress, quality, paused, calm }: Props) {
  const count = quality === "low" ? 1400 : quality === "medium" ? 3200 : 5200;
  const material = useRef<THREE.ShaderMaterial>(null);
  const field = useMemo(() => {
    const positions = new Float32Array(count * 3), origins = new Float32Array(count * 3);
    const velocity = new Float32Array(count * 3), seeds = new Float32Array(count), energy = new Float32Array(count);
    const hash = (i: number, k: number) => { const n = Math.sin(i * k + k * 11.71) * 43758.5453; return n - Math.floor(n); };
    for (let i = 0; i < count; i++) {
      const a = hash(i, 19.13) * Math.PI * 2, r = Math.sqrt(hash(i, 43.31)) * 4.7;
      const x = -5.4 + Math.cos(a) * r * 1.1;
      const y = Math.sin(a) * r * .83;
      const z = -7.5 + (hash(i, 31.71) - .5) * 10;
      origins.set([x, y, z], i * 3); positions.set([x, y, z], i * 3);
      velocity.set([-.1 * Math.sin(a), .1 * Math.cos(a), .05], i * 3);
      seeds[i] = hash(i, 7.89); energy[i] = .25 + hash(i, 4.91) * .75;
    }
    const geometry = new THREE.BufferGeometry();
    const position = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", position);
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute("aEnergy", new THREE.BufferAttribute(energy, 1));
    return { geometry, position, positions, origins, velocity, seeds, energy };
  }, [count]);
  useEffect(() => () => field.geometry.dispose(), [field]);
  const uniforms = useMemo(() => ({
    uField: { value: 0 }, uCompression: { value: 0 }, uStill: { value: 0 },
    uFormation: { value: 0 }, uStreak: { value: 0 }, uOpacity: { value: 0 },
  }), []);
  useFrame((_, frameDelta) => {
    const p = motion.playhead.value;
    const elapsed = paused ? 0 : Math.min(frameDelta, .32);
    const steps = Math.max(1, Math.ceil(elapsed / .025));
    const dt = elapsed / steps;
    const { positions, origins, velocity, seeds, position } = field;
    const strength = motion.heroField * (calm ? .62 : 1);
    const compression = motion.heroCompression;
    const still = motion.heroStill;
    const formation = motion.heroFormation;
    const implosion = motion.impactAge < .12 ? Math.sin(motion.impactAge / .12 * Math.PI) : 0;
    let averageSpeed = 0;
    for (let substep = 0; substep < steps; substep++) for (let i = 0; i < count; i++) {
      const j = i * 3;
      let x = positions[j], y = positions[j + 1], z = positions[j + 2];
      let vx = velocity[j], vy = velocity[j + 1], vz = velocity[j + 2];
      const [fx, fy, fz] = convergenceForce(x, y, z, strength + implosion * 5, compression + implosion);
      const s = seeds[i];
      const curve = Math.sin(y * .72 + motion.time * .48 + s * 6) - Math.cos(z * .38 - motion.time * .23);
      const capture = motion.heroConnection * (i % 5 === 0 ? .7 : .25);
      const tx = -.8 + (s - .5) * 7, ty = Math.sin(s * 8) * 2.1, tz = -6 + Math.cos(s * 11) * 1.4;
      const restore = 1 - range(p, .61, .67);
      const rewind = motion.direction < 0 ? (1 - range(p, .69, .82)) * 7 : 0;
      const shellAngle = s * Math.PI * 20;
      const shellRadius = .55 + (i % 17) / 17 * 2.4;
      const sx = 2.35 + Math.cos(shellAngle) * shellRadius, sy = Math.sin(shellAngle) * shellRadius * .8;
      const sz = -2.2 + Math.sin(shellAngle * .4) * .7;
      const drag = 1.6 + still * 24 + compression * 2;
      vx += (fx + curve * (1 - compression) * .42 + (tx - x) * capture * 1.2 + (origins[j] - x) * (restore * 1.8 + rewind) + (sx - x) * formation * 11 - vx * drag) * dt;
      vy += (fy + Math.cos(x * .55 + s * 3) * .3 + (ty - y) * capture * 1.2 + (origins[j + 1] - y) * (restore * 1.8 + rewind) + (sy - y) * formation * 11 - vy * drag) * dt;
      vz += (fz + Math.sin(x * .42) * .2 + (tz - z) * capture * 1.2 + (origins[j + 2] - z) * (restore * 1.8 + rewind) + (sz - z) * formation * 11 - vz * drag) * dt;
      x += vx * dt; y += vy * dt; z += vz * dt;
      positions[j] = x; positions[j + 1] = y; positions[j + 2] = z;
      velocity[j] = vx; velocity[j + 1] = vy; velocity[j + 2] = vz;
      averageSpeed += Math.abs(vx) + Math.abs(vy) + Math.abs(vz);
    }
    if (dt > 0) position.needsUpdate = true;
    if (material.current) {
      const u = material.current.uniforms;
      u.uField.value = strength; u.uCompression.value = compression;
      u.uStill.value = still; u.uFormation.value = formation;
      u.uStreak.value = calm ? 0 : Math.min(1.2, averageSpeed / (count * steps) * .08 + motion.scrollEnergy * .4);
      u.uOpacity.value = range(p, .615, .67) * (1 - motion.heroDarkness) * (1 - range(p, .86, 1) * .38);
    }
  });
  return <points geometry={field.geometry} frustumCulled={false} visible={progress > .59}>
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={matterVertex} fragmentShader={matterFragment}
      transparent depthWrite={false} blending={THREE.AdditiveBlending} />
  </points>;
}

const worldLineVertex = `
attribute float aOrder;
uniform float uField, uCompression, uConnection;
uniform vec3 uSignal;
varying float vPulse, vOrder;
${fieldWarp}
void main() {
  vec3 p = bend(position, uField, uCompression);
  float nearSignal = exp(-length(p - uSignal) * .47);
  vPulse = nearSignal * uConnection + uField * .24;
  vOrder = aOrder;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`;
const latticeFragment = `
uniform float uOpacity, uConnection;
varying float vPulse, vOrder;
void main() {
  vec3 neutral = vec3(.55,.51,.69);
  vec3 energized = vec3(.85,.78,1.);
  float arrival = smoothstep(vOrder * .24, vOrder * .24 + .36, uConnection + .21);
  float alpha = uOpacity * arrival * (.23 + vPulse * .68);
  gl_FragColor = vec4(mix(neutral, energized, min(1.,vPulse)), alpha);
}`;
const conduitFragment = `
uniform float uOpacity;
varying float vPulse, vOrder;
void main() {
  vec3 color = mix(vec3(.3,.61,.7), vec3(.83,.96,1.), min(1.,vPulse * 1.4));
  gl_FragColor = vec4(color, uOpacity * (.12 + vPulse * .7));
}`;

function makeLineGeometry(segments: Array<{ a: THREE.Vector3; b: THREE.Vector3; order: number }>) {
  const positions = new Float32Array(segments.length * 6);
  const orders = new Float32Array(segments.length * 2);
  segments.forEach(({ a, b, order }, i) => {
    positions.set(a.toArray(), i * 6); positions.set(b.toArray(), i * 6 + 3);
    orders[i * 2] = order; orders[i * 2 + 1] = order;
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aOrder", new THREE.BufferAttribute(orders, 1));
  return geometry;
}

function HeroLattice({ motion, progress }: Props) {
  const { size } = useThree();
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const segments: Array<{ a: THREE.Vector3; b: THREE.Vector3; order: number }> = [];
    const ringCount = 11, steps = 48;
    for (let ring = 0; ring < ringCount; ring++) {
      const depth = -3.1 - ring * .68;
      const radius = 3.25 + Math.sin(ring * .58) * .73 + ring * .09;
      for (let k = 0; k < steps; k++) {
        if ((k + ring * 11) % 29 < 3) continue;
        const a = k / steps * Math.PI * 2, b = (k + 1) / steps * Math.PI * 2;
        const make = (angle: number) => new THREE.Vector3(
          -.35 + Math.cos(angle) * radius * 1.38,
          Math.sin(angle) * radius * .95 + Math.sin(angle * 3 + ring * .3) * .11,
          depth + Math.sin(angle * 2.2 + ring * .26) * .26,
        );
        segments.push({ a: make(a), b: make(b), order: (ring + k / steps) / ringCount });
        if (ring < ringCount - 1 && k % 3 === 0) {
          const next = new THREE.Vector3(
            -.35 + Math.cos(a + .045) * (radius + .17) * 1.38,
            Math.sin(a + .045) * (radius + .17) * .95,
            depth - .68,
          );
          segments.push({ a: make(a), b: next, order: (ring + .5) / ringCount });
        }
      }
    }
    // Long discontinuous relationships break the purely concentric silhouette.
    for (let i = 0; i < 34; i++) {
      const angle = i * 2.399;
      const a = new THREE.Vector3(-.35 + Math.cos(angle) * 3.7, Math.sin(angle) * 2.6, -3.2);
      const b = new THREE.Vector3(-.35 + Math.cos(angle + .28) * 2.8, Math.sin(angle + .28) * 2.2, -10.5);
      segments.push({ a, b, order: i / 34 });
    }
    return makeLineGeometry(segments);
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const uniforms = useMemo(() => ({
    uField: { value: 0 }, uCompression: { value: 0 }, uConnection: { value: 0 },
    uSignal: { value: new THREE.Vector3() }, uOpacity: { value: 0 },
  }), []);
  useFrame(() => {
    if (!material.current) return;
    const u = material.current.uniforms;
    u.uField.value = motion.heroField;
    u.uCompression.value = motion.heroCompression;
    u.uConnection.value = motion.heroConnection;
    u.uSignal.value.set(motion.heroSignalX, motion.heroSignalY, motion.heroSignalZ);
    u.uOpacity.value = range(motion.playhead.value, .62, .675) * (1 - motion.heroDarkness) * (1 - range(motion.playhead.value, .785, .875));
  });
  return <lineSegments geometry={geometry} scale={size.width < 820 ? .8 : 1} frustumCulled={false} visible={progress > .6 && progress < .97}>
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={worldLineVertex} fragmentShader={latticeFragment}
      transparent depthWrite={false} blending={THREE.AdditiveBlending} />
  </lineSegments>;
}

const panelFragment = `
uniform float uOpacity;
varying float vPulse, vOrder;
void main() {
  vec3 color = mix(vec3(.32,.31,.44), vec3(.72,.72,.92), min(1.,vPulse * 1.4));
  float edge = .75 + .25 * sin(vOrder * 24.);
  gl_FragColor = vec4(color, uOpacity * edge * (.05 + vPulse * .14));
}`;

function HeroPanels({ motion, progress }: Props) {
  const { size } = useThree();
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const vertices: number[] = [], orders: number[] = [], indices: number[] = [];
    for (let i = 0; i < 6; i++) {
      const depth = -3.4 - i * 1.25;
      const left = -3.6 + Math.sin(i * 1.8) * 1.1;
      const right = 3.8 + Math.cos(i * 1.3) * .9;
      const y = (i % 2 ? -1 : 1) * (1.1 + (i % 3) * .51);
      const start = vertices.length / 3;
      vertices.push(left, y, depth, right, y * .59, depth - .25,
        left + .65, y + (i % 2 ? -.4 : .4), depth -.8,
        right -.4, y * .59 + (i % 2 ? -.5 : .5), depth -1.05);
      orders.push(i / 6, i / 6, i / 6, i / 6);
      indices.push(start, start + 1, start + 2, start + 1, start + 3, start + 2);
    }
    const mesh = new THREE.BufferGeometry();
    mesh.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    mesh.setAttribute('aOrder', new THREE.Float32BufferAttribute(orders, 1));
    mesh.setIndex(indices);
    return mesh;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const uniforms = useMemo(() => ({
    uField: { value: 0 }, uCompression: { value: 0 }, uConnection: { value: 0 },
    uSignal: { value: new THREE.Vector3() }, uOpacity: { value: 0 },
  }), []);
  useFrame(() => {
    if (!material.current) return;
    const u = material.current.uniforms;
    u.uField.value = motion.heroField;
    u.uCompression.value = motion.heroCompression;
    u.uConnection.value = motion.heroConnection;
    u.uSignal.value.set(motion.heroSignalX, motion.heroSignalY, motion.heroSignalZ);
    u.uOpacity.value = range(motion.playhead.value, .62, .68) * (1 - motion.heroDarkness)
      * (1 - range(motion.playhead.value, .785, .875));
  });
  return <mesh geometry={geometry} scale={size.width < 820 ? .8 : 1} frustumCulled={false} visible={progress > .6 && progress < .9}>
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={worldLineVertex} fragmentShader={panelFragment}
      transparent side={THREE.DoubleSide} depthWrite={false} />
  </mesh>;
}

function HeroConduits({ motion, progress }: Props) {
  const { size } = useThree();
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const segments: Array<{ a: THREE.Vector3; b: THREE.Vector3; order: number }> = [];
    for (let lane = 0; lane < 12; lane++) {
      const offset = (lane - 5.5) * .42;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(7.6, offset * .62, -1.8),
        new THREE.Vector3(5.1, offset, -3.6),
        new THREE.Vector3(1.8, offset * .76, -5.8),
        new THREE.Vector3(-.8, offset * .57, -6.2),
        new THREE.Vector3(-5.2, offset * .78, -8.1),
      ], false, "centripetal");
      for (let step = 0; step < 44; step++) {
        const a = curve.getPoint(step / 44), b = curve.getPoint((step + 1) / 44);
        segments.push({ a, b, order: step / 44 });
      }
    }
    return makeLineGeometry(segments);
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const uniforms = useMemo(() => ({
    uField: { value: 0 }, uCompression: { value: 0 }, uConnection: { value: 0 },
    uSignal: { value: new THREE.Vector3() }, uOpacity: { value: 0 },
  }), []);
  useFrame(() => {
    if (!material.current) return;
    const u = material.current.uniforms;
    u.uField.value = motion.heroField;
    u.uCompression.value = motion.heroCompression;
    u.uConnection.value = motion.heroConnection;
    u.uSignal.value.set(motion.heroSignalX, motion.heroSignalY, motion.heroSignalZ);
    u.uOpacity.value = range(motion.playhead.value, .595, .65) * (1 - motion.heroDarkness) * (1 - range(motion.playhead.value, .77, .865));
  });
  return <lineSegments geometry={geometry} scale={size.width < 820 ? .85 : 1} frustumCulled={false} visible={progress > .58 && progress < .92}>
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={worldLineVertex} fragmentShader={conduitFragment}
      transparent depthWrite={false} blending={THREE.AdditiveBlending} />
  </lineSegments>;
}

const trailVertex = `
attribute float aAge;
varying float vAge;
void main() { vAge = aAge; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`;
const trailFragment = `
uniform float uOpacity, uEnergy;
varying float vAge;
void main() {
  vec3 color = mix(vec3(.26,.69,.81), vec3(.9,.97,1.), vAge);
  gl_FragColor = vec4(color, uOpacity * pow(vAge, 1.55) * (.45 + uEnergy * .35));
}`;

function HeroSignal({ motion, progress, paused, calm }: Props) {
  const head = useRef<THREE.Mesh>(null), trailMaterial = useRef<THREE.ShaderMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const samples = 30;
  const history = useRef(Array.from({ length: samples }, () => new THREE.Vector3(3.7, -.05, .45)));
  const geometry = useMemo(() => {
    const vertices = new Float32Array(samples * 2 * 3);
    const ages = new Float32Array(samples * 2);
    const indices: number[] = [];
    for (let i = 0; i < samples; i++) {
      ages[i * 2] = ages[i * 2 + 1] = 1 - i / (samples - 1);
      if (i < samples - 1) indices.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(vertices, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute("aAge", new THREE.BufferAttribute(ages, 1));
    g.setIndex(indices);
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const uniforms = useMemo(() => ({ uOpacity: { value: 0 }, uEnergy: { value: 0 } }), []);
  useFrame(() => {
    if (!head.current || !light.current || !trailMaterial.current) return;
    const p = motion.playhead.value;
    const position = new THREE.Vector3(motion.heroSignalX, motion.heroSignalY, motion.heroSignalZ);
    if (!paused && position.distanceTo(history.current[0]) > .025) {
      history.current.pop(); history.current.unshift(position.clone());
    }
    const buffer = geometry.getAttribute("position") as THREE.BufferAttribute;
    const width = calm ? .065 : .11 + Math.min(.09, motion.heroSignalVelocity * .004);
    history.current.forEach((point, i) => {
      const neighbor = history.current[Math.min(samples - 1, i + 1)];
      const dx = point.x - neighbor.x, dy = point.y - neighbor.y;
      const length = Math.hypot(dx, dy) + .0001;
      const spread = width * (1 - i / samples) * .5;
      buffer.setXYZ(i * 2, point.x - dy / length * spread, point.y + dx / length * spread, point.z);
      buffer.setXYZ(i * 2 + 1, point.x + dy / length * spread, point.y - dx / length * spread, point.z);
    });
    buffer.needsUpdate = true;
    const fade = range(p, .545, .59) * (1 - range(p, .714, .742)) * (1 - motion.heroDarkness);
    trailMaterial.current.uniforms.uOpacity.value = fade;
    trailMaterial.current.uniforms.uEnergy.value = Math.min(2, motion.heroSignalVelocity * .04 + motion.heroConnection);
    head.current.position.copy(position);
    head.current.scale.setScalar(.55 + Math.min(1.2, motion.heroSignalVelocity * .02));
    (head.current.material as THREE.MeshBasicMaterial).opacity = fade;
    light.current.position.copy(position);
    light.current.intensity = fade * (calm ? 1.5 : 4.5);
  });
  return <group visible={progress > .53 && progress < .76}>
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial ref={trailMaterial} uniforms={uniforms} vertexShader={trailVertex} fragmentShader={trailFragment}
        side={THREE.DoubleSide} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
    <mesh ref={head}><icosahedronGeometry args={[.12, 1]} /><meshBasicMaterial color="#d5f8ff" transparent opacity={0} /></mesh>
    <pointLight ref={light} color="#a5eaff" intensity={0} distance={6} decay={2} />
  </group>;
}

const synthesisVertex = `
attribute float aBirth;
attribute float aPetal;
attribute float aLength;
uniform float uFormation, uField, uPulseAge, uSelected;
varying float vPetal, vLength, vPresence, vResponse;
void main() {
  float arrival = smoothstep(aBirth, aBirth + .24, uFormation);
  vec3 p = position;
  vec3 center = vec3(2.35, 0., -2.2);
  p = center + (p - center) * (.025 + arrival * .975);
  p.z += (1. - arrival) * sin(aPetal * 2.3 + aLength * 9.) * .36;
  p.xy += vec2(-p.y + center.y, p.x - center.x) * uField * .025;
  vPetal = aPetal; vLength = aLength; vPresence = arrival;
  float traveling = exp(-pow((uPulseAge - .24) * 1.15 - aLength, 2.) * 35.);
  vResponse = (1. - step(.4, abs(aPetal - uSelected))) * traveling;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.);
}`;
const synthesisFragment = `
uniform float uOpacity;
varying float vPetal, vLength, vPresence, vResponse;
void main() {
  vec3 graphite = vec3(.23,.3,.36);
  vec3 optical = vec3(.61,.62,.75);
  vec3 warm = vec3(.95,.64,.36);
  vec3 color = mix(graphite, optical, .34 + .45 * sin(vPetal * 1.2 + vLength * 3.));
  color = mix(color, warm, .18 + .12 * sin(vPetal * 1.7));
  color = mix(color, vec3(.84,.96,1.), vResponse * .78);
  float edge = .35 + .65 * sin(vLength * 3.14159);
  gl_FragColor = vec4(color, uOpacity * vPresence * (.42 + edge * .27 + vResponse * .28));
}`;
const synthesisLineFragment = `
uniform float uOpacity;
varying float vPetal, vLength, vPresence, vResponse;
void main() {
  vec3 color = mix(vec3(.49,.58,.65), vec3(.88,.93,1.), vResponse);
  gl_FragColor = vec4(color, uOpacity * vPresence * (.32 + vResponse * .55));
}`;

function makeSynthesisGeometry() {
  const positions: number[] = [], births: number[] = [], petals: number[] = [], lengths: number[] = [], indices: number[] = [];
  const contours: Array<{ a: THREE.Vector3; b: THREE.Vector3; order: number }> = [];
  const count = 9, steps = 56;
  const point = (petal: number, t: number, side: number) => {
    const base = petal / count * Math.PI * 2 - .18 + Math.sin(petal * 2.4) * .21;
    const angle = base + t * (.72 + (petal % 3) * .26);
    const r = .29 + (2.17 + (petal % 4) * .21) * t;
    const width = Math.sin(t * Math.PI) * (.16 + (petal % 3) * .075);
    return new THREE.Vector3(
      2.35 + Math.cos(angle) * r + Math.cos(angle + Math.PI / 2) * side * width,
      Math.sin(angle) * r * .77 + Math.sin(angle + Math.PI / 2) * side * width,
      -2.2 + Math.sin(t * Math.PI) * (petal % 2 ? .92 : -.62) + Math.sin(petal * 1.8) * .43,
    );
  };
  for (let petal = 0; petal < count; petal++) {
    const start = positions.length / 3;
    for (let step = 0; step <= steps; step++) {
      const t = step / steps;
      for (const side of [-1, 1]) {
        const p = point(petal, t, side);
        positions.push(p.x, p.y, p.z);
        births.push(.08 + t * .53 + petal * .018);
        petals.push(petal); lengths.push(t);
      }
      if (step < steps) {
        const a = start + step * 2, b = a + 2;
        indices.push(a, a + 1, b, a + 1, b + 1, b);
        for (const side of [-1, 1]) contours.push({ a: point(petal, t, side), b: point(petal, (step + 1) / steps, side), order: petal / count });
      }
    }
  }
  const surface = new THREE.BufferGeometry();
  surface.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  surface.setAttribute("aBirth", new THREE.Float32BufferAttribute(births, 1));
  surface.setAttribute("aPetal", new THREE.Float32BufferAttribute(petals, 1));
  surface.setAttribute("aLength", new THREE.Float32BufferAttribute(lengths, 1));
  surface.setIndex(indices);
  surface.computeVertexNormals();
  // Contours use the same reveal law, with their own per-vertex birth timing.
  const linePositions: number[] = [], lineBirths: number[] = [], linePetals: number[] = [], lineLengths: number[] = [];
  contours.forEach(({ a, b }, i) => {
    const petal = Math.floor(i / (steps * 2));
    const t = (i % (steps * 2) >> 1) / steps;
    linePositions.push(...a.toArray(), ...b.toArray());
    lineBirths.push(.08 + t * .53 + petal * .018, .08 + t * .53 + petal * .018);
    linePetals.push(petal, petal); lineLengths.push(t, t + 1 / steps);
  });
  const lines = new THREE.BufferGeometry();
  lines.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  lines.setAttribute("aBirth", new THREE.Float32BufferAttribute(lineBirths, 1));
  lines.setAttribute("aPetal", new THREE.Float32BufferAttribute(linePetals, 1));
  lines.setAttribute("aLength", new THREE.Float32BufferAttribute(lineLengths, 1));
  return { surface, lines };
}

function productPath(t: number, selected: number) {
  const base = (selected - 1) / 9 * Math.PI * 2 - .18;
  if (t < .36) {
    const f = range(t, 0, .36);
    return new THREE.Vector3(-.2 + f * 2.55, Math.sin(f * Math.PI) * .18, -1.8 - f * .4);
  }
  const f = range(t, .36, 1.);
  const angle = base + f * 1.14;
  const r = .3 + f * 2.55;
  return new THREE.Vector3(2.35 + Math.cos(angle) * r, Math.sin(angle) * r * .77,
    -2.2 + Math.sin(f * Math.PI) * (selected % 2 ? .67 : -.35) + (selected - 1) * .055);
}

function Synthesis({ motion, progress, selected, routed, calm }: Props) {
  const surfaceMat = useRef<THREE.ShaderMaterial>(null), lineMat = useRef<THREE.ShaderMaterial>(null);
  const routeHead = useRef<THREE.Mesh>(null), echo = useRef<(THREE.Mesh | null)[]>([]);
  const { surface, lines } = useMemo(() => makeSynthesisGeometry(), []);
  useEffect(() => () => { surface.dispose(); lines.dispose(); }, [surface, lines]);
  const uniforms = useMemo(() => ({
    uFormation: { value: 0 }, uField: { value: 0 }, uPulseAge: { value: 20 },
    uSelected: { value: -10 }, uOpacity: { value: 0 },
  }), []);
  const lineUniforms = useMemo(() => ({
    uFormation: { value: 0 }, uField: { value: 0 }, uPulseAge: { value: 20 },
    uSelected: { value: -10 }, uOpacity: { value: 0 },
  }), []);
  useFrame(() => {
    if (!surfaceMat.current || !lineMat.current || !routeHead.current) return;
    const formed = motion.heroFormation;
    const selectedPetal = Math.max(0, (motion.selectedSignal ?? selected ?? 1) - 1);
    for (const mat of [surfaceMat.current, lineMat.current]) {
      const u = mat.uniforms;
      u.uFormation.value = formed;
      u.uField.value = motion.heroField * (1 - formed);
      u.uPulseAge.value = motion.pulseAge;
      u.uSelected.value = selectedPetal;
      u.uOpacity.value = (1 - motion.heroDarkness) * range(motion.playhead.value, .79, .87);
    }
    const age = motion.pulseAge;
    const active = formed > .7 && age < 1.25;
    routeHead.current.visible = active;
    const routeT = clamp(age / 1.18, 0, 1);
    if (active) routeHead.current.position.copy(productPath(routeT, selectedPetal + 1));
    echo.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.visible = active && age > (i + 1) * .055;
      if (mesh.visible) mesh.position.copy(productPath(Math.max(0, routeT - (i + 1) * .055), selectedPetal + 1));
    });
  });
  return <group visible={progress > .75}>
    <mesh geometry={surface} frustumCulled={false}>
      <shaderMaterial ref={surfaceMat} uniforms={uniforms} vertexShader={synthesisVertex} fragmentShader={synthesisFragment}
        transparent side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
    <lineSegments geometry={lines} frustumCulled={false}>
      <shaderMaterial ref={lineMat} uniforms={lineUniforms} vertexShader={synthesisVertex} fragmentShader={synthesisLineFragment}
        transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </lineSegments>
    <mesh ref={routeHead} visible={false}><icosahedronGeometry args={[calm ? .075 : .1, 1]} />
      <meshBasicMaterial color="#d8f7ff" /></mesh>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} visible={false} ref={element => { echo.current[i] = element; }} scale={1 - i * .13}>
      <sphereGeometry args={[.065, 8, 6]} /><meshBasicMaterial color={routed.includes(i + 1) ? "#eecb9d" : "#b8e8f1"} transparent opacity={.25 - i * .035} />
    </mesh>)}
  </group>;
}

function VoidCurtain({ motion }: { motion: MotionState }) {
  const { camera } = useThree();
  const mesh = useRef<THREE.Mesh>(null);
  const direction = useRef(new THREE.Vector3());
  useFrame(() => {
    if (!mesh.current) return;
    camera.getWorldDirection(direction.current);
    mesh.current.position.copy(camera.position).addScaledVector(direction.current, 2);
    mesh.current.quaternion.copy(camera.quaternion);
    (mesh.current.material as THREE.MeshBasicMaterial).opacity = motion.heroDarkness;
    mesh.current.visible = motion.heroDarkness > .002;
  });
  return <mesh ref={mesh} renderOrder={1000} visible={false}>
    <planeGeometry args={[200, 200]} />
    <meshBasicMaterial color="#020409" transparent opacity={0} depthTest={false} depthWrite={false} />
  </mesh>;
}
