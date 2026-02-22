# Level 6 - 暖色终图提示词 (v3.0 - Nano Banana Pro Optimized)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 关卡完成状态（暖色终局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **输入** | room-cold.png + 道具参考图 |
| **宽高比** | 16:9 |
| **关联关卡** | Level 6 - 创业工作室 |

---

## 参考文件

| 文件 | 用途 |
|-----|------|
| `room-cold.png` | 冷色底图（严格保持结构） |
| `dragon-turtle.png` | 龙龟道具 |
| `plant-broad.png` | 阔叶绿植道具 |

---

## 完整提示词

```text
Using the provided cold room image as STRICT structural reference, transform it into a warm, harmonious feng shui-corrected version through image-to-image generation.

FENG SHUI CORRECTIONS TO APPLY:
1. DRAGON TURTLE placed on desk BEHIND chair for backing support
2. BROAD-LEAF PLANT placed between pillar and desk
3. Papers organized and filed
4. Desks tidied, whiteboard cleaned
5. Warm morning sun creating productive atmosphere

TRANSFORMATION REQUIREMENTS:

1. STRUCTURAL PRESERVATION (CRITICAL):
   - Maintain identical camera angle and room geometry
   - Keep all furniture positions exactly the same
   - Preserve pixel art style and resolution
   - Room layout must remain unchanged

2. ATMOSPHERE TRANSFORMATION:
   - Shift from "busy chaotic startup" to "harmonious productive workspace"
   - Color palette: Cool blues/greys → Warm yellows, soft oranges, gentle browns, cream whites
   - Lighting: Overcast grey morning → Bright warm morning sun
   - Overall mood: Oppressive → Peaceful and inviting

3. TIDINESS TRANSFORMATION (CRITICAL - NEW):
   - Floor clutter is REDUCED and ORGANIZED (not completely sterile)
   - Items that were scattered are now neatly arranged or removed
   - Surfaces are cleaner but still show signs of life
   - The room looks "recently tidied up after feng shui consultation"
   - Books stacked neatly, trash removed, surfaces wiped
   - Maintain "lived-in" feeling but with order and intention

4. PROP PLACEMENT DETAILS:
   - BROAD-LEAF PLANT placed between pillar and desk

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
