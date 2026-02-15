/**
 * Output Collector
 *
 * Extracts structured data from LLM output for gate validation:
 * - Parses YAML blocks from LLM responses
 * - Extracts markdown sections
 * - Identifies assumptions, scope reductions
 * - Collects evidence for gate conditions
 */

import { parse as parseYaml } from 'yaml';

/**
 * Structured output data
 */
export interface CollectedOutput {
  /** Extracted YAML data blocks */
  yaml: Record<string, any>;

  /** Markdown sections by heading */
  sections: Record<string, string>;

  /** Declared assumptions */
  assumptions: string[];

  /** Scope reductions */
  scopeReductions: Array<{
    item: string;
    reason: string;
    impact: string;
  }>;

  /** Detected patterns (risk patterns, architecture patterns, etc.) */
  patterns: Array<{
    id: string;
    type: string;
    confidence?: number;
  }>;

  /** Checklists with pass/fail status */
  checklists: Array<{
    name: string;
    items: Array<{
      text: string;
      status: 'PASS' | 'FAIL' | 'SCOPE_REDUCED' | 'PENDING';
    }>;
  }>;

  /** Risk data (for deep-risk process) */
  risks?: Array<{
    id?: string;
    description: string;
    category?: string;
    severity?: string;
  }>;

  /** Metadata */
  metadata: {
    wordCount: number;
    sectionCount: number;
    yamlBlockCount: number;
  };
}

/**
 * Output Collector
 */
export class OutputCollector {
  /**
   * Collect structured data from LLM output
   */
  collect(rawOutput: string): CollectedOutput {
    const result: CollectedOutput = {
      yaml: {},
      sections: {},
      assumptions: [],
      scopeReductions: [],
      patterns: [],
      checklists: [],
      metadata: {
        wordCount: 0,
        sectionCount: 0,
        yamlBlockCount: 0,
      },
    };

    // Extract YAML blocks
    const yamlBlocks = this.extractYamlBlocks(rawOutput);
    result.metadata.yamlBlockCount = yamlBlocks.length;

    for (const [blockName, yamlContent] of yamlBlocks) {
      try {
        const parsed = parseYaml(yamlContent);
        result.yaml[blockName] = parsed;
      } catch (error) {
        console.warn(`Failed to parse YAML block "${blockName}":`, error);
      }
    }

    // Extract markdown sections
    result.sections = this.extractSections(rawOutput);
    result.metadata.sectionCount = Object.keys(result.sections).length;

    // Extract assumptions
    result.assumptions = this.extractAssumptions(rawOutput);

    // Extract scope reductions
    result.scopeReductions = this.extractScopeReductions(rawOutput);

    // Extract patterns
    result.patterns = this.extractPatterns(rawOutput);

    // Extract checklists
    result.checklists = this.extractChecklists(rawOutput);

    // Extract risks (for deep-risk process)
    result.risks = this.extractRisks(rawOutput);

    // Calculate metadata
    result.metadata.wordCount = rawOutput.split(/\s+/).length;

    return result;
  }

