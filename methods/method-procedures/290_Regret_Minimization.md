# 408 - Regret Minimization Framework

## Phase
MITIGATE

## Purpose
For irreversible decisions under uncertainty, apply regret minimization - project forward and ask which choice you'd regret more. Especially powerful when probability estimates are unreliable (Knight-Uncertainty).

## When to Use

Use regret minimization when:
- Decision is largely **irreversible**
- Probability estimates are **unreliable** (Knight-Uncertainty from #002)
- Multiple **viable options** exist
- Standard cost-benefit (#402) feels insufficient
- **Non-ergodic risks** are involved (#206)

For routine, reversible decisions → standard cost-benefit is sufficient.

## Procedure

### Step 1: Identify Decision Points
Select decisions where:
- #206 flagged non-ergodic risks
- #002 classified as Uncertainty or Ambiguity
- Reversibility score ≥4
- High stakes outcome

### Step 2: Project Forward
For each option, project to multiple time horizons:
- 1 year from now
- 3 years from now
- 10 years from now

### Step 3: Assess Both Regret Types

| Regret Type | Question | Typical Pattern |
|-------------|----------|-----------------|
| **Regret of Action** | "I wish I hadn't done X" | Usually fades - you learn from mistakes |
| **Regret of Inaction** | "I wish I had done X" | Usually grows - missed opportunities haunt |

For each option at each time horizon:
- What would you regret if you DID this?
- What would you regret if you DIDN'T do this?

### Step 4: Apply Minimax Regret
Choose the option that **minimizes maximum regret**.

```
For each option:
  - Identify worst-case regret
  - Record magnitude of that regret

Choose: option with smallest "worst-case regret"
```

This is NOT expected value optimization. It's "what can I live with if wrong?"

### Step 5: Document Decision Rationale
Record:
- Why regret minimization was used
- Regret assessments for each option
- Minimax choice and reasoning

## Output Schema
```yaml
regret_analysis:
  - decision: "Description of the decision"
    trigger: "Why regret minimization applies"
    non_ergodic: "[true|false]"
    uncertainty_type: "Knight classification"

    options:
      - option_name: "Option A"
        description: "What this option means"

        regret_of_action:
          at_1_year: "What I'd regret if I did this"
          at_3_years: "..."
          at_10_years: "..."
          magnitude: "[Low|Medium|High|Severe]"
          fades_or_grows: "[Fades|Grows|Stable]"

        regret_of_inaction:
          at_1_year: "What I'd regret if I didn't do this"
          at_3_years: "..."
          at_10_years: "..."
          magnitude: "[Low|Medium|High|Severe]"
          fades_or_grows: "[Fades|Grows|Stable]"

        max_regret: "[Action|Inaction]"
        max_regret_magnitude: "[Low|Medium|High|Severe]"

    minimax_choice:
      option: "Option name"
      rationale: "Why this minimizes maximum regret"

    decision_made_by: "Who made the decision"
    decision_date: "YYYY-MM-DD"
```

## Quality Checks
- [ ] Decision meets criteria for regret minimization
- [ ] Multiple time horizons considered
- [ ] Both regret types assessed
- [ ] Minimax identified
- [ ] Rationale documented

## Connections
- Feeds into: #401 (informs strategy for uncertain decisions)
- Uses output from: #002 (uncertainty type), #206 (ergodicity)
- Related to: Decision theory, Bezos "regret minimization framework"

## Example: Strategic Technology Decision

```yaml
decision: "Adopt experimental ML pipeline technology vs stay with proven stack"
trigger: "Knight-Uncertainty about technology trajectory, irreversible investment"
non_ergodic: false
uncertainty_type: "Uncertainty (unknown probability distribution)"

options:
  - option_name: "Adopt experimental ML tech"
    description: "Invest in new ML pipeline technology, bet on its success"

    regret_of_action:
      at_1_year: "Learning curve slows delivery, team frustrated"
      at_3_years: "If tech fails, wasted investment, need to migrate again"
      at_10_years: "If tech fails, footnote in history, we recovered"
      magnitude: High
      fades_or_grows: Fades  # We learn and move on

    regret_of_inaction:
      at_1_year: "Minor - proven stack still works"
      at_3_years: "Competitors using new tech pull ahead"
      at_10_years: "Missed the boat, playing catch-up, talent can't attract"
      magnitude: Severe
      fades_or_grows: Grows  # Missed opportunity compounds

    max_regret: Inaction
    max_regret_magnitude: Severe

  - option_name: "Stay with proven stack"
    description: "Continue with current technology, wait for clarity"

    regret_of_action:
      at_1_year: "None - it works"
      at_3_years: "Falling behind industry, tech debt growing"
      at_10_years: "Stuck with legacy, can't compete, can't hire"
      magnitude: Severe
      fades_or_grows: Grows

    regret_of_inaction:
      at_1_year: "None"
      at_3_years: "None significant - proven works"
      at_10_years: "If new tech fails, glad we didn't chase hype"
      magnitude: Low
      fades_or_grows: Stable

    max_regret: Action (staying = missing opportunity)
    max_regret_magnitude: Severe

minimax_choice:
  option: "Adopt experimental ML tech"
  rationale: |
    Both options have potential for severe regret.
    But the nature differs:
    - Regret of adopting and failing: We tried, learned, recovered
    - Regret of not adopting and missing out: We played it safe and lost

    The "adopt and fail" regret fades (we learn).
    The "didn't try" regret grows (opportunity compounds).

    Minimax favors adoption - smaller worst-case at 10-year horizon.

decision_made_by: "CTO + VP Engineering"
decision_date: "2024-02-20"
```

## Example: Client Concentration Risk

```yaml
decision: "Aggressively pursue client diversification vs optimize current relationship"
trigger: "Non-ergodic risk - 60% revenue concentration"
non_ergodic: true
uncertainty_type: "Uncertainty (client behavior unpredictable)"

options:
  - option_name: "Aggressive diversification"
    description: "Invest heavily in acquiring new clients, accept some current client friction"

    regret_of_action:
      at_1_year: "Current client unhappy with reduced attention"
      at_3_years: "If diversification fails, damaged relationship AND no new clients"
      at_10_years: "If failed, we tried and learned, rebuilt relationships"
      magnitude: High
      fades_or_grows: Fades

    regret_of_inaction:
      at_1_year: "Minor worry about concentration"
      at_3_years: "Still concentrated, increasingly nervous"
      at_10_years: "If client leaves, we're devastated and unprepared"
      magnitude: Severe
      fades_or_grows: Grows

    max_regret: Inaction
    max_regret_magnitude: Severe

  - option_name: "Optimize current relationship"
    description: "Double down on primary client, become indispensable"

    regret_of_action:
      at_1_year: "Concentration increases"
      at_3_years: "Even more dependent, even more nervous"
      at_10_years: "If client leaves, complete disaster. If stays, golden handcuffs."
      magnitude: Severe
      fades_or_grows: Grows

    regret_of_inaction:
      at_1_year: "Client notices competitors offering more"
      at_3_years: "Lost competitive edge with client"
      at_10_years: "Lost the client anyway, didn't even get the good years"
      magnitude: High
      fades_or_grows: Stable

    max_regret: Action (deepening dependency)
    max_regret_magnitude: Severe

minimax_choice:
  option: "Aggressive diversification"
  rationale: |
    This is a non-ergodic situation - if the worst case of concentration
    materializes (client leaves), the team may not survive.

    Both paths have severe worst cases, but:
    - Diversification worst case: We tried, failed, can rebuild
    - Concentration worst case: Existential - may not get a "next try"

    When one option has a non-ergodic worst case, that changes the calculus.
    Minimax strongly favors diversification despite short-term friction.

decision_made_by: "Leadership team"
decision_date: "2024-02-15"
```

## When NOT to Use Regret Minimization

- Routine decisions (use standard process)
- Easily reversible decisions (just try it)
- Clear probability data available (use expected value)
- Low stakes (not worth the analysis)

Regret minimization is for big, uncertain, irreversible choices.
