import { useEffect, useState, useCallback } from 'react';

type ServiceWorkerState = {
  isRegistered: boolean;
  isUpdating: boolean;
  hasUpdate: boolean;
  error: string | null;
};

/**
 * Service Worker 注册 Hook
 * 自动注册并处理更新
 */
export function useServiceWorker(): ServiceWorkerState & { update: () => void } {
  const [state, setState] = useState<ServiceWorkerState>({
    isRegistered: false,
    isUpdating: false,
    hasUpdate: false,
    error: null,
  });

  // 注册 Service Worker
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.log('[SW] Service Worker not supported');
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('[SW] Service Worker registered:', registration.scope);
        setState((prev) => ({ ...prev, isRegistered: true }));

        // 检查更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New version available');
              setState((prev) => ({ ...prev, hasUpdate: true }));
            }
          });
        });

        // 定期检查更新（每 60 分钟）
        const intervalId = setInterval(() => {
          registration.update().catch(console.error);
        }, 60 * 60 * 1000);

        return () => clearInterval(intervalId);
      } catch (error) {
        console.error('[SW] Registration failed:', error);
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Registration failed',
        }));
      }
    };

    void registerSW();
  }, []);

  // 手动更新
  const update = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return;

    setState((prev) => ({ ...prev, isUpdating: true }));

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        // 通知等待中的 SW 激活
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    } catch (error) {
      console.error('[SW] Update failed:', error);
    }

    setState((prev) => ({ ...prev, isUpdating: false }));
  }, []);

  return { ...state, update };
}

/**
 * 预缓存指定 URL 列表
 * 用于手动触发资源预加载
 */
export async function precacheUrls(urls: string[]): Promise<void> {
  if (!('caches' in window)) {
    console.log('[Cache] Cache API not supported');
    return;
  }

  try {
    const cache = await caches.open('feng-shui-images-v1');
    
    await Promise.allSettled(
      urls.map(async (url) => {
        const cached = await cache.match(url);
        if (!cached) {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
            console.log('[Cache] Precached:', url);
          }
        }
      })
    );
  } catch (error) {
    console.error('[Cache] Precache failed:', error);
  }
}
