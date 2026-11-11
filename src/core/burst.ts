/**
 * Breath bursts: the droplet's movement model.
 *
 * Each breath moves the droplet a fixed distance in a chosen direction:
 * - inhale: over `inhaleMs` (default 4 s), ease-in-out ("gather")
 * - exhale: over `exhaleMs` (default 8 s), ease-out: most movement early, then settling ("glide")
 *
 * Same distance and different durations mean the inhale is quicker and the exhale
 * slower and longer, so the motion carries the breath rhythm.
 *
 * World coordinates: x to the right, y UP (toward the surface).
 */

export type Phase = 'inhale' | 'exhale';

export interface Vec {
  x: number;
  y: number;
}

export interface BreathTiming {
  inhaleMs: number;
  exhaleMs: number;
}

export const DEFAULT_TIMING: BreathTiming = { inhaleMs: 4000, exhaleMs: 8000 };

export interface Burst {
  phase: Phase;
  startMs: number;
  durationMs: number;
  from: Vec;
  dir: Vec; // unit vector
  distance: number;
  /** Breath level (0 = fully out, 1 = fully in) when this burst began. */
  startLevel: number;
}

export interface BurstSample {
  pos: Vec;
  /** 0..1 through the burst. */
  progress: number;
  /** 0 = fully exhaled, 1 = fully inhaled. Drives droplet swell and glow. */
  level: number;
  done: boolean;
}

export const easeInOutSine = (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2;
export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));

/** Unit vector from `from` toward `target`; straight up if they coincide. */
export function directionTo(from: Vec, target: Vec): Vec {
  const dx = target.x - from.x;
  const dy = target.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return { x: 0, y: 1 };
  return { x: dx / len, y: dy / len };
}

export function startBurst(
  phase: Phase,
  nowMs: number,
  from: Vec,
  dir: Vec,
  distance: number,
  startLevel: number,
  timing: BreathTiming = DEFAULT_TIMING,
): Burst {
  return {
    phase,
    startMs: nowMs,
    durationMs: phase === 'inhale' ? timing.inhaleMs : timing.exhaleMs,
    from: { ...from },
    dir: { ...dir },
    distance,
    startLevel: clamp01(startLevel),
  };
}

export function sampleBurst(burst: Burst, nowMs: number): BurstSample {
  const progress = clamp01((nowMs - burst.startMs) / burst.durationMs);
  const eased = burst.phase === 'inhale' ? easeInOutSine(progress) : easeOutCubic(progress);
  const travelled = burst.distance * eased;
  const targetLevel = burst.phase === 'inhale' ? 1 : 0;
  return {
    pos: {
      x: burst.from.x + burst.dir.x * travelled,
      y: burst.from.y + burst.dir.y * travelled,
    },
    progress,
    level: burst.startLevel + (targetLevel - burst.startLevel) * eased,
    done: progress >= 1,
  };
}

/** The phase that naturally follows another (used for taps, keyboard and rest mode). */
export const nextPhase = (last: Phase | null): Phase => (last === 'inhale' ? 'exhale' : 'inhale');
