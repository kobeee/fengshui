/**
 * 关卡生成流水线
 * 
 * 核心流程：
 * 1. 生成冷色底图
 * 2. AI 分析生成 hotspots.json
 * 3. 生成道具 PNG
 * 4. 生成暖色终图
 * 5. 更新设计文档
 */

import path from 'path';
import * as prompts from './prompts.js';
import * as progress from './progress.js';
import { geminiClient } from './gemini-client.js';
import type { LevelProgress, HotspotsData, LevelConfig } from './types.js';

/**
 * 流水线配置
 */
export type PipelineOptions = {
  levelId: string;
  resume?: boolean;
  step?: 'room-cold' | 'analysis' | 'items' | 'room-warm' | 'docs-update';
};

/**
 * 关卡生成流水线
 */
export class LevelPipeline {
  private config: LevelConfig | null = null;
  private progress: LevelProgress | null = null;
  
  constructor(private options: PipelineOptions) {}
  
  /**
   * 运行流水线
   */
  async run(): Promise<void> {
    const { levelId, resume, step } = this.options;
    
    console.log(`\n🎮 开始处理关卡: ${levelId}\n`);
    
    // 加载配置
    this.config = await prompts.getLevelConfig(levelId);
    console.log(`📋 关卡配置:`);
    console.log(`   - 输出目录: ${this.config.outputDir}`);
    console.log(`   - 需要道具: ${this.config.items.map(i => i.id).join(', ') || '无'}`);
    
    // 加载或初始化进度
    if (resume) {
      this.progress = await progress.loadProgress(levelId);
      if (this.progress) {
        console.log(`📂 已加载进度: ${this.progress.status}`);
      } else {
        console.log(`📂 未找到进度，重新开始`);
        this.progress = await progress.initProgress(levelId);
      }
    } else {
      this.progress = await progress.initProgress(levelId);
    }
    
    // 确定执行步骤
    if (step) {
      await this.runStep(step);
    } else {
      await this.runAllSteps();
    }
    
    // 完成处理
    if (progress.isLevelComplete(this.progress)) {
      await progress.completeLevel(this.progress);
      console.log(`\n✅ 关卡 ${levelId} 生成完成！\n`);
    }
  }
  
  /**
   * 执行所有步骤
   */
  private async runAllSteps(): Promise<void> {
    const steps = ['room_cold', 'analysis', 'items', 'room_warm', 'docs_update'] as const;
    
    for (const step of steps) {
      const stepData = this.progress!.steps[step];
      
      // 跳过已完成的步骤
      if (stepData.status === 'completed') {
        console.log(`\n⏭️  跳过已完成步骤: ${step}`);
        continue;
      }
      
      await this.runStep(step);
      
      // 如果步骤失败，停止流程
      if (stepData.status === 'failed') {
        console.log(`\n❌ 步骤 ${step} 失败，流水线停止`);
        break;
      }
    }
  }
  
