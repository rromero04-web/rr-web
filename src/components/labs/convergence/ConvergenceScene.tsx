"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { approach, decay, type Spring } from "./motion";
import { gradeShader, particleFragment, particleVertex } from "./shaders";
import type { Quality, SceneState } from "./model";

type Props = {
  stateRef: RefObject<SceneState>;
  quality: Quality;
  onSlow: () => void;
  onReady: () => void;
};

const COUNTS: Record<Quality, number> = { high: 120000, medium: 72000, low: 30000 };
// Haze colour per stage, added in linear light by the grade pass.
const TINTS: [number, number, number][] = [
  [0.55, 0.3, 0.2], [0.75, 0.26, 0.12], [0.36, 0.3, 0.8], [0.12, 0.5, 0.75], [0.5, 0.42, 0.75], [0.42, 0.34, 0.62],
];

const COLORS = {
  ember: new THREE.Color("#ff6a3d"),
  lilac: new THREE.Color("#8f7dff"),
  aqua: new THREE.Color("#3fd8ff"),
  bone: new THREE.Color("#f4efe6"),
};

export function ConvergenceScene(props: Props) {
  const dpr: [number, number] = props.quality === "high" ? [1, 1.75] : props.quality === "medium" ? [1, 1.5] : [1, 1.25];
  return (
    <Canvas
      aria-hidden="true"
      dpr={dpr}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false }}
      camera={{ position: [0, 1.6, 11], fov: 38, near: 0.1, far: 120 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#050507", 1);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Matter {...props} />
    </Canvas>
  );
}

// Camera shots per stage: position, target, and where the object sits on screen
// (fraction of the viewport, so text and matter never share the same space).
const SHOTS = {
  desktop: [
    { pos: [0, 1.4, 11.5], aim: [0, 0, 0], frame: [0, 0.02] },
    { pos: [0.6, 0.2, 10.5], aim: [0, 0, 0], frame: [0.2, 0] },
    { pos: [7.6, 6.4, 8.8], aim: [0, -0.2, 0], frame: [-0.18, 0.02] },
    { pos: [0, 0.4, 10.5], aim: [0, 0, 0], frame: [0, 0.06] },
    { pos: [0, 0.2, 6.5], aim: [0, 0, 0], frame: [0, 0] },
    { pos: [0, 0.5, 12.6], aim: [0, 0, 0], frame: [0.22, 0] },
  ],
  mobile: [
    { pos: [0, 1.4, 15], aim: [0, 0, 0], frame: [0, -0.06] },
    { pos: [0.4, 0.2, 15], aim: [0, 0, 0], frame: [0, -0.18] },
    { pos: [9.5, 8.2, 11.5], aim: [0, -0.2, 0], frame: [0, -0.18] },
    { pos: [0, 0.4, 13], aim: [0, 0, 0], frame: [0, -0.16] },
    { pos: [0, 0.2, 8], aim: [0, 0, 0], frame: [0, -0.12] },
    { pos: [0, 0.5, 17], aim: [0, 0, 0], frame: [0, -0.2] },
  ],
} as const;

function sampleShot(shots: typeof SHOTS.desktop | typeof SHOTS.mobile, stage: number, key: "pos" | "aim" | "frame", axis: number) {
  const k = Math.min(Math.floor(stage), shots.length - 2);
  const f = THREE.MathUtils.smootherstep(stage - k, 0, 1);
  const a = shots[k][key][axis] as number;
  const b = shots[k + 1][key][axis] as number;
  return a + (b - a) * f;
}

