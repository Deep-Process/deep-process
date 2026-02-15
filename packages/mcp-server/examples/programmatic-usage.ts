/**
 * MCP Server - Programmatic Usage Examples
 *
 * Demonstrates how to use the MCP server programmatically (not via CLI).
 */

import { createMcpServer, type McpServerConfig } from '../src/index.js';

/**
 * Example 1: Create MCP server with Ollama (local, free)
 */
async function example1_OllamaServer() {
  console.log('\n=== Example 1: MCP Server with Ollama ===\n');

  const config: McpServerConfig = {
    name: 'deep-process',
    version: '1.0.0',
    provider: {
      type: 'ollama',
      defaultModel: 'llama3',
      endpoint: 'http://localhost:11434',
    },
  };

  const server = await createMcpServer(config);

  console.log('Server created and initialized');
  console.log('Ready to handle MCP requests');

  // Note: In production, you would call server.start() to begin
  // listening on stdio transport for MCP requests from clients

  return server;
}

/**
 * Example 2: Create MCP server with OpenAI
 */
async function example2_OpenAIServer() {
  console.log('\n=== Example 2: MCP Server with OpenAI ===\n');

  const config: McpServerConfig = {
    name: 'deep-process',
    version: '1.0.0',
    provider: {
      type: 'openai',
      defaultModel: 'gpt-4o',
      apiKey: process.env.OPENAI_API_KEY || 'sk-...',
    },
  };

  const server = await createMcpServer(config);

  console.log('Server created with OpenAI provider');
  console.log('Default model: gpt-4o');

  return server;
}

/**
 * Example 3: Create MCP server with Anthropic Claude
 */
async function example3_AnthropicServer() {
  console.log('\n=== Example 3: MCP Server with Anthropic Claude ===\n');

  const config: McpServerConfig = {
    name: 'deep-process',
    version: '1.0.0',
    provider: {
      type: 'anthropic',
      defaultModel: 'claude-3-5-sonnet-20241022',
      apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-...',
    },
  };

  const server = await createMcpServer(config);

  console.log('Server created with Anthropic provider');
  console.log('Default model: Claude 3.5 Sonnet');

  return server;
}

/**
 * Example 4: Create MCP server with Azure OpenAI
 */
async function example4_AzureServer() {
  console.log('\n=== Example 4: MCP Server with Azure OpenAI ===\n');

  const config: McpServerConfig = {
    name: 'deep-process',
    version: '1.0.0',
    provider: {
      type: 'azure',
      defaultModel: 'gpt-4o',
      endpoint: 'https://your-resource.openai.azure.com',
      apiKey: process.env.AZURE_OPENAI_KEY || 'your-key',
    },
  };

  const server = await createMcpServer(config);

  console.log('Server created with Azure OpenAI provider');
  console.log('Endpoint:', config.provider.endpoint);

  return server;
}

/**
 * Example 5: Full Server Lifecycle
 */
async function example5_FullLifecycle() {
  console.log('\n=== Example 5: Full Server Lifecycle ===\n');

  // 1. Create server
  const config: McpServerConfig = {
    name: 'deep-process-demo',
    version: '1.0.0',
    provider: {
      type: 'ollama',
      defaultModel: 'llama3',
    },
  };

  console.log('Creating server...');
  const server = await createMcpServer(config);

  console.log('Server created successfully');

  // 2. Start server (stdio transport)
  console.log('Starting server on stdio transport...');
  // await server.start();  // Uncomment to actually start

  // 3. Handle graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down server...');
    await server.stop();
    console.log('Server stopped');
  };

  // Register shutdown handlers
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  console.log('Server lifecycle example complete');
  console.log('In production, the server would now be listening for MCP requests');
}

/**
 * Example 6: Testing Tool Definitions
 */
async function example6_ToolDefinitions() {
  console.log('\n=== Example 6: Testing Tool Definitions ===\n');

  const { generateToolDefinitions } = await import('../src/tools.js');
  const { loadAllManifests } = await import('@deep-process/core');

  // Load all process manifests
  const manifests = loadAllManifests();
  console.log(`Loaded ${manifests.length} process manifests`);

  // Generate MCP tool definitions
  const tools = generateToolDefinitions(manifests);
  console.log(`Generated ${tools.length} MCP tools`);

  // Show first tool as example
  console.log('\nExample tool:');
  console.log(JSON.stringify(tools[0], null, 2));
}

/**
 * Example 7: Testing Resource Definitions
 */
async function example7_ResourceDefinitions() {
  console.log('\n=== Example 7: Testing Resource Definitions ===\n');

  const { generateResourceDefinitions } = await import('../src/resources.js');
  const { loadAllManifests } = await import('@deep-process/core');

  // Load all process manifests
  const manifests = loadAllManifests();

  // Generate MCP resource definitions
  const resources = generateResourceDefinitions(manifests);
  console.log(`Generated ${resources.length} MCP resources`);

  // Show resource types
  const resourceTypes = new Set(resources.map((r) => r.uri.split('/')[2]));
  console.log('\nResource types:');
  for (const type of resourceTypes) {
    const count = resources.filter((r) => r.uri.split('/')[2] === type).length;
    console.log(`  - ${type}: ${count} resources`);
  }
}

/**
 * Example 8: Testing Prompt Definitions
 */
async function example8_PromptDefinitions() {
  console.log('\n=== Example 8: Testing Prompt Definitions ===\n');

  const { generatePromptDefinitions, getPrompt } = await import('../src/prompts.js');
  const { loadAllManifests } = await import('@deep-process/core');

  // Load all process manifests
  const manifests = loadAllManifests();
  const manifestMap = new Map(manifests.map((m) => [m.id, m]));

  // Generate MCP prompt definitions
  const prompts = generatePromptDefinitions(manifests);
  console.log(`Generated ${prompts.length} MCP prompts`);

  // Test getting a prompt
  console.log('\nExample: Quick Risk Check prompt');
  const messages = await getPrompt(
    'deep-process:quick-risk-check',
    {
      feature: 'Payment gateway integration',
      timeline: '2 weeks',
    },
    manifestMap
  );

  console.log('Prompt messages:');
  console.log(JSON.stringify(messages, null, 2));
}

/**
 * Run all examples
 */
async function main() {
  console.log('═'.repeat(60));
  console.log('Deep Process MCP Server - Programmatic Usage Examples');
  console.log('═'.repeat(60));

  try {
    // Note: Only running non-server-starting examples by default
    // Uncomment to run server examples (they won't actually start without server.start())

    // await example1_OllamaServer();
    // await example2_OpenAIServer();
    // await example3_AnthropicServer();
    // await example4_AzureServer();
    // await example5_FullLifecycle();

    await example6_ToolDefinitions();
    await example7_ResourceDefinitions();
    await example8_PromptDefinitions();

    console.log('\n' + '═'.repeat(60));
    console.log('✅ Examples completed');
    console.log('═'.repeat(60) + '\n');
  } catch (error) {
    console.error('\n❌ Error running examples:', error);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  example1_OllamaServer,
  example2_OpenAIServer,
  example3_AnthropicServer,
  example4_AzureServer,
  example5_FullLifecycle,
  example6_ToolDefinitions,
  example7_ResourceDefinitions,
  example8_PromptDefinitions,
};
