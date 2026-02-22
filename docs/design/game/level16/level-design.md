# Level 16 - 瑜伽工作室 (Yoga Studio)

## 关卡概述

| 属性 | 值 |
|-----|-----|
| **关卡 ID** | `level-16` |
| **关卡名称** | 瑜伽工作室 |
| **英文名称** | Yoga Studio |
| **主题** | 禅意瑜伽空间，需要净化气场 |
| **氛围** | 能量阻滞，冥想难以入定 |
| **难度** | 大师 (Master) |
| **煞气数量** | 5 个 |
| **预估时间** | 5-6 分钟 |

---

## 叙事背景

> 你在市中心开了一家瑜伽工作室，装修简约禅意，但学员反映总感觉气场不畅。
>
> 风水师来看后指出五大问题...
>
> 阴气过重、尖角冲撞、落地窗煞气、财位堆杂物、通风口异味，影响学员的冥想体验和工作室生意！

---

## 煞气点配置

### 煞气 1: 财位受损

| 属性 | 值 |
|-----|-----|
| **ID** | `sha-016-01` |
| **类型** | `wealth_sha` |
| **位置** | `{ x: 0.05, y: 0.42 }` |
| **半径** | `0.1` |
| **正确解法** | 清理并放置金蟾招财 |
| **正确道具** | `待确定` |

```yaml
shaPoint:
  id: sha-016-01
  type: wealth_sha
  position: { x: 0.05, y: 0.42 }
  radius: 0.1
  title: "财位受损"
  description: "入口接待处作为明财位，摆放了破损的喷泉和杂物，导致财气流失。"
  correctItem: null
  options:
    - id: opt-016-01-a
      label: "直接扔掉喷泉"
      correct: false
    - id: opt-016-01-b
      label: "清理并放置金蟾招财"
      correct: true
    - id: opt-016-01-c
      label: "放置鱼缸"
      correct: false
```

### 煞气 2: 阴煞

| 属性 | 值 |
|-----|-----|
| **ID** | `sha-016-02` |
| **类型** | `yin_sha` |
| **位置** | `{ x: 0.38, y: 0.22 }` |
| **半径** | `0.1` |
| **正确解法** | 放置盐灯增加阳气 |
| **正确道具** | `待确定` |

```yaml
shaPoint:
  id: sha-016-02
  type: yin_sha
  position: { x: 0.38, y: 0.22 }
  radius: 0.1
  title: "阴煞"
  description: "储物架所在的角落光线昏暗，容易积聚阴气，让人感到压抑。"
  correctItem: null
  options:
    - id: opt-016-02-a
      label: "放置盐灯增加阳气"
      correct: true
    - id: opt-016-02-b
      label: "堆放更多杂物"
      correct: false
    - id: opt-016-02-c
      label: "安装强力排风扇"
      correct: false
```

### 煞气 3: 尖角煞

| 属性 | 值 |
|-----|-----|
| **ID** | `sha-016-03` |
| **类型** | `sharp_corner_sha` |
| **位置** | `{ x: 0.39, y: 0.68 }` |
| **半径** | `0.1` |
| **正确解法** | 放置阔叶绿植化解 |
| **正确道具** | `待确定` |

```yaml
shaPoint:
  id: sha-016-03
  type: sharp_corner_sha
  position: { x: 0.39, y: 0.68 }
  radius: 0.1
  title: "尖角煞"
  description: "木箱的尖锐棱角直冲瑜伽垫位置，会产生煞气刺伤练习者的气场。"
  correctItem: null
  options:
    - id: opt-016-03-a
      label: "用锯子锯掉如角"
      correct: false
    - id: opt-016-03-b
      label: "移动瑜伽垫"
      correct: false
    - id: opt-016-03-c
      label: "放置阔叶绿植化解"
      correct: true
```

### 煞气 4: 窗户煞

| 属性 | 值 |
|-----|-----|
| **ID** | `sha-016-04` |
| **类型** | `window_sha` |
| **位置** | `{ x: 0.72, y: 0.25 }` |
| **半径** | `0.1` |
| **正确解法** | 安装窗帘遮挡 |
| **正确道具** | `待确定` |

```yaml
shaPoint:
  id: sha-016-04
  type: window_sha
  position: { x: 0.72, y: 0.25 }
  radius: 0.1
  title: "窗户煞"
  description: "巨大的落地窗导致气流过快消散，且外界强光直射，无法聚气。"
  correctItem: null
  options:
    - id: opt-016-04-a
      label: "安装窗帘遮挡"
      correct: true
    - id: opt-016-04-b
      label: "封死窗户"
      correct: false
    - id: opt-016-04-c
      label: "放置八卦镜"
      correct: false
```

### 煞气 5: 味煞

| 属性 | 值 |
|-----|-----|
| **ID** | `sha-016-05` |
| **类型** | `smell_sha` |
| **位置** | `{ x: 0.93, y: 0.65 }` |
| **半径** | `0.1` |
| **正确解法** | 挂门帘阻挡污气 |
| **正确道具** | `待确定` |

```yaml
shaPoint:
  id: sha-016-05
  type: smell_sha
  position: { x: 0.93, y: 0.65 }
  radius: 0.1
  title: "味煞"
  description: "更衣室门口散发着污浊之气，直冲瑜伽练习区，破坏空气场。"
  correctItem: null
  options:
    - id: opt-016-05-a
      label: "喷洒大量香水"
      correct: false
    - id: opt-016-05-b
      label: "挂门帘阻挡污气"
      correct: true
    - id: opt-016-05-c
      label: "拆除更衣室门"
      correct: false
```

---
## 道具清单

本关卡需要以下道具素材：

| 道具 ID | 名称 | 解决的煞气 | 素材要求 |
|--------|------|----------|---------|
| `salt-lamp` | 盐灯 | 待匹配 | 像素风 |
| `plant-broad` | 阔叶绿植 | 待匹配 | 像素风 |
| `curtain` | 窗帘/门帘 | 待匹配 | 像素风 |
| `money-toad` | 金蟾 | 待匹配 | 像素风 |

---
## 场景元素

| 元素 | 描述 | 位置 |
|-----|------|------|
| 瑜伽垫 | 多张瑜伽垫整齐摆放 | 中央 |
| 落地窗 | 大型落地窗，阳光直射 | 外墙 |
| 储物柜 | 带尖角的储物柜 | 墙边 |
| 更衣室入口 | 开放式更衣区 | 一侧 |
| 财位 | 堆放杂物的角落 | 对角线位置 |
| 阴暗角落 | 光线不足区域 | 角落 |
| 绿植 | 装饰绿植 | 分散 |

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
| v1.1 | 2026-02-22 | 根据 Review #2 修复：场景改为瑜伽工作室，煞气调整为阴煞+尖角煞+窗户煞+财位+味煞 |
| v1.0 | 2026-02-22 | 初版关卡设计 |
