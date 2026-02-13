---
step: 5
name: "REFINEMENT"
time_estimate: "10-15 minutes"
goal: "Address verification issues, improve clarity, add missing examples. Polish documentation."
requires_completion: false
next_steps: []
data_dependencies:
  - "verification-report.yaml"
  - "docs/*.md"
outputs:
  - artifact: "docs/*.md (updated)"
    location: "docs/"
    consumers: ["User (final deliverable)"]
---

# PHASE 5: REFINEMENT (Optional)

## ENFORCED SEQUENCE

### STEP 1: Address Verification Issues (5-8 min)

**Actions:**
1. Read `verification-report.yaml` → Extract DEGRADED and HALLUCINATED claims
2. For each issue:
   - **DEGRADED:** Update citation to correct line number
   - **HALLUCINATED:** Remove claim OR re-research correct evidence

**Example:**
- Claim C-087: "Function moved to line 31" → Update docs: `src/file.ts:31` (was `:23`)
- Claim C-143: "Function doesn't exist" → Remove claim OR find correct location

### STEP 2: Improve Clarity (3-5 min)

**Actions:**
1. Identify weak sections:
   - High [UNKNOWN] ratio (>10% in section)
   - Overly technical (no examples)
   - Poor structure (flat headings)
2. Enhance:
   - Add code examples where missing
   - Break complex paragraphs
   - Add H3/H4 subheadings for navigation

### STEP 3: User Feedback Integration (2-3 min)

**Actions:**
1. If user provides feedback during Phase 5:
   - Address specific requests
   - Expand sections marked "too brief"
   - Simplify sections marked "too complex"

---

## GATE_5 Evaluation

**Conditions:**
1. **G5-01:** All verification issues addressed (DEGRADED fixed, HALLUCINATED removed)
2. **G5-02:** User approval obtained
3. **G5-03:** No new degradation introduced (re-calculate degradation rate after fixes, still <5%)
4. **G5-04:** No new hallucinations introduced (re-verify fixed claims, 0 new hallucinations)

**Counter-Checks:**
1. Re-verify fixed claims (Method #85) → Verify degraded claims now verify correctly
2. Scan fixed sections for new unverifiable claims (Method #168) → 0 new hallucinations

```
IF all 4 conditions pass → GATE_5 = OPEN → COMPLETE
IF G5-03 or G5-04 fails → Fix introduced issues, re-evaluate
IF user requests more changes → Iterate STEP 2-3
```

---

## POST-PHASE CHECKLIST

After completing Phase 5, verify:

- [ ] All DEGRADED claims fixed (citations updated)
- [ ] All HALLUCINATED claims removed or re-researched
- [ ] Weak sections improved (low [UNKNOWN], added examples, better structure)
- [ ] User feedback integrated (if provided)
- [ ] No new degradation introduced (re-calculated <5%)
- [ ] No new hallucinations introduced (re-verified fixed claims)
- [ ] GATE_5 evaluated (OPEN, all 4 conditions)

**If checklist incomplete → Phase 5 not finished → Re-execute.**

---

## COMPLETION

After GATE_5 opens → Documentation process COMPLETE
- Final output: `docs/*.md` with verified, polished content
- Artifacts: All 6 artifacts saved in `deep-artifacts/`
- Deliverable: User has comprehensive, accurate documentation
