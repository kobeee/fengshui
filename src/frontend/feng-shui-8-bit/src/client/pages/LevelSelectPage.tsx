import { useGame } from '../stores/GameContext';
import { useResponsive } from '../hooks/useResponsive';
import { levels } from '../data/levels';

export function LevelSelectPage() {
  const { navigate, loadLevel } = useGame();
  const { isMobile } = useResponsive();

  const handleSelectLevel = (level: (typeof levels)[0]) => {
    if (level.locked) return;
    loadLevel(level);
  };

  return (
    <div
      className={`flex flex-col bg-feng-bg-panel ${
        isMobile ? 'min-h-screen' : 'min-h-screen p-8'
      }`}
    >
      <header className="flex items-center justify-between px-3.5 py-3.5">
        <h1 className="font-pixel-cn text-2xl text-feng-text-primary">
          选择关卡
        </h1>
        <button
          onClick={() => navigate('start')}
          className="rounded bg-feng-bg-card px-4 py-1.5 font-pixel-cn text-xs text-feng-text-light transition-colors hover:bg-feng-bg-muted"
        >
          ← 返回
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-auto px-3.5 py-2">
        {levels.map((level, index) => (
          <div
            key={level.id}
            onClick={() => handleSelectLevel(level)}
            className={`flex items-center gap-3 rounded-lg bg-feng-bg-card p-3 transition-colors ${
              level.locked
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:bg-feng-bg-muted'
            }`}
          >
            <div
              className={`flex-shrink-0 overflow-hidden rounded ${
                level.locked ? 'bg-feng-border' : ''
              } ${isMobile ? 'h-24 w-24' : 'h-[132px] w-[200px]'}`}
            >
              {level.images.cold ? (
                <img
                  src={level.images.cold}
                  alt={level.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-feng-border">
                  <span className="font-pixel text-xs text-feng-text-dim">
                    Lv.{index + 1}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-center gap-1.5">
              <h3 className="font-pixel-cn text-base text-feng-text-primary">
                Level {index + 1}: {level.name}
              </h3>
              <p className="font-pixel-cn text-xs text-feng-text-muted">
                {level.description}
              </p>
              {!level.locked && level.shaCount > 0 && (
                <div className="flex gap-1">
                  {Array.from({ length: level.shaCount }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm bg-feng-accent ${isMobile ? 'h-2 w-4' : 'h-2.5 w-6'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div
              className={`flex flex-shrink-0 items-center justify-center rounded ${
                level.locked ? 'bg-feng-bg-muted' : 'bg-feng-accent'
              } ${isMobile ? 'h-12 w-12' : 'h-[72px] w-[72px]'}`}
            >
              {level.locked ? (
                <span className="text-lg">🔒</span>
              ) : (
                <span className={`font-ui text-feng-bg-deep ${isMobile ? 'text-xl' : 'text-3xl'}`}>▶</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <footer className="px-3.5 pb-3.5 pt-2 text-center font-pixel-cn text-xs text-feng-text-dim">
        通关解锁下一关卡
      </footer>
    </div>
  );
}