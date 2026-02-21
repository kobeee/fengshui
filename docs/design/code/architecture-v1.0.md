# 前端架构设计 v1.0

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                        Devvit Platform                       │
├─────────────────────────────────────────────────────────────┤
│  splash.html (Inline)  │        game.html (Expanded)        │
│  ┌─────────────────┐   │   ┌─────────────────────────────┐  │
│  │   SplashPage    │   │   │         App Router          │  │
│  │   (Feed Card)   │   │   │  ┌───────┬───────┬───────┐  │  │
│  └─────────────────┘   │   │  │ Start │ Select│ Play  │  │  │
│                        │   │  └───────┴───────┴───────┘  │  │
│                        │   └─────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      State Layer (Context)                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  GameContext: level, shaPoints, resolvedCount, etc. │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                      Component Layer                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ RoomView │ │ Compass  │ │EventModal│ │ItemOverlay│       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                              │
│  ┌──────────────┐    ┌──────────────┐                       │
│  │  levels.ts   │    │ hotspots.json│                       │
│  │ (关卡配置)   │    │ (煞点数据)   │                       │
│  └──────────────┘    └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 核心类型定义

```typescript
// types/game.ts

/** 煞气点 */
export type ShaPoint = {
  id: string;
  type: ShaType;
  position: Position;  // 归一化坐标 0-1
  radius: number;      // 探测半径
  title: string;
  description: string;
  correctItem: string | null;
  options: ShaOption[];
  resolved: boolean;
};

/** 煞气类型 */
export type ShaType = 
  | 'mirror_sha'      // 镜冲床
  | 'beam_sha'        // 横梁压顶
  | 'door_clash'      // 门冲/穿堂煞
  | 'sharp_corner_sha'; // 尖角煞

/** 处置选项 */
export type ShaOption = {
  id: string;
  label: string;
  correct: boolean;
};

/** 位置坐标 */
export type Position = {
  x: number;
  y: number;
};

/** 关卡数据 */
export type Level = {
  id: string;
  name: string;
  description: string;
  shaCount: number;
  images: {
    cold: string;  // 冷色底图路径
    warm: string;  // 暖色终图路径
  };
  items: Record<string, string>;  // 道具 ID -> 图片路径
  shaPoints: ShaPoint[];
};

/** 游戏状态 */
export type GameState = {
  // 导航状态
  currentPage: 'start' | 'select' | 'play';
  
  // 关卡状态
  currentLevel: Level | null;
  resolvedCount: number;
  
  // 玩法状态
  compassPosition: Position;
  activeShaPoint: ShaPoint | null;
  showEventModal: boolean;
  
  // 通关状态
  isCompleted: boolean;
  showWarmImage: boolean;
};

/** 游戏动作 */
export type GameAction =
  | { type: 'NAVIGATE'; page: GameState['currentPage'] }
  | { type: 'LOAD_LEVEL'; level: Level }
  | { type: 'UPDATE_COMPASS'; position: Position }
  | { type: 'ACTIVATE_SHA'; shaPoint: ShaPoint | null }
  | { type: 'RESOLVE_SHA'; shaId: string }
  | { type: 'COMPLETE_LEVEL' }
  | { type: 'RESET_LEVEL' };
```

---

## 状态管理

### GameContext 实现

```typescript
// stores/GameContext.tsx

import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { GameState, GameAction } from '../types/game';

const initialState: GameState = {
  currentPage: 'start',
  currentLevel: null,
  resolvedCount: 0,
  compassPosition: { x: 0.5, y: 0.5 },
  activeShaPoint: null,
  showEventModal: false,
  isCompleted: false,
  showWarmImage: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, currentPage: action.page };
      
    case 'LOAD_LEVEL':
      return { 
        ...initialState, 
        currentLevel: action.level,
        currentPage: 'play',
      };
      
    case 'UPDATE_COMPASS':
      return { ...state, compassPosition: action.position };
      
    case 'ACTIVATE_SHA':
      return { 
        ...state, 
        activeShaPoint: action.shaPoint,
        showEventModal: action.shaPoint !== null,
      };
      
    case 'RESOLVE_SHA':
      if (!state.currentLevel) return state;
      const updatedPoints = state.currentLevel.shaPoints.map((sha) =>
        sha.id === action.shaId ? { ...sha, resolved: true } : sha
      );
      const newCount = state.resolvedCount + 1;
      const isComplete = newCount === state.currentLevel.shaPoints.length;
      
      return {
        ...state,
        currentLevel: { ...state.currentLevel, shaPoints: updatedPoints },
        resolvedCount: newCount,
        activeShaPoint: null,
        showEventModal: false,
        isCompleted: isComplete,
        showWarmImage: isComplete,
      };
      
    case 'COMPLETE_LEVEL':
      return { ...state, isCompleted: true, showWarmImage: true };
      
    case 'RESET_LEVEL':
      return { ...initialState, currentLevel: state.currentLevel };
      
    default:
      return state;
  }
}

export const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
```

---

## 核心组件设计

### 1. RoomView 组件

**职责**: 渲染房间图片，支持缩放平移（Mobile）

```typescript
// components/game/RoomView.tsx

type RoomViewProps = {
  coldImage: string;
  warmImage: string;
  showWarm: boolean;
  onDrag?: (delta: { x: number; y: number }) => void;
  onPinch?: (scale: number) => void;
};
```

