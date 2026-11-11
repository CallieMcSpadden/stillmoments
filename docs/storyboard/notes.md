# Storyboard notes: Water Drop

> Put this file at `docs/storyboard/notes.md`. Claude Code reads it alongside the frames at checkpoint 1.

## How to use these frames

These are reference frames for mood, palette, light quality, and composition. Don't trace or embed them. Build the world procedurally and match the *feel*. Hex values were sampled from the frames. Where a frame breaks a guardrail, the note says so and gives the corrected value.

## File order and per-frame notes

| File | Beat | Keep | Change |
|---|---|---|---|
| `01-deep-opening.png` | Session start (cycle 0) | Minimal, almost empty frame. A single point of light. Very calm first impression. | Bottom corners hit pure black (#000003). Lift the floor to about **#060a24**. Faint particles are good; keep them at that density. |
| `02-deep.png` | Deep water (cycles 1–3) | **Signature droplet treatment:** clear glass sphere, soft highlight on top, inner luminescence pooled at the base (green-teal #6fd3b2). Indigo-violet water. Sparse micro-bubbles. | The painterly band at the top is blotchy. Use a smooth gradient instead. |
| `03-mid-depth.png` | Mid-depth, first light (cycles 4–7) | Top-down teal light (#5ed1d5) bleeding into indigo (#100e56). Faint vertical light columns. Drifting particles. Soft halo around the droplet. | The droplet glows near-white. Treat this brightness as the **inhale peak**, not the resting state. Thin the particles by about 40%. |
| `04-shallows.png` | Shallows, sun rays (cycles 8–11) | Broad, soft god rays fanning from a rippled surface. Warm gold flecks in the surface caustics, the first warmth in the arc. Caustic light on the floor. Clear glass droplet refracting the surface. | The droplet's base hotspot reaches #fcfcfa: cap it at **#eaf6f4**. The rays and teal are bright, so add a slight vignette to keep the droplet the clearest point. **Caustics must animate slowly** (a drift over several seconds, no shimmering); fast caustic ripple is a flicker risk. |
| `05-surface.png` | Approaching the surface → arrival (cycles 12–15 + ending) | **The payoff frame.** Warm peach-gold dawn sky over a misty sea, the sun's glow bleeding into the water as soft rays, teal deepening downward. The droplet, off-center, refracts the gold, matching the dawn inner-light token. | The waterline is a hard, crisp edge. Soften it with a faint meniscus glow and a few pixels of blur. This frame shows the droplet just *below* the surface; the actual break is animated (the droplet rises through the line, gentle ring ripples, a lingering hold). |
| `06-fog.png` | Evaporation / fog | Layered blue-grey haze, a bokeh field of out-of-focus droplets, a diffuse sun, glassy water. Best "between realistic and dreamy" balance in the set. | All cool. Add warm cream/gold (#f3e3c8) around the sun. The sun disc is near-white (#f0ffff): cap it at about **#eaf4f6**. Reduce foreground bokeh so the hero leads. |
| `09-upper-atmosphere.png` | Optional branch: rising to the dark | Color gradient: cloud sea (#76aae2) to violet (#5076bd) to twilight navy (#13175f). Faint stars. Sense of vastness. | **Droplet is wrong:** a flat, icon-style teardrop that breaks the style and the science. Use the 02 sphere treatment. Regenerate or ignore the droplet. |
| `10-rain.png` | Raining down | Most realistic frame. Refraction shows the inverted landscape inside the drop. Misty green valley. Faint rain streaks. Gentle, not stormy. | Pointed teardrop top. Real raindrops are spherical, or flattened at the base when larger. Use a sphere with a slightly flattened base. |

## Hero droplet spec (consistent across all scenes)

- **Form:** a clear glass-like sphere (from 02 and 06). Never a teardrop.
- **Surface:** soft specular highlight top-left, faint environment refraction inside.
- **Inner light:** luminescence pools at the base, and its color follows the environment:
  - deep: green-teal **#6fd3b2**
  - mid: aqua-white **#bfeef5**
  - dawn/surface: warm gold **#f2d29a**
  - fog/cloud: pearl **#e6eef2**
- **Breath states:**
  - inhale: about 6% larger, inner light brighter, halo widens (like 03)
  - exhale: smaller, softer halo, light settles toward the base (like 02)
- The droplet is always the clearest point on screen. Background bokeh and particles never compete with it.

## Palette tokens (sampled, with guardrail corrections)

```
deep.floor      #060a24   (was #000003 / #030416, lifted: no pure black)
deep.water      #111a4d
deep.violet     #14174e
deep.glow       #6fd3b2
mid.indigo      #100e56
mid.blue        #2c60a7
mid.teal        #3693bd
mid.surfaceLight #5ed1d5
fog.shadow      #61809c
fog.mid         #95b4cc
fog.light       #b7d7ea
fog.sunCap      #eaf4f6   (cap: no pure white)
sky.cloud       #76aae2
sky.violet      #5076bd
sky.twilight    #13175f
rain.valley     #3b6887
rain.mist       #93bcd9
shallow.deep    #4d9ea4
shallow.teal    #5eb6c0
shallow.ray     #9be1f1
shallow.surface #b4f4f6
shallow.hotCap  #eaf6f4   (cap: droplet hotspot was #fcfcfa)
surface.waterDeep #205b6e
surface.water   #3e757f
surface.waterGlow #809f8d
dawn.mauve      #a29995
dawn.rose       #ddb496
dawn.peach      #dfc1a4
dawn.gold       #f8ddab
dawn.cream      #f9e4c7
```

**Depth arc for the slice:** deep.floor → deep.water → mid.indigo → mid.teal → shallow.teal → shallow.surface → surface.waterGlow → dawn.gold. Interpolate in a perceptual color space (OKLCH), not RGB, so the teal-to-gold blend doesn't go muddy grey.

## Gaps in the storyboard

1. ~~No warm frames~~ Done: 04 and 05 complete the first playable slice (01–05).
2. Still to do for later quests: clouds interior, condensation nucleus, soil, roots, stem, leaf pores, closing landscape.
3. The 16:9 frames are fine for desktop. Make portrait (9:16) crops of 01–05 for mobile composition.
4. Optional: frame 03 (mid-depth) is more violet than 04's teal, so the jump between them is large. The game interpolates between them, so a bridging frame isn't required.

## Global notes

- Keep particle density sparse: 02 is about right, 03 is the upper limit. Animate shimmer as slow brightness drift, never a twinkle.
- Light comes from above everywhere. Rising toward the light is the core visual metaphor.
- Edges are soft everywhere. No outlines, no hard shadows.
