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
| `door_clash` | 穿堂煞/门冲 | 大门正对阳台门/后门 | 放置屏风 |
| `smell_sha` | 味煞 | 厨房/卫生间门对客厅，异味 | 挂门帘/通风 |

# 关卡背景
- 关卡名称: 猫奴的客厅 (Cat Lover's Living Room)
- 场景: 猫咪主题客厅，到处是猫爬架和玩具
- 预期煞气数量: 2 个

# 坐标系统说明
- `position.x` 和 `position.y`: 使用 0-1 范围的百分比坐标
- 原点 (0, 0) 在图片左上角
- x 轴向右递增，y 轴向下递增
- `radius`: 触发范围半径，同样使用百分比（建议 0.06-0.12）

# 道具 ID 对照
- `screen` - 屏风（化解门冲/穿堂煞）
- `curtain` - 门帘（化解味煞）

# 约束条件
1. 每个煞气点必须有且仅有 3 个选项，其中 1 个 correct 为 true
2. `correctItem` 字段：填写需要的道具 ID
3. 位置坐标必须基于图片实际视觉特征估算
4. 描述文字应该简洁易懂

# Output Format (JSON)

请严格按照以下格式输出 JSON：

{
  "levelId": "level-4",
  "levelName": "猫奴的客厅",
  "shaPoints": [
    {
      "id": "sha-001",
      "type": "door_clash",
      "position": {"x": 0.50, "y": 0.60},
      "radius": 0.10,
      "title": "穿堂煞",
      "description": "入户门与阳台门成一条直线，气流直进直出，无法藏风聚气。",
      "correctItem": "screen",
      "options": [
        {"id": "opt-001-a", "label": "放置屏风阻挡", "correct": true},
        {"id": "opt-001-b", "label": "常年关闭窗帘", "correct": false},
        {"id": "opt-001-c", "label": "门口放地垫", "correct": false}
      ]
    },
    {
      "id": "sha-002",
      "type": "smell_sha",
      "position": {"x": 0.20, "y": 0.40},
      "radius": 0.08,
      "title": "味煞",
      "description": "厨房门正对客厅区域，油烟味影响气场。",
      "correctItem": "curtain",
      "options": [
        {"id": "opt-002-a", "label": "挂门帘遮挡", "correct": true},
        {"id": "opt-002-b", "label": "常关厨房门", "correct": false},
        {"id": "opt-002-c", "label": "多开窗通风", "correct": false}
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
