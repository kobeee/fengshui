# 八比特风水师 (Feng Shui: 8-Bit Harmony)

## 项目概述

一款等轴视角像素风解谜游戏，玩家通过移动家具、摆放风水摆件，将"阴郁"的像素房间变成"温馨"的像素房间。

- **类型**: Isometric Puzzle / Organization
- **视觉风格**: Hi-Bit Pixel Art（类似《Eastward》或《Coffee Talk》）
- **音乐风格**: Lofi Hip Hop / Chill Beats
- **核心体验**: 通过风水调整改善房间氛围，解决煞气问题

## 项目结构

```
fengshui/
├── docs/
│   ├── design/
│   │   ├── game/                           # 关卡设计文档
│   │   │   ├── level-generation-pipeline-v1.0.md
│   │   │   ├── level1/                     # Level 1 设计文档
│   │   │   │   ├── level-design.md         # 关卡详细设计
│   │   │   │   ├── prompts/                # 生图提示词
│   │   │   │   │   ├── room-cold-v1.0.md   # 冷色底图
│   │   │   │   │   ├── room-warm-v1.0.md   # 暖色终图
│   │   │   │   │   └── items/              # 道具提示词
│   │   │   │   └── analysis/               # AI 分析提示词
│   │   │   └── level2/
│   │   ├── prompts/                        # 旧版提示词（已迁移）
│   │   └── ui/
│   └── prd/
│       └── v1.0.md                         # 游戏设计文档 (GDD)
├── resources/
│   └── images/
│       ├── home/                           # 首页图片
│       ├── level1/                         # Level 1 图片资产
│       │   ├── room-cold.png               # 冷色底图
│       │   ├── room-warm.png               # 暖色终图
│       │   ├── hotspots.json               # 煞点数据
│       │   ├── patches/                    # 净化贴片
│       │   └── analysis/                   # 分析中间数据
│       ├── level2/
│       └── shared/                         # 跨关卡共享资源
│           └── items/                      # 道具 PNG
├── src/
│   └── frontend/
│       └── feng-shui-8-bit/                # Devvit Web 应用
│           ├── src/
│           │   ├── client/                 # 前端代码 (React)
│           │   ├── server/                 # 后端代码 (Hono + tRPC)
│           │   └── shared/                 # 共享代码
│           ├── public/                     # 静态资源
│           └── tools/                      # TypeScript 配置
├── tools/                                  # 开发工具 (待开发)
├── fengshui.pen                            # 项目视觉稿
├── CHANGELOG.md                            # 项目变更记录
└── IFLOW.md                                # 项目上下文文档
```

### 目录说明

