import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TIMING,
  directionTo,
  easeOutCubic,
  nextPhase,
  sampleBurst,
  startBurst,
} from './burst';

const origin = { x: 0, y: 0 };
const up = { x: 0, y: 1 };

describe('breath bursts', () => {
  it('inhale lasts 4 s and exhale lasts 8 s by default', () => {
    expect(startBurst('inhale', 0, origin, up, 1, 0).durationMs).toBe(4000);
    expect(startBurst('exhale', 0, origin, up, 1, 1).durationMs).toBe(8000);
    expect(DEFAULT_TIMING).toEqual({ inhaleMs: 4000, exhaleMs: 8000 });
  });

  it('covers the full distance exactly at the end of the phase', () => {
    const b = startBurst('inhale', 1000, origin, up, 0.2, 0);
    expect(sampleBurst(b, 4999).done).toBe(false);
    const end = sampleBurst(b, 5000);
    expect(end.done).toBe(true);
    expect(end.pos.y).toBeCloseTo(0.2, 10);
    expect(end.pos.x).toBeCloseTo(0, 10);
  });

  it('inhale is symmetric: halfway in time is halfway in distance', () => {
    const b = startBurst('inhale', 0, origin, up, 1, 0);
    expect(sampleBurst(b, 2000).pos.y).toBeCloseTo(0.5, 10);
  });

  it('exhale front-loads its movement, then settles', () => {
    const b = startBurst('exhale', 0, origin, up, 1, 1);
    const atQuarter = sampleBurst(b, 2000).pos.y;
    expect(atQuarter).toBeCloseTo(easeOutCubic(0.25), 10);
    expect(atQuarter).toBeGreaterThan(0.5); // more than half the glide in the first quarter
  });

  it('moves the same distance per phase, so the exhale is half the speed of the inhale', () => {
    const inh = sampleBurst(startBurst('inhale', 0, origin, up, 1, 0), 4000).pos.y;
    const exh = sampleBurst(startBurst('exhale', 0, origin, up, 1, 1), 8000).pos.y;
    expect(inh).toBeCloseTo(exh, 10);
  });

  it('breath level rises on inhale and falls on exhale, continuing from where it was', () => {
    const inh = startBurst('inhale', 0, origin, up, 1, 0.4);
    expect(sampleBurst(inh, 0).level).toBeCloseTo(0.4, 10);
    expect(sampleBurst(inh, 4000).level).toBeCloseTo(1, 10);
    const exh = startBurst('exhale', 0, origin, up, 1, 1);
    expect(sampleBurst(exh, 8000).level).toBeCloseTo(0, 10);
  });

  it('points toward the target, or straight up when the target is on the droplet', () => {
    const d = directionTo({ x: 1, y: 1 }, { x: 4, y: 5 });
    expect(d.x).toBeCloseTo(0.6, 10);
    expect(d.y).toBeCloseTo(0.8, 10);
    expect(directionTo(origin, origin)).toEqual(up);
  });

  it('alternates phases, starting with an inhale', () => {
    expect(nextPhase(null)).toBe('inhale');
    expect(nextPhase('inhale')).toBe('exhale');
    expect(nextPhase('exhale')).toBe('inhale');
  });
});
