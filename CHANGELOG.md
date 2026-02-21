## [2026-02-21] GameStage unsafe-eval 兼容性修复

### 变更内容

**问题分析**：
- 错误：`Current environment does not allow unsafe-eval`
- 之前的修复使用了 `@pixi/unsafe-eval` v7，但项目使用 PixiJS v8
- PixiJS v7 和 v8 的 unsafe-eval 模块不兼容

**解决方案**：
- PixiJS v8 内置了 unsafe-eval 支持，通过 `pixi.js/unsafe-eval` 子路径导入
- 移除不兼容的 `@pixi/unsafe-eval` v7 依赖
- 将 `import '@pixi/unsafe-eval'` 改为 `import 'pixi.js/unsafe-eval'`
- 确保 unsafe-eval 导入在其他 pixi.js 导入之前

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`
- `src/frontend/feng-shui-8-bit/package.json`

---

## [2026-02-21] GameStage unsafe-eval 最终修复

### 变更内容

**问题分析**：
- 错误：`Current environment does not allow unsafe-eval`
- PixiJS v8 的 WebGL 和 Canvas 渲染器都依赖 unsafe-eval

**解决方案**：
- 安装 `@pixi/unsafe-eval` 包
- 在 GameStage.tsx 导入 `@pixi/unsafe-eval` 启用支持
- 移除 `preference: 'canvas'` 配置

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`
- `package.json`（新增依赖）

---

## [2026-02-21] GameStage unsafe-eval 错误修复（失败尝试）

### 变更内容

**问题分析**：
- 错误：`Current environment does not allow unsafe-eval`
- 根本原因：Reddit Devvit iframe 环境禁止 unsafe-eval
- PixiJS WebGL 渲染器依赖 unsafe-eval

**尝试方案**：
- 添加 `preference: 'canvas'` 强制使用 Canvas 渲染器
- 但 Canvas 渲染器也有 unsafe-eval 检查，方案失败

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`

---

## [2026-02-21] GameStage 死锁问题修复

### 变更内容

**问题分析**：
- 日志显示 `canvas= false`，初始化被跳过
- 根本原因：渲染逻辑存在死锁
  - 组件先渲染"加载中..."（没有 canvas）
  - useEffect 检查 `!canvas` 就跳过初始化
  - `isReady` 永远不会变成 true
  - 永远渲染"加载中..."，永远不渲染 canvas

**GameStage.tsx 修复**：
- 始终渲染 canvas，无论 isReady 状态
- 将加载状态和错误状态改为覆盖层形式
- 使用 `pointer-events-none` 让加载层不阻挡交互
- 添加重试按钮

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`

---

## [2026-02-21] GameStage 图片加载问题修复

### 变更内容

**问题分析**：
- 游戏页面卡在"加载中..."状态
- 根本原因：PixiJS v8 的 `Assets.load` 在某些环境下可能卡住或失败

**GameStage.tsx 修复**：
- 添加 `Assets.init()` 初始化步骤
- 添加 10 秒超时处理，防止加载无限卡住
- 添加备用加载方案：原生 `Image` + `Texture.from()`
- 当 `Assets.load` 失败时自动回退到备用方案
- 添加更详细的日志输出便于排查问题
- 道具加载同样添加备用方案

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`

---

## [2026-02-21] Gameplay 页面空白问题修复

### 变更内容

**问题分析**：
- 点击关卡进入游戏页面后显示空白
- 根本原因：PixiJS 初始化依赖项不正确 + 容器尺寸获取不可靠

**GameStage.tsx 修复**：
- 修复 useEffect 依赖数组为空的问题，添加正确的依赖项
- 添加 initKeyRef 防止重复初始化
- 添加错误状态处理和错误显示
- 添加加载状态显示
- 增强 destroy 错误处理

**GameplayPage.tsx 修复**：
- 使用 ResizeObserver 替代 offsetWidth/offsetHeight 获取容器尺寸
- 添加 `min-h-0` 解决 flex 布局高度问题
- 添加显式高度 `height: calc(100vh - 60px)`
- 添加初始化加载提示

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx`

---

## [2026-02-21] LevelSelect 页面移动端对比度修复

### 变更内容

**卡片背景调整**：
- 背景透明度提高：0.25-0.35 → 0.65-0.75，更亮更清晰
- 模糊强度降低：blur(20px) → blur(12px)，减少玻璃感但增加可读性
- 边框透明度提高：让卡片轮廓更清晰

