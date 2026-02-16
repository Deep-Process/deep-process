---
# VISION - Executive Orchestration Ecosystem
# Definicja wizji z first principles
---

## CORE TRUTH (First Principle)

**User = Business Executive**
**Process = Technical Executor**

User operates at BUSINESS level.
Process operates at TECHNICAL level.
Translation layer REQUIRED between levels.

## ROLE DEFINITION

### User (Business Level)
- Presents vision: "Chcę program do X"
- Defines constraints: "Z ograniczeniami Y, Z"
- Makes decisions: "Zmień Z na Z2"
- Asks status: "Gdzie jesteśmy?"
- Changes direction: "Teraz chcę coś innego"

### Process (Technical Level)
- Extracts requirements from vision
- Plans technical execution (hidden from user)
- Executes full SDLC (A to Z)
- Reports in business terms
- Asks only critical decisions
- Tracks goal continuously
- Adapts to direction changes

## CRITICAL REQUIREMENTS

### 1. NO INFORMATION OVERLOAD
```yaml
FORBIDDEN:
  - Technical analysis dumps
  - Architecture diagrams (unless asked)
  - Detailed logs
  - 50-page reports
  - Raw test output

REQUIRED:
  - Executive summaries only
  - "Co zrobione, co następne, dlaczego"
  - Key decisions highlighted
  - Progress at glance
```

### 2. CONTINUITY ACROSS SESSIONS
```yaml
CAPABILITY:
  - Close VSC → State saved
  - Open VSC → "Gdzie byliśmy? Co było? Co następne?"
  - Full context restoration
  - NO loss of progress

MECHANISM:
  - State snapshots after each phase
  - Session logs (immutable)
  - Resume handler
```

### 3. GOAL ORIENTATION
```yaml
ENFORCEMENT:
  - Process ALWAYS displays current goal
  - Before each phase: "Cel: X. Ta faza służy: Y"
  - After phase: "Cel: X. Osiągnęliśmy: Z"
  - Goal validation: Does output align with goal?
  - Goal drift detection: Alert if drifting

GOAL SOURCES:
  - User declaration at start
  - User modification during execution ("teraz chcę coś innego")
```

### 4. ADAPTIVE EXECUTION
```yaml
ADAPTATIONS:
  - Architecture change mid-flight → Update plan, continue
  - User changes goal → Recalculate, align, proceed
  - Tests fail → Back to backlog, fix, retest
  - Bug discovered → Add to backlog, prioritize
  - Forgot something → Inject task, execute
```

### 5. FULL SDLC OWNERSHIP
```yaml
PHASES:
  - Requirements extraction
  - Architecture design
  - Implementation
  - Testing (recursive if fail)
  - Deployment

COORDINATION:
  - All phases tracked
  - Backlog maintained
  - Progress visible
  - Blockers identified
```

### 6. TASK TRACKING INTEGRATED
```yaml
BACKLOG:
  - Dynamic: Add/remove/reprioritize during execution
  - Visible: User can see backlog
  - Recursive: Failed test → fix task → execute → retest

TASK STATES:
  - TODO
  - IN_PROGRESS
  - BLOCKED (with blocker identified)
  - DONE
```

### 7. DECISION INTERFACE
```yaml
WHEN TO ASK:
  - Architecture change affects goal
  - Technology choice impacts constraints
  - Trade-off requires business judgment
  - Scope reduction needed

HOW TO ASK:
  - Business terms (no technical jargon)
  - Clear options (A vs B)
  - Impact explained ("Dlaczego to ważne")
  - Recommendation provided (if applicable)

WHEN NOT TO ASK:
  - Technical implementation details
  - Code structure choices
  - Testing strategies
  - Anything user doesn't need to know
```

## COMMUNICATION PROTOCOL

### Executive Summary Format
```yaml
STRUCTURE:
  what_done: "Completed phase X: [business-level description]"
  what_next: "Next phase Y: [business-level description]"
  why: "This serves goal: [goal reminder]"
  decisions_made: "[Key technical decisions, business impact]"
  blockers: "[If any]"
  progress: "X% complete"
```

### Decision Prompt Format
```yaml
STRUCTURE:
  context: "Jesteśmy na etapie X"
  decision_needed: "Muszę wybrać między A i B"
  option_a:
    description: "[Business-level what]"
    pros: "[Impact on goal]"
    cons: "[Impact on goal]"
  option_b:
    description: "[Business-level what]"
    pros: "[Impact on goal]"
    cons: "[Impact on goal]"
  recommendation: "[If applicable]"
  question: "Którą opcję wybrać?"
```

### Progress Update Format
```yaml
STRUCTURE:
  current_phase: "Phase X/N"
  goal: "[Goal reminder]"
  status: "on track | delayed | blocked"
  recent_work: "[Last significant achievement]"
  next_milestone: "[What's coming]"
```

## FORBIDDEN PATTERNS

```yaml
VIOLATIONS:
  - Dumping technical details without user request
  - Proceeding without goal reminder
  - Making critical decisions without user input
  - Losing state across sessions
  - Generating >2 pages without executive summary
  - Using technical jargon in user-facing communication
  - Skipping task tracking
  - Ignoring goal drift
```

## SUCCESS CRITERIA

Process is successful when:
1. User can close/reopen VSC and know exactly where they are
2. User is NEVER overwhelmed by information
3. User can change direction at any time
4. Goal is ALWAYS visible and validated
5. User sees business-level summaries, not technical dumps
6. Critical decisions are presented clearly with options
7. Full SDLC executes end-to-end automatically
8. Tasks tracked, progress visible, blockers identified

---
# END VISION.md
