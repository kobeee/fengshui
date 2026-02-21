import { useGame } from '../stores/GameContext';
import { levels } from '../data/levels';

/** 像素边角装饰组件 */
function CornerDecorations({ isLocked }: { isLocked: boolean }) {
  const color = isLocked ? 'rgba(62, 76, 67, 0.4)' : 'rgba(196, 160, 106, 0.5)';
  const size = 6;

  return (
    <>
      {/* 左上角 */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: size,
          height: size,
          background: color,
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
        }}
      />
      {/* 右上角 */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: size,
          height: size,
          background: color,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
        }}
      />
      {/* 左下角 */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: size,
          height: size,
          background: color,
          clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
        }}
      />
      {/* 右下角 */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: size,
          height: size,
          background: color,
          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
        }}
      />
    </>
  );
}

/** 像素分隔线组件 */
function PixelDivider({ isLocked }: { isLocked: boolean }) {
  return (
    <div className="flex items-center gap-1 my-2">
      <div
        className="h-[2px] flex-1"
        style={{
          background: isLocked
            ? 'linear-gradient(90deg, transparent 0%, rgba(62, 76, 67, 0.3) 50%, transparent 100%)'
            : 'linear-gradient(90deg, transparent 0%, rgba(196, 160, 106, 0.2) 50%, transparent 100%)',
        }}
      />
      <div
        className="w-1 h-1"
        style={{ background: isLocked ? 'rgba(62, 76, 67, 0.4)' : 'rgba(196, 160, 106, 0.4)' }}
      />
      <div
        className="w-1.5 h-1.5"
        style={{ background: isLocked ? 'rgba(62, 76, 67, 0.5)' : 'rgba(196, 160, 106, 0.5)' }}
      />
      <div
        className="w-1 h-1"
        style={{ background: isLocked ? 'rgba(62, 76, 67, 0.4)' : 'rgba(196, 160, 106, 0.4)' }}
      />
      <div
        className="h-[2px] flex-1"
        style={{
          background: isLocked
            ? 'linear-gradient(90deg, transparent 0%, rgba(62, 76, 67, 0.3) 50%, transparent 100%)'
            : 'linear-gradient(90deg, transparent 0%, rgba(196, 160, 106, 0.2) 50%, transparent 100%)',
        }}
      />
    </div>
  );
}

/** 难度标识组件 */
function DifficultyBadge({
  difficulty,
  isLocked,
}: {
  difficulty: 'easy' | 'normal' | 'hard';
  isLocked: boolean;
}) {
  const config = {
    easy: { label: '入门', color: '#48BB78', dots: 1 },
    normal: { label: '进阶', color: '#C4A06A', dots: 2 },
    hard: { label: '大师', color: '#F56565', dots: 3 },
  };
  const { label, color, dots } = config[difficulty];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-1 h-1"
            style={{
              background: i < dots && !isLocked ? color : 'rgba(62, 76, 67, 0.3)',
              opacity: isLocked ? 0.3 : 1,
            }}
          />
        ))}
      </div>
      <span
        className="font-pixel text-[6px] tracking-[0.1em]"
        style={{ color: isLocked ? '#4A5568' : color }}
      >
        {label}
      </span>
    </div>
  );
}

