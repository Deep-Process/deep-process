# 105 - Assumption Torture

## Phase
IDENTIFY (Vertical)

## Purpose
Graduated stress test of every assumption. Stronger than simple inversion - tests assumptions at increasing levels of wrongness to discover where the breaking point is.

## Assumption Sources

Collect assumptions from:
- Deep-Explore output (especially Assumption Stress Test #23)
- Deep-Verify output (claims marked "unsubstantiated" by #163)
- Implicit assumptions in architecture
- Timeline and budget assumptions
- Team composition assumptions
- Market and business assumptions

## Procedure

### Step 1: Assumption Collection
Gather all explicit and implicit assumptions.

**Common hidden assumptions:**
- "The API will always return in < 500ms"
- "Data volume will grow linearly"
- "Key team members will remain"
- "The vendor will maintain backwards compatibility"
- "Regulatory requirements won't change"

### Step 2: Three-Level Stress Test
For each assumption, test at three levels:

| Level | Description | Question |
|-------|-------------|----------|
| **10% wrong** | Assumption mostly holds but slightly off | What adjustments needed? |
| **50% wrong** | Assumption significantly off | What breaks? What survives? |
| **100% wrong** | Assumption completely inverted | What is the catastrophe? Survivable? |

### Step 3: Classification
Based on stress test results, classify each assumption:

| Classification | Breaking Point | Implication |
|----------------|----------------|-------------|
| **Robust** | Survives even at 100% wrong | Good - no action needed |
| **Sensitive** | Breaks between 10-50% wrong | Needs monitoring |
| **Brittle** | Breaks at 10% wrong | CRITICAL - needs mitigation or elimination |

### Step 4: Trigger Definition
For each non-robust assumption, define:
- What observable event indicates the assumption is failing?
- At what threshold should we act?

## Output Schema
```yaml
assumption_tests:
  - assumption: "Statement of the assumption"
    source: "Where this assumption came from"
    at_10pct:
      scenario: "What happens if 10% wrong"
      breaks: "[Yes|No]"
      adjustment_needed: "What we'd do"
    at_50pct:
      scenario: "What happens if 50% wrong"
      breaks: "[Yes|No]"
      impact: "What fails"
    at_100pct:
      scenario: "What happens if completely wrong"
      breaks: "[Yes|No]"
      catastrophe: "The worst case"
      survivable: "[Yes|No]"
    classification: "[Robust|Sensitive|Brittle]"
    breaking_point: "Percentage at which it breaks"
    trigger_condition: "Observable event indicating failure"
    trigger_threshold: "When to act"
```

## Quality Checks
- [ ] All explicit assumptions collected
- [ ] Implicit assumptions surfaced
- [ ] All three levels tested for each
- [ ] Classifications assigned
- [ ] Triggers defined for Sensitive and Brittle assumptions

## Connections
- Feeds into: #201 (probability calibration), #406 (contingency triggers)
- Uses output from: Deep-Explore assumptions, Deep-Verify unsubstantiated claims
- Related to: #207 (stability basin - similar concept of thresholds)

## Examples

### Technical Assumption
```yaml
assumption: "Azure Databricks will auto-scale for our workload"
source: "Architecture decision document"

at_10pct:
  scenario: "Occasional scaling delay, 5-min queue time"
  breaks: No
  adjustment_needed: "Add pre-scaling schedule for known peaks"

at_50pct:
  scenario: "Regular scaling failures during peak hours"
  breaks: Yes
  impact: "SLA for report delivery breached"

at_100pct:
  scenario: "Cluster cannot handle workload at any scale"
  breaks: Yes
  catastrophe: "Complete pipeline failure"
  survivable: No (without major rearchitecture)

classification: Sensitive
breaking_point: "~30% wrong"
trigger_condition: "Queue time exceeds 2 minutes sustained"
trigger_threshold: "3 occurrences in a week"
```

### Business Assumption
```yaml
assumption: "Client will renew contract for 3 more years"
source: "Business planning"

at_10pct:
  scenario: "Renewal but at reduced scope (-10%)"
  breaks: No
  adjustment_needed: "Adjust team allocation"

at_50pct:
  scenario: "Renewal for 1 year only, with conditions"
  breaks: No
  impact: "Investment decisions delayed, morale impact"

at_100pct:
  scenario: "Client does not renew, contract ends"
  breaks: Yes
  catastrophe: "60% of team's revenue lost"
  survivable: Maybe (depends on other clients)

classification: Sensitive
breaking_point: "~70% wrong (partial renewal OK, non-renewal not)"
trigger_condition: "Client delays renewal discussion, mentions RFP"
trigger_threshold: "2 signals in same quarter"
```

### Timeline Assumption
```yaml
assumption: "Integration testing will take 2 weeks"
source: "Project plan"

at_10pct:
  scenario: "Takes 2.5 weeks instead of 2"
  breaks: No
  adjustment_needed: "Use buffer time"

at_50pct:
  scenario: "Takes 3 weeks, several major issues found"
  breaks: No
  impact: "Compressed UAT, some risk accepted"

at_100pct:
  scenario: "Takes 4+ weeks, blocking issues discovered"
  breaks: Yes
  catastrophe: "Miss go-live date, penalties apply"
  survivable: Yes (with negotiated delay)

classification: Sensitive
breaking_point: "~60% wrong (3 weeks = trouble)"
trigger_condition: "Day 3 of integration, <30% of test cases passing"
trigger_threshold: "Immediate escalation"
```
