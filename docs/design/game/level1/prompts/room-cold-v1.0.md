# Level 1 - 冷色底图提示词 (v1.0)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 正式关卡图（可玩状态，冷色开局） |
| **模型建议** | Gemini Nano Banana Pro / Midjourney |
| **宽高比** | 16:9 |
| **输出尺寸** | 建议先生成 1920x1080，后期可缩放 |
| **关联关卡** | Level 1 - 开发者的地牢 |

---

## 完整提示词

```text
Generate a single isometric hi-bit pixel art level background for a playable puzzle stage.

Level context:
- Stage name: Dev Dungeon (Developer's Apartment)
- Theme: messy solo developer apartment at night, rainy and cold
- Mood: gloomy but cozy, subtle tension before room cleansing

Gameplay aware composition:
1) Build a clean 45 degree isometric cutaway room with clear walkable floor areas.
2) Include key props: 
   - Desk with monitors (glowing blue), keyboard, chair
   - Bed with disheveled sheets
   - Standing mirror (facing the bed direction)
   - Bookshelf with sharp visible corner (pointing toward desk area)
   - Main entrance door
   - Balcony/sliding glass door (visible on opposite side)
   - Ceiling beam running above the bed head
3) Ensure there are 4 plausible Feng Shui problem zones embedded in layout logic:
   - Mirror positioned to face the bed directly
   - Bookshelf sharp corner pointing at desk/chair
   - Ceiling beam directly above bed head
   - Straight sight line from entrance door to balcony door
4) Keep center and key interaction regions uncluttered for draggable compass gameplay.
5) Use prop placement and subtle lighting to imply suspicious areas, but do NOT reveal exact answers visually.

Art direction:
- Hi-bit pixel art, clean hard pixels, consistent pixel size
- Palette around 48 to 64 colors, cool desaturated set
- Soft rain ambience visible through windows
- Monitor blue glow mixed with cold moonlight
- Medium contrast, avoid neon and overprocessed effects
- Slight film grain or noise acceptable for atmosphere

Hard constraints:
- NO explicit puzzle markers (no black spirit flames, no glowing target icons)
- NO text, NO UI panels, NO watermark, NO characters
- Maintain calm frame edges for HUD and modal overlays
- All furniture and props must have clean silhouettes for later overlay work

Output:
- One 16:9 stage background, production ready for interactive layer
- Export as PNG with transparency support for potential layer separation
```

---

## 生成后处理

1. **色彩索引化**: 将图片转为索引颜色模式，限制 32-64 色
2. **像素标准化**: 使用邻近采样 (Nearest Neighbor) 确保像素边缘锐利
3. **尺寸校准**: 如需要，缩小到 320x180 再用邻近算法放大到目标尺寸
4. **导出格式**: PNG-24，保持高质量

---

## 煞气场景检查清单

生成后检查以下 4 个煞气是否在画面中合理呈现：

| 煞气 | 视觉元素 | 检查项 |
|-----|---------|--------|
| 镜冲床 | 落地镜位置 | 镜子是否正对床铺方向？ |
| 尖角煞 | 书架尖角 | 书架角是否指向书桌/椅子区域？ |
| 横梁压顶 | 天花板横梁 | 横梁是否在床头上方？ |
| 门冲 | 入口门-阳台门 | 两门是否形成直线贯通？ |

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v1.0 | 2026-02-20 | 基于 `docs/design/prompts/level1-dev-dungeon-cold-v1.0.md` 重构 |