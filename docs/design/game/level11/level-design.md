# Level 11 - 开放式Loft (Open Loft)

## 关卡概述

| 属性 | 值 |
|-----|-----|
| **关卡 ID** | `level-11` |
| **关卡名称** | 开放式Loft |
| **英文名称** | Open Loft Apartment |
| **主题** | 挑高Loft公寓，有楼梯和二层 |
| **氛围** | 时尚但气场混乱 |
| **难度** | 高级 (Advanced) |
| **煞气数量** | 4 个 |
| **预估时间** | 4-5 分钟 |

---

## 叙事背景

> 你刚搬进一套时尚的Loft公寓，挑高的空间和楼梯很有设计感。
>
> 但住了一段时间，发现睡眠不好，财运也不顺。风水师傅来看后直摇头...
>
> 楼梯正对大门、客厅直通阳台、厨房灶台冲门、卧室还有横梁压床，四个煞气同时存在！

---

## 煞气点配置

### 煞气 1: 楼梯冲门

| 属性 | 值 |
|-----|-----|
| **ID** | `sha-001` |
| **类型** | `stair_clash` |
| **位置** | `{ x: 0.15, y: 0.55 }` |
| **半径** | `0.1` |
| **正确解法** | 放置屏风阻隔气流 |
| **正确道具** | `待确定` |

```yaml
shaPoint:
  id: sha-001
  type: stair_clash
  position: { x: 0.15, y: 0.55 }
  radius: 0.1
  title: "楼梯冲门"
  description: "螺旋楼梯直冲入户门方向，气流顺楼梯直冲而下直接泄出，导致家中财气难聚，易生口角。"
  correctItem: null
  options:
    - id: opt-001-a
      label: "放置屏风阻隔气流"
      correct: true
    - id: opt-001-b
      label: "楼梯铺红地毯"
      correct: false
    - id: opt-001-c
      label: "在楼梯下堆放杂物"
      correct: false
```

### 煞气 2: 横梁压顶

| 属性 | 值 |
|-----|-----|
| **ID** | `sha-002` |
| **类型** | `beam_sha` |
| **位置** | `{ x: 0.52, y: 0.38 }` |
| **半径** | `0.1` |
| **正确解法** | 悬挂葫芦化解 |
| **正确道具** | `待确定` |

```yaml
shaPoint:
  id: sha-002
  type: beam_sha
  position: { x: 0.52, y: 0.38 }
  radius: 0.1
  title: "横梁压顶"
  description: "巨大的钢结构横梁直接横跨在沙发上方，人坐在此处会感到压抑，长期影响心理健康和运势。"
  correctItem: null
  options:
    - id: opt-002-a
      label: "悬挂葫芦化解"
      correct: true
    - id: opt-002-b
      label: "将横梁涂成白色"
      correct: false
    - id: opt-002-c
      label: "在横梁下装吊灯"
      correct: false
```

### 煞气 3: 穿堂煞

| 属性 | 值 |
|-----|-----|
| **ID** | `sha-003` |
| **类型** | `door_clash` |
| **位置** | `{ x: 0.88, y: 0.30 }` |
| **半径** | `0.1` |
| **正确解法** | 窗边放阔叶绿植 |
| **正确道具** | `待确定` |

```yaml
shaPoint:
  id: sha-003
  type: door_clash
  position: { x: 0.88, y: 0.30 }
  radius: 0.1
  title: "穿堂煞"
  description: "入户门方向正对巨大的落地窗，气流刚进门就直接穿窗而出，形成典型的'穿堂煞'，无法藏风聚气。"
  correctItem: null
  options:
    - id: opt-003-a
      label: "窗边放阔叶绿植"
      correct: true
    - id: opt-003-b
      label: "在此处放一面镜子"
      correct: false
    - id: opt-003-c
      label: "封死这扇窗户"
      correct: false
```

### 煞气 4: 灶台外露

| 属性 | 值 |
|-----|-----|
| **ID** | `sha-004` |
| **类型** | `kitchen_sha` |
| **位置** | `{ x: 0.82, y: 0.58 }` |
| **半径** | `0.1` |
| **正确解法** | 设置屏风遮挡视线 |
| **正确道具** | `待确定` |

```yaml
shaPoint:
  id: sha-004
  type: kitchen_sha
  position: { x: 0.82, y: 0.58 }
  radius: 0.1
  title: "灶台外露"
  description: "开放式厨房的灶台毫无遮挡，正对客厅活动区，'开门见灶，钱财多耗'，火气不聚。"
  correctItem: null
  options:
    - id: opt-004-a
      label: "设置屏风遮挡视线"
      correct: true
    - id: opt-004-b
      label: "在灶台旁放鱼缸"
      correct: false
    - id: opt-004-c
      label: "灶台上方挂风铃"
      correct: false
```

---
## 道具清单

本关卡需要以下道具素材：

| 道具 ID | 名称 | 解决的煞气 | 素材要求 |
|--------|------|----------|---------|
| `screen` | 屏风 | 待匹配 | 像素风 |
| `plant-broad` | 阔叶绿植 | 待匹配 | 像素风 |
| `gourd` | 葫芦 | 待匹配 | 像素风 |

---
## 场景元素

| 元素 | 描述 | 位置 |
|-----|------|------|
| 入户门 | 大门 | 一层入口 |
| 楼梯 | 通往二层的楼梯 | 正对大门 |
| 阳台门 | 落地玻璃门 | 对面 |
| 开放厨房 | 灶台、岛台 | 一层 |
| 客厅 | 沙发、茶几 | 一层中央 |
| 二层卧室 | 床、衣柜 | 二层 |
| 横梁 | 二层横梁 | 床上方 |

---

## 素材产出清单

| 文件名 | 描述 | 状态 |
|-------|------|------|
| `room-cold.png` | 冷色底图（阴郁开局） | ✅ 已完成 |
| `room-warm.png` | 暖色终图（通关后） | ✅ 已完成 |
| `hotspots.json` | 煞点数据（AI 分析生成） | ✅ 已完成 |

---

## 版本记录

| 版本 | 日期 | 变更说明 |
| v-auto | 2026-02-22 | 根据 AI 分析结果自动更新 |
|-----|------|---------|
| v1.0 | 2026-02-22 | 初版关卡设计 |
