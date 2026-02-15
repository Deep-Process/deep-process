/**
 * MCP Prompt Definitions
 *
 * Exposes Deep Process workflows as parameterized MCP prompts.
 * Prompts provide pre-configured templates for common use cases.
 */

import type { Prompt, PromptMessage } from '@modelcontextprotocol/sdk/types.js';
import type { ProcessManifest } from '@deep-process/core';

/**
 * Generate MCP prompt definitions
 */
export function generatePromptDefinitions(manifests: ProcessManifest[]): Prompt[] {
  const prompts: Prompt[] = [];

  // Create prompts for each process
  for (const manifest of manifests) {
    prompts.push({
      name: `deep-process:${manifest.id}`,
      description: `Execute ${manifest.name} workflow with custom parameters`,
      arguments: [
        {
          name: 'input',
          description: 'The user request or context to analyze',
          required: true,
        },
        {
          name: 'depth',
          description: 'Execution depth (quick/standard/comprehensive/critical)',
          required: false,
        },
        {
          name: 'context',
          description: 'Additional context or constraints',
          required: false,
        },
      ],
    });
  }

  // Add specialized prompts for common scenarios
  prompts.push(
    {
      name: 'deep-process:quick-risk-check',
      description: 'Quick risk assessment for a new feature or change',
      arguments: [
        {
          name: 'feature',
          description: 'Description of the feature or change',
          required: true,
        },
        {
          name: 'timeline',
          description: 'Expected timeline',
          required: false,
        },
      ],
    },
    {
      name: 'deep-process:architecture-review',
      description: 'Comprehensive architecture review and recommendations',
      arguments: [
        {
          name: 'system',
          description: 'Description of the system to review',
          required: true,
        },
        {
          name: 'scale',
          description: 'Expected scale (users, transactions, data volume)',
          required: false,
        },
      ],
    },
    {
      name: 'deep-process:compliance-check',
      description: 'Regulatory compliance verification',
      arguments: [
        {
          name: 'regulation',
          description: 'Regulation to verify (GDPR, HIPAA, SOC2, etc.)',
          required: true,
        },
        {
          name: 'scope',
          description: 'Scope of compliance check',
          required: true,
        },
      ],
    }
  );

  return prompts;
}

/**
 * Get a prompt with arguments filled in
 */
export async function getPrompt(
  name: string,
  args: Record<string, string>,
  manifests: Map<string, ProcessManifest>
): Promise<PromptMessage[]> {
  // Handle specialized prompts
  if (name === 'deep-process:quick-risk-check') {
    const feature = args.feature || '';
    const timeline = args.timeline || 'Not specified';

    return [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Execute Deep Risk workflow with quick depth:

Feature/Change: ${feature}
Timeline: ${timeline}

Please perform a quick risk assessment focusing on:
1. Top 5-10 critical risks
2. Immediate mitigation actions
3. Go/no-go recommendation

Use the deep-risk process with depth=quick.`,
        },
      },
    ];
  }

  if (name === 'deep-process:architecture-review') {
    const system = args.system || '';
    const scale = args.scale || 'Not specified';

    return [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Execute Deep Architect workflow with comprehensive depth:

System: ${system}
Expected Scale: ${scale}

Please perform a comprehensive architecture review covering:
1. Structural patterns and anti-patterns
2. Scalability and performance considerations
3. Security architecture
4. Operational complexity
5. Technology stack recommendations

Use the deep-architect process with depth=comprehensive.`,
        },
      },
    ];
  }

  if (name === 'deep-process:compliance-check') {
    const regulation = args.regulation || '';
    const scope = args.scope || '';

    return [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Execute Deep Compliance workflow:

Regulation: ${regulation}
Scope: ${scope}

Please verify compliance focusing on:
1. Regulatory requirements mapping
2. Gap analysis
3. Risk assessment
4. Remediation recommendations
5. Documentation requirements

Use the deep-compliance process with depth=standard.`,
        },
      },
    ];
  }

  // Handle standard process prompts
  if (name.startsWith('deep-process:')) {
    const processId = name.replace('deep-process:', '');
    const manifest = manifests.get(processId);

    if (!manifest) {
      throw new Error(`Process ${processId} not found`);
    }

    const input = args.input || '';
    const depth = args.depth || 'standard';
    const context = args.context || '';

    let promptText = `Execute ${manifest.name} workflow:\n\n`;
    promptText += `Input: ${input}\n`;
    promptText += `Depth: ${depth}\n`;

    if (context) {
      promptText += `\nAdditional Context:\n${context}\n`;
    }

    promptText += `\nPlease execute the ${processId} process and provide structured results following the workflow steps.`;

    return [
      {
        role: 'user',
        content: {
          type: 'text',
          text: promptText,
        },
      },
    ];
  }

  throw new Error(`Unknown prompt: ${name}`);
}

/**
 * Get prompt templates for documentation
 */
export function getPromptTemplates(): Record<string, string> {
  return {
    'deep-process:quick-risk-check': `
**Quick Risk Check Template**

Use this prompt for rapid risk assessment of new features or changes.

Parameters:
- feature: Description of what you're building or changing
- timeline: Expected delivery timeline

Example:
\`\`\`json
{
  "feature": "Add payment gateway integration to SaaS product",
  "timeline": "2 weeks"
}
\`\`\`
    `.trim(),

    'deep-process:architecture-review': `
**Architecture Review Template**

Use this prompt for comprehensive architecture analysis.

Parameters:
- system: Description of the system architecture
- scale: Expected scale metrics (users, TPS, data volume)

Example:
\`\`\`json
{
  "system": "Microservices-based e-commerce platform with 12 services",
  "scale": "1M users, 10K orders/day, 5TB data"
}
\`\`\`
    `.trim(),

    'deep-process:compliance-check': `
**Compliance Check Template**

Use this prompt for regulatory compliance verification.

Parameters:
- regulation: Target regulation (GDPR, HIPAA, SOC2, ISO27001, NIS2, etc.)
- scope: Scope of compliance check

Example:
\`\`\`json
{
  "regulation": "GDPR",
  "scope": "Customer data processing for marketing automation"
}
\`\`\`
    `.trim(),
  };
}

/**
 * Validate prompt arguments
 */
export function validatePromptArguments(
  name: string,
  args: Record<string, string>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (name === 'deep-process:quick-risk-check') {
    if (!args.feature) {
      errors.push('Missing required argument: feature');
    }
  } else if (name === 'deep-process:architecture-review') {
    if (!args.system) {
      errors.push('Missing required argument: system');
    }
  } else if (name === 'deep-process:compliance-check') {
    if (!args.regulation) {
      errors.push('Missing required argument: regulation');
    }
    if (!args.scope) {
      errors.push('Missing required argument: scope');
    }
  } else if (name.startsWith('deep-process:')) {
    if (!args.input) {
      errors.push('Missing required argument: input');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
