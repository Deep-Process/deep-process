# #003 Feasibility Scope Definition

**Phase:** 0 (FRAME)
**Tier:** 1 — Mandatory
**Purpose:** Explicitly define WHAT is being assessed and WHAT IS NOT

## Theoretical Foundation

Scope creep in feasibility assessment is as real and dangerous as scope creep in projects. Without explicit boundaries, assessment expands indefinitely or misses critical aspects.

**Key insight:** "Is this feasible?" without scope is unanswerable. "Can we deliver X by Y with Z resources assuming A, B, C?" — THAT is assessable.

## What to do

1. Define the SUBJECT precisely
2. Define the HORIZON (time boundary)
3. Define the STANDARD (what "feasible" means)
4. Define EXCLUSIONS explicitly
5. Define ASSUMPTIONS that are taken as given

## The Five Scope Elements

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SCOPE DEFINITION FRAMEWORK                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. SUBJECT: What exactly are we assessing?                                 │
│     □ The whole project?                                                    │
│     □ A specific component?                                                 │
│     □ A decision between options?                                           │
│     □ A migration path?                                                     │
│                                                                              │
│  2. HORIZON: Feasibility by when?                                           │
│     □ Next sprint?                                                          │
│     □ Next quarter?                                                         │
│     □ Next year?                                                            │
│     □ No specific deadline?                                                 │
│                                                                              │
│  3. STANDARD: Feasible means what?                                          │
│     □ Working prototype?                                                    │
│     □ Production-ready?                                                     │
│     □ Scaled to target load?                                                │
│     □ Maintained for X years?                                               │
│                                                                              │
│  4. EXCLUSIONS: What are we NOT assessing?                                  │
│     (Explicit list prevents scope creep)                                    │
│                                                                              │
│  5. ASSUMPTIONS: What are we taking as given?                               │
│     (These become risks if wrong)                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Step-by-step

### Step 1: Define Subject

Ask: "What EXACTLY are we assessing for feasibility?"

| Too Vague | Specific |
|-----------|----------|
| "The project" | "The Delta Lake data pipeline for EPR reporting" |
| "The system" | "The real-time ingestion component" |
| "The migration" | "Migration of historical data from Oracle to Databricks" |

### Step 2: Define Horizon

Ask: "Feasible BY WHEN?"

The same thing may be feasible in 12 months but infeasible in 3 months.

```
Examples:
• "By end of Q2 2024"
• "Within 6 months of project start"
• "Before regulatory deadline of March 2025"
• "No fixed deadline" (affects temporal assessment differently)
```

### Step 3: Define Standard

Ask: "What does 'feasible' MEAN for this assessment?"

| Standard | Implication |
|----------|-------------|
| Working prototype | Lower bar — demonstrates concept |
| Production-ready | Higher bar — all quality attributes |
| Scaled to 10× | Includes performance at target load |
| Operated for 3 years | Includes maintenance feasibility |

### Step 4: Define Exclusions

Explicitly list what is NOT being assessed:

```
Exclusions:
• User training and change management (separate initiative)
• Hardware procurement (assumed available)
• Third-party vendor negotiations (handled by procurement)
• Post-go-live support model (Phase 2 scope)
```

Why this matters: Prevents "but you didn't consider X" after assessment completes.

### Step 5: Define Assumptions

List what is being taken as given:

```
Assumptions:
• Mars will provide data in agreed format by March 1
• Budget of $500K is approved and available
• Azure infrastructure is already provisioned
• Team of 4 engineers remains stable throughout project
• EPR regulations don't change before go-live
```

**Critical:** Each assumption is a risk if wrong. Hand off to Deep-Risk for monitoring.

## Output format

```yaml
scope:
  subject: "Production-ready Delta Lake pipeline for EPR packaging data reporting"

  horizon:
    deadline: "2024-06-30"
    type: "fixed"  # fixed / flexible / none
    driver: "Regulatory compliance deadline"

  standard:
    level: "production-ready"
    criteria:
      - "Handles 100M records/day"
      - "99.9% uptime"
      - "Passes security review"
      - "Documented and maintainable"

  exclusions:
    - item: "User training"
      reason: "Separate change management initiative"
    - item: "Historical data migration"
      reason: "Phase 2 scope"
    - item: "Mobile interface"
      reason: "Not in requirements"

  assumptions:
    - assumption: "Mars provides data in agreed format by March 1"
      impact_if_wrong: "Pipeline design may need rework"
      probability_wrong: "Low"
      hand_off: "Deep-Risk #104"

    - assumption: "Budget of $500K approved"
      impact_if_wrong: "Scope reduction needed"
      probability_wrong: "Low"
      hand_off: "Deep-Risk"

    - assumption: "Team remains stable"
      impact_if_wrong: "Knowledge loss, schedule impact"
      probability_wrong: "Medium"
      hand_off: "Deep-Risk"

  one_sentence: |
    "Assessing feasibility of delivering a production-ready Delta Lake pipeline
    for EPR reporting by Q2 2024 with current 4-person team, assuming Mars
    data format is stable and $500K budget is available."
```

## Integration Points

- **Feeds from:** Initial request, stakeholder input
- **Feeds to:** All subsequent methods (scope bounds the assessment), Deep-Risk (assumptions as risks)

## Common Pitfalls

- **Vague subject:** "The system" instead of specific description
- **Missing horizon:** Feasibility without timeline is meaningless
- **Undefined standard:** "Feasible" means different things to different people
- **Implicit exclusions:** Assuming everyone knows what's out of scope
- **Hidden assumptions:** Taking things as given without documenting them
