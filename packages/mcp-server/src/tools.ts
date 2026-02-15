/**
 * MCP Tool Definitions
 *
 * Generates MCP tool schemas from Deep Process manifests.
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ProcessManifest } from '@deep-process/core';

/**
 * Generate MCP tool definitions from process manifests
 *
 * Each Deep Process becomes an MCP tool with:
 * - Name: `deep-process:{processId}`
 * - Description: From manifest
 * - Input schema: JSON Schema for tool arguments
 */
export function generateToolDefinitions(manifests: ProcessManifest[]): Tool[] {
  return manifests.map((manifest) => ({
    name: `deep-process:${manifest.id}`,
    description: manifest.description,
    inputSchema: {
      type: 'object',
      properties: {
        input: {
          type: 'string',
          description: 'The user request or context to analyze',
        },
        depth: {
          type: 'string',
          description: 'Execution depth: quick (1-2h), standard (half day), comprehensive (1-2 days), or critical (deep audit)',
          enum: ['quick', 'standard', 'comprehensive', 'critical'],
          default: 'standard',
        },
        contextFiles: {
          type: 'array',
          description: 'Optional context files to include in the analysis',
          items: {
            type: 'string',
          },
          default: [],
        },
      },
      required: ['input'],
    },
  }));
}

/**
 * Get detailed tool descriptions for documentation
 */
export function getToolDescriptions(manifests: ProcessManifest[]): Record<string, string> {
  const descriptions: Record<string, string> = {};

  for (const manifest of manifests) {
    const toolName = `deep-process:${manifest.id}`;
    descriptions[toolName] = `
# ${manifest.name}

**Version:** ${manifest.version}

${manifest.description}

## Usage

\`\`\`
{
  "input": "Your request or context to analyze",
  "depth": "standard",
  "contextFiles": []
}
\`\`\`

## Execution Depths

- **quick**: 1-2 hours, top-level analysis
- **standard**: Half day, comprehensive analysis
- **comprehensive**: 1-2 days, deep analysis with all optional steps
- **critical**: Multi-day, includes stability analysis and META audit

## Output

The tool returns structured results including:
- YAML-formatted data blocks
- Markdown sections with analysis
- Assumptions and scope reductions
- Gate validation results
- Risk assessments (where applicable)

## Examples

### Quick Analysis

\`\`\`json
{
  "input": "Assess security risks for our cloud migration project",
  "depth": "quick"
}
\`\`\`

### Comprehensive Analysis with Context

\`\`\`json
{
  "input": "Detailed architecture review needed for microservices redesign",
  "depth": "comprehensive",
  "contextFiles": ["architecture-diagram.md", "api-specification.yaml"]
}
\`\`\`
    `.trim();
  }

  return descriptions;
}

/**
 * Group tools by category for better organization
 */
export function groupToolsByCategory(manifests: ProcessManifest[]): Record<string, ProcessManifest[]> {
  const groups: Record<string, ProcessManifest[]> = {
    'Analysis & Assessment': [],
    'Design & Planning': [],
    'Documentation': [],
    'Governance': [],
  };

  for (const manifest of manifests) {
    // Categorize based on process ID
    if (manifest.id.includes('risk') || manifest.id.includes('verify') || manifest.id.includes('feasibility')) {
      groups['Analysis & Assessment'].push(manifest);
    } else if (manifest.id.includes('architect') || manifest.id.includes('explore') || manifest.id.includes('synthesis')) {
      groups['Design & Planning'].push(manifest);
    } else if (manifest.id.includes('document') || manifest.id.includes('diagram')) {
      groups['Documentation'].push(manifest);
    } else if (manifest.id.includes('governance') || manifest.id.includes('compliance') || manifest.id.includes('challenge')) {
      groups['Governance'].push(manifest);
    } else {
      // Default to Analysis
      groups['Analysis & Assessment'].push(manifest);
    }
  }

  return groups;
}

/**
 * Generate tool usage statistics
 */
export interface ToolUsageStats {
  toolName: string;
  processId: string;
  totalExecutions: number;
  averageExecutionTime: number;
  successRate: number;
}

/**
 * Get example invocations for each tool
 */
export function getToolExamples(processId: string): Array<{ description: string; input: any }> {
  const examples: Record<string, Array<{ description: string; input: any }>> = {
    'deep-verify': [
      {
        description: 'Verify system architecture for cloud deployment',
        input: {
          input: 'Verify our microservices architecture is ready for AWS deployment. We have 12 services, PostgreSQL database, and Redis cache.',
          depth: 'standard',
        },
      },
      {
        description: 'Quick verification of API design',
        input: {
          input: 'Verify REST API design for user authentication service',
          depth: 'quick',
        },
      },
    ],
    'deep-risk': [
      {
        description: 'Comprehensive risk assessment for cloud migration',
        input: {
          input: 'Assess risks for migrating our monolithic e-commerce platform to microservices on Azure. 6-month timeline, $10M annual revenue at risk.',
          depth: 'comprehensive',
        },
      },
      {
        description: 'Quick risk check for new feature',
        input: {
          input: 'Quick risk assessment for adding payment gateway integration to our SaaS product',
          depth: 'quick',
        },
      },
    ],
    'deep-architect': [
      {
        description: 'Design scalable architecture for real-time analytics',
        input: {
          input: 'Design architecture for real-time analytics platform processing 1M events/second',
          depth: 'comprehensive',
        },
      },
    ],
    'deep-compliance': [
      {
        description: 'GDPR compliance verification for customer data processing',
        input: {
          input: 'Verify GDPR compliance for our customer data processing workflows. We handle EU customer data for marketing and sales.',
          depth: 'standard',
          contextFiles: ['data-flow-diagram.md'],
        },
      },
    ],
  };

  return examples[processId] || [
    {
      description: `Execute ${processId} workflow`,
      input: {
        input: 'Sample input for analysis',
        depth: 'standard',
      },
    },
  ];
}
