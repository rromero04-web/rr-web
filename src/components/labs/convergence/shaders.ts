import * as THREE from "three";

// One body of matter, six states. Every particle derives each state from its
// index and four random values, so the morph is computed entirely on the GPU.
//
// Stage 0  Prelude      a luminous ring
// Stage 1  Attention    a turbulent swarm that follows the pointer
// Stage 2  Form         exploded layout layers, dot grids and content blocks
// Stage 3  Behavior     data streams bundled through one node
// Stage 4  Convergence  a compressed core
// Stage 5  Product      a living sphere with three orbits

const noise = /* glsl */ `
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
vec3 flow(vec3 p) {
  return vec3(snoise(p), snoise(p + vec3(31.4, 0.0, 0.0)), snoise(p + vec3(0.0, 57.1, 13.7)));
}
float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
`;

export const particleVertex = /* glsl */ `
uniform float uTime;
uniform float uStage;
uniform float uCount;
uniform float uSize;
uniform float uPixelRatio;
uniform float uCalm;
uniform vec3 uMouse;
uniform float uMouseForce;
uniform float uPulseAge;
uniform float uRouteAge;
uniform float uRouteGroup;
uniform vec3 uRouted;
uniform float uComplete;
uniform float uMobile;
uniform float uIntro;
uniform float uFocus;
uniform float uAperture;

uniform vec3 uEmber;
uniform vec3 uLilac;
uniform vec3 uAqua;
uniform vec3 uBone;

attribute float aIndex;
attribute vec4 aRand;

varying vec3 vColor;
varying float vAlpha;
varying float vBlur;

#define PI 3.14159265359
#define TAU 6.28318530718

${noise}

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

vec3 groupColor(float g) {
  return g < 0.5 ? uEmber : g < 1.5 ? uLilac : uAqua;
}

vec3 sphereDir(vec4 r) {
  float z = r.x * 2.0 - 1.0;
  float a = r.y * TAU;
  float s = sqrt(1.0 - z * z);
  return vec3(cos(a) * s, sin(a) * s, z);
}

// --- 0 / Prelude: an eclipse ring and distant dust -------------------------
vec3 ringShape(vec4 r, float t, out vec3 col, out float alpha) {
  if (r.w > 0.86) {
    vec3 dir = sphereDir(r.yzxw);
    vec3 p = dir * (8.0 + r.z * 14.0);
    p = rotY(t * 0.006) * p;
    col = mix(uBone, uLilac, r.x) * 0.55;
    alpha = 0.32;
    return p;
  }
  float a = r.x * TAU + t * (0.05 + (1.0 - r.y) * 0.03);
  float band = pow(r.y, 2.4);
  float rad = 2.25 + band * 1.35 + snoise(vec3(r.x * 9.0, t * 0.1, 0.0)) * 0.06;
  vec3 p = vec3(cos(a) * rad, (r.z - 0.5) * 0.05 * (1.0 + band * 3.0), sin(a) * rad);
  p.y += snoise(vec3(cos(a) * 2.0, sin(a) * 2.0, t * 0.12)) * 0.05;
  p = rotZ(-0.16) * rotX(0.36) * p;
  float inner = 1.0 - smoothstep(0.0, 0.35, band);
  col = mix(uBone, uEmber, 0.25 + band * 0.55) * (0.65 + inner * 0.9);
  alpha = 0.82;
  return p;
}

// --- 1 / Attention: unstructured interest ---------------------------------
vec3 swarmShape(vec4 r, float t, out vec3 col, out float alpha) {
  vec3 dir = sphereDir(r);
  float rad = pow(r.z, 0.55) * 3.1;
  vec3 base = dir * rad * vec3(1.35, 0.9, 1.0);
  float speed = mix(0.12, 0.05, uCalm);
  vec3 p = base + flow(base * 0.3 + vec3(0.0, 0.0, t * speed)) * mix(1.5, 0.8, uCalm);
  p += flow(base * 0.9 + t * speed * 1.7) * 0.32;
  col = mix(uEmber, uBone, smoothstep(0.82, 1.0, r.w)) * (0.75 + r.w * 0.6);
  alpha = 0.7;
  return p;
}

// --- 2 / Form: exploded interface layers ----------------------------------
vec3 layerShape(float index, vec4 r, float t, out vec3 col, out float alpha) {
  float planes = 5.0;
  float per = floor(uCount / planes);
  float plane = min(floor(index / per), planes - 1.0);
  float k = index - plane * per;
  // Each layer is a different interface surface with its own proportions.
  vec2 dims = plane < 0.5 ? vec2(6.2, 4.0) : plane < 1.5 ? vec2(5.0, 3.4)
    : plane < 2.5 ? vec2(5.8, 2.2) : plane < 3.5 ? vec2(3.6, 3.6) : vec2(4.6, 1.4);
  vec2 shift = plane < 0.5 ? vec2(0.0) : plane < 1.5 ? vec2(-0.5, 0.25)
    : plane < 2.5 ? vec2(0.35, -0.4) : plane < 3.5 ? vec2(-0.9, 0.1) : vec2(0.6, 0.6);
  float cols = max(2.0, floor(sqrt(per * dims.x / dims.y)));
  float rows = max(2.0, floor(per / cols));
  float cx = mod(k, cols);
  float cy = floor(k / cols);
  vec2 uv = vec2(cx / (cols - 1.0), min(cy, rows - 1.0) / (rows - 1.0));
  // Leftover particles trace the layer outline.
  if (cy >= rows) {
    float e = r.x * 2.0 * (dims.x + dims.y);
    uv = e < dims.x ? vec2(e / dims.x, 0.0)
      : e < dims.x + dims.y ? vec2(1.0, (e - dims.x) / dims.y)
      : e < 2.0 * dims.x + dims.y ? vec2(1.0 - (e - dims.x - dims.y) / dims.x, 1.0)
      : vec2(0.0, 1.0 - (e - 2.0 * dims.x - dims.y) / dims.y);
  }
  float lift = (plane - 2.0) * 1.05 + sin(t * 0.45 + plane * 1.3) * 0.06 * (1.0 - uCalm);
  vec3 p = vec3((uv.x - 0.5) * dims.x + shift.x, lift, (uv.y - 0.5) * dims.y + shift.y);
  // Content blocks: some cells of a coarse grid are filled, the rest is the dot grid.
  vec2 cell = floor(uv * vec2(6.0, 4.0));
  float block = step(0.58, hash(cell.x * 7.0 + cell.y * 13.0 + plane * 29.0));
  vec2 inCell = fract(uv * vec2(6.0, 4.0));
  float margin = step(0.1, inCell.x) * step(inCell.x, 0.9) * step(0.12, inCell.y) * step(inCell.y, 0.88);
  float edge = (cy >= rows) ? 1.0 : 0.0;
  // A scan line sweeps each layer, as if the layout were being aligned.
  float scan = smoothstep(0.08, 0.0, abs(fract(t * 0.09 + plane * 0.17) * 1.4 - 0.2 - uv.x));
  col = mix(uLilac * 0.55, uBone, block * margin * 0.75 + edge * 0.6) * (0.55 + block * margin * 0.7 + edge * 0.6 + scan * 1.2);
  alpha = mix(0.45, 0.95, max(block * margin, edge));
  p += (r.xyz - 0.5) * 0.012;
  return p;
}

// --- 3 / Behavior: streams bundled through a node -------------------------
vec3 streamShape(vec4 r, float t, out vec3 col, out float alpha) {
  float lanes = 72.0;
  float lane = floor(r.x * lanes);
  float lh = hash(lane + 1.7);
  float speed = mix(0.035, 0.075, lh) * mix(1.0, 0.45, uCalm);
  float s = fract(r.y + t * speed);
  float span = mix(26.0, 15.0, uMobile);
  float x = (s - 0.5) * span;
  float waist = mix(0.12, 1.0, smoothstep(0.4, 6.5, abs(x)));
  float y = ((lane + 0.5) / lanes - 0.5) * 6.4 * waist;
  y += sin(x * 0.38 + lane * 0.9 + t * 0.55) * 0.42 * waist;
  float z = (hash(lane + 9.1) - 0.5) * 4.4 * waist + cos(x * 0.31 + lane) * 0.35 * waist;
  vec3 p = vec3(x, y, z) + (r.zwx - 0.5) * 0.035;
  // A signal travels left to right when the visitor sends one.
  float front = -span * 0.5 + uPulseAge * 9.5;
  float wave = exp(-pow((x - front) * 0.55, 2.0)) * step(uPulseAge, 4.0);
  p.y += wave * sin(lane * 2.1) * 0.35;
  float node = smoothstep(2.2, 0.0, abs(x));
  float fade = smoothstep(0.0, 0.08, s) * smoothstep(1.0, 0.92, s);
  col = mix(uAqua * 0.75, uBone, node * 0.55 + wave * 0.8) * (0.7 + node * 0.8 + wave * 2.4);
  alpha = 0.75 * fade;
  return p;
}

// --- 4 / Convergence: a compressed core -----------------------------------
vec3 coreShape(vec4 r, float t, float g, out vec3 col, out float alpha) {
  if (r.w > 0.72) {
    // A thin accretion disk: the opening ring, now spinning around the core.
    float a = r.x * TAU + t * (2.2 - r.y * 1.2);
    float rad = 0.75 + pow(r.y, 1.6) * 1.15;
    vec3 p = vec3(cos(a) * rad, (r.z - 0.5) * 0.025, sin(a) * rad);
    p = rotZ(-0.16) * rotX(0.36) * p;
    col = mix(uBone, groupColor(g), 0.6) * (0.9 - r.y * 0.5);
    alpha = 0.85;
    return p;
  }
  vec3 dir = sphereDir(r);
  float rad = 0.12 + pow(r.z, 2.0) * 0.6;
  vec3 p = rotY(t * (1.2 + (1.0 - r.z) * 2.5)) * (dir * rad);
  p *= 1.0 + sin(t * 3.2) * 0.04 * (1.0 - uCalm);
  float shell = smoothstep(0.25, 0.7, rad);
  col = mix(uBone, groupColor(g), 0.35 + shell * 0.5) * mix(0.32, 0.75, shell);
  alpha = mix(0.35, 0.8, shell);
  return p;
}

// --- 5 / Product: one living sphere, three orbits -------------------------
vec3 orbShape(float index, vec4 r, float t, float g, out vec3 col, out float alpha) {
  float R = 1.85;
  if (r.w > 0.82) {
    // Three orbits, one per discipline, around the same core.
    float tilt = g < 0.5 ? 0.0 : g < 1.5 ? 1.0 : 2.0;
    float a = r.x * TAU + t * (0.18 + tilt * 0.05) * (tilt == 1.0 ? -1.0 : 1.0);
    float rr = R * (1.42 + tilt * 0.14) + (r.z - 0.5) * 0.05;
    vec3 p = vec3(cos(a) * rr, (r.y - 0.5) * 0.03, sin(a) * rr);
    p = tilt < 0.5 ? rotX(1.2) * rotZ(0.3) * p : tilt < 1.5 ? rotX(-0.5) * rotZ(-0.9) * p : rotX(0.25) * rotZ(1.15) * p;
    float routed = g < 0.5 ? uRouted.x : g < 1.5 ? uRouted.y : uRouted.z;
    float flare = exp(-uRouteAge * 1.6) * step(abs(uRouteGroup - g), 0.1);
    // A comet runs on each orbit once the discipline has a routed signal.
    float comet = smoothstep(0.93, 1.0, fract(r.x - t * 0.06 * (1.0 + tilt * 0.3))) * min(routed, 1.0);
    col = groupColor(g) * (0.75 + routed * 0.35 + flare * 3.5 + comet * 3.0 + uComplete * 0.4);
    alpha = 0.8;
    return p;
  }
  float n = uCount;
  float y = 1.0 - (index + 0.5) / n * 2.0;
  float rad = sqrt(1.0 - y * y);
  float phi = index * 2.399963;
  vec3 dir = vec3(cos(phi) * rad, y, sin(phi) * rad);
  float calmT = t * mix(0.16, 0.07, uCalm);
  float d = snoise(dir * 1.25 + calmT) * mix(0.28, 0.12, uComplete);
  d += snoise(dir * 3.4 - calmT * 1.6) * 0.07;
  // Each routed signal sends a wave around the sphere.
  float wave = exp(-pow((dot(dir, normalize(vec3(sin(uRouteGroup * 2.1), 0.4, cos(uRouteGroup * 2.1)))) - (1.0 - uRouteAge * 0.9)) * 6.0, 2.0)) * exp(-uRouteAge * 0.8);
  vec3 p = dir * (R + d + wave * 0.35 + (r.z - 0.5) * 0.04);
  p = rotY(t * 0.08) * p;
  // Three disciplines flow over the same surface as regions, not as separate parts.
  float field = snoise(dir * 0.9 + vec3(0.0, t * 0.05, 0.0));
  float gg = field < -0.18 ? 0.0 : field < 0.2 ? 1.0 : 2.0;
  float routed = gg < 0.5 ? uRouted.x : gg < 1.5 ? uRouted.y : uRouted.z;
  float rim = smoothstep(0.3, -0.25, d);
  col = groupColor(gg) * (0.45 + routed * 0.32 + uComplete * 0.5 + wave * 2.0) + uBone * rim * 0.15;
  alpha = 0.62;
  return p;
}

vec3 shapeAt(float s, float index, vec4 r, float t, float g, out vec3 col, out float alpha) {
  if (s < 0.5) return ringShape(r, t, col, alpha);
  if (s < 1.5) return swarmShape(r, t, col, alpha);
  if (s < 2.5) return layerShape(index, r, t, col, alpha);
  if (s < 3.5) return streamShape(r, t, col, alpha);
  if (s < 4.5) return coreShape(r, t, g, col, alpha);
  return orbShape(index, r, t, g, col, alpha);
}

void main() {
  float t = uTime;
  vec4 r = aRand;
  float g = mod(aIndex, 3.0);

  float stage = clamp(uStage, 0.0, 5.0);
  float k = min(floor(stage), 4.0);
  float f = stage - k;
  // Staggered departures: the matter moves as a crowd, not as one block.
  float delay = r.z * 0.4;
  float e = smoothstep(delay, delay + 0.6, f);

  vec3 colA; float alphaA;
  vec3 colB; float alphaB;
  vec3 a = shapeAt(k, aIndex, r, t, g, colA, alphaA);
  vec3 b = shapeAt(k + 1.0, aIndex, r, t, g, colB, alphaB);

  // Compression pulls on a spiral; the release overshoots and settles.
  float ease = e;
  if (k > 3.5) ease = e + sin(e * PI) * 0.55 * (1.0 - uCalm * 0.6);
  vec3 p = mix(a, b, ease);
  float mid = sin(e * PI);
  if (k > 2.5 && k < 3.5) {
    float ang = mid * (2.6 + r.y * 2.0);
    p = rotY(ang) * p;
  }
  p += flow(p * 0.25 + t * 0.15 + r.x) * mid * mix(1.1, 0.45, uCalm);

  vec3 col = mix(colA, colB, e);
  float alpha = mix(alphaA, alphaB, e);

  // Convergence: colors of the three disciplines appear inside the same matter.
  float reveal = smoothstep(3.2, 4.0, stage) * (1.0 - smoothstep(4.6, 5.0, stage));
  col = mix(col, groupColor(g) * 1.1, reveal * 0.5);

  // A few particles drift close to the lens in every chapter: out-of-focus orbs
  // that give the scene depth. They gather into the core with everything else.
  float foreground = 0.0;
  if (fract(r.w * 17.31 + r.y * 3.7) < 0.011) {
    vec3 fg = vec3((r.x - 0.5) * 15.0, (r.y - 0.5) * 9.0, 3.0 + r.z * 5.0);
    fg += flow(fg * 0.15 + t * 0.04) * 0.8;
    float gather = exp(-pow((stage - 4.0) * 1.3, 2.0));
    p = mix(fg, p, gather);
    col = mix(mix(groupColor(g), uBone, 0.55) * 0.42, col, gather);
    alpha = mix(0.7, alpha, gather);
    foreground = 1.0 - gather;
  }

  // Intro: all of the matter is born from a single point and overshoots into place.
  float ie = clamp((uIntro - r.z * 0.22) / 0.78, 0.0, 1.0);
  float born = 1.0 - pow(1.0 - ie, 4.0);
  float burst = sin(ie * PI) * (1.0 - ie) * mix(2.6, 0.4, uCalm);
  p = rotY((1.0 - born) * (r.y - 0.5) * 5.0) * p * (born + burst);
  col *= 1.0 + (1.0 - born) * 3.0;

  // The pointer is attention: it gathers matter in the swarm and bends the rest.
  vec3 toMouse = uMouse - p;
  float dist = length(toMouse.xy);
  float attention = (1.0 - smoothstep(0.0, 1.0, abs(stage - 1.0))) * (1.0 - uCalm * 0.5);
  float radius = mix(1.6, 3.2, attention);
  // How much each state yields to the pointer: the core never does.
  float yielding = 0.5 + attention * 0.5;
  yielding *= 1.0 - exp(-pow((stage - 4.0) * 1.6, 2.0));
  yielding *= 1.0 - smoothstep(4.0, 5.0, stage) * 0.55;
  float influence = smoothstep(radius, 0.0, dist) * uMouseForce * yielding;
  vec2 swirl = vec2(-toMouse.y, toMouse.x);
  p.xy += (toMouse.xy * 0.55 * attention + swirl * 0.35 * attention - toMouse.xy * 0.22 * (1.0 - attention)) * influence;
  p.z += influence * (0.6 - attention * 1.2);
  col += uBone * influence * attention * 0.6;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  // Size uses its own seed: r.y also drives angles, and must not bias them.
  float size = uSize * (0.45 + pow(fract(r.w * 91.7 + r.x * 37.3 + r.z * 11.1), 3.0) * 1.3);
  size *= 1.0 - 0.45 * exp(-pow((stage - 4.0) * 2.5, 2.0));
  // Depth of field: matter outside the focal plane opens into soft bokeh.
  float blur = clamp(abs(-mv.z - uFocus) * uAperture, 0.0, 3.0);
  size *= (1.0 + blur * 2.3) * (1.0 + foreground * 2.2);
  gl_PointSize = clamp(size * uPixelRatio / -mv.z, 0.0, 110.0);
  vColor = col;
  vBlur = clamp(blur * 0.6, 0.0, 1.0);
  vAlpha = alpha * smoothstep(0.2, 2.0, -mv.z) / (1.0 + blur * blur * 2.6);
}
`;

