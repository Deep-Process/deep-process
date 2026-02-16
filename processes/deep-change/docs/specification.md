# Deep-Change Process Specification

## PURPOSE

**Problem Solved:** Plan idealny na start (T0) rozbija się o rzeczywistość (T1, T2, ...). Potrzebujesz:
- Mechanizmu przyjmowania zmian (requirements discovered, blockers, risks materialized)
- Impact analysis (jak zmiana wpłynie na plan, timeline, budget, risk)
- Approval workflow (kto decyduje, criteria for approval)
- Plan update propagation (update plan → implement → monitor)

**Solution:** Proces deep-change to "Change Control Board" - zarządza pełnym cyklem życia zmiany od detekcji potrzeby przez impact analysis, approval, do wdrożenia.

---

## CORE CAPABILITY

**Kluczowa funkcja:** **Controlled Adaptation to Reality**

Umożliwia bezpieczną adaptację planu bez utraty kontroli:
- **DETECT** change need (from 6 sources)
- **ANALYZE** impact (timeline, cost, risk, dependencies)
- **PRIORITIZE** urgency (CRITICAL / HIGH / MEDIUM / LOW)
- **APPROVE** or REJECT (governance decision)
- **UPDATE** plan (propagate to deep-plan, deep-implement)
- **TRACK** change outcomes (did it achieve goal?)

---

## INPUTS

```yaml
change_triggers:

  from_deep_implement:
    - blockers.yaml:
        frequency: "Real-time (as blockers detected)"
        content: "Active blockers preventing progress"
        trigger_type: BLOCKER_DETECTED
        example: "Auth0 API down, blocks 8 tasks → CR: Use local auth instead"

    - execution-challenges.yaml:
        frequency: "Sprint retrospective (every 2 weeks)"
        content: "Challenges encountered during sprint"
        trigger_type: PROCESS_IMPROVEMENT
        example: "Test environment unstable → CR: Dedicated test cluster"

  from_deep_requirements:
    - emergent-requirements.yaml:
        frequency: "Continuous (as requirements discovered)"
        content: "New requirements discovered during implementation"
        trigger_type: REQUIREMENT_CHANGE
        example: "Customer needs SAML SSO → CR: Add SAML support"

    - requirement-changes.yaml:
        frequency: "As stakeholder needs change"
        content: "Changes to existing requirements"
        trigger_type: REQUIREMENT_CHANGE
        example: "GDPR update requires PII redaction → CR: Implement redaction"

  from_deep_risk:
    - risk-materialized.yaml:
        frequency: "As risks materialize"
        content: "Risks that occurred and need mitigation"
        trigger_type: RISK_MITIGATION
        example: "VR-008 materialized (load spike) → CR: Implement rate limiting NOW"

    - new-critical-risks.yaml:
        frequency: "Weekly risk review"
        content: "Newly discovered critical risks"
        trigger_type: RISK_MITIGATION
        example: "VR-026 discovered (LLM prompt injection) → CR: Input sanitization"

  from_deep_verify:
    - quality-gate-failures.yaml:
        frequency: "Every 2 weeks (checkpoint)"
        content: "Quality gates that failed"
        trigger_type: QUALITY_ISSUE
        example: "Performance test failed → CR: Database query optimization"

    - validation-gaps.yaml:
        frequency: "As validation reveals gaps"
        content: "Gaps between expected and actual"
        trigger_type: EXPECTATION_GAP
        example: "Users expect real-time updates (not in spec) → CR: WebSocket support"

  from_deep_monitor:
    - performance-anomalies.yaml:
        frequency: "Continuous (automated detection)"
        content: "Performance degradations detected"
        trigger_type: PERFORMANCE_ISSUE
        example: "API latency spiked to 5s → CR: Add caching layer"

  from_stakeholders:
    - strategic-changes.yaml:
        frequency: "As business needs change"
        content: "Strategic direction changes"
        trigger_type: STRATEGIC_CHANGE
        example: "Pivot to Europe market → CR: GDPR compliance priority ++"

context_inputs:
  - implementation-plan.yaml:
      source: deep-plan
      usage: "Current plan for impact analysis"

  - architecture-comprehensive.md:
      source: deep-architect
      usage: "Architectural impact analysis"

  - risk-report.md:
      source: deep-risk
      usage: "Risk impact analysis"
```

