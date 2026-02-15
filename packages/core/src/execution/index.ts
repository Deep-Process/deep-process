/**
 * Execution Module
 *
 * Components for Deep Process execution:
 * - Gate validation (quality checkpoints)
 * - Output collection (structured data extraction)
 * - Workflow execution (step-by-step orchestration)
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

// Workflow Executor
export type {
  ExecutionDepth,
  StepMetadata,
  StepContent,
  ExecutionContext,
  StepExecutionResult,
  WorkflowExecutionResult,
} from './workflow-executor.js';

export {
  WorkflowExecutor,
  workflowExecutor,
  executeWorkflow,
} from './workflow-executor.js';