  /**
   * 执行单个步骤
   */
  private async runStep(step: string): Promise<void> {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📦 执行步骤: ${step}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    try {
      switch (step) {
        case 'room-cold':
        case 'room_cold':
          await this.generateRoomCold();
          break;
        case 'analysis':
          await this.analyzeImage();
          break;
        case 'items':
          await this.generateItems();
          break;
        case 'room-warm':
        case 'room_warm':
          await this.generateRoomWarm();
          break;
        case 'docs-update':
        case 'docs_update':
          await this.updateDocs();
          break;
        default:
          throw new Error(`未知步骤: ${step}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`\n❌ 步骤失败: ${errorMessage}`);
      await progress.failStep(this.progress!, step.replace('-', '_') as any, errorMessage);
    }
  }
  
  /**
   * Step 1: 生成冷色底图
   */
  private async generateRoomCold(): Promise<void> {
    await progress.updateStepStatus(this.progress!, 'room_cold', 'in_progress');
    
    // 获取提示词文件路径
    const levelDir = prompts.getLevelDir(this.options.levelId);
    const promptFile = path.join(levelDir, 'prompts/room-cold-v1.0.md');
    
    // 解析宽高比
    const aspectRatio = await prompts.extractAspectRatio(promptFile);
    console.log(`📐 宽高比: ${aspectRatio}`);
    
    // 获取提示词
    const prompt = await prompts.getRoomColdPrompt(this.options.levelId);
    console.log(`📝 提示词长度: ${prompt.length} 字符`);
    
    // 生成图片
    const response = await geminiClient.generateImage({
      prompt,
      aspectRatio: aspectRatio as '16:9' | '2:1' | '2.5:1' | '1:1',
      resolution: '2K'
    });
    
    if (!response.imageData) {
      throw new Error('图片生成失败：无图片数据');
    }
    
    // 保存图片
    const outputPath = await prompts.saveImage(
      this.options.levelId,
      'room-cold.png',
      response.imageData
    );
    
    console.log(`\n📁 冷色底图已保存: ${outputPath}`);
    
    if (response.text) {
      console.log(`\n💬 模型反馈: ${response.text}`);
    }
    
    await progress.completeStep(this.progress!, 'room_cold', outputPath);
  }
  
  /**
   * Step 2: AI 分析图片
   */
  private async analyzeImage(): Promise<void> {
    await progress.updateStepStatus(this.progress!, 'analysis', 'in_progress');
    
    // 加载冷色底图
    const imageData = await prompts.loadImage(this.options.levelId, 'room-cold.png');
    if (!imageData) {
      throw new Error('找不到冷色底图，请先生成');
    }
    
    // 获取分析提示词
    const { system, user } = await prompts.getAnalysisPrompts(this.options.levelId);
    
    // 执行分析
    const hotspots = await geminiClient.analyzeImageForJson<HotspotsData>({
      image: imageData,
      prompt: user,
      systemPrompt: system
    });
    
    // 保存结果
    const outputPath = await prompts.saveHotspots(this.options.levelId, hotspots);
    
    console.log(`\n📁 煞点数据已保存: ${outputPath}`);
    console.log(`   - 煞气点数量: ${hotspots.shaPoints?.length || 0}`);
    
    await progress.completeStep(this.progress!, 'analysis', outputPath);
  }
  
  /**
   * Step 3: 生成道具 PNG
   */
  private async generateItems(): Promise<void> {
    const items = this.config!.items;
    
    if (items.length === 0) {
      console.log(`📋 无需生成道具`);
      await progress.completeStep(this.progress!, 'items');
      return;
    }
    
    await progress.updateStepStatus(this.progress!, 'items', 'in_progress');
    
    const completed: string[] = [];
    const pending = items.map(i => i.id);
    
    // 更新进度中的待处理列表
    this.progress!.steps.items.pending = pending;
    this.progress!.steps.items.completed = completed;
    await progress.saveProgress(this.progress!);
    
    for (const item of items) {
      console.log(`\n🎨 生成道具: ${item.name} (${item.id})`);
      
      // 检查是否已存在
      if (await prompts.sharedItemExists(item.outputFile)) {
        console.log(`   ⏭️  道具已存在，跳过`);
        completed.push(item.id);
        pending.splice(pending.indexOf(item.id), 1);
        continue;
      }
      
      try {
        // 获取道具提示词
        const itemPrompt = await prompts.getItemPrompt(item.id);
        
        // 生成道具图片
        const response = await geminiClient.generateImage({
          prompt: itemPrompt,
          aspectRatio: '1:1',
          resolution: '1K'
        });
        
        if (!response.imageData) {
          throw new Error('道具生成失败：无图片数据');
        }
        
        // 保存到共享目录
        const outputPath = await prompts.saveSharedItem(item.outputFile, response.imageData);
        console.log(`   📁 道具已保存: ${outputPath}`);
        
        completed.push(item.id);
        pending.splice(pending.indexOf(item.id), 1);
        
        // 更新进度
        this.progress!.steps.items.completed = [...completed];
        this.progress!.steps.items.pending = [...pending];
        await progress.saveProgress(this.progress!);
        
      } catch (error) {
        console.log(`   ❌ 道具生成失败: ${error}`);
        // 继续处理其他道具
      }
    }
    
    if (pending.length === 0) {
      await progress.completeStep(this.progress!, 'items');
    } else {
      this.progress!.steps.items.status = 'failed';
      await progress.saveProgress(this.progress!);
      throw new Error(`部分道具生成失败: ${pending.join(', ')}`);
    }
  }
  
  /**
   * Step 4: 生成暖色终图
   */
  private async generateRoomWarm(): Promise<void> {
    await progress.updateStepStatus(this.progress!, 'room_warm', 'in_progress');
    
    // 加载冷色底图
    const coldImage = await prompts.loadImage(this.options.levelId, 'room-cold.png');
    if (!coldImage) {
      throw new Error('找不到冷色底图，请先生成');
    }
    
    // 解析暖色图宽高比
    const levelDir = prompts.getLevelDir(this.options.levelId);
    const warmPromptFile = path.join(levelDir, 'prompts/room-warm-v1.0.md');
    const aspectRatio = await prompts.extractAspectRatio(warmPromptFile);
    console.log(`📐 宽高比: ${aspectRatio}`);
    
    // 加载道具图片
    const itemImages: Buffer[] = [];
    for (const item of this.config!.items) {
      const itemImage = await prompts.loadSharedItem(item.outputFile);
      if (itemImage) {
        itemImages.push(itemImage);
        console.log(`   📦 加载道具: ${item.id}`);
      }
    }
    
    // 获取暖色图提示词
    const warmPrompt = await prompts.getRoomWarmPrompt(this.options.levelId);
    
    // 生成暖色图（image-to-image）
    const response = await geminiClient.generateImage({
      prompt: warmPrompt,
      aspectRatio: aspectRatio as '16:9' | '2:1' | '2.5:1' | '1:1',
      resolution: '2K',
      referenceImages: [coldImage, ...itemImages]
    });
    
    if (!response.imageData) {
      throw new Error('暖色图生成失败：无图片数据');
    }
    
    // 保存图片
    const outputPath = await prompts.saveImage(
      this.options.levelId,
      'room-warm.png',
      response.imageData
    );
    
    console.log(`\n📁 暖色终图已保存: ${outputPath}`);
    
    if (response.text) {
      console.log(`\n💬 模型反馈: ${response.text}`);
    }
    
    await progress.completeStep(this.progress!, 'room_warm', outputPath);
  }
  
  /**
   * Step 5: 更新设计文档
   * 
   * 根据 hotspots.json 更新 level-design.md
   * 遵循"图文一致性规范"：以实际图片和 AI 分析结果为准
   */
  private async updateDocs(): Promise<void> {
    await progress.updateStepStatus(this.progress!, 'docs_update', 'in_progress');
    
    // 1. 加载 hotspots.json
    const hotspots = await prompts.loadHotspots(this.options.levelId);
    if (!hotspots) {
      throw new Error('找不到 hotspots.json，请先执行 AI 分析');
    }
    
    // 适配 AI 返回的不同字段名（sha_qi_points 或 shaPoints）
    const shaPoints = hotspots.sha_qi_points || hotspots.shaPoints || [];
    
    console.log(`📋 加载 hotspots.json: ${shaPoints.length} 个煞气点`);
    
    // 2. 加载现有的 level-design.md
    let designContent = await prompts.loadLevelDesign(this.options.levelId);
    
    // 3. 更新煞气数量
    designContent = updateField(designContent, '**煞气数量**', `${shaPoints.length} 个`);
    
    // 4. 重新生成煞气点配置部分
    const shaPointsSection = this.generateShaPointsSection(shaPoints);
    designContent = replaceSection(
      designContent,
      '## 煞气点配置',
      '## 道具清单',
      shaPointsSection
    );
    
    // 5. 更新道具清单
    const itemsSection = this.generateItemsSection(shaPoints);
    designContent = replaceSection(
      designContent,
      '## 道具清单',
      '## 场景元素',
      itemsSection
    );
    
    // 6. 更新素材状态
    designContent = designContent.replace(
      /\| `room-cold.png`.*\| ⏳.*\|/g,
      '| `room-cold.png` | 冷色底图（阴郁开局） | ✅ 已完成 |'
    );
    designContent = designContent.replace(
      /\| `room-warm.png`.*\| ⏳.*\|/g,
      '| `room-warm.png` | 暖色终图（通关后） | ✅ 已完成 |'
    );
    designContent = designContent.replace(
      /\| `hotspots.json`.*\| ⏳.*\|/g,
      '| `hotspots.json` | 煞点数据（AI 分析生成） | ✅ 已完成 |'
    );
    
    // 7. 添加版本记录
    const today = new Date().toISOString().split('T')[0];
    const versionEntry = `| v-auto | ${today} | 根据 AI 分析结果自动更新 |`;
    if (!designContent.includes('v-auto')) {
      designContent = designContent.replace(
        /\| 版本 \| 日期 \| 变更说明 \|/,
        `| 版本 | 日期 | 变更说明 |\n${versionEntry}`
      );
    }
    
    // 8. 保存更新后的文档
    const outputPath = await prompts.saveLevelDesign(this.options.levelId, designContent);
    console.log(`\n📁 设计文档已更新: ${outputPath}`);
    
    // 9. 显示更新的煞气点信息
    console.log(`\n📊 煞气点信息:`);
    for (const sha of shaPoints) {
      const title = sha.name || sha.title || '未命名';
      const type = sha.type || '未知';
      console.log(`   - ${title} (${type})`);
    }
    
    await progress.completeStep(this.progress!, 'docs_update', outputPath);
  }
  
  /**
   * 生成煞气点配置部分
   */
  private generateShaPointsSection(shaPoints: any[]): string {
    const lines: string[] = ['## 煞气点配置\n'];
    
    shaPoints.forEach((sha, index) => {
      // 适配不同的字段名
      const id = sha.id || `sha-${index + 1}`;
      const title = sha.name || sha.title || '未命名煞气';
      const type = sha.type || 'unknown';
      const description = sha.description || '';
      
      // 处理位置信息（可能是 bbox 或 position）
      let positionX = 0.5, positionY = 0.5, radius = 0.1;
      if (sha.bbox && Array.isArray(sha.bbox) && sha.bbox.length >= 4) {
        // bbox: [x1, y1, x2, y2] - 计算中心点
        positionX = (sha.bbox[0] + sha.bbox[2]) / 2 / 1000; // 假设图片宽度约1000px
        positionY = (sha.bbox[1] + sha.bbox[3]) / 2 / 600;  // 假设图片高度约600px
      } else if (sha.position) {
        positionX = sha.position.x || 0.5;
        positionY = sha.position.y || 0.5;
      }
      
      lines.push(`### 煞气 ${index + 1}: ${title}\n`);
      lines.push('| 属性 | 值 |');
      lines.push('|-----|-----|');
      lines.push(`| **ID** | \`${id}\` |`);
      lines.push(`| **类型** | \`${type}\` |`);
      lines.push(`| **位置** | \`{ x: ${positionX.toFixed(2)}, y: ${positionY.toFixed(2)} }\` |`);
      lines.push(`| **半径** | \`${radius}\` |`);
      
      // 处理选项
      const options = sha.options || [];
      const correctOption = options.find((o: any) => o.is_correct || o.correct);
      const correctLabel = correctOption?.text || correctOption?.label || '无';
      lines.push(`| **正确解法** | ${correctLabel} |`);
      lines.push(`| **正确道具** | \`待确定\` |\n`);
      
      lines.push('```yaml');
      lines.push('shaPoint:');
      lines.push(`  id: ${id}`);
      lines.push(`  type: ${type}`);
      lines.push(`  position: { x: ${positionX.toFixed(2)}, y: ${positionY.toFixed(2)} }`);
      lines.push(`  radius: ${radius}`);
      lines.push(`  title: "${title}"`);
      lines.push(`  description: "${description}"`);
      lines.push(`  correctItem: null`);
      lines.push('  options:');
      
      if (options.length > 0) {
        options.forEach((opt: any, optIndex: number) => {
          const optId = opt.id || `opt-${optIndex + 1}`;
          const optLabel = opt.text || opt.label || '选项';
          const isCorrect = opt.is_correct || opt.correct || false;
          lines.push(`    - id: ${optId}`);
          lines.push(`      label: "${optLabel}"`);
          lines.push(`      correct: ${isCorrect}`);
        });
      }
      lines.push('```\n');
    });
    
    lines.push('---');
    return lines.join('\n');
  }
  
  /**
   * 生成道具清单部分
   */
  private generateItemsSection(shaPoints: any[]): string {
    const lines: string[] = [
      '## 道具清单\n',
      '本关卡需要以下道具素材：\n',
      '| 道具 ID | 名称 | 解决的煞气 | 素材要求 |',
      '|--------|------|----------|---------|'
    ];
    
    // 从关卡配置中获取道具信息
    const items = this.config?.items || [];
    
    if (items.length === 0) {
      lines.push('| (无道具需求) | - | - | - |');
    } else {
      for (const item of items) {
        lines.push(`| \`${item.id}\` | ${item.name} | 待匹配 | 像素风 |`);
      }
    }
    
    lines.push('\n---');
    return lines.join('\n');
  }
}

/**
 * 辅助函数：更新表格字段
 */
function updateField(content: string, field: string, value: string): string {
  const regex = new RegExp(`(\\| ${field.replace(/\*/g, '\\*')} \\| )([^|]+)( \\|)`, 'g');
  return content.replace(regex, `$1${value}$3`);
}

/**
 * 辅助函数：替换两个标题之间的内容
 */
function replaceSection(content: string, startHeader: string, endHeader: string, newContent: string): string {
  const startIndex = content.indexOf(startHeader);
  const endIndex = content.indexOf(endHeader);
  
  if (startIndex === -1 || endIndex === -1) {
    console.log(`  ⚠️ 未找到章节: ${startHeader}`);
    return content;
  }
  
  return content.substring(0, startIndex) + newContent + '\n' + content.substring(endIndex);
}