---

## OUTPUTS

```yaml
primary_outputs:
  - change-requests.yaml:
      size: ~20-50KB
      content: "All change requests (pending, approved, rejected, implemented)"
      frequency: "Continuous (append + update)"
      format: YAML
      structure:
        pending: [CR-001, CR-002, ...]
        approved: [CR-003, CR-004, ...]
        rejected: [CR-005, ...]
        implemented: [CR-006, CR-007, ...]

  - impact-analysis.yaml:
      size: ~30-60KB
      content: "Impact analysis for each change request"
      frequency: "Per change request"
      format: YAML

  - approved-changes.yaml:
      size: ~10-20KB
      content: "Changes approved by deep-govern, ready for implementation"
      frequency: "Continuous"
      feeds: deep-plan, deep-implement

  - change-log.md:
      size: ~20-40KB
      content: "Human-readable change history with rationales"
      frequency: "Continuous"
      format: Markdown
      audience: "Stakeholders, audit trail"

supporting_outputs:
  - change-metrics.yaml: "Change request statistics (approval rate, avg impact, etc.)"
  - rejected-changes.yaml: "Rejected changes with rationale (learning)"
  - change-outcomes.yaml: "Post-implementation: did change achieve goal?"
```

---

## PROCESS WORKFLOW

### Phase 1: INTAKE (Przyjęcie Zgłoszenia)

**Purpose:** Capture change need from any source, validate completeness

```yaml
steps:

  1. DETECT_CHANGE_TRIGGER:
      MONITOR: All input sources (6 types)
      ON: New file appears OR existing file updated
      EXTRACT:
        trigger_source: deep-implement | deep-requirements | deep-risk | deep-verify | deep-monitor | stakeholder
        trigger_type: BLOCKER | REQUIREMENT_CHANGE | RISK_MITIGATION | QUALITY_ISSUE | PERFORMANCE_ISSUE | STRATEGIC_CHANGE
        trigger_data: "Content from trigger file"

  2. CREATE_CHANGE_REQUEST:
      GENERATE: CR-{NNN} (unique ID)
      TIMESTAMP: Submission time

      initial_state:
        change_request_id: "CR-018"
        status: DRAFT
        submitted_by: deep-implement | deep-requirements | etc.
        submitted_date: "2026-02-16T10:00:00Z"
        trigger_type: REQUIREMENT_CHANGE
        trigger_reference: "emergent-requirements.yaml#REQ-047"

        title: "Add multi-factor authentication (MFA)"
        description: |
          Customer pilot feedback: MFA is mandatory for enterprise security policy.
          Current OAuth 2.0 flow lacks second factor.
          Proposed: Integrate with Auth0 MFA (TOTP, SMS).

        rationale: |
          WHY needed:
          - Customer blocker: Cannot deploy without MFA (regulatory requirement)
          - Reduces VR-010 risk: OAuth cross-tenant impersonation (score 75.8 → 35.2)
          - SOC 2 requirement: Multi-factor authentication control

        proposed_solution: |
          1. Enable Auth0 MFA in tenant settings
          2. Update /auth/login endpoint to support MFA challenge
          3. Add MFA enrollment UI in Dashboard
          4. Update API Gateway to validate MFA tokens
          5. Document MFA setup in user guide

        alternatives_considered:
          - "Local TOTP implementation (rejected: reinvent wheel, security risk)"
          - "SMS-only (rejected: less secure than TOTP)"
          - "Defer to post-MVP (rejected: customer blocker)"

  3. VALIDATE_COMPLETENESS:
      CHECK:
        - title: NOT empty
        - description: ≥50 characters (sufficient detail)
        - rationale: WHY explained
        - proposed_solution: HOW explained

      IF incomplete:
        STATUS: DRAFT → INCOMPLETE
        RETURN: To submitter with feedback
        EXAMPLE: "CR-019 incomplete: No proposed solution provided"

      IF complete:
        STATUS: DRAFT → READY_FOR_ANALYSIS
        PROCEED: To Phase 2

  4. RECORD_SUBMISSION:
      WRITE: Append to change-requests.yaml
      NOTIFY: deep-govern (new CR submitted)
      NOTIFY: Submitter (CR-{NNN} created, status = READY_FOR_ANALYSIS)
```

**Gate 1:** Change request valid and complete? (All required fields filled, rationale clear)

