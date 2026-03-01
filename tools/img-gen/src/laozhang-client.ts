/**
 * Laozhang API 客户端 (OpenAI 兼容)
 * 
 * 使用 laozhang.ai 的 OpenAI 兼容 API 生成图片
 * 模型固定为: gemini-3.1-flash-image-preview
 * 
 * 注意：API_KEY 从项目根目录的 .env 文件读取
 */

import fs from 'fs';
import path from 'path';
import { setGlobalDispatcher, ProxyAgent } from 'undici';
import type { GenerateImageOptions, AnalyzeImageOptions, GeminiResponse } from './types.js';

// 配置全局代理
const PROXY_URL = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || 'http://127.0.0.1:7890';
if (PROXY_URL) {
  setGlobalDispatcher(new ProxyAgent(PROXY_URL));
  console.log(`  🔧 已配置代理: ${PROXY_URL}`);
}

// API 配置 - 从 .env 文件读取
const API_KEY = loadApiKeyFromEnv();
const API_ENDPOINT = 'https://api.laozhang.ai/v1/chat/completions';

// 模型固定，不允许修改
const MODEL = 'gemini-3.1-flash-image-preview';

// 速率限制配置
const RATE_LIMIT = {
  requestsPerMinute: 15,
  minIntervalMs: 5000,
};

// 重试配置
const RETRY = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
};

/**
 * 从项目根目录的 .env 文件加载 API_KEY
 */
function loadApiKeyFromEnv(): string {
  // 项目根目录的 .env 文件路径
  const rootDir = path.resolve(process.cwd(), '../..');
  const envPath = path.join(rootDir, '.env');
  
  if (!fs.existsSync(envPath)) {
    throw new Error(`找不到 .env 文件: ${envPath}`);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/^API_KEY=(.+)$/m);
  
  if (!match) {
    throw new Error('.env 文件中未找到 API_KEY');
  }
  
  const apiKey = match[1].trim();
  
  if (!apiKey) {
    throw new Error('API_KEY 为空');
  }
  
  return apiKey;
}

export class LaozhangClient {
  private lastRequestTime: number = 0;

  /**
   * 速率限制：确保请求间隔
   */
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < RATE_LIMIT.minIntervalMs) {
      const waitTime = RATE_LIMIT.minIntervalMs - elapsed;
      console.log(`  ⏳ 等待 ${waitTime / 1000}s (速率限制)...`);
      await this.sleep(waitTime);
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * 指数退避重试
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= RETRY.maxAttempts; attempt++) {
      try {
        await this.waitForRateLimit();
        return await operation();
      } catch (error) {
        lastError = error as Error;
        const errorMessage = (error as Error).message || String(error);
        
        // 如果是速率限制错误，直接等待更长时间
        if (errorMessage.includes('429') || errorMessage.includes('rate') || errorMessage.includes('quota')) {
          const delay = Math.min(RETRY.maxDelayMs, RETRY.baseDelayMs * Math.pow(2, attempt));
          console.log(`  ⚠️ 速率限制，等待 ${delay / 1000}s 后重试 (${attempt}/${RETRY.maxAttempts})...`);
          await this.sleep(delay);
          continue;
        }
        
        // 其他错误
        if (attempt < RETRY.maxAttempts) {
          const delay = Math.min(RETRY.maxDelayMs, RETRY.baseDelayMs * Math.pow(2, attempt));
          console.log(`  ⚠️ ${operationName} 失败: ${errorMessage}`);
          console.log(`  🔄 ${delay / 1000}s 后重试 (${attempt}/${RETRY.maxAttempts})...`);
          await this.sleep(delay);
        }
      }
    }
    
    throw new Error(`${operationName} 失败，已重试 ${RETRY.maxAttempts} 次: ${lastError?.message}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 生成图片 (text-to-image)
   */
  async generateImage(options: GenerateImageOptions): Promise<GeminiResponse> {
    return this.retryWithBackoff(async () => {
      console.log(`  🎨 生成图片 (模型: ${MODEL})...`);
      
      // 构建提示词，包含分辨率和宽高比要求
      const enhancedPrompt = `${options.prompt}

Output requirements:
- Aspect ratio: ${options.aspectRatio || '16:9'}
- Resolution: ${options.resolution || '2K'}
- Generate a high-quality image`;

      const messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }> = [
        { role: 'user', content: enhancedPrompt }
      ];

      // 添加参考图片（如果有）- 使用 image_url 格式
      if (options.referenceImages && options.referenceImages.length > 0) {
        const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
          { type: 'text', text: enhancedPrompt }
        ];
        
        for (const imgBuffer of options.referenceImages) {
          content.push({
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${imgBuffer.toString('base64')}`
            }
          });
        }
        
        messages[0] = { role: 'user', content };
      }

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          stream: false,
          messages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 请求失败 (${response.status}): ${errorText}`);
      }

      const data = await response.json() as {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
      };

      // 解析响应 - 尝试提取图片数据
      const content = data.choices?.[0]?.message?.content || '';
      
      // 情况1: 内容是 base64 图片数据
      if (content.startsWith('data:image')) {
        const base64Match = content.match(/base64,(.+)/);
        if (base64Match) {
          const imageData = Buffer.from(base64Match[1], 'base64');
          console.log(`  ✅ 图片生成成功 (${(imageData.length / 1024).toFixed(1)} KB)`);
          return { imageData };
        }
      }
      
      // 情况2: 内容是纯 base64
      try {
        const imageData = Buffer.from(content, 'base64');
        if (imageData.length > 1000) { // 至少 1KB 才可能是图片
          console.log(`  ✅ 图片生成成功 (${(imageData.length / 1024).toFixed(1)} KB)`);
          return { imageData };
        }
      } catch {
        // 不是 base64，继续其他处理
      }
      
      // 情况3: 返回的是文本描述
      console.log(`  ⚠️ API 返回文本而非图片: ${content.substring(0, 200)}...`);
      return { text: content };
    }, '图片生成');
  }

  /**
   * 分析图片 (image understanding)
   * 注意：当前模型 gemini-3.1-flash-image-preview 可能不支持视觉理解
   * 如需图片分析功能，请使用其他模型
   */
  async analyzeImage(_options: AnalyzeImageOptions): Promise<string> {
    throw new Error(
      '当前模型 gemini-3.1-flash-image-preview 不支持图片分析功能。\n' +
      '请使用 geminiClient 或其他支持视觉理解的模型。'
    );
  }

  /**
   * 分析图片并返回 JSON
   */
  async analyzeImageForJson<T>(_options: AnalyzeImageOptions): Promise<T> {
    throw new Error(
      '当前模型 gemini-3.1-flash-image-preview 不支持图片分析功能。\n' +
      '请使用 geminiClient 或其他支持视觉理解的模型。'
    );
  }
}

// 导出单例
export const laozhangClient = new LaozhangClient();

// 导出模型名称供外部参考（只读）
export const CURRENT_MODEL = MODEL;
