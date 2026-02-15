/**
 * OpenAI Provider Implementation
 *
 * Supports both:
 * - OpenAI API (api.openai.com)
 * - Azure OpenAI Service
 *
 * Handles authentication, retries, rate limiting, and cost estimation.
 */

import type {
  LLMProvider,
  LLMCompletionRequest,
  LLMCompletionResponse,
  ProviderConfig,
  AzureProviderConfig,
  TokenUsage,
} from './llm-provider.js';
import {
  ProviderInitError,
  ProviderCompletionError,
  ProviderRateLimitError,
  ProviderAuthError,
} from './llm-provider.js';

/**
 * OpenAI model pricing (per 1M tokens, as of January 2025)
 * Source: https://openai.com/pricing
 */
const OPENAI_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4': { input: 30.0, output: 60.0 },
  'gpt-4-turbo': { input: 10.0, output: 30.0 },
  'gpt-4o': { input: 2.5, output: 10.0 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
  'gpt-3.5-turbo-16k': { input: 3.0, output: 4.0 },
};

/**
 * OpenAI Provider
 */
export class OpenAIProvider implements LLMProvider {
  readonly id = 'openai';
  readonly displayName = 'OpenAI';

  private config: ProviderConfig | null = null;
  private apiKey: string | null = null;
  private endpoint: string | null = null;
  private isAzure = false;

  async initialize(config: ProviderConfig): Promise<void> {
    const validation = this.validateConfig(config);
    if (!validation.valid) {
      throw new ProviderInitError(
        this.id,
        `Invalid configuration: ${validation.errors.join(', ')}`
      );
    }

    this.config = config;
    this.apiKey = config.apiKey || null;
    this.isAzure = config.type === 'azure';

    if (this.isAzure) {
      const azureConfig = config as AzureProviderConfig;
      // Azure endpoint format: https://{resourceName}.openai.azure.com/openai/deployments/{deploymentName}
      this.endpoint = `https://${azureConfig.resourceName}.openai.azure.com`;
    } else {
      this.endpoint = config.endpoint || 'https://api.openai.com/v1';
    }

    // Verify API key works with a lightweight request
    try {
      await this.getAvailableModels();
    } catch (error) {
      throw new ProviderInitError(
        this.id,
        'Failed to verify API key - check credentials',
        error as Error
      );
    }
  }

  async complete(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    if (!this.config || !this.apiKey) {
      throw new ProviderInitError(this.id, 'Provider not initialized');
    }

    const maxRetries = this.config.maxRetries ?? 3;
    const timeout = this.config.timeout ?? 60000;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.makeRequest(request, timeout);
        return response;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on auth errors or invalid requests
        if (
          error instanceof ProviderAuthError ||
          (error instanceof ProviderCompletionError && error.statusCode === 400)
        ) {
          throw error;
        }

        // Retry on rate limits with exponential backoff
        if (error instanceof ProviderRateLimitError) {
          const retryDelay = error.retryAfter
            ? error.retryAfter * 1000
            : Math.min(1000 * Math.pow(2, attempt), 30000);

          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            continue;
          }
        }

        // Retry on network errors
        if (attempt < maxRetries) {
          const retryDelay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }

