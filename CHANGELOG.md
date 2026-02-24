## [2026-02-24] 关卡列表页面 UI 优化 v3.0

### 变更内容

**核心改动**：按照 UI 优化方案 v3.0 重构关卡选择页面，支持完整 20 关关卡。

**关卡数据更新**：
- 更新 `levels.ts` 为完整 20 关数据
- 包含所有煞气点配置（位置、类型、选项）
- 新增所有煞气类型定义（路冲煞、天斩煞、反弓煞等）
- 支持章节分组（初窥门径、渐入佳境、融会贯通、超凡入圣）

**图片资源**：
- 拷贝 Level 1-20 图片到 `public/images/levelX/` 目录
- 包含 `room-cold.png` 和 `room-warm.png`

**UI 组件实现**：
1. **ProgressPath** - 进度路径组件（◆─◈─◇─◇ 格式）
2. **ChapterSection** - 章节分组组件（当前关卡置顶）
3. **LevelCard** - 统一关卡卡片组件
   - 像素硬边风格（4px 4px 0 0 阴影）
   - 当前关卡脉冲发光效果
   - 已通关关卡显示"吉"标记
   - 锁定关卡显示迷雾动画
4. **MistOverlay** - 迷雾动画组件（漂浮粒子 + 问号）
5. **ContinueButton** - 继续游戏悬浮按钮（刘海屏适配）

**Hook 更新**：
- `useLevelCompletion` 新增 `getCompletedCount()` 和 `getCurrentLevel`
- 支持关卡通关状态记忆

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/LevelSelectPage.tsx` - 完全重构
- `src/frontend/feng-shui-8-bit/src/client/data/levels.ts` - 更新为 20 关
- `src/frontend/feng-shui-8-bit/src/client/types/game.ts` - 新增煞气类型
- `src/frontend/feng-shui-8-bit/src/client/hooks/useLevelCompletion.ts` - 新增方法
- `src/frontend/feng-shui-8-bit/public/images/level2-20/` - 新增关卡图片

---

## [2026-02-23] Web 端罗盘在煞气点核心区域无法移动的问题修复

### 变更内容

**问题描述**：Web 端下，当罗盘移动到煞气点最核心区域后，无法再移动罗盘，每次点击罗盘都会弹出问题选项。

**根本原因**：
- 当罗盘移动到煞气点核心区域（`dist < radius * 0.4`）时，弹窗打开
- 用户关闭弹窗后，罗盘位置没有改变，仍然在核心区域
- 用户下次点击罗盘开始拖动时，`pointermove` 触发，`handleCompassMove` 检测到位置仍在核心区域，立即再次弹出弹窗
- 形成死循环，用户无法拖动罗盘离开核心区域

**修复方案**：
- 在 `CLOSE_MODAL` 时，检测罗盘位置是否在某个未解决煞气点的核心区域内
- 如果在核心区域，自动将罗盘移到边缘区域（`radius * 0.65`，位于 fast 和 super-fast 阈值之间）
- 同时重置 `compassSpeed` 为 `normal`，避免指针动画异常

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/stores/GameContext.tsx`

---

## [2026-02-23] Desktop 端图片比例 + 罗盘拖拽交互修复

### 变更内容

**问题 1: 图片比例变形**
- 现象：Desktop/Fullscreen 模式下图片左右被挤压，失去原始宽高比
- 根因：
  - 初始化时图片被强制拉伸到屏幕尺寸 `coldSprite.width = width; coldSprite.height = height`
  - resize 时同样使用拉伸逻辑
- 修复：改为 contain 模式，计算缩放比例使图片完整显示，保持原始宽高比居中

**问题 2: 罗盘交互方式**
- 现象：点击屏幕任意位置罗盘就跳到那里
- 根因：监听了 `app.stage.on('pointerdown')` 实现点击跳转
- 修复：改为拖拽交互
  - 监听罗盘 `compass.on('pointerdown')` 开始拖拽
  - canvas 的 `pointermove`/`pointerup` 处理拖拽过程
  - 光标状态 `grab` → `grabbing` 提供视觉反馈

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx`

---

## [2026-02-23] 通关后拖动功能修复 + 冷暖对比手势优化

### 变更内容

**问题修复**：通关后按住鼠标拖动图片失效，图片位置固定无法移动。

**根本原因**：
- 冷暖对比手势处理器 `handlePointerDown/Up/Cancel/Leave` 调用了 `e.stopPropagation()`，阻止了事件传播到 canvas。
- canvas 的拖动功能依赖原生 pointer 事件监听器，事件被阻止后拖动失效。

**修复方案**：
- 移除冷暖对比手势处理器中的 `e.preventDefault()` 和 `e.stopPropagation()`。
- 让事件同时传递给容器（冷暖对比）和 canvas（拖动），实现两个功能并行：
  - 按住显示冷图（原图对比）
  - 同时可以拖动图片查看不同区域

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx`

---

## [2026-02-23] 全屏模式按住对比修复（按住冷图/松开回暖）

### 变更内容
- **问题修复**：修复全屏模式下通关后“按住显示冷图”不生效的问题。
- **根因定位**：游戏画布在 Desktop 路径会 `stopPropagation`，导致外层容器在冒泡阶段接不到对比手势事件。
- **修复方案**：
  - 将对比手势监听改为 `onPointerDownCapture / onPointerUpCapture / onPointerCancelCapture`（捕获阶段）。
  - `pointerleave` 保持在容器层兜底回暖，防止异常停留在冷图。
  - 对比手势处理统一 `preventDefault + stopPropagation`，避免全屏下浏览器默认行为干扰。

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx`

---

## [2026-02-23] Desktop 触控板双指捏合缩放支持（Mac Safari）

### 变更内容
- **新增手势支持**：Desktop 游戏画布增加 Mac Safari 原生 `gesturestart/gesturechange/gestureend` 监听，支持苹果触控板双指捏合缩放。
- **兼容策略**：保留 `wheel` 缩放通道（Chrome/Edge 触控板与鼠标滚轮），并与 Safari `gesture*` 通道并行兼容。
- **缩放锚点一致性**：Safari 双指捏合使用手势中心作为锚点计算位移，缩放时画面不漂移。

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`

---

## [2026-02-23] 游戏手势回归修复（Desktop 缩放 + 通关对比松开回暖）

### 变更内容
- **Desktop 缩放修复**：为游戏主画布新增 `wheel/pinch` 缩放输入，解决桌面端缩放手势无响应。
- **坐标映射修复**：Desktop 点击移动罗盘时，按当前房间偏移/缩放反算归一化坐标，避免缩放后探测点位偏移。
- **视觉同步修复**：罗盘在 Desktop 下跟随房间缩放/平移实时重定位，保证视觉与逻辑一致。
- **通关对比修复**：修复“按住切冷图后松开不回暖”的状态卡死问题：
  - 对比手势监听从仅 `completed` 改为 `completed/comparing` 全程生效。
  - 释放逻辑统一执行 `setComparing(false)`，避免因状态切换时机导致漏回退。
  - 对比期间禁用罗盘移动/碰撞回调，避免状态冲突。

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx`

---

## [2026-02-23] 游戏页手势失效修复（拖动/缩放恢复 + 无冲突）

### 变更内容
- **问题修复**：修复游戏页移动端拖动与双指缩放失效问题，恢复可用性。
- **输入通道重构**：将 Mobile 手势从 `touch*` 改为统一 `pointer` 多指状态机（`pan`/`pinch`），避免 touch 与 pointer 双通道竞争。
- **冲突消除**：
  - Mobile 下关闭 Pixi stage/compass 的 pointer 交互模式，避免与原生手势争抢事件。
  - 冷暖对比手势仅在 `completed` 状态挂载，避免和游戏中拖拽/缩放冲突。
- **丝滑优化**：新增目标位姿 + ticker 插值（lerp）更新，拖动/缩放更平滑且连续。
- **缩放稳定性**：双指缩放以手势中心为锚点计算位移，缩放过程中画面不飘移；双指切单指可无缝回到拖动状态。

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx`

