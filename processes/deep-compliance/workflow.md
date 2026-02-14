# Deep-Compliance V1.0 — Execution Program

> **This file is ROUTING + ENFORCEMENT RULES.** For execution details, see steps/step-NN-*.md files.

---

## START HERE

```
1. Present INVOCATION dialog → user selects scope
2. Check URGENCY_DETECTION → set fast_track_mode
3. Execute step files in sequence (load one at a time)
4. Evaluate GATE_X after each step
5. Proceed to next step OR iterate/halt based on gate result
```

---

## INVOCATION

**When user wants to assess AI system compliance, ALWAYS start with this dialog:**

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                      DEEP COMPLIANCE V1.0                                  ║
║                   EU AI Act Compliance Assessment                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Select assessment scope:                                                  ║
║                                                                            ║
║  [1] QUICK SCAN    (1-2 hours)  — Risk classification + critical gaps     ║
║  [2] STANDARD      (half day)   — Full mapping + gap analysis             ║
║  [3] COMPREHENSIVE (1-2 days)   — Everything + evidence + audit package   ║
║  [4] PRE-AUDIT     (multi-day)  — Maximum rigor + mock audit simulation   ║
║                                                                            ║
║  Select: [1] / [2] / [3] / [4]                                            ║
║                                                                            ║
║  Regulation: EU AI Act 2024 (default)                                     ║
║  Deadline: August 1, 2026 (enforcement date)                              ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

**After selection:**
1. Record `scope = quick | standard | comprehensive | pre-audit`
2. Scan input for urgency signals (see URGENCY_DETECTION)
3. Load step-00-inventory.md

---

## URGENCY DETECTION (automatic)

**Do not ask user. Detect from language.**

If description contains: "urgent", "deadline tomorrow", "audit next week", "regulator requested", "enforcement action", "must comply by", "inspection scheduled", "non-compliance notice"

**→ Set `fast_track_mode = on`**

**Effect:**
- Skip detailed documentation in GATE_0 (accept minimal inventory)
- Prioritize CRITICAL gaps over all other gaps
- Focus on GATE_2 (gap analysis) and GATE_4 (remediation)
- Add "Fast Track Recommendations" section to report
- Highlight quick wins vs long-term fixes

**If no signals → `fast_track_mode = off`** (standard flow)

---

## EXECUTION SEQUENCE (ENFORCED — PROGRAMMATIC)

**Load ONE step file at a time. Evaluate gate. Proceed or halt.**

### Step 0: INVENTORY (Phase 0)
```
1. Read tool: steps/step-00-inventory.md
2. Execute ENFORCED SEQUENCE from step file
3. Collect: AI systems, capabilities, documentation, code references
4. Evaluate GATE_0 (file: gates.yaml, gate: GATE_0)
5. IF fast_track_mode=on → accept minimal inventory, proceed
6. IF GATE_0 PASS → proceed to Step 1
7. IF GATE_0 FAIL (BLOCKER) → HALT, collect missing information
```
**PRECONDITION:** NONE (entry point)
**VIOLATION CHECK:** Agent MUST NOT read step-01 until GATE_0 = OPEN OR fast_track_mode=on

### Step 1: REQUIREMENTS_MAPPING (Phase 1)
```
1. PRECONDITION: GATE_0 = OPEN OR fast_track_mode=on (if not, HALT)
2. Read tool: steps/step-01-requirements-mapping.md
3. Execute Method #327 (Regulatory Requirement Mapper)
4. Map EU AI Act articles → system capabilities
5. Evaluate GATE_1 (file: gates.yaml, gate: GATE_1)
6. IF GATE_1 PASS → proceed to Step 2
7. IF GATE_1 FAIL → address violations (missing mappings)
```
**VIOLATION CHECK:** Agent MUST NOT read step-02 until GATE_1 = OPEN
**METHOD USAGE:** MUST use Method #327 (Regulatory Requirement Mapper)

