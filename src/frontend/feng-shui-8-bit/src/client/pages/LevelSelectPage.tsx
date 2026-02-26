import React, { useMemo, useEffect } from 'react';
import { useGame } from '../stores/GameContext';
import { levels, type LevelWithAura, CHAPTERS } from '../data/levels';
import { useLevelCompletion } from '../stores/LevelCompletionContext';

// ============ 像素进度路径组件 ============
function ProgressPath({
  completedCount,
  currentChapterId,
  onChapterClick,
}: {
  completedCount: number;
  currentChapterId: number;
  onChapterClick: (chapterId: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1">
      {CHAPTERS.map((chapter, i) => {
        const isCompleted = completedCount >= chapter.range[1];
        const isCurrent =
          completedCount >= chapter.range[0] - 1 && completedCount < chapter.range[1];
        const isActive = chapter.id === currentChapterId;

        // 双维度区分：填充 + 颜色
        const getState = () => {
          if (isCompleted) return { symbol: '◆', color: '#C4A06A', glow: false };
          if (isCurrent) return { symbol: '◈', color: '#F5E4BB', glow: true };
          return { symbol: '◇', color: '#4A5059', glow: false };
        };

        const state = getState();

        return (
          <React.Fragment key={chapter.id}>
            <button
              onClick={() => onChapterClick(chapter.id)}
              className="font-pixel text-[14px] transition-all duration-300 cursor-pointer hover:scale-125 active:scale-110"
              style={{
                color: state.color,
                textShadow: state.glow
                  ? '0 0 10px rgba(196, 160, 106, 0.8), 0 0 20px rgba(196, 160, 106, 0.4)'
                  : 'none',
                background: isActive ? 'rgba(196, 160, 106, 0.15)' : 'transparent',
                padding: '4px 8px',
                borderRadius: '2px',
              }}
              title={chapter.name}
            >
              {state.symbol}
            </button>
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
}: {
  total: number;
  completed: number;
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
// 预计算的粒子位置（避免渲染期间调用 Math.random）
const MIST_PARTICLES = [
  { id: 0, left: 12, delay: 0, size: 0.8 },
  { id: 1, left: 28, delay: 0.3, size: 0.6 },
  { id: 2, left: 45, delay: 0.6, size: 0.9 },
  { id: 3, left: 62, delay: 0.9, size: 0.5 },
  { id: 4, left: 78, delay: 1.2, size: 0.7 },
  { id: 5, left: 15, delay: 1.5, size: 0.55 },
  { id: 6, left: 35, delay: 1.8, size: 0.85 },
  { id: 7, left: 52, delay: 2.1, size: 0.65 },
  { id: 8, left: 68, delay: 2.4, size: 0.75 },
  { id: 9, left: 85, delay: 2.7, size: 0.6 },
  { id: 10, left: 22, delay: 3.0, size: 0.7 },
  { id: 11, left: 58, delay: 3.3, size: 0.8 },
];

function MistOverlay() {
  const particles = MIST_PARTICLES;

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
  isLocked,
  isCompleted,
  shaProgress,
  onClick,
}: {
  level: LevelWithAura;
  index: number;
  isCurrent: boolean;
  isLocked: boolean;
  isCompleted: boolean;
  shaProgress: string[];
  onClick: () => void;
}) {
  const handleClick = () => {
    if (isLocked) {
      return;
    }
    onClick();
  };

  // 进度条动态计算：已通关显示全部，未通关显示保存的进度
  const shaCompleted = isCompleted ? level.shaCount : shaProgress.length;

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

          {/* 锁定标记 */}
          {isLocked && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: 'rgba(14, 17, 22, 0.7)',
              }}
            >
              <span
                className="font-pixel text-[16px]"
                style={{
                  color: '#4A5059',
                  textShadow: '0 0 8px rgba(74, 80, 89, 0.5)',
                }}
              >
                🔒
              </span>
            </div>
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
              <span className="font-pixel text-[8px] text-[#0E1116]">OK</span>
            </div>
          )}

          {isCurrent && !isLocked && (
            <div
              className="absolute top-1 left-1 px-1.5 py-0.5"
              style={{
                background: '#D4B07A',
                boxShadow: '2px 2px 0 0 rgba(0,0,0,0.5)',
              }}
            >
              <span className="font-pixel text-[8px] text-[#0E1116]">NOW</span>
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
            {isLocked ? 'Locked' : level.name}
          </h3>

          {/* 进度条 */}
          {!isLocked && (
            <div className="mt-2">
              <ProgressBar
                total={level.shaCount}
                completed={shaCompleted}
              />
            </div>
          )}

          {/* 解锁提示 */}
          {isLocked && (
            <p className="font-pixel text-[8px] mt-1" style={{ color: '#4A5059' }}>
              Complete previous level
            </p>
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
  isLevelUnlocked,
  isLevelCompleted,
  getShaProgress,
  onEnterLevel,
}: {
  chapter: (typeof CHAPTERS)[number];
  levelsInSection: LevelWithAura[];
  currentLevelId: string | undefined;
  isLevelUnlocked: (levelId: string) => boolean;
  isLevelCompleted: (levelId: string) => boolean;
  getShaProgress: (levelId: string) => string[];
  onEnterLevel: (level: LevelWithAura) => void;
}) {
  const hasCurrentLevel = levelsInSection.some((l) => l.id === currentLevelId);

  // 保留原始顺序，不再置顶
  // 章节内的关卡按原始顺序显示
  const displayLevels = levelsInSection;

  return (
    <section
      className="mb-8"
      id={`chapter-${chapter.id}`}
      style={{ scrollMarginTop: '100px' }}
    >
      {/* 章节标题 */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className="font-pixel text-[14px]"
          style={{ color: hasCurrentLevel ? '#C4A06A' : '#4A5059' }}
        >
          {hasCurrentLevel ? '◆' : '◇'}
        </span>
        <h2 className="font-pixel text-[12px] text-[#9CA3AF]">
          {chapter.name}
        </h2>
        <div className="flex-1 h-px bg-[#2A2F3A]" />
      </div>

      {/* 纵向列表 */}
      <div className="flex flex-col gap-3">
        {displayLevels.map((level) => {
          const locked = !isLevelUnlocked(level.id);
          const completed = isLevelCompleted(level.id);

          return (
            <div key={level.id} id={`level-${level.id}`}>
              <LevelCard
                level={level}
                index={parseInt(level.id.split('-')[1] || '1') - 1}
                isCurrent={level.id === currentLevelId}
                isLocked={locked}
                isCompleted={completed}
                shaProgress={getShaProgress(level.id)}
                onClick={() => onEnterLevel(level)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============ 继续游戏悬浮按钮 ============
function ContinueButton({
  currentLevel,
  shaProgress,
  onClick,
}: {
  currentLevel: LevelWithAura;
  shaProgress: string[];
  onClick: () => void;
}) {
  const progressText = `${shaProgress.length}/${currentLevel.shaCount}`;

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
        <span className="font-pixel text-[12px] text-[#0E1116]">Continue</span>
        <span className="font-pixel text-[10px] text-[#5C4020]">· {progressText} Sha</span>
        <span className="font-pixel text-[12px] text-[#0E1116] ml-1">▶</span>
      </button>
    </div>
  );
}

// ============ 主页面组件 ============
export function LevelSelectPage() {
  const { navigate, loadLevel } = useGame();
  const { isLevelCompleted, isLevelUnlocked, getCompletedCount, getCurrentLevel, getShaProgress } =
    useLevelCompletion();

  // 当前激活的章节（用于高亮）
  const [activeChapterId, setActiveChapterId] = React.useState<number>(1);

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
      // 滚动到具体的关卡卡片
      const element = document.getElementById(`level-${currentLevel.id}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // 设置当前章节（延迟执行避免 lint 警告）
      const levelNum = parseInt(currentLevel.id.split('-')[1] || '1');
      const chapter = CHAPTERS.find(
        (c) => levelNum >= c.range[0] && levelNum <= c.range[1]
      );
      if (chapter) {
        // 使用 requestAnimationFrame 延迟 setState
        requestAnimationFrame(() => {
          setActiveChapterId(chapter.id);
        });
      }
    }
  }, [currentLevel?.id]);

  // 点击章节跳转
  const handleChapterClick = (chapterId: number) => {
    setActiveChapterId(chapterId);
    const element = document.getElementById(`chapter-${chapterId}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleEnterLevel = (level: LevelWithAura) => {
    const completed = isLevelCompleted(level.id);
    if (completed) {
      // 已通关，直接显示暖图
      loadLevel(level, true);
    } else {
      // 未通关，检查是否有保存的进度
      const savedProgress = getShaProgress(level.id);
      loadLevel(level, false, savedProgress);
    }
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

      {/* Sticky 吸顶头部 */}
      <header
        className="sticky top-0 z-20 px-4 py-3"
        style={{
          background: 'linear-gradient(180deg, rgba(14, 17, 22, 0.95) 0%, rgba(14, 17, 22, 0.85) 100%)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(196, 160, 106, 0.15)',
        }}
      >
        {/* 第一行：返回按钮 + 标题 + 进度 */}
        <div className="flex items-center justify-between mb-3">
          {/* 返回按钮 */}
          <button
            onClick={() => navigate('start')}
            className="flex items-center gap-1 px-2 py-1 transition-all hover:bg-[rgba(196,160,106,0.1)] active:scale-95"
            style={{
              border: '1px solid rgba(196, 160, 106, 0.3)',
            }}
          >
            <span className="font-pixel text-[12px]" style={{ color: '#C4A06A' }}>
              ←
            </span>
            <span className="font-pixel text-[9px]" style={{ color: '#9CA3AF' }}>
              Home
            </span>
          </button>

          {/* 标题 */}
          <h1
            className="font-pixel text-[14px]"
            style={{
              color: '#F5E4BB',
              textShadow: '2px 2px 0 rgba(0,0,0,0.8), 0 0 20px rgba(196, 160, 106, 0.3)',
            }}
          >
            Explore
          </h1>

          {/* 进度 */}
          <span className="font-pixel text-[10px]" style={{ color: '#9CA3AF' }}>
            Solved {completedCount}/20
          </span>
        </div>

        {/* 第二行：可点击的进度路径 */}
        <ProgressPath
          completedCount={completedCount}
          currentChapterId={activeChapterId}
          onChapterClick={handleChapterClick}
        />
      </header>

      {/* 内容层 */}
      <div className="relative z-10 max-w-xl mx-auto px-4 py-4">
        {/* 章节列表 */}
        {chapters.map((chapter) => (
          <ChapterSection
            key={chapter.id}
            chapter={chapter}
            levelsInSection={chapter.levels}
            currentLevelId={currentLevel?.id}
            isLevelUnlocked={isLevelUnlocked}
            isLevelCompleted={isLevelCompleted}
            getShaProgress={getShaProgress}
            onEnterLevel={handleEnterLevel}
          />
        ))}
      </div>

      {/* 继续游戏悬浮按钮 */}
      {currentLevel && isLevelUnlocked(currentLevel.id) && !isLevelCompleted(currentLevel.id) && (
        <ContinueButton
          currentLevel={currentLevel}
          shaProgress={getShaProgress(currentLevel.id)}
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
