# Compact Mode Quality Validation

**WHEN:** report_mode = "compact" AND report generated
**TRIGGER:** Step 5.2 calls this file
**HALT:** Do NOT proceed to output until ALL methods PASS

---

## V.1 Execute Method #082

**EXECUTE:**

1. Load `methods/method-procedures/082_Scope_Integrity_Audit.md`
2. Quote original verification request from Phase 0
3. FOR EACH element in request:
   - Classify: ADDRESSED / REDUCED / OMITTED
   - IF OMITTED: Apply CUI BONO test
     - WHEN omission benefits agent (less work): FLAG
4. Record result

```yaml
method_082:
  elements_total: [N]
  addressed: [N]
  reduced: [N]
  omitted: [N]
  cui_bono_flags: [N]
  verdict: [PASS / FAIL]
```

**WHEN verdict = FAIL:** HALT → Record failure → Proceed to V.6

---

## V.2 Execute Method #083

**EXECUTE:**

1. Load `methods/method-procedures/083_Closure_Check.md`
2. Search compact report for markers:
   - TODO
   - TBD
   - PLACEHOLDER
   - undefined
   - [any text in brackets without value]
3. FOR EACH finding:
   - Check quote exists and is exact
   - Check location is precise (file:line or section)
4. Record result

```yaml
method_083:
  markers_found: [count]
  missing_quotes: [count]
  imprecise_locations: [count]
  verdict: [PASS / FAIL]
```

**WHEN verdict = FAIL:** HALT → Record failure → Proceed to V.6

---

## V.3 Execute Method #084

**EXECUTE:**

1. Load `methods/method-procedures/084_Coherence_Check.md`
2. Check alignment:
   - WHEN verdict = REJECT: Check CRITICAL findings exist
   - WHEN verdict = ACCEPT: Check CRITICAL findings = 0
   - WHEN verdict = UNCERTAIN: Check score in (-3, 6)
3. Check recommendations:
   - WHEN verdict = REJECT: Check recommendations address CRITICAL findings
   - FOR EACH recommendation: Check targets specific finding
4. Scan for contradictions:
   - Compare CONCLUSION vs CRITICAL ISSUES
   - Compare VERDICT vs RECOMMENDATIONS
5. Record result

```yaml
method_084:
  verdict_alignment: [PASS / FAIL]
  recommendation_alignment: [PASS / FAIL]
  contradictions: [count]
  verdict: [PASS / FAIL]
```

**WHEN verdict = FAIL:** HALT → Record failure → Proceed to V.6

---

## V.4 Execute Method #088

**EXECUTE:**

1. Load `methods/method-procedures/088_Executability_Check.md`
2. FOR EACH recommendation in RECOMMENDATIONS section:
   - Classify: ACTIONABLE / BLOCKED / UNCLEAR
     - ACTIONABLE: Can be performed with info given
     - BLOCKED: Missing prerequisite info or resource
     - UNCLEAR: Vague instruction (no specifics)
3. Record result

```yaml
method_088:
  recommendations_total: [N]
  actionable: [N]
  blocked: [N]
  unclear: [N]
  verdict: [PASS if blocked + unclear = 0, else FAIL]
```

**WHEN verdict = FAIL:** HALT → Record failure → Proceed to V.6

---

## V.5 Execute Method #089

**EXECUTE:**

1. Load `methods/method-procedures/089_Output_Quality_Score.md`
2. Score each dimension (1-5):
   - completeness: Does report answer verification question?
   - correctness: Are findings accurate? Quotes exact?
   - clarity: Can user understand without asking questions?
   - usefulness: Are recommendations actionable?
3. Record result

```yaml
method_089:
  completeness: [1-5]
  correctness: [1-5]
  clarity: [1-5]
  usefulness: [1-5]
  lowest: [dimension name]
  verdict: [PASS if all >= 4, else FAIL]
```

**WHEN verdict = FAIL:** HALT → Record failure → Proceed to V.6

---

## V.6 Aggregate Results

**EXECUTE:**

```yaml
validation_results:
  method_082: [PASS / FAIL]
  method_083: [PASS / FAIL]
  method_084: [PASS / FAIL]
  method_088: [PASS / FAIL]
  method_089: [PASS / FAIL]
  all_passed: [true / false]
```

**WHEN all_passed = false:**
1. FOR EACH failed method:
   - Identify failure reason
   - Revise compact report to address
2. EXECUTE V.1 through V.5 again
3. Repeat until all_passed = true

**WHEN all_passed = true:**
1. Record validation timestamp
2. Proceed to step 5.4 (Output)

---

## V.7 Counter-Check on Validation

**TRIGGER:** all_passed = true
**EXECUTE:**

Generate counter-hypothesis:
"What if validation passed but report is still incomplete because [reason]?"

Test scenarios:
1. Validation passed but omitted hard analysis (CUI BONO evasion)
2. Validation passed but findings lack substance (surface-level quotes)
3. Validation passed but recommendations are generic (not specific to artifact)

FOR EACH scenario:
- Check compact report
- IF scenario applies: FLAG and revise
- IF scenario does not apply: CLEAR

```yaml
counter_check:
  scenario_1_applies: [true / false]
  scenario_2_applies: [true / false]
  scenario_3_applies: [true / false]
  revision_needed: [true / false]
```

**WHEN revision_needed = true:** Revise report → Re-run V.1-V.5
**WHEN revision_needed = false:** Validation complete

---

## BINDING CHECKLIST

```
[ ] V.1: Method #082 executed → PASS
[ ] V.2: Method #083 executed → PASS
[ ] V.3: Method #084 executed → PASS
[ ] V.4: Method #088 executed → PASS
[ ] V.5: Method #089 executed → PASS
[ ] V.6: All methods PASS (no retries needed OR retries completed)
[ ] V.7: Counter-check scenarios tested
[ ] Validation timestamp recorded
```

**ENFORCEMENT:** ALL items DONE before returning to step-05-report.md

---

**END OF COMPACT VALIDATION**
