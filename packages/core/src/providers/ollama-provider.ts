/**
 * Ollama Provider Implementation
 *
 * Supports Ollama (ollama.com) for running local LLMs
 * Handles local model management, streaming, and zero-cost operations.
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
} from './llm-provider.js';

/**
 * Ollama Provider
 */
export class OllamaProvider implements LLMProvider {
  readonly id = 'ollama';
  readonly displayName = 'Ollama (Local)';

  private config: ProviderConfig | null = null;
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
    this.endpoint = config.endpoint || 'http://localhost:11434';

    // Verify Ollama is running
    try {
      await this.checkHealth();
    } catch (error) {
      throw new ProviderInitError(
        this.id,
        'Failed to connect to Ollama - ensure Ollama is running',
        error as Error
      );
    }
  }

  async complete(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    if (!this.config || !this.endpoint) {
      throw new ProviderInitError(this.id, 'Provider not initialized');
    }

    const timeout = this.config.timeout ?? 120000; // Ollama can be slower (2 min default)

    try {
      const response = await this.makeRequest(request, timeout);
      return response;
    } catch (error) {
      throw new ProviderCompletionError(
        this.id,
        `Ollama completion failed: ${error}`,
        undefined,
        error as Error
      );
    }
  }

  async streamComplete(
    request: LLMCompletionRequest,
    onChunk: (chunk: string) => void
  ): Promise<LLMCompletionResponse> {
    if (!this.config || !this.endpoint) {
      throw new ProviderInitError(this.id, 'Provider not initialized');
    }

    const timeout = this.config.timeout ?? 120000;

    const body = this.buildRequestBody(request, true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const url = `${this.endpoint}/api/chat`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      let totalDuration = 0;
      let evalCount = 0;
      let promptEvalCount = 0;

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);

            if (parsed.message?.content) {
              const delta = parsed.message.content;
              fullContent += delta;
              onChunk(delta);
            }

            // Ollama provides token counts in the final message
            if (parsed.done) {
              totalDuration = parsed.total_duration || 0;
              evalCount = parsed.eval_count || 0;
              promptEvalCount = parsed.prompt_eval_count || 0;
            }
          } catch (e) {
            // Skip invalid JSON lines
            console.warn('Failed to parse Ollama streaming chunk:', e);
          }
        }
      }

      return {
        content: fullContent,
        usage: {
          promptTokens: promptEvalCount,
          completionTokens: evalCount,
          totalTokens: promptEvalCount + evalCount,
        },
        model: request.model,
        finishReason: 'stop',
        metadata: {
          totalDuration,
          durationMs: totalDuration / 1_000_000,
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

  validateConfig(config: ProviderConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.defaultModel) {
      errors.push('defaultModel is required (e.g., "llama3", "mistral", "codellama")');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  async getAvailableModels(): Promise<string[]> {
    if (!this.endpoint) {
      throw new ProviderInitError(this.id, 'Provider not initialized');
    }

    try {
      const response = await fetch(`${this.endpoint}/api/tags`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as any;
      return data.models?.map((model: any) => model.name) || [];
    } catch (error) {
      console.warn('Failed to fetch Ollama models:', error);
      return [];
    }
  }

  estimateCost(usage: TokenUsage, model: string): number {
    // Ollama is free (local execution)
    return 0.0;
  }

  // ==================== Private Methods ====================

  private async checkHealth(): Promise<void> {
    try {
      const response = await fetch(`${this.endpoint}/api/tags`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      throw new Error(
        'Cannot connect to Ollama. Ensure Ollama is installed and running (ollama serve)'
      );
    }
  }

  private buildRequestBody(
    request: LLMCompletionRequest,
    stream = false
  ): Record<string, any> {
    const body: Record<string, any> = {
      model: request.model,
      messages: request.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream,
    };

    // Ollama options
    const options: Record<string, any> = {};

    if (request.temperature !== undefined) options.temperature = request.temperature;
    if (request.topP !== undefined) options.top_p = request.topP;
    if (request.stop) options.stop = request.stop;

    if (Object.keys(options).length > 0) {
      body.options = options;
    }

    return body;
  }

  private async makeRequest(
    request: LLMCompletionRequest,
    timeout: number
  ): Promise<LLMCompletionResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const url = `${this.endpoint}/api/chat`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.buildRequestBody(request)),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = (await response.json()) as any;

      return {
        content: data.message?.content || '',
        usage: {
          promptTokens: data.prompt_eval_count || 0,
          completionTokens: data.eval_count || 0,
          totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
        },
        model: data.model,
        finishReason: 'stop',
        metadata: {
          totalDuration: data.total_duration,
          loadDuration: data.load_duration,
          promptEvalDuration: data.prompt_eval_duration,
          evalDuration: data.eval_duration,
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
      errorMessage = data.error || errorMessage;
    } catch {
      // Ignore JSON parse errors
    }

    throw new ProviderCompletionError(this.id, errorMessage, status);
  }
}

/**
 * Create and export a singleton instance
 */
export const ollamaProvider = new OllamaProvider();
