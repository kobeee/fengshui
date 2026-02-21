import { useEffect, useRef, useState, useCallback } from 'react';
// 启用 unsafe-eval 支持（Reddit iframe 环境需要）- 必须在 pixi.js 其他导入之前
import 'pixi.js/unsafe-eval';
import {
  Application,
  Container,
  Assets,
  Sprite,
  Graphics,
  Text,
  TextStyle,
  Texture,
} from 'pixi.js';
import type { Position, ShaPoint, CompassSpeed } from '../types/game';
import { ParticleSystem, createVictoryParticles } from './ParticleSystem';

type GameStageProps = {
  width: number;
  height: number;
  coldImage: string;
  warmImage: string;
  showWarm: boolean;
  shaPoints: ShaPoint[];
  compassPosition: Position;
  compassSpeed: CompassSpeed;
  placedItems: Array<{
    shaId: string;
    itemId: string;
    position: Position;
  }>;
  itemImages: Record<string, string>;
  isMobile: boolean;
  isCompleted: boolean;
  onCompassMove?: ((position: Position) => void) | undefined;
};

export function GameStage({
  width,
  height,
  coldImage,
  warmImage,
  showWarm,
  shaPoints,
  compassPosition,
  compassSpeed,
  placedItems,
  itemImages,
  isMobile,
  isCompleted,
  onCompassMove,
}: GameStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const compassRef = useRef<Container | null>(null);
  const shaSpritesRef = useRef<Map<string, Container>>(new Map());
  const itemSpritesRef = useRef<Map<string, Sprite>>(new Map());
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 罗盘旋转速度
  const getRotationSpeed = useCallback((speed: CompassSpeed) => {
    switch (speed) {
      case 'super-fast':
        return 0.15;
      case 'fast':
        return 0.05;
      default:
        return 0.02;
    }
  }, []);

  // PixiJS 应用初始化 - 只在 canvas 和尺寸有效时运行
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) {
      console.log('[GameStage] Skip init: canvas=', !!canvas, 'width=', width, 'height=', height);
      return;
    }

    // 如果已经初始化，跳过
    if (appRef.current) {
      console.log('[GameStage] Already initialized, skipping');
      return;
    }

    let mounted = true;

    const initApp = async () => {
      console.log('[GameStage] Starting init with size:', width, 'x', height);
      
      try {
        // 创建 PixiJS 应用
        const app = new Application();
        
        await app.init({
          canvas,
          width,
          height,
          backgroundColor: 0x0e1116,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        });

        if (!mounted) {
          app.destroy(true);
          return;
        }

        appRef.current = app;
        console.log('[GameStage] PixiJS app initialized');

        // 创建房间容器
        const roomContainer = new Container();
        roomContainer.name = 'roomContainer';
        app.stage.addChild(roomContainer);

        // 创建罗盘
        const compass = createCompass();
        compass.name = 'compass';
        compass.eventMode = 'static';
        compass.cursor = 'grab';
        app.stage.addChild(compass);
        compassRef.current = compass;
        compass.x = width / 2;
        compass.y = height / 2;

        // 创建粒子系统
        particleSystemRef.current = createVictoryParticles(app.stage);

        // 加载图片 - 带超时处理和备用方案
        console.log('[GameStage] Loading images:', coldImage, warmImage);
        
        // 备用加载方案：使用原生 Image + Texture.from
        const loadImageFallback = (url: string): Promise<Texture> => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              try {
                const texture = Texture.from(img);
                resolve(texture);
              } catch (err) {
                reject(err);
              }
            };
            img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
            img.src = url;
          });
        };

        // 首先尝试初始化 Assets
        try {
          await Assets.init({ manifest: { bundles: [] } });
        } catch {
          // Assets 可能已经初始化，忽略错误
        }

        const loadWithTimeout = async (url: string, timeoutMs = 10000): Promise<Texture> => {
          try {
            const result = await Promise.race([
              Assets.load(url),
              new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error(`Loading ${url} timeout`)), timeoutMs)
              )
            ]);
            return result as Texture;
          } catch (err) {
            console.warn('[GameStage] Assets.load failed, trying fallback for:', url, err);
            // 如果 Assets.load 失败，使用备用方案
            return loadImageFallback(url);
          }
        };

        let coldTexture: Texture, warmTexture: Texture;
        try {
          [coldTexture, warmTexture] = await Promise.all([
            loadWithTimeout(coldImage),
            loadWithTimeout(warmImage),
          ]);
          console.log('[GameStage] Images loaded successfully');
        } catch (loadErr) {
          console.error('[GameStage] Image load failed:', loadErr);
          throw new Error(`Failed to load images: ${loadErr instanceof Error ? loadErr.message : String(loadErr)}`);
        }

        if (!mounted) return;

        // 创建房间精灵
        const coldSprite = new Sprite(coldTexture);
        coldSprite.name = 'coldRoom';
        coldSprite.width = width;
        coldSprite.height = height;
        roomContainer.addChild(coldSprite);

        const warmSprite = new Sprite(warmTexture);
        warmSprite.name = 'warmRoom';
        warmSprite.width = width;
        warmSprite.height = height;
        warmSprite.alpha = 0;
        roomContainer.addChild(warmSprite);

        console.log('[GameStage] Images loaded and sprites created');

        // 设置拖拽交互（仅 Web 端）
        if (!isMobile && onCompassMove) {
          let isDragging = false;
          const dragOffset = { x: 0, y: 0 };

          compass.on('pointerdown', (e: { globalX: number; globalY: number }) => {
            isDragging = true;
            dragOffset.x = e.globalX - compass.x;
            dragOffset.y = e.globalY - compass.y;
            compass.cursor = 'grabbing';
          });

          app.stage.eventMode = 'static';
          app.stage.on('pointermove', (e: { globalX: number; globalY: number }) => {
            if (!isDragging) return;
            
            const newX = e.globalX - dragOffset.x;
            const newY = e.globalY - dragOffset.y;
            
            const newPos: Position = {
              x: Math.max(0, Math.min(1, newX / width)),
              y: Math.max(0, Math.min(1, newY / height)),
            };
            onCompassMove(newPos);
          });

          const stopDrag = () => {
            isDragging = false;
            if (compass) compass.cursor = 'grab';
          };

          app.stage.on('pointerup', stopDrag);
          app.stage.on('pointerupoutside', stopDrag);
        }

        if (mounted) {
          setIsReady(true);
          setError(null);
          console.log('[GameStage] Init complete, isReady=true');
        }
      } catch (err) {
        console.error('[GameStage] Init failed:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize game');
        }
      }
    };

    void initApp();

    return () => {
      console.log('[GameStage] Cleanup');
      mounted = false;
      if (appRef.current) {
        try {
          appRef.current.destroy(true, { children: true });
        } catch {
          // ignore
        }
        appRef.current = null;
      }
      setIsReady(false);
      compassRef.current = null;
    };
  }, [width, height]); // 只在尺寸变化时重新初始化

  // 加载图片（当 coldImage/warmImage 变化时）
  useEffect(() => {
    const app = appRef.current;
    if (!app || !isReady) return;

    const roomContainer = app.stage.getChildByName('roomContainer') as Container;
    if (!roomContainer) return;

    void (async () => {
      try {
        // 备用加载方案
        const loadImageFallback = (url: string): Promise<Texture> => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              try {
                const texture = Texture.from(img);
                resolve(texture);
              } catch (err) {
                reject(err);
              }
            };
            img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
            img.src = url;
          });
        };

        const loadWithTimeout = async (url: string, timeoutMs = 10000): Promise<Texture> => {
          try {
            const result = await Promise.race([
              Assets.load(url),
              new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error(`Loading ${url} timeout`)), timeoutMs)
              )
            ]);
            return result as Texture;
          } catch {
            return loadImageFallback(url);
          }
        };

        const [coldTexture, warmTexture] = await Promise.all([
          loadWithTimeout(coldImage),
          loadWithTimeout(warmImage),
        ]);

        roomContainer.removeChildren();

        const coldSprite = new Sprite(coldTexture);
        coldSprite.name = 'coldRoom';
        coldSprite.width = width;
        coldSprite.height = height;
        roomContainer.addChild(coldSprite);

        const warmSprite = new Sprite(warmTexture);
        warmSprite.name = 'warmRoom';
        warmSprite.width = width;
        warmSprite.height = height;
        warmSprite.alpha = 0;
        roomContainer.addChild(warmSprite);
      } catch (err) {
        console.error('[GameStage] Failed to reload images:', err);
      }
    })();
  }, [coldImage, warmImage, width, height, isReady]);

  // 动画循环
  useEffect(() => {
    const app = appRef.current;
    if (!app || !isReady) return;

    let rotation = 0;
    let animTime = 0;

    const animate = () => {
      rotation += getRotationSpeed(compassSpeed);

      if (compassRef.current) {
        compassRef.current.rotation = rotation;
      }

      shaSpritesRef.current.forEach((sprite) => {
        animTime += 0.02;
        const baseY = (sprite as Container & { baseY?: number }).baseY ?? sprite.y;
        (sprite as Container & { baseY?: number }).baseY = baseY;
        sprite.y = baseY + Math.sin(animTime) * 3;
      });

      particleSystemRef.current?.update();
    };

    app.ticker.add(animate);

    return () => {
      app.ticker.remove(animate);
    };
  }, [isReady, compassSpeed, getRotationSpeed]);

  // 更新罗盘位置（Web 端）
  useEffect(() => {
    if (isMobile || !compassRef.current) return;
    compassRef.current.x = compassPosition.x * width;
    compassRef.current.y = compassPosition.y * height;
  }, [compassPosition, width, height, isMobile]);

  // 更新暖色图
  useEffect(() => {
    const app = appRef.current;
    if (!app || !isReady) return;

    const roomContainer = app.stage.getChildByName('roomContainer') as Container;
    if (!roomContainer) return;

    const warmRoom = roomContainer.getChildByName('warmRoom') as Sprite;
    const coldRoom = roomContainer.getChildByName('coldRoom') as Sprite;

    if (warmRoom && coldRoom) {
      warmRoom.alpha = showWarm ? 1 : 0;
      coldRoom.alpha = showWarm ? 0 : 1;
    }
  }, [showWarm, isReady]);

  // 更新煞气精灵
  useEffect(() => {
    const app = appRef.current;
    if (!app || !isReady) return;

    // 清除旧的煞气精灵
    shaSpritesRef.current.forEach((sprite) => {
      app.stage.removeChild(sprite);
    });
    shaSpritesRef.current.clear();

    // 添加新的煞气精灵
    shaPoints.forEach((sha) => {
      if (!sha.resolved) {
        const sprite = createShaSprite(sha, width, height);
        shaSpritesRef.current.set(sha.id, sprite);
        app.stage.addChild(sprite);
      }
    });
  }, [shaPoints, width, height, isReady]);

  // 添加道具
  useEffect(() => {
    const app = appRef.current;
    if (!app || !isReady) return;

    // 备用加载方案
    const loadImageFallback = (url: string): Promise<Texture> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const texture = Texture.from(img);
            resolve(texture);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    };

    const loadTexture = async (url: string): Promise<Texture> => {
      try {
        return await Assets.load(url);
      } catch {
        return loadImageFallback(url);
      }
    };

    placedItems.forEach((item) => {
      if (itemSpritesRef.current.has(item.shaId)) return;

      const imagePath = itemImages[item.itemId];
      if (!imagePath) return;

      void loadTexture(imagePath).then((texture) => {
        if (!appRef.current) return;
        const sprite = new Sprite(texture);
        sprite.x = item.position.x * width;
        sprite.y = item.position.y * height;
        sprite.anchor.set(0.5);
        sprite.scale.set(0.5);

        itemSpritesRef.current.set(item.shaId, sprite);
        appRef.current.stage.addChild(sprite);
      }).catch((err) => {
        console.error('[GameStage] Failed to load item image:', imagePath, err);
      });
    });
  }, [placedItems, itemImages, width, height, isReady]);

  // 通关粒子效果
  useEffect(() => {
    if (isCompleted && particleSystemRef.current) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          particleSystemRef.current?.emit(
            width / 2 + (Math.random() - 0.5) * 200,
            height / 2 + (Math.random() - 0.5) * 100
          );
        }, i * 200);
      }
    }
  }, [isCompleted, width, height]);

  return (
    <div className="relative h-full w-full">
      {/* 始终渲染 canvas */}
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{
          backgroundColor: '#0e1116',
        }}
      />
      
      {/* 加载状态覆盖层 */}
      {!isReady && !error && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0e1116]">
          <p className="font-pixel text-xs text-feng-text-dim animate-pulse">加载中...</p>
        </div>
      )}
      
      {/* 错误状态覆盖层 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0e1116]">
          <div className="text-center p-4">
            <p className="font-pixel text-xs text-red-400 mb-2">游戏加载失败</p>
            <p className="font-pixel text-[10px] text-gray-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 rounded bg-feng-bg-card px-3 py-1.5 font-pixel-cn text-xs text-feng-text-light"
            >
              重试
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function createCompass(): Container {
  const container = new Container();
  const radius = 40;

  const outer = new Graphics();
  outer.circle(0, 0, radius);
  outer.fill(0x202736);
  outer.stroke({ width: 3, color: 0xc4a06a });
  container.addChild(outer);

  const inner = new Graphics();
  inner.circle(0, 0, radius * 0.78);
  inner.stroke({ width: 1, color: 0xc4a06a });
  container.addChild(inner);

  const needle = new Graphics();
  needle.rect(-4, -radius * 0.65, 8, radius * 0.5);
  needle.fill(0xc4a06a);
  container.addChild(needle);

  const centerDot = new Graphics();
  centerDot.circle(0, 0, radius * 0.1);
  centerDot.fill(0xc4a06a);
  container.addChild(centerDot);

  const labelStyle = new TextStyle({
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 9,
    fill: 0xe6d4b4,
    fontWeight: '700',
  });
  const label = new Text({ text: 'LUO PAN', style: labelStyle });
  label.anchor.set(0.5, 0.5);
  label.y = radius * 0.35;
  container.addChild(label);

  return container;
}

function createShaSprite(sha: ShaPoint, width: number, height: number): Container {
  const container = new Container();
  container.x = sha.position.x * width;
  container.y = sha.position.y * height;
  container.name = sha.id;

  const size = 20;

  const body = new Graphics();
  body.circle(0, 0, size);
  body.fill(0x1a1917);
  body.stroke({ width: 2, color: 0x3a3a3a });
  container.addChild(body);

  const leftEye = new Graphics();
  leftEye.circle(-6, -4, 4);
  leftEye.fill(0xffffff);
  container.addChild(leftEye);

  const rightEye = new Graphics();
  rightEye.circle(6, -4, 4);
  rightEye.fill(0xffffff);
  container.addChild(rightEye);

  const leftPupil = new Graphics();
  leftPupil.circle(-6, -4, 2);
  leftPupil.fill(0x000000);
  container.addChild(leftPupil);

  const rightPupil = new Graphics();
  rightPupil.circle(6, -4, 2);
  rightPupil.fill(0x000000);
  container.addChild(rightPupil);

  return container;
}