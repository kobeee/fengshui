# Level 4 - 暖色终图提示词 (v4.0 - Feng Shui Fix)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 关卡完成状态（暖色终局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **输入** | room-cold.png + 道具参考图 |
| **宽高比** | 16:9 |
| **关联关卡** | Level 4 - 猫奴的客厅 |

---

## 参考文件

| 文件 | 用途 |
|-----|------|
| `room-cold.png` | 冷色底图（严格保持结构） |
| `screen.png` | 屏风道具 |
| `curtain.png` | 门帘道具 |

---

## 完整提示词

```text
Using the provided cold room image as STRICT structural reference, transform it into a warm, harmonious feng shui-corrected version through image-to-image generation.

FENG SHUI CORRECTIONS TO APPLY (CRITICAL - MUST BE VISIBLE):

1. SCREEN FOR DOOR CLASH (穿堂煞):
   - A wooden folding SCREEN is placed PERPENDICULAR between the entrance door and balcony door
   - The screen completely blocks the direct line of sight from front door to back
   - Screen style: traditional Chinese wooden screen with lattice pattern
   - Screen color: warm brown wood tone matching the furniture

2. CURTAIN FOR LITTER BOX (味煞 - CRITICAL):
   - The cat litter box area MUST be COVERED with a fabric curtain or small partition
   - A CURTAIN is hung on a frame or partition around the litter box area
   - The curtain fabric covers the litter box from view
   - Curtain color: cream or light beige, matching warm room palette
   - This is MANDATORY - the litter box should NOT be openly visible

3. TIDINESS TRANSFORMATION:
   - Cat toys organized in baskets
   - Floor vacuumed and clean
   - Warm afternoon sunlight fills the room

TRANSFORMATION REQUIREMENTS:

1. STRUCTURAL PRESERVATION (CRITICAL):
   - Maintain identical camera angle and room geometry
   - Keep all furniture positions exactly the same
   - Preserve pixel art style and resolution
   - Room layout must remain unchanged

2. ATMOSPHERE TRANSFORMATION:
   - Shift from "gloomy rainy afternoon" to "cozy sunny afternoon"
   - Color palette: Cool blues/greys → Warm yellows, soft oranges, gentle browns, cream whites
   - Lighting: Cold rainy afternoon → Warm cozy sunlight
   - Overall mood: Oppressive → Peaceful and inviting

3. TIDINESS TRANSFORMATION (CRITICAL):
   - Floor clutter is REDUCED and ORGANIZED
   - Cat toys collected in storage baskets
   - Surfaces are cleaner
   - The room looks "recently tidied up after feng shui consultation"

HARD CONSTRAINTS:
- Room structure and furniture layout must be IDENTICAL to input
- SCREEN between doors is MANDATORY
- CURTAIN covering litter box is MANDATORY
- Only change: color temperature, lighting, prop additions, and surface tidiness
- NO new furniture added beyond feng shui items
- NO walls removed or added
- Maintain isometric pixel art style throughout

OUTPUT: Single 16:9 warm isometric pixel art image showing the harmonized room with BOTH feng shui corrections applied.
```

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v4.0 | 2026-02-22 | 修复：明确要求猫砂盆区域加装帘子遮挡（味煞） |
| v3.0 | 2026-02-22 | Nano Banana Pro 优化 |
| v2.0 | 2026-02-22 | 初始版本 |
