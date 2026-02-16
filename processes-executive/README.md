# PROCESSES-EXECUTIVE

**Executive Orchestration Framework**

A "CTO/Tech Lead" process system that executes technical work while communicating at business level.

---

## QUICK START

### Using the /executive Command

```bash
# Start new session
/executive

# Or provide vision directly
/executive "Chcę stworzyć system CRM dla małej firmy"

# Resume previous session (if exists)
/executive
# System will ask: "Kontynuować ostatnią sesję?"
```

### What Happens

1. **Phase 1: Intake** - System asks about your vision, constraints
2. **Phase 2: Plan** - System plans execution (hidden from you)
3. **Phase 3: Execute** - System executes tasks, reports progress
4. **Phase 4: Validate** - System validates alignment with goal
5. **Phase 5: Deliver** - System packages deliverables, presents summary

**You see:**
- Business-level progress updates
- Critical decisions when needed
- Executive summary at end (max 2 pages)

**You don't see:**
- Technical planning details
- Subprocess execution logs
- Code or implementation details

---

## DIRECTORY STRUCTURE

```
processes-executive/
│
├── README.md                      ← You are here
├── VISION.md                      ← Foundation: First principles
├── IMPLEMENTATION-COMPLETE.md     ← Full implementation details
│
├── executive-orchestrator/        ← Main process
│   ├── manifest.yaml              ← Process definition
│   ├── workflow.md                ← Entry point, execution flow
│   │
│   ├── phases/                    ← 5 sequential phases
│   │   ├── phase-01-intake.md
│   │   ├── phase-02-plan.md
│   │   ├── phase-03-execute.md
│   │   ├── phase-04-validate.md
│   │   └── phase-05-deliver.md
│   │
│   ├── templates/                 ← Communication templates
│   │   ├── executive-summary.yaml
│   │   ├── decision-prompt.yaml
│   │   └── progress-update.yaml
│   │
│   ├── schemas/                   ← Data validation schemas
│   │   ├── goal-declaration-schema.yaml
│   │   ├── constraints-schema.yaml
│   │   ├── execution-plan-schema.yaml
│   │   ├── backlog-schema.yaml
│   │   ├── validation-report-schema.yaml
│   │   └── session-complete-schema.yaml
│   │
│   ├── components/                ← System components
│   │   ├── state-manager.yaml
│   │   ├── executive-interface.yaml
│   │   ├── backlog-manager.yaml
│   │   └── translation-layer.yaml
│   │
│   └── state/                     ← Runtime state (created during execution)
│       ├── snapshots/             ← State snapshots for resume
│       └── archives/              ← Completed session archives
│
├── skills/                        ← CLI skill definitions
│   └── executive.skill.yaml       ← /executive command
│
└── subprocess-pool/               ← Subprocesses invoked during execution
    └── README.md                  ← TODO: Populate with subprocesses
```

---

## KEY FEATURES

### ✓ Business-Level Communication
- No technical jargon
- Max 2 pages per summary
- Only business value shown

Example:
```
❌ "Implemented UserRepository with CRUD operations"
✓ "Created user management capability"
```

### ✓ Session Continuity
- Close VSC, reopen days later
- Resume exactly where you left off
- State snapshots after each task

### ✓ Goal Tracking
- Goal always visible
- Displayed in every update
- Drift detection in validation

### ✓ Adaptive Execution
- Change direction mid-flight: "Teraz chcę coś innego..."
- Recursive fixes: test fail → fix → retest
- Dynamic backlog management

### ✓ Critical Decisions Only
- User approves only critical decisions
- Implementation details handled automatically
- Decision prompts show business impact

### ✓ Full SDLC Ownership
- Requirements → Architecture → Implementation → Testing → Deployment
- All phases executed automatically
- User stays at strategic level

---

## CORE DOCUMENTS

### [VISION.md](VISION.md)
First principles analysis of user-process relationship. Read this to understand the philosophy.

**Key insights:**
- User = Business Executive
- Process = Technical Executor
- Communication = Business Terms Only
- No Information Overload

### [IMPLEMENTATION-COMPLETE.md](IMPLEMENTATION-COMPLETE.md)
Complete implementation summary with:
- What has been created (all files)
- Compliance verification (14 guidelines)
- Usage scenarios
- What's left to do
- Quality assurance checks

