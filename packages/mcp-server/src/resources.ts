/**
 * MCP Resource Definitions
 *
 * Exposes Deep Process assets as MCP resources:
 * - Process list and details
 * - Pattern libraries
 * - Theoretical foundations
 * - Gate definitions
 */

import type { Resource } from '@modelcontextprotocol/sdk/types.js';
import type { ProcessManifest } from '@deep-process/core';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Generate MCP resource definitions
 */
export function generateResourceDefinitions(manifests: ProcessManifest[]): Resource[] {
  const resources: Resource[] = [];

  // Process list resource
  resources.push({
    uri: 'deep-process://processes',
    name: 'Deep Process - Process List',
    description: 'List of all available Deep Process workflows with descriptions',
    mimeType: 'application/json',
  });

  // Individual process resources
  for (const manifest of manifests) {
    resources.push({
      uri: `deep-process://process/${manifest.id}`,
      name: `${manifest.name} - Details`,
      description: `Detailed information about ${manifest.name}`,
      mimeType: 'application/json',
    });

    // Workflow resource
    resources.push({
      uri: `deep-process://process/${manifest.id}/workflow`,
      name: `${manifest.name} - Workflow`,
      description: `Complete workflow description for ${manifest.name}`,
      mimeType: 'text/markdown',
    });

    // Gates resource
    resources.push({
      uri: `deep-process://process/${manifest.id}/gates`,
      name: `${manifest.name} - Quality Gates`,
      description: `Quality gate definitions for ${manifest.name}`,
      mimeType: 'application/x-yaml',
    });
  }

  // Pattern libraries (for processes that have them)
  const processesWithPatterns = ['deep-risk', 'deep-architect', 'deep-feasibility'];
  for (const processId of processesWithPatterns) {
    resources.push({
      uri: `deep-process://patterns/${processId}`,
      name: `${processId} - Pattern Library`,
      description: `Industry-specific patterns and templates for ${processId}`,
      mimeType: 'application/json',
    });
  }

  // Theoretical foundations (for deep-risk)
  resources.push({
    uri: 'deep-process://foundations/deep-risk',
    name: 'Deep Risk - Theoretical Foundations',
    description: 'Six risk genesis sources and theoretical framework',
    mimeType: 'application/x-yaml',
  });

  return resources;
}

/**
 * Read a resource by URI
 */
export async function readResource(
  uri: string,
  manifests: Map<string, ProcessManifest>
): Promise<string> {
  // Parse URI
  const url = new URL(uri);
  const path = url.pathname;

  // Process list
  if (path === '/processes') {
    return JSON.stringify(
      {
        processes: Array.from(manifests.values()).map((m) => ({
          id: m.id,
          name: m.name,
          version: m.version,
          description: m.description,
          slashCommand: m.slashCommand,
        })),
      },
      null,
      2
    );
  }

  // Process details
  if (path.startsWith('/process/') && !path.includes('/workflow') && !path.includes('/gates')) {
    const processId = path.replace('/process/', '');
    const manifest = manifests.get(processId);
    if (!manifest) {
      throw new Error(`Process ${processId} not found`);
    }

    return JSON.stringify(
      {
        id: manifest.id,
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        workflowFile: manifest.workflowFile,
        firstStepFile: manifest.firstStepFile,
        agentName: manifest.agentName,
        slashCommand: manifest.slashCommand,
      },
      null,
      2
    );
  }

  // Workflow
  if (path.includes('/workflow')) {
    const processId = path.replace('/process/', '').replace('/workflow', '');
    const workflowPath = join('processes', processId, 'workflow.md');

    if (!existsSync(workflowPath)) {
      throw new Error(`Workflow file not found for ${processId}`);
    }

    return readFileSync(workflowPath, 'utf-8');
  }

  // Gates
  if (path.includes('/gates')) {
    const processId = path.replace('/process/', '').replace('/gates', '');
    let gatesPath = join('processes', processId, 'gates.yaml');

    // Try data/gates.yaml if gates.yaml doesn't exist
    if (!existsSync(gatesPath)) {
      gatesPath = join('processes', processId, 'data', 'gates.yaml');
    }

    if (!existsSync(gatesPath)) {
      throw new Error(`Gates file not found for ${processId}`);
    }

    return readFileSync(gatesPath, 'utf-8');
  }

  // Pattern library
  if (path.startsWith('/patterns/')) {
    const processId = path.replace('/patterns/', '');
    const patternsPath = join('processes', processId, 'data', 'patterns');

    if (!existsSync(patternsPath)) {
      throw new Error(`Pattern library not found for ${processId}`);
    }

    // Read all pattern files
    const fs = await import('node:fs/promises');
    const files = await fs.readdir(patternsPath);
    const patterns: Record<string, string> = {};

    for (const file of files) {
      if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        const content = await fs.readFile(join(patternsPath, file), 'utf-8');
        patterns[file] = content;
      }
    }

    return JSON.stringify({ patterns }, null, 2);
  }

  // Theoretical foundations
  if (path.startsWith('/foundations/')) {
    const processId = path.replace('/foundations/', '');
    const foundationsPath = join('processes', processId, 'data', 'theoretical-foundations.yaml');

    if (!existsSync(foundationsPath)) {
      throw new Error(`Theoretical foundations not found for ${processId}`);
    }

    return readFileSync(foundationsPath, 'utf-8');
  }

  throw new Error(`Unknown resource URI: ${uri}`);
}

/**
 * Get resource usage statistics
 */
export interface ResourceAccessStats {
  uri: string;
  accessCount: number;
  lastAccessed: Date;
}

/**
 * Resource metadata helper
 */
export interface ResourceMetadata {
  uri: string;
  size: number;
  lastModified: Date;
  checksum: string;
}

/**
 * Get metadata for a resource
 */
export async function getResourceMetadata(uri: string): Promise<ResourceMetadata | null> {
  try {
    const url = new URL(uri);
    const path = url.pathname;

    // Determine file path
    let filePath: string | null = null;

    if (path.includes('/workflow')) {
      const processId = path.replace('/process/', '').replace('/workflow', '');
      filePath = join('processes', processId, 'workflow.md');
    } else if (path.includes('/gates')) {
      const processId = path.replace('/process/', '').replace('/gates', '');
      filePath = join('processes', processId, 'gates.yaml');
      if (!existsSync(filePath)) {
        filePath = join('processes', processId, 'data', 'gates.yaml');
      }
    }

    if (!filePath || !existsSync(filePath)) {
      return null;
    }

    const fs = await import('node:fs/promises');
    const crypto = await import('node:crypto');
    const stats = await fs.stat(filePath);
    const content = await fs.readFile(filePath);
    const checksum = crypto.createHash('sha256').update(content).digest('hex');

    return {
      uri,
      size: stats.size,
      lastModified: stats.mtime,
      checksum,
    };
  } catch (error) {
    return null;
  }
}
