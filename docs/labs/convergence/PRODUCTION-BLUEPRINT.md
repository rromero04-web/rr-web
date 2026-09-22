> Historical planning document. The implemented art direction and current validation are recorded in [ART-DIRECTION-REVIEW.md](./ART-DIRECTION-REVIEW.md). That review supersedes the simulation, camera, material, particle and composition proposals below.

# CONVERGENCE — LAB 001

Production blueprint · 22 September 2026 · planning only

**Build a spatial instrument that turns incoming signals into an actionable decision.** The same information must remain recognizable as it moves from attention, through form and behavior, into the finished product. The transformation, its lighting and its timing carry the piece. Effects accent a single impact.

This document records an inspected repository and specifies the subsequent implementation. No experience routes, dependencies or application behavior were added during this phase. Numeric art-direction values below are deliberate starting values, not measurements of a finished scene. Implementation must pass the image and interaction gates below before increasing detail.

## 1. Repository evidence and baseline

Inspected checkout: `E:\Proyectos\raulromero.es`, baseline commit `d4abfbe` (`Mejorar interfaz glassmorphism y corregir accesibilidad y metadatos`). Working tree was clean at the start.

| Concern | Actual finding | Consequence |
| --- | --- | --- |
| Framework | Next.js **16.3.0**, App Router, TypeScript strict, alias `@/* → src/*` | Follow this installation's documentation, not older Next conventions. |
| React | `react` / `react-dom` **19.2.8** | Fiber must support React 19.2; do not use Fiber 8. |
| Runtime/package manager | Node **24.19.0**, npm **11.17.0** locally; `package-lock.json`; README says Node 20+ | Use npm and retain the parent lockfile. Local runtime is evidence, not proof of the production runtime. |
| Build | `next dev`, `next build`, Turbopack; minimal `next.config.ts` | No custom GLSL loaders, webpack plugins or parent framework upgrade. |
| Routing | No `src/app/layout.tsx`. Spanish root is `src/app/(es)/layout.tsx`; English root is `src/app/en/layout.tsx`. Both contain `html`, `body`, fonts and `SiteChrome`. | A dedicated third root is possible without moving the existing site. Different roots intentionally cause a document navigation. |
| Chrome | `SiteChrome.tsx` wraps ordinary routes in `MotionConfig`, `.studio-site`, fixed `Nav`, `main#main-content`, `Footer`. Only `/demo/*` and `/en/demo/*` bypass it. | Merely adding Convergence under `(es)` would inherit the entire portfolio presentation. |
| CSS | Tailwind **4.3.3** via PostCSS; `globals.css` imports `studio.css`, then `glass.css`; latest glass overrides materially change the earlier studio rules | Read computed appearance, not just root tokens. Use dedicated CSS Modules for the experience. |
| Fonts | `Geist` and `Geist_Mono` from `next/font/google`, Latin subset, CSS variables | Reuse these families, no third font or external font CDN at runtime. Build currently obtains these successfully. |
| Brand | Navy `#081b2e`, cobalt `#2855ff`, cream `#f8f6f1`; actual studio background includes `#f0f3f8`, soft violet/blue fields; effective studio slate `#506079` | Hub keeps the present brand. Experimental darkness is confined to the piece. |
| Motion | `motion@13.0.0`; MotionConfig reduced-motion support; existing CSS/WAAPI reveals, cursor tilt and magnetic buttons | Do not add a second site-wide motion provider. Existing effects are not a 3D narrative framework. |
| Backend | Supabase, Resend, Zod, server actions for contact/configurator | Labs needs none of these; do not attach a database, analytics account or paid service. |
| Hosting | README describes Vercel; no checked-in deployment configuration establishes the actual host; `.vercel` is ignored | Vercel-compatible design, but deployment account, plan, headers and quotas remain unverified. No static-export conversion: parent has server actions. |
| Assets | RR marks in `public/brand/`, portrait and three project JPEGs; no existing 3D assets | Procedural scene; reuse the inverse RR mark only for brand identification. |
| Responsive | Desktop navigation at 1100px+; main stacked layout at 900px and below; refinements at 600/480/359px; 1240px content container, 24/40px padding | Keep the hub's established breakpoints; independently compose the experience. |
| Locale/SEO | `localizePath()` assumes `/en` equivalents except the configurator alias; sitemap automatically mirrors its normal path list | Adding `/labs` blindly would invent `/en/labs`. Specify singleton routing explicitly. |

### Executed checks

- Started `npm run dev -- --hostname 127.0.0.1`; site served at `http://127.0.0.1:3000`.
- Visually inspected the home hero at **1440 × 900**, the dark process section reached through its navigation link, the home at **390 × 844**, and the mobile menu open/closed.
- Desktop: large tightly tracked navy headline; cobalt accent; generous left copy/right interactive showcase; floating frosted navigation; restrained grid and tinted background. Process is already a dark counterpoint with five translucent steps. The route back to `/#proceso` is real and works.
- Mobile: hero becomes a single column; readable large headline; two compact CTA buttons; showcase below; menu becomes a large frosted panel with numbered links. Preserve this on the existing site.
- No warnings/errors returned by the browser's captured console query during this inspection. This is not a comprehensive runtime audit.
- `npm run lint`: **pass**. `npm run build`: **pass**, including TypeScript and prerendering 22 pages. No new libraries were installed.
- Registry inspection initially hit the user-level npm-cache permission boundary; repeating with `--cache .npm-cache` succeeded without elevation or package changes.
- Screenshots: [desktop](evidence/home-desktop-1440.png), [mobile](evidence/home-mobile-390.png). These are reference images of the existing website, not proposed Convergence renders.

No physical iOS/Android device, WebGL scene, audio graph, new dependency bundle or production hosting configuration has been tested in this planning phase.

### Next documentation read locally

Under `node_modules/next/dist/docs/01-app/`: `02-guides/lazy-loading.md`, `03-api-reference/03-file-conventions/route-groups.md`, `01-getting-started/11-css.md`, and `01-getting-started/05-server-and-client-components.md`.

Relevant constraints: `ssr: false` belongs in a Client Component; dynamically importing a Client Component from a Server Component is not a sufficient code-splitting strategy here; separate root layouts trigger full navigation; global styles can persist across client navigations. The integration below deliberately uses these facts.

## 2. Integration decision

### Routes and ownership

| URL | Source | Presentation |
| --- | --- | --- |
| `/labs` | `src/app/(es)/labs/page.tsx` | Server-rendered Spanish editorial hub inside the existing site chrome. |
| `/labs/convergence` | `src/app/(experiments)/labs/convergence/page.tsx` | English artwork inside a separate experiment root. |

Create `src/app/(experiments)/layout.tsx` with `html lang="en"`, the same Geist families and a dedicated minimal `experiments.css`. Do **not** import `globals.css`, `studio.css`, `glass.css`, `SiteChrome`, Motion, or the existing `Monogram` client component here. There is no path collision: `(es)/labs` owns only its index, `(experiments)/labs/convergence` owns its child URL. Do not create a second page for either URL.

Use an ordinary `<a>` to enter/leave Convergence. A full document navigation between these roots is intentional: it isolates style sheets, global grain, scroll rules, motion providers, audio and GPU lifetime. No need to modify `SiteChrome` or reorganize the existing roots. The small duplicate font declarations are preferable to unrelated layout refactoring.

The experience root must explicitly provide background, margin reset, box-sizing, inherited font, button reset, selection, focus ring, link styling, reduced-motion overrides and safe-area handling. Use CSS Modules for its visual components; it does not need Tailwind. Set `color-scheme: dark`, `scroll-behavior: auto`, `scroll-padding-top: 0`. No body grain overlay. Use `overflow-x: clip` only on the stage clipping layer, not an overflow ancestor that breaks sticky positioning.

### Hub specification

