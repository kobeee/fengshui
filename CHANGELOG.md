## [2026-02-21] GameStart 页面沉浸式重设计（Mobile端）

### 变更内容

**布局重构**（参考 SplashPage 高级质感）：
- 改为全屏背景图覆盖（`absolute inset-0`），不再是顶部小图
- 内容垂直居中布局（`min-h-screen` + flex center），增强沉浸感
- 卡片最大宽度限制为 360px，保持移动端可读性

**视觉层次优化**：
- 去掉"游戏介绍""玩法说明"等冗余标题，直接展示核心内容
- 玩法说明改为横向三步骤图标（找煞气 → 选道具 → 暖色转换）
- 步骤间添加渐变连接线，增强流程感
- 去掉"玩法演示"次按钮，只保留"开始游戏"一个主CTA

**Glassmorphism 效果增强**：
- 提升 blur 强度：`blur(12px)` → `blur(20px)`
- 增加 saturate：`saturate(1.3)` → `saturate(1.4)`
- 更大的光晕范围：`-inset-4` 光晕层
- 更强的内发光：`inset 0 0 60px rgba(196, 160, 106, 0.05)`
- 按钮光晕加强：`0 0 30px rgba(196, 160, 106, 0.3)`

**文案精简**：
- 标题：八比特风水师
- 副标题：整理混乱 · 修复气场 · 重获温暖
- 底部：Lo-Fi Chill · 8-Bit SFX · Cozy Puzzle

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx`

---

## [2026-02-21] GameStart 页面紧凑排版与毛玻璃效果优化

### 变更内容

**排版紧凑化**（解决文字过于松散问题）：
- 卡片内边距缩减：`px-8 py-10` → `px-6 py-6`
- 区块间距缩减：`mb-8` → `mb-5`（游戏介绍区），`mb-10` → `mb-6`（玩法说明区）
- 步骤间距缩减：`space-y-3` → `space-y-2`
- 标题间距缩减：`mb-4` → `mb-2`（游戏介绍），`mb-4` → `mb-3`（玩法说明）
- 步骤项内边距缩减：`px-4 py-3` → `px-3 py-2.5`

**毛玻璃效果增强**（解决效果不明显问题）：
- 背景透明度提升：`0.2/0.25` → `0.7/0.8`
- 模糊参数调整：`blur(16px)` → `blur(12px)`，`saturate(1.2)` → `saturate(1.3)`
- 边框透明度提升：`0.3` → `0.35`，外边框 `0.3/0.4` → `0.4/0.5`
- 步骤项背景提升：`0.4` → `0.5`

**图片与卡片衔接优化**：
- 添加 `-mt-8` 使卡片向上偏移，与 Hero 图片重叠衔接
- 调整 `pt-2` 减少顶部留白

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx`

---

## [2026-02-21] GameStart 页面 Mobile 端 Glassmorphism 优化

### 变更内容

**Glassmorphism 毛玻璃效果**：
- 内容卡片改为毛玻璃效果，背景透明度 0.2-0.25
- 添加 `backdrop-blur(16px)` 磨砂玻璃质感
- Hero 图片区域添加渐变遮罩层，从底部向主体区域过渡

**8-bit 风格装饰**：
- 添加双层边框装饰（外层 1px + 内层 2px，金色透明度递减）
- 添加像素分隔线（方块 + 线条组合）
- 外层光晕增强玻璃质感

**像素字体统一**：
- 所有文字改用 `font-pixel` 像素字体
- 标题字号 11px，配合 tracking 和文字阴影
- 底部提示字号 7px，增加字间距

**按钮 3D 效果**：
- 主按钮添加渐变背景 + 底部阴影 + 内阴影
- active 状态位移 2px 模拟按压
- 次按钮使用毛玻璃风格 + 金色边框

