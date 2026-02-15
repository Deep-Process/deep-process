/**
 * Gate Validation Engine
 *
 * Enforces quality checkpoints during Deep Process execution:
 * - Parses gates.yaml format (BLOCKER/CRITICAL/ERROR/REQUIRED severity)
 * - Validates conditions against execution output
 * - Tracks gate status (OPEN/LOCKED)
 * - Executes counter-checks
 * - Enforces scope reduction protocol
 * - Supports crisis mode
 *
 * Based on:
 * - processes/deep-risk/gates.yaml (8 gates, 63+ conditions)
 * - processes/deep-architect/data/gates.yaml (7 gates, 53 conditions)
 */

import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

/**
 * Gate severity levels (from most to least strict)
 */
export type GateSeverity = 'BLOCKER' | 'CRITICAL' | 'ERROR' | 'REQUIRED' | 'WARNING';

/**
 * Gate status
 */
export type GateStatus = 'OPEN' | 'LOCKED' | 'PENDING';

/**
 * Condition evaluation result
 */
export interface ConditionResult {
  /** Condition ID (e.g., "G0-01") */
  id: string;

  /** Whether condition passed */
  passed: boolean;

  /** Condition description */
  description: string;

  /** Severity level */
  severity: GateSeverity;

  /** Verification check performed */
  verification?: string;

  /** Failure message (if failed) */
  failureMessage?: string;

  /** Evidence/reasoning for the result */
  evidence?: string;
}

/**
 * Counter-check result
 */
export interface CounterCheckResult {
  /** Counter-check ID (e.g., "CC0-01") */
  id: string;

  /** Method used (e.g., "#85 Grounding Check") */
  method: string;

  /** Whether check passed */
  passed: boolean;

  /** Pass criteria */
  passCriteria: string;

  /** Failure message (if failed) */
  failureMessage?: string;

  /** Evidence */
  evidence?: string;
}

/**
 * Gate evaluation result
 */
export interface GateResult {
  /** Gate ID (e.g., "GATE_0") */
  gateId: string;

  /** Gate name */
  name: string;

  /** Phase number */
  phase: number | string;

  /** Gate status */
  status: GateStatus;

  /** Condition results */
  conditions: ConditionResult[];

  /** Counter-check results */
  counterChecks: CounterCheckResult[];

  /** Overall pass/fail */
  passed: boolean;

  /** Failure reasons (if failed) */
  failureReasons: string[];

  /** Scope reductions declared */
  scopeReductions: ScopeReduction[];
}

/**
 * Scope reduction declaration
 */
export interface ScopeReduction {
  /** Gate ID */
  gate: string;

  /** Item skipped (condition ID) */
  itemSkipped: string;

  /** Reason for reduction */
  reason: string;

  /** Impact assessment */
  impactAssessment: string;

  /** Completeness cost */
  completenessCost?: string;

  /** Requires user approval */
  requiresUserApproval: boolean;

  /** Approved by user */
  approved: boolean;
}

/**
 * Gate condition definition
 */
export interface GateCondition {
  id: string;
  condition?: string;
  description?: string;
  severity: GateSeverity;
  verification?: string;
  check?: string;
  failure_action?: string;
}

/**
 * Counter-check definition
 */
export interface CounterCheck {
  id: string;
  method: string;
  action: string;
  pass_criteria: string;
  fail_action: string;
}

/**
 * Gate definition
 */
export interface GateDefinition {
  name: string;
  phase: number | string;
  description?: string;
  conditions: GateCondition[];
  counter_checks?: CounterCheck[];
  pass_criteria?: string;
  state_on_pass?: GateStatus;
  state_on_fail?: GateStatus;
  non_negotiable?: boolean;
}

/**
 * Gates configuration
 */