### Step 2: GAP_ANALYSIS (Phase 2)
```
1. PRECONDITION: GATE_1 = OPEN (if not, HALT)
2. Read tool: steps/step-02-gap-analysis.md
3. Execute Method #329 (Compliance Gap Analyzer)
4. Identify: COVERED / PARTIAL / GAP for each requirement
5. Classify gaps by severity: CRITICAL / HIGH / MEDIUM / LOW
6. Evaluate GATE_2 (file: gates.yaml, gate: GATE_2)
7. IF GATE_2 PASS → proceed to Step 3
8. IF GATE_2 FAIL → iterate (re-analyze uncertain gaps)
```
**VIOLATION CHECK:** Agent MUST NOT read step-03 until GATE_2 = OPEN
**METHOD USAGE:** MUST use Method #329 (Compliance Gap Analyzer)

### Step 3: EVIDENCE_COLLECTION (Phase 3)
```
1. PRECONDITION: GATE_2 = OPEN (if not, HALT)
2. Read tool: steps/step-03-evidence-collection.md
3. For each COVERED requirement: collect evidence (docs, code, tests)
4. Verify evidence quality using Method #168 (Existence Verification)
5. Check evidence freshness using Method #169 (Staleness Detection)
6. Evaluate GATE_3 (file: gates.yaml, gate: GATE_3)
7. IF GATE_3 PASS → proceed to Step 4
8. IF GATE_3 FAIL → collect missing evidence
```
**VIOLATION CHECK:** Agent MUST NOT read step-04 until GATE_3 = OPEN
**METHOD USAGE:** Method #168 (Existence Verification), Method #169 (Staleness Detection)

### Step 4: REMEDIATION_PLANNING (Phase 4)
```
1. PRECONDITION: GATE_3 = OPEN (if not, HALT)
2. Read tool: steps/step-04-remediation-planning.md
3. For each GAP: generate remediation plan (effort, steps, owner, deadline)
4. Prioritize by: severity + deadline + effort + dependencies
5. Create timeline: CRITICAL gaps → High gaps → Medium gaps
6. Evaluate GATE_4 (file: gates.yaml, gate: GATE_4)
7. IF GATE_4 PASS → proceed to Step 5
8. IF GATE_4 FAIL → refine plans (unrealistic timelines)
```
**VIOLATION CHECK:** Agent MUST NOT read step-05 until GATE_4 = OPEN

### Step 5: COMPLIANCE_REPORT (Phase 5)
```
1. PRECONDITION: GATE_4 = OPEN (if not, HALT)
2. Read tool: steps/step-05-compliance-report.md
3. Generate comprehensive report:
   - Executive summary (compliance %, critical gaps, readiness date)
   - Detailed mapping (all requirements)
   - Gap analysis (severity breakdown)
   - Evidence inventory
   - Remediation roadmap
4. Optional: Execute Method #331 (Compliance Evidence Packager)
5. Evaluate GATE_5 (file: gates.yaml, gate: GATE_5)
6. IF GATE_5 PASS → COMPLETE
7. IF GATE_5 FAIL → revise report
```
**VIOLATION CHECK:** Agent MUST complete all sections before GATE_5
**METHOD USAGE:** Method #331 (Compliance Evidence Packager) - optional for comprehensive/pre-audit scopes

---

## GATES (file: gates.yaml)

### GATE_0: INVENTORY_COMPLETE
- **G0-01:** At least 1 AI system identified
- **G0-02:** System capabilities list not empty
- **G0-03:** Documentation references provided (OR fast_track_mode=on)
- **G0-04:** System owner identified

**FAIL ACTION:** Collect missing information

### GATE_1: REQUIREMENTS_MAPPED
- **G1-01:** All EU AI Act articles processed
- **G1-02:** Mapping coverage > 90% (OR fast_track_mode=on AND coverage > 70%)
- **G1-03:** Method #327 executed successfully
- **G1-04:** Mapping result has valid structure

**FAIL ACTION:** Re-run mapping with refined rules

### GATE_2: GAPS_IDENTIFIED
- **G2-01:** All requirements classified (COVERED/PARTIAL/GAP)
- **G2-02:** Gap severity assigned (CRITICAL/HIGH/MEDIUM/LOW)
- **G2-03:** Method #329 executed successfully
- **G2-04:** At least 1 gap has remediation recommendation

**FAIL ACTION:** Re-analyze uncertain classifications

