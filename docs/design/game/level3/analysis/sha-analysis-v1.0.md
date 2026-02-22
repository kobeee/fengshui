# AI 分析提示词 - 煞气点识别 (v1.1)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 从像素房间图中提取煞气点数据 |
| **输入** | 冷色底图 (PNG) |
| **输出** | hotspots.json |
| **模型建议** | GPT-4 Vision / Gemini Pro Vision / Claude 3.5 Sonnet |

---

## 完整提示词

```text
你是一个风水解谜游戏关卡分析师，负责从等轴像素房间图中识别和提取风水煞气问题数据。

# Task
分析提供的等轴像素房间图，识别所有风水煞气问题，并输出结构化的 JSON 数据。

# 煞气类型定义

| 类型 ID | 中文名称 | 识别特征 | 正确解决方式 |
|--------|---------|---------|------------|
| `sharp_corner_sha` | 尖角煞 | 书桌/柜子等尖锐边角对着床或座位 | 放阔叶绿植 |

# 关卡背景
- 关卡名称: 学生宿舍 (Student Dormitory)
- 场景: 狭窄的学生宿舍，考试周
- 预期煞气数量: 1 个

# 坐标系统说明
- `position.x` 和 `position.y`: 使用 0-1 范围的百分比坐标
- 原点 (0, 0) 在图片左上角
- x 轴向右递增，y 轴向下递增
- `radius`: 触发范围半径，同样使用百分比（建议 0.08-0.12）

# 道具 ID 对照
- `plant-broad` - 阔叶绿植（化解尖角煞）

# 约束条件
1. 每个煞气点必须有且仅有 3 个选项，其中 1 个 correct 为 true
2. `correctItem` 字段：需要道具时填写道具 ID（如 `"plant-broad"`）
3. 位置坐标必须基于图片实际视觉特征估算
4. 描述文字应该简洁易懂，适合游戏玩家阅读
5. 确保识别到预期的 1 个煞气点

# Output Format (JSON)

请严格按照以下格式输出 JSON，不要添加任何其他文字说明：

{
  "levelId": "level-3",
  "levelName": "学生宿舍",
  "shaPoints": [
    {
      "id": "sha-001",
      "type": "sharp_corner_sha",
      "position": {
        "x": 0.50,
        "y": 0.35
      },
      "radius": 0.10,
      "title": "尖角煞",
      "description": "书桌的尖锐边角正对着床铺，在风水中形成'尖角煞'，会影响睡眠质量和精神状态。",
      "correctItem": "plant-broad",
      "options": [
        {
          "id": "opt-001-a",
          "label": "放阔叶绿植化解",
          "correct": true
        },
        {
          "id": "opt-001-b",
          "label": "用布盖住书桌",
          "correct": false
        },
        {
          "id": "opt-001-c",
          "label": "移动床位避开",
          "correct": false
        }
      ]
    }
  ]
}

请分析图片并输出 JSON 数据：
```

---

## 使用流程

1. 生成冷色底图 (`room-cold.png`)
2. 调用 VLM API，传入图片和上面的完整提示词
3. 解析返回的 JSON
4. 运行校验规则
5. 保存到 `resources/images/level3/hotspots.json`

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v1.1 | 2026-02-22 | 更新为尖角煞 (sharp_corner_sha)，道具改为阔叶绿植 |
| v1.0 | 2026-02-22 | 初版分析提示词 |