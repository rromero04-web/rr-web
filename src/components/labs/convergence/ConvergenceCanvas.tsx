"use client";
/* eslint-disable react-hooks/immutability, react-hooks/refs -- R3F owns these mutable scene objects outside React rendering. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { range, type Quality } from "./model";

type SceneProps = {
  progress: number;
  paused: boolean;
  quality: Quality;
  selected: number | null;
  routed: number[];
  pulse: number;
  onSlow: () => void;
};

export function ConvergenceCanvas(props: SceneProps) {
  const dpr = props.quality === "high" ? [1, 1.5] : props.quality === "medium" ? [1, 1.25] : [1, 1];
  return (
    <Canvas
      aria-hidden="true"
      dpr={dpr as [number, number]}
      shadows={props.quality !== "low" ? "basic" : false}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, .35, 10], fov: 35, near: .1, far: 50 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#090b0e");
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
      }}
      fallback={<div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#a7adb4" }}>Realtime graphics unavailable. Use Reading mode.</div>}
    >
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  );
}

function Scene(props: SceneProps) {
  return (
    <>
      <CameraDirector progress={props.progress} paused={props.paused} />
      <PerformanceGovernor quality={props.quality} onSlow={props.onSlow} />
      <StudioLights progress={props.progress} quality={props.quality} />
      <fog attach="fog" args={["#090b0e", 10, 23]} />
      <AttentionField progress={props.progress} paused={props.paused} quality={props.quality} />
      <FormAssembly progress={props.progress} paused={props.paused} />
      <BehaviorNetwork progress={props.progress} pulse={props.pulse} selected={props.selected} />
      <Physics gravity={[0, 0, 0]} timeStep={1 / 60} paused={props.paused}>
        <HeroCarriers progress={props.progress} />
      </Physics>
      <SignalProduct progress={props.progress} selected={props.selected} routed={props.routed} />
      <ImpactWave progress={props.progress} />
      <Ground />
    </>
  );
}

function PerformanceGovernor({ quality, onSlow }: { quality: Quality; onSlow: () => void }) {
  const sample = useRef({ frames: 0, seconds: 0, changed: false });
  useFrame((_, delta) => {
    if (quality === "low" || sample.current.changed || delta > .2) return;
    sample.current.frames += 1;
    sample.current.seconds += delta;
    if (sample.current.frames >= 180) {
      const averageMs = sample.current.seconds / sample.current.frames * 1000;
      if (averageMs > 25) {
        sample.current.changed = true;
        onSlow();
      } else {
        sample.current.frames = 0;
        sample.current.seconds = 0;
      }
    }
  });
  return null;
}

function CameraDirector({ progress, paused }: { progress: number; paused: boolean }) {
  const { camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const mobile = size.width < 820;
  useFrame((state, delta) => {
    const p = progress;
    const shots = mobile
      ? [
          { p: 0, pos: [0, .2, 11.2], look: [0, 0, 0], fov: 40 },
          { p: .1, pos: [.45, .55, 7.8], look: [.15, -.15, 0], fov: 40 },
          { p: .3, pos: [.6, 1.1, 7.2], look: [.2, 0, 0], fov: 40 },
          { p: .48, pos: [.25, .8, 7.6], look: [.15, 0, 0], fov: 40 },
          { p: .65, pos: [0, .8, 10.6], look: [0, 0, 0], fov: 40 },
          { p: .83, pos: [.3, 1, 8.2], look: [.25, 0, 0], fov: 40 },
        ]
      : [
          { p: 0, pos: [0, .35, 10], look: [.35, 0, 0], fov: 35 },
          { p: .1, pos: [1.8, .8, 5.6], look: [.8, .1, 0], fov: 32 },
          { p: .3, pos: [3.3, 2.1, 5], look: [.55, 0, 0], fov: 30 },
          { p: .47, pos: [1.1, 1.25, 6], look: [.4, 0, 0], fov: 31 },
          { p: .64, pos: [0, 1, 11.4], look: [0, 0, 0], fov: 36 },
          { p: .82, pos: [3.6, 2.2, 7.4], look: [.7, 0, 0], fov: 32 },
        ];
    let a = shots[0], b = shots[shots.length - 1];
    for (let i = 0; i < shots.length - 1; i++) {
      if (p >= shots[i].p && p <= shots[i + 1].p) { a = shots[i]; b = shots[i + 1]; break; }
    }
    const raw = Math.max(0, Math.min(1, (p - a.p) / Math.max(.001, b.p - a.p)));
    const t = raw * raw * (3 - 2 * raw);
    desired.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], t),
    );
    const impact = Math.max(0, 1 - Math.abs(p - .748) / .012);
    desired.x += Math.sin(p * 730) * impact * .025;
    const follow = paused ? 1 : 1 - Math.exp(-delta * 8);
    camera.position.lerp(desired, follow);
    target.set(
      THREE.MathUtils.lerp(a.look[0], b.look[0], t),
      THREE.MathUtils.lerp(a.look[1], b.look[1], t),
      THREE.MathUtils.lerp(a.look[2], b.look[2], t),
    );
    camera.lookAt(target);
    const fov = THREE.MathUtils.lerp(a.fov, b.fov, t);
    if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - fov) > .01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    state.gl.toneMappingExposure = 1 + impact * .07;
  });
  return null;
}

function StudioLights({ progress, quality }: { progress: number; quality: Quality }) {
  const neutral = range(progress, .68, .8);
  return (
    <>
      <ambientLight intensity={.15 + neutral * .09} />
      <directionalLight
        castShadow={quality !== "low"}
        position={[-4, 6, 5]}
        intensity={3.2 + neutral * .9}
        color={new THREE.Color("#f3eee4").lerp(new THREE.Color("#ffffff"), neutral)}
        shadow-mapSize-width={quality === "high" ? 1024 : 512}
        shadow-mapSize-height={quality === "high" ? 1024 : 512}
      />
      <pointLight position={[4, 1.5, 4]} intensity={11} distance={12} color="#8d9aaa" />
      <pointLight position={[1, 3, -3]} intensity={13} distance={11} color="#c7c2d4" />
    </>
  );
}

const attentionVertex = `
  attribute vec3 aGrid;
  attribute float aSeed;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uPointer;
  varying float vAlpha;
  void main(){
    float organize = smoothstep(.09,.28,uProgress);
    float converge = smoothstep(.58,.78,uProgress);
    vec3 chaos = position;
    chaos.x += sin(aSeed*31.7 + uTime*.16)*.16;
    chaos.y += cos(aSeed*17.1 + uTime*.12)*.11;
    vec3 p = mix(chaos,aGrid,organize);
    vec2 delta = p.xy-uPointer*2.2;
    float influence = exp(-dot(delta,delta)*1.5)*(1.0-organize);
    p.xy += normalize(delta+vec2(.001))*influence*.22;
    p = mix(p, vec3(-1.95 + mod(aSeed*19.0,1.0)*.55, (fract(aSeed*43.0)-.5)*2.25, .1), converge);
    vec4 mv = modelViewMatrix*vec4(p,1.0);
    gl_Position=projectionMatrix*mv;
    gl_PointSize=3.5+fract(aSeed*71.0)*4.0;
    float intro=mix(.2,1.0,smoothstep(.06,.12,uProgress));
    float structuredDim=mix(1.0,.18,smoothstep(.24,.46,uProgress));
    vAlpha=intro*structuredDim*(1.0-smoothstep(.79,.86,uProgress))*(.35+fract(aSeed*7.0)*.65);
  }`;
const attentionFragment = `
  varying float vAlpha;
  void main(){
    vec2 p=abs(gl_PointCoord-.5);
    float box=1.0-smoothstep(.36,.5,max(p.x*.56,p.y));
    if(box<.05) discard;
    gl_FragColor=vec4(vec3(.88,.85,.79),vAlpha*box);
  }`;

function AttentionField({ progress, paused, quality }: { progress: number; paused: boolean; quality: Quality }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const count = quality === "high" ? 4200 : quality === "medium" ? 2600 : 1200;
  const mobile = useThree((state) => state.size.width < 820);
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const grids = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    let seed = 1001;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < count; i++) {
      const x = random(), y = random(), z = random();
      positions.set([(x - .5) * 4.6, (y - .5) * 2.7, (z - .5) * 1.2], i * 3);
      const col = i % 12, row = Math.floor(i / 12) % 7;
      grids.set([-2.8 + col * .48, -1.45 + row * .44, (random() - .5) * .28], i * 3);
      seeds[i] = random();
    }
    return { positions, grids, seeds };
  }, [count]);
  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uProgress.value = progress;
    if (!paused) material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current.uniforms.uPointer.value.set(state.pointer.x, state.pointer.y);
  });
  return (
    <points position={[mobile ? .3 : 2, mobile ? -.45 : -.05, 0]} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-aGrid" args={[data.grids, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[data.seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={attentionVertex}
        fragmentShader={attentionFragment}
        transparent
        depthWrite={false}
        uniforms={{ uProgress: { value: 0 }, uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() } }}
      />
    </points>
  );
}

function FormAssembly({ progress, paused }: { progress: number; paused: boolean }) {
  const group = useRef<THREE.Group>(null);
  const hover = useRef(-1);
  const visible = range(progress, .25, .33) * (1 - range(progress, .61, .72));
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.visible = visible > .01;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -.16 + state.pointer.x * .025, 5, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, state.pointer.y * .03, 5, delta);
    group.current.children.forEach((child, index) => {
      const target = !paused && index === hover.current ? .13 : 0;
      child.position.z = THREE.MathUtils.damp(child.position.z, target, 7, delta);
    });
  });
  return (
    <group ref={group} position={[1.2, 0, -.4]}>
      {Array.from({ length: 24 }, (_, index) => {
        const col = index % 6, row = Math.floor(index / 6);
        const strong = col < 3;
        return (
          <mesh key={index} position={[-1.5 + col * .6, -.9 + row * .6, 0]} onPointerOver={() => { hover.current = index; }} onPointerOut={() => { hover.current = -1; }} castShadow receiveShadow>
            <boxGeometry args={[strong ? .46 : .32, .08, .2]} />
            <meshStandardMaterial color={strong ? "#555a62" : "#30353b"} metalness={.5} roughness={.48} transparent opacity={visible} />
          </mesh>
        );
      })}
      {[0, 1, 2].map((index) => (
        <mesh key={`plane-${index}`} position={[-.95 + index * 1.15, 0, -.18]}>
          <boxGeometry args={[.01, 2.7 - index * .34, .02]} />
          <meshStandardMaterial color="#aaa0c6" emissive="#494358" emissiveIntensity={.25} transparent opacity={visible * .55} />
        </mesh>
      ))}
      <mesh position={[0, 0, -.33]} receiveShadow>
        <boxGeometry args={[4.1, 2.8, .08]} />
        <meshStandardMaterial color="#171b20" metalness={.38} roughness={.68} transparent opacity={visible * .78} />
      </mesh>
    </group>
  );
}

const nodes = [
  [-1.7, .5], [-.95, -.45], [-.25, .65], [.55, -.25], [1.35, .55], [2, -.35],
] as const;
const links: [number, number][] = [[0,1],[1,2],[2,3],[3,4],[4,5],[1,3]];

function BehaviorNetwork({ progress, pulse, selected }: { progress: number; pulse: number; selected: number | null }) {
  const root = useRef<THREE.Group>(null);
  const visible = range(progress, .43, .51) * (1 - range(progress, .63, .72));
  useFrame((state) => {
    if (!root.current) return;
    root.current.visible = visible > .01;
    root.current.children.forEach((child, index) => {
      if (!(child instanceof THREE.Mesh) || !Array.isArray(child.material)) {
        const mat = child instanceof THREE.Mesh ? child.material as THREE.MeshStandardMaterial : null;
        if (mat?.emissive) {
          const active = (state.clock.elapsedTime * 2.1 + index + pulse) % 6 < 1 || selected === index + 1;
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, active ? 2.2 : .18, .1);
        }
      }
    });
  });
  return (
    <group ref={root} position={[1.5, 0, 0]}>
      {links.map(([from, to], index) => {
        const a = nodes[from], b = nodes[to];
        const dx = b[0] - a[0], dy = b[1] - a[1];
        return (
          <mesh key={`line-${index}`} position={[(a[0]+b[0])/2,(a[1]+b[1])/2,-.05]} rotation={[0,0,Math.atan2(dy,dx)]}>
            <boxGeometry args={[Math.hypot(dx,dy), .018, .018]} />
            <meshStandardMaterial color="#52616a" emissive="#91aebc" emissiveIntensity={.12} transparent opacity={visible * .8} />
          </mesh>
        );
      })}
      {nodes.map((node, index) => (
        <mesh key={`node-${index}`} position={[node[0],node[1],0]} castShadow>
          <boxGeometry args={[index === 0 || index === 5 ? .42 : .26, .26, .2]} />
          <meshStandardMaterial color="#333a40" emissive="#91aebc" emissiveIntensity={.18} metalness={.25} roughness={.58} transparent opacity={visible} />
        </mesh>
      ))}
    </group>
  );
}

function HeroCarriers({ progress }: { progress: number }) {
  const refs = [useRef<RapierRigidBody>(null), useRef<RapierRigidBody>(null), useRef<RapierRigidBody>(null)];
  const released = useRef(false);
  const mobile = useThree((state) => state.size.width < 820);
  const starts = mobile
    ? [[-1.25,.25,.05],[.1,1.15,-.22],[1.2,-.65,.08]]
    : [[-2.6,.55,.1],[.45,1.7,-.4],[2.3,-.75,.15]];
  useFrame((_, delta) => {
    const bodies = refs.map((ref) => ref.current).filter(Boolean) as RapierRigidBody[];
    if (bodies.length !== 3) return;
    if (progress < .695) {
      released.current = false;
      const orbit = range(progress, .63, .695);
      bodies.forEach((body, index) => {
        body.setBodyType(2, true);
        const start = starts[index];
        body.setNextKinematicTranslation({ x: start[0] * (1 - orbit * .16), y: start[1] * (1 - orbit * .12), z: start[2] });
        body.setNextKinematicRotation({ x: 0, y: Math.sin(orbit * Math.PI) * .12 * (index - 1), z: (index - 1) * .07 * orbit, w: 1 });
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      });
    } else if (progress < .805) {
      if (!released.current) {
        released.current = true;
        bodies.forEach((body, index) => {
          body.setBodyType(0, true);
          const t = body.translation();
          body.setLinvel({ x: -t.x * (1.4 + index * .08), y: -t.y * 1.4, z: -t.z }, true);
          body.setAngvel({ x: .15 * index, y: (index - 1) * .45, z: (1 - index) * .18 }, true);
        });
      }
      bodies.forEach((body) => {
        const t = body.translation(), v = body.linvel();
        const scale = Math.min(delta, .033);
        body.applyImpulse({ x: (-t.x * 4.8 - v.x * 1.8) * scale, y: (-t.y * 4.8 - v.y * 1.8) * scale, z: (-t.z * 4 - v.z * 1.6) * scale }, true);
      });
    }
  });
  const opacity = 1 - range(progress, .79, .84);
  return (
    <group visible={progress > .6 && progress < .85}>
      <RigidBody ref={refs[0]} type="kinematicPosition" colliders="cuboid" restitution={.04} friction={.7} linearDamping={1.2} angularDamping={1.6} position={starts[0] as [number,number,number]}>
        <group>
          <mesh castShadow><boxGeometry args={[1.28,1.75,.42]} /><meshStandardMaterial color="#22272c" metalness={.48} roughness={.48} transparent opacity={opacity} /></mesh>
          <mesh position={[.43,0,.25]}><boxGeometry args={[.14,1.32,.09]} /><meshStandardMaterial color="#d5b48c" emissive="#5c432a" emissiveIntensity={.4} transparent opacity={opacity} /></mesh>
        </group>
      </RigidBody>
      <RigidBody ref={refs[1]} type="kinematicPosition" colliders="cuboid" restitution={.04} friction={.7} linearDamping={1.2} angularDamping={1.6} position={starts[1] as [number,number,number]}>
        <group>
          <mesh castShadow><boxGeometry args={[1.55,1.22,.4]} /><meshStandardMaterial color="#292d33" metalness={.52} roughness={.4} transparent opacity={opacity} /></mesh>
          {[-.38,0,.38].map((y) => <mesh key={y} position={[0,y,.24]}><boxGeometry args={[1.1,.08,.07]} /><meshStandardMaterial color="#aaa0c6" transparent opacity={opacity*.8} /></mesh>)}
        </group>
      </RigidBody>
      <RigidBody ref={refs[2]} type="kinematicPosition" colliders="cuboid" restitution={.04} friction={.7} linearDamping={1.2} angularDamping={1.6} position={starts[2] as [number,number,number]}>
        <group>
          <mesh castShadow><boxGeometry args={[1.12,1.58,.4]} /><meshStandardMaterial color="#1d2328" metalness={.42} roughness={.55} transparent opacity={opacity} /></mesh>
          {[-.42,0,.42].map((y) => <mesh key={y} position={[.25,y,.24]}><boxGeometry args={[.22,.12,.08]} /><meshStandardMaterial color="#91aebc" emissive="#3c5662" emissiveIntensity={.55} transparent opacity={opacity} /></mesh>)}
        </group>
      </RigidBody>
    </group>
  );
}

function SignalProduct({ progress, selected, routed }: { progress: number; selected: number | null; routed: number[] }) {
  const root = useRef<THREE.Group>(null);
  const appear = range(progress, .8, .88);
  useFrame((state, delta) => {
    if (!root.current) return;
    root.current.visible = appear > .001;
    root.current.scale.setScalar(THREE.MathUtils.damp(root.current.scale.x, .82 + appear * .18, 8, delta));
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, -.1 + state.pointer.x * .025, 4, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, .04 - state.pointer.y * .018, 4, delta);
  });
  return (
    <group ref={root} position={[1.35, .25, 0]}>
      <mesh castShadow receiveShadow><boxGeometry args={[4.8,2.9,.22]} /><meshStandardMaterial color="#171b20" metalness={.55} roughness={.44} transparent opacity={appear} /></mesh>
      <mesh position={[-2.12,0,.24]} castShadow><boxGeometry args={[.46,2.42,.34]} /><meshStandardMaterial color="#262c31" metalness={.48} roughness={.5} transparent opacity={appear} /></mesh>
      <mesh position={[-1.78,0,.43]}><boxGeometry args={[.05,2.04,.05]} /><meshStandardMaterial color="#d5b48c" emissive="#d5b48c" emissiveIntensity={.65} transparent opacity={appear} /></mesh>
      <mesh position={[2.04,0,.24]} castShadow><boxGeometry args={[.55,2.42,.34]} /><meshStandardMaterial color="#22282d" metalness={.42} roughness={.58} transparent opacity={appear} /></mesh>
      {Array.from({ length: 6 }, (_, index) => {
        const id = index + 1, active = selected === id, done = routed.includes(id);
        return (
          <group key={id} position={[-.35, .94 - index * .37, .25]}>
            <mesh castShadow position={[done ? .22 : 0, 0, active ? .14 : 0]}>
              <boxGeometry args={[2.42,.2,.16]} />
              <meshStandardMaterial color={done ? "#62707a" : active ? "#716a7e" : "#363c42"} metalness={.32} roughness={.55} emissive={active ? "#3d374a" : done ? "#30434b" : "#000000"} emissiveIntensity={active || done ? .8 : 0} transparent opacity={appear} />
            </mesh>
            <mesh position={[-1.03,0,.14]}><boxGeometry args={[.08,.08,.06]} /><meshStandardMaterial color={active ? "#d7cde9" : done ? "#91aebc" : "#5f666d"} emissive={active ? "#aaa0c6" : done ? "#91aebc" : "#000000"} emissiveIntensity={active || done ? 1.6 : 0} transparent opacity={appear} /></mesh>
          </group>
        );
      })}
      <mesh position={[1.72,-.72,.44]}><boxGeometry args={[.28,.28,.08]} /><meshStandardMaterial color="#91aebc" emissive="#91aebc" emissiveIntensity={routed.length ? 1.5 : .15} transparent opacity={appear} /></mesh>
      <mesh position={[0,1.25,.18]}><boxGeometry args={[3.5,.03,.05]} /><meshStandardMaterial color="#626a72" transparent opacity={appear*.6} /></mesh>
    </group>
  );
}

function ImpactWave({ progress }: { progress: number }) {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const strength = Math.max(0, 1 - Math.abs(progress - .748) / .018);
  useFrame(() => {
    if (!material.current || !group.current) return;
    material.current.opacity = strength * .45;
    group.current.scale.setScalar(.6 + (1 - strength) * 3.2);
    group.current.visible = strength > .01;
  });
  return (
    <group ref={group} rotation={[Math.PI/2,0,0]}>
      <mesh><ringGeometry args={[.94, .97, 96]} /><meshBasicMaterial ref={material} color="#f2f0e9" transparent depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh position={[1,-1.72,-.3]} rotation={[-Math.PI/2,0,0]} receiveShadow>
      <planeGeometry args={[14,10]} />
      <meshStandardMaterial color="#0b0d10" metalness={.18} roughness={.76} />
    </mesh>
  );
}
