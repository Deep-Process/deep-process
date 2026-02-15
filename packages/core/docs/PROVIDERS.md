
# LLM Provider Abstraction Layer

**Status:** ✅ Phase 1, Milestone 1.1 - COMPLETE
**Version:** 1.0.0
**Date:** 2026-02-15

## Overview

The LLM Provider Abstraction Layer provides a unified interface for interacting with multiple LLM providers in Deep Process. This is the foundation for Phase 1 (MCP Integration) and enables multi-provider support, cost tracking, and flexible deployment options.

## Supported Providers

| Provider | Type ID | Status | Cost | Use Case |
|----------|---------|--------|------|----------|
| **OpenAI** | `openai` | ✅ Implemented | Paid | GPT-4, GPT-4o, GPT-3.5 models |
| **Azure OpenAI** | `azure` | ✅ Implemented | Paid | Enterprise deployments with Azure |
| **Anthropic** | `anthropic` | ✅ Implemented | Paid | Claude 3.5, Claude 4 models |
| **Ollama** | `ollama` | ✅ Implemented | Free | Local models (Llama, Mistral, etc.) |
| **AWS Bedrock** | `bedrock` | 🔜 Planned | Paid | AWS-native deployments |
| **Google Gemini** | `gemini` | 🔜 Planned | Paid | Gemini Pro models |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Deep Process Application                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Provider Registry                         │
│  - Provider initialization & caching                        │
│  - Tenant-based provider resolution                         │
│  - Health checks & failover                                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┬───────────────┐
        ▼               ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   OpenAI     │ │  Anthropic   │ │   Ollama     │ │    Azure     │
│   Provider   │ │   Provider   │ │   Provider   │ │   Provider   │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

## Quick Start

### 1. Basic Usage (OpenAI)

```typescript
import { initializeProvider } from '@deep-process/core';

const provider = await initializeProvider({
  type: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4o-mini',
});

const response = await provider.complete({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is Deep Process?' },
  ],
  model: 'gpt-4o-mini',
  maxTokens: 100,
});

console.log(response.content);
console.log('Cost:', provider.estimateCost(response.usage, response.model));
```

### 2. Streaming Responses (Anthropic)

```typescript
import { initializeProvider } from '@deep-process/core';

const provider = await initializeProvider({
  type: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: 'claude-3-5-sonnet-20241022',
});

const response = await provider.streamComplete(
  {
    messages: [
      { role: 'user', content: 'Explain Deep Process in one sentence.' },
    ],
    model: 'claude-3-5-sonnet-20241022',
  },
  (chunk) => {
    process.stdout.write(chunk); // Stream to console
  }
);
```

### 3. Local Models (Ollama)

```typescript
import { initializeProvider } from '@deep-process/core';

const provider = await initializeProvider({
  type: 'ollama',
  endpoint: 'http://localhost:11434',
  defaultModel: 'llama3',
});

const models = await provider.getAvailableModels();
console.log('Available models:', models);

const response = await provider.complete({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'llama3',
});

console.log(response.content);
console.log('Cost:', provider.estimateCost(response.usage, 'llama3')); // Always 0.00
```

### 4. Multi-Tenant Configuration

```typescript
import { registerTenant, getProviderForTenant } from '@deep-process/core';

// Register tenant with primary + fallback providers
registerTenant({
  tenantId: 'acme-corp',
  primary: {
    type: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    defaultModel: 'gpt-4o',
  },
  fallback: {
    type: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY,
    defaultModel: 'claude-3-5-haiku',
  },
  trackCost: true,
  tokenBudget: 1_000_000, // 1M tokens/month
  rateLimit: 100, // 100 requests/min
});

// Retrieve provider for tenant (auto-failover)
const provider = await getProviderForTenant('acme-corp');
```

## Configuration

### ProviderConfig Interface

```typescript
interface ProviderConfig {
  /** Provider type */
  type: 'openai' | 'anthropic' | 'azure' | 'bedrock' | 'ollama' | 'gemini';

  /** API key (for cloud providers) */
  apiKey?: string;

  /** API endpoint (for custom deployments) */
  endpoint?: string;

  /** Default model to use */
  defaultModel: string;

  /** Organization ID (optional, for multi-org accounts) */
  organization?: string;

  /** Request timeout in milliseconds (default: 60000) */
  timeout?: number;

  /** Maximum retries on failure (default: 3) */
  maxRetries?: number;

  /** Provider-specific configuration */
  extra?: Record<string, any>;
}
```

### Azure OpenAI Configuration

```typescript
const azureConfig = {
  type: 'azure',
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: '2024-02-15-preview',
  deploymentName: 'gpt-4-deployment',
  resourceName: 'my-resource',
  defaultModel: 'gpt-4',
};
```

### Deep Process Config Integration

Add provider configuration to `_deep-process/deep-process.config.yaml`:

