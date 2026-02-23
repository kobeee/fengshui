import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { GameState, GameAction, Level, Position, CompassSpeed, ShaPoint, GameStateMachine } from '../types/game';

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
  // 新增状态机
  gameState: 'scanning',
  isComparingCold: false,
  isPreviouslyCompleted: false,
  showCompletionModal: false,
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
        gameState: 'scanning',
      };
    }

    case 'LOAD_LEVEL_WITH_PREVIOUS': {
      const level = resetShaPoints(action.level);
      const isPreviously = action.isPreviouslyCompleted;
      return {
        ...initialState,
        currentLevel: level,
        currentPage: 'play',
        // 如果之前已通关，直接显示暖图
        showWarmImage: isPreviously,
        isCompleted: isPreviously,
        gameState: isPreviously ? 'completed' : 'scanning',
        isPreviouslyCompleted: isPreviously,
        // 之前已通关时显示通关弹窗
        showCompletionModal: isPreviously,
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
        gameState: action.shaPoint !== null ? 'event_modal' : 'scanning',
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        showEventModal: false,
        gameState: 'scanning',
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
        // 最后一个煞气被净化后进入 transitioning 状态
        gameState: isComplete ? 'transitioning' : 'scanning',
        // transitioning 时开始显示暖图（渐变）
        showWarmImage: isComplete ? true : state.showWarmImage,
        placedItems: [],
      };
    }

    case 'START_TRANSITION':
      return {
        ...state,
        gameState: 'transitioning',
        showWarmImage: true,
      };

    case 'FINISH_TRANSITION':
      return {
        ...state,
        gameState: 'completed',
        isCompleted: true,
        showCompletionModal: true,
      };

    case 'SET_GAME_STATE':
      return {
        ...state,
        gameState: action.gameState,
      };

    case 'SET_COMPARING':
      return {
        ...state,
        isComparingCold: action.isComparing,
        gameState: action.isComparing ? 'comparing' : 'completed',
      };

    case 'COMPLETE_LEVEL':
      return { ...state, isCompleted: true, showWarmImage: true, gameState: 'completed' };

    case 'RESET_LEVEL': {
      if (!state.currentLevel) return state;
      const level = resetShaPoints(state.currentLevel);
      return {
        ...initialState,
        currentLevel: level,
        currentPage: 'play',
      };
    }

    case 'DISMISS_COMPLETION_MODAL':
      return {
        ...state,
        showCompletionModal: false,
      };

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
  loadLevel: (level: Level, isPreviouslyCompleted?: boolean) => void;
  updateCompass: (position: Position, speed: CompassSpeed) => void;
  activateSha: (shaPoint: ShaPoint | null) => void;
  closeModal: () => void;
  resolveSha: (shaId: string, itemId: string | null) => void;
  resetLevel: () => void;
  setGameState: (gameState: GameStateMachine) => void;
  setComparing: (isComparing: boolean) => void;
  startTransition: () => void;
  finishTransition: () => void;
  dismissCompletionModal: () => void;
};

export const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const value: GameContextValue = {
    state,
    dispatch,
    navigate: (page) => dispatch({ type: 'NAVIGATE', page }),
    loadLevel: (level, isPreviouslyCompleted) => {
      if (isPreviouslyCompleted) {
        dispatch({ type: 'LOAD_LEVEL_WITH_PREVIOUS', level, isPreviouslyCompleted });
      } else {
        dispatch({ type: 'LOAD_LEVEL', level });
      }
    },
    updateCompass: (position, speed) =>
      dispatch({ type: 'UPDATE_COMPASS', position, speed }),
    activateSha: (shaPoint) => dispatch({ type: 'ACTIVATE_SHA', shaPoint }),
    closeModal: () => dispatch({ type: 'CLOSE_MODAL' }),
    resolveSha: (shaId, itemId) =>
      dispatch({ type: 'RESOLVE_SHA', shaId, itemId }),
    resetLevel: () => dispatch({ type: 'RESET_LEVEL' }),
    setGameState: (gameState) => dispatch({ type: 'SET_GAME_STATE', gameState }),
    setComparing: (isComparing) => dispatch({ type: 'SET_COMPARING', isComparing }),
    startTransition: () => dispatch({ type: 'START_TRANSITION' }),
    finishTransition: () => dispatch({ type: 'FINISH_TRANSITION' }),
    dismissCompletionModal: () => dispatch({ type: 'DISMISS_COMPLETION_MODAL' }),
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