function Matter({ stateRef, quality, onSlow, onReady }: Props) {
  const { gl, scene, camera, size } = useThree();
  const count = COUNTS[quality];
  const stage = useRef<Spring>({ value: 0, velocity: 0 });
  const mouse = useRef({ x: 0, y: 0, force: 0 });
  const look = useRef(new THREE.Vector3());
  const frame = useRef({ x: 0, y: 0 });
  const flash = useRef(0);
  const lastStage = useRef(0);
  const points = useRef<THREE.Points>(null);
  const post = useRef<{ composer: EffectComposer; trails: AfterimagePass; bloom: UnrealBloomPass; grade: ShaderPass } | null>(null);
  const shock = useRef({ age: 10, introFired: false });
  const clock = useRef(0);
  const governor = useRef({ time: 0, frames: 0, strikes: 0 });
  const ready = useRef(false);
  const mobile = size.width < 820;
  const tmp = useMemo(() => ({
    cam: new THREE.Vector3(), shake: new THREE.Vector3(), aim: new THREE.Vector3(), hit: new THREE.Vector3(), normal: new THREE.Vector3(),
    ndc: new THREE.Vector2(), ray: new THREE.Raycaster(), plane: new THREE.Plane(),
  }), []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const index = new Float32Array(count);
    const rand = new Float32Array(count * 4);
    let seed = 0x9e3779b9;
    const random = () => {
      seed = (Math.imul(seed ^ (seed >>> 15), 0x2c1b3c6d) + 0x297a2d39) >>> 0;
      seed ^= seed >>> 12;
      return (seed >>> 0) / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      index[i] = i;
      for (let j = 0; j < 4; j++) rand[i * 4 + j] = random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aIndex", new THREE.BufferAttribute(index, 1));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    return g;
  }, [count]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: particleVertex,
    fragmentShader: particleFragment,
    uniforms: {
    uTime: { value: 0 },
    uStage: { value: 0 },
    uCount: { value: count },
    uSize: { value: 30 * Math.pow(72000 / count, 0.3) },
    uOpacity: { value: Math.min(1.6, Math.pow(72000 / count, 0.45)) * 0.8 },
    uPixelRatio: { value: 1 },
    uCalm: { value: 0 },
    uMouse: { value: new THREE.Vector3() },
    uMouseForce: { value: 0 },
    uPulseAge: { value: 100 },
    uRouteAge: { value: 100 },
    uRouteGroup: { value: 0 },
    uRouted: { value: new THREE.Vector3() },
    uComplete: { value: 0 },
    uMobile: { value: 0 },
    uIntro: { value: 0 },
    uFocus: { value: 11 },
    uAperture: { value: 0.12 },
    uEmber: { value: COLORS.ember },
    uLilac: { value: COLORS.lilac },
    uAqua: { value: COLORS.aqua },
    uBone: { value: COLORS.bone },
  },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [count]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    const trails = new AfterimagePass(0);
    composer.addPass(trails);
    const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.85, 0.75, 0.08);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const grade = new ShaderPass(gradeShader);
    composer.addPass(grade);
    post.current = { composer, trails, bloom, grade };
    return () => {
      composer.dispose();
      post.current = null;
      (camera as THREE.PerspectiveCamera).clearViewOffset();
    };
  }, [gl, scene, camera]);

  useEffect(() => {
    const current = post.current;
    if (!current) return;
    const ratio = gl.getPixelRatio();
    current.composer.setPixelRatio(ratio);
    current.composer.setSize(size.width, size.height);
    current.bloom.resolution.set(size.width * ratio * 0.5, size.height * ratio * 0.5);
    current.bloom.enabled = quality !== "low";
    current.trails.enabled = quality !== "low";
  }, [size, gl, quality, scene, camera]);

  useFrame((_, rawDelta) => {
    const state = stateRef.current;
    const pass = post.current;
    const shader = points.current?.material as THREE.ShaderMaterial | undefined;
    if (!pass || !shader) return;
    const dt = Math.min(rawDelta, 1 / 15);
    const perspective = camera as THREE.PerspectiveCamera;
    const u = shader.uniforms;
    const calm = state.calm;
    if (!state.paused) clock.current += dt * (calm ? 0.6 : 1);
    const now = performance.now() / 1000;

    if (state.snap) { stage.current.value = state.stage; stage.current.velocity = 0; }
    else approach(stage.current, state.stage, calm ? 4 : 5.5, dt);
    const s = THREE.MathUtils.clamp(stage.current.value, 0, 5);

    // Pointer, projected onto the plane through the origin.
    const targetForce = state.pointerActive * (calm ? 0.5 : 1);
    mouse.current.force = decay(mouse.current.force, targetForce, 3, dt);
    mouse.current.x = decay(mouse.current.x, state.pointerX, 7, dt);
    mouse.current.y = decay(mouse.current.y, state.pointerY, 7, dt);

    const shots = mobile ? SHOTS.mobile : SHOTS.desktop;
    const sway = calm ? 0.15 : 0.5;
    const camPos = tmp.cam.set(
      sampleShot(shots, s, "pos", 0) + mouse.current.x * sway,
      sampleShot(shots, s, "pos", 1) + mouse.current.y * sway * 0.6,
      sampleShot(shots, s, "pos", 2),
    );
    perspective.position.lerp(camPos, state.snap ? 1 : 1 - Math.exp(-dt * 4));
    const aim = tmp.aim.set(sampleShot(shots, s, "aim", 0), sampleShot(shots, s, "aim", 1), sampleShot(shots, s, "aim", 2));
    look.current.lerp(aim, state.snap ? 1 : 1 - Math.exp(-dt * 4));
    perspective.lookAt(look.current);
    // The shockwave shakes the camera a little, never the layout.
    const quake = shock.current.age < 1.2 && !calm ? Math.exp(-shock.current.age * 4) * 0.12 : 0;
    if (quake > 0.001) {
      perspective.position.add(tmp.shake.set(Math.sin(clock.current * 61) * quake, Math.cos(clock.current * 47) * quake, 0));
    }

    frame.current.x = decay(frame.current.x, sampleShot(shots, s, "frame", 0), state.snap ? 1e3 : 5, dt);
    frame.current.y = decay(frame.current.y, sampleShot(shots, s, "frame", 1), state.snap ? 1e3 : 5, dt);
    const w = size.width, h = size.height;
    perspective.setViewOffset(w, h, -frame.current.x * w, -frame.current.y * h, w, h);

    tmp.ray.setFromCamera(tmp.ndc.set(mouse.current.x, mouse.current.y), perspective);
    tmp.plane.set(tmp.normal.subVectors(perspective.position, look.current).normalize(), 0);
    if (tmp.ray.ray.intersectPlane(tmp.plane, tmp.hit)) u.uMouse.value.copy(tmp.hit);

    // Intro: the matter is born from one point once the curtain has lifted.
    const introStart = state.introAt + 0.45;
    const intro = state.snap ? 1 : state.introAt < 0 ? 0 : THREE.MathUtils.clamp((now - introStart) / 2.8, 0, 1);
    if (!shock.current.introFired && state.introAt >= 0 && now >= introStart && !state.snap) {
      shock.current.introFired = true;
      shock.current.age = 0;
      flash.current = calm ? 0.2 : 0.6;
    }

    // The release of the convergence is the only other flash in the piece.
    if (lastStage.current < 4.55 && s >= 4.55 && !calm) { flash.current = 1; shock.current.age = 0; }
    shock.current.age += dt;
    lastStage.current = s;
    flash.current = decay(flash.current, 0, 3.2, dt);

    u.uTime.value = clock.current;
    u.uStage.value = s;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uCalm.value = decay(u.uCalm.value, calm ? 1 : 0, 3, dt);
    u.uMouse.value.z = 0;
    u.uMouseForce.value = mouse.current.force;
    u.uPulseAge.value = now - state.pulseAt;
    u.uRouteAge.value = now - state.routeAt;
    u.uRouteGroup.value = state.routeGroup;
    const routed = u.uRouted.value;
    routed.set(
      decay(routed.x, state.routed[0], 2.5, dt),
      decay(routed.y, state.routed[1], 2.5, dt),
      decay(routed.z, state.routed[2], 2.5, dt),
    );
    u.uComplete.value = decay(u.uComplete.value, state.complete, 1.5, dt);
    u.uMobile.value = mobile ? 1 : 0;
    u.uIntro.value = intro;
    u.uFocus.value = perspective.position.distanceTo(look.current);
    u.uAperture.value = (mobile ? 0.08 : 0.12) + Math.exp(-Math.pow((s - 4) * 2, 2)) * 0.1;

    // Light trails while the matter travels: scroll speed, morphs and the intro.
    const travel = Math.min(1, Math.abs(stage.current.velocity) * 1.4) * Math.sin(Math.PI * (s % 1));
    const rush = Math.min(1, Math.abs(state.scrollVelocity) * 0.8);
    const birth = intro > 0 && intro < 1 ? 1 - intro : 0;
    pass.trails.uniforms.damp.value = calm || state.snap ? 0 : Math.min(0.9, travel * 0.55 + rush * 0.35 + birth * 0.9);

    // Atmosphere follows the object on screen and takes the chapter's colour.
    const tint = pass.grade.uniforms.uTint.value as THREE.Vector3;
    const k = Math.min(Math.floor(s), 4), f = THREE.MathUtils.smootherstep(s - k, 0, 1);
    const ta = TINTS[k], tb = TINTS[k + 1];
    tint.set(ta[0] + (tb[0] - ta[0]) * f, ta[1] + (tb[1] - ta[1]) * f, ta[2] + (tb[2] - ta[2]) * f)
      .multiplyScalar(0.8 + u.uComplete.value * 0.6);
    const glow = pass.grade.uniforms.uGlow.value as THREE.Vector2;
    glow.set(0.5 + frame.current.x, 0.5 - frame.current.y);
    (pass.grade.uniforms.uShockPos.value as THREE.Vector2).copy(glow);
    pass.grade.uniforms.uShock.value = shock.current.age;
    (pass.grade.uniforms.uCursor.value as THREE.Vector2).set(mouse.current.x * 0.5 + 0.5, mouse.current.y * 0.5 + 0.5);
    pass.grade.uniforms.uCursorForce.value = calm ? 0 : mouse.current.force * 0.9;
    pass.grade.uniforms.uAspect.value = size.width / Math.max(1, size.height);

    const core = Math.exp(-Math.pow((s - 4) * 2.4, 2));
    pass.bloom.strength = 0.75 + core * 0.25 + flash.current * 1.1 + u.uComplete.value * 0.25;
    pass.bloom.radius = 0.7;
    pass.grade.uniforms.uTime.value = clock.current;
    pass.grade.uniforms.uFlash.value = flash.current * 0.22;
    pass.composer.render(dt);

    if (!ready.current) { ready.current = true; onReady(); }

    // Step quality down when frames stay slow; never step back up mid-visit.
    const g = governor.current;
    g.time += rawDelta; g.frames++;
    if (g.time > 2) {
      const average = g.time / g.frames;
      g.strikes = average > 1 / 38 ? g.strikes + 1 : 0;
      if (g.strikes >= 2 && quality !== "low" && !state.snap) { g.strikes = 0; onSlow(); }
      g.time = 0; g.frames = 0;
    }
  }, 1);

  return (
    <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
  );
}
