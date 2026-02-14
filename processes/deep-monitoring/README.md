# deep-monitoring

Post-execution quality monitoring for deep-process executions.

## What This Is

deep-monitoring inspects process artifacts (process-log.yaml, etc.) to verify execution quality, detect violations, and generate quality reports.

**Monitors:**
- Gate passage (GATE_0 through GATE_N)
- Assumption declarations
- Counter-check execution
- Evidence quality (VERIFIED vs ASSUMED ratio)
- Scope reductions
- Execution completeness

**Detects:**
- Gate blocking violations
- Missing mandatory elements (assumptions, counter-checks)
- Anomalies (rubber-stamping, excessive assumptions)
- Quality gaps (below thresholds)
- Patterns (systematic issues)

**Produces:**
- Overall verdict (FAILED | INSUFFICIENT | MARGINAL | PASSED_WITH_CONCERNS | PASSED)
- Metrics dashboard (gate pass rate, completeness score, evidence ratio)
- Prioritized findings (CRITICAL | MAJOR | MINOR)
- Actionable recommendations (IMMEDIATE | PRIORITY | PLANNED | ONGOING)

## How to Use

```bash
# Monitor a completed deep-risk execution
Use the process in processes/deep-monitoring/workflow.md to monitor the execution in output/deep-risk-2024-02-14/
```

The process will:
1. **SETUP** — Define monitoring scope, identify artifacts
2. **COLLECT** — Extract data from process-log.yaml and artifacts
3. **ANALYZE** — Calculate quality metrics (gates, assumptions, counter-checks, completeness)
4. **DETECT** — Find violations, anomalies, gaps, patterns
5. **ASSESS** — Evaluate impact, urgency, risk; prioritize findings
6. **REPORT** — Generate monitoring report with recommendations

## What It's Good At

- **Quality Assurance** — Verify process execution followed protocol
- **Violation Detection** — Find gate blocking, missing elements, unapproved omissions
- **Anomaly Detection** — Spot rubber-stamping, excessive assumptions, suspicious patterns
- **Gap Analysis** — Identify below-threshold performance
- **Risk Assessment** — Prioritize findings by impact and urgency
- **Actionable Recommendations** — Specific steps to remediate issues

## Limitations

- **Post-execution only** — Cannot intervene during execution (MVP design)
- **Artifact-dependent** — Requires process-log.yaml; cannot monitor processes that don't generate logs
- **No real-time alerts** — Detects issues after completion, not during
- **Pattern library limited** — Detects common issues but may miss domain-specific problems

## Monitoring Scopes

**GATE_ONLY** (Quick)
- Monitor gate pass/fail, violations, counter-checks
- Fast (5-10 minutes)
- Use for routine quality checks

**COMPREHENSIVE** (Thorough)
- Monitor gates + domain metrics + assumptions + evidence ratio
- Slower (15-30 minutes)
- Use for high-stakes process executions

**SELECTIVE** (Custom)
- Monitor user-specified dimensions only
- Variable duration
- Use when you know what to watch for

## Thresholds (Default)

```yaml
gates_passed_min: 80%        # 80% of gates must pass
counter_checks_min: 2         # 2 counter-checks per phase
verified_ratio_min: 30%       # 30% evidence must be VERIFIED
assumptions_declared_min: 1   # 1 assumption per phase
```

Customize in step-00 (SETUP).

## Verdicts

| Verdict | Meaning | Action |
|---------|---------|--------|
| **FAILED** | Critical violations detected | Do not use process results |
| **INSUFFICIENT** | Completeness <60% | Assess if results trustworthy |
| **MARGINAL** | Below thresholds | Use with caution |
| **PASSED_WITH_CONCERNS** | Quality concerns present | Address before next execution |
| **PASSED** | Within quality standards | Safe to use results |

## Output Example

```markdown
# MONITORING REPORT

**Process:** deep-risk v2.2.0
**Execution ID:** 2024-02-14-143022
**Overall Verdict:** PASSED_WITH_CONCERNS

**Key Metrics:**
- Gate Pass Rate: 85.7% (6/7 gates passed)
- Execution Completeness: 78%
- Critical Findings: 0
- Immediate Actions Required: 2

**Top 3 Concerns:**
1. Phase 3 missing counter-checks — Risk: MAJOR
2. Evidence ratio below threshold (25% < 30%) — Risk: MEDIUM
3. Scope reduction in Phase 5 unapproved — Risk: MAJOR

**Recommendation:** Address 2 immediate actions before using risk assessment results.
```

## Integration

Works with any deep-process that generates:
- `process-log.yaml` with gates, assumptions, counter-checks
- Process-specific artifacts (optional, for COMPREHENSIVE scope)

Integrates with:
- **deep-orchestration** — Monitor orchestrated workflows
- **deep-governance** — Compliance evidence generation
- **deep-verify** — Quality assurance pipeline

## Architecture

- **Type:** Artifact-based (inspects YAML/MD files)
- **Timing:** Post-execution (after process completes)
- **Integration:** Hybrid (embedded or centralized)
- **Data Collection:** File system artifact inspection

## Version

**v1.0.0** — MVP Edition (Artifact-Based Post-Execution Monitoring)

Based on deep-explore analysis (Feb 14, 2026) and deep-verify validation.
