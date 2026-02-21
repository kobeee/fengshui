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

// 罗盘图片路径
const LUOPAN_PAN_IMAGE = '/images/shared/luopan/pan.png';
const LUOPAN_ZHEN_IMAGE = '/images/shared/luopan/zhen.png';

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
  const needleRef = useRef<Sprite | null>(null);
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
        roomContainer.label = 'roomContainer';
        app.stage.addChild(roomContainer);

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

        // 加载罗盘图片
        let panTexture: Texture | null = null;
        let zhenTexture: Texture | null = null;
        try {
          [panTexture, zhenTexture] = await Promise.all([
            loadWithTimeout(LUOPAN_PAN_IMAGE, 5000),
            loadWithTimeout(LUOPAN_ZHEN_IMAGE, 5000),
          ]);
          console.log('[GameStage] Luopan images loaded successfully');
        } catch (loadErr) {
          console.warn('[GameStage] Luopan images load failed, will use fallback:', loadErr);
          // 继续执行，后续会使用备用绘制
        }

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
        coldSprite.label = 'coldRoom';
        coldSprite.width = width;
        coldSprite.height = height;
        roomContainer.addChild(coldSprite);

        const warmSprite = new Sprite(warmTexture);
        warmSprite.label = 'warmRoom';
        warmSprite.width = width;
        warmSprite.height = height;
        warmSprite.alpha = 0;
        roomContainer.addChild(warmSprite);

        console.log('[GameStage] Images loaded and sprites created');

        // 创建罗盘（使用图片或备用绘制）
        const compassResult = createLuopanCompass(panTexture, zhenTexture);
        const compass = compassResult.container;
        compass.label = 'compass';
        compass.eventMode = 'static';
        app.stage.addChild(compass);
        compassRef.current = compass;
        needleRef.current = compassResult.needle;
        compass.x = width / 2;
        compass.y = height / 2;

        // 创建粒子系统
        particleSystemRef.current = createVictoryParticles(app.stage);

        // 设置拖拽交互（仅 Web 端）
        if (!isMobile && onCompassMove) {
          let isDragging = false;
          const dragOffset = { x: 0, y: 0 };

          // 重要：必须在添加事件监听之前设置 eventMode
          app.stage.eventMode = 'static';

          compass.on('pointerdown', (e: { globalX: number; globalY: number }) => {
            isDragging = true;
            dragOffset.x = e.globalX - compass.x;
            dragOffset.y = e.globalY - compass.y;
          });

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
      needleRef.current = null;
    };
  }, [width, height]); // 只在尺寸变化时重新初始化

  // 加载图片（当 coldImage/warmImage 变化时）
  useEffect(() => {
    const app = appRef.current;
    if (!app || !isReady) return;

    const roomContainer = app.stage.getChildByLabel('roomContainer') as Container;
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
        coldSprite.label = 'coldRoom';
        coldSprite.width = width;
        coldSprite.height = height;
        roomContainer.addChild(coldSprite);

        const warmSprite = new Sprite(warmTexture);
        warmSprite.label = 'warmRoom';
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

      // 只旋转指针，不旋转整个罗盘
      if (needleRef.current) {
        needleRef.current.rotation = rotation;
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

    const roomContainer = app.stage.getChildByLabel('roomContainer') as Container;
    if (!roomContainer) return;

    const warmRoom = roomContainer.getChildByLabel('warmRoom') as Sprite;
    const coldRoom = roomContainer.getChildByLabel('coldRoom') as Sprite;

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

  // 阻止 PixiJS 事件冒泡到父窗口，避免触发 Devvit 隔离窗口通信错误
  const handlePointerEvent = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* 始终渲染 canvas */}
      <canvas
        ref={canvasRef}
        className="block h-full w-full cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: '#0e1116',
        }}
        onPointerDown={handlePointerEvent}
        onPointerUp={handlePointerEvent}
        onPointerMove={handlePointerEvent}
        onPointerCancel={handlePointerEvent}
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

/**
 * 创建像素风罗盘
 * - 底盘（pan.png）：保持静止
 * - 指针（zhen.png）：独立旋转
 */
function createLuopanCompass(
  panTexture: Texture | null,
  zhenTexture: Texture | null
): { container: Container; needle: Sprite } {
  const container = new Container();
  const compassRadius = 35; // 罗盘显示大小（调整后与场景物件协调）

  let needle: Sprite;

  if (panTexture && zhenTexture) {
    // 使用实际图片创建罗盘
    // 底盘
    const panSprite = new Sprite(panTexture);
    panSprite.anchor.set(0.5);
    panSprite.width = compassRadius * 2;
    panSprite.height = compassRadius * 2;
    container.addChild(panSprite);

    // 指针
    needle = new Sprite(zhenTexture);
    needle.anchor.set(0.5);
    // 指针尺寸：宽度约为底盘的 40%，高度约为底盘的 75%
    needle.width = compassRadius * 0.4;
    needle.height = compassRadius * 1.5;
    container.addChild(needle);
  } else {
    // 备用绘制方案（当图片加载失败时）
    const outer = new Graphics();
    outer.circle(0, 0, compassRadius);
    outer.fill(0x202736);
    outer.stroke({ width: 3, color: 0xc4a06a });
    container.addChild(outer);

    const inner = new Graphics();
    inner.circle(0, 0, compassRadius * 0.78);
    inner.stroke({ width: 1, color: 0xc4a06a });
    container.addChild(inner);

    // 备用指针（使用 Graphics 绘制）
    const needleGraphics = new Graphics();
    needleGraphics.rect(-4, -compassRadius * 0.65, 8, compassRadius * 0.5);
    needleGraphics.fill(0xc4a06a);
    container.addChild(needleGraphics);

    const centerDot = new Graphics();
    centerDot.circle(0, 0, compassRadius * 0.1);
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
    label.y = compassRadius * 0.35;
    container.addChild(label);

    // 备用方案下，needle 是一个空的 Sprite（用于兼容）
    needle = new Sprite();
    needle.label = 'needleFallback';
  }

  return { container, needle };
}

function createShaSprite(sha: ShaPoint, width: number, height: number): Container {
  const container = new Container();
  container.x = sha.position.x * width;
  container.y = sha.position.y * height;
  container.label = sha.id;

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