# Still Moments

A calm-first, breath-paced water-cycle game for desktop and mobile web. The player guides a single water droplet in bursts: a 4 s inhale to gather, then an 8 s exhale to glide. The audience is students and professionals who feel overwhelmed between commitments.

## Where things are
- `docs/BRIEF.md`: the full build brief and the order of work. Follow its checkpoints, and **stop at each one for review**.
- `docs/storyboard/`: reference frames 01–10 plus `notes.md`, which has per-frame notes, the hero droplet spec and the palette tokens. The frames are reference for mood and color only. Build the world procedurally; don't trace or embed the frames.
- Keep these updated: `docs/STYLE_BIBLE.md`, `docs/DESIGN_SPEC.md`, `docs/ASSETS.md`.

## Guardrails (always apply)
- No flashing: follow WCAG 2.3.1, with no more than 3 flashes per second. Shimmer and caustics must drift slowly.
- Respect `prefers-reduced-motion`.
- No fail states, scores, timers, streaks or loss messaging.
- No health claims in player-facing copy. Use "stress," "settle," "breathe."
- Breath pacing is an invitation, never a correction. Off-pace input blends back to the pacer, and with no input the droplet rises on its own.
- Audio starts only after a user tap. Don't use 40 Hz content.
- Colors never use pure black (#000) or pure white (#fff).
- Haptics are Android-only progressive enhancement, because iOS has no Vibration API.

## Stack
- Vite + TypeScript + Three.js (custom shaders) + Web Audio (generated sound). No backend.
- Unit tests use Vitest.
- Deploy to Vercel from GitHub `main`. PRs get preview deploys.
