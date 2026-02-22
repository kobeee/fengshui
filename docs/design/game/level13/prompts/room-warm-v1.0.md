# Level 13 - 暖色终图提示词 (v4.0 - Feng Shui Fix)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 关卡完成状态（暖色终局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **输入** | room-cold.png + 道具参考图 |
| **宽高比** | 2:1 |
| **关联关卡** | Level 13 - 小型办公室 |

---

## 参考文件

| 文件 | 用途 |
|-----|------|
| `room-cold.png` | 冷色底图（严格保持结构） |
| `screen.png` | 屏风道具 |
| `gourd.png` | 葫芦道具 |
| `lucky-cat.png` | 招财猫道具 |
| `plant-broad.png` | 阔叶绿植道具 |

---

## 完整提示词

```text
Using the provided cold room image as STRICT structural reference, transform it into a warm, harmonious feng shui-corrected version through image-to-image generation.

FENG SHUI CORRECTIONS TO APPLY (CRITICAL - MUST BE VISIBLE):

1. GOURD FOR BEAM (横梁压顶 - CRITICAL):
   - A GOURD is TIED with a red cord DIRECTLY to the beam ABOVE the desk/seating area
   - The gourd hangs from the ceiling beam directly over the workspace
   - Position: CENTER of the black cross-shaped beam structure
   - Gourd color: natural bronze/brown
   - This is MANDATORY - the beam is the primary sha qi

2. SCREEN FOR DOOR CLASH (门冲 - CRITICAL):
   - A wooden folding SCREEN is placed BETWEEN the entrance door and the desk area
   - The screen blocks direct energy flow from door to workspace
   - Screen style: professional wooden screen matching office aesthetic
   - This is MANDATORY - desk must not be directly in line with door

3. WEALTH CORNER CLEANUP (财位问题 - CRITICAL):
   - The corner at the entrance diagonal (明财位) is COMPLETELY CLEANED
   - All trash, paper, and debris are REMOVED
   - A LUCKY CAT (招财猫) is placed on a clean surface in this corner
   - The area is bright and uncluttered
   - This is MANDATORY - wealth corner must be clean and welcoming

4. PLANT FOR CABINET CORNER (尖角煞):
   - A BROAD-LEAF POTTED PLANT is placed next to the cabinet's sharp corner
   - The plant softens the sharp edge pointing into the room

5. TIDINESS TRANSFORMATION:
   - Office professionally organized
   - Documents filed neatly
   - Warm professional atmosphere

TRANSFORMATION REQUIREMENTS:

1. STRUCTURAL PRESERVATION (CRITICAL):
   - Maintain identical camera angle and room geometry
   - Keep all furniture positions exactly the same
   - Preserve pixel art style and resolution
   - Room layout must remain unchanged

2. ATMOSPHERE TRANSFORMATION:
   - Shift from "busy workday chaos" to "productive professional harmony"
   - Color palette: Cool blues/greys → Warm yellows, soft oranges, gentle browns, cream whites
   - Lighting: Fluorescent harsh → Warm professional
   - Overall mood: Chaotic → Organized and productive

3. TIDINESS TRANSFORMATION (CRITICAL):
   - Floor is clear of debris
   - Documents organized
   - Wealth corner is CLEAN
   - The room looks "recently tidied up after feng shui consultation"

HARD CONSTRAINTS:
- Room structure and furniture layout must be IDENTICAL to input
- GOURD on beam above desk is MANDATORY
- SCREEN between door and desk is MANDATORY
- WEALTH CORNER CLEANED with LUCKY CAT is MANDATORY
- PLANT near cabinet corner is MANDATORY
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
| v4.0 | 2026-02-22 | 修复：明确要求葫芦位置、屏风位置、财位清理 |
| v3.0 | 2026-02-22 | Nano Banana Pro 优化 |
| v2.0 | 2026-02-22 | 初始版本 |
