/**
 * 提示词解析模块
 * 
 * 负责：
 * - 从设计文档中提取提示词
 * - 解析道具配置
 * - 读取关卡设计
 */

import fs from 'fs-extra';
import path from 'path';
import type { ItemInfo, LevelConfig, HotspotsData } from './types.js';

// 项目根目录
const PROJECT_ROOT = path.resolve(process.cwd(), '../..');
const DOCS_DIR = path.join(PROJECT_ROOT, 'docs/design/game');
const RESOURCES_DIR = path.join(PROJECT_ROOT, 'resources/images');

/**
 * 获取关卡目录路径
 */
export function getLevelDir(levelId: string): string {
  // level-1 -> level1
  const levelNum = levelId.replace('level-', '');
  return path.join(DOCS_DIR, `level${levelNum}`);
}

/**
 * 获取关卡输出目录
 */
export function getOutputDir(levelId: string): string {
  const levelNum = levelId.replace('level-', '');
  return path.join(RESOURCES_DIR, `level${levelNum}`);
}

/**
 * 从 Markdown 文件中提取提示词
 * 
 * 格式：查找 ```text ... ``` 代码块
 */
export async function extractPrompt(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, 'utf-8');
  
  // 查找 ```text ... ``` 代码块
  const match = content.match(/```text\s*([\s\S]*?)\s*```/);
  if (match) {
    return match[1].trim();
  }
  
  // 如果没有找到 text 代码块，尝试查找任何代码块
  const anyMatch = content.match(/```\w*\s*([\s\S]*?)\s*```/);
  if (anyMatch) {
    return anyMatch[1].trim();
  }
  
  throw new Error(`未找到提示词: ${filePath}`);
}

/**
 * 从 Markdown 文件中提取宽高比
 * 
 * 格式：查找 | **宽高比** | 16:9 | 或类似格式
 */
export async function extractAspectRatio(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, 'utf-8');
  
  // 查找宽高比表格行：| **宽高比** | 16:9 | 或 | **宽高比** | 2:1 | 等
  const match = content.match(/\|\s*\*\*宽高比\*\*\s*\|\s*([\d.]+:\d+)\s*\|/);
  if (match) {
    return match[1].trim();
  }
  
  // 默认返回 16:9
  return '16:9';
}

/**
 * 获取冷色底图提示词
 */
export async function getRoomColdPrompt(levelId: string): Promise<string> {
  const levelDir = getLevelDir(levelId);
  const promptFile = path.join(levelDir, 'prompts/room-cold-v1.0.md');
  return extractPrompt(promptFile);
}

/**
 * 获取暖色终图提示词
 */
export async function getRoomWarmPrompt(levelId: string): Promise<string> {
  const levelDir = getLevelDir(levelId);
  const promptFile = path.join(levelDir, 'prompts/room-warm-v1.0.md');
  return extractPrompt(promptFile);
}

/**
 * 获取分析提示词（系统 + 用户）
 */
