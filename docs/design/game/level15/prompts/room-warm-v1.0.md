# Level 15 - 暖色终图提示词 (v4.0 - Feng Shui Fix)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 关卡完成状态（暖色终局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **输入** | room-cold.png + 道具参考图 |
| **宽高比** | 2:1 |
| **关联关卡** | Level 15 - 艺术家工作室 |

---

## 参考文件

| 文件 | 用途 |
|-----|------|
| `room-cold.png` | 冷色底图（严格保持结构） |
| `gourd.png` | 葫芦道具 |
| `plant-broad.png` | 阔叶绿植道具 |
| `salt-lamp.png` | 盐灯道具 |
| `curtain.png` | 窗帘/门帘道具 |

---

## 完整提示词

```text
Using the provided cold room image as STRICT structural reference, transform it into a warm, harmonious feng shui-corrected version through image-to-image generation.

FENG SHUI CORRECTIONS TO APPLY (CRITICAL - MUST BE VISIBLE):

1. GOURD FOR BEAM (横梁压顶):
   - A GOURD is TIED with a red cord to the wooden beam above the easel/work area
   - The gourd hangs from the ceiling beam
   - Gourd color: natural bronze/brown

2. PLANT FOR SHELF CORNER (尖角煞):
   - A BROAD-LEAF POTTED PLANT is placed next to the tall bookshelf's sharp corner
   - The plant softens the sharp edge pointing toward the sitting area
   - Plant style: lush green plant in ceramic pot

3. SALT LAMP FOR DARK CORNER (阴煞 - CRITICAL):
   - A HIMALAYAN SALT LAMP is PLACED in the dark, cluttered corner
   - The lamp emits a WARM ORANGE GLOW
   - The corner is CLEARED of clutter first
   - Salt lamp style: glowing pink/orange crystal lamp
   - This is MANDATORY - dark corners need light and energy

4. CURTAIN ON BATHROOM DOOR (厕所门冲 - CRITICAL):
   - A FABRIC CURTAIN is HUNG on the bathroom door frame
   - The curtain covers the door opening completely
   - Curtain color: warm tone matching room palette (beige/cream)
   - This is MANDATORY - bathroom door must be covered

5. CURTAIN ON WINDOW (窗户煞):
   - THICK CURTAINS are installed on the large industrial window
   - Curtains can be partially drawn to control light and energy flow
   - Curtain style: warm fabric matching studio aesthetic

6. TIDINESS TRANSFORMATION:
   - Art supplies neatly arranged
   - Studio organized and inspiring
   - Warm creative atmosphere

TRANSFORMATION REQUIREMENTS:

1. STRUCTURAL PRESERVATION (CRITICAL):
   - Maintain identical camera angle and room geometry
   - Keep all furniture positions exactly the same
   - Preserve pixel art style and resolution
   - Room layout must remain unchanged

2. ATMOSPHERE TRANSFORMATION:
   - Shift from "creative but blocked" to "inspired and flowing"
   - Color palette: Cool blues/greys → Warm yellows, soft oranges, gentle browns, cream whites
   - Lighting: Dim blocked → Warm inspiring glow
   - Overall mood: Blocked → Creative and harmonious

3. TIDINESS TRANSFORMATION (CRITICAL):
   - Art supplies organized
   - Dark corner CLEARED of clutter
   - The room looks "recently tidied up after feng shui consultation"

HARD CONSTRAINTS:
- Room structure and furniture layout must be IDENTICAL to input
- GOURD on beam is MANDATORY
- PLANT near shelf corner is MANDATORY
- SALT LAMP in dark corner is MANDATORY
- CURTAIN on bathroom door is MANDATORY
- CURTAIN on window is MANDATORY
- Only change: color temperature, lighting, prop additions, and surface tidiness
- NO new furniture added beyond feng shui items
- NO walls removed or added
- Maintain isometric pixel art style throughout

OUTPUT: Single 2:1 warm isometric pixel art image showing the harmonized room with ALL 5 feng shui corrections applied.
```

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v4.0 | 2026-02-22 | 修复：明确要求所有 5 个煞气的解决方案 |
| v3.0 | 2026-02-22 | Nano Banana Pro 优化 |
| v2.0 | 2026-02-22 | 初始版本 |