- **docs/design/game/** - 关卡设计文档，每个 level 一个子目录
- **docs/design/game/levelX/prompts/** - 生图提示词（底图、道具、分析）
- **resources/images/levelX/** - 关卡图片资产
- **resources/images/shared/items/** - 跨关卡共享道具 PNG

### 重要文件

- **fengshui.pen** - 项目视觉稿
- **docs/design/game/level-generation-pipeline-v1.0.md** - 关卡生成流水线方案

---

## CHANGELOG 记录规范

**CHANGELOG.md** 是项目变更记录文档，作为项目记忆的延伸。

### 记录要求

- **每次变更必须记录** - 无论是功能开发、bug 修复、重构还是配置变更
- **插入文件头部** - 新记录追加到文件开头，保持时间倒序
- **格式规范**：
  ```markdown
  ## [YYYY-MM-DD] 变更标题

  ### 变更内容
  - 具体变更项 1
  - 具体变更项 2

  ### 影响范围
  - 受影响的文件或模块
  ```

### 记录目的

1. **回放/回顾** - 快速了解项目演进历史
2. **回滚参考** - 问题排查时追溯变更来源
3. **上下文传递** - 帮助 AI 理解项目状态变化

**重要提醒**: AI 助手在完成任何代码变更后，必须同步更新 CHANGELOG.md

---

## 核心玩法

### 游戏流程

1. **阴郁的乱室** - 冷色调房间，带有煞气点（黑色小煤球动画）
2. **像素级调整** - 点击煞气点，选择正确的风水道具解决问题
3. **暖阳入屋** - 所有问题解决后，色板切换为暖色调，完成关卡

### 风水元素

| 煞气类型 | 问题场景 | 解决方案 |
|---------|---------|---------|
| 横梁压顶 | 床/书桌上方有横梁 | 挂葫芦 |
| 尖角煞 | 尖锐物体对着人 | 放阔叶绿植 |
| 门冲 | 大门正对阳台门 | 放屏风 |
| 镜冲床 | 镜子对着床 | 旋转或遮挡 |
| 味煞 | 脏物在财位 | 移到通风处，财位放金蟾 |

### 道具系统

- 八卦牌
- 招财猫
- 绿植（阔叶/仙人掌）
- 屏风
- 葫芦
- 金蟾

## 关卡设计

### Level 1: 开发者的地牢
- 场景：杂乱的单身公寓，满地披萨盒
- 煞气点：横梁压顶、尖角煞

### Level 2: 猫奴的客厅
- 场景：到处是猫爬架，猫咪打架
- 煞气点：门冲、味煞

---

## 技术实现

### 技术栈 (Devvit Web Application)

运行在 Reddit.com 上的 Devvit Web 应用。

| 层级 | 技术 |
|-----|------|
| **Frontend** | React 19, Tailwind CSS 4, Vite |
| **Backend** | Node.js v22 serverless (Devvit), Hono, tRPC |
| **Communication** | tRPC v11 (端到端类型安全) |
| **Testing** | Vitest |

### 前端架构 (`src/frontend/feng-shui-8-bit/`)

#### 目录结构

- `src/frontend/feng-shui-8-bit/src/server/` - **后端代码**，运行在安全的 serverless 环境中
  - `trpc.ts` - 定义 API router 和 procedures
  - `index.ts` - 服务端入口 (Hono app)
  - 通过 `@devvit/web/server` 访问 `redis`, `reddit`, `context`
- `src/frontend/feng-shui-8-bit/src/client/` - **前端代码**，在 reddit.com 的 iFrame 中执行
  - 入口文件映射定义在 `devvit.json` 中
  - `game.html` - 主 React 入口 (Expanded View)
  - `splash.html` - 初始 React 入口 (Inline View)，在 reddit.com feed 中显示
  - `trpc.ts` - tRPC 客户端实例
- `src/frontend/feng-shui-8-bit/src/shared/` - **共享代码**，客户端和服务端共用

#### 数据获取 (tRPC)

1. **定义 Procedure**: 在 `src/frontend/feng-shui-8-bit/src/server/trpc.ts` 中添加 query 或 mutation
2. **客户端调用**: 在 React 组件中使用 `trpc.procedureName.query()` 或 `.mutate()`

### 前端规则与限制

**规则**:
- 使用 `navigateTo` from `@devvit/web/client` 代替 `window.location` 或 `window.assign`

**限制**:
- `window.alert`: 使用 `showToast` 或 `showForm` from `@devvit/web/client`
- 文件下载: 使用 clipboard API 配合 `showToast` 确认
- Geolocation, camera, microphone, notifications web APIs: 无替代方案
- HTML 文件内的 inline script 标签: 使用独立的 js/ts 文件

### 美术工作流

#### 关卡制作流程（核心）

使用 **Gemini 3 Pro Image Preview (Nano Banana Pro)** 生成图片，支持 image-to-image 和最多 14 张参考图。

**Step 1: 生成冷色底图**
```
输入：text prompt (room-cold-v1.0.md)
输出：room-cold.png（阴郁冷色调房间）
```

**Step 2: 生成道具 PNG**
```
输入：text prompt (items/*.md)
输出：gourd.png, plant-broad.png, screen.png（透明背景）
```

**Step 3: 生成暖色终图**
```
输入：room-cold.png + 所有道具 PNG + text prompt (room-warm-v1.0.md)
输出：room-warm.png（完成态，色调变暖 + 道具已放置）

关键：Gemini image-to-image 能力保证底图结构不变，只改色调和添加道具
```

**Step 4: AI 分析煞点**
```
输入：room-cold.png + 分析提示词 (analysis/sha-analysis-v1.0.md)
输出：hotspots.json（煞点位置、类型、选项）
```

#### 道具 PNG 双重用途

| 用途 | 说明 |
|-----|------|
| 游戏交互 | 玩家拖放、预览 |
| 生成暖色图 | 作为 Gemini 参考素材，确保道具风格一致 |

#### 图文一致性规范（重要）

**原则：以实际生成的图片为准，文案必须与图片内容严格一致。**

关卡设计流程中的文案来源：

```
Step 1: 生成冷色底图 + 道具 PNG
Step 2: AI 分析生成 hotspots.json（包含位置、类型、选项文案）
Step 3: 以 hotspots.json 为准更新 level-design.md
```

**关键点**：
- AI 分析会根据图片内容生成选项文案，可能与原设计稿不同
- 以实际图片和 AI 分析结果为准，反向更新设计文档
- 后续关卡设计时，分析提示词中应包含期望的选项文案模板

#### 文档与提示词规范

**所有提示词必须是完整可用格式**：
- 用 ` ```text ``` ` 包裹完整提示词
- 不要拆分 system/user，直接合并
- 用户拷贝即可使用

**后期处理流程**:
1. 色彩索引化（限制 32-64 色）
2. 像素标准化（Nearest Neighbor）
3. 导出 PNG-24

### 音效需求
- Lofi 背景音乐循环
- 8-bit 点击音效 (Bloop! Ding!)

---

## 开发命令

在 `src/frontend/feng-shui-8-bit/` 目录下执行：

```bash
npm run type-check     # 检查 TypeScript 类型
npm run lint           # 运行 linter
npm run test -- my-file-name  # 运行单个文件的测试
```

## 代码风格

- 使用 type alias 代替 interface
- 使用 named exports 代替 default exports
- 禁止 TypeScript 类型强制转换

---

## 设计原则

1. **资源复用** - 像素素材通用性强
2. **动画简单** - 3 帧循环即可实现煞气动画
3. **社区友好** - 像素游戏受众宽容度高
4. **氛围优先** - 光影氛围是核心体验

---

## 游戏视觉高级设计规范

基于 Splash 页面三次迭代的经验总结，以及 NN/g Glassmorphism 最佳实践。

### 1. Glassmorphism 毛玻璃效果

**透明度控制**：
- 背景不透明度：0.35-0.6（太低难以阅读，太高失去玻璃感）
- 推荐渐变：`linear-gradient(135deg, rgba(30, 35, 45, 0.35) 0%, rgba(21, 26, 34, 0.4) 100%)`

**背景模糊**：
- blur(20-24px) - 足够模糊透出背景，但保持文字可读
- saturate(1.3-1.4) - 略微增加饱和度补偿透明度损失

**边框与光晕**：
- 2px 边框，透明度 0.4-0.5，使用主题金色
- 内发光：`inset 0 0 40-50px rgba(196, 160, 106, 0.02-0.03)`
- 外发光：`0 0 80-100px rgba(196, 160, 106, 0.05-0.06)`

**参考**：Apple Vision Pro 透明层级设计语言

### 2. 间距与呼吸感

**避免"顶边"感**：
- 卡片内边距：p-10 至 p-12（40-48px）
- 元素间距：主要区块之间 mb-8 至 mb-12
- 按钮区与文字区：gap-5 至 gap-6

**行高与可读性**：
- 像素字体行高：leading-[2.0] 至 leading-[2.4]
- 标题与副标题间距：mt-4 至 mt-5

**层次间距递进**：
```
标题区 mb-8 → 分隔线 mb-8 → 说明文字 mb-10 → 按钮区
```

### 3. 像素字体的高级质感

**字体选择**：
- 统一使用 `font-pixel`（Press Start 2P）保持 8-bit 风格
- 避免混用现代无衬线字体

**字号控制**：
- 主标题：20px（像素字体过大显得笨重）
- 正文：11px
- 按钮：12px
- 副标题/提示：7-8px

**质感增强**：
- 字间距：`tracking-[0.08em]` 至 `tracking-[0.25em]`
- 文字阴影：`2px 2px 0px rgba(0, 0, 0, 0.8), 0 0 30px rgba(240, 217, 156, 0.5)`
- 发光效果：亮金色文字 + 柔和外发光

### 4. 色彩与光影体系

**基础配色**：
- 背景：低饱和深色 `#0E1116` / `#1A1D24`
- 卡片背景：`rgba(30, 35, 45, 0.35)`
- 主文字：`#E2E8F0` / `#F5E4BB`（暖白/亮金）
- 强调色：单一暖金 `#C4A06A` / `#D4B07A`

**阴影层次**：
```
/* 底层阴影 */
0 8px 32px rgba(0, 0, 0, 0.3-0.4)

