#!/usr/bin/env npx tsx
/**
 * 图片优化脚本
 * 功能：
 * 1. 生成缩略图（用于关卡列表）
 * 2. 生成 manifest.json（资源清单）
 * 
 * 注：原图压缩请使用 pngquant 或其他工具
 */

import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const PUBLIC_DIR = join(process.cwd(), 'public');
const IMAGES_DIR = join(PUBLIC_DIR, 'images');
const THUMBNAILS_DIR = join(IMAGES_DIR, 'thumbnails');

// 配置
const CONFIG = {
  // 缩略图尺寸
  thumbnailWidth: 160,
  thumbnailHeight: 160,
  
  // 需要处理的目录
  levelDirs: Array.from({ length: 20 }, (_, i) => `level${i + 1}`),
};

// 确保目录存在
function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// 动态导入 sharp
async function getSharp() {
  try {
    const sharp = await import('sharp');
    return sharp.default;
  } catch {
    console.error('❌ sharp 未安装，请运行: npm install sharp --save-dev');
    return null;
  }
}

// 使用 sharp 生成缩略图
async function generateThumbnail(
  sharp: NonNullable<Awaited<ReturnType<typeof getSharp>>>,
  inputPath: string,
  outputPath: string
): Promise<boolean> {
  try {
    await sharp(inputPath)
      .resize(CONFIG.thumbnailWidth, CONFIG.thumbnailHeight, {
        fit: 'cover',
        position: 'center',
        kernel: 'nearest', // 保持像素风格
      })
      .png({ compressionLevel: 9 })
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.warn(`  ⚠️  缩略图生成失败: ${basename(inputPath)}`, error);
    return false;
  }
}

// 获取文件大小（KB）
function getFileSizeKB(path: string): number {
  const stats = statSync(path);
  return Math.round(stats.size / 1024);
}

// 处理单个关卡目录
async function processLevelDir(
  sharp: NonNullable<Awaited<ReturnType<typeof getSharp>>>,
  levelDir: string
) {
  const levelPath = join(IMAGES_DIR, levelDir);
  if (!existsSync(levelPath)) {
    console.log(`  ⏭️  跳过不存在的目录: ${levelDir}`);
    return;
  }

  const files = readdirSync(levelPath).filter(f => 
    f.endsWith('.png') && 
    !f.includes('-thumb') && 
    !f.includes('-v1.0') // 跳过旧版本图片
  );
  
  for (const file of files) {
    const inputPath = join(levelPath, file);
    
    // 只为冷色图生成缩略图
    if (file.includes('cold')) {
      const thumbPath = join(THUMBNAILS_DIR, `${levelDir}-${file}`);
      
      // 如果缩略图已存在，跳过
      if (existsSync(thumbPath)) {
        const thumbSize = getFileSizeKB(thumbPath);
        console.log(`  ✓  已存在: ${levelDir}-${file} (${thumbSize}KB)`);
        continue;
      }
      
      const thumbGenerated = await generateThumbnail(sharp, inputPath, thumbPath);
      if (thumbGenerated) {
        const thumbSize = getFileSizeKB(thumbPath);
        console.log(`  🖼️  生成: ${levelDir}-${file} (${thumbSize}KB)`);
      }
    }
  }
}

// 生成资源清单
function generateManifest() {
  console.log('\n📝 生成资源清单...');
  
  const manifest: {
    levels: Array<{
      id: string;
      images: { cold: string; warm: string };
      thumbnail: string;
    }>;
    home: string[];
    luopan: { pan: string; zhen: string };
  } = {
    levels: [],
    home: ['/images/home-v1.0.png', '/images/home-v1.1.png'],
    luopan: {
      pan: '/images/shared/luopan/pan.png',
      zhen: '/images/shared/luopan/zhen.png',
    },
  };
  
  // 收集关卡资源
  for (let i = 1; i <= 20; i++) {
    const levelId = `level-${i}`;
    const levelDir = `level${i}`;
    
    manifest.levels.push({
      id: levelId,
      images: {
        cold: `/images/${levelDir}/room-cold.png`,
        warm: `/images/${levelDir}/room-warm.png`,
      },
      thumbnail: `/images/thumbnails/${levelDir}-room-cold.png`,
    });
  }
  
  const manifestPath = join(IMAGES_DIR, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`  ✅ 资源清单已生成: ${manifestPath}`);
  
  return manifest;
}

// 主函数
async function main() {
  console.log('🎨 图片优化脚本（缩略图生成）');
  console.log('='.repeat(50));
  
  // 检查 sharp
  const sharp = await getSharp();
  if (!sharp) {
    process.exit(1);
  }
  
  // 确保缩略图目录存在
  ensureDir(THUMBNAILS_DIR);
  
  // 处理关卡图片
  console.log('\n📁 生成缩略图...');
  for (const levelDir of CONFIG.levelDirs) {
    await processLevelDir(sharp, levelDir);
  }
  
  // 生成资源清单
  const manifest = generateManifest();
  
  // 统计
  const thumbnails = readdirSync(THUMBNAILS_DIR).filter(f => f.endsWith('.png'));
  
  console.log('\n✨ 完成！');
  console.log(`   关卡数量: ${manifest.levels.length}`);
  console.log(`   缩略图数量: ${thumbnails.length}`);
  console.log(`   缩略图目录: ${THUMBNAILS_DIR}`);
}

main().catch(console.error);
