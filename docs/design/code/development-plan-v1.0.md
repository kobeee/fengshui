# 开发计划 v1.0

## 项目概览

**八比特风水师** 是一款等轴视角像素风解谜游戏，运行在 Reddit Devvit 平台上。

### 核心玩法

```
扫描（拖罗盘）→ 发现煞点 → 选择处置 → 净化煞点 → 通关切图
```

### 双端适配

| 端 | 交互方式 |
|---|---------|
| Mobile | 罗盘固定屏幕中央，拖动房间图 + 双指缩放 |
| Web | 房间图固定，拖动罗盘探测 |

---

## 开发阶段

### Phase 1: 基础架构搭建

**目标**：搭建游戏核心框架，实现页面路由和状态管理

| 任务 | 说明 |
|-----|------|
| 1.1 项目配置 | 配置 Tailwind、字体、颜色变量 |
| 1.2 页面路由 | 实现 Splash → Game Start → Level Select → Gameplay 的导航 |
| 1.3 状态管理 | 搭建 React Context 或 Zustand 状态管理 |
| 1.4 响应式布局 | 实现 Mobile/Web 双端布局切换 |

### Phase 2: 核心玩法实现

**目标**：实现罗盘扫描 → 煞点探测 → 事件弹窗的核心循环

| 任务 | 说明 |
|-----|------|
| 2.1 房间图渲染 | 加载 Level 1 冷色底图，支持缩放平移 |
| 2.2 罗盘组件 | 实现罗盘拖拽、旋转动画、接近煞点时的加速效果 |
| 2.3 煞点探测 | 计算罗盘与煞点距离，触发事件状态 |
| 2.4 事件弹窗 | 显示煞点信息和处置选项 |
| 2.5 处置逻辑 | 选择正确选项后更新煞点状态 |
| 2.6 通关检测 | 全部煞点净化后触发通关动画 |

### Phase 3: 视觉反馈与动效

**目标**：实现色板切换、道具放置、粒子效果

| 任务 | 说明 |
|-----|------|
| 3.1 道具放置 | 正确处置后显示道具图片 |
| 3.2 色板切换 | 通关时冷色 → 暖色过渡动画 |
| 3.3 微动效 | 罗盘旋转、弹窗动画、按钮反馈 |
| 3.4 VFX 粒子 | 像素化粒子效果（灰尘、光点） |

### Phase 4: 关卡系统

**目标**：实现关卡数据和进度系统

| 任务 | 说明 |
|-----|------|
| 4.1 关卡数据结构 | 定义关卡 JSON Schema |
| 4.2 关卡加载 | 动态加载关卡资源 |
| 4.3 进度保存 | 通过 Redis 保存玩家进度 |
| 4.4 关卡选择页 | 显示关卡列表和解锁状态 |

### Phase 5: 打磨与发布

**目标**：音效、优化、测试

| 任务 | 说明 |
|-----|------|
| 5.1 音效系统 | Lofi BGM + 8-bit SFX |
| 5.2 性能优化 | 图片懒加载、动画帧率优化 |
| 5.3 错误处理 | 边界情况处理 |
| 5.4 发布准备 | 配置生产环境 |

---

## MVP 范围（最小可行产品）

首版只实现 **Level 1**，核心玩法闭环：

- [x] Splash 页面（Feed Card 入口）
- [ ] Game Start 页面（游戏介绍）
- [ ] Level Select 页面（关卡选择，仅 Level 1 可用）
- [ ] Gameplay 页面
  - [ ] 房间图渲染
  - [ ] 罗盘拖动与煞点探测
  - [ ] 事件弹窗与选项
  - [ ] 道具放置
  - [ ] 通关切图

---

## 技术决策

### 状态管理

**选择**: React Context + useReducer

**理由**:
- 游戏状态相对简单
- 避免引入额外依赖
- 与 Devvit 模板风格一致

### 动画方案

**选择**: CSS Transitions + Framer Motion（可选）

**理由**:
- 简单动画用 CSS 足够
- 复杂动画按需引入 Framer Motion

### 图片处理

**选择**: CSS Filter + Canvas（色板切换）

**理由**:
- 像素风适合 CSS filter 实现 hue-rotate
- 复杂合成可用 Canvas

---

## 目录结构规划

```
src/client/
├── components/           # UI 组件
│   ├── common/          # 通用组件
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── PixelText.tsx
│   ├── game/            # 游戏组件
│   │   ├── RoomView.tsx
│   │   ├── Compass.tsx
│   │   ├── ShaPoint.tsx
│   │   ├── EventModal.tsx
│   │   └── ItemOverlay.tsx
│   └── layout/          # 布局组件
│       ├── MobileLayout.tsx
│       └── WebLayout.tsx
├── pages/               # 页面组件
│   ├── SplashPage.tsx
│   ├── GameStartPage.tsx
│   ├── LevelSelectPage.tsx
│   └── GameplayPage.tsx
├── hooks/               # 自定义 Hooks
│   ├── useGameState.ts
│   ├── useCompass.ts
│   └── useResponsive.ts
├── stores/              # 状态管理
│   └── GameContext.tsx
├── data/                # 静态数据
│   └── levels.ts
├── types/               # 类型定义
│   └── game.ts
└── utils/               # 工具函数
    └── distance.ts
```

---

## 风险与应对

| 风险 | 应对 |
|-----|------|
| Devvit 平台限制 | 提前验证 API 能力边界 |
| 图片资源加载慢 | 使用占位图 + 懒加载 |
| 移动端性能 | 控制动画帧率，减少重绘 |
| 色板切换不自然 | 调整 CSS filter 参数，准备暖色图备用 |

---

## 版本记录

| 版本 | 日期 | 说明 |
|-----|------|------|
| v1.0 | 2026-02-20 | 初版开发计划 |
