/**
 * LLM Providers Module
 *
 * Exports all provider implementations and utilities:
 * - Base provider interface and types
 * - Individual provider implementations
 * - Provider registry for multi-provider management
 * - Tenant-based provider resolution
 */

// Base types and interfaces
export type {
  LLMProvider,
  LLMMessage,
  LLMCompletionRequest,
  LLMCompletionResponse,
  ProviderConfig,
  AzureProviderConfig,
  BedrockProviderConfig,
  TokenUsage,
} from './llm-provider.js';

export {
  ProviderInitError,
  ProviderCompletionError,
  ProviderRateLimitError,
  ProviderAuthError,
} from './llm-provider.js';

// Individual providers
export { OpenAIProvider, openaiProvider } from './openai-provider.js';
export { AnthropicProvider, anthropicProvider } from './anthropic-provider.js';
export { OllamaProvider, ollamaProvider } from './ollama-provider.js';

// Provider registry
export type { ProviderId, TenantProviderConfig } from './provider-registry.js';
export {
  providerRegistry,
  getProviderForTenant,
  initializeProvider,
  registerTenant,
  validateProviderConfig,
} from './provider-registry.js';
