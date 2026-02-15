#!/usr/bin/env node

/**
 * Deep Process MCP Server CLI
 *
 * Start the MCP server with stdio transport for Claude Desktop integration.
 *
 * Usage:
 *   npx deep-process-mcp
 *   npx deep-process-mcp --provider openai --model gpt-4o
 *   npx deep-process-mcp --provider ollama --endpoint http://localhost:11434
 */

import { createMcpServer, type McpServerConfig } from './server.js';
import { parseArgs } from 'node:util';

/**
 * Parse command line arguments
 */
function parseCliArgs(): McpServerConfig {
  const { values } = parseArgs({
    options: {
      provider: {
        type: 'string',
        short: 'p',
        default: 'ollama',
      },
      model: {
        type: 'string',
        short: 'm',
      },
      endpoint: {
        type: 'string',
        short: 'e',
      },
      'api-key': {
        type: 'string',
        short: 'k',
      },
      help: {
        type: 'boolean',
        short: 'h',
      },
    },
    strict: false,
  });

  if (values.help) {
    console.log(`
Deep Process MCP Server

Start an MCP server that exposes Deep Process workflows as tools, resources, and prompts.

Usage:
  npx deep-process-mcp [options]

Options:
  -p, --provider <type>      LLM provider (openai, anthropic, azure, bedrock, ollama, gemini)
                             Default: ollama

  -m, --model <name>         Default model name
                             Examples: gpt-4o, claude-3-5-sonnet, llama3

  -e, --endpoint <url>       API endpoint (for Ollama or Azure OpenAI)
                             Example: http://localhost:11434

  -k, --api-key <key>        API key (for OpenAI, Anthropic, Azure)
                             Can also use OPENAI_API_KEY, ANTHROPIC_API_KEY env vars

  -h, --help                 Show this help message

Examples:

  # Start with local Ollama (free, requires ollama running)
  npx deep-process-mcp

  # Start with OpenAI
  npx deep-process-mcp --provider openai --api-key sk-...

  # Start with Anthropic Claude
  npx deep-process-mcp --provider anthropic --api-key sk-ant-...

  # Start with Azure OpenAI
  npx deep-process-mcp --provider azure --endpoint https://your-resource.openai.azure.com

Environment Variables:
  OPENAI_API_KEY       OpenAI API key
  ANTHROPIC_API_KEY    Anthropic API key
  AZURE_OPENAI_KEY     Azure OpenAI API key

Configuration for Claude Desktop:

Add to ~/Library/Application Support/Claude/claude_desktop_config.json (macOS)
or %APPDATA%/Claude/claude_desktop_config.json (Windows):

{
  "mcpServers": {
    "deep-process": {
      "command": "npx",
      "args": ["deep-process-mcp"]
    }
  }
}

Then restart Claude Desktop and use Deep Process workflows in your conversations.
    `.trim());
    process.exit(0);
  }

  // Determine provider type
  const providerType = (values.provider as string) || 'ollama';
  if (!['openai', 'anthropic', 'azure', 'bedrock', 'ollama', 'gemini'].includes(providerType)) {
    console.error(`Error: Invalid provider type: ${providerType}`);
    console.error('Valid options: openai, anthropic, azure, bedrock, ollama, gemini');
    process.exit(1);
  }

  // Get API key from args or environment
  let apiKey = values['api-key'] as string | undefined;
  if (!apiKey) {
    if (providerType === 'openai' || providerType === 'azure') {
      apiKey = process.env.OPENAI_API_KEY;
    } else if (providerType === 'anthropic') {
      apiKey = process.env.ANTHROPIC_API_KEY;
    }
  }

  // Determine default model based on provider type
  let defaultModel = values.model as string | undefined;
  if (!defaultModel) {
    switch (providerType) {
      case 'openai':
      case 'azure':
        defaultModel = 'gpt-4o';
        break;
      case 'anthropic':
        defaultModel = 'claude-3-5-sonnet-20241022';
        break;
      case 'bedrock':
        defaultModel = 'anthropic.claude-3-5-sonnet-20241022-v2:0';
        break;
      case 'ollama':
        defaultModel = 'llama3';
        break;
      case 'gemini':
        defaultModel = 'gemini-pro';
        break;
      default:
        defaultModel = 'gpt-4o';
    }
  }

  // Construct config
  const config: McpServerConfig = {
    name: 'deep-process',
    version: '1.0.0',
    provider: {
      type: providerType as any,
      apiKey,
      endpoint: values.endpoint as string | undefined,
      defaultModel,
    },
  };

  return config;
}

/**
 * Main entry point
 */
async function main() {
  try {
    // Parse CLI arguments
    const config = parseCliArgs();

    // Log configuration (to stderr so it doesn't interfere with MCP stdio)
    console.error('═'.repeat(60));
    console.error('Deep Process MCP Server');
    console.error('═'.repeat(60));
    console.error(`Provider: ${config.provider.type}`);
    if (config.provider.defaultModel) {
      console.error(`Model: ${config.provider.defaultModel}`);
    }
    if (config.provider.endpoint) {
      console.error(`Endpoint: ${config.provider.endpoint}`);
    }
    console.error('═'.repeat(60));

    // Create and start server
    const server = await createMcpServer(config);
    await server.start();

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.error('\n[MCP Server] Received SIGINT, shutting down...');
      await server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.error('\n[MCP Server] Received SIGTERM, shutting down...');
      await server.stop();
      process.exit(0);
    });
  } catch (error: any) {
    console.error('[MCP Server] Fatal error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run main function
main();
