# Level 8 - 冷色底图提示词 (v4.0 - Room Scale Progression)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 正式关卡图（可玩状态，冷色开局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **宽高比** | 2:1 |
| **房间尺寸** | MEDIUM（中等型） |
| **可视面积** | ~50m² 开放式公寓 |
| **关联关卡** | Level 8 - 开放式厨房公寓 |

---

## 完整提示词

```text
Create an isometric pixel art MEDIUM-SIZED open-concept apartment in hi-bit style, inspired by games like Eastward or Coffee Talk. This is a feng shui puzzle game scene showing a room with problematic energy flow before corrections.

ROOM SCALE: MEDIUM (~50 square meters, open-concept with kitchen, living, and sleeping areas)

The room is viewed from a 45-degree isometric angle, showing depth and dimension. This is a WIDER, MORE EXPANSIVE space showing an open floor plan - the kitchen, living area, and sleeping nook are all visible in one continuous space. There are no walls between zones, but furniture and rugs define different functional areas.

SPATIAL COMPLEXITY: Open concept with multiple functional zones flowing into each other - kitchen counter, living room seating, and bed area are all connected but visually distinct. The wider canvas allows showing a full airflow path from entrance to balcony.

SCENE CONTEXT:
This is a "开放式厨房公寓" scenario. The room has a cold modern evening atmosphere with Harsh artificial light lighting. The space feels energetically imbalanced - not disastrously messy, but with subtle visual cues that something feels "off" about the layout.

CRITICAL SPATIAL LAYOUT - FOLLOW EXACTLY:

ZONE A - KITCHEN:
- Stove visible
- CRITICAL: KITCHEN SHA (stove position)

ZONE B - LIVING:
- Balcony door
- CRITICAL: DOOR CLASH

FLOOR AND SURFACE DETAILS (Controlled Clutter):
- Kitchen items on counter
- Some dishes (not excessive)

VISUAL STYLE SPECIFICATIONS:
- Art Style: Hi-bit pixel art with clean, crisp pixels and defined edges
- Color Palette: Cool, desaturated tones - muted blues, grey-greens, cold whites, desaturated browns
- Lighting: Harsh artificial light - creating subtle shadows and a slightly oppressive mood
- Atmosphere: cold modern evening - the room feels emotionally heavy but not filthy
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
| 灶台冲门 | 灶台 | 灶台是否冲门？ |
| 穿堂煞 | 门对门 | 是否有穿堂煞？ |

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v3.0 | 2026-02-22 | Nano Banana Pro 优化：使用自然语言描述、明确材质纹理、控制杂乱度、强调氛围而非垃圾 |
| v2.0 | 2026-02-22 | 初始版本 |
