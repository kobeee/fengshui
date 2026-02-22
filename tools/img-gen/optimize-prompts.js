#!/usr/bin/env node
/**
 * 批量优化关卡提示词脚本
 * 基于 Nano Banana Pro 最佳实践全面优化所有 Level 1-20 的提示词
 */

import fs from 'fs';
import path from 'path';

// 冷图提示词模板生成器
function generateColdPrompt(levelNum, levelInfo) {
  const { name, scene, shaTypes, items, atmosphere, lighting, floorItems, specialFeatures } = levelInfo;
  
  // 处理 atmosphere 和 lighting 可能是字符串或对象的情况
  const atmosCold = typeof atmosphere === 'object' ? atmosphere.cold : atmosphere;
  const lightCold = typeof lighting === 'object' ? lighting.cold : lighting;
  
  return `# Level ${levelNum} - 冷色底图提示词 (v3.0 - Nano Banana Pro Optimized)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 正式关卡图（可玩状态，冷色开局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **宽高比** | 16:9 |
| **关联关卡** | Level ${levelNum} - ${name} |

---

## 完整提示词

\`\`\`text
Create an isometric pixel art ${scene} in hi-bit style, inspired by games like Eastward or Coffee Talk. This is a feng shui puzzle game scene showing a room with problematic energy flow before corrections.

SCENE CONTEXT:
This is a "${name}" scenario. The room has a ${atmosCold} atmosphere with ${lightCold} lighting. The space feels energetically imbalanced - not disastrously messy, but with subtle visual cues that something feels "off" about the layout.

CRITICAL SPATIAL LAYOUT - FOLLOW EXACTLY:

The room is viewed from a 45-degree isometric angle, showing depth and dimension.

${specialFeatures}

FLOOR AND SURFACE DETAILS (Controlled Clutter):
${floorItems}

VISUAL STYLE SPECIFICATIONS:
- Art Style: Hi-bit pixel art with clean, crisp pixels and defined edges
- Color Palette: Cool, desaturated tones - muted blues, grey-greens, cold whites, desaturated browns
- Lighting: ${lightCold} - creating subtle shadows and a slightly oppressive mood
- Atmosphere: ${atmosCold} - the room feels emotionally heavy but not filthy
- Texture: Visible pixel texture with deliberate, artistic dithering patterns

TECHNICAL REQUIREMENTS:
- NO human characters or animals (furniture and objects only)
- NO text, labels, or UI elements
- NO glowing markers or indicators
- NO watermarks or signatures
- Room should look "lived-in but energetically imbalanced" rather than "disgustingly messy"

OUTPUT: Single 16:9 isometric pixel art image.
\`\`\`

---

## 煞气场景检查清单

| 煞气 | 视觉元素 | 检查项 |
|-----|---------|--------|
${shaTypes.map(sha => `| ${sha.name} | ${sha.element} | ${sha.check} |`).join('\n')}

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v3.0 | 2026-02-22 | Nano Banana Pro 优化：使用自然语言描述、明确材质纹理、控制杂乱度、强调氛围而非垃圾 |
| v2.0 | 2026-02-22 | 初始版本 |
`;
}

// 暖图提示词模板生成器
function generateWarmPrompt(levelNum, levelInfo) {
  const { name, scene, fixes, atmosphere, lighting } = levelInfo;
  
  // 处理 atmosphere 和 lighting 可能是字符串或对象的情况
  const atmosCold = typeof atmosphere === 'object' ? atmosphere.cold : atmosphere;
  const atmosWarm = typeof atmosphere === 'object' ? atmosphere.warm : atmosphere;
  const lightCold = typeof lighting === 'object' ? lighting.cold : lighting;
  const lightWarm = typeof lighting === 'object' ? lighting.warm : lighting;
  
  const fixesText = fixes.map((fix, idx) => `${idx + 1}. ${fix}`).join('\n');
  
  return `# Level ${levelNum} - 暖色终图提示词 (v3.0 - Nano Banana Pro Optimized)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 关卡完成状态（暖色终局） |
| **模型** | Gemini Nano Banana Pro (gemini-3-pro-image-preview) |
| **输入** | room-cold.png + 道具参考图 |
| **宽高比** | 16:9 |
| **关联关卡** | Level ${levelNum} - ${name} |

---

## 参考文件

| 文件 | 用途 |
|-----|------|
| \`room-cold.png\` | 冷色底图（严格保持结构） |
${levelInfo.items ? levelInfo.items.map(item => `| \`${item.file}\` | ${item.name}道具 |`).join('\n') : ''}

---

## 完整提示词

