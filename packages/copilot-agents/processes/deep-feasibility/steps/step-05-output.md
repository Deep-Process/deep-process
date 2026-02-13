---
step: 5
name: "Output"
time_estimate: "15-30 minutes"
goal: "Generate feasibility report and register entry with META audit"
requires_completion: [0, 1, 2, 4]  # 3 optional for quick
next_steps:
  DEFAULT: "COMPLETE"
data_dependencies:
  - "data/method-procedures/501-505*.md"
  - "data/feasibility-report-template.md"
  - "data/feasibility-register-template.md"
  - "meta/meta-checklist.yaml"
outputs:
  - feasibility_report
  - register_entry
  - meta_audit
---

# Phase 5: OUTPUT

## PRECONDITION CHECK

1. **PRECONDITION:** GATE_4 = PASS
2. **Verify:** decision, conditions, decay_triggers from Step 4 exist
3. **IF NOT:** HALT, report SEQUENCE VIOLATION
4. **IF PASS:** PROCEED to META audit + output generation

---

## ENFORCED SEQUENCE

**STEP 1:** Read tool: meta/meta-checklist.yaml
**STEP 2:** Apply ≥3 META methods (#501-505), log findings
**STEP 3:** Read tool: data/feasibility-register-template.md → Write: feasibility-register.md
**STEP 4:** Read tool: data/feasibility-report-template.md → Write: feasibility-report.md (complete, NO skipped sections)
**STEP 5:** Record: meta_audit, register_entry, feasibility_report

---

## 5.1 Apply META Methods

**1. Read tool:** `meta/meta-checklist.yaml`

Apply META methods as final audit before generating report.

### #501 Planning Fallacy Detection

**1. Read tool:** `data/method-procedures/501_Planning_Fallacy_Detection.md`

Check for systematic optimism signals:

| Signal | Detected? | Action |
|--------|-----------|--------|
| All dimensions ≥3 | □ | Compare to reference class — suspicious? |
| No critical conditions | □ | Likely blind spots |
| Timeline has no buffer | □ | Planning fallacy active |
| "If everything goes well" | □ | Best case assumed as base case |
| First estimate accepted | □ | Anchoring to initial guess |
| Integration <20% of total | □ | Almost certainly underestimated |
| No acknowledged unknowns | □ | Dunning-Kruger or wishful thinking |

**IF signals detected:**
- Apply Hofstadter correction (#502)
- Note in report under META AUDIT section

### #502 Hofstadter Correction

**1. Read tool:** `data/method-procedures/502_Hofstadter_Correction.md`

After all estimation and calibration, apply final recursive correction:

```
1. Take final calibrated estimates (time, cost, effort)
2. Apply reference-class-based correction factor
3. IF no reference class: ×1.5 (time), ×1.8 (cost) as default
4. Gut check: "Would a friend laugh at this estimate?"
5. The uncomfortably pessimistic estimate is usually accurate
```

### #503 Confidence Theater Detection

**1. Read tool:** `data/method-procedures/503_Confidence_Theater_Detection.md`

Distinguish genuine from performed confidence:

| Confidence Theater | Genuine Confidence |
|-------------------|-------------------|
| "We'll definitely deliver" (no basis) | "Reference class shows 40%, but we have X, Y" |
| Single-point estimates (no range) | Three-point with explicit uncertainty |
| "We've done this before" (different context) | "We've done pipeline; regulatory module is new" |
| Quick consensus without debate | Consensus after exploring disagreements |
| No one mentions concerns | Team actively identifies concerns |

**Test:** "What's the most likely way this fails?"
- If no specific answer → confidence is theatrical

### #504 Dunning-Kruger Dimension Map

**1. Read tool:** `data/method-procedures/504_Dunning_Kruger_Dimension_Map.md`

Identify dimensions where expertise is LOW but confidence is HIGH:

| Dimension | Expertise | Confidence | Zone |
|-----------|-----------|------------|------|
| Technical | High | High | Calibrated ✓ |
| Resource | Medium | Medium | Normal |
| Knowledge | Low | High | **DK ALERT** |
| Regulatory | Low | Low | Acknowledged gap |

**DK ALERT dimensions:** Scores unreliable, seek external validation before trusting.

### #505 Meta-Feasibility Check

**1. Read tool:** `data/method-procedures/505_Meta_Feasibility_Check.md`

Can we even assess feasibility?

**Assessment is infeasible when:**
- Problem is in Complex domain (emergent, unpredictable)
- No reference class exists (truly novel)
- Key variables unknowable in advance
- Assessment cost ≈ project cost (Bonini's paradox)

**If meta-infeasible:**
- Acknowledge in report
- Shift to probe-based learning
- Set maximum investment threshold

---

## 5.2 Calculate Coverage Score

**1. Read tool:** `data/coverage-scoring.yaml`

Sum coverage points from all activities:

| Activity | Points | Count | Subtotal |
|----------|--------|-------|----------|
| Phases completed | +3 | ___ | ___ |
| Methods executed | +1 | ___ | ___ |
| Dimensions scored | +1 | ___ | ___ |
| Constraints classified | +0.5 | ___ | ___ |
| Conditions mapped | +0.5 | ___ | ___ |
| Assumptions tested | +1 | ___ | ___ |
| Probes designed | +1.5 | ___ | ___ |
| META methods applied | +0.5 | ___ | ___ |
| **TOTAL COVERAGE (C)** | | | **___** |

### Coverage Thresholds by Depth

| Depth | Comprehensive | Adequate | Partial |
|-------|--------------|----------|---------|
| Quick | C ≥ 15 | C ≥ 10 | C ≥ 5 |
| Standard | C ≥ 35 | C ≥ 25 | C ≥ 15 |
| Comprehensive | C ≥ 50 | C ≥ 35 | C ≥ 25 |
| Critical | C ≥ 65 | C ≥ 50 | C ≥ 35 |

---

## 5.3 Generate Feasibility Report

**1. Read tool:** `data/feasibility-report-template.md`

Fill all sections of the report template:

```
═══════════════════════════════════════════════════════════════
FEASIBILITY ASSESSMENT REPORT
═══════════════════════════════════════════════════════════════

SUBJECT: [From scope.subject]
DATE: [Current ISO date]
WORKFLOW: Deep Feasibility V1.0
DEPTH: [quick/standard/comprehensive/critical]
COVERAGE SCORE: C = [calculated score] ([threshold label])

───────────────────────────────────────────────────────────────
DECISION
───────────────────────────────────────────────────────────────

DECISION: [GO / NO GO / CONDITIONAL GO / INVESTIGATE]
OVERALL FEASIBILITY: [X]/5 ([Proven/Likely/Possible/Doubtful/Infeasible])
CONFIDENCE: [HIGH / MEDIUM / LOW]
BINDING CONSTRAINT: [Dimension] (score: [Y])

───────────────────────────────────────────────────────────────
EXECUTIVE SUMMARY
───────────────────────────────────────────────────────────────

[2-3 sentence summary of decision rationale]

Key factors:
• [Factor 1 — most important]
• [Factor 2]
• [Factor 3]

───────────────────────────────────────────────────────────────
FEASIBILITY PROFILE
───────────────────────────────────────────────────────────────

Technical     [████████░░]  [4]  [H]    [Note]
Resource      [██████░░░░]  [3]  [M]    [Note]
Knowledge     [████████░░]  [4]  [M]    [Note]
Organization  [██████░░░░]  [3]  [L]    [Note]
Temporal      [████░░░░░░]  [2]  [H]    [Note] ← BINDING
Compositional [██████░░░░]  [3]  [M]    [Note]
Economic      [████████░░]  [4]  [M]    [Note]
Regulatory    [██████████]  [5]  [H]    [Note]
Scale         [██████░░░░]  [3]  [L]    [Note]
Cognitive     [████████░░]  [4]  [H]    [Note]

───────────────────────────────────────────────────────────────
CONSTRAINTS IDENTIFIED
───────────────────────────────────────────────────────────────

H5 (Impossible):
• [None / List]

H4 (Computationally Infeasible):
• [List]

H3 (Structurally Blocked):
• [List]

H2 (Resource Constrained):
• [List]

Contradictions:
• [List with resolution status]

Variety Gap:
• [List missing capabilities]

───────────────────────────────────────────────────────────────
CONDITIONS FOR FEASIBILITY
───────────────────────────────────────────────────────────────

[List all "feasible IF..." conditions]

1. [Condition] — P: [%] — Controller: [who] — Fallback: [plan]
2. [Condition] — P: [%] — Controller: [who] — Fallback: [plan]
...

Compound Probability: [X%] (probability ALL conditions hold)

───────────────────────────────────────────────────────────────
CALIBRATION & VALIDATION
───────────────────────────────────────────────────────────────

Reference Class: [Project type]
• Base rate (on-time): [X%]
• Base rate (on-budget): [Y%]
• Calibrated probability: [Z%]

Critical Assumptions:
• [Assumption 1]: [CONFIRMED / REFUTED / UNTESTED]
• [Assumption 2]: [Status]

Probes Executed:
• [Probe 1]: [Result and conclusion]

Integration Spike:
• [Point tested]: [Result]

───────────────────────────────────────────────────────────────
META AUDIT
───────────────────────────────────────────────────────────────

Planning Fallacy Signals:
• [Detected signals or "None detected"]
• Hofstadter correction applied: [Yes/No — factor]

Confidence Assessment:
• Type: [Genuine / Theatrical]
• Evidence: [What supports this assessment]

Dunning-Kruger Zones:
• [Dimensions with low expertise + high confidence]
• Action: [What validation is needed]

Meta-Feasibility:
• Assessable: [Yes / Partial / No]
• Reason: [If partial or no]

───────────────────────────────────────────────────────────────
DECAY MONITORING
───────────────────────────────────────────────────────────────

Reassessment Triggers:
• [Trigger 1]: [Action]
• [Trigger 2]: [Action]

Scheduled Reviews:
• [Milestone 1]: [Date/condition] — [Scope]
• [Milestone 2]: [Date/condition] — [Scope]

───────────────────────────────────────────────────────────────
NOT CHECKED
───────────────────────────────────────────────────────────────

[List what was NOT examined with reasons]

• [Aspect 1]: Not examined because [reason]
• [Aspect 2]: Outside scope because [reason]
• [Aspect 3]: Would require [external resource/expertise]

───────────────────────────────────────────────────────────────
RECOMMENDATIONS
───────────────────────────────────────────────────────────────

[Depends on decision:]

IF GO:
• Proceed with standard project management
• Monitor: [specific items to track]
• Caveats: [any residual concerns]

IF NO GO:
• Stop current approach
• Options:
  - Redesign: [what would make it feasible]
  - Reduce scope: [what could be cut]
  - Extend timeline: [by how much]
  - Increase resources: [what's needed]

IF CONDITIONAL GO:
• Proceed only after:
  1. [Condition to secure first]
  2. [Condition to secure second]
• Immediate actions:
  - [Action 1 to secure conditions]
  - [Action 2]
• Checkpoints:
  - [When to reassess]

IF INVESTIGATE:
• Information needed:
  1. [Question to answer]
  2. [Question to answer]
• How to investigate:
  - [Method 1]
  - [Method 2]
• Decision timeline: [When to decide]

───────────────────────────────────────────────────────────────
METADATA
───────────────────────────────────────────────────────────────

Assessment started: [ISO timestamp]
Assessment completed: [ISO timestamp]
Depth: [quick/standard/comprehensive/critical]
Complex mode: [on/off]
Phases completed: [0, 1, 2, 3, 4, 5] or subset
Methods executed: [count]
Coverage score: C = [score]
Workflow version: Deep Feasibility V1.0

═══════════════════════════════════════════════════════════════
```

---

## 5.4 Generate Register Entry

**1. Read tool:** `data/feasibility-register-template.md`

Create concise register entry for tracking:

```yaml
---
id: "FEAS-[NNN]"
subject: "[Subject name]"
date: "[ISO date]"
assessor: "[Name/Team]"

scope:
  horizon: "[By when]"
  standard: "[What feasible means]"
  exclusions: ["List"]

classification:
  cynefin: "[Dominant domain]"
  complex_mode: [on/off]

scores:
  technical: [1-5]
  resource: [1-5]
  knowledge: [1-5]
  organizational: [1-5]
  temporal: [1-5]
  compositional: [1-5]
  economic: [1-5]
  regulatory: [1-5]
  scale: [1-5]
  cognitive: [1-5]

binding_constraint: "[Dimension]"
overall_score: [1-5]
confidence: "[H/M/L]"

decision: "[GO/NO GO/CONDITIONAL GO/INVESTIGATE]"

conditions:
  - "[Condition 1]"
  - "[Condition 2]"

compound_probability: [0-1]

validation:
  reference_class: "[Type]"
  assumptions_tested: [count]
  probes_executed: [count]

meta:
  planning_fallacy_signals: [count]
  dk_zones: ["list"]
  confidence_type: "[genuine/theatrical]"

decay:
  next_review: "[Date/milestone]"
  triggers: ["List"]

coverage_score: [C value]
depth: "[quick/standard/comprehensive/critical]"
---
```

---

## 5.5 Report Validation Checklist

Before finalizing, verify:

```
□ All template sections filled (no [PLACEHOLDER] remaining)
□ Dimension scores match Step 2 outputs
□ Binding constraint correctly identified
□ Conditions list complete (from Step 4)
□ Reference class data included (if standard+)
□ META audit complete
□ NOT CHECKED section honest and complete
□ Recommendations are specific and actionable
□ Coverage score calculated correctly
□ Register entry matches report
```

---

## 5.6 Final Output

Deliver:

1. **Feasibility Report** — Full structured document
2. **Register Entry** — Concise YAML for tracking
3. **Decision Summary** — One-paragraph summary for stakeholders

### Decision Summary Template

```
FEASIBILITY DECISION: [Subject]

We assessed [subject] for feasibility to [scope.standard] by [scope.horizon].

DECISION: [VERDICT]

The overall feasibility score is [X]/5 ([label]), with [dimension] as the
binding constraint (score: [Y], confidence: [level]). [Key rationale sentence].

[If CONDITIONAL:] This is feasible IF [top 2-3 conditions].
[If NO GO:] To make this feasible would require [key changes].
[If INVESTIGATE:] We need to answer [key questions] before deciding.

Next review: [milestone/date].
```

---

## 5.7 Update Final Frontmatter

```yaml
workflow: deep-feasibility
status: COMPLETE

assessment:
  started: "[ISO timestamp]"
  completed: "[ISO timestamp]"
  depth: "[quick/standard/comprehensive/critical]"
  coverage_score: [C]

decision:
  verdict: "[GO/NO GO/CONDITIONAL GO/INVESTIGATE]"
  overall_score: [1-5]
  binding_constraint: "[dimension]"
  confidence: "[H/M/L]"

meta_audit:
  planning_fallacy_signals: [count]
  hofstadter_applied: [true/false]
  dk_zones: ["list"]
  confidence_type: "[genuine/theatrical]"

outputs:
  report: "generated"
  register_entry: "generated"
  summary: "generated"
```

---

## GATE_5 EVALUATION

AFTER META methods + output generation:

1. **Read tool:** data/gates.yaml
2. **Load GATE_5 conditions** (4 conditions)
3. **FOR EACH condition:**
   - G5-01: feasibility-register.md file exists (BLOCKER)
   - G5-02: feasibility-report.md file exists (BLOCKER)
   - G5-03: META methods applied (≥3 of 5) (CRITICAL)
   - G5-04: ALL frontmatter outputs present (CRITICAL)

4. **Evaluation:**
   - IF G5-01 OR G5-02 (files missing) → GATE_5 = FAIL
   - IF G5-03 OR G5-04 fail → GATE_5 = FAIL
   - ELSE → GATE_5 = PASS

5. **IF GATE_5 = FAIL:**
   - HALT — no incomplete outputs
   - Generate missing deliverables
   - RERUN Step 5

6. **IF GATE_5 = PASS:**
   - Process COMPLETE
   - All deliverables ready

## VIOLATION CHECKS

**R2 COMPLETENESS:**
- ALL outputs from frontmatter generated (no partial deliverables)

**R12 JUST-IN-TIME:**
- Process complete — no further steps to load

---

## 5.8 Completion

Assessment complete. Deliverables:

1. ✓ Feasibility Report (full document)
2. ✓ Register Entry (YAML)
3. ✓ Decision Summary (paragraph)
4. ✓ META Audit (embedded in report)

**Handoff points:**
- → Deep-Risk: Conditions and decay triggers for risk monitoring
- → Project Management: Decision and conditions for planning
- → Stakeholders: Summary for communication

---

## Output Checklist

Final verification:

- [ ] Report complete with all sections
- [ ] Register entry generated
- [ ] Summary written
- [ ] META audit applied and documented
- [ ] Coverage score meets depth threshold
- [ ] Recommendations are actionable
- [ ] Handoff points identified
