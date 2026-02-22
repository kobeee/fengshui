# Level 4 - 冷色底图提示词 (v4.0 - Room Scale Progression)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 正式关卡图（可玩状态，冷色开局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **宽高比** | 16:9 |
| **房间尺寸** | COMPACT（紧凑型） |
| **可视面积** | ~25m² 小型客厅 |
| **关联关卡** | Level 4 - 猫奴的客厅 |

---

## 完整提示词

```text
Create an isometric pixel art COMPACT living room with cat furniture in hi-bit style, inspired by games like Eastward or Coffee Talk. This is a feng shui puzzle game scene showing a room with problematic energy flow before corrections.

ROOM SCALE: COMPACT (~25 square meters, small apartment living room)

The room is viewed from a 45-degree isometric angle, showing depth and dimension. This is a SMALL but functional living room in a typical apartment - the entrance door, sofa, TV area, and balcony door are arranged in a compact layout. Cat furniture (cat tree, cat bed) takes up some floor space, making the room feel slightly cramped.

SCENE CONTEXT:
This is a "猫奴的客厅" scenario. The room has a gloomy rainy afternoon atmosphere with Cold rainy afternoon lighting. The space feels energetically imbalanced - not disastrously messy, but with subtle visual cues that something feels "off" about the layout.

CRITICAL SPATIAL LAYOUT - FOLLOW EXACTLY:

ZONE A - ENTRANCE:
- Front door visible

ZONE B - BALCONY:
- Balcony door opposite entrance
- CRITICAL: DOOR CLASH (穿堂煞)

FLOOR AND SURFACE DETAILS (Controlled Clutter):
- Cat furniture arranged
- Some cat toys

VISUAL STYLE SPECIFICATIONS:
- Art Style: Hi-bit pixel art with clean, crisp pixels and defined edges
- Color Palette: Cool, desaturated tones - muted blues, grey-greens, cold whites, desaturated browns
- Lighting: Cold rainy afternoon - creating subtle shadows and a slightly oppressive mood
- Atmosphere: gloomy rainy afternoon - the room feels emotionally heavy but not filthy
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
| 穿堂煞 | 门对门 | 大门是否正对阳台门？ |

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v3.0 | 2026-02-22 | Nano Banana Pro 优化：使用自然语言描述、明确材质纹理、控制杂乱度、强调氛围而非垃圾 |
| v2.0 | 2026-02-22 | 初始版本 |
