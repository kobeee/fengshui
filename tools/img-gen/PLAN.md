# 关卡图片生成工具 - 任务规划

## 概述

本工具用于自动化生成风水游戏关卡的图片资产，使用 Google Gemini API。

## 模型配置

| 用途 | 模型 | 说明 |
|-----|------|------|
| 图片生成 | `gemini-3-pro-image-preview` | Nano Banana Pro，支持 text-to-image 和 image-to-image |
| 图片理解 | `gemini-3-pro-preview` | 多模态理解，用于分析煞气点 |

## 生成流程

### 完整流程（单关卡）

```
1. 生成冷色底图 (text-to-image)
   ├── 输入：room-cold-v1.0.md 提示词
   ├── 输出：resources/images/levelX/room-cold.png
   └── Review：图片理解确认场景符合设计

2. AI 分析冷色底图 (image understanding)
   ├── 输入：room-cold.png + sha-analysis-v1.0.md
   ├── 输出：resources/images/levelX/hotspots.json
   └── Review：煞气点位置和选项是否合理

3. 生成道具 PNG (text-to-image)
   ├── 输入：items/*.md 提示词
   ├── 输出：resources/images/shared/items/*.png
   └── Review：道具风格是否与底图一致

4. 生成暖色终图 (image-to-image)
   ├── 输入：room-cold.png + 道具 PNG + room-warm-v1.0.md
   ├── 输出：resources/images/levelX/room-warm.png
   └── Review：结构一致性 + 道具位置正确

5. 更新设计文档
   └── 以实际生成结果更新 level-design.md
```

### 进度节点

每个节点完成后记录到 `progress/{level}.json`：

```json
{
  "level": "level-1",
  "status": "in_progress",
  "steps": {
    "room_cold": { "status": "completed", "file": "room-cold.png", "timestamp": "..." },
    "analysis": { "status": "completed", "file": "hotspots.json", "timestamp": "..." },
    "items": { "status": "in_progress", "completed": ["gourd.png"], "pending": ["plant.png"] },
    "room_warm": { "status": "pending" },
    "docs_update": { "status": "pending" }
  }
}
```

## API 调用限制

- **RPM (Requests Per Minute)**: 15 次/分钟
- **建议间隔**: 5 秒/请求
- **重试策略**: 指数退避，最多 3 次

## 文件结构

```
tools/img-gen/
├── src/
│   ├── index.ts           # CLI 入口
│   ├── gemini-client.ts   # Gemini API 客户端
│   ├── pipeline.ts        # 生成流水线
│   ├── progress.ts        # 进度管理
│   ├── prompts.ts         # 提示词解析
│   └── types.ts           # 类型定义
├── progress/              # 进度记录
│   └── level-1.json
├── PLAN.md               # 本文档
└── package.json
```

## 使用方式

```bash
# 生成单个关卡
npm run gen -- --level 1

# 从断点继续
npm run gen -- --level 1 --resume

# 生成所有待处理关卡
npm run gen -- --all

# 仅生成冷色底图
npm run gen -- --level 1 --step room-cold

# 仅生成道具
npm run gen -- --level 1 --step items
```

## 错误处理

1. **API 错误**：记录错误，等待重试
2. **生成失败**：保留进度，可断点续传
3. **用户中断**：保存当前状态，下次可继续

## 版本记录

| 版本 | 日期 | 说明 |
|-----|------|------|
| v1.0 | 2026-02-22 | 初始规划 |
