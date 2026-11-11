/**
 * Palette tokens sampled from the storyboard (docs/storyboard/notes.md),
 * with guardrail corrections: no pure black or pure white anywhere.
 */
export const palette = {
  deep: { floor: '#060a24', water: '#111a4d', violet: '#14174e', glow: '#6fd3b2' },
  mid: { indigo: '#100e56', blue: '#2c60a7', teal: '#3693bd', surfaceLight: '#5ed1d5' },
  shallow: {
    deep: '#4d9ea4',
    teal: '#5eb6c0',
    ray: '#9be1f1',
    surface: '#b4f4f6',
    hotCap: '#eaf6f4',
  },
  surface: { waterDeep: '#205b6e', water: '#3e757f', waterGlow: '#809f8d' },
  dawn: {
    mauve: '#a29995',
    rose: '#ddb496',
    peach: '#dfc1a4',
    gold: '#f8ddab',
    cream: '#f9e4c7',
  },
  fog: { shadow: '#61809c', mid: '#95b4cc', light: '#b7d7ea', sunCap: '#eaf4f6' },
  sky: { cloud: '#76aae2', violet: '#5076bd', twilight: '#13175f' },
  rain: { valley: '#3b6887', mist: '#93bcd9' },
} as const;

/** Hero droplet inner-light color by environment. */
export const dropletGlow = {
  deep: '#6fd3b2',
  mid: '#bfeef5',
  dawn: '#f2d29a',
  fogCloud: '#e6eef2',
} as const;

/**
 * Background color stops for the first slice, deep to surface.
 * Interpolate in OKLCH (not RGB) so teal-to-gold doesn't turn muddy.
 */
export const depthArc = [
  palette.deep.floor,
  palette.deep.water,
  palette.mid.indigo,
  palette.mid.teal,
  palette.shallow.teal,
  palette.shallow.surface,
  palette.surface.waterGlow,
  palette.dawn.gold,
] as const;
