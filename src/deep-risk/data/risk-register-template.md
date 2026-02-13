# Risk Register Entry Template

Use this template for each risk in the register.

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  RISK REGISTER ENTRY                                                       ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ID:           RISK-[NNN]                                                  ║
║  Title:        [Short descriptive name - max 60 chars]                    ║
║  Status:       [ ] OPEN [ ] MITIGATED [ ] CLOSED [ ] ACCEPTED             ║
║  Last Updated: [YYYY-MM-DD]                                                ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  CLASSIFICATION                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Category:     [Architecture | Data | Security | Operations | Dependency |║
║                 People | Regulatory | Financial | Timeline | Strategic]   ║
║                                                                            ║
║  Genesis:      [Complexity | Coupling | Uncertainty | Agency |            ║
║                 Temporality | Boundary]                                   ║
║                                                                            ║
║  Uncertainty:  [Risk | Uncertainty | Ambiguity]                           ║
║                × [Aleatoric | Epistemic]                                  ║
║                                                                            ║
║  Discovery:    Method #[NNN] | Type: [Vertical | Horizontal]              ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  DESCRIPTION                                                               ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  What can go wrong:                                                        ║
║  [2-3 sentence description of the risk]                                   ║
║  _____________________________________________________________________    ║
║  _____________________________________________________________________    ║
║  _____________________________________________________________________    ║
║                                                                            ║
║  Root cause:                                                               ║
║  [Why does this risk exist?]                                              ║
║  _____________________________________________________________________    ║
║                                                                            ║
║  Impact if materialized:                                                   ║
║  [What happens if this risk becomes reality?]                             ║
║  _____________________________________________________________________    ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  SCORES                                                                    ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌─────────────────────┬───────┬──────────────────────────────────────┐   ║
║  │ Dimension           │ Score │ Rationale                            │   ║
║  ├─────────────────────┼───────┼──────────────────────────────────────┤   ║
║  │ P (Probability)     │  /5   │                                      │   ║
║  │ I (Impact)          │  /5   │                                      │   ║
║  │ V (Velocity)        │  /5   │                                      │   ║
║  │ D (Detectability)   │  /5   │                                      │   ║
║  │ R (Reversibility)   │  /5   │                                      │   ║
║  └─────────────────────┴───────┴──────────────────────────────────────┘   ║
║                                                                            ║
║  COMPOSITE: P × I × max(V,D,R) = ___ × ___ × ___ = ___                    ║
║                                                                            ║
║  TIER: [ ] CRITICAL (≥60) [ ] HIGH (30-59) [ ] MEDIUM (10-29) [ ] LOW (<10)║
║                                                                            ║
║  FLAGS:                                                                    ║
║  [ ] FAT_TAIL      Impact may be 100× worse than scored                   ║
║  [ ] NON_ERGODIC   Potentially game over if materialized                  ║
║  [ ] LOW_CONFIDENCE Probability estimate unreliable                       ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  INTERACTIONS                                                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  TRIGGERS (this risk triggers):                                            ║
║  → RISK-[NNN] because: _____________________________________________      ║
║  → RISK-[NNN] because: _____________________________________________      ║
║                                                                            ║
║  TRIGGERED BY (other risks trigger this):                                  ║
║  ← RISK-[NNN] because: _____________________________________________      ║
║  ← RISK-[NNN] because: _____________________________________________      ║
║                                                                            ║
║  CORRELATED WITH (tend to materialize together):                          ║
║  ⟷ RISK-[NNN] common driver: _______________________________________      ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  RESPONSE                                                                  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  STRATEGY: [ ] TERMINATE [ ] TRANSFER [ ] TREAT [ ] TOLERATE              ║
║                                                                            ║
║  MITIGATION:                                                               ║
║  [What actions are being taken to reduce probability or impact?]          ║
║  _____________________________________________________________________    ║
║  _____________________________________________________________________    ║
║                                                                            ║
║  COBRA EFFECT CHECK:                                                       ║
║  Second-order effects: ______________________________________________     ║
║  Creates new risks? [ ] NO [ ] YES - if YES: _________________________    ║
║                                                                            ║
║  IF TOLERATE:                                                              ║
║  Justification: _____________________________________________________     ║
║  Escalation trigger: ________________________________________________     ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  RESIDUAL RISK (after mitigation)                                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Residual P: ___ | Residual I: ___ | Residual Composite: ___              ║
║  Reduction: ___% | Residual Tier: _______________                         ║
║  Accepted by: ___________________ Date: _______________                   ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  MONITORING                                                                ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  LEADING INDICATOR 1:                                                      ║
║  • Signal: __________________________________________________________     ║
║  • Yellow threshold: _______________________________________________      ║
║  • Red threshold: __________________________________________________      ║
║  • Collection: [ ] Automated [ ] Manual - frequency: _______________      ║
║                                                                            ║
║  LEADING INDICATOR 2:                                                      ║
║  • Signal: __________________________________________________________     ║
║  • Yellow threshold: _______________________________________________      ║
║  • Red threshold: __________________________________________________      ║
║                                                                            ║
║  ACCUMULATION METRIC (if temporal risk):                                   ║
║  • Metric: __________________________________________________________     ║
║  • Current value: _________ Threshold: _________ Trend: __________       ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  OWNERSHIP                                                                 ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Owner:        ______________________ (responsible for mitigation)        ║
║  Escalation:   ______________________ (if threshold crossed)              ║
║  Review date:  ______________________ (next scheduled review)             ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  HISTORY                                                                   ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  [YYYY-MM-DD] Created - initial assessment                                ║
║  [YYYY-MM-DD] ______________________________________________________      ║
║  [YYYY-MM-DD] ______________________________________________________      ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

## Field Guidance

### Status
- **OPEN**: Risk identified, mitigation in progress
- **MITIGATED**: Mitigation implemented, monitoring residual
- **CLOSED**: Risk no longer applies (scope changed, eliminated)
- **ACCEPTED**: Consciously tolerated with documented justification

### Tier Thresholds
Based on composite score (P × I × max(V,D,R)):
- **CRITICAL**: ≥60 — Immediate attention required
- **HIGH**: 30-59 — Active mitigation required
- **MEDIUM**: 10-29 — Monitor and mitigate if practical
- **LOW**: <10 — Accept or treat opportunistically

### Flag Implications
- **FAT_TAIL**: Use P90/P99 estimates, not expected value
- **NON_ERGODIC**: Survival-first approach, terminate/transfer preferred
- **LOW_CONFIDENCE**: Mark for investigation, use scenarios not EV
