# Method #160: Transformation Proof

## Classification

- **Category:** Migration
- **Phase:** Validation (post-migration)
- **Purpose:** Prove that process transformation is lossless or document losses
- **Mandatory For:** All process migrations (Law 6)
- **Block On Fail:** Yes (TRANSFORMATION_FAILED blocks registration)

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  A transformation is PROVEN when:                                          │
│                                                                            │
│    T(P) → P'  AND  T⁻¹(P') ≈ P                                            │
│                                                                            │
│  Where ≈ means "semantically equivalent within acceptable delta"           │
│                                                                            │
│  Reference: SPECIFICATION.md Section 8.4                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## When to Execute

- **ALWAYS** after completing Migration Protocol (SPECIFICATION.md Section 8)
- **BEFORE** registering new process in `_manifest.yaml`
- **REQUIRED** by Law 6 (Provable Migration)

## Execution Protocol

### Step 1: Parse Source to UPS

Convert source process to Universal Process Schema (`data/universal-process-schema.yaml`).

**For each source element, record:**

| Source Element | UPS ID | UPS Type | Content | dp_mapping_hint | Unmappable Properties |
|----------------|--------|----------|---------|-----------------|----------------------|
| {source_id} | ups-001 | {task/document/...} | {content} | {artifact/process/...} | [{property, reason, severity}] |

**Verification:**
- All elements have ups_id
- All elements have valid ups_type
- Flows reference existing elements

### Step 2: Execute Forward Transformation

Apply MIGRATION PROTOCOL (SPECIFICATION.md Section 8.1) to transform UPS → SRE-Convergent.

**For each element, record mapping:**

| UPS ID | DP ID | Mapping Type | Confidence | Justification |
|--------|-------|--------------|------------|---------------|
| ups-001 | ARTIFACT-001 | direct | 1.0 | Document → artifact (1:1) |
| ups-002 | DP-001 | transform | 0.9 | Approval → decision-point |
| ups-003 | null | unmapped | 0 | Event has no DP equivalent |

**Mapping Types:**
- `direct` — 1:1 semantic equivalence
- `split` — 1:N mapping (one source → many targets)
- `merge` — N:1 mapping (many sources → one target)
- `transform` — Semantic transformation (type change)
- `unmapped` — Could not map (counts as loss)

### Step 3: Compute Lossiness Score

```
L = (U + S) / T

Where:
- U = count of unmapped elements
- S = sum of (semantic_loss × severity_weight)
- T = total source elements

Severity weights:
- info: 0.1
- warning: 0.5
- critical: 1.0

Example:
- Total elements: 15
- Unmapped: 2
- Semantic losses: 1 × warning (0.5)
- L = (2 + 0.5) / 15 = 0.167
```

**Lossiness Verdict:**
| Score | Verdict |
|-------|---------|
| L = 0 | LOSSLESS |
| L < 0.1 | ACCEPTABLE_LOSS |
| L < 0.3 | SIGNIFICANT_LOSS |
| L ≥ 0.3 | UNACCEPTABLE |

### Step 4: Execute Reverse Transformation

Attempt to reconstruct original UPS from transformed SRE-Convergent process.

**Protocol:**
1. Read SRE-Convergent process definition (`process.yaml`)
2. Read all generated artifacts
3. Apply reverse mapping rules:
   - artifact → document/data_object
   - decision-point → approval/decision
   - process → subprocess
   - step → task/activity
4. Generate new UPS representation
5. Compare with original UPS

**Record differences:**
- Missing elements (in original, not in reverse)
- Added elements (in reverse, not in original)
- Changed elements (semantically different)

### Step 5: Compute Reversibility Score

```
R = 1 - (|E_missing| + |E_changed|) / |E_original|

Where:
- E_missing = elements that couldn't be reconstructed
- E_changed = elements that changed semantically
- E_original = original element count

Example:
- Original elements: 15
- Missing in reverse: 2
- Changed semantically: 1
- R = 1 - (2 + 1) / 15 = 0.80
```

**Reversibility Verdict:**
| Score | Verdict |
|-------|---------|
| R = 1 | REVERSIBLE |
| R > 0.9 | MOSTLY_REVERSIBLE |
| R > 0.7 | PARTIALLY_REVERSIBLE |
| R ≤ 0.7 | IRREVERSIBLE |

### Step 6: Determine Final Verdict

| Lossiness (L) | Reversibility (R) | Final Verdict |
|---------------|-------------------|---------------|
| L = 0 | R = 1 | **PROVEN_LOSSLESS** |
| L < 0.1 | R > 0.9 | **PROVEN_ACCEPTABLE** |
| L < 0.3 | R > 0.7 | **DOCUMENTED_LOSSES** |
| else | else | **TRANSFORMATION_FAILED** |