---

## [2026-02-23] Mobile 端游戏手势 + Devvit 隔离窗口错误修复

### 变更内容
- **问题修复**：Mobile 端游戏进行中点击屏幕报错 "isolation 窗口不能发送消息给 parent"
- **根本原因**：之前的修复错误地让 Mobile 端游戏进行中不阻止 pointer 事件冒泡
- **正确方案**：
  - 始终阻止 pointer 事件冒泡（避免触发 Devvit 错误）
  - 只在通关后才执行冷暖对比逻辑
  - touch 事件和 pointer 事件是独立的，阻止 pointer 冒泡不影响 touch 手势

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx`

---

## [2026-02-23] GameStartPage 毛玻璃效果优化（高级感提升）

### 变更内容
- **问题修复**：GameStartPage 毛玻璃效果不高级，背景透得太多导致廉价感
- **根本原因**：遮罩层叠加方式错误 + backdrop-filter 效果打折
- **遮罩层简化**：
  - 从三层叠加改为两层（与 SplashPage 一致）
  - 径向渐变 + 顶部/底部渐变
- **毛玻璃参数优化**：
  - 背景模糊：`blur(16px)` → `blur(24px)`
  - 饱和度：`saturate(1.15)` → `saturate(1.4)`
  - 外发光范围：`48px` → `100px`
  - 外发光强度：`0.04` → `0.08`
  - 外层光晕：`0.12` → `0.18`
- **边框优化**：
  - 边框宽度：`1px` → `2px`
  - 边框透明度：`0.42` → `0.45`
- **内边距增加**：
  - `py-3/py-4` → `py-10/py-12`（增强呼吸感）

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx`

---

## [2026-02-23] GameStartPage Desktop 一屏布局优化

### 变更内容
- **问题修复**：Desktop 端页面需要上下滚动才能显示完整，现优化为一屏显示
- **布局优化**：
  - 减小整体容器尺寸：`max-w-[720px]` → `max-w-[600px]`
  - 减小内边距：`py-4/py-6` → `py-3/py-4`
  - 减小元素间距：各 `mb-*`, `mt-*` 值普遍减少 1-2 级
  - 减小字体尺寸：标题 `22px/26px` → `20px/22px`，正文普遍减小 1px
- **步骤卡片优化**：
  - 卡片宽度：`92px/130px` → `80px/100px`
  - 图标尺寸：`size-16/size-[78px]` → `size-12/size-14`
  - 图标内容：`size={32}` → `size={24}`
  - 字体和间距相应缩小
- **连接器优化**：宽度 `w-5/w-8` → `w-4/w-6`，箭头 `size-1` → `size-0.5`
- **测试验证**：frontend-tester 确认 1920x1080 viewport 下一屏显示完整

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx`

---

## [2026-02-23] GameStartPage 滚动问题修复尝试（未完成）

### 变更内容
- **问题描述**：GameStartPage 页面在真机上仍然可以上下滚动，一屏无法显示完整内容
- **尝试修复**：
  - 外层容器：`min-h-dvh` → `h-dvh`，强制限制在视口高度内
  - main 容器：`min-h-dvh` → `h-full`，继承父容器高度
  - 减少垂直内边距：`py-4/py-5` → `py-2/py-3`
  - 减少各元素间距：`mt-2` → `mt-1.5`, `mb-5` → `mb-4` 等
- **状态**：问题仍未完全解决，需要后续进一步优化

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx`

---

## [2026-02-23] GameStartPage 背景遮罩优化

### 变更内容
- **问题修复**：真机APP上背景底图因遮罩过暗而完全不可见
- **遮罩透明度调整**：
  - 径向渐变遮罩：`rgba(8, 12, 20, 0.62)` → `rgba(8, 12, 20, 0.35)`
  - 线性渐变遮罩：`rgba(7, 10, 16, 0.82)` → `rgba(7, 10, 16, 0.55)`
  - 边缘暗角：`rgba(10,14,22,0.45)` → `rgba(10,14,22,0.25)`
  - 底部渐变：`#0E1116/70` → `#0E1116/50`
- **玻璃卡片优化**：
  - 背景不透明度：`0.58-0.66` → `0.42-0.48`
  - 边框透明度：`0.38` → `0.42`（稍微提高以维持可读性）
- **背景图片**：移除 `opacity-90`，使用完全不透明

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx`

---

## [2026-02-23] GameStartPage 启动页审美重构（高端氛围版）

### 变更内容
- 重构启动页视觉结构为三层叙事：背景聚焦层、玻璃信息层、主行动层，去除过度堆叠装饰造成的“廉价感”。
- 重写三步骤模块（寻煞气/化煞气/转暖色）为统一规格卡片，提升图标识别度、文案可读性与节奏感。
- 调整标题区与分隔线比例，强化留白和纵向节奏，降低“元素密度过高”的压迫感。
- 重新设计主按钮材质与阴影深度，保留像素风 3D 按压反馈，提升点击意图聚焦。
- 新增更克制的入场与扫光动画，并补充 `prefers-reduced-motion` 降级，保证氛围感与可用性平衡。
- 优化移动端尺寸与间距，避免小屏上卡片内容发灰、拥挤和底部信息存在感过低的问题。

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx`

---

## [2026-02-23] GameStartPage 高级感优化 v2.0

### 变更内容

**核心问题修复**：解决玻璃质感"太平"、缺少层次、缺乏高级感的问题

**设计升级**：

1. **增强玻璃质感（参考 Apple Vision Pro）**：
   - 背景不透明度：`0.08-0.12` → `0.52-0.58`（真正可感知的玻璃）
   - 模糊半径：`blur(12px)` → `blur(24px)`
   - 增加顶部高光线条、底部阴影

2. **四层次深度架构**：
   - 背景层：冷色调环境光粒子 + 煞气粒子
   - 氛围层：600px 大型光脉冲 + 中层光晕
   - 容器层：双层边框（外细内粗）+ 高级玻璃卡片
   - 前景层：标题发光、流光分隔线、按钮倒影

3. **微动画系统**：
   - **入场动画**：卡片→标题→步骤→文字→按钮，依次淡入
   - **流光分隔线**：左右双向流动的金色光线
   - **光脉冲**：中心区域呼吸式光晕（4s周期）
   - **按钮光晕**：呼吸效果（2s周期）
   - **按钮倒影**：底部脉冲式倒影
   - **悬停反馈**：图标放大+光晕+标签上浮

4. **精致排版细节**：
   - 标题装饰线：方块+渐变线组合
   - 字间距优化：`tracking-[0.12em]`
   - 底部装饰：像素点+渐变线
   - 按钮内高光线条

5. **色彩深度**：
   - 添加冷色调环境光（蓝灰色）与暖金形成对比
   - 背景色：`#0E1116` → `#0A0C10`（更深邃）
   - 环境光粒子：10s 呼吸周期

