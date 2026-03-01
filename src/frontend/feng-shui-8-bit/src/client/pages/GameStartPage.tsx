import type { CSSProperties, ReactNode } from 'react';
import React, { useState, useEffect } from 'react';
import { CompassIcon, GourdIcon, SunIcon } from '../components/game/StepIcons';
import { useGame } from '../stores/GameContext';

type IntroStep = {
  key: string;
  label: string;
  hint: string;
  accent: string;
  icon: ReactNode;
  delay: string;
};

function StepConnector() {
  return (
    <div className="flex items-center justify-center px-0.5 pt-6 sm:px-1 sm:pt-7" aria-hidden="true">
      <div className="relative h-[1px] w-4 bg-[#5F6A7D] sm:w-6">
        <div className="absolute right-0 top-1/2 size-0.5 -translate-y-1/2 rotate-45 bg-[#8A95A6]" />
      </div>
    </div>
  );
}

function IntroStepCard({ step }: { step: IntroStep }) {
  const cardStyle: CSSProperties = {
    animationDelay: step.delay,
  };

  const iconFrameStyle: CSSProperties = {
    borderColor: `${step.accent}66`,
    background: `linear-gradient(180deg, ${step.accent}24 0%, rgba(18, 24, 34, 0.48) 100%)`,
    boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 0 16px ${step.accent}26`,
  };

  return (
    <article className="intro-step w-[80px] text-center sm:w-[100px]" style={cardStyle}>
      <div
        className="mx-auto mb-2 flex size-12 items-center justify-center border-2 sm:size-14"
        style={iconFrameStyle}
      >
        {step.icon}
      </div>
      <p className="font-pixel text-[7px] tracking-[0.06em] text-[#D8C08F] sm:text-[8px]">{step.label}</p>
      <p className="mt-0.5 font-pixel text-[5px] leading-[1.7] text-[#7B8698] sm:text-[6px]">{step.hint}</p>
    </article>
  );
}

export function GameStartPage() {
  const { navigate } = useGame();
  const [bgLoaded, setBgLoaded] = useState(false);

  // 预加载背景图
  useEffect(() => {
    const img = new Image();
    img.onload = () => setBgLoaded(true);
    img.src = '/images/home-v1.0-optimized.png';
    
    // 如果图片已经缓存，使用 queueMicrotask 避免同步 setState
    if (img.complete) {
      queueMicrotask(() => setBgLoaded(true));
    }
  }, []);

  const steps: IntroStep[] = [
    {
      key: 'scan',
      label: 'Find Sha',
      hint: 'Detect negative energy',
      accent: '#8EA0C2',
      icon: <CompassIcon size={24} color="#D8B47A" className="compass-animate" />,
      delay: '160ms',
    },
    {
      key: 'resolve',
      label: 'Neutralize',
      hint: 'Place Feng Shui items',
      accent: '#C4A06A',
      icon: <GourdIcon size={24} color="#D7AF73" className="gourd-animate" />,
      delay: '260ms',
    },
    {
      key: 'warm',
      label: 'Transform',
      hint: 'Room becomes warm',
      accent: '#D7B772',
      icon: <SunIcon size={24} color="#E7C98F" className="sun-animate" />,
      delay: '360ms',
    },
  ];

  const handleStopPropagation = (e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="relative h-dvh overflow-hidden bg-[#0E1116]"
      onClick={handleStopPropagation}
      onPointerDown={handleStopPropagation}
      onPointerUp={handleStopPropagation}
      onPointerMove={handleStopPropagation}
      onPointerCancel={handleStopPropagation}
    >
      {/* 背景 - 加载占位符 */}
      <div 
        className="absolute inset-0 bg-[#0E1116]"
        style={{
          background: bgLoaded ? undefined : 'linear-gradient(135deg, #0E1116 0%, #1A1D24 50%, #0E1116 100%)',
        }}
      />
      
      {/* 背景图 - 加载完成后显示 */}
      <img
        src="/images/home-v1.0-optimized.png"
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* 加载指示器 - 图片未加载时显示 */}
      {!bgLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-[#C4A06A] animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-[#C4A06A] animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-[#C4A06A] animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="font-pixel text-[8px] text-[#6B7280]">LOADING</span>
          </div>
        </div>
      )}

      {/* 背景遮罩 - 单层径向渐变，与 SplashPage 风格一致 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0E1116_90%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1116] via-transparent to-[#0E1116]/60" />

      <main className="relative z-10 flex h-full items-center justify-center px-3 py-2 sm:px-5 sm:py-2">
        <section className="intro-shell relative w-full max-w-[600px]">
          {/* 外层光晕 - 增强玻璃质感 */}
          <div
            className="pointer-events-none absolute -inset-3 rounded-sm sm:-inset-4"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(196, 160, 106, 0.18) 0%, transparent 70%)',
            }}
          />

          {/* 8-bit风格双层边框 */}
          <div className="pointer-events-none absolute -inset-1.5 border border-[#C4A06A]/30 rounded-sm sm:-inset-2" />
          <div className="pointer-events-none absolute -inset-0.5 border-2 border-[#C4A06A]/45 rounded-sm sm:-inset-1" />

          <div
            className="relative overflow-hidden px-8 py-10 sm:px-12 sm:py-12"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 35, 45, 0.35) 0%, rgba(21, 26, 34, 0.4) 100%)',
              backdropFilter: 'blur(24px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
              border: '2px solid rgba(196, 160, 106, 0.45)',
              boxShadow:
                'inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 0 50px rgba(196, 160, 106, 0.03), 0 8px 32px rgba(0, 0, 0, 0.35), 0 0 100px rgba(196, 160, 106, 0.08)',
            }}
          >
            <div className="intro-sheen absolute inset-y-0 -left-1/3 w-1/3" aria-hidden="true" />

            <header className="text-center">
              <p className="font-pixel text-[6px] tracking-[0.2em] text-[#8C98AB] sm:text-[6px]">Sense · Balance · Harmony</p>
              <h1
                className="mt-1 text-balance font-pixel text-[20px] leading-[1.3] tracking-[0.08em] sm:text-[22px]"
                style={{
                  color: '#F5E4BB',
                  textShadow: '2px 2px 0 rgba(0, 0, 0, 0.82), 0 0 20px rgba(240, 217, 156, 0.32)',
                }}
              >
                FENG SHUI MASTER
              </h1>
              <p className="mt-1 font-pixel text-[6px] tracking-[0.2em] text-[#7C889A] sm:text-[7px]">
                8-BIT HARMONY
              </p>
            </header>

            <div className="mx-auto mb-3 mt-2 flex w-fit items-center gap-1.5 sm:mb-4 sm:mt-3 sm:gap-2" aria-hidden="true">
              <div className="h-[1px] w-6 bg-[#455063] sm:w-8" />
              <div className="size-1 bg-[#C4A06A]" />
              <div className="size-1.5 bg-[#D9C291]" />
              <div className="size-1 bg-[#C4A06A]" />
              <div className="h-[1px] w-6 bg-[#455063] sm:w-8" />
            </div>

            <div className="mb-3 flex items-start justify-center gap-1 sm:mb-4 sm:gap-2">
              {steps.map((step, index) => (
                <React.Fragment key={step.key}>
                  <IntroStepCard step={step} />
                  {index < steps.length - 1 ? <StepConnector /> : null}
                </React.Fragment>
              ))}
            </div>

            <p className="text-pretty text-center font-pixel text-[7px] leading-[1.9] tracking-[0.1em] text-[#9CA6B6] sm:text-[8px]">
              Room energy is unbalanced
              <br />
              Fix it with Feng Shui items
            </p>

            <div className="mt-3 flex flex-col items-center gap-1.5 sm:mt-4 sm:gap-2">
              <button
                onClick={() => navigate('select')}
                className="group relative px-8 py-2.5 font-pixel text-[9px] tracking-[0.1em] text-[#1A1611] transition-transform duration-150 active:translate-y-[2px] sm:px-10 sm:py-3 sm:text-[10px]"
                style={{
                  background: 'linear-gradient(180deg, #D7B87F 0%, #C39C62 58%, #AA8650 100%)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255, 255, 255, 0.32), inset 0 -1px 0 rgba(0, 0, 0, 0.28), 0 4px 0 #5A3F22, 0 6px 12px rgba(0, 0, 0, 0.4)',
                }}
              >
                <span className="absolute inset-1 border border-white/15" aria-hidden="true" />
                <span className="relative">START</span>
              </button>

              <p className="font-pixel text-[5px] tracking-[0.14em] text-[#667286] sm:text-[6px]">Select a level to begin</p>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes intro-card-enter {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes intro-step-enter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes intro-sheen {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          15% {
            opacity: 0.35;
          }
          35% {
            opacity: 0;
          }
          100% {
            transform: translateX(360%);
            opacity: 0;
          }
        }

        .intro-shell {
          animation: intro-card-enter 560ms ease-out both;
        }

        .intro-step {
          opacity: 0;
          animation: intro-step-enter 380ms ease-out forwards;
        }

        .intro-sheen {
          background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.08) 52%, transparent 100%);
          animation: intro-sheen 7s linear infinite;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-shell,
          .intro-step,
          .intro-sheen {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
