import { useState } from 'react';
import type { ShaPoint, ShaOption } from '../../types/game';
import { useResponsive } from '../../hooks/useResponsive';

type EventModalProps = {
  shaPoint: ShaPoint;
  onSelect: (optionId: string) => void;
  onClose: () => void;
  visible: boolean;
};

export function EventModal({
  shaPoint,
  onSelect,
  onClose,
  visible,
}: EventModalProps) {
  const { isMobile } = useResponsive();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (!visible) return null;

  const handleConfirm = () => {
    if (selectedOption) {
      onSelect(selectedOption);
      setSelectedOption(null);
    }
  };

  const handleClose = () => {
    setSelectedOption(null);
    onClose();
  };

  const renderOption = (option: ShaOption) => {
    const isSelected = selectedOption === option.id;
    const baseClasses = 'w-full rounded-lg px-4 py-3 text-left font-pixel-cn text-sm transition-colors';
    const selectedClasses = isSelected
      ? ' bg-feng-accent/20 border-2 border-feng-accent text-feng-text-primary'
      : ' bg-feng-bg-card text-feng-text-light hover:bg-feng-bg-muted';

    return (
      <button
        key={option.id}
        onClick={() => setSelectedOption(option.id)}
        className={`${baseClasses}${selectedClasses}`}
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
