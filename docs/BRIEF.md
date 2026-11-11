# Prompt: Water Drop — Core Loop Vertical Slice

> Paste everything below into Claude Code at the root of a new, empty repo. Put any storyboard frames in `docs/storyboard/` before you start.

---

You are my build partner on a calm-first meditation game. I'm the creative director; you're the engineer who also cares about craft. Build **one core loop** as a playable vertical slice that runs well on desktop web and mobile web. It should be small enough to finish and deploy today and good enough to playtest.

## The concept

The player is a single droplet of water moving through the water cycle. The droplet moves in **breath-paced bursts**: it gathers during a 4-second inhale and glides during an 8-second exhale. One full cycle takes 12 seconds, which works out to 5 breaths per minute.

The players are students and working professionals who feel overwhelmed, keyed up, or anxious between commitments. The game gives their attention something tangible, unemotional and gently absorbing to do: the physics and light of water. It invites slower breathing and never requires it.

**This slice:** the droplet rises from deep water to the surface and breaks through into dawn air. Aim for about 2–3 minutes (10–15 breath cycles), ending with a quiet arrival.

## Non-negotiable principles

1. **Approach, not avoidance.** Nothing chases the player. There are no fail states, scores, timers, or punishment.
2. **Invitation, not instruction.** If the player's input drifts off the 4/8 pace, the world adapts softly. It never corrects, scolds, or stalls. If there's no input at all, the droplet still rises slowly on the pacer ("follow mode").
3. **No health claims in the UI.** Player-facing copy may say "stress," "settle," "breathe." It must never mention cortisol, heart rate, blood pressure, or the nervous system.
4. **Never flash.** Follow WCAG 2.3.1: no more than three flashes in any one second, no strobing, no rapid flicker. Light changes are slow and continuous.
5. **Respect `prefers-reduced-motion`.** Keep the breath pacer, and replace parallax, particle drift and camera motion with gentle fades.
6. **No dark patterns.** No streaks, no loss messaging, no "one more." The ending should feel like completion.

## The breath-burst loop (exact spec)

- **Pacer:** a single source of truth (`breathClock`) that emits phase (`inhale` | `exhale`) and progress 0–1. Defaults: inhale 4000 ms, exhale 8000 ms, no holds. Make the durations configurable constants.
- **Inhale (4 s), "gather":** the droplet draws in. It swells slightly, the surrounding light brightens a little, nearby micro-bubbles or particles drift toward it, and the sound swells (a low-pass filter opens slowly). Use an ease-in-out curve.
- **Exhale (8 s), "glide":** the droplet releases upward and forward in one long burst that decelerates on an ease-out curve, so most of the movement happens early and then settles. Light and sound recede. The exhale must feel longer and softer than the inhale.
- **Input (optional, forgiving):**
  - Desktop: hold Space or the mouse button to inhale, release to exhale.
  - Mobile: touch and hold anywhere to inhale, lift to exhale. Make the whole screen the target.
  - If the player's timing differs from the pacer, blend toward the pacer over about 1 cycle. Don't snap. Never show a "wrong."
- **Progress:** each completed cycle moves the droplet one stage closer to the surface. Depth drives the palette, light shafts, and sound.
- **Ending:** the droplet breaks the surface into soft dawn air. Hold that for 2 cycles, then show one line of copy ("You made it to the surface.") and two quiet options: "Continue the cycle" (disabled stub for now) and "Return to your day."

## World and art direction: between realistic and dreamy

