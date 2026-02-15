# 407 - Cobra Effect Check

## Phase
MITIGATE

## Purpose
For every proposed mitigation, explicitly check if it creates NEW risks worse than the original. The cure can be worse than the disease - and often is.

## Theoretical Foundation

**The Cobra Effect:**
British India offered a bounty for dead cobras to reduce the cobra population.
→ People bred cobras to collect bounties
→ Bounty cancelled
→ Bred cobras released
→ More cobras than before

**Braess Paradox:**
Adding a road to a traffic network can INCREASE total travel time.

**Applied to risk:**
Mitigations can produce outcomes OPPOSITE to intentions.

## Procedure

### Step 1: Identify Second-Order Effects
For each mitigation, ask:
> "What second-order effects does this mitigation create?"

Think beyond the immediate effect to consequences of consequences.

### Step 2: Identify Affected Parties
> "Who is affected beyond the original risk?"

Mitigations often have unintended impacts on:
- Other teams
- Other systems
- Future development
- User behavior
- Operational costs

### Step 3: Check for Perverse Incentives
> "Does this mitigation create perverse incentives?"

When people optimize for the mitigation (instead of the goal), what happens?

### Step 4: Trace the Causal Chain
```
Mitigation
    └── Intended effect
            └── Second-order effects
                    └── Third-order effects
```

How far does the chain go? What's at the end?

### Step 5: Assess New Risks
If second/third-order effects include NEW risks:
- Score the new risk with #201
- Compare to original risk
- If new > original → COBRA EFFECT

### Step 6: Redesign if Needed
If Cobra Effect detected:
- Redesign the mitigation
- Find alternative approach
- Accept original risk if no safe mitigation exists

## Output Schema
```yaml
cobra_checks:
  - risk_id: "RISK-XXX"
    mitigation_id: "MIT-YYY"
    mitigation_description: "What the mitigation does"

    analysis:
      intended_effect: "What we want to achieve"

      second_order_effects:
        - effect: "Second-order effect 1"
          affected_parties: ["Who is affected"]
          risk_created: "[true|false]"
        - effect: "Second-order effect 2"
          affected_parties: ["Who is affected"]
          risk_created: "[true|false]"

      third_order_effects:
        - effect: "Third-order effect"
          affected_parties: ["Who is affected"]
          risk_created: "[true|false]"

      perverse_incentives:
        - incentive: "Unintended incentive created"
          likely_behavior: "How people will respond"
          consequence: "What that leads to"

    new_risks_created:
      - risk_description: "New risk from mitigation"
        estimated_score: 45
        comparison_to_original: "[Higher|Lower|Similar]"

    cobra_flag: "[true|false]"
    net_effect: "[Positive|Negative|Neutral]"

    recommendation: "[Proceed|Redesign|Reject]"
    redesign_suggestions: "Alternative approaches if needed"
```

## Quality Checks
- [ ] Second-order effects identified
- [ ] Third-order effects considered
- [ ] Perverse incentives checked
- [ ] New risks scored
- [ ] Comparison to original made
- [ ] Redesign considered if needed

## Connections
- Feeds into: #401 (may change strategy), #307 (interaction paradoxes)
- Uses output from: #401-404 (proposed mitigations)
- Related to: Theoretical Foundations (Cobra Effect, Braess Paradox)

## Examples

