import { useRef, useState, useCallback, useEffect, type PointerEvent, type MouseEvent } from 'react';
import { useGame } from '../stores/GameContext';
import { useResponsive } from '../hooks/useResponsive';
import { useLevelCompletion } from '../hooks/useLevelCompletion';
import { detectShaPoint, getCompassSpeed } from '../utils/distance';
import type { Position, ShaPoint } from '../types/game';
import { GameStage } from '../game/GameStage';
import { EventModal } from '../components/game/EventModal';

export function GameplayPage() {
  const { 
    state, 
    updateCompass, 
    activateSha, 
    closeModal, 
    resolveSha, 
    navigate, 
    loadLevel,
    setComparing,
    finishTransition,
    dismissCompletionModal
  } = useGame();
  const { isMobile } = useResponsive();
  const { isLevelCompleted, markLevelCompleted, clearLevelCompletion } = useLevelCompletion();
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
    isCompleted,
    gameState,
    isComparingCold,
    isPreviouslyCompleted,
    showCompletionModal
  } = state;
  const isCompareInteractive = gameState === 'completed' || gameState === 'comparing';

  // 初始化容器尺寸
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          const nextWidth = Math.floor(width);
          const nextHeight = Math.floor(height);
          setContainerSize((prev) =>
            prev.width === nextWidth && prev.height === nextHeight
              ? prev
              : { width: nextWidth, height: nextHeight }
          );
        }
      }
    });

    resizeObserver.observe(container);

    requestAnimationFrame(() => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const nextWidth = Math.floor(rect.width);
        const nextHeight = Math.floor(rect.height);
        setContainerSize((prev) =>
          prev.width === nextWidth && prev.height === nextHeight
            ? prev
            : { width: nextWidth, height: nextHeight }
        );
      }
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 检查关卡是否已通关，加载时传递状态
  useEffect(() => {
    if (currentLevel && !isPreviouslyCompleted) {
      const completed = isLevelCompleted(currentLevel.id);
      if (completed && gameState === 'scanning') {
        // 重新加载关卡并标记为已通关
        loadLevel(currentLevel, true);
      }
    }
  }, [currentLevel, isLevelCompleted, isPreviouslyCompleted, gameState, loadLevel]);

  // 通关后保存进度
  useEffect(() => {
    if (gameState === 'completed' && currentLevel && !isPreviouslyCompleted) {
      markLevelCompleted(currentLevel.id);
    }
  }, [gameState, currentLevel, isPreviouslyCompleted, markLevelCompleted]);

  // Web 端：罗盘移动处理
  const handleCompassMove = useCallback(
    (position: Position) => {
      if (!currentLevel || showEventModal || gameState === 'transitioning' || gameState === 'completed' || gameState === 'comparing') return;

      const speed = getCompassSpeed(position, currentLevel.shaPoints);
      updateCompass(position, speed);

      const detectedSha = detectShaPoint(position, currentLevel.shaPoints);
      if (detectedSha && speed === 'super-fast') {
        activateSha(detectedSha);
      }
    },
    [currentLevel, showEventModal, gameState, updateCompass, activateSha]
  );

  // Mobile 端：碰撞处理
  const handleMobileCollision = useCallback(
    (shaPoint: ShaPoint) => {
      if (!currentLevel || showEventModal || gameState === 'transitioning' || gameState === 'completed' || gameState === 'comparing') return;
      activateSha(shaPoint);
    },
    [currentLevel, showEventModal, gameState, activateSha]
  );

  // Mobile 端：持续更新罗盘速度
  const handleCompassSpeedChange = useCallback(
    (speed: string) => {
      if (speed !== compassSpeed) {
        updateCompass(compassPosition, speed as 'normal' | 'fast' | 'super-fast');
      }
    },
    [compassPosition, compassSpeed, updateCompass]
  );

  // 转场完成回调
  const handleTransitionComplete = useCallback(() => {
    finishTransition();
  }, [finishTransition]);

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

  // ========== 冷暖对比交互 ==========
  
  // 开始对比（按住显示冷图）
  const startComparing = useCallback(() => {
    if (gameState === 'completed' || gameState === 'comparing') {
      setComparing(true);
    }
  }, [gameState, setComparing]);

  // 结束对比（松开恢复暖图）
  const stopComparing = useCallback(() => {
    setComparing(false);
  }, [setComparing]);

  // 处理 visibilitychange 事件（切换 tab/最小化时自动恢复）
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isComparingCold) {
        stopComparing();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isComparingCold, stopComparing]);

  // 键盘 Space 键支持（桌面端）
  useEffect(() => {
    if (isMobile || !isCompareInteractive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault(); // 阻止页面滚动
        startComparing();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        stopComparing();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isMobile, isCompareInteractive, startComparing, stopComparing]);

  // ========== 重玩功能 ==========
  
  const handleReplay = useCallback(() => {
    if (!currentLevel) return;
    // 清除通关记录
    clearLevelCompletion(currentLevel.id);
    // 重置关卡（不传递 isPreviouslyCompleted，默认为 false）
    loadLevel(currentLevel, false);
  }, [currentLevel, clearLevelCompletion, loadLevel]);

  // 阻止事件冒泡 - 始终阻止，避免触发 Devvit 隔离窗口错误
  const handleContainerPointerEvent = useCallback((e: PointerEvent | MouseEvent) => {
    e.stopPropagation();
  }, []);

  // 指针事件处理（用于冷暖对比）
  // 不阻止事件传播，让拖动功能同时生效
  const handlePointerDown = useCallback((_e: PointerEvent) => {
    if (!isCompareInteractive) {
      return;
    }
    startComparing();
  }, [isCompareInteractive, startComparing]);

  const handlePointerUp = useCallback((_e: PointerEvent) => {
    if (!isCompareInteractive) {
      return;
    }
    stopComparing();
  }, [isCompareInteractive, stopComparing]);

  const handlePointerCancel = useCallback((_e: PointerEvent) => {
    if (!isCompareInteractive) {
      return;
    }
    stopComparing();
  }, [isCompareInteractive, stopComparing]);

  const handlePointerLeave = useCallback((_e: PointerEvent) => {
    if (!isCompareInteractive) {
      return;
    }
    stopComparing();
  }, [isCompareInteractive, stopComparing]);

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

  return (
    <div 
      className="fixed inset-0 flex flex-col bg-feng-bg-deep" 
      onClick={handleContainerPointerEvent}
      onPointerDown={handleContainerPointerEvent}
      onPointerUp={handleContainerPointerEvent}
      onPointerMove={handleContainerPointerEvent}
      onPointerCancel={handleContainerPointerEvent}
    >
      {/* 顶部状态栏 - 半透明低干扰 */}
      <header 
        className="flex h-12 flex-shrink-0 items-center justify-between px-4"
        style={{
          background: 'rgba(21, 26, 34, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(196, 160, 106, 0.15)',
        }}
      >
        <button
          onClick={() => navigate('select')}
          className="rounded px-3 py-1.5 font-pixel text-[10px] text-feng-text-muted transition-colors hover:text-feng-text-light"
          style={{
            background: 'rgba(32, 39, 54, 0.6)',
            border: '1px solid rgba(196, 160, 106, 0.2)',
          }}
        >
          ← 返回
        </button>
        <div className="text-center">
          <h2 className="font-pixel text-[11px] text-feng-text-primary">
            {currentLevel.name}
          </h2>
          <p className="font-pixel text-[9px] text-feng-text-dim mt-0.5">
            {isCompareInteractive ? '已净化' : `${resolvedCount} / ${currentLevel.shaCount} 净化中`}
          </p>
        </div>
        <div className="w-12" />
      </header>

      {/* 游戏主区域 - PixiJS */}
      <div 
        ref={containerRef} 
        className="relative flex-1 overflow-hidden"
        onPointerDownCapture={isCompareInteractive ? handlePointerDown : undefined}
        onPointerUpCapture={isCompareInteractive ? handlePointerUp : undefined}
        onPointerCancelCapture={isCompareInteractive ? handlePointerCancel : undefined}
        onPointerLeave={isCompareInteractive ? handlePointerLeave : undefined}
      >
        {containerSize.width > 0 && containerSize.height > 0 ? (
          <GameStage
            key={`${currentLevel.id}-${isMobile}`}
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
            gameState={gameState}
            isComparingCold={isComparingCold}
            isPreviouslyCompleted={isPreviouslyCompleted}
            onCompassMove={isMobile || isCompareInteractive ? undefined : handleCompassMove}
            onMobileCollision={isMobile && !isCompareInteractive ? handleMobileCollision : undefined}
            onCompassSpeedChange={isMobile && !isCompareInteractive ? handleCompassSpeedChange : undefined}
            onTransitionComplete={handleTransitionComplete}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="font-pixel text-xs text-feng-text-dim animate-pulse">初始化游戏...</p>
          </div>
        )}

        {/* 底部提示 - 根据 gameState 显示不同文案 */}
        {!showEventModal && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
            {isCompareInteractive ? (
              <div 
                className="rounded px-4 py-2"
                style={{
                  background: 'rgba(21, 26, 34, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(196, 160, 106, 0.25)',
                }}
              >
                <p className="font-pixel text-[10px] text-feng-text-light text-center">
                  {isComparingCold ? '松开返回净化后' : '按住查看净化前'}
                </p>
              </div>
            ) : gameState !== 'transitioning' && (
              <p 
                className="rounded-full px-4 py-2 font-pixel text-[10px] text-feng-text-light"
                style={{
                  background: 'rgba(14, 17, 22, 0.8)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {isMobile ? 'DRAG ROOM TO FIND SHA' : 'CLICK TO FIND SHA'}
              </p>
            )}
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
      {showCompletionModal && (
        <div 
          className="animate-fade-in absolute inset-0 z-40 flex flex-col items-center justify-center cursor-pointer"
          style={{
            background: 'rgba(14, 17, 22, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              dismissCompletionModal();
            }
          }}
        >
          <div className="relative">
            {/* 外层光晕 */}
            <div
              className="absolute -inset-4 rounded-sm"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(196, 160, 106, 0.2) 0%, transparent 70%)',
              }}
            />

            {/* 8-bit风格双层边框 */}
            <div className="absolute -inset-1.5 border border-[#C4A06A]/30 rounded-sm" />
            <div className="absolute -inset-0.5 border-2 border-[#C4A06A]/45 rounded-sm" />

            {/* 主内容卡片 - Glassmorphism */}
            <div 
              className="relative rounded-sm px-10 py-8 text-center cursor-default"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 35, 45, 0.45) 0%, rgba(21, 26, 34, 0.5) 100%)',
                backdropFilter: 'blur(24px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
                border: '2px solid rgba(196, 160, 106, 0.45)',
                boxShadow: `
                  inset 0 1px 1px rgba(255, 255, 255, 0.1),
                  inset 0 0 48px rgba(196, 160, 106, 0.05),
                  0 12px 40px rgba(0, 0, 0, 0.4),
                  0 0 100px rgba(196, 160, 106, 0.1)
                `,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 标题区 */}
              <h2 
                className="font-pixel text-[20px] tracking-[0.08em]"
                style={{
                  color: '#F5E4BB',
                  textShadow: '2px 2px 0px rgba(0, 0, 0, 0.8), 0 0 20px rgba(240, 217, 156, 0.4)',
                }}
              >
                通关成功
              </h2>

              {/* 像素分隔线 */}
              <div className="flex items-center justify-center gap-1.5 my-4" aria-hidden="true">
                <div className="w-6 h-[1px] bg-[#455063]" />
                <div className="w-1.5 h-1.5 bg-[#C4A06A]" />
                <div className="w-2 h-2 bg-[#E6D4B4]" />
                <div className="w-1.5 h-1.5 bg-[#C4A06A]" />
                <div className="w-6 h-[1px] bg-[#455063]" />
              </div>

              <p className="font-pixel text-[10px] tracking-[0.1em] text-[#AAB3C2] mb-6">
                房间气场已净化，暖阳入屋
              </p>

              {/* 按钮区 */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleReplay}
                  className="rounded-sm px-6 py-3 font-pixel text-[11px] tracking-[0.08em] transition-all duration-150 active:translate-y-[1px]"
                  style={{
                    background: 'rgba(32, 39, 54, 0.8)',
                    border: '2px solid rgba(196, 160, 106, 0.35)',
                    color: '#AAB3C2',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.06), 0 4px 12px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  重玩
                </button>
                <button
                  onClick={() => navigate('select')}
                  className="rounded-sm px-6 py-3 font-pixel text-[11px] tracking-[0.08em] transition-all duration-150 active:translate-y-[2px]"
                  style={{
                    background: 'linear-gradient(180deg, #D4B07A 0%, #B8904F 100%)',
                    color: '#0E1116',
                    boxShadow: `
                      inset -2px -2px 0px rgba(0, 0, 0, 0.25),
                      inset 2px 2px 0px rgba(255, 255, 255, 0.25),
                      0 4px 0px #5C4020,
                      0 6px 12px rgba(0, 0, 0, 0.3),
                      0 0 20px rgba(196, 160, 106, 0.25)
                    `,
                  }}
                >
                  继续探索
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
