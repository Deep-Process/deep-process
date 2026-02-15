/**
 * Workflow Executor - Usage Examples
 *
 * Demonstrates how to execute Deep Process workflows end-to-end:
 * - Loading manifest and steps
 * - Executing with LLM provider
 * - Gate validation
 * - Scope reduction handling
 * - Crisis mode
 */

import {
  executeWorkflow,
  initializeProvider,
  loadManifest,
  type ExecutionContext,
  type StepExecutionResult,
  type GateResult,
  type ScopeReduction,
} from '../src/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Example 1: Basic Workflow Execution
 */
async function example1_BasicExecution() {
  console.log('\n=== Example 1: Basic Workflow Execution ===\n');

  // Load process manifest
  const processDir = path.join(__dirname, '..', '..', '..', 'processes', 'deep-risk');
  const manifestPath = path.join(processDir, 'manifest.yaml');

  const manifest = loadManifest('deep-risk');
  if (!manifest) {
    console.error('Manifest not found');
    return;
  }

  console.log(`Process: ${manifest.name} v${manifest.version}`);
  console.log(`Description: ${manifest.description}`);

  // Initialize LLM provider
  const provider = await initializeProvider({
    type: 'ollama', // Using local Ollama for demo (free)
    defaultModel: 'llama3',
    endpoint: 'http://localhost:11434',
  });

  console.log(`Provider: ${provider.displayName}`);

  // Prepare execution context
  const context: ExecutionContext = {
    processId: 'deep-risk',
    processDir,
    userInput: `
Assess risks for our e-commerce platform redesign project:
- Migrating from monolith to microservices
- 6-month timeline
- Critical business impact ($10M revenue)
- Team of 8 developers
    `,
    depth: 'quick', // Quick depth for demo
    crisisMode: false,
  };

  console.log('\nExecuting workflow...\n');

  // Execute workflow
  const result = await executeWorkflow(manifest, context, provider, {
    onStepStart: (stepId, stepName) => {
      console.log(`\n📋 Starting: ${stepId} (${stepName})`);
    },
    onStepComplete: (stepResult) => {
      const icon = stepResult.success ? '✅' : '❌';
      console.log(`${icon} Completed: ${stepResult.stepName}`);
      console.log(`   Time: ${stepResult.executionTime}ms`);
      console.log(`   YAML blocks: ${stepResult.collectedData.metadata.yamlBlockCount}`);
      console.log(`   Sections: ${stepResult.collectedData.metadata.sectionCount}`);
    },
    onGateEvaluation: (gateResult) => {
      const icon = gateResult.passed ? '✅' : '❌';
      console.log(`   ${icon} Gate: ${gateResult.name} - ${gateResult.status}`);

      if (!gateResult.passed) {
        console.log(`   Failures: ${gateResult.failureReasons.length}`);
      }
    },
  });

  console.log('\n' + '='.repeat(60));
  console.log('Workflow Result:');
  console.log('='.repeat(60));
  console.log(`Success: ${result.success ? '✅' : '❌'}`);
  console.log(`Steps executed: ${result.steps.length}`);
  console.log(`Total time: ${result.totalExecutionTime}ms`);
  console.log(`Scope reductions: ${result.allScopeReductions.length}`);

  if (result.error) {
    console.log(`Error: ${result.error}`);
  }

  return result;
}

/**
 * Example 2: Workflow with Scope Reduction
 */
async function example2_ScopeReduction() {
  console.log('\n=== Example 2: Workflow with Scope Reduction ===\n');

  const manifest = loadManifest('deep-risk');
  if (!manifest) return;

  const processDir = path.join(__dirname, '..', '..', '..', 'processes', 'deep-risk');

  // Use Ollama (free, local)
  const provider = await initializeProvider({
    type: 'ollama',
    defaultModel: 'llama3',
  });

  const context: ExecutionContext = {
    processId: 'deep-risk',
    processDir,
    userInput: 'Quick risk assessment needed for new feature',
    depth: 'quick', // Quick depth may trigger scope reductions
    crisisMode: false,
  };

  // Execute with approval callback
  const result = await executeWorkflow(manifest, context, provider, {
    userApprovalCallback: async (reduction: ScopeReduction) => {
      console.log('\n📋 Scope Reduction Request:');
      console.log(`  Gate: ${reduction.gate}`);
      console.log(`  Item: ${reduction.itemSkipped}`);
      console.log(`  Reason: ${reduction.reason}`);
      console.log(`  Impact: ${reduction.impactAssessment}`);

      // Auto-approve for demo
      const approved = true;
      console.log(`  Decision: ${approved ? 'APPROVED ✅' : 'REJECTED ❌'}`);

      return approved;
    },
    onStepComplete: (stepResult) => {
      if (stepResult.scopeReductions.length > 0) {
        console.log(`  ⚠️  Scope reductions in this step: ${stepResult.scopeReductions.length}`);
      }
    },
  });

  console.log('\nScope Reductions Summary:');
  for (const reduction of result.allScopeReductions) {
    console.log(`  - ${reduction.gate}: ${reduction.itemSkipped}`);
    console.log(`    Reason: ${reduction.reason}`);
    console.log(`    Approved: ${reduction.approved ? 'Yes' : 'No'}`);
  }
}

/**
 * Example 3: Crisis Mode Execution
 */
