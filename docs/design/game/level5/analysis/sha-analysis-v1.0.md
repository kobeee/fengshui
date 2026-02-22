# AI 分析提示词 - 煞气点识别 (v1.0)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 从像素房间图中提取煞气点数据 |
| **输入** | 冷色底图 (PNG) |
| **输出** | hotspots.json |
| **模型建议** | GPT-4 Vision / Gemini Pro Vision |

---

## 完整提示词

```text
你是一个风水解谜游戏关卡分析师，负责从等轴像素房间图中识别和提取风水煞气问题数据。

# Task
分析提供的等轴像素房间图，识别所有风水煞气问题，并输出结构化的 JSON 数据。

# 煞气类型定义

| 类型 ID | 中文名称 | 识别特征 | 正确解决方式 |
|--------|---------|---------|------------|
| `beam_sha` | 横梁压顶 | 床/书桌上方有横梁 | 挂葫芦 |
| `sharp_corner_sha` | 尖角煞 | 尖锐家具角对着座位/床 | 放置阔叶绿植 |

# 关卡背景
- 关卡名称: 游戏宅卧室 (Gamer's Bedroom)
- 场景: 游戏玩家卧室，电竞设备齐全
- 预期煞气数量: 2 个

# 道具 ID 对照
- `gourd` - 葫芦（化解横梁压顶）
- `plant-broad` - 阔叶绿植（化解尖角煞）

# 约束条件
1. 每个煞气点必须有且仅有 3 个选项，其中 1 个 correct 为 true
2. `correctItem` 字段：填写需要的道具 ID
3. 位置坐标必须基于图片实际视觉特征估算

# Output Format (JSON)

{
  "levelId": "level-5",
  "levelName": "游戏宅卧室",
  "shaPoints": [
    {
      "id": "sha-001",
      "type": "beam_sha",
      "position": {"x": 0.35, "y": 0.18},
      "radius": 0.09,
      "title": "横梁压顶",
      "description": "横梁横跨在床铺上方，造成压迫感，影响睡眠和精神状态。",
      "correctItem": "gourd",
      "options": [
        {"id": "opt-001-a", "label": "挂葫芦化解", "correct": true},
        {"id": "opt-001-b", "label": "把床移开", "correct": false},
        {"id": "opt-001-c", "label": "贴装饰遮挡", "correct": false}
      ]
    },
    {
      "id": "sha-002",
      "type": "sharp_corner_sha",
      "position": {"x": 0.70, "y": 0.45},
      "radius": 0.08,
      "title": "尖角煞",
      "description": "手办柜尖角直冲床铺方向，影响睡眠健康。",
      "correctItem": "plant-broad",
      "options": [
        {"id": "opt-002-a", "label": "放置阔叶绿植", "correct": true},
        {"id": "opt-002-b", "label": "把柜子移走", "correct": false},
        {"id": "opt-002-c", "label": "贴防撞角", "correct": false}
      ]
    }
  ]
}

请分析图片并输出 JSON 数据：
```

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v1.0 | 2026-02-22 | 初版分析提示词 |
