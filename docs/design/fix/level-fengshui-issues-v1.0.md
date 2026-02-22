# 关卡风水问题修复方案 v1.0

## 问题概述

经过对所有 20 个关卡的全面审查，发现多个关卡存在以下问题：

1. **hotspots.json 记录错误** - AI 分析结果与实际图片不符
2. **暖色图未解决煞气** - Gemini image-to-image 未能正确执行风水修正

---

## 问题关卡清单

### 严重问题（必须修复）

| Level | 问题类型 | 详细说明 | 优先级 |
|-------|---------|---------|--------|
| **7** | ❶ hotspots.json 错误 ❷ 暖色图未解决 | ① 冷色图有 3 个镜子，只记录 2 个；② 大镜子仍正对床 | P0 |
| **17** | 暖色图未解决 | 镜子仍然对着床，未遮挡/移除/旋转 | P0 |
| **11** | 暖色图未解决 | 灶台问题未解决，没有屏风遮挡 | P0 |
| **19** | 暖色图未解决 | 4 个煞气只解决 1 个（葫芦），其他未处理 | P0 |

### 中等问题（建议修复）

| Level | 问题类型 | 详细说明 | 优先级 |
|-------|---------|---------|--------|
| **4** | 暖色图部分未解决 | 穿堂煞已解决（屏风），但味煞未解决（猫砂盆无遮挡） | P1 |
| **13** | 暖色图未解决 | 3 个煞气均未完全解决 | P1 |
| **18** | 暖色图待验证 | 5 个煞气需要验证是否解决 | P1 |
| **3** | 暖色图部分未解决 | 尖角煞已解决（绿植），但床位对门等问题未解决 | P2 |
| **15** | 暖色图部分未解决 | 厕所门帘问题无法验证 | P2 |

### 无问题关卡

| Level | 煞气类型 | 验证状态 |
|-------|---------|---------|
| 1 | 横梁压顶 | ✅ 葫芦已悬挂 |
| 2 | 镜冲床 | ✅ 镜子斜向放置，不直射床 |
| 5 | 横梁+尖角 | ✅ 葫芦+绿植已放置 |
| 6 | 背门煞+柱角煞 | ✅ 龙龟+绿植已放置 |
| 8 | 灶台冲+穿堂+横梁 | ✅ 屏风+绿植+葫芦已放置 |
| 9 | 斜顶压床+窗户煞+阴煞 | ✅ 床已移开+窗帘+盐灯 |
| 10 | 横梁+阴煞+门冲 | ✅ 葫芦+盐灯+门帘 |
| 12 | 横梁+柱角+电线+财位 | ✅ 葫芦+绿植已放置 |
| 14 | 横梁+镜冲床+门冲 | ✅ 镜子已移除 |
| 16 | 5 个煞气 | ⚠️ 图片分析失败，待手动验证 |
| 20 | 横梁+镜冲床+天斩+反弓+财位+阴煞 | ✅ 镜子不面对床 |

---

## 详细问题分析

### Level 7 - 小夫妻婚房

**hotspots.json 问题**：
```
冷色图实际有 3 个镜子：
1. 大型装饰镜（墙上，正对床）← 主要煞气
2. 梳妆台小镜（梳妆台上）← 角度不面对床，非煞气
3. 书桌小镜（前景书桌上）← 未记录

但 hotspots.json 只记录了 2 个"镜冲床"，且描述不准确
```

**暖色图问题**：
- 大型镜子仍然正对床
- 未添加布帘遮挡
- 未旋转或移除镜子

**修复方案**：
1. 重新分析冷色图，生成准确的 hotspots.json
2. 修改暖色图提示词，明确要求：
   - "在镜子上挂一块厚布帘"
   - 或 "镜子已旋转朝向墙壁"
3. 重新生成暖色图

---

### Level 11 - 开放式 Loft

**hotspots.json 记录**：
```json
[
  { "id": "sha-001", "type": "楼梯冲门", "correctItem": "screen" },
  { "id": "sha-002", "type": "横梁压顶", "correctItem": "gourd" },
  { "id": "sha-003", "type": "穿堂煞", "correctItem": "plant-broad" },
  { "id": "sha-004", "type": "灶台外露", "correctItem": "screen" }
]
```

**暖色图验证结果**：
| 煞气 | 解决状态 | 详情 |
|-----|---------|------|
| 楼梯冲门 | ✅ 已解决 | TV 作为屏风遮挡 |
| 横梁压顶 | ✅ 已解决 | 葫芦已悬挂 |
| 穿堂煞 | ✅ 已解决 | 绿植已放置 |
| 灶台外露 | ❌ 未解决 | 无遮挡 |

**修复方案**：
修改暖色图提示词，明确要求：
- "在灶台和客厅之间放置一个屏风"

---

### Level 17 - Loft 公寓

**hotspots.json 记录**：
```json
[
  { "id": 1, "name": "横梁压顶", "severity": "High" },
  { "id": 2, "name": "镜冲床", "severity": "High" },
  { "id": 3, "name": "尖角煞", "severity": "Medium" },
  { "id": 4, "name": "阴煞", "severity": "Medium" },
  { "id": 5, "name": "楼梯下煞", "severity": "Medium" }
]
```

