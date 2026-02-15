# Workflow Executor

**Status:** ✅ Phase 1, Milestone 1.3 - COMPLETE
**Version:** 1.0.0
**Date:** 2026-02-15

## Overview

The Workflow Executor orchestrates complete Deep Process executions from start to finish. It loads manifest and step files, executes them sequentially via LLM providers, validates gates after each step, and handles scope reductions and crisis modes.

## Key Features

✅ **Manifest-Driven** - Loads process configuration from manifest.yaml
✅ **Progressive Step Loading** - One step at a time, no look-ahead
✅ **Multi-Provider Support** - Works with any LLM provider (OpenAI, Anthropic, Ollama)
✅ **Gate Validation** - Automatic gate evaluation after each step
✅ **Scope Reduction** - Handles CRITICAL condition failures with user approval
✅ **Crisis Mode** - Auto-detects urgent situations and adjusts workflow
✅ **Event Callbacks** - Hooks for step start/complete, gate evaluation
✅ **Comprehensive Results** - Structured output with all execution data

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Input + Context                     │
│  (Brief, depth selection, crisis detection)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Workflow Executor                         │
│  - Load manifest.yaml                                       │
│  - Get step sequence (step-00, step-01, ...)               │
│  - For each step:                                           │
│    1. Load step file (frontmatter + content)                │
│    2. Format as LLM prompt                                  │
│    3. Execute via provider                                  │
│    4. Collect output                                        │
│    5. Validate gate                                         │
│    6. Handle scope reductions                               │
│    7. Check if should proceed                               │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬───────────────┐
        ▼            ▼            ▼               ▼
┌─────────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────┐
│   Provider  │ │  Output  │ │    Gate    │ │  Final       │
│ Abstraction │ │Collector │ │ Validator  │ │  Result      │
└─────────────┘ └──────────┘ └────────────┘ └──────────────┘
```

## Quick Start

### 1. Basic Workflow Execution

```typescript
import {
  executeWorkflow,
  initializeProvider,
  loadManifest,
  type ExecutionContext,
} from '@deep-process/core';

// Load manifest
const manifest = loadManifest('deep-risk');

// Initialize provider
const provider = await initializeProvider({
  type: 'ollama',
  defaultModel: 'llama3',
});

// Prepare context
const context: ExecutionContext = {
  processId: 'deep-risk',
  processDir: 'processes/deep-risk',
  userInput: 'Assess risks for our cloud migration project',
  depth: 'standard',
  crisisMode: false,
};

// Execute workflow
const result = await executeWorkflow(manifest, context, provider);

console.log(`Success: ${result.success}`);
console.log(`Steps: ${result.steps.length}`);
console.log(`Time: ${result.totalExecutionTime}ms`);
```

### 2. With Event Callbacks

```typescript
const result = await executeWorkflow(manifest, context, provider, {
  onStepStart: (stepId, stepName) => {
    console.log(`Starting: ${stepName}`);
  },
  onStepComplete: (stepResult) => {
    console.log(`Completed: ${stepResult.stepName}`);
    console.log(`  Time: ${stepResult.executionTime}ms`);
    console.log(`  Gate: ${stepResult.gateResult?.status}`);
  },
  onGateEvaluation: (gateResult) => {
    console.log(`Gate: ${gateResult.name} - ${gateResult.status}`);
  },
});
```

### 3. With Scope Reduction Approval

```typescript
const result = await executeWorkflow(manifest, context, provider, {
  userApprovalCallback: async (reduction) => {
    console.log(`Scope reduction requested:`);
    console.log(`  Gate: ${reduction.gate}`);
    console.log(`  Item: ${reduction.itemSkipped}`);
    console.log(`  Reason: ${reduction.reason}`);
    console.log(`  Impact: ${reduction.impactAssessment}`);

    // Ask user for approval (or auto-approve based on policy)
    return confirm('Approve this scope reduction?');
  },
});

// Check what was reduced
for (const reduction of result.allScopeReductions) {
  console.log(`Reduced: ${reduction.itemSkipped}`);
}
```

## Process Structure

### Manifest (manifest.yaml)

```yaml
id: deep-risk
name: "Deep Risk"
version: "2.2.0"
description: "Systematic risk assessment..."
workflowFile: "workflow.md"
firstStepFile: "steps/step-00-ground.md"
firstStepLabel: "Phase 0"
agentName: "Deep Risk Agent"
slashCommand: "deep-risk"
```

### Workflow (workflow.md)

```markdown
# Deep-Risk Execution Program

