#!/usr/bin/env node
/**
 * 去除图片标记脚本
 * 
 * 使用 Nano Banana Pro 的 image-to-image 功能去除图片上的：
 * - 字母标记（A, B, C, D, E, F, G 等）
 * - 英文单词标记（CRITICAL: MIRROR SHA 等）
 * 
 * 使用方式：
 *   proxychains4 npx tsx src/remove-labels.ts
 */

import { GoogleGenAI } from '@google/genai';
import { setGlobalDispatcher, ProxyAgent } from 'undici';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

// 配置全局代理
const PROXY_URL = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || 'http://127.0.0.1:7890';
setGlobalDispatcher(new ProxyAgent(PROXY_URL));
console.log(chalk.blue(`🔧 已配置代理: ${PROXY_URL}`));

// API 配置
const API_KEY = 'AIzaSyDR1Vwfk4Y_wlGI1tBOlxRd-0OJ6D5-gvs';
const IMAGE_MODEL = 'gemini-3-pro-image-preview';

// 项目根目录
const PROJECT_ROOT = path.resolve(process.cwd(), '../..');
const RESOURCES_DIR = path.join(PROJECT_ROOT, 'resources/images');

// 去除标记的提示词
const REMOVE_LABELS_PROMPT = `You are given an isometric pixel art room image that has unwanted text labels and annotations overlaid on it. These labels were accidentally added during image generation and need to be removed.

CRITICAL TASK - REMOVE ALL TEXT MARKERS:

Remove ALL of the following types of text/labels from the image:
1. Single letters (A, B, C, D, E, F, G, etc.) - usually white/yellow bold letters pointing to specific locations
2. English word labels (like "CRITICAL: MIRROR SHA", "CRITICAL: BEAM SHA", "CRITICAL: YIN SHA", "CRITICAL: UNDER-STAIRS SHA", "CRITICAL: SHARP CORNER", etc.)
3. Any arrows or pointer lines connected to these labels
4. Any other text overlays or annotations that are not part of the scene

IMPORTANT PRESERVATION RULES:

1. Keep the EXACT same room layout and structure
2. Keep ALL furniture, decorations, and objects in their original positions
3. Preserve the pixel art style and isometric perspective
4. Maintain the same color palette and lighting
5. Keep any legitimate text that is part of the scene (like book titles on spines, labels on items that belong in the room, Chinese characters on decorations)

TECHNICAL APPROACH:

- Simply paint over the removed labels with the appropriate background colors/textures
- For labels on walls: fill with wall color/texture
- For labels on furniture: restore the furniture surface
- For labels in empty space: remove the text and any connecting arrows/lines
- Ensure smooth integration with no visible editing artifacts

OUTPUT: A clean isometric pixel art room image with NO text labels or annotations overlaid. The image should look exactly like a professional game asset.`;

// 速率限制
const RATE_LIMIT = {
  minIntervalMs: 5000,
};

// 重试配置
const RETRY = {
  maxAttempts: 3,
  baseDelayMs: 2000,
  maxDelayMs: 30000,
};

/**
 * 等待指定时间
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 指数退避重试
 */
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  operationName: string,
  lastRequestTime: { value: number }
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= RETRY.maxAttempts; attempt++) {
    try {
      // 速率限制
      const now = Date.now();
      const elapsed = now - lastRequestTime.value;
      if (elapsed < RATE_LIMIT.minIntervalMs) {
        const waitTime = RATE_LIMIT.minIntervalMs - elapsed;
        console.log(chalk.gray(`  ⏳ 等待 ${(waitTime / 1000).toFixed(1)}s (速率限制)...`));
        await sleep(waitTime);
      }
      lastRequestTime.value = Date.now();
      
      return await operation();
    } catch (error) {
      lastError = error as Error;
      const errorMessage = (error as Error).message || String(error);
      
      // 如果是速率限制错误，等待更长时间
      if (errorMessage.includes('429') || errorMessage.includes('rate') || errorMessage.includes('quota')) {
        const delay = Math.min(RETRY.maxDelayMs, RETRY.baseDelayMs * Math.pow(2, attempt));
        console.log(chalk.yellow(`  ⚠️ 速率限制，等待 ${delay / 1000}s 后重试 (${attempt}/${RETRY.maxAttempts})...`));
        await sleep(delay);
        continue;
      }
      
      // 其他错误
      if (attempt < RETRY.maxAttempts) {
        const delay = Math.min(RETRY.maxDelayMs, RETRY.baseDelayMs * Math.pow(2, attempt));
        console.log(chalk.yellow(`  ⚠️ ${operationName} 失败: ${errorMessage}`));
        console.log(chalk.yellow(`  🔄 ${delay / 1000}s 后重试 (${attempt}/${RETRY.maxAttempts})...`));
        await sleep(delay);
      }
    }
  }
  
  throw new Error(`${operationName} 失败，已重试 ${RETRY.maxAttempts} 次: ${lastError?.message}`);
}

/**
 * 处理单张图片
 */
