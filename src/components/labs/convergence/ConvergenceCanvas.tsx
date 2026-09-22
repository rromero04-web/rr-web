"use client";
/* eslint-disable react-hooks/immutability -- R3F animates scene graph objects in the render loop. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { range, type Quality } from "./model";

type SceneProps = {
  progress: number; paused: boolean; quality: Quality; selected: number | null;
  routed: number[]; pulse: number; onSlow: () => void;
};

const WARM = new THREE.Color("#f4ad58");
const VIOLET = new THREE.Color("#b9a9e4");
const COLD = new THREE.Color("#a9dded");
const clamp = THREE.MathUtils.clamp;
const ease = (t: number) => t * t * (3 - 2 * t);

export function ConvergenceCanvas(props: SceneProps) {
  return <Canvas aria-hidden="true" dpr={props.quality === "high" ? [1, 1.5] : props.quality === "medium" ? [1, 1.25] : 1}
    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    camera={{ position: [0, 0, 12], fov: 42, near: .05, far: 130 }}
    onCreated={({ gl }) => { gl.setClearColor("#080a10", 0); gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.35; }}
    fallback={<div>Realtime graphics unavailable. Use Reading mode.</div>}>
    <ambientLight intensity={.28} />
    <directionalLight position={[2, 7, 5]} intensity={2.2} color="#f5f1ed" />
    <directionalLight position={[-5, -2, 2]} intensity={1.2} color="#9ba9d8" />
    <Director progress={props.progress} />
    <PerformanceGovernor quality={props.quality} onSlow={props.onSlow} />
    <AttentionField {...props} />
    <FormArchitecture {...props} />
    <BehaviorNetwork {...props} />
    <Collision {...props} />
    <SpatialProduct {...props} />
  </Canvas>;
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
function Director({ progress }: { progress: number }) {
  const { camera, size, gl } = useThree();
  const aim = useRef(new THREE.Vector3());
  useFrame((_, delta) => {
    let i = shots.findIndex((s) => s.at > progress) - 1;
    i = clamp(i, 0, shots.length - 2);
    const a = shots[i], b = shots[i + 1];
    const t = ease(clamp((progress - a.at) / (b.at - a.at), 0, 1));
    const mobile = size.width < 820;
    const desired = new THREE.Vector3().fromArray(a.pos).lerp(new THREE.Vector3().fromArray(b.pos), t);
    const look = new THREE.Vector3().fromArray(a.aim).lerp(new THREE.Vector3().fromArray(b.aim), t);
    if (mobile) {
      desired.z *= progress >= .81 ? 1.85 : progress >= .64 ? 1.55 : 1.38;
      look.x += progress >= .64 && progress < .81 ? 2 : 0;
      look.y += .45;
    }
    const impact = Math.exp(-Math.pow((progress - .764) / .007, 2));
    desired.z -= impact * .9;
    camera.position.lerp(desired, 1 - Math.exp(-delta * 6));
    aim.current.lerp(look, 1 - Math.exp(-delta * 6));
    camera.lookAt(aim.current);
    const perspective = camera as THREE.PerspectiveCamera;
    perspective.fov = THREE.MathUtils.damp(perspective.fov, THREE.MathUtils.lerp(a.fov, b.fov, t) * (mobile ? 1.1 : 1), 6, delta);
    perspective.updateProjectionMatrix();
    gl.toneMappingExposure = 1.25 + impact * 1.2;
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
attribute float aSeed; attribute vec3 aForm;
uniform float uTime, uProgress, uScale, uConvergence; uniform vec2 uPointer;
varying float vAlpha; varying float vHeat;
void main(){
  float s=aSeed;
  float flow=uTime*(.09+.05*fract(s*17.));
  float turn=position.x+flow;
  float lane=floor(s*3.);
  float angle=turn+lane*2.094;
  float radius=1.65+position.y*.28;
  vec3 p=vec3(cos(angle)*radius, sin(angle)*radius*.76, (turn/12.566-.5)*11.+position.z*.22);
  p.x += sin(turn*.46+s*20.)*.36;
  float attract=smoothstep(.12,.26,uProgress);
  p.xy=mix(p.xy, p.xy*.72+vec2(1.5,0.),attract*.55);
  vec2 d=p.xy-uPointer*vec2(4.,2.8);
  p.xy+=normalize(d+vec2(.001))*exp(-dot(d,d)*.22)*.38;
  float snap=smoothstep(.265,.38,uProgress)*(1.-smoothstep(.61,.66,uProgress));
  p=mix(p,aForm,snap);
  if(uConvergence>.5){
    float orbit=smoothstep(.66,.72,uProgress)*(1.-smoothstep(.743,.767,uProgress));
    p=vec3(-5.3+p.x*.72,1.1+p.y*.7,p.z*.5);
    float a=orbit*1.8; p.xy=mat2(cos(a),-sin(a),sin(a),cos(a))*p.xy;
    p.xy=mix(p.xy,vec2(3.,0.),smoothstep(.741,.763,uProgress)*.9);
  }
  vec4 view=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*view;
  gl_PointSize=clamp((1.7+fract(s*91.)*2.4)*uScale*(7./-view.z),1.0,8.0);
  vHeat=fract(s*43.);
  vAlpha=(.22+.22*fract(s*23.))*(1.-snap*.77);
}`;
const fieldFragment = `
varying float vAlpha,vHeat; uniform float uOpacity;
void main(){vec2 p=gl_PointCoord-.5;float r=length(p);float core=1.-smoothstep(.04,.48,r);float halo=exp(-r*r*17.)*.35;
vec3 c=mix(vec3(.95,.46,.18),vec3(1.,.9,.65),vHeat);gl_FragColor=vec4(c,(core+halo)*vAlpha*uOpacity);}`;

function AttentionField({ progress, paused, quality }: SceneProps) {
  const count = quality === "low" ? 1900 : quality === "medium" ? 3300 : 5200;
  const material = useRef<THREE.ShaderMaterial>(null);
  const satellite = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3), form = new Float32Array(count * 3), seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const h = (k: number) => { const v = Math.sin(i * k + k * 17.23) * 43758.5453; return v - Math.floor(v); };
      positions.set([h(17.1) * Math.PI * 4, .3 + Math.pow(h(41.7), .55) * 4.3, (h(8.13) - .5) * 9], i * 3);
      const column = i % 68, row = Math.floor(i / 68) % 42, layer = Math.floor(i / (68 * 42));
      form.set([-3.9 + column * .115, -2.45 + row * .12, -layer * 1.4 + Math.sin(column * .18) * .12], i * 3);
      seeds[i] = h(23.7);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aForm", new THREE.BufferAttribute(form, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uProgress: { value: 0 }, uPointer: { value: new THREE.Vector2() }, uOpacity: { value: 1 }, uScale: { value: 1 }, uConvergence: { value: 0 } }), []);
  const satelliteUniforms = useMemo(() => ({ uTime: { value: 0 }, uProgress: { value: 0 }, uPointer: { value: new THREE.Vector2() }, uOpacity: { value: 0 }, uScale: { value: 3 }, uConvergence: { value: 1 } }), []);
  useFrame((state, delta) => {
    for (const mat of [material.current, satellite.current]) {
      if (!mat) continue;
      if (!paused) mat.uniforms.uTime.value += Math.min(delta, .05);
      mat.uniforms.uProgress.value = progress;
      mat.uniforms.uPointer.value.lerp(state.pointer, .08);
    }
    if (material.current) material.current.uniforms.uOpacity.value = 1 - range(progress, .385, .46);
    if (satellite.current) satellite.current.uniforms.uOpacity.value = 5.5 * range(progress, .635, .67) * (1 - range(progress, .775, .81));
  });
  return <>
    <CurrentStrands progress={progress} />
    <points geometry={geometry} frustumCulled={false} visible={progress < .47}>
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={fieldVertex} fragmentShader={fieldFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
    <points geometry={geometry} frustumCulled={false} visible={progress > .63 && progress < .82}>
      <shaderMaterial ref={satellite} uniforms={satelliteUniforms} vertexShader={fieldVertex} fragmentShader={fieldFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  </>;
}

function CurrentStrands({ progress }: { progress: number }) {
  const curves = useMemo(() => Array.from({ length: 5 }, (_, lane) => {
    const points = Array.from({ length: 24 }, (_, i) => {
      const t = i / 23, a = t * Math.PI * 4 + lane * 1.256;
      return new THREE.Vector3(Math.cos(a) * (2.1 + lane * .13) + 1.1, Math.sin(a) * (1.55 + lane * .12), (t - .5) * 11);
    });
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 160, .009 + lane * .001, 4, false);
  }), []);
  useEffect(() => () => curves.forEach((curve) => curve.dispose()), [curves]);
  return <group visible={progress < .38}>{curves.map((curve, i) => <mesh key={i} geometry={curve}><meshBasicMaterial color={i % 2 ? "#c88957" : "#f6d4a1"} transparent opacity={.13 + i * .025} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>)}</group>;
}

function Segment({ from, to, color, opacity = 1, radius = .01 }: { from: [number, number, number]; to: [number, number, number]; color: string; opacity?: number; radius?: number }) {
  const a = useMemo(() => new THREE.Vector3(...from), [from]);
  const b = useMemo(() => new THREE.Vector3(...to), [to]);
  const length = a.distanceTo(b);
  const middle = a.clone().add(b).multiplyScalar(.5);
  const quaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()), [a, b]);
  return <mesh position={middle} quaternion={quaternion}><cylinderGeometry args={[radius, radius, length, 6]} /><meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} /></mesh>;
}

const formLines: { a: [number, number, number]; b: [number, number, number]; opacity: number }[] = [];
for (let y = -18; y <= 18; y += 3) formLines.push({ a: [-4.3, y * .14, 0], b: [4.3, y * .14, 0], opacity: y % 6 === 0 ? .45 : .15 });
for (let x = -28; x <= 28; x += 4) formLines.push({ a: [x * .14, -2.8, 0], b: [x * .14, 2.8, 0], opacity: x % 8 === 0 ? .36 : .12 });

function FormArchitecture({ progress, paused }: SceneProps) {
  const root = useRef<THREE.Group>(null);
  const plane = useRef<THREE.Mesh>(null);
  const lines = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!root.current || !plane.current || !lines.current) return;
    const form = range(progress, .278, .36);
    const exit = 1 - range(progress, .455, .5);
    const reveal = form * exit;
    root.current.scale.setScalar(Math.max(.001, reveal));
    root.current.position.x = 1.5;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, -.55 + range(progress, .33, .42) * .52, 7, delta);
    root.current.position.z = -1.7 + (1 - form) * 4;
    if (!paused) plane.current.rotation.z += delta * .025 * (1 - form);
    lines.current.visible = form > .25;
  });
  return <group ref={root} visible={progress > .268 && progress < .51}>
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

function BehaviorNetwork({ progress, paused, pulse }: SceneProps) {
  const root = useRef<THREE.Group>(null);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const clock = useRef(0), firedAt = useRef(-10), previousPulse = useRef(pulse);
  useFrame((_, delta) => {
    if (!root.current) return;
    if (!paused) clock.current += Math.min(delta, .05);
    if (previousPulse.current !== pulse) { previousPulse.current = pulse; firedAt.current = clock.current; }
    const visible = range(progress, .445, .5) * (1 - range(progress, .63, .67));
    root.current.scale.setScalar(Math.max(.001, visible));
    root.current.position.x = 1.5;
    root.current.rotation.y = -.17 + Math.sin(clock.current * .25) * .025;
    const automatic = (clock.current * .35) % 1.8;
    packets.current.forEach((mesh, i) => {
      if (!mesh) return;
      const triggered = (clock.current - firedAt.current - i * .085) * .95;
      const t = triggered > 0 && triggered < 1 ? triggered : (automatic + i * .11) % 1;
      const path = routes[i];
      const segment = Math.min(5, Math.floor(t * 6)), fraction = t * 6 - segment;
      mesh.position.set(...path[segment]);
      mesh.position.lerp(new THREE.Vector3(...path[segment + 1]), fraction);
      mesh.scale.setScalar(triggered > 0 && triggered < 1 ? 1.5 : .7);
    });
  });
  return <group ref={root} visible={progress > .44 && progress < .68}>
    {routes.map((route, i) => <group key={i}>
      {route.slice(0, -1).map((point, j) => <Segment key={j} from={point as [number, number, number]} to={route[j + 1] as [number, number, number]} color={i % 2 ? "#7898a6" : "#a5d6e6"} opacity={j === 2 ? .7 : .42} radius={.012} />)}
      <mesh ref={(element) => { packets.current[i] = element; }}><sphereGeometry args={[.09, 12, 8]} /><meshBasicMaterial color="#dbf8ff" /></mesh>
      <mesh position={route[2]}><octahedronGeometry args={[.17]} /><meshStandardMaterial color="#b6dce7" emissive="#3b829b" emissiveIntensity={.5} metalness={.8} roughness={.22} /></mesh>
      <mesh position={route[4]}><octahedronGeometry args={[.12]} /><meshStandardMaterial color="#bfd9e1" emissive="#3b829b" emissiveIntensity={.45} metalness={.7} roughness={.25} /></mesh>
    </group>)}
    {[-4.7, 4.5].map(x => <group key={x} position={[x, 0, -.8]}>
      <mesh><boxGeometry args={[.06, 6.1, .06]} /><meshBasicMaterial color="#b5dbe8" transparent opacity={.65} /></mesh>
      <mesh position={[0, 3.05, 0]}><sphereGeometry args={[.09, 10, 10]} /><meshBasicMaterial color="#e4faff" /></mesh>
    </group>)}
    <TypePlane text="INPUT / STATE / RESPONSE" position={[0, -3.3, .5]} width={4.7} color="#bde1ec" />
  </group>;
}

function Collision({ progress, paused }: SceneProps) {
  const root = useRef<THREE.Group>(null);
  const form = useRef<THREE.Group>(null), behavior = useRef<THREE.Group>(null), ring = useRef<THREE.Mesh>(null);
  const shards = useRef<(THREE.Mesh | null)[]>([]);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (!root.current || !form.current || !behavior.current || !ring.current) return;
    if (!paused) time.current += Math.min(delta, .05);
    const entrance = range(progress, .635, .675);
    const orbit = range(progress, .67, .73);
    const strike = range(progress, .745, .766);
    const silence = 1 - range(progress, .78, .815);
    root.current.scale.setScalar(Math.max(.001, entrance * silence));
    root.current.position.x = 3;
    const hold = range(progress, .725, .739) * (1 - range(progress, .741, .748));
    const angle = orbit * (1 - hold) * 1.5;
    form.current.position.set(Math.cos(angle + 2.1) * (5.5 - strike * 5.5), Math.sin(angle + 2.1) * (2.6 - strike * 2.6), -.8);
    behavior.current.position.set(Math.cos(angle - 1.2) * (5.5 - strike * 5.5), Math.sin(angle - 1.2) * (2.6 - strike * 2.6), -.8);
    form.current.rotation.z = angle * .9 + strike * 1.2;
    behavior.current.rotation.z = -angle * .9 - strike * 1.1;
    const impact = Math.exp(-Math.pow((progress - .765) / .011, 2));
    ring.current.scale.setScalar(.4 + strike * 12);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = impact * .9;
    shards.current.forEach((mesh, i) => {
      if (!mesh) return;
      const a = i * 2.399;
      const r = .35 + strike * (2.5 + (i % 7) * .55);
      mesh.position.set(Math.cos(a) * r, Math.sin(a) * r, Math.sin(a * 2) * r * .32);
      mesh.rotation.set(a, a * .6 + time.current * .14, a * 1.4);
      mesh.scale.setScalar(range(progress, .745, .762) * (1 - range(progress, .776, .806)) * (.5 + impact * .7));
    });
  });
  return <group ref={root} visible={progress > .63 && progress < .82}>
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
    <mesh ref={ring} rotation={[0, 0, 0]}><ringGeometry args={[.97, 1, 96]} /><meshBasicMaterial color="#fffaf0" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    {Array.from({ length: 38 }, (_, i) => <mesh key={i} ref={(element) => { shards.current[i] = element; }}><tetrahedronGeometry args={[.07 + i % 4 * .025]} /><meshBasicMaterial color={i % 3 === 0 ? WARM : i % 3 === 1 ? VIOLET : COLD} transparent opacity={.9} /></mesh>)}
    <pointLight color="#ffffff" intensity={progress > .755 && progress < .785 ? 85 : 0} distance={18} decay={2} />
  </group>;
}

function SpatialProduct({ progress, paused, selected, routed, pulse }: SceneProps) {
  const { size } = useThree();
  const root = useRef<THREE.Group>(null), stream = useRef<THREE.Group>(null), marker = useRef<THREE.Mesh>(null);
  const clock = useRef(0), previousPulse = useRef(pulse), firedAt = useRef(-10);
  useFrame((_, delta) => {
    if (!root.current || !stream.current || !marker.current) return;
    if (!paused) clock.current += Math.min(delta, .05);
    if (pulse !== previousPulse.current) { previousPulse.current = pulse; firedAt.current = clock.current; }
    const reveal = range(progress, .81, .875);
    root.current.scale.setScalar(Math.max(.001, reveal * (size.width < 820 ? .55 : 1)));
    root.current.position.set(1.6, -.12, 0);
    root.current.rotation.y = -.27 + Math.sin(clock.current * .18) * .035;
    stream.current.rotation.z = clock.current * .09;
    const burst = clamp((clock.current - firedAt.current) * 1.6, 0, 1);
    marker.current.position.y = 2.15 - burst * 4.3;
    marker.current.visible = burst < 1;
  });
  return <group ref={root} visible={progress > .8}>
    <mesh rotation={[.16, .24, -.18]}><torusGeometry args={[2.45, .075, 12, 96, Math.PI * 1.83]} /><meshStandardMaterial color="#d2ccc2" metalness={.82} roughness={.23} /></mesh>
    <mesh position={[0, 0, -.2]} rotation={[.1, .26, -.18]}><torusGeometry args={[2.17, .014, 8, 96]} /><meshBasicMaterial color="#918fa4" transparent opacity={.75} /></mesh>
    <mesh position={[0, 0, -.7]} rotation={[.08, .3, -.18]}><torusGeometry args={[2.72, .012, 8, 96, Math.PI * 1.68]} /><meshBasicMaterial color="#718f9b" transparent opacity={.6} /></mesh>
    <group ref={stream} position={[-2.6, .15, .35]}>
      <mesh rotation={[0, .2, 0]}><torusGeometry args={[1.35, .018, 8, 96, Math.PI * 1.6]} /><meshBasicMaterial color="#f1b577" /></mesh>
      {Array.from({ length: 42 }, (_, i) => <mesh key={i} position={[Math.sin(i * 2.4) * 1.27, Math.cos(i * 2.4) * 1.27, Math.sin(i * 3.2) * .35]}><sphereGeometry args={[.022 + i % 4 * .01, 6, 6]} /><meshBasicMaterial color={i % 3 ? "#e6b483" : "#fff1d3"} /></mesh>)}
    </group>
    <mesh ref={marker} position={[-1.75, 2.15, .7]}><sphereGeometry args={[.12, 12, 12]} /><meshBasicMaterial color="#fff4de" /></mesh>
    <mesh position={[-.1, 0, -.17]} rotation={[.1, .25, -.18]}><cylinderGeometry args={[.36, .36, .14, 48]} /><meshStandardMaterial color="#efece3" metalness={.42} roughness={.34} /></mesh>
    <mesh position={[-.1, 0, -.03]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.25, .025, 8, 48]} /><meshBasicMaterial color="#d4c6e9" /></mesh>
    <TypePlane text="SIGNAL / COMPOSER" position={[1.5, 2.65, .28]} width={3.5} color="#ede8dd" />
    {Array.from({ length: 6 }, (_, i) => {
      const active = selected === i + 1, done = routed.includes(i + 1);
      const angle = -.75 + i * .31;
      const x = 1.05 + Math.cos(angle) * 1.15, y = Math.sin(angle) * 2.45;
      return <group key={i} position={[x, y, .28 + i * .08]} rotation={[.09, -.25 + i * .045, angle * .32]}>
        <mesh><boxGeometry args={[2.85, .31, .12]} /><meshStandardMaterial color={active ? "#c7b8d7" : done ? "#a3c1ca" : "#777f84"} metalness={.64} roughness={.3} /></mesh>
        <mesh position={[-1.18, 0, .08]}><boxGeometry args={[.22, .05, .025]} /><meshBasicMaterial color={done ? "#f1c98d" : active ? "#fff6ea" : "#202f37"} /></mesh>
        <mesh position={[1.3, 0, .09]}><sphereGeometry args={[.045, 10, 10]} /><meshBasicMaterial color={done ? "#e5faff" : active ? "#f5c289" : "#303f48"} /></mesh>
      </group>;
    })}
    <Segment from={[3.05, -2.1, .1]} to={[3.05, 2.2, .1]} color="#96dce7" opacity={.65} radius={.016} />
    <mesh position={[3.05, -2.1 + routed.length * .68, .15]}><sphereGeometry args={[.11, 12, 12]} /><meshBasicMaterial color="#bdeef3" /></mesh>
    <TypePlane text="IN / STRUCTURE / OUT" position={[1.5, -2.65, .15]} width={3.5} color="#a9bac2" />
  </group>;
}
