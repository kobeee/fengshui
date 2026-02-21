# Level 1 - 开发者的地牢 (Dev Dungeon)

## 关卡概述

| 属性 | 值 |
|-----|-----|
| **关卡 ID** | `level-1` |
| **关卡名称** | 开发者的地牢 |
| **英文名称** | Dev Dungeon |
| **主题** | 杂乱的单身公寓，深夜，雨夜 |
| **氛围** | 阴郁但温馨，调试中的混乱感 |
| **难度** | 入门级 (Tutorial) |
| **煞气数量** | 4 个 |
| **预估时间** | 3-5 分钟 |

---

## 叙事背景

> 你是一名加班到深夜的开发者。凌晨两点，窗外雨声淅沥，你的公寓像被代码堆满的服务器——杂乱、压抑、连呼吸都觉得沉重。
>
> 不知从何时起，你开始频繁失眠，白天注意力涣散，代码 Bug 越改越多。有人说，这是"煞气"在作怪。
>
> 今天，你决定按照一本古老的风水指南，重新整理这个"地牢"...

---

## 煞气点配置

> **注意**：以下数据以实际生成的图片和 AI 分析结果为准。

### 煞气 1: 镜冲床

| 属性 | 值 |
|-----|-----|
| **ID** | `sha-001` |
| **类型** | `mirror_sha` |
| **位置** | `{ x: 0.36, y: 0.28 }` |
| **半径** | `0.08` |
| **正确解法** | 旋转镜子方向（不需要道具） |

```yaml
shaPoint:
  id: sha-001
  type: mirror_sha
  position: { x: 0.36, y: 0.28 }
  radius: 0.08
  title: "镜冲床"
  description: "落地镜直接正对床铺，容易在夜间惊扰心神，影响睡眠质量。"
  correctItem: null
  options:
    - id: opt-001-a
      label: "用布盖住镜子"
      correct: false
    - id: opt-001-b
      label: "旋转镜子方向"
      correct: true
    - id: opt-001-c
      label: "移动床的位置"
      correct: false
```

---

### 煞气 2: 横梁压顶

| 属性 | 值 |
|-----|-----|
| **ID** | `sha-002` |
| **类型** | `beam_sha` |
| **位置** | `{ x: 0.58, y: 0.16 }` |
| **半径** | `0.09` |
| **正确解法** | 挂葫芦化解 |
| **正确道具** | `gourd` |

```yaml
shaPoint:
  id: sha-002
  type: beam_sha
  position: { x: 0.58, y: 0.16 }
  radius: 0.09
  title: "横梁压顶"
  description: "粗大的木质横梁横跨在床铺正上方，会给人造成潜意识的压迫感。"
  correctItem: gourd
  options:
    - id: opt-002-a
      label: "挂葫芦化解"
      correct: true
    - id: opt-002-b
      label: "把横梁漆成白色"
      correct: false
    - id: opt-002-c
      label: "在床上放抱枕"
      correct: false
```

---

### 煞气 3: 穿堂煞（门冲）

| 属性 | 值 |
|-----|-----|
| **ID** | `sha-003` |
| **类型** | `door_clash` |
| **位置** | `{ x: 0.50, y: 0.65 }` |
| **半径** | `0.10` |
| **正确解法** | 放置屏风阻挡 |
| **正确道具** | `screen` |

```yaml
shaPoint:
  id: sha-003
  type: door_clash
  position: { x: 0.50, y: 0.65 }
  radius: 0.10
  title: "穿堂煞（门冲）"
  description: "入户门与阳台落地窗成一条直线，气流直进直出，无法藏风聚气。"
  correctItem: screen
  options:
    - id: opt-003-a
      label: "放置屏风阻挡"
      correct: true
    - id: opt-003-b
      label: "常年关闭窗帘"
      correct: false
    - id: opt-003-c
      label: "门口放置地垫"
      correct: false
```

---

### 煞气 4: 尖角煞

| 属性 | 值 |
|-----|-----|
| **ID** | `sha-004` |
| **类型** | `sharp_corner_sha` |
| **位置** | `{ x: 0.60, y: 0.52 }` |
| **半径** | `0.08` |
| **正确解法** | 放置阔叶绿植 |
| **正确道具** | `plant-broad` |

```yaml
shaPoint:
  id: sha-004
  type: sharp_corner_sha
  position: { x: 0.60, y: 0.52 }
  radius: 0.08
  title: "尖角煞"
  description: "三角形书架的锐利尖角直冲电脑椅座位，会造成精神紧张和注意力分散。"
  correctItem: plant-broad
  options:
    - id: opt-004-a
      label: "将书架锯平"
      correct: false
    - id: opt-004-b
      label: "放置阔叶绿植"
      correct: true
    - id: opt-004-c
      label: "贴上防撞贴纸"
      correct: false
```

---

## 道具清单

本关卡需要以下道具素材：

| 道具 ID | 名称 | 解决的煞气 | 素材要求 |
|--------|------|----------|---------|
| `gourd` | 葫芦 | sha-002 (横梁压顶) | 悬挂态，带红绳，像素风 |
| `plant-broad` | 阔叶绿植 | sha-004 (尖角煞) | 盆栽，3-4片大叶，中等尺寸 |
| `screen` | 屏风 | sha-003 (门冲) | 三折式，木质框，米白纱帘 |

**注意**: sha-001 (镜冲床) 不需要道具，通过交互操作解决。

---

## 素材产出清单

### 图片资产

| 文件名 | 描述 | 状态 |
|-------|------|------|
| `room-cold.png` | 冷色底图（阴郁开局） | ✅ 已完成 |
| `room-warm.png` | 暖色终图（通关后） | ✅ 已完成 |
| `gourd.png` | 葫芦道具 | ✅ 已完成 |
| `plant-broad.png` | 阔叶绿植道具 | ✅ 已完成 |
| `screen.png` | 屏风道具 | ✅ 已完成 |

### 数据资产

| 文件名 | 描述 | 状态 |
|-------|------|------|
| `hotspots.json` | 煞点数据（AI 分析生成） | ✅ 已完成 |

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v1.1 | 2026-02-20 | 以实际图片和 hotspots.json 为准更新文案 |
| v1.0 | 2026-02-20 | 初版关卡设计 |