async function processImage(
  client: GoogleGenAI,
  inputPath: string,
  outputPath: string,
  lastRequestTime: { value: number }
): Promise<boolean> {
  const fileName = path.basename(inputPath);
  console.log(chalk.cyan(`\n🎨 处理: ${fileName}`));
  
  try {
    // 读取图片
    const imageBuffer = await fs.readFile(inputPath);
    console.log(chalk.gray(`  📦 图片大小: ${(imageBuffer.length / 1024).toFixed(1)} KB`));
    
    // 调用 API
    const response = await retryWithBackoff(async () => {
      const contents = [
        { text: REMOVE_LABELS_PROMPT },
        {
          inlineData: {
            mimeType: 'image/png',
            data: imageBuffer.toString('base64')
          }
        }
      ];
      
      return await client.models.generateContent({
        model: IMAGE_MODEL,
        contents: contents,
        config: {
          responseModalities: ['TEXT', 'IMAGE']
        }
      });
    }, '图片处理', lastRequestTime);
    
    // 解析响应
    const parts = response.candidates?.[0]?.content?.parts || [];
    let imageData: Buffer | undefined;
    
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageData = Buffer.from(part.inlineData.data, 'base64');
      }
    }
    
    if (!imageData) {
      console.log(chalk.red(`  ❌ 未返回图片数据`));
      return false;
    }
    
    // 保存图片
    await fs.writeFile(outputPath, imageData);
    console.log(chalk.green(`  ✅ 已保存: ${outputPath}`));
    console.log(chalk.gray(`  📦 新图片大小: ${(imageData.length / 1024).toFixed(1)} KB`));
    
    return true;
  } catch (error) {
    console.log(chalk.red(`  ❌ 处理失败: ${(error as Error).message}`));
    return false;
  }
}

/**
 * 需要处理的图片清单（用户指定）
 */
const IMAGES_TO_PROCESS = [
  // level4: room-cold, room-warm
  { level: 4, file: 'room-cold.png' },
  { level: 4, file: 'room-warm.png' },
  // level6: room-cold, room-warm
  { level: 6, file: 'room-cold.png' },
  { level: 6, file: 'room-warm.png' },
  // level12: room-cold, room-warm
  { level: 12, file: 'room-cold.png' },
  { level: 12, file: 'room-warm.png' },
  // level15: room-cold
  { level: 15, file: 'room-cold.png' },
  // level17: room-cold
  { level: 17, file: 'room-cold.png' },
  // level18: room-cold, room-warm
  { level: 18, file: 'room-cold.png' },
  { level: 18, file: 'room-warm.png' },
  // level19: room-cold, room-warm
  { level: 19, file: 'room-cold.png' },
  { level: 19, file: 'room-warm.png' },
  // level20: room-cold
  { level: 20, file: 'room-cold.png' },
];

/**
 * 获取需要处理的图片列表
 */
async function scanImages(): Promise<string[]> {
  const images: string[] = [];
  
  for (const item of IMAGES_TO_PROCESS) {
    const filePath = path.join(RESOURCES_DIR, `level${item.level}`, item.file);
    if (await fs.pathExists(filePath)) {
      images.push(filePath);
    } else {
      console.log(chalk.yellow(`  ⚠️ 文件不存在: ${filePath}`));
    }
  }
  
  return images;
}

/**
 * 主函数
 */
async function main() {
  console.log(chalk.bold.blue('\n🖼️  图片标记去除工具\n'));
  console.log(chalk.gray('使用 Nano Banana Pro (gemini-3-pro-image-preview) 去除图片上的标记\n'));
  
  // 初始化客户端
  const client = new GoogleGenAI({ apiKey: API_KEY });
  
  // 扫描图片
  console.log(chalk.bold('📂 扫描图片...'));
  const images = await scanImages();
  console.log(chalk.gray(`   找到 ${images.length} 张图片\n`));
  
  if (images.length === 0) {
    console.log(chalk.yellow('没有找到需要处理的图片'));
    return;
  }
  
  // 显示图片列表
  console.log(chalk.bold('📋 待处理图片列表:'));
  images.forEach((img, idx) => {
    const relPath = path.relative(RESOURCES_DIR, img);
    console.log(chalk.gray(`   ${idx + 1}. ${relPath}`));
  });
  
  console.log(chalk.bold('\n🚀 开始处理...\n'));
  
  // 处理图片
  const lastRequestTime = { value: 0 };
  let successCount = 0;
  let failCount = 0;
  
  for (const imagePath of images) {
    const success = await processImage(client, imagePath, imagePath, lastRequestTime);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // 每张图片之间等待一下
    await sleep(2000);
  }
  
  // 显示结果
  console.log(chalk.bold('\n📊 处理结果:'));
  console.log(chalk.green(`   ✅ 成功: ${successCount}`));
  console.log(chalk.red(`   ❌ 失败: ${failCount}`));
  console.log(chalk.gray(`   📁 总计: ${images.length}\n`));
  
  if (failCount > 0) {
    console.log(chalk.yellow('⚠️ 部分图片处理失败，可以重新运行脚本重试'));
  }
  
  console.log(chalk.bold.green('✨ 处理完成！\n'));
}

// 运行
main().catch(error => {
  console.error(chalk.red('\n❌ 脚本执行失败:'), error);
  process.exit(1);
});
