/**
 * Gate Validation Engine - Usage Examples
 *
 * Demonstrates how to use the gate validation system for
 * enforcing quality checkpoints during Deep Process execution.
 */

import {
  GateValidator,
  OutputCollector,
  validateGate,
  type ExecutionOutput,
  type GateResult,
  type ScopeReduction,
} from '../src/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Example 1: Basic Gate Validation
 */
async function example1_BasicValidation() {
  console.log('\n=== Example 1: Basic Gate Validation ===\n');

  const validator = new GateValidator();

  // Load gates configuration
  const gatesPath = path.join(__dirname, '..', '..', '..', 'processes', 'deep-risk', 'gates.yaml');
  validator.loadGatesConfig(gatesPath);

  console.log('Gates loaded:', Object.keys(validator.getGatesConfig()?.gates || {}).join(', '));

  // Prepare execution output (simulating LLM response)
  const executionOutput: ExecutionOutput = {
    data: {
      scope_frame: {
        subject: 'E-commerce Platform Redesign',
        boundaries: 'Frontend + API layer, excluding payment gateway',
        timeframe: '6 months (Q2-Q3 2026)',
        stakes: 'Critical - $5M annual revenue at risk',
      },
      risk_genesis_scan: [
        { source: 'complexity', risks: ['High component count', 'Deep nesting'] },
        { source: 'coupling', risks: ['Tight integration', 'Shared state'] },
        { source: 'uncertainty', risks: ['New technology stack'] },
        { source: 'agency', risks: ['Third-party dependencies'] },
        { source: 'temporality', risks: ['Technical debt accumulation'] },
        { source: 'boundaries', risks: ['API contract changes'] },
      ],
      system_profile: {
        complexity_level: 'High',
        coupling_level: 'Medium',
        rationale: 'Perrow matrix: Complex Interactions + Medium Coupling',
      },
      uncertainty_map: [
        { type: 'risk', items: 'Known technical risks' },
        { type: 'uncertainty', items: 'Market adoption unknowns' },
        { type: 'ambiguity', items: 'Regulatory changes' },
      ],
      assumptions_declared: [
        'User traffic growth remains within 20% of forecast',
        'Third-party APIs maintain 99.9% SLA',
        'Team composition stable for duration',
        'Budget approved and available',
      ],
    },
    rawOutput: 'Mock LLM output with structured sections',
    processId: 'deep-risk',
    phase: 'GROUND',
  };

  // Evaluate GATE_0 (GROUND_COMPLETE)
  const result = await validator.evaluateGate('GATE_0', executionOutput, {
    depth: 'standard',
    skipErrorConditions: false,
  });

  console.log(`Gate: ${result.name} (${result.gateId})`);
  console.log(`Status: ${result.status}`);
  console.log(`Passed: ${result.passed}`);
  console.log(`Conditions evaluated: ${result.conditions.length}`);

  // Show condition results
  for (const condition of result.conditions) {
    const icon = condition.passed ? '✅' : '❌';
    console.log(`  ${icon} ${condition.id}: ${condition.description} [${condition.severity}]`);
    if (!condition.passed) {
      console.log(`     Failed: ${condition.failureMessage}`);
    }
  }

  if (result.failureReasons.length > 0) {
    console.log('\nFailure reasons:');
    for (const reason of result.failureReasons) {
      console.log(`  - ${reason}`);
    }
  }
}

/**
 * Example 2: Scope Reduction Protocol
 */
