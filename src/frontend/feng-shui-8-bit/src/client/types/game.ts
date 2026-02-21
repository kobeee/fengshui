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
  | { type: 'LOAD_LEVEL'; level: Level }
  | { type: 'UPDATE_COMPASS'; position: Position; speed: CompassSpeed }
  | { type: 'ACTIVATE_SHA'; shaPoint: ShaPoint | null }
  | { type: 'CLOSE_MODAL' }
  | { type: 'RESOLVE_SHA'; shaId: string; itemId: string | null }
  | { type: 'COMPLETE_LEVEL' }
  | { type: 'RESET_LEVEL' };

/** 玩家进度 */
export type PlayerProgress = {
  completedLevels: string[];
  currentLevelId: string | null;
  lastPlayedAt: number;
};