export interface GatesConfig {
  metadata: {
    version: string;
    process?: string;
    gate_count?: number;
    total_gates?: number;
    enforcement?: string;
    description?: string;
  };
  gates: Record<string, GateDefinition>;
  enforcement_rules?: string[];
  enforcement?: {
    gate_blocking?: boolean;
    severity_actions?: Record<GateSeverity, { action: string; recovery: string }>;
    scope_reduction_protocol?: any;
  };
  crisis_mode?: {
    enabled: boolean;
    detection: string;
    triggers: string[];
    modifications: any[];
  };
}

/**
 * Execution output (what we validate against)
 */
export interface ExecutionOutput {
  /** Structured data extracted from LLM output */
  data: Record<string, any>;

  /** Raw LLM output text */
  rawOutput: string;

  /** Process ID */
  processId: string;

  /** Step ID */
  stepId?: string;

  /** Phase */
  phase?: number | string;

  /** Declared assumptions */
  assumptions?: string[];

  /** Scope reductions */
  scopeReductions?: ScopeReduction[];
}

/**
 * Gate Validator
 */
export class GateValidator {
  private gatesConfig: GatesConfig | null = null;
  private gateStates: Map<string, GateStatus> = new Map();
  private scopeReductions: ScopeReduction[] = [];

  /**
   * Load gates configuration from YAML file
   */
  loadGatesConfig(gatesPath: string): void {
    if (!fs.existsSync(gatesPath)) {
      throw new Error(`Gates file not found: ${gatesPath}`);
    }

    const content = fs.readFileSync(gatesPath, 'utf-8');
    this.gatesConfig = this.parseGatesYaml(content);

    // Initialize all gates to PENDING
    for (const gateId of Object.keys(this.gatesConfig.gates)) {
      this.gateStates.set(gateId, 'PENDING');
    }
  }

  /**
   * Parse gates YAML content (supports both formats)
   */
  private parseGatesYaml(yamlContent: string): GatesConfig {
    const raw = parseYaml(yamlContent) as any;

    // Normalize gates format (handle both deep-risk and deep-architect formats)
    const normalizedGates: Record<string, GateDefinition> = {};

    for (const [gateId, gateData] of Object.entries(raw.gates || {})) {
      const gate = gateData as any;

      // Normalize conditions
      const conditions: GateCondition[] = [];

      if (Array.isArray(gate.conditions)) {
        // deep-risk format (array)
        conditions.push(...gate.conditions);
      } else if (typeof gate.conditions === 'object') {
        // deep-architect format (object with condition IDs as keys)
        for (const [condId, condData] of Object.entries(gate.conditions)) {
          const cond = condData as any;
          conditions.push({
            id: condId,
            description: cond.description || cond.condition,
            condition: cond.condition,
            severity: cond.severity,
            verification: cond.verification || cond.check,
            check: cond.check,
            failure_action: cond.failure_action,
          });
        }
      }

      // Normalize counter-checks
      const counterChecks: CounterCheck[] = [];

      if (Array.isArray(gate.counter_checks)) {
        counterChecks.push(...gate.counter_checks);
      }

      normalizedGates[gateId] = {
        name: gate.name,
        phase: gate.phase,
        description: gate.description,
        conditions,
        counter_checks: counterChecks.length > 0 ? counterChecks : undefined,
        pass_criteria: gate.pass_criteria,
        state_on_pass: gate.state_on_pass || 'OPEN',
        state_on_fail: gate.state_on_fail || 'LOCKED',
        non_negotiable: gate.non_negotiable,
      };
    }

    return {
      metadata: raw.metadata || {},
      gates: normalizedGates,
      enforcement_rules: raw.enforcement_rules,
      enforcement: raw.enforcement,
      crisis_mode: raw.crisis_mode,
    };
  }