```yaml
version: '1.0.0'
packageVersion: '1.1.4'

# ... existing configuration ...

# LLM Provider Configuration (Phase 1)
providers:
  default:
    type: openai
    defaultModel: gpt-4o-mini
    timeout: 30000
    maxRetries: 3
    # apiKey is read from OPENAI_API_KEY environment variable

  local:
    type: ollama
    endpoint: http://localhost:11434
    defaultModel: llama3

# MCP Server Settings (Phase 1)
mcp:
  enabled: true
  transport: stdio
```

## API Reference

### LLMProvider Interface

All providers implement this interface:

```typescript
interface LLMProvider {
  readonly id: string;
  readonly displayName: string;

  initialize(config: ProviderConfig): Promise<void>;
  complete(request: LLMCompletionRequest): Promise<LLMCompletionResponse>;
  streamComplete(
    request: LLMCompletionRequest,
    onChunk: (chunk: string) => void
  ): Promise<LLMCompletionResponse>;
  validateConfig(config: ProviderConfig): { valid: boolean; errors: string[] };
  getAvailableModels(): Promise<string[]>;
  estimateCost(usage: TokenUsage, model: string): number;
}
```

### LLMCompletionRequest

```typescript
interface LLMCompletionRequest {
  messages: LLMMessage[];
  model: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stop?: string[];
  stream?: boolean;
}

interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
```

### LLMCompletionResponse

```typescript
interface LLMCompletionResponse {
  content: string;
  usage: TokenUsage;
  model: string;
  finishReason: string;
  metadata?: Record<string, any>;
}

interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}
```

## Error Handling

```typescript
import {
  ProviderInitError,
  ProviderCompletionError,
  ProviderRateLimitError,
  ProviderAuthError,
} from '@deep-process/core';

try {
  const provider = await initializeProvider(config);
  const response = await provider.complete(request);
} catch (error) {
  if (error instanceof ProviderAuthError) {
    console.error('Invalid API key');
  } else if (error instanceof ProviderRateLimitError) {
    console.error('Rate limit exceeded, retry after:', error.retryAfter);
  } else if (error instanceof ProviderCompletionError) {
    console.error('Completion failed:', error.message);
  } else if (error instanceof ProviderInitError) {
    console.error('Provider initialization failed:', error.message);
  }
}
```

## Cost Estimation

Each provider implements accurate cost estimation based on official pricing:

```typescript
const provider = await initializeProvider({ ... });
const response = await provider.complete({ ... });

const costUSD = provider.estimateCost(response.usage, response.model);
console.log(`Cost: $${costUSD.toFixed(6)}`);
```

**Pricing (as of January 2025):**

| Provider | Model | Input (per 1M tokens) | Output (per 1M tokens) |
|----------|-------|----------------------|------------------------|
| OpenAI | gpt-4o | $2.50 | $10.00 |
| OpenAI | gpt-4o-mini | $0.15 | $0.60 |
| Anthropic | claude-3-5-sonnet | $3.00 | $15.00 |
| Anthropic | claude-3-5-haiku | $0.25 | $1.25 |
| Ollama | * (all models) | FREE | FREE |

## Health Checks

```typescript
import { providerRegistry } from '@deep-process/core';

const health = await providerRegistry.healthCheck();

for (const [providerId, status] of health) {
  console.log(`${providerId}: ${status.healthy ? '✅' : '❌'}`);
  if (!status.healthy) {
    console.log(`  Error: ${status.error}`);
  }
}
```

## Next Steps (Phase 1 Milestones)

- ✅ **Milestone 1.1:** Provider Abstraction - COMPLETE
- ⏳ **Milestone 1.2:** Gate Validation Engine (Week 2-3)
- ⏳ **Milestone 1.3:** Workflow Executor (Week 3-4)
- ⏳ **Milestone 1.4:** MCP Server Package (Week 5-8)
- ⏳ **Milestone 1.5:** Publishing & Integration (Week 9-12)

## Examples

See `packages/core/examples/provider-example.ts` for complete working examples.

## Testing

```bash
# Unit tests (coming in Milestone 1.1 completion)
cd packages/core
pnpm test

# Integration test with real providers
OPENAI_API_KEY=sk-xxx ANTHROPIC_API_KEY=sk-xxx pnpm test:integration
```

## Troubleshooting

### "Provider not initialized"

Call `initialize()` before using the provider:

```typescript
const provider = await initializeProvider(config);
```

### "Cannot connect to Ollama"

Ensure Ollama is running:

```bash
ollama serve
```

### "Rate limit exceeded"

The provider will automatically retry with exponential backoff. Configure retry settings:

```typescript
const config = {
  type: 'openai',
  maxRetries: 5, // Increase retries
  timeout: 120000, // Increase timeout
  // ...
};
```

### Azure OpenAI "deployment not found"

Verify deployment name matches Azure portal:

```typescript
const config = {
  type: 'azure',
  resourceName: 'my-openai-resource', // From Azure portal
  deploymentName: 'gpt-4-deployment', // From Azure portal
  apiVersion: '2024-02-15-preview',
  // ...
};
```

## License

MIT - See root LICENSE file

## Contributing

See root CONTRIBUTING.md for contribution guidelines.
