import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface DetectedTool {
  id: string;
  name: string;
  type: 'extension' | 'cli';
  detected: boolean;
  version?: string;
  description?: string;
  installUrl?: string;
  docsUrl?: string;
}

export type ProgressCallback = (message: string, increment?: number) => void;

// Cache with TTL
interface ToolCache {
  data: DetectedTool[];
  timestamp: number;
}

let toolsCache: ToolCache | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Detect tools with caching (synchronous, uses cache if available)
 */
export function detectTools(): DetectedTool[] {
  const now = Date.now();

  if (toolsCache && (now - toolsCache.timestamp) < CACHE_TTL) {
    return toolsCache.data;
  }

  // If cache is stale/missing, return empty array and trigger async detection
  // This prevents blocking the UI
  if (!toolsCache) {
    // Return empty array on first call, caller should use detectToolsAsync
    return [];
  }

  return toolsCache.data;
}

/**
 * Detect tools asynchronously with progress reporting
 */
export async function detectToolsAsync(
  progress?: ProgressCallback
): Promise<DetectedTool[]> {
  const tools: DetectedTool[] = [];

  progress?.('Detecting VS Code extensions...', 20);

  // Detect VS Code extensions (fast, synchronous)
  const copilotChat = detectExtension('GitHub.copilot-chat', 'GitHub Copilot Chat', {
    description: 'AI pair programmer from GitHub',
    docsUrl: 'https://docs.github.com/copilot'
  });
  const copilotLegacy = detectExtension('GitHub.copilot', 'GitHub Copilot (Legacy)');

  tools.push(copilotChat);

  if (copilotLegacy.detected && !copilotChat.detected) {
    tools.push({
      ...copilotLegacy,
      name: 'GitHub Copilot (Deprecated - Install Chat)',
    });
  }

  tools.push(detectExtension('continue.continue', 'Continue.dev', {
    description: 'Open-source AI code assistant',
    installUrl: 'vscode:extension/continue.continue',
    docsUrl: 'https://continue.dev/docs'
  }));

  tools.push(detectExtension('saoudrizwan.claude-dev', 'Cline', {
    description: 'Claude-powered autonomous coding agent',
    installUrl: 'vscode:extension/saoudrizwan.claude-dev',
    docsUrl: 'https://github.com/saoudrizwan/claude-dev'
  }));

  tools.push(detectExtension('Windsurf.windsurf', 'Windsurf', {
    description: 'AI-powered code editor',
    installUrl: 'vscode:extension/Windsurf.windsurf'
  }));

  tools.push(detectExtension('RooVetGit.roo-cline', 'Roo Code', {
    description: 'AI coding assistant',
    installUrl: 'vscode:extension/RooVetGit.roo-cline'
  }));

  progress?.('Scanning for CLI tools...', 40);

  // Detect CLI tools (slow, async)
  const claudeCLI = await detectCLIAsync('claude', 'Claude CLI', {
    description: 'Official Anthropic Claude CLI',
    installUrl: 'https://github.com/anthropics/anthropic-quickstarts',
    docsUrl: 'https://docs.anthropic.com/claude/docs'
  });
  tools.push(claudeCLI);

  progress?.('Checking additional tools...', 20);

  const geminiCLI = await detectCLIMultipleAsync(
    ['gemini', 'gemini-cli', 'gcloud', 'google-gemini'],
    'Gemini CLI',
    {
      description: 'Google Gemini CLI tool',
      installUrl: 'https://ai.google.dev/gemini-api/docs/quickstart',
      docsUrl: 'https://ai.google.dev/gemini-api/docs'
    }
  );
  tools.push(geminiCLI);

  progress?.('Detection complete', 20);

  // Update cache
  toolsCache = {
    data: tools,
    timestamp: Date.now()
  };

  return tools;
}

/**
 * Force refresh cache
 */
export async function refreshToolCache(progress?: ProgressCallback): Promise<DetectedTool[]> {
  toolsCache = null;
  return detectToolsAsync(progress);
}

/**
 * Get cached tools or empty array
 */
export function getCachedTools(): DetectedTool[] {
  return toolsCache?.data ?? [];
}

interface ToolMetadata {
  description?: string;
  installUrl?: string;
  docsUrl?: string;
}

function detectExtension(
  extensionId: string,
  name: string,
  metadata?: ToolMetadata
): DetectedTool {
  const extension = vscode.extensions.getExtension(extensionId);

  return {
    id: extensionId,
    name,
    type: 'extension',
    detected: !!extension,
    version: extension?.packageJSON?.version,
    ...metadata
  };
}

async function detectCLIAsync(
  command: string,
  name: string,
  metadata?: ToolMetadata
): Promise<DetectedTool> {
  try {
    const { stdout } = await execAsync(`${command} --version`, {
      timeout: 3000,
      encoding: 'utf-8'
    });

    return {
      id: command,
      name,
      type: 'cli',
      detected: true,
      version: stdout.trim(),
      ...metadata
    };
  } catch {
    return {
      id: command,
      name,
      type: 'cli',
      detected: false,
      ...metadata
    };
  }
}

async function detectCLIMultipleAsync(
  commands: string[],
  name: string,
  metadata?: ToolMetadata
): Promise<DetectedTool> {
  for (const command of commands) {
    try {
      console.log(`[Tool Detector] Trying ${command} --version`);

      const { stdout, stderr } = await execAsync(`${command} --version`, {
        timeout: 5000,  // Increased timeout for Windows compatibility
        encoding: 'utf-8',
        shell: true     // Use shell for better Windows compatibility
      });

      console.log(`[Tool Detector] ${command} detected: ${stdout.trim()}`);

      return {
        id: command,
        name,
        type: 'cli',
        detected: true,
        version: stdout.trim(),
        ...metadata
      };
    } catch (error) {
      console.log(`[Tool Detector] ${command} failed:`, (error as Error).message);
      // Try next command
    }
  }

  // None worked
  console.log(`[Tool Detector] ${name} not found, tried:`, commands);
  return {
    id: commands[0],
    name,
    type: 'cli',
    detected: false,
    ...metadata
  };
}

export function getDetectedToolIds(tools: DetectedTool[]): string[] {
  return tools.filter(t => t.detected).map(t => t.id);
}

/**
 * Get tools count by type and status
 */
export function getToolsStats(tools: DetectedTool[]): {
  total: number;
  detected: number;
  extensions: { total: number; detected: number };
  cli: { total: number; detected: number };
} {
  const extensions = tools.filter(t => t.type === 'extension');
  const cliTools = tools.filter(t => t.type === 'cli');

  return {
    total: tools.length,
    detected: tools.filter(t => t.detected).length,
    extensions: {
      total: extensions.length,
      detected: extensions.filter(t => t.detected).length
    },
    cli: {
      total: cliTools.length,
      detected: cliTools.filter(t => t.detected).length
    }
  };
}
