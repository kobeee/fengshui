# Level 18 - 暖色终图提示词 (v4.0 - Feng Shui Fix)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 关卡完成状态（暖色终局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **输入** | room-cold.png + 道具参考图 |
| **宽高比** | 2.5:1 |
| **关联关卡** | Level 18 - 别墅客厅 |

---

## 参考文件

| 文件 | 用途 |
|-----|------|
| `room-cold.png` | 冷色底图（严格保持结构） |
| `shan-hai-zhen.png` | 山海镇道具 |
| `stone-tablet.png` | 石敢当道具 |
| `pi-xiu.png` | 貔貅道具 |
| `screen.png` | 屏风道具 |
| `plant-broad.png` | 阔叶绿植道具 |

---

## 完整提示词

```text
Using the provided cold room image as STRICT structural reference, transform it into a warm, harmonious feng shui-corrected version through image-to-image generation.

FENG SHUI CORRECTIONS TO APPLY (CRITICAL - MUST BE VISIBLE):

1. STONE TABLET FOR ROAD CLASH (路冲煞 - CRITICAL):
   - A STONE TABLET (泰山石敢当) is placed near the main entrance
   - The stone tablet faces outward to block the direct road energy
   - Stone style: traditional Chinese stone tablet with inscription
   - This is MANDATORY - road clash must be blocked

2. SHAN HAI ZHEN FOR REVERSE BOW (反弓煞 - CRITICAL):
   - A SHAN HAI ZHEN (山海镇) is HUNG on the wall facing the curved road/outside
   - The mirror faces the external reverse bow road to deflect negative energy
   - Style: traditional Chinese feng shui mirror with mountain and sea pattern
   - This is MANDATORY - reverse bow sha must be deflected

3. PIXIU FOR WEALTH CORNER (财位问题 - CRITICAL):
   - The corner with broken vase and debris is COMPLETELY CLEANED
   - All broken pieces and clutter are REMOVED
   - A PIXIU (貔貅) statue is placed in this wealth corner
   - Pixiu style: golden or bronze mythical beast statue
   - The area is bright and welcoming
   - This is MANDATORY - wealth corner must be clean with proper feng shui item

4. SCREEN FOR DOOR CLASH (门冲):
   - A wooden folding SCREEN is placed BETWEEN the arch entrance and side door
   - The screen prevents direct energy flow between doors
   - Screen style: elegant wooden screen matching luxury interior

5. PLANT FOR FIREPLACE (壁炉煞):
   - A BROAD-LEAF POTTED PLANT is placed near the fireplace
   - The plant helps balance the fire element energy
   - Plant style: lush green plant in elegant ceramic pot

6. TIDINESS TRANSFORMATION:
   - Space elegantly organized
   - All broken items removed
   - Warm harmonious luxurious atmosphere

TRANSFORMATION REQUIREMENTS:

1. STRUCTURAL PRESERVATION (CRITICAL):
   - Maintain identical camera angle and room geometry
   - Keep all furniture positions exactly the same
   - Preserve pixel art style and resolution
   - Room layout must remain unchanged

2. ATMOSPHERE TRANSFORMATION:
   - Shift from "externally threatened" to "protected sanctuary"
   - Color palette: Cool blues/greys → Warm yellows, soft oranges, gentle browns, cream whites
   - Lighting: Cold threatened → Warm protected glow
   - Overall mood: Threatened → Peaceful and luxurious

3. TIDINESS TRANSFORMATION (CRITICAL):
   - Wealth corner CLEANED of all debris
   - Floor clear of clutter
   - The room looks "recently tidied up after feng shui consultation"

HARD CONSTRAINTS:
- Room structure and furniture layout must be IDENTICAL to input
- STONE TABLET near entrance is MANDATORY
- SHAN HAI ZHEN on wall is MANDATORY
- PIXIU in cleaned wealth corner is MANDATORY
- SCREEN for door clash is MANDATORY
- PLANT near fireplace is MANDATORY
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