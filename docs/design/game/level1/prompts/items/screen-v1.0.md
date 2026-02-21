# 道具提示词 - 屏风 (Screen Divider v1.0)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **道具 ID** | `screen` |
| **名称** | 屏风 |
| **用途** | 化解门冲煞 |
| **解决煞气** | sha-004 (门冲) |
| **素材类型** | 透明背景 PNG |

---

## 完整提示词

```text
Generate a pixel art sprite of a Feng Shui standing screen divider for an isometric puzzle game.

Object description:
- Traditional standing screen/divider (屏风)
- 3-panel folding design
- Wooden frame in warm brown tones
- Panel surface: simple elegant pattern (solid color or subtle geometric/traditional design)
- NO text, NO characters on the screen
- Subtle warm glow emanating from the screen (representing energy flow redirection)

Technical requirements:
- Isometric 45 degree angle, matching room perspective
- Viewed at slight angle to show depth (not completely flat)
- Transparent background (alpha channel)
- Hi-bit pixel art style, consistent with room background
- Max 32 colors in palette
- Clean pixel edges, no anti-aliasing

Size reference:
- Floor-standing height, approximately chest-to-head height
- Total width when folded: approximately 40-50 pixels
- Height: approximately 50-60 pixels
- Should appear substantial enough to block sight line between doors

Design considerations:
- Should feel like it belongs in a developer's apartment (not too traditional/fancy)
- Minimalist design preferred (avoid overly ornate patterns)
- Modern-simple style acceptable

Output:
- Single PNG with transparency
```

---

## 生成后处理

1. **背景透明化**: 确保背景完全透明
2. **尺寸校准**: 调整到适合游戏内显示的尺寸
3. **发光层**: 可分离发光效果为独立 PNG

---

## 游戏内使用

- **放置位置**: 入口门与阳台门之间
- **放置动画**: 屏风展开、立稳
- **净化效果**: 气流路径被阻隔，暖光在屏风周围扩散

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v1.0 | 2026-02-20 | 初版道具提示词 |