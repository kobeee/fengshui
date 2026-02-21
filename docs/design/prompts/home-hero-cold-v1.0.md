# Home Hero Prompt — Cold Mood (v1.0)

- Model: Gemini Nano Banana Pro
- Use Case: 首页主插图（进入游戏后的全屏房间底图，冷色开局）
- Aspect Ratio: 16:9
- Target Feeling: moody, cozy, mystery, readable for gameplay overlays

## Prompt

```text
Create a single, high-detail isometric pixel-art room illustration for an indie puzzle game homepage.

Intent and context:
- This image is the main gameplay background for a Feng Shui puzzle game.
- The room must feel "cold and slightly chaotic" before cleansing.
- Keep composition readable for UI overlays and draggable gameplay elements.

Step-by-step composition:
1) Build a clean isometric cutaway of a small studio apartment bedroom/home office, viewed at a 45-degree isometric angle.
2) Place furniture and props with believable lived-in clutter: desk with monitor glow, unmade bed, bookshelf, standing mirror, window with rainy mood, a few pizza boxes, indoor plants.
3) Embed subtle Feng Shui problem hints (not explicit labels): mirror facing bed, sharp shelf corner pointing toward seating area, airflow path from door toward balcony, one "wealth corner" occupied by an unsuitable object.
4) Add 3-4 tiny soot-like spirit wisps near problem spots as soft visual clues.
5) Leave the center gameplay area relatively open and readable for a draggable compass interaction.

Art direction and rendering:
- hi-bit pixel art, crisp and clean pixel clusters, unified pixel size, no painterly blur
- limited palette (around 48-64 colors), desaturated cool tones
- palette anchor: charcoal navy, slate blue, muted steel, soft moonlight gray
- only a very small touch of warm accent color in tiny details (less than 5% of frame)
- soft rainy evening ambience, monitor blue light + weak window light
- medium contrast, avoid neon saturation

Framing rules:
- keep 10-15% outer edges visually calmer (for HUD and text overlays)
- no characters, no dialogue bubbles, no UI panels
- no logos, no watermark, no text in the image

Output:
- 16:9 composition, game-ready background illustration
- maintain strong depth separation between floor, furniture, and walls
```

## Do Not Include

- Any typography, icon labels, HUD, button-like UI blocks
- Overly colorful gradients, bloom glow, or modern glossy effects
- Photorealistic rendering (must remain pixel-art style)

## Post Process

1. Indexed color reduce to 32-64 colors.
2. Downscale then upscale with nearest-neighbor to unify pixel grid.
3. Keep this composition as canonical layout for the future warm/clear variant.

## Revision Notes

- v1.0 初版：强调“低饱和中性 + 可交互留白 + 煞点隐性线索”。