export async function getAnalysisPrompts(levelId: string): Promise<{ system: string; user: string }> {
  const levelDir = getLevelDir(levelId);
  const analysisFile = path.join(levelDir, 'analysis/sha-analysis-v1.0.md');
  const content = await fs.readFile(analysisFile, 'utf-8');
  
  // 尝试提取系统提示词（可选）
  const systemMatch = content.match(/## 系统提示词\s*```text\s*([\s\S]*?)\s*```/);
  const system = systemMatch ? systemMatch[1].trim() : '';
  
  // 尝试提取用户提示词
  const userMatch = content.match(/## 用户提示词\s*```text?\s*([\s\S]*?)\s*```/);
  if (userMatch) {
    return { system, user: userMatch[1].trim() };
  }
  
  // 如果没有找到用户提示词，尝试查找"完整提示词"或任何 text 代码块
  const fullMatch = content.match(/## 完整提示词\s*```text\s*([\s\S]*?)\s*```/);
  if (fullMatch) {
    return { system, user: fullMatch[1].trim() };
  }
  
  // 最后尝试查找任何 text 代码块作为用户提示词
  const anyMatch = content.match(/```text\s*([\s\S]*?)\s*```/);
  if (anyMatch) {
    return { system, user: anyMatch[1].trim() };
  }
  
  throw new Error(`未找到分析提示词: ${analysisFile}`);
}

/**
 * 获取道具提示词
 */
export async function getItemPrompt(itemId: string): Promise<string> {
  // 道具提示词可能在关卡的 items 目录或共享目录
  // 先查找 level1 的 items 目录作为模板
  const itemFile = path.join(DOCS_DIR, 'level1/prompts/items', `${itemId}-v1.0.md`);
  
  if (await fs.pathExists(itemFile)) {
    return extractPrompt(itemFile);
  }
  
  // 如果找不到，尝试其他格式
  const altFile = path.join(DOCS_DIR, 'level1/prompts/items', `${itemId}.md`);
  if (await fs.pathExists(altFile)) {
    return extractPrompt(altFile);
  }
  
  throw new Error(`未找到道具提示词: ${itemId}`);
}

/**
 * 解析关卡设计文档，获取需要的道具列表
 */
export async function getRequiredItems(levelId: string): Promise<ItemInfo[]> {
  const levelDir = getLevelDir(levelId);
  const designFile = path.join(levelDir, 'level-design.md');
  
  const content = await fs.readFile(designFile, 'utf-8');
  const items: ItemInfo[] = [];
  
  // 查找道具表格
  // 格式：| `gourd` | 葫芦 | sha-001 (横梁压顶) | ... |
  // 注意：道具 ID 可能包含连字符，如 plant-broad
  const itemRegex = /\| `([\w-]+)` \| ([^|]+) \| [^|]+/g;
  let match;
  
  while ((match = itemRegex.exec(content)) !== null) {
    const itemId = match[1];
    const itemName = match[2].trim();
    
    items.push({
      id: itemId,
      name: itemName,
      promptFile: `${itemId}-v1.0.md`,
      outputFile: `${itemId}.png`
    });
  }
  
  // 如果没有找到表格格式，尝试从 YAML 代码块解析
  if (items.length === 0) {
    const yamlMatch = content.match(/```yaml\s*([\s\S]*?)\s*```/);
    if (yamlMatch) {
      // 简单解析 correctItem 字段（支持连字符）
      const correctItemMatch = yamlMatch[1].match(/correctItem:\s*([\w-]+)/g);
      if (correctItemMatch) {
        for (const m of correctItemMatch) {
          const itemId = m.replace('correctItem:', '').trim();
          if (itemId && itemId !== 'null') {
            items.push({
              id: itemId,
              name: itemId,
              promptFile: `${itemId}-v1.0.md`,
              outputFile: `${itemId}.png`
            });
          }
        }
      }
    }
  }
  
  return items;
}

/**
 * 获取关卡配置
 */
export async function getLevelConfig(levelId: string): Promise<LevelConfig> {
  const items = await getRequiredItems(levelId);
  
  return {
    id: levelId,
    name: `Level ${levelId.replace('level-', '')}`,
    designFile: path.join(getLevelDir(levelId), 'level-design.md'),
    outputDir: getOutputDir(levelId),
    items
  };
}

/**
 * 保存 hotspots.json（保存到 analysis 子目录）
 */
export async function saveHotspots(levelId: string, data: HotspotsData): Promise<string> {
  const outputDir = path.join(getOutputDir(levelId), 'analysis');
  await fs.ensureDir(outputDir);
  
  const outputPath = path.join(outputDir, 'hotspots.json');
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
  
  return outputPath;
}

/**
 * 保存图片
 */
export async function saveImage(levelId: string, filename: string, imageData: Buffer): Promise<string> {
  const outputDir = getOutputDir(levelId);
  await fs.ensureDir(outputDir);
  
  const outputPath = path.join(outputDir, filename);
  await fs.writeFile(outputPath, imageData);
  
  return outputPath;
}

/**
 * 保存共享道具图片
 */
export async function saveSharedItem(filename: string, imageData: Buffer): Promise<string> {
  const outputDir = path.join(RESOURCES_DIR, 'shared/items');
  await fs.ensureDir(outputDir);
  
  const outputPath = path.join(outputDir, filename);
  await fs.writeFile(outputPath, imageData);
  
  return outputPath;
}

/**
 * 检查共享道具是否已存在
 */
export async function sharedItemExists(filename: string): Promise<boolean> {
  const filePath = path.join(RESOURCES_DIR, 'shared/items', filename);
  return fs.pathExists(filePath);
}

/**
 * 加载已生成的图片
 */
export async function loadImage(levelId: string, filename: string): Promise<Buffer | null> {
  const filePath = path.join(getOutputDir(levelId), filename);
  
  if (await fs.pathExists(filePath)) {
    return fs.readFile(filePath);
  }
  
  return null;
}

/**
 * 加载 hotspots.json
 */
export async function loadHotspots(levelId: string): Promise<HotspotsData | null> {
  const filePath = path.join(getOutputDir(levelId), 'analysis/hotspots.json');
  
  if (await fs.pathExists(filePath)) {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as HotspotsData;
  }
  
  return null;
}

/**
 * 加载关卡设计文档
 */
export async function loadLevelDesign(levelId: string): Promise<string> {
  const filePath = path.join(getLevelDir(levelId), 'level-design.md');
  return fs.readFile(filePath, 'utf-8');
}

/**
 * 保存关卡设计文档
 */
export async function saveLevelDesign(levelId: string, content: string): Promise<string> {
  const filePath = path.join(getLevelDir(levelId), 'level-design.md');
  await fs.writeFile(filePath, content);
  return filePath;
}

/**
 * 加载共享道具图片
 */
export async function loadSharedItem(filename: string): Promise<Buffer | null> {
  const filePath = path.join(RESOURCES_DIR, 'shared/items', filename);
  
  if (await fs.pathExists(filePath)) {
    return fs.readFile(filePath);
  }
  
  return null;
}
