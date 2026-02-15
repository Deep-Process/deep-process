/**
 * Provider Abstraction Usage Example
 *
 * This example demonstrates how to use the LLM provider abstraction layer
 * for multi-provider support in Deep Process.
 */

import {
  providerRegistry,
  initializeProvider,
  registerTenant,
  getProviderForTenant,
  type ProviderConfig,
  type LLMCompletionRequest,
} from '../src/index.js';

/**
 * Example 1: Using OpenAI provider directly
 */
async function example1_OpenAI() {
  console.log('\n=== Example 1: OpenAI Provider ===');

  const config: ProviderConfig = {
    type: 'openai',
    apiKey: process.env.OPENAI_API_KEY || 'your-api-key',
    defaultModel: 'gpt-4o-mini',
    timeout: 30000,
    maxRetries: 3,
  };

  try {
    const provider = await initializeProvider(config);
    console.log(`Initialized: ${provider.displayName}`);

    const request: LLMCompletionRequest = {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'What is Deep Process?' },
      ],
      model: 'gpt-4o-mini',
      maxTokens: 100,
      temperature: 0.7,
    };

    const response = await provider.complete(request);
    console.log('Response:', response.content);
    console.log('Usage:', response.usage);
    console.log(
      'Cost:',
      provider.estimateCost(response.usage, response.model).toFixed(4),
      'USD'
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 2: Using Anthropic provider with streaming
 */
async function example2_Anthropic_Streaming() {
  console.log('\n=== Example 2: Anthropic Provider (Streaming) ===');

  const config: ProviderConfig = {
    type: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key',
    defaultModel: 'claude-3-5-sonnet-20241022',
  };

  try {
    const provider = await initializeProvider(config);
    console.log(`Initialized: ${provider.displayName}`);

    const request: LLMCompletionRequest = {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: 'Explain Deep Process in one sentence.',
        },
      ],
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 100,
    };

    console.log('Streaming response:');
    const response = await provider.streamComplete(request, (chunk) => {
      process.stdout.write(chunk);
    });

    console.log('\n\nUsage:', response.usage);
    console.log(
      'Cost:',
      provider.estimateCost(response.usage, response.model).toFixed(4),
      'USD'
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 3: Using Ollama for local models (free)
 */
async function example3_Ollama_Local() {
  console.log('\n=== Example 3: Ollama Provider (Local) ===');

  const config: ProviderConfig = {
    type: 'ollama',
    endpoint: 'http://localhost:11434',
    defaultModel: 'llama3',
  };

  try {
    const provider = await initializeProvider(config);
    console.log(`Initialized: ${provider.displayName}`);

    // Get available models
    const models = await provider.getAvailableModels();
    console.log('Available models:', models);

    const request: LLMCompletionRequest = {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello! How are you?' },
      ],
      model: 'llama3',
      maxTokens: 50,
    };

    const response = await provider.complete(request);
    console.log('Response:', response.content);
    console.log('Usage:', response.usage);
    console.log('Cost:', provider.estimateCost(response.usage, response.model), 'USD (FREE!)');
  } catch (error) {
    console.error('Error:', error);
    console.log('Make sure Ollama is running: ollama serve');
  }
}

/**
 * Example 4: Multi-tenant configuration with fallback
 */
async function example4_MultiTenant() {
  console.log('\n=== Example 4: Multi-Tenant Configuration ===');

  // Register tenant with primary and fallback providers
  registerTenant({
    tenantId: 'acme-corp',
    primary: {
      type: 'openai',
      apiKey: process.env.OPENAI_API_KEY || 'primary-key',
      defaultModel: 'gpt-4o',
    },
    fallback: {
      type: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY || 'fallback-key',
      defaultModel: 'claude-3-5-haiku',
    },
    trackCost: true,
    tokenBudget: 1_000_000, // 1M tokens per month
    rateLimit: 100, // 100 requests per minute
  });

  try {
    const provider = await getProviderForTenant('acme-corp');
    console.log(`Tenant "acme-corp" using: ${provider.displayName}`);

    const request: LLMCompletionRequest = {
      messages: [
        { role: 'user', content: 'Test message' },
      ],
      model: provider.id === 'openai' ? 'gpt-4o-mini' : 'claude-3-5-haiku',
      maxTokens: 50,
    };

    const response = await provider.complete(request);
    console.log('Response:', response.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 5: Provider validation
 */
async function example5_Validation() {
  console.log('\n=== Example 5: Provider Configuration Validation ===');

  const configs = [
    {
      type: 'openai' as const,
      defaultModel: 'gpt-4o-mini',
      // Missing apiKey - should fail
    },
    {
      type: 'azure' as const,
      apiKey: 'test-key',
      defaultModel: 'gpt-4',
      resourceName: 'my-resource',
      deploymentName: 'gpt-4-deployment',
      apiVersion: '2024-02-15-preview',
    },
    {
      type: 'anthropic' as const,
      apiKey: 'test-key',
      // Missing defaultModel - should fail
    },
  ];

  for (const config of configs) {
    const validation = providerRegistry.validateProviderConfig(config as ProviderConfig);
    console.log(`\nConfig type: ${config.type}`);
    console.log('Valid:', validation.valid);
    if (!validation.valid) {
      console.log('Errors:', validation.errors);
    }
  }
}

/**
 * Example 6: Health check
 */
async function example6_HealthCheck() {
  console.log('\n=== Example 6: Provider Health Check ===');

  const health = await providerRegistry.healthCheck();

  for (const [providerId, status] of health) {
    console.log(`${providerId}: ${status.healthy ? '✅ Healthy' : '❌ Unhealthy'}`);
    if (!status.healthy && status.error) {
      console.log(`  Error: ${status.error}`);
    }
  }
}

/**
 * Run all examples
 */
async function main() {
  console.log('Deep Process - LLM Provider Abstraction Examples');
  console.log('==============================================');

  // Note: These examples require API keys to be set in environment variables:
  // - OPENAI_API_KEY
  // - ANTHROPIC_API_KEY

  // Uncomment the examples you want to run:
  // await example1_OpenAI();
  // await example2_Anthropic_Streaming();
  // await example3_Ollama_Local();
  // await example4_MultiTenant();
  await example5_Validation();
  // await example6_HealthCheck();
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
