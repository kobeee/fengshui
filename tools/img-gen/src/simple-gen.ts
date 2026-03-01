#!/usr/bin/env node
/**
 * 简易图片生成工具
 * 
 * 使用方式：
 *   npx tsx src/simple-gen.ts "your prompt here"
 *   npx tsx src/simple-gen.ts "像素风客厅" --output my-room.png
 */

import fs from 'fs';
import path from 'path';
import { laozhangClient } from './laozhang-client.js';

// 解析命令行参数
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
简易图片生成工具

使用方式：
  npx tsx src/simple-gen.ts "提示词"
  npx tsx src/simple-gen.ts "提示词" --output output.png
  npx tsx src/simple-gen.ts "提示词" --ratio 16:9 --res 2K

参数：
  --output, -o    输出文件名（默认 output.png）
  --ratio, -r     宽高比：1:1, 16:9, 9:16, 4:3 等（默认 16:9）
  --res           分辨率：1K, 2K, 4K（默认 2K）
  --help, -h      显示帮助
`);
  process.exit(0);
}

// 解析参数
let prompt = '';
let outputFile = 'output.png';
let aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '4:5' | '5:4' | '2:1' | '2.5:1' = '16:9';
let resolution: '1K' | '2K' | '4K' = '2K';

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--output' || arg === '-o') {
    outputFile = args[++i];
  } else if (arg === '--ratio' || arg === '-r') {
    aspectRatio = args[++i] as typeof aspectRatio;
  } else if (arg === '--res') {
    resolution = args[++i] as typeof resolution;
  } else if (!arg.startsWith('--')) {
    prompt = arg;
  }
}

if (!prompt) {
  console.error('请提供提示词');
  process.exit(1);
}

async function main() {
  console.log(`\n🎨 开始生成图片...\n`);
  console.log(`   提示词: ${prompt.substring(0, 50)}...`);
  console.log(`   宽高比: ${aspectRatio}`);
  console.log(`   分辨率: ${resolution}`);
  console.log(`   输出文件: ${outputFile}\n`);

  try {
    const response = await laozhangClient.generateImage({
      prompt,
      aspectRatio,
      resolution
    });

    if (!response.imageData) {
      throw new Error('生成失败：无图片数据');
    }

    // 保存到当前目录
    const outputPath = path.resolve(process.cwd(), outputFile);
    fs.writeFileSync(outputPath, response.imageData);

    console.log(`\n✅ 图片已保存: ${outputPath}`);
    console.log(`   文件大小: ${(response.imageData.length / 1024).toFixed(1)} KB\n`);

  } catch (error) {
    console.error(`\n❌ 生成失败:`, error);
    process.exit(1);
  }
}

main();