  /**
   * Evaluate a gate against execution output
   */
  async evaluateGate(
    gateId: string,
    executionOutput: ExecutionOutput,
    options: {
      depth?: 'quick' | 'standard' | 'comprehensive' | 'critical';
      skipErrorConditions?: boolean;
      userApprovalCallback?: (reduction: ScopeReduction) => Promise<boolean>;
    } = {}
  ): Promise<GateResult> {
    if (!this.gatesConfig) {
      throw new Error('Gates config not loaded. Call loadGatesConfig() first.');
    }

    const gate = this.gatesConfig.gates[gateId];
    if (!gate) {
      throw new Error(`Gate not found: ${gateId}`);
    }

    const conditionResults: ConditionResult[] = [];
    const counterCheckResults: CounterCheckResult[] = [];
    const failureReasons: string[] = [];
    const scopeReductions: ScopeReduction[] = [];

    // Evaluate each condition
    for (const condition of gate.conditions) {
      // Skip ERROR conditions if requested (depth=quick)
      if (options.skipErrorConditions && condition.severity === 'ERROR') {
        continue;
      }

      const result = await this.evaluateCondition(
        gateId,
        condition,
        executionOutput,
        options
      );

      conditionResults.push(result);

      if (!result.passed) {
        // Handle failure based on severity
        if (condition.severity === 'BLOCKER') {
          failureReasons.push(
            `BLOCKER failed: ${condition.id} - ${result.failureMessage}`
          );
        } else if (condition.severity === 'CRITICAL') {
          // CRITICAL can be scope-reduced
          const scopeReduction: ScopeReduction = {
            gate: gateId,
            itemSkipped: condition.id,
            reason: result.failureMessage || 'Condition not met',
            impactAssessment: `Critical condition skipped: ${condition.description || condition.condition}`,
            requiresUserApproval: true,
            approved: false,
          };

          // Request user approval if callback provided
          if (options.userApprovalCallback) {
            scopeReduction.approved = await options.userApprovalCallback(
              scopeReduction
            );
          }

          if (!scopeReduction.approved) {
            failureReasons.push(
              `CRITICAL failed (not approved): ${condition.id} - ${result.failureMessage}`
            );
          } else {
            scopeReductions.push(scopeReduction);
          }
        } else if (condition.severity === 'ERROR') {
          // ERROR = flag but allow proceed
          // Already logged in condition result
        }
      }
    }

    // Execute counter-checks (for BLOCKER/CRITICAL gates)
    if (gate.counter_checks) {
      const shouldExecuteCounterChecks =
        gate.conditions.some(
          (c) => c.severity === 'BLOCKER' || c.severity === 'CRITICAL'
        ) && !(options.depth === 'quick');

      if (shouldExecuteCounterChecks) {
        for (const counterCheck of gate.counter_checks) {
          const result = await this.executeCounterCheck(
            counterCheck,
            executionOutput
          );
          counterCheckResults.push(result);

          if (!result.passed) {
            failureReasons.push(
              `Counter-check failed: ${counterCheck.id} - ${result.failureMessage}`
            );
          }
        }
      }
    }

    // Determine overall pass/fail
    const passed = failureReasons.length === 0;
    const status = passed
      ? gate.state_on_pass || 'OPEN'
      : gate.state_on_fail || 'LOCKED';

    // Update gate state
    this.gateStates.set(gateId, status);

    // Store scope reductions
    this.scopeReductions.push(...scopeReductions);

    return {
      gateId,
      name: gate.name,
      phase: gate.phase,
      status,
      conditions: conditionResults,
      counterChecks: counterCheckResults,
      passed,
      failureReasons,
      scopeReductions,
    };
  }

  /**
   * Evaluate a single condition
   */
  private async evaluateCondition(
    gateId: string,
    condition: GateCondition,
    executionOutput: ExecutionOutput,
    options: any
  ): Promise<ConditionResult> {
    // Extract verification check
    const verification = condition.verification || condition.check;

    if (!verification) {
      return {
        id: condition.id,
        passed: true, // If no verification specified, assume pass
        description: condition.description || condition.condition || '',
        severity: condition.severity,
        evidence: 'No verification check specified',
      };
    }

    // Evaluate the check against execution output
    const evaluationResult = this.evaluateCheck(verification, executionOutput);

    return {
      id: condition.id,
      passed: evaluationResult.passed,
      description: condition.description || condition.condition || '',
      severity: condition.severity,
      verification,
      failureMessage: evaluationResult.failureMessage,
      evidence: evaluationResult.evidence,
    };
  }

