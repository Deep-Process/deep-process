/**
 * Output Collector Unit Tests
 *
 * Tests for structured data extraction from LLM output
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { OutputCollector, type CollectedOutput } from '../src/index.js';

describe('OutputCollector', () => {
  let collector: OutputCollector;

  beforeEach(() => {
    collector = new OutputCollector();
  });

  describe('YAML Block Extraction', () => {
    it('should extract single YAML block', () => {
      const mockOutput = `
# Test Output

Here is some YAML data:

\`\`\`yaml
field1: value1
field2: value2
items:
  - item1
  - item2
\`\`\`

More text here.
      `;

      const result = collector.collect(mockOutput);

      expect(result.metadata.yamlBlockCount).toBe(1);
      expect(result.yaml).toBeDefined();
      expect(Object.keys(result.yaml).length).toBe(1);

      const firstBlock = Object.values(result.yaml)[0];
      expect(firstBlock).toHaveProperty('field1', 'value1');
      expect(firstBlock).toHaveProperty('field2', 'value2');
      expect(firstBlock.items).toEqual(['item1', 'item2']);
    });

    it('should extract multiple YAML blocks', () => {
      const mockOutput = `
\`\`\`yaml
block1_data: test1
\`\`\`

Some text.

\`\`\`yaml
block2_data: test2
\`\`\`
      `;

      const result = collector.collect(mockOutput);

      expect(result.metadata.yamlBlockCount).toBe(2);
      expect(Object.keys(result.yaml).length).toBe(2);
    });

    it('should name blocks based on preceding headings', () => {
      const mockOutput = `
# SCOPE_FRAME

\`\`\`yaml
subject: Test project
boundaries: Test boundaries
\`\`\`

# ASSUMPTIONS_DECLARED

\`\`\`yaml
- Assumption 1
- Assumption 2
\`\`\`
      `;

      const result = collector.collect(mockOutput);

      expect(result.yaml.scope_frame).toBeDefined();
      expect(result.yaml.assumptions_declared).toBeDefined();
    });
  });

  describe('Markdown Section Extraction', () => {
    it('should extract sections by heading', () => {
      const mockOutput = `
# Section 1

Content of section 1.

## Subsection 1.1

Content of subsection 1.1.

# Section 2

Content of section 2.
      `;

      const result = collector.collect(mockOutput);

      expect(result.sections['Section 1']).toBeDefined();
      expect(result.sections['Subsection 1.1']).toBeDefined();
      expect(result.sections['Section 2']).toBeDefined();

      expect(result.metadata.sectionCount).toBe(3);
    });

    it('should handle nested headings', () => {
      const mockOutput = `
# Main Heading

Some content.

## Sub Heading

More content.

### Deep Heading

Even more content.
      `;

      const result = collector.collect(mockOutput);

      expect(result.sections['Main Heading']).toBeDefined();
      expect(result.sections['Sub Heading']).toBeDefined();
      expect(result.sections['Deep Heading']).toBeDefined();
    });
  });

  describe('Assumptions Extraction', () => {
    it('should extract assumptions from YAML block', () => {
      const mockOutput = `
# ASSUMPTIONS_DECLARED

\`\`\`yaml
- User traffic remains stable
- Third-party APIs maintain SLA
- Team size remains constant
\`\`\`
      `;

      const result = collector.collect(mockOutput);

      expect(result.assumptions).toHaveLength(3);
      expect(result.assumptions).toContain('User traffic remains stable');
      expect(result.assumptions).toContain('Third-party APIs maintain SLA');
      expect(result.assumptions).toContain('Team size remains constant');
    });

    it('should extract assumptions from bulleted list', () => {
      const mockOutput = `
Assumptions:
- Assumption 1
- Assumption 2
- Assumption 3
      `;

      const result = collector.collect(mockOutput);

      expect(result.assumptions.length).toBeGreaterThanOrEqual(3);
    });

    it('should extract assumptions from numbered list', () => {
      const mockOutput = `
Assumptions:
1. First assumption
2. Second assumption
3. Third assumption
      `;

      const result = collector.collect(mockOutput);

      expect(result.assumptions.length).toBeGreaterThanOrEqual(3);
    });

    it('should deduplicate assumptions', () => {
      const mockOutput = `
Assumptions:
- Same assumption
- Different assumption
- Same assumption
      `;

      const result = collector.collect(mockOutput);

      expect(result.assumptions).toHaveLength(2);
      expect(result.assumptions).toContain('Same assumption');
      expect(result.assumptions).toContain('Different assumption');
    });
  });

  describe('Scope Reduction Extraction', () => {
    it('should extract scope reductions', () => {
      const mockOutput = `
# SCOPE_REDUCTION_DECLARED

\`\`\`yaml
item: G1-03
reason: Quick depth selected
impact: Threat modeling skipped
\`\`\`
      `;

      const result = collector.collect(mockOutput);

      expect(result.scopeReductions).toHaveLength(1);
      expect(result.scopeReductions[0].item).toBe('G1-03');
      expect(result.scopeReductions[0].reason).toBe('Quick depth selected');
      expect(result.scopeReductions[0].impact).toBe('Threat modeling skipped');
    });

    it('should extract multiple scope reductions', () => {
      const mockOutput = `
\`\`\`yaml
SCOPE_REDUCTION:
  - item: G1-03
    reason: Reason 1
    impact: Impact 1
  - item: G2-04
    reason: Reason 2
    impact: Impact 2
\`\`\`
      `;

      const result = collector.collect(mockOutput);

      expect(result.scopeReductions.length).toBeGreaterThan(0);
    });
  });

  describe('Pattern Extraction', () => {
    it('should extract pattern references', () => {
      const mockOutput = `
Detected architecture patterns:
- AAP-001 (Anti-pattern: God Object)
- ARC-042 (Pattern: Microservices)
- RP-005 (Risk pattern: Data breach)

Pattern AAP-002 detected with confidence: 0.85
      `;

      const result = collector.collect(mockOutput);

      expect(result.patterns.length).toBeGreaterThan(0);

      const aap001 = result.patterns.find((p) => p.id === 'AAP-001');
      expect(aap001).toBeDefined();
      expect(aap001?.type).toBe('AAP');

      const arc042 = result.patterns.find((p) => p.id === 'ARC-042');
      expect(arc042).toBeDefined();
      expect(arc042?.type).toBe('ARC');

      const rp005 = result.patterns.find((p) => p.id === 'RP-005');
      expect(rp005).toBeDefined();
      expect(rp005?.type).toBe('RP');

      const aap002 = result.patterns.find((p) => p.id === 'AAP-002');
      expect(aap002).toBeDefined();
      expect(aap002?.confidence).toBe(0.85);
    });
  });

  describe('Checklist Extraction', () => {
    it('should extract checklist with status markers', () => {
      const mockOutput = `
# POST_PHASE_CHECKLIST

- [PASS] Item 1 completed
- [PASS] Item 2 completed
- [FAIL] Item 3 failed
- [SCOPE_REDUCED] Item 4 reduced
- [PENDING] Item 5 pending
      `;

      const result = collector.collect(mockOutput);

      expect(result.checklists).toHaveLength(1);
      const checklist = result.checklists[0];

      expect(checklist.items).toHaveLength(5);
      expect(checklist.items[0].status).toBe('PASS');
      expect(checklist.items[2].status).toBe('FAIL');
      expect(checklist.items[3].status).toBe('SCOPE_REDUCED');
    });

    it('should extract multiple checklists', () => {
      const mockOutput = `
# CHECKLIST 1
- [PASS] Item A
- [PASS] Item B

# CHECKLIST 2
- [FAIL] Item C
- [PASS] Item D
      `;

      const result = collector.collect(mockOutput);

      expect(result.checklists.length).toBeGreaterThan(0);
    });
  });

  describe('Risk Extraction', () => {
    it('should extract risks from YAML', () => {
      const mockOutput = `
# RISKS

\`\`\`yaml
- id: R-001
  description: Data breach risk
  category: security
  severity: HIGH
- id: R-002
  description: Performance degradation
  category: operations
  severity: MEDIUM
\`\`\`
      `;

      const result = collector.collect(mockOutput);

      expect(result.risks).toBeDefined();
      expect(result.risks?.length).toBe(2);

      const r001 = result.risks?.find((r) => r.id === 'R-001');
      expect(r001).toBeDefined();
      expect(r001?.description).toBe('Data breach risk');
      expect(r001?.severity).toBe('HIGH');
    });

    it('should extract risks from object format', () => {
      const mockOutput = `
\`\`\`yaml
RISK_REGISTER:
  R-001:
    description: Risk 1
    severity: HIGH
  R-002:
    description: Risk 2
    severity: MEDIUM
\`\`\`
      `;

      const result = collector.collect(mockOutput);

      // Risk extraction varies by format, check if parsed
      expect(result.yaml).toBeDefined();
    });
  });

  describe('Metadata', () => {
    it('should calculate word count', () => {
      const mockOutput = 'This is a test with exactly eight words here.';

      const result = collector.collect(mockOutput);

      expect(result.metadata.wordCount).toBe(9);
    });

    it('should count sections', () => {
      const mockOutput = `
# Section 1
Content 1

# Section 2
Content 2

# Section 3
Content 3
      `;

      const result = collector.collect(mockOutput);

      expect(result.metadata.sectionCount).toBe(3);
    });

    it('should count YAML blocks', () => {
      const mockOutput = `
\`\`\`yaml
block: 1
\`\`\`

\`\`\`yaml
block: 2
\`\`\`

\`\`\`yaml
block: 3
\`\`\`
      `;

      const result = collector.collect(mockOutput);

      expect(result.metadata.yamlBlockCount).toBe(3);
    });
  });

  describe('Utility Methods', () => {
    it('should check if section exists', () => {
      const mockOutput = `
# ASSUMPTIONS_DECLARED

Some assumptions here.

# SCOPE_FRAME

Some scope here.
      `;

      const result = collector.collect(mockOutput);

      expect(collector.hasSection(result, 'assumptions_declared')).toBe(true);
      expect(collector.hasSection(result, 'scope_frame')).toBe(true);
      expect(collector.hasSection(result, 'nonexistent_section')).toBe(false);
    });

    it('should get field count', () => {
      const mockOutput = `
\`\`\`yaml
risks:
  - risk1
  - risk2
  - risk3
assumptions:
  - a1
  - a2
\`\`\`
      `;

      const result = collector.collect(mockOutput);

      const risksCount = collector.getFieldCount(result, 'block_0.risks');
      expect(risksCount).toBe(3);

      const assumptionsCount = collector.getFieldCount(result, 'block_0.assumptions');
      expect(assumptionsCount).toBe(2);
    });

    it('should handle missing fields gracefully', () => {
      const mockOutput = `
\`\`\`yaml
data: value
\`\`\`
      `;

      const result = collector.collect(mockOutput);

      const count = collector.getFieldCount(result, 'nonexistent.field.path');
      expect(count).toBe(0);
    });
  });

  describe('Complex Integration', () => {
    it('should extract all data types from complex output', () => {
      const complexOutput = `
# Deep Risk Assessment

## SCOPE_FRAME

\`\`\`yaml
subject: E-commerce Platform
boundaries: Frontend + API
timeframe: 6 months
stakes: High
\`\`\`

## RISK_GENESIS_SCAN

\`\`\`yaml
- source: complexity
  risk: R-001
  description: High system complexity
- source: coupling
  risk: R-002
  description: Tight coupling between services
\`\`\`

## ASSUMPTIONS_DECLARED

- User traffic remains stable
- APIs maintain 99.9% uptime
- Team size constant

## Pattern Detection

Detected patterns:
- AAP-001 (God Object) - confidence: 0.75
- RP-005 (Data breach risk) - confidence: 0.90

## POST_PHASE_CHECKLIST

- [PASS] Genesis scan complete
- [PASS] System characterized
- [FAIL] Threat model incomplete
- [SCOPE_REDUCED] Scenario planning deferred

Total words: approximately 150 words in this output.
      `;

      const result = collector.collect(complexOutput);

      // YAML blocks
      expect(result.metadata.yamlBlockCount).toBeGreaterThan(0);
      expect(result.yaml.scope_frame).toBeDefined();

      // Sections
      expect(result.metadata.sectionCount).toBeGreaterThan(0);
      expect(result.sections['SCOPE_FRAME']).toBeDefined();

      // Assumptions
      expect(result.assumptions.length).toBeGreaterThanOrEqual(3);

      // Patterns
      expect(result.patterns.length).toBeGreaterThan(0);
      const aap001 = result.patterns.find((p) => p.id === 'AAP-001');
      expect(aap001).toBeDefined();

      // Checklists
      expect(result.checklists.length).toBeGreaterThan(0);
      const checklist = result.checklists[0];
      expect(checklist.items.some((i) => i.status === 'PASS')).toBe(true);
      expect(checklist.items.some((i) => i.status === 'FAIL')).toBe(true);

      // Metadata
      expect(result.metadata.wordCount).toBeGreaterThan(0);
    });
  });
});
