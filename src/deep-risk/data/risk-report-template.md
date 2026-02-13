# Deep-Risk Assessment Report

## Report Metadata
```yaml
report:
  id: "{REPORT-ID}"
  assessment_date: "YYYY-MM-DD"
  depth_level: "[Quick|Standard|Comprehensive|Critical]"
  assessor: "{Name}"
  reviewers: ["{Names}"]

  subject:
    name: "{Project/System Name}"
    type: "[Project|System|Process|Initiative]"
    phase: "[Exploration|Development|Production|Sunsetting]"

  version:
    report_version: "1.0"
    methodology_version: "1.0.0"
```

---

## Executive Summary

### Overall Risk Status
```
┌─────────────────────────────────────────────────────────────┐
│ PORTFOLIO STATUS: [GREEN|YELLOW|RED]                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Key Messages:                                               │
│ • {Message 1}                                               │
│ • {Message 2}                                               │
│ • {Message 3}                                               │
│                                                             │
│ Immediate Actions Required:                                 │
│ • {Action 1} - Owner: {Name} - Due: {Date}                 │
│ • {Action 2} - Owner: {Name} - Due: {Date}                 │
│                                                             │
│ Decision Requested:                                         │
│ • {Decision description}                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Risk Distribution
```
CRITICAL: ██      {N}
HIGH:     ████    {N}
MEDIUM:   ████████ {N}
LOW:      ██████   {N}
```

### Top 5 Risks
| Rank | ID | Risk | Score | Tier | Trend | Owner |
|------|-----|------|-------|------|-------|-------|
| 1 | RISK-{N} | {Description} | {Score} | {Tier} | {↑↓→} | {Name} |
| 2 | RISK-{N} | {Description} | {Score} | {Tier} | {↑↓→} | {Name} |
| 3 | RISK-{N} | {Description} | {Score} | {Tier} | {↑↓→} | {Name} |
| 4 | RISK-{N} | {Description} | {Score} | {Tier} | {↑↓→} | {Name} |
| 5 | RISK-{N} | {Description} | {Score} | {Tier} | {↑↓→} | {Name} |

---

## 1. Ground Phase: Context and Framing

### 1.1 System Characterization
```yaml
perrow_matrix:
  complexity: "[Linear|Complex]"
  complexity_evidence: "{Evidence}"
  coupling: "[Loose|Tight]"
  coupling_evidence: "{Evidence}"
  quadrant: "[Safe|Complicated|Complex|High-Risk]"
```

### 1.2 Uncertainty Classification
| Category | Classification | Evidence |
|----------|---------------|----------|
| {Category 1} | [Risk/Uncertainty/Ambiguity] | {Evidence} |
| {Category 2} | [Risk/Uncertainty/Ambiguity] | {Evidence} |

### 1.3 Risk Genesis Sources
| Source | Present | Evidence | Contribution |
|--------|---------|----------|--------------|
| Complexity | [Y/N] | {Evidence} | [High/Med/Low] |
| Coupling | [Y/N] | {Evidence} | [High/Med/Low] |
| Uncertainty | [Y/N] | {Evidence} | [High/Med/Low] |
| Agency | [Y/N] | {Evidence} | [High/Med/Low] |
| Temporality | [Y/N] | {Evidence} | [High/Med/Low] |
| Boundaries | [Y/N] | {Evidence} | [High/Med/Low] |

---

## 2. Identify Phase: Risk Discovery

### 2.1 Risk Taxonomy Coverage
| Category | Risks Found | Notable Items |
|----------|-------------|---------------|
| Technical | {N} | {Key risks} |
| Operational | {N} | {Key risks} |
| Organizational | {N} | {Key risks} |
| External | {N} | {Key risks} |
| Data | {N} | {Key risks} |
| Security | {N} | {Key risks} |
| Compliance | {N} | {Key risks} |
| Financial | {N} | {Key risks} |
| Reputational | {N} | {Key risks} |
| Strategic | {N} | {Key risks} |

### 2.2 Pattern Library Matches
| Library | Pattern ID | Pattern Name | Match Strength | Risk IDs |
|---------|-----------|--------------|----------------|----------|
| {Library} | {ID} | {Name} | [High/Moderate] | RISK-{N} |

### 2.3 Dependency Map
```
{System/Project}
├── Critical Dependencies
│   ├── {Dependency 1} - Lindy: {Years} - Risk: {Assessment}
│   └── {Dependency 2} - Lindy: {Years} - Risk: {Assessment}
├── Important Dependencies
│   └── {Dependency 3} - Lindy: {Years} - Risk: {Assessment}
└── Standard Dependencies
    └── {Dependency 4} - Lindy: {Years} - Risk: {Assessment}
