# Feasibility Report Template
# LOAD: step-05-output.md
# PURPOSE: Standardized output format for feasibility assessment

---

# LOADING INSTRUCTIONS:
# 1. Load this file at START of step-05
# 2. Fill in each section using data from frontmatter and phase outputs
# 3. All [PLACEHOLDER] fields must be replaced
# 4. Do not remove sections - mark as "N/A" if not applicable

---

```
═══════════════════════════════════════════════════════════════
FEASIBILITY ASSESSMENT REPORT
═══════════════════════════════════════════════════════════════

SUBJECT: [subject_name]
DATE: [ISO date]
WORKFLOW: Deep Feasibility V1.0
DEPTH: [quick / standard / comprehensive / critical]
COVERAGE SCORE: C = [score] ([comprehensive / adequate / partial])

───────────────────────────────────────────────────────────────
DECISION
───────────────────────────────────────────────────────────────

DECISION: [GO / NO GO / CONDITIONAL GO / INVESTIGATE]
OVERALL FEASIBILITY: [X]/5 ([Proven / Likely / Possible / Doubtful / Infeasible])
CONFIDENCE: [HIGH / MEDIUM / LOW]
BINDING CONSTRAINT: [Dimension] (score: [Y], confidence: [level])
COMPOUND CONDITION PROBABILITY: [Z%] (if CONDITIONAL)

───────────────────────────────────────────────────────────────
EXECUTIVE SUMMARY
───────────────────────────────────────────────────────────────

[2-3 sentence summary of decision rationale]

Key factors:
• [Factor 1 — most important, from binding constraint]
• [Factor 2]
• [Factor 3]

───────────────────────────────────────────────────────────────
FEASIBILITY PROFILE
───────────────────────────────────────────────────────────────

Technical     [████████░░]  [4]  [H]    [Brief note]
Resource      [██████░░░░]  [3]  [M]    [Brief note]
Knowledge     [████████░░]  [4]  [M]    [Brief note]
Organization  [██████░░░░]  [3]  [L]    [Brief note]
Temporal      [████░░░░░░]  [2]  [H]    [Brief note] ← BINDING
Compositional [██████░░░░]  [3]  [M]    [Brief note]
Economic      [████████░░]  [4]  [M]    [Brief note]
Regulatory    [██████████]  [5]  [H]    [Brief note]
Scale         [██████░░░░]  [3]  [L]    [Brief note]
Cognitive     [████████░░]  [4]  [H]    [Brief note]

Legend: Score 1-5, Confidence H/M/L

Binding Constraint Analysis:
  Dimension: [name]
  Current score: [X]
  What would raise by 1: [specific action]
  Cost to improve: [effort/resources needed]

───────────────────────────────────────────────────────────────
PROBLEM CHARACTERIZATION
───────────────────────────────────────────────────────────────

Scope:
  Subject: [What exactly was assessed]
  Horizon: [By when]
  Standard: [What 'feasible' means]

Cynefin Classification:
  [List components and their domains]
  • [Component 1]: [Clear / Complicated / Complex]
  • [Component 2]: [domain]
  Complex mode: [on / off]

Sub-questions Assessed:
  [List key feasibility sub-questions]
  1. [Question 1]: [assessable / investigated / probed]
  2. [Question 2]: [status]

───────────────────────────────────────────────────────────────
CONSTRAINTS IDENTIFIED
───────────────────────────────────────────────────────────────

H5 (Logically Impossible):
• [None found / List with evidence]

H4 (Computationally Infeasible):
• [List]

H3 (Structurally Blocked):
• [List with resolution approach]

H2 (Resource Constrained):
• [List with gap analysis]

H1 (Practically Difficult):
• [List]

Contradictions Found:
• [Contradiction 1]: [Resolved / Unresolved] — [resolution method or note]

Variety Gap:
• Missing capabilities: [list]
• Gap closable: [yes/no/conditional]

───────────────────────────────────────────────────────────────
DIMENSION DETAILS
───────────────────────────────────────────────────────────────

[Expand on key dimensions, especially binding constraint and low scores]

TEMPORAL FEASIBILITY (BINDING):
  Score: [X]/5, Confidence: [H/M/L]
  Critical path: [duration]
  Deadline: [date]
  Gap: [+/- time]
  Key factors:
    • [Factor 1]
    • [Factor 2]
  Improvement options:
    • [Option 1]: [impact]
    • [Option 2]: [impact]

[DIMENSION 2]:
  Score: [X]/5, Confidence: [H/M/L]
  [Key details]

[Continue for dimensions with score ≤ 3 or low confidence]

───────────────────────────────────────────────────────────────
CONDITIONS FOR FEASIBILITY
───────────────────────────────────────────────────────────────

[List all "feasible IF..." conditions]

┌─────────────────────────────────────────────────────────────┐
│ # │ Condition │ P │ Controller │ Fallback │ Monitor │
├───┼───────────┼───┼────────────┼──────────┼─────────┤
│ 1 │ [text]    │[%]│ [who]      │ [plan]   │ [how]   │
│ 2 │ [text]    │[%]│ [who]      │ [plan]   │ [how]   │
│ 3 │ [text]    │[%]│ [who]      │ [plan]   │ [how]   │
└───┴───────────┴───┴────────────┴──────────┴─────────┘

Compound Probability Calculation:
  Individual: [P1] × [P2] × [P3] × ...
  Combined: [result]%
  Interpretation: [what this means for feasibility confidence]

───────────────────────────────────────────────────────────────
CALIBRATION & VALIDATION
───────────────────────────────────────────────────────────────

Reference Class (if standard+ depth):
  Type: [Project category]
  Source: [Where data from]

  Base rates:
    • On-time: [X%]
    • On-budget: [Y%]
    • Common failure modes: [list]

  Adjustments for this project:
    • Positive: [factors making it better than typical]
    • Negative: [factors making it worse]

  Calibrated estimate:
    • Probability of on-time delivery: [Z%]
    • Expected schedule overrun: [+X%]

Critical Assumptions Tested:
  ┌────────────────────────────────────────────────────────────┐
  │ Assumption │ Impact │ Test │ Outcome │
  ├────────────┼────────┼──────┼─────────┤
  │ [text]     │ [H/M/L]│[test]│[CONFIRMED/REFUTED/UNTESTED]│
  └────────────┴────────┴──────┴─────────┘

Probes Executed (if applicable):
  • [Probe 1]: [approach] → [result] → [conclusion]
  • [Probe 2]: [approach] → [result] → [conclusion]

Integration Spike (if applicable):
  • Integration point: [description]
  • Tests: [what was tested]
  • Result: [outcome]
  • Feasibility verdict: [conclusion]

Expert Estimates (if applicable):
  • Question: [what was estimated]
  • Raw estimates: [range]
  • Calibrated estimate: [debiased value]

───────────────────────────────────────────────────────────────
META AUDIT
───────────────────────────────────────────────────────────────

Planning Fallacy Check (#501):
  Signals detected: [list or "None"]
  Assessment: [Planning fallacy likely / No significant bias detected]

Hofstadter Correction (#502):
  Applied: [Yes / No]
  Factor: [multiplier if applied]
  Original estimate: [value]
  Corrected estimate: [value]

Confidence Assessment (#503):
  Type: [Genuine / Theatrical]
  Evidence: [What supports this assessment]

Dunning-Kruger Map (#504):
  Zones identified:
  ┌─────────────┬───────────┬────────────┬────────────────┐
  │ Dimension   │ Expertise │ Confidence │ Zone           │
  ├─────────────┼───────────┼────────────┼────────────────┤
  │ [dimension] │ [H/M/L]   │ [H/M/L]    │ [DK/Imposter/OK]│
  └─────────────┴───────────┴────────────┴────────────────┘
  Action for DK zones: [Required validation]

Meta-Feasibility (#505):
  Can this be assessed traditionally? [Yes / Partial / No]
  Reason: [if not fully assessable]
  Alternative approach: [if needed]

───────────────────────────────────────────────────────────────
DECAY MONITORING
───────────────────────────────────────────────────────────────

Reassessment Triggers:
  • [Event 1]: [Dimensions affected] → [Action]
  • [Event 2]: [Dimensions affected] → [Action]
  • [Event 3]: [Dimensions affected] → [Action]

Scheduled Reviews:
  ┌─────────────────┬─────────────┬───────────────────────────┐
  │ Milestone       │ Date/Condition │ Scope                  │
  ├─────────────────┼────────────────┼────────────────────────┤
  │ [Milestone 1]   │ [when]         │ [Quick/Standard/Full]  │
  │ [Milestone 2]   │ [when]         │ [scope]                │
  └─────────────────┴────────────────┴────────────────────────┘

───────────────────────────────────────────────────────────────
NOT CHECKED
───────────────────────────────────────────────────────────────

[List what was NOT examined with reasons — be honest]

• [Aspect 1]: Not examined because [reason]
• [Aspect 2]: Outside scope because [reason]
• [Aspect 3]: Would require [external resource/expertise]
• [Aspect 4]: Deferred to [other process/later phase]

───────────────────────────────────────────────────────────────
RECOMMENDATIONS
───────────────────────────────────────────────────────────────

[Section depends on decision — use appropriate template below]

---IF GO:---

Proceed with Implementation:
  • Standard project initiation
  • Risk monitoring per Deep-Risk integration
  • Scheduled reassessments at: [milestones]

Caveats:
  • [Caveat 1 — residual concern]
  • [Caveat 2]

---IF NO GO:---

Stop Current Approach. Options:

1. REDESIGN to address [binding constraint]:
   What would make it feasible: [specific changes]
   Estimated impact: [how much this changes things]

2. REDUCE SCOPE:
   What could be cut: [items]
   Remaining feasibility: [estimate]

3. EXTEND TIMELINE:
   Required extension: [amount]
   New feasibility: [estimate]

4. INCREASE RESOURCES:
   What's needed: [specifics]
   New feasibility: [estimate]

---IF CONDITIONAL GO:---

Proceed Only After Securing:
  1. [Condition 1] — Owner: [who] — Deadline: [when]
  2. [Condition 2] — Owner: [who] — Deadline: [when]

Immediate Actions:
  • [Action 1 to secure conditions]
  • [Action 2]

Gate Decision:
  • Review at: [date/milestone]
  • Proceed if: [criteria]
  • Stop if: [criteria]

---IF INVESTIGATE:---

Information Needed:
  1. [Question 1] — Method: [how to answer] — Timeline: [when]
  2. [Question 2] — Method: [how] — Timeline: [when]

Decision Deadline: [date]
  If information not available by deadline: [default action]

───────────────────────────────────────────────────────────────
INTEGRATION HANDOFFS
───────────────────────────────────────────────────────────────

To Deep-Risk:
  • Conditions as risk triggers: [list]
  • Low-confidence dimensions for uncertainty analysis: [list]
  • Binding constraint as structural risk: [dimension]

To Project Management:
  • Decision: [verdict]
  • Key constraints: [list]
  • Critical conditions: [list]
  • Review schedule: [milestones]

───────────────────────────────────────────────────────────────
METADATA
───────────────────────────────────────────────────────────────

Assessment started: [ISO timestamp]
Assessment completed: [ISO timestamp]
Total duration: [time]
Depth: [quick / standard / comprehensive / critical]
Complex mode: [on / off]

Phases completed: [0, 1, 2, 3, 4, 5]
Methods executed: [count] of [expected]
Dimensions scored: 10
Constraints classified: [count]
Conditions mapped: [count]
Assumptions tested: [count]
Probes executed: [count]
META methods applied: [count]

Coverage score: C = [value]
Coverage threshold: [threshold for depth]
Coverage status: [comprehensive / adequate / partial]

Workflow version: Deep Feasibility V1.0

═══════════════════════════════════════════════════════════════
```

---

# REPORT GENERATION CHECKLIST

Before finalizing report, verify:

□ All [PLACEHOLDER] fields replaced with actual values
□ Decision matches decision-thresholds.yaml rules
□ Binding constraint correctly identified (min of dimensions)
□ Conditions list complete (for CONDITIONAL GO)
□ Reference class data included (for standard+ depth)
□ META audit complete (all 5 methods)
□ NOT CHECKED section is honest and complete
□ Recommendations are specific and actionable
□ Coverage score calculated correctly
□ All phase outputs reflected in report
