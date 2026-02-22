/**
 * Gemini API 客户端
 * 
 * 负责与 Google Gemini API 交互：
 * - 图片生成（text-to-image, image-to-image）
 * - 图片理解（多模态分析）
 */

import { GoogleGenAI } from '@google/genai';
import { setGlobalDispatcher, ProxyAgent } from 'undici';
import type { GenerateImageOptions, AnalyzeImageOptions, GeminiResponse } from './types.js';

// 配置全局代理
const PROXY_URL = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || 'http://127.0.0.1:7890';
if (PROXY_URL) {
  setGlobalDispatcher(new ProxyAgent(PROXY_URL));
  console.log(`  🔧 已配置代理: ${PROXY_URL}`);
}

// API 配置
const API_KEY = 'AIzaSyDR1Vwfk4Y_wlGI1tBOlxRd-0OJ6D5-gvs';
const IMAGE_MODEL = 'gemini-3-pro-image-preview';
const VISION_MODEL = 'gemini-3-pro-preview';

// 速率限制配置
const RATE_LIMIT = {
  requestsPerMinute: 15,
  minIntervalMs: 5000, // 5秒间隔
};

// 重试配置
const RETRY = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
};

export class GeminiClient {
  private client: GoogleGenAI;
  private lastRequestTime: number = 0;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: API_KEY });
  }

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
      console.log(`  🎨 生成图片...`);
      
      const contents: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [
        { text: options.prompt }
      ];

      // 添加参考图片（如果有）
      if (options.referenceImages && options.referenceImages.length > 0) {
        for (const imgBuffer of options.referenceImages) {
          contents.push({
            inlineData: {
              mimeType: 'image/png',
              data: imgBuffer.toString('base64')
            }
          });
        }
      }

      // 构建提示词，包含分辨率和宽高比要求
      const enhancedPrompt = `${options.prompt}

Output requirements:
- Aspect ratio: ${options.aspectRatio || '16:9'}
- Resolution: ${options.resolution || '2K'}
- Generate a high-quality image`;

      contents[0] = { text: enhancedPrompt };

      const response = await this.client.models.generateContent({
        model: IMAGE_MODEL,
        contents: contents,
        config: {
          responseModalities: ['TEXT', 'IMAGE']
        }
      });

      // 解析响应
      const parts = response.candidates?.[0]?.content?.parts || [];
      let text: string | undefined;
      let imageData: Buffer | undefined;

      for (const part of parts) {
        if (part.text) {
          text = part.text;
        } else if (part.inlineData?.data) {
          imageData = Buffer.from(part.inlineData.data, 'base64');
        }
      }

      if (!imageData) {
        throw new Error('API 未返回图片数据');
      }

      console.log(`  ✅ 图片生成成功 (${(imageData.length / 1024).toFixed(1)} KB)`);
      return { text, imageData };
    }, '图片生成');
  }

  /**
   * 分析图片 (image understanding)
   */
  async analyzeImage(options: AnalyzeImageOptions): Promise<string> {
    return this.retryWithBackoff(async () => {
      console.log(`  🔍 分析图片...`);
      
      const contents: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
      
      // 如果有系统提示词，添加到内容开头
      if (options.systemPrompt) {
        contents.push({ text: `[系统指令]\n${options.systemPrompt}\n\n[用户请求]\n${options.prompt}` });
      } else {
        contents.push({ text: options.prompt });
      }
      
      // 添加图片
      contents.push({
        inlineData: {
          mimeType: 'image/png',
          data: options.image.toString('base64')
        }
      });

      const response = await this.client.models.generateContent({
        model: VISION_MODEL,
        contents: contents
      });

      const text = response.text || '';
      console.log(`  ✅ 分析完成 (${text.length} 字符)`);
      return text;
    }, '图片分析');
  }

  /**
   * 分析图片并返回 JSON
   */
  async analyzeImageForJson<T>(options: AnalyzeImageOptions): Promise<T> {
    const response = await this.analyzeImage(options);
    
    // 尝试提取 JSON
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]) as T;
      } catch (e) {
        console.log(`  ⚠️ JSON 解析失败，尝试直接解析...`);
      }
    }
    
    // 尝试直接解析整个响应
    try {
      return JSON.parse(response) as T;
    } catch (e) {
      throw new Error(`无法解析 JSON 响应: ${response.substring(0, 200)}...`);
    }
  }
}

// 导出单例
export const geminiClient = new GeminiClient();
