# Level 11 - 暖色终图提示词 (v4.0 - Feng Shui Fix)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 关卡完成状态（暖色终局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **输入** | room-cold.png + 道具参考图 |
| **宽高比** | 2:1 |
| **关联关卡** | Level 11 - 开放式Loft |

---

## 参考文件

| 文件 | 用途 |
|-----|------|
| `room-cold.png` | 冷色底图（严格保持结构） |
| `screen.png` | 屏风道具 |
| `plant-broad.png` | 阔叶绿植道具 |
| `gourd.png` | 葫芦道具 |

---

## 完整提示词

```text
Using the provided cold room image as STRICT structural reference, transform it into a warm, harmonious feng shui-corrected version through image-to-image generation.

FENG SHUI CORRECTIONS TO APPLY (CRITICAL - MUST BE VISIBLE):

1. SCREEN FOR STAIR CLASH (楼梯冲门):
   - A wooden folding SCREEN is placed near the spiral staircase entrance
   - The screen blocks the direct energy flow from stairs to door
   - Screen style: modern wooden screen matching loft aesthetic

2. GOURD FOR BEAM (横梁压顶):
   - A GOURD is TIED with a red cord to the steel beam above the sofa
   - The gourd hangs down from the beam structure
   - Gourd color: natural brown/bronze

3. PLANT FOR DOOR CLASH (穿堂煞):
   - A BROAD-LEAF POTTED PLANT is placed near the large window/door
   - The plant helps slow down the energy flowing through the space
   - Plant style: tall broad-leaf plant in modern pot

4. SCREEN FOR KITCHEN STOVE (灶台外露 - CRITICAL):
   - A wooden folding SCREEN is placed BETWEEN the kitchen stove and living area
   - The screen completely blocks the direct line of sight to the stove
   - "开门见灶，钱财多耗" - the stove must NOT be directly visible from the living area
   - Screen style: matching the other screen, warm wood tone
   - This is MANDATORY - the stove must be shielded

5. TIDINESS TRANSFORMATION:
   - Space organized and tidy
   - Warm sunrise atmosphere

TRANSFORMATION REQUIREMENTS:

1. STRUCTURAL PRESERVATION (CRITICAL):
   - Maintain identical camera angle and room geometry
   - Keep all furniture positions exactly the same
   - Preserve pixel art style and resolution
   - Room layout must remain unchanged

2. ATMOSPHERE TRANSFORMATION:
   - Shift from "chaotic energy flow" to "harmonious open living"
   - Color palette: Cool blues/greys → Warm yellows, soft oranges, gentle browns, cream whites
   - Lighting: Overcast cold → Warm sunrise glow
   - Overall mood: Chaotic → Peaceful and inviting

3. TIDINESS TRANSFORMATION (CRITICAL):
   - Loft space is organized
   - Items neatly arranged
   - The room looks "recently tidied up after feng shui consultation"

HARD CONSTRAINTS:
- Room structure and furniture layout must be IDENTICAL to input
- SCREEN blocking stove view is MANDATORY
- GOURD on beam is MANDATORY
- PLANT for energy flow is MANDATORY
- SCREEN for stair clash is MANDATORY
- Only change: color temperature, lighting, prop additions, and surface tidiness
- NO new furniture added beyond feng shui items
- NO walls removed or added
- Maintain isometric pixel art style throughout

OUTPUT: Single 2:1 warm isometric pixel art image showing the harmonized room with ALL 4 feng shui corrections applied.
```

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v4.0 | 2026-02-22 | 修复：明确要求灶台用屏风遮挡（灶台外露煞） |
| v3.0 | 2026-02-22 | Nano Banana Pro 优化 |
| v2.0 | 2026-02-22 | 初始版本 |
