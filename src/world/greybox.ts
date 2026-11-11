import { palette, dropletGlow, depthArc } from '../style/tokens';
import { makeRamp, rgba } from '../style/color';
import type { Vec } from '../core/burst';

/**
 * Grey-box renderer (Canvas 2D). It's only here to judge timing and feel;
 * checkpoint 4 replaces it with the Three.js world.
 * Nothing here flashes: every value changes continuously and slowly.
 */

export interface FrameState {
  nowMs: number;
  pos: Vec; // droplet, world units (1 unit = shorter screen side)
  cam: Vec; // camera centre, world units
  level: number; // 0 exhaled .. 1 inhaled
  depthProgress: number; // 0 deep .. 1 surface
  ring: { progress: number; phase: 'inhale' | 'exhale' } | null;
  reducedMotion: boolean;
}

interface Mote {
  x: number;
  y: number;
  z: number; // parallax depth 0.35..1
  size: number;
  seed: number;
}

const MOTE_COUNT = 72;
const TILE = 2.4; // world units; motes repeat across this tile
/** Droplet sits a little below centre so there's room to rise. */
export const ANCHOR_Y = 0.56;

const bgRamp = makeRamp(depthArc);
const glowRamp = makeRamp([dropletGlow.deep, dropletGlow.mid, dropletGlow.dawn]);
const lightRamp = makeRamp([palette.mid.surfaceLight, palette.shallow.ray, palette.dawn.cream]);

export class GreyboxRenderer {
  private ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private motes: Mote[] = [];

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D not supported');
    this.ctx = ctx;
    let s = 7;
    const rand = (): number => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < MOTE_COUNT; i++) {
      this.motes.push({
        x: rand() * TILE,
        y: rand() * TILE,
        z: 0.35 + rand() * 0.65,
        size: 0.6 + rand() * 1.6,
        seed: rand() * 1000,
      });
    }
    this.resize();
  }

  /** Pixels per world unit. */
  get unit(): number {
    return Math.min(this.w, this.h);
  }

  get size(): { w: number; h: number } {
    return { w: this.w, h: this.h };
  }

  resize(): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
  }

  /** Screen pixels to world units, given the camera. */
  screenToWorld(sx: number, sy: number, cam: Vec): Vec {
    return {
      x: cam.x + (sx - this.w / 2) / this.unit,
      y: cam.y - (sy - this.h * ANCHOR_Y) / this.unit,
    };
  }

  private worldToScreen(p: Vec, cam: Vec): Vec {
    return {
      x: this.w / 2 + (p.x - cam.x) * this.unit,
      y: this.h * ANCHOR_Y - (p.y - cam.y) * this.unit,
    };
  }

  draw(f: FrameState): void {
    const { ctx, w, h } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const d = f.depthProgress;

    // Water column: slightly lighter above, darker below.
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, rgba(bgRamp(Math.min(1, d + 0.1))));
    bg.addColorStop(0.55, rgba(bgRamp(d)));
    bg.addColorStop(1, rgba(bgRamp(Math.max(0, d - 0.12))));
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Light from above strengthens as the droplet rises.
    const light = ctx.createRadialGradient(w / 2, -h * 0.15, 0, w / 2, -h * 0.15, h * 1.1);
    light.addColorStop(0, rgba(lightRamp(d), 0.06 + 0.34 * d));
    light.addColorStop(1, rgba(lightRamp(d), 0));
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, w, h);

    this.drawMotes(f);
    this.drawDroplet(f);
  }

  private drawMotes(f: FrameState): void {
    const { ctx, unit } = this;
    const t = f.nowMs / 1000;
    const tilePx = TILE * unit;
    ctx.fillStyle = rgba(lightRamp(f.depthProgress), 1);
    for (const m of this.motes) {
      const driftX = f.reducedMotion ? 0 : Math.sin(t * 0.05 + m.seed) * 0.03;
      const driftY = f.reducedMotion ? 0 : Math.sin(t * 0.035 + m.seed * 1.3) * 0.03;
      const sx = mod((m.x + driftX - f.cam.x * m.z) * unit, tilePx);
      const sy = mod((-(m.y + driftY) + f.cam.y * m.z) * unit, tilePx);
      ctx.globalAlpha = 0.14 + 0.3 * m.z;
      for (let ox = sx - tilePx; ox < this.w + tilePx; ox += tilePx) {
        for (let oy = sy - tilePx; oy < this.h + tilePx; oy += tilePx) {
          if (ox < -4 || oy < -4 || ox > this.w + 4 || oy > this.h + 4) continue;
          ctx.beginPath();
          ctx.arc(ox, oy, m.size * m.z, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  private drawDroplet(f: FrameState): void {
    const { ctx } = this;
    const p = this.worldToScreen(f.pos, f.cam);
    const r = 0.042 * this.unit * (1 + 0.06 * f.level);
    const glow = glowRamp(f.depthProgress);

    // Halo widens on the inhale.
    const haloR = r * (2.4 + 1.6 * f.level);
    const halo = ctx.createRadialGradient(p.x, p.y, r * 0.6, p.x, p.y, haloR);
    halo.addColorStop(0, rgba(glow, 0.1 + 0.16 * f.level));
    halo.addColorStop(1, rgba(glow, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
    ctx.fill();

    // Glass body with light pooled at the base.
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = rgba(bgRamp(Math.max(0, f.depthProgress - 0.05)), 0.75);
    ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
    const pool = ctx.createRadialGradient(p.x, p.y + r * 0.75, 0, p.x, p.y + r * 0.75, r * 1.3);
    pool.addColorStop(0, rgba(glow, 0.65 + 0.3 * f.level));
    pool.addColorStop(1, rgba(glow, 0));
    ctx.fillStyle = pool;
    ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
    ctx.restore();

    // Soft highlight, top-left (capped below white).
    const hl = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.4, 0, p.x - r * 0.35, p.y - r * 0.4, r * 0.45);
    hl.addColorStop(0, 'rgba(234, 246, 244, 0.55)');
    hl.addColorStop(1, 'rgba(234, 246, 244, 0)');
    ctx.fillStyle = hl;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(183, 215, 234, 0.28)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Grey-box timing ring: fills over the length of the current breath.
    if (f.ring) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 1.9, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * f.ring.progress);
      ctx.strokeStyle =
        f.ring.phase === 'inhale' ? rgba(glow, 0.42) : 'rgba(183, 215, 234, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }
}

const mod = (a: number, n: number): number => ((a % n) + n) % n;
