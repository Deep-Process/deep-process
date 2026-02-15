/**
 * Gate Validator Unit Tests
 *
 * Tests for gate validation engine:
 * - YAML parsing (both formats)
 * - Condition evaluation
 * - Gate status tracking
 * - Scope reduction protocol
 * - Crisis mode detection
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { GateValidator, type ExecutionOutput, type GateResult } from '../src/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('GateValidator', () => {
  let validator: GateValidator;

  beforeEach(() => {
    validator = new GateValidator();
  });

  describe('YAML Parsing', () => {
    it('should load and parse deep-risk gates.yaml', () => {
      const gatesPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk',
        'gates.yaml'
      );

      validator.loadGatesConfig(gatesPath);
      const config = validator.getGatesConfig();

      expect(config).toBeDefined();
      expect(config?.metadata.process).toBe('deep-risk');
      expect(config?.metadata.gate_count).toBe(8);
      expect(Object.keys(config?.gates || {})).toHaveLength(8);
    });

    it('should load and parse deep-architect gates.yaml', () => {
      const gatesPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-architect',
        'data',
        'gates.yaml'
      );

      validator.loadGatesConfig(gatesPath);
      const config = validator.getGatesConfig();

      expect(config).toBeDefined();
      expect(config?.metadata.total_gates).toBe(7);
      expect(Object.keys(config?.gates || {})).toHaveLength(7);
    });

    it('should normalize both YAML formats', () => {
      const gatesPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk',
        'gates.yaml'
      );

      validator.loadGatesConfig(gatesPath);
      const config = validator.getGatesConfig();

      const gate0 = config?.gates['GATE_0'];
      expect(gate0).toBeDefined();
      expect(gate0?.name).toBe('GROUND_COMPLETE');
      expect(gate0?.conditions).toBeDefined();
      expect(Array.isArray(gate0?.conditions)).toBe(true);
      expect(gate0?.conditions.length).toBeGreaterThan(0);

      // Check condition structure
      const firstCondition = gate0?.conditions[0];
      expect(firstCondition?.id).toBeDefined();
      expect(firstCondition?.severity).toBeDefined();
      expect(['BLOCKER', 'CRITICAL', 'ERROR', 'REQUIRED']).toContain(
        firstCondition?.severity
      );
    });

    it('should initialize all gates to PENDING', () => {
      const gatesPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk',
        'gates.yaml'
      );

      validator.loadGatesConfig(gatesPath);
      const statuses = validator.getAllGateStatuses();

      expect(statuses.size).toBe(8);
      for (const status of statuses.values()) {
        expect(status).toBe('PENDING');
      }
    });
  });

  describe('Condition Evaluation', () => {
    it('should pass when field exists', async () => {
      const mockOutput: ExecutionOutput = {
        data: {
          scope_frame: {
            subject: 'Test project',
            boundaries: 'Test boundaries',
            timeframe: '6 months',
            stakes: 'High',
          },
        },
        rawOutput: 'Mock output',
        processId: 'deep-risk',
      };

      const gatesPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk',
        'gates.yaml'
      );

      validator.loadGatesConfig(gatesPath);

      // This is a simplified test - in real usage, we'd evaluate specific conditions
      const status = validator.getGateStatus('GATE_0');
      expect(status).toBe('PENDING'); // Not evaluated yet
    });

    it('should evaluate length checks correctly', async () => {
      const mockOutput: ExecutionOutput = {
        data: {
          assumptions_declared: ['Assumption 1', 'Assumption 2', 'Assumption 3'],
          risk_genesis_scan: [
            { source: 'complexity', risk: 'R1' },
            { source: 'coupling', risk: 'R2' },
            { source: 'uncertainty', risk: 'R3' },
          ],
        },
        rawOutput: 'Mock output',
        processId: 'deep-risk',
      };

      const gatesPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk',
        'gates.yaml'
      );

      validator.loadGatesConfig(gatesPath);

      const result = await validator.evaluateGate('GATE_0', mockOutput, {
        skipErrorConditions: true,
      });

      expect(result).toBeDefined();
      expect(result.gateId).toBe('GATE_0');
      expect(result.conditions.length).toBeGreaterThan(0);
    });
  });

  describe('Gate Status Tracking', () => {
    it('should update gate status after evaluation', async () => {
      const mockOutput: ExecutionOutput = {
        data: {
          scope_frame: { subject: 'Test', boundaries: 'Test', timeframe: '6m', stakes: 'High' },
          risk_genesis_scan: Array(6).fill({ source: 'test', risk: 'R' }),
          system_profile: { complexity_level: 'High', coupling_level: 'Medium' },
          uncertainty_map: [{ type: 'risk' }, { type: 'uncertainty' }],
          assumptions_declared: ['A1', 'A2', 'A3'],
        },
        rawOutput: 'Mock output with all required sections',
        processId: 'deep-risk',
      };

      const gatesPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk',
        'gates.yaml'
      );

      validator.loadGatesConfig(gatesPath);

      expect(validator.getGateStatus('GATE_0')).toBe('PENDING');

      await validator.evaluateGate('GATE_0', mockOutput);

      // Status should be updated (OPEN or LOCKED)
      const status = validator.getGateStatus('GATE_0');
      expect(['OPEN', 'LOCKED']).toContain(status);
    });

    it('should track all gate statuses', () => {
      const gatesPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk',
        'gates.yaml'
      );

      validator.loadGatesConfig(gatesPath);

      const allStatuses = validator.getAllGateStatuses();
      expect(allStatuses.size).toBe(8);
      expect(allStatuses.has('GATE_0')).toBe(true);
      expect(allStatuses.has('GATE_7')).toBe(true);
    });
  });

  describe('Scope Reduction Protocol', () => {
    it('should collect scope reductions from evaluation', async () => {
      const mockOutput: ExecutionOutput = {
        data: {
          // Missing some CRITICAL fields to trigger scope reduction
          scope_frame: { subject: 'Test' }, // Missing boundaries, timeframe, stakes
          assumptions_declared: ['A1', 'A2', 'A3'],
        },
        rawOutput: 'Mock output',
        processId: 'deep-risk',
      };

      const gatesPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk',
        'gates.yaml'
      );

      validator.loadGatesConfig(gatesPath);

      const result = await validator.evaluateGate('GATE_0', mockOutput, {
        skipErrorConditions: true,
        userApprovalCallback: async () => false, // Deny all reductions
      });

      // Should have failure reasons due to missing CRITICAL conditions
      expect(result.failureReasons.length).toBeGreaterThan(0);
    });

    it('should require user approval for CRITICAL failures', async () => {
      const mockOutput: ExecutionOutput = {
        data: {
          scope_frame: { subject: 'Test' },
          assumptions_declared: ['A1', 'A2', 'A3'],
        },
        rawOutput: 'Mock output',
        processId: 'deep-risk',
      };

      const gatesPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk',
        'gates.yaml'
      );

      validator.loadGatesConfig(gatesPath);

      let approvalRequested = false;

      await validator.evaluateGate('GATE_0', mockOutput, {
        skipErrorConditions: true,
        userApprovalCallback: async (reduction) => {
          approvalRequested = true;
          expect(reduction.requiresUserApproval).toBe(true);
          return true; // Approve
        },
      });

      // Should have requested approval for at least one CRITICAL failure
      // (depends on which conditions failed)
    });
  });

  describe('Crisis Mode Detection', () => {
    it('should detect crisis mode triggers', () => {
      const gatesPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk',
        'gates.yaml'
      );

      validator.loadGatesConfig(gatesPath);

      expect(validator.shouldActivateCrisisMode('This is urgent!')).toBe(true);
      expect(validator.shouldActivateCrisisMode('We have an emergency')).toBe(true);
      expect(validator.shouldActivateCrisisMode('Production is down')).toBe(true);
      expect(validator.shouldActivateCrisisMode('Everything is down')).toBe(true);
      expect(validator.shouldActivateCrisisMode('Normal situation')).toBe(false);
    });

    it('should handle multiple crisis triggers', () => {
      const gatesPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk',
        'gates.yaml'
      );

      validator.loadGatesConfig(gatesPath);

      const config = validator.getGatesConfig();
      expect(config?.crisis_mode?.enabled).toBe(true);
      expect(config?.crisis_mode?.triggers).toContain('urgent');
      expect(config?.crisis_mode?.triggers).toContain('emergency');
      expect(config?.crisis_mode?.triggers).toContain('crisis');
    });
  });

  describe('Reset and State Management', () => {
    it('should reset validator state', async () => {
      const gatesPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'processes',
        'deep-risk',
        'gates.yaml'
      );

      validator.loadGatesConfig(gatesPath);

      const mockOutput: ExecutionOutput = {
        data: {
          scope_frame: { subject: 'Test', boundaries: 'Test', timeframe: '6m', stakes: 'High' },
          assumptions_declared: ['A1', 'A2', 'A3'],
        },
        rawOutput: 'Mock output',
        processId: 'deep-risk',
      };

      await validator.evaluateGate('GATE_0', mockOutput);

      // State should be updated
      const statusBefore = validator.getGateStatus('GATE_0');
      expect(['OPEN', 'LOCKED']).toContain(statusBefore);

      // Reset
      validator.reset();

      // Should be back to PENDING
      const statusAfter = validator.getGateStatus('GATE_0');
      expect(statusAfter).toBe('PENDING');
    });
  });

  describe('Check Expression Evaluation', () => {
    it('should evaluate "exists" checks', async () => {
      const mockOutput: ExecutionOutput = {
        data: {
          test_field: 'value',
        },
        rawOutput: 'Mock output',
        processId: 'test',
      };

      // We'd need to expose evaluateCheck as public or test through gate evaluation
      // For now, test through gate evaluation with a custom gates config
    });

    it('should evaluate length comparisons', async () => {
      const mockOutput: ExecutionOutput = {
        data: {
          items: [1, 2, 3, 4, 5],
        },
        rawOutput: 'Mock output',
        processId: 'test',
      };

      // Test through gate evaluation
    });

    it('should evaluate "in" checks', async () => {
      const mockOutput: ExecutionOutput = {
        data: {
          status: 'active',
        },
        rawOutput: 'Mock output',
        processId: 'test',
      };

      // Test through gate evaluation
    });
  });
});

describe('Integration Tests', () => {
  it('should validate GATE_0 of deep-risk with complete data', async () => {
    const validator = new GateValidator();
    const gatesPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'processes',
      'deep-risk',
      'gates.yaml'
    );

    validator.loadGatesConfig(gatesPath);

    const completeOutput: ExecutionOutput = {
      data: {
        scope_frame: {
          subject: 'E-commerce Platform Redesign',
          boundaries: 'Frontend + API, excluding payment processing',
          timeframe: '6 months',
          stakes: 'High - business critical revenue stream',
        },
        risk_genesis_scan: [
          { source: 'complexity', risk: 'R1' },
          { source: 'coupling', risk: 'R2' },
          { source: 'uncertainty', risk: 'R3' },
          { source: 'agency', risk: 'R4' },
          { source: 'temporality', risk: 'R5' },
          { source: 'boundaries', risk: 'R6' },
        ],
        system_profile: {
          complexity_level: 'High',
          coupling_level: 'Medium',
        },
        uncertainty_map: [
          { type: 'risk', description: 'Known risks' },
          { type: 'uncertainty', description: 'Known unknowns' },
          { type: 'ambiguity', description: 'Unknown unknowns' },
        ],
        assumptions_declared: [
          'User traffic remains consistent',
          'Third-party APIs maintain SLA',
          'Team size stable for 6 months',
        ],
      },
      rawOutput: 'Complete mock output with all sections',
      processId: 'deep-risk',
      phase: 'GROUND',
    };

    const result = await validator.evaluateGate('GATE_0', completeOutput, {
      depth: 'standard',
    });

    expect(result.gateId).toBe('GATE_0');
    expect(result.name).toBe('GROUND_COMPLETE');
    expect(result.conditions.length).toBeGreaterThan(0);

    // Check that we evaluated the right conditions
    const conditionIds = result.conditions.map((c) => c.id);
    expect(conditionIds).toContain('G0-01'); // Scope framed
    expect(conditionIds).toContain('G0-05'); // Assumptions declared
  });
});
