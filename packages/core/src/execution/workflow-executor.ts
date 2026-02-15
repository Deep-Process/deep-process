/**
 * Workflow Executor
 *
 * Orchestrates Deep Process execution:
 * - Loads manifest.yaml → workflow.md → steps/*.md
 * - Progressive step loading (one step at a time, no look-ahead)
 * - Formats steps as LLM prompts with user input
 * - Executes via provider abstraction
 * - Collects output via output collector
 * - Validates gates after each step
 * - Handles scope reduction protocol
 * - Supports crisis mode
 */

import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { LLMProvider, LLMCompletionRequest } from '../providers/index.js';
import { GateValidator, type GateResult, type ScopeReduction } from './gate-validator.js';
import { OutputCollector, type CollectedOutput } from './output-collector.js';
import type { ProcessManifest } from '../process-registry.js';

/**
 * Execution depth
 */
export type ExecutionDepth = 'quick' | 'standard' | 'comprehensive' | 'critical';

/**
 * Step metadata (from frontmatter)
 */
export interface StepMetadata {
  step: number;
  name: string;
  phase: string;
  gate?: string;
  time_estimate?: string;
  goal?: string;
  requires_completion?: boolean;
  next_steps?: string[];
  data_dependencies?: string[];
  outputs?: string[];
}

/**
 * Step content
 */
export interface StepContent {
  /** Step metadata from frontmatter */
  metadata: StepMetadata;

  /** Raw markdown content (without frontmatter) */
  content: string;

  /** Step file path */
  filePath: string;

  /** Step ID (e.g., "step-00-ground") */
  stepId: string;
}

/**
 * Execution context
 */
export interface ExecutionContext {
  /** Process ID */
  processId: string;

  /** Process directory path */
  processDir: string;

  /** User input/brief */
  userInput: string;

  /** Execution depth */
  depth: ExecutionDepth;

  /** Crisis mode enabled */
  crisisMode: boolean;

  /** Context files (for integration with other processes) */
  contextFiles?: string[];

  /** Additional parameters */
  parameters?: Record<string, any>;
}

/**
 * Step execution result
 */
export interface StepExecutionResult {
  /** Step ID */
  stepId: string;

  /** Step name */
  stepName: string;

  /** Execution successful */
  success: boolean;

  /** LLM raw output */
  rawOutput: string;

  /** Collected structured data */
  collectedData: CollectedOutput;

  /** Gate evaluation result (if gate exists) */
  gateResult?: GateResult;

  /** Execution time (ms) */
  executionTime: number;

  /** Error (if failed) */
  error?: string;

  /** Scope reductions */
  scopeReductions: ScopeReduction[];
}

/**
 * Workflow execution result
 */
export interface WorkflowExecutionResult {
  /** Process ID */
  processId: string;

  /** Execution successful */
  success: boolean;

  /** Step results */
  steps: StepExecutionResult[];

  /** Total execution time (ms) */
  totalExecutionTime: number;

  /** Final output (combined from all steps) */
  finalOutput: string;

  /** All collected data */
  allCollectedData: CollectedOutput[];

  /** All scope reductions */
  allScopeReductions: ScopeReduction[];

  /** Error (if failed) */
  error?: string;
}

/**
 * Workflow Executor
 */
export class WorkflowExecutor {
  private gateValidator: GateValidator;
  private outputCollector: OutputCollector;

  constructor() {
    this.gateValidator = new GateValidator();
    this.outputCollector = new OutputCollector();
  }

