import type { Position, ShaPoint, CompassSpeed } from '../types/game';

/**
 * 计算两点之间的欧几里得距离
 */
export function distance(a: Position, b: Position): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * 检测罗盘是否在煞点核心范围内（触发弹窗）
 * @returns 返回最近的核心范围内煞点，或 null
 */
export function detectShaPoint(
  compassPos: Position,
  shaPoints: ShaPoint[]
): ShaPoint | null {
  const unresolvedPoints = shaPoints.filter((sha) => !sha.resolved);

  // 按距离排序，找最近的
  const sorted = unresolvedPoints
    .map((sha) => ({
      sha,
      dist: distance(compassPos, sha.position),
    }))
    .sort((a, b) => a.dist - b.dist);

  const closest = sorted[0];
  // 核心区域阈值与 super-fast 一致（0.4 倍半径）
  if (closest && closest.dist < closest.sha.radius * 0.4) {
    return closest.sha;
  }

  return null;
}

/**
 * 计算罗盘旋转速度
 * 根据罗盘与煞点的距离返回速度等级
 * 
 * 分层触发：
 * - super-fast: 核心区域，触发弹窗
 * - fast: 边缘区域，只快转不弹窗
 * - normal: 远离区域，左右摇摆
 */
export function getCompassSpeed(
  compassPos: Position,
  shaPoints: ShaPoint[]
): CompassSpeed {
  const unresolvedPoints = shaPoints.filter((sha) => !sha.resolved);

  for (const sha of unresolvedPoints) {
    const dist = distance(compassPos, sha.position);

    // 核心区域 - 超快旋转 + 弹窗（更近才触发）
    if (dist < sha.radius * 0.4) {
      return 'super-fast';
    }
    // 边缘区域 - 快速旋转（不弹窗，缩小范围避免误触发）
    if (dist < sha.radius * 0.8) {
      return 'fast';
    }
  }

  return 'normal';
}

/**
 * 将归一化坐标转换为像素坐标
 */
export function toPixelPosition(
  normalized: Position,
  containerWidth: number,
  containerHeight: number
): { x: number; y: number } {
  return {
    x: normalized.x * containerWidth,
    y: normalized.y * containerHeight,
  };
}

/**
 * 将像素坐标转换为归一化坐标
 */
export function toNormalizedPosition(
  pixel: Position,
  containerWidth: number,
  containerHeight: number
): Position {
  return {
    x: Math.max(0, Math.min(1, pixel.x / containerWidth)),
    y: Math.max(0, Math.min(1, pixel.y / containerHeight)),
  };
}
