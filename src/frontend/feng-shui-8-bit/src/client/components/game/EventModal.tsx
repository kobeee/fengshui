import React, { useState, useMemo } from 'react';
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

/** 内部弹窗组件 - 使用 key 重置状态 */
function EventModalContent({
  shaPoint,
  onSelect,
  onClose,
}: {
  shaPoint: ShaPoint;
  onSelect: (optionId: string) => void;
  onClose: () => void;
}) {
  const { isMobile } = useResponsive();
  // 使用 useMemo 获取初始值，避免 effect 中的 setState
  const initialSelection = useMemo(() => {
    return lastSelections.get(shaPoint.id) ?? null;
  }, [shaPoint.id]);
  
  const [selectedOption, setSelectedOption] = useState<string | null>(initialSelection);

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
    const isSelected = selectedOption === option.id;
    
    // 选中效果：边框高亮 + 暖金辉光
    const baseStyle: React.CSSProperties = {
      width: '100%',
      borderRadius: '2px',
      padding: '12px 16px',
      textAlign: 'left',
      fontFamily: 'var(--font-pixel-cn)',
      fontSize: '13px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      background: isSelected 
        ? 'linear-gradient(135deg, rgba(196, 160, 106, 0.15) 0%, rgba(196, 160, 106, 0.08) 100%)'
        : 'rgba(32, 39, 54, 0.6)',
      color: isSelected ? '#F5E4BB' : '#D0D6E1',
      border: isSelected 
        ? '2px solid rgba(196, 160, 106, 0.6)' 
        : '1px solid rgba(196, 160, 106, 0.25)',
      boxShadow: isSelected
        ? 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 0 20px rgba(196, 160, 106, 0.15)'
        : 'none',
    };

    return (
      <button
        key={option.id}
        onClick={() => handleOptionClick(option.id)}
        style={baseStyle}
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

        <div className="relative w-full max-w-lg">
          {/* Mobile 端：底部浮起面板 - Glassmorphism */}
          <div 
            className="animate-slide-up relative rounded-t-sm p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 35, 45, 0.92) 0%, rgba(21, 26, 34, 0.95) 100%)',
              backdropFilter: 'blur(24px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
              borderTop: '2px solid rgba(196, 160, 106, 0.45)',
              borderLeft: '2px solid rgba(196, 160, 106, 0.45)',
              borderRight: '2px solid rgba(196, 160, 106, 0.45)',
              boxShadow: `
                inset 0 1px 1px rgba(255, 255, 255, 0.08),
                inset 0 0 40px rgba(196, 160, 106, 0.04),
                0 -8px 32px rgba(0, 0, 0, 0.4),
                0 0 60px rgba(196, 160, 106, 0.08)
              `,
            }}
          >
            {/* 像素分隔线 */}
            <div className="flex items-center justify-center gap-1 mb-4" aria-hidden="true">
              <div className="w-4 h-[1px] bg-[#455063]" />
              <div className="w-1 h-1 bg-[#C4A06A]" />
              <div className="w-1.5 h-1.5 bg-[#E6D4B4]" />
              <div className="w-1 h-1 bg-[#C4A06A]" />
              <div className="w-4 h-[1px] bg-[#455063]" />
            </div>

            <h3 
              className="mb-2 font-pixel text-base tracking-[0.08em] text-center"
              style={{
                color: '#F5E4BB',
                textShadow: '1px 1px 0px rgba(0, 0, 0, 0.6)',
              }}
            >
              {shaPoint.title}
            </h3>

            <p className="mb-4 font-pixel text-[10px] leading-[1.8] text-center tracking-[0.08em] text-[#AAB3C2]">
              {shaPoint.description}
            </p>

            <div className="space-y-2 mb-4">
              {shaPoint.options.map(renderOption)}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 rounded-sm py-3 font-pixel text-xs tracking-[0.08em] transition-all duration-150 active:translate-y-[1px]"
                style={{
                  background: 'rgba(32, 39, 54, 0.8)',
                  border: '2px solid rgba(196, 160, 106, 0.3)',
                  color: '#AAB3C2',
                }}
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedOption}
                className="flex-1 rounded-sm py-3 font-pixel text-xs tracking-[0.08em] transition-all duration-150 active:translate-y-[2px] disabled:opacity-50"
                style={{
                  background: 'linear-gradient(180deg, #D4B07A 0%, #B8904F 100%)',
                  color: '#0E1116',
                  boxShadow: !selectedOption ? 'none' : `
                    inset -2px -2px 0px rgba(0, 0, 0, 0.25),
                    inset 2px 2px 0px rgba(255, 255, 255, 0.25),
                    0 4px 0px #5C4020,
                    0 0 16px rgba(196, 160, 106, 0.2)
                  `,
                }}
              >
                确认处置
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop 端：右侧面板
  return (
    <div 
      className="animate-slide-in-right absolute right-0 top-0 z-50 h-full" 
      onClick={handleStopPropagation}
      onPointerDown={handleStopPropagation}
      onPointerUp={handleStopPropagation}
      onPointerMove={handleStopPropagation}
      onPointerCancel={handleStopPropagation}
    >
      <div 
        className="h-full w-80 relative"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 35, 45, 0.92) 0%, rgba(21, 26, 34, 0.95) 100%)',
          backdropFilter: 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
          borderLeft: '2px solid rgba(196, 160, 106, 0.45)',
          boxShadow: `
            inset 1px 0 1px rgba(255, 255, 255, 0.08),
            inset 0 0 40px rgba(196, 160, 106, 0.04),
            -8px 0 32px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(196, 160, 106, 0.08)
          `,
        }}
      >
        {/* 外层光晕 */}
        <div
          className="absolute -inset-2 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at right center, rgba(196, 160, 106, 0.1) 0%, transparent 60%)',
          }}
        />
        
        <div className="relative flex h-full flex-col p-5">
          {/* 像素分隔线 */}
          <div className="flex items-center justify-center gap-1 mb-4" aria-hidden="true">
            <div className="w-4 h-[1px] bg-[#455063]" />
            <div className="w-1 h-1 bg-[#C4A06A]" />
            <div className="w-1.5 h-1.5 bg-[#E6D4B4]" />
            <div className="w-1 h-1 bg-[#C4A06A]" />
            <div className="w-4 h-[1px] bg-[#455063]" />
          </div>

          <h3 
            className="mb-2 font-pixel text-lg tracking-[0.08em] text-center"
            style={{
              color: '#F5E4BB',
              textShadow: '1px 1px 0px rgba(0, 0, 0, 0.6)',
            }}
          >
            {shaPoint.title}
          </h3>

          <p className="mb-5 font-pixel text-[10px] leading-[1.8] text-center tracking-[0.08em] text-[#AAB3C2]">
            {shaPoint.description}
          </p>

          <div 
            className="mb-4 rounded-sm px-3 py-2.5"
            style={{
              background: 'rgba(196, 160, 106, 0.08)',
              border: '1px solid rgba(196, 160, 106, 0.25)',
            }}
          >
            <p className="font-pixel text-[9px] tracking-[0.1em] text-[#C4A06A] text-center">
              选择正确的处置方式化解煞气
            </p>
          </div>

          <div className="space-y-2 flex-1">
            {shaPoint.options.map(renderOption)}
          </div>

          <div className="mt-4 space-y-3">
            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              className="w-full rounded-sm py-3 font-pixel text-sm tracking-[0.08em] transition-all duration-150 active:translate-y-[2px] disabled:opacity-50"
              style={{
                background: 'linear-gradient(180deg, #D4B07A 0%, #B8904F 100%)',
                color: '#0E1116',
                boxShadow: !selectedOption ? 'none' : `
                  inset -2px -2px 0px rgba(0, 0, 0, 0.25),
                  inset 2px 2px 0px rgba(255, 255, 255, 0.25),
                  0 4px 0px #5C4020,
                  0 0 20px rgba(196, 160, 106, 0.25)
                `,
              }}
            >
              确认处置
            </button>
            <button
              onClick={handleClose}
              className="w-full rounded-sm py-2.5 font-pixel text-xs tracking-[0.08em] transition-all duration-150 active:translate-y-[1px]"
              style={{
                background: 'rgba(32, 39, 54, 0.6)',
                border: '2px solid rgba(196, 160, 106, 0.3)',
                color: '#AAB3C2',
              }}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventModal({
  shaPoint,
  onSelect,
  onClose,
  visible,
}: EventModalProps) {
  if (!visible) return null;

  // 使用 key 确保当 shaPoint 改变时组件重新挂载
  return (
    <EventModalContent
      key={shaPoint.id}
      shaPoint={shaPoint}
      onSelect={onSelect}
      onClose={onClose}
    />
  );
}
