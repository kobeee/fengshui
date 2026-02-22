# Level 1 - 暖色终图提示词 (v3.0 - Nano Banana Pro Optimized)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 关卡完成状态（暖色终局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **输入** | room-cold.png + 道具参考图 |
| **宽高比** | 16:9 |
| **关联关卡** | Level 1 - 开发者的地牢 |

---

## 参考文件

| 文件 | 用途 |
|-----|------|
| `room-cold.png` | 冷色底图（严格保持结构） |
| `gourd.png` | 葫芦道具 |

---

## 完整提示词

```text
Using the provided cold room image as STRICT structural reference, transform it into a warm, harmonious feng shui-corrected version through image-to-image generation.

FENG SHUI CORRECTIONS TO APPLY:
1. A TRADITIONAL GOURD is TIED to the ceiling beam with a red cord, hanging down FROM the beam structure itself (NOT from the wall below) -化解横梁压顶
2. Floor is tidied - pizza boxes removed, books neatly stacked on desk
3. Bed is made with warm-toned bedding
4. Overall warmer, more comfortable atmosphere

TRANSFORMATION REQUIREMENTS:

1. STRUCTURAL PRESERVATION (CRITICAL):
   - Maintain identical camera angle and room geometry
   - Keep all furniture positions exactly the same
   - Preserve pixel art style and resolution
   - Room layout must remain unchanged

2. ATMOSPHERE TRANSFORMATION:
   - Shift from "late-night work stress" to "cozy productive workspace"
   - Color palette: Cool blues/greys → Warm yellows, soft oranges, gentle browns, cream whites
   - Lighting: Dim desk lamp and cold rainy window light → Warm desk lamp glow and cozy indoor lighting
   - Overall mood: Oppressive → Peaceful and inviting

3. TIDINESS TRANSFORMATION (CRITICAL - NEW):
   - Floor clutter is REDUCED and ORGANIZED (not completely sterile)
   - Items that were scattered are now neatly arranged or removed
   - Surfaces are cleaner but still show signs of life
   - The room looks "recently tidied up after feng shui consultation"
   - Books stacked neatly, trash removed, surfaces wiped
   - Maintain "lived-in" feeling but with order and intention

4. PROP PLACEMENT DETAILS:
   - A TRADITIONAL GOURD is TIED to the ceiling beam with a red cord, hanging down FROM the beam structure itself (NOT from the wall below) -化解横梁压顶

HARD CONSTRAINTS:
- Room structure and furniture layout must be IDENTICAL to input
- Only change: color temperature, lighting, prop additions, and surface tidiness
- NO new furniture added beyond feng shui items
- NO walls removed or added
- Maintain isometric pixel art style throughout

OUTPUT: Single 16:9 warm isometric pixel art image showing the harmonized room.
```

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v3.0 | 2026-02-22 | Nano Banana Pro 优化：强调整洁度变化、更精确的氛围描述、清晰的结构保持要求 |
| v2.0 | 2026-02-22 | 初始版本 |