```

### 2.4 Assumptions Under Test
| Assumption | Confidence | Stress Test Result | Risk Generated |
|------------|------------|-------------------|----------------|
| {Assumption} | [High/Med/Low] | {What if 50% wrong?} | RISK-{N} |

### 2.5 Blind Spots Investigated
| Quadrant | Questions Asked | Findings |
|----------|-----------------|----------|
| Unknown Unknowns | {Questions} | {Findings} |
| Unknown Knowns | {Questions} | {Findings} |

---

## 3. Quantify Phase: Risk Scoring

### 3.1 Five-Dimension Scoring Summary
| Risk ID | P | I | V | D | R | Composite | Tier | Flags |
|---------|---|---|---|---|---|-----------|------|-------|
| RISK-{N} | {1-5} | {1-5} | {1-5} | {1-5} | {1-5} | {Score} | {Tier} | {Flags} |

### 3.2 Flagged Risks

#### FAT_TAIL Risks (Extreme outcomes possible)
| Risk ID | Risk | P99 Scenario | P99 Impact |
|---------|------|--------------|------------|
| RISK-{N} | {Description} | {P99 scenario} | {P99 impact} |

#### NON_ERGODIC Risks (Existential threats)
| Risk ID | Risk | Why Non-Ergodic | Required Response |
|---------|------|-----------------|-------------------|
| RISK-{N} | {Description} | {Rationale} | {Response} |

#### LOW_CONFIDENCE Scores
| Risk ID | Risk | Confidence Issue | Mitigation |
|---------|------|-----------------|------------|
| RISK-{N} | {Description} | {Issue} | {How addressed} |

### 3.3 Cost Estimates
| Risk ID | Best Case | Most Likely | Worst Case | Expected | Method |
|---------|-----------|-------------|------------|----------|--------|
| RISK-{N} | ${Amount} | ${Amount} | ${Amount} | ${Amount} | {Method} |

---

## 4. Interact Phase: Risk Relationships

### 4.1 Risk Correlation Matrix
```
         RISK-01  RISK-02  RISK-03  RISK-04  RISK-05
RISK-01    -       ●        ○        ·        ○
RISK-02    ●       -        ○        ·        ·
RISK-03    ○       ○        -        ●        ·
RISK-04    ·       ·        ●        -        ○
RISK-05    ○       ·        ·        ○        -

● Strong correlation  ○ Moderate correlation  · Weak/None
```

### 4.2 Risk Clusters
| Cluster | Common Driver | Risks | Combined Impact |
|---------|--------------|-------|-----------------|
| CLUSTER-{N} | {Driver} | RISK-{N}, RISK-{N} | ${Amount} |

### 4.3 Cascade Paths
```
RISK-{N} [{Trigger}]
    └─► RISK-{N} (P={increase}x)
        └─► RISK-{N} (P={increase}x)
