import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GameProvider } from './stores/GameContext';
import { LevelCompletionProvider } from './stores/LevelCompletionContext';
import { useGame } from './stores/GameContext';

// 页面组件
import { GameStartPage } from './pages/GameStartPage';
import { LevelSelectPage } from './pages/LevelSelectPage';
import { GameplayPage } from './pages/GameplayPage';

/**
 * 主应用路由
 */
function AppRouter() {
  const { state } = useGame();
  const { currentPage } = state;

  switch (currentPage) {
    case 'start':
      return <GameStartPage />;
    case 'select':
      return <LevelSelectPage />;
    case 'play':
      return <GameplayPage />;
    default:
      return <GameStartPage />;
  }
}

/**
 * Game 入口 - Expanded View
 */
export function GameApp() {
  return (
    <StrictMode>
      <LevelCompletionProvider>
        <GameProvider>
          <AppRouter />
        </GameProvider>
      </LevelCompletionProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<GameApp />);