## INVOCATION
User selects depth: quick | standard | comprehensive | critical

## CRISIS_DETECTION
Auto-detect urgent keywords: urgent, emergency, crisis, production, etc.

## EXECUTION SEQUENCE
1. Load step-00-ground.md
2. Execute enforced sequence
3. Evaluate GATE_0
4. If PASS → proceed to step-01
5. If FAIL (BLOCKER) → HALT
6. If FAIL (CRITICAL) → SCOPE_REDUCTION or fix
```

### Step File (step-00-ground.md)

```markdown
---
step: 0
name: GROUND
phase: GROUND
gate: GATE_0
outputs:
  - SCOPE_FRAME
  - ASSUMPTIONS_DECLARED
---

# Step 00: GROUND

## ASSUMPTIONS_DECLARED (MANDATORY)
[Assumptions must be declared before proceeding...]

## ENFORCED SEQUENCE

### 0.1 Frame Assessment Scope
[Instructions for framing scope...]

### 0.2 Risk Genesis Model
[Instructions for genesis scan...]
```

## Execution Depths

| Depth | Time | Focus | Gates |
|-------|------|-------|-------|
| **Quick** | 1-2h | Top 10 risks, basic scoring | Skip ERROR gates |
| **Standard** | Half day | Full analysis, interactions | All gates |
| **Comprehensive** | 1-2 days | + Ergodicity, META audit | All gates + extras |
| **Critical** | Multi-day | Maximum rigor, chaos probes | All gates + validation |

## Execution Context

```typescript
interface ExecutionContext {
  /** Process ID (e.g., 'deep-risk') */
  processId: string;

  /** Process directory path */
  processDir: string;

  /** User input/brief */
  userInput: string;

  /** Execution depth */
  depth: 'quick' | 'standard' | 'comprehensive' | 'critical';

  /** Crisis mode enabled */
  crisisMode: boolean;

  /** Context files (for integration with other processes) */
  contextFiles?: string[];

  /** Additional parameters */
  parameters?: Record<string, any>;
}
```

## Workflow Execution Result

```typescript
interface WorkflowExecutionResult {
  /** Process ID */
  processId: string;

  /** Execution successful */
  success: boolean;

  /** Step results (array) */
  steps: StepExecutionResult[];

  /** Total execution time (ms) */
  totalExecutionTime: number;

  /** Final combined output */
  finalOutput: string;

  /** All collected data from steps */
  allCollectedData: CollectedOutput[];

  /** All scope reductions */
  allScopeReductions: ScopeReduction[];

  /** Error (if failed) */
  error?: string;
}
```

## Step Execution Result

```typescript
interface StepExecutionResult {
  /** Step ID (e.g., 'step-00-ground') */
  stepId: string;