### Example 1: Logging Cobra Effect
```yaml
risk_id: "RISK-044"
mitigation_id: "MIT-044-A"
mitigation_description: "Add comprehensive logging to detect data issues"

analysis:
  intended_effect: "Better detectability for data quality risks"

  second_order_effects:
    - effect: "Logs contain query parameters with PII"
      affected_parties: ["Security team", "Compliance"]
      risk_created: true
    - effect: "Log volume increases storage costs 3x"
      affected_parties: ["Finance", "Infrastructure"]
      risk_created: true

  third_order_effects:
    - effect: "Cost pressure leads to log retention reduction"
      affected_parties: ["Security team (forensics)", "Compliance (audit)"]
      risk_created: true
    - effect: "Reduced retention = back to original problem"
      affected_parties: ["Data team"]
      risk_created: false  # Just back to square one

  perverse_incentives:
    - incentive: "Engineers may disable logging to avoid cost scrutiny"
      likely_behavior: "Selective logging that misses important events"
      consequence: "Worse visibility than before mitigation"

new_risks_created:
  - risk_description: "PII exposure via logs"
    estimated_score: 50
    comparison_to_original: Higher  # Original was 40
  - risk_description: "Cost overrun from log storage"
    estimated_score: 25
    comparison_to_original: Lower

cobra_flag: true
net_effect: Negative  # Created worse risk than we're mitigating

recommendation: Redesign
redesign_suggestions: |
  - Log metadata not data values
  - Tokenize/hash PII before logging
  - Implement log sampling for high-volume, low-criticality events
  - Set budget alerts before cost becomes problem
```

### Example 2: Approval Gate Cobra Effect
```yaml
risk_id: "RISK-018"
mitigation_id: "MIT-018-A"
mitigation_description: "Add approval gate before production deployment"

analysis:
  intended_effect: "Reduce deployment risk by adding review"

  second_order_effects:
    - effect: "Approval becomes bottleneck"
      affected_parties: ["Development team", "Release manager"]
      risk_created: true
    - effect: "Deployments batch up waiting for approval"
      affected_parties: ["Development team", "Product owner"]
      risk_created: true

  third_order_effects:
    - effect: "Larger batched deployments have higher risk per deployment"
      affected_parties: ["Production systems", "Users"]
      risk_created: true
    - effect: "Pressure to approve quickly reduces review quality"
      affected_parties: ["Release manager", "Production"]
      risk_created: true

  perverse_incentives:
    - incentive: "Developers combine changes to reduce approval overhead"
      likely_behavior: "Larger, riskier deployments"
      consequence: "Exactly opposite of mitigation intent"

new_risks_created:
  - risk_description: "Larger batch deployments increase blast radius"
    estimated_score: 45
    comparison_to_original: Higher  # Original single deployment risk was 30
  - risk_description: "Approval fatigue leads to rubber-stamping"
    estimated_score: 35
    comparison_to_original: Similar

cobra_flag: true
net_effect: Negative

recommendation: Redesign
redesign_suggestions: |
  - Automated checks (CI/CD) instead of human approval for standard deploys
  - Human approval only for high-risk changes (DB migrations, breaking changes)
  - Canary deployments reduce need for upfront approval
  - Smaller, more frequent deploys instead of batching
```

### Example 3: No Cobra Effect
```yaml
risk_id: "RISK-023"
mitigation_id: "MIT-023-A"
mitigation_description: "Add schema validation at ingestion"

analysis:
  intended_effect: "Catch schema mismatches before they corrupt data"

  second_order_effects:
    - effect: "Pipeline may reject valid data if validation too strict"
      affected_parties: ["Data users waiting for data"]
      risk_created: true  # But minor
    - effect: "Additional latency from validation step"
      affected_parties: ["SLA"]
      risk_created: true  # But minor

  third_order_effects:
    - effect: "May need to tune validation rules over time"
      affected_parties: ["Data engineering team"]
      risk_created: false  # Just maintenance

  perverse_incentives:
    - incentive: "None significant - validation doesn't create gaming"
      likely_behavior: "N/A"
      consequence: "N/A"

new_risks_created:
  - risk_description: "False positive rejections"
    estimated_score: 15
    comparison_to_original: Much lower  # Original was 80
  - risk_description: "Latency impact"
    estimated_score: 10
    comparison_to_original: Much lower

cobra_flag: false
net_effect: Positive

recommendation: Proceed
redesign_suggestions: "N/A - mitigation is net positive"
```

## Cobra Effect Warning Signs

| Warning Sign | What It Suggests |
|--------------|------------------|
| Mitigation adds friction | People will find workarounds |
| Mitigation measures a proxy | Goodhart's Law will kick in |
| Mitigation creates new dependencies | New failure modes introduced |
| Mitigation requires behavior change | May not be adopted correctly |
| Mitigation has significant cost | Cost-cutting may undo it later |
