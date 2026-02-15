# 205 - Worst-Case Scenario Construction

## Phase
QUANTIFY

## Purpose
For top-tier risks, construct full worst-case narratives. Ensures the team genuinely understands what their scores mean in human terms. Converts abstract "Impact: 5" into concrete consequences.

## Why Narratives Matter

Numbers abstract away reality. "Impact: 5" doesn't trigger the same response as:

> "The pipeline fails during month-end close. The regulatory report is due in 4 hours. Manual recovery takes 8 hours. We miss the deadline. Penalty: €500,000. Client VP calls our CEO. Trust is damaged."

Narratives make risks visceral and actionable.

## Procedure

### Step 1: Select Top Risks
Select top 5-10 risks by composite score for worst-case construction.
Priority to:
- CRITICAL tier (≥60)
- NON_ERGODIC flagged
- FAT_TAIL flagged

### Step 2: Construct Narrative
For each risk, write a 3-5 sentence scenario covering:

| Element | Description |
|---------|-------------|
| **Trigger** | What event starts the cascade |
| **Cascade** | How the initial failure propagates |
| **Consequence** | The end-state impact |
| **Who is affected** | Specific people/teams/stakeholders |
| **Timeline** | When each stage happens |

### Step 3: Plausibility Validation
Check: "Is this plausible?"
- Avoid sci-fi scenarios
- Ground in realistic conditions
- Use historical analogies

### Step 4: Plan Survival Test
Ask: "Does our current plan survive this?"
- If YES → scenario might not be worst-case enough
- If NO → this is a genuine worst case

### Step 5: Ergodicity Check
Ask: "If this scenario materializes, can we continue operating?"
- If YES → recoverable, standard risk management
- If NO → potentially game over, flag as NON_ERGODIC

## Output Schema
```yaml
worst_cases:
  - risk_id: "RISK-XXX"
    title: "Risk short description"
    composite_score: 80

    narrative: |
      [3-5 sentence worst-case scenario describing trigger,
      cascade, consequences, who is affected, and timeline]

    trigger: "The initiating event"
    cascade_steps:
      - "First thing that happens"
      - "Which causes..."
      - "Leading to..."
    final_consequence: "The ultimate impact"
    affected_parties:
      - "Team X"
      - "Client Y"
      - "Executive Z"
    timeline: "Hours/Days/Weeks from trigger to full impact"

    plausibility:
      rating: "[High|Medium|Low]"
      historical_analog: "Similar real-world event"

    current_plan_survives: "[Yes|No|Partially]"
    survival_gaps: "What's missing in current plan"

    ergodicity_flag: "[Ergodic|Non-Ergodic]"
    game_over_scenario: "[true|false]"
```

## Quality Checks
- [ ] Top 5-10 risks have worst-case narratives
- [ ] Narratives cover trigger, cascade, consequence
- [ ] Plausibility validated (not sci-fi)
- [ ] Current plan tested against scenario
- [ ] Ergodicity explicitly checked

## Connections
- Feeds into: #206 (ergodicity input), #401 (strategy selection), #404 (degradation planning)
- Uses output from: #201 (scored risks), #301 (cascades)
- Related to: #305 (compound scenarios)

## Examples

