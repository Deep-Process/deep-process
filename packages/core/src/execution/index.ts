/**
 * Execution Module
 *
 * Components for Deep Process execution:
 * - Gate validation (quality checkpoints)
 * - Output collection (structured data extraction)
 * - Workflow execution (coming in Milestone 1.3)
 */

// Gate Validator
export type {
  GateSeverity,
  GateStatus,
  ConditionResult,
  CounterCheckResult,
  GateResult,
  ScopeReduction,
  GateCondition,
  CounterCheck,
  GateDefinition,
  GatesConfig,
  ExecutionOutput,
} from './gate-validator.js';

export {
  GateValidator,
  gateValidator,
  validateGate,
} from './gate-validator.js';

// Output Collector
export type {
  CollectedOutput,
} from './output-collector.js';

export {
  OutputCollector,
  outputCollector,
  collectOutput,
} from './output-collector.js';
