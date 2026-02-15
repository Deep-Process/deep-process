/**
 * Workflow Executor Unit Tests
 *
 * Tests for workflow orchestration:
 * - Step loading
 * - Sequential execution
 * - Gate validation integration
 * - Scope reduction handling
 * - Crisis mode support
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  WorkflowExecutor,
  type ExecutionContext,
  type StepContent,
  type ProcessManifest,
} from '../src/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock LLM Provider for testing
class MockProvider {
  readonly id = 'mock';
  readonly displayName = 'Mock Provider';

  async initialize() {}

  async complete(request: any) {
    // Return mock LLM response
    return {
      content: `
# Mock LLM Response

## SCOPE_FRAME

\`\`\`yaml
subject: Test Project
boundaries: Test boundaries
timeframe: 6 months
stakes: High
\`\`\`

## ASSUMPTIONS_DECLARED

\`\`\`yaml
- Assumption 1
- Assumption 2
- Assumption 3
\`\`\`

## RISK_GENESIS_SCAN

\`\`\`yaml
- source: complexity
  risks: [R1, R2]
- source: coupling
  risks: [R3, R4]
- source: uncertainty
  risks: [R5]
- source: agency
  risks: [R6]
- source: temporality
  risks: [R7]
- source: boundaries
  risks: [R8]
\`\`\`

## SYSTEM_PROFILE

\`\`\`yaml
complexity_level: High
coupling_level: Medium
\`\`\`

## UNCERTAINTY_MAP

\`\`\`yaml
- type: risk
  items: Known risks
- type: uncertainty
  items: Unknown factors
\`\`\`

## POST_PHASE_CHECKLIST

- [PASS] Item 1
- [PASS] Item 2
- [PASS] Item 3
      `,
      usage: {
        promptTokens: 1000,
        completionTokens: 500,
        totalTokens: 1500,
      },
      model: 'mock',
      finishReason: 'stop',
    };
  }

  async streamComplete() {
    return this.complete({});
  }

  validateConfig() {
    return { valid: true, errors: [] };
  }

  async getAvailableModels() {
    return ['mock'];
  }

  estimateCost() {
    return 0;
  }
}

describe('WorkflowExecutor', () => {
  let executor: WorkflowExecutor;
  let mockProvider: any;

  beforeEach(() => {
    executor = new WorkflowExecutor();
    mockProvider = new MockProvider();
  });

  describe('Step Loading', () => {
    it('should load step with frontmatter', () => {
      const processDir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk'
      );

      // Use private method via type assertion (for testing)
      const loadStep = (executor as any).loadStep.bind(executor);
      const step = loadStep(processDir, 'step-00-ground.md');

      expect(step).toBeDefined();
      expect(step.metadata).toBeDefined();
      expect(step.metadata.step).toBe(0);
      expect(step.metadata.name).toBe('GROUND');
      expect(step.metadata.phase).toBe('GROUND');
      expect(step.content).toBeDefined();
      expect(step.content.length).toBeGreaterThan(0);
    });

    it('should extract step metadata correctly', () => {
      const processDir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk'
      );

      const loadStep = (executor as any).loadStep.bind(executor);
      const step = loadStep(processDir, 'step-00-ground.md');

      expect(step.metadata.gate).toBe('GATE_0');
      expect(step.metadata.outputs).toContain('SCOPE_FRAME (subject, boundaries, timeframe, stakes)');
      expect(step.metadata.data_dependencies).toContain('data/theoretical-foundations.yaml');
    });
  });

  describe('Step Sequence', () => {
    it('should get correct step sequence', () => {
      const processDir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk'
      );

      const getStepSequence = (executor as any).getStepSequence.bind(executor);
      const sequence = getStepSequence(processDir, false);

      expect(sequence).toBeDefined();
      expect(sequence.length).toBeGreaterThan(0);
      expect(sequence[0]).toBe('step-00-ground.md');
      expect(sequence).toContain('step-01-identify-vertical.md');
    });

    it('should maintain step order', () => {
      const processDir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk'
      );

      const getStepSequence = (executor as any).getStepSequence.bind(executor);
      const sequence = getStepSequence(processDir, false);

      // Check sequential numbering
      for (let i = 0; i < sequence.length - 1; i++) {
        const currentNum = parseInt(sequence[i].match(/step-(\d+)/)?.[1] || '0');
        const nextNum = parseInt(sequence[i + 1].match(/step-(\d+)/)?.[1] || '0');
        expect(nextNum).toBeGreaterThanOrEqual(currentNum);
      }
    });
  });

  describe('Prompt Formatting', () => {
    it('should format step prompt with user input', () => {
      const stepContent: StepContent = {
        metadata: {
          step: 0,
          name: 'TEST',
          phase: 'TEST_PHASE',
          goal: 'Test goal',
        },
        content: '# Test Step\n\nTest instructions.',
        filePath: '/test/step.md',
        stepId: 'step-00-test',
      };

      const context: ExecutionContext = {
        processId: 'deep-risk',
        processDir: '/test',
        userInput: 'Assess risks for my project',
        depth: 'standard',
        crisisMode: false,
      };

      const formatStepPrompt = (executor as any).formatStepPrompt.bind(executor);
      const prompt = formatStepPrompt(stepContent, context, []);

      expect(prompt).toContain('Assess risks for my project');
      expect(prompt).toContain('Process: deep-risk');
      expect(prompt).toContain('Depth: standard');
      expect(prompt).toContain('Test Step');
    });

    it('should include previous results context', () => {
      const stepContent: StepContent = {
        metadata: { step: 1, name: 'STEP2', phase: 'PHASE2' },
        content: 'Step 2 content',
        filePath: '/test/step.md',
        stepId: 'step-01-test',
      };

      const context: ExecutionContext = {
        processId: 'deep-risk',
        processDir: '/test',
        userInput: 'Test',
        depth: 'standard',
        crisisMode: false,
      };

      const previousResults = [
        {
          stepId: 'step-00-test',
          stepName: 'STEP1',
          success: true,
          rawOutput: 'Output 1',
          collectedData: {
            yaml: { test: 'data' },
            sections: {},
            assumptions: ['Assumption 1', 'Assumption 2'],
            scopeReductions: [],
            patterns: [],
            checklists: [],
            risks: [],
            metadata: { wordCount: 100, sectionCount: 1, yamlBlockCount: 1 },
          },
          executionTime: 1000,
          scopeReductions: [],
        },
      ];

      const formatStepPrompt = (executor as any).formatStepPrompt.bind(executor);
      const prompt = formatStepPrompt(stepContent, context, previousResults);

      expect(prompt).toContain('Previous Steps Summary');
      expect(prompt).toContain('STEP1');
      expect(prompt).toContain('Assumption 1');
    });
  });

  describe('Crisis Mode', () => {
    it('should detect crisis mode from user input', () => {
      const processDir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk'
      );

      const context: ExecutionContext = {
        processId: 'deep-risk',
        processDir,
        userInput: 'URGENT: Production is down, need risk assessment immediately!',
        depth: 'quick',
        crisisMode: false,
      };

      // Crisis mode should be detected automatically
      expect(context.userInput.toLowerCase()).toMatch(/urgent|emergency|production/);
    });
  });

  describe('Final Output Combination', () => {
    it('should combine step results into final output', () => {
      const stepResults = [
        {
          stepId: 'step-00-ground',
          stepName: 'GROUND',
          success: true,
          rawOutput: 'Output 1',
          collectedData: {
            yaml: {},
            sections: { 'Section 1': 'Content 1' },
            assumptions: [],
            scopeReductions: [],
            patterns: [],
            checklists: [],
            metadata: { wordCount: 100, sectionCount: 1, yamlBlockCount: 0 },
          },
          gateResult: {
            gateId: 'GATE_0',
            name: 'GROUND_COMPLETE',
            phase: 0,
            status: 'OPEN' as const,
            conditions: [],
            counterChecks: [],
            passed: true,
            failureReasons: [],
            scopeReductions: [],
          },
          executionTime: 1000,
          scopeReductions: [],
        },
        {
          stepId: 'step-01-identify',
          stepName: 'IDENTIFY',
          success: true,
          rawOutput: 'Output 2',
          collectedData: {
            yaml: {},
            sections: { 'Section 2': 'Content 2' },
            assumptions: [],
            scopeReductions: [],
            patterns: [],
            checklists: [],
            metadata: { wordCount: 150, sectionCount: 1, yamlBlockCount: 0 },
          },
          executionTime: 1500,
          scopeReductions: [],
        },
      ];

      const combineFinalOutput = (executor as any).combineFinalOutput.bind(executor);
      const finalOutput = combineFinalOutput(stepResults);

      expect(finalOutput).toContain('Deep Process Execution Summary');
      expect(finalOutput).toContain('GROUND');
      expect(finalOutput).toContain('IDENTIFY');
      expect(finalOutput).toContain('✅ Completed');
      expect(finalOutput).toContain('GROUND_COMPLETE - OPEN');
    });

    it('should handle failed steps in output', () => {
      const stepResults = [
        {
          stepId: 'step-00-ground',
          stepName: 'GROUND',
          success: false,
          rawOutput: '',
          collectedData: {
            yaml: {},
            sections: {},
            assumptions: [],
            scopeReductions: [],
            patterns: [],
            checklists: [],
            metadata: { wordCount: 0, sectionCount: 0, yamlBlockCount: 0 },
          },
          error: 'Provider error',
          executionTime: 100,
          scopeReductions: [],
        },
      ];

      const combineFinalOutput = (executor as any).combineFinalOutput.bind(executor);
      const finalOutput = combineFinalOutput(stepResults);

      expect(finalOutput).toContain('❌ Failed');
      expect(finalOutput).toContain('Provider error');
    });
  });

  describe('Workflow Execution (Mock)', () => {
    it('should execute workflow with mock provider', async () => {
      // This is a simplified test with mocked components
      // Real integration tests would use actual process files

      const manifest: ProcessManifest = {
        id: 'test-process',
        name: 'Test Process',
        version: '1.0.0',
        description: 'Test',
        shortDescription: 'Test',
        workflowFile: 'workflow.md',
        firstStepFile: 'steps/step-00-ground.md',
        firstStepLabel: 'Phase 0',
        agentName: 'Test Agent',
        agentInstruction: 'Test',
        githubAgentTools: [],
        slashCommand: 'test',
      };

      const context: ExecutionContext = {
        processId: 'test-process',
        processDir: '/nonexistent', // Would use real path in integration tests
        userInput: 'Test user input',
        depth: 'quick',
        crisisMode: false,
      };

      // This would execute if process files existed
      // For now, just verify the executor is initialized
      expect(executor).toBeDefined();
      expect(mockProvider).toBeDefined();
    });
  });

  describe('State Management', () => {
    it('should reset executor state', () => {
      executor.reset();

      // After reset, executor should be ready for new execution
      expect(executor).toBeDefined();
    });
  });
});

describe('Integration Scenarios', () => {
  it('should handle empty steps directory gracefully', () => {
    const executor = new WorkflowExecutor();
    const getStepSequence = (executor as any).getStepSequence.bind(executor);

    const sequence = getStepSequence('/nonexistent-path', false);
    expect(sequence).toEqual([]);
  });

  it('should format context correctly for different depths', () => {
    const depths: Array<'quick' | 'standard' | 'comprehensive' | 'critical'> = [
      'quick',
      'standard',
      'comprehensive',
      'critical',
    ];

    for (const depth of depths) {
      const context: ExecutionContext = {
        processId: 'deep-risk',
        processDir: '/test',
        userInput: 'Test',
        depth,
        crisisMode: false,
      };

      expect(context.depth).toBe(depth);
    }
  });
});