\`\`\`text
Using the provided cold room image as STRICT structural reference, transform it into a warm, harmonious feng shui-corrected version through image-to-image generation.

FENG SHUI CORRECTIONS TO APPLY:
${fixesText}

TRANSFORMATION REQUIREMENTS:

1. STRUCTURAL PRESERVATION (CRITICAL):
   - Maintain identical camera angle and room geometry
   - Keep all furniture positions exactly the same
   - Preserve pixel art style and resolution
   - Room layout must remain unchanged

2. ATMOSPHERE TRANSFORMATION:
   - Shift from "${atmosCold}" to "${atmosWarm}"
   - Color palette: Cool blues/greys → Warm yellows, soft oranges, gentle browns, cream whites
   - Lighting: ${lightCold} → ${lightWarm}
   - Overall mood: Oppressive → Peaceful and inviting

3. TIDINESS TRANSFORMATION (CRITICAL - NEW):
   - Floor clutter is REDUCED and ORGANIZED (not completely sterile)
   - Items that were scattered are now neatly arranged or removed
   - Surfaces are cleaner but still show signs of life
   - The room looks "recently tidied up after feng shui consultation"
   - Books stacked neatly, trash removed, surfaces wiped
   - Maintain "lived-in" feeling but with order and intention

4. PROP PLACEMENT DETAILS:
${fixes.filter(f => f.includes('PLACED') || f.includes('TIED') || f.includes('HUNG') || f.includes('ROTATED') || f.includes('GOURD') || f.includes('PLANT') || f.includes('SCREEN')).map(f => `   - ${f.split('. ')[1] || f}`).join('\n') || '   - Feng shui items placed according to traditional principles'}

HARD CONSTRAINTS:
- Room structure and furniture layout must be IDENTICAL to input
- Only change: color temperature, lighting, prop additions, and surface tidiness
- NO new furniture added beyond feng shui items
- NO walls removed or added
- Maintain isometric pixel art style throughout

OUTPUT: Single 16:9 warm isometric pixel art image showing the harmonized room.
\`\`\`

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v3.0 | 2026-02-22 | Nano Banana Pro 优化：强调整洁度变化、更精确的氛围描述、清晰的结构保持要求 |
| v2.0 | 2026-02-22 | 初始版本 |
`;
}

