"use client";
/* eslint-disable react-hooks/immutability -- R3F mutates its scene graph in the render loop. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { range, type Quality } from "./model";

type SceneProps = {
  progress: number; paused: boolean; quality: Quality; selected: number | null;
  routed: number[]; pulse: number; onSlow: () => void;
};
const INK = "#101315";
const AMBER = "#df8c47";

export function ConvergenceCanvas(props: SceneProps) {
  return (
    <Canvas aria-hidden="true" dpr={props.quality === "high" ? [1, 1.5] : props.quality === "medium" ? [1, 1.25] : 1}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 12], fov: 32, near: .1, far: 50 }}
      onCreated={({ gl }) => { gl.setClearColor(INK, 0); gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.1; }}
      fallback={<div>Realtime graphics unavailable. Use Reading mode.</div>}>
      <Studio />
      <Director progress={props.progress} />
      <PerformanceGovernor quality={props.quality} onSlow={props.onSlow} />
      <Instrument {...props} />
    </Canvas>
  );
}

// A baked studio reflection field: no per-frame shadow maps or screen-space effects.
function Studio() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = generator.fromScene(room, .04);
    scene.environment = target.texture;
    scene.environmentIntensity = .65;
    room.dispose(); generator.dispose();
    return () => { scene.environment = null; target.dispose(); };
  }, [gl, scene]);
  return <><ambientLight intensity={.3} /><directionalLight position={[-3, 5, 5]} intensity={1.8} color="#fff5e5" /><directionalLight position={[4, -1, 2]} intensity={.65} color="#dce0e1" /></>;
}

function Director({ progress }: { progress: number }) {
  const { camera, size } = useThree();
  useFrame((_, delta) => {
    // The lens holds each shot. Only the handover between chapters changes the angle.
    const form = range(progress, .25, .3);
    const convergence = range(progress, .6, .65);
    const resolution = range(progress, .77, .83);
    const angle = -.38 + form * .12 - convergence * .1 + resolution * .06;
    const breath = range(progress, .61, .67) * (1 - range(progress, .78, .83));
    const distance = Math.max(8.9 + breath * .4, (8 + breath * 2.4) / (size.width / size.height));
    camera.position.x = THREE.MathUtils.damp(camera.position.x, Math.sin(angle) * distance, 7, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 2.15 - resolution * .65, 7, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, Math.cos(angle) * distance, 7, delta);
    camera.lookAt(0, 0, 0);
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
      if (quality !== "low" && sample.current.seconds / sample.current.frames > .025) onSlow();
      sample.current = { frames: 0, seconds: 0 };
    }
  });
  return null;
}

function Plate({ size, position = [0, 0, 0], color = "#555958", metal = .7, rough = .36 }: {
  size: [number, number, number]; position?: [number, number, number]; color?: string; metal?: number; rough?: number;
}) {
  const [w, h, d] = size;
  const geometry = useMemo(() => new RoundedBoxGeometry(w, h, d, 2, Math.min(.045, d / 3, h / 4)), [w, h, d]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} position={position}><meshStandardMaterial color={color} metalness={metal} roughness={rough} /></mesh>;
}

function Instrument(props: SceneProps) {
  const root = useRef<THREE.Group>(null);
  const inlet = useRef<THREE.Group>(null);
  const organizer = useRef<THREE.Group>(null);
  const outlet = useRef<THREE.Group>(null);
  const p = props.progress;
  const form = range(p, .25, .32);
  const behavior = range(p, .45, .51);
  const converge = range(p, .61, .65);
  const anticipate = range(p, .665, .7);
  // Slow approach, a held breath, then a short, weighted seating movement.
  const close = range(p, .722, .758);
  const settle = Math.sin(range(p, .758, .793) * Math.PI * 2) * (1 - range(p, .758, .793)) * .035;
  const resolved = range(p, .78, .82);
  useFrame((_, delta) => {
    if (!root.current || !inlet.current || !organizer.current || !outlet.current) return;
    const reveal = range(p, .035, .12);
    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, (2.4 - reveal * .4) * (1 - form), 8, delta);
    root.current.scale.setScalar(THREE.MathUtils.damp(root.current.scale.x, 1 + (1 - reveal) * .42, 8, delta));
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, -.08 + resolved * .04, 8, delta);
    root.current.rotation.z = THREE.MathUtils.damp(root.current.rotation.z, -.14 * (1 - form) - .025 * (1 - resolved), 8, delta);
    inlet.current.position.set(-1.67 - converge * (1 - close) * (.45 + anticipate * .15) - settle, 0, .02);
    organizer.current.position.set(0, converge * (1 - close) * (.58 + anticipate * .12) - (1 - form) * 1.6, 0);
    outlet.current.position.set(1.67 + converge * (1 - close) * (.45 + anticipate * .15) + settle, -converge * (1 - close) * .35 - (1 - behavior) * 1.2, .02);
    inlet.current.rotation.y = converge * (1 - close) * -.15;
    outlet.current.rotation.y = converge * (1 - close) * .18;
    organizer.current.visible = form > .001;
    outlet.current.visible = behavior > .001;

  });
  return (
    <group ref={root}>
      <SignalStream {...props} />
      <group ref={inlet} position={[-1.67, 0, .02]}>
        <Plate size={[.48, 2.66, .45]} color="#817b70" metal={.82} rough={.32} />
        <Plate size={[.28, 2.35, .05]} position={[0, 0, .25]} color="#202422" rough={.67} metal={.15} />
        <mesh position={[0, 0, .285]}><boxGeometry args={[.035, 2.02, .015]} /><meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={.6} /></mesh>
        {[-1.18, 1.18].map(y => <Fastener key={y} position={[0, y, .255]} />)}
      </group>
      <group ref={organizer}>
        <Plate size={[2.78, 2.66, .3]} color="#444a47" rough={.42} />
        <Inscription text="001   /   SIGNAL COMPOSER" position={[0, 1.12, .201]} />
        <Inscription text="INPUT     /     STRUCTURE     /     RESPONSE" position={[0, -1.13, .201]} />
        <Plate size={[2.55, 2.4, .045]} position={[0, 0, .17]} color="#171d1c" metal={.3} rough={.68} />
        {Array.from({ length: 6 }, (_, i) => <Channel key={i} index={i} {...props} />)}
        {[-1.24, 1.24].flatMap(x => [-1.19, 1.19].map(y => <Fastener key={`${x}-${y}`} position={[x, y, .19]} />))}
      </group>
      <group ref={outlet} position={[1.67, 0, .02]}>
        <Plate size={[.48, 2.66, .45]} color="#727977" rough={.3} />
        <Plate size={[.28, 2.35, .05]} position={[0, 0, .25]} color="#171d1c" rough={.67} metal={.15} />
        {Array.from({ length: 6 }, (_, i) => <OutputIndicator key={i} index={i} done={props.routed.includes(i + 1)} paused={props.paused} />)}
        {[-1.18, 1.18].map(y => <Fastener key={y} position={[0, y, .255]} />)}
      </group>
    </group>
  );
}

function Fastener({ position }: { position: [number, number, number] }) {
  return <group position={position}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.037, .037, .014, 12]} /><meshStandardMaterial color="#afb0a5" metalness={.85} roughness={.27} /></mesh><mesh position={[0, 0, .009]} rotation={[0, 0, -.5]}><boxGeometry args={[.038, .007, .003]} /><meshBasicMaterial color="#242826" /></mesh></group>;
}

function Channel({ index, progress, selected, routed, pulse, paused }: SceneProps & { index: number }) {
  const root = useRef<THREE.Group>(null);
  const marker = useRef<THREE.Mesh>(null);
  const time = useRef(0);
  const previousPulse = useRef(pulse);
  const burst = useRef(-10);
  const wasBehavior = useRef(false);
  const wasDone = useRef(false);
  const active = selected === index + 1;
  const done = routed.includes(index + 1);
  useFrame((_, delta) => {
    if (!root.current || !marker.current) return;
    if (!paused) time.current += Math.min(delta, .05);
    if (pulse !== previousPulse.current) { previousPulse.current = pulse; burst.current = time.current; }
    const organize = range(progress, .26 + index * .005, .325 + index * .005);
    const seating = range(progress, .755, .8);
    root.current.position.z = THREE.MathUtils.damp(root.current.position.z, .23 + (1 - organize) * (.3 + index * .1) + (active ? .09 : 0), 12, delta);
    const inBehavior = progress >= .46 && progress < .64;
    if (inBehavior && !wasBehavior.current) burst.current = time.current;
    wasBehavior.current = inBehavior;
    if (done && !wasDone.current) burst.current = time.current;
    wasDone.current = done;
    const elapsed = time.current - burst.current - (inBehavior ? index * .085 : 0);
    const play = elapsed >= 0 && elapsed < 1.35;
    const behavior = progress >= .46 && progress < .64;
    marker.current.visible = done || active || (behavior && play) || (progress >= .76 && progress < .82);
    const travel = (behavior || done) && play ? range(elapsed, 0, 1.1) : done ? 1 : progress < .82 ? seating : .06;
    marker.current.position.x = -1.05 + travel * 2.1;
  });
  return <group ref={root} position={[0, .875 - index * .35, .23]}>
    <Plate size={[2.26, .255, .065]} color={active ? "#a29b87" : "#565e58"} metal={.78} rough={active ? .28 : .4} />
    <mesh position={[0, 0, .041]}><boxGeometry args={[2.08, .035, .01]} /><meshStandardMaterial color="#151b19" metalness={.2} roughness={.8} /></mesh>
    <mesh ref={marker} position={[-1, 0, .059]}><boxGeometry args={[.14, .034, .022]} /><meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={.8} /></mesh>
  </group>;
}

const streamVertex = `
attribute float aSeed;
uniform float uTime; uniform float uProgress; uniform vec2 uPointer;
varying float vAlpha;
void main(){
 float focus=smoothstep(.09,.23,uProgress);
 float leave=1.-smoothstep(.28,.35,uProgress);
 float phase=fract(aSeed+uTime*.045);
 float x=mix(-3.7,-1.7,phase);
 float y=position.y*mix(1.0,.2,focus*phase);
 float influence=exp(-pow(y-uPointer.y*1.8,2.)*5.0);
 y*=1.0-influence*.12;
 vec3 p=vec3(x,y,position.z*.4);
 gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
 gl_PointSize=1.8+fract(aSeed*71.)*1.6;
 vAlpha=sin(phase*3.14159)*leave*(.55+focus*.4);
}`;
const streamFragment = `varying float vAlpha; void main(){vec2 p=abs(gl_PointCoord-.5); float a=1.-smoothstep(.32,.5,max(p.x,p.y)); gl_FragColor=vec4(.88,.7,.48,a*vAlpha);}`;
function SignalStream({ progress, paused, quality }: SceneProps) {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const count = quality === "low" ? 100 : quality === "medium" ? 180 : 260;
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3), seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) { const n = Math.sin(i * 127.1 + 13) * 43758.5453; const seed = n - Math.floor(n); positions.set([0, (seed - .5) * 3.6, Math.sin(i * 4.7)], i * 3); seeds[i] = i / count; }
    return { positions, seeds };
  }, [count]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uProgress: { value: 0 }, uPointer: { value: new THREE.Vector2() } }), []);
  useFrame((state, delta) => { if (!ref.current) return; const u = ref.current.uniforms; if (!paused) u.uTime.value += Math.min(delta, .05); u.uProgress.value = progress; u.uPointer.value.lerp(state.pointer, .05); });
  return <points visible={progress < .35} frustumCulled={false}><bufferGeometry><bufferAttribute attach="attributes-position" args={[data.positions, 3]} /><bufferAttribute attach="attributes-aSeed" args={[data.seeds, 1]} /></bufferGeometry><shaderMaterial ref={ref} vertexShader={streamVertex} fragmentShader={streamFragment} uniforms={uniforms} transparent depthWrite={false} /></points>;
}

function Inscription({ text, position }: { text: string; position: [number, number, number] }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = 1024; canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 1024, 64); ctx.fillStyle = "#b3b7aa"; ctx.font = "24px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, 512, 32);
    const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace; return map;
  }, [text]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={position}><planeGeometry args={[2.25, .14]} /><meshBasicMaterial map={texture} transparent depthWrite={false} /></mesh>;
}

function OutputIndicator({ index, done, paused }: { index: number; done: boolean; paused: boolean }) {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const elapsed = useRef(0);
  const off = useMemo(() => new THREE.Color("#666f67"), []);
  const on = useMemo(() => new THREE.Color(AMBER), []);
  useFrame((_, delta) => {
    if (!done) elapsed.current = 0;
    else if (!paused) elapsed.current += Math.min(delta, .05);
    if (!material.current) return;
    const arrived = range(elapsed.current, 1.05, 1.22);
    material.current.color.copy(off).lerp(on, arrived);
    material.current.emissive.copy(on);
    material.current.emissiveIntensity = arrived * .7;
  });
  return <mesh position={[0, .875 - index * .35, .285]}><boxGeometry args={[.105, .06, .025]} /><meshStandardMaterial ref={material} color="#666f67" /></mesh>;
}
