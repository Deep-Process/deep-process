# Feasibility Register Entry Template
# LOAD: step-05-output.md
# PURPOSE: Concise tracking entry for feasibility assessments

---

# LOADING INSTRUCTIONS:
# 1. Generate one entry per assessment
# 2. Fill all fields from assessment data
# 3. Use for tracking and comparison across assessments

---

```yaml
# ═══════════════════════════════════════════════════════════════
# FEASIBILITY REGISTER ENTRY
# ═══════════════════════════════════════════════════════════════

id: "FEAS-[NNN]"
subject: "[Subject being assessed]"
date: "[YYYY-MM-DD]"
assessor: "[Person/Team]"
version: "1.0"

# ───────────────────────────────────────────────────────────────
# SCOPE
# ───────────────────────────────────────────────────────────────
scope:
  subject: "[Precise description of what was assessed]"
  horizon: "[By when - deadline/milestone]"
  standard: "[What 'feasible' means - working/production/scaled]"
  exclusions:
    - "[What was explicitly not assessed]"
  assumptions:
    - "[What was taken as given]"

# ───────────────────────────────────────────────────────────────
# CLASSIFICATION
# ───────────────────────────────────────────────────────────────
classification:
  cynefin_dominant: "[Clear / Complicated / Complex / Mixed]"
  complex_mode: false  # true if Complex sub-problems identified
  depth: "standard"    # quick / standard / comprehensive / critical

# ───────────────────────────────────────────────────────────────
# DIMENSION SCORES
# ───────────────────────────────────────────────────────────────
scores:
  technical:      { score: 4, confidence: "H" }
  resource:       { score: 3, confidence: "M" }
  knowledge:      { score: 4, confidence: "M" }
  organizational: { score: 3, confidence: "L" }
  temporal:       { score: 2, confidence: "H" }  # BINDING
  compositional:  { score: 3, confidence: "M" }
  economic:       { score: 4, confidence: "M" }
  regulatory:     { score: 5, confidence: "H" }
  scale:          { score: 3, confidence: "L" }
  cognitive:      { score: 4, confidence: "H" }

# ───────────────────────────────────────────────────────────────
# BINDING CONSTRAINT
# ───────────────────────────────────────────────────────────────
binding:
  dimension: "temporal"
  score: 2
  confidence: "H"
  reason: "[Why this is the binding constraint]"
  improvement: "[What would raise score by 1]"

# ───────────────────────────────────────────────────────────────
# DECISION
# ───────────────────────────────────────────────────────────────
decision:
  verdict: "CONDITIONAL GO"  # GO / NO GO / CONDITIONAL GO / INVESTIGATE
  overall_score: 2
  overall_confidence: "M"

# ───────────────────────────────────────────────────────────────
# CONDITIONS (if CONDITIONAL GO)
# ───────────────────────────────────────────────────────────────
conditions:
  - text: "[Condition 1 - feasible IF...]"
    probability: 0.7
    controller: "Partner"
    fallback: "[Plan B]"

  - text: "[Condition 2]"
    probability: 0.8
    controller: "Us"
    fallback: "[Plan B]"

compound_probability: 0.56  # Product of all condition probabilities

# ───────────────────────────────────────────────────────────────
# CONSTRAINTS
# ───────────────────────────────────────────────────────────────
constraints:
  H5: []  # Impossible
  H4: []  # Computationally infeasible
  H3:     # Structurally blocked
    - "[Constraint description]"
  H2:     # Resource constrained
    - "[Constraint description]"

contradictions:
  - r1: "[Requirement 1]"
    r2: "[Requirement 2]"
    resolved: true
    method: "[How resolved]"

variety_gap:
  - "[Missing capability 1]"
  - "[Missing capability 2]"

# ───────────────────────────────────────────────────────────────
# VALIDATION
# ───────────────────────────────────────────────────────────────
validation:
  reference_class:
    type: "[Project type]"
    on_time_rate: 0.25
    calibrated_probability: 0.30

  assumptions_tested: 3
  assumptions_confirmed: 2
  assumptions_refuted: 0
  assumptions_untested: 1

  probes_executed: 0
  probes_successful: 0

  spike_executed: false

# ───────────────────────────────────────────────────────────────
# META AUDIT
# ───────────────────────────────────────────────────────────────
meta:
  planning_fallacy_signals: 2
  hofstadter_applied: true
  hofstadter_factor: 1.5

  dunning_kruger_zones:
    - "regulatory"

  confidence_type: "genuine"  # genuine / theatrical

  meta_feasibility: "yes"  # yes / partial / no

# ───────────────────────────────────────────────────────────────
# DECAY MONITORING
# ───────────────────────────────────────────────────────────────
decay:
  next_review: "[Date or milestone]"
  review_type: "standard"  # quick / standard / full

  triggers:
    - event: "[Event that triggers reassessment]"
      action: "[What to do]"

# ───────────────────────────────────────────────────────────────
# COVERAGE
# ───────────────────────────────────────────────────────────────
coverage:
  score: 42
  threshold: 35  # For this depth
  status: "comprehensive"  # comprehensive / adequate / partial

  phases_completed: [0, 1, 2, 3, 4, 5]
  methods_executed: 28
  meta_methods_applied: 5

# ───────────────────────────────────────────────────────────────
# METADATA
# ───────────────────────────────────────────────────────────────
metadata:
  started: "[ISO timestamp]"
  completed: "[ISO timestamp]"
  workflow_version: "Deep Feasibility V1.0"
  report_link: "[Path to full report]"

# ───────────────────────────────────────────────────────────────
# HISTORY (for reassessments)
# ───────────────────────────────────────────────────────────────
history:
  - date: "[YYYY-MM-DD]"
    type: "initial"
    verdict: "CONDITIONAL GO"
    overall_score: 2

  # Add entries for reassessments:
  # - date: "[YYYY-MM-DD]"
  #   type: "reassessment"
  #   trigger: "[What triggered]"
  #   verdict: "[New verdict]"
  #   overall_score: [new score]
  #   changes: "[What changed]"
```

---

# REGISTER USAGE

## Creating New Entry
1. Copy template
2. Generate unique ID (FEAS-001, FEAS-002, etc.)
3. Fill all sections from assessment output
4. Store in project's feasibility register

## Reassessment
1. Locate existing entry by ID
2. Add new entry to `history` array
3. Update current values
4. Note what changed and why

## Querying
Use register to:
- Track all feasibility assessments for a project
- Compare assessments across projects
- Identify patterns in binding constraints
- Monitor condition status over time
- Trigger scheduled reviews