// 关卡信息定义
const levelInfos = {
  1: {
    name: "开发者的地牢",
    scene: "small apartment bedroom",
    atmosphere: {
      cold: "late-night work stress",
      warm: "cozy productive workspace"
    },
    lighting: {
      cold: "dim desk lamp and cold rainy window light",
      warm: "warm desk lamp glow and cozy indoor lighting"
    },
    floorItems: `- One or two pizza boxes (not excessive)
- Some programming books in a small stack
- A coffee mug on the desk
- Single pair of headphones on the floor
- General "focused work session" mess, not "hoarder" mess`,
    specialFeatures: `ZONE A - BED (center-right):
- Single wooden bed with slightly rumpled bedding (not destroyed)
- CRITICAL: A prominent dark wooden CEILING BEAM runs directly above the bed
- The beam creates BEAM SHA (横梁压顶) - visible pressure on sleeper
- Beam should look structurally solid and clearly positioned

ZONE B - WORK DESK (left corner):
- Small wooden desk with laptop showing code screen
- Stack of 3-4 technical books
- Single coffee mug
- Small desk lamp with cool white light

ZONE C - WINDOW (right wall):
- Window showing rainy night with droplets on glass
- Cold blue-grey light filtering through
- City lights barely visible through rain`,
    shaTypes: [
      { name: "横梁压顶", element: "床头横梁", check: "横梁是否清晰可见在床头正上方？" }
    ],
    items: [{ file: "gourd.png", name: "葫芦" }],
    fixes: [
      "A TRADITIONAL GOURD is TIED to the ceiling beam with a red cord, hanging down FROM the beam structure itself (NOT from the wall below) -化解横梁压顶",
      "Floor is tidied - pizza boxes removed, books neatly stacked on desk",
      "Bed is made with warm-toned bedding",
      "Overall warmer, more comfortable atmosphere"
    ],
    lighting: {
      cold: "Dim desk lamp and cold rainy window light",
      warm: "Warm desk lamp glow and cozy indoor lighting"
    }
  },
  2: {
    name: "猫奴的卧室",
    scene: "cozy bedroom with cat elements",
    atmosphere: {
      cold: "gloomy but warm-hearted cat lover",
      warm: "cozy happy cat paradise"
    },
    lighting: {
      cold: "Overcast grey afternoon",
      warm: "Golden hour warm sunlight"
    },
    floorItems: `- Cat toys scattered (2-3 items, not excessive)
- Small cat bed in corner
- Books on nightstand`,
    specialFeatures: `ZONE A - BED:
- Bed with mirror on wardrobe opposite
- CRITICAL: Mirror faces bed creating MIRROR SHA

ZONE B - CAT AREA:
- Cat tree and cat bed`,
    shaTypes: [
      { name: "镜冲床", element: "镜子对床", check: "镜子是否对着床？" }
    ],
    items: [],
    fixes: [
      "The mirror has been ROTATED to face AWAY from the bed - NO reflection of bed visible",
      "Room is tidier - cat toys organized in basket",
      "Warmer afternoon light through window"
    ]
  },
  3: {
    name: "学生宿舍",
    scene: "cramped student dormitory",
    atmosphere: {
      cold: "exam week stress",
      warm: "relaxed productive study space"
    },
    lighting: {
      cold: "Harsh fluorescent",
      warm: "Warm cozy lamp light"
    },
    floorItems: `- Study materials on desk
- Some textbooks
- Single coffee cup`,
    specialFeatures: `ZONE A - BED:
- Bunk bed or single bed

ZONE B - DESK:
- Sharp desk corner facing bed
- CRITICAL: SHARP CORNER SHA`,
    shaTypes: [
      { name: "尖角煞", element: "书桌尖角", check: "书桌尖角是否对着床？" }
    ],
    items: [{ file: "plant-broad.png", name: "阔叶绿植" }],
    fixes: [
      "A BROAD-LEAF PLANT placed between the sharp corner and the bed, blocking the sharp energy",
      "Desk is organized - papers neatly arranged",
      "Floor cleared of clutter",
      "Warmer, relaxed study atmosphere"
    ]
  },
  4: {
    name: "猫奴的客厅",
    scene: "living room with cat furniture",
    atmosphere: {
      cold: "gloomy rainy afternoon",
      warm: "cozy sunny afternoon"
    },
    lighting: {
      cold: "Cold rainy afternoon",
      warm: "Warm cozy sunlight"
    },
    floorItems: `- Cat furniture arranged
- Some cat toys`,
    specialFeatures: `ZONE A - ENTRANCE:
- Front door visible

ZONE B - BALCONY:
- Balcony door opposite entrance
- CRITICAL: DOOR CLASH (穿堂煞)`,
    shaTypes: [
      { name: "穿堂煞", element: "门对门", check: "大门是否正对阳台门？" }
    ],
    items: [{ file: "screen.png", name: "屏风" }],
    fixes: [
      "A SCREEN placed perpendicular between entrance and balcony door, blocking the direct line",
      "Cat toys organized",
      "Floor vacuumed and tidy",
      "Warm afternoon sunlight"
    ]
  },
  5: {
    name: "游戏宅卧室",
    scene: "gamer bedroom with setup",
    atmosphere: {
      cold: "late night gaming session",
      warm: "balanced gaming lifestyle"
    },
    lighting: {
      cold: "Dark with RGB glow",
      warm: "Natural morning sunlight"
    },
    floorItems: `- Gaming peripherals
- Some snack wrappers (few, not excessive)
- Headphones on desk`,
    specialFeatures: `ZONE A - BED:
- Bed with ceiling beam above
- CRITICAL: BEAM SHA

ZONE B - GAMING DESK:
- Sharp corner facing bed
- CRITICAL: SHARP CORNER SHA`,
    shaTypes: [
      { name: "横梁压顶", element: "床头横梁", check: "横梁是否在床头？" },
      { name: "尖角煞", element: "书桌尖角", check: "书桌尖角是否对着床？" }
    ],
    items: [
      { file: "gourd.png", name: "葫芦" },
      { file: "plant-broad.png", name: "阔叶绿植" }
    ],
    fixes: [
      "GOURD tied to ceiling beam with red cord",
      "BROAD-LEAF PLANT placed between sharp corner and bed",
      "RGB lighting toned down to warm ambient",
      "Floor cleared of snack wrappers, peripherals organized",
      "Morning sunlight instead of dark night"
    ]
  },
  6: {
    name: "创业工作室",
    scene: "startup studio office",
    atmosphere: {
      cold: "busy chaotic startup",
      warm: "harmonious productive workspace"
    },
    lighting: {
      cold: "Overcast grey morning",
      warm: "Bright warm morning sun"
    },
    floorItems: `- Some papers on desk
- Whiteboard markers
- Coffee cups (2-3, not excessive)`,
    specialFeatures: `ZONE A - WORK AREA:
- Desk with chair
- CRITICAL: Back faces door (BACK DOOR SHA)

ZONE B - PILLAR:
- Structural pillar with sharp corner
- CRITICAL: PILLAR SHA`,
    shaTypes: [
      { name: "背门煞", element: "座位背门", check: "座位是否背对门？" },
      { name: "柱角煞", element: "柱子尖角", check: "柱子尖角是否冲座位？" }
    ],
    items: [
      { file: "dragon-turtle.png", name: "龙龟" },
      { file: "plant-broad.png", name: "阔叶绿植" }
    ],
    fixes: [
      "DRAGON TURTLE placed on desk BEHIND chair for backing support",
      "BROAD-LEAF PLANT placed between pillar and desk",
      "Papers organized and filed",
      "Desks tidied, whiteboard cleaned",
      "Warm morning sun creating productive atmosphere"
    ],
    lighting: {
      cold: "Overcast grey morning",
      warm: "Bright warm morning sun"
    }
  },
  7: {
    name: "小夫妻婚房",
    scene: "one-bedroom apartment",
    atmosphere: "newlywed tension",
    lighting: "evening tension light",
    floorItems: `- Some personal items
- Makeup on vanity`,
    specialFeatures: `ZONE A - BEDROOM:
- Bed with mirror opposite
- CRITICAL: MIRROR SHA

ZONE B - LIVING:
- Door visible
- Sharp corner
- CRITICAL: DOOR CLASH and SHARP CORNER`,
    shaTypes: [
      { name: "镜冲床", element: "镜子对床", check: "镜子是否对着床？" },
      { name: "门冲", element: "门冲", check: "是否有门冲？" },
      { name: "尖角煞", element: "尖角", check: "是否有尖角煞？" }
    ],
    items: [
      { file: "screen.png", name: "屏风" },
      { file: "plant-broad.png", name: "阔叶绿植" }
    ],
    fixes: [
      "Mirror ROTATED away from bed",
      "SCREEN placed to block door clash",
      "PLANT placed to block sharp corner",
      "Room tidied - personal items organized",
      "Harmonious warm evening light"
    ],
    lighting: {
      cold: "Tense evening shadows",
      warm: "Harmonious warm evening"
    }
  },
  8: {
    name: "开放式厨房公寓",
    scene: "open-concept apartment",
    atmosphere: "cold modern evening",
    lighting: "harsh artificial light",
    floorItems: `- Kitchen items on counter
- Some dishes (not excessive)`,
    specialFeatures: `ZONE A - KITCHEN:
- Stove visible
- CRITICAL: KITCHEN SHA (stove position)

ZONE B - LIVING:
- Balcony door
- CRITICAL: DOOR CLASH`,
    shaTypes: [
      { name: "灶台冲门", element: "灶台", check: "灶台是否冲门？" },
      { name: "穿堂煞", element: "门对门", check: "是否有穿堂煞？" }
    ],
    items: [
      { file: "screen.png", name: "屏风" },
      { file: "gourd.png", name: "葫芦" },
      { file: "plant-broad.png", name: "阔叶绿植" }
    ],
    fixes: [
      "SCREEN placed to block door clash",
      "GOURD tied to kitchen beam",
      "PLANT placed for balance",
      "Kitchen counters cleaned and organized",
      "Dishes put away",
      "Warm sunset glow through windows"
    ],
    lighting: {
      cold: "Harsh artificial light",
      warm: "Golden sunset glow"
    }
  },
  9: {
    name: "阁楼房间",
    scene: "attic bedroom with slanted ceiling",
    atmosphere: "cold damp evening",
    lighting: "dim with skylight",
    floorItems: `- Minimal items
- Simple bedding`,
    specialFeatures: `ZONE A - BED:
- Bed under SLANTED CEILING
- CRITICAL: SLANTED CEILING SHA

ZONE B - SKYLIGHT:
- Large skylight above
- CRITICAL: WINDOW SHA

ZONE C - CORNER:
- Dark corner
- CRITICAL: YIN SHA`,
    shaTypes: [
      { name: "斜顶压床", element: "斜顶", check: "床是否在斜顶下？" },
      { name: "窗户煞", element: "天窗", check: "天窗是否过大？" },
      { name: "阴煞", element: "暗角", check: "是否有暗角？" }
    ],
    items: [
      { file: "curtain.png", name: "窗帘" },
      { file: "salt-lamp.png", name: "盐灯" }
    ],
    fixes: [
      "Bed MOVED to flat ceiling area (position changed)",
      "CURTAIN installed on skylight",
      "SALT LAMP placed in dark corner glowing warm orange",
      "Room tidied and organized",
      "Cozy warm atmosphere"
    ],
    lighting: {
      cold: "Dim with harsh skylight",
      warm: "Soft filtered light with warm glow"
    }
  },
  10: {
    name: "老人的卧室",
    scene: "elder's modest bedroom",
    atmosphere: "cold lonely evening",
    lighting: "dim evening light",
    floorItems: `- Simple belongings
- Medication on nightstand
- Minimal clutter`,
    specialFeatures: `ZONE A - BED:
- Simple bed
- CRITICAL: BEAM above bed

ZONE B - BATHROOM:
- Bathroom door visible
- CRITICAL: BATHROOM DOOR CLASH

ZONE C - CORNER:
- Dark corner
- CRITICAL: YIN SHA`,
    shaTypes: [
      { name: "横梁压顶", element: "床头横梁", check: "是否有横梁？" },
      { name: "厕所门冲", element: "厕所门", check: "厕所门是否冲床？" },
      { name: "阴煞", element: "暗角", check: "是否有暗角？" }
    ],
    items: [
      { file: "gourd.png", name: "葫芦" },
      { file: "curtain.png", name: "门帘" },
      { file: "salt-lamp.png", name: "盐灯" }
    ],
    fixes: [
      "GOURD tied to ceiling beam with red cord",
      "CURTAIN hung on bathroom door",
      "SALT LAMP placed in dark corner",
      "Room made tidy and comfortable for elderly",
      "Warm, healthy atmosphere"
    ],
    lighting: {
      cold: "Dim lonely evening",
      warm: "Warm comfortable evening"
    }
  },
  11: {
    name: "开放式Loft",
    scene: "modern loft apartment",
    atmosphere: "chaotic energy flow",
    lighting: "overcast cold light",
    floorItems: `- Some boxes
- Minimal floor clutter`,
    specialFeatures: `ZONE A - STAIRS:
- Staircase visible
- CRITICAL: STAIR CLASH

ZONE B - KITCHEN:
- Stove position
- CRITICAL: KITCHEN SHA

ZONE C - LIVING:
- Multiple energy issues`,
    shaTypes: [
      { name: "楼梯冲门", element: "楼梯", check: "楼梯是否冲门？" },
      { name: "灶台冲门", element: "灶台", check: "灶台位置？" },
      { name: "穿堂煞", element: "穿堂", check: "是否有穿堂煞？" },
      { name: "横梁压顶", element: "横梁", check: "是否有横梁？" }
    ],
    items: [
      { file: "screen.png", name: "屏风" },
      { file: "plant-broad.png", name: "阔叶绿植" },
      { file: "gourd.png", name: "葫芦" }
    ],
    fixes: [
      "SCREEN placed to block stair clash",
      "PLANT placed for穿堂煞",
      "GOURD tied to beam",
      "Space organized and tidy",
      "Warm sunrise glow"
    ],
    lighting: {
      cold: "Overcast cold",
      warm: "Warm sunrise"
    }
  },
  12: {
    name: "程序员工位",
    scene: "office workstation",
    atmosphere: "busy tech chaos",
    lighting: "fluorescent office light",
    floorItems: `- Tech equipment
- Some cables (not excessive)
- Coffee cup`,
    specialFeatures: `ZONE A - DESK:
- Desk with computer
- CRITICAL: BACK TO DOOR

ZONE B - PILLAR:
- Pillar corner
- CRITICAL: PILLAR SHA

ZONE C - CABLES:
- Tangled wires
- CRITICAL: ELECTRIC SHA

ZONE D - WEALTH:
- Wealth corner cluttered
- CRITICAL: WEALTH SHA`,
    shaTypes: [
      { name: "背门煞", element: "座位", check: "座位是否背门？" },
      { name: "柱角煞", element: "柱子", check: "柱子尖角？" },
      { name: "电线煞", element: "电线", check: "电线是否杂乱？" },
      { name: "财位问题", element: "财位", check: "财位是否杂乱？" }
    ],
    items: [
      { file: "dragon-turtle.png", name: "龙龟" },
      { file: "plant-broad.png", name: "阔叶绿植" },
      { file: "copper-gourd.png", name: "铜葫芦" },
      { file: "money-toad.png", name: "金蟾" }
    ],
    fixes: [
      "DRAGON TURTLE on desk behind chair",
      "PLANT between pillar and desk",
      "COPPER GOURD near cable area",
      "MONEY TOAD in wealth corner with clean space",
      "Cables organized and tidied",
      "Desk cleaned and organized"
    ],
    lighting: {
      cold: "Fluorescent harsh",
      warm: "Warm comfortable office"
    }
  },
  13: {
    name: "小型办公室",
    scene: "10-person startup office",
    atmosphere: "busy workday chaos",
    lighting: "fluorescent lighting",
    floorItems: `- Office supplies
- Some papers
- Minimal clutter`,
    specialFeatures: `ZONE A - ENTRANCE:
- Door with direct line
- CRITICAL: DOOR CLASH

ZONE B - BEAM:
- Ceiling beam
- CRITICAL: BEAM SHA

ZONE C - WEALTH:
- Wealth corner
- CRITICAL: WEALTH SHA

ZONE D - CABINET:
- Sharp cabinet corner
- CRITICAL: SHARP CORNER`,
    shaTypes: [
      { name: "门冲", element: "门", check: "是否有门冲？" },
      { name: "横梁压顶", element: "横梁", check: "是否有横梁？" },
      { name: "财位问题", element: "财位", check: "财位？" },
      { name: "尖角煞", element: "尖角", check: "是否有尖角？" }
    ],
    items: [
      { file: "screen.png", name: "屏风" },
      { file: "gourd.png", name: "葫芦" },
      { file: "lucky-cat.png", name: "招财猫" },
      { file: "plant-broad.png", name: "阔叶绿植" }
    ],
    fixes: [
      "SCREEN near entrance",
      "GOURD tied to beam",
      "LUCKY CAT in wealth corner",
      "PLANT blocking cabinet corner",
      "Office tidied and organized",
      "Warm professional atmosphere"
    ],
    lighting: {
      cold: "Fluorescent harsh",
      warm: "Warm professional"
    }
  },
  14: {
    name: "儿童房",
    scene: "children's bedroom",
    atmosphere: "playful but problematic",
    lighting: "dim evening",
    floorItems: `- Toys (reasonable amount)
- Books
- Study materials`,
    specialFeatures: `ZONE A - BED:
- Child bed
- CRITICAL: BEAM above

ZONE B - MIRROR:
- Mirror position
- CRITICAL: MIRROR SHA

ZONE C - BOOKSHELF:
- Sharp corner
- CRITICAL: SHARP CORNER

ZONE D - DOOR/WINDOW:
- Direct line
- CRITICAL: DOOR CLASH`,
    shaTypes: [
      { name: "横梁压顶", element: "横梁", check: "是否有横梁？" },
      { name: "镜煞", element: "镜子", check: "镜子位置？" },
      { name: "尖角煞", element: "尖角", check: "尖角？" },
      { name: "门冲", element: "门冲", check: "门冲？" }
    ],
    items: [
      { file: "gourd.png", name: "葫芦" },
      { file: "plant-broad.png", name: "阔叶绿植" },
      { file: "screen.png", name: "屏风" }
    ],
    fixes: [
      "GOURD tied to beam",
      "Mirror ROTATED away from bed",
      "PLANT blocking bookshelf corner",
      "SCREEN between door and window",
      "Toys organized in basket",
      "Room tidied for child safety",
      "Warm nurturing atmosphere"
    ],
    lighting: {
      cold: "Dim evening",
      warm: "Warm nurturing"
    }
  },
  15: {
    name: "艺术家工作室",
    scene: "artist studio",
    atmosphere: "creative but blocked",
    lighting: "dim creative space",
    floorItems: `- Art supplies
- Some paint tubes
- Canvases (neatly arranged)`,
    specialFeatures: `ZONE A - EASEL:
- Art easel
- CRITICAL: BEAM above

ZONE B - SHELF:
- Display shelf
- Sharp corner
- CRITICAL: SHARP CORNER

ZONE C - DARK CORNER:
- Dark area
- CRITICAL: YIN SHA

ZONE D - BATHROOM:
- Door visible
- CRITICAL: SMELL SHA

ZONE E - WINDOW:
- Large window
- CRITICAL: WINDOW SHA`,
    shaTypes: [
      { name: "横梁压顶", element: "横梁", check: "是否有横梁？" },
      { name: "尖角煞", element: "尖角", check: "尖角？" },
      { name: "阴煞", element: "阴煞", check: "暗角？" },
      { name: "味煞", element: "味煞", check: "味煞？" }
    ],
    items: [
      { file: "gourd.png", name: "葫芦" },
      { file: "plant-broad.png", name: "阔叶绿植" },
      { file: "salt-lamp.png", name: "盐灯" },
      { file: "curtain.png", name: "窗帘" }
    ],
    fixes: [
      "GOURD tied to beam",
      "PLANT blocking shelf corner",
      "SALT LAMP in dark corner",
      "CURTAIN on bathroom door",
      "CURTAIN on window",
      "Studio organized - supplies neatly arranged",
      "Warm inspiring creative atmosphere"
    ],
    lighting: {
      cold: "Dim blocked",
      warm: "Warm inspiring"
    }
  },
  16: {
    name: "瑜伽工作室",
    scene: "yoga studio",
    atmosphere: "stagnant energy",
    lighting: "cloudy afternoon",
    floorItems: `- Yoga mats (rolled)
- Minimal items`,
    specialFeatures: `ZONE A - YOGA AREA:
- Yoga space
- CRITICAL: YIN SHA (too much)

ZONE B - CORNER:
- Sharp corner
- CRITICAL: SHARP CORNER

ZONE C - WINDOW:
- Large window
- CRITICAL: WINDOW SHA

ZONE D - WEALTH:
- Wealth area
- CRITICAL: WEALTH SHA

ZONE E - ENTRANCE:
- Smell from changing room
- CRITICAL: SMELL SHA`,
    shaTypes: [
      { name: "阴煞", element: "阴煞", check: "阴煞？" },
      { name: "尖角煞", element: "尖角", check: "尖角？" },
      { name: "窗户煞", element: "窗户", check: "窗户？" },
      { name: "财位问题", element: "财位", check: "财位？" },
      { name: "味煞", element: "味煞", check: "味煞？" }
    ],
    items: [
      { file: "salt-lamp.png", name: "盐灯" },
      { file: "plant-broad.png", name: "阔叶绿植" },
      { file: "curtain.png", name: "窗帘" },
      { file: "money-toad.png", name: "金蟾" }
    ],
    fixes: [
      "SALT LAMPS placed around studio",
      "PLANTS blocking sharp corners",
      "CURTAINS on windows",
      "MONEY TOAD in wealth corner",
      "Space organized and clean",
      "Warm filtered morning light"
    ],
    lighting: {
      cold: "Cloudy stagnant",
      warm: "Warm filtered"
    }
  },
  17: {
    name: "复式公寓二层",
    scene: "duplex upper floor bedroom",
    atmosphere: "tense sleeping area",
    lighting: "dim evening",
    floorItems: `- Minimal items
- Simple belongings`,
    specialFeatures: `ZONE A - BED:
- Bed under beam
- CRITICAL: BEAM SHA

ZONE B - WARDROBE:
- Mirror on wardrobe
- CRITICAL: MIRROR SHA

ZONE C - STAIRS:
- Space under stairs
- CRITICAL: UNDER-STAIRS SHA

ZONE D - CORNER:
- Dark corner
- CRITICAL: YIN SHA

ZONE E - WARDROBE CORNER:
- Sharp corner
- CRITICAL: SHARP CORNER`,
    shaTypes: [
      { name: "横梁压顶", element: "横梁", check: "横梁？" },
      { name: "镜煞", element: "镜子", check: "镜子？" },
      { name: "楼梯下煞", element: "楼梯", check: "楼梯下？" },
      { name: "阴煞", element: "阴煞", check: "阴煞？" },
      { name: "尖角煞", element: "尖角", check: "尖角？" }
    ],
    items: [
      { file: "gourd.png", name: "葫芦" },
      { file: "crystal-ball.png", name: "水晶球" },
      { file: "salt-lamp.png", name: "盐灯" },
      { file: "plant-broad.png", name: "阔叶绿植" }
    ],
    fixes: [
      "GOURD tied to beam",
      "WARDROBE mirror ROTATED away from bed",
      "CRYSTAL BALL placed under stairs",
      "SALT LAMP in dark corner",
      "PLANT blocking wardrobe corner",
      "Room tidied and peaceful",
      "Warm restful atmosphere"
    ],
    lighting: {
      cold: "Dim tense",
      warm: "Warm peaceful"
    }
  },
  18: {
    name: "别墅客厅",
    scene: "luxury villa living room",
    atmosphere: "externally threatened",
    lighting: "cold evening with external pressure",
    floorItems: `- Minimal elegant items
- Some decorations`,
    specialFeatures: `ZONE A - ENTRANCE:
- Main entrance
- CRITICAL: ROAD CLASH (outside)

ZONE B - WINDOW:
- Large window
- CRITICAL: SKY SPLIT SHA (external buildings)
- CRITICAL: REVERSE BOW SHA (curved road)

ZONE C - WEALTH:
- Wealth corner
- CRITICAL: WEALTH SHA

ZONE D - DOORS:
- Back door
- CRITICAL: DOOR CLASH

ZONE E - FIREPLACE:
- Fireplace
- CRITICAL: FIREPLACE SHA`,
    shaTypes: [
      { name: "路冲煞", element: "路冲", check: "路冲？" },
      { name: "天斩煞", element: "天斩", check: "天斩？" },
      { name: "反弓煞", element: "反弓", check: "反弓？" },
      { name: "财位问题", element: "财位", check: "财位？" },
      { name: "门冲", element: "门冲", check: "门冲？" },
      { name: "壁炉煞", element: "壁炉", check: "壁炉？" }
    ],
    items: [
      { file: "shan-hai-zhen.png", name: "山海镇" },
      { file: "stone-tablet.png", name: "石敢当" },
      { file: "pi-xiu.png", name: "貔貅" },
      { file: "screen.png", name: "屏风" },
      { file: "plant-broad.png", name: "阔叶绿植" }
    ],
    fixes: [
      "SHAN HAI ZHEN hung on wall facing outside",
      "STONE TABLET near entrance",
      "PLANTS near window facing road",
      "PIXIU in wealth corner",
      "SCREEN between entrance and back door",
      "PLANT near fireplace",
      "Space elegantly organized",
      "Warm harmonious luxurious atmosphere"
    ],
    lighting: {
      cold: "Cold threatened",
      warm: "Warm protected"
    }
  },
  19: {
    name: "企业老板办公室",
    scene: "CEO executive office",
    atmosphere: "powerful but imbalanced",
    lighting: "harsh executive lighting",
    floorItems: `- Executive items
- Minimal clutter`,
    specialFeatures: `ZONE A - DESK:
- Executive desk
- CRITICAL: BACK TO DOOR

ZONE B - WINDOW:
- Large window
- CRITICAL: WALL BLADE SHA (external)

ZONE C - WEALTH:
- Wealth corner
- CRITICAL: WEALTH SHA

ZONE D - BEAM:
- Ceiling beam
- CRITICAL: BEAM SHA

ZONE E - WINDOW/BATHROOM:
- Harsh light and bathroom door
- CRITICAL: WINDOW SHA and SMELL SHA`,
    shaTypes: [
      { name: "背门煞", element: "背门", check: "背门？" },
      { name: "壁刀煞", element: "壁刀", check: "壁刀？" },
      { name: "财位问题", element: "财位", check: "财位？" },
      { name: "横梁压顶", element: "横梁", check: "横梁？" },
      { name: "窗户煞", element: "窗户", check: "窗户？" },
      { name: "味煞", element: "味煞", check: "味煞？" }
    ],
    items: [
      { file: "dragon-turtle.png", name: "龙龟" },
      { file: "bagua-mirror.png", name: "八卦镜" },
      { file: "lucky-cat.png", name: "招财猫" },
      { file: "gourd.png", name: "葫芦" },
      { file: "curtain.png", name: "窗帘" }
    ],
    fixes: [
      "DRAGON TURTLE on desk behind chair",
      "BAGUA MIRROR on wall facing outside",
      "LUCKY CAT in wealth corner",
      "GOURD tied to beam",
      "CURTAINS on window and bathroom door",
      "Office professionally organized",
      "Warm prosperous executive atmosphere"
    ],
    lighting: {
      cold: "Harsh executive",
      warm: "Warm commanding"
    }
  },
  20: {
    name: "风水大考",
    scene: "ultimate challenge room",
    atmosphere: "chaotic imbalanced",
    lighting: "extremely oppressive",
    floorItems: `- Various items showing multiple problems`,
    specialFeatures: `ZONE A - BED:
- Bed under beam
- CRITICAL: BEAM SHA

ZONE B - MIRROR:
- Mirror facing bed
- CRITICAL: MIRROR SHA

ZONE C - WINDOW:
- External threats
- CRITICAL: SKY SPLIT SHA

ZONE D - ROAD:
- Road outside
- CRITICAL: ROAD CLASH and REVERSE BOW

ZONE E - DOORS:
- Door clash
- CRITICAL: DOOR CLASH

ZONE F - WEALTH:
- Cluttered wealth area
- CRITICAL: WEALTH SHA

ZONE G - CORNER:
- Dark corner
- CRITICAL: YIN SHA`,
    shaTypes: [
      { name: "横梁压顶", element: "横梁", check: "横梁？" },
      { name: "镜冲床", element: "镜子", check: "镜子？" },
      { name: "天斩煞", element: "天斩", check: "天斩？" },
      { name: "路冲煞", element: "路冲", check: "路冲？" },
      { name: "反弓煞", element: "反弓", check: "反弓？" },
      { name: "穿堂煞", element: "穿堂", check: "穿堂？" },
      { name: "财位问题", element: "财位", check: "财位？" },
      { name: "阴煞", element: "阴煞", check: "阴煞？" }
    ],
    items: [
      { file: "gourd.png", name: "葫芦" },
      { file: "shan-hai-zhen.png", name: "山海镇" },
      { file: "stone-tablet.png", name: "石敢当" },
      { file: "plant-broad.png", name: "阔叶绿植" },
      { file: "screen.png", name: "屏风" },
      { file: "money-toad.png", name: "金蟾" },
      { file: "salt-lamp.png", name: "盐灯" }
    ],
    fixes: [
      "GOURD tied to beam",
      "Mirror ROTATED away from bed",
      "SHAN HAI ZHEN on wall",
      "STONE TABLET near entrance",
      "PLANTS at sharp corners and buffers",
      "SCREEN between door and window",
      "MONEY TOAD in wealth corner",
      "SALT LAMP in dark corner",
      "Room completely organized and harmonious",
      "Perfectly balanced warm harmonious atmosphere - ultimate feng shui success"
    ],
    lighting: {
      cold: "Extremely oppressive",
      warm: "Perfectly balanced harmonious"
    }
  }
};

