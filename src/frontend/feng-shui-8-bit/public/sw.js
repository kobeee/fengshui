/**
 * Service Worker - 图片资源缓存
 * 
 * 策略：Cache First + Network Fallback
 * - 首次加载：从网络获取并缓存
 * - 后续加载：优先从缓存读取
 * - 缓存失效：从网络获取并更新缓存
 */

const CACHE_NAME = 'feng-shui-images-v1';
const CACHE_VERSION = 1;

// 需要缓存的资源路径模式
const CACHE_PATTERNS = [
  /\/images\/level\d+\/room-(cold|warm)\.png$/,
  /\/images\/thumbnails\/.*\.png$/,
  /\/images\/shared\/luopan\/.*\.png$/,
  /\/images\/home.*\.png$/,
];

// 最大缓存数量
const MAX_CACHE_ITEMS = 100;

// 安装事件 - 预缓存关键资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v' + CACHE_VERSION);
  
  // 预缓存首页和 Level 1 资源
  const precacheUrls = [
    '/images/home-v1.0.png',
    '/images/level1/room-cold.png',
    '/images/level1/room-warm.png',
    '/images/shared/luopan/pan.png',
    '/images/shared/luopan/zhen.png',
  ];
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        precacheUrls.map((url) =>
          fetch(url)
            .then((response) => {
              if (response.ok) {
                return cache.put(url, response);
              }
            })
            .catch(() => {
              // 预缓存失败不影响安装
            })
        )
      );
    }).then(() => {
      // @ts-expect-error - skipWaiting exists on ServiceWorkerGlobalScope
      return self.skipWaiting();
    })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v' + CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // @ts-expect-error - clients exists on ServiceWorkerGlobalScope
      return self.clients.claim();
    })
  );
});

// 请求拦截 - Cache First 策略
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // 只缓存图片资源
  if (!shouldCache(url.pathname)) {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. 尝试从缓存读取
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        console.log('[SW] Cache HIT:', url.pathname);
        return cachedResponse;
      }
      
      // 2. 从网络获取
      console.log('[SW] Cache MISS, fetching:', url.pathname);
      try {
        const networkResponse = await fetch(event.request);
        
        // 3. 缓存成功的响应
        if (networkResponse.ok) {
          // 克隆响应（因为响应只能被读取一次）
          const responseToCache = networkResponse.clone();
          cache.put(event.request, responseToCache);
          
          // 清理过期缓存
          trimCache(cache);
        }
        
        return networkResponse;
      } catch (error) {
        console.error('[SW] Fetch failed:', url.pathname, error);
        
        // 4. 网络失败时，尝试返回任何可用的缓存
        const anyCached = await cache.keys();
        if (anyCached.length > 0) {
          // 返回第一个可用的缓存（作为 fallback）
          console.log('[SW] Returning fallback cache');
          return cache.match(anyCached[0] as Request);
        }
        
        // 完全失败
        return new Response('Network error', { status: 408 });
      }
    })
  );
});

// 判断是否需要缓存
function shouldCache(pathname: string): boolean {
  return CACHE_PATTERNS.some((pattern) => pattern.test(pathname));
}

// 清理缓存，保持数量限制
async function trimCache(cache: Cache) {
  const keys = await cache.keys();
  
  if (keys.length > MAX_CACHE_ITEMS) {
    // 删除最旧的缓存（FIFO）
    const toDelete = keys.slice(0, keys.length - MAX_CACHE_ITEMS);
    await Promise.all(toDelete.map((key) => cache.delete(key)));
    console.log('[SW] Trimmed', toDelete.length, 'cached items');
  }
}

// TypeScript 类型声明
declare const self: ServiceWorkerGlobalScope;
