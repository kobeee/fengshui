# Level 1 - 冷色底图提示词 (v4.0 - Room Scale Progression)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 正式关卡图（可玩状态，冷色开局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **宽高比** | 16:9 |
| **房间尺寸** | COMPACT（紧凑型） |
| **可视面积** | ~20m² 单间公寓 |
| **关联关卡** | Level 1 - 开发者的地牢 |

---

## 完整提示词

```text
Create an isometric pixel art COMPACT studio apartment in hi-bit style, inspired by games like Eastward or Coffee Talk. This is a feng shui puzzle game scene showing a room with problematic energy flow before corrections.

ROOM SCALE: COMPACT (~20 square meters, single room with minimal zoning)

The room is viewed from a 45-degree isometric angle, showing depth and dimension. This is a SMALL, INTIMATE space where all furniture fits tightly together - the bed, desk, and window are all within close proximity, creating a cramped but functional layout.

SCENE CONTEXT:
This is a "开发者的地牢" scenario. The room has a late-night work stress atmosphere with Dim desk lamp and cold rainy window light lighting. The space feels energetically imbalanced - not disastrously messy, but with subtle visual cues that something feels "off" about the layout.

CRITICAL SPATIAL LAYOUT - FOLLOW EXACTLY:

ZONE A - BED (center-right):
- Single wooden bed with slightly rumpled bedding (not destroyed)
- CRITICAL: A prominent dark wooden CEILING BEAM runs directly above the bed
- The beam creates BEAM SHA (横梁压顶) - visible pressure on sleeper
- Beam should look structurally solid and clearly positioned

ZONE B - WORK DESK (left corner):
- Small wooden desk with laptop showing code screen
- Stack of 3-4 technical books
- Single coffee mug
- Small desk lamp with cool white light

ZONE C - WINDOW (right wall):
- Window showing rainy night with droplets on glass
- Cold blue-grey light filtering through
- City lights barely visible through rain

FLOOR AND SURFACE DETAILS (Controlled Clutter):
- One or two pizza boxes (not excessive)
- Some programming books in a small stack
- A coffee mug on the desk
- Single pair of headphones on the floor
- General "focused work session" mess, not "hoarder" mess

VISUAL STYLE SPECIFICATIONS:
- Art Style: Hi-bit pixel art with clean, crisp pixels and defined edges
- Color Palette: Cool, desaturated tones - muted blues, grey-greens, cold whites, desaturated browns
- Lighting: Dim desk lamp and cold rainy window light - creating subtle shadows and a slightly oppressive mood
- Atmosphere: late-night work stress - the room feels emotionally heavy but not filthy
- Texture: Visible pixel texture with deliberate, artistic dithering patterns

TECHNICAL REQUIREMENTS:
- NO human characters or animals (furniture and objects only)
- NO text, labels, or UI elements
- NO glowing markers or indicators
- NO watermarks or signatures
- Room should look "lived-in but energetically imbalanced" rather than "disgustingly messy"

OUTPUT: Single 16:9 isometric pixel art image.
```

---

## 煞气场景检查清单

| 煞气 | 视觉元素 | 检查项 |
|-----|---------|--------|
| 横梁压顶 | 床头横梁 | 横梁是否清晰可见在床头正上方？ |

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v3.0 | 2026-02-22 | Nano Banana Pro 优化：使用自然语言描述、明确材质纹理、控制杂乱度、强调氛围而非垃圾 |
| v2.0 | 2026-02-22 | 初始版本 |
