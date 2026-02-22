# AI 分析提示词 - 煞气点识别 (v1.0)

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
分析提供的等轴像素Loft公寓房间图，识别所有风水煞气问题，并输出结构化的 JSON 数据。

# 煞气类型定义

| 类型 ID | 中文名称 | 识别特征 | 正确解决方式 |
|--------|---------|---------|------------|
| `stair_clash` | 楼梯冲门 | 楼梯正对入户门 | 放置屏风 |
| `door_clash` | 穿堂煞 | 大门正对阳台门/后门 | 放置阔叶绿植 |
| `kitchen_sha` | 灶台冲门 | 灶台正对入户门方向 | 放置屏风 |
| `beam_sha` | 横梁压顶 | 床/书桌上方有横梁 | 挂葫芦 |
| `pillar_sha` | 柱角煞 | 柱子尖角对着人 | 放置阔叶绿植 |
| `electric_sha` | 电线煞 | 电线缠绕、设备过多 | 放置铜葫芦 |
| `wealth_sha` | 财位问题 | 财位堆满杂物 | 清理+放金蟾/招财猫 |
| `mirror_sha` | 镜冲床 | 镜子正对床铺 | 旋转镜子 |
| `sharp_corner_sha` | 尖角煞 | 尖锐家具角对着人 | 放置阔叶绿植 |
| `yin_sha` | 阴煞 | 角落阴暗 | 放置盐灯 |
| `smell_sha` | 厕所门冲 | 厕所门正对床/桌 | 挂门帘 |

# 关卡背景
- 关卡名称: 开放式Loft (Open Loft)
- 场景: 时尚挑高Loft公寓，有楼梯和二层
- 预期煞气数量: 4 个
- 预期煞气: 楼梯冲门、穿堂煞、灶台冲门、横梁压顶

# 坐标系统说明
- `position.x` 和 `position.y`: 使用 0-1 范围的百分比坐标
- 原点 (0, 0) 在图片左上角
- x 轴向右递增，y 轴向下递增
- `radius`: 触发范围半径，同样使用百分比（建议 0.06-0.12）

# 道具 ID 对照
- `gourd` - 葫芦（化解横梁压顶）
- `plant-broad` - 阔叶绿植（化解尖角煞、穿堂煞）
- `screen` - 屏风（化解门冲、楼梯冲门）
- `money-toad` - 金蟾（财位问题）
- `copper-gourd` - 铜葫芦（电线煞）
- `lucky-cat` - 招财猫
- `salt-lamp` - 盐灯
- `curtain` - 门帘/窗帘

# 约束条件
1. 每个煞气点必须有且仅有 3 个选项，其中 1 个 correct 为 true
2. `correctItem` 字段：
   - 如果不需要道具（如旋转镜子），填 `null`
   - 如果需要道具，填写道具 ID（如 `"gourd"`, `"plant-broad"`, `"screen"`）
3. 位置坐标必须基于图片实际视觉特征估算
4. 描述文字应该简洁易懂，适合游戏玩家阅读
5. 确保识别到预期的 4 个煞气点

# Output Format (JSON)

请严格按照以下格式输出 JSON，不要添加任何其他文字说明：

{
  "levelId": "level-11",
  "levelName": "开放式Loft",
  "shaPoints": [
    {
      "id": "sha-001",
      "type": "stair_clash",
      "position": {
        "x": 0.30,
        "y": 0.55
      },
      "radius": 0.10,
      "title": "楼梯冲门",
      "description": "楼梯正对入户门，气流直冲而上，财气难以聚留。",
      "correctItem": "screen",
      "options": [
        {
          "id": "opt-001-a",
          "label": "放置屏风阻隔",
          "correct": true
        },
        {
          "id": "opt-001-b",
          "label": "在楼梯上放地毯",
          "correct": false
        },
        {
          "id": "opt-001-c",
          "label": "常关门挡气",
          "correct": false
        }
      ]
    }
  ]
}

请分析图片并输出 JSON 数据：
```

---

## 结果校验规则

```typescript
type ShaPoint = {
  id: string;
  type: ShaType;
  position: { x: number; y: number };
  radius: number;
  title: string;
  description: string;
  correctItem: string | null;
  options: Array<{
    id: string;
    label: string;
    correct: boolean;
  }>;
};

type AnalysisResult = {
  levelId: string;
  levelName: string;
  shaPoints: ShaPoint[];
};

function validateAnalysis(data: unknown): data is AnalysisResult {
  // 1. 检查必要字段
  if (!data.levelId || !data.levelName || !Array.isArray(data.shaPoints)) {
    return false;
  }

  // 2. 检查每个 shaPoint
  for (const point of data.shaPoints) {
    // 每个 shaPoint 必须有且仅有 1 个 correct option
    const correctCount = point.options.filter(o => o.correct).length;
    if (correctCount !== 1) return false;

    // 每个选项必须有 3 个
    if (point.options.length !== 3) return false;

    // position 必须在 0-1 范围
    if (point.position.x < 0 || point.position.x > 1) return false;
    if (point.position.y < 0 || point.position.y > 1) return false;

    // radius 必须合理
    if (point.radius < 0.01 || point.radius > 0.3) return false;
  }

  return true;
}
```

---

## 使用流程

1. 生成冷色底图 (`room-cold.png`)
2. 调用 VLM API，传入图片和上面的完整提示词
3. 解析返回的 JSON
4. 运行校验规则
5. 保存到 `resources/images/level11/hotspots.json`

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v1.0 | 2026-02-22 | 初版分析提示词 |
