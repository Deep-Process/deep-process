# 405 - Residual Risk Assessment

## Phase
MITIGATE

## Purpose
After designing mitigations, re-score each risk. Residual risk = actual risk carried after mitigations in place. Must be explicitly accepted.

## Core Concept

**Inherent Risk:** Risk before any mitigation
**Residual Risk:** Risk remaining after mitigation

```
Inherent Risk → [Mitigation] → Residual Risk
```

Residual risk is what you actually carry. It must be:
- Quantified
- Compared to original
- Explicitly accepted by someone with authority

## Procedure

### Step 1: Re-Apply 5D Scoring
For each risk with mitigation designed, re-score assuming mitigations are in place:

| Dimension | Re-score considering... |
|-----------|------------------------|
| P (Probability) | How much does mitigation reduce likelihood? |
| I (Impact) | How much does mitigation reduce severity? |
| V (Velocity) | Does detection give more warning time? |
| D (Detectability) | Does monitoring make it more visible? |
| R (Reversibility) | Does recovery make it easier to undo? |

### Step 2: Calculate Reduction
```
Reduction % = (Original Score - Residual Score) / Original Score × 100
```

### Step 3: Explicit Acceptance
For each residual risk:
- Who accepts this residual level?
- Are they authorized to accept this level?
- Is the acceptance documented?

### Step 4: Portfolio Check
Sum of residual risks = actual portfolio risk.

**Critical:** Individual risks acceptable ≠ Portfolio acceptable

Check:
- Total residual expected loss vs budget/tolerance
- Concentration of residual risk
- Any residual non-ergodic risks

### Step 5: Re-Check Ergodicity
Are any residual risks still NON_ERGODIC?
If so, is tolerance truly justified?

## Output Schema
```yaml
residual_assessments:
  - risk_id: "RISK-XXX"
    title: "Risk description"

    original_scores:
      P: 4
      I: 4
      V: 3
      D: 4
      R: 3
      composite: 64
      tier: "CRITICAL"

    mitigations_applied:
      - "Mitigation 1 description"
      - "Mitigation 2 description"

    residual_scores:
      P: 2
      I: 3
      V: 2
      D: 2
      R: 2
      composite: 12
      tier: "MEDIUM"

    analysis:
      reduction_percent: 81  # (64-12)/64 × 100
      most_improved: "Detectability (4→2)"
      least_improved: "Impact (4→3)"

    acceptance:
      accepted_by: "Name and role"
      acceptance_date: "YYYY-MM-DD"
      authority_verified: true
      justification: "Why this residual level is acceptable"

    flags:
      still_non_ergodic: false
      still_fat_tail: false
      requires_monitoring: true
```

## Quality Checks
- [ ] All 5 dimensions re-scored
- [ ] Reduction calculated
- [ ] Acceptance documented with authority
- [ ] Portfolio-level check performed
- [ ] Ergodicity re-checked

## Connections
- Feeds into: #603 (portfolio view of residual risks)
- Uses output from: #201 (original scores), #401-404 (mitigations)
- Related to: #206 (non-ergodic risks need extra scrutiny)

## Example

```yaml
risk_id: "RISK-023"
title: "Source schema change breaks pipeline"

original_scores:
  P: 4  # 50-80% likely
  I: 4  # Major impact
  V: 5  # Instant failure
  D: 4  # Hard to detect beforehand
  R: 2  # Recoverable with effort
  composite: 80  # 4 × 4 × 5
  tier: "CRITICAL"

mitigations_applied:
  - "Schema validation at ingestion (Great Expectations)"
  - "Source schema monitoring with alerts"
  - "Delta time travel for recovery"
  - "Communication protocol with source team"

residual_scores:
  P: 2  # Now 5-20% - most changes caught
  I: 3  # Significant but contained
  V: 3  # Detection gives some warning
  D: 2  # Monitoring catches most issues
  R: 2  # Same recovery capability
  composite: 18  # 2 × 3 × 3
  tier: "MEDIUM"

analysis:
  reduction_percent: 78
  most_improved: "Probability (4→2) and Detectability (4→2)"
  least_improved: "Reversibility unchanged (already good)"

acceptance:
  accepted_by: "Maria Chen, Engineering Manager"
  acceptance_date: "2024-02-15"
  authority_verified: true
  justification: |
    Residual MEDIUM tier is within team's risk tolerance.
    Monitoring in place will catch escalation.
    Recovery capability proven in testing.

flags:
  still_non_ergodic: false
  still_fat_tail: false
  requires_monitoring: true
```

## Portfolio Residual Summary

After individual residual assessments, summarize:

```yaml
portfolio_residual:
  total_risks: 25
  original_portfolio:
    critical: 5
    high: 8
    medium: 7
    low: 5
    total_expected_loss: 450000

  residual_portfolio:
    critical: 1
    high: 3
    medium: 12
    low: 9
    total_expected_loss: 125000

  reduction:
    critical_reduction: "5 → 1 (80%)"
    total_expected_loss_reduction: "72%"

  remaining_concerns:
    - risk_id: "RISK-067"
      concern: "Still CRITICAL, still NON_ERGODIC"
      action: "Executive-level acceptance required"

  portfolio_acceptable: true
  accepted_by: "VP Engineering"
  acceptance_date: "2024-02-20"
```

## Residual Risk Traps

1. **Paper mitigation:** Mitigation exists on paper but not in practice → actual residual higher
2. **Optimistic scoring:** Assuming mitigation works perfectly → underestimate residual
3. **No acceptance authority:** Residual accepted by wrong level → organizational risk
4. **Portfolio blindness:** Individual residuals acceptable but sum is not
5. **Forgetting non-ergodic:** Reducing 90→50 for existential risk still leaves existential risk
