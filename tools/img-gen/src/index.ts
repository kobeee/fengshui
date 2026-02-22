#!/usr/bin/env node
/**
 * 关卡图片生成工具 - CLI 入口
 * 
 * 使用方式：
 *   npm run gen -- --level 1
 *   npm run gen -- --level 1 --resume
 *   npm run gen -- --level 1 --step room-cold
 */

import { Command } from 'commander';
import { LevelPipeline } from './pipeline.js';

const program = new Command();

program
  .name('fengshui-img-gen')
  .description('风水游戏关卡图片生成工具')
  .version('1.0.0');

program
  .command('gen')
  .description('生成关卡图片')
  .option('-l, --level <number>', '关卡编号', '1')
  .option('-r, --resume', '从断点继续', false)
  .option('-s, --step <step>', '只执行指定步骤', undefined)
  .action(async (options) => {
    const levelId = `level-${options.level}`;
    
    const pipeline = new LevelPipeline({
      levelId,
      resume: options.resume,
      step: options.step
    });
    
    try {
      await pipeline.run();
    } catch (error) {
      console.error(`\n❌ 生成失败:`, error);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('查看关卡进度')
  .option('-l, --level <number>', '关卡编号', '1')
  .action(async (options) => {
    const levelId = `level-${options.level}`;
    const { loadProgress } = await import('./progress.js');
    
    const progress = await loadProgress(levelId);
    
    if (!progress) {
      console.log(`\n📭 关卡 ${levelId} 暂无进度记录\n`);
      return;
    }
    
    console.log(`\n📊 关卡 ${levelId} 进度:\n`);
    console.log(`   状态: ${progress.status}`);
    console.log(`   开始时间: ${progress.startTime}`);
    
    if (progress.endTime) {
      console.log(`   结束时间: ${progress.endTime}`);
    }
    
    console.log(`\n   步骤状态:`);
    
    const stepNames: Record<string, string> = {
      room_cold: '冷色底图',
      analysis: 'AI 分析',
      items: '道具生成',
      room_warm: '暖色终图',
      docs_update: '文档更新'
    };
    
    for (const [key, value] of Object.entries(progress.steps)) {
      const name = stepNames[key] || key;
      const status = value.status;
      const icon = status === 'completed' ? '✅' : status === 'failed' ? '❌' : status === 'in_progress' ? '🔄' : '⏳';
      console.log(`   ${icon} ${name}: ${status}`);
      
      if (key === 'items' && 'completed' in value) {
        const items = value as { completed: string[]; pending: string[] };
        if (items.completed.length > 0) {
          console.log(`      已完成: ${items.completed.join(', ')}`);
        }
        if (items.pending.length > 0) {
          console.log(`      待处理: ${items.pending.join(', ')}`);
        }
      }
    }
    
    console.log(`\n`);
  });

program
  .command('reset')
  .description('重置关卡进度')
  .option('-l, --level <number>', '关卡编号', '1')
  .option('-f, --force', '强制重置', false)
  .action(async (options) => {
    const levelId = `level-${options.level}`;
    const fs = await import('fs-extra');
    const path = await import('path');
    
    const progressPath = path.join(process.cwd(), 'progress', `${levelId}.json`);
    
    if (await fs.pathExists(progressPath)) {
      if (!options.force) {
        console.log(`\n⚠️  进度文件存在，使用 --force 确认删除\n`);
        return;
      }
      
      await fs.unlink(progressPath);
      console.log(`\n🗑️  已删除进度: ${levelId}\n`);
    } else {
      console.log(`\n📭 无进度文件: ${levelId}\n`);
    }
  });

// 解析命令行参数
program.parse();
