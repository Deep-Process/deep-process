# Gate Validation Engine

**Status:** ✅ Phase 1, Milestone 1.2 - COMPLETE
**Version:** 1.0.0
**Date:** 2026-02-15

## Overview

The Gate Validation Engine enforces quality checkpoints during Deep Process execution. It prevents agents from proceeding to the next phase without satisfying binding conditions, ensuring rigorous analysis at every step.

## Key Features

✅ **Multi-Format Support** - Parses both deep-risk and deep-architect gates.yaml formats
✅ **Severity Levels** - BLOCKER, CRITICAL, ERROR, REQUIRED/WARNING
✅ **Gate Status Tracking** - OPEN (passed), LOCKED (failed), PENDING (not evaluated)
✅ **Scope Reduction Protocol** - Allows CRITICAL conditions to be skipped with approval
✅ **Counter-Checks** - Additional verification mechanisms (#85 Grounding, #168 Phantom Hunt, #84 Coherence)
✅ **Crisis Mode Detection** - Automatic detection of urgent/emergency situations
✅ **Output Collection** - Extracts structured data from LLM responses

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LLM Execution Output                     │
│  (Raw text + structured YAML blocks + markdown sections)   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Output Collector                          │
│  - Extract YAML blocks                                      │
│  - Parse markdown sections                                  │
│  - Identify assumptions, scope reductions                   │
│  - Collect checklists, patterns, risks                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Gate Validator                            │
│  - Load gates.yaml configuration                            │
│  - Evaluate conditions against output                       │
│  - Execute counter-checks                                   │
│  - Track gate status (OPEN/LOCKED/PENDING)                  │
│  - Enforce scope reduction protocol                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Gate Result                               │
│  - Passed: true/false                                       │
│  - Status: OPEN/LOCKED                                      │
│  - Condition results (✅/❌)                                 │
│  - Failure reasons                                          │
│  - Scope reductions                                         │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Basic Gate Validation

```typescript
import { GateValidator, OutputCollector } from '@deep-process/core';

// Initialize validator
const validator = new GateValidator();
validator.loadGatesConfig('processes/deep-risk/gates.yaml');

// Collect output from LLM
const collector = new OutputCollector();
const collected = collector.collect(llmRawOutput);

// Prepare execution output
const executionOutput = {
  data: collected.yaml,
  rawOutput: llmRawOutput,
  processId: 'deep-risk',
  phase: 'GROUND',
  assumptions: collected.assumptions,
};

// Evaluate gate
const result = await validator.evaluateGate('GATE_0', executionOutput, {
  depth: 'standard',
});

console.log(`Gate ${result.name}: ${result.status}`);
console.log(`Passed: ${result.passed}`);
```

### 2. With Scope Reduction Protocol

```typescript
const result = await validator.evaluateGate('GATE_0', executionOutput, {
  depth: 'quick',
  userApprovalCallback: async (reduction) => {
    console.log(`Scope reduction requested: ${reduction.itemSkipped}`);
    console.log(`Reason: ${reduction.reason}`);

    // Ask user for approval (in production, this would be interactive)
    return confirm('Approve scope reduction?');
  },
});

// Check scope reductions
for (const reduction of result.scopeReductions) {
  console.log(`Reduced: ${reduction.itemSkipped} - ${reduction.reason}`);
}
```

### 3. Output Collection

```typescript
import { collectOutput } from '@deep-process/core';

const llmOutput = `
# SCOPE_FRAME

\`\`\`yaml
subject: Project Name
boundaries: System boundaries
timeframe: 6 months
stakes: High
\`\`\`

## ASSUMPTIONS_DECLARED

- Assumption 1
- Assumption 2
- Assumption 3
`;

const collected = collectOutput(llmOutput);

console.log(`YAML blocks: ${collected.metadata.yamlBlockCount}`);
console.log(`Sections: ${collected.metadata.sectionCount}`);
console.log(`Assumptions: ${collected.assumptions.length}`);
```

## Gates Configuration Format

### Metadata

```yaml
metadata:
  version: "2.0.0"
  process: deep-risk
  gate_count: 8
  enforcement: binding
  description: |
    Binding gates prevent agent from proceeding without satisfying conditions.
```

### Gate Definition

```yaml
GATE_0:
  name: GROUND_COMPLETE
  phase: GROUND
  description: "Theoretical framing established"

  conditions:
    - id: G0-01
      condition: "Scope framed (subject, boundaries, timeframe, stakes)"
      severity: BLOCKER
      verification: "Check SCOPE_FRAME section exists with all 4 fields"
      failure_action: "HALT → complete scope framing"

    - id: G0-02
      condition: "Genesis sources scanned (6 sources)"
      severity: CRITICAL
      verification: "Check RISK_GENESIS_SCAN has ≥1 risk per source"
      failure_action: "IF depth=quick → SCOPE_REDUCTION. ELSE → return"

  counter_checks:
    - id: CC0-01
      method: "#85 Grounding Check"
      action: "Sample 3 genesis risks → verify source traceability"
      pass_criteria: "All 3 risks map to genesis source"
      fail_action: "BLOCKER → remove phantom risks"

  pass_criteria: "ALL BLOCKER + CRITICAL conditions met"
  state_on_pass: "OPEN"
  state_on_fail: "LOCKED"
```

## Severity Levels

| Severity | Description | Action | Scope Reduction |
|----------|-------------|--------|-----------------|
| **BLOCKER** | Absolute requirement | ABORT execution | ❌ Not allowed |
| **CRITICAL** | Must satisfy or reduce | HALT at current phase | ✅ With approval |
| **ERROR** | Flag but allow proceed | LOG warning | ✅ Silent |
| **REQUIRED** | Optional improvement | LOG info | ✅ Silent |

## Check Expression Syntax

The gate validator supports various check expressions:

### Field Existence

```yaml
verification: "scope_frame exists"
# Checks: executionOutput.data.scope_frame !== undefined
```

### Length Checks

```yaml
verification: "assumptions_declared.length >= 3"
# Checks: assumptions_declared array has at least 3 items
```

### Value in Set

```yaml
verification: "execution_mode in [iterative, waterfall, hybrid]"
# Checks: execution_mode is one of the allowed values
```

### Equality Checks

```yaml
verification: "gate_blocking == true"
# Checks: gate_blocking === true
```

### Numeric Comparisons

```yaml
verification: "confidence_score >= 0.75"
# Checks: confidence_score >= 0.75
```

### Nested Fields

```yaml
verification: "system_profile.complexity_level exists"
# Checks: nested field system_profile.complexity_level exists
```

## Scope Reduction Protocol

When a CRITICAL condition fails, the agent can declare a scope reduction:

```typescript
interface ScopeReduction {
  gate: string;                    // "GATE_0"
  itemSkipped: string;             // "G0-02"
  reason: string;                  // Why reduced
  impactAssessment: string;        // What is lost
  completenessCost?: string;       // Quality degradation
  requiresUserApproval: boolean;   // true for CRITICAL
  approved: boolean;               // User's decision
}
```

**Rules:**
- BLOCKER conditions **cannot** be reduced (no exceptions)
- CRITICAL conditions **can** be reduced with user approval
- ERROR conditions **can** be reduced silently (if depth permits)
- Reductions must include: reason, impact assessment, completeness cost

## Counter-Checks

Counter-checks are additional verification mechanisms that execute after conditions:

### #85 Grounding Check
Verifies that risks/findings have concrete sources (not hallucinated).

```yaml
- id: CC0-01
  method: "#85 Grounding Check"
  action: "Sample 3 risks → verify each has source traceability"
  pass_criteria: "All 3 risks map to source"
  fail_action: "BLOCKER → remove phantom risks"
```

### #168 Phantom Hunt
Re-scans for hallucinated elements (phantoms).

```yaml
- id: CC0-02
  method: "#168 Phantom Hunt"
  action: "Re-scan scope → verify no out-of-scope elements"
  pass_criteria: "0 out-of-scope elements found"
  fail_action: "ERROR → flag scope drift"
```

### #84 Coherence Check
Verifies internal consistency (no contradictions).

```yaml
- id: CC0-03
  method: "#84 Coherence Check"
  action: "Verify stakes coherent with timeframe + boundaries"
  pass_criteria: "No contradictions found"
  fail_action: "WARNING → resolve contradiction"
```

## Crisis Mode

Crisis mode automatically activates when user input contains trigger keywords:

**Triggers:** `urgent`, `emergency`, `crisis`, `incident`, `already failed`, `happening now`, `production`, `deadline tomorrow`, `no time`, `everything is down`, `critical outage`

**Modifications when activated:**
- Skip GATE_0 (ground phase)
- Focus on GATE_1, GATE_5, GATE_6 (identify, mitigate, monitor)
- Prioritize MITIGATE + MONITOR over QUANTIFY + INTERACT
- Add "Crisis Response" section to report

```typescript
if (validator.shouldActivateCrisisMode(userInput)) {
  console.log('🚨 Crisis mode ACTIVATED');
  // Adjust workflow accordingly
}
```

## Output Collector Features

### Extracted Data Types

| Type | Description | Example |
|------|-------------|---------|
| **YAML blocks** | Code blocks with ```yaml | `scope_frame`, `risks` |
| **Sections** | Markdown headings | `# ASSUMPTIONS_DECLARED` |
| **Assumptions** | Declared assumptions list | Numbered/bulleted lists |
| **Scope reductions** | SCOPE_REDUCTION blocks | Reduction declarations |
| **Patterns** | Pattern references | `AAP-001`, `RP-005` |
| **Checklists** | Status markers | `[PASS]`, `[FAIL]`, `[SCOPE_REDUCED]` |
| **Risks** | Risk data (deep-risk) | Risk registers |

### Utility Methods

```typescript
const collector = new OutputCollector();
const collected = collector.collect(llmOutput);

// Check if section exists
const hasAssumptions = collector.hasSection(collected, 'assumptions_declared');

// Get field count
const assumptionCount = collector.getFieldCount(collected, 'assumptions_declared');

// Access structured data
const scopeFrame = collected.yaml.scope_frame;
const assumptions = collected.assumptions;
const patterns = collected.patterns;
```

## API Reference

### GateValidator

```typescript
class GateValidator {
  // Load gates configuration
  loadGatesConfig(gatesPath: string): void;

  // Evaluate a gate
  async evaluateGate(
    gateId: string,
    executionOutput: ExecutionOutput,
    options?: {
      depth?: 'quick' | 'standard' | 'comprehensive' | 'critical';
      skipErrorConditions?: boolean;
      userApprovalCallback?: (reduction: ScopeReduction) => Promise<boolean>;
    }
  ): Promise<GateResult>;

  // Get gate status
  getGateStatus(gateId: string): GateStatus;

  // Get all gate statuses
  getAllGateStatuses(): Map<string, GateStatus>;

  // Get scope reductions
  getScopeReductions(): ScopeReduction[];

  // Check crisis mode
  shouldActivateCrisisMode(userInput: string): boolean;

  // Reset state
  reset(): void;
}
```

### OutputCollector

```typescript
class OutputCollector {
  // Collect structured data
  collect(rawOutput: string): CollectedOutput;

  // Check if section exists
  hasSection(output: CollectedOutput, sectionName: string): boolean;

  // Get field count
  getFieldCount(output: CollectedOutput, fieldPath: string): number;
}
```

### Convenience Functions

```typescript
// Validate gate (one-liner)
const result = await validateGate(
  gatesPath,
  gateId,
  executionOutput,
  options
);

// Collect output (one-liner)
const collected = collectOutput(rawLLMOutput);
```

## Integration with Deep Processes

### deep-risk Process

```typescript
// Load deep-risk gates
validator.loadGatesConfig('processes/deep-risk/gates.yaml');

// Validate each phase gate
await validator.evaluateGate('GATE_0', output); // GROUND phase
await validator.evaluateGate('GATE_1', output); // IDENTIFY_VERTICAL
await validator.evaluateGate('GATE_2', output); // IDENTIFY_HORIZONTAL
await validator.evaluateGate('GATE_3', output); // QUANTIFY
await validator.evaluateGate('GATE_4', output); // INTERACT
await validator.evaluateGate('GATE_5', output); // MITIGATE
await validator.evaluateGate('GATE_6', output); // MONITOR
await validator.evaluateGate('GATE_7', output); // OUTPUT
```

### deep-architect Process

```typescript
// Load deep-architect gates
validator.loadGatesConfig('processes/deep-architect/data/gates.yaml');

// Validate each phase gate
await validator.evaluateGate('GATE_0', output); // Context Assessment
await validator.evaluateGate('GATE_1', output); // Canonical Operations
await validator.evaluateGate('GATE_2', output); // Artifact Generation
await validator.evaluateGate('GATE_3', output); // ADVERSARY
await validator.evaluateGate('GATE_4', output); // Trade-off Analysis
await validator.evaluateGate('GATE_5', output); // Validation
await validator.evaluateGate('GATE_6', output); // Verification
```

## Testing

```bash
# Run unit tests
cd packages/core
pnpm test

# Run specific test file
pnpm test gate-validator.test.ts

# Run with coverage
pnpm test --coverage
```

## Examples

See `packages/core/examples/gate-validation-example.ts` for complete working examples:

1. Basic gate validation
2. Scope reduction protocol
3. Output collection
4. Crisis mode detection
5. Full validation pipeline

## Troubleshooting

### Gate fails with "Field does not exist"

Check that your LLM output includes the required YAML blocks:

```typescript
const collected = collectOutput(llmOutput);
console.log('YAML blocks:', Object.keys(collected.yaml));
console.log('Sections:', Object.keys(collected.sections));
```

### Scope reduction not working

Ensure you provide a `userApprovalCallback`:

```typescript
const result = await validator.evaluateGate('GATE_0', output, {
  userApprovalCallback: async (reduction) => {
    // Return true to approve, false to reject
    return true;
  },
});
```

### Counter-checks always pass

Counter-checks currently return placeholder results. Implement custom counter-check logic by extending the `GateValidator` class:

```typescript
class CustomGateValidator extends GateValidator {
  protected async executeCounterCheck(counterCheck, executionOutput) {
    // Your custom logic here
    return {
      id: counterCheck.id,
      method: counterCheck.method,
      passed: true, // Your evaluation
      passCriteria: counterCheck.pass_criteria,
    };
  }
}
```

## Next Steps (Phase 1)

- ✅ **Milestone 1.1:** Provider Abstraction - COMPLETE
- ✅ **Milestone 1.2:** Gate Validation Engine - COMPLETE
- ⏳ **Milestone 1.3:** Workflow Executor (Week 3-4)
  - Load manifest.yaml → workflow.md → steps/*.md
  - Progressive step loading
  - Execute via provider abstraction
  - Validate gates after each step
- ⏳ **Milestone 1.4:** MCP Server Package (Week 5-8)
- ⏳ **Milestone 1.5:** Publishing & Integration (Week 9-12)

## License

MIT - See root LICENSE file

## Contributing

See root CONTRIBUTING.md for contribution guidelines.
