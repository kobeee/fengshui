/**
 * 进度管理模块
 * 
 * 负责：
 * - 记录生成进度
 * - 断点续传支持
 * - 状态持久化
 */

import fs from 'fs-extra';
import path from 'path';
import type { LevelProgress, StepStatus } from './types.js';

const PROGRESS_DIR = path.join(process.cwd(), 'progress');

/**
 * 确保进度目录存在
 */
async function ensureProgressDir(): Promise<void> {
  await fs.ensureDir(PROGRESS_DIR);
}

/**
 * 获取进度文件路径
 */
function getProgressPath(levelId: string): string {
  return path.join(PROGRESS_DIR, `${levelId}.json`);
}

/**
 * 初始化关卡进度
 */
export async function initProgress(levelId: string): Promise<LevelProgress> {
  await ensureProgressDir();
  
  const progress: LevelProgress = {
    level: levelId,
    status: 'pending',
    startTime: new Date().toISOString(),
    steps: {
      room_cold: { status: 'pending' },
      analysis: { status: 'pending' },
      items: { status: 'pending', completed: [], pending: [] },
      room_warm: { status: 'pending' },
      docs_update: { status: 'pending' }
    }
  };
  
  await saveProgress(progress);
  return progress;
}

/**
 * 加载关卡进度
 */
export async function loadProgress(levelId: string): Promise<LevelProgress | null> {
  const progressPath = getProgressPath(levelId);
  
  if (!await fs.pathExists(progressPath)) {
    return null;
  }
  
  try {
    const content = await fs.readFile(progressPath, 'utf-8');
    return JSON.parse(content) as LevelProgress;
  } catch (error) {
    console.error(`加载进度失败: ${progressPath}`, error);
    return null;
  }
}

/**
 * 保存关卡进度
 */
export async function saveProgress(progress: LevelProgress): Promise<void> {
  await ensureProgressDir();
  const progressPath = getProgressPath(progress.level);
  await fs.writeFile(progressPath, JSON.stringify(progress, null, 2));
  console.log(`  💾 进度已保存: ${progress.level}`);
}

/**
 * 更新步骤状态
 */
export async function updateStepStatus(
  progress: LevelProgress,
  step: keyof LevelProgress['steps'],
  status: StepStatus,
  extra?: { file?: string; error?: string }
): Promise<LevelProgress> {
  const stepData = progress.steps[step];
  
  if (step === 'items' && 'completed' in stepData) {
    // items 步骤特殊处理
    (stepData as typeof progress.steps.items).status = status;
  } else {
    // 普通步骤
    (stepData as typeof progress.steps.room_cold).status = status;
    if (extra?.file) {
      (stepData as typeof progress.steps.room_cold).file = extra.file;
    }
    if (extra?.error) {
      (stepData as typeof progress.steps.room_cold).error = extra.error;
    }
    (stepData as typeof progress.steps.room_cold).timestamp = new Date().toISOString();
  }
  
  // 更新整体状态
  if (status === 'in_progress' && progress.status === 'pending') {
    progress.status = 'in_progress';
  }
  
  await saveProgress(progress);
  return progress;
}

/**
 * 完成步骤
 */
export async function completeStep(
  progress: LevelProgress,
  step: keyof LevelProgress['steps'],
  outputFile?: string
): Promise<LevelProgress> {
  return updateStepStatus(progress, step, 'completed', { file: outputFile });
}

/**
 * 标记步骤失败
 */
export async function failStep(
  progress: LevelProgress,
  step: keyof LevelProgress['steps'],
  error: string
): Promise<LevelProgress> {
  return updateStepStatus(progress, step, 'failed', { error });
}

/**
 * 完成关卡
 */
export async function completeLevel(progress: LevelProgress): Promise<LevelProgress> {
  progress.status = 'completed';
  progress.endTime = new Date().toISOString();
  await saveProgress(progress);
  return progress;
}

/**
 * 获取下一个待执行的步骤
 */
export function getNextStep(progress: LevelProgress): keyof LevelProgress['steps'] | null {
  const steps = Object.keys(progress.steps) as Array<keyof LevelProgress['steps']>;
  
  for (const step of steps) {
    const stepData = progress.steps[step];
    if (stepData.status === 'pending' || stepData.status === 'failed') {
      return step;
    }
    // items 步骤检查是否有待处理的道具
    if (step === 'items' && 'pending' in stepData && stepData.pending.length > 0) {
      return step;
    }
  }
  
  return null;
}

/**
 * 检查关卡是否完成
 */
export function isLevelComplete(progress: LevelProgress): boolean {
  const steps = Object.values(progress.steps);
  return steps.every(s => s.status === 'completed');
}