```

### 4.4 Concentration Risks
| Single Point | Failure Impact | Risks Affected | Mitigation Status |
|--------------|----------------|----------------|-------------------|
| {SPOF description} | {Impact} | RISK-{N}, RISK-{N} | [Mitigated/Unmitigated] |

### 4.5 Swiss Cheese Validation
| Risk | L1 | L2 | L3 | L4 | Independent? | Status |
|------|----|----|----|----|-------------|--------|
| RISK-{N} | {Control} | {Control} | {Control} | {Control} | [Y/N] | [OK/GAP] |

---

## 5. Mitigate Phase: Response Strategy

### 5.1 Strategy Distribution
```
TERMINATE: ██     {N} ({%})
TRANSFER:  ███    {N} ({%})
TREAT:     ████████ {N} ({%})
TOLERATE:  ████   {N} ({%})
```

### 5.2 Mitigation Plan Summary
| Risk ID | Strategy | Mitigation | Owner | Due | Status | Cost |
|---------|----------|------------|-------|-----|--------|------|
| RISK-{N} | {T/T/T/T} | {Description} | {Name} | {Date} | {Status} | ${Amount} |

### 5.3 Residual Risk Assessment
| Risk ID | Original Score | Mitigation | Residual Score | Residual Tier |
|---------|---------------|------------|----------------|---------------|
| RISK-{N} | {Score} | {Mitigation} | {Score} | {Tier} |

### 5.4 TOLERATE Decisions (Explicit Acceptances)
| Risk ID | Risk | Rationale | Accepted By | Conditions | Review Date |
|---------|------|-----------|-------------|------------|-------------|
| RISK-{N} | {Description} | {Why tolerate} | {Name} | {Conditions} | {Date} |

### 5.5 Cobra Effect Check
| Mitigation | Second-Order Effects | Third-Order Effects | Net Assessment |
|------------|---------------------|---------------------|----------------|
| {Mitigation} | {Effects} | {Effects} | [Beneficial/Neutral/Harmful] |

---

## 6. Monitor Phase: Ongoing Vigilance

### 6.1 Leading Indicators
| Risk ID | Indicator | Current | Yellow | Red | Status |
|---------|-----------|---------|--------|-----|--------|
| RISK-{N} | {Indicator} | {Value} | {Threshold} | {Threshold} | [G/Y/R] |

### 6.2 Review Cadence
| Risk ID | Velocity | Review Frequency | Next Review |
|---------|----------|------------------|-------------|
| RISK-{N} | {1-5} | {Frequency} | {Date} |

### 6.3 Escalation Protocol
| Level | Trigger | Escalate To | Response Time |
|-------|---------|-------------|---------------|
| L0 | {Trigger} | Team | {Time} |
| L1 | {Trigger} | Tech Lead | {Time} |
| L2 | {Trigger} | Director | {Time} |
| L3 | {Trigger} | VP | {Time} |
| L4 | {Trigger} | Steering | {Time} |

### 6.4 Contingency Triggers
| Risk ID | Yellow Trigger | Red Trigger | Contingency Plan |
|---------|---------------|-------------|------------------|
| RISK-{N} | {Trigger} | {Trigger} | {Plan reference} |

---

## 7. Meta Phase: Process Quality

### 7.1 Cognitive Bias Audit
| Bias | Check Performed | Finding | Countermeasure |
|------|-----------------|---------|----------------|
| Optimism | {Check} | {Finding} | {Action} |
| Anchoring | {Check} | {Finding} | {Action} |
| Confirmation | {Check} | {Finding} | {Action} |
| Availability | {Check} | {Finding} | {Action} |
| Planning Fallacy | {Check} | {Finding} | {Action} |

### 7.2 Risk Appetite Alignment
| Dimension | Stated Appetite | Revealed Appetite | Gap |
|-----------|-----------------|-------------------|-----|
| Financial | {Level} | {Level} | [None/Minor/Significant] |
| Timeline | {Level} | {Level} | [None/Minor/Significant] |
| Technical | {Level} | {Level} | [None/Minor/Significant] |
| Reputation | {Level} | {Level} | [None/Minor/Significant] |

### 7.3 Simpson's Paradox Check
| Dimension | Aggregate | Worst Subgroup | Paradox? |
|-----------|-----------|----------------|----------|
| {Dimension} | {Metric} | {Subgroup}: {Metric} | [Y/N] |

### 7.4 Goodhart's Law Check
| Metric | Gaming Likelihood | Warning Signs | Recommendation |
|--------|-------------------|---------------|----------------|
| {Metric} | [Low/Med/High] | {Signs} | {Recommendation} |

---

## 8. Portfolio View

### 8.1 Portfolio Metrics
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Total Expected Loss | ${Amount} | ${Threshold} | [G/Y/R] |
| Max Simultaneous Loss | ${Amount} | ${Threshold} | [G/Y/R] |
| Risk Concentration (Top 3) | {%} | {Threshold} | [G/Y/R] |
| Mitigation Coverage (CRIT/HIGH) | {%} | {Threshold} | [G/Y/R] |
| Monitoring Coverage | {%} | {Threshold} | [G/Y/R] |
| Non-Ergodic Unmitigated | {N} | 0 | [G/R] |
| Fat-Tail Unmitigated | {N} | 0 | [G/Y/R] |

### 8.2 Portfolio Health Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ PORTFOLIO RISK DASHBOARD                      {Date}        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Distribution:        Total Expected Loss:     Max Simul:    │
│ CRITICAL: ██ {N}    [====|.....] ${Amt}      [========|..] │
│ HIGH:     ████ {N}                                          │
│ MEDIUM:   ████████ {N}   < ${Threshold} OK   Approaching    │
│ LOW:      ██████ {N}                         ${Limit}       │
│                                                             │
│ Coverage:                                                   │
│ Mitigation (CRIT/HIGH): [========|] {%}  {Status}          │
│ Monitoring:             [======|..] {%}  {Status}          │
│                                                             │
│ EXISTENTIAL RISKS:                                          │
│ NON_ERGODIC unmitigated: {N}  {Status}                     │
│ FAT_TAIL unmitigated:    {N}  {Status}                     │
│                                                             │
│ STATUS: [GREEN|YELLOW|RED]                                  │
│ Single best improvement: {Action}                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Full Risk Register

### Risk: RISK-{NNN}
```yaml
risk:
  id: "RISK-{NNN}"
  title: "{Risk title}"
  description: "{Full description}"
  category: "{Category from taxonomy}"

  source:
    discovered_by: "{Method}"
    evidence: "{Evidence}"

  scoring:
    probability: {1-5}
    impact: {1-5}
    velocity: {1-5}
    detectability: {1-5}
    reversibility: {1-5}
    composite: {Score}
    tier: "{Tier}"

  flags:
    fat_tail: {true|false}
    non_ergodic: {true|false}
    low_confidence: {true|false}

  impacts:
    financial: "{Impact}"
    timeline: "{Impact}"
    quality: "{Impact}"
    reputation: "{Impact}"

  strategy:
    type: "{Terminate|Transfer|Treat|Tolerate}"
    rationale: "{Why this strategy}"

  mitigation:
    description: "{Mitigation description}"
    owner: "{Name}"
    due_date: "{Date}"
    status: "{Status}"
    cost: ${Amount}

  residual:
    score: {Score}
    tier: "{Tier}"
    acceptable: {true|false}

  monitoring:
    indicators:
      - name: "{Indicator}"
        current: "{Value}"
        yellow: "{Threshold}"
        red: "{Threshold}"
    review_frequency: "{Frequency}"

  relationships:
    triggers: ["RISK-{N}"]
    triggered_by: ["RISK-{N}"]
    correlates_with: ["RISK-{N}"]
    cluster: "CLUSTER-{N}"
