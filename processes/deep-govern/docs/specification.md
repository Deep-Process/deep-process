# Deep-Govern Process Specification

## PURPOSE

**Problem Solved:** Masz plan wdrożenia (z deep-plan) i zespół wykonujący (deep-implement), ale brak nadzoru strategicznego. Nie wiesz czy:
- Wdrożenie idzie zgodnie z planem
- Zmiany są kontrolowane i uzasadnione
- Ryzyka są zarządzane
- Budżet i timeline są pod kontrolą
- Decyzje są podejmowane w oparciu o dane
- Jakość jest zachowana

**Solution:** Proces deep-govern to "governance board" - nadzór strategiczny nad całym wdrożeniem z decision framework, change approval, risk acceptance i quality gates.

---

## CORE CAPABILITY

**Kluczowa funkcja:** **Executive Decision-Making Under Uncertainty**

Podejmuje decyzje strategiczne w sytuacjach:
- Plan diverges from reality (variance >10%)
- Change requests arrive (scope, timeline, budget)
- Risks materialize (critical issues detected)
- Quality gates fail (deliverables don't meet standards)
- Emergent requirements discovered (new needs arise)

**Decyzje typu:**
- GO / NO-GO / CONDITIONAL-GO / PIVOT / PAUSE
- APPROVE / REJECT / DEFER (change requests)
- ACCEPT / MITIGATE / TRANSFER / AVOID (risks)
- ESCALATE / RESOLVE / DELEGATE (issues)

---

## INPUTS

```yaml
continuous_monitoring_inputs:
  - execution-status.yaml:
      source: deep-monitor
      frequency: "Daily (automated)"
      content: "Task progress, blockers, velocity, health metrics"

  - sprint-retrospective.yaml:
      source: deep-implement
      frequency: "Every 2 weeks (sprint boundary)"
      content: "Sprint outcomes, completed tasks, issues encountered"

  - plan-variance-report.md:
      source: deep-plan
      frequency: "Weekly"
      content: "Plan vs actual variance, timeline slip, scope changes"

decision_inputs:
  - change-requests.yaml:
      source: deep-change
      frequency: "As submitted"
      content: "Pending change requests with impact analysis"

  - risk-updates.yaml:
      source: deep-risk
      frequency: "Weekly + on-demand (new critical risk)"
      content: "Risk register updates, materialized risks, mitigation status"

  - quality-gate-results.yaml:
      source: deep-verify
      frequency: "Every 2 weeks (checkpoint)"
      content: "Quality gate pass/fail, test results, validation outcomes"

  - escalations.yaml:
      source: deep-implement, deep-change, deep-risk
      frequency: "As needed"
      content: "Issues requiring governance decision"

context_inputs:
  - implementation-plan.yaml:
      source: deep-plan
      content: "Current plan baseline for comparison"

  - architecture-comprehensive.md:
      source: deep-architect
      content: "Architecture design for architectural decisions"

  - budget-tracking.yaml:
      source: external/finance
      content: "Actual spend vs budget"
```

---

## OUTPUTS

```yaml
primary_outputs:
  - governance-decisions.yaml:
      size: ~10-30KB
      content: "All decisions made (approve/reject/defer changes, GO/NO-GO, etc.)"
      frequency: "Continuous (append-only log)"
      format: YAML

  - health-report.md:
      size: ~5-10KB
      content: "Weekly executive summary (RAG status, key metrics, decisions made)"
      frequency: "Weekly"
      format: Markdown
      audience: "Executives, stakeholders"

  - escalations.yaml:
      size: ~5-10KB
      content: "Issues escalated to stakeholders (requiring external input)"
      frequency: "As needed"

  - approved-changes.yaml:
      size: ~10-20KB
      content: "Change requests approved for implementation"
      frequency: "Continuous"
      feeds: deep-plan, deep-implement

  - risk-acceptance.yaml:
      size: ~5-10KB
      content: "Risks formally accepted (not mitigated)"
      frequency: "As needed"

supporting_outputs:
  - governance-log.md: "Audit trail of all governance activities"
  - decision-rationale.yaml: "Detailed rationale for major decisions"
  - stakeholder-communications.md: "Communications sent to stakeholders"
```

---

## PROCESS WORKFLOW

### Mode 1: CONTINUOUS MONITORING (Bieżący Nadzór)

**Frequency:** Daily automated + Weekly human review

```yaml
daily_automated_monitoring:
  time: "Every day at 09:00"

  steps:
    1. INGEST_STATUS:
        READ: execution-status.yaml (from deep-monitor)
        EXTRACT:
          - Tasks completed yesterday: N
          - Tasks in progress: M
          - Blockers active: B (critical if B > 3)
          - Sprint progress: X% (on-track if 40-60% by mid-sprint)
          - Velocity trend: +/-% vs baseline

    2. COMPUTE_HEALTH_SCORE:
        metrics:
          - Schedule health: "GREEN if variance ≤5%, YELLOW if 5-10%, RED if >10%"
          - Blocker health: "GREEN if B≤1, YELLOW if B=2-3, RED if B>3"
          - Velocity health: "GREEN if velocity ≥90% baseline, YELLOW if 80-90%, RED if <80%"
          - Budget health: "GREEN if spend ≤50% at 50% timeline, YELLOW if 50-60%, RED if >60%"
          - Quality health: "GREEN if all gates pass, YELLOW if 1 gate fail, RED if 2+ gates fail"

        overall_health: "RED if any metric RED, YELLOW if any YELLOW, else GREEN"

    3. DETECT_ANOMALIES:
        anomaly_triggers:
          - Schedule slip: "Variance increased by >5% in 1 week"
          - Velocity drop: "Velocity dropped >20% sprint-over-sprint"
          - Blocker surge: "3+ new blockers in 1 day"
          - Budget overrun: "Burn rate >120% planned"
          - Quality degradation: "Test pass rate dropped >10%"

        IF anomaly_detected:
          ALERT: Governance board
          FLAG: For weekly review

    4. GENERATE_DAILY_DASHBOARD:
        OUTPUT: governance-dashboard-daily.yaml
        CONTENT:
          - Health score: GREEN/YELLOW/RED
          - Key metrics: Progress %, blockers, velocity, budget %
          - Alerts: Active anomalies
          - Actions required: Decisions pending

weekly_human_review:
  time: "Every Friday 14:00 (governance board meeting)"

  steps:
    1. REVIEW_WEEK_STATUS:
        READ: Last 7 days of execution-status.yaml
        SUMMARIZE:
          - Tasks completed this week: N (vs planned: M)
          - Velocity this week: X SP (vs baseline: Y SP)
          - Blockers resolved: B1 → B2 (trend improving/worsening)
          - Budget spent this week: $Z (vs planned: $W)

    2. REVIEW_PLAN_VARIANCE:
        READ: plan-variance-report.md (from deep-plan)
        ANALYZE:
          - Schedule variance: "+2 weeks (from -1 week last review) → worsening"
          - Scope variance: "+15 tasks due to CR-012, CR-015"
          - Critical path status: "Still 0.5 weeks buffer (acceptable)"

        IF variance_increasing:
          DECISION REQUIRED: "Accept slip, add resources, or descope?"

    3. REVIEW_CHANGE_REQUESTS:
        READ: change-requests.yaml (from deep-change)
        FOR each pending_change_request:
          EVALUATE: Impact analysis (timeline, cost, risk)
          DECISION: APPROVE / REJECT / DEFER
          RATIONALE: Document why

        Example:
          - CR-018: "Add multi-factor authentication (MFA)"
            Impact: +3 weeks, +$45K, reduces VR-010 risk from 75.8 to 35.2
            Decision: APPROVE (security improvement worth cost)
            Rationale: "MFA significantly reduces OAuth impersonation risk, aligns with SOC 2 requirements"

    4. REVIEW_RISKS:
        READ: risk-updates.yaml (from deep-risk)
        FOR each risk_change:
          IF new_critical_risk:
            DECISION: Approve mitigation budget OR accept risk
          IF risk_materialized:
            DECISION: Execute contingency plan OR pivot

        Example:
          - VR-025: "LLM API rate limit hit (materialized)"
            Mitigation: Negotiate custom tier ($15K/year) OR implement request batching ($8K dev)
            Decision: APPROVE batching (cheaper, more control)

    5. REVIEW_QUALITY_GATES:
        READ: quality-gate-results.yaml (from deep-verify)
        FOR each failed_gate:
          DECISION: Halt sprint OR waive gate OR accept technical debt

        Example:
          - Gate: "Performance test - 99th percentile latency"
            Status: FAILED (3.2s actual vs 2.0s target)
            Root cause: Database N+1 query
            Fix effort: 3 days
            Decision: DO NOT waive gate, fix in Sprint+1 (add to backlog as P0)

    6. MAKE_GO_NO_GO_DECISION:
        FREQUENCY: Every 2 weeks (sprint boundary)
        DECISION: Proceed with next sprint OR pause OR pivot

        decision_criteria:
          GO:
            - Overall health: GREEN or YELLOW
            - Critical blockers: ≤2
            - Budget runway: ≥3 sprints
            - Critical quality gates: PASS

          CONDITIONAL-GO:
            - Overall health: YELLOW
            - Plan to GREEN within 1 sprint
            - Conditions documented (e.g., "GO if blocker X resolved")

          PAUSE:
            - Overall health: RED
            - Critical blocker (no workaround)
            - Budget runway <2 sprints
            - Multiple critical quality gates FAIL

          PIVOT:
            - Architecture assumption invalidated
            - Regulatory change (e.g., GDPR update)
            - Market shift (e.g., competitor launches better solution)

    7. GENERATE_HEALTH_REPORT:
        OUTPUT: health-report-week-{N}.md
        CONTENT:
          - Executive summary: "Overall: YELLOW (velocity down 15%, but recovering)"
          - Key metrics table: Progress, velocity, budget, quality
          - Decisions made this week: 3 CRs approved, 1 rejected, 1 deferred
          - Risks managed: 2 risks mitigated, 1 accepted
          - Next sprint outlook: "GO (conditional on blocker BLK-023 resolved)"
          - Actions for stakeholders: None (no escalations)
```

---

### Mode 2: DECISION FRAMEWORK (Podejmowanie Decyzji)

**Triggered by:** Change request, risk materialization, quality gate failure, escalation

```yaml
decision_process:

  step_1_classify_decision_type:
    decision_types:
      - CHANGE_REQUEST: "Approve/reject scope, timeline, or budget change"
      - RISK_DECISION: "Accept risk OR approve mitigation"
      - QUALITY_DECISION: "Waive gate OR halt for fix"
      - GO_NO_GO: "Proceed with next phase OR pause/pivot"
      - ESCALATION: "Resolve issue OR escalate to stakeholders"

  step_2_evaluate_impact:
    FOR decision_type = CHANGE_REQUEST:
      READ: change-requests.yaml
      EXTRACT:
        - Timeline impact: "+X weeks"
        - Cost impact: "+$Y"
        - Risk impact: "Increases/decreases risk Z"
        - Scope impact: "+/- N tasks"
        - Dependencies: "Affects tasks A, B, C"

      COMPUTE:
        - Total timeline: Baseline + sum(all approved changes)
        - Total cost: Baseline + sum(all approved changes)
        - Critical path impact: "Does this change affect critical path?"

    FOR decision_type = RISK_DECISION:
      READ: risk-updates.yaml
      EXTRACT:
        - Risk score: Likelihood × Impact
        - Mitigation cost: $X
        - Mitigation effort: Y weeks
        - Residual risk: After mitigation

      COMPUTE:
        - ROI of mitigation: (Risk expected loss) / (Mitigation cost)
        - Example: VR-001 ($100M expected loss) / ($145K mitigation) = 689× ROI → APPROVE

  step_3_apply_decision_criteria:

    criteria_change_request:
      AUTO_APPROVE:
        - Timeline impact ≤2 days AND cost impact ≤$5K AND NOT critical_path

      APPROVE_WITH_REVIEW (governance board decides):
        - Timeline impact ≤5% total OR cost impact ≤10% total
        - AND: Provides business value OR reduces critical risk
        - AND: Does NOT invalidate architecture

      REJECT:
        - Timeline impact >10% total OR cost impact >20% total
        - OR: No clear business value (gold-plating)
        - OR: Violates architectural principles

      DEFER:
        - Good idea but not urgent
        - Add to post-MVP backlog

    criteria_risk_decision:
      APPROVE_MITIGATION:
        - Risk is CRITICAL (score >70) OR HIGH (score 50-70)
        - AND: Mitigation ROI >10× OR regulatory requirement

      ACCEPT_RISK:
        - Risk is MEDIUM (score 30-50)
        - AND: Mitigation cost >$50K
        - AND: Risk can be monitored and contingency plan exists

      ESCALATE:
        - Risk is CRITICAL AND mitigation >$100K
        - OR: Risk affects business viability

    criteria_quality_gate:
      HALT_SPRINT:
        - Security vulnerability (CVSS >7.0)
        - OR: Data loss risk
        - OR: Regulatory non-compliance

      FIX_IN_NEXT_SPRINT:
        - Performance issue (can be optimized)
        - OR: Usability problem (affects user experience)
        - BUT: No security or data risk

      WAIVE_GATE:
        - Cosmetic issue (e.g., UI polish)
        - AND: Does not affect MVP viability
        - Add to technical debt backlog

    criteria_go_no_go:
      GO:
        - Health: GREEN
        - OR: Health YELLOW AND improving trend
        - AND: Critical blockers ≤1
        - AND: Budget runway ≥3 sprints

      CONDITIONAL_GO:
        - Health: YELLOW
        - AND: Conditions for GREEN documented (e.g., "Fix blocker X")
        - AND: Confidence in meeting conditions: ≥70%

      PAUSE:
        - Health: RED
        - OR: Critical blocker (no workaround, no ETA)
        - OR: Budget runway <2 sprints

      PIVOT:
        - Assumption invalidated (e.g., "MCP adoption lower than expected")
        - OR: Better alternative discovered
        - OR: Regulatory/market change

  step_4_document_decision:
    FOR each decision:
      RECORD:
        decision_id: GOV-DEC-{N}
        decision_type: CHANGE_REQUEST | RISK | QUALITY | GO_NO_GO
        timestamp: "2026-02-16T10:30:00Z"
        decision: APPROVE | REJECT | DEFER | GO | PAUSE | PIVOT
        rationale: "Why this decision was made"
        data_used: "execution-status.yaml, plan-variance-report.md, etc."
        impact:
          timeline: "+2 weeks"
          cost: "+$35K"
          risk: "Reduces VR-010 from 75.8 to 35.2"
        alternatives_considered: ["Option A: ...", "Option B: ..."]
        decision_maker: "Governance Board (Claude + User approval)"
        reversibility: HIGH | MEDIUM | LOW
        review_date: "2026-03-16 (re-evaluate in 1 month)"

      OUTPUT: Append to governance-decisions.yaml

  step_5_execute_decision:
    IF decision = APPROVE_CHANGE:
      NOTIFY: deep-change (move CR to approved-changes.yaml)
      TRIGGER: deep-plan (update plan with change)
      NOTIFY: deep-implement (new tasks in next sprint)

    IF decision = APPROVE_MITIGATION:
      NOTIFY: deep-risk (execute mitigation plan)
      TRIGGER: deep-plan (schedule mitigation tasks)
      ALLOCATE: Budget for mitigation

    IF decision = HALT_SPRINT:
      NOTIFY: deep-implement (stop current sprint)
      TRIGGER: deep-change (create corrective action CR)
      SCHEDULE: Governance review in 2 days (re-evaluate)

    IF decision = PIVOT:
      TRIGGER: deep-architect (redesign)
      NOTIFY: Stakeholders (major change)
      SCHEDULE: Emergency governance meeting
```

---

### Mode 3: ESCALATION HANDLING (Zarządzanie Eskalacjami)

**Triggered by:** Issues that governance board cannot resolve autonomously

```yaml
escalation_process:

  step_1_identify_escalation_triggers:
    triggers:
      - BUDGET_OVERRUN: "Projected total cost >110% baseline ($710K → $781K)"
      - TIMELINE_SLIP: "Projected completion >10% baseline (6 months → 6.6 months)"
      - SCOPE_CREEP: "Scope increased >20% baseline (400 tasks → 480 tasks)"
      - CRITICAL_RISK_NO_MITIGATION: "Critical risk identified, no viable mitigation"
      - TEAM_CAPACITY_LOSS: "Key person quit, no replacement available"
      - ARCHITECTURAL_INVALIDATION: "Core assumption wrong (e.g., MCP adoption too low)"
      - REGULATORY_CHANGE: "New regulation requires major rework"

  step_2_prepare_escalation:
    FOR each escalation_trigger:
      CREATE: escalation-{ID}.yaml

      content:
        escalation_id: ESC-{N}
        trigger: "Budget overrun projected"
        severity: CRITICAL | HIGH | MEDIUM
        impact:
          timeline: "+4 weeks to MVP"
          cost: "+$150K"
          risk: "May miss market window"
          scope: "MVP features at risk"

        options:
          option_a:
            description: "Increase budget by $150K (extend runway)"
            pros: "Maintain full MVP scope, on-time delivery"
            cons: "Higher cost, needs funding approval"
            recommendation_confidence: HIGH

          option_b:
            description: "Descope 20% features (reduce to core MVP)"
            pros: "Stay on budget, feasible with current team"
            cons: "Reduced MVP value, may affect customer appeal"
            recommendation_confidence: MEDIUM

          option_c:
            description: "Extend timeline by 2 months (reduce burn rate)"
            pros: "Stay on budget, maintain scope"
            cons: "Delayed launch, competitive risk"
            recommendation_confidence: LOW

        governance_recommendation: "Option A (increase budget)"
        rationale: "MVP scope critical for market differentiation, $150K within acceptable ROI"

        required_decision_from: "CTO + CFO (budget authority)"
        decision_deadline: "2026-02-20 (5 days)"
        fallback_if_no_decision: "Proceed with Option B (descope)"

  step_3_communicate_escalation:
    SEND: escalation-{ID}.yaml to stakeholders
    FORMAT: As health-report.md (executive-friendly)
    INCLUDE:
      - Current status (RAG)
      - Issue summary (2-3 sentences)
      - Options table (pros/cons/costs)
      - Governance recommendation
      - Decision deadline

  step_4_await_decision:
    DEADLINE: As specified in escalation
    IF decision_received:
      RECORD: In governance-decisions.yaml
      EXECUTE: Decision (update plan, budget, scope)

    IF deadline_passed_no_decision:
      EXECUTE: Fallback option
      NOTIFY: Stakeholders (fallback executed)

  step_5_close_escalation:
    UPDATE: escalation-{ID}.yaml status = RESOLVED
    DOCUMENT: Outcome and lessons learned
    TRIGGER: Process improvement (update decision criteria if needed)
```

---

### Mode 4: QUALITY ASSURANCE (Kontrola Jakości)

**Purpose:** Enforce quality gates and prevent low-quality deliverables

```yaml
quality_enforcement:

  checkpoint_frequency: "Every 2 weeks (sprint boundary)"

  quality_gates:
    gate_security:
      checks:
        - SAST scan: "No HIGH or CRITICAL vulnerabilities"
        - Dependency scan: "No known CVEs in dependencies"
        - Secret detection: "No credentials in code"
        - Security test: "OWASP Top 10 coverage"

      enforcement:
        IF gate_failed:
          ACTION: HALT sprint, fix immediately (no waiver for security)

    gate_performance:
      checks:
        - Latency p99: "<2s for API calls"
        - Throughput: ">100 req/s sustained"
        - Resource usage: "<2GB RAM per service"

      enforcement:
        IF gate_failed AND MVP_blocker:
          ACTION: Fix in next sprint (high priority)
        IF gate_failed AND NOT MVP_blocker:
          ACTION: Add to technical debt backlog

    gate_reliability:
      checks:
        - Unit test coverage: ">80%"
        - Integration test: "All critical paths covered"
        - Error handling: "All exceptions caught and logged"

      enforcement:
        IF coverage <70%:
          ACTION: HALT sprint (quality floor)
        IF coverage 70-80%:
          ACTION: CONDITIONAL-GO (improve in next sprint)

    gate_compliance:
      checks:
        - SOC 2 controls: "Implemented and documented"
        - GDPR requirements: "PII handling compliant"
        - Audit logging: "All sensitive operations logged"

      enforcement:
        IF non_compliance:
          ACTION: HALT sprint (regulatory risk)

  quality_decision_tree:
    situation_all_gates_pass:
      decision: "GO to next sprint"
      confidence: HIGH

    situation_1_gate_fail_low_severity:
      decision: "CONDITIONAL-GO (fix in next sprint)"
      confidence: MEDIUM
      condition: "Gate passed by Sprint+1 retrospective"

    situation_2_gates_fail:
      decision: "PAUSE sprint (investigate root cause)"
      confidence: LOW
      action: "Root cause analysis, corrective action plan"

    situation_security_gate_fail:
      decision: "HALT immediately (no exceptions)"
      confidence: CERTAIN
      action: "Fix vulnerabilities before any new work"
```

---

## INTEGRATION WITH OTHER PROCESSES

```yaml
integration_points:

  consumes_from:
    - deep-monitor:
        artifact: execution-status.yaml
        frequency: "Daily"
        usage: "Continuous health monitoring"

    - deep-plan:
        artifact: plan-variance-report.md
        frequency: "Weekly"
        usage: "Schedule and scope variance analysis"

    - deep-change:
        artifact: change-requests.yaml
        frequency: "As submitted"
        usage: "Evaluate and approve/reject changes"

    - deep-risk:
        artifact: risk-updates.yaml
        frequency: "Weekly + on-demand"
        usage: "Risk acceptance decisions"

    - deep-verify:
        artifact: quality-gate-results.yaml
        frequency: "Every 2 weeks"
        usage: "Quality gate enforcement"

    - deep-implement:
        artifact: sprint-retrospective.yaml, escalations.yaml
        frequency: "Every 2 weeks, as needed"
        usage: "Sprint outcomes, blocker escalations"

  produces_for:
    - deep-change:
        artifact: approved-changes.yaml
        usage: "Changes approved for implementation"

    - deep-plan:
        artifact: governance-decisions.yaml
        usage: "Decisions affecting plan (scope, timeline, budget changes)"

    - deep-implement:
        artifact: go-no-go-decision.yaml
        usage: "Proceed/pause/pivot decision for next sprint"

    - deep-risk:
        artifact: risk-acceptance.yaml
        usage: "Risks formally accepted (not mitigated)"

    - stakeholders:
        artifact: health-report.md, escalations.yaml
        frequency: "Weekly, as needed"
        usage: "Executive visibility, major decision input"
```

---

## DECISION FRAMEWORKS (DETAILED)

### Framework 1: Change Request Approval

```yaml
input: change-requests.yaml (from deep-change)

decision_matrix:

  dimension_1_impact:
    MINOR (timeline ≤2 days, cost ≤$5K):
      - Decision: AUTO-APPROVE
      - Delegated to: deep-change (no governance review)

    MODERATE (timeline 2-10 days, cost $5K-$50K):
      - Decision: GOVERNANCE REVIEW (weekly board meeting)
      - Approval authority: Governance board
      - Turnaround: 1 week

    MAJOR (timeline >10 days, cost >$50K):
      - Decision: ESCALATE to stakeholders
      - Approval authority: CTO + CFO
      - Turnaround: 2-3 days (expedited)

  dimension_2_value:
    HIGH_VALUE (reduces critical risk OR regulatory requirement OR customer demand):
      - Bias: APPROVE (if budget/timeline allows)
      - Rationale: "Strategic value justifies cost"

    MEDIUM_VALUE (improves user experience OR operational efficiency):
      - Bias: NEUTRAL (cost-benefit analysis required)
      - Rationale: "Approve if ROI >2×"

    LOW_VALUE (nice-to-have OR gold-plating):
      - Bias: DEFER to post-MVP
      - Rationale: "Protect MVP scope and timeline"

  dimension_3_timing:
    CRITICAL_PATH_AFFECTED:
      - Decision: CAREFUL REVIEW (affects delivery date)
      - Consider: Alternative sequencing to minimize impact

    NON_CRITICAL_PATH:
      - Decision: MORE LENIENT (can absorb in buffer)

  dimension_4_reversibility:
    HIGH_REVERSIBILITY (can undo if wrong):
      - Decision: APPROVE with review checkpoint
      - Example: "Add feature X, review value in Sprint+2"

    LOW_REVERSIBILITY (hard to undo):
      - Decision: REQUIRE strong justification
      - Example: "Change database schema (migration effort high)"

output: governance-decisions.yaml
```

---

### Framework 2: Risk Decision

```yaml
input: risk-updates.yaml (from deep-risk)

decision_tree:

  IF risk_score >= 70 (CRITICAL):
    THEN:
      IF mitigation_available AND cost <$200K:
        DECISION: APPROVE mitigation (mandate)
        RATIONALE: "Critical risk unacceptable, mitigation affordable"

      ELSE IF mitigation_cost >$200K:
        DECISION: ESCALATE to stakeholders
        OPTIONS: [Approve high-cost mitigation, Accept risk, Pivot architecture]

      ELSE IF no_viable_mitigation:
        DECISION: ESCALATE to stakeholders
        RECOMMENDATION: PIVOT or HALT project (unacceptable risk)

  ELSE IF risk_score 50-70 (HIGH):
    THEN:
      COMPUTE: ROI = (risk_expected_loss) / (mitigation_cost)

      IF ROI > 10×:
        DECISION: APPROVE mitigation (high ROI)

      ELSE IF ROI 3-10×:
        DECISION: APPROVE if budget allows, ELSE defer

      ELSE IF ROI <3×:
        DECISION: ACCEPT risk (mitigation not cost-effective)
        REQUIRE: Monitoring plan + contingency plan

  ELSE IF risk_score 30-50 (MEDIUM):
    THEN:
      DECISION: ACCEPT risk (default)
      REQUIRE: Monitoring + contingency

      EXCEPTION: IF regulatory_risk:
        DECISION: APPROVE mitigation (regardless of ROI)

  ELSE IF risk_score <30 (LOW):
    THEN:
      DECISION: ACCEPT risk (no action)
      LOG: In risk register for awareness

output: risk-acceptance.yaml OR approved mitigation in governance-decisions.yaml
```

---

### Framework 3: GO/NO-GO Decision

```yaml
trigger: Sprint boundary (every 2 weeks)

decision_process:

  step_1_aggregate_health:
    READ: execution-status.yaml, plan-variance-report.md, quality-gate-results.yaml

    COMPUTE:
      overall_health: Composite of 5 metrics
        - schedule_health: GREEN if variance ≤5%, YELLOW 5-10%, RED >10%
        - blocker_health: GREEN if ≤1, YELLOW 2-3, RED >3
        - velocity_health: GREEN if ≥90% baseline, YELLOW 80-90%, RED <80%
        - budget_health: GREEN if on-track, YELLOW +10%, RED +20%
        - quality_health: GREEN if all gates pass, YELLOW 1 fail, RED 2+ fail

      overall: RED if any RED, YELLOW if any YELLOW and improving, else GREEN

  step_2_decision_criteria:

    IF overall_health = GREEN:
      DECISION: GO
      CONFIDENCE: HIGH
      CONDITION: None

    IF overall_health = YELLOW AND trend_improving:
      DECISION: CONDITIONAL-GO
      CONFIDENCE: MEDIUM
      CONDITION: "Specific improvements required (e.g., resolve blocker BLK-X)"
      REVIEW: Mid-sprint checkpoint to verify condition met

    IF overall_health = YELLOW AND trend_worsening:
      DECISION: PAUSE
      CONFIDENCE: LOW
      ACTION: "Root cause analysis + corrective action plan"
      TIMELINE: "Resume when health improves to YELLOW+improving"

    IF overall_health = RED:
      DECISION: PAUSE (immediate)
      CONFIDENCE: VERY_LOW
      ACTION: "Emergency governance meeting within 24h"
      OPTIONS:
        A: "Fix critical issues (1-2 weeks), then resume"
        B: "Pivot architecture"
        C: "Escalate to stakeholders (project viability question)"

  step_3_special_conditions:

    IF security_vulnerability_discovered:
      DECISION: HALT (override all other factors)
      ACTION: "Fix vulnerability before any new work"

    IF budget_runway <3_sprints:
      DECISION: ESCALATE
      QUESTION: "Secure additional funding OR descope?"

    IF key_person_departed:
      DECISION: PAUSE (1 sprint)
      ACTION: "Hire replacement OR reallocate work"

output: go-no-go-decision.yaml
```

---

## METRICS & KPIS

```yaml
governance_effectiveness_metrics:

  decision_quality:
    - decision_reversal_rate: "Decisions later reversed / Total decisions"
      target: "≤5% (low reversal = good decisions)"
      measure: "Monthly"

    - decision_turnaround_time: "Time from request to decision"
      target: "≤3 days for MODERATE, ≤24h for CRITICAL"
      measure: "Per decision"

  oversight_effectiveness:
    - issue_detection_time: "Time from issue occurrence to governance awareness"
      target: "≤1 day (daily monitoring effective)"
      measure: "Per issue"

    - preventable_issues: "Issues that governance should have prevented"
      target: "≤2 per project (low = good governance)"
      measure: "End of project (retrospective)"

  stakeholder_satisfaction:
    - escalation_appropriateness: "Escalations that stakeholders agreed were necessary"
      target: "≥90% (don't over-escalate)"
      measure: "Per escalation (stakeholder feedback)"

    - transparency_score: "Stakeholder satisfaction with visibility"
      target: "≥4/5 (high transparency)"
      measure: "Monthly survey"

  project_health:
    - time_in_green: "% of project time in GREEN health"
      target: "≥70%"
      measure: "Weekly"

    - critical_blockers_resolved: "Time to resolve critical blockers"
      target: "≤3 days"
      measure: "Per blocker"
```

---

## EXAMPLES

### Example 1: Weekly Governance Review

**Context:** Week 7, Sprint 4 retrospective

**Inputs:**
- execution-status.yaml: 180 SP completed (planned: 225 SP) = -20% velocity
- plan-variance-report.md: Schedule variance +2 weeks (was +1 week last review)
- change-requests.yaml: 2 pending (CR-018 MFA, CR-019 SAML SSO)
- quality-gate-results.yaml: Performance gate FAILED (3.2s latency vs 2s target)

**Governance Process:**

1. **Health Assessment:**
   - Schedule: YELLOW (-20% velocity, +2 week slip, worsening trend)
   - Blockers: YELLOW (2 active: BLK-023 Auth0 API, BLK-024 DB migration)
   - Velocity: RED (180 vs 225 = 80% baseline)
   - Budget: GREEN (on track)
   - Quality: YELLOW (1 gate failed)
   - **Overall: YELLOW** (trending to RED)

2. **Decisions Made:**
   - **CR-018 (MFA):** APPROVE (+3 weeks, +$45K)
     - Rationale: "Reduces VR-010 risk significantly, SOC 2 requirement"
   - **CR-019 (SAML SSO):** DEFER to post-MVP
     - Rationale: "Nice-to-have, not MVP blocker, protects timeline"
   - **Performance Gate:** DO NOT WAIVE, fix in Sprint 5
     - Rationale: "Latency critical for user experience, fixable (N+1 query)"
   - **Velocity Issue:** INVESTIGATE root cause
     - Action: Deep-dive on estimation accuracy and blocker impact

3. **GO/NO-GO Decision:**
   - **CONDITIONAL-GO for Sprint 5**
   - Condition: "Resolve BLK-023 (Auth0) by Day 3 of Sprint 5"
   - Fallback: "Implement local auth (workaround) if Auth0 not resolved"

4. **Output:**
   - health-report-week-07.md → sent to stakeholders
   - approved-changes.yaml → CR-018 approved, CR-019 deferred
   - go-no-go-decision.yaml → CONDITIONAL-GO

---

### Example 2: Escalation

**Trigger:** Budget overrun projected (Week 10)

**Situation:**
- Actual spend: $340K (61% of $560K baseline at 62% timeline) = ON TRACK
- Approved changes: CR-012 (+$35K), CR-018 (+$45K) = +$80K
- Projected total: $640K (was $560K baseline) = +14% overrun (within $710K ceiling)
- BUT: 3 more critical changes in pipeline (CR-023, CR-024, CR-025) = +$95K
- NEW projected total: $735K > $710K ceiling = **OVERRUN**

**Governance Decision:**
- **ESCALATE to CFO**
- Options presented:
  - A: Increase budget ceiling to $750K (+$40K)
  - B: Reject CR-023, CR-024, CR-025 (protect budget)
  - C: Descope 10% features to absorb change costs
- **Recommendation:** Option A (increase budget)
  - Rationale: "Changes are high-value (security, compliance), rejecting increases risk"

**Stakeholder Decision:** Option A approved
**Outcome:** Budget ceiling raised to $750K, changes approved

---

## ANTI-PATTERNS TO AVOID

```yaml
anti_patterns:

  AP-GOVERN-001_rubber_stamp:
    description: "Approve all change requests without analysis"
    why_bad: "Scope creep, timeline slip, budget overrun"
    instead: "Rigorously evaluate impact, reject low-value changes"

  AP-GOVERN-002_micro_management:
    description: "Govern task-level decisions (developer autonomy violated)"
    why_bad: "Team bottleneck, slow decision-making, low morale"
    instead: "Govern strategic decisions only (scope, budget, architecture, critical risks)"

  AP-GOVERN-003_ignore_health_signals:
    description: "Continue with RED health ('hope it gets better')"
    why_bad: "Issues compound, project fails"
    instead: "PAUSE on RED, root cause analysis, corrective action before resuming"

  AP-GOVERN-004_no_escalation:
    description: "Never escalate (try to solve everything internally)"
    why_bad: "Major issues hidden from stakeholders until too late"
    instead: "Escalate proactively when governance cannot resolve autonomously"

  AP-GOVERN-005_waive_security_gates:
    description: "Waive security gates to meet timeline"
    why_bad: "Ship vulnerable product, reputational damage, legal liability"
    instead: "NEVER waive security gates, extend timeline if needed"
```

---

## DEPENDENCIES

**Required processes:**
- deep-monitor: Provides execution status
- deep-plan: Provides plan variance
- deep-change: Submits change requests

**Optional but recommended:**
- deep-implement: Sprint outcomes, escalations
- deep-risk: Risk updates
- deep-verify: Quality gate results

**Produces for:**
- deep-plan: Approved changes, decisions affecting plan
- deep-implement: GO/NO-GO decisions
- deep-change: Approval/rejection of change requests
- Stakeholders: Health reports, escalations

---

## NEXT STEPS

1. **Create workflow.md** - Governance board meeting cadence
2. **Create steps/** - Decision process steps
3. **Test with example** - Simulate Week 7 governance review
4. **Integrate with deep-monitor** - Automated health dashboard
5. **Setup stakeholder communications** - Email templates for health reports

---

**Version:** 1.0
**Status:** DRAFT - Ready for implementation
**Author:** Claude (Sonnet 4.5)
**Date:** 2026-02-16
