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

/** Chapter Configuration */
export const CHAPTERS = [
  { id: 1, name: 'First Steps', symbol: 'I', range: [1, 5] as const },
  { id: 2, name: 'Getting Better', symbol: 'II', range: [6, 10] as const },
  { id: 3, name: 'Deep Insight', symbol: 'III', range: [11, 15] as const },
  { id: 4, name: 'True Master', symbol: 'IV', range: [16, 20] as const },
] as const;

// ============ Level 1 ============
const level1ShaPoints: Level['shaPoints'] = [
  {
    id: 'sha-001',
    type: 'beam_sha',
    position: { x: 0.5, y: 0.25 },
    radius: 0.12,
    title: 'Beam Pressure',
    description: 'A heavy wooden beam crosses directly above the bed. In Feng Shui, this "beam pressure" causes stress, headaches, and poor sleep.',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: 'Hang a gourd on both ends of the beam', correct: true },
      { id: 'opt-001-b', label: 'Place a screen beside the bed', correct: false },
      { id: 'opt-001-c', label: 'Put a mirror on the windowsill', correct: false },
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
    title: 'Mirror Facing Bed',
    description: 'A full-body mirror on the wardrobe faces the bed directly. Night reflections cause anxiety and disturb sleep quality.',
    correctItem: null,
    options: [
      { id: 'opt-001-a', label: 'Cover the mirror with thick cloth', correct: false },
      { id: 'opt-001-b', label: 'Rotate the mirror to a different angle', correct: true },
      { id: 'opt-001-c', label: 'Place a cat tree in front of the mirror', correct: false },
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
    title: 'Sharp Corner Sha',
    description: 'The desk corner points directly at the lower bunk. This "sharp corner sha" causes restless sleep and tension in small spaces.',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-001-a', label: 'Place a broad-leaf plant to neutralize', correct: true },
      { id: 'opt-001-b', label: 'Move the desk to the hallway', correct: false },
      { id: 'opt-001-c', label: 'Hang a mirror to reflect', correct: false },
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
    title: 'Through-Hall Sha',
    description: 'The entrance door and balcony door align perfectly. Qi flows straight through, making it hard to accumulate wealth and energy.',
    correctItem: 'screen',
    options: [
      { id: 'opt-001-a', label: 'Set up a screen near the entrance', correct: true },
      { id: 'opt-001-b', label: 'Place a scratching post at the door', correct: false },
      { id: 'opt-001-c', label: 'Keep the balcony door closed year-round', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'smell_sha',
    position: { x: 0.68, y: 0.52 },
    radius: 0.1,
    title: 'Odor Sha',
    description: 'The litter box sits openly in the living area. Bad odors spread and affect the room energy.',
    correctItem: 'curtain',
    options: [
      { id: 'opt-002-a', label: 'Add a curtain or divider to shield it', correct: true },
      { id: 'opt-002-b', label: 'Place more air fresheners', correct: false },
      { id: 'opt-002-c', label: 'Open windows for ventilation', correct: false },
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
    title: 'Beam Pressure',
    description: 'A thick wooden beam crosses directly above the head of the bed, creating oppressive visual and psychological pressure.',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: 'Hang a Feng Shui gourd', correct: true },
      { id: 'opt-001-b', label: 'Move the bed under the window', correct: false },
      { id: 'opt-001-c', label: 'Cover the beam with posters', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'sharp_corner_sha',
    position: { x: 0.54, y: 0.52 },
    radius: 0.08,
    title: 'Sharp Corner Sha',
    description: 'The L-shaped desk forms a sharp corner pointing directly at the bed side.',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: 'Place a broad-leaf plant to neutralize', correct: true },
      { id: 'opt-002-b', label: 'Saw off the corner to round it', correct: false },
      { id: 'opt-002-c', label: 'Move the computer tower', correct: false },
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
    title: 'Back-To-Door Sha',
    description: 'The desk chair faces away from the door. Having people walk behind causes unease and attracts trouble.',
    correctItem: 'dragon-turtle',
    options: [
      { id: 'opt-001-a', label: 'Place a dragon turtle on the desk', correct: true },
      { id: 'opt-001-b', label: 'Hang a wind chime on the door', correct: false },
      { id: 'opt-001-c', label: 'Replace the chair with a low stool', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'pillar_sha',
    position: { x: 0.68, y: 0.55 },
    radius: 0.12,
    title: 'Pillar Corner Sha',
    description: 'A load-bearing pillar corner points at the desk area. This sharp corner energy affects decision-making.',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: 'Place a broad-leaf plant to block', correct: true },
      { id: 'opt-002-b', label: 'Hang a mirror on the pillar', correct: false },
      { id: 'opt-002-c', label: 'Paint the pillar red', correct: false },
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
    title: 'Mirror Facing Bed',
    description: 'A large mirror on the partition wall faces the bed directly. During sleep, one is most vulnerable - mirror reflections disturb the energy field.',
    correctItem: null,
    options: [
      { id: 'opt-001-a', label: 'Install a cloth curtain to cover the mirror', correct: true },
      { id: 'opt-001-b', label: 'Stick a bagua pattern on the mirror', correct: false },
      { id: 'opt-001-c', label: 'Put a cup of salt water on the nightstand', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'sharp_corner_sha',
    position: { x: 0.72, y: 0.48 },
    radius: 0.1,
    title: 'Sharp Corner Sha',
    description: 'The bookshelf corner forms a 90-degree angle pointing at the center activity area.',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: 'Place a broad-leaf plant in front of the corner', correct: true },
      { id: 'opt-002-b', label: 'Hang scissors at the corner', correct: false },
      { id: 'opt-002-c', label: 'Paint the bookshelf red', correct: false },
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
    title: 'Stove Clash Sha',
    description: 'The open kitchen stove has no barrier. Fire energy rushes toward the living area, preventing wealth accumulation.',
    correctItem: 'screen',
    options: [
      { id: 'opt-001-a', label: 'Place a screen as a barrier', correct: true },
      { id: 'opt-001-b', label: 'Move the stove to the balcony', correct: false },
      { id: 'opt-001-c', label: 'Place a fire extinguisher nearby', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'door_clash',
    position: { x: 0.58, y: 0.3 },
    radius: 0.12,
    title: 'Through-Hall Sha',
    description: 'A large balcony door opens directly to the interior. Qi flows straight through without gathering.',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: 'Place broad-leaf plants to gather energy', correct: true },
      { id: 'opt-002-b', label: 'Seal the door shut', correct: false },
      { id: 'opt-002-c', label: 'Hang a mirror to reflect', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'beam_sha',
    position: { x: 0.62, y: 0.72 },
    radius: 0.1,
    title: 'Beam Pressure',
    description: 'The sofa sits under a structural beam. Long-term sitting here causes psychological stress.',
    correctItem: 'gourd',
    options: [
      { id: 'opt-003-a', label: 'Hang a gourd to neutralize the sha', correct: true },
      { id: 'opt-003-b', label: 'Shorten the sofa legs', correct: false },
      { id: 'opt-003-c', label: 'Put pillows on the sofa', correct: false },
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
    title: 'Slanted Ceiling Over Bed',
    description: 'The bed sits directly under a slanted ceiling. Long-term sleep here causes stress and poor sleep quality.',
    correctItem: null,
    options: [
      { id: 'opt-001-a', label: 'Move the bed to a flat ceiling area', correct: true },
      { id: 'opt-001-b', label: 'Hang a mirror above the bed to reflect', correct: false },
      { id: 'opt-001-c', label: 'Hang heavy decorations from the slant', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'window_sha',
    position: { x: 0.65, y: 0.2 },
    radius: 0.1,
    title: 'Window Sha',
    description: 'The skylight provides light but without covering, the large opening prevents energy from gathering.',
    correctItem: 'curtain',
    options: [
      { id: 'opt-002-a', label: 'Install blackout curtains', correct: true },
      { id: 'opt-002-b', label: 'Remove the window glass', correct: false },
      { id: 'opt-002-c', label: 'Place a fish tank under the window', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'yin_sha',
    position: { x: 0.2, y: 0.7 },
    radius: 0.1,
    title: 'Yin Sha',
    description: 'The corner is dimly lit with piled clutter, breeding bacteria and gathering "yin sha" negative energy.',
    correctItem: 'salt-lamp',
    options: [
      { id: 'opt-003-a', label: 'Clear clutter and place a salt lamp', correct: true },
      { id: 'opt-003-b', label: 'Place a large fish tank to wash the corner', correct: false },
      { id: 'opt-003-c', label: 'Hang a dark heavy tapestry to cover', correct: false },
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
    title: 'Beam Pressure',
    description: 'A massive dark wooden beam crosses directly above the bed - one of the most serious Feng Shui issues.',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: 'Hang gourds at both ends of the beam', correct: true },
      { id: 'opt-001-b', label: 'Place a basin of water under the beam', correct: false },
      { id: 'opt-001-c', label: 'Paint the beam dark red for protection', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'yin_sha',
    position: { x: 0.75, y: 0.6 },
    radius: 0.1,
    title: 'Yin Sha',
    description: 'The room is extremely dim with clutter in corners and medicine by the bed, showing stagnant energy and heavy yin.',
    correctItem: 'salt-lamp',
    options: [
      { id: 'opt-002-a', label: 'Place a Himalayan salt lamp or warm lighting', correct: true },
      { id: 'opt-002-b', label: 'Hang a metal wind chime by the bed', correct: false },
      { id: 'opt-002-c', label: 'Place a large fish tank', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'door_clash',
    position: { x: 0.15, y: 0.5 },
    radius: 0.08,
    title: 'Door Clash',
    description: 'The bedroom door opens toward the bed area. Direct airflow may disturb sleep energy.',
    correctItem: 'curtain',
    options: [
      { id: 'opt-003-a', label: 'Hang a long curtain on the door', correct: true },
      { id: 'opt-003-b', label: 'Hang a bagua mirror facing the bed', correct: false },
      { id: 'opt-003-c', label: 'Remove the door entirely', correct: false },
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
    title: 'Stair Clash',
    description: 'A spiral staircase faces the entrance. Qi rushes down the stairs and out, making it hard to accumulate wealth.',
    correctItem: 'screen',
    options: [
      { id: 'opt-001-a', label: 'Place a screen to block the airflow', correct: true },
      { id: 'opt-001-b', label: 'Lay red carpet on the stairs', correct: false },
      { id: 'opt-001-c', label: 'Pile clutter under the stairs', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'beam_sha',
    position: { x: 0.52, y: 0.38 },
    radius: 0.1,
    title: 'Beam Pressure',
    description: 'A massive steel beam crosses above the sofa. Long-term presence here affects mental health and fortune.',
    correctItem: 'gourd',
    options: [
      { id: 'opt-002-a', label: 'Hang a gourd to neutralize', correct: true },
      { id: 'opt-002-b', label: 'Paint the beam white', correct: false },
      { id: 'opt-002-c', label: 'Install a chandelier under the beam', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'door_clash',
    position: { x: 0.88, y: 0.3 },
    radius: 0.12,
    title: 'Through-Hall Sha',
    description: 'The entrance faces a huge floor-to-ceiling window. Qi enters and immediately exits - a classic "through-hall sha".',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-003-a', label: 'Place broad-leaf plants by the window', correct: true },
      { id: 'opt-003-b', label: 'Place a mirror here', correct: false },
      { id: 'opt-003-c', label: 'Seal this window shut', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'kitchen_sha',
    position: { x: 0.82, y: 0.58 },
    radius: 0.08,
    title: 'Exposed Stove',
    description: 'The open kitchen stove is fully exposed. Fire energy rushes toward the living area.',
    correctItem: 'screen',
    options: [
      { id: 'opt-004-a', label: 'Use a screen to block the stove view', correct: true },
      { id: 'opt-004-b', label: 'Hang a mirror above the stove', correct: false },
      { id: 'opt-004-c', label: 'Enclose the stove', correct: false },
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
    title: 'Beam Pressure',
    description: 'A huge concrete beam crosses directly above the desk, creating heavy visual and psychological oppression.',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: 'Hang a gourd under the beam', correct: true },
      { id: 'opt-001-b', label: 'Place a mirror on desk to reflect upward', correct: false },
      { id: 'opt-001-c', label: 'Paint the beam red for celebration', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'pillar_sha',
    position: { x: 0.65, y: 0.5 },
    radius: 0.1,
    title: 'Pillar Corner Sha',
    description: 'The square pillar corner points at the desk area, creating sharp energy that cuts the magnetic field.',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: 'Place broad-leaf plants in front of the corner', correct: true },
      { id: 'opt-002-b', label: 'Hang fierce animal pictures', correct: false },
      { id: 'opt-002-c', label: 'Drive nails into the pillar', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'electric_sha',
    position: { x: 0.35, y: 0.7 },
    radius: 0.08,
    title: 'Wire Sha',
    description: 'Massive power and data cables tangle on the floor like snakes, disrupting the energy field.',
    correctItem: 'copper-gourd',
    options: [
      { id: 'opt-003-a', label: 'Organize cables and place a copper gourd', correct: true },
      { id: 'opt-003-b', label: 'Place a basin of water among the wires', correct: false },
      { id: 'opt-003-c', label: 'Cut unused wires and leave them there', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'wealth_sha',
    position: { x: 0.12, y: 0.65 },
    radius: 0.1,
    title: 'Wealth Spot Polluted',
    description: 'The diagonal corner is piled with old boxes, clutter, and dead plants, polluting the wealth position.',
    correctItem: 'money-toad',
    options: [
      { id: 'opt-004-a', label: 'Clear clutter and place wealth symbols', correct: true },
      { id: 'opt-004-b', label: 'Place an open trash can here', correct: false },
      { id: 'opt-004-c', label: 'Add more clutter to suppress wealth', correct: false },
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
    title: 'Beam Pressure',
    description: 'A massive black cross-shaped steel beam crosses above the central office area.',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: 'Hang gourds under the beam or move desks', correct: true },
      { id: 'opt-001-b', label: 'Hang mirrors on the beam to reflect pressure', correct: false },
      { id: 'opt-001-c', label: 'Paint the beam bright red', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'door_clash',
    position: { x: 0.85, y: 0.65 },
    radius: 0.1,
    title: 'Door Clash',
    description: 'When the office door opens, airflow rushes directly at the nearby desk area.',
    correctItem: 'screen',
    options: [
      { id: 'opt-002-a', label: 'Set up a screen between door and desk', correct: true },
      { id: 'opt-002-b', label: 'Turn desk to face the door directly', correct: false },
      { id: 'opt-002-c', label: 'Install bright spotlights on door frame', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'wealth_sha',
    position: { x: 0.15, y: 0.7 },
    radius: 0.1,
    title: 'Wealth Spot Issue',
    description: 'The diagonal corner is considered the "wealth position", but dirty floors affect wealth gathering.',
    correctItem: 'lucky-cat',
    options: [
      { id: 'opt-003-a', label: 'Clean the corner and keep it bright and tidy', correct: true },
      { id: 'opt-003-b', label: 'Place a large trash can in this corner', correct: false },
      { id: 'opt-003-c', label: 'Leave the area completely empty', correct: false },
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
    title: 'Beam Pressure',
    description: 'A massive dark wooden beam crosses directly above the bed, splitting it in half.',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: 'Hang gourds at beam ends or move the bed', correct: true },
      { id: 'opt-001-b', label: 'Hang wind chimes on the beam', correct: false },
      { id: 'opt-001-c', label: 'Paint the beam red', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'mirror_sha',
    position: { x: 0.75, y: 0.5 },
    radius: 0.1,
    title: 'Mirror Facing Bed',
    description: 'The wardrobe sliding door has a huge mirror facing the bed side directly.',
    correctItem: null,
    options: [
      { id: 'opt-002-a', label: 'Use thick cloth to cover mirror when sleeping', correct: true },
      { id: 'opt-002-b', label: 'Place a cactus in front of the mirror', correct: false },
      { id: 'opt-002-c', label: 'Polish the mirror daily', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'door_clash',
    position: { x: 0.15, y: 0.5 },
    radius: 0.1,
    title: 'Door Clash',
    description: 'When the room door opens, airflow rushes directly at the bed area.',
    correctItem: 'curtain',
    options: [
      { id: 'opt-003-a', label: 'Hang a long curtain on the door', correct: true },
      { id: 'opt-003-b', label: 'Keep the door open 24 hours', correct: false },
      { id: 'opt-003-c', label: 'Place shoes at the door to block sha', correct: false },
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
    title: 'Beam Pressure',
    description: 'A thick wooden beam crosses above the easel, creating psychological pressure for the artist.',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: 'Hang a copper gourd on the beam', correct: true },
      { id: 'opt-001-b', label: 'Hang wind chimes on the beam', correct: false },
      { id: 'opt-001-c', label: 'Paint the beam bright red', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'sharp_corner_sha',
    position: { x: 0.7, y: 0.45 },
    radius: 0.08,
    title: 'Sharp Corner Sha',
    description: 'The tall bookshelf has a sharp edge pointing at the central rest area.',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: 'Place broad-leaf plants at the sharp corner', correct: true },
      { id: 'opt-002-b', label: 'Hang a mirror at the corner to reflect', correct: false },
      { id: 'opt-002-c', label: 'Hang scissors to fight poison with poison', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'yin_sha',
    position: { x: 0.2, y: 0.65 },
    radius: 0.1,
    title: 'Yin Sha',
    description: 'The corner is dimly lit with piled clutter, easily gathering negative energy.',
    correctItem: 'salt-lamp',
    options: [
      { id: 'opt-003-a', label: 'Clear clutter and place a salt lamp', correct: true },
      { id: 'opt-003-b', label: 'Place a fish tank here', correct: false },
      { id: 'opt-003-c', label: 'Hang a dark landscape painting', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'smell_sha',
    position: { x: 0.88, y: 0.55 },
    radius: 0.08,
    title: 'Toilet Door Clash',
    description: 'The bathroom door faces the room interior with unpleasant odors, rushing toward the work area.',
    correctItem: 'curtain',
    options: [
      { id: 'opt-004-a', label: 'Hang a long curtain on the bathroom door', correct: true },
      { id: 'opt-004-b', label: 'Remove the door for an open arch', correct: false },
      { id: 'opt-004-c', label: 'Place coins at the bathroom door', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-005',
    type: 'window_sha',
    position: { x: 0.55, y: 0.18 },
    radius: 0.1,
    title: 'Window Sha',
    description: 'The huge industrial window next to the sink causes qi to flow straight through without gathering.',
    correctItem: 'curtain',
    options: [
      { id: 'opt-005-a', label: 'Install thick curtains or blinds', correct: true },
      { id: 'opt-005-b', label: 'Break all window glass for ventilation', correct: false },
      { id: 'opt-005-c', label: 'Place a bagua mirror on windowsill facing inward', correct: false },
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
    title: 'Wealth Spot Damaged',
    description: 'The entrance reception area is the wealth position, but has a broken fountain and clutter, causing wealth loss.',
    correctItem: 'money-toad',
    options: [
      { id: 'opt-001-a', label: 'Clear and place a money toad for wealth', correct: true },
      { id: 'opt-001-b', label: 'Simply throw away the fountain', correct: false },
      { id: 'opt-001-c', label: 'Place a fish tank', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'yin_sha',
    position: { x: 0.38, y: 0.22 },
    radius: 0.08,
    title: 'Yin Sha',
    description: 'The storage shelf corner is dimly lit, easily gathering yin energy and causing depression.',
    correctItem: 'salt-lamp',
    options: [
      { id: 'opt-002-a', label: 'Place a salt lamp to boost yang energy', correct: true },
      { id: 'opt-002-b', label: 'Pile more clutter', correct: false },
      { id: 'opt-002-c', label: 'Install strong exhaust fans', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'sharp_corner_sha',
    position: { x: 0.39, y: 0.68 },
    radius: 0.07,
    title: 'Sharp Corner Sha',
    description: 'The wooden box corner points at the yoga mat, creating sha energy that harms the practitioner aura.',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-003-a', label: 'Place broad-leaf plants to neutralize', correct: true },
      { id: 'opt-003-b', label: 'Saw off the corner', correct: false },
      { id: 'opt-003-c', label: 'Move the yoga mat', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'window_sha',
    position: { x: 0.72, y: 0.25 },
    radius: 0.1,
    title: 'Window Sha',
    description: 'The huge floor-to-ceiling window prevents energy gathering, affecting meditation practice.',
    correctItem: 'curtain',
    options: [
      { id: 'opt-004-a', label: 'Install curtains to regulate light', correct: true },
      { id: 'opt-004-b', label: 'Completely seal the window', correct: false },
      { id: 'opt-004-c', label: 'Place a mirror in front to reflect', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-005',
    type: 'smell_sha',
    position: { x: 0.9, y: 0.6 },
    radius: 0.08,
    title: 'Odor Sha',
    description: 'The changing room area has unpleasant odors, affecting overall energy.',
    correctItem: 'curtain',
    options: [
      { id: 'opt-005-a', label: 'Install a door curtain and keep ventilated', correct: true },
      { id: 'opt-005-b', label: 'Spray perfume to mask it', correct: false },
      { id: 'opt-005-c', label: 'Close the changing room door', correct: false },
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
    title: 'Beam Pressure',
    description: 'A massive wooden beam crosses above the bed - a major Feng Shui taboo.',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: 'Hang gourds at beam ends or move the bed', correct: true },
      { id: 'opt-001-b', label: 'Install mirrors on the beam to reflect sha', correct: false },
      { id: 'opt-001-c', label: 'Hang wind chimes under the beam', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'mirror_sha',
    position: { x: 0.7, y: 0.45 },
    radius: 0.1,
    title: 'Mirror Facing Bed',
    description: 'A large mirror on the wardrobe faces the bed. During sleep when one is most vulnerable, mirror reflections disturb the energy field.',
    correctItem: null,
    options: [
      { id: 'opt-002-a', label: 'Cover the mirror with thick cloth when sleeping', correct: true },
      { id: 'opt-002-b', label: 'Place a mirror by the bed to counter-clash', correct: false },
      { id: 'opt-002-c', label: 'Wipe the mirror with salt water daily', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'sharp_corner_sha',
    position: { x: 0.55, y: 0.55 },
    radius: 0.08,
    title: 'Sharp Corner Sha',
    description: 'Furniture sharp corners point at living areas or rest zones, forming sharp energy.',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-003-a', label: 'Place broad-leaf plants in front of the corner', correct: true },
      { id: 'opt-003-b', label: 'Hang scissors to fight poison with poison', correct: false },
      { id: 'opt-003-c', label: 'Paint the corner red as warning', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'yin_sha',
    position: { x: 0.25, y: 0.7 },
    radius: 0.1,
    title: 'Yin Sha',
    description: 'The roof corner lacks light with stagnant airflow, easily gathering yin energy.',
    correctItem: 'salt-lamp',
    options: [
      { id: 'opt-004-a', label: 'Place a Himalayan salt lamp for lighting', correct: true },
      { id: 'opt-004-b', label: 'Place a fish tank here', correct: false },
      { id: 'opt-004-c', label: 'Pile old books and clutter to fill space', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-005',
    type: 'stair_clash',
    position: { x: 0.15, y: 0.5 },
    radius: 0.1,
    title: 'Under-Stair Sha',
    description: 'The space under the stairs forms a oppressive corner, easily gathering yin energy.',
    correctItem: 'crystal-ball',
    options: [
      { id: 'opt-005-a', label: 'Place a crystal ball to purify energy', correct: true },
      { id: 'opt-005-b', label: 'Pile more clutter to fill it', correct: false },
      { id: 'opt-005-c', label: 'Install mirrors to reflect', correct: false },
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
    title: 'Road Clash Sha',
    description: 'The main door faces an external road or long corridor. Qi rushes straight in, causing emotional instability.',
    correctItem: 'stone-tablet',
    options: [
      { id: 'opt-001-a', label: 'Place a stone tablet (Shi Gan Dang)', correct: true },
      { id: 'opt-001-b', label: 'Hang a wind chime', correct: false },
      { id: 'opt-001-c', label: 'Install transparent glass on the door', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'reverse_bow',
    position: { x: 0.85, y: 0.35 },
    radius: 0.1,
    title: 'Reverse Bow Sha',
    description: 'The elevated road outside the floor-to-ceiling window curves, with the convex bow facing the house.',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-002-a', label: 'Place tall plants by the window', correct: true },
      { id: 'opt-002-b', label: 'Remove all curtains', correct: false },
      { id: 'opt-002-c', label: 'Hang scissors on the window', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'wealth_sha',
    position: { x: 0.15, y: 0.7 },
    radius: 0.1,
    title: 'Wealth Spot Issue',
    description: 'The living room wealth corner has broken vases and scattered debris - a "polluted wealth position".',
    correctItem: 'pi-xiu',
    options: [
      { id: 'opt-003-a', label: 'Clear clutter and place wealth symbols', correct: true },
      { id: 'opt-003-b', label: 'Place heavy gym equipment here', correct: false },
      { id: 'opt-003-c', label: 'Place an open trash can', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'door_clash',
    position: { x: 0.5, y: 0.55 },
    radius: 0.1,
    title: 'Door Clash',
    description: 'The arch and side door form a direct clash. Qi flows straight through, unfavorable for gathering.',
    correctItem: 'screen',
    options: [
      { id: 'opt-004-a', label: 'Set up a screen in the middle', correct: true },
      { id: 'opt-004-b', label: 'Install bright spotlights on doors', correct: false },
      { id: 'opt-004-c', label: 'Remove doors to make openings', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-005',
    type: 'fireplace_sha',
    position: { x: 0.68, y: 0.45 },
    radius: 0.1,
    title: 'Fireplace Sha',
    description: 'The fireplace is in the living room center with strong fire. Excessive fire disrupts five-element balance.',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-005-a', label: 'Place potted plants around it', correct: true },
      { id: 'opt-005-b', label: 'Add more firewood to the fireplace', correct: false },
      { id: 'opt-005-c', label: 'Hang a mirror above the fireplace', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-006',
    type: 'sky_split',
    position: { x: 0.92, y: 0.5 },
    radius: 0.08,
    title: 'Sky Split Sha',
    description: 'Two tall buildings outside form a narrow vertical gap, like a knife cut facing the house.',
    correctItem: 'shan-hai-zhen',
    options: [
      { id: 'opt-006-a', label: 'Hang a Shan Hai Zhen facing the window', correct: true },
      { id: 'opt-006-b', label: 'Keep windows open for airflow', correct: false },
      { id: 'opt-006-c', label: 'Place empty flower pots on windowsill', correct: false },
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
    title: 'Back-To-Door Sha',
    description: 'The office chair faces away from the open area and passage. No backing behind causes unease.',
    correctItem: 'dragon-turtle',
    options: [
      { id: 'opt-001-a', label: 'Place a dragon turtle on the desk', correct: true },
      { id: 'opt-001-b', label: 'Place a cactus on the desk', correct: false },
      { id: 'opt-001-c', label: 'Hang a wind chime', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'beam_sha',
    position: { x: 0.65, y: 0.35 },
    radius: 0.1,
    title: 'Beam Pressure',
    description: 'A massive beam is directly above the sofa, creating psychological pressure for those sitting below.',
    correctItem: 'gourd',
    options: [
      { id: 'opt-002-a', label: 'Hang gourds at beam ends or below', correct: true },
      { id: 'opt-002-b', label: 'Place a mirror to reflect the beam', correct: false },
      { id: 'opt-002-c', label: 'Put a lucky cat on the coffee table', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'wealth_sha',
    position: { x: 0.15, y: 0.7 },
    radius: 0.1,
    title: 'Wealth Spot Issue',
    description: 'The diagonal position from entrance is usually the wealth spot, but piled with clutter preventing wealth gathering.',
    correctItem: 'money-toad',
    options: [
      { id: 'opt-003-a', label: 'Clear clutter and place wealth symbols', correct: true },
      { id: 'opt-003-b', label: 'Hang heavy dark curtains', correct: false },
      { id: 'opt-003-c', label: 'Hang bagua mirror facing the clutter', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'wall_blade',
    position: { x: 0.85, y: 0.55 },
    radius: 0.08,
    title: 'Wall Blade Sha',
    description: 'An external building corner points at the window, forming a wall blade sha.',
    correctItem: 'bagua-mirror',
    options: [
      { id: 'opt-004-a', label: 'Hang a bagua mirror by the window to reflect', correct: true },
      { id: 'opt-004-b', label: 'Open the window to let sha in', correct: false },
      { id: 'opt-004-c', label: 'Place a fish tank in front of window', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-005',
    type: 'smell_sha',
    position: { x: 0.88, y: 0.65 },
    radius: 0.08,
    title: 'Odor Sha',
    description: 'The bathroom door is open with obvious unpleasant odors, polluting the external space.',
    correctItem: 'curtain',
    options: [
      { id: 'opt-005-a', label: 'Hang a curtain on the bathroom door', correct: true },
      { id: 'opt-005-b', label: 'Place scissors at the door', correct: false },
      { id: 'opt-005-c', label: 'Place a fish tank at the door', correct: false },
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
    title: 'Beam Pressure',
    description: 'A massive beam is directly above the bed head, creating psychological pressure.',
    correctItem: 'gourd',
    options: [
      { id: 'opt-001-a', label: 'Hang gourds at beam ends to neutralize', correct: true },
      { id: 'opt-001-b', label: 'Place a fish tank under the beam', correct: false },
      { id: 'opt-001-c', label: 'Paint the beam red', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-002',
    type: 'mirror_sha',
    position: { x: 0.6, y: 0.45 },
    radius: 0.1,
    title: 'Mirror Facing Bed',
    description: 'A huge full-body mirror faces the bed directly. Mirror reflections disturb sleep energy.',
    correctItem: null,
    options: [
      { id: 'opt-002-a', label: 'Rotate the mirror or cover with cloth', correct: true },
      { id: 'opt-002-b', label: 'Polish the mirror daily', correct: false },
      { id: 'opt-002-c', label: 'Place a cactus in front of mirror', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-003',
    type: 'sky_split',
    position: { x: 0.15, y: 0.5 },
    radius: 0.1,
    title: 'Sky Split Sha',
    description: 'Two tall buildings outside form a narrow vertical gap like a knife cut facing the window.',
    correctItem: 'shan-hai-zhen',
    options: [
      { id: 'opt-003-a', label: 'Hang a Shan Hai Zhen facing the window', correct: true },
      { id: 'opt-003-b', label: 'Keep windows open for airflow', correct: false },
      { id: 'opt-003-c', label: 'Place empty flower pots on windowsill', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-004',
    type: 'reverse_bow',
    position: { x: 0.85, y: 0.45 },
    radius: 0.1,
    title: 'Reverse Bow Sha',
    description: 'The road outside curves like a bow back facing the building, causing financial loss and family discord.',
    correctItem: 'plant-broad',
    options: [
      { id: 'opt-004-a', label: 'Place broad-leaf plants by the window as buffer', correct: true },
      { id: 'opt-004-b', label: 'Hang wind chimes to attract attention', correct: false },
      { id: 'opt-004-c', label: 'Install strong spotlights toward the road', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-005',
    type: 'wealth_sha',
    position: { x: 0.2, y: 0.7 },
    radius: 0.1,
    title: 'Wealth Spot Issue',
    description: 'The room corner is piled with newspapers, clutter, and e-waste, blocking wealth gathering.',
    correctItem: 'pi-xiu',
    options: [
      { id: 'opt-005-a', label: 'Clear clutter and place wealth symbols', correct: true },
      { id: 'opt-005-b', label: 'Cover clutter with black cloth', correct: false },
      { id: 'opt-005-c', label: 'Place a trash can here for convenience', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-006',
    type: 'yin_sha',
    position: { x: 0.08, y: 0.55 },
    radius: 0.08,
    title: 'Yin Sha',
    description: 'This area is extremely dim and cold, easily gathering yin energy.',
    correctItem: 'salt-lamp',
    options: [
      { id: 'opt-006-a', label: 'Place a salt lamp to boost yang energy', correct: true },
      { id: 'opt-006-b', label: 'Sprinkle clean water for purification', correct: false },
      { id: 'opt-006-c', label: 'Place dark carpet to absorb light', correct: false },
    ],
    resolved: false,
  },
  {
    id: 'sha-007',
    type: 'door_clash',
    position: { x: 0.5, y: 0.85 },
    radius: 0.1,
    title: 'Door Clash',
    description: 'Bedroom door and balcony door form a direct clash. Qi flows straight through without gathering.',
    correctItem: 'screen',
    options: [
      { id: 'opt-007-a', label: 'Place a screen between the doors', correct: true },
      { id: 'opt-007-b', label: 'Seal both doors shut', correct: false },
      { id: 'opt-007-c', label: 'Paste red paper on doors', correct: false },
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

/** Level Configuration Data */
export const levels: LevelWithAura[] = [
  // ============ Chapter I: First Steps (Level 1-5) ============
  {
    id: 'level-1',
    name: 'Dev Dungeon',
    nameEn: 'Dev Dungeon',
    description: 'Rainy Night Studio - Tutorial',
    shaCount: 1,
    locked: false,
    difficulty: 'easy',
    estimatedTime: '2-3 min',
    chapter: 'First Steps',
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
    name: "Cat Lover's Bedroom",
    nameEn: "Cat Lover's Bedroom",
    description: 'Studio - Mirror Facing Bed',
    shaCount: 1,
    locked: false,
    difficulty: 'easy',
    estimatedTime: '3-5 min',
    chapter: 'First Steps',
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
    name: 'Student Dorm',
    nameEn: 'Student Dorm',
    description: 'Cramped Room - Sharp Corner',
    shaCount: 1,
    locked: false,
    difficulty: 'easy',
    estimatedTime: '3-5 min',
    chapter: 'First Steps',
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
    name: "Cat Lady's Living Room",
    nameEn: "Cat Lady's Living Room",
    description: 'Apartment - Door Clash + Odor',
    shaCount: 2,
    locked: false,
    difficulty: 'normal',
    estimatedTime: '5-8 min',
    chapter: 'First Steps',
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
    name: "Gamer's Bedroom",
    nameEn: "Gamer's Bedroom",
    description: 'Bedroom - Beam + Sharp Corner',
    shaCount: 2,
    locked: false,
    difficulty: 'normal',
    estimatedTime: '5-8 min',
    chapter: 'First Steps',
    auraColor: AURA_COLORS.wood,
    images: {
      cold: '/images/level5/room-cold.png',
      warm: '/images/level5/room-warm.png',
    },
    items: {},
    shaPoints: level5ShaPoints,
  },
  // ============ Chapter II: Getting Better (Level 6-10) ============
  {
    id: 'level-6',
    name: 'Startup Studio',
    nameEn: 'Startup Studio',
    description: 'Small Office - Back-to-Door + Pillar',
    shaCount: 2,
    locked: false,
    difficulty: 'normal',
    estimatedTime: '5-8 min',
    chapter: 'Getting Better',
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
    name: 'Newlywed Home',
    nameEn: 'Newlywed Home',
    description: 'One Bedroom - Mirror + Sharp Corner',
    shaCount: 2,
    locked: false,
    difficulty: 'normal',
    estimatedTime: '6-10 min',
    chapter: 'Getting Better',
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
    name: 'Open Kitchen Apt',
    nameEn: 'Open Kitchen Apartment',
    description: 'Open Plan - Stove + Door Clash + Beam',
    shaCount: 3,
    locked: false,
    difficulty: 'normal',
    estimatedTime: '8-12 min',
    chapter: 'Getting Better',
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
    name: 'Attic Room',
    nameEn: 'Attic Room',
    description: 'Slanted Ceiling - Slope + Window + Yin',
    shaCount: 3,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '8-12 min',
    chapter: 'Getting Better',
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
    name: "Elder's Bedroom",
    nameEn: "Elder's Bedroom",
    description: 'Simple Room - Beam + Yin + Door Clash',
    shaCount: 3,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '8-12 min',
    chapter: 'Getting Better',
    auraColor: AURA_COLORS.wind,
    images: {
      cold: '/images/level10/room-cold.png',
      warm: '/images/level10/room-warm.png',
    },
    items: {},
    shaPoints: level10ShaPoints,
  },
  // ============ Chapter III: Deep Insight (Level 11-15) ============
  {
    id: 'level-11',
    name: 'Open Loft',
    nameEn: 'Open Loft',
    description: 'Loft Apt - Stair + Door Clash + Stove + Beam',
    shaCount: 4,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '10-15 min',
    chapter: 'Deep Insight',
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
    name: "Programmer's Desk",
    nameEn: "Programmer's Desk",
    description: 'Workstation - Beam + Pillar + Wire + Wealth',
    shaCount: 4,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '10-15 min',
    chapter: 'Deep Insight',
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
    name: 'Small Office',
    nameEn: 'Small Office',
    description: '10-Person Office - Beam + Door + Wealth',
    shaCount: 3,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '10-15 min',
    chapter: 'Deep Insight',
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
    name: "Children's Room",
    nameEn: "Children's Room",
    description: 'Kids Bedroom - Beam + Mirror + Door Clash',
    shaCount: 3,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '8-12 min',
    chapter: 'Deep Insight',
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
    name: "Artist's Studio",
    nameEn: "Artist's Studio",
    description: 'Art Studio - Complex Sha + Yin-Yang Imbalance',
    shaCount: 5,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '12-18 min',
    chapter: 'Deep Insight',
    auraColor: AURA_COLORS.earth,
    images: {
      cold: '/images/level15/room-cold.png',
      warm: '/images/level15/room-warm.png',
    },
    items: {},
    shaPoints: level15ShaPoints,
  },
  // ============ Chapter IV: True Master (Level 16-20) ============
  {
    id: 'level-16',
    name: 'Yoga Studio',
    nameEn: 'Yoga Studio',
    description: 'Zen Space - Wealth + Yin + Corner + Window + Odor',
    shaCount: 5,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '12-18 min',
    chapter: 'True Master',
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
    name: 'Duplex Apartment',
    nameEn: 'Duplex Apartment',
    description: '2F Bedroom - Beam + Mirror + Stair + Yin + Corner',
    shaCount: 5,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '15-20 min',
    chapter: 'True Master',
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
    name: 'Villa Living Room',
    nameEn: 'Villa Living Room',
    description: 'Grand Room - Road + Sky Split + Wealth + Door + Fireplace',
    shaCount: 6,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '18-25 min',
    chapter: 'True Master',
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
    name: "Executive's Office",
    nameEn: "Executive's Office",
    description: 'Corner Office - Back + Wall Blade + Wealth + Beam + Odor',
    shaCount: 5,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '15-20 min',
    chapter: 'True Master',
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
    name: 'Final Feng Shui Test',
    nameEn: 'Final Feng Shui Test',
    description: 'Ultimate Challenge - Master Level',
    shaCount: 7,
    locked: false,
    difficulty: 'hard',
    estimatedTime: '20-30 min',
    chapter: 'True Master',
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