Reference: SPECIFICATION.md Section 8.4.3

## Output: transformation-proof.json

Generate proof document according to `data/transformation-proof-schema.yaml`:

```json
{
  "proof_version": "1.0",
  "generated_at": "{timestamp}",
  "method_used": "#160 (Transformation Proof)",

  "source_process": {
    "ups_id": "{ups_id}",
    "source_system": "{system}",
    "element_count": {N},
    "flow_count": {M}
  },

  "target_process": {
    "proc_id": "PROC-{NAME}",
    "artifact_count": {N},
    "edge_count": {M}
  },

  "element_mapping": [
    {
      "source_ups_id": "ups-001",
      "target_dp_id": "ARTIFACT-001",
      "mapping_type": "direct",
      "confidence": 1.0,
      "notes": "Document → artifact"
    }
  ],

  "lossiness_report": {
    "total_source_elements": {T},
    "mapped_elements": {M},
    "unmapped_elements": {U},
    "lossiness_score": {L},
    "semantic_losses": [...],
    "verdict": "{LOSSLESS|ACCEPTABLE_LOSS|...}"
  },

  "reversibility_test": {
    "executed": true,
    "reversibility_score": {R},
    "missing_elements": [...],
    "verdict": "{REVERSIBLE|MOSTLY_REVERSIBLE|...}"
  },

  "final_verdict": "{PROVEN_LOSSLESS|PROVEN_ACCEPTABLE|DOCUMENTED_LOSSES|TRANSFORMATION_FAILED}",
  "proof_signature": "sha256:{hash}"
}
```

## Actions Based on Verdict

| Verdict | Action | Requires Approval |
|---------|--------|-------------------|
| PROVEN_LOSSLESS | Proceed with registration | No |
| PROVEN_ACCEPTABLE | Proceed, document losses | No |
| DOCUMENTED_LOSSES | Create decision-point for approval | Yes |
| TRANSFORMATION_FAILED | Block registration, require re-migration | Yes |

## State Update

After successful proof:

```yaml
[UPDATE_STATE]
{
  "saga_id": "tx-XXXX",
  "operations": [
    {
      "type": "CREATE",
      "target": "PROC-{NAME}",
      "dp_type": "process",
      "transformation_proof": "processes/{name}/transformation-proof.json",
      "proof_verdict": "{verdict}"
    }
  ]
}
[/UPDATE_STATE]
```

## Integration with Other Methods

| Method | Integration |
|--------|-------------|
| #71 (First Principles) | Used in Step 1 to decompose source process |
| #79 (Operational Definition) | Used in Step 2 for mapping |
| #90 (Dependency Topology) | Used to map flows |
| #95 (Structural Isomorphism) | Used to compare structures |
| #100 (Vocabulary Consistency) | Used to verify terminology |
| #114 (Reversibility Test) | Applied in Step 4-5 |
| #159 (Transitive Closure) | Used to verify flow mappings |

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| NO_UPS_PROVIDED | Source not parsed to UPS | Complete Step 1 first |
| MAPPING_INCOMPLETE | Some elements not mapped | Review unmapped elements |
| REVERSE_FAILED | Cannot execute reverse transformation | Check mapping consistency |
| THRESHOLD_EXCEEDED | L or R outside acceptable range | Revise migration or get approval |

## Example Execution

```markdown
## Transformation Proof Report

### Source Process
- ID: ups-employee-onboarding-v1
- System: Confluence
- Elements: 15
- Flows: 18

### Target Process
- ID: PROC-EMPLOYEE-ONBOARDING
- Type: SRE-Convergent
- Artifacts: 12
- Edges: 14

### Mapping Summary
- Direct mappings: 10
- Transformed mappings: 2
- Unmapped elements: 3

### Lossiness Analysis
- Score: 0.08 (ACCEPTABLE_LOSS)
- Critical losses: 0
- Unmapped: email_notification, calendar_event, reminder

### Reversibility Test
- Score: 0.92 (MOSTLY_REVERSIBLE)
- Missing in reverse: email_notification, calendar_event, reminder
- Changed: 0

### Verdict: PROVEN_ACCEPTABLE

### Proof Signature
- Executed: 2026-02-05T10:00:00Z
- Method: #160 v1.0
- Hash: sha256:a1b2c3d4...
```

## Notes

- This method is MANDATORY for all migrations (Law 6)
- Proof document must be stored in `processes/{name}/transformation-proof.json`
- Proof is referenced in process registration in `_manifest.yaml`
- Human override for TRANSFORMATION_FAILED requires explicit justification
