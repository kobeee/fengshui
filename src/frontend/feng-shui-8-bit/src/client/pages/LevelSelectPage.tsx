import React, { useMemo, useEffect } from 'react';
import { useGame } from '../stores/GameContext';
import { levels, type LevelWithAura, CHAPTERS } from '../data/levels';
import { useLevelCompletion } from '../hooks/useLevelCompletion';

// ============ 像素进度路径组件 ============
function ProgressPath({ completedCount }: { completedCount: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-6">
      {CHAPTERS.map((chapter, i) => {
        const isCompleted = completedCount >= chapter.range[1];
        const isCurrent =
          completedCount >= chapter.range[0] - 1 && completedCount < chapter.range[1];

        // 双维度区分：填充 + 颜色
        const getState = () => {
          if (isCompleted) return { symbol: '◆', color: '#C4A06A', glow: false };
          if (isCurrent) return { symbol: '◈', color: '#F5E4BB', glow: true };
          return { symbol: '◇', color: '#4A5059', glow: false };
        };

        const state = getState();

        return (
          <React.Fragment key={chapter.id}>
            <span
              className="font-pixel text-[14px] transition-all duration-300"
              style={{
                color: state.color,
                textShadow: state.glow
                  ? '0 0 10px rgba(196, 160, 106, 0.8), 0 0 20px rgba(196, 160, 106, 0.4)'
                  : 'none',
              }}
            >
              {state.symbol}
            </span>
            {i < CHAPTERS.length - 1 && (
              <span className="font-pixel text-[10px] text-[#2A2F3A] mx-0.5">─</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ============ 进度条组件 ============
function ProgressBar({
  total,
  completed,
  isCurrent,
}: {
  total: number;
  completed: number;
  isCurrent: boolean;
}) {
  const progress = completed / total;

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-2 overflow-hidden"
        style={{
          background: '#0E1116',
          border: '1px solid #2A2F3A',
        }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${progress * 100}%`,
            background: '#C4A06A',
            boxShadow: isCurrent ? '0 0 8px rgba(196, 160, 106, 0.5)' : 'none',
          }}
        />
      </div>
      <span className="font-pixel text-[9px] text-[#9CA3AF]">
        {completed}/{total}
      </span>
    </div>
  );
}

// ============ 迷雾动画组件 ============
function MistOverlay() {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: i * 0.3,
        size: Math.random() * 0.5 + 0.5,
      })),
    []
  );

  return (
    <div className="relative w-full h-full bg-[#1A1D24] overflow-hidden">
      {/* 模糊剪影 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1A1D24 0%, #2A2F3A 50%, #1A1D24 100%)',
          filter: 'blur(8px)',
        }}
      />

      {/* 漂浮粒子 */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bg-[#4A5059] animate-float"
          style={{
            left: `${p.left}%`,
            bottom: '-4px',
            width: `${p.size}rem`,
            height: `${p.size}rem`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* 问号提示 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-pixel text-[20px] text-[#4A5059]"
          style={{ textShadow: '0 0 10px rgba(74, 80, 89, 0.5)' }}
        >
          ?
        </span>
      </div>
    </div>
  );
}

// ============ 关卡卡片组件 ============
function LevelCard({
  level,
  index,
  isCurrent,
  onClick,
}: {
  level: LevelWithAura;
  index: number;
  isCurrent: boolean;
  onClick: () => void;
}) {
  const isLocked = level.locked;
  const isCompleted = !isLocked && (level.shaCompleted === level.shaCount);

  const handleClick = () => {
    if (isLocked) {
      return;
    }
    onClick();
  };

  // 像素硬边样式
  const cardStyle: React.CSSProperties = {
    background: isLocked ? '#15181D' : '#1A1D24',
    border: isCurrent
      ? '2px solid #C4A06A'
      : isCompleted
        ? '1px solid rgba(196, 160, 106, 0.5)'
        : isLocked
          ? '1px solid rgba(74, 80, 89, 0.5)'
          : '1px solid rgba(196, 160, 106, 0.2)',
    boxShadow: isCurrent
      ? '4px 4px 0 0 #0E1116, 0 0 30px rgba(196, 160, 106, 0.4)'
      : '4px 4px 0 0 #0E1116',
    animation: isCurrent ? 'pulse-glow 2s ease-in-out infinite' : 'none',
  };

  return (
    <div
      onClick={handleClick}
      className={`relative transition-all ${
        isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer active:scale-[0.98]'
      }`}
      style={cardStyle}
    >
      <div className="flex items-center gap-4 p-4">
        {/* 缩略图 */}
        <div
          className="relative w-20 h-20 flex-shrink-0 overflow-hidden"
          style={{ border: '1px solid rgba(0,0,0,0.5)' }}
        >
          {!isLocked ? (
            <img
              src={level.images.cold}
              alt={level.name}
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <MistOverlay />
          )}

          {/* 状态标记 */}
          {isCompleted && (
            <div
              className="absolute top-1 left-1 px-1.5 py-0.5"
              style={{
                background: '#C4A06A',
                boxShadow: '2px 2px 0 0 rgba(0,0,0,0.5)',
              }}
            >
              <span className="font-pixel text-[8px] text-[#0E1116]">吉</span>
            </div>
          )}

          {isCurrent && (
            <div
              className="absolute top-1 left-1 px-1.5 py-0.5"
              style={{
                background: '#D4B07A',
                boxShadow: '2px 2px 0 0 rgba(0,0,0,0.5)',
              }}
            >
              <span className="font-pixel text-[8px] text-[#0E1116]">当前</span>
            </div>
          )}
        </div>

        {/* 信息区 */}
        <div className="flex-1 min-w-0">
          <span
            className="font-pixel text-[10px]"
            style={{ color: isLocked ? '#4A5059' : '#C4A06A' }}
          >
            Level {index + 1}
          </span>

          <h3
            className="font-pixel text-[11px] mt-1 truncate"
            style={{
              color: isLocked ? '#4A5059' : isCurrent ? '#F5E4BB' : '#E2E8F0',
            }}
          >
            {isLocked ? '迷雾笼罩' : level.name}
          </h3>

          {/* 进度条 */}
          {!isLocked && (
            <div className="mt-2">
              <ProgressBar
                total={level.shaCount}
                completed={level.shaCompleted ?? 0}
                isCurrent={isCurrent}
              />
            </div>
          )}

          {/* 描述 */}
          {!isLocked && (
            <p
              className="font-pixel text-[8px] mt-1 truncate"
              style={{ color: '#9CA3AF' }}
            >
              {level.description}
            </p>
          )}
        </div>

        {/* 右箭头 */}
        {isCurrent && (
          <div className="flex-shrink-0">
            <span
              className="font-pixel text-[12px]"
              style={{
                color: '#C4A06A',
                textShadow: '0 0 8px rgba(196, 160, 106, 0.5)',
              }}
            >
              ▶
            </span>
          </div>
        )}
      </div>

      {/* 脉冲发光动画样式 */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 4px 4px 0 0 #0E1116, 0 0 30px rgba(196, 160, 106, 0.4);
            border-color: #C4A06A;
          }
          50% { 
            box-shadow: 4px 4px 0 0 #0E1116, 0 0 50px rgba(196, 160, 106, 0.6);
            border-color: #D4B07A;
          }
        }
      `}</style>
    </div>
  );
}

// ============ 章节分组组件 ============
function ChapterSection({
  chapter,
  levelsInSection,
  currentLevelId,
  onEnterLevel,
}: {
  chapter: (typeof CHAPTERS)[number];
  levelsInSection: LevelWithAura[];
  currentLevelId: string | undefined;
  onEnterLevel: (level: LevelWithAura) => void;
}) {
  const hasCurrentLevel = levelsInSection.some((l) => l.id === currentLevelId);

  // 当前关卡置顶
  const sortedLevels = useMemo(() => {
    if (!hasCurrentLevel) return levelsInSection;
    const current = levelsInSection.find((l) => l.id === currentLevelId);
    const others = levelsInSection.filter((l) => l.id !== currentLevelId);
    return current ? [current, ...others] : levelsInSection;
  }, [levelsInSection, currentLevelId, hasCurrentLevel]);

  return (
    <section className="mb-8" id={`chapter-${chapter.id}`}>
      {/* 章节标题 */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className="font-pixel text-[14px]"
          style={{ color: hasCurrentLevel ? '#C4A06A' : '#4A5059' }}
        >
          {hasCurrentLevel ? '◆' : '◇'}
        </span>
        <h2 className="font-pixel text-[12px] text-[#9CA3AF]">
          {chapter.name} · 第{chapter.symbol}章
        </h2>
        <div className="flex-1 h-px bg-[#2A2F3A]" />
      </div>

      {/* 纵向列表 */}
      <div className="flex flex-col gap-3">
        {sortedLevels.map((level) => (
          <LevelCard
            key={level.id}
            level={level}
            index={parseInt(level.id.split('-')[1] || '1') - 1}
            isCurrent={level.id === currentLevelId}
            onClick={() => onEnterLevel(level)}
          />
        ))}
      </div>
    </section>
  );
}

// ============ 继续游戏悬浮按钮 ============
function ContinueButton({
  currentLevel,
  onClick,
}: {
  currentLevel: LevelWithAura | undefined;
  onClick: () => void;
}) {
  if (!currentLevel) return null;

  const progressText = `${currentLevel.shaCompleted ?? 0}/${currentLevel.shaCount}`;

  return (
    <div
      className="fixed left-0 right-0 flex justify-center z-50 px-4"
      style={{
        bottom: 'calc(16px + env(safe-area-inset-bottom))',
      }}
    >
      <button
        onClick={onClick}
        className="flex items-center gap-3 px-8 py-4 transition-transform active:scale-95"
        style={{
          background: '#C4A06A',
          border: '2px solid #B8904F',
          boxShadow: '0 4px 0 0 #5C4020, 4px 4px 0 0 #3A2810',
        }}
      >
        <span className="font-pixel text-[12px] text-[#0E1116]">继续探境</span>
        <span className="font-pixel text-[10px] text-[#5C4020]">· 第 {progressText} 煞</span>
        <span className="font-pixel text-[12px] text-[#0E1116] ml-1">▶</span>
      </button>
    </div>
  );
}

// ============ 主页面组件 ============
export function LevelSelectPage() {
  const { navigate, loadLevel } = useGame();
  const { isLevelCompleted, getCompletedCount, getCurrentLevel } = useLevelCompletion();

  // 获取完成状态
  const completedCount = getCompletedCount();
  const currentLevel = getCurrentLevel;

  // 按章节分组关卡
  const chapters = useMemo(() => {
    return CHAPTERS.map((chapter) => ({
      ...chapter,
      levels: levels.filter((l) => {
        const levelNum = l.id.split('-')[1];
        if (!levelNum) return false;
        const num = parseInt(levelNum);
        return num >= chapter.range[0] && num <= chapter.range[1];
      }),
    }));
  }, []);

  // 自动滚动到当前关卡
  useEffect(() => {
    if (currentLevel?.id) {
      const levelNum = parseInt(currentLevel.id.split('-')[1] || '1');
      const chapterId = Math.ceil(levelNum / 5);
      const element = document.getElementById(`chapter-${chapterId}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentLevel?.id]);

  const handleEnterLevel = (level: LevelWithAura) => {
    const completed = isLevelCompleted(level.id);
    loadLevel(level, completed);
  };

  // 阻止事件冒泡
  const handleStopPropagation = (e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="relative min-h-screen bg-[#0E1116]"
      style={{ paddingBottom: 'calc(100px + env(safe-area-inset-bottom))' }}
      onClick={handleStopPropagation}
      onPointerDown={handleStopPropagation}
      onPointerUp={handleStopPropagation}
      onPointerMove={handleStopPropagation}
      onPointerCancel={handleStopPropagation}
    >
      {/* 背景层 */}
      <div className="fixed inset-0">
        <img
          src="/images/home-v1.0.png"
          alt=""
          className="w-full h-full object-cover opacity-20"
          style={{ imageRendering: 'pixelated' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0E1116_90%)]" />
      </div>

      {/* 内容层 */}
      <div className="relative z-10 max-w-xl mx-auto px-4 py-6">
        {/* 标题区 */}
        <header className="text-center mb-6">
          <h1
            className="font-pixel text-[16px] mb-2"
            style={{
              color: '#F5E4BB',
              textShadow: '2px 2px 0 rgba(0,0,0,0.8), 0 0 20px rgba(196, 160, 106, 0.3)',
            }}
          >
            探境
          </h1>
          <p className="font-pixel text-[10px] text-[#9CA3AF]">
            已解 {completedCount}/20 关
          </p>
        </header>

        {/* 进度路径 */}
        <ProgressPath completedCount={completedCount} />

        {/* 章节列表 */}
        {chapters.map((chapter) => (
          <ChapterSection
            key={chapter.id}
            chapter={chapter}
            levelsInSection={chapter.levels}
            currentLevelId={currentLevel?.id}
            onEnterLevel={handleEnterLevel}
          />
        ))}

        {/* 返回按钮 */}
        <footer className="text-center pt-4 pb-8">
          <button
            onClick={() => navigate('start')}
            className="font-pixel text-[10px] text-[#4A5059] hover:text-[#C4A06A] transition-colors"
          >
            返回主殿
          </button>
        </footer>
      </div>

      {/* 继续游戏悬浮按钮 */}
      {currentLevel && !currentLevel.locked && (
        <ContinueButton
          currentLevel={currentLevel}
          onClick={() => handleEnterLevel(currentLevel)}
        />
      )}

      {/* 全局动画样式 */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) scale(1.2);
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
