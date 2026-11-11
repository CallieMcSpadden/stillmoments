import {
  DEFAULT_TIMING,
  directionTo,
  nextPhase,
  sampleBurst,
  startBurst,
  type Burst,
  type Phase,
  type Vec,
} from './core/burst';
import { attachBreathInput } from './core/input';
import { GreyboxRenderer } from './world/greybox';

/** How far one breath (in or out) carries the droplet, in world units. */
const BREATH_DISTANCE = 0.2;
/** Surface height: about 12–13 full breaths straight up. */
const SURFACE_Y = 5;
const FLOOR_Y = -1.5;
/** After this long without input, the droplet breathes upward on its own. */
const REST_MS = 6000;
/** Pause at the surface before the ending appears. */
const ARRIVAL_HOLD_MS = 3500;
/** User breaths before the instructions fade away. */
const HINT_BREATHS = 3;

export interface SessionUI {
  canvas: HTMLCanvasElement;
  hint: HTMLElement;
  ending: HTMLElement;
}

export function startSession(ui: SessionUI): void {
  const renderer = new GreyboxRenderer(ui.canvas);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Clock that stops while the tab is hidden.
  let pausedAt: number | null = null;
  let pausedTotal = 0;
  const now = (): number => performance.now() - pausedTotal;

  let pos: Vec = { x: 0, y: 0 };
  let cam: Vec = { x: 0, y: 0 };
  let level = 0;
  let burst: Burst | null = null;
  let lastPhase: Phase | null = null;
  let lastActivity = now();
  let resting = false;
  let userBreaths = 0;
  let arrivedAt: number | null = null;
  let lastFrame = now();

  const currentState = (t: number): { pos: Vec; level: number } =>
    burst ? sampleBurst(burst, t) : { pos, level };

  const begin = (phase: Phase, dir: Vec): void => {
    const t = now();
    const cur = currentState(t);
    pos = cur.pos;
    level = cur.level;
    burst = startBurst(phase, t, pos, dir, BREATH_DISTANCE, level, DEFAULT_TIMING);
    lastPhase = phase;
  };

  attachBreathInput(ui.canvas, {
    nextPhase: () => nextPhase(lastPhase),
    onBreath: (phase, target) => {
      if (arrivedAt !== null) return;
      resting = false;
      const dir = target
        ? directionTo(currentState(now()).pos, renderer.screenToWorld(target.x, target.y, cam))
        : { x: 0, y: 1 };
      begin(phase, dir);
      userBreaths += 1;
      if (userBreaths >= HINT_BREATHS) ui.hint.classList.add('is-faded');
    },
  });

  window.addEventListener('resize', () => renderer.resize());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pausedAt = performance.now();
    else if (pausedAt !== null) {
      pausedTotal += performance.now() - pausedAt;
      pausedAt = null;
      lastFrame = now();
    }
  });

  ui.hint.textContent = window.matchMedia('(pointer: coarse)').matches
    ? 'Tap to breathe in toward your finger. Tap again to breathe out. Or rest, and the drop will rise on its own.'
    : 'Left-click to breathe in toward the cursor. Right-click to breathe out. Or rest, and the drop will rise on its own.';
  ui.hint.classList.add('is-visible');

  const frame = (): void => {
    const t = now();
    const dt = Math.min(100, t - lastFrame);
    lastFrame = t;

    if (burst) {
      const s = sampleBurst(burst, t);
      pos = s.pos;
      level = s.level;
      if (s.done) {
        burst = null;
        lastActivity = t;
        if (resting && arrivedAt === null) begin(nextPhase(lastPhase), { x: 0, y: 1 });
      }
    } else if (arrivedAt === null && t - lastActivity > REST_MS) {
      resting = true;
      begin(nextPhase(lastPhase), { x: 0, y: 1 });
    }

    // Keep the droplet in the water column.
    pos = { x: pos.x, y: Math.min(SURFACE_Y, Math.max(FLOOR_Y, pos.y)) };
    if (arrivedAt === null && pos.y >= SURFACE_Y - 1e-3) {
      arrivedAt = t;
      burst = null;
    }
    if (arrivedAt !== null) {
      level += (0.5 - level) * Math.min(1, dt / 1500); // settle to a calm, even glow
      if (t - arrivedAt > ARRIVAL_HOLD_MS && ui.ending.hidden) {
        ui.hint.classList.add('is-faded');
        ui.ending.hidden = false;
        requestAnimationFrame(() => ui.ending.classList.add('is-visible'));
      }
    }

    // The droplet roams freely near the centre, so you can see it travel toward the cursor.
    // The camera only moves to keep it from drifting off-screen (instant with reduced motion).
    const { w, h } = renderer.size;
    const zoneX = Math.max(0.08, (w / renderer.unit) * 0.5 - 0.2);
    const zoneY = Math.max(0.08, Math.min(0.24, (h / renderer.unit) * 0.5 - 0.2));
    const camTarget = {
      x: Math.min(pos.x + zoneX, Math.max(pos.x - zoneX, cam.x)),
      y: Math.min(pos.y + zoneY, Math.max(pos.y - zoneY, cam.y)),
    };
    const k = reducedMotion.matches ? 1 : 1 - Math.exp(-dt / 900);
    cam = { x: cam.x + (camTarget.x - cam.x) * k, y: cam.y + (camTarget.y - cam.y) * k };

    const ring = burst ? { progress: sampleBurst(burst, t).progress, phase: burst.phase } : null;
    renderer.draw({
      nowMs: t,
      pos,
      cam,
      level,
      depthProgress: Math.max(0, pos.y) / SURFACE_Y,
      ring,
      reducedMotion: reducedMotion.matches,
    });
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
