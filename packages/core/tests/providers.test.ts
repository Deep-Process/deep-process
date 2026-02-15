/**
 * Provider Abstraction Unit Tests
 *
 * Tests for LLM provider initialization, validation, and basic operations.
 * Uses mock configurations to avoid requiring actual API keys.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  providerRegistry,
  OpenAIProvider,
  AnthropicProvider,
  OllamaProvider,
  type ProviderConfig,
} from '../src/index.js';

describe('Provider Registry', () => {
  beforeEach(() => {
    providerRegistry.clearCache();
  });

  it('should have registered providers', () => {
    const providerIds = providerRegistry.getProviderIds();
    expect(providerIds).toContain('openai');
    expect(providerIds).toContain('anthropic');
    expect(providerIds).toContain('ollama');
  });

  it('should retrieve providers by ID', () => {
    const openai = providerRegistry.getProvider('openai');
    expect(openai).toBeDefined();
    expect(openai?.id).toBe('openai');
    expect(openai?.displayName).toBe('OpenAI');
  });

  it('should return undefined for unknown provider', () => {
    const unknown = providerRegistry.getProvider('unknown' as any);
    expect(unknown).toBeUndefined();
  });
});

describe('OpenAI Provider', () => {
  let provider: OpenAIProvider;

  beforeEach(() => {
    provider = new OpenAIProvider();
  });

  it('should validate valid config', () => {
    const config: ProviderConfig = {
      type: 'openai',
      apiKey: 'sk-test-key',
      defaultModel: 'gpt-4o-mini',
    };

    const validation = provider.validateConfig(config);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should reject config without API key', () => {
    const config: ProviderConfig = {
      type: 'openai',
      defaultModel: 'gpt-4o-mini',
    };

    const validation = provider.validateConfig(config);
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
    expect(validation.errors[0]).toContain('apiKey');
  });

  it('should reject config without default model', () => {
    const config: ProviderConfig = {
      type: 'openai',
      apiKey: 'sk-test-key',
      defaultModel: '',
    };

    const validation = provider.validateConfig(config);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes('defaultModel'))).toBe(true);
  });

  it('should estimate cost correctly', () => {
    const usage = {
      promptTokens: 1000,
      completionTokens: 500,
      totalTokens: 1500,
    };

    // GPT-4o-mini: $0.15/1M input, $0.6/1M output
    const cost = provider.estimateCost(usage, 'gpt-4o-mini');
    const expectedCost = (1000 / 1_000_000) * 0.15 + (500 / 1_000_000) * 0.6;

    expect(cost).toBeCloseTo(expectedCost, 6);
  });

  it('should use conservative estimate for unknown models', () => {
    const usage = {
      promptTokens: 1000,
      completionTokens: 500,
      totalTokens: 1500,
    };

    // Unknown model should use GPT-4 pricing (most expensive)
    const cost = provider.estimateCost(usage, 'unknown-model');
    const expectedCost = (1000 / 1_000_000) * 30.0 + (500 / 1_000_000) * 60.0;

    expect(cost).toBeCloseTo(expectedCost, 6);
  });
});

describe('Anthropic Provider', () => {
  let provider: AnthropicProvider;

  beforeEach(() => {
    provider = new AnthropicProvider();
  });

  it('should validate valid config', () => {
    const config: ProviderConfig = {
      type: 'anthropic',
      apiKey: 'sk-ant-test-key',
      defaultModel: 'claude-3-5-sonnet',
    };

    const validation = provider.validateConfig(config);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should reject config without API key', () => {
    const config: ProviderConfig = {
      type: 'anthropic',
      defaultModel: 'claude-3-5-sonnet',
    };

    const validation = provider.validateConfig(config);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes('apiKey'))).toBe(true);
  });

  it('should estimate cost correctly', () => {
    const usage = {
      promptTokens: 1000,
      completionTokens: 500,
      totalTokens: 1500,
    };

    // Claude 3.5 Sonnet: $3/1M input, $15/1M output
    const cost = provider.estimateCost(usage, 'claude-3-5-sonnet');
    const expectedCost = (1000 / 1_000_000) * 3.0 + (500 / 1_000_000) * 15.0;

    expect(cost).toBeCloseTo(expectedCost, 6);
  });

  it('should return known models', async () => {
    const models = await provider.getAvailableModels();
    expect(models).toContain('claude-3-5-sonnet');
    expect(models).toContain('claude-3-5-haiku');
  });
});

describe('Ollama Provider', () => {
  let provider: OllamaProvider;

  beforeEach(() => {
    provider = new OllamaProvider();
  });

  it('should validate valid config', () => {
    const config: ProviderConfig = {
      type: 'ollama',
      endpoint: 'http://localhost:11434',
      defaultModel: 'llama3',
    };

    const validation = provider.validateConfig(config);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should not require API key', () => {
    const config: ProviderConfig = {
      type: 'ollama',
      defaultModel: 'llama3',
      // No apiKey required
    };

    const validation = provider.validateConfig(config);
    expect(validation.valid).toBe(true);
  });

  it('should always return zero cost', () => {
    const usage = {
      promptTokens: 1000,
      completionTokens: 500,
      totalTokens: 1500,
    };

    const cost = provider.estimateCost(usage, 'llama3');
    expect(cost).toBe(0.0);
  });

  it('should use localhost endpoint by default', () => {
    expect(provider.id).toBe('ollama');
    expect(provider.displayName).toBe('Ollama (Local)');
  });
});

describe('Provider Configuration Validation', () => {
  it('should validate OpenAI config', () => {
    const config: ProviderConfig = {
      type: 'openai',
      apiKey: 'sk-test',
      defaultModel: 'gpt-4o-mini',
    };

    const validation = providerRegistry.validateProviderConfig(config);
    expect(validation.valid).toBe(true);
  });

  it('should validate Azure config', () => {
    const config = {
      type: 'azure' as const,
      apiKey: 'test-key',
      defaultModel: 'gpt-4',
      resourceName: 'my-resource',
      deploymentName: 'gpt-4-deployment',
      apiVersion: '2024-02-15-preview',
    };

    const validation = providerRegistry.validateProviderConfig(config);
    expect(validation.valid).toBe(true);
  });

  it('should reject invalid Azure config', () => {
    const config = {
      type: 'azure' as const,
      apiKey: 'test-key',
      defaultModel: 'gpt-4',
      // Missing required Azure fields
    };

    const validation = providerRegistry.validateProviderConfig(config);
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });

  it('should reject unknown provider type', () => {
    const config = {
      type: 'unknown-provider' as any,
      defaultModel: 'test',
    };

    const validation = providerRegistry.validateProviderConfig(config);
    expect(validation.valid).toBe(false);
    expect(validation.errors[0]).toContain('Unknown provider type');
  });
});

describe('Multi-Tenant Configuration', () => {
  beforeEach(() => {
    providerRegistry.clearCache();
  });

  it('should register and retrieve tenant config', () => {
    providerRegistry.registerTenant({
      tenantId: 'test-tenant',
      primary: {
        type: 'openai',
        apiKey: 'sk-test',
        defaultModel: 'gpt-4o-mini',
      },
      trackCost: true,
      tokenBudget: 1_000_000,
    });

    const config = providerRegistry.getTenantConfig('test-tenant');
    expect(config).toBeDefined();
    expect(config?.tenantId).toBe('test-tenant');
    expect(config?.primary.type).toBe('openai');
    expect(config?.trackCost).toBe(true);
  });

  it('should support fallback provider', () => {
    providerRegistry.registerTenant({
      tenantId: 'test-tenant',
      primary: {
        type: 'openai',
        apiKey: 'sk-test',
        defaultModel: 'gpt-4o',
      },
      fallback: {
        type: 'anthropic',
        apiKey: 'sk-ant-test',
        defaultModel: 'claude-3-5-haiku',
      },
    });

    const config = providerRegistry.getTenantConfig('test-tenant');
    expect(config?.fallback).toBeDefined();
    expect(config?.fallback?.type).toBe('anthropic');
  });

  it('should unregister tenant', () => {
    providerRegistry.registerTenant({
      tenantId: 'test-tenant',
      primary: {
        type: 'openai',
        apiKey: 'sk-test',
        defaultModel: 'gpt-4o-mini',
      },
    });

    expect(providerRegistry.getTenantConfig('test-tenant')).toBeDefined();

    providerRegistry.unregisterTenant('test-tenant');
    expect(providerRegistry.getTenantConfig('test-tenant')).toBeUndefined();
  });
});