Use the current content container and its vertical spacing (top 160px desktop / 126px mobile). Keep the current navigation, footer, rounded controls and cobalt CTA. Heading `LABS`; eyebrow `EXPERIMENTOS / RAÚL ROMERO`; intro: `Un espacio para explorar qué ocurre cuando estrategia, diseño y tecnología trabajan como un mismo sistema.`

One editorial feature row, not an empty grid of future projects: dark 16:10 poster on the left (58% of available width), title/description on the right. Desktop gap 48px; mobile stack with 24px gap. Row copy:

- `001 / INTERACCIÓN EN TIEMPO REAL`
- `CONVERGENCE`
- `Tres disciplinas. Un sistema. Una exploración interactiva sobre atención, forma y comportamiento.`
- CTA `Explorar experimento ↗`; secondary note `Experiencia en inglés · Sonido opcional`.

Use a still exported from the final Product scene, without fabricated UI or an external generated illustration. During implementation, an honest text/line placeholder is sufficient until this render exists. No canvas/video preview on `/labs` and no 3D prefetch.

Discovery: add a small `Labs` link in the existing footer's link area, on both locales, always pointing to `/labs`. Keep desktop navigation widths and order intact. This adds discovery without changing the home composition.

### Language and metadata

Scope includes exactly the requested two URLs. `/labs` is Spanish; Convergence preserves the supplied English copy. Do not generate `/en/labs` or `/en/labs/convergence`.

On `/labs`, change only `LanguageSwitcher`'s route handling: ES remains `/labs`; EN links to `/en` with accessible label `English homepage`. It does not promise a translated hub. Do not change general locale-prefix behavior used by existing pages. The experience has no locale switch.

Set explicit canonical and OG URLs per page; override inherited `alternates.languages` so the hub does not advertise the homepage or invented translations. The experiment root has English metadata, independent of the Spanish root. Add the two URLs as **singleton entries**, not to `INDEXABLE_PATHS` in `sitemap.ts`; no false hreflang. Keep current robots behavior. Add a dedicated 1200 × 630 OG still to `/public/labs/convergence/` during the final pass. All core concept copy exists in server HTML even without the canvas.

Experience navigation always includes `← Back to Labs` → `/labs`. Final `See how I work →` → `/#proceso`, using the existing Spanish destination. Keep it as supplied; add `lang="es"` only to any Spanish destination description, not to the English link.

## 3. Creative contract: one instrument, not six demos

The recurring motif is a **precision-cut rectangular aperture**, with one clipped corner echoing the diagonal of the RR mark. Its contents become a compact signal-routing product. No sphere, globe, smartphone shell, browser window or dashboard grid is the hero.

Three physical vocabularies:

1. **Attention / Marketing:** short off-white rectangular signal marks in a bounded, shallow information volume. Uneven concentrations, direction changes and gaps create noise; a rectangular collector draws them into lanes. A thin warm edge identifies arrival.
2. **Form / Design:** 24 graphite ribs in a 6 × 4 relation, three thin planes and a broken frame. Alignment, spacing and negative space make the same signals legible. A faint violet specular edge appears only at grazing angles.
3. **Behavior / Development:** six mechanical gates on a planar dependency graph. A visible input changes state, propagates across a chosen path, and opens an output. Cool highlights exist at active contacts, not as an all-over glow.

At convergence, these become three compact carriers: the collector jaw, the rib cassette and the gate rail. They move around a common void, acquire momentum, touch and lock into an open-sided rectangular chassis. Their internal details persist. After contact, seams align into the finished product.

### Final product: Signal Composer

A single spatial editorial tool that receives six named signals, organizes them into a ranked queue, and resolves a selected signal into an action. It is not a production SaaS product and displays no fabricated business KPIs. Product label: `SIGNAL COMPOSER / LIVE SYSTEM`.

Dimensions in world units: chassis **4.8w × 2.9h × 0.42d**. Front plane `z=0.22`; collector left `x=-2.1`; queue center `x=-0.1`; output right `x=1.65`. Three visible layers at z `-0.18`, `0`, `0.22`, with actual thickness and a 0.04 bevel. Silhouette remains visibly rectangular, with open channels between modules. One clipped upper-right corner, radius no larger than 0.05u. Six queue strips are geometry with independent transforms, not a canvas screenshot.

Seed records (all fictitious editorial prompts): `01 Clarify the offer`, `02 Reveal the next step`, `03 Reduce friction`, `04 Make the structure visible`, `05 Respond to intent`, `06 Connect the system`. Deterministic priority ranks `[3,1,5,2,4,6]`; arrival order `[1,2,3,4,5,6]`.

Visible, bounded product state:

- `ARRIVAL` / `PRIORITY` two-state control reorders six strips over 380ms, retaining IDs.
- Selecting a strip marks its input, opens its small gate and highlights the relevant connection.
- `Route signal` changes `selected → routed`, moves its marker into the output slot and increments a real local routed count. It cannot be invoked without a selection and never increments twice for the same signal.
- `Reset` restores all six signals, arrival order, no selection, count zero.
- Output labels: `SELECT A SIGNAL`, `READY TO ROUTE`, `SIGNAL ROUTED`.

These controls have HTML equivalents and share one reducer. The physical object visibly responds to each action. Incoming particles terminate at the collector; arranged strips demonstrate Form; gate states demonstrate Behavior. Preserve this causality even on low quality. At final rest, a sparse trickle suggests continuing input, without constantly reordering the queue.

Render strip labels as six small HTML overlays projected from their mesh anchors, with a stable 12–14px CSS font size; hide an overlay when its anchor is occluded. These labels are decorative duplicates of the accessible HTML list. They do not receive pointer events. The chassis, slots, strips, gates and connections remain real geometry; no UI screenshot texture or remote SDF font is required. On mobile the HTML list supplies readable names while the geometry uses short IDs.

### Composition and typography

Use Geist Sans for all narrative; Geist Mono only for indices/status. Main title desktop `clamp(64px, 7.2vw, 112px)`, weight 550–600, tracking `-0.055em`, line height 0.94. Mobile title `clamp(34px, 9.5vw, 44px)` on one line; never break CONVERGENCE arbitrarily. Chapter labels 12/13px, tracking 0.16em; concept sentences 28–40px desktop, 25–30px mobile; body 16px/1.55; UI/status no smaller than 12px.

Desktop safe margins 48px, 72px above stage content, 64px below. Narrative occupies left 34%, object occupies right 56%, with 10% breathing room. Convergence alone uses a centered 68% object field with minimal copy. Mobile reserves top 28% for copy, central 54% for the object, bottom 18% for controls/hints. Account for safe-area insets; never place essential text inside WebGL.

Screen space is a hard acceptance criterion: at 1440 × 900 and 390 × 844 no important silhouette, chapter sentence or control overlaps another. At 320px the title can shrink to 30px; body remains 16px. At short landscape heights use the static reading presentation rather than trapping text in a shallow viewport.

## 4. Color, material and light system

| Token | Value | Use |
| --- | --- | --- |
| Void | `#090b0e` | Background, slightly cooler than neutral black |
| Graphite | `#20242a` | Main coated structure |
| Edge | `#50565e` | Machined exposed edge, not body fill |
| White | `#f2f0e9` | HTML and resolved light |
| Secondary | `#a7adb4` | Secondary labels on void |
| Warm trace | `#d5b48c` | Attention, isolated edge and marks |
| Optical trace | `#aaa0c6` | Form grazing highlight |
| Cool trace | `#91aebc` | Behavior contacts |
| Brand focus | `#4e6fff` | Focus outline/navigation accent only |

All colors authored as sRGB; renderer uses its linear workflow and one final output conversion. Start with ACES filmic tone mapping and exposure 1.0. Test swatches both with and without composer to detect double tone mapping. Saturated colored pixels should occupy under 8% of a representative frame; illumination resolves toward neutral at contact.

