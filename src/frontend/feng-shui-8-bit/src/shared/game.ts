/**
 * 共享的游戏类型定义
 * 在客户端和服务端共用
 */

/** 玩家进度 */
export type PlayerProgress = {
  completedLevels: string[];
  currentLevelId: string | null;
  lastPlayedAt: number;
};

/** 进度保存输入 */
export type SaveProgressInput = {
  levelId: string;
  completed: boolean;
};

/** 进度保存输出 */
export type SaveProgressOutput = {
  success: boolean;
  progress: PlayerProgress;
};