/** 关卡卡片组件 - 移动端优化版 */
function LevelCard({
  level,
  index,
  onSelect,
}: {
  level: (typeof levels)[0] & { difficulty?: 'easy' | 'normal' | 'hard'; estimatedTime?: string };
  index: number;
  onSelect: () => void;
}) {
  const isLocked = level.locked;
  const animDelay = index * 0.15;

  return (
    <div
      onClick={onSelect}
      className={`relative transition-all duration-500 ease-out ${
        isLocked ? 'cursor-not-allowed' : 'cursor-pointer group hover:-translate-y-1'
      }`}
    >
      {/* 外层光晕 - hover 增强 (仅桌面端) */}
      <div
        className={`absolute -inset-3 rounded-xl transition-all duration-500 hidden sm:block ${
          isLocked ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(196, 160, 106, 0.2) 0%, transparent 60%)',
          transform: 'scale(0.9)',
        }}
      />

      {/* 悬浮阴影层 - hover 加深 */}
      <div
        className={`absolute -inset-1 rounded-lg transition-all duration-500 ${
          isLocked ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{
          background: 'transparent',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 60px rgba(196, 160, 106, 0.1)',
          transform: 'translateY(4px)',
        }}
      />

      {/* 像素回字纹边框 */}
      <div
        className={`absolute -inset-1 border rounded-lg transition-colors duration-300 ${
          isLocked ? 'border-[#3E4C43]/20' : 'border-[#C4A06A]/20 group-hover:border-[#C4A06A]/35'
        }`}
      />

      {/* 主卡片 */}
      <div
        className="relative rounded-lg overflow-hidden transition-all duration-300"
        style={{
          background: isLocked
            ? 'linear-gradient(135deg, rgba(30, 35, 45, 0.4) 0%, rgba(21, 26, 34, 0.5) 100%)'
            : 'linear-gradient(135deg, rgba(30, 35, 45, 0.25) 0%, rgba(21, 26, 34, 0.35) 100%)',
          backdropFilter: 'blur(20px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
          border: isLocked
            ? '1px solid rgba(62, 76, 67, 0.3)'
            : '1px solid rgba(196, 160, 106, 0.35)',
          boxShadow: `
            inset 0 1px 1px rgba(255, 255, 255, 0.05),
            inset 0 0 40px rgba(196, 160, 106, 0.03),
            0 4px 20px rgba(0, 0, 0, 0.3)
          `,
        }}
      >
        {/* 像素边角装饰 (仅桌面端) */}
        <div className="hidden sm:block">
          <CornerDecorations isLocked={isLocked} />
        </div>

        {/* 移动端: 紧凑水平布局 | 桌面端: 原布局 */}
        <div className="flex items-stretch">
          {/* 移动端缩略图 - 小尺寸左侧 */}
          <div className="sm:hidden relative flex-shrink-0 w-[80px] h-[80px] m-2 rounded overflow-hidden">
            {level.images.cold && !isLocked ? (
              <img
                src={level.images.cold}
                alt={level.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#1A1D24] flex items-center justify-center">
                <span className="font-pixel text-[8px] text-[#3E4C43]">Lv.{index + 1}</span>
              </div>
            )}
            {isLocked && (
              <div className="absolute inset-0 bg-[#0E1116]/60 flex items-center justify-center">
                <span className="text-sm opacity-50">🔒</span>
              </div>
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                border: `1px solid ${isLocked ? 'rgba(62, 76, 67, 0.3)' : 'rgba(196, 160, 106, 0.25)'}`,
                borderRadius: '4px',
              }}
            />
          </div>

          {/* 移动端信息区 - 紧凑排列 */}
          <div className="sm:hidden flex-1 flex flex-col justify-center py-2 pr-2 pl-1 min-w-0">
            {/* 标题行 */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <h3
                  className="font-pixel text-[9px] tracking-[0.05em]"
                  style={{ color: isLocked ? '#4A5568' : '#F5E4BB' }}
                >
                  Level {index + 1}
                </h3>
                {!isLocked && (
                  <span
                    className="font-pixel text-[5px] px-1 py-0.5 rounded"
                    style={{
                      background: 'rgba(196, 160, 106, 0.15)',
                      color: '#C4A06A',
                      border: '1px solid rgba(196, 160, 106, 0.25)',
                    }}
                  >
                    可玩
                  </span>
                )}
              </div>
              {/* 移动端难度 - 简化显示 */}
              <div className="flex gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-sm"
                    style={{
                      background: !isLocked && i < (level.difficulty === 'hard' ? 3 : level.difficulty === 'normal' ? 2 : 1)
                        ? '#48BB78'
                        : 'rgba(62, 76, 67, 0.3)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 关卡名 */}
            <p
              className="font-pixel text-[8px] tracking-[0.08em] truncate mb-1"
              style={{ color: isLocked ? '#3E4C43' : '#E2E8F0' }}
            >
              {level.name}
            </p>

            {/* 描述和时间 */}
            <div className="flex items-center justify-between">
              <p
                className="font-pixel text-[6px] tracking-[0.05em] truncate flex-1 mr-2"
                style={{ color: isLocked ? '#2D3748' : '#8D97A8' }}
              >
                {isLocked ? '通关解锁' : level.description}
              </p>
              {!isLocked && level.estimatedTime && (
                <span className="font-pixel text-[5px] text-[#6B7280] flex-shrink-0">
                  {level.estimatedTime}
                </span>
              )}
            </div>

            {/* 煞气点指示器 */}
            {!isLocked && level.shaCount > 0 && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="font-pixel text-[5px] text-[#6B7280]">煞气</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: level.shaCount }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-1 rounded-sm"
                      style={{
                        background: 'linear-gradient(90deg, #C4A06A 0%, #8B6914 100%)',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 移动端播放箭头 - 极简右侧 */}
          <div className="sm:hidden flex-shrink-0 flex items-center justify-center w-10 border-l border-[rgba(196,160,106,0.1)]">
            {isLocked ? (
              <span className="text-xs opacity-30">🔒</span>
            ) : (
              <span
                className="font-pixel text-[12px] transition-transform group-hover:translate-x-0.5"
                style={{ color: '#C4A06A' }}
              >
                ▶
              </span>
            )}
          </div>

          {/* 桌面端原布局 */}
          <div className="hidden sm:flex flex-row items-stretch gap-4 p-4 w-full">
            {/* 桌面端缩略图 */}
            <div
              className="relative flex-shrink-0 w-[100px] h-[100px] rounded overflow-hidden"
              style={{
                boxShadow: isLocked
                  ? 'none'
                  : '0 0 0 1px rgba(196, 160, 106, 0.15), 0 0 20px rgba(196, 160, 106, 0.1)',
              }}
            >
              {level.images.cold && !isLocked ? (
                <img
                  src={level.images.cold}
                  alt={level.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#1A1D24] flex items-center justify-center">
                  <span className="font-pixel text-xs text-[#3E4C43]">Lv.{index + 1}</span>
                </div>
              )}
              {isLocked && (
                <div className="absolute inset-0 bg-[#0E1116]/60 flex items-center justify-center">
                  <span className="text-xl opacity-50">🔒</span>
                </div>
              )}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${!isLocked ? 'group-hover:opacity-100' : ''}`}
                style={{
                  border: `2px solid ${isLocked ? 'rgba(62, 76, 67, 0.3)' : 'rgba(196, 160, 106, 0.25)'}`,
                  borderRadius: '4px',
                  boxShadow: isLocked ? 'none' : 'inset 0 0 15px rgba(196, 160, 106, 0.1)',
                  opacity: isLocked ? 1 : 0.7,
                }}
              />
            </div>

            {/* 桌面端信息区 */}
            <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-pixel text-[11px] tracking-[0.08em]" style={{ color: isLocked ? '#4A5568' : '#F5E4BB' }}>
                      Level {index + 1}
                    </h3>
                    {!isLocked && (
                      <span
                        className="font-pixel text-[6px] px-1.5 py-0.5 rounded-sm"
                        style={{
                          background: 'rgba(196, 160, 106, 0.15)',
                          color: '#C4A06A',
                          border: '1px solid rgba(196, 160, 106, 0.25)',
                        }}
                      >
                        可游玩
                      </span>
                    )}
                  </div>
                  <p className="font-pixel text-[10px] tracking-[0.1em] truncate" style={{ color: isLocked ? '#3E4C43' : '#E2E8F0' }}>
                    {level.name}
                  </p>
                </div>
                <DifficultyBadge difficulty={level.difficulty || 'easy'} isLocked={isLocked} />
              </div>

              <PixelDivider isLocked={isLocked} />

              <div className="flex items-center justify-between">
                <p
                  className="font-pixel text-[7px] tracking-[0.08em] flex-1 mr-4"
                  style={{ color: isLocked ? '#2D3748' : '#8D97A8', lineHeight: 1.8 }}
                >
                  {isLocked ? '通关解锁' : level.description}
                </p>
                {!isLocked && level.estimatedTime && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="font-pixel text-[6px] text-[#6B7280]">⏱</span>
                    <span className="font-pixel text-[6px] tracking-[0.1em]" style={{ color: '#6B7280' }}>
                      {level.estimatedTime}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  {!isLocked && level.shaCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-pixel text-[6px] tracking-[0.1em]" style={{ color: '#6B7280' }}>
                        煞气点
                      </span>
                      <div className="flex gap-1">
                        {Array.from({ length: level.shaCount }).map((_, i) => (
                          <div
                            key={i}
                            className="w-3 h-2 rounded-sm"
                            style={{
                              background: 'linear-gradient(90deg, #C4A06A 0%, #8B6914 100%)',
                              boxShadow: '0 0 6px rgba(196, 160, 106, 0.4)',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-0.5 opacity-50">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 h-0.5"
                      style={{
                        background: isLocked ? 'rgba(62, 76, 67, 0.5)' : 'rgba(196, 160, 106, 0.5)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 桌面端播放按钮 */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2 pl-2 border-l border-[rgba(196,160,106,0.1)]">
              <div
                className={`w-14 h-14 rounded flex items-center justify-center transition-all duration-300 ${
                  isLocked ? '' : 'group-hover:scale-105 group-hover:shadow-lg'
                }`}
                style={{
                  background: isLocked
                    ? 'rgba(62, 76, 67, 0.3)'
                    : 'linear-gradient(180deg, #D4B07A 0%, #B8904F 100%)',
                  boxShadow: isLocked
                    ? 'none'
                    : `inset -1px -1px 0px rgba(0, 0, 0, 0.2),
                       inset 1px 1px 0px rgba(255, 255, 255, 0.2),
                       0 3px 0px #5C4020,
                       0 0 20px rgba(196, 160, 106, 0.3)`,
                }}
              >
                {isLocked ? (
                  <span className="text-sm opacity-40">🔒</span>
                ) : (
                  <span
                    className="font-pixel text-[16px] text-[#0E1116] group-hover:scale-110 transition-transform"
                    style={{ textShadow: '1px 1px 0px rgba(255, 255, 255, 0.2)' }}
                  >
                    ▶
                  </span>
                )}
              </div>
              {!isLocked && (
                <span
                  className="font-pixel text-[6px] tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#C4A06A' }}
                >
                  开始
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LevelSelectPage() {
  const { navigate, loadLevel } = useGame();

  const handleSelectLevel = (level: (typeof levels)[0]) => {
    if (level.locked) return;
    loadLevel(level);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0E1116]">
      {/* Layer 0: 全屏背景图 */}
      <img
        src="/images/home-v1.0.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Layer 1: 渐变遮罩 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0E1116_80%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1116] via-transparent to-[#0E1116]/60" />

      {/* Layer 2: 内容层 */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-8">
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className="font-pixel text-[16px] tracking-[0.1em]"
            style={{
              color: '#F5E4BB',
              textShadow: '2px 2px 0px rgba(0, 0, 0, 0.8), 0 0 20px rgba(240, 217, 156, 0.4)',
            }}
          >
            选择关卡
          </h1>
          <button
            onClick={() => navigate('start')}
            className="font-pixel text-[10px] px-4 py-2 rounded transition-all duration-200 active:translate-y-[1px]"
            style={{
              color: '#AAB3C2',
              background: 'linear-gradient(135deg, rgba(30, 35, 45, 0.4) 0%, rgba(21, 26, 34, 0.5) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(196, 160, 106, 0.25)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
            }}
          >
            ← 返回
          </button>
        </div>

        {/* 关卡列表 */}
        <div className="flex-1 space-y-5 overflow-y-auto overflow-x-hidden pb-6">
          {levels.map((level, index) => (
            <LevelCard
              key={level.id}
              level={level}
              index={index}
              onSelect={() => handleSelectLevel(level)}
            />
          ))}
        </div>

        {/* 底部提示 */}
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          {/* 像素装饰分隔线 */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-0.5 bg-[#3E4C43]" />
              <div className="w-1 h-1 bg-[#3E4C43]" />
              <div className="w-0.5 h-0.5 bg-[#3E4C43]" />
            </div>
            <div
              className="w-1.5 h-1.5 rotate-45"
              style={{
                background: 'linear-gradient(135deg, #C4A06A 0%, #8B6914 100%)',
                opacity: 0.6,
              }}
            />
            <div className="flex items-center gap-1">
              <div className="w-0.5 h-0.5 bg-[#3E4C43]" />
              <div className="w-1 h-1 bg-[#3E4C43]" />
              <div className="w-2 h-0.5 bg-[#3E4C43]" />
            </div>
          </div>

          {/* 提示文字 */}
          <div
            className="px-4 py-2 rounded"
            style={{
              background: 'rgba(30, 35, 45, 0.3)',
              border: '1px solid rgba(62, 76, 67, 0.2)',
            }}
          >
            <p
              className="font-pixel text-[7px] tracking-[0.15em] text-center"
              style={{ color: '#5A6578' }}
            >
              通关解锁下一关卡
            </p>
            <p
              className="font-pixel text-[6px] tracking-[0.1em] text-center mt-1.5"
              style={{ color: '#4A5568' }}
            >
              当前进度: 1 / {levels.length} 关卡
            </p>
          </div>

          {/* 像素进度条 */}
          <div className="flex items-center gap-1">
            {levels.map((level, i) => (
              <div
                key={i}
                className="w-4 h-1.5 rounded-sm"
                style={{
                  background: level.locked
                    ? 'rgba(62, 76, 67, 0.3)'
                    : 'linear-gradient(90deg, #C4A06A 0%, #D4B07A 100%)',
                  boxShadow: level.locked ? 'none' : '0 0 4px rgba(196, 160, 106, 0.3)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