### 文件变更
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx` - 完全重构 v2.0
- `src/frontend/feng-shui-8-bit/src/client/index.css` - 添加高级动画系统

---

## [2026-02-23] GameStartPage UI 设计升级（精致质感版）

### 变更内容

**设计理念升级**：
- 从"极简但平庸"升级到"精致有质感"
- 完全沿用 Splash 页面设计语言，保持全站视觉统一
- 保留用户喜爱的三步骤图标（寻煞气、化煞气、转暖色）

**视觉语言实现**：

1. **三层边框体系**：
   - 外层：`-inset-4` 径向渐变金色光晕
   - 中层：`1px` 淡金边 + `2px` 浓金边
   - 内层：`3px` 主边框 `rgba(196, 160, 106, 0.4)`

2. **极致毛玻璃**：
   - 透明度降至 `0.08-0.12`（几乎全透）
   - `blur(12px) saturate(1.3)` 营造深邃质感
   - 内发光 `inset 0 0 60px rgba(196, 160, 106, 0.04)`

3. **文字立体层次**：
   - 标题双层阴影：黑色投影 `2px 2px 0px rgba(0,0,0,0.8)` + 金色外发光 `0 0 30px rgba(240,217,156,0.5)`
   - 英文副标题增加国际感 `8-BIT FENG SHUI MASTER`

4. **像素分隔线**：
   - 小-大-小方块排列，与 Splash 页统一
   - 深绿线条 + 金色方块点缀

5. **3D 金色按钮**：
   - 渐变底色 `linear-gradient(180deg, #D4B07A 0%, #B8904F 100%)`
   - 内外阴影 + 底部厚度模拟 `0 4px 0px #5C4020`
   - 外发光 `0 0 24px rgba(196, 160, 106, 0.25)`

6. **三步骤图标融合**：
   - 透明底 + 金色边框 + 内发光
   - 当前步骤高亮（50% 边框 + 发光）
   - 未激活步骤弱化（20% 边框 + 40% 透明度）

### 文件变更
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx` - 完全重构

---

## [2026-02-23] UI 视觉总方案 v2.0 实现（通关转暖仪式 + 冷暖对比交互）

### 变更内容

**核心功能实现**：

1. **通关转暖仪式**：
   - 最后一个煞气净化后触发 700ms 冷暖图交叉渐变动画
   - 罗盘淡出隐藏（300ms 动画）
   - 通关弹窗与渐变动画同步显示
   - 弹窗可点击外部区域关闭

2. **冷暖对比交互**：
   - 通关后按住屏幕/鼠标显示冷图，松开恢复暖图
   - Mobile: `pointerdown`/`pointerup` 触发
   - Desktop: `mousedown`/`mouseup` + Space 键触发
   - 失焦/切 tab 时自动恢复暖图（异常边界处理）

3. **关卡通关记忆**：
   - 使用 `localStorage` 存储已通关关卡 ID 列表
   - 再次进入已通关关卡直接显示暖图、罗盘隐藏
   - 新增 `useLevelCompletion` Hook

4. **重玩功能**：
   - 通关弹窗新增"重玩"按钮
   - 点击重玩后清除通关记录，重置为冷图+罗盘探测模式

5. **游戏状态机**：
   - 新增 `GameStateMachine` 类型：`scanning` | `event_modal` | `resolving` | `transitioning` | `completed` | `comparing`
   - 状态迁移逻辑完善，支持异常边界处理

**视觉语言统一**：

1. **色彩系统**：
   - 新增完整的色彩变量：`--color-feng-bg-0/1/2/3`、`--color-feng-text-0/1/2/3`、`--color-feng-accent-0/1/2`
   - 语义状态色：`--color-feng-success`（已净化）、`--color-feng-error`（错误反馈）
   - 统一暖金强调色系，禁止多色主题漂移

2. **玻璃材质工具类**：
   - `.feng-glass` - 标准玻璃卡片
   - `.feng-glass-light` - 轻量玻璃（背景层）
   - `.feng-btn` - 像素风格按钮
   - `.feng-border-pixel` - 像素边框装饰

### 文件变更
- `src/frontend/feng-shui-8-bit/src/client/types/game.ts` - 新增状态机类型
- `src/frontend/feng-shui-8-bit/src/client/stores/GameContext.tsx` - 状态机逻辑
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx` - 通关交互
- `src/frontend/feng-shui-8-bit/src/client/pages/LevelSelectPage.tsx` - 通关状态传递
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx` - 渐变动画 + 罗盘淡出
- `src/frontend/feng-shui-8-bit/src/client/hooks/useLevelCompletion.ts` - 通关记忆 Hook
- `src/frontend/feng-shui-8-bit/src/client/components/game/EventModal.tsx` - 修复 lint 警告
- `src/frontend/feng-shui-8-bit/src/client/index.css` - 视觉语言统一

---

## [2026-02-22] UI 视觉总方案 v2.0 定稿（唯一执行标准）

### 变更内容
- 新增 `docs/design/ui/fengshui-ui-visual-masterplan-v2.0.md`，定义全局唯一 UI 视觉语言与交互标准，明确“简约但高级”的主设计方向。
- 收敛色彩、字体、材质、圆角、边框、动效节奏为统一参数，禁止多色主题漂移，统一为低饱和底色 + 单一暖金强调体系。
- 新增完整“通关转暖仪式”规范：三段式时序（聚气→净化→收束），明确在全部煞气净化后先执行简洁动效，再切换暖图并移除罗盘/煞气交互元素。
- 新增“按住查看冷图、松开恢复暖图”的冷暖对比交互规范，覆盖 Mobile/Desktop 触发规则、状态机迁移、输入优先级与异常处理。
- 提供与现有 React + Pixi 架构的一对一实现映射、质量门槛与验收清单，作为后续 UI 改造唯一依据。

### 影响范围
- `docs/design/ui/fengshui-ui-visual-masterplan-v2.0.md`
- `CHANGELOG.md`

---

## [2026-02-22] Level 1 资源更新 + 游戏交互优化

### 变更内容

**Level 1 资源更新**：
- 使用最新的 `resources/images/level1/` 图片资源
- 更新煞点数据为 1 个煞气点（横梁压顶），与 `hotspots.json` 保持一致
- 简化为入门教程关，预计时间 2-3 分钟

**游戏交互优化**：
1. **移除道具图片放置**：选择正确答案后不再将道具图片摆放到场景中
2. **移除小黑球提示**：去掉关卡中的煞气精灵（小黑球）显示，玩家需通过罗盘自行探索
3. **记住用户选择**：弹窗再次弹出时自动恢复上次选择的选项，方便重试
4. **移除正确标记**：选项按钮不再显示选中状态样式，选择正确后无反馈提示

### 影响范围
- `src/frontend/feng-shui-8-bit/public/images/level1/room-cold.png` - 新图片
- `src/frontend/feng-shui-8-bit/public/images/level1/room-warm.png` - 新图片
- `src/frontend/feng-shui-8-bit/src/client/data/levels.ts` - 更新煞点数据
- `src/frontend/feng-shui-8-bit/src/client/stores/GameContext.tsx` - 移除道具放置
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx` - 移除小黑球
- `src/frontend/feng-shui-8-bit/src/client/components/game/EventModal.tsx` - 记住选择 + 移除标记

---

## [2026-02-22] 关卡图片标记去除

### 变更内容

**问题**：部分关卡图片上有 AI 生成时意外留下的标记（字母 A/B/C/D/E，以及 "CRITICAL: MIRROR SHA" 等英文单词）。

**解决方案**：使用 Nano Banana Pro (gemini-3-pro-image-preview) 的 image-to-image 能力去除标记，保持房间结构和像素风格不变。

**处理的图片**：

| 关卡 | 图片 | 状态 |
|-----|------|-----|
| Level 4 | room-cold.png, room-warm.png | ✅ |
| Level 6 | room-cold.png, room-warm.png | ✅ |
| Level 12 | room-cold.png, room-warm.png | ✅ |
| Level 15 | room-cold.png | ✅ |
| Level 17 | room-cold.png | ✅ |
| Level 18 | room-cold.png, room-warm.png | ✅ |
| Level 19 | room-cold.png, room-warm.png | ✅ |
| Level 20 | room-cold.png | ✅ |

**工具**：`tools/img-gen/src/remove-labels.ts`

### 影响范围
- `resources/images/level4/room-cold.png`
- `resources/images/level4/room-warm.png`
- `resources/images/level6/room-cold.png`
- `resources/images/level6/room-warm.png`
- `resources/images/level12/room-cold.png`
- `resources/images/level12/room-warm.png`
- `resources/images/level15/room-cold.png`
- `resources/images/level17/room-cold.png`
- `resources/images/level18/room-cold.png`
- `resources/images/level18/room-warm.png`
- `resources/images/level19/room-cold.png`
- `resources/images/level19/room-warm.png`
- `resources/images/level20/room-cold.png`

---

## [2026-02-22] 关卡风水问题全面修复（暖色图煞气解决）

### 变更内容

**修复范围**：根据 `docs/design/fix/level-fengshui-issues-v1.0.md` 方案，修复所有问题关卡的暖色图，确保每个煞气都有对应的解决方案。

**修复关卡清单**：

| 关卡 | 问题 | 修复方案 | 状态 |
|-----|------|---------|------|
| Level 3 | 尖角煞描述不够精确 | 更新提示词，明确绿植位置 | ✅ |
| Level 4 | 味煞（猫砂盆）未遮挡 | 添加门帘遮挡猫砂盆区域 | ✅ |
| Level 7 | 镜子未遮挡、hotspots.json 不准确 | 镜子用布帘完全遮挡 + 重新分析 | ✅ |
| Level 11 | 灶台外露未解决 | 屏风完全遮挡灶台视线 | ✅ |
| Level 13 | 葫芦位置不对、门冲未解决、财位有杂物 | 精确位置描述 + 财位清理 | ✅ |
| Level 15 | 5 个煞气需要明确解决方案 | 葫芦+绿植+盐灯+门帘+窗帘 | ✅ |
| Level 16 | 5 个煞气需要明确解决方案 | 金蟾+盐灯+绿植+窗帘+门帘 | ✅ |
| Level 17 | 镜子仍然对着床 | 布帘完全遮挡镜子 | ✅ |
| Level 18 | 5 个煞气需要验证解决 | 石敢当+山海镇+貔貅+屏风+绿植 | ✅ |
| Level 19 | 4 个煞气只解决 1 个 | 龙龟+葫芦+财位清理+门帘 | ✅ |

**提示词优化要点**：

1. **镜子遮挡专用模板**：
   ```
   - The LARGE WALL MIRROR facing the bed MUST be COMPLETELY COVERED
   - A thick DECORATIVE FABRIC CURTAIN is hung over the mirror surface
   - The mirror surface should NOT be visible at all
   ```

2. **灶台遮挡专用模板**：
   ```
   - A wooden folding SCREEN is placed BETWEEN the kitchen stove and living area
   - The screen completely blocks the direct line of sight to the stove
   ```

3. **门帘遮挡专用模板**：
   ```
   - A FABRIC CURTAIN is HUNG on the door frame
   - The curtain covers the door opening completely
   ```

**工具修复**：
- 安装 `undici` 支持 Node.js fetch 代理
- 配置全局代理 `http://127.0.0.1:7890`
- **重要**：始终使用 `gemini-3-pro-image-preview` (Nano Banana Pro) 模型生成图片，切勿更改

### 文件变更
- `docs/design/game/level3/prompts/room-warm-v1.0.md` - 优化
- `docs/design/game/level4/prompts/room-warm-v1.0.md` - 优化（添加门帘）
- `docs/design/game/level7/prompts/room-warm-v1.0.md` - 优化（镜子遮挡）
- `docs/design/game/level11/prompts/room-warm-v1.0.md` - 优化（灶台遮挡）
- `docs/design/game/level13/prompts/room-warm-v1.0.md` - 优化（精确位置）
- `docs/design/game/level15/prompts/room-warm-v1.0.md` - 优化（5 个煞气）
- `docs/design/game/level16/prompts/room-warm-v1.0.md` - 优化（5 个煞气）
- `docs/design/game/level17/prompts/room-warm-v1.0.md` - 优化（镜子遮挡）
- `docs/design/game/level18/prompts/room-warm-v1.0.md` - 优化（5 个煞气）
- `docs/design/game/level19/prompts/room-warm-v1.0.md` - 优化（4 个煞气）
- `resources/images/level3/room-warm.png` - 重新生成
- `resources/images/level4/room-warm.png` - 重新生成
- `resources/images/level7/room-warm.png` - 重新生成
- `resources/images/level7/analysis/hotspots.json` - 重新分析
- `resources/images/level11/room-warm.png` - 重新生成
- `resources/images/level13/room-warm.png` - 重新生成
- `resources/images/level15/room-warm.png` - 重新生成
- `resources/images/level16/room-warm.png` - 重新生成
- `resources/images/level17/room-warm.png` - 重新生成
- `resources/images/level18/room-warm.png` - 重新生成
- `resources/images/level19/room-warm.png` - 重新生成
- `tools/img-gen/src/gemini-client.ts` - 添加代理支持 + 更新模型名称

---

## [2026-02-22] 关卡图片重新生成（房间尺寸递进体系 + Level 3 煞气类型修正）

### 变更内容

**重新生成范围**：
- Level 3：煞气类型从 `beam_sha` 改为 `sharp_corner_sha`（尖角煞）
- Level 7-20：宽高比从 16:9 更新为递进体系

**房间尺寸递进体系验证**：

| 关卡范围 | 目标宽高比 | 实际尺寸 | 实际宽高比 | 状态 |
|---------|----------|---------|----------|-----|
| Level 1-6 | 16:9 | 1376×768 | 1.79:1 | ✅ |
| Level 7-10 | 2:1 | 1456×720 | 2.02:1 | ✅ |
| Level 11-15 | 2:1 | 1456×720 | 2.02:1 | ✅ |
| Level 16-20 | 2.5:1 | 1632×656 | 2.48:1 | ✅ |

**视觉递进效果**：
- 图片宽度从 1376px → 1456px → 1632px 递增
- 玩家可明显感受房间从小到大的视觉变化
- 煞气点越多，房间越大，观察难度越高

**新增道具提示词**（11 个）：
- `salt-lamp` - 盐灯（化解阴煞）
- `copper-gourd` - 铜葫芦（化解电线煞）
- `money-toad` - 金蟾（财位摆件）
- `lucky-cat` - 招财猫（财位摆件）
- `bagua-mirror` - 八卦镜（化解壁刀煞）
- `shan-hai-zhen` - 山海镇（化解天斩煞）
- `stone-tablet` - 石敢当（化解路冲煞）
- `pi-xiu` - 貔貅（招财瑞兽）
- `crystal-ball` - 水晶球（化解楼梯煞）

**修复**：
- Level 3 分析提示词更新为 `sharp_corner_sha`（尖角煞）
- Level 10 重新生成，宽高比从 16:9 修正为 2:1

### 文件变更
- `resources/images/level3/` - 重新生成（尖角煞场景）
- `resources/images/level7-20/` - 重新生成（新宽高比）
- `resources/images/shared/items/` - 新增 9 个道具 PNG
- `docs/design/game/level1/prompts/items/` - 新增 9 个道具提示词
- `docs/design/game/level3/analysis/sha-analysis-v1.0.md` - 更新为尖角煞

---

## [2026-02-22] 修复 Mobile/Desktop 切换一次后卡死（Pixi 重建与 Canvas 清理问题）

### 变更内容
- 修复 `GameStage` 在尺寸变化时频繁销毁重建 Pixi 实例的问题：初始化改为仅在 `isMobile/coldImage/warmImage` 变化时触发，`width/height` 变化仅执行 `renderer.resize`。
- 修复 `app.destroy(true)` 误删 React 管理的 `<canvas>`：改为 `app.destroy(undefined, true)`，仅销毁 Pixi 资源，不移除 DOM 视图。
- 补齐切换模式时的事件清理：显式移除 `pointerdown/pointermove/pointerup/pointerupoutside` 与 `wheel` 监听，避免切换后残留监听叠加导致卡死。
- 减少 `GameplayPage` 的容器尺寸无效状态更新：仅当 `width/height` 实际变化时才更新 `containerSize`，降低切换过程重渲染压力。

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx`
- `CHANGELOG.md`

---

## [2026-02-22] GameStage Mobile/Desktop 切换崩溃问题修复

### 变更内容

**问题描述**：
- 在浏览器运行游戏时，从 mobile 切换到 desktop 或反向切换时程序崩溃
- 报错位置：`GameStage.tsx:452 Uncaught` + `GameStage.tsx:331 [GameStage] Cleanup`
- 整个页面卡死，必须刷新网页

**根本原因**：
- 当 `isMobile` 状态改变时，GameStage 的多个 useEffect 都要执行 cleanup
- React 不保证 cleanup 的执行顺序，导致不同 effect 之间状态不一致
- 动画 ticker 可能在 PixiJS app 被 destroy 后还在尝试运行
- 多个 useEffect 之间对 `appRef.current` 的访问产生竞态条件

**修复方案**：

1. **使用 key 属性强制重新挂载**（GameplayPage.tsx）：
   ```jsx
   <GameStage key={`${currentLevel.id}-${isMobile}`} ... />
   ```
   - 当 `isMobile` 变化时，React 将 GameStage 视为全新组件
   - 旧组件的所有 useEffect cleanup 按确定顺序执行（先子后父）
   - 新组件从头开始初始化，完全避免状态复用问题

2. **加强 cleanup 逻辑**（GameStage.tsx）：
   - 在 destroy 之前先调用 `app.ticker.stop()` 停止所有动画
   - 改为 `app.destroy(true)` 完全清理资源（移除所有事件监听器和子节点）
   - 添加更详细的日志便于排查

**为什么其他页面没问题**：
- SplashPage、GameStartPage、LevelSelectPage 都是纯 React UI，没有复杂的 Canvas 状态
- 只需要 CSS 重新渲染，不需要销毁/重建 WebGL 上下文

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx` - 添加 key 属性
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx` - 加强 cleanup 逻辑

---


### 变更内容

**问题发现**：所有关卡图片尺寸相同（1376×768），无论煞气点数量。Level 1（1个煞气点）和 Level 20（7个煞气点）房间大小一样，缺少难度递进的视觉反馈。

**解决方案**：设计房间尺寸递进体系，通过图片宽高比和空间描述递进，让玩家感受到从小房间到大空间的视觉变化。

### 房间尺寸分级

| 尺寸等级 | 宽高比 | 图片尺寸 | 可视面积 | 适用关卡 |
|---------|-------|---------|---------|---------|
| **COMPACT** | 16:9 | 1376×768 | 15-30m² | Level 1-6 |
| **MEDIUM** | 2:1 | 1536×768 | 35-50m² | Level 7-10 |
| **LARGE** | 2:1 | 1600×800 | 55-80m² | Level 11-15 |
| **EXPANSIVE** | 2.5:1 | 1920×768 | 90-150m² | Level 16-20 |

### 提示词更新（v3.0 → v4.0）

**所有 40 个提示词文件已更新**：

| 文件类型 | 数量 | 变更内容 |
|---------|------|---------|
| room-cold-v1.0.md | 20 个 | 新增 ROOM SCALE + SPATIAL COMPLEXITY 维度 |
| room-warm-v1.0.md | 20 个 | 宽高比同步更新 |

**宽高比变更**：

| 关卡范围 | room-cold | room-warm | 空间描述 |
|---------|----------|----------|---------|
| Level 1-6 | 16:9（保持） | 16:9（保持） | 紧凑单间，所有家具近距离可见 |
| Level 7-10 | 16:9 → **2:1** | 16:9 → **2:1** | 明显分区，需要扫视更多区域 |
| Level 11-15 | 16:9 → **2:1** | 16:9 → **2:1** | 多功能区域，煞气点分布在不同区域 |
| Level 16-20 | 16:9 → **2.5:1** | 16:9 → **2.5:1** | 超大空间，多楼层/多区域/外部煞气 |

### 视觉递进效果

- 图片宽度从 1376px 增加到 1920px（增加 40%）
- 玩家将明显感受到房间从小到大的变化
- 煞气点越多，房间越大，观察难度越高

### 文件变更

- `docs/design/game/level1-20/prompts/room-cold-v1.0.md` - 20 个文件全部升级为 v4.0
- `docs/design/game/level1-20/prompts/room-warm-v1.0.md` - 20 个文件宽高比同步更新
- `docs/design/game/levels-master-plan.md` - 新增"二、房间尺寸递进体系"章节
- `tools/img-gen/src/prompts.ts` - 新增 `extractAspectRatio()` 函数
- `tools/img-gen/src/pipeline.ts` - 从提示词文件解析宽高比
- `tools/img-gen/src/types.ts` - 添加 2:1 和 2.5:1 宽高比类型

---

## [2026-02-22] Level 1-20 关卡图片全部生成完成

### 变更内容

**使用 img-gen 工具完成所有 20 个关卡的图片资产生成**：

| 资源类型 | 数量 | 状态 |
|---------|------|------|
| 冷色底图 (room-cold.png) | 20/20 | ✅ 全部完成 |
| 暖色终图 (room-warm.png) | 20/20 | ✅ 全部完成 |
| AI 分析 (hotspots.json) | 20/20 | ✅ 全部完成 |
| 共享道具 | 5 个 | ✅ 全部完成 |
| **总文件数** | **66** | ✅ |

**生成关卡列表**：
- Level 1-3: 入门级教程关（横梁压顶、镜冲床、尖角煞）
- Level 4-6: 初级关卡（门冲、味煞、背门煞）
- Level 7-10: 中级关卡（新婚房、厨房、阁楼、老人房）
- Level 11-15: 进阶关卡（Loft、工位、办公室、儿童房、工作室）
- Level 16-20: 大师关卡（瑜伽室、复式、别墅、高管办公室、终极挑战）

**生成的道具资源**（resources/images/shared/items/）：
- `gourd.png` - 葫芦（化解横梁压顶）
- `screen.png` - 屏风（化解门冲）
- `plant-broad.png` - 阔叶绿植（化解尖角煞）
- `curtain.png` - 门帘（化解味煞/门冲）- 新增
- `dragon-turtle.png` - 龙龟（化解背门煞）- 新增

**img-gen 工具修复**：
1. **prompts.ts** - 修复分析提示词加载逻辑，支持多种格式（系统/用户分区格式和单一完整提示词格式）
2. **prompts.ts** - 修复正则表达式，支持连字符道具ID（如 `plant-broad`、`dragon-turtle`）
3. **pipeline.ts** - 修复文档更新步骤，适配 AI 返回的不同字段名（`sha_qi_points` vs `shaPoints`）
4. **新增道具提示词** - `curtain-v1.0.md` 和 `dragon-turtle-v1.0.md`

### 文件变更
- `resources/images/level1-20/` - 新增所有关卡图片和分析数据
- `resources/images/shared/items/` - 新增道具 PNG
- `docs/design/game/level1/prompts/items/curtain-v1.0.md` - 新增
- `docs/design/game/level1/prompts/items/dragon-turtle-v1.0.md` - 新增
- `tools/img-gen/src/prompts.ts` - 修复提示词解析逻辑
- `tools/img-gen/src/pipeline.ts` - 修复文档更新逻辑

---

## [2026-02-22] 所有 Level 1-20 提示词全面优化（Nano Banana Pro 最佳实践 v3.0）

### 变更内容

**核心优化目标**：
1. 应用 Nano Banana Pro 最佳实践提升生成质量
2. 冷图控制杂乱度（阴郁但不过度肮脏）
3. 暖图强调整洁度变化（风水调整后房间整洁有序）

**基于 Nano Banana Pro 官方最佳实践的优化**：

| 优化维度 | 优化前 | 优化后 | 说明 |
|---------|-------|-------|------|
| **描述方式** | 关键词堆砌 | 自然语言完整句子 | 符合模型理解方式 |
| **上下文提供** | 仅描述物体 | 添加场景情境和氛围 | 帮助模型理解意图 |
| **材质描述** | 简单命名 | 详细纹理和质感描述 | 提升视觉真实感 |
| **光线描述** | "dim lighting" | 具体的照明情境 | 更精确的氛围控制 |
| **杂乱度控制** | "messy", "cluttered" | "lived-in but energetically imbalanced" | 避免过度肮脏 |
| **整洁度要求** | 未提及 | "风水调整后整洁有序" | 新增核心要求 |

**冷图（room-cold）核心改进**：

1. **氛围优先于垃圾**：
   - 旧：`messy room with pizza boxes everywhere`
   - 新：`lived-in but energetically imbalanced - not disastrously messy, but with subtle visual cues that something feels "off"`

2. **具体化杂乱程度**：
   - 明确限制：`One or two pizza boxes (not excessive)`
   - 避免极端：强调"focused work session mess, not hoarder mess"

3. **材质和纹理细节**：
   - 添加：`deliberate, artistic dithering patterns`
   - 添加：`clean, crisp pixels and defined edges`

**暖图（room-warm）核心改进**：

1. **新增整洁度转换（关键改进）**：
   ```
   TIDINESS TRANSFORMATION (CRITICAL - NEW):
   - Floor clutter is REDUCED and ORGANIZED (not completely sterile)
   - Items that were scattered are now neatly arranged or removed
   - The room looks "recently tidied up after feng shui consultation"
   - Books stacked neatly, trash removed, surfaces wiped
   - Maintain "lived-in" feeling but with order and intention
   ```

2. **更精确的结构保持要求**：
   - 明确说明`STRUCTURAL PRESERVATION (CRITICAL)`
   - 强调`Only change: color temperature, lighting, prop additions, and surface tidiness`

3. **氛围描述对比化**：
   - 冷：`Oppressive, cold, slightly melancholic`
   - 暖：`Peaceful, warm, harmonious, welcoming`

**所有关卡优化详情**：

| 关卡 | 冷图优化重点 | 暖图新增整洁要求 |
|-----|------------|----------------|
| L1 | 开发者房间杂乱控制 | 披萨盒清理，书籍整齐摆放 |
| L2 | 猫奴卧室适度玩具 | 猫玩具收入篮子 |
| L3 | 学生宿舍考试压力氛围 | 桌面整理，地面清理 |
| L4 | 客厅猫家具布置 | 猫玩具整理，地面吸尘 |
| L5 | 游戏宅RGB氛围 | 零食包装清理，外设整理 |
| L6 | 创业公司忙碌感 | 文件归档，桌面清理 |
| L7 | 新婚夫妻磨合期氛围 | 个人物品整理 |
| L8 | 开放式厨房现代感 | 厨房台面清洁，餐具收纳 |
| L9 | 阁楼独特空间感 | 房间整理，物品归位 |
| L10 | 老人卧室简朴感 | 房间整洁舒适 |
| L11 | Loft空间能量流动 | 空间整理 |
| L12 | 工位技术感 | 线缆整理，桌面清洁 |
| L13 | 办公室团队氛围 | 办公区域整理 |
| L14 | 儿童房安全性 | 玩具整理，房间清洁 |
| L15 | 工作室创意氛围 | 画材整理 |
| L16 | 瑜伽工作室静谧感 | 空间整理清洁 |
| L17 | 复式卧室私密感 | 房间整理 |
| L18 | 别墅豪华感 | 优雅整理 |
| L19 | 高管办公室权威感 | 专业整理 |
| L20 | 终极挑战复杂度 | 完全整理和谐 |

### 文件变更
- `docs/design/game/level1-20/prompts/room-cold-v1.0.md` - 全部更新为 v3.0
- `docs/design/game/level1-20/prompts/room-warm-v1.0.md` - 全部更新为 v3.0

### 优化参考
- [Nano Banana Pro Prompting Guide](https://dev.to/googleai/nano-banana-pro-prompting-guide-strategies-1h9n)
- Google AI Studio 最佳实践文档

---

## [2026-02-22] Level 3 修改为尖角煞（与 Level 1 区分）

### 变更内容

**问题发现**：Level 1 和 Level 3 都是"横梁压顶 + 葫芦"，关卡重复

**解决方案**：将 Level 3 改为"尖角煞 + 阔叶绿植"

**修改内容**：
- 煞气类型：`beam_sha` → `sharp_corner_sha`
- 问题场景：床上方横梁 → 书桌尖角对着床
- 解法：挂葫芦 → 放阔叶绿植
- 道具：`gourd` → `plant-broad`

**教学曲线优化**：
- Level 1：横梁压顶 → 葫芦（道具使用教学）
- Level 2：镜冲床 → 旋转镜子（非道具解法）
- Level 3：尖角煞 → 阔叶绿植（新道具 + 新煞气）

### 文件变更
- `docs/design/game/level3/level-design.md` - 修改
- `docs/design/game/level3/prompts/room-cold-v1.0.md` - 修改
- `docs/design/game/level3/prompts/room-warm-v1.0.md` - 修改

---

## [2026-02-22] 所有关卡暖图提示词优化（Nano Banana Pro 最佳实践）

### 变更内容

**优化目标**：确保暖图生成时道具位置精确，体现风水专业性

**核心优化点**：

| 道具类型 | 优化前 | 优化后 | 涉及关卡 |
|---------|-------|-------|---------|
| 葫芦（横梁） | "hung on the ceiling beam" | "TIED to the ceiling beam with a red cord, hanging down FROM the beam structure itself (NOT from the wall below)" | L1, L3→, L5, L8, L10, L11, L13, L14, L15, L17, L19, L20 |
| 镜子旋转 | "rotated/angled" | "ROTATED to face AWAY from the bed, NO reflection visible" | L2, L7, L9, L14, L17, L20 |
| 屏风放置 | "placed between" | "placed perpendicular between... to completely block the direct line" | L4, L7, L8, L11, L13, L16, L18, L20 |
| 绿植放置 | "placed near" | "placed between the sharp corner and the bed, positioned to visually BLOCK" | L5, L6, L7, L8, L11, L12, L13, L14, L15, L16, L17, L18, L20 |
| 窗帘安装 | "hung on" | "HUNG on the door/window frame, fabric covers the opening" | L9, L10, L15, L16, L19, L20 |
| 盐灯放置 | "placed in corner" | "PLACED on a surface in the dark corner, emitting warm orange light" | L9, L10, L15, L16, L17, L20 |
| 龙龟放置 | "placed behind chair" | "placed on the desk surface BEHIND the chair, providing backing support" | L6, L12, L19 |
| 金蟾/貔貅放置 | "placed in wealth corner" | "placed in the wealth corner with clean space around it" | L12, L16, L18, L20 |

**Nano Banana Pro 技巧应用**：
1. 动词精确化：TIED to, WRAPPED AROUND, PLACED on, SUSPENDED from
2. 空间关系明确：FROM the beam itself, BETWEEN corner and bed
3. 视觉结果描述：hanging DOWN, emitting warm light, blocking the edge
4. 物理逻辑清晰：fabric covers, cord wrapped around

### 文件变更
- `docs/design/game/level1-20/prompts/room-warm-v1.0.md` - 全部优化

---

## [2026-02-22] Level 1 图片资产生成完成

### 变更内容

**使用 img-gen 工具生成 Level 1 全部图片资产**：
- 冷色底图 `room-cold.png`：阴郁雨夜单身公寓，横梁压床
- 暖色终图 `room-warm.png`：温馨通关态，葫芦已悬挂化解煞气
- 葫芦道具 `gourd.png`：像素风格，透明背景

**AI 分析结果**：
- 煞气点数量：1 个（横梁压顶）
- 位置：`{ x: 0.5, y: 0.2 }`
- 正确解法：在横梁两端挂葫芦化解

**设计文档更新**：
- `level-design.md` 已根据实际图片和 AI 分析结果自动更新
- 煞气点配置、道具清单、素材状态均已同步

**图片验证**：
- 冷色底图：阴郁冷色调，横梁清晰可见
- 暖色终图：温馨暖色调，结构一致，葫芦已放置
- 葫芦道具：像素风格，透明背景，适合游戏使用

### 文件变更
- `resources/images/level1/room-cold.png` - 新增
- `resources/images/level1/room-warm.png` - 新增
- `resources/images/level1/analysis/hotspots.json` - 新增
- `resources/images/shared/items/gourd.png` - 新增
- `docs/design/game/level1/level-design.md` - 更新

---

## [2026-02-22] 关卡图片生成工具 (img-gen) 创建

### 变更内容

**创建自动化图片生成工具**：
- 使用 Google Gemini API 自动生成关卡图片
- 支持断点续传，可中断后继续执行
- 串行执行，遵守 API 速率限制

**工具架构**：
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
├── PLAN.md               # 任务规划文档
└── package.json
```

**生成流程**：
1. 生成冷色底图 (text-to-image)
2. AI 分析生成 hotspots.json (多模态理解)
3. 生成道具 PNG (text-to-image)
4. 生成暖色终图 (image-to-image)
5. **更新设计文档** - 根据 hotspots.json 自动更新 level-design.md

**图文一致性**：
- 遵循"以实际图片为准"的原则
- AI 分析后自动更新关卡文案
- 煞气点位置、选项文案与图片一致

**使用方式**：
```bash
npm run gen -- --level 1        # 生成 Level 1
npm run gen -- --level 1 --resume  # 断点续传
npm run gen -- --level 1 --step room-cold  # 只生成冷色图
```

**模型配置**：
- 图片生成：`gemini-3-pro-image-preview` (Nano Banana Pro)
- 图片理解：`gemini-3-pro-preview`

### 文件变更
- `tools/img-gen/` - 新增目录和所有文件
- `CHANGELOG.md` - 更新记录

---

## [2026-02-22] Level 1 重构为单煞气点教程关

### 变更内容

**重构 Level 1 设计**：
- 煞气点从 4 个简化为 1 个（横梁压顶）
- 更新 level-design.md、prompts 文件、analysis 文件
- 更新 levels-master-plan.md 难度说明

**设计原则**：
1. 单一焦点：只有 1 个煞气点，玩家专注学习基本操作
2. 视觉明显：横梁压顶是最容易被发现的煞气类型
3. 操作简单：只需选择正确道具，不需要复杂交互
4. 即时反馈：解决后立即看到房间变暖

### 文件变更
- `docs/design/game/level1/level-design.md` - 重构
- `docs/design/game/level1/prompts/room-cold-v1.0.md` - 简化
- `docs/design/game/level1/prompts/room-warm-v1.0.md` - 简化
- `docs/design/game/level1/analysis/sha-analysis-v1.0.md` - 简化
- `docs/design/game/levels-master-plan.md` - 更新 Level 1 说明

---

## [2026-02-22] Level 7-20 提示词文件创建完成

### 变更内容

**完成所有关卡提示词文件创建**：
 创建 Level 9-10 提示词文件（6 个文件）
 创建 Level 12-15 提示词文件（12 个文件）
 创建 Level 17-20 提示词文件（12 个文件）
 创建 Level 7 analysis 文件（1 个文件）

**总计完成**：
 Prompts 文件：40 个（Level 1-20 全部完整）
 Analysis 文件：21 个（Level 1-20 全部完整）

**文件结构**：
每关包含 3 个提示词文件：
 `prompts/room-cold-v1.0.md` - 冷色底图提示词
 `prompts/room-warm-v1.0.md` - 暖色终图提示词
 `analysis/sha-analysis-v1.0.md` - AI 分析提示词

**新增道具**（Level 17-20 大师关卡）：
 `crystal-ball` - 水晶球（Level 17 楼梯下煞气）
 `shan-hai-zhen` - 山海镇（Level 18 天斩煞）
 `stone-tablet` - 石敢当（Level 18 路冲煞）
 `pi-xiu` - 貔貅（Level 18 财位）
 `bagua-mirror` - 八卦镜（Level 19 壁刀煞）
 `lucky-cat` - 招财猫（Level 13/19 财位）
 `copper-gourd` - 铜葫芦（Level 12 电线煞）

### 影响范围
 `docs/design/game/level7-20/prompts/*`
 `docs/design/game/level7-20/analysis/*`

---

## [2026-02-22] 罗盘快转区域缩小优化

### 变更内容

**问题**: 快转不弹窗的边缘区域太大（1.5 倍半径），稍微一动指针就开始快转，体验不好

**解决方案**:
- 边缘区域从 `1.5 倍半径` 缩小到 `0.8 倍半径`
- 核心区域保持 `0.4 倍半径` 不变

**分层触发机制**（更新）:
- **边缘区域**（距离 < 0.8 倍半径）：指针快速旋转，**不弹窗**
- **核心区域**（距离 < 0.4 倍半径）：指针超快旋转，**触发弹窗**
- **远离区域**：指针左右缓慢摆动（±45°）

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/utils/distance.ts`

---

## [2026-02-22] 罗盘指针动画优化：分层触发 + 转速调整

### 变更内容

**问题**: 罗盘指针在远离煞气点后没有恢复左右摇摆，且需要更好的探测反馈

**根本原因**:
1. `swingTime` 和 `rotation` 变量在 `useEffect` 内部定义，当 `compassSpeed` 变化时被重置为 0
2. Mobile 端缺少持续更新 `compassSpeed` 的逻辑

**解决方案**:
1. 新增 `swingTimeRef` 和 `rotationRef` 持久保存动画状态
2. Mobile 端新增 `onCompassSpeedChange` 回调，持续更新速度

**分层触发机制**（新增）:
- **边缘区域**（距离 < 1.5 倍阈值）：指针快速旋转，**不弹窗**
- **核心区域**（距离 < 0.4 倍阈值）：指针超快旋转，**触发弹窗**
- **远离区域**：指针左右缓慢摆动（±45°）

**转速优化**:
- `super-fast`: 0.15 → 0.25
- `fast`: 0.05 → 0.12

**动画行为**:
- `normal` 状态：指针左右缓慢摆动
- `fast` 状态：快速旋转（接近提示）
- `super-fast` 状态：超快旋转 + 弹窗（找到煞气点）

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/utils/distance.ts`

---

## [2026-02-22] Mobile 端煞气精灵位置修复

### 变更内容

**问题**: 煞气点碰撞检测位置正确了，但煞气小黑球（精灵）渲染位置仍然错误

**根本原因**:
- `createShaSprite` 函数使用 canvas 尺寸 (`width`, `height`) 计算精灵位置
- Mobile 端煞气精灵被添加到 `roomContainer` 内部，而 `roomContainer` 中的图片保持原始尺寸
- 导致精灵位置计算基准不一致

**解决方案**:
- Mobile 端：使用图片原始尺寸 (`imageDimensionsRef`) 计算精灵位置
- Web 端：继续使用 canvas 尺寸计算精灵位置

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`

---

## [2026-02-22] Mobile 端煞气点位置修复 + 罗盘指针动画优化

### 变更内容

**问题 1: Mobile 端煞气点位置不对**
- 根本原因：碰撞检测时使用 canvas 尺寸计算煞气点位置，但 Mobile 端图片保持原始尺寸
- 解决方案：
  - 新增 `imageDimensionsRef` 保存图片原始尺寸
  - 碰撞检测时使用图片尺寸而非 canvas 尺寸计算煞气点位置
  - 煞气点半径也基于图片尺寸计算

**问题 2: 罗盘指针动画**
- 原有行为：指针持续旋转，速度固定
- 新行为：
  - `normal` 状态（远离煞气点）：指针左右缓慢摆动（±45° 范围）
  - `fast/super-fast` 状态（靠近煞气点）：指针快速旋转
  - 使用 `Math.sin()` 函数实现自然的摆动效果

**代码清理**：
- 移除未使用的变量 `lastPinchDistance`

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`

---

## [2026-02-22] Mobile/Web 游戏交互分离修复

### 变更内容

**问题分析**：
 Mobile 端图片被压缩适配屏幕，无法查看全景
 Web 端错误地使用拖拽移动罗盘，应为点击移动

**Mobile 端修复**：
 房间图片保持原始尺寸（不压缩）
 初始位置居中显示
 自由拖拽（无范围限制）
 滚轮缩放支持（0.5x - 2x）
 罗盘固定在屏幕中央

**Web 端修复**：
 房间图片适配屏幕尺寸（固定）
 点击屏幕位置移动罗盘（非拖拽）
 移除图片拖拽功能

**碰撞检测优化**：
 Mobile 端碰撞检测考虑房间缩放因子（`roomScaleRef`）
 煞气点坐标基于房间容器计算

**代码修复**：
 添加 `React` 导入解决 `React.PointerEvent` 类型错误
 修复 ref 警告：在 cleanup 前复制 `triggeredShaRef.current` 值

### 影响范围
 `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`

---

## [2026-02-21] 游戏罗盘图片集成

### 变更内容

**罗盘图片替换 Graphics 绘制**：
- 加载实际像素风罗盘图片：底盘 `pan.png` + 指针 `zhen.png`
- 底盘保持静止，指针独立旋转（符合真实罗盘物理效果）
- 图片加载失败时自动降级到备用 Graphics 绘制方案

**尺寸优化**：
- 罗盘直径从 100px 调整为 70px（compassRadius: 50 → 35）
- 指针尺寸相应调整，与房间场景物件形成协调比例
- 罗盘作为风水工具，精致但不抢眼

**图片资源路径**：
- `public/images/shared/luopan/pan.png` - 罗盘底盘（八卦图）
- `public/images/shared/luopan/zhen.png` - 罗盘指针

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`
- `src/frontend/feng-shui-8-bit/public/images/shared/luopan/`

---

## [2026-02-21] Devvit 隔离窗口错误最终修复（Pointer Events）

### 变更内容

**问题分析**：
- 之前的修复只处理了 `onClick` 事件，但 Devvit 隔离窗口检测在 Pointer Events 上触发
- 错误：`isolation 窗口不能发送消息给 parent`
- 需要阻止所有 pointer 事件冒泡，而不仅仅是 click 事件

**解决方案**：
- 在所有页面的根容器上添加完整的 pointer 事件处理器：
  - `onPointerDown`
  - `onPointerUp`
  - `onPointerMove`
  - `onPointerCancel`
- 统一使用 `handleStopPropagation` 函数处理所有事件类型
- 参照 GameStage.tsx 的成功实践（canvas 上已使用 pointer 事件）

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/SplashPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/LevelSelectPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/components/game/EventModal.tsx`

---

## [2026-02-21] 所有页面 Devvit 隔离窗口错误全面修复

### 变更内容

**问题分析**：
- 所有页面点击都报错：`isolation 窗口不能发送消息给 parent`
- React 点击事件冒泡到 window 级别，触发 Devvit 隔离窗口检测机制
- SplashPage 的 `requestExpandedMode` 和 GameStartPage/LevelSelectPage 的 `navigate` 都会触发

**解决方案**：
- 在所有页面的根容器元素上添加 `onClick={handleContainerClick}`
- 调用 `e.stopPropagation()` 阻止点击事件冒泡到父窗口
- 统一修复以下文件：
  - `SplashPage.tsx`
  - `GameStartPage.tsx`
  - `LevelSelectPage.tsx`
  - `GameplayPage.tsx`
  - `EventModal.tsx`（弹窗组件）

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/pages/SplashPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/GameStartPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/LevelSelectPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/pages/GameplayPage.tsx`
- `src/frontend/feng-shui-8-bit/src/client/components/game/EventModal.tsx`

---

## [2026-02-21] GameStage Devvit 隔离窗口错误最终修复

### 变更内容

**问题分析**：
- 每次点击页面都报错：`isolation 窗口不能发送消息给 parent`
- PixiJS 的 Pointer Events 冒泡到父窗口，触发 Devvit 内部通信机制
- 之前的修复只解决了 cursor 设置问题，但事件冒泡问题仍然存在

**解决方案**：
- 在 canvas 元素上添加 React Pointer Event 处理器
- 调用 `e.stopPropagation()` 阻止事件冒泡到父窗口
- 处理的事件类型：onPointerDown、onPointerUp、onPointerMove、onPointerCancel

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`

---

## [2026-02-21] GameStage PixiJS v8 事件系统修复

### 变更内容

**问题分析**：
- 罗盘点击无反应
- 控制台报 CSP 违规错误：`data:image/png;base64` 不被允许
- PixiJS v8 弃用警告：`Container.name` 应改为 `Container.label`
- 点击罗盘触发 Devvit 隔离窗口错误：`isolation 窗口不能发送消息给 parent`

**解决方案**：
1. **事件系统修复**：
   - 将 `app.stage.eventMode = 'static'` 移到添加事件监听之前
   - 确保在 PixiJS v8 中正确启用交互事件

2. **API 更新**：
   - 将所有 `Container.name` 改为 `Container.label`（PixiJS v8 弃用 name）
   - 将所有 `getChildByName` 改为 `getChildByLabel`

3. **Devvit 隔离窗口错误修复**：
   - 移除 PixiJS 动态 `cursor` 属性设置（`grab`/`grabbing`）
   - 改用 CSS `cursor-grab active:cursor-grabbing` 控制鼠标样式
   - PixiJS 的 cursor 切换会触发 Devvit 内部通信，导致隔离错误

4. **CSP 说明**：
   - `data:image/png;base64` 错误是 PixiJS 内部检测 ImageBitmap 支持时触发
   - 该错误不影响功能，已有备用加载方案绕过

### 影响范围
- `src/frontend/feng-shui-8-bit/src/client/game/GameStage.tsx`

---

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
