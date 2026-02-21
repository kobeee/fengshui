import { useGame } from '../stores/GameContext';
import { levels } from '../data/levels';

/** 浮动煞气粒子组件 */
function ShaParticle({
  delay,
  size,
  top,
  left,
  animationClass,
}: {
  delay: string;
  size: number;
  top: string;
  left: string;
  animationClass: string;
}) {
  return (
    <div
      className={`absolute rounded-full ${animationClass}`}
      style={{
        width: size,
        height: size,
        top,
        left,
        background: 'radial-gradient(circle, rgba(40, 40, 45, 0.7) 0%, rgba(30, 30, 35, 0.4) 100%)',
        filter: 'blur(1px)',
        animationDelay: delay,
      }}
    />
  );
}

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

/** 关卡卡片组件 */
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
      className={`relative card-animate-in opacity-0 ${
        isLocked ? 'cursor-not-allowed' : 'cursor-pointer group'
      }`}
      style={{ animationDelay: `${animDelay}s` }}
    >
      {/* 外层光晕 - hover 增强 */}
      <div
        className={`absolute -inset-2 rounded-lg transition-opacity duration-300 ${
          isLocked ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(196, 160, 106, 0.15) 0%, transparent 70%)',
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
        {/* 像素边角装饰 */}
        <CornerDecorations isLocked={isLocked} />

        <div className="flex items-stretch gap-4 p-4">
          {/* 缩略图区域 */}
          <div className="relative flex-shrink-0 w-[100px] h-[100px] rounded overflow-hidden">
            {level.images.cold && !isLocked ? (
              <img
                src={level.images.cold}
                alt={level.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#1A1D24] flex items-center justify-center">
                <span className="font-pixel text-xs text-[#3E4C43]">
                  Lv.{index + 1}
                </span>
              </div>
            )}
            {/* 锁定遮罩 */}
            {isLocked && (
              <div className="absolute inset-0 bg-[#0E1116]/60 flex items-center justify-center">
                <span className="text-xl opacity-50">🔒</span>
              </div>
            )}
            {/* 图片边框 */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                border: `2px solid ${isLocked ? 'rgba(62, 76, 67, 0.3)' : 'rgba(196, 160, 106, 0.2)'}`,
                borderRadius: '4px',
              }}
            />
          </div>

          {/* 信息区域 */}
          <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
            {/* 顶部：标题和难度 */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className="font-pixel text-[11px] tracking-[0.08em]"
                    style={{ color: isLocked ? '#4A5568' : '#F5E4BB' }}
                  >
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
                <p
                  className="font-pixel text-[10px] tracking-[0.1em] truncate"
                  style={{ color: isLocked ? '#3E4C43' : '#E2E8F0' }}
                >
                  {level.name}
                </p>
              </div>
              <DifficultyBadge difficulty={level.difficulty || 'easy'} isLocked={isLocked} />
            </div>

            {/* 像素分隔线 */}
            <PixelDivider isLocked={isLocked} />

            {/* 中部：描述和元信息 */}
            <div className="flex items-center justify-between">
              <p
                className="font-pixel text-[7px] tracking-[0.08em] flex-1 mr-4"
                style={{
                  color: isLocked ? '#2D3748' : '#8D97A8',
                  lineHeight: 1.8,
                }}
              >
                {isLocked ? '通关解锁' : level.description}
              </p>
              {!isLocked && level.estimatedTime && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="font-pixel text-[6px] text-[#6B7280]">⏱</span>
                  <span
                    className="font-pixel text-[6px] tracking-[0.1em]"
                    style={{ color: '#6B7280' }}
                  >
                    {level.estimatedTime}
                  </span>
                </div>
              )}
            </div>

            {/* 底部：煞气进度指示器 + 装饰 */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                {!isLocked && level.shaCount > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span
                      className="font-pixel text-[6px] tracking-[0.1em]"
                      style={{ color: '#6B7280' }}
                    >
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

              {/* 像素装饰点阵 */}
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

          {/* 播放按钮区域 */}
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
                  : `
                    inset -1px -1px 0px rgba(0, 0, 0, 0.2),
                    inset 1px 1px 0px rgba(255, 255, 255, 0.2),
                    0 3px 0px #5C4020,
                    0 0 20px rgba(196, 160, 106, 0.3)
                  `,
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

      {/* Layer 2: 浮动煞气粒子 */}
      <ShaParticle delay="0s" size={10} top="10%" left="5%" animationClass="sha-particle-1" />
      <ShaParticle delay="0.7s" size={8} top="15%" left="88%" animationClass="sha-particle-2" />
      <ShaParticle delay="1.2s" size={12} top="80%" left="8%" animationClass="sha-particle-3" />
      <ShaParticle delay="1.8s" size={6} top="75%" left="90%" animationClass="sha-particle-1" />
      <ShaParticle delay="2.2s" size={9} top="45%" left="92%" animationClass="sha-particle-2" />

      {/* Layer 3: 内容层 */}
      <div className="relative z-10 flex flex-col min-h-screen p-5">
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between mb-6 card-animate-in">
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
        <div className="flex-1 space-y-4 overflow-auto pb-4">
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
        <div
          className="flex flex-col items-center justify-center gap-3 py-4 card-animate-in opacity-0"
          style={{ animationDelay: '0.6s' }}
        >
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
