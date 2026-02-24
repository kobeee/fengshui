import type { Level } from '../types/game';

/**
 * 关卡数据配置 v2.0
 * 包含全部 20 个关卡
 * 图片路径相对于 public/ 目录
 */

/** 关卡气场颜色配置 - 对应风水五行/方位 */
export type AuraColor = {
  primary: string;    // 主气场色
  secondary: string;  // 次气场色
  glow: string;       // 光晕色
};

/** 扩展 Level 类型，添加气场颜色 */
export type LevelWithAura = Level & {
  auraColor: AuraColor;
  chapter?: string;      // 所属章节
  shaCompleted?: number; // 已化解煞气数
};

/** 章节配置 */
export const CHAPTERS = [
  { id: 1, name: '初窥门径', symbol: '壹', range: [1, 5] as const },
  { id: 2, name: '渐入佳境', symbol: '贰', range: [6, 10] as const },
  { id: 3, name: '融会贯通', symbol: '叁', range: [11, 15] as const },
  { id: 4, name: '超凡入圣', symbol: '肆', range: [16, 20] as const },
] as const;

// ============ Level 1 ============
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

// ============ Level 2 ============
const level2ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'mirror_sha',
    position: { x: 0.28, y: 0.48 },
    radius: 0.1,
    title: '镜冲床',
    description: '衣柜上的全身镜正对床铺侧面，夜间容易反射倒影造成心理不安，影响睡眠质量。',
    correctItem: null,
    options: [
      { id: 'opt-001-a', label: '用厚布遮挡镜面', correct: false },
      { id: 'opt-001-b', label: '旋转镜子方向', correct: true },
      { id: 'opt-001-c', label: '在镜前摆放猫爬架', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 3 ============
const level3ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'sharp_corner_sha',
    position: { x: 0.52, y: 0.58 },
    radius: 0.1,
    title: '尖角煞',
    description: '书桌的左侧尖角正对着下铺床位，形成"尖角煞"。在狭小的宿舍中，这种布局容易导致睡眠不安和精神紧张。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-001-a', label: '摆放阔叶绿植化解', correct: true },
      { id: 'opt-001-b', label: '将书桌移到走廊', correct: false },
      { id: 'opt-001-c', label: '挂一面镜子反射', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 4 ============
const level4ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'door_clash',
    position: { x: 0.2, y: 0.35 },
    radius: 0.12,
    title: '穿堂煞',
    description: '入户大门与阳台门处于一直线上，气流直进直出，不仅难以聚财，也不利于藏风聚气。',
    correctItem: 'screen',
    options: [
      { id: 'opt-001-a', label: '在大门处设置屏风', correct: true },
      { id: 'opt-001-b', label: '在门口放置猫抓板', correct: false },
      { id: 'opt-001-c', label: '阳台门常年关闭', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'smell_sha',
    position: { x: 0.68, y: 0.52 },
    radius: 0.1,
    title: '味煞',
    description: '猫砂盆直接放置在客厅活动区，且无遮挡，异味扩散影响客厅气场。',
    correctItem: 'curtain',
    options: [
      { id: 'opt-002-a', label: '加装帘子或隔断遮挡', correct: true },
      { id: 'opt-002-b', label: '多放几个除臭剂', correct: false },
      { id: 'opt-002-c', label: '打开窗户通风', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 5 ============
const level5ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'beam_sha',
    position: { x: 0.32, y: 0.22 },
    radius: 0.12,
    title: '横梁压顶',
    description: '粗大的木质横梁直接横跨在床铺头枕上方，给人造成巨大的视觉和心理压迫感。',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: '悬挂风水葫芦', correct: true },
      { id: 'opt-001-b', label: '把床移到窗户下', correct: false },
      { id: 'opt-001-c', label: '用海报遮挡横梁', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'sharp_corner_sha',
    position: { x: 0.54, y: 0.52 },
    radius: 0.08,
    title: '尖角煞',
    description: 'L型电脑桌的转角处形成了一个锐利的直角，直冲床铺一侧。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: '放置阔叶绿植化解', correct: true },
      { id: 'opt-002-b', label: '把桌角锯圆', correct: false },
      { id: 'opt-002-c', label: '移动电脑主机', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 6 ============
const level6ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'back_door_sha',
    position: { x: 0.35, y: 0.68 },
    radius: 0.12,
    title: '背门煞',
    description: '前方工位的座椅背对大门，背后人来人往无靠山，容易导致心神不宁，招惹小人。',
    correctItem: 'dragon-turtle',
    options: [
      { id: 'opt-001-a', label: '在桌上放置龙龟', correct: true },
      { id: 'opt-001-b', label: '在门上挂风铃', correct: false },
      { id: 'opt-001-c', label: '将椅子换成矮凳', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'pillar_sha',
    position: { x: 0.68, y: 0.55 },
    radius: 0.12,
    title: '柱角煞',
    description: '房间中央的承重柱尖角直冲办公桌区域，形成的尖角煞气会影响思维决策。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: '放置阔叶绿植挡煞', correct: true },
      { id: 'opt-002-b', label: '在柱子上挂镜子', correct: false },
      { id: 'opt-002-c', label: '把柱子涂成红色', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 7 ============
const level7ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'mirror_sha',
    position: { x: 0.25, y: 0.45 },
    radius: 0.12,
    title: '镜冲床',
    description: '隔断墙上的大镜子正对床铺，人在睡眠时气场最弱，镜子直冲会干扰人体磁场。',
    correctItem: null,
    options: [
      { id: 'opt-001-a', label: '安装布帘遮挡镜子', correct: true },
      { id: 'opt-001-b', label: '在镜子表面贴八卦图', correct: false },
      { id: 'opt-001-c', label: '在床头柜上放一杯盐水', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'sharp_corner_sha',
    position: { x: 0.72, y: 0.48 },
    radius: 0.1,
    title: '尖角煞',
    description: '书柜的边角呈90度直角，直接指向房间中央的活动区域。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: '在柜角前方摆放阔叶绿植', correct: true },
      { id: 'opt-002-b', label: '在柜角处悬挂一把剪刀', correct: false },
      { id: 'opt-002-c', label: '将柜子整体涂成红色', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 8 ============
const level8ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'kitchen_sha',
    position: { x: 0.18, y: 0.42 },
    radius: 0.1,
    title: '灶台冲煞',
    description: '开放式厨房的灶台毫无遮挡，火气直冲客厅区域，会导致财气无法聚集。',
    correctItem: 'screen',
    options: [
      { id: 'opt-001-a', label: '放置屏风进行阻隔', correct: true },
      { id: 'opt-001-b', label: '将灶台移到阳台', correct: false },
      { id: 'opt-001-c', label: '在灶台旁放灭火器', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'door_clash',
    position: { x: 0.58, y: 0.3 },
    radius: 0.12,
    title: '穿堂煞',
    description: '巨大的落地阳台门直通室内，气流直进直出，无法藏风聚气。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: '放置阔叶绿植聚气', correct: true },
      { id: 'opt-002-b', label: '把门封死', correct: false },
      { id: 'opt-002-c', label: '挂一面镜子反射', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'beam_sha',
    position: { x: 0.62, y: 0.72 },
    radius: 0.1,
    title: '横梁压顶',
    description: '客厅沙发位于房屋结构梁下方，长期坐卧会造成心理压力。',
    correctItem: 'gourd',
    options: [
      { id: 'opt-003-a', label: '悬挂葫芦化解煞气', correct: true },
      { id: 'opt-003-b', label: '把沙发腿锯短', correct: false },
      { id: 'opt-003-c', label: '在沙发上放抱枕', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 9 ============
const level9ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'slanted_ceiling',
    position: { x: 0.5, y: 0.35 },
    radius: 0.12,
    title: '斜顶压床',
    description: '睡床直接放置在倾斜的屋顶之下，长期在此睡眠容易产生心理压力，导致睡眠质量下降。',
    correctItem: null,
    options: [
      { id: 'opt-001-a', label: '将床铺移动到天花板平整区域', correct: true },
      { id: 'opt-001-b', label: '在床头悬挂一面镜子反射斜顶', correct: false },
      { id: 'opt-001-c', label: '在斜顶上悬挂沉重的装饰画', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'window_sha',
    position: { x: 0.65, y: 0.2 },
    radius: 0.1,
    title: '窗户煞',
    description: '天窗虽提供采光，但过大的顶部开口若无遮挡，容易导致房间气场不聚。',
    correctItem: 'curtain',
    options: [
      { id: 'opt-002-a', label: '安装遮光窗帘调节光线', correct: true },
      { id: 'opt-002-b', label: '拆除窗户玻璃保持常开', correct: false },
      { id: 'opt-002-c', label: '在窗户正下方放置鱼缸', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'yin_sha',
    position: { x: 0.2, y: 0.7 },
    radius: 0.1,
    title: '阴煞',
    description: '房间角落堆放杂物且光线晦暗，容易滋生细菌，是"阴煞"聚集之地。',
    correctItem: 'salt-lamp',
    options: [
      { id: 'opt-003-a', label: '清理杂物并放置盐灯驱除阴气', correct: true },
      { id: 'opt-003-b', label: '放置一个大鱼缸利用水清洗角落', correct: false },
      { id: 'opt-003-c', label: '悬挂深色厚重的挂毯遮挡', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 10 ============
const level10ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'beam_sha',
    position: { x: 0.5, y: 0.25 },
    radius: 0.12,
    title: '横梁压顶',
    description: '一道巨大的深色木质横梁直接横跨在床铺上方，是风水中非常严重的煞气。',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: '在横梁两端悬挂葫芦化解煞气', correct: true },
      { id: 'opt-001-b', label: '在横梁下方放置一盆水', correct: false },
      { id: 'opt-001-c', label: '将横梁漆成深红色以辟邪', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'yin_sha',
    position: { x: 0.75, y: 0.6 },
    radius: 0.1,
    title: '阴煞',
    description: '房间整体光线非常昏暗，角落堆放杂物，床头有药物，显示房间气场停滞、阴气较重。',
    correctItem: 'salt-lamp',
    options: [
      { id: 'opt-002-a', label: '放置喜马拉雅盐灯或增加暖色光源', correct: true },
      { id: 'opt-002-b', label: '在床头悬挂金属风铃', correct: false },
      { id: 'opt-002-c', label: '放置大型鱼缸', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'door_clash',
    position: { x: 0.15, y: 0.5 },
    radius: 0.08,
    title: '门冲',
    description: '卧室门开启方向侧面对着床铺区域，气流直接进入可能冲撞睡眠时的气场。',
    correctItem: 'curtain',
    options: [
      { id: 'opt-003-a', label: '在门上悬挂长门帘', correct: true },
      { id: 'opt-003-b', label: '在门后悬挂八卦镜对着床', correct: false },
      { id: 'opt-003-c', label: '拆除房门保持敞开', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 11 ============
const level11ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'stair_clash',
    position: { x: 0.15, y: 0.55 },
    radius: 0.1,
    title: '楼梯冲门',
    description: '螺旋楼梯直冲入户门方向，气流顺楼梯直冲而下直接泄出，导致家中财气难聚。',
    correctItem: 'screen',
    options: [
      { id: 'opt-001-a', label: '放置屏风阻隔气流', correct: true },
      { id: 'opt-001-b', label: '楼梯铺红地毯', correct: false },
      { id: 'opt-001-c', label: '在楼梯下堆放杂物', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'beam_sha',
    position: { x: 0.52, y: 0.38 },
    radius: 0.1,
    title: '横梁压顶',
    description: '巨大的钢结构横梁直接横跨在沙发上方，长期影响心理健康和运势。',
    correctItem: 'gourd',
    options: [
      { id: 'opt-002-a', label: '悬挂葫芦化解', correct: true },
      { id: 'opt-002-b', label: '将横梁涂成白色', correct: false },
      { id: 'opt-002-c', label: '在横梁下装吊灯', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'door_clash',
    position: { x: 0.88, y: 0.3 },
    radius: 0.12,
    title: '穿堂煞',
    description: '入户门方向正对巨大的落地窗，气流刚进门就直接穿窗而出，形成典型的"穿堂煞"。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-003-a', label: '窗边放阔叶绿植', correct: true },
      { id: 'opt-003-b', label: '在此处放一面镜子', correct: false },
      { id: 'opt-003-c', label: '封死这扇窗户', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'kitchen_sha',
    position: { x: 0.82, y: 0.58 },
    radius: 0.08,
    title: '灶台外露',
    description: '开放式厨房灶台完全外露，火气直冲客厅区域。',
    correctItem: 'screen',
    options: [
      { id: 'opt-004-a', label: '用屏风遮挡灶台', correct: true },
      { id: 'opt-004-b', label: '在灶台上挂镜子', correct: false },
      { id: 'opt-004-c', label: '把灶台封起来', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 12 ============
const level12ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'beam_sha',
    position: { x: 0.5, y: 0.2 },
    radius: 0.12,
    title: '横梁压顶',
    description: '巨大的混凝土横梁直接横跨在办公座位上方，给人造成视觉和心理上的沉重压迫感。',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: '在横梁下方悬挂葫芦化解煞气', correct: true },
      { id: 'opt-001-b', label: '在桌面上放置一面镜子向上反射', correct: false },
      { id: 'opt-001-c', label: '将横梁漆成红色以增加喜庆感', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'pillar_sha',
    position: { x: 0.65, y: 0.5 },
    radius: 0.1,
    title: '柱角煞',
    description: '方形承重柱的尖锐棱角直冲办公区域，形成锐气切割磁场。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: '在柱角前方摆放阔叶绿植遮挡', correct: true },
      { id: 'opt-002-b', label: '悬挂猛兽图片以暴制暴', correct: false },
      { id: 'opt-002-c', label: '在柱子上钉钉子', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'electric_sha',
    position: { x: 0.35, y: 0.7 },
    radius: 0.08,
    title: '电线煞',
    description: '大量电源线和数据线杂乱缠绕在地面，如同蛇群盘踞，扰乱气场。',
    correctItem: 'copper-gourd',
    options: [
      { id: 'opt-003-a', label: '理顺收纳线路并放置铜葫芦', correct: true },
      { id: 'opt-003-b', label: '在电线堆中放置一盆水', correct: false },
      { id: 'opt-003-c', label: '用剪刀将不用的电线剪断留在原地', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'wealth_sha',
    position: { x: 0.12, y: 0.65 },
    radius: 0.1,
    title: '财位受污',
    description: '对角线的角落位置堆满了废旧纸箱、杂物以及枯死的植物，导致财位污秽。',
    correctItem: 'money-toad',
    options: [
      { id: 'opt-004-a', label: '清理杂物并摆放招财摆件', correct: true },
      { id: 'opt-004-b', label: '在此处放置开口的垃圾桶', correct: false },
      { id: 'opt-004-c', label: '增加更多杂物压住财气', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 13 ============
const level13ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'beam_sha',
    position: { x: 0.5, y: 0.22 },
    radius: 0.12,
    title: '横梁压顶',
    description: '巨大的黑色十字形钢结构横梁直接横跨在中央办公区域上方。',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: '在横梁下方悬挂葫芦或移动办公桌', correct: true },
      { id: 'opt-001-b', label: '在横梁上悬挂镜子反射压力', correct: false },
      { id: 'opt-001-c', label: '将横梁涂成鲜艳的红色', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'door_clash',
    position: { x: 0.85, y: 0.65 },
    radius: 0.1,
    title: '门冲',
    description: '办公室的木门打开后，气流直接冲向旁边的办公桌区域。',
    correctItem: 'screen',
    options: [
      { id: 'opt-002-a', label: '在门与办公桌之间设置屏风', correct: true },
      { id: 'opt-002-b', label: '将办公桌调整为正面对着大门', correct: false },
      { id: 'opt-002-c', label: '在门框上安装强光射灯', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'wealth_sha',
    position: { x: 0.15, y: 0.7 },
    radius: 0.1,
    title: '财位问题',
    description: '进门对角线的左下角被视为"明财位"，但地面脏乱影响财气聚集。',
    correctItem: 'lucky-cat',
    options: [
      { id: 'opt-003-a', label: '清理角落保持明亮整洁', correct: true },
      { id: 'opt-003-b', label: '在该角落放置一个大垃圾桶', correct: false },
      { id: 'opt-003-c', label: '将该区域完全腾空什么都不放', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 14 ============
const level14ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'beam_sha',
    position: { x: 0.5, y: 0.25 },
    radius: 0.12,
    title: '横梁压顶',
    description: '一根巨大的深色木质横梁直接横跨在床铺的上方，将床从中间切分。',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: '在横梁两端悬挂葫芦或移动床位', correct: true },
      { id: 'opt-001-b', label: '在横梁上悬挂一串风铃', correct: false },
      { id: 'opt-001-c', label: '将横梁涂成红色', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'mirror_sha',
    position: { x: 0.75, y: 0.5 },
    radius: 0.1,
    title: '镜冲床',
    description: '床右侧的衣柜推拉门上镶嵌着巨大的镜子，镜面直接正对床铺侧面。',
    correctItem: null,
    options: [
      { id: 'opt-002-a', label: '使用厚布帘在睡觉时将镜子遮挡', correct: true },
      { id: 'opt-002-b', label: '在镜子前摆放一盆仙人掌', correct: false },
      { id: 'opt-002-c', label: '每天将镜子擦拭得非常光亮', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'door_clash',
    position: { x: 0.15, y: 0.5 },
    radius: 0.1,
    title: '门冲',
    description: '房间入口的门开启后，气流直冲室内床铺区域。',
    correctItem: 'curtain',
    options: [
      { id: 'opt-003-a', label: '在房门上悬挂长门帘', correct: true },
      { id: 'opt-003-b', label: '保持房门24小时敞开', correct: false },
      { id: 'opt-003-c', label: '在门口放置一双鞋子挡煞', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 15 ============
const level15ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'beam_sha',
    position: { x: 0.45, y: 0.3 },
    radius: 0.1,
    title: '横梁压顶',
    description: '粗大的木质横梁直接横跨在画架上方，会给在此创作的人带来心理压力。',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: '在横梁上悬挂铜葫芦化解煞气', correct: true },
      { id: 'opt-001-b', label: '在横梁上悬挂一串风铃', correct: false },
      { id: 'opt-001-c', label: '将横梁漆成鲜艳的红色', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'sharp_corner_sha',
    position: { x: 0.7, y: 0.45 },
    radius: 0.08,
    title: '尖角煞',
    description: '高大书柜的侧面棱角尖锐，直冲房间中央的休息区域。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: '在书柜尖角处摆放阔叶绿植', correct: true },
      { id: 'opt-002-b', label: '在尖角处悬挂一面镜子反射回去', correct: false },
      { id: 'opt-002-c', label: '在尖角处挂一把剪刀以毒攻毒', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'yin_sha',
    position: { x: 0.2, y: 0.65 },
    radius: 0.1,
    title: '阴煞',
    description: '角落处光线昏暗，且堆放杂物，容易聚集负面能量。',
    correctItem: 'salt-lamp',
    options: [
      { id: 'opt-003-a', label: '清理杂物并放置盐灯提升阳气', correct: true },
      { id: 'opt-003-b', label: '在此处放置一个鱼缸养鱼', correct: false },
      { id: 'opt-003-c', label: '挂上一幅深色调的山水画', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'smell_sha',
    position: { x: 0.88, y: 0.55 },
    radius: 0.08,
    title: '厕所门冲',
    description: '厕所门正对房间内部，且有异味散出，直冲工作区域。',
    correctItem: 'curtain',
    options: [
      { id: 'opt-004-a', label: '在厕所门上悬挂长门帘', correct: true },
      { id: 'opt-004-b', label: '将厕所门拆除换成开放式拱门', correct: false },
      { id: 'opt-004-c', label: '在厕所门口摆放一堆硬币', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-005',
    type: 'window_sha',
    position: { x: 0.55, y: 0.18 },
    radius: 0.1,
    title: '窗户煞',
    description: '巨大的工业窗户紧邻水池，会导致气流直来直去，气场不聚。',
    correctItem: 'curtain',
    options: [
      { id: 'opt-005-a', label: '安装厚实的窗帘或百叶窗', correct: true },
      { id: 'opt-005-b', label: '把窗户玻璃全部敲碎保持通风', correct: false },
      { id: 'opt-005-c', label: '在窗台上放置一面八卦镜对着屋内', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 16 ============
const level16ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'wealth_sha',
    position: { x: 0.05, y: 0.42 },
    radius: 0.08,
    title: '财位受损',
    description: '入口接待处作为明财位，摆放了破损的喷泉和杂物，导致财气流失。',
    correctItem: 'money-toad',
    options: [
      { id: 'opt-001-a', label: '清理并放置金蟾招财', correct: true },
      { id: 'opt-001-b', label: '直接扔掉喷泉', correct: false },
      { id: 'opt-001-c', label: '放置鱼缸', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'yin_sha',
    position: { x: 0.38, y: 0.22 },
    radius: 0.08,
    title: '阴煞',
    description: '储物架所在的角落光线昏暗，容易积聚阴气，让人感到压抑。',
    correctItem: 'salt-lamp',
    options: [
      { id: 'opt-002-a', label: '放置盐灯增加阳气', correct: true },
      { id: 'opt-002-b', label: '堆放更多杂物', correct: false },
      { id: 'opt-002-c', label: '安装强力排风扇', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'sharp_corner_sha',
    position: { x: 0.39, y: 0.68 },
    radius: 0.07,
    title: '尖角煞',
    description: '木箱的尖锐棱角直冲瑜伽垫位置，会产生煞气刺伤练习者的气场。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-003-a', label: '放置阔叶绿植化解', correct: true },
      { id: 'opt-003-b', label: '用锯子锯掉如角', correct: false },
      { id: 'opt-003-c', label: '移动瑜伽垫', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'window_sha',
    position: { x: 0.72, y: 0.25 },
    radius: 0.1,
    title: '窗户煞',
    description: '巨大的落地窗会导致气场不聚，影响修行冥想。',
    correctItem: 'curtain',
    options: [
      { id: 'opt-004-a', label: '安装窗帘调节光线', correct: true },
      { id: 'opt-004-b', label: '完全封死窗户', correct: false },
      { id: 'opt-004-c', label: '在窗前放镜子反射', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-005',
    type: 'smell_sha',
    position: { x: 0.9, y: 0.6 },
    radius: 0.08,
    title: '味煞',
    description: '更衣室区域有异味，影响整体气场。',
    correctItem: 'curtain',
    options: [
      { id: 'opt-005-a', label: '安装门帘遮挡并保持通风', correct: true },
      { id: 'opt-005-b', label: '喷洒香水掩盖', correct: false },
      { id: 'opt-005-c', label: '关闭更衣室门', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 17 ============
const level17ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'beam_sha',
    position: { x: 0.45, y: 0.35 },
    radius: 0.12,
    title: '横梁压顶',
    description: '巨大的木质横梁横跨在床铺上方，是风水中的大忌。',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: '在横梁两端悬挂葫芦或移动床位', correct: true },
      { id: 'opt-001-b', label: '在横梁上安装镜子反射煞气', correct: false },
      { id: 'opt-001-c', label: '在横梁下悬挂风铃利用声音化解', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'mirror_sha',
    position: { x: 0.7, y: 0.45 },
    radius: 0.1,
    title: '镜冲床',
    description: '衣柜上的大镜子正对着床铺，人在睡眠时气场最弱，镜子反射会扰乱人体磁场。',
    correctItem: null,
    options: [
      { id: 'opt-002-a', label: '睡觉时用厚布遮挡镜面', correct: true },
      { id: 'opt-002-b', label: '在床头放一面镜子与衣柜镜子对冲', correct: false },
      { id: 'opt-002-c', label: '每天用盐水擦拭镜面', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'sharp_corner_sha',
    position: { x: 0.55, y: 0.55 },
    radius: 0.08,
    title: '尖角煞',
    description: '家具的尖锐边角直冲生活动线或休息区，形成锋利的气场。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-003-a', label: '在尖角前方放置阔叶绿植遮挡', correct: true },
      { id: 'opt-003-b', label: '在尖角处悬挂一把剪刀以毒攻毒', correct: false },
      { id: 'opt-003-c', label: '将尖角涂成红色以示警示', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'yin_sha',
    position: { x: 0.25, y: 0.7 },
    radius: 0.1,
    title: '阴煞',
    description: '屋顶角落光线不足，气流停滞，容易积聚阴气。',
    correctItem: 'salt-lamp',
    options: [
      { id: 'opt-004-a', label: '放置喜马拉雅盐灯增加照明', correct: true },
      { id: 'opt-004-b', label: '放置一个鱼缸养鱼', correct: false },
      { id: 'opt-004-c', label: '堆放旧书和杂物填满空间', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-005',
    type: 'stair_clash',
    position: { x: 0.15, y: 0.5 },
    radius: 0.1,
    title: '楼梯下煞',
    description: '楼梯下方空间形成压抑的角落，容易聚集阴气。',
    correctItem: 'crystal-ball',
    options: [
      { id: 'opt-005-a', label: '放置水晶球净化气场', correct: true },
      { id: 'opt-005-b', label: '堆放更多杂物填满', correct: false },
      { id: 'opt-005-c', label: '安装镜子反射', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 18 ============
const level18ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'road_clash',
    position: { x: 0.12, y: 0.5 },
    radius: 0.12,
    title: '路冲煞',
    description: '大门正对着外部的道路或长走廊，气流直冲入屋，容易导致居住者情绪不稳。',
    correctItem: 'stone-tablet',
    options: [
      { id: 'opt-001-a', label: '放置石敢当', correct: true },
      { id: 'opt-001-b', label: '悬挂一串风铃', correct: false },
      { id: 'opt-001-c', label: '在大门安装透明玻璃', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'reverse_bow',
    position: { x: 0.85, y: 0.35 },
    radius: 0.1,
    title: '反弓煞',
    description: '落地窗外的高架道路呈弯曲状，弯弓的凸面正对着房屋。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: '在窗边放置高大绿植', correct: true },
      { id: 'opt-002-b', label: '将窗帘全部拆除', correct: false },
      { id: 'opt-002-c', label: '在窗户上挂一把剪刀', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'wealth_sha',
    position: { x: 0.15, y: 0.7 },
    radius: 0.1,
    title: '财位问题',
    description: '客厅角落的财位堆放了破碎的花瓶和杂乱的碎片，属于"财位受污"。',
    correctItem: 'pi-xiu',
    options: [
      { id: 'opt-003-a', label: '清理杂物并放置招财摆件', correct: true },
      { id: 'opt-003-b', label: '在此处放置重型健身器材', correct: false },
      { id: 'opt-003-c', label: '放置一个开口的垃圾桶', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'door_clash',
    position: { x: 0.5, y: 0.55 },
    radius: 0.1,
    title: '门冲',
    description: '拱门与房间侧门形成直冲之势，气流直来直去，不利藏风聚气。',
    correctItem: 'screen',
    options: [
      { id: 'opt-004-a', label: '在中间设置屏风', correct: true },
      { id: 'opt-004-b', label: '在门上安装强光射灯', correct: false },
      { id: 'opt-004-c', label: '将门拆除做成空洞', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-005',
    type: 'fireplace_sha',
    position: { x: 0.68, y: 0.45 },
    radius: 0.1,
    title: '壁炉煞',
    description: '壁炉位于客厅正中且火势旺盛，若火气过重会破坏五行平衡。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-005-a', label: '在周围放置盆栽绿植', correct: true },
      { id: 'opt-005-b', label: '向壁炉内添加更多木柴', correct: false },
      { id: 'opt-005-c', label: '在壁炉上方悬挂镜子', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-006',
    type: 'sky_split',
    position: { x: 0.92, y: 0.5 },
    radius: 0.08,
    title: '天斩煞',
    description: '窗外两栋高楼之间形成狭窄的垂直缝隙，如同刀劈一般正对房屋。',
    correctItem: 'shan-hai-zhen',
    options: [
      { id: 'opt-006-a', label: '在窗户正对处悬挂山海镇', correct: true },
      { id: 'opt-006-b', label: '常开窗户保持空气流通', correct: false },
      { id: 'opt-006-c', label: '在窗台上放置空花瓶', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 19 ============
const level19ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'back_door_sha',
    position: { x: 0.45, y: 0.5 },
    radius: 0.12,
    title: '背门煞',
    description: '办公椅背对着房间的开放区域和通道，背后无靠山，容易导致心神不宁。',
    correctItem: 'dragon-turtle',
    options: [
      { id: 'opt-001-a', label: '在办公桌上放置龙龟摆件', correct: true },
      { id: 'opt-001-b', label: '在桌上摆放一盆仙人掌', correct: false },
      { id: 'opt-001-c', label: '悬挂一串风铃', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'beam_sha',
    position: { x: 0.65, y: 0.35 },
    radius: 0.1,
    title: '横梁压顶',
    description: '巨大的横梁直接位于沙发正上方，会对坐在下面的人产生心理压力和压迫感。',
    correctItem: 'gourd',
    options: [
      { id: 'opt-002-a', label: '在横梁两端或下方挂葫芦', correct: true },
      { id: 'opt-002-b', label: '放置一面镜子反射横梁', correct: false },
      { id: 'opt-002-c', label: '在茶几上放招财猫', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'wealth_sha',
    position: { x: 0.15, y: 0.7 },
    radius: 0.1,
    title: '财位问题',
    description: '房间进门的对角线位置通常是明财位，此处堆满了杂物和纸箱，导致财气无法聚集。',
    correctItem: 'money-toad',
    options: [
      { id: 'opt-003-a', label: '清理杂物并摆放招财摆件', correct: true },
      { id: 'opt-003-b', label: '挂上厚重的深色窗帘', correct: false },
      { id: 'opt-003-c', label: '悬挂八卦镜对着杂物', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'wall_blade',
    position: { x: 0.85, y: 0.55 },
    radius: 0.08,
    title: '壁刀煞',
    description: '外部建筑的尖锐墙角正对窗户，形成壁刀煞。',
    correctItem: 'bagua-mirror',
    options: [
      { id: 'opt-004-a', label: '在窗边悬挂八卦镜反射', correct: true },
      { id: 'opt-004-b', label: '打开窗户让煞气进入', correct: false },
      { id: 'opt-004-c', label: '在窗前放置鱼缸', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-005',
    type: 'smell_sha',
    position: { x: 0.88, y: 0.65 },
    radius: 0.08,
    title: '味煞',
    description: '卫生间门敞开，且有明显的异味飘出，污秽之气直冲外部空间。',
    correctItem: 'curtain',
    options: [
      { id: 'opt-005-a', label: '在卫生间门上悬挂门帘', correct: true },
      { id: 'opt-005-b', label: '在门口放置一把剪刀', correct: false },
      { id: 'opt-005-c', label: '在门口摆放鱼缸', correct: false },
    ],
    resolved: false,
  },
];

// ============ Level 20 ============
const level20ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'beam_sha',
    position: { x: 0.35, y: 0.3 },
    radius: 0.12,
    title: '横梁压顶',
    description: '卧室床头正上方有一根巨大的横梁，给人造成心理压力和压迫感。',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: '在横梁两端悬挂葫芦化解煞气', correct: true },
      { id: 'opt-001-b', label: '在横梁下方放置一个鱼缸', correct: false },
      { id: 'opt-001-c', label: '将横梁漆成红色', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'mirror_sha',
    position: { x: 0.6, y: 0.45 },
    radius: 0.1,
    title: '镜冲床',
    description: '巨大的全身镜直接正对床铺，镜子反射的光线和影像会干扰人的睡眠气场。',
    correctItem: null,
    options: [
      { id: 'opt-002-a', label: '旋转镜子角度或平时用布遮盖', correct: true },
      { id: 'opt-002-b', label: '每天擦拭镜子保持光亮', correct: false },
      { id: 'opt-002-c', label: '在镜子前摆放一盆仙人掌', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'sky_split',
    position: { x: 0.15, y: 0.5 },
    radius: 0.1,
    title: '天斩煞',
    description: '窗外两栋高楼之间形成狭窄的垂直缝隙，如同刀劈一般正对窗户。',
    correctItem: 'shan-hai-zhen',
    options: [
      { id: 'opt-003-a', label: '在窗户正对处悬挂山海镇', correct: true },
      { id: 'opt-003-b', label: '常开窗户保持空气流通', correct: false },
      { id: 'opt-003-c', label: '在窗台上放置空花瓶', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'reverse_bow',
    position: { x: 0.85, y: 0.45 },
    radius: 0.1,
    title: '反弓煞',
    description: '窗外的道路呈弧形弓背状对着楼宇，会导致金钱流失和家庭不和。',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-004-a', label: '在窗边放置阔叶绿植进行缓冲', correct: true },
      { id: 'opt-004-b', label: '悬挂风铃吸引注意力', correct: false },
      { id: 'opt-004-c', label: '安装强力射灯照射马路', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-005',
    type: 'wealth_sha',
    position: { x: 0.2, y: 0.7 },
    radius: 0.1,
    title: '财位问题',
    description: '房间角落堆满了报纸、杂物和电子垃圾，阻碍了财气的聚集。',
    correctItem: 'pi-xiu',
    options: [
      { id: 'opt-005-a', label: '清理杂物并放置招财摆件', correct: true },
      { id: 'opt-005-b', label: '用黑布将杂物遮盖起来', correct: false },
      { id: 'opt-005-c', label: '在此处放置垃圾桶方便丢弃', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-006',
    type: 'yin_sha',
    position: { x: 0.08, y: 0.55 },
    radius: 0.08,
    title: '阴煞',
    description: '该区域光线极度昏暗，且显得阴冷，容易积聚阴气。',
    correctItem: 'salt-lamp',
    options: [
      { id: 'opt-006-a', label: '在此处放置盐灯以提升阳气', correct: true },
      { id: 'opt-006-b', label: '泼洒清水进行净化', correct: false },
      { id: 'opt-006-c', label: '放置深色地毯吸收光线', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-007',
    type: 'door_clash',
    position: { x: 0.5, y: 0.85 },
    radius: 0.1,
    title: '门冲',
    description: '卧室门与阳台门形成直冲，气流直来直去，无法藏风聚气。',
    correctItem: 'screen',
    options: [
      { id: 'opt-007-a', label: '在门之间放置屏风阻隔', correct: true },
      { id: 'opt-007-b', label: '将两扇门都封死', correct: false },
      { id: 'opt-007-c', label: '在门上贴红纸', correct: false },
    ],
    resolved: false,
  },
];

// ============ 气场颜色配置 ============
const AURA_COLORS = {
  water: { primary: '#4A6FA5', secondary: '#2D4A6F', glow: 'rgba(74, 111, 165, 0.15)' } as AuraColor,
  wind: { primary: '#7B68A6', secondary: '#5A4A7F', glow: 'rgba(123, 104, 166, 0.2)' } as AuraColor,
  fire: { primary: '#A65D57', secondary: '#7F3D38', glow: 'rgba(166, 93, 87, 0.2)' } as AuraColor,
  earth: { primary: '#8B7355', secondary: '#6B5344', glow: 'rgba(139, 115, 85, 0.2)' } as AuraColor,
  metal: { primary: '#9CA3AF', secondary: '#6B7280', glow: 'rgba(156, 163, 175, 0.15)' } as AuraColor,
  wood: { primary: '#5D7A5D', secondary: '#3D5A3D', glow: 'rgba(93, 122, 93, 0.2)' } as AuraColor,
  gold: { primary: '#C4A06A', secondary: '#8B6914', glow: 'rgba(196, 160, 106, 0.2)' } as AuraColor,
};

/** 关卡配置数据 */
export const levels: LevelWithAura[] = [
  // ============ 第壹章：初窥门径 (Level 1-5) ============
  {
    id: 'level-1',
    name: '开发者的地牢',
    nameEn: 'Dev Dungeon',
    description: '雨夜单身公寓 · 教程关',
    shaCount: 1,
    locked: false,
    difficulty: 'easy',
    estimatedTime: '2-3分钟',
    chapter: '初窥门径',
    auraColor: AURA_COLORS.water,
    images: {
      cold: '/images/level1/room-cold.png',
      warm: '/images/level1/room-warm.png',
    },
    items: {},
    shaPoints: level1ShaPoints,
  },
  {
    id: 'level-2',
    name: '猫奴的卧室',
    nameEn: "Cat Lover's Bedroom",
    description: '单身公寓 · 镜冲床',
    shaCount: 1,
    locked: false,
    difficulty: 'easy',
    estimatedTime: '3-5分钟',
    chapter: '初窥门径',
    auraColor: AURA_COLORS.wind,
    images: {
      cold: '/images/level2/room-cold.png',
      warm: '/images/level2/room-warm.png',
    },
    items: {},
    shaPoints: level2ShaPoints,
  },
  {
    id: 'level-3',
    name: '学生宿舍',
    nameEn: 'Student Dormitory',
    description: '狭窄宿舍 · 尖角煞',
    shaCount: 1,
    locked: false,
    difficulty: 'easy',
    estimatedTime: '3-5分钟',
    chapter: '初窥门径',
    auraColor: AURA_COLORS.fire,
    images: {
      cold: '/images/level3/room-cold.png',
      warm: '/images/level3/room-warm.png',
    },
    items: {},
    shaPoints: level3ShaPoints,
  },
  {
    id: 'level-4',
    name: '猫奴的客厅',
    nameEn: "Cat Lady's Living Room",
    description: '公寓客厅 · 门冲 + 味煞',
    shaCount: 2,
    locked: false,
    difficulty: 'normal',
    estimatedTime: '5-8分钟',
    chapter: '初窥门径',
    auraColor: AURA_COLORS.earth,
    images: {
      cold: '/images/level4/room-cold.png',
      warm: '/images/level4/room-warm.png',
    },
    items: {},
    shaPoints: level4ShaPoints,
  },
  {
    id: 'level-5',
    name: '游戏宅卧室',
    nameEn: "Gamer's Bedroom",
    description: '卧室 · 横梁 + 尖角煞',
    shaCount: 2,
    locked: false,
    difficulty: 'normal',
    estimatedTime: '5-8分钟',
    chapter: '初窥门径',
    auraColor: AURA_COLORS.wood,
    images: {
      cold: '/images/level5/room-cold.png',
      warm: '/images/level5/room-warm.png',
    },
    items: {},
    shaPoints: level5ShaPoints,
  },
  // ============ 第贰章：渐入佳境 (Level 6-10) ============
  {
    id: 'level-6',
    name: '创业工作室',
    nameEn: 'Startup Studio',
    description: '小型办公室 · 背门煞 + 柱角煞',
    shaCount: 2,
    locked: false,
    difficulty: 'normal',
    estimatedTime: '5-8分钟',
    chapter: '渐入佳境',
    auraColor: AURA_COLORS.metal,
    images: {
      cold: '/images/level6/room-cold.png',
      warm: '/images/level6/room-warm.png',
    },
    items: {},
    shaPoints: level6ShaPoints,
  },
  {
    id: 'level-7',
    name: '小夫妻婚房',
    nameEn: 'Newlywed Home',
    description: '一室一厅 · 镜冲床 + 尖角煞',
    shaCount: 2,
    locked: false,
    difficulty: 'normal',
    estimatedTime: '6-10分钟',
    chapter: '渐入佳境',
    auraColor: AURA_COLORS.water,
    images: {
      cold: '/images/level7/room-cold.png',
      warm: '/images/level7/room-warm.png',
    },
    items: {},
    shaPoints: level7ShaPoints,
  },
  {
    id: 'level-8',
    name: '开放式厨房公寓',
    nameEn: 'Open Kitchen Apartment',
    description: '开放式公寓 · 灶台冲 + 穿堂煞 + 横梁',
    shaCount: 3,
    locked: false,
    difficulty: 'normal',
    estimatedTime: '8-12分钟',
    chapter: '渐入佳境',
    auraColor: AURA_COLORS.fire,
    images: {
      cold: '/images/level8/room-cold.png',
      warm: '/images/level8/room-warm.png',
    },
    items: {},
    shaPoints: level8ShaPoints,
  },
  {
    id: 'level-9',
    name: '阁楼房间',
    nameEn: 'Attic Room',
    description: '斜顶阁楼 · 斜顶压床 + 窗户煞 + 阴煞',
    shaCount: 3,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '8-12分钟',
    chapter: '渐入佳境',
    auraColor: AURA_COLORS.earth,
    images: {
      cold: '/images/level9/room-cold.png',
      warm: '/images/level9/room-warm.png',
    },
    items: {},
    shaPoints: level9ShaPoints,
  },
  {
    id: 'level-10',
    name: '老人的卧室',
    nameEn: "Elder's Bedroom",
    description: '简朴卧室 · 横梁 + 阴煞 + 门冲',
    shaCount: 3,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '8-12分钟',
    chapter: '渐入佳境',
    auraColor: AURA_COLORS.wind,
    images: {
      cold: '/images/level10/room-cold.png',
      warm: '/images/level10/room-warm.png',
    },
    items: {},
    shaPoints: level10ShaPoints,
  },
  // ============ 第叁章：融会贯通 (Level 11-15) ============
  {
    id: 'level-11',
    name: '开放式Loft',
    nameEn: 'Open Loft',
    description: 'Loft公寓 · 楼梯冲门 + 穿堂煞 + 灶台 + 横梁',
    shaCount: 4,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '10-15分钟',
    chapter: '融会贯通',
    auraColor: AURA_COLORS.wood,
    images: {
      cold: '/images/level11/room-cold.png',
      warm: '/images/level11/room-warm.png',
    },
    items: {},
    shaPoints: level11ShaPoints,
  },
  {
    id: 'level-12',
    name: '程序员工位',
    nameEn: "Programmer's Desk",
    description: '办公工位 · 横梁 + 柱角煞 + 电线煞 + 财位',
    shaCount: 4,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '10-15分钟',
    chapter: '融会贯通',
    auraColor: AURA_COLORS.metal,
    images: {
      cold: '/images/level12/room-cold.png',
      warm: '/images/level12/room-warm.png',
    },
    items: {},
    shaPoints: level12ShaPoints,
  },
  {
    id: 'level-13',
    name: '小型办公室',
    nameEn: 'Small Office',
    description: '10人办公室 · 横梁 + 门冲 + 财位',
    shaCount: 3,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '10-15分钟',
    chapter: '融会贯通',
    auraColor: AURA_COLORS.water,
    images: {
      cold: '/images/level13/room-cold.png',
      warm: '/images/level13/room-warm.png',
    },
    items: {},
    shaPoints: level13ShaPoints,
  },
  {
    id: 'level-14',
    name: '儿童房',
    nameEn: "Children's Room",
    description: '儿童卧室 · 横梁 + 镜煞 + 门冲',
    shaCount: 3,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '8-12分钟',
    chapter: '融会贯通',
    auraColor: AURA_COLORS.fire,
    images: {
      cold: '/images/level14/room-cold.png',
      warm: '/images/level14/room-warm.png',
    },
    items: {},
    shaPoints: level14ShaPoints,
  },
  {
    id: 'level-15',
    name: '艺术家工作室',
    nameEn: "Artist's Studio",
    description: '画室/工作室 · 综合煞气 + 阴阳失衡',
    shaCount: 5,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '12-18分钟',
    chapter: '融会贯通',
    auraColor: AURA_COLORS.earth,
    images: {
      cold: '/images/level15/room-cold.png',
      warm: '/images/level15/room-warm.png',
    },
    items: {},
    shaPoints: level15ShaPoints,
  },
  // ============ 第肆章：超凡入圣 (Level 16-20) ============
  {
    id: 'level-16',
    name: '瑜伽工作室',
    nameEn: 'Yoga Studio',
    description: '禅意空间 · 财位 + 阴煞 + 尖角煞 + 窗户煞 + 味煞',
    shaCount: 5,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '12-18分钟',
    chapter: '超凡入圣',
    auraColor: AURA_COLORS.wood,
    images: {
      cold: '/images/level16/room-cold.png',
      warm: '/images/level16/room-warm.png',
    },
    items: {},
    shaPoints: level16ShaPoints,
  },
  {
    id: 'level-17',
    name: '复式公寓',
    nameEn: 'Duplex Apartment',
    description: '二层卧室 · 横梁 + 镜煞 + 楼梯下煞 + 阴煞 + 尖角煞',
    shaCount: 5,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '15-20分钟',
    chapter: '超凡入圣',
    auraColor: AURA_COLORS.wind,
    images: {
      cold: '/images/level17/room-cold.png',
      warm: '/images/level17/room-warm.png',
    },
    items: {},
    shaPoints: level17ShaPoints,
  },
  {
    id: 'level-18',
    name: '别墅客厅',
    nameEn: 'Villa Living Room',
    description: '大型客厅 · 路冲煞 + 天斩煞 + 财位 + 门冲 + 壁炉煞 + 反弓煞',
    shaCount: 6,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '18-25分钟',
    chapter: '超凡入圣',
    auraColor: AURA_COLORS.gold,
    images: {
      cold: '/images/level18/room-cold.png',
      warm: '/images/level18/room-warm.png',
    },
    items: {},
    shaPoints: level18ShaPoints,
  },
  {
    id: 'level-19',
    name: '高管办公室',
    nameEn: "Executive's Office",
    description: '高管办公室 · 背门煞 + 壁刀煞 + 财位 + 横梁 + 味煞',
    shaCount: 5,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '15-20分钟',
    chapter: '超凡入圣',
    auraColor: AURA_COLORS.metal,
    images: {
      cold: '/images/level19/room-cold.png',
      warm: '/images/level19/room-warm.png',
    },
    items: {},
    shaPoints: level19ShaPoints,
  },
  {
    id: 'level-20',
    name: '风水大考',
    nameEn: 'Final Feng Shui Test',
    description: '终极挑战 · 综合场景 · 大师级煞气',
    shaCount: 7,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '20-30分钟',
    chapter: '超凡入圣',
    auraColor: AURA_COLORS.gold,
    images: {
      cold: '/images/level20/room-cold.png',
      warm: '/images/level20/room-warm.png',
    },
    items: {},
    shaPoints: level20ShaPoints,
  },
];

/** 根据 ID 获取关卡 */
export function getLevelById(id: string): Level | undefined {
  return levels.find((level) => level.id === id);
}

/** 获取指定章节的关卡列表 */
export function getLevelsByChapter(chapterId: number): LevelWithAura[] {
  const chapter = CHAPTERS.find(c => c.id === chapterId);
  if (!chapter) return [];
  return levels.filter(l => {
    const levelNum = l.id.split('-')[1];
    if (!levelNum) return false;
    const num = parseInt(levelNum);
    return num >= chapter.range[0] && num <= chapter.range[1];
  });
}