**间距与呼吸感优化**：
- 卡片内边距增加到 `px-8 py-10`（32px/40px）
- 元素间距：标题区 mb-8，分隔线 mb-8，玩法说明 mb-10
- 玩法步骤间距 space-y-3

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx`

---

## [2026-02-21] Splash 页面第五次优化 - 卡片比例与纵向节奏

### 变更内容

**布局比例调整**：
- 卡片宽度收窄 → `min-w-[320px]` 改为 `min-w-[280px]`，内容更紧凑
- 上下内边距大幅增加 → `py-24` (96px) 改为 `py-32` (128px)，呼吸感更强

**纵向节奏优化**：
- 标题区域间距 `mb-10` → `mb-12`
- 英文副标题上方间距 `mt-5` → `mt-6`
- 分隔线下方间距 `mb-10` → `mb-12`
- 说明文字行高 `leading-[2.4]` → `leading-[2.6]`，更宽松
- 说明文字下方间距 `mb-12` → `mb-16`
- 按钮区内部间距 `gap-6` → `gap-8`

**整体效果**：
- 横向更紧凑，纵向更舒展，视觉比例更协调
- 文字与边框间距显著增大，不再"顶边"

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/SplashPage.tsx`

---

## [2026-02-21] Splash 页面第四次优化 - 间距与透明度微调

### 变更内容

**问题修复**：
- 卡片文字距离上下边缘太窄 → 内边距从 `p-12` (48px四边) 改为 `px-12 py-16` (左右48px，上下64px)
- 背景透明度不够 → 从 `rgba(..., 0.35/0.4)` 降至 `0.2/0.25`，更通透

**保持不变**：
- 像素字体风格 (`font-pixel`) 维持现有质感和色调
- 玻璃拟态边框、阴影、光晕效果

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/SplashPage.tsx`

---

## [2026-02-21] 游戏视觉高级设计规范文档化

### 变更内容

**新增设计规范章节**：
- 在 `AGENTS.md` 和 `IFLOW.md` 添加「游戏视觉高级设计规范」
- 基于 Splash 页面三次迭代经验 + NN/g Glassmorphism 最佳实践

**规范内容涵盖**：
1. Glassmorphism 毛玻璃效果（透明度、模糊、边框光晕参数）
2. 间距与呼吸感（内边距、间距、行高具体数值）
3. 像素字体的高级质感（字号、字间距、阴影配方）
4. 色彩与光影体系（配色方案、阴影层次、渐变遮罩）
5. 视觉层次架构（5 层结构及每层目的）
6. 8-bit 风格细节（分隔线、按钮 3D 效果、边框装饰）
7. 氛围感营造 checklist（8 项验收标准）

**设计原则提炼**：
- 透明度 0.35-0.6 是玻璃感的最佳平衡点
- 像素字体 20px 以下更有质感，配合 tracking 和阴影
- 低饱和深色 + 单一暖金强调色 = 高级感
- 内边距 ≥ 40px 避免"顶边"感

### 影响范围
- `AGENTS.md`
- `IFLOW.md`

---

## [2026-02-21] Splash 页面第三次优化 - 更透更宽松

### 变更内容

**透明度进一步提升**：
- 背景不透明度降低 (0.55/0.6 → 0.35/0.4)
- 模糊强度增加 (blur(20px) → blur(24px))
- 边框透明度微调 (0.45 → 0.4)

**上下高度大幅拉开**：
- 内边距增加 (p-10 → p-12)
- 标题区间距 (mb-8 → mb-10)
- 分隔线间距 (mb-8 → mb-10)
- 说明文字间距 (mb-10 → mb-12)
- 按钮区间距 (gap-5 → gap-6)
- 英文标题上边距 (mt-4 → mt-5)
- 说明文字行高增加 (leading-[2.2] → leading-[2.4])

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/SplashPage.tsx`

---

## [2026-02-21] Splash 页面透明度与像素字体优化

### 变更内容

**透明度进一步提升**：
- 背景不透明度降低 (0.75/0.8 → 0.55/0.6)
- 模糊强度增加 (blur(16px) → blur(20px))
- 更好地透出底部背景图，氛围感更强

**文字间距大幅拉开**：
- 内边距增加 (p-8 → p-10)
- 卡片最小宽度增加 (300px → 320px)
- 标题区间距 (mb-6 → mb-8)
- 分隔线间距 (mb-6 → mb-8)
- 说明文字间距 (mb-8 → mb-10)
- 按钮区间距 (gap-4 → gap-5)
- 文字行高增加 (leading-[1.8] → leading-[2.2])