**文字颜色提亮**（移动端专属）：
- 锁定关卡标题：#4A5568 → #9CA3AF
- 锁定关卡名称：#3E4C43 → #B8BCC4
- 锁定关卡描述：#2D3748 → #8B929C
- 解锁关卡名称：#E2E8F0 → #F5F7FA
- 解锁关卡描述：#8D97A8 → #C4CAD6
- 煞气指示器锁定态：#5A6578 → #9CA3AF

**缩略图锁定效果优化**：
- 模糊度降低：blur(6px) → blur(4px)
- 亮度提高：brightness(0.4) → brightness(0.6)
- 面纱遮罩减弱：透明度 0.5-0.7 → 0.35-0.5
- 锁定符号可见度提高

**底部区域优化**：
- 提示文字颜色：#5A6578 → #9CA3AF
- 进度文字颜色：#4A5568 → #7B8490
- 装饰线颜色：#3E4C43 → #6B7280

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/LevelSelectPage.tsx`

---

## [2026-02-21] LevelSelect 页面神秘感设计升级

### 变更内容

**锁定关卡"未知感"设计**：
- 模糊轮廓效果：锁定关卡显示 `blur(6-8px)` 模糊缩略图
- 半遮面纱层：上方叠加半透明渐变遮罩，隐约可见但不能看清
- 神秘符号替代锁：使用 `◈` 菱形符号 + 气场光晕代替传统锁图标
- 神秘化提示文案：`"卦象未明，待天时开启"`

**气场能量场视觉暗示**：
- 每个关卡配置独特气场色（AuraColor），对应风水五行/方位：
  - Level 1: 冷蓝 `#4A6FA5`（坎宫·水）
  - Level 2: 神秘紫 `#7B68A6`（巽宫·风）
  - Level 3: 暗红 `#A65D57`（离宫·火）
- 气场光晕层：卡片 hover 时显示对应色彩光晕
- 进度条按气场色区分不同关卡

**文案神秘化**：
- 关卡名：`"开发者的地牢"` → `"坎宫·暗室"`
- 关卡提示：新增 `mysteryHint` 字段，如 `"水旺之地，阴气凝聚"`
- 难度标签：`入门/进阶/大师` → `初窥/入定/悟道`
- 底部提示：`通关解锁下一关卡` → `破煞通关 · 方显天机`
- 进度文案：`当前进度: 1 / N 关卡` → `已探 · 1 / N 境`

**背景八卦纹理**：
- 添加极淡（opacity: 0.015）八卦纹背景纹理
- 同心圆 + 八方位线，若隐若现的神秘感

**新增类型与数据**：
- `AuraColor` 类型：primary/secondary/glow 三层气场色
- `LevelWithAura` 类型：扩展 Level，添加气场配置和神秘化文案
- 新增 Level 3 预留关卡（离宫·炎宅）

### 设计理念

**"未知"比"不可见"更有吸引力**：
- 模糊的轮廓让玩家产生好奇，而非灰暗的"锁死感"
- 气场色彩暗示每个关卡独特的能量特质
- 风水术语包装强化游戏主题沉浸感

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/LevelSelectPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/data/levels.ts`

---

## [2026-02-21] LevelSelect 页面静谧化重构

### 变更内容

**移除所有动画效果，回归静谧**：
- 删除飘落花瓣组件 `PetalParticle` 及其 8 个实例
- 删除浮动煞气粒子组件 `ShaParticle` 及其 5 个实例
- 移除缩略图呼吸动画 `thumbnail-breathe`
- 移除关卡卡片入场动画 `card-animate-in`
- 移除顶部标题栏入场动画
- 移除底部提示入场动画

### 设计理念

**"静"即是"境"**：
- 风水本身是静心观察、慢慢体会的东方哲学
- 解谜游戏需要专注，过多动效反而分散注意力
- 静谧氛围更符合"阴郁→温馨"的色调转变主题
- 让玩家专注于关卡选择本身

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/LevelSelectPage.tsx`

---

## [2026-02-21] LevelSelect 页面优化 v4

### 变更内容

**花瓣缓速自转动画**：
- 新增 `petal-rotate` 关键帧动画，8-14秒完成一圈旋转
- 每个花瓣随机旋转方向（顺时针/逆时针）
- 旋转与下落动画分离，使用 CSS 多动画同时播放

