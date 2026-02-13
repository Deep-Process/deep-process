import type { ToolAdapter } from './base-adapter.js';
import { claudeAdapter } from './claude.js';
import { geminiAdapter } from './gemini.js';
import { cursorAdapter } from './cursor.js';
import { continueDevAdapter } from './continue-dev.js';
import { githubAgentsAdapter } from './github-agents.js';
import { agentsMdAdapter } from './agents-md.js';
import { clineAdapter } from './cline.js';
import { windsurfAdapter } from './windsurf.js';
import { rooCodeAdapter } from './roo-code.js';
import { copilotAdapter } from './copilot.js';
import { aiderAdapter } from './aider.js';

export type ToolId =
  | 'claude'
  | 'gemini'
  | 'cursor'
  | 'continue'
  | 'github-agents'
  | 'agents-md'
  | 'cline'
  | 'windsurf'
  | 'roo-code'
  | 'copilot'
  | 'aider';

const adapterRegistry = new Map<ToolId, ToolAdapter>([
  ['claude', claudeAdapter],
  ['gemini', geminiAdapter],
  ['cursor', cursorAdapter],
  ['continue', continueDevAdapter],
  ['github-agents', githubAgentsAdapter],
  ['agents-md', agentsMdAdapter],
  ['cline', clineAdapter],
  ['windsurf', windsurfAdapter],
  ['roo-code', rooCodeAdapter],
  ['copilot', copilotAdapter],
  ['aider', aiderAdapter],
]);

export function getAdapter(id: ToolId): ToolAdapter | undefined {
  return adapterRegistry.get(id);
}

export function getAllAdapters(): ToolAdapter[] {
  return Array.from(adapterRegistry.values());
}

export function getAdapterIds(): ToolId[] {
  return Array.from(adapterRegistry.keys());
}

export function isValidToolId(id: string): id is ToolId {
  return adapterRegistry.has(id as ToolId);
}

/**
 * Detect which tools are already in use in the project.
 */
export async function detectTools(root: string): Promise<ToolId[]> {
  const detected: ToolId[] = [];
  for (const [id, adapter] of adapterRegistry) {
    const result = await adapter.detect(root);
    if (result.detected) {
      detected.push(id);
    }
  }
  return detected;
}
