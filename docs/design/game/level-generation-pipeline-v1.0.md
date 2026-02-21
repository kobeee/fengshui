# 关卡生成流水线 (Level Generation Pipeline v1.0)

## 1. 问题定义

一个完整关卡需要以下视觉素材：

| 素材类型 | 数量 | 说明 |
|---------|------|------|
| 冷色底图 | 1 张 | 初始阴郁房间 |
| 煞点数据 | N 个 | 煞气位置、类型、选项 |
| 道具效果图 | N 张 | 每个煞点放置正确道具后的局部变化 |
| 暖色终图 | 1 张 | 通关后的温馨房间 |

**核心挑战**：如何在 AI 生图流程中，确保道具效果图与底图风格一致、位置准确？

---

## 2. 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                     关卡设计 (Level Design)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ 关卡主题     │  │ 煞气配置     │  │ 道具配置     │             │
│  │ (Dev Dungeon)│  │ (mirror_sha)│  │ (plant, gourd)│            │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Phase 1: 生图 (Generation)                   │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │ 冷色底图  │    │ 道具素材  │    │ 净化特效  │                  │
│  │ (room)   │    │ (items)  │    │ (vfx)    │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│       │              │              │                           │
│       │    ┌─────────┴─────────┐    │                           │
│       │    │   道具效果合成     │    │                           │
│       │    │  (item + room)    │    │                           │
│       │    └─────────┬─────────┘    │                           │
│       │              │              │                           │
│       ▼              ▼              ▼                           │
│  ┌─────────────────────────────────────────┐                   │
│  │            暖色终图 (合成+色板映射)        │                   │
│  └─────────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Phase 2: 分析 (Analysis)                     │
│                                                                  │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐        │
│  │ 冷色底图  │ ──────▶ │ AI 分析  │ ──────▶ │ 煞点JSON │        │
│  │ (image)  │         │ (VLM)    │         │ (hotspots)│        │
│  └──────────┘         └──────────┘         └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Phase 3: 组装 (Assembly)                     │
│                                                                  │
│  关卡数据结构:                                                   │
│  {                                                               │
│    id: "level-1",                                                │
│    roomImageCold: "...",                                         │
│    roomImageWarm: "...",                                         │
│    shaPoints: [...],                                             │
│    itemEffects: { ... }                                          │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. 分层生图策略

### 3.1 素材分层

```
最终画面 = 底图(房间) + 煞气层 + 道具层 + 光效层
```

| 层级 | 内容 | 格式 | 说明 |
|-----|------|------|------|
| Layer 0 | 房间底图 | PNG | 无道具、无煞气标记的干净房间 |
| Layer 1 | 煞气指示 | PNG (透明) | 黑色小煤球/雾气动画帧 |
| Layer 2 | 道具素材 | PNG (透明) | 各类风水道具，独立 sprite |
| Layer 3 | 净化光效 | PNG (透明) | 暖光晕、粒子等效果 |

### 3.2 道具效果图生成流程

```
对于每个煞点 (shaPoint):

1. 生成底图时预留"道具位"
   Prompt: "...with empty space near the mirror for placing a plant..."

2. 单独生成道具素材
   Prompt: "Pixel art sprite of a feng shui plant in pot, transparent background, 
            isometric angle matching the room perspective"

3. 运行时合成 OR 预合成
   - 运行时合成：游戏引擎实时叠加道具 PNG
   - 预合成：提前生成"底图+道具"的组合图
```

**推荐：运行时合成**
- 道具 PNG 数量固定（6-10 个道具）
- 同一道具可用于多个关卡
- 减少图片资产数量

---

## 4. AI 分析流程

### 4.1 分析 Prompt 模板

```markdown
# Role
你是一个风水游戏关卡分析师，负责从像素房间图中提取煞气点数据。

# Task
分析提供的等轴像素房间图，识别所有风水煞气问题。

# 煞气类型定义
| 类型 | 识别特征 | 正确道具 |
|-----|---------|---------|
| 镜冲床 | 镜子正对床铺 | 遮挡或旋转 |
| 尖角煞 | 尖锐家具角对着座位/床 | 阔叶绿植 |
| 门冲 | 大门正对阳台门/后门 | 屏风 |
| 横梁压顶 | 床/书桌上方有横梁 | 葫芦 |
| 味煞/财位 | 脏物/垃圾桶在财位 | 移开+金蟾 |

# Output Format (JSON)
{
  "shaPoints": [
    {
      "id": "sha-001",
      "type": "mirror_sha",
      "position": { "x": 0.35, "y": 0.42 },
      "radius": 0.08,
      "title": "镜冲床",
      "description": "镜子正对床铺，影响睡眠质量",
      "options": [
        { "id": "opt-1", "label": "放置屏风遮挡", "correct": false },
        { "id": "opt-2", "label": "旋转镜子方向", "correct": true },
        { "id": "opt-3", "label": "移开床的位置", "correct": false }
      ]
    }
  ]
}

# Constraints
- position 使用 0-1 范围的百分比坐标（左上角为原点）
- radius 同样使用百分比，表示罗盘探测范围
- 每个煞点必须有 3 个选项，其中 1 个正确
```

### 4.2 分析结果校验

```typescript
type ShaPointAnalysis = {
  shaPoints: Array<{
    id: string;
    type: ShaType;
    position: { x: number; y: number };  // 0-1 百分比
    radius: number;                       // 0-1 百分比
    title: string;
    description: string;
    options: Array<{
      id: string;
      label: string;
      correct: boolean;
    }>;
  }>;
};

// 校验规则
function validateAnalysis(data: unknown): data is ShaPointAnalysis {
  // 1. 每个 shaPoint 必须有且仅有 1 个 correct option
  // 2. position.x/y 必须在 0-1 范围
  // 3. 必填字段检查
  // ...
}
```

---

## 5. 道具效果图方案

### 5.1 方案对比

| 方案 | 描述 | 优点 | 缺点 |
|-----|------|------|------|
| A. 完全预合成 | 每个道具放置都生成独立效果图 | 视觉最自然 | 图片数量爆炸 |
| B. 道具叠加 | 底图 + 透明道具 PNG 运行时合成 | 资产少，灵活 | 合成边界可能生硬 |
| C. 区域替换 | 每个煞点区域单独生成"净化后"素材块 | 平衡质量和数量 | 需要精确坐标对齐 |

### 5.2 推荐方案：B + C 混合

```
对于每个煞点:

1. 道具本身：透明 PNG，运行时叠加
2. 净化效果：生成"局部区域"的暖色版本
   - 以煞点坐标为中心
   - 生成 200x200 像素的"净化贴片"
   - 贴片边缘做羽化处理

游戏运行时:
- 初始：底图 + 煞气动画层
- 放置道具后：叠加道具 PNG + 替换局部贴片
- 通关：切换到完整的暖色终图
```

### 5.3 道具素材清单

| 道具 ID | 名称 | 解决的煞气类型 | 素材要求 |
|--------|------|--------------|---------|
| `gourd` | 葫芦 | 横梁压顶 | 悬挂态，带绳子 |
| `plant-broad` | 阔叶绿植 | 尖角煞 | 盆栽，中等尺寸 |
| `screen` | 屏风 | 门冲 | 落地式，可旋转 |
| `money-toad` | 金蟾 | 财位问题 | 摆件，带金币 |
| `bagua-mirror` | 八卦镜 | 多种 | 墙挂式 |
| `lucky-cat` | 招财猫 | 财运 | 摆件，挥手动画帧 |

---

## 6. 完整工作流

### Phase 1: 关卡设计

```yaml
# level-design.yaml
level:
  id: level-1
  name: 开发者的地牢
  theme: messy_developer_apartment
  mood: gloomy_cozy

shaPoints:
  - id: sha-001
    type: mirror_sha
    description: 镜子对着床
    correctItem: null  # 不需要道具，旋转即可
    
  - id: sha-002
    type: sharp_corner_sha
    description: 书架尖角对着书桌
    correctItem: plant-broad
    
  - id: sha-003
    type: beam_sha
    description: 横梁压在床头
    correctItem: gourd
    
  - id: sha-004
    type: door_clash
    description: 大门直通阳台
    correctItem: screen
```

### Phase 2: 生图 Prompt

```markdown
# 底图 Prompt (冷色)
Generate an isometric hi-bit pixel art room background:

Room: messy solo developer apartment, night, rainy
Props visible: desk with monitors, bed, standing mirror, 
              bookshelf with sharp corner, door, balcony hint

Feng Shui problems embedded (subtle, not marked):
- Mirror faces bed directly
- Bookshelf corner points at desk chair
- Beam above bed head
- Straight path from door to balcony

Style: 48-64 color palette, cool desaturated tones,
       soft rain ambience, monitor blue glow

Constraints: No text, no UI, no explicit markers,
             clean edges for HUD overlay

# 道具 Prompt (以阔叶绿植为例)
Generate a pixel art sprite of a feng shui broad-leaf plant:

- Medium potted plant, 3-4 large green leaves
- Isometric angle (45°), matching room perspective
- Transparent background
- 16-bit pixel art style, 32 colors max
- Subtle warm accent on leaves (suggesting positive energy)
```

### Phase 3: AI 分析

```bash
# 伪代码流程
room_image = load("level-1-cold.png")
analysis_prompt = load_template("sha-analysis-prompt.md")

# 调用 VLM (如 Gemini)
hotspots = call_vlm(
  image=room_image,
  prompt=analysis_prompt
)

# 校验并保存
validate(hotspots)
save("level-1-hotspots.json", hotspots)
```

### Phase 4: 净化贴片生成

```markdown
# 局部净化贴片 Prompt
Generate a pixel art patch (200x200) showing a "cleansed" area:

Base: desk corner area with bookshelf nearby
Change: add a potted broad-leaf plant next to the sharp corner
Mood: warmer lighting, subtle golden glow
Style: must match the original room exactly (same palette, pixel size)

Context image: [原始底图 + 标注的区域截图]
```

---

## 7. 资产输出结构

```
assets/levels/level-1/
├── room-cold.png              # 冷色底图
├── room-warm.png              # 暖色终图
├── hotspots.json              # 煞点数据
├── patches/                   # 净化贴片
│   ├── sha-001-patch.png      # 镜子区域净化后
│   ├── sha-002-patch.png      # 书架角净化后
│   ├── sha-003-patch.png      # 床头净化后
│   └── sha-004-patch.png      # 门口净化后
└── metadata.yaml              # 关卡元数据

assets/items/
├── gourd.png
├── plant-broad.png
├── screen.png
├── money-toad.png
├── bagua-mirror.png
└── lucky-cat.png

assets/vfx/
├── sha-spirit/                # 煞气动画帧
│   ├── frame-1.png
│   ├── frame-2.png
│   └── frame-3.png
└── cleanse-glow/              # 净化光效
    └── golden-glow.png
```

---

## 8. 后续优化方向

1. **自动化流水线**
   - 编写脚本串联：生图 → 分析 → 校验 → 打包
   - 输入关卡设计 YAML，输出完整资产包

2. **风格一致性保证**
   - 建立参考图库（reference sheet）
   - 使用 img2img 保持道具与底图风格统一

3. **动态效果增强**
   - 道具放置时的入场动画
   - 净化时的粒子爆发效果
   - 通关时的全屏色板渐变

---

## 9. 验收清单

- [ ] 冷色底图包含关卡设计中的所有煞气场景
- [ ] AI 分析能正确识别所有煞点位置（偏差 < 10%）
- [ ] 道具 PNG 与底图透视角度一致
- [ ] 净化贴片边缘自然，无明显接缝
- [ ] 暖色终图与冷色底图结构完全对应
- [ ] hotspots.json 通过校验规则