**像素字体统一**：
- 所有文字改用 `font-pixel` 像素字体
- 标题字号调整 (24px → 20px)，更符合像素比例
- 说明文字字号调整 (14px → 11px)
- 按钮文字字号调整 (16px → 12px)
- 添加字间距和文字阴影保持高级质感

**分隔线像素化**：
- 移除渐变效果，改为纯像素方块
- 装饰点改为方形，符合 8-bit 风格

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/SplashPage.tsx`

---

## [2026-02-21] Splash 页面 Glassmorphism 优化

### 变更内容

**Glassmorphism 毛玻璃效果**：
- 降低背景不透明度 (0.95 → 0.75)，添加 `backdrop-blur(16px)` 实现磨砂玻璃质感
- 背景添加微妙渐变，增强深度感
- 添加外层光晕和精致阴影层次

**间距与呼吸感优化**：
- 内边距增加 (p-6 → p-8)
- 标题区间距增加 (mb-4 → mb-6)
- 分隔线间距增加 (mb-4 → mb-6)
- 说明文字间距增加 (mb-6 → mb-8)
- 按钮区间距增加 (gap-3 → gap-4)

**视觉层次提升**：
- 标题颜色提亮 (#F0D99C → #F5E4BB)，文字阴影更柔和
- 分隔线添加渐变效果，中间装饰点改为圆形
- 按钮添加渐变背景和光晕阴影
- 外边框装饰更精致（三层渐变边框）

**参考设计规范**：
- NN/g Glassmorphism 最佳实践：适度模糊 + 充足对比度
- Apple Vision Pro 透明层级设计语言

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/SplashPage.tsx`

---

## [2026-02-21] Splash 页面重设计 - 像素风格优化

### 变更内容

**布局重构**：
- 移除 flex 分散布局（flex-1 + justify-center），改为紧凑卡片式居中布局
- 限制卡片最大宽度 280px，解决"上顶天、下顶地"问题
- 添加 8-bit 风格双层边框装饰（外发光效果）

**按钮优化**：
- 限制按钮宽度（px-10），不再拉伸至全宽
- 添加 3D 按压效果（底部阴影 + active 位移）
- 使用像素风格锐利边框，移除渐变过渡

