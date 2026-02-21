import { useCallback, useEffect, useState } from 'react';
import { trpc } from '../trpc';
import type { PlayerProgress } from '../../shared/game';

export function useProgress() {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await trpc.progress.get.query();
      setProgress(data);
    } catch (error) {
      console.error('Failed to load progress:', error);
      setProgress({
        completedLevels: [],
        currentLevelId: null,
        lastPlayedAt: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProgress = useCallback(
    async (levelId: string, completed: boolean) => {
      try {
        const result = await trpc.progress.save.mutate({
          levelId,
          completed,
        });
        if (result.success) {
          setProgress(result.progress);
        }
        return result.success;
      } catch (error) {
        console.error('Failed to save progress:', error);
        return false;
      }
    },
    []
  );

  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  return {
    progress,
    isLoading,
    loadProgress,
    saveProgress,
    isLevelCompleted: useCallback(
      (levelId: string) => {
        return progress?.completedLevels.includes(levelId) ?? false;
      },
      [progress]
    ),
  };
}
