import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Application,
  Container,
  Assets,
  Sprite,
  Graphics,
  Text,
  TextStyle,
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

  useEffect(() => {
    if (!canvasRef.current) return;

    let mounted = true;

    const loadAssets = async (
      app: Application,
      cold: string,
      warm: string,
      w: number,
      h: number
    ) => {
      const roomContainer = app.stage.getChildByName('roomContainer') as Container;
      if (!roomContainer) return;

      roomContainer.removeChildren();

      const [coldTexture, warmTexture] = await Promise.all([
        Assets.load(cold),
        Assets.load(warm),
      ]);

      const coldSprite = new Sprite(coldTexture);
      coldSprite.name = 'coldRoom';
      coldSprite.width = w;
      coldSprite.height = h;
      roomContainer.addChild(coldSprite);

      const warmSprite = new Sprite(warmTexture);
      warmSprite.name = 'warmRoom';
      warmSprite.width = w;
      warmSprite.height = h;
      warmSprite.alpha = 0;
      roomContainer.addChild(warmSprite);
    };

    const setupInteraction = (
      app: Application,
      mobile: boolean,
      w: number,
      h: number,
      onMove?: (pos: Position) => void
    ) => {
      if (mobile || !onMove) return;

      const compass = compassRef.current;
      if (!compass) return;

      let isDragging = false;
      const dragOffset = { x: 0, y: 0 };

      compass.on('pointerdown', (e: { globalX: number; globalY: number }) => {
        isDragging = true;
        dragOffset.x = e.globalX - compass.x;
        dragOffset.y = e.globalY - compass.y;
        compass.cursor = 'grabbing';
      });

      app.stage.on('pointermove', (e: { globalX: number; globalY: number }) => {
        if (!isDragging) return;
        
        const newX = e.globalX - dragOffset.x;
        const newY = e.globalY - dragOffset.y;
        
        const newPos: Position = {
          x: Math.max(0, Math.min(1, newX / w)),
          y: Math.max(0, Math.min(1, newY / h)),
        };
        onMove(newPos);
      });

      const stopDrag = () => {
        isDragging = false;
        if (compass) compass.cursor = 'grab';
      };

      app.stage.on('pointerup', stopDrag);
      app.stage.on('pointerupoutside', stopDrag);
    };

    const initApp = async () => {
      const app = new Application();

      await app.init({
        canvas: canvasRef.current!,
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

      const roomContainer = new Container();
      roomContainer.name = 'roomContainer';
      app.stage.addChild(roomContainer);

      const compass = createCompass();
      compass.name = 'compass';
      compass.eventMode = 'static';
      compass.cursor = 'grab';
      app.stage.addChild(compass);
      compassRef.current = compass;

      particleSystemRef.current = createVictoryParticles(app.stage);

      if (isMobile) {
        compass.x = width / 2;
        compass.y = height / 2;
      } else {
        compass.x = compassPosition.x * width;
        compass.y = compassPosition.y * height;
      }

      await loadAssets(app, coldImage, warmImage, width, height);

      if (mounted) {
        setIsReady(true);
        setupInteraction(app, isMobile, width, height, onCompassMove);
      }
    };

    void initApp();

    return () => {
      mounted = false;
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, []);

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
    if (!app) return;

    const roomContainer = app.stage.getChildByName('roomContainer') as Container;
    if (!roomContainer) return;

    const warmRoom = roomContainer.getChildByName('warmRoom') as Sprite;
    const coldRoom = roomContainer.getChildByName('coldRoom') as Sprite;

    if (warmRoom && coldRoom) {
      warmRoom.alpha = showWarm ? 1 : 0;
      coldRoom.alpha = showWarm ? 0 : 1;
    }
  }, [showWarm]);

  // 更新煞气精灵
  useEffect(() => {
    const app = appRef.current;
    if (!app || !isReady) return;

    shaSpritesRef.current.forEach((sprite) => {
      app.stage.removeChild(sprite);
    });
    shaSpritesRef.current.clear();

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

    placedItems.forEach((item) => {
      if (itemSpritesRef.current.has(item.shaId)) return;

      const imagePath = itemImages[item.itemId];
      if (!imagePath) return;

      void Assets.load(imagePath).then((texture) => {
        const sprite = new Sprite(texture);
        sprite.x = item.position.x * width;
        sprite.y = item.position.y * height;
        sprite.anchor.set(0.5);
        sprite.scale.set(0.5);

        itemSpritesRef.current.set(item.shaId, sprite);
        app.stage.addChild(sprite);
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
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
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
