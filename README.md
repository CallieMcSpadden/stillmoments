# Still Moments

A calm-first, breath-paced game for desktop and mobile web. You guide a single drop of water through the water cycle in gentle bursts: gather on a 4-second inhale, glide on an 8-second exhale. There are no scores, timers or ways to fail, just a few quiet minutes to settle between commitments.

**Status:** grey-box prototype. The breathing controls, timing and rise to the surface are playable, without final art or sound. The rest is built in checkpoints; see [`docs/BRIEF.md`](docs/BRIEF.md).

**How to play:** left-click to breathe in (the drop gathers toward your cursor for 4 seconds), right-click to breathe out (it glides toward the cursor for 8 seconds). On a phone, taps alternate in and out. Or just rest: after a few seconds the drop breathes upward on its own.

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
  session.ts            game loop: breaths, rest mode, camera, arrival
  styles.css            base styles (calm palette, reduced-motion support)
  style/tokens.ts       palette tokens from the storyboard
  style/color.ts        OKLCH color blending for the depth arc
  core/                 breath bursts (timing + easing) and click/tap input
  world/                grey-box renderer now; Three.js world at checkpoint 4
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
