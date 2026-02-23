/**
 * 游戏核心类型定义
 */

/** 位置坐标（归一化 0-1） */
export type Position = {
  x: number;
  y: number;
};

/** 煞气类型 */
export type ShaType =
  | 'mirror_sha' // 镜冲床
  | 'beam_sha' // 横梁压顶
  | 'door_clash' // 门冲/穿堂煞
  | 'sharp_corner_sha'; // 尖角煞

/** 处置选项 */
export type ShaOption = {
  id: string;
  label: string;
  correct: boolean;
};

/** 煞气点 */
export type ShaPoint = {
  id: string;
  type: ShaType;
  position: Position;
  radius: number;
  title: string;
  description: string;
  correctItem: string | null;
  options: ShaOption[];
  resolved: boolean;
};

/** 关卡数据 */
export type Level = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  shaCount: number;
  locked: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  estimatedTime: string;
  images: {
    cold: string;
    warm: string;
  };
  items: Record<string, string>;
  shaPoints: ShaPoint[];
};

/** 页面类型 */
export type PageType = 'start' | 'select' | 'play';

/** 罗盘速度 */
export type CompassSpeed = 'normal' | 'fast' | 'super-fast';

/** 游戏状态机状态 */
export type GameStateMachine = 
  | 'scanning'       // 罗盘探测中，寻找煞气点
  | 'event_modal'    // 煞气事件弹窗显示中
  | 'resolving'      // 煞气正在被化解（选择正确选项后）
  | 'transitioning'  // 通关渐变转暖中（与弹窗同步）
  | 'completed'      // 通关完成，暖图常驻
  | 'comparing';     // 按住查看冷图中

/** 游戏状态 */
export type GameState = {
  // 导航状态
  currentPage: PageType;

  // 关卡状态
  currentLevel: Level | null;
  resolvedCount: number;

  // 玩法状态
  compassPosition: Position;
  compassSpeed: CompassSpeed;
  activeShaPoint: ShaPoint | null;
  showEventModal: boolean;

  // 通关状态
  isCompleted: boolean;
  showWarmImage: boolean;

  // 新增：游戏状态机
  gameState: GameStateMachine;
  
  // 新增：按住查看冷图
  isComparingCold: boolean;
  
  // 新增：之前已通关（再次进入直接显示暖图）
  isPreviouslyCompleted: boolean;
  
  // 新增：通关弹窗是否显示（关闭后可以继续查看冷暖对比）
  showCompletionModal: boolean;

  // 已放置的道具
  placedItems: Array<{
    shaId: string;
    itemId: string;
    position: Position;
  }>;
};

/** 游戏动作 */
export type GameAction =
  | { type: 'NAVIGATE'; page: PageType }
  | { type: 'LOAD_LEVEL'; level: Level; isPreviouslyCompleted?: boolean }
  | { type: 'UPDATE_COMPASS'; position: Position; speed: CompassSpeed }
  | { type: 'ACTIVATE_SHA'; shaPoint: ShaPoint | null }
  | { type: 'CLOSE_MODAL' }
  | { type: 'RESOLVE_SHA'; shaId: string; itemId: string | null }
  | { type: 'COMPLETE_LEVEL' }
  | { type: 'RESET_LEVEL' }
  | { type: 'SET_GAME_STATE'; gameState: GameStateMachine }
  | { type: 'SET_COMPARING'; isComparing: boolean }
  | { type: 'START_TRANSITION' }
  | { type: 'FINISH_TRANSITION' }
  | { type: 'LOAD_LEVEL_WITH_PREVIOUS'; level: Level; isPreviouslyCompleted: boolean }
  | { type: 'DISMISS_COMPLETION_MODAL' };

/** 玩家进度 */
export type PlayerProgress = {
  completedLevels: string[];
  currentLevelId: string | null;
  lastPlayedAt: number;
};