---

### Phase 2: IMPACT ANALYSIS (Analiza Wpływu)

**Purpose:** Determine how change affects timeline, cost, risk, architecture, dependencies

```yaml
steps:

  1. LOAD_CONTEXT:
      READ:
        - implementation-plan.yaml (current plan)
        - architecture-comprehensive.md (architecture)
        - risk-report.md (risks)
        - execution-status.yaml (current progress)

  2. ESTIMATE_EFFORT:
      FROM: proposed_solution
      DECOMPOSE: Into tasks (similar to deep-plan WBS)

      example_cr_018_tasks:
        - TASK-CR018-01: "Enable Auth0 MFA tenant settings" (1 SP)
        - TASK-CR018-02: "Update /auth/login for MFA challenge" (5 SP)
        - TASK-CR018-03: "Add MFA enrollment UI" (8 SP)
        - TASK-CR018-04: "Update API Gateway MFA validation" (3 SP)
        - TASK-CR018-05: "Integration testing" (3 SP)
        - TASK-CR018-06: "Documentation" (2 SP)
        TOTAL: 22 SP = ~88 hours = ~2.2 weeks (4 people)

  3. ANALYZE_TIMELINE_IMPACT:
      COMPUTE:
        - Effort: 22 SP = 2.2 weeks elapsed (with 4 people)
        - Dependencies: Must complete AFTER TASK-001-05 (API Gateway deployed)
        - Critical path impact: NOT on critical path (can parallelize)
        - Sprint impact: Add to Sprint 6 (current: Sprint 5)

      timeline_impact:
        best_case: "+0 weeks (parallel with other work)"
        likely_case: "+1 week (some contention)"
        worst_case: "+3 weeks (if blockers encountered)"
        confidence: MEDIUM (80% confidence in +1 week)

  4. ANALYZE_COST_IMPACT:
      COMPUTE:
        - Development: 88 hours × $150/hour = $13,200
        - Auth0 MFA license: $500/month × 12 months = $6,000
        - Testing: 20 hours × $150/hour = $3,000
        - Documentation: Included in dev effort
        TOTAL: $22,200

      cost_impact:
        one_time: "$16,200"
        recurring: "$6,000/year"
        total_year_1: "$22,200"
        budget_impact: "+3.2% (of $640K projected total)"

  5. ANALYZE_RISK_IMPACT:
      EVALUATE: How change affects risks

      risk_changes:
        - VR-010 (OAuth cross-tenant impersonation):
            current_score: 75.8
            after_change: 35.2
            improvement: -54% (SIGNIFICANT reduction)
            rationale: "MFA prevents token reuse even if token stolen"

        - NEW_RISK: VR-027 (MFA implementation bugs)
            score: 25.0 (LOW)
            mitigation: Integration testing, penetration testing

      net_risk_impact: POSITIVE (reduces critical risk significantly)

  6. ANALYZE_DEPENDENCY_IMPACT:
      IDENTIFY: Which tasks are affected

      dependencies:
        blocks: [] (no tasks blocked by this change)
        blocked_by: ["TASK-001-05: API Gateway deployed"] (prerequisite)
        affects: ["TASK-004-03: IAM Service integration"] (needs update for MFA)

  7. ANALYZE_ARCHITECTURAL_IMPACT:
      EVALUATE: Architectural changes required

      architecture_changes:
        - API Gateway: Modify to validate MFA tokens (minor change)
        - IAM Service: No change (Auth0 handles MFA)
        - Database: Add mfa_enabled column to users table (minor schema change)

      architectural_risk: LOW (no major architectural changes)

  8. CLASSIFY_PRIORITY:
      BASED ON: Trigger type, impact, urgency

      priority_rules:
        CRITICAL (decide within 24h):
          - Security vulnerability fix
          - Customer blocker (cannot deploy without)
          - Risk materialized (active incident)

        HIGH (decide within 3 days):
          - Reduces critical risk significantly
          - Regulatory requirement
          - Affects critical path

        MEDIUM (decide within 1 week):
          - Improves user experience
          - Reduces medium risk
          - Process improvement

        LOW (decide within 2 weeks):
          - Nice-to-have
          - Optimization
          - Gold-plating

      cr_018_priority: HIGH
        rationale: "Customer blocker + reduces VR-010 (critical risk)"

  9. GENERATE_IMPACT_ANALYSIS:
      OUTPUT: impact-analysis-CR-018.yaml

      content:
        change_request_id: "CR-018"
        analyzed_date: "2026-02-16T12:00:00Z"
        analyzed_by: "deep-change"

        effort_estimate:
          story_points: 22
          hours: 88
          elapsed_time: "1-3 weeks"
          confidence: MEDIUM

        timeline_impact:
          best_case: "+0 weeks"
          likely_case: "+1 week"
          worst_case: "+3 weeks"
          critical_path_affected: NO

        cost_impact:
          development: "$16,200"
          recurring: "$6,000/year"
          total_year_1: "$22,200"
          budget_percentage: "+3.2%"

        risk_impact:
          net_change: POSITIVE
          vr_010_reduction: "75.8 → 35.2 (-54%)"
          new_risks: ["VR-027: MFA implementation bugs (score 25.0)"]

        dependency_impact:
          blocks: []
          blocked_by: ["TASK-001-05"]
          affects: ["TASK-004-03"]

        architectural_impact:
          severity: MINOR
          changes: ["API Gateway token validation", "users.mfa_enabled column"]

        recommendation:
          decision: APPROVE
          confidence: HIGH
          rationale: |
            APPROVE because:
            - Customer blocker (cannot deploy without MFA)
            - Reduces VR-010 (critical risk) by 54%
            - SOC 2 requirement (compliance benefit)
            - Cost impact acceptable (+3.2% budget)
            - Timeline impact manageable (+1 week likely case)
            - No architectural risk

          conditions:
            - "Complete integration testing before production"
            - "Penetration test for MFA bypass vulnerabilities"

          alternatives_rejected:
            - "Defer to post-MVP: REJECTED (customer blocker)"
            - "Local implementation: REJECTED (security risk, reinvent wheel)"

  10. UPDATE_CR_STATUS:
      STATUS: READY_FOR_ANALYSIS → ANALYZED
      NOTIFY: deep-govern (CR-018 ready for decision)
```

