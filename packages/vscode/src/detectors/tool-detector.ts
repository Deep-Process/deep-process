import * as vscode from 'vscode';
import { execSync } from 'child_process';

export interface DetectedTool {
  id: string;
  name: string;
  type: 'extension' | 'cli';
  detected: boolean;
  version?: string;
}

export function detectTools(): DetectedTool[] {
  const tools: DetectedTool[] = [];

  // Detect VS Code extensions
  tools.push(detectExtension('GitHub.copilot', 'GitHub Copilot'));
  tools.push(detectExtension('GitHub.copilot-chat', 'GitHub Copilot Chat'));
  tools.push(detectExtension('continue.continue', 'Continue.dev'));
  tools.push(detectExtension('saoudrizwan.claude-dev', 'Cline'));
  tools.push(detectExtension('Windsurf.windsurf', 'Windsurf'));
  tools.push(detectExtension('RooVetGit.roo-cline', 'Roo Code'));

  // Detect CLI tools (try multiple command variations)
  tools.push(detectCLI('claude', 'Claude CLI'));
  tools.push(detectCLIMultiple(['gemini', 'gemini-cli', 'gcloud', 'google-gemini'], 'Gemini CLI'));

  return tools;
}

function detectExtension(extensionId: string, name: string): DetectedTool {
  const extension = vscode.extensions.getExtension(extensionId);

  return {
    id: extensionId,
    name,
    type: 'extension',
    detected: !!extension,
    version: extension?.packageJSON?.version
  };
}

function detectCLI(command: string, name: string): DetectedTool {
  try {
    const version = execSync(`${command} --version`, {
      encoding: 'utf-8',
      timeout: 3000,
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();

    return {
      id: command,
      name,
      type: 'cli',
      detected: true,
      version
    };
  } catch {
    return {
      id: command,
      name,
      type: 'cli',
      detected: false
    };
  }
}

function detectCLIMultiple(commands: string[], name: string): DetectedTool {
  for (const command of commands) {
    try {
      const version = execSync(`${command} --version`, {
        encoding: 'utf-8',
        timeout: 3000,
        stdio: ['pipe', 'pipe', 'ignore']
      }).trim();

      return {
        id: command,
        name,
        type: 'cli',
        detected: true,
        version
      };
    } catch {
      // Try next command
    }
  }

  // None worked
  return {
    id: commands[0],
    name,
    type: 'cli',
    detected: false
  };
}

export function getDetectedToolIds(tools: DetectedTool[]): string[] {
  return tools.filter(t => t.detected).map(t => t.id);
}