  /** Step name (e.g., 'GROUND') */
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
```

## Crisis Mode

**Auto-Detection Triggers:**
- `urgent`, `emergency`, `crisis`, `incident`
- `already failed`, `happening now`, `in production`
- `deadline tomorrow`, `no time`
- `everything is down`, `critical outage`

**Effect When Activated:**
- Skip GATE_0 (GROUND phase)
- Focus on GATE_1, GATE_5, GATE_6 (identify, mitigate, monitor)
- Deprioritize GATE_3, GATE_4 (quantify, interact)
- Add "Crisis Response" section to report

```typescript
// Manual crisis mode
const context: ExecutionContext = {
  processId: 'deep-risk',
  processDir: '...',
  userInput: 'Normal input',
  depth: 'quick',
  crisisMode: true, // Manually enabled
};

// Auto-detected crisis mode
const context: ExecutionContext = {
  processId: 'deep-risk',
  processDir: '...',
  userInput: 'URGENT: Production is down!', // Auto-detected
  depth: 'quick',
  crisisMode: false, // Will be set to true automatically
};
```

## Step Loading

The executor loads steps progressively (one at a time):

```typescript
// Step sequence determined from files
const steps = [
  'step-00-ground.md',
  'step-01-identify-vertical.md',
  'step-02-identify-horizontal.md',
  'step-03-quantify.md',
  'step-04-interact.md',
  'step-05-mitigate.md',
  'step-06-monitor.md',
  'step-07-output.md',
];

// Load one step
const stepContent = loadStep(processDir, 'step-00-ground.md');

// Returns:
// {
//   metadata: { step: 0, name: 'GROUND', phase: 'GROUND', gate: 'GATE_0', ... },
//   content: 'Markdown content without frontmatter',
//   filePath: '/path/to/step-00-ground.md',
//   stepId: 'step-00-ground'
// }
```

## Prompt Formatting

Steps are formatted as LLM prompts with:

1. **User Request** - Original user input
2. **Execution Context** - Process, depth, step, goal
3. **Previous Steps Summary** - Context from last 2 steps
4. **Step Instructions** - Full step content

```
# User Request

Assess risks for our cloud migration project

---

# Execution Context

- Process: deep-risk
- Depth: standard
- Step: 0 - GROUND
- Goal: Establish theoretical framing BEFORE searching for risks

---

# Previous Steps Summary

(Empty for first step, includes key outputs for subsequent steps)

---

# Step Instructions

[Full step markdown content...]
```

## Event Callbacks

### onStepStart

Called when a step begins execution:

```typescript
onStepStart: (stepId: string, stepName: string) => {
  console.log(`Starting: ${stepId} (${stepName})`);
  // Log to file, update UI, send notification, etc.
}
```

### onStepComplete

Called when a step completes (success or failure):

```typescript
onStepComplete: (stepResult: StepExecutionResult) => {
  console.log(`Completed: ${stepResult.stepName}`);
  console.log(`  Success: ${stepResult.success}`);
  console.log(`  Time: ${stepResult.executionTime}ms`);
  console.log(`  YAML blocks: ${stepResult.collectedData.metadata.yamlBlockCount}`);

  if (stepResult.gateResult) {
    console.log(`  Gate: ${stepResult.gateResult.status}`);
  }
}
```

### onGateEvaluation

Called when a gate is evaluated:

```typescript
onGateEvaluation: (gateResult: GateResult) => {
  const icon = gateResult.passed ? '✅' : '❌';
  console.log(`${icon} Gate: ${gateResult.name} - ${gateResult.status}`);

  if (!gateResult.passed) {
    console.log(`Failures: ${gateResult.failureReasons.length}`);
    for (const reason of gateResult.failureReasons) {
      console.log(`  - ${reason}`);
    }
  }
}
```

### userApprovalCallback

Called when a CRITICAL gate condition fails and scope reduction is requested:

```typescript
userApprovalCallback: async (reduction: ScopeReduction) => {
  // Show reduction details to user
  console.log(`Scope reduction requested:`);
  console.log(`  Gate: ${reduction.gate}`);
  console.log(`  Item: ${reduction.itemSkipped}`);
  console.log(`  Reason: ${reduction.reason}`);
  console.log(`  Impact: ${reduction.impactAssessment}`);

  // Get approval (interactive or policy-based)
  const approved = await promptUser('Approve?');

  return approved; // true = approve, false = reject
}
```

## Error Handling

### Step Failure

If a step fails (LLM error, provider error):

```typescript
const result = await executeWorkflow(...);

if (!result.success) {
  console.error(`Workflow failed: ${result.error}`);

  // Check which step failed
  const failedStep = result.steps.find(s => !s.success);
  if (failedStep) {
    console.error(`Failed step: ${failedStep.stepName}`);
    console.error(`Error: ${failedStep.error}`);
  }
}
```

### Gate Locked (BLOCKER)

If a gate has BLOCKER failures:

```typescript
const result = await executeWorkflow(...);

if (!result.success && result.error?.includes('BLOCKER')) {
  console.error('Gate LOCKED with BLOCKER failures');

  // Find the locked gate
  const lockedStep = result.steps.find(
    s => s.gateResult?.status === 'LOCKED'
  );

  if (lockedStep?.gateResult) {
    console.error(`Gate: ${lockedStep.gateResult.gateId}`);
    console.error('Failures:');
    for (const reason of lockedStep.gateResult.failureReasons) {
      console.error(`  - ${reason}`);
    }
  }
}
```

## Integration with Other Milestones

### Provider Abstraction (Milestone 1.1)

```typescript
// Uses provider abstraction for LLM execution
import { initializeProvider } from '@deep-process/core';

const provider = await initializeProvider({
  type: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: 'claude-3-5-sonnet-20241022',
});

const result = await executeWorkflow(manifest, context, provider);
```

### Gate Validation (Milestone 1.2)

```typescript
// Automatically validates gates after each step
const result = await executeWorkflow(...);

for (const step of result.steps) {
  if (step.gateResult) {
    console.log(`${step.stepName}: Gate ${step.gateResult.status}`);
  }
}
```

### Output Collection (Milestone 1.2)

```typescript
// Automatically collects structured data
const result = await executeWorkflow(...);

for (const step of result.steps) {
  const data = step.collectedData;

  console.log(`YAML blocks: ${data.metadata.yamlBlockCount}`);
  console.log(`Assumptions: ${data.assumptions.length}`);
  console.log(`Patterns: ${data.patterns.length}`);
}
```

## API Reference

### WorkflowExecutor

```typescript
class WorkflowExecutor {
  async executeWorkflow(
    manifest: ProcessManifest,
    context: ExecutionContext,
    provider: LLMProvider,
    options?: {
      onStepStart?: (stepId: string, stepName: string) => void;
      onStepComplete?: (result: StepExecutionResult) => void;
      onGateEvaluation?: (gateResult: GateResult) => void;
      userApprovalCallback?: (reduction: ScopeReduction) => Promise<boolean>;
    }
  ): Promise<WorkflowExecutionResult>;