| Material | Implementation/start settings | Purpose |
| --- | --- | --- |
| Coated graphite | MeshStandardMaterial, metalness .45, roughness .5, graphite base | Readable core with broad specular response |
| Machined edge | Standard, metalness .8, roughness .28, narrow bevel geometry | One bright edge, not a chrome body |
| Polymer gate | Standard, metalness .05, roughness .7 | Distinguish moving control from carrier |
| Ceramic signal | Standard, metalness 0, roughness .36, warm white | Clearly visible active information |
| Indicator insert | Standard, dark base, emissive intensity .7 idle / 2.0 active | Selective bloom eligibility, small visible area |
| Etched plane | Opaque Standard surface with procedural line mask | Structure without transparency-sorting problems |

No transmission/refraction material in the initial production design. No clearcoat until a close-up proves it helps. At most one shallow translucent witness plane in High, and only if opaque edges fail to show depth; it must not contain controls or become a glass card.

### Virtual photography rig

Fixed world rig, art-directed through intensities rather than orbiting lights. RectAreaLight key at `(-3.5,5,4)`, size 4 × 2; neutral fill at `(4,1.5,3)`, size 3 × 3; narrow rim strip at `(1,2,-3)`, size .3 × 4. Initialize Three's area-light uniforms once. Generate a studio reflection environment procedurally from large white/gray panels and PMREM once at load, never per frame; no HDRI download or Drei preset CDN. Reflection-only panels are not visible to the main camera.

Start key/fill/rim intensities in relative ratios **1/.22/.65**. Calibrate the actual Three intensity values against a gray reference patch before materials are tuned; save the calibrated constants. Environment contribution .25, no ambient white wash. Area lights do not cast the needed shadows: use one matching directional shadow light for High/Medium if necessary, limited to the chassis/gates, or contact geometry in Low. Avoid two inconsistent highlight directions.

| Phase | Rig ratios key/fill/rim | Readability instruction |
| --- | --- | --- |
| Prelude | .3/.08/.4 | Three separate edge silhouettes at depth; title remains dominant |
| Attention | .65/.18/.3 | Flat marks and collector stay within a bounded slab; no star points |
| Form | 1/.25/.65 | Raking key reveals rib spacing and soft contact shadows |
| Behavior | .8/.3/.5 | Slightly lift fill to expose connection logic, active contacts use cool trace |
| Convergence | 1/.18/.85 | Narrow rim separates three carriers; light neutralizes as they contact |
| Product | .9/.35/.55 | Broad, resolved product lighting; all six strips distinguishable |

Blend lighting with phase intervals from the same timeline, never with independent timers. Normal exposure changes stay within .9–1.08. Impact transient adds at most .08 exposure for 100ms; never whiten the whole viewport.

## 5. Narrative and camera specification

One perspective camera, world Y up, looking approximately toward -Z. No OrbitControls, mouse parallax on the camera, continuous orbit, random shake or camera-mounted lighting. Values are world units, FOV is vertical degrees. Local subject transforms establish composition; CameraDirector has sole camera ownership.

`S(t)=6t^5−15t^4+10t^3` is the default movement curve. Interpolate position/target with S; derive a look-at quaternion and slerp between authored orientations where needed. No uncontrolled Catmull-Rom overshoot. Holds are numerically constant, not merely slow damping.

| Progress | Shot / position → target / FOV | Action and composition |
| --- | --- | --- |
| .00–.055 | P0 `(0,.35,10)` → `(.35,0,0)` / 35°; hold | Title at left; three low-contrast systems at z -1.4, 0, 1.2 on right. No movement required to see the premise. |
| .055–.12 | P0 → P1 `(1.8,.8,5.6)` → `(.8,.1,0)` / 32° | Move into the bounded signal volume, title withdraws before crossing the hero. |
| .12–.235 | P1; hold | Noise begins to resolve into directional lanes. ATTENTION sentence visible .12–.225. |
| .235–.32 | P1 → P2 `(3.3,2.1,5)` → `(.55,0,0)` / 30° | Reveal the edge of a rib and its relation to a plane; signals become positions. |
| .32–.415 | P2; hold | FORM sentence visible .315–.425. Grid settles in groups, with unequal emphasis and deliberate gaps. |
| .415–.495 | P2 → P3 `(1.1,1.25,6)` → `(.4,0,0)` / 31° | Camera clears the near plane; gates and dependencies become legible. |
| .495–.60 | P3; hold | BEHAVIOR sentence visible .49–.605. A demo pulse precedes visitor-triggered propagation. |
| .60–.685 | P3 → P4 `(0,1,11.4)` → `(0,0,0)` / 36° | Only wide reveal: three carriers separate around an empty center. Copy reduced to chapter label. |
| .685–.78 | P4; hold | Carriers rotate inward then collide. Camera remains still except the short impact offset. |
| .78–.87 | P4 → P5 `(3.6,2.2,7.4)` → `(.7,0,0)` / 32° | Match seams into a chassis, then move closer to reveal usable controls. |
| .87–1 | P5; hold | Product interaction and final statement. Product sits right; typography left. No idle camera drift. |

Framing constraints override raw coordinates if aspect changes: retain these angles and subject size targets, then solve distance from the subject bounding box. Desktop object fits its allotted right-side rectangle, not the full viewport; use a horizontal film/view offset or a consistent camera/target translation to place it. Do not merely aim at the object's center and assume it lands on the right. Fit must use both horizontal and vertical FOV. Use near .1 / far 50 and avoid geometry closer than .2u to camera.

### Phase contents and transitions

| Interval | Scene contract | HTML copy / timing |
| --- | --- | --- |
| .00–.08 PRELUDE | Full composition immediately readable; 3 low-lit components already exist | `RAÚL ROMERO / LAB 001`, `CONVERGENCE`, `Three disciplines. One system.`, `Scroll to converge` |
| .08–.28 ATTENTION | Rectangular 7 × 3 × 1.2u field. Coherence rises from .05 to .8; collector migrates to the right. Field has a visual boundary and directional marks | `ATTENTION` / `Attention without direction is noise.` |
| .28–.46 FORM | Signal IDs move to 6 × 4 relationships; 24 ribs and three unequal planes emerge. Primary cluster carries 50%, secondary 30%, tertiary 20% of marks | `FORM` / `Structure turns attention into meaning.` |
| .46–.64 BEHAVIOR | Six gates become distinct, connections appear by dependency, one pulse demonstrates input→decision→output | `BEHAVIOR` / `Ideas become real when they can respond.` |
| .64–.82 CONVERGENCE | Three physical carriers orbit through less than 40°, accelerate toward center, contact, settle, assemble | `CONVERGENCE` only, then quiet around contact |
| .82–1 PRODUCT | .82–.88 final alignment; controls enabled from .88; at .9 final copy reaches full opacity; .94–1 holds indefinitely | `THE INTERESTING PART` / `HAPPENS BETWEEN DISCIPLINES.` plus supporting copy and links |

Final supporting copy verbatim: `Marketing brings attention.` / `Design gives it form.` / `Development makes it real.` Then `CONVERGENCE` and `Strategy × Design × Technology`.

Each chapter's copy fades over .012 progress in/out, translates at most 8px, never character-splits or scrambles. No copy during .70–.775 beyond the persistent quiet chapter indicator. At most one concept sentence at full opacity; outgoing and incoming paragraphs do not overlap. Natural reading mode retains all copy in document order.

## 6. Dependencies: selected, checked, deliberately limited

Registry metadata was read on 2026-09-22. These are proposed exact pins; they are **not installed or runtime-validated** by this phase.

