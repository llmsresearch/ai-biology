import { llmCacheService } from './llmCacheService';
import { LLMConnectionConfig } from './types';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  content?: Array<{ text: string }>; // For Anthropic
  usage_info?: {
    remaining: number;
    resetTime: number;
  };
}

export interface UsageStats {
  used: number;
  limit: number;
  remaining: number;
  resetTime: number;
}

class LLMService {
  async sendMessage(
    messages: ChatMessage[], 
    prompt?: string,
    useCache: boolean = true
  ): Promise<string> {
    const llmConfig = this.getLLMConfig();
    if (!llmConfig) {
      throw new Error('LLM not connected. Please connect an LLM via settings.');
    }

    const cacheKey = prompt || messages.map(m => m.content).join(' ');
    const provider = llmConfig.selectedProvider;
    const model = llmConfig.modelName;

    // Check cache first
    if (useCache) {
      const cachedResponse = llmCacheService.getCachedResponse(cacheKey, messages, provider, model);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    try {
      const response = await this.makeAPICall(messages, llmConfig);
      const responseText = this.extractResponseText(response, llmConfig);

      // Cache the response
      if (useCache && responseText) {
        llmCacheService.setCachedResponse(cacheKey, messages, responseText, provider, model);
      }

      return responseText;
    } catch (error) {
      console.error('LLM Service Error:', error);
      throw error;
    }
  }

  private async makeAPICall(messages: ChatMessage[], config: LLMConnectionConfig): Promise<ChatResponse> {
    const requestBody = {
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    };

    let apiEndpoint = '';
    let actualBody: any = requestBody;

    if (config.isSponsored) {
      apiEndpoint = config.apiEndpoint || '/api/azure-openai/free';
    } else if (config.proxyDetails) {
      apiEndpoint = '/api/llm/proxy';
      actualBody = {
        ...requestBody,
        proxyDetails: config.proxyDetails,
        modelName: config.modelName
      };
    } else {
      throw new Error('Invalid LLM configuration');
    }

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(actualBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: response.statusText, 
        status: response.status 
      }));
      throw new Error(errorData.error?.message || errorData.message || `HTTP error ${response.status}`);
    }

    return await response.json();
  }

  private extractResponseText(data: ChatResponse, config: LLMConnectionConfig): string {
    // Handle Anthropic format
    if (config.proxyDetails?.providerType === 'anthropic' && data.content && Array.isArray(data.content)) {
      return data.content.map((item: any) => item.text).join('\n');
    }
    
    // Handle OpenAI/Azure format
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    
    // Fallback
    if (data.content) {
      return typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
    }
    
    throw new Error('Unable to extract response text from API response');
  }

  private getLLMConfig(): LLMConnectionConfig | null {
    const configStr = localStorage.getItem('llmConnectionConfig');
    if (configStr) {
      try {
        return JSON.parse(configStr) as LLMConnectionConfig;
      } catch (e) {
        console.error("Failed to parse LLM config:", e);
        return null;
      }
    }
    return null;
  }

  async getUsageStats(): Promise<UsageStats> {
    try {
      const response = await fetch('/api/usage');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
      throw error;
    }
  }

  async checkHealth(): Promise<{ status: string; freeUsage?: UsageStats }> {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Helper method to format time remaining
  formatTimeRemaining(resetTime: number): string {
    const now = Date.now();
    const timeRemaining = resetTime - now;
    
    if (timeRemaining <= 0) {
      return 'Available now';
    }
    
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  // Cache management methods
  clearCache(): void {
    llmCacheService.clearCache();
  }

  getCacheStats() {
    return llmCacheService.getCacheStats();
  }
}

export const llmService = new LLMService();