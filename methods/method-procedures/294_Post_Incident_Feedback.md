# 504 - Post-Incident Feedback Loop

## Phase
MONITOR

## Purpose
When a risk materializes (or nearly does), capture learnings and feed back into IDENTIFY. Closes the loop - incidents improve the risk assessment process.

## Core Principle

**Every incident is data about your risk process.**

If a risk materializes:
- Was it in the register? (IDENTIFY gap)
- Was probability accurate? (QUANTIFY gap)
- Did cascades happen as mapped? (INTERACT gap)
- Did mitigation work? (MITIGATE gap)
- Did indicators fire? (MONITOR gap)

## Procedure

### Step 1: Trigger Post-Incident Review
Trigger PIR when:
- Risk materializes (incident occurs)
- Near-miss (almost materialized)
- External incident (happens elsewhere, relevant to us)

### Step 2: Blameless Post-Mortem
Conduct blameless analysis focusing on system, not individuals.

### Step 3: Risk Process Audit
Beyond standard incident analysis, specifically audit the risk process:

| Question | If Answer is NO... |
|----------|---------------------|
| Was this in our register? | IDENTIFY gap |
| Was probability accurate? | QUANTIFY gap |
| Did we see the cascades? | INTERACT gap |
| Did mitigation work? | MITIGATE gap |
| Did indicators fire in time? | MONITOR gap |
| Did escalation work? | ESCALATION gap |

### Step 4: Feed Back to Risk Process
For each gap found:
- Update the relevant phase
- Add missing risks
- Adjust scores
- Improve mitigations
- Fix monitoring

### Step 5: Track Process Improvements
Track meta-improvements to the risk process itself, not just the incident fixes.

## Blameless Post-Mortem Template

```yaml
incident_review:
  incident_id: "INC-XXXX"
  date: "YYYY-MM-DD"
  severity: "[Critical|High|Medium|Low]"
  duration: "Time from detection to resolution"
  related_risk: "RISK-XXX (if was in register) or 'NEW'"

  timeline:
    - time: "HH:MM"
      event: "What happened"
    - time: "HH:MM"
      event: "What happened next"
    # ... full timeline

  detection:
    how_detected: "How we learned about the incident"
    detection_time: "Time from occurrence to detection"
    expected_detection: "How we expected to detect"
    detection_gap: "Difference between expected and actual"

  response:
    actions_taken: ["Action 1", "Action 2"]
    followed_protocol: "[Yes|No|Partially]"
    protocol_gaps: "What was missing from protocol"
    escalation_appropriate: "[Yes|No]"

  root_cause:
    immediate_cause: "What directly caused the incident"
    contributing_factors:
      - "Factor 1"
      - "Factor 2"
    root_cause: "The fundamental why (5 whys)"

  risk_process_audit:
    in_register:
      answer: "[Yes|No]"
      gap_type: "[None|IDENTIFY gap]"
      action: "Add to register if missing"

    probability_accurate:
      answer: "[Yes|No|Underestimated|Overestimated]"
      gap_type: "[None|QUANTIFY gap]"
      original_score: "P=X"
      actual_frequency: "What actually happened"
      action: "Adjust score if needed"

    cascades_predicted:
      answer: "[Yes|No|Partially]"
      gap_type: "[None|INTERACT gap]"
      unexpected_cascades: "What cascades we didn't predict"
      action: "Add to cascade map"

    mitigation_worked:
      answer: "[Yes|No|Partially]"
      gap_type: "[None|MITIGATE gap]"
      mitigation_failures: "What didn't work"
      action: "Strengthen/redesign mitigation"

    indicators_fired:
      answer: "[Yes|No|Too late]"
      gap_type: "[None|MONITOR gap]"
      indicator_failures: "What should have alerted"
      action: "Add/improve indicators"

    escalation_worked:
      answer: "[Yes|No|Partially]"
      gap_type: "[None|ESCALATION gap]"
      escalation_issues: "What went wrong with escalation"
      action: "Improve escalation protocol"

  actions:
    immediate:
      - action: "Immediate fix"
        owner: "Name"
        due: "YYYY-MM-DD"
    short_term:
      - action: "Near-term improvement"
        owner: "Name"
        due: "YYYY-MM-DD"
    process_improvements:
      - action: "Risk process improvement"
        owner: "Name"
        due: "YYYY-MM-DD"

  learnings:
    what_went_well: ["Thing 1", "Thing 2"]
    what_to_improve: ["Thing 1", "Thing 2"]
    process_level_learning: "Meta-learning about our risk process"
```