**暖色图验证结果**：
- 横梁压顶：✅ 葫芦已悬挂
- 镜冲床：❌ **镜子仍然对着床，未遮挡/移除/旋转**
- 其他：待验证

**修复方案**：
修改暖色图提示词，明确要求：
- "衣柜镜子已被布帘完全遮挡"
- 或 "镜子已移除，衣柜门换成实木门"

---

### Level 19 - 家庭办公室

**hotspots.json 记录**：
```json
[
  { "id": "A", "type": "背门煞", "correctItem": "dragon-turtle" },
  { "id": "B", "type": "横梁压顶", "correctItem": "gourd" },
  { "id": "C", "type": "财位问题", "correctItem": "清理+招财摆件" },
  { "id": "E", "type": "味煞", "correctItem": "curtain" }
]
```

**暖色图验证结果**：
| 煞气 | 解决状态 | 详情 |
|-----|---------|------|
| 背门煞 | ❌ 未解决 | 桌上无龙龟 |
| 横梁压顶 | ✅ 已解决 | 葫芦已悬挂 |
| 财位问题 | ❌ 未解决 | 仍然杂乱 |
| 味煞 | ❌ 未解决 | 卫生间门无门帘 |

**修复方案**：
修改暖色图提示词，明确要求：
- "在办公桌上放置一个龙龟摆件"
- "财位角落已清理干净，放置了招财摆件"
- "卫生间门上挂着门帘"

---

### Level 4 - 猫奴的客厅

**hotspots.json 记录**：
```json
[
  { "id": "sha-cat-01", "type": "穿堂煞", "correctItem": "screen" },
  { "id": "sha-cat-02", "type": "味煞", "correctItem": "curtain" }
]
```

**暖色图验证结果**：
| 煞气 | 解决状态 | 详情 |
|-----|---------|------|
| 穿堂煞 | ✅ 已解决 | 屏风已放置 |
| 味煞 | ❌ 未解决 | 猫砂盆无遮挡 |

**修复方案**：
修改暖色图提示词，明确要求：
- "猫砂盆区域已加装帘子或隔断遮挡"

---

### Level 13 - 办公室

**hotspots.json 记录**：
```json
[
  { "id": 1, "type": "横梁压顶" },
  { "id": 2, "type": "门冲" },
  { "id": 3, "type": "财位问题" }
]
```

**暖色图验证结果**：
| 煞气 | 解决状态 | 详情 |
|-----|---------|------|
| 横梁压顶 | ⚠️ 部分解决 | 葫芦位置不对 |
| 门冲 | ❌ 未解决 | 无屏风遮挡 |
| 财位问题 | ⚠️ 部分解决 | 有招财猫但仍有杂物 |

**修复方案**：
修改暖色图提示词，明确要求：
- "葫芦直接悬挂在座位正上方的横梁上"
- "门和办公桌之间有屏风遮挡"
- "财位角落已清理干净"

---

## 修复策略

### 策略 1：优化暖色图提示词

**问题根源**：Gemini image-to-image 对"遮挡/移除/旋转镜子"等结构性修改执行不稳定。

**解决方案**：在提示词中使用更具体、更明确的描述。

**优化模板**：
```text
FENG SHUI CORRECTIONS TO APPLY (CRITICAL - MUST BE VISIBLE):

1. MIRROR SHA (镜冲床):
   - The large wall mirror facing the bed MUST be COMPLETELY COVERED
   - A thick fabric curtain/curtain is hung over the mirror surface
   - OR the mirror is removed and replaced with solid wood panel
   - This is MANDATORY - do not leave the mirror exposed

2. SCREEN (屏风):
   - A wooden folding screen is placed BETWEEN [location A] and [location B]
   - The screen should be clearly visible and block the direct line of sight

3. PLANT (绿植):
   - A broad-leaf potted plant is placed NEXT TO [location]
   - The plant should be visible and clearly blocking the sharp corner
```

### 策略 2：重新分析冷色图

对于 hotspots.json 记录不准确的关卡，需要：

1. 使用 AI 重新分析冷色图
2. 确保所有镜子、煞气点都被正确记录
3. 区分"真正煞气"和"非煞气"（如镜子角度不对床）

### 策略 3：多轮迭代生成

如果单次生成无法解决所有问题：

1. 先生成基础暖色图
2. 检查未解决的问题
3. 使用 patch 方式单独修复（如添加布帘遮挡镜子）

---

## 执行计划

### Phase 1：修复 P0 问题（立即）

| 任务 | 关卡 | 预计工作量 |
|-----|------|----------|
| 重新生成 hotspots.json | Level 7 | 1 次 AI 分析 |
| 优化提示词 + 重新生成暖色图 | Level 7, 11, 17, 19 | 4 次生图 |

### Phase 2：修复 P1 问题（重要）

