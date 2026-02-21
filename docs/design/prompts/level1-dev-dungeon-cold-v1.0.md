# Level 1 Prompt - Dev Dungeon Cold Start (v1.0)

- Model: Gemini Nano Banana Pro
- Use Case: 正式关卡图（可玩状态，冷色开局）
- Aspect Ratio: 16:9
- Level: Level 1 / Dev Dungeon

## Prompt

Generate a single isometric hi-bit pixel art level background for a playable puzzle stage.

Level context:
- Stage name: Dev Dungeon
- Theme: messy solo developer apartment at night, rainy and cold
- Mood: gloomy but cozy, subtle tension before room cleansing

Gameplay aware composition:
1) Build a clean 45 degree isometric cutaway room with clear walkable floor areas.
2) Include key props: desk setup, bookshelf, bed, standing mirror, sharp shelf corner, door flow path, balcony flow hint.
3) Ensure there are 4 plausible Feng Shui problem zones in layout logic: mirror to bed, sharp corner toward seat, straight airflow path, bad object in wealth corner.
4) Keep center and key interaction regions uncluttered for draggable compass gameplay.
5) Use prop placement and lighting to imply suspicious areas, but do not reveal exact answers visually.

Art direction:
- hi-bit pixel art, clean hard pixels, consistent pixel size
- palette around 48 to 64 colors, cool desaturated set
- soft rain ambience, monitor blue and moonlight blend
- medium contrast, avoid neon and overprocessed effects

Hard constraints:
- no explicit puzzle markers, no black spirit flames, no glowing target icons
- no text, no UI panels, no watermark, no characters
- maintain calm frame edges for HUD and modal overlays

Output:
- one 16:9 stage background, production ready for interactive layer

## Do Not Include

- Any direct clue icons that expose exact sha points
- Over dramatic FX that compete with UI readability
- Modern photoreal treatment

## Companion Data Requirement

Pair this image with a hotspots json file and store:
- sha point ids
- x and y positions
- trigger radius
- event copy and options
- correct option id

## Post Process

1. Indexed color reduce to 32 to 64.
2. Nearest neighbor pixel normalization.
3. Export as canonical cold stage for level track.

## Revision Notes

- v1.0：正式关卡图首版，强调可玩布局与不剧透答案。