  /**
   * Execute a complete workflow
   */
  async executeWorkflow(
    manifest: ProcessManifest,
    context: ExecutionContext,
    provider: LLMProvider,
    options: {
      onStepStart?: (stepId: string, stepName: string) => void;
      onStepComplete?: (result: StepExecutionResult) => void;
      onGateEvaluation?: (gateResult: GateResult) => void;
      userApprovalCallback?: (reduction: ScopeReduction) => Promise<boolean>;
    } = {}
  ): Promise<WorkflowExecutionResult> {
    const startTime = Date.now();
    const stepResults: StepExecutionResult[] = [];
    const allCollectedData: CollectedOutput[] = [];
    const allScopeReductions: ScopeReduction[] = [];

    try {
      // Load gates configuration
      const gatesPath = path.join(context.processDir, 'gates.yaml');
      if (fs.existsSync(gatesPath)) {
        this.gateValidator.loadGatesConfig(gatesPath);
      }

      // Load workflow
      const workflowPath = path.join(context.processDir, manifest.workflowFile);
      const workflowContent = fs.existsSync(workflowPath)
        ? fs.readFileSync(workflowPath, 'utf-8')
        : '';

      // Detect crisis mode
      const crisisMode =
        context.crisisMode || this.gateValidator.shouldActivateCrisisMode(context.userInput);

      // Get execution sequence
      const stepSequence = this.getStepSequence(context.processDir, crisisMode);

      console.log(`Executing ${manifest.name} workflow:`);
      console.log(`  Depth: ${context.depth}`);
      console.log(`  Crisis mode: ${crisisMode ? 'ON' : 'OFF'}`);
      console.log(`  Steps: ${stepSequence.length}`);

      // Execute steps sequentially
      for (const stepFile of stepSequence) {
        const stepContent = this.loadStep(context.processDir, stepFile);

        // Check if step should be skipped in crisis mode
        if (crisisMode && stepContent.metadata.step === 0) {
          console.log(`Skipping ${stepContent.stepId} (crisis mode)`);
          continue;
        }

        // Notify step start
        if (options.onStepStart) {
          options.onStepStart(stepContent.stepId, stepContent.metadata.name);
        }

        // Execute step
        const stepResult = await this.executeStep(
          stepContent,
          context,
          provider,
          {
            previousResults: stepResults,
            workflowContent,
            userApprovalCallback: options.userApprovalCallback,
          }
        );

        stepResults.push(stepResult);
        allCollectedData.push(stepResult.collectedData);
        allScopeReductions.push(...stepResult.scopeReductions);

        // Notify step complete
        if (options.onStepComplete) {
          options.onStepComplete(stepResult);
        }

        // Notify gate evaluation
        if (stepResult.gateResult && options.onGateEvaluation) {
          options.onGateEvaluation(stepResult.gateResult);
        }

        // Check if step failed
        if (!stepResult.success) {
          return {
            processId: context.processId,
            success: false,
            steps: stepResults,
            totalExecutionTime: Date.now() - startTime,
            finalOutput: this.combineFinalOutput(stepResults),
            allCollectedData,
            allScopeReductions,
            error: `Step ${stepContent.stepId} failed: ${stepResult.error}`,
          };
        }

        // Check if gate is locked (blocking)
        if (stepResult.gateResult && stepResult.gateResult.status === 'LOCKED') {
          const hasBlockerFailures = stepResult.gateResult.failureReasons.some((r) =>
            r.includes('BLOCKER')
          );

          if (hasBlockerFailures) {
            return {
              processId: context.processId,
              success: false,
              steps: stepResults,
              totalExecutionTime: Date.now() - startTime,
              finalOutput: this.combineFinalOutput(stepResults),
              allCollectedData,
              allScopeReductions,
              error: `Gate ${stepResult.gateResult.gateId} LOCKED with BLOCKER failures`,
            };
          }
        }
      }

      // All steps completed successfully
      return {
        processId: context.processId,
        success: true,
        steps: stepResults,
        totalExecutionTime: Date.now() - startTime,
        finalOutput: this.combineFinalOutput(stepResults),
        allCollectedData,
        allScopeReductions,
      };
    } catch (error: any) {
      return {
        processId: context.processId,
        success: false,
        steps: stepResults,
        totalExecutionTime: Date.now() - startTime,
        finalOutput: this.combineFinalOutput(stepResults),
        allCollectedData,
        allScopeReductions,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Execute a single step
   */
  private async executeStep(
    stepContent: StepContent,
    context: ExecutionContext,
    provider: LLMProvider,
    options: {
      previousResults: StepExecutionResult[];
      workflowContent: string;
      userApprovalCallback?: (reduction: ScopeReduction) => Promise<boolean>;
    }
  ): Promise<StepExecutionResult> {
    const startTime = Date.now();
    const scopeReductions: ScopeReduction[] = [];

    try {
      console.log(`\nExecuting step: ${stepContent.stepId} (${stepContent.metadata.name})`);

      // Format prompt
      const prompt = this.formatStepPrompt(stepContent, context, options.previousResults);

      // Execute via provider
      const llmRequest: LLMCompletionRequest = {
        messages: [
          {
            role: 'system',
            content: `You are a ${context.processId} agent. Follow the step instructions precisely.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: provider.id === 'openai' ? 'gpt-4o' : 'claude-3-5-sonnet-20241022',
        maxTokens: 16000,
        temperature: 0.3, // Lower temperature for more consistent execution
      };

      const response = await provider.complete(llmRequest);
      const rawOutput = response.content;

      console.log(`  LLM response: ${response.usage.totalTokens} tokens`);

      // Collect structured data
      const collectedData = this.outputCollector.collect(rawOutput);

      console.log(`  Collected: ${collectedData.metadata.yamlBlockCount} YAML blocks, ${collectedData.metadata.sectionCount} sections`);

      // Evaluate gate (if exists)
      let gateResult: GateResult | undefined;

      if (stepContent.metadata.gate) {
        const gateId = stepContent.metadata.gate;

        console.log(`  Evaluating gate: ${gateId}`);

        gateResult = await this.gateValidator.evaluateGate(
          gateId,
          {
            data: collectedData.yaml,
            rawOutput,
            processId: context.processId,
            stepId: stepContent.stepId,
            phase: stepContent.metadata.phase,
            assumptions: collectedData.assumptions,
            scopeReductions: collectedData.scopeReductions,
          },
          {
            depth: context.depth,
            skipErrorConditions: context.depth === 'quick',
            userApprovalCallback: options.userApprovalCallback,
          }
        );

        console.log(`  Gate result: ${gateResult.status} (${gateResult.passed ? 'PASSED' : 'FAILED'})`);

        if (gateResult.scopeReductions.length > 0) {
          scopeReductions.push(...gateResult.scopeReductions);
          console.log(`  Scope reductions: ${gateResult.scopeReductions.length}`);
        }

        if (gateResult.failureReasons.length > 0) {
          console.log(`  Failures: ${gateResult.failureReasons.length}`);
          for (const reason of gateResult.failureReasons.slice(0, 3)) {
            console.log(`    - ${reason}`);
          }
        }
      }

      return {
        stepId: stepContent.stepId,
        stepName: stepContent.metadata.name,
        success: true,
        rawOutput,
        collectedData,
        gateResult,
        executionTime: Date.now() - startTime,
        scopeReductions,
      };
    } catch (error: any) {
      return {
        stepId: stepContent.stepId,
        stepName: stepContent.metadata.name,
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
        executionTime: Date.now() - startTime,
        error: error.message || 'Unknown error',
        scopeReductions,
      };
    }
  }

  /**
   * Format step as LLM prompt
   */
  private formatStepPrompt(
    stepContent: StepContent,
    context: ExecutionContext,
    previousResults: StepExecutionResult[]
  ): string {
    const parts: string[] = [];

    // User input
    parts.push('# User Request\n');
    parts.push(context.userInput);
    parts.push('\n---\n');

    // Execution context
    parts.push('# Execution Context\n');
    parts.push(`- Process: ${context.processId}`);
    parts.push(`- Depth: ${context.depth}`);
    parts.push(`- Step: ${stepContent.metadata.step} - ${stepContent.metadata.name}`);
    if (stepContent.metadata.goal) {
      parts.push(`- Goal: ${stepContent.metadata.goal}`);
    }
    parts.push('\n---\n');

    // Previous step outputs (for context)
    if (previousResults.length > 0) {
      parts.push('# Previous Steps Summary\n');

      for (const result of previousResults.slice(-2)) {
        // Last 2 steps for context
        parts.push(`\n## ${result.stepName}`);

        // Include key outputs
        if (result.collectedData.assumptions.length > 0) {
          parts.push(`\nAssumptions: ${result.collectedData.assumptions.slice(0, 3).join(', ')}`);
        }

        if (Object.keys(result.collectedData.yaml).length > 0) {
          const firstBlock = Object.entries(result.collectedData.yaml)[0];
          parts.push(`\nKey output: ${firstBlock[0]}`);
        }
      }

      parts.push('\n---\n');
    }

    // Step instructions
    parts.push('# Step Instructions\n');
    parts.push(stepContent.content);

    return parts.join('\n');
  }

  /**
   * Load step content from file
   */
  private loadStep(processDir: string, stepFile: string): StepContent {
    const filePath = path.join(processDir, 'steps', stepFile);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    let metadata: StepMetadata;
    let markdownContent: string;

    if (frontmatterMatch) {
      metadata = parseYaml(frontmatterMatch[1]) as StepMetadata;
      markdownContent = content.slice(frontmatterMatch[0].length).trim();
    } else {
      // No frontmatter, use defaults
      const stepMatch = stepFile.match(/step-(\d+)-(.+)\.md/);
      metadata = {
        step: stepMatch ? parseInt(stepMatch[1]) : 0,
        name: stepMatch ? stepMatch[2].replace(/-/g, ' ').toUpperCase() : 'UNKNOWN',
        phase: 'UNKNOWN',
      };
      markdownContent = content;
    }

    const stepId = stepFile.replace('.md', '');

    return {
      metadata,
      content: markdownContent,
      filePath,
      stepId,
    };
  }

  /**
   * Get step execution sequence
   */
  private getStepSequence(processDir: string, crisisMode: boolean): string[] {
    const stepsDir = path.join(processDir, 'steps');

    if (!fs.existsSync(stepsDir)) {
      return [];
    }

    const files = fs
      .readdirSync(stepsDir)
      .filter((f) => f.endsWith('.md') && f.match(/^step-\d+/))
      .sort();

    return files;
  }

  /**
   * Combine final output from all steps
   */
  private combineFinalOutput(stepResults: StepExecutionResult[]): string {
    const parts: string[] = [];

    parts.push('# Deep Process Execution Summary\n');

    for (const result of stepResults) {
      parts.push(`\n## ${result.stepName}\n`);

      if (result.success) {
        parts.push('**Status:** ✅ Completed\n');

        if (result.gateResult) {
          parts.push(`**Gate:** ${result.gateResult.name} - ${result.gateResult.status}\n`);
        }

        // Include key sections from collected data
        if (Object.keys(result.collectedData.sections).length > 0) {
          const firstSection = Object.entries(result.collectedData.sections)[0];
          parts.push(`\n### ${firstSection[0]}\n`);
          parts.push(firstSection[1].slice(0, 500) + '...\n');
        }
      } else {
        parts.push(`**Status:** ❌ Failed\n`);
        parts.push(`**Error:** ${result.error}\n`);
      }
    }

    return parts.join('\n');
  }

  /**
   * Reset executor state
   */
  reset(): void {
    this.gateValidator.reset();
  }
}

/**
 * Create and export singleton instance
 */
export const workflowExecutor = new WorkflowExecutor();

/**
 * Convenience function to execute workflow
 */
export async function executeWorkflow(
  manifest: ProcessManifest,
  context: ExecutionContext,
  provider: LLMProvider,
  options?: Parameters<WorkflowExecutor['executeWorkflow']>[3]
): Promise<WorkflowExecutionResult> {
  const executor = new WorkflowExecutor();
  return executor.executeWorkflow(manifest, context, provider, options);
}
