# Level 3 - 暖色终图提示词 (v4.0 - Feng Shui Fix)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 关卡完成状态（暖色终局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **输入** | room-cold.png + 道具参考图 |
| **宽高比** | 16:9 |
| **关联关卡** | Level 3 - 学生宿舍 |

---

## 参考文件

| 文件 | 用途 |
|-----|------|
| `room-cold.png` | 冷色底图（严格保持结构） |
| `plant-broad.png` | 阔叶绿植道具 |

---

## 完整提示词

```text
Using the provided cold room image as STRICT structural reference, transform it into a warm, harmonious feng shui-corrected version through image-to-image generation.

FENG SHUI CORRECTIONS TO APPLY (CRITICAL - MUST BE VISIBLE):

1. PLANT FOR SHARP CORNER (尖角煞 - CRITICAL):
   - A BROAD-LEAF POTTED PLANT is placed BETWEEN the desk's sharp corner and the bed
   - The plant is positioned to visually BLOCK the sharp edge from pointing at the bed
   - Plant style: lush green broad-leaf plant in simple ceramic pot
   - This is MANDATORY - sharp corner must be blocked

2. TIDINESS TRANSFORMATION:
   - Desk is organized - papers neatly arranged
   - Floor cleared of clutter
   - Books stacked neatly
   - Warmer, relaxed study atmosphere

TRANSFORMATION REQUIREMENTS:

1. STRUCTURAL PRESERVATION (CRITICAL):
   - Maintain identical camera angle and room geometry
   - Keep all furniture positions exactly the same
   - Preserve pixel art style and resolution
   - Room layout must remain unchanged

2. ATMOSPHERE TRANSFORMATION:
   - Shift from "exam week stress" to "relaxed productive study space"
   - Color palette: Cool blues/greys → Warm yellows, soft oranges, gentle browns, cream whites
   - Lighting: Harsh fluorescent → Warm cozy lamp light
   - Overall mood: Oppressive → Peaceful and inviting

3. TIDINESS TRANSFORMATION (CRITICAL):
   - Floor clutter is REDUCED and ORGANIZED
   - Items that were scattered are now neatly arranged or removed
   - Surfaces are cleaner but still show signs of life
   - The room looks "recently tidied up after feng shui consultation"
   - Books stacked neatly, trash removed, surfaces wiped
   - Maintain "lived-in" feeling but with order and intention

HARD CONSTRAINTS:
- Room structure and furniture layout must be IDENTICAL to input
- PLANT blocking sharp corner is MANDATORY
- Only change: color temperature, lighting, prop additions, and surface tidiness
- NO new furniture added beyond feng shui items
- NO walls removed or added
- Maintain isometric pixel art style throughout

OUTPUT: Single 16:9 warm isometric pixel art image showing the harmonized room with the feng shui correction applied.
```

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v4.0 | 2026-02-22 | 优化：更明确的绿植位置描述 |
| v3.0 | 2026-02-22 | Nano Banana Pro 优化 |
| v2.0 | 2026-02-22 | 初始版本 |