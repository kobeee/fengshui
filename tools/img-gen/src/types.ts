/**
 * 关卡图片生成工具 - 类型定义
 */

// ============ 煞气相关类型 ============

export type ShaType =
  | 'beam_sha'        // 横梁压顶
  | 'sharp_corner_sha' // 尖角煞
  | 'door_clash'      // 门冲/穿堂煞
  | 'mirror_sha'      // 镜冲床
  | 'smell_sha'       // 味煞
  | 'back_door_sha'   // 背门煞
  | 'pillar_sha'      // 柱角煞
  | 'window_sha'      // 窗户煞
  | 'yin_sha'         // 阴煞
  | 'stair_clash'     // 楼梯冲门
  | 'kitchen_sha'     // 灶台冲门
  | 'wealth_sha'      // 财位问题
  | 'electric_sha'    // 电线煞
  | 'slanted_ceiling' // 斜顶压床
  | 'road_clash'      // 路冲煞
  | 'sky_split'       // 天斩煞
  | 'reverse_bow'     // 反弓煞
  | 'wall_blade'      // 壁刀煞
  | 'fireplace_sha';  // 壁炉煞

export type ShaOption = {
  id: string;
  label: string;
  correct: boolean;
};

export type ShaPoint = {
  id: string;
  type: ShaType;
  position: { x: number; y: number };
  radius: number;
  title: string;
  description: string;
  correctItem: string | null;
  options: ShaOption[];
};

export type HotspotsData = {
  levelId: string;
  levelName: string;
  shaPoints: ShaPoint[];
};

// ============ 道具相关类型 ============

export type ItemInfo = {
  id: string;
  name: string;
  promptFile: string;
  outputFile: string;
};

// ============ 进度相关类型 ============

export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export type StepResult = {
  status: StepStatus;
  file?: string;
  timestamp?: string;
  error?: string;
};

export type ItemsProgress = {
  status: StepStatus;
  completed: string[];
  pending: string[];
  current?: string;
};

export type LevelProgress = {
  level: string;
  status: StepStatus;
  startTime: string;
  endTime?: string;
  steps: {
    room_cold: StepResult;
    analysis: StepResult;
    items: ItemsProgress;
    room_warm: StepResult;
    docs_update: StepResult;
  };
};

// ============ 关卡配置类型 ============

export type LevelConfig = {
  id: string;
  name: string;
  designFile: string;
  outputDir: string;
  items: ItemInfo[];
};

// ============ API 相关类型 ============

export type GenerateImageOptions = {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '4:5' | '5:4' | '2:1' | '2.5:1';
  resolution?: '1K' | '2K' | '4K';
  referenceImages?: Buffer[];
};

export type AnalyzeImageOptions = {
  image: Buffer;
  prompt: string;
  systemPrompt?: string;
};

export type GeminiResponse = {
  text?: string;
  imageData?: Buffer;
};
