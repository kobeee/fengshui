# Level 19 - 暖色终图提示词 (v4.0 - Feng Shui Fix)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 关卡完成状态（暖色终局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **输入** | room-cold.png + 道具参考图 |
| **宽高比** | 2.5:1 |
| **关联关卡** | Level 19 - 企业老板办公室 |

---

## 参考文件

| 文件 | 用途 |
|-----|------|
| `room-cold.png` | 冷色底图（严格保持结构） |
| `dragon-turtle.png` | 龙龟道具 |
| `bagua-mirror.png` | 八卦镜道具 |
| `lucky-cat.png` | 招财猫道具 |
| `gourd.png` | 葫芦道具 |
| `curtain.png` | 窗帘/门帘道具 |

---

## 完整提示词

```text
Using the provided cold room image as STRICT structural reference, transform it into a warm, harmonious feng shui-corrected version through image-to-image generation.

FENG SHUI CORRECTIONS TO APPLY (CRITICAL - MUST BE VISIBLE):

1. DRAGON TURTLE FOR BACK SUPPORT (背门煞 - CRITICAL):
   - A DRAGON TURTLE (龙龟) statue is PLACED ON the desk BEHIND the chair
   - Position: on the desk surface, between the chair back and the open space
   - Dragon turtle style: bronze or golden feng shui statue
   - This provides "mountain support" for the person sitting at the desk
   - This is MANDATORY - desk must have backing support

2. GOURD FOR BEAM (横梁压顶):
   - A GOURD is TIED with a red cord to the beam above the sofa seating area
   - The gourd hangs from the ceiling beam
   - Gourd color: natural bronze/brown

3. WEALTH CORNER CLEANUP (财位问题 - CRITICAL):
   - The corner with clutter and boxes is COMPLETELY CLEANED
   - All debris, boxes, and clutter are REMOVED
   - A LUCKY CAT (招财猫) is placed on a clean surface in this wealth corner
   - Lucky cat style: traditional golden waving cat statue
   - The area is bright and welcoming
   - This is MANDATORY - wealth corner must be clean and prosperous

4. CURTAIN ON BATHROOM DOOR (味煞 - CRITICAL):
   - A FABRIC CURTAIN is HUNG on the bathroom door frame
   - The curtain covers the door opening completely
   - Curtain color: warm tone (beige/cream)
   - The negative energy from the bathroom is blocked
   - This is MANDATORY - bathroom door must be covered

5. TIDINESS TRANSFORMATION:
   - Office professionally organized
   - Documents filed neatly
   - Warm prosperous executive atmosphere

TRANSFORMATION REQUIREMENTS:

1. STRUCTURAL PRESERVATION (CRITICAL):
   - Maintain identical camera angle and room geometry
   - Keep all furniture positions exactly the same
   - Preserve pixel art style and resolution
   - Room layout must remain unchanged

2. ATMOSPHERE TRANSFORMATION:
   - Shift from "powerful but imbalanced" to "commanding and harmonious"
   - Color palette: Cool blues/greys → Warm yellows, soft oranges, gentle browns, cream whites
   - Lighting: Harsh executive → Warm commanding glow
   - Overall mood: Imbalanced → Prosperous and powerful

3. TIDINESS TRANSFORMATION (CRITICAL):
   - Wealth corner CLEANED of all clutter
   - Floor clear of debris
   - Documents organized
   - The room looks "recently tidied up after feng shui consultation"

HARD CONSTRAINTS:
- Room structure and furniture layout must be IDENTICAL to input
- DRAGON TURTLE on desk behind chair is MANDATORY
- GOURD on beam is MANDATORY
- WEALTH CORNER CLEANED with LUCKY CAT is MANDATORY
- CURTAIN on bathroom door is MANDATORY
- Only change: color temperature, lighting, prop additions, and surface tidiness
- NO new furniture added beyond feng shui items
- NO walls removed or added
- Maintain isometric pixel art style throughout

OUTPUT: Single 2.5:1 warm isometric pixel art image showing the harmonized room with ALL 4 feng shui corrections applied.
```

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v4.0 | 2026-02-22 | 修复：明确要求所有 4 个煞气的解决方案（龙龟、葫芦、财位清理、门帘） |
| v3.0 | 2026-02-22 | Nano Banana Pro 优化 |
| v2.0 | 2026-02-22 | 初始版本 |