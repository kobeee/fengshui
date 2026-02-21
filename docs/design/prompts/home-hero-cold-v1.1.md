# Home Hero Prompt — Cold Mood (v1.1)

- Model: Gemini Nano Banana Pro
- Use Case: 首页主插图（启动氛围图，不是正式关卡）
- Aspect Ratio: 16:9
- Target Feeling: moody, cozy, mystery, calm

## Prompt

```text
Create one high-detail isometric hi-bit pixel-art bedroom/home-office scene for a game homepage hero image.

Intent:
- This is a mood-setting homepage illustration, not a playable puzzle level.
- Convey “cold, rainy, slightly messy, late-night” atmosphere.
- Keep central area readable for future UI overlays.

Scene construction:
1) Build a clean 45-degree isometric cutaway room with strong depth separation.
2) Include lived-in props: desk + monitor glow, bed, bookshelf, mirror, window with rain streaks, small clutter.
3) Keep furniture believable and tasteful, avoid excessive clutter.
4) Keep the composition balanced and cinematic, with breathing room in the center.

Art direction:
- hi-bit pixel art, crisp pixel clusters, unified pixel size, no painterly blur
- limited palette (about 48-64 colors)
- cool desaturated tones: charcoal navy, slate blue, steel gray
- subtle rim lighting from window and monitor
- medium contrast, no neon, no oversaturation

Important constraints:
- Do NOT render explicit puzzle markers or obvious "sha-point" indicators
- If any mysterious cue is needed, allow at most one tiny, ambiguous wisp in the far background
- no characters, no speech bubbles, no UI panels, no text, no watermark

Output:
- 16:9 game-ready background artwork
- calm edges suitable for HUD/text overlay
```

## Do Not Include

- Multiple explicit black spirit markers (no 3-4 visible clue points)
- Any answer-revealing gameplay hints
- Bright cyber colors, glossy modern gradients, photoreal texture

## Post Process

1. Indexed color to 32-64 colors.
2. Downscale then upscale with nearest-neighbor for pixel uniformity.
3. Treat this as homepage-only art track (`home-*`).

## Revision Notes

- v1.1：从 v1.0 调整为“首页不剧透”，移除多煞点显性提示。