// 主函数
async function main() {
  console.log('开始优化所有关卡提示词...\n');
  
  const basePath = '/Users/elvis/Documents/codes/challenges/2026/Jan/fengshui/docs/design/game';
  
  for (let level = 1; level <= 20; level++) {
    const levelInfo = levelInfos[level];
    if (!levelInfo) {
      console.log(`跳过 Level ${level} - 没有配置信息`);
      continue;
    }
    
    const levelPath = path.join(basePath, `level${level}`, 'prompts');
    
    // 确保目录存在
    if (!fs.existsSync(levelPath)) {
      fs.mkdirSync(levelPath, { recursive: true });
    }
    
    // 生成冷图提示词
    const coldPrompt = generateColdPrompt(level, levelInfo);
    const coldPath = path.join(levelPath, 'room-cold-v1.0.md');
    fs.writeFileSync(coldPath, coldPrompt);
    console.log(`✅ Level ${level} - 冷图提示词已更新`);
    
    // 生成暖图提示词
    const warmPrompt = generateWarmPrompt(level, levelInfo);
    const warmPath = path.join(levelPath, 'room-warm-v1.0.md');
    fs.writeFileSync(warmPath, warmPrompt);
    console.log(`✅ Level ${level} - 暖图提示词已更新`);
  }
  
  console.log('\n✨ 所有提示词优化完成！');
  console.log('\n优化要点：');
  console.log('1. 使用自然语言描述（Nano Banana Pro 最佳实践）');
  console.log('2. 强调材质和纹理细节');
  console.log('3. 控制杂乱度 - "lived-in but energetically imbalanced"而非"filthy"');
  console.log('4. 暖图新增"整洁度"要求 - 风水调整后房间变得整洁有序');
  console.log('5. 更精确的光线和氛围描述');
}

main().catch(console.error);

