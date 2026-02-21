/**
 * 游戏事件类型
 */
export type GameEventType = 
  | 'compass_move'
  | 'sha_detected'
  | 'sha_resolved'
  | 'level_complete';

export type GameEvent = {
  type: GameEventType;
  data: unknown;
};

/**
 * 游戏事件回调
 */
export type GameEventCallback = (event: GameEvent) => void;