**视觉层次改进**：
- 标题：亮金色 (#F0D99C) + 双层文字阴影
- 说明文字：提高对比度至 #E8EBF0
- 副标题：缩小字号至 9px，增加字间距

**像素风格强化**：
- 弹窗背景：95% 不透明度深色 (#1A1D24)
- 分隔线：像素方块 + 线条组合
- 移除底部孤立像素装饰点

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/SplashPage.tsx`

## [2026-02-21] 视觉稿对齐修复与游戏 Bug 修复

### 变更内容

**Bug 修复（不可玩问题）**：
- **GameStage.tsx 拖拽交互**：修复 pointerdown 监听位置错误，改为在 compass 上监听，添加拖拽偏移量计算
- **罗盘样式**：添加 "LUO PAN" 标签，修正背景色为 #202736
- **EventModal.tsx 交互流程**：添加选中状态和确认按钮，选择后需点击"确认处置"才提交

**视觉稿对齐修复**：
- **SplashPage.tsx**：添加 FEED CARD 徽章、PLAY 芯片、底部提示改为"点击进入 Expanded"
- **GameStartPage.tsx**：Mobile 端 Hero 高度改为 300px，玩法说明第3步添加高亮背景
- **LevelSelectPage.tsx**：调整缩略图尺寸（Mobile 96x96、Web 200x132），调整播放按钮尺寸，添加底部提示

**代码规范修复**：
- 修复 `React` 未定义问题（导入类型）
- 修复 Promise 未 await 问题（添加 `void`）
- 移除不必要的注释

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/components/game/EventModal.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/SplashPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/LevelSelectPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/stores/GameContext.tsx`
- `src/frontend/feng-shui-8-bit/src/client/hooks/useProgress.ts`

## [2026-02-21] PixiJS 游戏引擎集成

### 变更内容

**依赖更新**：
- 新增 `pixi.js@8` - 高性能 2D 渲染引擎
- 新增 `@pixi/react` - React 集成

**游戏核心**：
- 新增 `src/client/game/GameStage.tsx` - PixiJS 游戏场景容器
- 新增 `src/client/game/ParticleSystem.ts` - 粒子效果系统
- 新增 `src/client/game/types.ts` - 游戏事件类型

**渲染层重构**：
- 房间渲染：使用 Sprite 加载冷/暖色底图，支持渐变切换
- 罗盘组件：使用 Graphics 绘制，支持旋转动画和拖拽交互
- 煞气精灵：黑色小煤球动画（浮动 + 缩放）
- 道具放置：动态加载道具纹理并叠加显示
- 粒子效果：通关时的金色粒子飘散

**清理工作**：
- 移除旧的 React DOM 游戏组件（RoomView, Compass, ItemOverlay）

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/`
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx`
- `package.json`

## [2026-02-20] 核心代码实现：游戏框架搭建

### 变更内容

**架构设计**：
- 新增 `docs/design/code/development-plan-v1.0.md` - 开发计划文档
- 新增 `docs/design/code/architecture-v1.0.md` - 前端架构设计文档

**类型系统**：
- 新增 `src/client/types/game.ts` - 游戏核心类型定义（ShaPoint, Level, GameState 等）
- 新增 `src/shared/game.ts` - 共享类型定义（PlayerProgress 等）

**状态管理**：
- 新增 `src/client/stores/GameContext.tsx` - React Context + useReducer 状态管理

**自定义 Hooks**：
- 新增 `src/client/hooks/useResponsive.ts` - 响应式检测（Mobile/Web 切换）
- 新增 `src/client/hooks/useProgress.ts` - 进度保存 Hook

**工具函数**：
- 新增 `src/client/utils/distance.ts` - 煞点探测算法

**页面组件**：
- 重写 `src/client/pages/SplashPage.tsx` - Feed Card 入口页
- 重写 `src/client/pages/GameStartPage.tsx` - 游戏介绍页
- 重写 `src/client/pages/LevelSelectPage.tsx` - 关卡选择页
- 重写 `src/client/pages/GameplayPage.tsx` - 游戏玩法主页面

**游戏组件**：
- 新增 `src/client/components/game/RoomView.tsx` - 房间视图（支持 Mobile 拖拽/缩放）
- 新增 `src/client/components/game/Compass.tsx` - 罗盘组件（Web 拖拽探测）
- 新增 `src/client/components/game/EventModal.tsx` - 事件弹窗（双端适配）
- 新增 `src/client/components/game/ItemOverlay.tsx` - 道具叠加层

**样式配置**：
- 更新 `src/client/index.css` - Tailwind CSS 4 主题配置（颜色变量、动画）

**关卡数据**：
- 新增 `src/client/data/levels.ts` - 关卡配置（Level 1 数据）

**后端 API**：
- 更新 `src/server/trpc.ts` - 新增 progress.get 和 progress.save API（Redis 存储）

**资源文件**：
- 复制 Level 1 图片资源到 `public/images/` 目录

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/**`
- `src/frontend/feng-shui-8-bit/src/server/trpc.ts`
- `src/frontend/feng-shui-8-bit/src/shared/game.ts`
- `docs/design/code/`

## [2026-02-20] 罗盘交互设计：Mobile/Web 分离

### 设计决策
- **Mobile**：罗盘固定屏幕中央 + 拖动房间图 + 双指缩放
- **Web**：房间图固定 + 拖动罗盘
- 核心概念统一：让探测点和煞气点重合

### 变更内容
- 更新 Gameplay Row 的 gameNote，区分两端交互方式。
- Mobile Gameplay 提示文案：`DRAG COMPASS` → `DRAG ROOM · PINCH TO ZOOM`。
- Web Gameplay 提示文案精简为 `DRAG COMPASS TO FIND SHA`。

### 影响范围
- `fengshui.pen`

## [2026-02-20] 视觉稿 Gameplay 页面适配 Level 1

### 变更内容
- **Mobile Gameplay**：房间占位符替换为 Level 1 冷色底图 `room-cold-v1.0.png`。
- **Mobile Gameplay**：煞气点弹窗内容更新为"横梁压顶"，选项匹配 `hotspots.json` 数据。
- **Web Gameplay**：房间占位符替换为 Level 1 冷色底图。
- **Web Gameplay**：右侧处置面板更新为"尖角煞"，描述和选项匹配实际数据。
- **Level Select**：Mobile/Web 两端 Level 1 缩略图替换为实际冷色底图。
- **Level Select**：更新 Level 1 描述为"雨夜单身公寓 · 4 煞气点"，进度指示器改为 4 格。

### 影响范围
- `fengshui.pen`

## [2026-02-20] Level 1 图片资产完成

### 变更内容
- 完成冷色底图生成：`room-cold.png`（阴郁雨夜单身公寓场景）。
- 完成暖色终图生成：`room-warm.png`（温馨通关完成态，包含道具放置）。
- 完成道具 PNG 生成：`gourd.png`、`plant-broad.png`、`screen.png`（透明背景）。
- 完成 AI 分析生成：`hotspots.json`（4 个煞气点数据）。
- 验证 Gemini image-to-image 能力：暖色图与冷色图结构一致，道具位置准确。

### 资产清单

| 文件 | 描述 | 状态 |
|-----|------|------|
| `room-cold.png` | 冷色底图 | ✅ |
| `room-warm.png` | 暖色终图 | ✅ |
| `gourd.png` | 葫芦道具 | ✅ |
| `plant-broad.png` | 阔叶绿植道具 | ✅ |
| `screen.png` | 屏风道具 | ✅ |
| `hotspots.json` | 煞点数据 | ✅ |

### 影响范围
- `resources/images/level1/`
- `resources/images/shared/items/`
- `CHANGELOG.md`

## [2026-02-20] 图文一致性规范与 Level 1 文案更新

### 变更内容
- 确立"以实际图片为准，文案与图片严格一致"的设计原则。
- 更新 `level-design.md` 以匹配 AI 分析生成的 `hotspots.json`。
- 在 AGENTS.md 和 IFLOW.md 添加图文一致性规范说明。
- 明确关卡设计流程：生成图片 → AI 分析 → 以分析结果更新设计文档。

### 影响范围
- `docs/design/game/level1/level-design.md`
- `AGENTS.md`
- `IFLOW.md`
- `CHANGELOG.md`

## [2026-02-20] 关卡制作流程与项目文档更新

### 变更内容
- 明确关卡制作流程：使用 Gemini 3 Pro Image Preview 的 image-to-image 能力。
- 确定暖色终图生成方式：上传冷色底图 + 道具 PNG 作为参考，生成完成态暖色图。
- 更新项目结构文档，添加 `docs/design/game/` 和 `resources/images/` 目录说明。
- 在 AGENTS.md 和 IFLOW.md 添加关卡制作流程详细说明。
- 规范提示词格式：必须完整可用，用 ```text``` 包裹，不拆分 system/user。
- 明确道具 PNG 双重用途：游戏交互 + 生成暖色图的参考素材。
- 更新 room-warm-v1.0.md 提示词，改为上传多图生成完成态。

### 影响范围
- `AGENTS.md`
- `IFLOW.md`
- `docs/design/game/level1/prompts/room-warm-v1.0.md`
- `CHANGELOG.md`

## [2026-02-20] Level 1 关卡设计文档体系搭建

### 变更内容
- 建立 Level 1 设计文档目录结构：`docs/design/game/level1/`。
- 新增关卡设计文档 `level-design.md`，定义 4 个煞气点（镜冲床、尖角煞、横梁压顶、门冲）。
- 新增生图提示词目录 `prompts/`，包含：
  - `room-cold-v1.0.md`：冷色底图提示词
  - `room-warm-v1.0.md`：暖色终图提示词
  - `items/gourd-v1.0.md`：葫芦道具提示词
  - `items/plant-broad-v1.0.md`：阔叶绿植道具提示词
  - `items/screen-v1.0.md`：屏风道具提示词
- 新增解析提示词目录 `analysis/`，包含：
  - `sha-analysis-v1.0.md`：煞气点识别提示词（图片 → hotspots.json）
  - `position-validation-v1.0.md`：位置校验提示词
- 建立资源目录结构 `resources/images/level1/`，包含 `metadata.json` 和 `README.md`。
- 新增共享资源目录 `resources/images/shared/` 用于跨关卡道具素材。

### 影响范围
- `docs/design/game/level1/level-design.md`
- `docs/design/game/level1/prompts/*`
- `docs/design/game/level1/analysis/*`
- `resources/images/level1/*`
- `resources/images/shared/README.md`
- `CHANGELOG.md`

## [2026-02-20] 关卡生成流水线方案

### 变更内容
- 新增 `docs/design/game/level-generation-pipeline-v1.0.md`，定义完整的关卡资产生成流程。
- 确立"AI 生图 → AI 分析 → 自动生成 JSON"的自动化方案，摒弃人工标注。
- 设计分层生图策略：底图 + 煞气层 + 道具层 + 光效层，支持运行时合成。
- 定义 AI 分析 Prompt 模板，用于"图片 → hotspots JSON"的转换。
- 规划道具效果图方案：道具 PNG 叠加 + 局部净化贴片 + 暖色终图切换。
- 输出资产目录结构规范。

### 影响范围
- `docs/design/game/level-generation-pipeline-v1.0.md`
- `CHANGELOG.md`

## [2026-02-20] 视觉稿页面流程重构：4 层结构

### 变更内容
- 重构视觉稿页面流程：Splash → Game Start → Level Select → Gameplay（4 层）。
- Mobile 端新增 `Mobile Game Start`（启动页）和 `Mobile Level Select`（关卡选择页）。
- Web 端新增 `Web Game Start`（启动页）和 `Web Level Select`（关卡选择页）。
- Mobile Splash 添加背景图 `home-v1.0.png` + 深色遮罩层，提升视觉冲击力。
- 更新 boardHeader 副标题为页面流程说明。
- 清理 Web Splash 右侧多余元素（道具栏、色板切换条），只保留房间预览图。
- 调整主画板尺寸：宽度 4000px、高度 4200px，容纳横向排列的所有页面。

### 影响范围
- `fengshui.pen`
- `CHANGELOG.md`

## [2026-02-19] 提示词拆线：首页插图与正式关卡分离

### 变更内容
- 重写 `docs/design/prompts/README.md`，明确 `home-*` 与 `level-*` 两条提示词线路。
- 新增首页去剧透版本：`docs/design/prompts/home-hero-cold-v1.1.md`（推荐用于首页氛围图）。
- 新增正式关卡提示词：`docs/design/prompts/level1-dev-dungeon-cold-v1.0.md`。
- 新增通关同构图 follow-up：`docs/design/prompts/level1-dev-dungeon-warm-followup-v1.0.md`。
- 新增索引文件：`docs/design/prompts/INDEX.md`，便于快速选型。

### 影响范围
- `docs/design/prompts/README.md`
- `docs/design/prompts/home-hero-cold-v1.1.md`
- `docs/design/prompts/level1-dev-dungeon-cold-v1.0.md`
- `docs/design/prompts/level1-dev-dungeon-warm-followup-v1.0.md`
- `docs/design/prompts/INDEX.md`
- `CHANGELOG.md`

## [2026-02-19] 新增生图提示词管理与首页插图 Prompt

### 变更内容
- 建立 `docs/design/prompts` 提示词管理规范文档（命名、结构、迭代流程）。
- 新增首页主插图冷色开局 Prompt：`home-hero-cold-v1.0.md`。
- Prompt 针对“罗盘扫描玩法 + UI 叠加可读性 + 与低饱和视觉体系统一”进行约束。

### 影响范围
- `docs/design/prompts/README.md`
- `docs/design/prompts/home-hero-cold-v1.0.md`
- `CHANGELOG.md`

## [2026-02-19] 启动页双端适配与罗盘玩法视觉体系更新

### 变更内容
- 在 `fengshui.pen` 重构启动页展示：按两行输出 Mobile / Web 适配方案。
- 删除旧版启动页画板，保留统一的响应式主画板与新版风格基线。
- 新增“罗盘探测煞点”玩法视觉流：全屏房间图、罗盘拖动、事件弹窗、四步闭环通关流程。
- 调整整体配色为低饱和中性色 + 单一暖金强调，降低与模型生图的风格冲突风险。
- 补充 UI/玩法设计文档：`docs/design/ui/fengshui-gameplay-ui-v1.0.md`。

### 影响范围
- `fengshui.pen`
- `docs/design/ui/fengshui-gameplay-ui-v1.0.md`
- `CHANGELOG.md`
