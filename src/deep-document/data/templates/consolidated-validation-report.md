# Consolidated Validation Report

**Process:** Deep-Document V7.0.0
**Generated:** {{validation_timestamp}}
**Overall Status:** {{overall_status}}

---

## Executive Summary

This report aggregates ALL verification mechanisms used throughout the Deep-Document V7 process to validate documentation quality, completeness, and correctness.

{{executive_summary}}

---

## Verification Layers

### Layer 1: Gates (21 binding gates, 100+ conditions)

{{gate_results}}

### Layer 2: Invariants (25 process constraints)

{{invariant_results}}

### Layer 3: User Checkpoints (4 approval points)

{{user_checkpoint_results}}

### Layer 4: Per-Document Checklists

{{document_checklist_results}}

### Layer 5: Quality Standards (22 checks)

{{quality_standard_results}}

### Layer 6: Verification Tests (7 tests)

{{verification_test_results}}

### Layer 7: Evidence Metrics

{{evidence_metrics}}

### Layer 8: Phantom Detection

{{phantom_detection_results}}

### Layer 9: Scope Reductions

{{scope_reduction_log}}

---

## Gate Details

{{gate_details}}

---

## Invariant Details

{{invariant_details}}

---

## Quality Test Details

{{quality_test_details}}

---

## Findings

### BLOCKER Findings

{{blocker_findings}}

### CRITICAL Findings

{{critical_findings}}

### ERROR Findings

{{error_findings}}

### WARNING Findings

{{warning_findings}}

---

## Retrospective Audit

This section documents what WAS actually checked during the process (not what SHOULD be checked).

{{retrospective_audit}}

---

## Overall Verdict

**Status:** {{overall_status}}

**Summary:** {{verdict_summary}}

**Documentation Ready:** {{ready_for_delivery}}

---

**Process Compliance:**
- Gates Passed: {{gates_passed}} / {{gates_total}}
- Invariants Satisfied: {{invariants_satisfied}} / {{invariants_total}}
- Quality Tests Passed: {{tests_passed}} / {{tests_total}}

---

**Related:** [Index](./index.md) | [Verification Report](../deep-artifacts/verification-report.md)
