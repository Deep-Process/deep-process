import path from 'node:path';
import type { ProcessManifest } from './process-registry.js';

export interface PathContext {
  scope: 'project' | 'global';
  processDir: string;   // e.g. '_deep-process' or custom name
  globalDir: string;    // e.g. ~/.deep-process
  projectRoot: string;  // absolute path to project root
}

/**
 * Resolve the base directory where processes are installed.
 */
export function resolveProcessBaseDir(ctx: PathContext): string {
  if (ctx.scope === 'global') {
    return ctx.globalDir;
  }
  return path.join(ctx.projectRoot, ctx.processDir);
}

/**
 * Build template variables for a given process.
 * These get substituted into command templates via {{var}}.
 */
export function buildTemplateVars(manifest: ProcessManifest, ctx: PathContext): Record<string, string> {
  const baseDir = ctx.scope === 'global'
    ? ctx.globalDir
    : ctx.processDir;

  const processPath = path.posix.join(baseDir, manifest.id);

  return {
    id: manifest.id,
    name: manifest.name,
    agentName: manifest.agentName,
    description: manifest.description,
    shortDescription: manifest.shortDescription,
    version: manifest.version,
    slashCommand: manifest.slashCommand,
    workflowPath: path.posix.join(processPath, manifest.workflowFile),
    firstStepPath: path.posix.join(processPath, manifest.firstStepFile),
    firstStepLabel: manifest.firstStepLabel,
    agentInstruction: manifest.agentInstruction,
    githubAgentTools: manifest.githubAgentTools.map(t => `  - ${t}`).join('\n'),
    args: '{{args}}',         // Gemini placeholder — kept literally
    input: '{{input}}',       // Cursor placeholder — kept literally
    tripleInput: '{{{ input }}}', // Continue.dev placeholder — kept literally
  };
}
