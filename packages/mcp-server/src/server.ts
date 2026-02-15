/**
 * Deep Process MCP Server
 *
 * Exposes Deep Process workflows as MCP tools, resources, and prompts.
 * Compatible with Claude Desktop, Azure AI Foundry, LiteLLM, and other MCP-compatible platforms.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {
  loadAllManifests,
  executeWorkflow,
  initializeProvider,
  type ProcessManifest,
  type ExecutionContext,
  type LLMProvider,
} from '@deep-process/core';

import { generateToolDefinitions } from './tools.js';
import { generateResourceDefinitions, readResource } from './resources.js';
import { generatePromptDefinitions, getPrompt } from './prompts.js';

/**
 * MCP Server Configuration
 */
export interface McpServerConfig {
  /** Server name (displayed in MCP clients) */
  name: string;
  /** Server version */
  version: string;
  /** LLM provider configuration */
  provider: {
    type: 'openai' | 'anthropic' | 'azure-openai' | 'bedrock' | 'ollama';
    apiKey?: string;
    endpoint?: string;
    defaultModel?: string;
  };
  /** Process directory (defaults to ./processes) */
  processesDir?: string;
}

/**
 * Deep Process MCP Server
 *
 * Implements the Model Context Protocol to expose Deep Process workflows
 * as tools, resources, and prompts.
 */
export class DeepProcessMcpServer {
  private server: Server;
  private config: McpServerConfig;
  private manifests: Map<string, ProcessManifest> = new Map();
  private provider: LLMProvider | null = null;

  constructor(config: McpServerConfig) {
    this.config = config;

    // Create MCP server instance
    this.server = new Server(
      {
        name: config.name,
        version: config.version,
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    // Set up error handling
    this.server.onerror = (error) => {
      console.error('[MCP Server Error]', error);
    };

    // Register handlers
    this.setupHandlers();
  }

  /**
   * Initialize the server
   * - Load all process manifests
   * - Initialize LLM provider
   */
  async initialize(): Promise<void> {
    console.error('[MCP Server] Initializing Deep Process MCP Server...');

    // Load all process manifests
    try {
      const manifestsList = await loadAllManifests();
      for (const manifest of manifestsList) {
        this.manifests.set(manifest.id, manifest);
      }
      console.error(`[MCP Server] Loaded ${this.manifests.size} process manifests`);
    } catch (error) {
      console.error('[MCP Server] Error loading manifests:', error);
      throw error;
    }

    // Initialize LLM provider
    try {
      this.provider = await initializeProvider(this.config.provider);
      console.error(`[MCP Server] Initialized LLM provider: ${this.provider.displayName}`);
    } catch (error) {
      console.error('[MCP Server] Error initializing provider:', error);
      throw error;
    }

    console.error('[MCP Server] Initialization complete');
  }

  /**
   * Set up MCP protocol handlers
   */
  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = generateToolDefinitions(Array.from(this.manifests.values()));
      return { tools };
    });

    // Execute a tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      console.error(`[MCP Server] Executing tool: ${name}`);
      console.error(`[MCP Server] Arguments:`, JSON.stringify(args, null, 2));

      // Extract process ID from tool name (e.g., "deep-verify" from "deep-process:deep-verify")
      const processId = name.replace('deep-process:', '');
      const manifest = this.manifests.get(processId);

      if (!manifest) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: Process '${processId}' not found`,
            },
          ],
          isError: true,
        };
      }

      if (!this.provider) {
        return {
          content: [
            {
              type: 'text',
              text: 'Error: LLM provider not initialized',
            },
          ],
          isError: true,
        };
      }

      try {
        // Extract arguments
        const userInput = (args as any).input || (args as any).userInput || '';
        const depth = (args as any).depth || 'standard';
        const contextFiles = (args as any).contextFiles || [];

        // Prepare execution context
        const context: ExecutionContext = {
          processId: manifest.id,
          processDir: `processes/${manifest.id}`,
          userInput,
          depth: depth as 'quick' | 'standard' | 'comprehensive' | 'critical',
          crisisMode: false,
        };

        // Execute workflow
        const result = await executeWorkflow(manifest, context, this.provider, {
          onStepStart: (stepId, stepName) => {
            console.error(`[MCP Server] Step started: ${stepId} (${stepName})`);
          },
          onStepComplete: (stepResult) => {
            const status = stepResult.success ? '✅' : '❌';
            console.error(
              `[MCP Server] Step completed: ${stepResult.stepName} ${status} (${stepResult.executionTime}ms)`
            );
          },
          onGateEvaluation: (gateResult) => {
            const status = gateResult.passed ? '✅' : '❌';
            console.error(`[MCP Server] Gate: ${gateResult.name} ${status}`);
          },
        });

        // Return result as MCP response
        if (result.success) {
          return {
            content: [
              {
                type: 'text',
                text: result.finalOutput,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: `Execution failed: ${result.error || 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      } catch (error: any) {
        console.error('[MCP Server] Tool execution error:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error executing workflow: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const resources = generateResourceDefinitions(Array.from(this.manifests.values()));
      return { resources };
    });

    // Read a resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      console.error(`[MCP Server] Reading resource: ${uri}`);

      try {
        const content = await readResource(uri, this.manifests);
        return {
          contents: [
            {
              uri,
              mimeType: 'text/plain',
              text: content,
            },
          ],
        };
      } catch (error: any) {
        return {
          contents: [
            {
              uri,
              mimeType: 'text/plain',
              text: `Error reading resource: ${error.message}`,
            },
          ],
        };
      }
    });

    // List available prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      const prompts = generatePromptDefinitions(Array.from(this.manifests.values()));
      return { prompts };
    });

    // Get a prompt
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      console.error(`[MCP Server] Getting prompt: ${name}`);

      try {
        const messages = await getPrompt(name, args || {}, this.manifests);
        return { messages };
      } catch (error: any) {
        throw new Error(`Error getting prompt: ${error.message}`);
      }
    });
  }

  /**
   * Start the MCP server with stdio transport
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('[MCP Server] Server started on stdio transport');
  }

  /**
   * Stop the MCP server
   */
  async stop(): Promise<void> {
    await this.server.close();
    console.error('[MCP Server] Server stopped');
  }
}

/**
 * Create and start an MCP server instance
 */
export async function createMcpServer(config: McpServerConfig): Promise<DeepProcessMcpServer> {
  const server = new DeepProcessMcpServer(config);
  await server.initialize();
  return server;
}
