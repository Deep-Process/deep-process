import * as vscode from 'vscode';
import * as path from 'path';
import type { ProcessManifest } from '@deep-process/core';

export interface WorkflowContext {
  manifest: ProcessManifest;
  processDir: string;
  workflowContent: string;
  firstStepContent: string;
}

/**
 * Load workflow files for a process
 */
export async function loadWorkflowFiles(
  processDir: string,
  manifest: ProcessManifest
): Promise<WorkflowContext> {
  const workflowPath = path.join(processDir, manifest.workflowFile);
  const firstStepPath = path.join(processDir, manifest.firstStepFile);

  const [workflowContent, firstStepContent] = await Promise.all([
    readTextFile(workflowPath),
    readTextFile(firstStepPath)
  ]);

  return {
    manifest,
    processDir,
    workflowContent,
    firstStepContent
  };
}

/**
 * Load a specific step file by name
 */
export async function loadStepFile(
  processDir: string,
  stepFileName: string
): Promise<string> {
  const stepPath = path.join(processDir, stepFileName);
  return readTextFile(stepPath);
}

/**
 * Load all step files in the steps/ directory
 */
export async function loadAllSteps(processDir: string): Promise<Map<string, string>> {
  const stepsDir = path.join(processDir, 'steps');
  const stepFiles = new Map<string, string>();

  try {
    const stepsDirUri = vscode.Uri.file(stepsDir);
    const entries = await vscode.workspace.fs.readDirectory(stepsDirUri);

    for (const [name, type] of entries) {
      if (type === vscode.FileType.File && name.endsWith('.md')) {
        const content = await loadStepFile(processDir, `steps/${name}`);
        stepFiles.set(name, content);
      }
    }
  } catch (error) {
    console.error('Failed to load steps directory:', error);
  }

  return stepFiles;
}

/**
 * Format workflow content for chat display
 */
export function formatWorkflowForChat(
  context: WorkflowContext,
  maxLength: number = 3000
): string {
  let output = '';

  output += `# 🚀 ${context.manifest.name}\n\n`;
  output += `${context.manifest.description}\n\n`;
  output += `---\n\n`;

  // Agent instructions
  output += `## Your Mission\n\n`;
  output += `You are the **${context.manifest.agentName}**.\n\n`;

  if (context.manifest.agentInstruction) {
    output += `**Special Instructions:** ${context.manifest.agentInstruction}\n\n`;
  }

  // Execution protocol
  output += `## Execution Protocol\n\n`;
  output += `1. **Read the Master Workflow** below to understand the complete protocol.\n`;
  output += `2. **Start at ${context.manifest.firstStepLabel}** in the first step section.\n`;
  output += `3. **Execute each step** exactly as defined in the workflow files.\n`;
  output += `4. **Follow all gates and checkpoints** — do not skip phases.\n\n`;
  output += `---\n\n`;

  // Master workflow (truncated if needed)
  output += `## 📋 Master Workflow\n\n`;
  output += '```markdown\n';
  const truncatedWorkflow = context.workflowContent.substring(0, maxLength);
  output += truncatedWorkflow;
  if (context.workflowContent.length > maxLength) {
    output += '\n\n... (workflow continues in process files)\n';
  }
  output += '```\n\n';

  return output;
}

/**
 * Format first step for chat display
 */
export function formatFirstStepForChat(
  context: WorkflowContext,
  maxLength: number = 2000
): string {
  let output = '';

  output += `## 🎯 ${context.manifest.firstStepLabel}: Getting Started\n\n`;
  output += '```markdown\n';
  const truncatedStep = context.firstStepContent.substring(0, maxLength);
  output += truncatedStep;
  if (context.firstStepContent.length > maxLength) {
    output += '\n\n... (step continues in process files)\n';
  }
  output += '```\n\n';

  return output;
}

/**
 * Read a text file from the file system
 */
async function readTextFile(filePath: string): Promise<string> {
  const uri = vscode.Uri.file(filePath);
  const data = await vscode.workspace.fs.readFile(uri);
  return Buffer.from(data).toString('utf-8');
}

/**
 * Check if a process is installed
 */
export function isProcessInstalled(
  config: any,
  processId: string
): boolean {
  return config?.processes?.[processId]?.installed === true;
}

/**
 * Get process directory path
 */
export function getProcessDir(
  projectRoot: string,
  processDir: string,
  processId: string
): string {
  return path.join(projectRoot, processDir, processId);
}
