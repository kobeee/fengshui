import { useState, useEffect } from 'react';

export type ResponsiveInfo = {
  isMobile: boolean;
  isWeb: boolean;
  width: number;
  height: number;
};

/**
 * 响应式检测 Hook
 * 用于区分 Mobile 和 Web 端的交互逻辑
 */
export function useResponsive(): ResponsiveInfo {
  const [info, setInfo] = useState<ResponsiveInfo>(() => {
    if (typeof window === 'undefined') {
      return { isMobile: false, isWeb: true, width: 1024, height: 768 };
    }
    const width = window.innerWidth;
    return {
      isMobile: width < 768,
      isWeb: width >= 768,
      width,
      height: window.innerHeight,
    };
  });

  useEffect(() => {
    const updateInfo = () => {
      const width = window.innerWidth;
      setInfo({
        isMobile: width < 768,
        isWeb: width >= 768,
        width,
        height: window.innerHeight,
      });
    };

    updateInfo();
    window.addEventListener('resize', updateInfo);
    return () => window.removeEventListener('resize', updateInfo);
  }, []);

  return info;
}