        throw error;
      }
    }

    throw new ProviderCompletionError(
      this.id,
      `Failed after ${maxRetries} retries`,
      undefined,
      lastError!
    );
  }

  async streamComplete(
    request: LLMCompletionRequest,
    onChunk: (chunk: string) => void
  ): Promise<LLMCompletionResponse> {
    if (!this.config || !this.apiKey) {
      throw new ProviderInitError(this.id, 'Provider not initialized');
    }

    const timeout = this.config.timeout ?? 60000;

    // Build request body
    const body = this.buildRequestBody(request, true);

    // Make streaming request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const url = this.isAzure
        ? `${this.endpoint}/openai/deployments/${(this.config as AzureProviderConfig).deploymentName}/chat/completions?api-version=${(this.config as AzureProviderConfig).apiVersion}`
        : `${this.endpoint}/chat/completions`;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Process streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new ProviderCompletionError(this.id, 'No response body');
      }

      let fullContent = '';
      let usage: TokenUsage | null = null;
      let finishReason = 'stop';

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                fullContent += delta;
                onChunk(delta);
              }

              // Capture usage and finish reason from final chunk
              if (parsed.usage) {
                usage = {
                  promptTokens: parsed.usage.prompt_tokens,
                  completionTokens: parsed.usage.completion_tokens,
                  totalTokens: parsed.usage.total_tokens,
                };
              }
              if (parsed.choices?.[0]?.finish_reason) {
                finishReason = parsed.choices[0].finish_reason;
              }
            } catch (e) {
              // Skip invalid JSON chunks
              console.warn('Failed to parse streaming chunk:', e);
            }
          }
        }
      }

      // If usage wasn't provided in stream, estimate it
      if (!usage) {
        usage = this.estimateTokens(request.messages, fullContent);
      }

      return {
        content: fullContent,
        usage,
        model: request.model,
        finishReason,
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ProviderCompletionError(
          this.id,
          `Request timeout after ${timeout}ms`
        );
      }
      throw error;
    }
  }

  validateConfig(config: ProviderConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.apiKey && !process.env.OPENAI_API_KEY) {
      errors.push('apiKey is required (or set OPENAI_API_KEY environment variable)');
    }

    if (config.type === 'azure') {
      const azureConfig = config as AzureProviderConfig;
      if (!azureConfig.apiVersion) {
        errors.push('apiVersion is required for Azure OpenAI');
      }
      if (!azureConfig.deploymentName) {
        errors.push('deploymentName is required for Azure OpenAI');
      }
      if (!azureConfig.resourceName) {
        errors.push('resourceName is required for Azure OpenAI');
      }
    }

    if (!config.defaultModel) {
      errors.push('defaultModel is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  async getAvailableModels(): Promise<string[]> {
    if (!this.config || !this.apiKey) {
      throw new ProviderInitError(this.id, 'Provider not initialized');
    }

    if (this.isAzure) {
      // Azure deployments don't have a models endpoint
      // Return the configured deployment model
      return [(this.config as AzureProviderConfig).deploymentName];
    }

    try {
      const response = await fetch(`${this.endpoint}/models`, {
        headers: this.buildHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as any;
      return data.data.map((model: any) => model.id);
    } catch (error) {
      // Fallback to known models if API call fails
      return Object.keys(OPENAI_PRICING);
    }
  }

  estimateCost(usage: TokenUsage, model: string): number {
    // Find pricing for the model (handle versioned models like gpt-4-0613)
    const baseModel = Object.keys(OPENAI_PRICING).find((key) =>
      model.startsWith(key)
    );

    if (!baseModel) {
      // Unknown model, use GPT-4 pricing as conservative estimate
      const pricing = OPENAI_PRICING['gpt-4'];
      return (
        (usage.promptTokens / 1_000_000) * pricing.input +
        (usage.completionTokens / 1_000_000) * pricing.output
      );
    }

    const pricing = OPENAI_PRICING[baseModel];
    return (
      (usage.promptTokens / 1_000_000) * pricing.input +
      (usage.completionTokens / 1_000_000) * pricing.output
    );
  }

  // ==================== Private Methods ====================

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.isAzure) {
      headers['api-key'] = this.apiKey!;
    } else {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
      if (this.config?.organization) {
        headers['OpenAI-Organization'] = this.config.organization;
      }
    }

    return headers;
  }

  private buildRequestBody(
    request: LLMCompletionRequest,
    stream = false
  ): Record<string, any> {
    const body: Record<string, any> = {
      model: request.model,
      messages: request.messages,
      stream,
    };

    if (request.maxTokens) body.max_tokens = request.maxTokens;
    if (request.temperature !== undefined) body.temperature = request.temperature;
    if (request.topP !== undefined) body.top_p = request.topP;
    if (request.stop) body.stop = request.stop;

    return body;
  }

  private async makeRequest(
    request: LLMCompletionRequest,
    timeout: number
  ): Promise<LLMCompletionResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const url = this.isAzure
        ? `${this.endpoint}/openai/deployments/${(this.config as AzureProviderConfig).deploymentName}/chat/completions?api-version=${(this.config as AzureProviderConfig).apiVersion}`
        : `${this.endpoint}/chat/completions`;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(this.buildRequestBody(request)),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = (await response.json()) as any;

      return {
        content: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        model: data.model,
        finishReason: data.choices[0].finish_reason,
        metadata: {
          id: data.id,
          created: data.created,
          systemFingerprint: data.system_fingerprint,
        },
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ProviderCompletionError(
          this.id,
          `Request timeout after ${timeout}ms`
        );
      }
      throw error;
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const status = response.status;
    let errorMessage = `HTTP ${status}`;

    try {
      const data = (await response.json()) as any;
      errorMessage = data.error?.message || errorMessage;
    } catch {
      // Ignore JSON parse errors
    }

    if (status === 401 || status === 403) {
      throw new ProviderAuthError(this.id);
    }

    if (status === 429) {
      const retryAfter = response.headers.get('retry-after');
      throw new ProviderRateLimitError(
        this.id,
        retryAfter ? parseInt(retryAfter) : undefined
      );
    }

    throw new ProviderCompletionError(this.id, errorMessage, status);
  }

  private estimateTokens(
    messages: Array<{ role: string; content: string }>,
    completion: string
  ): TokenUsage {
    // Rough estimation: ~4 characters per token
    const promptText = messages.map((m) => m.content).join('');
    const promptTokens = Math.ceil(promptText.length / 4);
    const completionTokens = Math.ceil(completion.length / 4);

    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    };
  }
}

/**
 * Create and export a singleton instance
 */
export const openaiProvider = new OpenAIProvider();