### Example 1: Data Pipeline Failure
```yaml
risk_id: "RISK-023"
title: "Delta merge storm during peak EPR reporting"
composite_score: 80

narrative: |
  50 concurrent notebooks write to the same Delta table during month-end
  close. Merge conflicts cascade, causing exponential retry growth. Cluster
  auto-scales to maximum within 2 hours, hitting cost ceiling. Pipeline
  stalls with partial writes. EPR submission deadline is in 4 hours. Manual
  resolution requires understanding the merge conflict graph — estimated 6-8
  hours. Regulatory deadline missed. Penalty: €250,000. Client escalates to
  VP level. Relationship damaged.

trigger: "Month-end close + concurrent notebook execution"
cascade_steps:
  - "Merge conflicts begin accumulating"
  - "Retries multiply exponentially"
  - "Cluster resources exhausted"
  - "Pipeline stalls with inconsistent state"
  - "Manual intervention required but deadline looms"
final_consequence: "Regulatory deadline missed, financial penalty, trust damage"
affected_parties:
  - "Data engineering team (blame)"
  - "Finance team (can't submit)"
  - "Client VP (escalation)"
  - "Our executive sponsor"
timeline: "2 hours from trigger to full impact"

plausibility:
  rating: High
  historical_analog: "Happened to similar client in Q2 2023"

current_plan_survives: No
survival_gaps: "No merge conflict prevention, no pre-month-end testing"

ergodicity_flag: Ergodic
game_over_scenario: false
# Recoverable - painful but not existential
```

### Example 2: Key Person Departure
```yaml
risk_id: "RISK-045"
title: "Senior architect leaves without knowledge transfer"
composite_score: 60

narrative: |
  The senior architect receives an offer they can't refuse. Two weeks notice
  given on Friday. Knowledge transfer attempted but 5 years of context can't
  transfer in 10 days. Critical design decisions undocumented. New architect
  hired but takes 6 months to ramp. During gap, team makes decisions that
  contradict original architecture. Technical debt accumulates. Performance
  degrades. Eventually, partial rewrite required. Project delayed 9 months.
  Budget exceeded by 40%.

trigger: "Resignation announcement"
cascade_steps:
  - "Rushed knowledge transfer (incomplete)"
  - "Gap period without senior guidance"
  - "Suboptimal decisions made"
  - "Technical debt accumulates"
  - "Performance/quality degrades"
  - "Rewrite becomes necessary"
final_consequence: "9-month delay, 40% budget overrun, team morale damaged"
affected_parties:
  - "Development team"
  - "Project manager"
  - "Client stakeholders"
timeline: "2 weeks to departure, 6 months to full impact visibility"

plausibility:
  rating: High
  historical_analog: "Common pattern in software projects"

current_plan_survives: Partially
survival_gaps: "No documentation, no cross-training, no succession plan"

ergodicity_flag: Ergodic
game_over_scenario: false
# Painful but recoverable
```

### Example 3: Client Contract Termination (Non-Ergodic)
```yaml
risk_id: "RISK-067"
title: "Primary client terminates contract"
composite_score: 50

narrative: |
  Client's new CTO decides to bring data engineering in-house. 90-day
  termination notice given. This client represents 60% of team's revenue.
  Attempts to retain fail. Transition period chaotic. 60% of team has no
  work after contract ends. Layoffs required. Remaining team demoralized.
  Senior engineers leave for stability. Reputation in market damaged as
  "they lost their biggest client." Recruiting becomes harder. Spiral
  continues.

trigger: "Client termination notice"
cascade_steps:
  - "Failed retention attempts"
  - "Team uncertainty and job searching"
  - "90-day transition"
  - "Post-transition revenue cliff"
  - "Layoffs required"
  - "Remaining talent flight"
  - "Reputation damage"
final_consequence: "Team may not survive in current form"
affected_parties:
  - "Entire team"
  - "Team leadership"
  - "Company management"
  - "Team members' families"
timeline: "90 days to contract end, 6 months to full impact"

plausibility:
  rating: Medium
  historical_analog: "Happens to consulting teams regularly"

current_plan_survives: No
survival_gaps: "No client diversification, no contingency planning"

ergodicity_flag: Non-Ergodic
game_over_scenario: true
# Potentially existential for this team
```

## Narrative Writing Tips

1. **Be specific:** Names, numbers, dates (even if fictional)
2. **Include emotion:** How people will feel, not just what happens
3. **Show cascade:** One thing leads to another
4. **Ground in reality:** Use historical analogs
5. **Test your reaction:** If narrative doesn't make you uncomfortable, it's not worst-case enough
