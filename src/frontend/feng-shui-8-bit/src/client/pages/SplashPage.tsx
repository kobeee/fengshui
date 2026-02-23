import React, { type MouseEvent, type PointerEvent } from 'react';
import { requestExpandedMode } from '@devvit/web/client';

export function SplashPage() {
  const handlePlay = (e: MouseEvent) => {
    requestExpandedMode(e.nativeEvent, 'game');
  };

  // 阻止所有 pointer 事件冒泡到父窗口，避免触发 Devvit 隔离窗口通信错误
  const handleStopPropagation = (e: PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="relative w-full h-full min-h-[320px] overflow-hidden" 
      onClick={handleStopPropagation}
      onPointerDown={handleStopPropagation}
      onPointerUp={handleStopPropagation}
      onPointerMove={handleStopPropagation}
      onPointerCancel={handleStopPropagation}
    >
      {/* 背景图 */}
      <img
        src="/images/home-v1.0.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 渐变遮罩 - 从四周向中心渐变，突出中间内容 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0E1116_90%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1116] via-transparent to-[#0E1116]/60" />

      {/* 内容层 - 居中布局，增加呼吸感 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
        {/* Glassmorphism 卡片容器 */}
        <div className="relative">
          {/* 外层光晕 - 增强玻璃质感 */}
          <div
            className="absolute -inset-3 rounded-sm"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(196, 160, 106, 0.15) 0%, transparent 70%)',
            }}
          />
          
          {/* 8-bit风格边框装饰 - 更精致的层次 */}
          <div className="absolute -inset-1.5 border border-[#C4A06A]/30 rounded-sm" />
          <div className="absolute -inset-0.5 border-2 border-[#C4A06A]/40 rounded-sm" />

          {/* 主内容卡片 - Glassmorphism 毛玻璃效果，大幅度透明 */}
          <div
            className="relative px-10 py-32 min-w-[280px] rounded-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 35, 45, 0.05) 0%, rgba(21, 26, 34, 0.08) 100%)',
              backdropFilter: 'blur(8px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
              border: '3px solid rgba(196, 160, 106, 0.35)',
              boxShadow: `
                inset 0 1px 1px rgba(255, 255, 255, 0.06),
                inset 0 0 80px rgba(196, 160, 106, 0.03),
                0 12px 40px rgba(0, 0, 0, 0.35),
                0 0 120px rgba(196, 160, 106, 0.06)
              `,
            }}
          >
            {/* 标题区 - 像素字体 + 高级质感 */}
            <div className="text-center mb-12">
              <h1
                className="font-pixel text-[20px] leading-relaxed tracking-[0.08em]"
                style={{
                  color: '#F5E4BB',
                  textShadow: '2px 2px 0px rgba(0, 0, 0, 0.8), 0 0 30px rgba(240, 217, 156, 0.5)',
                }}
              >
                八比特风水师
              </h1>
              <p
                className="mt-6 font-pixel text-[8px] tracking-[0.25em]"
                style={{ color: '#AAB3C2' }}
              >
                8-BIT FENG SHUI MASTER
              </p>
            </div>

            {/* 像素分隔线 - 像素方块风格 */}
            <div className="flex items-center justify-center gap-2 mb-12">
              <div className="w-8 h-[2px] bg-[#3E4C43]" />
              <div className="w-2 h-2 bg-[#C4A06A]" />
              <div className="w-3 h-3 bg-[#E6D4B4]" />
              <div className="w-2 h-2 bg-[#C4A06A]" />
              <div className="w-8 h-[2px] bg-[#3E4C43]" />
            </div>

            {/* 说明文字 - 像素字体 + 充足行高 */}
            <p
              className="font-pixel text-[11px] text-center leading-[2.6] mb-16"
              style={{ color: '#E2E8F0' }}
            >
              点击煞气点，摆放风水道具
              <br />
              让阴郁的房间重获温暖
            </p>

            {/* 按钮区 - 像素字体 + 增加间距 */}
            <div className="flex flex-col items-center gap-8">
              {/* 像素风格按钮 - 3D效果 + 光晕 */}
              <button
                onClick={handlePlay}
                className="group relative px-14 py-4 active:translate-y-[2px] transition-all duration-150"
                style={{
                  background: 'linear-gradient(180deg, #D4B07A 0%, #B8904F 100%)',
                  boxShadow: `
                    inset -2px -2px 0px rgba(0, 0, 0, 0.25),
                    inset 2px 2px 0px rgba(255, 255, 255, 0.25),
                    0 4px 0px #5C4020,
                    0 6px 12px rgba(0, 0, 0, 0.3),
                    0 0 24px rgba(196, 160, 106, 0.25)
                  `,
                }}
              >
                {/* 按钮内边框 */}
                <div
                  className="absolute inset-1.5 pointer-events-none"
                  style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}
                />

                <span className="relative font-pixel text-[12px] text-[#0E1116] tracking-[0.1em]">
                  进入游戏
                </span>
              </button>

              <p
                className="font-pixel text-[7px] tracking-[0.15em]"
                style={{ color: '#6B7280' }}
              >
                点击展开完整体验
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}