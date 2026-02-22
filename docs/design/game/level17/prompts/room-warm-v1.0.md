# Level 17 - 暖色终图提示词 (v4.0 - Feng Shui Fix)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 关卡完成状态（暖色终局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **输入** | room-cold.png + 道具参考图 |
| **宽高比** | 2.5:1 |
| **关联关卡** | Level 17 - 复式公寓二层 |

---

## 参考文件

| 文件 | 用途 |
|-----|------|
| `room-cold.png` | 冷色底图（严格保持结构） |
| `gourd.png` | 葫芦道具 |
| `curtain.png` | 布帘道具 |
| `crystal-ball.png` | 水晶球道具 |
| `salt-lamp.png` | 盐灯道具 |
| `plant-broad.png` | 阔叶绿植道具 |

---

## 完整提示词

```text
Using the provided cold room image as STRICT structural reference, transform it into a warm, harmonious feng shui-corrected version through image-to-image generation.

FENG SHUI CORRECTIONS TO APPLY (CRITICAL - MUST BE VISIBLE):

1. GOURD FOR BEAM (横梁压顶):
   - A GOURD is TIED with a red cord to the wooden beam above the bed
   - The gourd hangs from the ceiling beam directly over the sleeping area
   - Gourd color: natural bronze/brown

2. WARDROBE MIRROR COVERING (镜冲床 - CRITICAL):
   - The WARDROBE MIRROR facing the bed MUST be COMPLETELY COVERED
   - A thick DECORATIVE FABRIC CURTAIN is hung over the entire mirror surface
   - The curtain completely hides the mirror - NO reflective surface visible
   - Curtain style: elegant fabric, warm color (beige/gold/cream)
   - The mirror surface should NOT be visible at all
   - This is MANDATORY - mirrors facing beds must be covered

3. CRYSTAL BALL UNDER STAIRS (楼梯下煞):
   - A CLEAR CRYSTAL BALL is placed under the staircase area
   - OR the area under stairs is CLEARED of clutter and kept tidy
   - The crystal ball helps stabilize and purify energy in the compressed space

4. SALT LAMP FOR DARK CORNER (阴煞 - CRITICAL):
   - A HIMALAYAN SALT LAMP is PLACED in the dark slanted ceiling corner
   - The lamp emits a WARM ORANGE GLOW
   - Salt lamp style: glowing pink/orange crystal lamp
   - This is MANDATORY - dark corners need light and positive energy

5. PLANT FOR WARDROBE CORNER (尖角煞):
   - A BROAD-LEAF POTTED PLANT is placed next to the wardrobe's sharp corner
   - The plant softens the sharp edge pointing into the room
   - Plant style: lush green plant in ceramic pot

6. TIDINESS TRANSFORMATION:
   - Room tidied and peaceful
   - Under-stair area cleared if cluttered
   - Warm restful atmosphere

TRANSFORMATION REQUIREMENTS:

1. STRUCTURAL PRESERVATION (CRITICAL):
   - Maintain identical camera angle and room geometry
   - Keep all furniture positions exactly the same
   - Preserve pixel art style and resolution
   - Room layout must remain unchanged

2. ATMOSPHERE TRANSFORMATION:
   - Shift from "tense sleeping area" to "peaceful sanctuary"
   - Color palette: Cool blues/greys → Warm yellows, soft oranges, gentle browns, cream whites
   - Lighting: Dim tense → Warm peaceful glow
   - Overall mood: Tense → Peaceful and restful

3. TIDINESS TRANSFORMATION (CRITICAL):
   - Floor clear of clutter
   - Under-stair area CLEANED
   - The room looks "recently tidied up after feng shui consultation"

HARD CONSTRAINTS:
- Room structure and furniture layout must be IDENTICAL to input
- GOURD on beam is MANDATORY
- MIRROR COVERED WITH CURTAIN is MANDATORY - most critical fix
- CRYSTAL BALL or CLEARED space under stairs is MANDATORY
- SALT LAMP in dark corner is MANDATORY
- PLANT near wardrobe corner is MANDATORY
- Only change: color temperature, lighting, prop additions, and surface tidiness
- NO new furniture added beyond feng shui items
- NO walls removed or added
- Maintain isometric pixel art style throughout

OUTPUT: Single 2.5:1 warm isometric pixel art image showing the harmonized room with ALL 5 feng shui corrections applied.
```

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v4.0 | 2026-02-22 | 修复：明确要求镜子用布帘完全遮挡（镜冲床） |
| v3.0 | 2026-02-22 | Nano Banana Pro 优化 |
| v2.0 | 2026-02-22 | 初始版本 |