**Gate 2:** Impact analysis complete? (Timeline, cost, risk, dependencies analyzed, recommendation made)

---

### Phase 3: DECISION (Decyzja)

**Purpose:** Governance board approves, rejects, or defers change

**NOTE:** This phase is executed by deep-govern, but deep-change facilitates the process.

```yaml
steps:

  1. SUBMIT_TO_GOVERNANCE:
      SEND: change-requests.yaml + impact-analysis-CR-018.yaml
      TO: deep-govern
      MODE:
        IF priority = CRITICAL:
          ESCALATE: Immediately (Slack notification, email)
        IF priority = HIGH:
          ADD: To weekly governance board agenda
        IF priority = MEDIUM/LOW:
          ADD: To backlog, review when capacity available

  2. AWAIT_DECISION:
      MONITOR: governance-decisions.yaml
      WAIT: For decision on CR-018

      possible_decisions:
        - APPROVE: Proceed with implementation
        - APPROVE_WITH_CONDITIONS: Proceed only if conditions met
        - REJECT: Do not implement
        - DEFER: Good idea but not now, revisit later
        - REQUEST_MORE_INFO: Insufficient analysis, need more data

  3. RECORD_DECISION:
      WHEN: Decision appears in governance-decisions.yaml
      EXTRACT:
        decision_id: GOV-DEC-042
        change_request_id: CR-018
        decision: APPROVE
        decided_by: "Governance Board"
        decided_date: "2026-02-17T10:30:00Z"
        rationale: |
          APPROVED because:
          - Customer blocker (Acme Corp cannot deploy without MFA)
          - Reduces VR-010 from 75.8 to 35.2 (critical risk mitigation)
          - SOC 2 compliance requirement
          - Cost impact acceptable ($22K = 3.2% budget)
          - Timeline impact manageable (+1 week)
          - Recommendation: APPROVE (high confidence)

        conditions:
          - "Integration testing before production deployment"
          - "Penetration testing for MFA bypass"
          - "Review at Sprint 6 retrospective to validate benefit"

  4. UPDATE_CR_STATUS:
      IF decision = APPROVE:
        STATUS: ANALYZED → APPROVED
        ADD: To approved-changes.yaml
        PROCEED: To Phase 4 (Plan Update)

      IF decision = APPROVE_WITH_CONDITIONS:
        STATUS: ANALYZED → CONDITIONAL_APPROVAL
        TRACK: Conditions in conditions-tracking.yaml
        WAIT: Until conditions met
        THEN: STATUS → APPROVED

      IF decision = REJECT:
        STATUS: ANALYZED → REJECTED
        RECORD: Rejection rationale
        NOTIFY: Submitter
        CLOSE: CR (archive)

      IF decision = DEFER:
        STATUS: ANALYZED → DEFERRED
        RECORD: Defer reason + revisit date
        SCHEDULE: Review at revisit date

      IF decision = REQUEST_MORE_INFO:
        STATUS: ANALYZED → INFO_REQUESTED
        NOTIFY: Submitter OR analyst
        WAIT: For additional info
        THEN: Re-run impact analysis

  5. NOTIFY_STAKEHOLDERS:
      SEND: Decision notification
        - To submitter: "CR-018 APPROVED, scheduled for Sprint 6"
        - To deep-plan: "CR-018 approved, update plan"
        - To deep-implement: "CR-018 approved, add to Sprint 6 backlog"
```

