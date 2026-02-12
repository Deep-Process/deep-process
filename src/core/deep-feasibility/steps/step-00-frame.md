---
step: 0
name: "Frame"
time_estimate: "15-30 minutes"
goal: "Classify problem type, decompose feasibility questions, define assessment scope"
requires_completion: []
next_steps:
  DEFAULT: "steps/step-01-constrain.md"
  SCOPE_UNCLEAR: "STAY — clarify with user"
data_dependencies:
  - "data/theoretical-foundations.yaml"
  - "data/feasibility-scoring.yaml"
outputs:
  - cynefin_domain_map
  - sub_questions
  - scope_definition
  - complex_mode_flag
---

# Phase 0: FRAME

## PRECONDITION CHECK

BEFORE executing this step:

1. **Verify entry point**
   - Step 0 is process entry point
   - No previous gate required
   - Proceed directly to method execution

2. **PRECONDITION:** NONE (this is Step 0 — entry point)

---

## ENFORCED SEQUENCE

Execute methods in this exact order:

**STEP 1: Load theoretical foundations**
1. Read tool: data/theoretical-foundations.yaml
2. Review: Cynefin framework (Snowden 2007)
3. Understand: Why domain classification determines assessment method

**STEP 2: Cynefin Domain Classification (#001)**
1. Read tool: data/method-procedures/001_Cynefin_Domain_Classification.md
2. For EACH component of subject:
   a. Ask: "Can we predict outcome?"
   b. Classify: Clear/Complicated/Complex/Chaotic
   c. Record: domain_map entry with assessment_approach
3. IF any component = Complex → set complex_mode = on
4. Counter-check: Sample 3 classifications, verify reasoning valid

**STEP 3: Feasibility Question Decomposition (#002)**
1. Read tool: data/method-procedures/002_Feasibility_Question_Decomposition.md
2. Starting question: "Is [subject] feasible?"
3. Decompose along 4 fault lines:
   a. By component/module
   b. By phase (design/build/test/deploy/operate)
   c. By dimension (preview of Step 2: 10 dimensions)
   d. By risk (most uncertain parts)
4. For EACH sub-question:
   a. Assess: assessable now? requires Step 1 constraint data? requires Step 2 dimension data?
   b. Map: dependencies between sub-questions
5. Record: sub_questions with dependency graph

**STEP 4: Feasibility Scope Definition (#003)**
1. Read tool: data/method-procedures/003_Feasibility_Scope_Definition.md
2. Define 5 scope elements:
   a. Subject: exact thing being assessed
   b. Horizon: time window (can build in 6 months? can operate for 5 years?)
   c. Standard: definition of "feasible" (technical proof? economic viability? full production?)
   d. Exclusions: what is OUT of scope (explicitly)
   e. Assumptions: what we assume true (explicitly)
3. Record: scope_definition with all 5 elements
4. Counter-check: Verify no silent exclusions (CUI BONO - do exclusions benefit agent?)

**STEP 5: Record outputs**
1. Write: domain_map to frontmatter
2. Write: sub_questions to frontmatter
3. Write: scope_definition to frontmatter
4. Write: complex_mode_flag to frontmatter
5. Verify: ALL 4 outputs exist and non-empty

---

## 0.1 Cynefin Domain Classification (#001)

**1. Read tool:** `data/method-procedures/001_Cynefin_Domain_Classification.md`

**Purpose:** Determine WHAT TYPE of problem this is — because the type determines whether traditional feasibility assessment is even possible.

### Execute Method #001

```
For the subject being assessed, classify each component/sub-problem:

┌─────────────────────────────────────────────────────────────────────────────┐
│  CYNEFIN DOMAINS                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLEAR (formerly Simple)                                                    │
│  • Cause→effect obvious to everyone                                         │
│  • Best practice exists                                                      │
│  • Assessment: Direct constraint checking                                   │
│  • Example: "Can we add another field to this form?"                        │
│                                                                              │
│  COMPLICATED                                                                │
│  • Cause→effect requires expertise to see                                   │
│  • Good practice exists (multiple valid approaches)                         │
│  • Assessment: Expert analysis                                              │
│  • Example: "Can we scale this database to 10× load?"                       │
│                                                                              │
│  COMPLEX                                                                    │
│  • Cause→effect only visible in retrospect                                  │
│  • Emergent behavior, no predictable outcome                                │
│  • Assessment: CANNOT ASSESS TRADITIONALLY — must probe                     │
│  • Example: "Will users adopt this new workflow?"                           │
│                                                                              │
│  CHAOTIC                                                                    │
│  • No perceivable cause→effect relationship                                 │
│  • Act first to create stability, assess later                              │
│  • Assessment: Not applicable — stabilize first                             │
│  • Example: "Production is down, everything is broken"                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Classification Process

1. List all components/aspects of the subject
2. For each, ask: "Can we predict the outcome of this?"
   - Yes, obviously → CLEAR
   - Yes, with expertise → COMPLICATED
   - Only in retrospect → COMPLEX
   - No pattern at all → CHAOTIC

3. **RED FLAG:** Treating Complex as Complicated
   - Applying expert analysis to emergent problems
   - This produces **confident but wrong** feasibility assessments
   - If detected: flag for probing instead of analysis

### Record Domain Map

```yaml
domain_map:
  - component: "[Component 1]"
    domain: "[Clear/Complicated/Complex/Chaotic]"
    assessment_approach: "[Direct check/Expert analysis/Probe/Stabilize first]"
    probe_needed: [true/false]
  - component: "[Component 2]"
    domain: "..."
    # continue for all components
```

**IF any component is COMPLEX:**
→ Set `complex_mode = on`
→ Note: "#303 Probe Design will be required for these components"

---

## 0.2 Feasibility Question Decomposition (#002)

**1. Read tool:** `data/method-procedures/002_Feasibility_Question_Decomposition.md`

**Purpose:** Break monolithic "Is this feasible?" into atomic, independently assessable sub-questions.

### Execute Method #002

```
Starting question: "Is [subject] feasible?"

DECOMPOSE along these fault lines:

1. BY COMPONENT/MODULE
   - What are the distinct parts?
   - Can each be assessed independently?

2. BY PHASE
   - Design feasibility
   - Build feasibility
   - Test feasibility
   - Deploy feasibility
   - Operate feasibility

3. BY DIMENSION (preview of Step 2)
   - Technically feasible?
   - Resource feasible?
   - Knowledge feasible?
   - Organizationally feasible?
   - Temporally feasible?
   - Compositionally feasible?
   - Economically feasible?
   - Regulatorily feasible?
   - Scale feasible?
   - Cognitively feasible?

4. BY RISK (most uncertain parts)
   - What's the most uncertain?
   - What has the least precedent?
```

### Assess Each Sub-Question

For each sub-question:
- [ ] Is it assessable NOW? (We have information)
- [ ] Does it need investigation? (We need to gather data)
- [ ] Does it depend on other sub-questions? (Dependencies)
- [ ] What Cynefin domain is it in? (From 0.1)

### Record Sub-Questions

```yaml
sub_questions:
  - id: "Q1"
    question: "[Specific feasibility question]"
    assessable_now: [true/false]
    needs_investigation: [true/false]
    depends_on: ["Q2", "Q3"]  # or []
    cynefin_domain: "[Clear/Complicated/Complex]"
  - id: "Q2"
    question: "..."
    # continue for all sub-questions
```

**STOP DECOMPOSING when:**
- Sub-questions are directly assessable, OR
- They clearly need a probe (#303)
- **Zeno's paradox warning:** Infinite decomposition is itself infeasible

---

## 0.3 Feasibility Scope Definition (#003)

**1. Read tool:** `data/method-procedures/003_Feasibility_Scope_Definition.md`

**Purpose:** Explicitly define WHAT is being assessed and WHAT IS NOT. Scope creep in feasibility assessment is as real as scope creep in projects.

### Execute Method #003

Answer these questions explicitly:

```
1. SUBJECT: What exactly are we assessing?
   □ The whole project?
   □ A specific component?
   □ A decision between options?
   □ A migration path?

   Answer: _________________________________

2. HORIZON: Feasibility by when?
   □ Next sprint?
   □ Next quarter?
   □ Next year?
   □ No specific deadline?

   Answer: _________________________________

3. STANDARD: Feasible means what?
   □ Working prototype?
   □ Production-ready?
   □ Scaled to target load?
   □ Maintained for X years?

   Answer: _________________________________

4. EXCLUSIONS: What are we NOT assessing?
   (List explicitly — prevents scope creep)

   - _________________________________
   - _________________________________
   - _________________________________

5. ASSUMPTIONS: What are we taking as given?
   (These become risks if wrong — hand off to Deep-Risk)

   - _________________________________
   - _________________________________
   - _________________________________
```

### Record Scope

```yaml
scope:
  subject: "[precise description]"
  horizon: "[deadline/timeline]"
  standard: "[what 'feasible' means]"
  exclusions:
    - "[What we're not assessing]"
  assumptions:
    - "[What we're taking as given]"
```

**Why this matters:** "Is this feasible?" without scope is unanswerable.
"Can we deliver a production-ready Delta Lake pipeline for EPR reporting by Q2 with the current 3-person team assuming Mars provides data in agreed format?" — THAT is assessable.

---

## 0.4 Update Frontmatter

After completing FRAME, update working document:

```yaml
---
workflow: deep-feasibility
subject: "[from 0.3]"
started: "[current ISO timestamp]"
depth: [quick/standard/comprehensive/critical]
complex_mode: [on/off]

domain_map:
  - component: "..."
    domain: "..."
    probe_needed: [true/false]

sub_questions:
  - id: "Q1"
    question: "..."
    assessable_now: [true/false]

scope:
  subject: "..."
  horizon: "..."
  standard: "..."
  exclusions: [...]
  assumptions: [...]

steps_completed: [0]
current_step: 1
dimensions_scored: []
constraints_found: []
conditions: []
decision: null
confidence: null
---
```

---

## GATE_0 EVALUATION

AFTER executing all methods (#001, #002, #003):

1. **Read tool:** data/gates.yaml
2. **Load GATE_0 conditions** (4 conditions total)
3. **FOR EACH condition:**
   a. Execute check per gates.yaml specification
   b. Record result: PASS/FAIL
   c. Record severity: BLOCKER/CRITICAL/ERROR

4. **Apply evaluation logic:**
   - G0-01 (domain_map exists, ≥1 component): IF FAIL → GATE_0 = FAIL (BLOCKER)
   - G0-02 (sub_questions exist, ≥1 question): IF FAIL → count CRITICAL failures
   - G0-03 (scope_definition exists): IF FAIL → count CRITICAL failures
   - G0-04 (Complex flagged for probes): IF FAIL → count ERROR (not blocking)
   - IF G0-01 BLOCKER fails → GATE_0 = FAIL
   - IF ≥50% CRITICAL fail (≥1 of 2) → GATE_0 = FAIL
   - ELSE → GATE_0 = PASS

5. **IF GATE_0 = FAIL:**
   - Report failures with severity
   - HALT execution (cannot proceed without problem classification)
   - Fix issues and re-execute Step 0

6. **IF GATE_0 = PASS:**
   - Log: "GATE_0 passed — problem characterized, proceeding to Step 1"
   - Agent may now read step-01-constrain.md

---

## VIOLATION CHECKS

During Step 0 execution, verify:

**R2 COMPLETENESS:**
- ALL components classified (not "main" or "important" components)
- ALL sub-questions decomposed (not "key" questions)
- Complete scope definition (all 5 elements: subject, horizon, standard, exclusions, assumptions)

**R12 JUST-IN-TIME:**
- Agent MUST NOT read step-01-constrain.md until GATE_0 = PASS
- Agent MUST NOT load all method files upfront (load #001, #002, #003 sequentially as needed)

**IF violation detected:**
- HALT execution
- Report: "VIOLATION: [R2/R12] [description]"
- Log to process_log

---

## 0.5 Proceed to CONSTRAIN

**Before loading Step 1, verify:**

- [ ] Cynefin domain classified for all components
- [ ] Sub-questions decomposed and dependency-mapped
- [ ] Scope explicitly defined (subject, horizon, standard, exclusions, assumptions)
- [ ] Complex components flagged (if any)
- [ ] Frontmatter updated

**Next step:** Load `steps/step-01-constrain.md`

**Navigation:**
- ↓ PROCEED if scope is clear and components classified
- ↓ STAY if framing is unclear — clarify with user first

---

## Output Checklist

Before proceeding, confirm:

- [ ] `domain_map` populated with all components
- [ ] `sub_questions` list complete
- [ ] `scope` fully defined
- [ ] `complex_mode` flag set correctly
- [ ] Ready to identify constraints