### GATE_3: EVIDENCE_COLLECTED
- **G3-01:** Evidence exists for all COVERED requirements
- **G3-02:** Evidence quality verified (Method #168)
- **G3-03:** No stale evidence (Method #169) OR staleness < 6 months
- **G3-04:** Evidence references are valid (file exists / code line exists)

**FAIL ACTION:** Collect missing/stale evidence

### GATE_4: REMEDIATION_PLANNED
- **G4-01:** All CRITICAL gaps have remediation plans
- **G4-02:** All HIGH gaps have remediation plans
- **G4-03:** Remediation timeline realistic (not all "1 week")
- **G4-04:** Owners assigned for all CRITICAL gaps
- **G4-05:** Dependencies mapped (what blocks what)

**FAIL ACTION:** Refine plans

### GATE_5: REPORT_COMPLETE
- **G5-01:** Executive summary present
- **G5-02:** All 5 sections complete (mapping, gaps, evidence, remediation, timeline)
- **G5-03:** Compliance readiness % calculated
- **G5-04:** Critical gaps highlighted
- **G5-05:** Report length appropriate (not truncated)

**FAIL ACTION:** Complete missing sections

---

## SCOPE-SPECIFIC RULES

### QUICK SCAN (1-2 hours)
- Execute: Step 0, Step 1, Step 2 (partial)
- Skip: Detailed evidence collection, remediation planning
- Output: Risk classification + top 10 critical gaps
- Gates: GATE_0, GATE_1, simplified GATE_2

### STANDARD (half day)
- Execute: Step 0, Step 1, Step 2, Step 4 (light)
- Skip: Detailed evidence collection
- Output: Full mapping + gap analysis + high-level remediation plan
- Gates: GATE_0, GATE_1, GATE_2, simplified GATE_4

### COMPREHENSIVE (1-2 days)
- Execute: All steps
- Output: Full report + evidence inventory + detailed remediation roadmap
- Gates: ALL gates enforced

### PRE-AUDIT (multi-day)
- Execute: All steps + Method #331 (Evidence Packager)
- Output: Audit-ready package + mock audit simulation
- Gates: ALL gates enforced + additional quality checks

---

## METHOD DEPENDENCIES

**CRITICAL (must implement before process works):**
- Method #327: Regulatory Requirement Mapper (Step 1)
- Method #329: Compliance Gap Analyzer (Step 2)

**HIGH VALUE (significantly enhance process):**
- Method #168: Existence Verification (Step 3)
- Method #169: Staleness Detection (Step 3)
- Method #331: Compliance Evidence Packager (Step 5, optional)

**NICE TO HAVE:**
- Method #330: Regulatory Change Monitor (post-assessment monitoring)
- Method #332: High-Risk AI Classifier (Step 0, auto-classification)

---

## CRISIS MODE (fast_track_mode=on)

**Triggers:** Urgent deadline, regulator request, enforcement action

**Modifications:**
- GATE_0: Accept minimal inventory (system name + capabilities list)
- GATE_1: Lower mapping coverage threshold (90% → 70%)
- GATE_2: Focus only on CRITICAL + HIGH gaps
- GATE_3: Skip evidence collection (flag as TODO)
- GATE_4: Fast-track recommendations (quick wins vs long-term)
- Report: Add "Immediate Actions" section (what to do in next 48h)

---

## VIOLATION HANDLING

**If agent skips gates:**
```
ERROR: GATE violation detected
  - Agent attempted to load step-XX before GATE_Y = OPEN
  - HALT execution
  - Return to previous step
  - Fix gate violations
  - Only proceed when GATE = OPEN
```

**If method not available:**
```
WARNING: Method #XXX not yet implemented
  - Fall back to manual process
  - Flag limitation in report
  - Reduce confidence scores
  - Recommend implementing method before next assessment
```

---

## SUCCESS CRITERIA

**Assessment considered SUCCESSFUL when:**
1. All gates passed (or fast-track overrides applied)
2. Compliance % calculated
3. All CRITICAL gaps identified and planned
4. Report generated
5. User confirms report completeness

**Output:**
- `compliance-report-[system-name]-[date].md`
- `compliance-mapping-[system-name]-[date].yaml`
- `remediation-roadmap-[system-name]-[date].md`
- Optional: `audit-evidence-package-[system-name]-[date].zip`

---

**Version:** 1.0.0
**Last Updated:** 2026-02-14
**EU AI Act Deadline:** August 1, 2026
