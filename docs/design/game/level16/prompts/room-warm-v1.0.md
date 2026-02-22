# Level 16 - 暖色终图提示词 (v4.0 - Feng Shui Fix)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 关卡完成状态（暖色终局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **输入** | room-cold.png + 道具参考图 |
| **宽高比** | 2.5:1 |
| **关联关卡** | Level 16 - 瑜伽工作室 |

---

## 参考文件

| 文件 | 用途 |
|-----|------|
| `room-cold.png` | 冷色底图（严格保持结构） |
| `salt-lamp.png` | 盐灯道具 |
| `plant-broad.png` | 阔叶绿植道具 |
| `curtain.png` | 窗帘/门帘道具 |
| `money-toad.png` | 金蟾道具 |

---

## 完整提示词

```text
Using the provided cold room image as STRICT structural reference, transform it into a warm, harmonious feng shui-corrected version through image-to-image generation.

FENG SHUI CORRECTIONS TO APPLY (CRITICAL - MUST BE VISIBLE):

1. MONEY TOAD FOR WEALTH CORNER (财位受损 - CRITICAL):
   - The entrance reception area (明财位) is COMPLETELY CLEANED
   - Broken fountain and debris are REMOVED
   - A MONEY TOAD (金蟾) is placed in this wealth corner
   - The area is bright, clean, and welcoming
   - This is MANDATORY - wealth corner must be clean with proper feng shui item

2. SALT LAMP FOR DARK CORNER (阴煞 - CRITICAL):
   - A HIMALAYAN SALT LAMP is PLACED on a shelf in the dark corner
   - The lamp emits a WARM ORANGE GLOW
   - The corner is CLEARED of clutter
   - Salt lamp style: glowing pink/orange crystal lamp
   - This is MANDATORY - dark corners need light and positive energy

3. PLANT FOR SHARP CORNER (尖角煞):
   - A BROAD-LEAF POTTED PLANT is placed next to the wooden crate's sharp corner
   - The plant softens the sharp edge pointing toward the yoga mat area
   - Plant style: lush green plant in ceramic pot

4. CURTAIN ON WINDOW (窗户煞 - CRITICAL):
   - THICK CURTAINS are installed on the large floor-to-ceiling window
   - Curtains help control energy flow and prevent excessive energy loss
   - Curtain style: warm fabric, light-filtering, matching yoga studio aesthetic
   - This is MANDATORY - large windows need energy control

5. CURTAIN ON CHANGING ROOM DOOR (味煞 - CRITICAL):
   - A FABRIC CURTAIN is HUNG on the changing room door frame
   - The curtain covers the door opening
   - Curtain color: warm tone (beige/cream)
   - This is MANDATORY - changing room door must be covered to block negative energy

6. TIDINESS TRANSFORMATION:
   - Space organized and clean
   - Yoga props neatly arranged
   - Warm filtered morning light

TRANSFORMATION REQUIREMENTS:

1. STRUCTURAL PRESERVATION (CRITICAL):
   - Maintain identical camera angle and room geometry
   - Keep all furniture positions exactly the same
   - Preserve pixel art style and resolution
   - Room layout must remain unchanged

2. ATMOSPHERE TRANSFORMATION:
   - Shift from "stagnant energy" to "peaceful sanctuary"
   - Color palette: Cool blues/greys → Warm yellows, soft oranges, gentle browns, cream whites
   - Lighting: Cloudy stagnant → Warm filtered morning light
   - Overall mood: Stagnant → Peaceful and rejuvenating

3. TIDINESS TRANSFORMATION (CRITICAL):
   - Floor clear of clutter
   - Wealth corner CLEANED
   - Dark corner CLEARED
   - The room looks "recently tidied up after feng shui consultation"

HARD CONSTRAINTS:
- Room structure and furniture layout must be IDENTICAL to input
- MONEY TOAD in cleaned wealth corner is MANDATORY
- SALT LAMP in dark corner is MANDATORY
- PLANT near sharp corner is MANDATORY
- CURTAIN on window is MANDATORY
- CURTAIN on changing room door is MANDATORY
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
| v4.0 | 2026-02-22 | 修复：明确要求所有 5 个煞气的解决方案 |
| v3.0 | 2026-02-22 | Nano Banana Pro 优化 |
| v2.0 | 2026-02-22 | 初始版本 |
