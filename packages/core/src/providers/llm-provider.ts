/**
 * LLM Provider Abstraction
 *
 * Provides a unified interface for multiple LLM providers:
 * - OpenAI (including Azure OpenAI)
 * - Anthropic (Claude API)
 * - AWS Bedrock
 * - Ollama (local models)
 * - Google Gemini
 *
 * This abstraction enables:
 * 1. Multi-provider support in MCP server
 * 2. Provider switching based on tenant configuration
 * 3. Cost tracking across different providers
 * 4. Unified error handling and retry logic
 */

/**
 * Message format (OpenAI-compatible structure)
 */
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * LLM completion request parameters
 */
export interface LLMCompletionRequest {
  /** Array of messages forming the conversation history */
  messages: LLMMessage[];

  /** Model identifier (provider-specific, e.g., "gpt-4", "claude-3-5-sonnet-20241022") */
  model: string;

  /** Maximum tokens to generate (optional, provider default if not specified) */
  maxTokens?: number;

  /** Temperature for sampling (0.0 - 2.0, default: provider-specific) */
  temperature?: number;

  /** Top-p nucleus sampling (0.0 - 1.0, default: provider-specific) */
  topP?: number;

  /** Stop sequences (optional) */
  stop?: string[];

  /** Whether to stream responses (default: false) */
  stream?: boolean;
}

/**
 * Token usage statistics
 */
export interface TokenUsage {
  /** Tokens in the prompt */
  promptTokens: number;

  /** Tokens in the completion */
  completionTokens: number;

  /** Total tokens used */
  totalTokens: number;
}

/**
 * LLM completion response
 */
export interface LLMCompletionResponse {
  /** Generated text */
  content: string;

  /** Token usage statistics */
  usage: TokenUsage;

  /** Model used for the completion */
  model: string;

  /** Provider-specific finish reason (e.g., "stop", "length", "content_filter") */
  finishReason: string;

  /** Provider-specific metadata (optional) */
  metadata?: Record<string, any>;
}

/**
 * Provider configuration (base interface)
 */
export interface ProviderConfig {
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

/**
 * Azure OpenAI specific configuration
 */
export interface AzureProviderConfig extends ProviderConfig {
  type: 'azure';

  /** Azure API version (e.g., "2024-02-15-preview") */
  apiVersion: string;

  /** Azure deployment name */
  deploymentName: string;

  /** Azure resource name */
  resourceName: string;
}

/**
 * AWS Bedrock specific configuration
 */
export interface BedrockProviderConfig extends ProviderConfig {
  type: 'bedrock';

  /** AWS region (e.g., "us-east-1") */
  region: string;

  /** AWS access key ID */
  accessKeyId?: string;

  /** AWS secret access key */
  secretAccessKey?: string;

  /** AWS session token (for temporary credentials) */
  sessionToken?: string;
}

/**
 * Base LLM Provider interface
 * All provider implementations must implement this interface
 */
export interface LLMProvider {
  /** Provider identifier (e.g., "openai", "anthropic") */
  readonly id: string;

  /** Display name (e.g., "OpenAI", "Anthropic Claude") */
  readonly displayName: string;

  /**
   * Initialize the provider with configuration
   * @param config - Provider configuration
   */
  initialize(config: ProviderConfig): Promise<void>;

  /**
   * Generate a completion from the LLM
   * @param request - Completion request parameters
   * @returns Completion response with generated text and metadata
   */
  complete(request: LLMCompletionRequest): Promise<LLMCompletionResponse>;

  /**
   * Stream a completion from the LLM
   * @param request - Completion request parameters
   * @param onChunk - Callback for each streamed chunk
   * @returns Final completion response after streaming completes
   */
  streamComplete(
    request: LLMCompletionRequest,
    onChunk: (chunk: string) => void
  ): Promise<LLMCompletionResponse>;

  /**
   * Validate configuration
   * @param config - Provider configuration to validate
   * @returns Validation result with any errors
   */
  validateConfig(config: ProviderConfig): {
    valid: boolean;
    errors: string[];
  };

  /**
   * Get available models for this provider
   * @returns Array of model identifiers
   */
  getAvailableModels(): Promise<string[]>;

  /**
   * Calculate estimated cost for a completion
   * @param usage - Token usage statistics
   * @param model - Model identifier
   * @returns Estimated cost in USD
   */
  estimateCost(usage: TokenUsage, model: string): number;
}

/**
 * Provider initialization error
 */
export class ProviderInitError extends Error {
  constructor(
    public readonly providerId: string,
    message: string,
    public readonly cause?: Error
  ) {
    super(`Provider ${providerId} initialization failed: ${message}`);
    this.name = 'ProviderInitError';
  }
}

/**
 * Provider completion error
 */
export class ProviderCompletionError extends Error {
  constructor(
    public readonly providerId: string,
    message: string,
    public readonly statusCode?: number,
    public readonly cause?: Error
  ) {
    super(`Provider ${providerId} completion failed: ${message}`);
    this.name = 'ProviderCompletionError';
  }
}

/**
 * Provider rate limit error
 */
export class ProviderRateLimitError extends ProviderCompletionError {
  constructor(
    providerId: string,
    public readonly retryAfter?: number,
    cause?: Error
  ) {
    super(
      providerId,
      `Rate limit exceeded${retryAfter ? `, retry after ${retryAfter}s` : ''}`,
      429,
      cause
    );
    this.name = 'ProviderRateLimitError';
  }
}

/**
 * Provider authentication error
 */
export class ProviderAuthError extends ProviderCompletionError {
  constructor(providerId: string, cause?: Error) {
    super(providerId, 'Authentication failed - check API key', 401, cause);
    this.name = 'ProviderAuthError';
  }
}