## Quality Checks
- [ ] Timeline documented
- [ ] Root cause identified (not just symptoms)
- [ ] Risk process audit completed
- [ ] Actions assigned with owners and dates
- [ ] Learnings documented
- [ ] Risk register/process updated

## Connections
- Feeds into: All phases (based on gaps found)
- Uses output from: Incident data, risk register
- Related to: #601 (bias audit - are we learning correctly?)

## Example: Pipeline Failure Incident

```yaml
incident_id: "INC-2024-023"
date: "2024-02-15"
severity: High
duration: "6 hours"
related_risk: "RISK-023: Source schema change breaks pipeline"

timeline:
  - time: "03:00"
    event: "Source system deployed schema change (unannounced)"
  - time: "03:15"
    event: "Pipeline ingestion started"
  - time: "03:22"
    event: "Pipeline failed with parsing error"
  - time: "05:30"
    event: "On-call engineer paged (alert delay)"
  - time: "06:00"
    event: "Root cause identified"
  - time: "08:30"
    event: "Hotfix deployed"
  - time: "09:00"
    event: "Pipeline backfill complete"

detection:
  how_detected: "Pipeline failure alert (delayed)"
  detection_time: "2 hours from failure"
  expected_detection: "15 minutes"
  detection_gap: "Alert threshold too high, didn't fire until retry exhausted"

response:
  actions_taken:
    - "Identified schema change"
    - "Contacted source team"
    - "Developed hotfix"
    - "Deployed and backfilled"
  followed_protocol: Partially
  protocol_gaps: "No runbook for schema change scenario"
  escalation_appropriate: "Yes - EM engaged at 06:30"

root_cause:
  immediate_cause: "Source system changed column type from string to int"
  contributing_factors:
    - "No schema validation at ingestion"
    - "No communication protocol with source team"
    - "Alert threshold too conservative"
  root_cause: "Implicit assumption that source schema is stable, no defensive validation"

risk_process_audit:
  in_register:
    answer: Yes
    gap_type: None
    action: "No action needed - risk was known"

  probability_accurate:
    answer: Underestimated
    gap_type: QUANTIFY gap
    original_score: "P=2"
    actual_frequency: "This is 3rd occurrence in 6 months"
    action: "Adjust P from 2 to 4"

  cascades_predicted:
    answer: Partially
    gap_type: INTERACT gap
    unexpected_cascades: "Downstream reporting also failed (not mapped)"
    action: "Add cascade to RISK-031"

  mitigation_worked:
    answer: No
    gap_type: MITIGATE gap
    mitigation_failures: "Schema validation was planned but not implemented"
    action: "Prioritize schema validation implementation"

  indicators_fired:
    answer: Too late
    gap_type: MONITOR gap
    indicator_failures: "Alert threshold was 5 failures, schema change failed first try"
    action: "Add schema change detection indicator, reduce alert threshold to 1"

  escalation_worked:
    answer: Yes
    gap_type: None
    action: "No action needed"

actions:
  immediate:
    - action: "Reduce alert threshold to 1 failure"
      owner: "Platform Lead"
      due: "2024-02-16"
  short_term:
    - action: "Implement schema validation (Great Expectations)"
      owner: "Data Engineer"
      due: "2024-03-01"
    - action: "Establish communication protocol with source team"
      owner: "EM"
      due: "2024-02-28"
  process_improvements:
    - action: "Update RISK-023 score to P=4"
      owner: "Risk Lead"
      due: "2024-02-16"
    - action: "Add missing cascade to risk map"
      owner: "Risk Lead"
      due: "2024-02-16"
    - action: "Create schema change runbook"
      owner: "Platform Lead"
      due: "2024-02-28"

learnings:
  what_went_well:
    - "Quick root cause identification once engaged"
    - "Hotfix deployed efficiently"
    - "Escalation protocol followed"
  what_to_improve:
    - "Detection was too slow"
    - "Mitigation wasn't implemented despite being planned"
    - "Cascade effects weren't fully mapped"
  process_level_learning: |
    We had this risk in the register but underestimated probability
    and didn't implement planned mitigations. The gap isn't in IDENTIFY
    but in follow-through. Need to track mitigation implementation status.
```

## Feedback Loop Metrics

Track over time:
- % of incidents that were in register (IDENTIFY effectiveness)
- Average gap between predicted and actual probability (QUANTIFY accuracy)
- % of cascades that were predicted (INTERACT completeness)
- % of mitigations that worked as expected (MITIGATE effectiveness)
- Average detection time vs expected (MONITOR effectiveness)
