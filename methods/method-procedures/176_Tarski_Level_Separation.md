# #176 Tarski Level Separation

**Tier:** 2 (On-Verify - Validation)
**Purpose:** Ensure verification operates at the proper meta-level. Documentation verified only using its own content is level confusion — verification MUST use external ground truth (code) as meta-language.

## What to do

1. Audit each verification step: what was the ground truth used?
2. Flag any verification that used documentation to verify documentation (level confusion)
3. Ensure every significant claim was checked against code/runtime evidence, not just other docs
4. Check that the verification hierarchy is maintained: code > tests > docs

## Step-by-step

```
1. Catalog verification evidence sources:
   FOR each verification finding from Step 11:
     Record: What evidence was used?
     Classify source:
       - CODE: Actual source file content, file existence, grep results
       - TESTS: Test file assertions, test coverage data
       - CONFIG: Package.json, config files, manifest data
       - DOCS: Other generated documents, existing docs
       - SELF: Document's own content (level violation!)
       - ASSUMED: No evidence, accepted at face value (level violation!)

2. Check for level violations:
   VIOLATION TYPE 1 — Self-referential verification:
     "architecture.md says X" verified by "architecture.md also says X"
     → Document used to verify itself

   VIOLATION TYPE 2 — Circular doc verification:
     "architecture.md says X" verified by "api-contracts.md says X"
     → Docs verifying docs (no code ground truth)

   VIOLATION TYPE 3 — Assumption without evidence:
     "architecture.md says X" accepted as true without any check
     → No verification at all

   VALID verification:
     "architecture.md says X" verified by:
       - grep found X in source code
       - file X exists on disk
       - test for X passes

3. Level hierarchy assessment:
   Count evidence sources per level:
   - Level 0 (Ground truth): Code, runtime, filesystem
   - Level 1 (Semi-ground): Tests, configs, package manifests
   - Level 2 (Derived): Other generated docs
   - Level 3 (Self): Document's own content

   Healthy ratio: Level 0+1 should be > 80% of all evidence

4. Identify at-risk claims:
   Claims verified ONLY at Level 2 or 3 are at-risk:
   → These LOOK verified but lack true grounding
   → Recommend re-verification against Level 0 evidence
```

## Output format

```
Verification evidence audit:
| Evidence Level | Count | Percentage |
|----------------|-------|------------|
| L0: Code/filesystem | [N] | [%] |
| L1: Tests/configs | [N] | [%] |
| L2: Other docs | [N] | [%] |
| L3: Self-referential | [N] | [%] |
| No evidence | [N] | [%] |

Level violations found: [count]

Violations detail:
| Claim | Document | Evidence Used | Violation Type |
|-------|----------|---------------|----------------|
| [claim] | [doc] | [evidence] | Self-referential |
| [claim] | [doc] | [evidence] | Circular docs |
| [claim] | [doc] | none | No evidence |

At-risk claims (verified only at L2/L3):
- [claim] in [doc] — re-verify against code
- [claim] in [doc] — re-verify against code

Grounding ratio: [L0+L1 percentage]%
- Target: > 80%
- Actual: [%]

FINDING (if any): [N] claims verified without code-level evidence — level confusion detected
SEVERITY: CRITICAL (grounding ratio < 50%), IMPORTANT (< 80%), MINOR (cosmetic)
```
