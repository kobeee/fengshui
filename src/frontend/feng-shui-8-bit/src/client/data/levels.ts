import type { Level } from '../types/game';

/**
 * 关卡数据配置
 * 图片路径相对于 public/ 目录
 */

// Level 1 煞点数据 - 根据 resources/images/level1/analysis/hotspots.json
const level1ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'beam_sha',
    position: { x: 0.5, y: 0.25 },
    radius: 0.12,
    title: '横梁压顶',
    description: '卧床正上方有一根巨大的深色木质横梁，直接压在床头位置。这在风水中被称为"横梁压顶"，容易给人造成心理压力，导致睡眠质量下降或头痛。',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: '在横梁两端挂葫芦', correct: true },
      { id: 'opt-001-b', label: '在床边放置屏风', correct: false },
      { id: 'opt-001-c', label: '在窗台上放置一面镜子', correct: false },
    ],
    resolved: false,
  },
];

/** 关卡气场颜色配置 - 对应风水五行/方位 */
export type AuraColor = {
  primary: string;    // 主气场色
  secondary: string;  // 次气场色
  glow: string;       // 光晕色
};

/** 扩展 Level 类型，添加气场颜色 */
export type LevelWithAura = Level & {
  auraColor: AuraColor;
  mysteryName?: string;      // 神秘化关卡名
  mysteryHint?: string;      // 神秘化提示
};

export const levels: LevelWithAura[] = [
  {
    id: 'level-1',
    name: '开发者的地牢',
    nameEn: 'Dev Dungeon',
    mysteryName: '坎宫·暗室',
    mysteryHint: '水旺之地，阴气凝聚',
    description: '雨夜单身公寓 · 1 煞气点',
    shaCount: 1,
    locked: false,
    difficulty: 'easy',
    estimatedTime: '2-3分钟',
    auraColor: {
      primary: '#4A6FA5',    // 冷蓝 - 水之气
      secondary: '#2D4A6F',
      glow: 'rgba(74, 111, 165, 0.15)',
    },
    images: {
      cold: '/images/level1/room-cold.png',
      warm: '/images/level1/room-warm.png',
    },
    items: {
      gourd: '/images/level1/items/gourd-v1.0.png',
      'plant-broad': '/images/level1/items/plant-broad-v1.0.png',
      screen: '/images/level1/items/screen-v1.0.png',
    },
    shaPoints: level1ShaPoints,
  },
  // Level 2 - 待添加
  {
    id: 'level-2',
    name: '猫奴的客厅',
    nameEn: "Cat Lady's Living Room",
    mysteryName: '巽宫·灵舍',
    mysteryHint: '风行之所，生机暗藏',
    description: '到处是猫爬架，猫咪打架',
    shaCount: 3,
    locked: true,
    difficulty: 'normal',
    estimatedTime: '8-12分钟',
    auraColor: {
      primary: '#7B68A6',    // 神秘紫 - 风之气
      secondary: '#5A4A7F',
      glow: 'rgba(123, 104, 166, 0.2)',
    },
    images: {
      cold: '/images/level1/room-cold-v1.0.png', // 使用同一张图作为模糊基底
      warm: '',
    },
    items: {},
    shaPoints: [],
  },
  // Level 3 - 预留
  {
    id: 'level-3',
    name: '待定关卡',
    nameEn: 'Mystery Level',
    mysteryName: '离宫·炎宅',
    mysteryHint: '火旺之位，光暗交织',
    description: '???',
    shaCount: 5,
    locked: true,
    difficulty: 'hard',
    estimatedTime: '10-15分钟',
    auraColor: {
      primary: '#A65D57',    // 暗红 - 火之气
      secondary: '#7F3D38',
      glow: 'rgba(166, 93, 87, 0.2)',
    },
    images: {
      cold: '/images/level1/room-cold-v1.0.png',
      warm: '',
    },
    items: {},
    shaPoints: [],
  },
];

export function getLevelById(id: string): Level | undefined {
  return levels.find((level) => level.id === id);
}