async function example2_ScopeReduction() {
  console.log('\n=== Example 2: Scope Reduction Protocol ===\n');

  const validator = new GateValidator();
  const gatesPath = path.join(__dirname, '..', '..', '..', 'processes', 'deep-risk', 'gates.yaml');
  validator.loadGatesConfig(gatesPath);

  // Incomplete output (missing some CRITICAL fields)
  const incompleteOutput: ExecutionOutput = {
    data: {
      scope_frame: {
        subject: 'Quick Risk Assessment',
        // Missing: boundaries, timeframe, stakes
      },
      assumptions_declared: ['Assumption 1', 'Assumption 2', 'Assumption 3'],
    },
    rawOutput: 'Incomplete output',
    processId: 'deep-risk',
  };

  // Evaluate with user approval callback
  const result = await validator.evaluateGate('GATE_0', incompleteOutput, {
    depth: 'quick', // Quick depth allows some reductions
    userApprovalCallback: async (reduction: ScopeReduction) => {
      console.log('\n📋 Scope Reduction Request:');
      console.log(`  Gate: ${reduction.gate}`);
      console.log(`  Item: ${reduction.itemSkipped}`);
      console.log(`  Reason: ${reduction.reason}`);
      console.log(`  Impact: ${reduction.impactAssessment}`);
      console.log(`  Requires approval: ${reduction.requiresUserApproval}`);

      // Auto-approve for demo
      const approved = true;
      console.log(`  Decision: ${approved ? 'APPROVED ✅' : 'REJECTED ❌'}`);

      return approved;
    },
  });

  console.log(`\nGate status: ${result.status}`);
  console.log(`Scope reductions: ${result.scopeReductions.length}`);

  for (const reduction of result.scopeReductions) {
    console.log(`  - ${reduction.itemSkipped}: ${reduction.reason}`);
  }
}

/**
 * Example 3: Output Collection
 */
function example3_OutputCollection() {
  console.log('\n=== Example 3: Output Collection ===\n');

  const collector = new OutputCollector();

  const llmOutput = `
# Deep Risk Assessment - GROUND Phase

## SCOPE_FRAME

\`\`\`yaml
subject: Mobile Banking App Security Audit
boundaries: Mobile app + backend API, excluding core banking systems
timeframe: 3 months
stakes: High - regulatory compliance + customer trust
\`\`\`

## RISK_GENESIS_SCAN

Detected 12 risks across 6 sources:

\`\`\`yaml
- source: complexity
  risks:
    - R-001: Complex state management
    - R-002: Deep navigation hierarchy
- source: coupling
  risks:
    - R-003: Tight coupling to backend API
    - R-004: Shared authentication state
- source: uncertainty
  risks:
    - R-005: OS version fragmentation
    - R-006: Device capabilities vary
\`\`\`

## ASSUMPTIONS_DECLARED

1. App store approval process remains stable
2. Backend API maintains backwards compatibility
3. User base grows <30% during audit period
4. Regulatory requirements don't change mid-audit

## Pattern Detection

Detected architecture patterns:
- AAP-012 (God Activity anti-pattern) - confidence: 0.82
- RP-023 (Data leakage risk) - confidence: 0.91

## POST_PHASE_CHECKLIST

- [PASS] Scope framed with all 4 fields
- [PASS] Genesis scan complete (6/6 sources)
- [PASS] System characterized (Perrow matrix)
- [PASS] Uncertainty classified (3 types)
- [PASS] Assumptions declared (4 assumptions)
  `;

  const collected = collector.collect(llmOutput);

  console.log('📊 Collection Results:');
  console.log(`  Word count: ${collected.metadata.wordCount}`);
  console.log(`  Sections: ${collected.metadata.sectionCount}`);
  console.log(`  YAML blocks: ${collected.metadata.yamlBlockCount}`);
  console.log(`  Assumptions: ${collected.assumptions.length}`);
  console.log(`  Patterns: ${collected.patterns.length}`);
  console.log(`  Checklists: ${collected.checklists.length}`);

  console.log('\n📝 Extracted Assumptions:');
  for (const assumption of collected.assumptions) {
    console.log(`  - ${assumption}`);
  }

  console.log('\n🔍 Detected Patterns:');
  for (const pattern of collected.patterns) {
    console.log(
      `  - ${pattern.id} [${pattern.type}]${pattern.confidence ? ` confidence: ${pattern.confidence}` : ''}`
    );
  }

  console.log('\n✅ Checklist Status:');
  if (collected.checklists.length > 0) {
    const checklist = collected.checklists[0];
    for (const item of checklist.items) {
      const icon = item.status === 'PASS' ? '✅' : item.status === 'FAIL' ? '❌' : '⏳';
      console.log(`  ${icon} ${item.text}`);
    }
  }
}

/**
 * Example 4: Crisis Mode Detection
 */
