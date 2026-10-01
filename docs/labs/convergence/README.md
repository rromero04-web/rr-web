# Convergence — Lab 001

`/labs/convergence` is a scroll-driven WebGL piece about three disciplines becoming one system: marketing brings attention, design gives it form, development makes it behave. It replaces the earlier versions of the lab and their planning and audit documents, which are still in git history.

## Concept

There is one body of matter, a single GPU point cloud, and it moves through six states. Each state is one section of the page:

| Stage | Section | State of the matter | Interaction |
| --- | --- | --- | --- |
| 0 | Prelude | A luminous ring behind the title | Pointer sway |
| 1 | Attention (Marketing) | A turbulent swarm of ember particles | The pointer gathers the swarm around it |
| 2 | Form (Design) | Five exploded interface layers: dot grids, content blocks, a scan line | — |
| 3 | Behavior (Development) | 72 data streams bundled through one node | "Send a signal" sends a wave through the streams |
| 4 | Convergence | A compressed core with an accretion disk, echoing the opening ring; the three discipline colours appear inside the same matter | The release into stage 5 is the only flash |
| 5 | Product | A living sphere with three orbits, one per discipline | Signal composer: each routed signal lights its orbit and sends a wave over the sphere; routing all six completes the system |

On entering, all of the matter is born from a single point. It bursts outward with a shockwave and light trails and settles into the ring. When the core releases into the product, the same shockwave recurs, with a brief flash and a small camera shake.

The morph between states happens as the next section arrives. Each section holds its own state for roughly the first 45% of its scroll, and particles leave with a staggered delay so they move as a crowd rather than a block.

## Interaction

- **Pointer:** gathers the swarm in Attention and bends the other states. A soft lens follows it.
- **Press and hold (mouse):** a gravity well. Every state is pulled towards the pointer, and the image bends around a dark centre.
- **Release:** a burst and a shockwave travel outwards from the well, with a strength that depends on how long you held. In Behavior, releasing also sends a signal through the streams.
- **Drag:** rotates the matter. The rotation keeps its momentum and settles on a full turn.
- **Tap (touch):** a burst at the tap; touch scrolling is never blocked.
- **Scroll speed:** the matter trails behind fast scrolling, with light trails.
- **Signal composer:** each signal lights the orbit of its discipline, and routing all six completes the system.

## Language

All copy lives in `copy.ts` in Spanish and English. The language comes from `?lang=es|en`, then the visitor's last choice (`localStorage`), then the browser language. The server renders Spanish. The ES/EN switch is in the preloader and the HUD, and it updates `<html lang>`.

## Files

- `src/app/(experiments)/layout.tsx`: a separate root layout. It contains no site chrome or global site CSS, and loads Geist, Geist Mono and Instrument Serif (italic accents).
- `src/components/labs/convergence/ConvergenceExperience.tsx`: the DOM layer. It holds the preloader with its "enter with sound / in silence" choice, the HUD, the custom cursor, Lenis smooth scroll, the scroll → stage mapping, text reveals, the marquee and the signal composer. Every per-frame DOM write happens in a single `requestAnimationFrame` loop, so scrolling never re-renders React.
- `src/components/labs/convergence/ConvergenceScene.tsx`: the React Three Fiber canvas. It contains the camera shots per stage (positioned with `setViewOffset` so text and matter never overlap), the pointer projection, postprocessing: light trails (AfterimagePass, driven by scroll speed, morphs and the intro), UnrealBloom, then a grade pass with a haze tinted by chapter, a soft lens around the pointer that becomes a gravity lens while holding, the refractive shockwave, chromatic offset, vignette and grain and an adaptive quality governor.
- `src/components/labs/convergence/shaders.ts`: all six states (with data packets in the streams, polar jets in the core and a rim light on the sphere), the gravity well, the release burst and scroll inertia, plus depth of field (out-of-focus particles open into bokeh discs) and a sparse layer of foreground orbs. All of it is computed in the vertex shader from each particle's index and four random values. The CPU does no per-particle work each frame.
- `src/components/labs/convergence/ConvergenceAudio.ts`: a procedural score built with Web Audio, with no audio files and no continuous noise. Everything is pitched to the chord of the current chapter (it starts in D minor and resolves to D major):
  - a breathing pad;
  - glassy grains, through a ping-pong delay and a dark generated hall, whose density follows scroll speed;
  - water-drop tones under the pointer in Attention;
  - an arpeggio in Form and a 16th-note data pattern in Behavior;
  - a rising drone while holding, and a burst on release;
  - a tonal riser and an impact at the convergence, and bells in the product.
- `src/components/labs/convergence/model.ts`: the chapters, the signals, and the shared mutable scene state.
- `src/components/labs/convergence/copy.ts`: Spanish and English copy.

## Quality, accessibility, fallbacks

- **Quality tiers:** 120k / 72k / 30k particles. Phones and narrow screens start on low, and the governor steps down after sustained slow frames. On low quality, bloom and trails are off.
- **Reduced motion:** with `prefers-reduced-motion`, the page uses native scroll instead of Lenis, the scene runs in a calmer mode and reveals are instant. The "Motion: calm" toggle gives the same calmer scene on demand.
- **No WebGL or forced colours:** the page shows the poster behind the same content. All copy is real, ordered HTML, and the composer is a list of buttons with an `aria-live` status.
- **Sound:** off unless the visitor chooses it, and toggleable from the HUD.

## Capture mode

`/labs/convergence?capture&quality=medium` skips camera and morph smoothing and ignores the pointer. Use it to render stills on slow machines, for example headless Chromium with SwiftShader, which only manages a few frames per second. `public/labs/convergence/poster.png` (the completed product state) and `opengraph.png` (the hero) were captured this way at 2× and downscaled.

## Verified / not verified

Checked in headless Chromium (SwiftShader) at 1440×900 and 390×844: every stage, the composer through to completion, and lint, typecheck and build. Not checked yet: real GPUs and frame rates, physical iOS/Android devices, screen readers, and the sound design on real speakers. Audio levels were only checked with an analyser: no errors, peaks around 0.46 at most, and every chapter's layer audible above the pad.
