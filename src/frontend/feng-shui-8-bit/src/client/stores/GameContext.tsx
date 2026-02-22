import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { GameState, GameAction, Level, Position, CompassSpeed, ShaPoint } from '../types/game';

const initialState: GameState = {
  currentPage: 'start',
  currentLevel: null,
  resolvedCount: 0,
  compassPosition: { x: 0.5, y: 0.5 },
  compassSpeed: 'normal',
  activeShaPoint: null,
  showEventModal: false,
  isCompleted: false,
  showWarmImage: false,
  placedItems: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, currentPage: action.page };

    case 'LOAD_LEVEL': {
      const level = resetShaPoints(action.level);
      return {
        ...initialState,
        currentLevel: level,
        currentPage: 'play',
      };
    }

    case 'UPDATE_COMPASS':
      return {
        ...state,
        compassPosition: action.position,
        compassSpeed: action.speed,
      };

    case 'ACTIVATE_SHA':
      return {
        ...state,
        activeShaPoint: action.shaPoint,
        showEventModal: action.shaPoint !== null,
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        showEventModal: false,
      };

    case 'RESOLVE_SHA': {
      if (!state.currentLevel) return state;

      const updatedPoints = state.currentLevel.shaPoints.map((sha) =>
        sha.id === action.shaId ? { ...sha, resolved: true } : sha
      );

      const newCount = state.resolvedCount + 1;
      const isComplete = newCount === state.currentLevel.shaPoints.length;

      // 不再放置道具图片
      return {
        ...state,
        currentLevel: { ...state.currentLevel, shaPoints: updatedPoints },
        resolvedCount: newCount,
        activeShaPoint: null,
        showEventModal: false,
        isCompleted: isComplete,
        showWarmImage: isComplete,
        placedItems: [],
      };
    }

    case 'COMPLETE_LEVEL':
      return { ...state, isCompleted: true, showWarmImage: true };

    case 'RESET_LEVEL': {
      if (!state.currentLevel) return state;
      const level = resetShaPoints(state.currentLevel);
      return {
        ...initialState,
        currentLevel: level,
        currentPage: 'play',
      };
    }

    default:
      return state;
  }
}

/** 重置关卡煞点状态 */
function resetShaPoints(level: Level): Level {
  return {
    ...level,
    shaPoints: level.shaPoints.map((sha) => ({ ...sha, resolved: false })),
  };
}

export type GameContextValue = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  navigate: (page: GameState['currentPage']) => void;
  loadLevel: (level: Level) => void;
  updateCompass: (position: Position, speed: CompassSpeed) => void;
  activateSha: (shaPoint: ShaPoint | null) => void;
  closeModal: () => void;
  resolveSha: (shaId: string, itemId: string | null) => void;
  resetLevel: () => void;
};

export const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const value: GameContextValue = {
    state,
    dispatch,
    navigate: (page) => dispatch({ type: 'NAVIGATE', page }),
    loadLevel: (level) => dispatch({ type: 'LOAD_LEVEL', level }),
    updateCompass: (position, speed) =>
      dispatch({ type: 'UPDATE_COMPASS', position, speed }),
    activateSha: (shaPoint) => dispatch({ type: 'ACTIVATE_SHA', shaPoint }),
    closeModal: () => dispatch({ type: 'CLOSE_MODAL' }),
    resolveSha: (shaId, itemId) =>
      dispatch({ type: 'RESOLVE_SHA', shaId, itemId }),
    resetLevel: () => dispatch({ type: 'RESET_LEVEL' }),
  };

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
