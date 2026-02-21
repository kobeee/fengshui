/**
 * 步骤图标组件 - 像素风格
 * 用于 GameStart 页面的玩法说明
 */

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

/** 罗盘图标 - 用于"寻煞气"步骤 */
export function CompassIcon({ size = 40, color = '#C4A06A', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`compass-icon ${className}`}
    >
      {/* 外圈 */}
      <circle
        cx="20"
        cy="20"
        r="16"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.8"
      />
      {/* 内圈 */}
      <circle
        cx="20"
        cy="20"
        r="10"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      {/* 中心点 */}
      <circle cx="20" cy="20" r="2" fill={color} />
      {/* 八方位线 */}
      <line x1="20" y1="4" x2="20" y2="8" stroke={color} strokeWidth="2" />
      <line x1="20" y1="32" x2="20" y2="36" stroke={color} strokeWidth="2" />
      <line x1="4" y1="20" x2="8" y2="20" stroke={color} strokeWidth="2" />
      <line x1="32" y1="20" x2="36" y2="20" stroke={color} strokeWidth="2" />
      {/* 指针 */}
      <polygon
        points="20,6 23,20 20,16 17,20"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
}

/** 葫芦图标 - 用于"化煞气"步骤 */
export function GourdIcon({ size = 40, color = '#D4B07A', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`gourd-icon ${className}`}
    >
      {/* 挂绳 */}
      <path
        d="M20 2 Q22 4 20 6"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* 葫芦上肚 */}
      <ellipse
        cx="20"
        cy="12"
        rx="6"
        ry="7"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* 葫芦腰部 */}
      <path
        d="M14 14 Q20 18 26 14"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* 葫芦下肚 */}
      <ellipse
        cx="20"
        cy="28"
        rx="10"
        ry="10"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* 高光 */}
      <ellipse
        cx="17"
        cy="26"
        rx="2"
        ry="3"
        fill={color}
        opacity="0.3"
      />
    </svg>
  );
}

/** 太阳图标 - 用于"转暖色"步骤 */
export function SunIcon({ size = 40, color = '#E6D4B4', className = '' }: IconProps) {
  const rays = 8;
  const centerX = 20;
  const centerY = 20;
  const innerRadius = 6;
  const outerRadius = 14;

  const rayPaths = [];
  for (let i = 0; i < rays; i++) {
    const angle = (i * 360) / rays;
    const rad = (angle * Math.PI) / 180;
    const x1 = centerX + innerRadius * Math.cos(rad);
    const y1 = centerY + innerRadius * Math.sin(rad);
    const x2 = centerX + outerRadius * Math.cos(rad);
    const y2 = centerY + outerRadius * Math.sin(rad);
    rayPaths.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`sun-icon ${className}`}
    >
      {/* 光芒 */}
      {rayPaths}
      {/* 中心圆 */}
      <circle
        cx="20"
        cy="20"
        r="5"
        fill={color}
        opacity="0.9"
      />
      {/* 内发光 */}
      <circle
        cx="20"
        cy="20"
        r="8"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}
