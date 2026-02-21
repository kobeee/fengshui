import { useGame } from '../stores/GameContext';

export function GameStartPage() {
  const { navigate } = useGame();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0E1116]">
      {/* 全屏背景图 */}
      <img
        src="/images/home-v1.1.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 渐变遮罩 - 四周暗化突出中间 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0E1116_85%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1116] via-transparent to-[#0E1116]/70" />

      {/* 内容层 - 垂直居中 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* 主卡片容器 */}
        <div className="relative w-full max-w-[360px]">
          {/* 外层光晕 */}
          <div
            className="absolute -inset-4 rounded-lg"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(196, 160, 106, 0.2) 0%, transparent 65%)',
            }}
          />

          {/* 多层边框装饰 */}
          <div className="absolute -inset-2 border border-[#C4A06A]/25 rounded-lg" />
          <div className="absolute -inset-1 border-2 border-[#C4A06A]/35 rounded-lg" />

          {/* 主卡片 - 强玻璃质感 */}
          <div
            className="relative px-8 py-10 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 35, 45, 0.25) 0%, rgba(21, 26, 34, 0.35) 100%)',
              backdropFilter: 'blur(20px) saturate(1.4)',
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
            {/* 游戏标题 */}
            <div className="text-center mb-8">
              <h1
                className="font-pixel text-[18px] tracking-[0.08em] mb-3"
                style={{
                  color: '#F5E4BB',
                  textShadow: '2px 2px 0px rgba(0, 0, 0, 0.7), 0 0 40px rgba(240, 217, 156, 0.4)',
                }}
              >
                八比特风水师
              </h1>
              <p
                className="font-pixel text-[8px] tracking-[0.2em]"
                style={{ color: '#8D97A8' }}
              >
                整理混乱 · 修复气场 · 重获温暖
              </p>
            </div>

            {/* 像素分隔线 */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-[2px] bg-[#3E4C43]" />
              <div className="w-2 h-2 bg-[#C4A06A]" />
              <div className="w-3 h-3 bg-[#E6D4B4]" />
              <div className="w-2 h-2 bg-[#C4A06A]" />
              <div className="w-10 h-[2px] bg-[#3E4C43]" />
            </div>

            {/* 玩法说明 - 三步骤横向排列 */}
            <div className="flex justify-center gap-3 mb-10">
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center mb-2"
                  style={{
                    background: 'rgba(196, 160, 106, 0.15)',
                    border: '1px solid rgba(196, 160, 106, 0.3)',
                  }}
                >
                  <span
                    className="font-pixel text-[14px]"
                    style={{ color: '#C4A06A' }}
                  >
                    ①
                  </span>
                </div>
                <span
                  className="font-pixel text-[7px] tracking-[0.08em]"
                  style={{ color: '#AAB3C2' }}
                >
                  找煞气
                </span>
              </div>

              <div
                className="w-6 h-[1px] mt-5"
                style={{ background: 'linear-gradient(90deg, transparent, #3E4C43, transparent)' }}
              />

              <div className="flex flex-col items-center text-center">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center mb-2"
                  style={{
                    background: 'rgba(196, 160, 106, 0.15)',
                    border: '1px solid rgba(196, 160, 106, 0.3)',
                  }}
                >
                  <span
                    className="font-pixel text-[14px]"
                    style={{ color: '#C4A06A' }}
                  >
                    ②
                  </span>
                </div>
                <span
                  className="font-pixel text-[7px] tracking-[0.08em]"
                  style={{ color: '#AAB3C2' }}
                >
                  选道具
                </span>
              </div>

              <div
                className="w-6 h-[1px] mt-5"
                style={{ background: 'linear-gradient(90deg, transparent, #3E4C43, transparent)' }}
              />

              <div className="flex flex-col items-center text-center">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center mb-2"
                  style={{
                    background: 'rgba(196, 160, 106, 0.25)',
                    border: '1px solid rgba(196, 160, 106, 0.4)',
                  }}
                >
                  <span
                    className="font-pixel text-[14px]"
                    style={{ color: '#E6D4B4' }}
                  >
                    ③
                  </span>
                </div>
                <span
                  className="font-pixel text-[7px] tracking-[0.08em]"
                  style={{ color: '#E6D4B4' }}
                >
                  暖色转换
                </span>
              </div>
            </div>

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
              <span className="relative font-pixel text-[12px] text-[#0E1116] tracking-[0.12em]">
                选择关卡
              </span>
            </button>
          </div>
        </div>

        {/* 底部文案 */}
        <p
          className="mt-8 font-pixel text-[7px] tracking-[0.15em]"
          style={{ color: '#6B7280' }}
        >
          Lo-Fi Chill · 8-Bit SFX · Cozy Puzzle
        </p>
      </div>
    </div>
  );
}