### [manifest.yaml](executive-orchestrator/manifest.yaml)
Process definition:
- 5-phase workflow (NOT OODA)
- 5 binding gates
- 8 error handlers
- Compliance with 14 guidelines

### [workflow.md](executive-orchestrator/workflow.md)
Execution flow with scenarios:
- New session flow
- Resume session flow
- Direction change mid-flight
- Test failure handling
- State persistence

---

## USAGE SCENARIOS

### Scenario 1: New Project from Scratch

```
User: /executive "Chcę stworzyć API dla e-commerce z GDPR compliance"

Phase 1 (Intake):
  System: "Rozumiem: API dla e-commerce, GDPR compliance.
           Kilka pytań:
           1. Budget? (minimal/reasonable/flexible)
           2. Timeline? (kiedy gotowe?)
           3. Preferowane technologie?"

  User provides answers

  System: "Cel: Stworzyć API dla e-commerce z GDPR compliance,
           timeline 2 miesiące, budget reasonable.
           Poprawnie?"

  User: "tak"

Phase 2 (Plan) - HIDDEN:
  System: "Plan gotowy. 5 faz, 12 zadań. Rozpoczynam..."

Phase 3 (Execute):
  System: "CEL: API dla e-commerce...
           Progress: 15% (2/12 tasks)
           Aktualnie: Projektowanie architektury API
           Dlaczego: Potrzebujemy struktury systemu przed implementacją"

  [System executes tasks, reports progress]

  System: "Decyzja potrzebna:
           Jak przechowywać dane?
           Opcja A: Relational DB (PostgreSQL)
             Korzyści: Integralność danych, dobre dla transakcji
             Ryzyko: Schema changes wymagają planowania
           Opcja B: Document DB (MongoDB)
             Korzyści: Elastyczność struktury
             Ryzyko: Mniej strict validation
           Rekomendacja: PostgreSQL (lepsze dla e-commerce)"

  User: "A"

  [Execution continues...]

Phase 4 (Validate):
  System: "✓ Wykonanie zakończone.
           Walidacja: Alignment 92% (GOOD)
           Wszystkie komponenty celu zrealizowane."

Phase 5 (Deliver):
  System: [Displays executive summary - 2 pages]

           "PROJEKT ZAKOŃCZONY

            Cel: API dla e-commerce z GDPR compliance
            Status: ✓ Osiągnięty (alignment: 92%)

            Co zostało zrobione:
            ✓ Created e-commerce API with product and order management
            ✓ Implemented GDPR-compliant data handling
            ✓ Added secure authentication and authorization
            ✓ Validated system with comprehensive testing
            ✓ Prepared deployment package

            Deliverables:
            ✓ E-commerce API: Handles products, orders, payments
            ✓ GDPR Module: User consent, data export, deletion
            ✓ Documentation: API specification, deployment guide

            Opcje:
            A) Start new session
            B) Enhance current deliverables
            C) Close"
```

### Scenario 2: Resume After Days

```
User: /executive
(3 days after previous session)

System: "Witaj ponownie!
         Ostatnia sesja: 3 dni temu

         Cel: API dla e-commerce z GDPR
         Faza: 3/5 (Execute) - 75% complete
         Ostatni task: Payment integration (in progress)
         Następny krok: Complete payment, then notifications

         Kontynuować?"

User: "tak"

System: "✓ Session resumed.
         CEL: API dla e-commerce...
         Progress: 75% (9/12 tasks)
         Aktualnie: Payment integration
         Kontynuuję..."
```

### Scenario 3: Direction Change

```
[During Phase 3, 50% complete]

User: "Teraz chcę coś innego - zamiast API zrób web dashboard"

System: "Rozumiem - zmiana kierunku.

         Obecny cel: API dla e-commerce
         Nowy cel: Web dashboard dla e-commerce

         Analiza wpływu:
         - Reusable: 3 tasks (data models, business logic)
         - Discard: 5 tasks (API endpoints, auth middleware)
         - New: 6 tasks (UI components, frontend, integration)

         Effort delta: +2 tasks (14 total instead of 12)

         Kontynuować ze zmianą?"

User: "tak"

System: "✓ Cel zaktualizowany
         ✓ Backlog przebudowany
         ✓ Kontynuuję z nowym kierunkiem...

         CEL: Web dashboard dla e-commerce...
         Progress: 21% (3/14 tasks)
         Aktualnie: Dashboard UI design..."
```

