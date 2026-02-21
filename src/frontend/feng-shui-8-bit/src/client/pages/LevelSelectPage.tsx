import { useGame } from '../stores/GameContext';
import { levels, type LevelWithAura } from '../data/levels';

/** 像素边角装饰组件 */
function CornerDecorations({ color }: { color: string }) {
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
function PixelDivider({ color, opacity }: { color: string; opacity: number }) {
  return (
    <div className="flex items-center gap-1 my-2">
      <div
        className="h-[2px] flex-1"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          opacity,
        }}
      />
      <div className="w-1 h-1" style={{ background: color, opacity }} />
      <div className="w-1.5 h-1.5" style={{ background: color, opacity: opacity * 1.2 }} />
      <div className="w-1 h-1" style={{ background: color, opacity }} />
      <div
        className="h-[2px] flex-1"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          opacity,
        }}
      />
    </div>
  );
}

/** 难度标识组件 */
function DifficultyBadge({
  difficulty,
  isLocked,
  auraColor,
}: {
  difficulty: 'easy' | 'normal' | 'hard';
  isLocked: boolean;
  auraColor: string;
}) {
  const configMap = {
    easy: { label: '初窥', dots: 1 },
    normal: { label: '入定', dots: 2 },
    hard: { label: '悟道', dots: 3 },
  };
  const { label, dots } = configMap[difficulty];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-1 h-1"
            style={{
              background: i < dots && !isLocked ? auraColor : 'rgba(62, 76, 67, 0.3)',
              opacity: isLocked ? 0.3 : 1,
            }}
          />
        ))}
      </div>
      <span
        className="font-pixel text-[6px] tracking-[0.1em]"
        style={{ color: isLocked ? '#4A5568' : auraColor }}
      >
        {label}
      </span>
    </div>
  );
}

