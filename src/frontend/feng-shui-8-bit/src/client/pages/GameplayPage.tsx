import { useRef, useState, useCallback, useEffect } from 'react';
import { useGame } from '../stores/GameContext';
import { useResponsive } from '../hooks/useResponsive';
import { useProgress } from '../hooks/useProgress';
import { detectShaPoint, getCompassSpeed } from '../utils/distance';
import type { Position } from '../types/game';
import { GameStage } from '../game/GameStage';
import { EventModal } from '../components/game/EventModal';

/**
 * Gameplay Page - 游戏玩法主页面（PixiJS 版本）
 */
export function GameplayPage() {
  const { state, updateCompass, activateSha, closeModal, resolveSha, navigate } = useGame();
  const { isMobile } = useResponsive();
  const { saveProgress } = useProgress();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const { 
    currentLevel, 
    compassPosition, 
    compassSpeed, 
    activeShaPoint, 
    showEventModal, 
    showWarmImage, 
    placedItems, 
    resolvedCount, 
    isCompleted 
  } = state;

  // 使用 ResizeObserver 监听容器尺寸变化
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerSize({
            width: Math.floor(width),
            height: Math.floor(height),
          });
        }
      }
    });

    resizeObserver.observe(container);

    // 初始更新 - 使用 requestAnimationFrame 确保 DOM 已渲染
    requestAnimationFrame(() => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isCompleted && currentLevel) {
      void saveProgress(currentLevel.id, true);
    }
  }, [isCompleted, currentLevel, saveProgress]);

  // 罗盘移动处理（Web 端）
  const handleCompassMove = useCallback(
    (position: Position) => {
      if (!currentLevel || showEventModal) return;

      const speed = getCompassSpeed(position, currentLevel.shaPoints);
      updateCompass(position, speed);

      // 检测煞点
      const detectedSha = detectShaPoint(position, currentLevel.shaPoints);
      if (detectedSha && speed === 'super-fast') {
        activateSha(detectedSha);
      }
    },
    [currentLevel, showEventModal, updateCompass, activateSha]
  );

  // 选项选择处理
  const handleOptionSelect = useCallback(
    (optionId: string) => {
      if (!activeShaPoint) return;

      const selectedOption = activeShaPoint.options.find((opt) => opt.id === optionId);
      if (!selectedOption) return;

      if (selectedOption.correct) {
        resolveSha(activeShaPoint.id, activeShaPoint.correctItem);
      } else {
        closeModal();
      }
    },
    [activeShaPoint, resolveSha, closeModal]
  );

  // 无关卡数据
  if (!currentLevel) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-feng-bg-panel">
        <p className="font-pixel text-sm text-feng-text-dim">加载中...</p>
        <button
          onClick={() => navigate('select')}
          className="mt-4 rounded bg-feng-bg-card px-4 py-2 font-pixel-cn text-xs text-feng-text-light"
        >
          返回选择
        </button>
      </div>
    );
  }

  // 阻止所有 pointer 事件冒泡到父窗口，避免触发 Devvit 隔离窗口通信错误
  const handleStopPropagation = (e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col bg-feng-bg-deep" 
      onClick={handleStopPropagation}
      onPointerDown={handleStopPropagation}
      onPointerUp={handleStopPropagation}
      onPointerMove={handleStopPropagation}
      onPointerCancel={handleStopPropagation}
    >
      {/* 顶部状态栏 */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between bg-feng-bg-panel/90 px-4 backdrop-blur-sm">
        <button
          onClick={() => navigate('select')}
          className="rounded bg-feng-bg-card px-3 py-1.5 font-pixel-cn text-xs text-feng-text-light"
        >
          ← 返回
        </button>
        <div className="text-center">
          <h2 className="font-pixel-cn text-sm text-feng-text-primary">
            {currentLevel.name}
          </h2>
          <p className="font-pixel text-xs text-feng-text-muted">
            {resolvedCount} / {currentLevel.shaCount} 已净化
          </p>
        </div>
        <div className="w-16" />
      </header>

      {/* 游戏主区域 - PixiJS */}
      <div 
        ref={containerRef} 
        className="relative flex-1 overflow-hidden"
      >
        {containerSize.width > 0 && containerSize.height > 0 ? (
          <GameStage
            width={containerSize.width}
            height={containerSize.height}
            coldImage={currentLevel.images.cold}
            warmImage={currentLevel.images.warm}
            showWarm={showWarmImage}
            shaPoints={currentLevel.shaPoints}
            compassPosition={compassPosition}
            compassSpeed={compassSpeed}
            placedItems={placedItems}
            itemImages={currentLevel.items}
            isMobile={isMobile}
            isCompleted={isCompleted}
            onCompassMove={isMobile ? undefined : handleCompassMove}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="font-pixel text-xs text-feng-text-dim animate-pulse">初始化游戏...</p>
          </div>
        )}

        {/* 提示文字 */}
        {!showEventModal && !isCompleted && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
            <p className="rounded-full bg-feng-bg-deep/80 px-4 py-2 font-pixel text-xs text-feng-text-light backdrop-blur-sm">
              {isMobile ? 'DRAG ROOM · PINCH TO ZOOM' : 'DRAG COMPASS TO FIND SHA'}
            </p>
          </div>
        )}
      </div>

      {/* 事件弹窗 - React UI 层 */}
      <EventModal
        shaPoint={activeShaPoint!}
        visible={showEventModal}
        onSelect={handleOptionSelect}
        onClose={closeModal}
      />

      {/* 通关界面 */}
      {isCompleted && (
        <div className="animate-fade-in absolute inset-0 z-40 flex flex-col items-center justify-center bg-feng-bg-deep/70 backdrop-blur-sm">
          <div className="animate-victory-glow rounded-2xl bg-feng-bg-panel p-8 text-center">
            <h2 className="mb-2 font-pixel-cn text-2xl text-feng-text-primary">
              通关成功！
            </h2>
            <p className="mb-6 font-ui text-sm text-feng-text-muted">
              房间气场已净化，暖阳入屋
            </p>
            <button
              onClick={() => navigate('select')}
              className="rounded-lg bg-feng-accent px-6 py-3 font-pixel-cn text-base text-feng-bg-deep transition-colors hover:bg-feng-accent-dark"
            >
              继续探索
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
