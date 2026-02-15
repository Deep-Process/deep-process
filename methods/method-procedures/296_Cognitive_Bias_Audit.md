# 601 - Cognitive Bias Audit

## Phase
META (Continuous)

## Purpose
Check the risk assessment itself for known cognitive biases. The assessors have biases - acknowledge and correct for them.

## When to Apply
- After IDENTIFY phase (optimism, availability, groupthink)
- After QUANTIFY phase (anchoring, confirmation)
- Before OUTPUT (final bias check)

## Common Biases in Risk Assessment

| Bias | Distortion | Signs | Countermeasure |
|------|-----------|-------|----------------|
| **OPTIMISM** | Underestimate probabilities | All P scores < 3 | Use base rates (#204) |
| **ANCHORING** | Over-weight first estimates | First estimates unchanged despite new info | Independent re-estimation |
| **AVAILABILITY** | Overweight recent/vivid risks | Recent incidents dominate register | Systematic taxonomy (#101) |
| **GROUPTHINK** | Team converges too easily | No dissenting scores, quick consensus | Anonymous scoring |
| **NORMALCY** | Assume continuity | "It has always been fine" | Historical patterns (#106) |
| **OSTRICH** | Avoid uncomfortable topics | Obvious risks missing | Blind spots (#109) |
| **SUNK COST** | Protect past decisions | "Too invested to acknowledge risk" | Pre-committed thresholds |
| **DUNNING-KRUGER** | Overconfident in weak areas | Highest confidence where least expertise | Expertise gap mapping |
| **CONFIRMATION** | Only see supporting evidence | Contrary evidence dismissed | Contraposition (#107), Devil's advocate |

## Procedure

### Step 1: Review Assessment for Each Bias
Go through each bias and look for signs.

### Step 2: Document Findings
For each bias found, document:
- What evidence suggests this bias?
- Which risks are affected?
- What score adjustments might be needed?

### Step 3: Apply Countermeasures
For each bias found:
- Apply the countermeasure
- Re-assess affected risks
- Document the adjustment

### Step 4: Structural Prevention
For future assessments:
- Build countermeasures into the process
- Anonymous scoring for groupthink
- Base rate lookup for optimism
- Devil's advocate role for confirmation

## Output Schema
```yaml
bias_audit:
  audit_date: "YYYY-MM-DD"
  phase_audited: "[IDENTIFY|QUANTIFY|MITIGATE|OUTPUT]"
  auditor: "Who performed the audit"

  findings:
    - bias: "Name of bias"
      evidence: "What suggests this bias is present"
      affected_risks: ["RISK-XXX", "RISK-YYY"]
      severity: "[Low|Medium|High]"
      countermeasure_applied: "What we did"
      score_adjustments:
        - risk_id: "RISK-XXX"
          dimension: "P"
          original: 2
          adjusted: 3
          rationale: "Why the adjustment"

  structural_improvements:
    - improvement: "What to change in the process"
      prevents_bias: "Which bias this addresses"
      implementation: "How to implement"

  summary:
    biases_found: 3
    risks_adjusted: 5
    overall_direction: "[More conservative|More aggressive|Mixed]"
```

## Quality Checks
- [ ] All biases explicitly checked
- [ ] Evidence documented for findings
- [ ] Countermeasures applied
- [ ] Adjustments documented with rationale
- [ ] Structural improvements identified

## Connections
- Feeds into: Adjusted risk scores throughout
- Uses output from: All phases (audits their output)
- Related to: #606 (Goodhart audit - metric gaming is a bias)

## Bias Deep Dives

### Optimism Bias
**Signs:**
- P scores cluster at 1-2
- "That won't happen to us"
- Base rates not consulted
- Comparisons only to successful projects

**Countermeasure:**
- Force base rate lookup (#204)
- Ask: "What percentage of similar projects experience this?"
- Apply survivorship correction

**Example:**
```yaml
bias: Optimism
evidence: "All 25 risks have P ≤ 2, despite industry base rates suggesting 30%+ failure rate for projects of this type"
affected_risks: ["Portfolio-wide"]
severity: High
countermeasure_applied: "Re-scored top 10 risks using base rates"
score_adjustments:
  - risk_id: "RISK-015"
    dimension: P
    original: 2
    adjusted: 4
    rationale: "Base rate for integration projects is 60% overrun"
```

### Anchoring Bias
**Signs:**
- First estimates never change
- New information doesn't move scores
- "We already assessed this"

**Countermeasure:**
- Have different person re-estimate independently
- Compare estimates, investigate discrepancies
- Explicitly ask: "What would change this score?"

**Example:**
```yaml
bias: Anchoring
evidence: "RISK-023 scored P=2 at project start, still P=2 despite 3 related incidents"
affected_risks: ["RISK-023"]
severity: High
countermeasure_applied: "Independent re-estimation by different engineer"
score_adjustments:
  - risk_id: "RISK-023"
    dimension: P
    original: 2
    adjusted: 4
    rationale: "Historical data shows this happens monthly"
```

### Groupthink Bias
**Signs:**
- Quick consensus
- No debate on scores
- Everyone agrees
- Dissenters quiet or absent

**Countermeasure:**
- Anonymous scoring (before discussion)
- Assign Devil's advocate role
- Explicitly invite disagreement
- Include outsider in review

**Example:**
```yaml
bias: Groupthink
evidence: "Team of 6 reached consensus on all 30 risks in 45 minutes, no debate"
affected_risks: ["Portfolio-wide - scores suspiciously uniform"]
severity: Medium
countermeasure_applied: "Re-scored 10 highest risks with anonymous Delphi method"
score_adjustments:
  - risk_id: "RISK-067"
    dimension: I
    original: 3
    adjusted: 5
    rationale: "Anonymous scoring revealed dissenting view that team impact is existential"
```

### Normalcy Bias
**Signs:**
- "It's always worked"
- "That's never happened"
- Historical stability assumed to continue
- No consideration of regime change

**Countermeasure:**
- Ask: "What would have to change for this to break?"
- Historical pattern analysis (#106)
- Consider environmental changes

**Example:**
```yaml
bias: Normalcy
evidence: "Vendor dependency risk dismissed as 'vendor has been reliable for 5 years'"
affected_risks: ["RISK-022"]
severity: Medium
countermeasure_applied: "Researched vendor acquisitions in sector - 30% acquired within 3 years"
score_adjustments:
  - risk_id: "RISK-022"
    dimension: P
    original: 1
    adjusted: 3
    rationale: "Past reliability doesn't guarantee future - market conditions changing"
```

## Bias Audit Checklist

Before finalizing any risk output:

- [ ] **Optimism:** Are P scores realistic? Base rates consulted?
- [ ] **Anchoring:** Have we updated estimates based on new information?
- [ ] **Availability:** Are recent/vivid risks overweighted?
- [ ] **Groupthink:** Was there genuine debate? Any dissenters?
- [ ] **Normalcy:** Are we assuming things will continue as they are?
- [ ] **Ostrich:** Are there uncomfortable risks we're avoiding?
- [ ] **Sunk Cost:** Are we protecting past decisions?
- [ ] **Dunning-Kruger:** Are we most confident where we know least?
- [ ] **Confirmation:** Did we seek contrary evidence?

If any check fails → apply countermeasure before proceeding.
