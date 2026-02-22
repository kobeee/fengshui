# Level 7 - 冷色底图提示词 (v4.0 - Room Scale Progression)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 正式关卡图（可玩状态，冷色开局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **宽高比** | 2:1 |
| **房间尺寸** | MEDIUM（中等型） |
| **可视面积** | ~45m² 一室一厅 |
| **关联关卡** | Level 7 - 小夫妻婚房 |

---

## 完整提示词

```text
Create an isometric pixel art MEDIUM-SIZED one-bedroom apartment in hi-bit style, inspired by games like Eastward or Coffee Talk. This is a feng shui puzzle game scene showing a room with problematic energy flow before corrections.

ROOM SCALE: MEDIUM (~45 square meters, one-bedroom apartment with distinct zones)

The room is viewed from a 45-degree isometric angle, showing depth and dimension. This is a LARGER space than previous levels - clearly showing TWO distinct zones: a bedroom area and a small living area. The layout is more spread out, with visible transition spaces between zones. There is enough room to walk around furniture.

SPATIAL COMPLEXITY: Multiple zones with clear boundaries - the bedroom alcove is partially separated from the main living space, creating a semi-open floor plan typical of modern one-bedroom apartments.

SCENE CONTEXT:
This is a "小夫妻婚房" scenario. The room has a newlywed tension atmosphere with Tense evening shadows lighting. The space feels energetically imbalanced - not disastrously messy, but with subtle visual cues that something feels "off" about the layout.

CRITICAL SPATIAL LAYOUT - FOLLOW EXACTLY:

ZONE A - BEDROOM:
- Bed with mirror opposite
- CRITICAL: MIRROR SHA

ZONE B - LIVING:
- Door visible
- Sharp corner
- CRITICAL: DOOR CLASH and SHARP CORNER

FLOOR AND SURFACE DETAILS (Controlled Clutter):
- Some personal items
- Makeup on vanity

VISUAL STYLE SPECIFICATIONS:
- Art Style: Hi-bit pixel art with clean, crisp pixels and defined edges
- Color Palette: Cool, desaturated tones - muted blues, grey-greens, cold whites, desaturated browns
- Lighting: Tense evening shadows - creating subtle shadows and a slightly oppressive mood
- Atmosphere: newlywed tension - the room feels emotionally heavy but not filthy
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
| 镜冲床 | 镜子对床 | 镜子是否对着床？ |
| 门冲 | 门冲 | 是否有门冲？ |
| 尖角煞 | 尖角 | 是否有尖角煞？ |

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v3.0 | 2026-02-22 | Nano Banana Pro 优化：使用自然语言描述、明确材质纹理、控制杂乱度、强调氛围而非垃圾 |
| v2.0 | 2026-02-22 | 初始版本 |