**Gate 3:** Decision made and recorded? (CR status updated, notifications sent)

---

### Phase 4: PLAN UPDATE (Aktualizacja Planu)

**Purpose:** Propagate approved change to plan and implementation

```yaml
steps:

  1. TRIGGER_PLAN_UPDATE:
      FOR each approved_change:
        SEND: approved-changes.yaml to deep-plan
        REQUEST: Update implementation-plan.yaml

        change_integration_spec:
          change_request_id: "CR-018"
          tasks_to_add:
            - TASK-CR018-01: "Enable Auth0 MFA" (1 SP, Sprint 6)
            - TASK-CR018-02: "Update /auth/login" (5 SP, Sprint 6)
            - TASK-CR018-03: "MFA enrollment UI" (8 SP, Sprint 6)
            - TASK-CR018-04: "API Gateway MFA validation" (3 SP, Sprint 6)
            - TASK-CR018-05: "Integration testing" (3 SP, Sprint 6)
            - TASK-CR018-06: "Documentation" (2 SP, Sprint 6)

          dependencies:
            prerequisite_tasks: ["TASK-001-05: API Gateway deployed"]
            affected_tasks: ["TASK-004-03: IAM Service integration"]

          resource_assignment:
            assigned_to: "Security Engineer (2 people)"

          timeline:
            target_sprint: "Sprint 6"
            deadline: "End of Month 3 (for VR-010 mitigation)"

  2. AWAIT_PLAN_UPDATE:
      MONITOR: implementation-plan.yaml
      WAIT: For deep-plan to incorporate change

      validation:
        - Tasks added to WBS: CHECK
        - Sprint 6 backlog updated: CHECK
        - Timeline recalculated: CHECK
        - Resource allocation updated: CHECK

  3. TRIGGER_IMPLEMENTATION:
      SEND: approved-changes.yaml to deep-implement
      NOTIFY: "CR-018 tasks added to Sprint 6, begin when Sprint 6 starts"

  4. UPDATE_CR_STATUS:
      STATUS: APPROVED → IN_IMPLEMENTATION
      TRACK: Implementation progress

      progress_tracking:
        tasks_total: 6
        tasks_completed: 0
        implementation_sprint: "Sprint 6"
        implementation_start: "2026-03-01 (Sprint 6 start)"
```

**Gate 4:** Plan updated? (Tasks added to plan, sprint backlog updated, implementation triggered)

---

### Phase 5: VERIFICATION (Weryfikacja Wyniku)

**Purpose:** Verify that implemented change achieved intended goal