| Package | Version | Decision |
| --- | --- | --- |
| `three` | **0.186.0** | Add: geometry, materials, renderer and its postprocessing addons. |
| `@react-three/fiber` | **9.7.0** | Add: scene lifecycle and one render loop. Peer React `>=19 <19.3`, Three `>=0.156`; current parent versions fit. |
| `@dimforge/rapier3d-compat` | **0.20.0** | Add: direct physics world, deterministic stepping and snapshots; lazy-loaded. |
| `@types/three` | **0.186.0** | Add as dev dependency to match Three. |
| `@react-three/rapier` | 2.2.0 checked | Compatible with React 19/Fiber 9, but omit: the small narrative simulation requires explicit cache/seek ownership; a second automatic world stepper adds little. |
| `@react-three/drei` | 10.7.8 checked | Omit initially. Geometry, camera and environment need only a few Three helpers. No remote font/HDR defaults. |
| `@react-three/postprocessing` | 3.1.1 checked | Omit. Use Three's bundled composer/addons and one custom pass. |
| `postprocessing` | 6.39.5 checked | Omit; its Three peer `<0.187` would accept this pin, but it is unnecessary here. |
| GSAP / ScrollTrigger | Not needed | Native scroll + deterministic sampler already cover timing. Do not add GSAP merely for numeric interpolation. |
| Zustand | Not needed | Tiny external store + refs, scoped to one experience instance. |
| Tone.js | Not needed | Native Web Audio graph with generated sounds. |

Future install command: `npm install --save-exact three@0.186.0 @react-three/fiber@9.7.0 @dimforge/rapier3d-compat@0.20.0 --cache .npm-cache`, then `npm install --save-dev --save-exact @types/three@0.186.0 --cache .npm-cache`. First implementation pass must resolve peers, compile a minimal client canvas, verify WASM initialization under Turbopack and build for production. Do not use `--force` or `--legacy-peer-deps` to mask conflicts.

Fiber's React-major pairing is documented in its [installation guide](https://r3f.docs.pmnd.rs/getting-started/installation). The checked wrapper alternative documents React 19/Fiber 9 support and manual stepping in [react-three-rapier](https://pmndrs.github.io/react-three-rapier/). Registry peer ranges above were obtained using `npm view`, not inferred from the guide.

## 7. Exact file/module map

Paths are relative to repository root. No barrel file may re-export the experience into parent-site imports.

```text
src/app/(es)/labs/page.tsx                  Server hub, own metadata
src/app/(experiments)/layout.tsx           Isolated root, fonts, English metadata
src/app/(experiments)/experiments.css      Minimal reset and experiment-only globals
src/app/(experiments)/labs/convergence/page.tsx
                                           Server copy, poster, client boundary
src/components/labs/LabsIndex.tsx           Server editorial feature
src/components/labs/labs-index.module.css   Hub feature layout, existing brand
src/components/labs/convergence/
  ConvergenceShell.tsx                     Client lifecycle, small UI store/provider
  ConvergenceLoader.tsx                    Capability check and dynamic ssr:false boundary
  ConvergenceCanvas.tsx                    Canvas setup, context loss/error handling
  ConvergenceScene.tsx                     Scene assembly, no narrative logic
  convergence.module.css                  Stage, copy, controls, mobile/reading layouts
  html/Narrative.tsx                       Server-compatible semantic chapter content
  html/ExperienceToolbar.tsx               Back, sound, pause, quality, reading mode
  html/ChapterNav.tsx                      Accessible chapter links and current marker
  html/ProductControls.tsx                 Shared reducer controls and status
  html/StaticExperience.tsx                Six stills + same narrative + working HTML product
  runtime/types.ts                         Pure shared contracts
  runtime/config.ts                        Counts, palette, seed, camera/light/material constants
  runtime/store.ts                         Discrete useSyncExternalStore, per instance
  runtime/timeline.ts                      sampleNarrative(p), phase/local progress, weights
  runtime/useScrollProgress.ts             Native scroll/resize, one authoritative p
  runtime/FrameDirector.tsx                Ordered useFrame work, impact envelope, invalidation
  runtime/CameraDirector.ts                Sole camera writer, shot sampling and framing
  runtime/LightDirector.ts                 Rig sampling, exposure and practical intensity
  runtime/InteractionDirector.ts           Ray-plane/mesh hits, gesture arbitration
  runtime/ImpactDirector.ts                Collision crossing → transient event, deduplication
  runtime/QualityController.ts             Capability tiers, hysteresis and manual setting
  scene/StudioRig.tsx                      Area lights, one-time procedural PMREM
  scene/AttentionField.tsx                 One signal geometry/material/draw call
  scene/FormAssembly.tsx                   24 instanced ribs and three planes
  scene/BehaviorNetwork.tsx                Gates, dependency edges, pulse pool
  scene/HeroCarriers.tsx                   Three persistent carrier groups, stable IDs
  scene/ConvergenceAssembly.tsx            Physics-owned poses → assembly-owned final poses
  scene/SignalProduct.tsx                  Chassis + six strips + gate output
  scene/geometry.ts                        Procedural bevels, shared geometry creation
  scene/materials.ts                       Shared standard materials and disposal
  shaders/attention.ts                     Vertex/fragment GLSL strings
  shaders/etch.ts                          Surface line mask patch
  shaders/pulse.ts                         Edge pulse shader
  shaders/impact.ts                        Distortion/composite shader
  physics/PhysicsDirector.ts               Pose ownership, worker/cache, live fragments
  physics/narrative.worker.ts              Rapier init, fixed-step hero simulation/cache
  physics/simulate.ts                      Pure world construction, forces, contact recording
  physics/protocol.ts                      Typed worker requests/results/version IDs
  physics/interactionWorld.ts              Small live fragment world, no hero transforms
  audio/AudioEngine.ts                     Lazy AudioContext, nodes, generated buffers
  audio/AudioDirector.ts                   Phase mixes and semantic event mapping
  product/model.ts                         Six seed records and pure reducer
  post/Effects.tsx                         Single composer owner, tiers, transient pass
  dev/DebugPanel.tsx                       Development-only progress/quality/FX controls
public/labs/convergence/
  poster.webp                             Actual final-scene export
  prelude.webp attention.webp form.webp behavior.webp convergence.webp product.webp
  opengraph.png                            Actual render + editorial title, 1200 × 630
tests/convergence/
  timeline.test.ts                         Boundaries/holds/seek sampling
  physics.test.ts                          Handoff/contact/replay invariants
  product.test.ts                          Route/order/reset invariants
```

Existing files to edit later: `Footer.tsx` (Labs discovery), `LanguageSwitcher.tsx` (hub fallback), `sitemap.ts` (singletons), `package.json`, `package-lock.json`. No homepage section, existing demo, contact action, primary navigation, parent layout or global CSS changes are planned.

`Narrative` is passed as server-rendered children to the small shell. `ConvergenceLoader` declares `dynamic(() => import('./ConvergenceCanvas'), {ssr:false})` **inside a client file**. Do not import Three types as runtime values into shell/store/timeline. Keep the HTML product model dependency-free. Load audio only on explicit sound enable; load physics/scene only in full-motion mode after capability selection. No WASM, GL code or audio constructors during SSR.

## 8. State and transform ownership

Create a store per mounted experience, not a module singleton. React subscribes to discrete changes only. Mutable hot values stay in the runtime instance and never cause React rendering every frame.

```ts
type Phase = 'prelude'|'attention'|'form'|'behavior'|'convergence'|'product';
type Quality = 'high'|'medium'|'low'|'static';
type UiState = {
  phase: Phase;
  mode: 'cinematic'|'reading';
  load: 'poster'|'loading'|'ready'|'failed';
  quality: Quality;
  qualityPreference: 'auto'|Quality;
  reducedMotion: boolean;
  motionPaused: boolean;
  soundRequested: boolean;
  audioStatus: 'off'|'running'|'suspended'|'unavailable';
  product: { order:'arrival'|'priority'; selectedId:number|null; routedIds:number[] };
};
type Runtime = {
  p: number; previousP: number; direction: -1|0|1;
  localP: number; viewport: {width:number;height:number};
  pointer: {x:number;y:number;active:boolean;down:boolean;kind:'mouse'|'touch'|'pen'};
  impact: {id:number;startedAt:number|null;armed:boolean};
  narrativeCacheVersion: number; visibility: 'visible'|'hidden';
};
```

Actions: `setMode`, `setQualityPreference`, `setMotionPaused`, `requestSound`, `setAudioStatus`, `selectSignal`, `setOrder`, `routeSelectedSignal`, `resetProduct`, `goToChapter`. Session storage may retain quality and reading mode; sound always requires a current-session gesture and is initially off. Never persist pointer vectors, world objects or a running audio context.