**移动端卡片完全重构**（扁平紧凑设计）：
- 采用水平紧凑布局：缩略图(80x80) + 信息区 + 箭头
- 缩略图移至左侧，小尺寸更省空间
- 信息区单行排列，去掉冗余装饰
- 播放按钮改为极简箭头（▶），移除大按钮设计
- 难度标识简化为3个色块，去除文字标签
- 煞气点标签简化为"煞气"二字
- 隐藏移动端不必要的装饰：边角装饰、像素分隔线
- 桌面端保持原有精致布局不变

### 设计理念

**移动端"轻"设计**：
- 信息密度优先于视觉效果
- 单手操作友好：右侧箭头明确可点击
- 去除装饰性元素，保留核心信息

**视觉层次简化**：
- 标题 → 描述 → 元信息，三层递进
- 难度和煞气点使用图标化表达

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/LevelSelectPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/index.css`

---

## [2026-02-21] LevelSelect 页面问题修复

### 变更内容

**花瓣形状优化**：
- 修复菱形花瓣过于方正的问题，改用自然椭圆曲线
- 使用随机 border-radius 生成不规则花瓣形状
- 添加线性渐变和微光效果，增强立体感
- 花瓣比例调整为 height = width * 1.3，更符合真实花瓣形态

**横向滚动条修复**：
- 关卡列表容器添加 `overflow-x-hidden`，彻底禁止左右滑动
- 明确使用 `overflow-y-auto` 只保留垂直滚动

**移动端布局重构**（响应式适配）：
- 卡片布局从水平改为垂直堆叠（flex-col → sm:flex-row）
- 移动端缩略图宽度 100%，高度 120px；桌面端保持 100x100
- 字体大小响应式调整：移动端减小 1-2px
- 播放按钮区域：移动端横向排列 + 顶部边框；桌面端纵向 + 左边框
- 煞气点指示器尺寸响应式：移动端 w-2.5，桌面端 w-3

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/LevelSelectPage.tsx`

---

## [2026-02-21] LevelSelect 页面高级感简约优化 v3

### 变更内容

**卡片悬浮感升级**（物理感表达）：
- hover 时卡片轻微上浮 `-translate-y-1`，营造"脱离平面"的悬浮感
- 双层阴影系统：外层光晕 + 底部投影，hover 时同步增强
- 500ms 缓动动画，优雅流畅的过渡效果

**飘落花瓣粒子**（东方禅意氛围）：
- 新增 `PetalParticle` 组件，菱形花瓣缓慢飘落
- 8 个花瓣分布在不同位置，随机延迟和周期（11-16s）
- 自然摆动轨迹（左右飘移 + 旋转），模拟真实飘落物理
- 暖金色调（#C4A06A / #D4B07A / #B8904F），与主题和谐

**缩略图精致化**：
- 呼吸动画（thumbnail-breathe）：4s 周期轻微缩放（1.0 → 1.02）
- 边缘光效果：静态内发光 + hover 外发光增强
- 双层边框阴影，增强立体感

**留白呼吸感优化**：
- 页面内边距增加：p-5 → px-6 py-8
- 标题栏下边距增加：mb-6 → mb-8
- 卡片间距增加：space-y-4 → space-y-5
- 列表底部留白增加：pb-4 → pb-6

**CSS 动画系统扩展**：
- `petal-fall`：花瓣自然飘落关键帧动画
- `thumbnail-breathe`：缩略图呼吸动画
- `card-float`：卡片悬浮动画（备用）
- `edge-glow`：边缘光脉冲动画（备用）

### 设计理念

**"侘寂"美学表达**：
- 不完美中的美感 - 花瓣随机飘落轨迹
- 自然节奏 - 呼吸动画模拟生命律动
- 留白艺术 - 增加间距让视觉有喘息之地