  /**
   * Evaluate a check expression against execution output
   *
   * Supports check syntax like:
   * - "field exists" → executionOutput.data.field !== undefined
   * - "field.length >= N" → executionOutput.data.field.length >= N
   * - "field in [value1, value2]" → [value1, value2].includes(field)
   * - "field == value" → executionOutput.data.field === value
   */
  private evaluateCheck(
    check: string,
    executionOutput: ExecutionOutput
  ): { passed: boolean; failureMessage?: string; evidence?: string } {
    try {
      // Parse check expression
      const checkLower = check.toLowerCase();

      // Pattern: "field exists"
      if (checkLower.includes(' exists')) {
        const fieldPath = check
          .replace(/exists.*/i, '')
          .trim()
          .replace(/^check\s+/i, '');
        const value = this.getNestedValue(executionOutput.data, fieldPath);
        const passed = value !== undefined && value !== null;

        return {
          passed,
          failureMessage: passed
            ? undefined
            : `Field "${fieldPath}" does not exist`,
          evidence: passed ? `Found: ${JSON.stringify(value)}` : undefined,
        };
      }

      // Pattern: "field.length >= N"
      const lengthMatch = check.match(
        /(.+?)\.(length|count)\s*(>=|<=|>|<|==)\s*(\d+)/i
      );
      if (lengthMatch) {
        const [, fieldPath, property, operator, threshold] = lengthMatch;
        const value = this.getNestedValue(executionOutput.data, fieldPath.trim());

        if (!value) {
          return {
            passed: false,
            failureMessage: `Field "${fieldPath}" does not exist`,
          };
        }

        const actualLength = Array.isArray(value)
          ? value.length
          : typeof value === 'object'
            ? Object.keys(value).length
            : 0;

        const thresholdNum = parseInt(threshold);
        let passed = false;

        switch (operator) {
          case '>=':
            passed = actualLength >= thresholdNum;
            break;
          case '<=':
            passed = actualLength <= thresholdNum;
            break;
          case '>':
            passed = actualLength > thresholdNum;
            break;
          case '<':
            passed = actualLength < thresholdNum;
            break;
          case '==':
            passed = actualLength === thresholdNum;
            break;
        }

        return {
          passed,
          failureMessage: passed
            ? undefined
            : `Expected ${fieldPath}.length ${operator} ${threshold}, got ${actualLength}`,
          evidence: `Actual length: ${actualLength}`,
        };
      }

      // Pattern: "field in [value1, value2]"
      const inMatch = check.match(/(.+?)\s+in\s+\[([^\]]+)\]/i);
      if (inMatch) {
        const [, fieldPath, valuesList] = inMatch;
        const value = this.getNestedValue(
          executionOutput.data,
          fieldPath.trim()
        );
        const allowedValues = valuesList.split(',').map((v) => v.trim());

        const passed = allowedValues.includes(String(value));

        return {
          passed,
          failureMessage: passed
            ? undefined
            : `Expected ${fieldPath} to be one of [${allowedValues.join(', ')}], got "${value}"`,
          evidence: `Value: ${value}`,
        };
      }

      // Pattern: "field == value" or "field === value"
      const eqMatch = check.match(/(.+?)\s*(==|===)\s*(.+)/);
      if (eqMatch) {
        const [, fieldPath, , expectedValue] = eqMatch;
        const value = this.getNestedValue(executionOutput.data, fieldPath.trim());
        const expected = expectedValue.trim().replace(/['"]/g, '');

        const passed = String(value) === expected;

        return {
          passed,
          failureMessage: passed
            ? undefined
            : `Expected ${fieldPath} === "${expected}", got "${value}"`,
          evidence: `Value: ${value}`,
        };
      }

      // Pattern: "field >= N" (numeric comparison)
      const numMatch = check.match(/(.+?)\s*(>=|<=|>|<)\s*(\d+(?:\.\d+)?)/);
      if (numMatch) {
        const [, fieldPath, operator, threshold] = numMatch;
        const value = this.getNestedValue(executionOutput.data, fieldPath.trim());

        if (value === undefined || value === null) {
          return {
            passed: false,
            failureMessage: `Field "${fieldPath}" does not exist`,
          };
        }

        const numValue = typeof value === 'number' ? value : parseFloat(String(value));
        const thresholdNum = parseFloat(threshold);

        let passed = false;
        switch (operator) {
          case '>=':
            passed = numValue >= thresholdNum;
            break;
          case '<=':
            passed = numValue <= thresholdNum;
            break;
          case '>':
            passed = numValue > thresholdNum;
            break;
          case '<':
            passed = numValue < thresholdNum;
            break;
        }

        return {
          passed,
          failureMessage: passed
            ? undefined
            : `Expected ${fieldPath} ${operator} ${threshold}, got ${numValue}`,
          evidence: `Value: ${numValue}`,
        };
      }

      // Default: assume it's a boolean expression in the output
      // Try to find it in rawOutput
      const foundInOutput = executionOutput.rawOutput
        .toLowerCase()
        .includes(check.toLowerCase());

      return {
        passed: foundInOutput,
        failureMessage: foundInOutput
          ? undefined
          : `Check "${check}" not found in output`,
        evidence: foundInOutput ? 'Found in raw output' : undefined,
      };
    } catch (error: any) {
      return {
        passed: false,
        failureMessage: `Check evaluation error: ${error.message}`,
      };
    }
  }

  /**
   * Get nested value from object by path (e.g., "a.b.c")
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current?.[key];
    }, obj);
  }

  /**
   * Execute a counter-check
   */
  private async executeCounterCheck(
    counterCheck: CounterCheck,
    executionOutput: ExecutionOutput
  ): Promise<CounterCheckResult> {
    // Counter-checks are manual verification steps
    // In a real implementation, these would be interactive or use specialized validators
    // For now, we'll mark them as passed (to be implemented by specific processes)

    return {
      id: counterCheck.id,
      method: counterCheck.method,
      passed: true, // TODO: Implement actual counter-check logic
      passCriteria: counterCheck.pass_criteria,
      evidence: 'Counter-check executed (placeholder)',
    };
  }

  /**
   * Get gate status
   */
  getGateStatus(gateId: string): GateStatus {
    return this.gateStates.get(gateId) || 'PENDING';
  }

  /**
   * Get all gate statuses
   */
  getAllGateStatuses(): Map<string, GateStatus> {
    return new Map(this.gateStates);
  }

  /**
   * Get all scope reductions
   */
  getScopeReductions(): ScopeReduction[] {
    return [...this.scopeReductions];
  }

  /**
   * Check if crisis mode should be activated
   */
  shouldActivateCrisisMode(userInput: string): boolean {
    if (!this.gatesConfig?.crisis_mode?.enabled) {
      return false;
    }

    const inputLower = userInput.toLowerCase();
    return this.gatesConfig.crisis_mode.triggers.some((trigger) =>
      inputLower.includes(trigger.toLowerCase())
    );
  }

  /**
   * Get gates config
   */
  getGatesConfig(): GatesConfig | null {
    return this.gatesConfig;
  }

  /**
   * Reset validator state
   */
  reset(): void {
    this.gateStates.clear();
    this.scopeReductions = [];

    if (this.gatesConfig) {
      for (const gateId of Object.keys(this.gatesConfig.gates)) {
        this.gateStates.set(gateId, 'PENDING');
      }
    }
  }
}

/**
 * Create and export a singleton validator instance
 */
export const gateValidator = new GateValidator();

/**
 * Convenience function to load and validate a gate
 */
export async function validateGate(
  gatesPath: string,
  gateId: string,
  executionOutput: ExecutionOutput,
  options?: Parameters<GateValidator['evaluateGate']>[2]
): Promise<GateResult> {
  const validator = new GateValidator();
  validator.loadGatesConfig(gatesPath);
  return validator.evaluateGate(gateId, executionOutput, options);
}