async function example3_CrisisMode() {
  console.log('\n=== Example 3: Crisis Mode Execution ===\n');

  const manifest = loadManifest('deep-risk');
  if (!manifest) return;

  const processDir = path.join(__dirname, '..', '..', '..', 'processes', 'deep-risk');

  const provider = await initializeProvider({
    type: 'ollama',
    defaultModel: 'llama3',
  });

  // Crisis mode trigger in user input
  const context: ExecutionContext = {
    processId: 'deep-risk',
    processDir,
    userInput: `
URGENT: Production database is down!
Need immediate risk assessment for recovery options.
Everything is down, need this ASAP!
    `,
    depth: 'quick',
    crisisMode: false, // Will be auto-detected
  };

  console.log('Checking crisis mode detection...');
  console.log(`Crisis keywords: urgent, production, down, ASAP`);

  const result = await executeWorkflow(manifest, context, provider, {
    onStepStart: (stepId, stepName) => {
      console.log(`\n🚨 [CRISIS] ${stepId}: ${stepName}`);
    },
  });

  console.log('\nCrisis Mode Result:');
  console.log(`  Steps executed: ${result.steps.length}`);
  console.log(`  Total time: ${result.totalExecutionTime}ms`);
  console.log(`  Note: GATE_0 (GROUND) may be skipped in crisis mode`);
}

/**
 * Example 4: Multi-Depth Comparison
 */
async function example4_MultiDepth() {
  console.log('\n=== Example 4: Multi-Depth Comparison ===\n');

  const manifest = loadManifest('deep-risk');
  if (!manifest) return;

  const processDir = path.join(__dirname, '..', '..', '..', 'processes', 'deep-risk');

  const provider = await initializeProvider({
    type: 'ollama',
    defaultModel: 'llama3',
  });

  const userInput = 'Assess risks for cloud migration project';

  const depths: Array<'quick' | 'standard' | 'comprehensive'> = ['quick', 'standard', 'comprehensive'];

  console.log('Comparing execution across depths:\n');

  for (const depth of depths) {
    const context: ExecutionContext = {
      processId: 'deep-risk',
      processDir,
      userInput,
      depth,
      crisisMode: false,
    };

    console.log(`Depth: ${depth.toUpperCase()}`);
    console.log('  Expected characteristics:');

    switch (depth) {
      case 'quick':
        console.log('    - 1-2 hours execution time');
        console.log('    - Top 10 risks only');
        console.log('    - Basic scoring');
        console.log('    - May skip ERROR-level gates');
        break;
      case 'standard':
        console.log('    - Half day execution time');
        console.log('    - Full analysis');
        console.log('    - Interaction analysis');
        console.log('    - Complete portfolio view');
        break;
      case 'comprehensive':
        console.log('    - 1-2 days execution time');
        console.log('    - Everything + ergodicity');
        console.log('    - Stability analysis');
        console.log('    - META audit');
        break;
    }

    console.log('');
  }

  console.log('Note: Actual execution not run for demo (would take significant time)');
}

/**
 * Example 5: Step-by-Step Monitoring
 */
async function example5_StepMonitoring() {
  console.log('\n=== Example 5: Step-by-Step Monitoring ===\n');

  const manifest = loadManifest('deep-risk');
  if (!manifest) return;

  const processDir = path.join(__dirname, '..', '..', '..', 'processes', 'deep-risk');

  const provider = await initializeProvider({
    type: 'ollama',
    defaultModel: 'llama3',
  });

  const context: ExecutionContext = {
    processId: 'deep-risk',
    processDir,
    userInput: 'Risk assessment for API redesign',
    depth: 'quick',
    crisisMode: false,
  };

  // Detailed monitoring
  const stepMetrics: Array<{
    stepName: string;
    time: number;
    yamlBlocks: number;
    assumptions: number;
    gateStatus: string;
  }> = [];

  await executeWorkflow(manifest, context, provider, {
    onStepComplete: (stepResult: StepExecutionResult) => {
      stepMetrics.push({
        stepName: stepResult.stepName,
        time: stepResult.executionTime,
        yamlBlocks: stepResult.collectedData.metadata.yamlBlockCount,
        assumptions: stepResult.collectedData.assumptions.length,
        gateStatus: stepResult.gateResult?.status || 'N/A',
      });
    },
  });

  console.log('\nStep Execution Metrics:\n');
  console.log('┌─────────────────────┬────────┬────────┬──────────┬───────────┐');
  console.log('│ Step                │ Time   │ YAML   │ Assume.  │ Gate      │');
  console.log('├─────────────────────┼────────┼────────┼──────────┼───────────┤');

  for (const metric of stepMetrics) {
    const step = metric.stepName.padEnd(19);
    const time = `${metric.time}ms`.padEnd(6);
    const yaml = metric.yamlBlocks.toString().padEnd(6);
    const assumptions = metric.assumptions.toString().padEnd(8);
    const gate = metric.gateStatus.padEnd(9);

    console.log(`│ ${step} │ ${time} │ ${yaml} │ ${assumptions} │ ${gate} │`);
  }

  console.log('└─────────────────────┴────────┴────────┴──────────┴───────────┘');
}

/**
 * Run all examples
 */
async function main() {
  console.log('═'.repeat(60));
  console.log('Deep Process - Workflow Executor Examples');
  console.log('═'.repeat(60));

  try {
    // Note: These examples require:
    // 1. Ollama running locally (ollama serve)
    // 2. llama3 model installed (ollama pull llama3)
    // 3. Deep Process manifests in processes/

    // Uncomment to run (requires Ollama):
    // await example1_BasicExecution();
    // await example2_ScopeReduction();
    // await example3_CrisisMode();
    await example4_MultiDepth();
    // await example5_StepMonitoring();

    console.log('\n' + '═'.repeat(60));
    console.log('✅ Examples completed');
    console.log('═'.repeat(60) + '\n');
  } catch (error) {
    console.error('\n❌ Error running examples:', error);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
