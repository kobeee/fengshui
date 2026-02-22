# Level 12 - 冷色底图提示词 (v4.0 - Room Scale Progression)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 正式关卡图（可玩状态，冷色开局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **宽高比** | 2:1 |
| **房间尺寸** | LARGE（大型） |
| **可视面积** | ~60m² 开放办公区域 |
| **关联关卡** | Level 12 - 程序员工位 |

---

## 完整提示词

```text
Create an isometric pixel art LARGE office workstation area in hi-bit style, inspired by games like Eastward or Coffee Talk. This is a feng shui puzzle game scene showing a room with problematic energy flow before corrections.

ROOM SCALE: LARGE (~60 square meters, open office area with multiple workstations)

The room is viewed from a 45-degree isometric angle, showing depth and dimension. This is an EXPANDED OFFICE SPACE showing not just one desk but an open office area with the focus on a particular programmer's workstation. The wider view shows the context: nearby desks, structural pillars, windows, and the office entrance. The player's desk is clearly highlighted as the problem area.

SPATIAL COMPLEXITY: Open-plan office with multiple workstations visible. Structural elements like pillars and ceiling beams are prominent. The wealth corner and electrical/cable management areas are visible. Multiple environmental hazards exist simultaneously.

SCENE CONTEXT:
This is a "程序员工位" scenario. The room has a busy tech chaos atmosphere with Fluorescent harsh lighting. The space feels energetically imbalanced - not disastrously messy, but with subtle visual cues that something feels "off" about the layout.

CRITICAL SPATIAL LAYOUT - FOLLOW EXACTLY:

ZONE A - DESK:
- Desk with computer
- CRITICAL: BACK TO DOOR

ZONE B - PILLAR:
- Pillar corner
- CRITICAL: PILLAR SHA

ZONE C - CABLES:
- Tangled wires
- CRITICAL: ELECTRIC SHA

ZONE D - WEALTH:
- Wealth corner cluttered
- CRITICAL: WEALTH SHA

FLOOR AND SURFACE DETAILS (Controlled Clutter):
- Tech equipment
- Some cables (not excessive)
- Coffee cup

VISUAL STYLE SPECIFICATIONS:
- Art Style: Hi-bit pixel art with clean, crisp pixels and defined edges
- Color Palette: Cool, desaturated tones - muted blues, grey-greens, cold whites, desaturated browns
- Lighting: Fluorescent harsh - creating subtle shadows and a slightly oppressive mood
- Atmosphere: busy tech chaos - the room feels emotionally heavy but not filthy
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
| 背门煞 | 座位 | 座位是否背门？ |
| 柱角煞 | 柱子 | 柱子尖角？ |
| 电线煞 | 电线 | 电线是否杂乱？ |
| 财位问题 | 财位 | 财位是否杂乱？ |

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v3.0 | 2026-02-22 | Nano Banana Pro 优化：使用自然语言描述、明确材质纹理、控制杂乱度、强调氛围而非垃圾 |
| v2.0 | 2026-02-22 | 初始版本 |