```

[Repeat for each risk]

---

## 10. Recommendations

### Immediate Actions (This Week)
1. {Action} - Owner: {Name}
2. {Action} - Owner: {Name}

### Short-Term Actions (This Month)
1. {Action} - Owner: {Name}
2. {Action} - Owner: {Name}

### Medium-Term Actions (This Quarter)
1. {Action} - Owner: {Name}
2. {Action} - Owner: {Name}

### Decisions Required
1. {Decision} - Decision maker: {Name} - Due: {Date}

---

## 11. Appendices

### A. Method Coverage
| Phase | Method | Applied | Notes |
|-------|--------|---------|-------|
| GROUND | 001 Risk Genesis Model | [Y/N] | {Notes} |
| GROUND | 002 Uncertainty Classification | [Y/N] | {Notes} |
| ... | ... | ... | ... |

### B. Assessment Coverage Score
```yaml
coverage:
  phases_complete: {N}/7
  methods_applied: {N}/48
  quality_checks_passed: {N}/{Total}
  coverage_percentage: {%}
  gaps_identified: ["{Gap 1}", "{Gap 2}"]
```

### C. Change Log
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {Date} | {Name} | Initial assessment |

### D. Glossary
| Term | Definition |
|------|------------|
| FAT_TAIL | Risk with extreme outcomes more likely than normal distribution |
| NON_ERGODIC | Risk that can permanently end the entity's ability to participate |
| Composite Score | P × I × max(V, D, R) |

---

**Report End**

*Generated using Deep-Risk Methodology v1.0.0*
