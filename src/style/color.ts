/**
 * Color interpolation in OKLCH, so blends like teal to gold stay luminous
 * instead of passing through muddy grey (as they would in RGB).
 */

type Rgb = [number, number, number];
type Lch = [number, number, number];

const toLinear = (c: number): number => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number): number =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.max(c, 0) ** (1 / 2.4) - 0.055;

export function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function rgbToOklch([r, g, b]: Rgb): Lch {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), Math.atan2(B, A)];
}

function oklchToRgb([L, C, h]: Lch): Rgb {
  const A = C * Math.cos(h);
  const B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return [toGamma(r), toGamma(g), toGamma(b)].map((c) => Math.min(1, Math.max(0, c))) as Rgb;
}

function mixLch(a: Lch, b: Lch, t: number): Lch {
  let dh = b[2] - a[2];
  if (dh > Math.PI) dh -= 2 * Math.PI;
  if (dh < -Math.PI) dh += 2 * Math.PI;
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + dh * t];
}

/** A reusable gradient through color stops, sampled at t in 0..1. */
export function makeRamp(stops: readonly string[]): (t: number) => Rgb {
  const lch = stops.map((s) => rgbToOklch(hexToRgb(s)));
  return (t: number): Rgb => {
    const x = Math.min(1, Math.max(0, t)) * (lch.length - 1);
    const i = Math.min(lch.length - 2, Math.floor(x));
    return oklchToRgb(mixLch(lch[i], lch[i + 1], x - i));
  };
}

export const rgba = ([r, g, b]: Rgb, a = 1): string =>
  `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
