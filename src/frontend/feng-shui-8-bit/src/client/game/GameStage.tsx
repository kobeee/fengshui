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
import type { Position, ShaPoint, CompassSpeed, GameStateMachine } from '../types/game';
import { ParticleSystem, createVictoryParticles } from './ParticleSystem';

const LUOPAN_PAN_IMAGE = '/images/shared/luopan/pan.png';
const LUOPAN_ZHEN_IMAGE = '/images/shared/luopan/zhen.png';

/** 计算安全的初始罗盘位置（避免与煞气点重叠） */
function calculateSafeInitialPosition(
  shaPoints: ShaPoint[],
  defaultPosition: Position = { x: 0.5, y: 0.5 },
  compassRadius: number = 0.05 // 归一化后的罗盘半径
): Position {
  // 检查默认位置是否安全
  const isPositionSafe = (pos: Position): boolean => {
    for (const sha of shaPoints) {
      if (sha.resolved) continue;
      const dx = pos.x - sha.position.x;
      const dy = pos.y - sha.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // 安全距离 = 煞气点半径 + 罗盘半径 + 缓冲区
      const safeDistance = sha.radius + compassRadius + 0.05;
      if (dist < safeDistance) {
        return false;
      }
    }
    return true;
  };

  // 如果默认位置安全，直接返回
  if (isPositionSafe(defaultPosition)) {
    return defaultPosition;
  }

  // 否则，尝试找一个安全的位置
  // 策略：从中心向外螺旋搜索
  const candidates: Position[] = [
    { x: 0.3, y: 0.3 }, // 左上
    { x: 0.7, y: 0.3 }, // 右上
    { x: 0.3, y: 0.7 }, // 左下
    { x: 0.7, y: 0.7 }, // 右下
    { x: 0.2, y: 0.5 }, // 左中
    { x: 0.8, y: 0.5 }, // 右中
    { x: 0.5, y: 0.2 }, // 上中
    { x: 0.5, y: 0.8 }, // 下中
    { x: 0.15, y: 0.15 }, // 角落
    { x: 0.85, y: 0.15 },
    { x: 0.15, y: 0.85 },
    { x: 0.85, y: 0.85 },
  ];

  for (const candidate of candidates) {
    if (isPositionSafe(candidate)) {
      console.log('[GameStage] Found safe initial position:', candidate);
      return candidate;
    }
  }

  // 如果所有候选位置都不安全，返回距离所有煞气点最远的位置
  let bestPosition = defaultPosition;
  let maxMinDistance = 0;

  for (const candidate of candidates) {
    let minDistance = Infinity;
    for (const sha of shaPoints) {
      if (sha.resolved) continue;
      const dx = candidate.x - sha.position.x;
      const dy = candidate.y - sha.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      minDistance = Math.min(minDistance, dist - sha.radius);
    }
    if (minDistance > maxMinDistance) {
      maxMinDistance = minDistance;
      bestPosition = candidate;
    }
  }

  console.log('[GameStage] No safe position found, using best available:', bestPosition);
  return bestPosition;
}

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
  // 新增 props
  gameState: GameStateMachine;
  isComparingCold: boolean;
  isPreviouslyCompleted: boolean;
  onCompassMove?: ((position: Position) => void) | undefined;
  onMobileCollision?: ((shaPoint: ShaPoint) => void) | undefined;
  onCompassSpeedChange?: ((speed: CompassSpeed) => void) | undefined;
  onTransitionComplete?: () => void;
  // 新增：初始化时计算的安全罗盘位置回调（Web 端使用）
  onInitialPositionCalculated?: (position: Position) => void;
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
  gameState,
  isComparingCold,
  isPreviouslyCompleted,
  onCompassMove,
  onMobileCollision,
  onCompassSpeedChange,
  onTransitionComplete,
  onInitialPositionCalculated,
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
  const targetRoomTransformRef = useRef<{ x: number; y: number; scale: number }>({ x: 0, y: 0, scale: 1 });
  const isGestureActiveRef = useRef<boolean>(false);
  // 图片原始尺寸（用于 Mobile 端煞气点位置计算）
  const imageDimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  // 防止重复触发碰撞
  const triggeredShaRef = useRef<Set<string>>(new Set());
  // 动画状态 ref（持久保存，避免 compassSpeed 变化时重置）
  const swingTimeRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);
  const sizeRef = useRef<{ width: number; height: number }>({ width, height });
  const compassPositionRef = useRef<Position>(compassPosition);
  const compassSpeedRef = useRef<CompassSpeed>(compassSpeed);
  const onCompassMoveRef = useRef<typeof onCompassMove>(onCompassMove);
  const onMobileCollisionRef = useRef<typeof onMobileCollision>(onMobileCollision);
  const onCompassSpeedChangeRef = useRef<typeof onCompassSpeedChange>(onCompassSpeedChange);
  const onTransitionCompleteRef = useRef<typeof onTransitionComplete>(onTransitionComplete);
  // 新增：转场动画状态
  const gameStateRef = useRef<GameStateMachine>(gameState);
  const isComparingColdRef = useRef<boolean>(isComparingCold);
  const transitionStartTimeRef = useRef<number | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  useEffect(() => {
    sizeRef.current = { width, height };
  }, [width, height]);

  useEffect(() => {
    compassSpeedRef.current = compassSpeed;
  }, [compassSpeed]);

  useEffect(() => {
    compassPositionRef.current = compassPosition;
  }, [compassPosition]);

  useEffect(() => {
    onCompassMoveRef.current = onCompassMove;
  }, [onCompassMove]);

  useEffect(() => {
    onMobileCollisionRef.current = onMobileCollision;
  }, [onMobileCollision]);

  useEffect(() => {
    onCompassSpeedChangeRef.current = onCompassSpeedChange;
  }, [onCompassSpeedChange]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    isComparingColdRef.current = isComparingCold;
  }, [isComparingCold]);

  useEffect(() => {
    onTransitionCompleteRef.current = onTransitionComplete;
  }, [onTransitionComplete]);

  const onInitialPositionCalculatedRef = useRef<typeof onInitialPositionCalculated>(onInitialPositionCalculated);

  useEffect(() => {
    onInitialPositionCalculatedRef.current = onInitialPositionCalculated;
  }, [onInitialPositionCalculated]);

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

        // 获取图片原始尺寸
        const imgWidth = coldTexture.width;
        const imgHeight = coldTexture.height;
        
        // 保存图片原始尺寸（用于煞气点位置计算）
        imageDimensionsRef.current = { width: imgWidth, height: imgHeight };
        
        coldSprite.x = 0;
        coldSprite.y = 0;
        warmSprite.x = 0;
        warmSprite.y = 0;

        if (isMobile) {
          // Mobile 端：保持图片原始尺寸，居中显示
          // 初始位置：让图片居中（图片中心对准屏幕中心）
          roomContainer.x = (width - imgWidth) / 2;
          roomContainer.y = (height - imgHeight) / 2;
          roomOffsetRef.current = { x: roomContainer.x, y: roomContainer.y };
          targetRoomTransformRef.current = { x: roomContainer.x, y: roomContainer.y, scale: 1 };
        } else {
          // Web 端：contain 模式，保持原始宽高比，居中显示
          const scaleX = width / imgWidth;
          const scaleY = height / imgHeight;
          const scale = Math.min(scaleX, scaleY, 1); // 不放大，最多原始尺寸
          
          roomContainer.scale.set(scale);
          
          // 居中显示
          const scaledWidth = imgWidth * scale;
          const scaledHeight = imgHeight * scale;
          roomContainer.x = (width - scaledWidth) / 2;
          roomContainer.y = (height - scaledHeight) / 2;
          
          roomOffsetRef.current = { x: roomContainer.x, y: roomContainer.y };
          roomScaleRef.current = scale;
          targetRoomTransformRef.current = { x: roomContainer.x, y: roomContainer.y, scale };
        }

        roomContainer.addChild(coldSprite);
        roomContainer.addChild(warmSprite);

        console.log('[GameStage] Images loaded and sprites created');

        // 创建罗盘
        const compassResult = createLuopanCompass(panTexture, zhenTexture);
        const compass = compassResult.container;
        compass.label = 'compass';
        compass.eventMode = isMobile ? 'none' : 'static';
        app.stage.addChild(compass);
        compassRef.current = compass;
        needleRef.current = compassResult.needle;
        
        // 设置罗盘初始位置
        if (isMobile) {
          compass.x = width / 2;
          compass.y = height / 2;
        } else {
          const target = targetRoomTransformRef.current;
          compass.x = target.x + compassPosition.x * imageDimensionsRef.current.width * target.scale;
          compass.y = target.y + compassPosition.y * imageDimensionsRef.current.height * target.scale;
        }

        particleSystemRef.current = createVictoryParticles(app.stage);

        app.stage.eventMode = isMobile ? 'none' : 'static';

        // 设置交互模式（根据 isMobile）
        if (isMobile) {
          // Mobile 端：统一使用 Pointer 事件，避免 touch/pointer 双通道冲突
          type PointerPos = { x: number; y: number };
          const activePointers = new Map<number, PointerPos>();
          let gestureMode: 'idle' | 'pan' | 'pinch' = 'idle';
          const panStartPointer = { x: 0, y: 0 };
          const panStartRoom = { x: 0, y: 0 };
          const pinchStart = {
            distance: 1,
            scale: 1,
            anchorX: 0,
            anchorY: 0,
          };
          const toLocalPointer = (e: PointerEvent): PointerPos => {
            const rect = canvas.getBoundingClientRect();
            return {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            };
          };

          const getPointers = (): PointerPos[] => Array.from(activePointers.values());

          const getPinchMetrics = (): { centerX: number; centerY: number; distance: number } | null => {
            const pointers = getPointers();
            if (pointers.length < 2) return null;
            const p0 = pointers[0];
            const p1 = pointers[1];
            if (!p0 || !p1) return null;
            const dx = p0.x - p1.x;
            const dy = p0.y - p1.y;
            return {
              centerX: (p0.x + p1.x) / 2,
              centerY: (p0.y + p1.y) / 2,
              distance: Math.max(1, Math.hypot(dx, dy)),
            };
          };

          const beginPan = (pointer: PointerPos) => {
            const { x, y } = targetRoomTransformRef.current;
            gestureMode = 'pan';
            isGestureActiveRef.current = true;
            panStartPointer.x = pointer.x;
            panStartPointer.y = pointer.y;
            panStartRoom.x = x;
            panStartRoom.y = y;
          };

          const beginPinch = () => {
            const metrics = getPinchMetrics();
            if (!metrics) return;
            const current = targetRoomTransformRef.current;
            gestureMode = 'pinch';
            isGestureActiveRef.current = true;
            pinchStart.distance = metrics.distance;
            pinchStart.scale = current.scale;
            pinchStart.anchorX = (metrics.centerX - current.x) / current.scale;
            pinchStart.anchorY = (metrics.centerY - current.y) / current.scale;
          };

          const handlePointerDown = (e: PointerEvent) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            activePointers.set(e.pointerId, toLocalPointer(e));
            try {
              canvas.setPointerCapture(e.pointerId);
            } catch {
              // ignore
            }
            if (activePointers.size >= 2) {
              beginPinch();
            } else {
              const firstPointer = getPointers()[0];
              if (firstPointer) {
                beginPan(firstPointer);
              }
            }
            e.preventDefault();
          };

          const handlePointerMove = (e: PointerEvent) => {
            if (!activePointers.has(e.pointerId)) return;
            activePointers.set(e.pointerId, toLocalPointer(e));

            if (activePointers.size >= 2) {
              if (gestureMode !== 'pinch') {
                beginPinch();
              }
              const metrics = getPinchMetrics();
              if (!metrics) return;
              const rawScale = (metrics.distance / pinchStart.distance) * pinchStart.scale;
              const nextScale = Math.max(0.5, Math.min(2, rawScale));
              const nextX = metrics.centerX - pinchStart.anchorX * nextScale;
              const nextY = metrics.centerY - pinchStart.anchorY * nextScale;
              targetRoomTransformRef.current = { x: nextX, y: nextY, scale: nextScale };
            } else if (activePointers.size === 1) {
              const pointer = getPointers()[0];
              if (!pointer) return;
              if (gestureMode !== 'pan') {
                beginPan(pointer);
              }
              const dx = pointer.x - panStartPointer.x;
              const dy = pointer.y - panStartPointer.y;
              targetRoomTransformRef.current = {
                x: panStartRoom.x + dx,
                y: panStartRoom.y + dy,
                scale: targetRoomTransformRef.current.scale,
              };
            } else {
              gestureMode = 'idle';
              isGestureActiveRef.current = false;
            }

            e.preventDefault();
          };

          const handlePointerEnd = (e: PointerEvent) => {
            activePointers.delete(e.pointerId);
            try {
              if (canvas.hasPointerCapture(e.pointerId)) {
                canvas.releasePointerCapture(e.pointerId);
              }
            } catch {
              // ignore
            }

            if (activePointers.size === 0) {
              gestureMode = 'idle';
              isGestureActiveRef.current = false;
              return;
            }

            if (activePointers.size >= 2) {
              beginPinch();
              return;
            }

            const pointer = getPointers()[0];
            if (pointer) {
              beginPan(pointer);
            }
          };

          canvas.addEventListener('pointerdown', handlePointerDown, { passive: false });
          canvas.addEventListener('pointermove', handlePointerMove, { passive: false });
          canvas.addEventListener('pointerup', handlePointerEnd);
          canvas.addEventListener('pointercancel', handlePointerEnd);
          cleanupFns.push(() => {
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('pointerup', handlePointerEnd);
            canvas.removeEventListener('pointercancel', handlePointerEnd);
            activePointers.clear();
            isGestureActiveRef.current = false;
          });
        } else {
          // Web 端：拖拽罗盘移动（支持缩放后的坐标映射）
          type MacGestureEvent = Event & {
            scale: number;
            clientX: number;
            clientY: number;
          };
          let isDraggingCompass = false;
          const dragStartOffset = { x: 0, y: 0 };
          
          const gestureStart = {
            scale: 1,
            anchorX: 0,
            anchorY: 0,
            canvasX: 0,
            canvasY: 0,
          };
          
          const toNormalizedRoomPosition = (canvasX: number, canvasY: number): Position => {
            const roomOffset = roomOffsetRef.current;
            const roomScale = roomScaleRef.current;
            const imgDims = imageDimensionsRef.current;
            const scaledWidth = imgDims.width * roomScale;
            const scaledHeight = imgDims.height * roomScale;
            if (scaledWidth <= 0 || scaledHeight <= 0) {
              return { x: 0.5, y: 0.5 };
            }
            return {
              x: Math.max(0, Math.min(1, (canvasX - roomOffset.x) / scaledWidth)),
              y: Math.max(0, Math.min(1, (canvasY - roomOffset.y) / scaledHeight)),
            };
          };

          const toCanvasPoint = (clientX: number, clientY: number): { x: number; y: number } => {
            const rect = canvas.getBoundingClientRect();
            return {
              x: clientX - rect.left,
              y: clientY - rect.top,
            };
          };

          // 罗盘拖拽开始
          const handleCompassPointerDown = (e: { globalX: number; globalY: number }) => {
            isDraggingCompass = true;
            const compass = compassRef.current;
            if (compass) {
              // 记录点击位置相对于罗盘中心的偏移
              dragStartOffset.x = e.globalX - compass.x;
              dragStartOffset.y = e.globalY - compass.y;
            }
            canvas.style.cursor = 'grabbing';
          };

          // 罗盘拖拽移动
          const handlePointerMove = (e: PointerEvent) => {
            if (!isDraggingCompass) return;
            const { x: canvasX, y: canvasY } = toCanvasPoint(e.clientX, e.clientY);
            // 计算新的罗盘位置（减去偏移量）
            const newPos = toNormalizedRoomPosition(canvasX - dragStartOffset.x, canvasY - dragStartOffset.y);
            onCompassMoveRef.current?.(newPos);
          };

          // 罗盘拖拽结束
          const handlePointerUp = () => {
            isDraggingCompass = false;
            canvas.style.cursor = 'grab';
          };

          const handleWheel = (e: WheelEvent) => {
            const { x: canvasX, y: canvasY } = toCanvasPoint(e.clientX, e.clientY);

            const current = targetRoomTransformRef.current;
            const zoomStrength = e.ctrlKey ? 0.0035 : 0.0018;
            const zoomFactor = Math.exp(-e.deltaY * zoomStrength);
            const nextScale = Math.max(0.8, Math.min(2.5, current.scale * zoomFactor));
            if (Math.abs(nextScale - current.scale) < 0.0001) return;

            const worldX = (canvasX - current.x) / current.scale;
            const worldY = (canvasY - current.y) / current.scale;
            targetRoomTransformRef.current = {
              x: canvasX - worldX * nextScale,
              y: canvasY - worldY * nextScale,
              scale: nextScale,
            };
            isGestureActiveRef.current = true;
            e.preventDefault();
          };

          const handleGestureStart = (e: Event) => {
            const ge = e as MacGestureEvent;
            const { x: canvasX, y: canvasY } = toCanvasPoint(ge.clientX, ge.clientY);
            const current = targetRoomTransformRef.current;
            gestureStart.scale = current.scale;
            gestureStart.canvasX = canvasX;
            gestureStart.canvasY = canvasY;
            gestureStart.anchorX = (canvasX - current.x) / current.scale;
            gestureStart.anchorY = (canvasY - current.y) / current.scale;
            isGestureActiveRef.current = true;
            ge.preventDefault();
          };

          const handleGestureChange = (e: Event) => {
            const ge = e as MacGestureEvent;
            const nextScale = Math.max(0.8, Math.min(2.5, gestureStart.scale * ge.scale));
            targetRoomTransformRef.current = {
              x: gestureStart.canvasX - gestureStart.anchorX * nextScale,
              y: gestureStart.canvasY - gestureStart.anchorY * nextScale,
              scale: nextScale,
            };
            isGestureActiveRef.current = true;
            ge.preventDefault();
          };

          const handleGestureEnd = (e: Event) => {
            const ge = e as MacGestureEvent;
            isGestureActiveRef.current = false;
            ge.preventDefault();
          };

          // 罗盘监听 pointerdown 开始拖拽
          compass.on('pointerdown', handleCompassPointerDown);
          // canvas 监听 pointermove 和 pointerup 处理拖拽
          canvas.addEventListener('pointermove', handlePointerMove);
          canvas.addEventListener('pointerup', handlePointerUp);
          canvas.addEventListener('pointercancel', handlePointerUp);
          canvas.addEventListener('pointerleave', handlePointerUp);
          
          canvas.addEventListener('wheel', handleWheel, { passive: false });
          canvas.addEventListener('gesturestart', handleGestureStart as EventListener, { passive: false });
          canvas.addEventListener('gesturechange', handleGestureChange as EventListener, { passive: false });
          canvas.addEventListener('gestureend', handleGestureEnd as EventListener, { passive: false });

          cleanupFns.push(() => {
            compass.off('pointerdown', handleCompassPointerDown);
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('pointerup', handlePointerUp);
            canvas.removeEventListener('pointercancel', handlePointerUp);
            canvas.removeEventListener('pointerleave', handlePointerUp);
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('gesturestart', handleGestureStart as EventListener);
            canvas.removeEventListener('gesturechange', handleGestureChange as EventListener);
            canvas.removeEventListener('gestureend', handleGestureEnd as EventListener);
            isGestureActiveRef.current = false;
          });
        }

        if (mounted) {
          // 计算安全的初始位置，避免罗盘与煞气点重叠
          const compassRadiusNormalized = 35 / Math.max(imgWidth, imgHeight);
          const safePosition = calculateSafeInitialPosition(
            shaPoints.filter(sha => !sha.resolved),
            { x: 0.5, y: 0.5 },
            compassRadiusNormalized
          );

          if (isMobile) {
            // Mobile 端：罗盘固定在屏幕中心，需要调整房间偏移
            // 使得煞气点远离屏幕中心
            const offsetX = (0.5 - safePosition.x) * imgWidth;
            const offsetY = (0.5 - safePosition.y) * imgHeight;
            
            // 更新房间容器的初始偏移
            const newRoomX = (width - imgWidth) / 2 + offsetX;
            const newRoomY = (height - imgHeight) / 2 + offsetY;
            
            roomContainer.x = newRoomX;
            roomContainer.y = newRoomY;
            roomOffsetRef.current = { x: newRoomX, y: newRoomY };
            targetRoomTransformRef.current = { x: newRoomX, y: newRoomY, scale: 1 };
            
            console.log('[GameStage] Mobile: adjusted room offset to avoid sha collision', {
              safePosition,
              offset: { x: offsetX, y: offsetY },
              newRoomPos: { x: newRoomX, y: newRoomY }
            });
          } else {
            // Web 端：通过回调通知父组件调整罗盘位置
            if (safePosition.x !== 0.5 || safePosition.y !== 0.5) {
              console.log('[GameStage] Web: notifying parent of safe compass position', safePosition);
              onInitialPositionCalculatedRef.current?.(safePosition);
            }
          }

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
      targetRoomTransformRef.current = { x: 0, y: 0, scale: 1 };
      isGestureActiveRef.current = false;
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

    if (!isMobile) {
      // Web 端：contain 模式，保持原始宽高比
      const imgDims = imageDimensionsRef.current;
      if (imgDims.width > 0 && imgDims.height > 0) {
        const scaleX = width / imgDims.width;
        const scaleY = height / imgDims.height;
        const scale = Math.min(scaleX, scaleY, 1); // 不放大，最多原始尺寸

        roomContainer.scale.set(scale);

        // 居中显示
        const scaledWidth = imgDims.width * scale;
        const scaledHeight = imgDims.height * scale;
        roomContainer.x = (width - scaledWidth) / 2;
        roomContainer.y = (height - scaledHeight) / 2;

        roomOffsetRef.current = { x: roomContainer.x, y: roomContainer.y };
        roomScaleRef.current = scale;
        targetRoomTransformRef.current = { x: roomContainer.x, y: roomContainer.y, scale };

        if (compassRef.current) {
          compassRef.current.x = roomContainer.x + compassPositionRef.current.x * imgDims.width * scale;
          compassRef.current.y = roomContainer.y + compassPositionRef.current.y * imgDims.height * scale;
        }
      }
      isGestureActiveRef.current = false;
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

    const animate = () => {
      if (roomContainerRef.current) {
        const roomContainer = roomContainerRef.current;
        const target = targetRoomTransformRef.current;
        const smoothing = isGestureActiveRef.current ? 0.36 : 0.24;

        roomContainer.x += (target.x - roomContainer.x) * smoothing;
        roomContainer.y += (target.y - roomContainer.y) * smoothing;
        const nextScale = roomContainer.scale.x + (target.scale - roomContainer.scale.x) * smoothing;
        roomContainer.scale.set(nextScale);

        roomOffsetRef.current = { x: roomContainer.x, y: roomContainer.y };
        roomScaleRef.current = nextScale;

        if (!isMobile) {
          const settled =
            Math.abs(target.x - roomContainer.x) < 0.1 &&
            Math.abs(target.y - roomContainer.y) < 0.1 &&
            Math.abs(target.scale - nextScale) < 0.001;
          if (settled) {
            isGestureActiveRef.current = false;
          }
        }
      }

      if (!isMobile && compassRef.current) {
        const roomOffset = roomOffsetRef.current;
        const roomScale = roomScaleRef.current;
        const imgDims = imageDimensionsRef.current;
        const compassPos = compassPositionRef.current;
        compassRef.current.x = roomOffset.x + compassPos.x * imgDims.width * roomScale;
        compassRef.current.y = roomOffset.y + compassPos.y * imgDims.height * roomScale;
      }

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

      // 不再显示煞气精灵，移除动画逻辑

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
    const roomOffset = roomOffsetRef.current;
    const roomScale = roomScaleRef.current;
    const imgDims = imageDimensionsRef.current;
    compassRef.current.x = roomOffset.x + compassPosition.x * imgDims.width * roomScale;
    compassRef.current.y = roomOffset.y + compassPosition.y * imgDims.height * roomScale;
  }, [compassPosition, width, height, isMobile]);

  // 更新暖色图 - 支持渐变转暖和冷暖对比
  useEffect(() => {
    const roomContainer = roomContainerRef.current;
    if (!roomContainer || !isReady) return;

    const warmRoom = roomContainer.getChildByLabel('warmRoom') as Sprite;
    const coldRoom = roomContainer.getChildByLabel('coldRoom') as Sprite;

    if (warmRoom && coldRoom) {
      const currentGameState = gameStateRef.current;
      const comparing = isComparingColdRef.current;

      // 冷暖对比模式：按住时显示冷图
      if (comparing) {
        warmRoom.alpha = 0;
        coldRoom.alpha = 1;
      }
      // 过渡动画状态：执行 700ms 渐变
      else if (currentGameState === 'transitioning' && !isTransitioningRef.current) {
        isTransitioningRef.current = true;
        transitionStartTimeRef.current = Date.now();
        
        // 开始渐变动画
        const transitionDuration = 700; // 700ms
        const animateTransition = () => {
          const elapsed = Date.now() - (transitionStartTimeRef.current ?? 0);
          const progress = Math.min(elapsed / transitionDuration, 1);
          
          // ease-out 曲线
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          
          warmRoom.alpha = easeProgress;
          coldRoom.alpha = 1 - easeProgress;

          if (progress < 1) {
            requestAnimationFrame(animateTransition);
          } else {
            // 转场完成
            isTransitioningRef.current = false;
            transitionStartTimeRef.current = null;
            onTransitionCompleteRef.current?.();
          }
        };
        
        requestAnimationFrame(animateTransition);
      }
      // 已通关状态：显示暖图
      else if (currentGameState === 'completed' || showWarm) {
        warmRoom.alpha = 1;
        coldRoom.alpha = 0;
      }
      // 扫描状态：显示冷图
      else {
        warmRoom.alpha = 0;
        coldRoom.alpha = 1;
      }
    }
  }, [showWarm, isReady, gameState, isComparingCold]);

  // 罗盘淡出 - 通关后隐藏
  useEffect(() => {
    const compass = compassRef.current;
    if (!compass || !isReady) return;

    const currentGameState = gameStateRef.current;
    const shouldHide = currentGameState === 'completed' || 
                       currentGameState === 'comparing' || 
                       isPreviouslyCompleted;

    if (shouldHide) {
      // 执行淡出动画
      const fadeOutDuration = 300; // 300ms
      const startAlpha = compass.alpha;
      const startTime = Date.now();

      const animateFadeOut = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / fadeOutDuration, 1);
        compass.alpha = startAlpha * (1 - progress);

        if (progress < 1) {
          requestAnimationFrame(animateFadeOut);
        } else {
          compass.visible = false;
        }
      };

      requestAnimationFrame(animateFadeOut);
    } else {
      // 显示罗盘
      compass.visible = true;
      compass.alpha = 1;
    }
  }, [isReady, gameState, isPreviouslyCompleted]);

  // 不再显示煞气精灵（小黑球）
  // useEffect(() => {
  //   const app = appRef.current;
  //   if (!app || !isReady) return;
  //   ...
  // }, [shaPoints, width, height, isReady, isMobile]);

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

  // Desktop 端：阻止 pointer 事件冒泡到 Devvit
  const handlePointerEvent = useCallback((e: React.PointerEvent) => {
    // Mobile 端：不阻止，让原生 touch 事件正常工作
    if (isMobile) return;
    e.stopPropagation();
  }, [isMobile]);

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        className="block h-full w-full cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: '#0e1116',
          touchAction: 'none', // 禁用浏览器默认手势（缩放、滚动）
        }}
        onPointerDown={isMobile ? undefined : handlePointerEvent}
        onPointerUp={isMobile ? undefined : handlePointerEvent}
        onPointerMove={isMobile ? undefined : handlePointerEvent}
        onPointerCancel={isMobile ? undefined : handlePointerEvent}
      />
      
      {!isReady && !error && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-[#0e1116]">
          {/* 加载进度 UI */}
          <div className="relative">
            {/* 外层光晕 - 呼吸效果 */}
            <div
              className="absolute -inset-4 rounded-sm animate-pulse"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(196, 160, 106, 0.15) 0%, transparent 70%)',
              }}
            />
            
            {/* 内容卡片 */}
            <div
              className="relative px-10 py-8 rounded-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 35, 45, 0.4) 0%, rgba(21, 26, 34, 0.45) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(196, 160, 106, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 80px rgba(196, 160, 106, 0.08)',
              }}
            >
              {/* 标题 - 带发光效果 */}
              <p 
                className="font-pixel text-[12px] text-center mb-5 tracking-wider"
                style={{ 
                  color: '#F5E4BB',
                  textShadow: '0 0 20px rgba(196, 160, 106, 0.5)',
                }}
              >
                LOADING
              </p>
              
              {/* 进度条容器 */}
              <div 
                className="w-48 h-3 overflow-hidden rounded-sm relative"
                style={{ 
                  background: 'linear-gradient(180deg, #15181E 0%, #1A1D24 100%)',
                  border: '1px solid rgba(196, 160, 106, 0.25)',
                }}
              >
                {/* 进度条背景网格 */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 11px, rgba(196, 160, 106, 0.1) 11px, rgba(196, 160, 106, 0.1) 12px)',
                  }}
                />
                
                {/* 扫描光条 - 来回移动 */}
                <div 
                  className="absolute top-0 bottom-0 w-16"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, #D4B07A 40%, #F5E4BB 50%, #D4B07A 60%, transparent 100%)',
                    animation: 'scanBar 1.2s ease-in-out infinite alternate',
                    boxShadow: '0 0 12px rgba(196, 160, 106, 0.6), 0 0 24px rgba(196, 160, 106, 0.3)',
                  }}
                />
                
                {/* 底部光晕 */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(196, 160, 106, 0.2) 100%)',
                  }}
                />
              </div>
              
              {/* 动态装饰点 - 波浪效果 */}
              <div className="flex justify-center gap-2 mt-5">
                <span className="w-2 h-2 rounded-sm bg-[#C4A06A]" style={{ animation: 'dotWave 1.2s ease-in-out infinite', animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-sm bg-[#C4A06A]" style={{ animation: 'dotWave 1.2s ease-in-out infinite', animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-sm bg-[#C4A06A]" style={{ animation: 'dotWave 1.2s ease-in-out infinite', animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
          
          {/* 动画样式 */}
          <style>{`
            @keyframes scanBar {
              0% { 
                left: -64px; 
                opacity: 0.7;
              }
              100% { 
                left: calc(100% + 0px); 
                opacity: 1;
              }
            }
            @keyframes dotWave {
              0%, 100% { 
                transform: translateY(0) scale(1); 
                opacity: 0.5;
              }
              50% { 
                transform: translateY(-4px) scale(1.2); 
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0e1116]">
          <div className="text-center p-4">
            <p className="font-pixel text-xs text-red-400 mb-2">Failed to load game</p>
            <p className="font-pixel text-[10px] text-gray-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 rounded bg-feng-bg-card px-3 py-1.5 font-pixel-cn text-xs text-feng-text-light"
            >
              Retry
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