function example4_CrisisMode() {
  console.log('\n=== Example 4: Crisis Mode Detection ===\n');

  const validator = new GateValidator();
  const gatesPath = path.join(__dirname, '..', '..', '..', 'processes', 'deep-risk', 'gates.yaml');
  validator.loadGatesConfig(gatesPath);

  const testInputs = [
    'We need a comprehensive risk assessment for Q2',
    'URGENT: Production outage, need risk analysis ASAP',
    'Emergency security breach, analyze risks immediately',
    'Crisis situation - everything is down',
    'System already failed, need post-mortem risk analysis',
  ];

  console.log('Testing crisis mode detection:\n');

  for (const input of testInputs) {
    const isCrisis = validator.shouldActivateCrisisMode(input);
    const icon = isCrisis ? '🚨' : '📋';
    console.log(`${icon} "${input}"`);
    console.log(`   Crisis mode: ${isCrisis ? 'ACTIVATED' : 'Normal'}\n`);
  }

  const config = validator.getGatesConfig();
  if (config?.crisis_mode) {
    console.log('Crisis mode configuration:');
    console.log(`  Enabled: ${config.crisis_mode.enabled}`);
    console.log(`  Triggers: ${config.crisis_mode.triggers.slice(0, 5).join(', ')}...`);
    console.log(`  Modifications: ${config.crisis_mode.modifications.length} changes applied`);
  }
}

/**
 * Example 5: Full Gate Validation Pipeline
 */
async function example5_FullPipeline() {
  console.log('\n=== Example 5: Full Gate Validation Pipeline ===\n');

  // Step 1: Collect output from LLM
  const collector = new OutputCollector();
  const llmResponse = `
# GATE_0 Validation

## SCOPE_FRAME

\`\`\`yaml
subject: Cloud Migration Risk Assessment
boundaries: Application layer + data layer, excluding network infrastructure
timeframe: 9 months (Q1-Q3 2026)
stakes: Critical - $10M infrastructure investment
\`\`\`

## ASSUMPTIONS_DECLARED

\`\`\`yaml
- Cloud provider maintains 99.99% SLA
- Migration team fully staffed
- Budget approved and committed
- No major regulatory changes during migration
\`\`\`

## Other sections...
  `;

  console.log('Step 1: Collecting output...');
  const collected = collector.collect(llmResponse);
  console.log(`  ✅ Collected ${collected.metadata.yamlBlockCount} YAML blocks`);

  // Step 2: Prepare execution output
  const executionOutput: ExecutionOutput = {
    data: collected.yaml,
    rawOutput: llmResponse,
    processId: 'deep-risk',
    phase: 'GROUND',
    assumptions: collected.assumptions,
    scopeReductions: collected.scopeReductions,
  };

  // Step 3: Validate gate
  console.log('\nStep 2: Validating gate...');
  const gatesPath = path.join(__dirname, '..', '..', '..', 'processes', 'deep-risk', 'gates.yaml');

  const result = await validateGate(gatesPath, 'GATE_0', executionOutput, {
    depth: 'standard',
  });

  console.log(`  Gate: ${result.name}`);
  console.log(`  Status: ${result.status}`);
  console.log(`  Passed: ${result.passed ? '✅ YES' : '❌ NO'}`);

  // Step 4: Report results
  console.log('\nStep 3: Gate evaluation summary:');
  console.log(`  Total conditions: ${result.conditions.length}`);
  console.log(`  Passed: ${result.conditions.filter((c) => c.passed).length}`);
  console.log(`  Failed: ${result.conditions.filter((c) => !c.passed).length}`);

  if (result.passed) {
    console.log('\n✅ Gate PASSED - Proceed to next phase');
  } else {
    console.log('\n❌ Gate LOCKED - Address failures before proceeding');
  }
}

/**
 * Run all examples
 */
async function main() {
  console.log('═'.repeat(60));
  console.log('Deep Process - Gate Validation Engine Examples');
  console.log('═'.repeat(60));

  try {
    await example1_BasicValidation();
    await example2_ScopeReduction();
    example3_OutputCollection();
    example4_CrisisMode();
    await example5_FullPipeline();

    console.log('\n' + '═'.repeat(60));
    console.log('✅ All examples completed successfully');
    console.log('═'.repeat(60) + '\n');
  } catch (error) {
    console.error('\n❌ Error running examples:', error);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
