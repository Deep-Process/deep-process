# Individual Verification Reports

This directory contains detailed verification reports for each document verified as part of the Deep Process documentation initiative.

## Structure

Each document gets its own verification report in the format:
`[filename]-verification.md`

For example:
- `README-verification.md` - Verification of main README.md
- `BUILD-verification.md` - Verification of BUILD.md
- `deep-verify-workflow-verification.md` - Verification of processes/deep-verify/workflow.md

## Report Format

Each individual report follows this structure:

```markdown
# Verification Report: [Document Name]

**Document:** `path/to/document.md`
**Verification Mode:** DEEP / STANDARD / QUICK
**Verified Date:** YYYY-MM-DD
**Verified By:** Deep Verify Process
**Duration:** X minutes

---

## Summary

**Verdict:** ACCEPT / UNCERTAIN / REJECT
**Score:** X.X / 10.0
**Confidence:** HIGH / MEDIUM / LOW

**Findings:**
- CRITICAL: X
- IMPORTANT: X
- MINOR: X

---

## Findings

### CRITICAL (Score 8.0+)

[Detailed findings with quotes]

### IMPORTANT (Score 5.0-7.9)

[Detailed findings with quotes]

### MINOR (Score 2.0-4.9)

[Detailed findings with quotes]

---

## Recommendations

1. [Priority 1 recommendation]
2. [Priority 2 recommendation]
...

---

## Verification Details

**Pattern Library:** [patterns used]
**Methods Used:** [method procedures used]
**Adversarial Challenges:** [number of challenges, how many succeeded]

---

## Full Transcript

[Optional: full verification transcript if needed for audit]
```

## Naming Convention

Use lowercase with hyphens for filenames:
- ✅ `README-verification.md`
- ✅ `deep-verify-workflow-verification.md`
- ❌ `README_verification.md`
- ❌ `DeepVerifyWorkflowVerification.md`

## Status

**Total Reports:** 0
**TIER 1 (DEEP):** 0 / 12
**TIER 2 (STANDARD):** 0 / 20
**TIER 3 (QUICK):** 0 / 18

---

**Last Updated:** 2026-02-15