/* 中层光晕 */
0 0 80px rgba(196, 160, 106, 0.05-0.08)

/* 顶层内发光 */
inset 0 1px 1px rgba(255, 255, 255, 0.08-0.1)
```

**渐变遮罩**：
- 径向渐变突出中心：`bg-[radial-gradient(ellipse_at_center,transparent_0%,#0E1116_90%)]`
- 上下渐变增加深度：`bg-gradient-to-t from-[#0E1116] via-transparent to-[#0E1116]/60`

### 5. 视觉层次架构

**从底到顶的层级**：
1. **背景图** - 完整的氛围底图
2. **渐变遮罩** - 径向 + 线性渐变，突出中心内容
3. **玻璃卡片** - Glassmorphism 容器
4. **装饰边框** - 8-bit 风格双层边框
5. **文字内容** - 像素字体 + 发光效果

**每个层级的目的**：
- 背景图：营造整体氛围
- 遮罩层：聚焦视线到中心
- 玻璃卡片：承载内容，透出背景
- 边框：强化 8-bit 风格，增加精致感
- 文字：清晰传达信息，保持像素美学

### 6. 8-bit 风格细节

**分隔线设计**：
- 使用像素方块代替圆点
- 纯直线，避免渐变
- 示例：线条 → 小方块 → 大方块 → 小方块 → 线条

**按钮 3D 效果**：
- 底部阴影模拟深度：`0 4px 0px #5C4020`
- 内阴影模拟按压：`inset -2px -2px 0px rgba(0, 0, 0, 0.25)`
- active 状态位移：`active:translate-y-[2px]`

**边框装饰**：
- 双层边框：外层 1px + 内层 2px
- 透明度递减：外 0.3 → 内 0.4
- 不圆角或极小圆角（保持锐利）

### 7. 氛围感营造 checklist

- [ ] 背景图能否透出？（透明度 < 0.6）
- [ ] 文字是否不顶边？（内边距 ≥ 40px）
- [ ] 元素间距是否充足？（主要区块 ≥ 32px）
- [ ] 是否有发光/光晕效果？
- [ ] 阴影层次是否丰富？（至少 3 层）
- [ ] 字体是否统一为像素风格？
- [ ] 色彩是否低饱和 + 单一点缀色？
- [ ] 是否有 8-bit 细节装饰？（边框、分隔线）

## 开发注意事项

- 像素风格要求 AI 生成后必须进行压色和像素化处理
- 色板切换是核心视觉反馈机制
- 道具拖放需要网格对齐系统
- 煞气点需要透明点击区域
- 添加新的菜单项 action 时，确保在 `devvit.json` 中添加对应映射
- 不要使用 `@devvit/public-api` 中的 blocks 相关代码，本项目仅使用 Devvit web

---

## MVP 开发计划

| 阶段 | 任务 | 状态 |
|-----|------|-----|
| Day 1 | AI 生成 3 张房间底图 + 10 个家具素材 | 待开始 |
| Day 2 | Web 搭建，实现点击替换逻辑 | 待开始 |
| Day 3 | VFX 粒子效果 + 音效 + 打磨 | 待开始 |

## 参考文档

- Devvit Docs: https://developers.reddit.com/docs/llms.txt