**克制的高级感**：
- 不做加法做乘法 - 不是堆砌特效，而是提升每个细节的质感
- 微交互哲学 - 变化微妙但能被感知（上浮 1px，缩放 2%）
- 光影层次 - 双层阴影营造真实的空间深度

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/LevelSelectPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/index.css`

---

## [2026-02-21] LevelSelect 页面视觉优化 v2 - 解决"空落落"问题

### 变更内容

**增加信息密度与层次感**：
- 卡片内边距从 p-3 增加到 p-4，呼吸感更好
- 新增"可游玩"状态标签（金色边框小标签）
- 新增难度标识组件（入门/进阶/大师 + 点阵可视化）
- 新增预计时间显示（⏱ 图标 + 时间文本）

**8-bit 风格装饰元素**：
- 四角三角形装饰（CornerDecorations 组件）
- 像素分隔线组件（PixelDivider：渐变线 + 像素方块）
- 卡片内部装饰点阵（底部右侧 5 个像素点）
- 缩略图添加 2px 边框增强轮廓感

**播放按钮区域优化**：
- 按钮尺寸增大（12x12 → 14x14）
- 添加左侧分隔线（border-l）形成独立区域
- hover 时显示"开始"文字提示（opacity 动画）
- 按钮阴影增强（0 2px → 0 3px 底部阴影）

**底部提示区域重设计**：
- 添加像素装饰分隔线（对称设计 + 中心菱形）
- 提示文字容器化（毛玻璃背景 + 边框）
- 新增关卡进度统计（当前进度: 1 / N 关卡）
- 新增像素进度条（关卡状态可视化）

**类型定义扩展**：
- Level 类型新增 difficulty 字段（easy/normal/hard）
- Level 类型新增 estimatedTime 字段（预计时间字符串）
- 更新关卡数据配置

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/LevelSelectPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/types/game.ts`
- `src/frontend/feng-shui-8-bit/src/client/data/levels.ts`

---

## [2026-02-21] LevelSelect 页面游戏化视觉重设计

### 变更内容

**全屏沉浸式布局**：
- 全屏背景图 + 径向渐变遮罩 + 上下线性渐变
- 内容层叠加在背景之上，增强氛围感

**Glassmorphism 毛玻璃效果**：
- 关卡卡片使用毛玻璃背景（blur(20px) + saturate(1.3)）
- 像素回字纹边框装饰（单层金色边框，hover 时增强）
- 外层光晕效果（hover 时显示）

**关卡卡片组件化**：
- 新增 `LevelCard` 组件，统一关卡展示样式
- 缩略图 96x96 固定尺寸，锁定时显示灰色占位 + 锁定遮罩
- 煞气进度指示器改为金色渐变 + 发光效果
- 播放按钮 3D 效果（渐变背景 + 底部阴影 + 光晕）

**浮动煞气粒子**：
- 5 个小煤球粒子在背景层缓慢漂浮
- 随机延迟和动画周期，增强动态感

**入场动画**：
- 标题栏立即出现
- 关卡卡片依次淡入（stagger 0.15s）
- 底部提示延迟 0.6s 出现

**像素字体统一**：
- 标题使用发光金色文字（#F5E4BB）
- 关卡名使用次亮色（#E2E8F0）
- 描述使用暗灰色（#6B7280）
- 底部提示使用装饰线分隔

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/LevelSelectPage.tsx`

---

## [2026-02-21] GameStart 页面游戏化视觉重设计

### 变更内容

**步骤图标化**（方案 A 实现）：
- 新增 `StepIcons.tsx` 组件，包含罗盘/葫芦/太阳三个 SVG 图标
- 罗盘图标：像素风格圆形罗盘 + 八方位线 + 指针，带 4s 缓慢旋转动画
- 葫芦图标：传统葫芦形状 + 挂绳，带 2s 左右摆动动画
- 太阳图标：中心圆 + 八条光芒，带 2s 呼吸脉冲动画

**氛围元素增强**（方案 B 实现）：
- 浮动煞气粒子：4 个小煤球在卡片周围缓慢漂浮（3.5-4.5s 随机周期）
- 罗盘网格纹理：卡片背景极淡同心圆 + 十字网格（透明度 0.01-0.02）
- 像素回字纹边框：双层边框装饰（外层 1px + 内层 2px）

**视觉节奏调整**（方案 C 实现）：
- 标题区域占比增大：字号 22px + 字间距 0.1em + 文字阴影增强
- 分隔线改为祥云纹风格：三角形装饰 + 渐变线条
- 步骤间距加大：gap-4 + SVG 箭头连接线
- 新增引导语："准备好改变房间气场了吗？"
- 按钮字号 13px，文案"选择关卡"

**页面入场动画序列**：
- 卡片从下方滑入（0.5s）
- 三个步骤依次出现（stagger 0.6s/0.8s/1s）
- 底部文案渐显（1.2s 延迟）

**背景图统一**：
- SplashPage 和 GameStartPage 统一使用 `home-v1.0.png`

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/SplashPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/components/game/StepIcons.tsx`（新增）
- `src/frontend/feng-shui-8-bit/src/client/index.css`

---

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