| 任务 | 关卡 | 预计工作量 |
|-----|------|----------|
| 优化提示词 + 重新生成暖色图 | Level 4, 13 | 2 次生图 |
| 验证暖色图 | Level 16, 18 | 2 次验证 |

### Phase 3：修复 P2 问题（可选）

| 任务 | 关卡 | 预计工作量 |
|-----|------|----------|
| 评估是否需要修复 | Level 3, 15 | 评估后决定 |

---

## 暖色图提示词优化清单

### 镜子问题专用模板

```text
CRITICAL: MIRROR CORRECTION IS MANDATORY

Original: Large wall mirror directly facing the bed
Correction: The mirror is now COMPLETELY COVERED with a decorative fabric curtain
Visual requirement: 
- The curtain should be clearly visible hanging over the mirror
- The mirror surface should NOT be visible
- The curtain color should match the warm room palette (beige, gold, or cream)
```

### 灶台遮挡专用模板

```text
CRITICAL: KITCHEN STOVE SHIELDING IS MANDATORY

Original: Open kitchen stove visible from living area
Correction: A wooden folding screen is placed BETWEEN the stove and living area
Visual requirement:
- The screen should clearly block the direct line of sight to the stove
- Screen style: traditional Chinese wooden screen with lattice pattern
- Screen color: warm brown wood tone matching the furniture
```

### 门帘遮挡专用模板

```text
CRITICAL: DOOR CURTAIN IS MANDATORY

Original: [Toilet/Litter box] door is open, exposing negative energy
Correction: A curtain is hung on the door frame
Visual requirement:
- The curtain should cover the door opening
- Curtain style: fabric with subtle pattern
- Curtain color: warm tone matching the room palette
```

---

## 验证清单

修复后需验证：

- [ ] hotspots.json 记录与冷色图实际内容一致
- [ ] 暖色图中每个煞气都有对应的解决方案
- [ ] 镜子被布帘遮挡 / 移除 / 旋转
- [ ] 屏风放置在正确位置
- [ ] 绿植放置在尖角旁
- [ ] 门帘挂在需要的门上
- [ ] 整体色调温暖和谐

---

## 附录：关卡煞气对照表

| Level | 关卡名称 | 煞气类型 | 解决道具 | 暖色图状态 |
|-------|---------|---------|---------|----------|
| 1 | 开发者卧室 | 横梁压顶 | 葫芦 | ✅ |
| 2 | 猫奴卧室 | 镜冲床 | 遮挡/旋转 | ✅ |
| 3 | 学生宿舍 | 尖角煞 | 绿植 | ⚠️ 部分 |
| 4 | 猫奴客厅 | 穿堂煞+味煞 | 屏风+门帘 | ⚠️ 部分 |
| 5 | 游戏宅卧室 | 横梁+尖角 | 葫芦+绿植 | ✅ |
| 6 | 创业工作室 | 背门煞+柱角煞 | 龙龟+绿植 | ✅ |
| 7 | 小夫妻婚房 | 镜冲床×2+尖角 | 门帘+绿植 | ❌ |
| 8 | 开放厨房公寓 | 灶台冲+穿堂+横梁 | 屏风+绿植+葫芦 | ✅ |
| 9 | 阁楼卧室 | 斜顶压床+窗户煞+阴煞 | 移床+窗帘+盐灯 | ✅ |
| 10 | 暗室卧室 | 横梁+阴煞+门冲 | 葫芦+盐灯+门帘 | ✅ |
| 11 | 开放式 Loft | 楼梯冲+横梁+穿堂+灶台 | 屏风+葫芦+绿植+屏风 | ❌ 部分 |
| 12 | 杂乱办公室 | 横梁+柱角+电线+财位 | 葫芦+绿植+整理 | ✅ |
| 13 | 办公室 | 横梁+门冲+财位 | 葫芦+屏风+清理 | ❌ |
| 14 | 卧室 | 横梁+镜冲床+门冲 | 葫芦+移除镜子+门帘 | ✅ |
| 15 | 阁楼画室 | 横梁+尖角+阴煞+厕所+窗户 | 葫芦+绿植+盐灯+门帘+窗帘 | ⚠️ 部分 |
| 16 | 瑜伽工作室 | 财位+阴煞+尖角+窗户+味煞 | 金蟾+盐灯+绿植+窗帘+门帘 | ❓ 待验证 |
| 17 | Loft 公寓 | 横梁+镜冲床+尖角+阴煞+楼梯下 | 葫芦+遮挡+绿植+盐灯+清理 | ❌ |
| 18 | 城市公寓 | 路冲+反弓+财位+门冲+壁炉 | 石敢当+绿植+清理+屏风+绿植 | ❓ 待验证 |
| 19 | 家庭办公室 | 背门煞+横梁+财位+味煞 | 龙龟+葫芦+清理+门帘 | ❌ |
| 20 | 卧室 | 横梁+镜冲床+天斩+反弓+财位+阴煞 | 葫芦+遮挡+山海镇+绿植+清理+盐灯 | ✅ |

---

*文档版本：v1.0*
*创建日期：2026-02-22*
*作者：AI Assistant*
