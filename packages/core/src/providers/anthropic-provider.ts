/**
 * Anthropic Provider Implementation
 *
 * Supports Claude API (api.anthropic.com)
 * Handles Claude-specific message format, streaming, and cost estimation.
 */

import type {
  LLMProvider,
  LLMCompletionRequest,
  LLMCompletionResponse,
  ProviderConfig,
  TokenUsage,
} from './llm-provider.js';
import {
  ProviderInitError,
  ProviderCompletionError,
  ProviderRateLimitError,
  ProviderAuthError,
} from './llm-provider.js';

/**
 * Anthropic model pricing (per 1M tokens, as of January 2025)
 * Source: https://www.anthropic.com/pricing
 */
const ANTHROPIC_PRICING: Record<string, { input: number; output: number }> = {
  'claude-opus-4': { input: 15.0, output: 75.0 },
  'claude-sonnet-4': { input: 3.0, output: 15.0 },
  'claude-haiku-4': { input: 0.25, output: 1.25 },
  'claude-3-5-sonnet': { input: 3.0, output: 15.0 },
  'claude-3-5-haiku': { input: 0.25, output: 1.25 },
  'claude-3-opus': { input: 15.0, output: 75.0 },
  'claude-3-sonnet': { input: 3.0, output: 15.0 },
  'claude-3-haiku': { input: 0.25, output: 1.25 },
};

/**
 * Anthropic Provider
 */
export class AnthropicProvider implements LLMProvider {
  readonly id = 'anthropic';
  readonly displayName = 'Anthropic Claude';

  private config: ProviderConfig | null = null;
  private apiKey: string | null = null;
  private endpoint: string | null = null;

  async initialize(config: ProviderConfig): Promise<void> {
    const validation = this.validateConfig(config);
    if (!validation.valid) {
      throw new ProviderInitError(
        this.id,
        `Invalid configuration: ${validation.errors.join(', ')}`
      );
    }

    this.config = config;
    this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY || null;
    this.endpoint = config.endpoint || 'https://api.anthropic.com/v1';

    // Verify API key with a lightweight request
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
      const url = `${this.endpoint}/messages`;

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
      let finishReason = 'end_turn';

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            try {
              const parsed = JSON.parse(data);

              // Handle different event types
              if (parsed.type === 'content_block_delta') {
                const delta = parsed.delta?.text;
                if (delta) {
                  fullContent += delta;
                  onChunk(delta);
                }
              } else if (parsed.type === 'message_delta') {
                if (parsed.usage) {
                  usage = {
                    promptTokens: 0, // Will be updated in message_stop
                    completionTokens: parsed.usage.output_tokens || 0,
                    totalTokens: 0,
                  };
                }
                if (parsed.delta?.stop_reason) {
                  finishReason = parsed.delta.stop_reason;
                }
              } else if (parsed.type === 'message_stop') {
                // Final usage is in the message_stop event for some Claude versions
                if (parsed.usage) {
                  usage = {
                    promptTokens: parsed.usage.input_tokens || 0,
                    completionTokens: parsed.usage.output_tokens || 0,
                    totalTokens:
                      (parsed.usage.input_tokens || 0) +
                      (parsed.usage.output_tokens || 0),
                  };
                }
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

    if (!config.apiKey && !process.env.ANTHROPIC_API_KEY) {
      errors.push(
        'apiKey is required (or set ANTHROPIC_API_KEY environment variable)'
      );
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
    // Anthropic doesn't have a models endpoint yet
    // Return known models
    return Object.keys(ANTHROPIC_PRICING);
  }

  estimateCost(usage: TokenUsage, model: string): number {
    // Find pricing for the model
    const baseModel = Object.keys(ANTHROPIC_PRICING).find((key) =>
      model.includes(key)
    );

    if (!baseModel) {
      // Unknown model, use Claude 3.5 Sonnet pricing as default
      const pricing = ANTHROPIC_PRICING['claude-3-5-sonnet'];
      return (
        (usage.promptTokens / 1_000_000) * pricing.input +
        (usage.completionTokens / 1_000_000) * pricing.output
      );
    }

    const pricing = ANTHROPIC_PRICING[baseModel];
    return (
      (usage.promptTokens / 1_000_000) * pricing.input +
      (usage.completionTokens / 1_000_000) * pricing.output
    );
  }

  // ==================== Private Methods ====================

  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey!,
      'anthropic-version': '2023-06-01',
    };
  }

  private buildRequestBody(
    request: LLMCompletionRequest,
    stream = false
  ): Record<string, any> {
    // Extract system message (Claude requires it separate)
    const systemMessage = request.messages.find((m) => m.role === 'system');
    const conversationMessages = request.messages.filter((m) => m.role !== 'system');

    const body: Record<string, any> = {
      model: request.model,
      messages: conversationMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream,
    };

    if (systemMessage) {
      body.system = systemMessage.content;
    }

    if (request.maxTokens) {
      body.max_tokens = request.maxTokens;
    } else {
      // Claude requires max_tokens, use a reasonable default
      body.max_tokens = 4096;
    }

    if (request.temperature !== undefined) body.temperature = request.temperature;
    if (request.topP !== undefined) body.top_p = request.topP;
    if (request.stop) body.stop_sequences = request.stop;

    return body;
  }

  private async makeRequest(
    request: LLMCompletionRequest,
    timeout: number
  ): Promise<LLMCompletionResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const url = `${this.endpoint}/messages`;

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

      // Claude returns content as an array of content blocks
      const contentText = data.content
        .map((block: any) => block.text || '')
        .join('');

      return {
        content: contentText,
        usage: {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        },
        model: data.model,
        finishReason: data.stop_reason,
        metadata: {
          id: data.id,
          type: data.type,
          role: data.role,
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
export const anthropicProvider = new AnthropicProvider();
