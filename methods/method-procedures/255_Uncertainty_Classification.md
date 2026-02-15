# 002 - Uncertainty Classification

## Phase
GROUND

## Purpose
Classify every identified uncertainty into its fundamental type using Knight's distinction. Different types of uncertainty require fundamentally different management strategies - applying the wrong strategy is itself a risk.

## Classification Matrix

| Type | You Know... | Management Strategy | Anti-Pattern |
|------|------------|--------------------|----|
| **Risk** (known distribution) | Probability AND impact range | Calculate expected value, insure, hedge, provision reserves | Treating as uncertainty (over-investigating what's already quantifiable) |
| **Uncertainty** (unknown distribution) | That you don't know, but not the probabilities | Scenario planning, real options, build optionality, defer commitment | Treating as risk (assigning false probabilities, creating illusion of control) |
| **Ambiguity** (unclear question) | Not even what the question means | Clarify, decompose, define terms, align stakeholders | Treating as uncertainty (analyzing an unclear question produces garbage) |

## Sub-Classification

For Risk and Uncertainty, further classify:

| Sub-type | Definition | Example | Response |
|----------|-----------|---------|----------|
| **Aleatoric** (inherent randomness) | Cannot be reduced by more information | Server hardware failure rate | Build resilience, redundancy |
| **Epistemic** (knowledge gap) | CAN be reduced by investigation | "Will the API handle our load?" | Investigate, prototype, test, ask |

## Rumsfeld Matrix (Expanded)

| | **Known** | **Unknown** |
|---|---|---|
| **Known** | *Known knowns* - facts in your risk register. Manage directly. | *Known unknowns* - you know what you don't know. Investigate or hedge. |
| **Unknown** | *Unknown knowns* - organizational denial, willful blindness, taboo risks. **Most dangerous because addressable but ignored.** | *Unknown unknowns* - true surprises. Build general resilience, maintain reserves. |

## Procedure

### Step 1: Collect Uncertainties
Gather all uncertainties from:
- Genesis risks (#001)
- Deep-Explore assumptions
- Deep-Verify unsubstantiated claims
- Stakeholder concerns

### Step 2: Primary Classification
For each uncertainty: Risk / Uncertainty / Ambiguity?

### Step 3: Sub-Classification
For Risk and Uncertainty: Aleatoric / Epistemic?

### Step 4: Rumsfeld Mapping
Place in Rumsfeld quadrant. Pay special attention to "Unknown Knowns" (organizational denial).

### Step 5: Strategy Check
Is the CURRENT strategy appropriate for the type?

**Red Flags:**
- Assigning P=3 to Knight-Uncertainty (faux precision)
- Analyzing Ambiguity without clarification first
- Treating Epistemic as Aleatoric (giving up on investigation)

## Output Schema
```yaml
classified_uncertainties:
  - risk_id: "RISK-XXX"
    knight_type: "[Risk|Uncertainty|Ambiguity]"
    aleatoric_or_epistemic: "[Aleatoric|Epistemic|N/A]"
    rumsfeld_quadrant: "[Known-Known|Known-Unknown|Unknown-Known|Unknown-Unknown]"
    appropriate_strategy: "What should be done given the type"
    current_strategy: "What is currently planned"
    strategy_mismatch_flag: "[true|false]"
    mismatch_description: "Why current approach is wrong for this type"
```

## Quality Checks
- [ ] All uncertainties classified by Knight type
- [ ] Aleatoric/Epistemic distinction made where applicable
- [ ] Strategy mismatch flags reviewed
- [ ] Unknown Knowns specifically investigated

## Connections
- Feeds into: #201 (confidence flags), #402 (cost-benefit validity), #408 (regret minimization)
- Uses output from: #001 (genesis risks)
- Related to: Theoretical Foundations (Knight's Distinction)

## Examples

### Risk (Known Distribution)
```
Item: Server hardware failure
Classification: Risk - Aleatoric
Rationale: Historical MTBF data available, inherently random
Appropriate Strategy: Provision reserves, design for N+1 redundancy
```

### Uncertainty (Unknown Distribution)
```
Item: Will AI replace data engineers in 5 years?
Classification: Uncertainty - Epistemic
Rationale: Unknown probability, but can investigate trends
Appropriate Strategy: Scenario plan, build optionality, skill diversification
Anti-pattern: Assigning P=2 and treating as "low priority risk"
```

### Ambiguity
```
Item: "Is the system secure?"
Classification: Ambiguity
Rationale: Secure against whom? What threat model? What compliance standard?
Appropriate Strategy: CLARIFY FIRST - define threat model, compliance scope, attack surface
Anti-pattern: Starting security assessment before scope is defined
```
