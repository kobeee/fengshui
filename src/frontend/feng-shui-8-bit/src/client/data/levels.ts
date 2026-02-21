import type { Level } from '../types/game';

/**
 * 关卡数据配置
 * 图片路径相对于 public/ 目录
 */

// Level 1 煞点数据
const level1ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'mirror_sha',
    position: { x: 0.36, y: 0.28 },
    radius: 0.08,
    title: '镜冲床',
    description: '落地镜直接正对床铺，容易在夜间惊扰心神，影响睡眠质量。',
    correctItem: null,
    options: [
      { id: 'opt-001-a', label: '用布盖住镜子', correct: false },
      { id: 'opt-001-b', label: '旋转镜子方向', correct: true },
      { id: 'opt-001-c', label: '移动床的位置', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'beam_sha',
    position: { x: 0.58, y: 0.16 },
    radius: 0.09,
    title: '横梁压顶',
    description: '粗大的木质横梁横跨在床铺正上方，会给人造成潜意识的压迫感。',
    correctItem: 'gourd',
    options: [
      { id: 'opt-002-a', label: '挂葫芦化解', correct: true },
      { id: 'opt-002-b', label: '把横梁漆成白色', correct: false },
      { id: 'opt-002-c', label: '在床上放抱枕', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'door_clash',
    position: { x: 0.5, y: 0.65 },
    radius: 0.1,
    title: '穿堂煞（门冲）',
    description: '入户门与阳台落地窗成一条直线，气流直进直出，无法藏风聚气。',
    correctItem: 'screen',
    options: [
      { id: 'opt-003-a', label: '放置屏风阻挡', correct: true },
      { id: 'opt-003-b', label: '常年关闭窗帘', correct: false },
      { id: 'opt-003-c', label: '门口放置地垫', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'sharp_corner_sha',
    position: { x: 0.6, y: 0.52 },
    radius: 0.08,
    title: '尖角煞',
    description: '三角形书架的锐利尖角直冲电脑椅座位，会造成精神紧张和注意力分散。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-004-a', label: '将书架锯平', correct: false },
      { id: 'opt-004-b', label: '放置阔叶绿植', correct: true },
      { id: 'opt-004-c', label: '贴上防撞贴纸', correct: false },
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
    description: '雨夜单身公寓 · 4 煞气点',
    shaCount: 4,
    locked: false,
    difficulty: 'easy',
    estimatedTime: '5-8分钟',
    auraColor: {
      primary: '#4A6FA5',    // 冷蓝 - 水之气
      secondary: '#2D4A6F',
      glow: 'rgba(74, 111, 165, 0.15)',
    },
    images: {
      cold: '/images/level1/room-cold-v1.0.png',
      warm: '/images/level1/room-warm-v1.0.png',
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
