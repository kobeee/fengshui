# 道具提示词 - 阔叶绿植 (Broad-leaf Plant v1.0)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **道具 ID** | `plant-broad` |
| **名称** | 阔叶绿植 |
| **用途** | 化解尖角煞 |
| **解决煞气** | sha-002 (尖角煞) |
| **素材类型** | 透明背景 PNG |

---

## 完整提示词

```text
Generate a pixel art sprite of a Feng Shui broad-leaf potted plant for an isometric puzzle game.

Object description:
- Medium-sized potted plant with 3-4 large, round leaves
- Ceramic or terracotta pot in warm earth tones
- Leaves should be healthy green with subtle warm highlights
- No flowers (clean, peaceful aesthetic)
- Subtle golden/amber glow on leaf edges (representing positive Qi flow)

Technical requirements:
- Isometric 45 degree angle, matching room perspective
- Transparent background (alpha channel)
- Hi-bit pixel art style, consistent with room background
- Max 32 colors in palette
- Clean pixel edges, no anti-aliasing
- Leaves should appear soft and rounded (matching the "化解尖锐" symbolism)

Size reference:
- Medium floor plant, about knee-to-waist height in game scale
- Pot width approximately 15-20 pixels
- Total height approximately 25-35 pixels

Optional variations:
- Frame 1: Normal state
- Frame 2: Leaves slightly swaying (for idle animation potential)
- Frame 3: Subtle glow intensify (for placement animation)

Output:
- Single PNG with transparency (or sprite sheet if frames provided)
```

---

## 生成后处理

1. **背景透明化**: 确保背景完全透明
2. **尺寸校准**: 调整到适合游戏内显示的尺寸
3. **发光层**: 可分离发光效果为独立 PNG

---

## 游戏内使用

- **放置位置**: 书架尖角与书桌之间
- **放置动画**: 盆栽轻轻落下，叶子微微晃动
- **净化效果**: 尖角区域被柔和绿光覆盖

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v1.0 | 2026-02-20 | 初版道具提示词 |