  /**
   * Extract YAML code blocks from markdown
   * Returns array of [blockName, yamlContent] tuples
   */
  private extractYamlBlocks(text: string): Array<[string, string]> {
    const blocks: Array<[string, string]> = [];
    const yamlBlockRegex = /```yaml\s*([\s\S]*?)```/gi;

    let match;
    let blockIndex = 0;

    while ((match = yamlBlockRegex.exec(text)) !== null) {
      const yamlContent = match[1].trim();

      // Try to infer block name from preceding heading or content
      const precedingText = text.slice(Math.max(0, match.index - 200), match.index);
      const headingMatch = precedingText.match(/#{1,6}\s+(.+?)$/m);
      const blockName = headingMatch
        ? headingMatch[1].trim().toLowerCase().replace(/\s+/g, '_')
        : `block_${blockIndex}`;

      blocks.push([blockName, yamlContent]);
      blockIndex++;
    }

    return blocks;
  }

  /**
   * Extract markdown sections by heading
   */
  private extractSections(text: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const lines = text.split('\n');

    let currentHeading: string | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

      if (headingMatch) {
        // Save previous section
        if (currentHeading) {
          sections[currentHeading] = currentContent.join('\n').trim();
        }

        // Start new section
        currentHeading = headingMatch[2].trim();
        currentContent = [];
      } else if (currentHeading) {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentHeading) {
      sections[currentHeading] = currentContent.join('\n').trim();
    }

    return sections;
  }

  /**
   * Extract declared assumptions
   */
  private extractAssumptions(text: string): string[] {
    const assumptions: string[] = [];

    // Look for "ASSUMPTIONS_DECLARED" section
    const assumptionsMatch = text.match(
      /ASSUMPTIONS_DECLARED[\s\S]*?```yaml\s*([\s\S]*?)```/i
    );

    if (assumptionsMatch) {
      try {
        const parsed = parseYaml(assumptionsMatch[1]);
        if (Array.isArray(parsed)) {
          assumptions.push(...parsed.map(String));
        } else if (parsed && typeof parsed === 'object') {
          assumptions.push(...Object.values(parsed).map(String));
        }
      } catch {
        // If YAML parsing fails, extract bullet points
        const bullets = assumptionsMatch[1].match(/^[\s-]*(.+)$/gm);
        if (bullets) {
          assumptions.push(...bullets.map((b) => b.replace(/^[\s-]*/, '').trim()));
        }
      }
    }

    // Also look for numbered/bulleted assumption lists
    const listMatch = text.match(/assumptions?:?\s*\n((?:[\s-]*\d+\.|[\s-]*[-*])\s*.+\n?)+/gi);
    if (listMatch) {
      for (const match of listMatch) {
        const items = match.match(/(?:^\s*\d+\.|^\s*[-*])\s*(.+)$/gm);
        if (items) {
          assumptions.push(...items.map((i) => i.replace(/^[\s\d.•\-*]+/, '').trim()));
        }
      }
    }

    // Remove duplicates
    return Array.from(new Set(assumptions));
  }

  /**
   * Extract scope reductions
   */
  private extractScopeReductions(text: string): Array<{
    item: string;
    reason: string;
    impact: string;
  }> {
    const reductions: Array<{ item: string; reason: string; impact: string }> = [];

    // Look for SCOPE_REDUCTION or SCOPE_REDUCED markers
    const reductionRegex = /SCOPE_REDUCTION(?:_DECLARED)?[\s\S]*?```yaml\s*([\s\S]*?)```/gi;

    let match;
    while ((match = reductionRegex.exec(text)) !== null) {
      try {
        const parsed = parseYaml(match[1]);
        if (Array.isArray(parsed)) {
          reductions.push(...parsed);
        } else if (parsed) {
          reductions.push(parsed);
        }
      } catch {
        // Ignore parse errors
      }
    }

    return reductions;
  }

  /**
   * Extract detected patterns
   */
  private extractPatterns(text: string): Array<{
    id: string;
    type: string;
    confidence?: number;
  }> {
    const patterns: Array<{ id: string; type: string; confidence?: number }> = [];

    // Look for pattern references (e.g., "AAP-001", "RP-005", "ARC-042")
    const patternRegex = /(AAP|RP|ARC|PAT)-(\d{3})/g;

    let match;
    while ((match = patternRegex.exec(text)) !== null) {
      const id = match[0];
      const type = match[1];

      // Try to extract confidence score if nearby
      const context = text.slice(match.index, match.index + 200);
      const confidenceMatch = context.match(/confidence[:\s]*([0-9.]+)/i);
      const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : undefined;

      patterns.push({
        id,
        type,
        confidence,
      });
    }

    return patterns;
  }

  /**
   * Extract checklists with status
   */
  private extractChecklists(text: string): Array<{
    name: string;
    items: Array<{
      text: string;
      status: 'PASS' | 'FAIL' | 'SCOPE_REDUCED' | 'PENDING';
    }>;
  }> {
    const checklists: Array<any> = [];

    // Look for POST_PHASE_CHECKLIST or similar sections
    const checklistRegex = /(?:POST_PHASE_)?CHECKLIST[\s\S]*?(?=\n#{1,3}\s|$)/gi;

    let match;
    while ((match = checklistRegex.exec(text)) !== null) {
      const checklistText = match[0];
      const items: Array<{ text: string; status: any }> = [];

      // Extract items with status markers
      const itemRegex = /(?:[-*]\s*)?\[?(PASS|FAIL|SCOPE_REDUCED|PENDING)\]?\s*[:-]?\s*(.+)/gi;

      let itemMatch;
      while ((itemMatch = itemRegex.exec(checklistText)) !== null) {
        items.push({
          status: itemMatch[1] as any,
          text: itemMatch[2].trim(),
        });
      }

      if (items.length > 0) {
        checklists.push({
          name: 'Checklist',
          items,
        });
      }
    }

    return checklists;
  }

  /**
   * Extract risks (for deep-risk process)
   */
  private extractRisks(text: string): Array<{
    id?: string;
    description: string;
    category?: string;
    severity?: string;
  }> {
    const risks: Array<any> = [];

    // Look for risk definitions in YAML or structured format
    const riskSectionRegex = /(?:RISK_|RISKS?[\s:])[\s\S]*?```yaml\s*([\s\S]*?)```/gi;

    let match;
    while ((match = riskSectionRegex.exec(text)) !== null) {
      try {
        const parsed = parseYaml(match[1]);
        if (Array.isArray(parsed)) {
          risks.push(...parsed);
        } else if (parsed && typeof parsed === 'object') {
          // Could be object with risk IDs as keys
          for (const [id, data] of Object.entries(parsed)) {
            if (typeof data === 'object') {
              risks.push({ id, ...(data as any) });
            }
          }
        }
      } catch {
        // Ignore parse errors
      }
    }

    return risks;
  }

  /**
   * Check if a specific section exists
   */
  hasSection(output: CollectedOutput, sectionName: string): boolean {
    const normalizedName = sectionName.toLowerCase().replace(/[_\s]+/g, '_');

    for (const key of Object.keys(output.sections)) {
      const normalizedKey = key.toLowerCase().replace(/[_\s]+/g, '_');
      if (normalizedKey.includes(normalizedName)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get field count (for gate checks like "field.length >= N")
   */
  getFieldCount(output: CollectedOutput, fieldPath: string): number {
    const parts = fieldPath.split('.');
    let current: any = output.yaml;

    for (const part of parts) {
      if (current && typeof current === 'object') {
        current = current[part];
      } else {
        return 0;
      }
    }

    if (Array.isArray(current)) {
      return current.length;
    } else if (current && typeof current === 'object') {
      return Object.keys(current).length;
    }

    return 0;
  }
}

/**
 * Create and export singleton collector
 */
export const outputCollector = new OutputCollector();

/**
 * Convenience function to collect output
 */
export function collectOutput(rawOutput: string): CollectedOutput {
  return outputCollector.collect(rawOutput);
}
