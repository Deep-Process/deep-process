---
step: 5
name: "Report"
time_estimate: "5-10 minutes"
goal: "Generate structured verification report - ONLY phase with output"
requires_completion: [0, 1, 2, 3, 4]
next_steps:
  Deep_Mode: "steps/step-06-pattern-candidate.md"
  DEFAULT: "COMPLETE"
gate: "GATE_5"
data_dependencies:
  - "data/report-template.md"
outputs:
  - verification_report (FINAL OUTPUT)
---

# Phase 5: Report

## 5.0 Template Selection

**WHEN:** Phase 4 complete
**EXECUTE:**

1. Read `report_mode` from frontmatter
2. WHEN report_mode = "compact": Load `data/compact-report-template.md`
3. WHEN report_mode = "full" OR report_mode = null: Load `data/report-template.md`
4. Write to frontmatter:

```yaml
report:
  template: [full / compact]
```

---

## 5.1 Fill Template

**WHEN:** Template loaded
**EXECUTE:**

1. Read all [PLACEHOLDER] markers in loaded template
2. FOR EACH marker:
   - Read corresponding data from frontmatter (Phases 0-4)
   - Replace marker with actual value
3. WHEN template = "full": Fill all sections per template
4. WHEN template = "compact": Fill condensed sections per template
5. Replace ALL markers (no placeholders remain)

### Section 6: What Was NOT Checked

```
LIMITATIONS & SCOPE
-------------------

Out of Scope (declared in Phase 0):
  - [item 1 from assumptions]
  - [item 2]
  ...

Methods NOT Executed:
  [List Tier 2 methods that could have been run but weren't]
  Reason: [Signal-based selection / Mode constraints]

Unchecked Hypotheses:
  [List any hypotheses that remain UNTESTED status]

Known Limitations:
  [Any scope reductions from gates]
  [Any assumptions with LOW confidence that weren't fully tested]
```

### Section 7: Recommendations (if applicable)

```
RECOMMENDATIONS
---------------

[If UNCERTAIN or ESCALATE verdict:]
  Next Steps:
    - [Specific recommendation 1]
    - [Specific recommendation 2]
    ...

[If REJECT with fixable issues:]
  Suggested Actions:
    - [How to address finding F[N]]
    - [How to address finding F[M]]
    ...

[If ACCEPT with caveats:]
  Notes:
    - [Important caveat 1]
    - [Important caveat 2]
    ...
```

---

## 5.2 Quality Validation

**WHEN:** report_mode = "compact" AND template filled
**TRIGGER:** Step 5.1 complete
**EXECUTE:**

1. Load `steps/step-05-compact-validation.md`
2. Execute V.1 through V.7 from loaded file
3. WHEN all_passed = false: HALT until revision complete
4. WHEN all_passed = true: Record validation result

```yaml
compact_validation:
  executed: true
  all_methods_passed: [true / false]
  timestamp: [ISO]
```

**WHEN report_mode = "full":**
Skip this step (no additional validation needed)

---

## 5.3 Final Check

**WHEN:** Template filled AND (compact validation complete OR report_mode = "full")
**EXECUTE:**

1. Scan report for remaining [PLACEHOLDER] markers
2. Count markers found
3. WHEN markers > 0: HALT → Identify missing data → Fill markers → Repeat
4. WHEN markers = 0: Proceed to 5.4

---

## 5.4 Output

**WHEN:** 5.3 complete
**EXECUTE:**

1. Output entire report to user
2. This is FIRST and ONLY user-visible output from Phases 0-5

**Footer:**

```
---
Deep Verify V2.1 | Mode: [mode] | Report: [full/compact]
Session: [ID] | Duration: [time]
```

---

## GATE_5

**TRIGGER:** Step 5.4 complete
**EXECUTE:**

Load `data/gate-definitions.yaml` → Find GATE_5

**BINDING CHECKLIST:**

```
[ ] Template loaded (5.0)
[ ] Template filled - no [PLACEHOLDER] (5.1)
[ ] WHEN compact: Validation executed and PASSED (5.2)
[ ] Final check complete (5.3)
[ ] Report output to user (5.4)
```

**FOR EACH unchecked item:**

```yaml
SCOPE_REDUCTION:
  item: "[item description]"
  omitted: "[what was not done]"
  reason: "[why]"
  impact: "[effect on report]"
  approved: [true / false]
```

**WHEN approved = false:** HALT → Request user approval
**WHEN ALL items checked OR reduced:** GATE_5 PASSED

---

**NEXT:**

WHEN execution_mode = "Deep" AND CRITICAL findings without pattern match:
→ Load `steps/step-06-pattern-candidate.md`

OTHERWISE:
→ VERIFICATION COMPLETE
