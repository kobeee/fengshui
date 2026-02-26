import { useEffect, useRef, useState, useCallback } from 'react';

type PreloadState = {
  loaded: number;
  total: number;
  progress: number;
  status: 'idle' | 'loading' | 'complete' | 'error';
  errors: string[];
};

type PreloadOptions = {
  concurrent?: number; // 并发加载数
  timeout?: number; // 超时时间（毫秒）
  retries?: number; // 重试次数
};

/**
 * 图片预加载 Hook
 * 支持进度追踪、并发控制、错误处理
 */
export function usePreloadImages(
  imageUrls: string[],
  options: PreloadOptions = {}
): PreloadState & { preload: () => void; retryFailed: () => void } {
  const { concurrent = 4, timeout = 15000, retries = 2 } = options;

  const [state, setState] = useState<PreloadState>({
    loaded: 0,
    total: imageUrls.length,
    progress: 0,
    status: 'idle',
    errors: [],
  });

  const retryCountRef = useRef(0);
  const abortedRef = useRef(false);

  // 加载单张图片
  const loadImage = useCallback(
    (url: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        const timer = setTimeout(() => {
          img.src = ''; // 取消加载
          resolve(false);
        }, timeout);

        img.onload = () => {
          clearTimeout(timer);
          resolve(true);
        };

        img.onerror = () => {
          clearTimeout(timer);
          resolve(false);
        };

        img.src = url;
      });
    },
    [timeout]
  );

  // 批量加载（并发控制）
  const loadBatch = useCallback(
    async (urls: string[]): Promise<{ loaded: number; errors: string[] }> => {
      const results = await Promise.all(urls.map((url) => loadImage(url)));
      const loaded = results.filter((r) => r).length;
      const errors = urls.filter((_, i) => !results[i]);
      return { loaded, errors };
    },
    [loadImage]
  );

  // 主加载函数
  const preload = useCallback(async () => {
    if (imageUrls.length === 0) {
      setState((prev) => ({ ...prev, status: 'complete', progress: 100 }));
      return;
    }

    abortedRef.current = false;
    setState((prev) => ({
      ...prev,
      status: 'loading',
      total: imageUrls.length,
      loaded: 0,
      progress: 0,
      errors: [],
    }));

    let loaded = 0;
    const errors: string[] = [];

    // 分批加载
    for (let i = 0; i < imageUrls.length; i += concurrent) {
      if (abortedRef.current) break;

      const batch = imageUrls.slice(i, i + concurrent);
      const result = await loadBatch(batch);

      loaded += result.loaded;
      errors.push(...result.errors);

      const progress = Math.round((loaded / imageUrls.length) * 100);
      setState((prev) => ({
        ...prev,
        loaded,
        progress,
        errors,
      }));
    }

    setState((prev) => ({
      ...prev,
      status: errors.length > 0 && loaded === 0 ? 'error' : 'complete',
      loaded,
      errors,
    }));
  }, [imageUrls, concurrent, loadBatch]);

  // 重试失败的图片
  const retryFailed = useCallback(async () => {
    if (state.errors.length === 0) return;

    retryCountRef.current++;
    if (retryCountRef.current > retries) {
      console.warn('重试次数已达上限');
      return;
    }

    setState((prev) => ({ ...prev, status: 'loading' }));

    const result = await loadBatch(state.errors);

    setState((prev) => ({
      ...prev,
      loaded: prev.loaded + result.loaded,
      errors: result.errors,
      status: result.errors.length > 0 ? 'error' : 'complete',
    }));
  }, [state.errors, retries, loadBatch]);

  // 清理
  useEffect(() => {
    return () => {
      abortedRef.current = true;
    };
  }, []);

  return {
    ...state,
    preload,
    retryFailed,
  };
}

/**
 * 简化版预加载 Hook
 * 自动开始加载，返回加载状态
 */
export function useAutoPreloadImages(
  imageUrls: string[],
  options?: PreloadOptions
): PreloadState {
  const { preload, ...state } = usePreloadImages(imageUrls, options);

  useEffect(() => {
    if (imageUrls.length > 0) {
      preload();
    }
  }, [imageUrls, preload]);

  return state;
}

/**
 * 获取关卡预加载图片列表
 */
export function getLevelPreloadImages(levelId: string): string[] {
  const levelNum = parseInt(levelId.split('-')[1] || '1');
  const levelDir = `level${levelNum}`;

  return [
    `/images/${levelDir}/room-cold.png`,
    `/images/${levelDir}/room-warm.png`,
  ];
}

/**
 * 获取下一关预加载图片列表
 */
export function getNextLevelPreloadImages(currentLevelId: string): string[] {
  const levelNum = parseInt(currentLevelId.split('-')[1] || '1');
  const nextLevelNum = levelNum + 1;

  if (nextLevelNum > 20) return [];

  const nextLevelDir = `level${nextLevelNum}`;
  return [
    `/images/${nextLevelDir}/room-cold.png`,
    `/images/${nextLevelDir}/room-warm.png`,
  ];
}

/**
 * 获取罗盘预加载图片列表
 */
export function getLuopanPreloadImages(): string[] {
  return [
    '/images/shared/luopan/pan.png',
    '/images/shared/luopan/zhen.png',
  ];
}

/**
 * 获取首页预加载图片列表
 */
export function getHomePreloadImages(): string[] {
  return ['/images/home-v1.0.png'];
}
