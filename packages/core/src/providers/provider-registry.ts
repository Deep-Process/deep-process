/**
 * Provider Registry
 *
 * Centralized management of LLM providers:
 * - Register and retrieve providers by ID
 * - Initialize providers from configuration
 * - Tenant-based provider resolution
 * - Provider health checks and failover
 */

import type { LLMProvider, ProviderConfig } from './llm-provider.js';
import { ProviderInitError } from './llm-provider.js';
import { openaiProvider } from './openai-provider.js';
import { anthropicProvider } from './anthropic-provider.js';
import { ollamaProvider } from './ollama-provider.js';

export type ProviderId = 'openai' | 'anthropic' | 'azure' | 'bedrock' | 'ollama' | 'gemini';

/**
 * Tenant configuration (for multi-tenancy support)
 */
export interface TenantProviderConfig {
  /** Tenant identifier */
  tenantId: string;

  /** Primary provider configuration */
  primary: ProviderConfig;

  /** Fallback provider configuration (optional) */
  fallback?: ProviderConfig;

  /** Cost tracking enabled */
  trackCost?: boolean;

  /** Monthly token budget (optional) */
  tokenBudget?: number;

  /** Rate limits per minute (optional) */
  rateLimit?: number;
}

/**
 * Provider Registry
 */
class ProviderRegistry {
  private providers: Map<ProviderId, LLMProvider> = new Map();
  private initializedProviders: Map<string, LLMProvider> = new Map(); // Config hash -> Provider instance
  private tenantConfigs: Map<string, TenantProviderConfig> = new Map();

  constructor() {
    // Register built-in providers
    this.registerProvider(openaiProvider);
    this.registerProvider(anthropicProvider);
    this.registerProvider(ollamaProvider);
  }

  /**
   * Register a provider
   */
  registerProvider(provider: LLMProvider): void {
    this.providers.set(provider.id as ProviderId, provider);
  }

  /**
   * Get a provider by ID
   */
  getProvider(id: ProviderId): LLMProvider | undefined {
    return this.providers.get(id);
  }

  /**
   * Get all registered providers
   */
  getAllProviders(): LLMProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get provider IDs
   */
  getProviderIds(): ProviderId[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Initialize a provider from configuration
   * Returns a cached instance if already initialized with same config
   */
  async initializeProvider(config: ProviderConfig): Promise<LLMProvider> {
    // Create config hash for caching
    const configHash = this.hashConfig(config);

    // Return cached instance if exists
    if (this.initializedProviders.has(configHash)) {
      return this.initializedProviders.get(configHash)!;
    }

    // Get provider by type
    const providerId = config.type === 'azure' ? 'openai' : config.type;
    const provider = this.getProvider(providerId as ProviderId);

    if (!provider) {
      throw new ProviderInitError(
        providerId,
        `Unknown provider type: ${config.type}`
      );
    }

    // Initialize provider
    await provider.initialize(config);

    // Cache initialized instance
    this.initializedProviders.set(configHash, provider);

    return provider;
  }

  /**
   * Register tenant configuration
   */
  registerTenant(config: TenantProviderConfig): void {
    this.tenantConfigs.set(config.tenantId, config);
  }

  /**
   * Get provider for a tenant
   * Initializes provider if not already initialized
   */
  async getProviderForTenant(tenantId: string): Promise<LLMProvider> {
    const config = this.tenantConfigs.get(tenantId);

    if (!config) {
      throw new Error(
        `No provider configuration found for tenant: ${tenantId}`
      );
    }

    try {
      // Try primary provider
      return await this.initializeProvider(config.primary);
    } catch (error) {
      // Try fallback if configured
      if (config.fallback) {
        console.warn(
          `Primary provider failed for tenant ${tenantId}, using fallback`,
          error
        );
        return await this.initializeProvider(config.fallback);
      }

      throw error;
    }
  }

  /**
   * Get tenant configuration
   */
  getTenantConfig(tenantId: string): TenantProviderConfig | undefined {
    return this.tenantConfigs.get(tenantId);
  }

  /**
   * Remove tenant configuration
   */
  unregisterTenant(tenantId: string): void {
    this.tenantConfigs.delete(tenantId);
  }

  /**
   * Clear all cached provider instances
   * Useful for testing or when configurations change
   */
  clearCache(): void {
    this.initializedProviders.clear();
  }

  /**
   * Health check for all registered providers
   * Returns map of provider ID -> health status
   */
  async healthCheck(): Promise<
    Map<ProviderId, { healthy: boolean; error?: string }>
  > {
    const results = new Map<ProviderId, { healthy: boolean; error?: string }>();

    for (const [id, provider] of this.providers) {
      try {
        // Try to get available models as health check
        await provider.getAvailableModels();
        results.set(id, { healthy: true });
      } catch (error: any) {
        results.set(id, {
          healthy: false,
          error: error.message || 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Validate provider configuration
   */
  validateProviderConfig(
    config: ProviderConfig
  ): { valid: boolean; errors: string[] } {
    const providerId = config.type === 'azure' ? 'openai' : config.type;
    const provider = this.getProvider(providerId as ProviderId);

    if (!provider) {
      return {
        valid: false,
        errors: [`Unknown provider type: ${config.type}`],
      };
    }

    return provider.validateConfig(config);
  }

  // ==================== Private Methods ====================

  /**
   * Create a hash of provider configuration for caching
   */
  private hashConfig(config: ProviderConfig): string {
    // Simple hash based on config properties
    // In production, use a proper hashing function
    const parts = [
      config.type,
      config.endpoint || '',
      config.defaultModel,
      config.apiKey?.slice(-8) || '', // Last 8 chars of API key for uniqueness
    ];

    return parts.join(':');
  }
}

/**
 * Global provider registry instance
 */
export const providerRegistry = new ProviderRegistry();

/**
 * Convenience function to get provider for tenant
 */
export async function getProviderForTenant(
  tenantId: string
): Promise<LLMProvider> {
  return providerRegistry.getProviderForTenant(tenantId);
}

/**
 * Convenience function to initialize provider from config
 */
export async function initializeProvider(
  config: ProviderConfig
): Promise<LLMProvider> {
  return providerRegistry.initializeProvider(config);
}

/**
 * Convenience function to register tenant
 */
export function registerTenant(config: TenantProviderConfig): void {
  providerRegistry.registerTenant(config);
}

/**
 * Convenience function to validate provider config
 */
export function validateProviderConfig(
  config: ProviderConfig
): { valid: boolean; errors: string[] } {
  return providerRegistry.validateProviderConfig(config);
}
