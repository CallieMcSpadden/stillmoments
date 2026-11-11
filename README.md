# Still Moments

A calm-first, breath-paced game for desktop and mobile web. You guide a single drop of water through the water cycle in gentle bursts: gather on a 4-second inhale, glide on an 8-second exhale. There are no scores, timers or ways to fail, just a few quiet minutes to settle between commitments.

**Status:** pre-build scaffold. The first playable slice (rising from deep water to the surface at dawn) is built in checkpoints; see [`docs/BRIEF.md`](docs/BRIEF.md).

## Run it locally

You need [Node.js](https://nodejs.org) 20.19 or later.

```bash
npm install        # first time only
npm run dev        # open the printed localhost link
```

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with live reload |
| `npm run dev:phone` | Same, but reachable from your phone on the same Wi-Fi (use the "Network" URL it prints) |
| `npm run build` | Type-check and build the production site into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run unit tests (Vitest) |

## Deploy

Hosting is on [Vercel](https://vercel.com), connected to this GitHub repo:

1. In Vercel, choose **Add New → Project** and import `stillmoments`.
2. Keep the detected settings (Framework: **Vite**, Build: `npm run build`, Output: `dist`) and click **Deploy**.
3. Every push to `main` redeploys the live site, and every pull request gets its own preview link.

## Project layout

```
index.html              page shell
public/                 static files (favicon)
src/
  main.ts               entry point: intro, first tap, session start
  styles.css            base styles (calm palette, reduced-motion support)
  style/tokens.ts       palette tokens from the storyboard
  core/                 breathClock, input blending (checkpoint 2)
  world/                Three.js scene, shaders, particles (checkpoint 4)
  audio/                generated Web Audio soundscape (checkpoint 3)
  haptics/              Android-only haptic tick (checkpoint 3)
  ui/                   settings sheet, ending screen
docs/
  BRIEF.md              build brief and checkpoints
  storyboard/           reference frames + notes.md (palette, droplet spec)
CLAUDE.md               project context for Claude Code
```

## Design guardrails

- No flashing: follows WCAG 2.3.1, with no more than 3 flashes per second.
- Respects your device's reduced-motion setting.
- No fail states, scores, streaks or timers.
- Audio starts only after you tap. Sound and haptics can be turned off.
- Breath pacing is an invitation: if you don't press anything, the droplet rises on its own.