  reset(): void;
}
```

### Convenience Function

```typescript
async function executeWorkflow(
  manifest: ProcessManifest,
  context: ExecutionContext,
  provider: LLMProvider,
  options?: ...
): Promise<WorkflowExecutionResult>;
```

## Examples

See `packages/core/examples/workflow-executor-example.ts` for complete examples:

1. Basic workflow execution
2. Workflow with scope reduction
3. Crisis mode execution
4. Multi-depth comparison
5. Step-by-step monitoring

## Best Practices

### 1. Always Provide Context

```typescript
const context: ExecutionContext = {
  processId: 'deep-risk',
  processDir: path.join(__dirname, 'processes', 'deep-risk'),
  userInput: `
    Detailed project description here.
    Include: scope, timeline, stakes, constraints.
  `,
  depth: 'standard',
  crisisMode: false,
};
```

### 2. Use Appropriate Depth

- **Quick:** Time-sensitive, high-level view
- **Standard:** Most projects, balanced depth
- **Comprehensive:** Critical projects, deep analysis
- **Critical:** Life-safety, existential risks

### 3. Handle Scope Reductions

Always provide `userApprovalCallback` for production:

```typescript
userApprovalCallback: async (reduction) => {
  // Log reduction request
  logger.info('Scope reduction requested', { reduction });

  // Check policy (auto-approve ERROR, require approval for CRITICAL)
  if (reduction.requiresUserApproval) {
    return await askUser(reduction);
  }

  return true; // Auto-approve
}
```

### 4. Monitor Execution

Use callbacks for monitoring:

```typescript
const metrics = {
  stepsCompleted: 0,
  totalTime: 0,
  gatesPassed: 0,
};

await executeWorkflow(manifest, context, provider, {
  onStepComplete: (result) => {
    metrics.stepsCompleted++;
    metrics.totalTime += result.executionTime;
  },
  onGateEvaluation: (gate) => {
    if (gate.passed) metrics.gatesPassed++;
  },
});

console.log('Metrics:', metrics);
```

## Troubleshooting

### "Manifest not found"

Ensure process directory contains `manifest.yaml`:

```bash
ls processes/deep-risk/manifest.yaml
```

### "No steps found"

Check that `steps/` directory exists with step files:

```bash
ls processes/deep-risk/steps/
# Should show: step-00-ground.md, step-01-identify-vertical.md, etc.
```

### "Provider not initialized"

Initialize provider before executing:

```typescript
const provider = await initializeProvider({
  type: 'ollama',
  defaultModel: 'llama3',
});

// Then execute
const result = await executeWorkflow(manifest, context, provider);
```

### "Gate LOCKED"

Check BLOCKER failures:

```typescript
const lockedGate = result.steps.find(s => s.gateResult?.status === 'LOCKED');

if (lockedGate) {
  console.log('BLOCKER failures:');
  for (const reason of lockedGate.gateResult.failureReasons) {
    if (reason.includes('BLOCKER')) {
      console.log(`  - ${reason}`);
    }
  }
}
```

## Next Steps (Phase 1)

- ✅ **Milestone 1.1:** Provider Abstraction - COMPLETE
- ✅ **Milestone 1.2:** Gate Validation Engine - COMPLETE
- ✅ **Milestone 1.3:** Workflow Executor - COMPLETE
- ⏳ **Milestone 1.4:** MCP Server Package (Week 5-8)
  - Expose workflows as MCP tools
  - Integrate with Claude Desktop, Azure AI Foundry
- ⏳ **Milestone 1.5:** Publishing & Integration (Week 9-12)

## License

MIT - See root LICENSE file

## Contributing

See root CONTRIBUTING.md for contribution guidelines.
