import { useState, useEffect } from 'react';
import type { ShaPoint, ShaOption } from '../../types/game';
import { useResponsive } from '../../hooks/useResponsive';

type EventModalProps = {
  shaPoint: ShaPoint;
  onSelect: (optionId: string) => void;
  onClose: () => void;
  visible: boolean;
};

// 全局存储每个煞气点的上次选择（跨组件实例持久化）
const lastSelections = new Map<string, string>();

export function EventModal({
  shaPoint,
  onSelect,
  onClose,
  visible,
}: EventModalProps) {
  const { isMobile } = useResponsive();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // 当弹窗打开时，恢复上次的选择
  useEffect(() => {
    if (visible && shaPoint) {
      const lastSelection = lastSelections.get(shaPoint.id);
      if (lastSelection) {
        setSelectedOption(lastSelection);
      } else {
        setSelectedOption(null);
      }
    }
  }, [visible, shaPoint]);

  if (!visible) return null;

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId);
    // 记住选择
    lastSelections.set(shaPoint.id, optionId);
  };

  const handleConfirm = () => {
    if (selectedOption) {
      onSelect(selectedOption);
      // 不重置选择，保留记忆
    }
  };

  const handleClose = () => {
    onClose();
  };

  const renderOption = (option: ShaOption) => {
    // 移除选中状态的样式，保持一致的按钮外观
    const baseClasses = 'w-full rounded-lg px-4 py-3 text-left font-pixel-cn text-sm transition-colors bg-feng-bg-card text-feng-text-light hover:bg-feng-bg-muted';

    return (
      <button
        key={option.id}
        onClick={() => handleOptionClick(option.id)}
        className={baseClasses}
      >
        {option.label}
      </button>
    );
  };

  // 阻止所有 pointer 事件冒泡到父窗口，避免触发 Devvit 隔离窗口通信错误
  const handleStopPropagation = (e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  if (isMobile) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-end justify-center" 
        onClick={handleStopPropagation}
        onPointerDown={handleStopPropagation}
        onPointerUp={handleStopPropagation}
        onPointerMove={handleStopPropagation}
        onPointerCancel={handleStopPropagation}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={handleClose}
        />

        <div className="animate-slide-up relative w-full max-w-lg rounded-t-2xl bg-feng-bg-panel p-5">
          <h3 className="mb-2 font-pixel-cn text-lg text-feng-text-primary">
            {shaPoint.title} - 如何处置？
          </h3>

          <p className="mb-4 font-ui text-sm leading-relaxed text-feng-text-muted">
            {shaPoint.description}
          </p>

          <div className="space-y-2">
            {shaPoint.options.map(renderOption)}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 rounded-lg bg-feng-bg-deep py-3 font-pixel-cn text-xs text-feng-text-dim"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              className="flex-1 rounded-lg bg-feng-accent py-3 font-pixel-cn text-xs text-feng-bg-deep transition-opacity disabled:opacity-50"
            >
              确认处置
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="animate-slide-in-right absolute right-0 top-0 z-50 h-full w-80 bg-feng-bg-panel/95 backdrop-blur-sm" 
      onClick={handleStopPropagation}
      onPointerDown={handleStopPropagation}
      onPointerUp={handleStopPropagation}
      onPointerMove={handleStopPropagation}
      onPointerCancel={handleStopPropagation}
    >
      <div className="flex h-full flex-col p-5">
        <h3 className="mb-2 font-pixel-cn text-xl text-feng-text-primary">
          {shaPoint.title}处置
        </h3>

        <p className="mb-6 font-ui text-sm leading-relaxed text-feng-text-muted">
          {shaPoint.description}
        </p>

        <div className="mb-4 rounded-lg bg-feng-bg-card p-3">
          <p className="font-pixel text-xs text-feng-accent">
            选择正确的处置方式化解煞气
          </p>
        </div>

        <div className="space-y-2">
          {shaPoint.options.map(renderOption)}
        </div>

        <div className="mt-auto space-y-3">
          <button
            onClick={handleConfirm}
            disabled={!selectedOption}
            className="w-full rounded-lg bg-feng-accent py-3 font-pixel-cn text-base text-feng-bg-deep transition-opacity disabled:opacity-50"
          >
            确认处置
          </button>
          <button
            onClick={handleClose}
            className="w-full rounded-lg bg-feng-bg-deep py-2 font-pixel-cn text-xs text-feng-text-dim"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
