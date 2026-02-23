import { useCallback, useState } from 'react';

/** localStorage key 常量 */
const FENGSHUI_COMPLETED_LEVELS_KEY = 'fengshui_completed_levels';

/** 从 localStorage 读取已通关关卡列表 */
function loadCompletedLevelsFromStorage(): string[] {
  try {
    const stored = localStorage.getItem(FENGSHUI_COMPLETED_LEVELS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('[useLevelCompletion] Failed to load from localStorage:', error);
  }
  return [];
}

/** 保存已通关关卡列表到 localStorage */
function saveCompletedLevelsToStorage(levels: string[]): void {
  try {
    localStorage.setItem(FENGSHUI_COMPLETED_LEVELS_KEY, JSON.stringify(levels));
  } catch (error) {
    console.error('[useLevelCompletion] Failed to save to localStorage:', error);
  }
}

/**
 * 关卡通关记忆 Hook
 * 使用 localStorage 存储已通关关卡 ID 列表
 */
export function useLevelCompletion() {
  // 使用函数初始化，避免 effect 中的 setState
  const [completedLevels, setCompletedLevels] = useState<string[]>(loadCompletedLevelsFromStorage);

  /** 检查关卡是否已通关 */
  const isLevelCompleted = useCallback(
    (levelId: string): boolean => {
      return completedLevels.includes(levelId);
    },
    [completedLevels]
  );

  /** 标记关卡为已通关 */
  const markLevelCompleted = useCallback((levelId: string) => {
    setCompletedLevels((prev) => {
      if (prev.includes(levelId)) {
        return prev;
      }
      const newList = [...prev, levelId];
      saveCompletedLevelsToStorage(newList);
      return newList;
    });
  }, []);

  /** 清除关卡通关记录（用于重玩重置） */
  const clearLevelCompletion = useCallback((levelId: string) => {
    setCompletedLevels((prev) => {
      const newList = prev.filter((id) => id !== levelId);
      saveCompletedLevelsToStorage(newList);
      return newList;
    });
  }, []);

  /** 清除所有通关记录 */
  const clearAllCompletions = useCallback(() => {
    setCompletedLevels([]);
    try {
      localStorage.removeItem(FENGSHUI_COMPLETED_LEVELS_KEY);
    } catch (error) {
      console.error('[useLevelCompletion] Failed to clear localStorage:', error);
    }
  }, []);

  return {
    completedLevels,
    isLevelCompleted,
    markLevelCompleted,
    clearLevelCompletion,
    clearAllCompletions,
  };
}