Ownership matrix:

| Property | Sole owner |
| --- | --- |
| Narrative p | `useScrollProgress`; debug override only in development |
| Camera position, orientation, FOV | CameraDirector, including additive impact offset |
| Hero transforms before .70 | Authored sampler through PhysicsDirector pose switch |
| Hero transforms .70–.78 | PhysicsDirector, sampling actual simulated trajectories |
| Hero transforms .78–.82 | Assembly sampler, seeded from exact final physics poses |
| Product transforms ≥.82 | SignalProduct using timeline + product reducer |
| Local interactive fragment poses | interactionWorld only |
| Form rib deflection | FormAssembly's bounded spring offsets |
| Materials, lights, particle uniforms | Respective directors; no React state per frame |
| Copy opacity/position | Narrative's imperative style adapter from the same p |

Never animate a parent group that contains physics-owned bodies. Keep hero physics roots at identity; static geometry below them may have local transforms. No GSAP transform mutation, no React props changing rigid-body poses during dynamic ownership, and no render loop secretly stepping a second copy of the world.

## 9. Scroll, rendering and event architecture

Native document scroll, no Lenis, wheel interception, ScrollControls, nested scroller, scroll lock or compulsory snap. One sticky stage inside a narrative track.

Desktop scroll travel `D=8H`; mobile `D=5.5H`, where H is the stable viewport height captured after initial layout. Track height is **D + H**, not D. Stage uses `position:sticky; top:0; height:100svh`; resize the drawing buffer to the visible stage. This gives about eight desktop / five-and-a-half mobile viewport traversals without requiring a specific scroll speed.

`p = clamp((scrollY - trackDocumentTop) / (trackHeight - stageHeight), 0, 1)`.

Read p once in the passive scroll handler into a ref; sample it at the start of each render frame. No smoothing of this master value. All easing is local to specified timeline intervals, so camera, HTML and physics do not acquire different delays. `sampleNarrative(p)` is pure, returns phase, chapter progress, camera/light weights, morph weights and pose ownership. `p=1` belongs to Product; other intervals are left-inclusive/right-exclusive.

Only R3F owns the continuous frame loop. `FrameDirector` orders: sample p → discrete phase changes → pointer projection/springs → physics/cache poses → geometry/material uniforms → camera and lights → impact envelope → audio targets → render. A composer with positive useFrame priority owns final drawing when enabled; direct rendering is used when disabled, never both. Native resize/scroll events only update refs and invalidate.

At settled Prelude/Product, stop continuous frames after 2 seconds without scroll, pointer, pulse or audio-relevant animation; use `frameloop="demand"`. A pointer/scroll/product action invalidates and wakes the loop until springs/pulses settle. Pause all frames and suspend audio when document is hidden; reset elapsed-time origin on return. No catch-up burst.

### Navigation and restoration

Chapter anchor IDs: `prelude`, `attention`, `form`, `behavior`, `convergence`, `product`. Position chapter markers at offsets `startP*D`; their native fragment destinations remain meaningful. Intercept a chapter link only in enhanced mode to use `scrollTo({top:trackTop+p*D,behavior:'auto'})`, then focus its heading. Do not change focus on ordinary scrolling.

On hydration or history restoration, read the actual scroll/hash before the first canvas reveal, sample directly at that p, suppress one-shot events, and render the correct chapter. Do not reset to zero. Recompute measurements after `document.fonts.ready`. On true orientation/width change, preserve p, remeasure and restore the corresponding scroll position once. Ignore small browser-toolbar height fluctuations for the track's D; update the visible canvas only. Keyboard PageDown/Space/Home/End retain browser behavior outside controls.

Avoid a loading-induced layout jump: automatic enhancement may replace the initial reading layout only while the visitor is still at its beginning. If they have already scrolled into a later section before readiness, retain reading mode and expose `Enter interactive experience`; that explicit action maps the current section/local fraction into p before switching layouts. A hash entry can initialize directly into the matching enhanced chapter after readiness, with events suppressed. Track-size reservation and this mapping must be tested with throttled loading, not assumed from a fast local machine.

### Impact event versus scroll state

Strong impact is a **wall-clock transient**, not a shader value that remains enabled at a scroll position. One contact record provides the trigger p. Forward crossing at ordinary scroll speed starts an event; reversing or jumping past it does not. Suppress if a single-frame delta exceeds .025, history restore is active, or the tab is hidden. Clear pending effects on jumps.

Maximum 220ms envelope: 0–35ms particle recoil; 0–100ms tiny exposure lift; 0–120ms optical displacement; 0–160ms damped camera offset; 0–220ms expanding edge wave. Camera displacement ≤.025u and roll ≤.12°. Distortion ≤1.5 CSS px High, .75 Medium, zero Low. Chromatic separation defaults to **zero**, including normal convergence. No full-screen white flash.

An impact epoch fires once; scrolling backward does not create a reverse sound. Rearm only after returning below .68 and a minimum 2-second cooldown. Audio, exposure, particles and camera use the same event ID/time. Pause freezes/removes the transient; replay does not duplicate listeners.

## 10. Particles, structure and shader contracts

No per-particle React objects. Allocate typed arrays once using a seeded integer PRNG (seed 1001). Every signal mark has a stable ID and rank; the same buffers produce noisy, structured, network-adjacent and product-flow positions.

Use **one instanced quad geometry** for narrow rectangular marks (two triangles per mark), rather than point sprites that could read as stars. Attributes: `aSeed`, `aNoisePosition`, `aGridPosition`, `aLane`, `aRank`, `aSize`. Particle size 1–3 CSS px, predominantly 1 × 2 or 1 × 3 ratio, no round bloom halos. Fixed-depth 7 × 3 × 1.2u volume, denser along implied editorial lanes, no spherical distribution.

Position comes from deterministic mixes of precomputed anchors and a small bounded shader displacement. `uProgress` drives topology; `uAmbientTime` drives only .02u low-amplitude drift and freezes on pause. Pointer falloff is a bounded local force approximation, explicitly not a rigid-body simulation. Form spring offsets are CPU-integrated only for 24 ribs; particles sample the selected rib/cluster influence through compact uniforms, avoiding thousands of springs. Physics hero centers modulate the field with three attractor uniforms during convergence, and particle flux drives practical-light intensity at their collectors.

Use alpha-tested/soft-edged quads with normal blending and depth test. Start with opaque dithered coverage where possible. No additive full-screen spray. Keep occupancy low enough that layers remain legible; sort no per-particle objects. Hide exhausted field groups after the transition; reuse buffers rather than recreate geometries.

| Shader/module | Inputs | Contribution and stop condition |
| --- | --- | --- |
| `attention.ts` vertex/fragment | p, anchor attributes, coherence, pointer influence, 3 hero centers, CSS-to-world size | Noise → lanes → structured samples → product inlet. Crisp rectangular signal coverage. No noise texture fetch needed. |
| `etch.ts` material patch | UV, grid scale, hierarchy mask, line width | Anti-aliased etched guides on three opaque planes; use derivatives for stable apparent line width. Guides recede once hierarchy is learned. |
| `pulse.ts` | Edge path distance, up to 8 active pulse start times, state mask | Short bright segment travels only along an actual dependency. No permanent glowing network. |
| `impact.ts` composer pass | Screen-projected contact center, event age, amplitude | Brief radial image displacement and subtle edge wave; outputs identity outside event. No persistent RGB split. |

GLSL lives as TypeScript string exports to avoid a custom loader. If patching `onBeforeCompile`, define a stable `customProgramCacheKey` and a compile probe against pinned Three. Keep fallback plain Standard materials if an optional patch fails; no blank scene. For custom shader outputs, respect renderer tone/color conversion; composer output conversion happens once.

