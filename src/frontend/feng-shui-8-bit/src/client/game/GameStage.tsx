import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  onMobileCollision?: ((shaPoint: ShaPoint) => void) | undefined;
  onCompassSpeedChange?: ((speed: CompassSpeed) => void) | undefined;
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
  onMobileCollision,
  onCompassSpeedChange,
}: GameStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const compassRef = useRef<Container | null>(null);
  const needleRef = useRef<Sprite | null>(null);
  const roomContainerRef = useRef<Container | null>(null);
  const shaSpritesRef = useRef<Map<string, Container>>(new Map());
  const itemSpritesRef = useRef<Map<string, Sprite>>(new Map());
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Mobile 端：房间偏移量和缩放
  const roomOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const roomScaleRef = useRef<number>(1);
  // 图片原始尺寸（用于 Mobile 端煞气点位置计算）
  const imageDimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  // 防止重复触发碰撞
  const triggeredShaRef = useRef<Set<string>>(new Set());
  // 动画状态 ref（持久保存，避免 compassSpeed 变化时重置）
  const swingTimeRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);
  const sizeRef = useRef<{ width: number; height: number }>({ width, height });
  const compassSpeedRef = useRef<CompassSpeed>(compassSpeed);
  const onCompassMoveRef = useRef<typeof onCompassMove>(onCompassMove);
  const onMobileCollisionRef = useRef<typeof onMobileCollision>(onMobileCollision);
  const onCompassSpeedChangeRef = useRef<typeof onCompassSpeedChange>(onCompassSpeedChange);

  useEffect(() => {
    sizeRef.current = { width, height };
  }, [width, height]);

  useEffect(() => {
    compassSpeedRef.current = compassSpeed;
  }, [compassSpeed]);

  useEffect(() => {
    onCompassMoveRef.current = onCompassMove;
  }, [onCompassMove]);

  useEffect(() => {
    onMobileCollisionRef.current = onMobileCollision;
  }, [onMobileCollision]);

  useEffect(() => {
    onCompassSpeedChangeRef.current = onCompassSpeedChange;
  }, [onCompassSpeedChange]);

  const getRotationSpeed = useCallback((speed: CompassSpeed) => {
    switch (speed) {
      case 'super-fast':
        return 0.25; // 更快的转速
      case 'fast':
        return 0.12; // 加快的转速
      default:
        return 0.02;
    }
  }, []);

  // 主初始化 useEffect - 只在关键依赖变化时重新初始化
  // 注意：compassPosition 和 onCompassMove 不应该触发重新初始化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) {
      console.log('[GameStage] Skip init: canvas=', !!canvas, 'width=', width, 'height=', height);
      return;
    }

    if (appRef.current) {
      console.log('[GameStage] Already initialized, skipping');
      return;
    }

    let mounted = true;
    const triggeredSha = triggeredShaRef.current;
    const shaSprites = shaSpritesRef.current;
    const itemSprites = itemSpritesRef.current;
    const cleanupFns: Array<() => void> = [];

    const initApp = async () => {
      console.log('[GameStage] Starting init with size:', width, 'x', height, 'isMobile:', isMobile);
      
      try {
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
          app.destroy(false);
          return;
        }

        appRef.current = app;
        console.log('[GameStage] PixiJS app initialized');

        const roomContainer = new Container();
        roomContainer.label = 'roomContainer';
        app.stage.addChild(roomContainer);
        roomContainerRef.current = roomContainer;

        console.log('[GameStage] Loading images:', coldImage, warmImage);
        
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
            return loadImageFallback(url);
          }
        };

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

        // 创建房间精灵 - Mobile 端保持原始尺寸，Web 端适配屏幕
        const coldSprite = new Sprite(coldTexture);
        coldSprite.label = 'coldRoom';
        
        const warmSprite = new Sprite(warmTexture);
        warmSprite.label = 'warmRoom';
        warmSprite.alpha = 0;

        if (isMobile) {
          // Mobile 端：保持图片原始尺寸，居中显示
          const imgWidth = coldTexture.width;
          const imgHeight = coldTexture.height;
          coldSprite.x = 0;
          coldSprite.y = 0;
          warmSprite.x = 0;
          warmSprite.y = 0;
          
          // 保存图片原始尺寸（用于煞气点位置计算）
          imageDimensionsRef.current = { width: imgWidth, height: imgHeight };
          
          // 初始位置：让图片居中（图片中心对准屏幕中心）
          roomContainer.x = (width - imgWidth) / 2;
          roomContainer.y = (height - imgHeight) / 2;
          roomOffsetRef.current = { x: roomContainer.x, y: roomContainer.y };
        } else {
          // Web 端：图片适配屏幕尺寸
          coldSprite.width = width;
          coldSprite.height = height;
          warmSprite.width = width;
          warmSprite.height = height;
          // Web 端不需要 imageDimensions，但设置一下以防万一
          imageDimensionsRef.current = { width, height };
        }

        roomContainer.addChild(coldSprite);
        roomContainer.addChild(warmSprite);

        console.log('[GameStage] Images loaded and sprites created');

        // 创建罗盘
        const compassResult = createLuopanCompass(panTexture, zhenTexture);
        const compass = compassResult.container;
        compass.label = 'compass';
        compass.eventMode = 'static';
        app.stage.addChild(compass);
        compassRef.current = compass;
        needleRef.current = compassResult.needle;
        
        // 设置罗盘初始位置
        if (isMobile) {
          compass.x = width / 2;
          compass.y = height / 2;
        } else {
          compass.x = compassPosition.x * width;
          compass.y = compassPosition.y * height;
        }

        particleSystemRef.current = createVictoryParticles(app.stage);

        app.stage.eventMode = 'static';

        // 设置交互模式（根据 isMobile）
        if (isMobile) {
          // Mobile 端：拖拽房间容器 + 双指缩放
          let isDragging = false;
          const dragStart = { x: 0, y: 0 };
          const roomStart = { x: 0, y: 0 };

          roomContainer.eventMode = 'static';

          const handleRoomPointerDown = (e: { globalX: number; globalY: number }) => {
            isDragging = true;
            dragStart.x = e.globalX;
            dragStart.y = e.globalY;
            roomStart.x = roomContainer.x;
            roomStart.y = roomContainer.y;
          };

          const handleStagePointerMove = (e: { globalX: number; globalY: number }) => {
            if (!isDragging) return;
            
            const dx = e.globalX - dragStart.x;
            const dy = e.globalY - dragStart.y;
            
            // 允许自由拖拽，没有范围限制（图片可以完全拖出屏幕）
            roomContainer.x = roomStart.x + dx;
            roomContainer.y = roomStart.y + dy;
            
            roomOffsetRef.current = { x: roomContainer.x, y: roomContainer.y };
          };

          const stopDrag = () => {
            isDragging = false;
          };

          roomContainer.on('pointerdown', handleRoomPointerDown);
          app.stage.on('pointermove', handleStagePointerMove);
          app.stage.on('pointerup', stopDrag);
          app.stage.on('pointerupoutside', stopDrag);

          // 双指缩放支持（通过 wheel 事件模拟）
          const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            const newScale = Math.max(0.5, Math.min(2, roomScaleRef.current + delta));
            roomScaleRef.current = newScale;
            roomContainer.scale.set(newScale);
          };

          canvas.addEventListener('wheel', handleWheel, { passive: false });

          cleanupFns.push(() => {
            roomContainer.off('pointerdown', handleRoomPointerDown);
            app.stage.off('pointermove', handleStagePointerMove);
            app.stage.off('pointerup', stopDrag);
            app.stage.off('pointerupoutside', stopDrag);
            canvas.removeEventListener('wheel', handleWheel);
          });

        } else {
          // Web 端：点击屏幕位置移动罗盘
          // 使用 ref 存储最新的 onCompassMove 回调，避免依赖变化触发重新初始化
          const handleStagePointerDown = (e: { globalX: number; globalY: number }) => {
            const stageWidth = sizeRef.current.width;
            const stageHeight = sizeRef.current.height;
            if (stageWidth <= 0 || stageHeight <= 0) return;
            const newPos: Position = {
              x: Math.max(0, Math.min(1, e.globalX / stageWidth)),
              y: Math.max(0, Math.min(1, e.globalY / stageHeight)),
            };
            onCompassMoveRef.current?.(newPos);
          };

          app.stage.on('pointerdown', handleStagePointerDown);

          cleanupFns.push(() => {
            app.stage.off('pointerdown', handleStagePointerDown);
          });
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
      console.log('[GameStage] Cleanup - key changed, unmounting');
      mounted = false;
      cleanupFns.forEach((fn) => {
        try {
          fn();
        } catch {
          // ignore
        }
      });
      
      const app = appRef.current;
      if (app) {
        // 先停止 ticker，确保没有动画在运行
        app.ticker.stop();
        
        try {
          // 不移除 React 管理的 canvas，仅销毁 Pixi 资源
          app.destroy(undefined, true);
        } catch {
          // ignore
        }
        appRef.current = null;
      }
      compassRef.current = null;
      needleRef.current = null;
      roomContainerRef.current = null;
      roomOffsetRef.current = { x: 0, y: 0 };
      roomScaleRef.current = 1;
      particleSystemRef.current = null;
      shaSprites.clear();
      itemSprites.clear();
      triggeredSha.clear();
    };
  // 只在真正需要重新初始化时触发
  // coldImage/warmImage: 图片资源变化
  // isMobile: 交互模式变化
  // 注意：尺寸变化走 renderer.resize，不触发整实例销毁重建
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, coldImage, warmImage]);

  // 尺寸变化时仅调整 renderer，避免频繁销毁重建 Pixi 实例
  useEffect(() => {
    const app = appRef.current;
    if (!app || !isReady || width <= 0 || height <= 0) return;

    app.renderer.resize(width, height);

    const roomContainer = roomContainerRef.current;
    if (!roomContainer) return;

    const coldRoom = roomContainer.getChildByLabel('coldRoom') as Sprite | null;
    const warmRoom = roomContainer.getChildByLabel('warmRoom') as Sprite | null;

    if (!isMobile) {
      if (coldRoom && warmRoom) {
        coldRoom.width = width;
        coldRoom.height = height;
        warmRoom.width = width;
        warmRoom.height = height;
      }
      roomContainer.x = 0;
      roomContainer.y = 0;
      roomContainer.scale.set(1);
      roomOffsetRef.current = { x: 0, y: 0 };
      roomScaleRef.current = 1;
      imageDimensionsRef.current = { width, height };
    }

    if (isMobile && compassRef.current) {
      compassRef.current.x = width / 2;
      compassRef.current.y = height / 2;
    }
  }, [width, height, isMobile, isReady]);

  // 动画循环 + Mobile 端碰撞检测
  useEffect(() => {
    const app = appRef.current;
    if (!app || !isReady) return;

    let animTime = 0;

    const animate = () => {
      // 罗盘指针动画
      if (needleRef.current) {
        const currentCompassSpeed = compassSpeedRef.current;

        if (currentCompassSpeed === 'normal') {
          // 正常状态：左右缓慢摆动
          swingTimeRef.current += 0.02;
          // 使用 sin 函数实现 -45° 到 +45° 的摆动
          needleRef.current.rotation = Math.sin(swingTimeRef.current) * (Math.PI / 4);
          // 同步 rotation 值，保证从摆动切换到旋转时角度连续
          rotationRef.current = needleRef.current.rotation;
        } else {
          // 靠近煞气点：快速旋转（从当前角度继续旋转）
          rotationRef.current += getRotationSpeed(currentCompassSpeed);
          needleRef.current.rotation = rotationRef.current;
        }
      }

      shaSpritesRef.current.forEach((sprite) => {
        animTime += 0.02;
        const baseY = (sprite as Container & { baseY?: number }).baseY ?? sprite.y;
        (sprite as Container & { baseY?: number }).baseY = baseY;
        sprite.y = baseY + Math.sin(animTime) * 3;
      });

      particleSystemRef.current?.update();

      // Mobile 端：检测罗盘与煞气点的碰撞 + 持续更新 compassSpeed
      if (isMobile && compassRef.current && roomContainerRef.current) {
        const compassX = compassRef.current.x;
        const compassY = compassRef.current.y;
        const roomOffset = roomOffsetRef.current;
        const roomScale = roomScaleRef.current;
        const imgDims = imageDimensionsRef.current;

        const compassRadius = 35;

        // 找出最近的煞气点和对应距离
        let closestDistance = Infinity;
        let newSpeed: CompassSpeed = 'normal';

        shaPoints.forEach((sha) => {
          if (sha.resolved) return;

          // 计算煞气点在 canvas 上的实际位置
          // 使用图片原始尺寸计算（sha.position 是相对于图片的比例值）
          const shaCanvasX = sha.position.x * imgDims.width * roomScale + roomOffset.x;
          const shaCanvasY = sha.position.y * imgDims.height * roomScale + roomOffset.y;

          const dx = compassX - shaCanvasX;
          const dy = compassY - shaCanvasY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // 煞气点半径也需要基于图片尺寸计算
          const shaRadius = sha.radius * Math.max(imgDims.width, imgDims.height) * roomScale;
          const collisionThreshold = compassRadius + shaRadius;

          if (dist < closestDistance) {
            closestDistance = dist;

            // 分层触发：先快转，更近才弹窗
            // 核心区域 - 超快旋转 + 弹窗
            if (dist < collisionThreshold * 0.4) {
              newSpeed = 'super-fast';
            }
            // 边缘区域 - 快速旋转（不弹窗，缩小范围避免过于敏感）
            else if (dist < collisionThreshold * 0.8) {
              newSpeed = 'fast';
            }
          }

          // 碰撞检测（触发弹窗）- 只在核心区域触发
          if (dist < collisionThreshold * 0.4) {
            if (!triggeredShaRef.current.has(sha.id)) {
              triggeredShaRef.current.add(sha.id);
              if (onMobileCollisionRef.current) {
                console.log('[GameStage] Mobile collision detected:', sha.id);
                onMobileCollisionRef.current(sha);
              }
            }
          } else {
            triggeredShaRef.current.delete(sha.id);
          }
        });

        // 持续更新 compassSpeed
        if (onCompassSpeedChangeRef.current && newSpeed !== compassSpeedRef.current) {
          onCompassSpeedChangeRef.current(newSpeed);
        }
      }
    };

    app.ticker.add(animate);

    return () => {
      // 使用 appRef.current 而非局部 app 变量
      // 因为 React cleanup 执行顺序不确定，主 useEffect 可能已将 appRef.current 设为 null
      const currentApp = appRef.current;
      if (currentApp) {
        currentApp.ticker.remove(animate);
      }
    };
  }, [isReady, getRotationSpeed, isMobile, shaPoints]);

  // 更新罗盘位置（Web 端）
  useEffect(() => {
    if (isMobile || !compassRef.current) return;
    compassRef.current.x = compassPosition.x * width;
    compassRef.current.y = compassPosition.y * height;
  }, [compassPosition, width, height, isMobile]);

  // 更新暖色图
  useEffect(() => {
    const roomContainer = roomContainerRef.current;
    if (!roomContainer || !isReady) return;

    const warmRoom = roomContainer.getChildByLabel('warmRoom') as Sprite;
    const coldRoom = roomContainer.getChildByLabel('coldRoom') as Sprite;

    if (warmRoom && coldRoom) {
      warmRoom.alpha = showWarm ? 1 : 0;
      coldRoom.alpha = showWarm ? 0 : 1;
    }
  }, [showWarm, isReady]);

  // 更新煞气精灵（Mobile 端跟随房间移动）
  useEffect(() => {
    const app = appRef.current;
    if (!app || !isReady) return;

    shaSpritesRef.current.forEach((sprite) => {
      // 从旧容器移除
      if (sprite.parent) {
        sprite.parent.removeChild(sprite);
      }
    });

    // Mobile 端：煞气点添加到房间容器内
    // Web 端：煞气点直接添加到 stage
    const container = isMobile && roomContainerRef.current ? roomContainerRef.current : app.stage;

    // Mobile 端使用图片原始尺寸，Web 端使用 canvas 尺寸
    const imgDims = imageDimensionsRef.current;
    const spriteWidth = isMobile && imgDims.width > 0 ? imgDims.width : width;
    const spriteHeight = isMobile && imgDims.height > 0 ? imgDims.height : height;

    shaPoints.forEach((sha) => {
      if (!sha.resolved) {
        const sprite = createShaSprite(sha, spriteWidth, spriteHeight);
        shaSpritesRef.current.set(sha.id, sprite);
        container.addChild(sprite);
      }
    });
  }, [shaPoints, width, height, isReady, isMobile]);

  // 添加道具（Mobile 端跟随房间移动）
  useEffect(() => {
    const app = appRef.current;
    if (!app || !isReady) return;

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

    const imgDims = imageDimensionsRef.current;
    const itemBaseWidth = isMobile && imgDims.width > 0 ? imgDims.width : width;
    const itemBaseHeight = isMobile && imgDims.height > 0 ? imgDims.height : height;
    const activeShaIds = new Set(placedItems.map((item) => item.shaId));

    itemSpritesRef.current.forEach((sprite, shaId) => {
      if (!activeShaIds.has(shaId)) {
        if (sprite.parent) {
          sprite.parent.removeChild(sprite);
        }
        sprite.destroy();
        itemSpritesRef.current.delete(shaId);
      }
    });

    placedItems.forEach((item) => {
      const existingSprite = itemSpritesRef.current.get(item.shaId);
      if (existingSprite) {
        existingSprite.x = item.position.x * itemBaseWidth;
        existingSprite.y = item.position.y * itemBaseHeight;
        return;
      }

      const imagePath = itemImages[item.itemId];
      if (!imagePath) return;

      void loadTexture(imagePath).then((texture) => {
        if (!appRef.current) return;
        const sprite = new Sprite(texture);
        sprite.x = item.position.x * itemBaseWidth;
        sprite.y = item.position.y * itemBaseHeight;
        sprite.anchor.set(0.5);
        sprite.scale.set(0.5);

        itemSpritesRef.current.set(item.shaId, sprite);
        
        // Mobile 端：道具添加到房间容器内
        const container = isMobile && roomContainerRef.current ? roomContainerRef.current : appRef.current.stage;
        container.addChild(sprite);
      }).catch((err) => {
        console.error('[GameStage] Failed to load item image:', imagePath, err);
      });
    });
  }, [placedItems, itemImages, width, height, isReady, isMobile]);

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

  const handlePointerEvent = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="relative h-full w-full">
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
      
      {!isReady && !error && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0e1116]">
          <p className="font-pixel text-xs text-feng-text-dim animate-pulse">加载中...</p>
        </div>
      )}
      
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

function createLuopanCompass(
  panTexture: Texture | null,
  zhenTexture: Texture | null
): { container: Container; needle: Sprite } {
  const container = new Container();
  const compassRadius = 35;

  let needle: Sprite;

  if (panTexture && zhenTexture) {
    const panSprite = new Sprite(panTexture);
    panSprite.anchor.set(0.5);
    panSprite.width = compassRadius * 2;
    panSprite.height = compassRadius * 2;
    container.addChild(panSprite);

    needle = new Sprite(zhenTexture);
    needle.anchor.set(0.5);
    needle.width = compassRadius * 0.4;
    needle.height = compassRadius * 1.5;
    container.addChild(needle);
  } else {
    const outer = new Graphics();
    outer.circle(0, 0, compassRadius);
    outer.fill(0x202736);
    outer.stroke({ width: 3, color: 0xc4a06a });
    container.addChild(outer);

    const inner = new Graphics();
    inner.circle(0, 0, compassRadius * 0.78);
    inner.stroke({ width: 1, color: 0xc4a06a });
    container.addChild(inner);

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