**实现要点**:
- 使用 `background-image` 渲染房间图
- 通关时通过 CSS transition 切换冷/暖图
- Mobile 端监听 touch 事件实现拖拽和缩放

### 2. Compass 组件

**职责**: 显示罗盘，处理拖拽，计算与煞点距离

```typescript
// components/game/Compass.tsx

type CompassProps = {
  position: Position;           // 归一化位置
  isAccelerating: boolean;      // 是否在煞点范围内
  onDrag: (position: Position) => void;
};
```

**实现要点**:
- 使用 CSS `transform: rotate()` 实现旋转动画
- 接近煞点时通过 `animation-duration` 控制转速
- Web 端支持鼠标拖拽，Mobile 端作为固定中心

### 3. EventModal 组件

**职责**: 显示煞点信息和处置选项

```typescript
// components/game/EventModal.tsx

type EventModalProps = {
  shaPoint: ShaPoint;
  onSelect: (optionId: string) => void;
  onClose: () => void;
};
```

**实现要点**:
- 从底部滑入的 Modal（Mobile）/ 侧边栏（Web）
- 打字机效果显示描述文字
- 选项按钮带 hover/active 状态

### 4. ItemOverlay 组件

**职责**: 在房间图上叠加已放置的道具

```typescript
// components/game/ItemOverlay.tsx

type ItemOverlayProps = {
  items: Array<{
    id: string;
    image: string;
    position: Position;
  }>;
};
```

**实现要点**:
- 使用 `position: absolute` 定位道具
- 道具图片使用透明背景 PNG
- 出现时带轻微缩放动画

---

## 关卡数据加载

### 静态数据结构

```typescript
// data/levels.ts

import type { Level } from '../types/game';
import level1Hotspots from '../../../resources/images/level1/analysis/hotspots.json';

export const levels: Level[] = [
  {
    id: 'level-1',
    name: '开发者的地牢',
    description: '雨夜单身公寓 · 4 煞气点',
    shaCount: 4,
    images: {
      cold: '/images/level1/room-cold-v1.0.png',
      warm: '/images/level1/room-warm-v1.0.png',
    },
    items: {
      gourd: '/images/level1/items/gourd-v1.0.png',
      'plant-broad': '/images/level1/items/plant-broad-v1.0.png',
      screen: '/images/level1/items/screen-v1.0.png',
    },
    shaPoints: level1Hotspots.shaPoints.map((sha) => ({
      ...sha,
      resolved: false,
    })),
  },
  // Level 2, 3... 待添加
];
```

### 资源路径映射

Vite 会处理 `public/` 目录下的文件：

```
public/
└── images/
    └── level1/
        ├── room-cold-v1.0.png
        ├── room-warm-v1.0.png
        └── items/
            ├── gourd-v1.0.png
            ├── plant-broad-v1.0.png
            └── screen-v1.0.png
```

需要将 `resources/images/` 中的文件复制或符号链接到 `public/images/`。

---

## 煞点探测算法

```typescript
// utils/distance.ts

import type { Position, ShaPoint } from '../types/game';

/** 计算两点距离 */
export function distance(a: Position, b: Position): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/** 检测罗盘是否在煞点范围内 */
export function detectShaPoint(
  compassPos: Position,
  shaPoints: ShaPoint[],
  threshold = 0.05
): ShaPoint | null {
  // 找到最近的未解决煞点
  const unresolvedPoints = shaPoints.filter((sha) => !sha.resolved);
  
  for (const sha of unresolvedPoints) {
    const dist = distance(compassPos, sha.position);
    if (dist < sha.radius) {
      return sha;  // 在核心范围内，触发事件
    }
  }
  
  return null;
}

/** 计算罗盘旋转速度 */
export function getCompassSpeed(
  compassPos: Position,
  shaPoints: ShaPoint[]
): 'normal' | 'fast' | 'super-fast' {
  const unresolvedPoints = shaPoints.filter((sha) => !sha.resolved);
  
  for (const sha of unresolvedPoints) {
    const dist = distance(compassPos, sha.position);
    
    if (dist < sha.radius * 0.5) {
      return 'super-fast';  // 核心区域
    }
    if (dist < sha.radius * 1.5) {
      return 'fast';  // 边缘区域
    }
  }
  
  return 'normal';
}
```

---

## 响应式布局策略

### 检测设备类型

```typescript
// hooks/useResponsive.ts

import { useState, useEffect } from 'react';

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return { isMobile, isWeb: !isMobile };
}
```

### 布局差异

| 元素 | Mobile | Web |
|-----|--------|-----|
| 房间图 | 可拖拽平移、双指缩放 | 固定显示 |
| 罗盘 | 固定屏幕中央 | 可拖拽移动 |
| 事件弹窗 | 底部滑入 Modal | 右侧面板 |
| 道具栏 | 底部固定 | 侧边栏 |

---

## 动画系统

### CSS 动画定义

```css
/* 罗盘旋转 */
@keyframes compass-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.compass {
  animation: compass-spin 4s linear infinite;
}

.compass--fast {
  animation-duration: 1.5s;
}

.compass--super-fast {
  animation-duration: 0.5s;
}

/* 色板切换 */
.room--warm {
  filter: sepia(20%) saturate(1.3) hue-rotate(-10deg);
  transition: filter 1.5s ease-out;
}

/* 弹窗动画 */
.modal-enter {
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

---

## 版本记录

| 版本 | 日期 | 说明 |
|-----|------|------|
| v1.0 | 2026-02-20 | 初版架构设计 |
