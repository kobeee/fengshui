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
| `back_door_sha` | 背门煞 | 工位背对门口，背后无靠 | 放置龙龟/高背椅 |
| `pillar_sha` | 柱角煞 | 承重柱尖角对着工作区 | 放置阔叶绿植 |

# 关卡背景
- 关卡名称: 创业工作室 (Startup Studio)
- 场景: 小型创业工作室，白板、工位、杂乱
- 预期煞气数量: 2 个

# 道具 ID 对照
- `dragon-turtle` - 龙龟（化解背门煞）
- `plant-broad` - 阔叶绿植（化解柱角煞）

# 约束条件
1. 每个煞气点必须有且仅有 3 个选项，其中 1 个 correct 为 true
2. `correctItem` 字段：填写需要的道具 ID
3. 位置坐标必须基于图片实际视觉特征估算

# Output Format (JSON)

{
  "levelId": "level-6",
  "levelName": "创业工作室",
  "shaPoints": [
    {
      "id": "sha-001",
      "type": "back_door_sha",
      "position": {"x": 0.40, "y": 0.55},
      "radius": 0.10,
      "title": "背门煞",
      "description": "工位背对门口，背后无靠山，容易招小人，影响事业稳定。",
      "correctItem": "dragon-turtle",
      "options": [
        {"id": "opt-001-a", "label": "放置龙龟作为靠山", "correct": true},
        {"id": "opt-001-b", "label": "换一把高背椅", "correct": false},
        {"id": "opt-001-c", "label": "常关门", "correct": false}
      ]
    },
    {
      "id": "sha-002",
      "type": "pillar_sha",
      "position": {"x": 0.70, "y": 0.40},
      "radius": 0.08,
      "title": "柱角煞",
      "description": "承重柱尖角直冲工作区，影响决策判断。",
      "correctItem": "plant-broad",
      "options": [
        {"id": "opt-002-a", "label": "放置阔叶绿植", "correct": true},
        {"id": "opt-002-b", "label": "把柱子包起来", "correct": false},
        {"id": "opt-002-c", "label": "用屏风遮挡", "correct": false}
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
