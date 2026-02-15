/**
 * Deep Process MCP Server
 *
 * Exposes Deep Process workflows as MCP tools, resources, and prompts.
 *
 * @packageDocumentation
 */

export { DeepProcessMcpServer, createMcpServer, type McpServerConfig } from './server.js';
export { generateToolDefinitions, getToolDescriptions, groupToolsByCategory, getToolExamples } from './tools.js';
export { generateResourceDefinitions, readResource, getResourceMetadata } from './resources.js';
export { generatePromptDefinitions, getPrompt, getPromptTemplates, validatePromptArguments } from './prompts.js';
