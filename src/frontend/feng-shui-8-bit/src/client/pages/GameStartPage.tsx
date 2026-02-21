import type { ReactNode } from 'react';
import { useGame } from '../stores/GameContext';
import { CompassIcon, GourdIcon, SunIcon } from '../components/game/StepIcons';

/** 浮动煞气粒子组件 */
function ShaParticle({ 
  delay, 
  size, 
  top, 
  left,
  animationClass 
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

/** 步骤项组件 */
function StepItem({ 
  icon, 
  label, 
  animClass,
  labelColor,
  bgOpacity,
  borderOpacity,
}: { 
  icon: ReactNode; 
  label: string; 
  animClass: string;
  labelColor: string;
  bgOpacity: number;
  borderOpacity: number;
}) {
  return (
    <div className={`flex flex-col items-center text-center ${animClass}`}>
      <div
        className="w-12 h-12 rounded flex items-center justify-center mb-3"
        style={{
          background: `rgba(196, 160, 106, ${bgOpacity})`,
          border: `1px solid rgba(196, 160, 106, ${borderOpacity})`,
        }}
      >
        {icon}
      </div>
      <span
        className="font-pixel text-[8px] tracking-[0.12em]"
        style={{ color: labelColor }}
      >
        {label}
      </span>
    </div>
  );
}

export function GameStartPage() {
  const { navigate } = useGame();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0E1116]">
      {/* Layer 0: 全屏背景图 */}
      <img
        src="/images/home-v1.0.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Layer 1: 渐变遮罩 - 四周暗化突出中间 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0E1116_85%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1116] via-transparent to-[#0E1116]/70" />

      {/* Layer 2: 浮动煞气粒子 */}
      <ShaParticle delay="0s" size={10} top="15%" left="8%" animationClass="sha-particle-1" />
      <ShaParticle delay="0.5s" size={8} top="20%" left="82%" animationClass="sha-particle-2" />
      <ShaParticle delay="1s" size={12} top="75%" left="12%" animationClass="sha-particle-3" />
      <ShaParticle delay="1.5s" size={6} top="70%" left="85%" animationClass="sha-particle-1" />

      {/* Layer 3: 内容层 - 垂直居中 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* 主卡片容器 */}
        <div className="relative w-full max-w-[360px] card-animate-in">
          {/* 外层光晕 */}
          <div
            className="absolute -inset-4 rounded-lg"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(196, 160, 106, 0.2) 0%, transparent 65%)',
            }}
          />

          {/* 像素回字纹边框 - 外层 */}
          <div className="absolute -inset-2 border border-[#C4A06A]/25 rounded-lg" />
          {/* 像素回字纹边框 - 内层 */}
          <div className="absolute -inset-1 border-2 border-[#C4A06A]/35 rounded-lg" />

          {/* 主卡片 - 强玻璃质感 */}
          <div
            className="relative px-8 py-10 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 35, 45, 0.25) 0%, rgba(21, 26, 34, 0.35) 100%)',
              backdropFilter: 'blur(30px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
              border: '2px solid rgba(196, 160, 106, 0.4)',
              boxShadow: `
                inset 0 1px 1px rgba(255, 255, 255, 0.08),
                inset 0 0 60px rgba(196, 160, 106, 0.05),
                0 8px 32px rgba(0, 0, 0, 0.4),
                0 0 80px rgba(196, 160, 106, 0.1)
              `,
            }}
          >
            {/* Layer 4: 罗盘网格纹理背景 */}
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                backgroundImage: `
                  radial-gradient(circle at center, transparent 30%, rgba(196, 160, 106, 0.02) 31%, transparent 32%),
                  radial-gradient(circle at center, transparent 50%, rgba(196, 160, 106, 0.015) 51%, transparent 52%),
                  radial-gradient(circle at center, transparent 70%, rgba(196, 160, 106, 0.01) 71%, transparent 72%),
                  linear-gradient(rgba(196, 160, 106, 0.02) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(196, 160, 106, 0.02) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 100% 100%, 100% 100%, 32px 32px, 32px 32px',
              }}
            />

            {/* Layer 5: 内容层 */}
            {/* 游戏标题 - 增大尺寸 */}
            <div className="relative text-center mb-10">
              <h1
                className="font-pixel text-[22px] tracking-[0.1em] mb-4"
                style={{
                  color: '#F5E4BB',
                  textShadow: '2px 2px 0px rgba(0, 0, 0, 0.8), 0 0 40px rgba(240, 217, 156, 0.5)',
                }}
              >
                八比特风水师
              </h1>
              <p
                className="font-pixel text-[9px] tracking-[0.15em]"
                style={{ color: '#8D97A8' }}
              >
                点击煞气 · 摆放道具 · 重获温暖
              </p>
            </div>

            {/* 像素分隔线 - 祥云纹风格 */}
            <div className="relative flex items-center justify-center gap-1 mb-10">
              <div className="w-4 h-[2px] bg-[#3E4C43]" />
              <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#C4A06A]" />
              <div className="w-4 h-[2px] bg-[#3E4C43]" />
              <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#E6D4B4]" />
              <div className="w-4 h-[2px] bg-[#3E4C43]" />
            </div>

            {/* 玩法说明 - 三步骤图标化横向排列 */}
            <div className="relative flex justify-center items-start gap-4 mb-10">
              <StepItem
                icon={<CompassIcon size={28} className="compass-animate" />}
                label="寻煞气"
                animClass="step-animate-1"
                labelColor="#AAB3C2"
                bgOpacity={0.12}
                borderOpacity={0.25}
              />

              {/* 连接线 */}
              <svg width="20" height="48" viewBox="0 0 20 48" className="mt-4 step-animate-1">
                <defs>
                  <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3E4C43" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#C4A06A" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#3E4C43" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="24" x2="12" y2="24" stroke="url(#line-grad-1)" strokeWidth="1" />
                <polygon points="12,21 18,24 12,27" fill="#C4A06A" opacity="0.5" />
              </svg>

              <StepItem
                icon={<GourdIcon size={28} className="gourd-animate" />}
                label="化煞气"
                animClass="step-animate-2"
                labelColor="#AAB3C2"
                bgOpacity={0.15}
                borderOpacity={0.3}
              />

              {/* 连接线 */}
              <svg width="20" height="48" viewBox="0 0 20 48" className="mt-4 step-animate-2">
                <line x1="0" y1="24" x2="12" y2="24" stroke="url(#line-grad-1)" strokeWidth="1" />
                <polygon points="12,21 18,24 12,27" fill="#D4B07A" opacity="0.5" />
              </svg>

              <StepItem
                icon={<SunIcon size={28} className="sun-animate" />}
                label="转暖色"
                animClass="step-animate-3"
                labelColor="#E6D4B4"
                bgOpacity={0.2}
                borderOpacity={0.35}
              />
            </div>

            {/* 引导语 */}
            <p
              className="relative text-center font-pixel text-[9px] tracking-[0.1em] mb-5"
              style={{ color: '#6B7280' }}
            >
              准备好改变房间气场了吗？
            </p>

            {/* 主按钮 */}
            <button
              onClick={() => navigate('select')}
              className="relative w-full py-4 active:translate-y-[2px] transition-all duration-150"
              style={{
                background: 'linear-gradient(180deg, #D4B07A 0%, #B8904F 100%)',
                boxShadow: `
                  inset -2px -2px 0px rgba(0, 0, 0, 0.25),
                  inset 2px 2px 0px rgba(255, 255, 255, 0.25),
                  0 4px 0px #5C4020,
                  0 6px 12px rgba(0, 0, 0, 0.3),
                  0 0 30px rgba(196, 160, 106, 0.3)
                `,
              }}
            >
              <div
                className="absolute inset-1.5 pointer-events-none"
                style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}
              />
              <span className="relative font-pixel text-[13px] text-[#0E1116] tracking-[0.12em]">
                选择关卡
              </span>
            </button>
          </div>
        </div>

        {/* 底部文案 */}
        <p
          className="mt-8 font-pixel text-[7px] tracking-[0.15em] opacity-0"
          style={{ color: '#6B7280', animation: 'fade-in 0.5s ease-out 1.2s forwards' }}
        >
          Lo-Fi Chill · 8-Bit SFX · Cozy Puzzle
        </p>
      </div>
    </div>
  );
}
