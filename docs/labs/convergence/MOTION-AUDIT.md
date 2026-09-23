# CONVERGENCE / motion audit and system

The baseline was viewed in the running browser at desktop and mobile widths before code changes, including slow and fast scroll, reverse travel, the Behavior button, and the Signal Composer. The visual hierarchy, chapter copy, WebGL/reading-mode split, quality control, and the three-discipline concept were worth keeping. Most scene movement was a direct function of normalized scroll or elapsed time, so shots, object arrivals, and particles had little momentum or causality.

| System | Decision | Baseline problem | Current motion law |
| --- | --- | --- | --- |
| Chapter structure and controls | KEEP | Concept and navigation worked | Retain six chapters, keyboard-accessible controls, sound opt-in, reading mode |
| Scroll and camera | REBUILD | Direct shot interpolation and hard look targets | Raw intent, critically damped playhead, independent position/look/roll/FOV springs, scroll-energy response |
| Attention field | REBUILD | Procedural positions without preserved velocity | Persistent velocity, field and orbital forces, drag, pointer wake, depth-varying shader points |
| Attention to Form | REBUILD | Uniform crossfade and direct position mix | Staggered structural capture; actual target distance and particle speed determine alignment response |
| Form | RETUNE | Static grid appeared in one step | Spring entrance, depth, orientation, local flex, short alignment response |
| Behavior | REBUILD | Lanes animated together | One originating signal, packet travel, delayed neighbor branches, node response and route-state propagation |
| Great reveal and Convergence | REBUILD | Three independent objects approached by interpolation; generic flash | Shot reframe, orbit, braking hold, compression, brief core/light/shockwave/debris event |
| Product | REBUILD | Object scaled in and signals lacked a spatial route | Collision-to-product handoff; intake, hub hold, chosen fin, output; local fin and hub response |
| Copy and controls | RETUNE | Repeated generic fade/translate and flat feedback | Clipped chapter reveal, asymmetric easing, press/release and hover/touch states |

## State separation

`ConvergenceExperience` owns native scroll position, chapter semantics, and UI state. The scene owns a smoothed playhead, scroll velocity and energy, pointer wake, and event ages. Each subsystem owns its own physical state: particle velocities, Form springs, signal events and node springs, Convergence body and debris velocity, and Product fins. Scroll chooses destinations and timing windows; it does not set every object position. The shared critically damped solver has an exact fixed-target solution so its settling time remains close across frame rates. Time-based forces use bounded delta time.

The main field uses one dynamic buffer geometry rather than thousands of React meshes. The quality tiers use 1,600 / 3,000 / 4,800 particles and capped DPR, with automatic quality reduction after sustained slow frames. Short-lived shader streaks, the point field, signal afterimages, light and exposure impulses tell specific events; long ambient strands and continuous shake were removed. Reduced-motion mode keeps the same interactive narrative with less turbulence, no pointer wake/streaks, calmer camera, and a smaller impact. The visitor can also enter this state with the CALM control, allowing the calmer path to be tested without changing an operating-system setting.

## Known limits

The main field is still simulated on the CPU; a compute/FBO path could improve headroom on low-end integrated GPUs. The three-body choreography uses authored spring targets rather than a general rigid-body solver, by design: a deterministic composition matters more here than unconstrained collision. The impact does not require a fullscreen postprocessing chain; its core, wave, debris, camera and exposure components are localized and short. Browser/device testing must still confirm actual GPU performance, touch feel, and reduced-motion behavior on target hardware.