/** 神秘化煞气指示器 */
function MysteryShaIndicator({
  shaCount,
  isLocked,
  auraColor,
}: {
  shaCount: number;
  isLocked: boolean;
  auraColor: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {isLocked ? (
        <>
          <span className="font-pixel text-[5px] text-[#9CA3AF]">煞气</span>
          <span className="font-pixel text-[5px] text-[#7B8490]">???</span>
        </>
      ) : (
        <>
          <span className="font-pixel text-[5px] text-[#AAB3C2]">煞气</span>
          <div className="flex gap-0.5">
            {Array.from({ length: shaCount }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-1 rounded-sm"
                style={{
                  background: `linear-gradient(90deg, ${auraColor} 0%, ${auraColor}80 100%)`,
                  boxShadow: `0 0 4px ${auraColor}40`,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** 关卡卡片组件 - 神秘感版本 */
function LevelCard({
  level,
  index,
  onSelect,
}: {
  level: LevelWithAura;
  index: number;
  onSelect: () => void;
}) {
  const isLocked = level.locked;
  const { auraColor, mysteryName, mysteryHint } = level;

  // 气场颜色变量
  const primaryColor = auraColor.primary;
  const glowColor = auraColor.glow;

  return (
    <div
      onClick={onSelect}
      className={`relative transition-all duration-500 ease-out ${
        isLocked ? 'cursor-not-allowed' : 'cursor-pointer group hover:-translate-y-1'
      }`}
    >
      {/* 气场光晕层 - 每个关卡不同的神秘色彩 */}
      <div
        className={`absolute -inset-4 rounded-xl transition-all duration-500 ${
          isLocked ? 'opacity-30' : 'opacity-0 group-hover:opacity-60'
        }`}
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />

      {/* 悬浮阴影层 */}
      <div
        className={`absolute -inset-1 rounded-lg transition-all duration-500 ${
          isLocked ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{
          background: 'transparent',
          boxShadow: `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 60px ${glowColor}`,
          transform: 'translateY(4px)',
        }}
      />

      {/* 主卡片 - 移动端提高背景亮度 */}
      <div
        className="relative rounded-lg overflow-hidden transition-all duration-300"
        style={{
          background: isLocked
            ? 'linear-gradient(135deg, rgba(40, 45, 55, 0.75) 0%, rgba(30, 35, 45, 0.8) 100%)'
            : 'linear-gradient(135deg, rgba(40, 45, 55, 0.65) 0%, rgba(30, 35, 45, 0.7) 100%)',
          backdropFilter: 'blur(12px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
          border: `1px solid ${isLocked ? 'rgba(100, 110, 120, 0.35)' : `${primaryColor}45`}`,
          boxShadow: `
            inset 0 1px 1px rgba(255, 255, 255, 0.08),
            inset 0 0 30px ${isLocked ? 'rgba(100, 110, 120, 0.05)' : `${primaryColor}10`},
            0 4px 20px rgba(0, 0, 0, 0.25)
          `,
        }}
      >
        {/* 像素边角装饰 (仅桌面端) */}
        <div className="hidden sm:block">
          <CornerDecorations color={isLocked ? 'rgba(62, 76, 67, 0.4)' : `${primaryColor}60`} />
        </div>

        {/* 移动端: 紧凑水平布局 | 桌面端: 原布局 */}
        <div className="flex items-stretch">
          {/* 移动端缩略图 - 锁定关卡显示模糊轮廓 */}
          <div className="sm:hidden relative flex-shrink-0 w-[80px] h-[80px] m-2 rounded overflow-hidden">
            {level.images.cold ? (
              <>
                <img
                  src={level.images.cold}
                  alt={level.name}
                  className="w-full h-full object-cover"
                  style={{
                    filter: isLocked ? 'blur(4px) brightness(0.6)' : 'none',
                    transform: isLocked ? 'scale(1.05)' : 'none',
                  }}
                />
                {/* 半遮面纱效果 - 减少遮罩强度 */}
                {isLocked && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, rgba(20, 24, 30, 0.5) 0%, rgba(20, 24, 30, 0.35) 100%)`,
                    }}
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-[#1A1D24] flex items-center justify-center">
                <span className="font-pixel text-[8px] text-[#3E4C43]">Lv.{index + 1}</span>
              </div>
            )}
            {/* 锁定符号 - 提高可见度 */}
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle, ${primaryColor}30 0%, transparent 70%)`,
                    border: `1px solid ${primaryColor}40`,
                  }}
                >
                  <span className="text-xs" style={{ color: primaryColor, opacity: 0.7 }}>◈</span>
                </div>
              </div>
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                border: `1px solid ${isLocked ? 'rgba(100, 110, 120, 0.3)' : `${primaryColor}30`}`,
                borderRadius: '4px',
              }}
            />
          </div>

          {/* 移动端信息区 - 提高文字对比度 */}
          <div className="sm:hidden flex-1 flex flex-col justify-center py-2 pr-2 pl-1 min-w-0">
            {/* 神秘化标题 */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <h3
                  className="font-pixel text-[9px] tracking-[0.05em]"
                  style={{ color: isLocked ? '#9CA3AF' : primaryColor }}
                >
                  {isLocked ? mysteryName : `Level ${index + 1}`}
                </h3>
                {!isLocked && (
                  <span
                    className="font-pixel text-[5px] px-1 py-0.5 rounded"
                    style={{
                      background: `${primaryColor}20`,
                      color: primaryColor,
                      border: `1px solid ${primaryColor}40`,
                    }}
                  >
                    可探
                  </span>
                )}
              </div>
              {/* 难度点阵 */}
              <div className="flex gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-sm"
                    style={{
                      background: !isLocked && i < (level.difficulty === 'hard' ? 3 : level.difficulty === 'normal' ? 2 : 1)
                        ? primaryColor
                        : 'rgba(150, 160, 170, 0.4)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 关卡名/神秘提示 */}
            <p
              className="font-pixel text-[8px] tracking-[0.08em] truncate mb-1"
              style={{ color: isLocked ? '#B8BCC4' : '#F5F7FA' }}
            >
              {isLocked ? mysteryHint : level.name}
            </p>

            {/* 描述 */}
            <div className="flex items-center justify-between">
              <p
                className="font-pixel text-[6px] tracking-[0.05em] truncate flex-1 mr-2"
                style={{ color: isLocked ? '#8B929C' : '#C4CAD6' }}
              >
                {isLocked ? '卦象未明，待天时开启' : level.description}
              </p>
              {!isLocked && level.estimatedTime && (
                <span className="font-pixel text-[5px] text-[#9CA3AF] flex-shrink-0">
                  {level.estimatedTime}
                </span>
              )}
            </div>

            {/* 煞气指示器 */}
            <div className="mt-1.5">
              <MysteryShaIndicator
                shaCount={level.shaCount}
                isLocked={isLocked}
                auraColor={primaryColor}
              />
            </div>
          </div>

          {/* 移动端右侧 - 提高对比度 */}
          <div className="sm:hidden flex-shrink-0 flex items-center justify-center w-10 border-l border-[rgba(150,160,170,0.2)]">
            {isLocked ? (
              <span
                className="font-pixel text-[10px]"
                style={{ color: '#7B8490', opacity: 0.6 }}
              >
                ◈
              </span>
            ) : (
              <span
                className="font-pixel text-[12px] transition-transform group-hover:translate-x-0.5"
                style={{ color: primaryColor }}
              >
                ▶
              </span>
            )}
          </div>

          {/* 桌面端原布局 */}
          <div className="hidden sm:flex flex-row items-stretch gap-4 p-4 w-full">
            {/* 桌面端缩略图 - 模糊轮廓效果 */}
            <div
              className="relative flex-shrink-0 w-[100px] h-[100px] rounded overflow-hidden"
              style={{
                boxShadow: isLocked
                  ? 'none'
                  : `0 0 0 1px ${primaryColor}15, 0 0 20px ${primaryColor}20`,
              }}
            >
              {level.images.cold ? (
                <>
                  <img
                    src={level.images.cold}
                    alt={level.name}
                    className="w-full h-full object-cover"
                    style={{
                      filter: isLocked ? 'blur(8px) brightness(0.35)' : 'none',
                      transform: isLocked ? 'scale(1.15)' : 'none',
                    }}
                  />
                  {/* 半遮面纱 */}
                  {isLocked && (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, rgba(14, 17, 22, 0.75) 0%, rgba(14, 17, 22, 0.55) 50%, rgba(14, 17, 22, 0.75) 100%)`,
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-[#1A1D24] flex items-center justify-center">
                  <span className="font-pixel text-xs text-[#3E4C43]">Lv.{index + 1}</span>
                </div>
              )}
              {/* 锁定符号 - 神秘化 */}
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 70%)`,
                      border: `1px solid ${primaryColor}25`,
                      boxShadow: `0 0 20px ${primaryColor}20`,
                    }}
                  >
                    <span
                      className="font-pixel text-[14px]"
                      style={{ color: primaryColor, opacity: 0.5 }}
                    >
                      ◈
                    </span>
                  </div>
                </div>
              )}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${!isLocked ? 'group-hover:opacity-100' : ''}`}
                style={{
                  border: `2px solid ${isLocked ? 'rgba(62, 76, 67, 0.2)' : `${primaryColor}20`}`,
                  borderRadius: '4px',
                  boxShadow: isLocked ? 'none' : `inset 0 0 15px ${primaryColor}10`,
                  opacity: isLocked ? 1 : 0.7,
                }}
              />
            </div>

            {/* 桌面端信息区 */}
            <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="font-pixel text-[11px] tracking-[0.08em]"
                      style={{ color: isLocked ? '#4A5568' : primaryColor }}
                    >
                      {isLocked ? mysteryName : `Level ${index + 1}`}
                    </h3>
                    {!isLocked && (
                      <span
                        className="font-pixel text-[6px] px-1.5 py-0.5 rounded-sm"
                        style={{
                          background: `${primaryColor}15`,
                          color: primaryColor,
                          border: `1px solid ${primaryColor}25`,
                        }}
                      >
                        可探
                      </span>
                    )}
                  </div>
                  <p
                    className="font-pixel text-[10px] tracking-[0.1em] truncate"
                    style={{ color: isLocked ? '#3E4C43' : '#E2E8F0' }}
                  >
                    {isLocked ? mysteryHint : level.name}
                  </p>
                </div>
                <DifficultyBadge
                  difficulty={level.difficulty || 'easy'}
                  isLocked={isLocked}
                  auraColor={primaryColor}
                />
              </div>

              <PixelDivider
                color={isLocked ? '#3E4C43' : primaryColor}
                opacity={isLocked ? 0.3 : 0.25}
              />

              <div className="flex items-center justify-between">
                <p
                  className="font-pixel text-[7px] tracking-[0.08em] flex-1 mr-4"
                  style={{ color: isLocked ? '#2D3748' : '#8D97A8', lineHeight: 1.8 }}
                >
                  {isLocked ? '卦象未明，待天时开启' : level.description}
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
                <MysteryShaIndicator
                  shaCount={level.shaCount}
                  isLocked={isLocked}
                  auraColor={primaryColor}
                />
                <div className="flex gap-0.5 opacity-30">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 h-0.5"
                      style={{ background: isLocked ? '#3E4C43' : primaryColor }}
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
                    ? 'rgba(62, 76, 67, 0.2)'
                    : `linear-gradient(180deg, ${primaryColor} 0%, ${auraColor.secondary} 100%)`,
                  boxShadow: isLocked
                    ? 'none'
                    : `inset -1px -1px 0px rgba(0, 0, 0, 0.2),
                       inset 1px 1px 0px rgba(255, 255, 255, 0.15),
                       0 3px 0px ${auraColor.secondary},
                       0 0 20px ${primaryColor}30`,
                }}
              >
                {isLocked ? (
                  <span
                    className="font-pixel text-[14px]"
                    style={{ color: primaryColor, opacity: 0.4 }}
                  >
                    ◈
                  </span>
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
                  style={{ color: primaryColor }}
                >
                  探索
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

  const handleSelectLevel = (level: LevelWithAura) => {
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

      {/* Layer 1: 渐变遮罩 - 更深沉神秘 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0E1116_85%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1116] via-transparent to-[#0E1116]/70" />

      {/* 神秘风水符号背景纹理 - 极淡八卦纹 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='80' fill='none' stroke='%23C4A06A' stroke-width='0.5'/%3E%3Ccircle cx='100' cy='100' r='60' fill='none' stroke='%23C4A06A' stroke-width='0.5'/%3E%3Ccircle cx='100' cy='100' r='40' fill='none' stroke='%23C4A06A' stroke-width='0.5'/%3E%3Cline x1='100' y1='20' x2='100' y2='180' stroke='%23C4A06A' stroke-width='0.5'/%3E%3Cline x1='20' y1='100' x2='180' y2='100' stroke='%23C4A06A' stroke-width='0.5'/%3E%3Cline x1='43' y1='43' x2='157' y2='157' stroke='%23C4A06A' stroke-width='0.5'/%3E%3Cline x1='157' y1='43' x2='43' y2='157' stroke='%23C4A06A' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          backgroundPosition: 'center center',
        }}
      />

      {/* Layer 2: 内容层 */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-8">
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="font-pixel text-[16px] tracking-[0.1em]"
              style={{
                color: '#F5E4BB',
                textShadow: '2px 2px 0px rgba(0, 0, 0, 0.8), 0 0 20px rgba(240, 217, 156, 0.4)',
              }}
            >
              选择关卡
            </h1>
            <p
              className="font-pixel text-[7px] tracking-[0.15em] mt-1"
              style={{ color: '#9CA3AF' }}
            >
              观气探煞 · 以卦定方
            </p>
          </div>
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
              <div className="w-2 h-0.5 bg-[#6B7280]" />
              <div className="w-1 h-1 bg-[#6B7280]" />
              <div className="w-0.5 h-0.5 bg-[#6B7280]" />
            </div>
            <div
              className="w-1.5 h-1.5 rotate-45"
              style={{
                background: 'linear-gradient(135deg, #C4A06A 0%, #8B6914 100%)',
                opacity: 0.6,
              }}
            />
            <div className="flex items-center gap-1">
              <div className="w-0.5 h-0.5 bg-[#6B7280]" />
              <div className="w-1 h-1 bg-[#6B7280]" />
              <div className="w-2 h-0.5 bg-[#6B7280]" />
            </div>
          </div>

          {/* 提示文字 - 神秘化 */}
          <div
            className="px-4 py-2 rounded"
            style={{
              background: 'rgba(40, 45, 55, 0.5)',
              border: '1px solid rgba(100, 110, 120, 0.25)',
            }}
          >
            <p
              className="font-pixel text-[7px] tracking-[0.15em] text-center"
              style={{ color: '#9CA3AF' }}
            >
              破煞通关 · 方显天机
            </p>
            <p
              className="font-pixel text-[6px] tracking-[0.1em] text-center mt-1.5"
              style={{ color: '#7B8490' }}
            >
              已探 · {levels.filter(l => !l.locked).length} / {levels.length} 境
            </p>
          </div>

          {/* 像素进度条 */}
          <div className="flex items-center gap-1.5">
            {levels.map((level, i) => (
              <div
                key={i}
                className="w-4 h-1.5 rounded-sm transition-all duration-300"
                style={{
                  background: level.locked
                    ? 'rgba(62, 76, 67, 0.25)'
                    : `linear-gradient(90deg, ${level.auraColor.primary} 0%, ${level.auraColor.primary}CC 100%)`,
                  boxShadow: level.locked ? 'none' : `0 0 6px ${level.auraColor.primary}40`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}