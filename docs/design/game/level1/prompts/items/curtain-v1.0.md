# 道具提示词 - 门帘 (Curtain v1.0)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **道具 ID** | `curtain` |
| **名称** | 门帘 |
| **用途** | 遮挡门冲、化解味煞 |
| **解决煞气** | smell_sha (味煞/门冲) |
| **素材类型** | 透明背景 PNG |

---

## 完整提示词

```text
Generate a pixel art sprite of a traditional Chinese door curtain for an isometric puzzle game.

Object description:
- Traditional Chinese fabric door curtain (门帘)
- Soft flowing fabric with subtle patterns (cloud or simple geometric motifs)
- Warm colors: deep red, burgundy, or warm brown tones
- Fabric appears slightly translucent
- Bottom edge has decorative tassels or weighted beads

Technical requirements:
- Isometric 45 degree angle, matching room perspective
- Transparent background (alpha channel)
- Hi-bit pixel art style, consistent with room background
- Max 32 colors in palette
- Clean pixel edges, no anti-aliasing
- Show fabric in hanging state

Size reference:
- Vertical orientation, rectangular shape
- Approximately 40-50 pixels tall, 25-35 pixels wide
- Scale appropriately for the room's perspective

Style notes:
- Traditional Chinese household aesthetic
- Elegant but not overly ornate
- Fabric should look like it can sway gently

Output:
- Single PNG with transparency
- Show curtain in hanging position
```

---

## 生成后处理

1. **背景透明化**: 确保背景完全透明
2. **尺寸校准**: 调整到适合游戏内显示的尺寸
3. **可选动画帧**: 可添加轻微飘动的动画帧

---

## 游戏内使用

- **放置位置**: 悬挂在门框上，遮挡门冲
- **放置动画**: 从上方轻缓落下并挂好
- **净化效果**: 被遮挡区域出现隔断气场的效果

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v1.0 | 2026-02-22 | 初版道具提示词 |
