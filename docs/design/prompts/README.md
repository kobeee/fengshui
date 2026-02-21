# Prompt 管理规范（Gemini Nano Banana Pro）

本目录用于管理模型生图提示词，目标是：

1. 保持风格连续（关卡间不跳）。
2. 让 UI 与模型图协同（图做主角，UI 不抢戏）。
3. 便于回放与迭代（每次改动可追溯）。

## Prompt 线路（必须区分）

- `home-*`：首页/启动氛围插图（不承载真实解谜信息）
- `level-*`：正式关卡图（服务可玩性，和热点数据一一对应）

> 原则：**首页图不“剧透关卡答案”**，正式关卡图才承担玩法语义。

## 文件命名

使用：`<scene>-<mood>-v<major>.<minor>.md`

示例：
- `home-hero-cold-v1.1.md`
- `level1-dev-dungeon-cold-v1.0.md`
- `level1-dev-dungeon-warm-followup-v1.0.md`

## 每个 Prompt 文件必须包含

- `Model`：例如 `Gemini Nano Banana Pro`（当前使用）
- `Use Case`：用于 splash / game full-screen / 通关图等
- `Aspect Ratio`：如 16:9、9:16
- `Prompt`：主提示词（建议英文主语义）
- `Do Not Include`：不要出现的内容（UI 文案、logo、水印等）
- `Post Process`：压色、像素统一等后处理要求
- `Revision Notes`：本版变化说明

## 迭代流程（建议）

1. 先出 `level cold` 基图，锁定构图。
2. 使用 follow-up prompt 生成同构图 `level warm` 通关图。
3. 统一走后处理：限色 + 最近邻缩放，保证像素格一致。
4. 把关卡热点（sha 点位）以 JSON 存档，与关卡图版本绑定。
5. 将可用版本固化到本目录，避免口头 prompt 丢失。
