import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { levels } from '../data/levels';

/** localStorage key 常量 */
const FENGSHUI_COMPLETED_LEVELS_KEY = 'fengshui_completed_levels';
const FENGSHUI_SHA_PROGRESS_KEY = 'fengshui_sha_progress';

/** 煞气点进度：{ [levelId]: resolvedShaIds[] } */
type ShaProgress = Record<string, string[]>;

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
    console.error('[LevelCompletionContext] Failed to load from localStorage:', error);
  }
  return [];
}

/** 保存已通关关卡列表到 localStorage */
function saveCompletedLevelsToStorage(levelIds: string[]): void {
  try {
    localStorage.setItem(FENGSHUI_COMPLETED_LEVELS_KEY, JSON.stringify(levelIds));
  } catch (error) {
    console.error('[LevelCompletionContext] Failed to save to localStorage:', error);
  }
}

/** 从 localStorage 读取煞气点进度 */
function loadShaProgressFromStorage(): ShaProgress {
  try {
    const stored = localStorage.getItem(FENGSHUI_SHA_PROGRESS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (error) {
    console.error('[LevelCompletionContext] Failed to load sha progress from localStorage:', error);
  }
  return {};
}

/** 保存煞气点进度到 localStorage */
function saveShaProgressToStorage(progress: ShaProgress): void {
  try {
    localStorage.setItem(FENGSHUI_SHA_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('[LevelCompletionContext] Failed to save sha progress to localStorage:', error);
  }
}

export type LevelCompletionContextValue = {
  completedLevels: string[];
  shaProgress: ShaProgress;
  isLevelCompleted: (levelId: string) => boolean;
  isLevelUnlocked: (levelId: string) => boolean;
  getCompletedCount: () => number;
  getCurrentLevel: typeof levels[number] | undefined;
  markLevelCompleted: (levelId: string) => void;
  clearLevelCompletion: (levelId: string) => void;
  clearAllCompletions: () => void;
  // 煞气点进度相关
  saveShaProgress: (levelId: string, resolvedShaIds: string[]) => void;
  getShaProgress: (levelId: string) => string[];
  clearShaProgress: (levelId: string) => void;
};

export const LevelCompletionContext = createContext<LevelCompletionContextValue | null>(null);

export function LevelCompletionProvider({ children }: { children: ReactNode }) {
  const [completedLevels, setCompletedLevels] = useState<string[]>(loadCompletedLevelsFromStorage);
  const [shaProgress, setShaProgress] = useState<ShaProgress>(loadShaProgressFromStorage);

  /** 检查关卡是否已通关 */
  const isLevelCompleted = useCallback(
    (levelId: string): boolean => {
      return completedLevels.includes(levelId);
    },
    [completedLevels]
  );

  /** 获取已通关关卡数量 */
  const getCompletedCount = useCallback((): number => {
    return completedLevels.length;
  }, [completedLevels]);

  /** 获取当前进行中的关卡（第一个未通关且已解锁的关卡） */
  const getCurrentLevel = useMemo(() => {
    // 找到第一个未通关且已解锁的关卡
    const current = levels.find((level) => {
      const levelNum = parseInt(level.id.split('-')[1] || '1');
      // Level 1 默认解锁
      if (levelNum === 1) return !completedLevels.includes(level.id);
      // 其他关卡需要前一关已通关
      const prevLevelId = `level-${levelNum - 1}`;
      return completedLevels.includes(prevLevelId) && !completedLevels.includes(level.id);
    });
    return current;
  }, [completedLevels]);

  /** 检查关卡是否已解锁 */
  const isLevelUnlocked = useCallback(
    (levelId: string): boolean => {
      const levelNum = parseInt(levelId.split('-')[1] || '1');
      // Level 1 默认解锁
      if (levelNum === 1) return true;
      // 其他关卡需要前一关已通关
      const prevLevelId = `level-${levelNum - 1}`;
      return completedLevels.includes(prevLevelId);
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
      console.error('[LevelCompletionContext] Failed to clear localStorage:', error);
    }
  }, []);

  /** 保存煞气点进度 */
  const saveShaProgress = useCallback((levelId: string, resolvedShaIds: string[]) => {
    setShaProgress((prev) => {
      const newProgress = { ...prev, [levelId]: resolvedShaIds };
      saveShaProgressToStorage(newProgress);
      return newProgress;
    });
  }, []);

  /** 获取煞气点进度 */
  const getShaProgress = useCallback(
    (levelId: string): string[] => {
      return shaProgress[levelId] || [];
    },
    [shaProgress]
  );

  /** 清除煞气点进度 */
  const clearShaProgress = useCallback((levelId: string) => {
    setShaProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[levelId];
      saveShaProgressToStorage(newProgress);
      return newProgress;
    });
  }, []);

  const value: LevelCompletionContextValue = {
    completedLevels,
    shaProgress,
    isLevelCompleted,
    isLevelUnlocked,
    getCompletedCount,
    getCurrentLevel,
    markLevelCompleted,
    clearLevelCompletion,
    clearAllCompletions,
    saveShaProgress,
    getShaProgress,
    clearShaProgress,
  };

  return (
    <LevelCompletionContext.Provider value={value}>
      {children}
    </LevelCompletionContext.Provider>
  );
}

export function useLevelCompletion() {
  const context = useContext(LevelCompletionContext);
  if (!context) {
    throw new Error('useLevelCompletion must be used within LevelCompletionProvider');
  }
  return context;
}