Behavior graph: six nodes `input → classify → prioritize → compose → route → output`, plus a bypass `classify → compose`. Max seven edges. Selection determines the branch; the pulse takes 120ms per edge, node press depth .04u with a 180ms return. Hover previews a node outline; click/tap or HTML `Send test signal` sends one pulse. Limit to one request per 300ms, pool eight pulse records. Do not add floating source code or decorative unconnected edges.

## 11. Physics handoff, reversibility and collision

**Design decision:** hero motion is physically simulated on the visitor's machine into a short deterministic pose cache, then sampled by scroll. Local loose fragments remain live physics. This is the explicit solution to backwards scroll; never attempt negative physics time. It is neither a video nor a keyframed imitation of collision. It does mean visitor input does not randomize the central hero collision; their physical influence is on the nearby fragments, signal flow and spring elements instead.

Use direct Rapier to avoid an automatic wrapper stepper and to make pose ownership inspectable. A dedicated module worker computes the three-body hero trajectory at load; it is never imported outside the experience. The compat WASM package is bundled/lazy-loaded locally. `new Worker(new URL('./narrative.worker.ts', import.meta.url), {type:'module'})` is a mandatory production-build probe. If the bundler cannot emit it correctly, use the same simulation function on the main thread in batches with a 3ms yield budget; do not add a second physics library.

### Handoff procedure

1. Narrative authored poses cover `.64–.70`. Carrier centers at .64 start near `(-2.6,.65,.1)`, `(.45,1.75,-.4)`, `(2.3,-.8,.15)`. Rotate the constellation less than 40°, close distances by .70. These are initial blocking values; adjust in the graybox to avoid colliders overlapping at release.
2. Define release p=.70 and simulation time t=0. Sample the authored transforms exactly at .70; compute incoming linear/angular velocity from adjacent authored samples using the fixed narrative time scale below. Pass those world transforms/velocities to Rapier. Remove all authored transform writes for the physics interval.
3. Construct three dynamic bodies in stable ID order, gravity `(0,0,0)`, no sleeping during the short trajectory. Use compound cuboid colliders approximating the collector, cassette and rail; no dynamic trimesh. Enable CCD on all three.
4. Step fixed **1/120s** for **3.2 seconds / 384 steps**, mapping t linearly to `.70–.78`. Quality tiers use the identical hero simulation and step count; only rendering differs.
5. Apply mass-scaled damped attraction to authored docking targets: `F = m*(18*(target-x) - 7*v)`, cap acceleration at 12u/s². Reduce tangential force to zero by t=1.2s. Use low restitution .06, friction .65, linear damping .8, angular damping 1.6. Starting masses collector 1.4, cassette 2.0, rail 1.1. Tune for one heavy contact, no pinball bounce. Targets must permit contact at mating edges and final nonpenetrating separation.
6. Record every body's position/quaternion/velocity per step and actual contact events; retain the first valid carrier contact above a calibrated impulse threshold after t=.9s. Target its p within **.738–.758**, but derive the event's exact p from the collision, never independently hardcode it in audio/shaders. Group subsequent contacts within 80ms into the same impact.
7. At .78 capture exact final world poses, remove dynamic ownership, disable hero colliders, and give assembly the last sampled poses. `.78–.82` aligns the three shells to chassis docking transforms with quintic interpolation. Assembly's first frame equals the final physics frame. Small internal components slide within these shells to establish the finished interface; never dissolve the whole object into another shape.

The worker can simulate the same authored→dynamic handoff ahead of display. The main scene always uses the same canonical output, so forward, reverse and direct-seek views at an identical p agree. Each frame uses position lerp and quaternion slerp between neighboring cache samples. Snapshots are optional for diagnostics, not required for reverse playback of this fixed three-body sequence. Reject cache messages from a previous scene/config version; terminate worker on unmount.

