# Level 10 - 冷色底图提示词 (v4.0 - Room Scale Progression)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 正式关卡图（可玩状态，冷色开局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **宽高比** | 2:1 |
| **房间尺寸** | MEDIUM（中等型） |
| **可视面积** | ~35m² 老人卧室 |
| **关联关卡** | Level 10 - 老人的卧室 |

---

## 完整提示词

```text
Create an isometric pixel art MEDIUM-SIZED elder's modest bedroom in hi-bit style, inspired by games like Eastward or Coffee Talk. This is a feng shui puzzle game scene showing a room with problematic energy flow before corrections.

ROOM SCALE: MEDIUM (~35 square meters, modest bedroom with ensuite bathroom visible)

The room is viewed from a 45-degree isometric angle, showing depth and dimension. This is a TRADITIONAL LAYOUT showing both the main bedroom area and an ensuite bathroom area in one wider view. The room has more floor space than compact levels, with clear walking paths and a separate bathroom zone.

SPATIAL COMPLEXITY: Two connected zones - the main sleeping area with bed, nightstand, and simple furniture, plus a visible bathroom entrance. The layout is straightforward but spacious, reflecting an older person's preference for accessible, uncluttered spaces.

SCENE CONTEXT:
This is a "老人的卧室" scenario. The room has a cold lonely evening atmosphere with Dim lonely evening lighting. The space feels energetically imbalanced - not disastrously messy, but with subtle visual cues that something feels "off" about the layout.

CRITICAL SPATIAL LAYOUT - FOLLOW EXACTLY:

ZONE A - BED:
- Simple bed
- CRITICAL: BEAM above bed

ZONE B - BATHROOM:
- Bathroom door visible
- CRITICAL: BATHROOM DOOR CLASH

ZONE C - CORNER:
- Dark corner
- CRITICAL: YIN SHA

FLOOR AND SURFACE DETAILS (Controlled Clutter):
- Simple belongings
- Medication on nightstand
- Minimal clutter

VISUAL STYLE SPECIFICATIONS:
- Art Style: Hi-bit pixel art with clean, crisp pixels and defined edges
- Color Palette: Cool, desaturated tones - muted blues, grey-greens, cold whites, desaturated browns
- Lighting: Dim lonely evening - creating subtle shadows and a slightly oppressive mood
- Atmosphere: cold lonely evening - the room feels emotionally heavy but not filthy
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
| 横梁压顶 | 床头横梁 | 是否有横梁？ |
| 厕所门冲 | 厕所门 | 厕所门是否冲床？ |
| 阴煞 | 暗角 | 是否有暗角？ |

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v3.0 | 2026-02-22 | Nano Banana Pro 优化：使用自然语言描述、明确材质纹理、控制杂乱度、强调氛围而非垃圾 |
| v2.0 | 2026-02-22 | 初始版本 |
