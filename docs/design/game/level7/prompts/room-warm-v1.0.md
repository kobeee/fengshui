# Level 7 - 暖色终图提示词 (v4.0 - Feng Shui Fix)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 关卡完成状态（暖色终局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **输入** | room-cold.png + 道具参考图 |
| **宽高比** | 2:1 |
| **关联关卡** | Level 7 - 小夫妻婚房 |

---

## 参考文件

| 文件 | 用途 |
|-----|------|
| `room-cold.png` | 冷色底图（严格保持结构） |
| `curtain.png` | 门帘/布帘道具 |
| `plant-broad.png` | 阔叶绿植道具 |
| `screen.png` | 屏风道具 |

---

## 完整提示词

```text
Using the provided cold room image as STRICT structural reference, transform it into a warm, harmonious feng shui-corrected version through image-to-image generation.

FENG SHUI CORRECTIONS TO APPLY (CRITICAL - MUST BE VISIBLE):

1. MIRROR COVERING (镜冲床 - CRITICAL):
   - The LARGE WALL MIRROR facing the bed MUST be COMPLETELY COVERED
   - A thick DECORATIVE FABRIC CURTAIN is hung over the mirror surface
   - The curtain completely hides the mirror - NO reflective surface visible
   - Curtain style: elegant fabric with subtle pattern, warm color (beige/gold/cream)
   - The mirror surface should NOT be visible at all
   - The smaller vanity mirror should be ANGLED away from the bed
   - This is MANDATORY - mirrors facing beds must be covered

2. PLANT FOR SHARP CORNER (尖角煞):
   - A BROAD-LEAF POTTED PLANT placed next to the tall cabinet's sharp corner
   - The plant visually blocks and softens the sharp edge
   - Plant style: lush green broad-leaf plant in ceramic pot

3. SCREEN FOR DOOR CLASH (门冲):
   - A wooden folding SCREEN placed to block direct door-to-door alignment
   - Screen creates a gentle barrier for energy flow

4. TIDINESS TRANSFORMATION:
   - Personal items organized
   - Room harmonious and peaceful
   - Warm evening atmosphere

TRANSFORMATION REQUIREMENTS:

1. STRUCTURAL PRESERVATION (CRITICAL):
   - Maintain identical camera angle and room geometry
   - Keep all furniture positions exactly the same
   - Preserve pixel art style and resolution
   - Room layout must remain unchanged

2. ATMOSPHERE TRANSFORMATION:
   - Shift from "newlywed tension" to "harmonious newlywed bliss"
   - Color palette: Cool blues/greys → Warm yellows, soft oranges, gentle browns, cream whites
   - Lighting: Tense evening shadows → Warm romantic evening glow
   - Overall mood: Tense → Peaceful and loving

3. TIDINESS TRANSFORMATION (CRITICAL):
   - Personal items neatly arranged
   - Floor clear of clutter
   - The room looks "recently tidied up after feng shui consultation"

HARD CONSTRAINTS:
- Room structure and furniture layout must be IDENTICAL to input
- MIRROR COVERED WITH CURTAIN is MANDATORY
- PLANT near sharp corner is MANDATORY
- SCREEN for door clash is MANDATORY
- Only change: color temperature, lighting, prop additions, and surface tidiness
- NO new furniture added beyond feng shui items
- NO walls removed or added
- Maintain isometric pixel art style throughout

OUTPUT: Single 2:1 warm isometric pixel art image showing the harmonized room with ALL feng shui corrections applied.
```

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v4.0 | 2026-02-22 | 修复：明确要求镜子用布帘完全遮挡（镜冲床） |
| v3.0 | 2026-02-22 | Nano Banana Pro 优化 |
| v2.0 | 2026-02-22 | 初始版本 |
