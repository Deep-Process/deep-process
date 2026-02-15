# Deep-Orchestration Methods

This directory contains or references methods used by deep-orchestration.

## Method #349: Result Aggregator (PRODUCTION READY)

**Status:** ✅ PRODUCTION_READY
**Location:** `../../methods/method-349-result-aggregator/`
**Required:** YES

**Purpose:** Aggregates outputs from multiple processes into Decision Brief

**Outputs:**
- Decision Brief (5-10 pages) - Concise actionable summary
- Full Report - Complete detailed analysis
- Metadata (YAML) - Execution metadata and metrics

**Used in:** STEP 6 (AGGREGATE), Section 2

**Integration:**
When deep-orchestration reaches STEP 6, Section 2 automatically invokes Method #349:
1. Prepares workflow_input.yaml from orchestration context
2. Executes Method #349 (STEP 0 → STEP 5)
3. Receives decision_brief.md, full_report.md, metadata.yaml
4. Stores outputs in orchestration_results

**Path Resolution:**
```
processes/deep-orchestration/steps/step-06-aggregate.md
  → LOAD: ../../methods/method-349-result-aggregator/method.md
  → Resolves to: methods/method-349-result-aggregator/method.md
```

---

## Method #347: Process Dependency Mapper (PLANNED)

**Status:** 🚧 PLANNED
**Location:** `../../methods/method-347-dependency-mapper/` (not yet implemented)
**Required:** NO (manual fallback available)

**Used in:** STEP 2 (MAP), Section 2

---

## Method #348: Parallel Execution Optimizer (PLANNED)

**Status:** 🚧 PLANNED
**Location:** `../../methods/method-348-parallel-optimizer/` (not yet implemented)
**Required:** NO (manual fallback available)

**Used in:** STEP 3 (SEQUENCE), Section 2

---

## Method #350: Workflow State Manager (PLANNED)

**Status:** 🚧 PLANNED
**Location:** `../../methods/method-350-state-manager/` (not yet implemented)
**Required:** NO (manual fallback available)

**Used in:** STEP 4 (EXECUTE), Section 2

---

## Directory Structure

```
processes/deep-orchestration/
├── manifest.yaml
├── workflow.md
├── steps/
│   ├── step-01-define.md
│   ├── step-02-map.md
│   ├── step-03-sequence.md
│   ├── step-04-execute.md
│   ├── step-05-monitor.md
│   └── step-06-aggregate.md    ← Calls Method #349
└── methods/
    └── README.md               ← This file

methods/
└── method-349-result-aggregator/  ← Actual method location
    ├── method.md
    ├── steps/
    │   ├── step-00-setup.md
    │   ├── step-01-collect.md
    │   ├── step-02-aggregate.md
    │   ├── step-03-synthesize.md
    │   ├── step-04-render.md
    │   └── step-05-output.md
    ├── data/
    │   ├── output-schema.yaml
    │   ├── decision-brief-template.yaml
    │   └── metric-formulas.yaml
    └── examples/
```