export const particleFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
varying float vBlur;
uniform float uOpacity;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float soft = pow(smoothstep(0.5, 0.0, d), 1.7);
  // Out of focus: a flat disc with a brighter rim, like a lens bokeh.
  float disc = smoothstep(0.5, 0.43, d) * (0.5 + 0.5 * smoothstep(0.2, 0.47, d));
  float a = mix(soft, disc * 0.55, vBlur) * vAlpha * uOpacity;
  gl_FragColor = vec4(vColor * a, a);
}
`;

// Final grade: atmosphere tinted by chapter, a lens around the pointer, the
// convergence shockwave, chromatic offset, vignette and film grain.
export const gradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAberration: { value: 0.0007 },
    uFlash: { value: 0 },
    uAspect: { value: 1 },
    uTint: { value: new THREE.Vector3() },
    uGlow: { value: new THREE.Vector2(0.5, 0.5) },
    uCursor: { value: new THREE.Vector2(0.5, 0.5) },
    uCursorForce: { value: 0 },
    uShock: { value: 10 },
    uShockPos: { value: new THREE.Vector2(0.5, 0.5) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAberration;
    uniform float uFlash;
    uniform float uAspect;
    uniform vec3 uTint;
    uniform vec2 uGlow;
    uniform vec2 uCursor;
    uniform float uCursorForce;
    uniform float uShock;
    uniform vec2 uShockPos;
    varying vec2 vUv;
    float rand(vec2 co) { return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
    float vnoise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(rand(i), rand(i + vec2(1.0, 0.0)), f.x), mix(rand(i + vec2(0.0, 1.0)), rand(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    void main() {
      vec2 asp = vec2(uAspect, 1.0);
      vec2 uv = vUv;

      // A soft magnifier follows the pointer.
      vec2 dc = (uv - uCursor) * asp;
      float lens = smoothstep(0.2, 0.0, length(dc)) * uCursorForce;
      uv = uCursor + (uv - uCursor) * (1.0 - lens * 0.12);

      // Shockwave: a ring of refraction expanding from the object.
      vec2 ds = (uv - uShockPos) * asp;
      float ls = length(ds);
      float life = smoothstep(1.6, 0.0, uShock) * step(0.0, uShock);
      float ring = exp(-pow((ls - uShock * 0.95) * 11.0, 2.0)) * life;
      uv -= ds / (ls + 1e-4) / asp * ring * 0.045;

      vec2 c = uv - 0.5;
      float edge = dot(c, c);
      vec2 off = c * edge * uAberration * 40.0 + ds / (ls + 1e-4) / asp * ring * 0.012;
      vec3 col;
      col.r = texture2D(tDiffuse, uv + off).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - off).b;

      // Atmosphere: a coloured haze around the matter, drifting slowly.
      float haze = smoothstep(1.15, 0.0, length((vUv - uGlow) * asp));
      float cloud = vnoise(vUv * asp * 2.2 + uTime * 0.02) * 0.6 + vnoise(vUv * asp * 5.0 - uTime * 0.03) * 0.4;
      col += uTint * haze * haze * (0.05 + cloud * 0.07);
      col += uTint * ring * 0.18;

      col *= 1.0 - smoothstep(0.18, 0.75, edge) * 0.55;
      col += uFlash * vec3(1.0, 0.96, 0.9) * (1.0 - edge * 1.4);
      col += (rand(vUv * 731.0 + fract(uTime) * 91.0) - 0.5) * 0.035;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};
