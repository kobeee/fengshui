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
│   └── prd/
│       └── v1.0.md                         # 游戏设计文档 (GDD)
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

- **docs/** - 项目文档目录，存放项目相关的设计文档
- **src/** - 源码目录
- **tools/** - 工具目录

### 重要文件

- **CHANGELOG.md** - 项目变更记录文档，每次以插入文件头部的方式新增记录。此文档是项目记忆的延伸，可用于回放/回顾或回滚项目部分操作
- **fengshui.pen** - 项目视觉稿

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

**AI 生成策略**:
- 底图 Prompt: `Isometric view of a cozy bedroom, 16-bit pixel art, snes style, stardew valley vibe, messy, cold blue lighting, detailed furniture, --ar 16:9`
- 物件 Prompt: `Pixel art sprite of a wooden screen divider, white background`

**后期处理流程**:
1. Midjourney 生成底图
2. Photoshop 索引颜色模式（限制 32-64 色）
3. 缩小到 320x180，再用邻近算法放大到 1920x1080

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