### Scenario 4: Test Failure

```
[During Phase 3]

System: "CEL: API dla e-commerce...
         Progress: 80% (10/12 tasks)
         Aktualnie: Testing"

[Tests run, 3 fail]

System: "Testy wykryły problemy. Dodaję zadania naprawcze.

         ✓ Added 3 fix tasks
         ✓ Will retest after fixes

         Progress: 77% (10/13 tasks)
         Aktualnie: Fix payment validation..."

[System fixes issues, retests]

System: "✓ Fixes complete
         ✓ Retesting...
         ✓ All tests pass

         Progress: 92% (12/13 tasks)
         Aktualnie: Deployment preparation..."
```

---

## WHAT MAKES THIS DIFFERENT

### Traditional Process
```
User: "I need a CRM system"
Process: [Shows 50 pages of technical specs]
Process: [Shows code implementation details]
Process: [Shows test logs]
Process: [Shows deployment configurations]
User: 😵 Information overload
```

### Executive Orchestrator
```
User: "Chcę system CRM"
Process: "Rozumiem. Kilka pytań..." [extracts constraints]
Process: "Plan gotowy. Rozpoczynam..." [plans hidden]
Process: "Progress: 25%. Created user management..." [business level]
Process: "Decyzja: Jak przechowywać dane?" [critical only]
Process: "✓ Complete. Summary: [2 pages]" [business value]
User: ✓ Clear, actionable, strategic level
```

---

## COMPLIANCE

### 14 Process Design Guidelines: ✓ All Verified

1. **Self-contained** - Each phase loads only needed data
2. **Completeness** - Backlog must be complete before execution
3. **Mechanism not intention** - All rules = trigger + action
4. **Binding gates** - 5 gates block progression
5. **Assumptions before action** - Phase 1 declares before Phase 2 plans
6. **Enforced sequence** - Phases 1→2→3→4→5, cannot skip
7. **Checklist after phase** - Each gate = checklist
8. **Counter-check** - Phase 4 includes counter-check
9. **Executive language** - Imperative verbs throughout
10. **Visible reasoning** - Execution log + summaries
11. **Instruction + min data** - Just-in-time loading
12. **Info at moment of use** - Data per phase
13. **Zero decorations** - Only executable mechanisms
14. **YAML frontmatter** - All artifacts use YAML

**Verification:** See manifest.yaml lines 401-483

---

## STATUS

### ✓ Core Implementation Complete
- [x] Foundation (VISION.md)
- [x] Process definition (manifest.yaml)
- [x] Workflow (workflow.md)
- [x] All 5 phase files
- [x] All 3 templates
- [x] All 6 schemas
- [x] All 4 components
- [x] Skill definition
- [x] State directories
- [x] Documentation

### ⏳ Integration Pending
- [ ] Subprocess pool populated
- [ ] Skill registered with CLI
- [ ] End-to-end testing
- [ ] Production deployment

---

## NEXT STEPS

### For Users
1. Wait for subprocess pool population
2. Test `/executive` command when ready
3. Try new session flow
4. Try resume session flow
5. Provide feedback

### For Developers
1. **Populate subprocess-pool/** (see subprocess-pool/README.md)
   - Copy/adapt from processes/ directory
   - Ensure manifest.yaml format matches
2. **Register skill** with claude-code CLI
   - Integrate executive.skill.yaml
   - Test /executive invocation
3. **Run integration tests**
   - New session flow
   - Resume session flow
   - Direction change
   - Test failure recursive fix
4. **Production deployment**
   - Verify state persistence
   - Test across VSC sessions
   - Verify goal tracking

---

## SUPPORT DOCUMENTATION

- **VISION.md** - Philosophy and first principles
- **IMPLEMENTATION-COMPLETE.md** - Full implementation details
- **manifest.yaml** - Process specification
- **workflow.md** - Execution flow and scenarios
- **subprocess-pool/README.md** - Subprocess integration guide

---

## AUTHOR

**Created by:** deep-explore-v2 workflow
**Date:** 2025-01-15
**Methods applied:** 167, 071, 152, 083, 084
**Compliance:** All 14 guidelines ✓

---

**Questions?** Read IMPLEMENTATION-COMPLETE.md for full details.