- **Realism comes from behavior:** refraction-like distortion, caustic light shafts from above, buoyant easing, and particles that respond to the droplet.
- **Dreaminess comes from treatment:** soft bloom, shallow depth-of-field haze, slow volumetric light, and no hard edges.
- **Palette arc:** deep blue-teal (bottom), then aquamarine, then pale gold-rose dawn (surface). Use no pure black (#000) and no pure white (#fff). Keep contrast low, except that the droplet must always remain the clearest thing on screen.
- **Build the world procedurally** (shaders, gradients, particles) rather than from bitmaps wherever possible. Water suits this, and it keeps the bundle light and the look consistent.
- **Storyboard:** if images exist in `docs/storyboard/`, read them first. Extract a palette (hex values), lighting notes, and composition notes into `src/style/tokens.ts` and `docs/STYLE_BIBLE.md`. Treat the storyboard as reference for mood and color, not as art to trace. If there are no images, propose a palette in the style bible and stop for my approval before building visuals.
- **Third-party assets:** CC0 or clearly licensed only. Record every asset with its source and license in `docs/ASSETS.md`.

## Soundscape

- Generate the sound with the Web Audio API: filtered noise shaped into underwater ambience, soft sustained low tones, occasional distant bubble textures at slow, irregular intervals. Nothing sudden.
- The breath cycle is the tempo. Sound breathes with the pacer (swell on inhale, recede on exhale).
- Don't use 40 Hz content and don't make binaural-beat claims.
- Audio starts only after the first tap or click (iOS requires this). Use that tap as the "Begin" moment. Include a visible mute control and a volume control.

## Haptics (platform reality)

- iOS Safari, and every iOS browser, doesn't support `navigator.vibrate`. Treat haptics as progressive enhancement:
  - **Android:** a very soft pulse at the start of each inhale (one 10–20 ms tick). Leave the exhale silent.
  - **iOS and desktop:** no haptics. Audio and visuals carry the cue alone.
- Feature-detect, make haptics user-toggleable, and default them to on only where supported.

## Accessibility and comfort

- Include a settings sheet: breath pace presets (4/8 default, 4/6 gentler, 3/6 shorter), sound on/off, haptics on/off, reduced motion (defaults to the OS setting).
- Make input targets large. Don't require precision or speed.
- Handle `visibilitychange`: pause cleanly when the tab hides and resume softly.
- Mobile: request a Screen Wake Lock during a session where supported, and support safe-area insets and both orientations (portrait first).

## Tech stack and repo

- Vite + TypeScript, with Three.js for rendering (custom shaders for water and light) and Web Audio for sound. No backend.
- Performance: target 60 fps on a mid-range phone. Cap the device pixel ratio at 2, keep particle counts adaptive, and lazy-load anything heavy.
- Structure: `src/core/breathClock.ts`, `src/core/input.ts`, `src/world/`, `src/audio/`, `src/haptics/`, `src/ui/`, `src/style/tokens.ts`.
- Unit-test `breathClock` and the input-blending logic (Vitest).
- Deploy on Vercel as a static site, connected to GitHub with preview deploys on PRs.
- Before you commit, write a README covering how to run, build and deploy.

## Order of work (stop at each checkpoint for my review)

1. **Plan:** read `docs/storyboard/`, write `docs/STYLE_BIBLE.md` and a short build plan. **Stop.**
2. **Grey-box loop:** a plain shape on a gradient with the breathClock, input, blending, follow mode, and progress-to-surface working. No art. **Stop** so I can feel the timing.
3. **Sound and haptics:** the breathing soundscape and the Android haptic tick. **Stop.**
4. **World pass:** the palette arc, light shafts, particles, droplet treatment, the surface break and ending. **Stop.**
5. **Polish and ship:** settings, reduced motion, wake lock, performance pass, deploy to Vercel. Send me the URL.

## Design spec (keep updated in `docs/DESIGN_SPEC.md`)

For every significant choice, add one row:

| Design choice | Root (principle or evidence) | Intended effect | How we'd know (signal) |
|---|---|---|---|

After the table, add:

- **Guardrail check:** flashing, motion, cognitive load, dark patterns, and copy (no health claims). Mark each pass or fail, with a note.
- **Open questions for playtest:** 2–3 questions that only a real player can answer.
- **What to try next:** one variation worth A/B-ing, such as hold-to-inhale vs. fully passive.

## Definition of done

- The game is playable at a public Vercel URL on desktop Chrome and Safari, iPhone Safari, and Android Chrome.
- The 4/8 timing is accurate to within about 50 ms over 15 cycles, and the session never punishes off-pace input.
- No frame shows more than three flashes per second.
- Reduced motion works.
- Audio starts only after a tap.
- The design spec, style bible and asset log are filled in.