```yaml
steps:

  1. AWAIT_IMPLEMENTATION_COMPLETE:
      MONITOR: execution-status.yaml
      WAIT: All CR-018 tasks status = COMPLETED

  2. VERIFY_GOAL_ACHIEVED:
      ORIGINAL_GOAL (from CR-018):
        - "Enable MFA for enterprise customers"
        - "Reduce VR-010 risk from 75.8 to 35.2"

      VERIFICATION_CHECKS:
        - Functional test: "MFA works (TOTP, SMS)"
        - Security test: "VR-010 risk re-assessed (actual score post-implementation)"
        - Customer test: "Acme Corp can deploy (blocker removed)"
        - Documentation: "MFA setup guide exists"

      RESULT:
        - Functional: PASS (MFA working)
        - Security: VR-010 new score = 38.5 (target: 35.2, actual: 38.5) → CLOSE ENOUGH
        - Customer: PASS (Acme Corp deployed successfully)
        - Documentation: PASS (guide published)

      OUTCOME: GOAL_ACHIEVED

  3. MEASURE_ACTUAL_IMPACT:
      COMPARE: Estimated vs actual

      comparison:
        timeline_impact:
          estimated: "+1 week"
          actual: "+1.5 weeks"
          variance: "+0.5 weeks (within ±50% acceptable)"

        cost_impact:
          estimated: "$22,200"
          actual: "$25,800"
          variance: "+$3,600 (+16%, within ±20% acceptable)"

        risk_impact:
          estimated: "VR-010 → 35.2"
          actual: "VR-010 → 38.5"
          variance: "+3.3 points (close enough)"

  4. EXTRACT_LESSONS_LEARNED:
      WHAT_WENT_WELL:
        - "MFA integration smoother than expected (Auth0 easy to use)"
        - "Customer very satisfied (unblocked deployment)"

      WHAT_WENT_WRONG:
        - "Underestimated testing effort (needed extra penetration testing)"
        - "SMS provider integration took longer (unforeseen dependency)"

      WHAT_TO_IMPROVE:
        - "Better third-party integration estimation (add 30% buffer)"
        - "Earlier customer involvement in testing (beta testing)"

  5. UPDATE_CR_STATUS:
      STATUS: IN_IMPLEMENTATION → COMPLETED
      RECORD:
        completion_date: "2026-03-15"
        outcome: GOAL_ACHIEVED
        lessons_learned: [as above]

  6. GENERATE_CHANGE_OUTCOME_REPORT:
      OUTPUT: change-outcome-CR-018.yaml
      CONTENT:
        - Goal achieved: YES
        - Actual impact vs estimated
        - Lessons learned
        - Recommendation for future similar changes
```

**Gate 5:** Change verified? (Goal achieved, actual impact measured, lessons learned extracted)

---

## INTEGRATION WITH OTHER PROCESSES

```yaml
integration_points:

  consumes_from:
    - deep-implement:
        artifacts: blockers.yaml, execution-challenges.yaml
        usage: "Detect change needs from implementation"

    - deep-requirements:
        artifacts: emergent-requirements.yaml, requirement-changes.yaml
        usage: "Detect requirement changes"

    - deep-risk:
        artifacts: risk-materialized.yaml, new-critical-risks.yaml
        usage: "Detect risk-driven changes"

    - deep-verify:
        artifacts: quality-gate-failures.yaml, validation-gaps.yaml
        usage: "Detect quality-driven changes"

    - deep-monitor:
        artifacts: performance-anomalies.yaml
        usage: "Detect performance-driven changes"

    - stakeholders:
        artifacts: strategic-changes.yaml
        usage: "Detect strategic changes"

    - deep-govern:
        artifacts: governance-decisions.yaml
        usage: "Receive approve/reject decisions"

  produces_for:
    - deep-govern:
        artifacts: change-requests.yaml, impact-analysis.yaml
        usage: "Submit changes for decision"

    - deep-plan:
        artifacts: approved-changes.yaml
        usage: "Update implementation plan"

    - deep-implement:
        artifacts: approved-changes.yaml
        usage: "Implement approved changes"

    - stakeholders:
        artifacts: change-log.md
        usage: "Transparency into changes"
```

---

## DECISION FRAMEWORKS

### Framework: Automatic vs Manual Approval

```yaml
auto_approve_criteria:
  ALL_MUST_BE_TRUE:
    - priority: LOW
    - timeline_impact: "≤2 days"
    - cost_impact: "≤$5K"
    - risk_impact: "NEUTRAL or POSITIVE"
    - architectural_impact: "NONE"
    - NOT on critical_path

  action: "Auto-approve, notify deep-govern post-facto"

manual_approval_required:
  ANY_TRUE:
    - priority: CRITICAL or HIGH
    - timeline_impact: ">2 days"
    - cost_impact: ">$5K"
    - risk_impact: "NEGATIVE"
    - architectural_impact: "MINOR or MAJOR"
    - affects critical_path

  action: "Submit to deep-govern for decision"
```

