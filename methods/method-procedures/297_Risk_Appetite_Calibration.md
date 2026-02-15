# 602 - Risk Appetite Calibration

## Phase
META (Continuous)

## Purpose
Make explicit how much risk the team/org will accept. More importantly, identify gaps between STATED appetite and REVEALED appetite (what they actually do).

## When to Apply
- After MITIGATE phase (check if decisions match appetite)
- Before OUTPUT (confirm appetite alignment)

## Risk Appetite Dimensions

| Dimension | Conservative | Moderate | Aggressive |
|-----------|-------------|----------|------------|
| **Financial** | No risk of loss | Controlled risk | High risk/high return |
| **Timeline** | Buffer everywhere | Tight but achievable | Ambitious, accept slip |
| **Technical** | Proven only | Proven core, experimental edges | Cutting edge |
| **Reputation** | Zero incidents | Managed response | Move fast, apologize |
| **Regulatory** | Exceed requirements | Meet requirements | Minimum viable |

## The Stated vs Revealed Gap

**Stated Appetite:** What leadership SAYS they want
**Revealed Appetite:** What decisions ACTUALLY show

The gap between these is itself a risk:
- Creates inconsistent decision-making
- Leads to misaligned expectations
- Causes conflict when reality hits

## Procedure

### Step 1: Capture Stated Appetite
Document what stakeholders SAY about risk appetite:
- Leadership statements
- Policy documents
- Strategy presentations

### Step 2: Capture Revealed Appetite
Document what decisions SHOW about risk appetite:
- Actual trade-offs made
- TOLERATE decisions in #401
- Budget allocations
- Resource decisions

### Step 3: Compare Stated vs Revealed
For each dimension:
- What's the stated position?
- What do actual decisions reveal?
- Is there a gap?

### Step 4: Surface and Resolve Gaps
Gaps must be resolved:
- Either adjust stated appetite (align policy with reality)
- Or adjust decisions (align reality with policy)
- Or acknowledge the contradiction (consciously accept inconsistency)

### Step 5: Calibrate Future Decisions
Use aligned appetite to guide #401 strategy selection.

## Output Schema
```yaml
risk_appetite:
  dimensions:
    - dimension: "Financial"
      stated_appetite:
        level: "[Conservative|Moderate|Aggressive]"
        evidence: "What documents/statements say"
      revealed_appetite:
        level: "[Conservative|Moderate|Aggressive]"
        evidence: "What decisions show"
      gap: "[None|Minor|Significant]"
      gap_description: "How stated and revealed differ"
      resolution: "How to resolve the gap"

  overall_assessment:
    alignment: "[Well aligned|Minor gaps|Significant gaps]"
    primary_gap: "Biggest inconsistency"
    implication: "What this means for risk decisions"

  recommendations:
    - recommendation: "What to change"
      affects: "Which dimension"
      action: "Specific action"
```

## Quality Checks
- [ ] All dimensions assessed
- [ ] Stated appetite documented with evidence
- [ ] Revealed appetite documented with evidence
- [ ] Gaps identified
- [ ] Resolution proposed

## Connections
- Feeds into: #401 (appetite guides strategy selection)
- Uses output from: #401 (TOLERATE decisions reveal appetite)
- Related to: #601 (bias can distort appetite perception)

## Examples

### Financial Dimension
```yaml
dimension: Financial
stated_appetite:
  level: Conservative
  evidence: "CEO in all-hands: 'We don't take unnecessary financial risks'"
revealed_appetite:
  level: Moderate
  evidence: |
    - Tolerated budget overrun risk (RISK-051) without mitigation
    - Approved aggressive timeline with penalty clause
    - Chose cost-optimized infrastructure over resilient option
gap: Significant
gap_description: |
  Leadership says conservative, but decisions consistently
  trade cost for risk. Actual behavior is moderate risk appetite.
resolution: |
  Option 1: Acknowledge moderate appetite (update policy)
  Option 2: Change decisions to match conservative stance
  Recommended: Option 1 - stated appetite unrealistic
```

### Technical Dimension
```yaml
dimension: Technical
stated_appetite:
  level: Aggressive
  evidence: "Strategy doc: 'We lead with innovative technology'"
revealed_appetite:
  level: Conservative
  evidence: |
    - All TREAT decisions favor proven solutions
    - Experimental technologies rejected in architecture reviews
    - "Too risky" cited for every new tool proposal
gap: Significant
gap_description: |
  Strategy says aggressive/innovative, but actual decisions
  are very conservative. Fear of failure overrides stated appetite.
resolution: |
  Option 1: Acknowledge conservative appetite (update strategy)
  Option 2: Create safe space for controlled experiments
  Recommended: Option 2 - stated appetite is aspirational
```

### Timeline Dimension
```yaml
dimension: Timeline
stated_appetite:
  level: Moderate
  evidence: "Project charter: 'Realistic timelines with appropriate buffer'"
revealed_appetite:
  level: Aggressive
  evidence: |
    - Buffer removed in every negotiation
    - "Stretch goals" always chosen over conservative
    - Schedule risks consistently tolerated without mitigation
gap: Minor
gap_description: |
  Policy says moderate, behavior slightly aggressive.
  Consistent pattern of accepting timeline risk.
resolution: |
  Either: Add buffer policy enforcement
  Or: Acknowledge aggressive timeline appetite
```

## The Appetite Conversation

When gap is found, facilitate conversation:

**Questions to ask:**
1. "We say X but do Y - which is correct?"
2. "Are we comfortable with the actual appetite we're showing?"
3. "What would change if we truly followed stated appetite?"
4. "What signals are we sending to the team?"

**Outcomes:**
- Align stated to revealed (policy catches up to reality)
- Align revealed to stated (behavior catches up to policy)
- Conscious inconsistency (acknowledge and manage)

## Appetite Calibration Red Flags

| Red Flag | What It Means |
|----------|---------------|
| "Zero risk tolerance" stated | Unrealistic - some risk is inevitable |
| Gap in every dimension | Stated appetite is fiction |
| Different appetites for different people | Inconsistent decision-making |
| Appetite changes with audience | Trust issue |
| "Do as I say, not as I do" | Leadership credibility issue |

## Appetite Impact on #401 Strategy

Once appetite is calibrated, use it in strategy selection:

| Appetite | Implication for Strategy |
|----------|-------------------------|
| Conservative | Prefer TERMINATE/TRANSFER over TREAT/TOLERATE |
| Moderate | TREAT most, TOLERATE low-tier only |
| Aggressive | TOLERATE more, invest in DETECT/RECOVER over PREVENT |