Cache ready is part of full-scene readiness. Server HTML and poster remain usable while it computes. If physics initialization fails, use reading mode with the illustrated convergence still and functional HTML product, rather than silently claiming a physical collision. Numeric determinism requires identical version, construction order and inputs; Rapier documents those conditions in its [determinism guide](https://rapier.rs/docs/user_guides/javascript/determinism/). Seeded scene generation must not rely on cross-platform exact trigonometric initialization if bit-identical replay is asserted.

### Live interaction physics

Separate small world: 6 loose bevel fragments High, 3 Medium, none Low; bounded around the two exposed collector edges. Kinematic carrier proxies follow the cached hero poses; they never drive the heroes. Pointer/touch impulses deflect these fragments, which strike the proxies and settle under damped springs. This makes local interaction physical without compromising cinematic framing or reversible narrative. Fixed step 1/60s, maximum 3 catch-up steps, elapsed delta clamp .05s; reset on phase exit, large seek or visibility resume.

Start fragment mass .035, restitution .03, friction .7, spring frequency 3Hz, damping ratio 1.1. Cap deflection .25u and input impulse .012. No free fragments fly through typography. All are removed from simulation after Product alignment.

Gate mechanisms and Form springs do not need Rapier: integrate the small critically damped offsets directly, with delta clamps and sleep epsilon. Product strips are reducer-owned and deterministic. Thus physics is confined to motions where inertia and contact are actually visible.

## 12. Interaction grammar

| Phase | Pointer | Touch/keyboard equivalent |
| --- | --- | --- |
| Prelude | No cursor-following world or camera | Scroll; chapter navigation |
| Attention | Ray projected into field plane; nearby marks attract within .8u, capped .22u displacement; press gently repels; release recovers in 450ms | Tap field applies one 450ms attraction envelope; HTML `Direct the flow` triggers a centered example |
| Form | Hover nearest rib depresses .06u; its neighbors respond at 35% strength; critically damped recovery 320ms | Tap rib or `Test the structure` button produces same localized response |
| Behavior | Hover previews graph node; click emits a dependency pulse and gate response | Tap target, or focus HTML `Send test signal` and press Enter/Space |
| Convergence | Local pressure deflects loose fragments; field bends around the three carriers; camera untouched | Tap collector area supplies one impulse; Low shows the equivalent field deflection |
| Product | Select signal; toggle ordering; route; reset | Same real HTML buttons, keyboard complete; touch hit boxes at least 44 × 44 CSS px |

Project pointer with canvas bounding rect, not window dimensions. Exclude toolbar/text/links from canvas hit handling. HTML labels/controls sit above the canvas; ray targets have larger invisible hit regions where needed. HTML product controls and canvas hits dispatch identical semantic actions.

Stage uses `touch-action: pan-y pinch-zoom`. Never prevent vertical page scroll. Tap requires travel <10px and duration <350ms; cancel on vertical scroll/pointercancel. No required drag, long press, double tap, pressure sensor or hover on mobile. At most one contact controls the field; multi-touch yields to browser zoom. Release pointers and zero forces on blur.

## 13. Sound direction and implementation

Default off; `Sound off`/`Sound on` button with `aria-pressed` and ≥44px target. Only this explicit gesture constructs/resumes AudioContext. Browser suspension updates the label/status; do not claim playback if resume fails. Sound never conveys the only indication of state.

Create source buses → phase gains → high-pass protection/soft compressor → master gain → destination. Start master gain .16; cap active voices at six, keep headroom, and validate with headphones and laptop speakers. Audio nodes disconnect and context closes on route exit. No microphone permission, media fetch, audio account or MP3 license needed.

Generate a reusable short noise buffer and use native oscillators/filter envelopes:

- Attention: sparse 10–25ms filtered clicks, 500–2400Hz, irregular but seeded; max 3/s while moving the field, not a continuous rain.
- Form: 70–120ms damped sine/triangle partials around 220/330/440Hz, tied to rib displacement threshold, not every pointermove.
- Behavior: 35–65ms electronic impulses with small upward interval, one per logical node activation; voice budget prevents stacked sequences becoming a jingle.
- Convergence: low-level phase buses approach shared 110/220/330Hz harmonic relationships; gain rises gently, no trailer riser.
- Impact: 120ms sine transient descending 85→48Hz plus very low 20ms filtered noise; peak below clipping. Trigger on the exact same impact event ID as optics.
- Product: nearly silent resolved 220/330Hz bed with slow gain envelope, and distinct short selection/routing responses. Bed stops after inactivity or pause.

Phase gain crossfades use 80ms AudioParam ramps from p-derived target levels. No sample seeking on scroll; reverse movement adjusts mix but does not replay historical clicks. Suspend on hidden tab, pause control or reading mode. Resume only if the visitor enabled sound and browser permits; otherwise wait for a fresh sound-button gesture. Clear scheduled envelopes and event IDs appropriately on jump/replay. Do not autoplay based on an old stored preference.

## 14. Performance and postprocessing

Budgets are acceptance targets to measure in a production build, not claims from the current empty scene. Prefer dropping an effect before dropping the visible causal connection between systems.

| Tier | Initial choice | Signals / ribs / live fragments | DPR cap | Shadows / FX | Target |
| --- | --- | --- | --- | --- | --- |
| High | Desktop after stable warm-up and capability check | 12,288 / 24 / 6 | 1.5 | 1024 shadow; half-res bloom; impact pass | 60fps, p95 frame ≤20ms |
| Medium | Desktop default; capable tablet | 6,144 / 24 / 3 | 1.25 | 512 shadow; half-res low-strength bloom; reduced impact | 60fps target, p95 ≤25ms |
| Low | Coarse pointer default, constrained/slow GPU | 2,048 / 12 visual ribs / 0 | 1.0 | Contact geometry, no composer | ≥30fps, p95 ≤33ms |
| Static | Reduced motion, forced colors, no WebGL2, explicit reading mode, repeated context loss | Six stills + HTML | N/A | None | Normal accessible page |

Hero physics always three bodies; the tier does not change collision timing. Six product records and all actions always remain. Ribs can merge visually in Low; their logical hierarchy still has 24 positions. Mesh budget ≤100k visible triangles High, 60k Medium, 30k Low; scene draw calls ≤55/40/25 excluding composer; GPU working-set estimate target <128/96/64MB. Verify render targets/textures by allocation accounting, since portable exact GPU memory telemetry is unavailable.

Start in Medium desktop, Low coarse pointer; never infer quality from screen size alone. Honor reduced motion/forced colors first. Measure rolling 2-second frame windows excluding tab-hidden, loading and first shader warm-up. Downgrade after three bad windows (>25ms Medium/High or >38ms Low). Lower DPR first, then signal count/FX; upgrade only after 10 seconds stable with ≥25% headroom, at a chapter boundary, and at most once per visit. Retain manual quality choice. Data-saver/low-memory hints may lower the initial tier but are optional APIs, not hard requirements. Low that remains unusable offers reading mode; never trap the visitor on a black canvas.

Resource targets: hub adds **zero Three/Rapier/audio bytes**; experience shell incremental JS ≤25KB gzip excluding existing framework/fonts; full experience first interactive download target ≤1.2MB compressed JS+WASM, measured separately from ≤700KB total still assets. If the dependency floor exceeds that budget, report actual bytes and remove optional extras rather than claim compliance. Posters/stills AVIF/WebP where supported; no individual still over 160KB at planned display size. On a 10Mbps/150ms RTT profile, useful server copy/poster within 2 seconds and interactive scene target within 5 seconds. These targets require later device/network testing.

### Post pipeline

Base render must pass review with all FX disabled. High/Medium pipeline: RenderPass → high-threshold half-resolution UnrealBloomPass (small emissive inserts only) → combined impact/vignette pass → OutputPass. If renderer configuration causes double tone mapping, move all output conversion to OutputPass and retest against direct rendering. Vignette maximum edge darkening 4%; film grain **off by default** (no replacement for missing material detail).

AO and DOF are not mandatory. First use geometry/contact shadows and focal composition. Only add one static-shot DOF treatment in High if the Form macro lacks separation after lighting; typography stays HTML and sharp. Any optional AO requires a measured GPU budget and a documented visual improvement at p=.36. Neither effect is a reason to add another dependency. No permanent chromatic aberration, lens flare or motion blur.

Dispose PMREM source/targets, geometries, materials, composer targets and audio nodes. Dispose the old target before replacing it on resize. Handle `webglcontextlost` by preserving HTML and switching to poster; allow one deliberate recovery, then reading mode. Cleanup is idempotent under React Strict Mode; no duplicate workers, RAFs, AudioContexts or global handlers.

## 15. Mobile, reduced motion and accessibility

Mobile is a separate composition, using the same p and logical story. At ≤767px or narrow portrait, use camera poses with X travel ≤.9u, Y .2–.8u, near-frontal yaw ≤10°, FOV 40°. Fit each object into the middle 54% of the usable viewport. Use a **separate fixed mobile scene/physics configuration** with z offsets reduced to .55 of desktop before constructing geometry/colliders; never nonuniformly scale a physics-owned root. Preserve silhouette and screen-space motion continuity. Product reflows vertically: inlet above queue, output below; no shrink-to-fit desktop strips.

Convergence camera pulls back less; carriers approach within a compact triangular arrangement through less than 20° of orbital motion. Mobile initial carrier centers are `(-1.25,.85,.055)`, `(.1,1.6,-.22)`, `(1.2,-.7,.083)` at .64; adjust release trajectories within this compact envelope to pass the same non-overlap/contact gate. Use the same masses, timestep, spring law and ownership contract, but compute a mobile cache/contact p from its actual geometry. Freeze the chosen composition profile during the collision interval; apply an orientation-driven profile change at the next chapter boundary, or immediately with one-shot effects suppressed if the viewport becomes unusable. Rendering quality may change independently of composition profile.

Interaction controls move below the object in two short rows; display only three product strip labels at once with an HTML list that can show all six. Selection from the list highlights the corresponding geometry. No horizontal page overflow. At viewport height <480px or zoom causing copy/controls to collide, automatically offer/use the reading layout, preserving current chapter and product selection.

Reduced-motion initial render uses **StaticExperience**: six normal-flow sections with meaningful exported stills and the exact narrative, no pinning, no camera travel, no particles/physics/audio imports, no flashes or animated image. Final HTML Signal Composer is fully usable with instantaneous state updates. The first server render is already the readable presentation; full-motion enhancement is an opt-in by capability/preference detection, not hidden server copy. If preference changes during a visit, release GPU/audio and keep focus in the corresponding reading section.

Full-motion users also have `Pause motion` and `Reading mode`. Pause stops ambient drift, springs, pulses, physics fragments and audio; scrolling switches between stable chapter poses, without animated travel. Unpause samples current scroll rather than accumulating elapsed time. Screen reader text stays semantic; canvas is `aria-hidden` because HTML contains the equivalent narrative/actions. Use one h1, sequential h2 headings, native controls, an initial skip link, visible focus and a polite status region for product actions only. No live percentage announcement per frame or automatic focus moves on scroll.

In enhanced mode, visual overlay duplicates are aria-hidden if a semantic narrative copy already exists. Never leave offscreen/transparent buttons focusable; only current interactive panel controls enter the tab order. Reading mode makes every chapter/action available in order. Contrast targets: 4.5:1 normal text, 3:1 large text and meaningful UI outlines. Status also uses text/position, not color alone. At 200% zoom and 320 CSS px, no content or route exit is lost. Forced colors uses the HTML presentation. Sound remains optional and disabled initially in every mode.

## 16. Risks specific to this repository

| Risk | Mitigation / evidence to require |
| --- | --- |
| React 19.2 renderer mismatch | Exact Fiber peer check already fits; validate actual reconciler at first canvas probe, one React in `npm ls`. |
| Root/layout misunderstanding | No top-level root exists. Prove both new URLs build without collision; verify full document enter/exit and correct `html lang`. |
| Glass, grain and smooth scrolling leak into stage | Dedicated root excludes current global CSS and body::before. Check computed styles and navigation back to home. |
| Broken English links or homepage canonicals | Singleton metadata/sitemap path handling and hub-specific LanguageSwitcher fallback. Check rendered head, not just TypeScript objects. |
| Heavy imports leak to parent | No shared barrel or SiteChrome imports. Inspect production network/chunk graph on `/`, `/en`, `/labs`; none fetch graphics/WASM/audio. |
| Worker/WASM path breaks with Turbopack or deployment CSP | Mandatory local production probe; use compat package without remote CDN, same-origin worker; inspect current hosting headers before deployment. Main-thread batched fallback documented. |
| Cached physics reads like three abstract lumps | Graybox silhouettes must clearly be collector/cassette/rail; collision retains identifiable pieces and assembles a product. |
| Scrub physics or duplicate sound | Immutable cache + collision-derived event time; separate one-shot event latch; adversarial seek tests. |
| Mobile collision becomes geometrically wrong | Separate mobile scene/physics config and cache; graybox contact gate; never scale dynamic body transforms independently. |
| `next/font/google` build fetch dependency | Baseline build passed here; CI/network may differ. If it blocks implementation, vendor the same licensed font via next/font/local in the new root only, not a typography redesign. |
| Browser toolbar height / sticky ancestor / scene loading shift | Stable track measurement, no overflow ancestor, preserve p on orientation, reserve poster/stage size. |
| Current app has no dedicated unit/browser-test setup | Add only focused deterministic tests for new nontrivial logic; use a small dev-only runner if required. Do not introduce a broad test-platform migration. |
| Dark PBR surfaces vanish or composer changes colors | Gray swatch and six still-frame review without FX; same output-conversion contract. |
| Existing Supabase/email configuration gets coupled into labs | No backend imports, calls, env requirement, analytics or new server action. |
| Development performance mistaken for production behavior | Baseline dev visual check is useful, but budget/final acceptance uses `npm run build` + `npm run start`. |
| Hosting mistaken for a verified free commercial plan | No paid runtime/asset/API dependency. Existing hosting remains a separate constraint; verify its actual plan/terms/limits before publishing. No hosting migration is part of this work. |

## 17. Ordered implementation passes and stop gates

Complete passes in this order. A stop gate means fix the failing result before adding another layer of polish; it does not mean ask for routine permission.

### Pass 0 — isolate and prove the runtime

Record baseline screenshots/build/lint; pin the four proposed packages. Create root/routes with plain server copy, CSS Modules, metadata and capability boundary. Add a minimal three-mesh canvas and isolated Rapier initialization/worker probe, then remove diagnostic visuals. Confirm production build, Strict Mode cleanup, WebGL failure path and no graphics downloads on `/` or `/labs`. Verify font reuse, root navigation and sitemap singletons. **Gate: technical feasibility and isolation, no design polish.**

### Pass 1 — narrative in HTML

Implement complete hub, server narrative, native scroll track, progress sampler, chapter anchors, toolbar and reading mode. Product reducer and HTML controls work without canvas. Check keyboard, hash entry, refresh at bottom, back navigation, zoom and preference changes. **Gate: story and product actions are complete without WebGL.**

### Pass 2 — graybox and camera

Three carrier silhouettes, simple white/gray materials, no FX, no sound, no physics yet. Implement all camera moves/holds and the separate mobile composition. Capture p `0, .18, .36, .55, .68, .75, .9, 1` at 1440 × 900 and 390 × 844. Confirm the last object reads as a working interface, not abstract sculpture. Freeze both desktop/mobile geometry and release poses before the physics pass. **Gate: composed images and legible final product.**

### Pass 3 — product-first material and lighting finish

Finish Product before adding particle density: chassis, six strips, gates, bevels, studio rig, final HTML relationship. Wire selection/order/routing/reset to visible geometry. Calibrate exposure and materials with FX off. Export the first honest hub poster. **Gate: p=.94 alone looks like a considered interactive product photograph and works with keyboard/touch.**

### Pass 4 — systems and transitions

Build efficient signal field and stable mapping into Form. Add ribs/springs, planes and the small dependency graph. Connect all three systems to the persistent Product geometry/material vocabulary. Make every shader optional enough to fail gracefully. **Gate: each action has a visible cause and result; no placeholder particles or unrelated floating cards.**

### Pass 5 — physics convergence

Implement worker/cache/handoff, collision event extraction and assembly continuity. Tune masses/forces/contact in graybox before reapplying final materials. Add bounded live fragments. Test reverse, seeks, rapid scrolling, pause, direct Product load and loss/recovery. **Gate: first and last handoff transforms match, one credible contact, reversible p, no competing writers.**

### Pass 6 — sound and restrained impact

Build explicit opt-in audio, phase buses and action cues. Add the 220ms impact envelope, then only the post effects that improve already-approved images. Review at low speaker volume and with sound disabled. **Gate: no autoplay, no duplicate impact, no persistent distortion, clear causality without sound.**

### Pass 7 — adapt, harden, measure

Apply quality tiers, frame-window adaptation, DPR limits, demand rendering, cleanup, error boundaries and loading fallback. Test physical iOS Safari and Android Chrome when available; desktop emulation is insufficient for thermal, touch and audio guarantees. Record production transfer sizes, frame times, target allocation estimates and sustained 3-minute behavior. **Gate: budgets met or explicitly adjusted with measurements, no blank/locked experience.**

### Pass 8 — final visual QA and integration

Review the fixed progress/contact sheet, copy/focus/contrast, exported static story, OG image and hub. Add footer discovery and language fallback. Run lint, production build and the targeted tests; verify unrelated home/demos/configurator render as before. Deliver source, actual screenshots and a measurement report. **Gate: no pending placeholder graphics/copy, no inaccessible path, no new paid dependency.**

## 18. Acceptance and test matrix

These tests are for subsequent implementation; they were not executed against a nonexistent Convergence scene in this phase.

| Area | Required check |
| --- | --- |
| Timeline | Boundaries `.08/.28/.46/.64/.82/1`; random seek order yields same narrative sample; camera holds have identical transforms at start/mid/end. |
| Physics | No collider overlaps at release; first simulated pose equals authored pose; final assembly starts from last cache pose; first contact in target interval; forward/reverse sample equality; no NaN; stable IDs/order. |
| Events | Ordinary forward pass fires impact once; stopped scroll never holds a flash; reverse/large seek/history restore emits zero historical sounds; replay rearms only as specified. |
| Product | Selection/order preserve IDs; disabled route without selection; route twice is idempotent; actual count equals routed set size; reset restores all state; HTML and geometry agree. |
| Routing | Both requested URLs 200; no fake EN links; canonical/OG/sitemap correct; exit links real; footer discovery works in ES/EN; return to parent styles unaffected. |
| Loading | No JS: six-section readable story and navigation; no WebGL/WASM failure: poster/static mode, usable HTML product after hydration; slow load never hides text or moves scroll unexpectedly. |
| Accessibility | Keyboard-only complete; screen reader names and heading order; 200% zoom/320px; 44px targets; reduced motion initial/runtime; forced colors; no unrequested audio. |
| Browser | Current stable Chrome/Edge, Firefox, Safari; physical Safari iPhone and Android Chrome before claiming mobile support. Record tested versions and devices. |
| Responsive | 1440×900, 1280×720, 768×1024, 390×844, 320×568, 844×390; browser address bar collapse/expand and rotate at p=.75. |
| Lifecycle | Enter/leave 10 times: no duplicate sound, worker, event handlers, residual RAF or monotonically growing GPU allocations; context loss retry/fallback. |
| Performance | Production bundles on home/hub exclude graphics; sustained per-tier p95 times; no per-frame React commit storm; adaptation doesn't oscillate. |

Visual review asks: Is the subject identifiable in silhouette? Is the light direction intentional? Is there a readable quiet region? Does each moving element teach something? Does the final action prove the thesis? If any answer is no, change geometry, framing, light or timing before adding an effect.

The implementation is complete when a visitor can watch noisy information gain structure, trigger a response, see the three systems physically meet, and operate the resulting product—with an equally clear static path when motion or GPU rendering is unavailable.