---

## METRICS & KPIS

```yaml
change_management_metrics:

  change_volume:
    - total_change_requests: "Count per month"
      target: "10-20 (healthy adaptation)"
      measure: "Monthly"

    - approval_rate: "Approved / Total"
      target: "60-80% (not rubber-stamping, not overly restrictive)"
      measure: "Monthly"

  change_quality:
    - impact_accuracy: "Actual impact / Estimated impact"
      target: "0.8-1.2 (within ±20%)"
      measure: "Per change (post-implementation)"

    - goal_achievement_rate: "Changes that achieved goal / Total"
      target: "≥90%"
      measure: "Quarterly"

  change_efficiency:
    - analysis_turnaround: "Time from submission to analysis complete"
      target: "≤2 days"
      measure: "Per change"

    - decision_turnaround: "Time from analysis to decision"
      target: "≤3 days (HIGH), ≤1 day (CRITICAL)"
      measure: "Per change"

    - implementation_turnaround: "Time from approval to implementation complete"
      target: "≤1 sprint (2 weeks)"
      measure: "Per change"
```

---

## EXAMPLES

### Example: CR-018 (MFA) Full Lifecycle

**Phase 1: Intake**
- Source: emergent-requirements.yaml (customer feedback: "Cannot deploy without MFA")
- CR-018 created, status = DRAFT
- Validated complete → status = READY_FOR_ANALYSIS

**Phase 2: Impact Analysis**
- Effort: 22 SP = 88 hours = 2.2 weeks
- Timeline impact: +1 week (likely case)
- Cost impact: +$22,200 (+3.2% budget)
- Risk impact: VR-010 reduced 75.8 → 35.2 (-54%)
- Priority: HIGH (customer blocker + critical risk reduction)
- Recommendation: APPROVE

**Phase 3: Decision**
- Submitted to deep-govern (weekly board meeting)
- Decision: APPROVE (conditions: integration testing, pen testing)
- Decided: 2026-02-17

**Phase 4: Plan Update**
- Tasks added to Sprint 6 (6 tasks, 22 SP)
- Sprint 6 backlog updated
- Timeline recalculated: Month 6.0 → Month 6.2 (+1.2 weeks)

**Phase 5: Verification**
- Implementation completed: 2026-03-15
- Goal achieved: YES (MFA working, customer unblocked)
- Actual impact: +1.5 weeks, +$25,800 (close to estimates)
- Lessons: Underestimated third-party integration

---

## ANTI-PATTERNS TO AVOID

```yaml
anti_patterns:

  AP-CHANGE-001_no_impact_analysis:
    description: "Approve changes without analyzing impact"
    why_bad: "Scope creep, timeline slips, budget overruns"
    instead: "Always analyze impact before approval"

  AP-CHANGE-002_rubber_stamp:
    description: "Approve all changes (60-80% healthy)"
    why_bad: "Plan becomes meaningless, no control"
    instead: "Rigorously evaluate, reject low-value changes"

  AP-CHANGE-003_no_tracking:
    description: "Approve change but don't track implementation"
    why_bad: "Changes lost, not implemented, goal not verified"
    instead: "Track from approval through verification"

  AP-CHANGE-004_bypass_process:
    description: "Implement changes without change request"
    why_bad: "No visibility, no impact analysis, no governance"
    instead: "All changes through change process (even small ones)"
```

---

## DEPENDENCIES

**Required processes:**
- deep-govern: Approves/rejects changes
- deep-plan: Updates plan with approved changes

**Triggers from (optional):**
- deep-implement, deep-requirements, deep-risk, deep-verify, deep-monitor, stakeholders

**Produces for:**
- deep-govern: Change requests for decision
- deep-plan: Approved changes for plan update
- deep-implement: Approved changes for implementation

---

## NEXT STEPS

1. **Create workflow.md** - Full change lifecycle workflow
2. **Create steps/** - Detailed step files
3. **Test with example** - Simulate CR-018 lifecycle
4. **Integrate with all trigger sources** - Automated change detection
5. **Setup metrics tracking** - Change volume, approval rate, impact accuracy

---

**Version:** 1.0
**Status:** DRAFT - Ready for implementation
**Author:** Claude (Sonnet 4.5)
**Date:** 2026-02-16
