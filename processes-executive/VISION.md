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
9. Track changes over time with immutable logs
10. Observability into process state at all times
11. User feels in control, informed, and aligned with execution
12. Too much information is never generated without a clear executive summary
13. User should see only executive-level information, never technical details unless they ask for it
14. At any point, the user should be able to ask "where we are?" and get a clear, concise summary of current status, next steps, and how it serves the goal
15. There is summary report of all decisions made, with business impact explained, that the user can review at any time
16. There is progess dashboard with current phase, % complete, blockers, and next milestones visible to the user at all times
17. There is dashboard with plans, backlog, and task states visible to the user at all times
18. User can change the goal or direction at any time, and the process adapts without losing context
19. If the process encounters a blocker, it identifies it clearly and reports it to the user with options for resolution
20. If the process detects goal drift, it alerts the user and provides options to realign
21. There is clear drift detection mechanism and drift manager that manages drift when detected, either by alerting user or automatically realigning
22. The process maintains a complete, immutable log of all actions, decisions, and state changes
23. Obsolite information is pruned from user-facing communication, but preserved in logs for traceability
24. Any process should follow RULES to ensure clarity, consistency, and alignment with the vision
25. The process should be designed to be self-contained, with all necessary information provided just-in-time for each phase, and no assumptions about prior knowledge of the agent
26. The process should prioritize completeness over token limits, ensuring that all necessary information is provided rather than just the "main" points
27. There is easy way to review the entire process history, including all decisions, changes, and progress, in a clear and organized manner
28. There is easy way for user to execute any task, any phase, or even the entire process again, with the same or modified parameters, without losing context or progress
29. User is informed about what he can do at any point, what options he has, and how to interact with the process to achieve his goals
30. Process should follow user vison and constraints at all times, and adapt to any changes in vision or constraints without losing progress or context
31. User may change the vision or constraints at any time, and the process should adapt accordingly while preserving as much progress as possible
32. If changes in vision or constraints cause significant disruption, the process should alert the user and provide options for how to proceed, including potential trade-offs



## RULES

OODA is only for complex processe
OODA Loop: Observe → Orient → Decide → Act
OODA jest tylko dla deep-orchestration


0. Jeżeli coś nie służy wykonaniu procesu nie powinno być w procesie jak opisy, dokumetnacje, rzeczy tylko informacyjne - są zbędne
0. Zadania należy dzielić na mniejsze jeżeli pliki zaczynają być za duże, należy zachować ciągłość procesu 

1. Self-contained
Instrukcja zawiera wszystko do wykonania, zero założeń o wiedzy agenta.
Self-contained realizowana przez just-in-time loading (nie upfront)

2. Completeness > tokens
Wymuszaj wyczerpanie zamiast selekcji. "Wszystkie" zamiast "główne". "Każdy" zamiast "typowe".

3. Mechanizm zamiast intencji
Nie pisz co powinno się stać. Pisz co agent ma zrobić gdy warunek X. Każda reguła = trigger + akcja.
proces musi mieć wszędzie definicje mechanizmów wymuszania a nie intencje (co powinno się stać), 

4. Binding gate
Pominięcie czegokolwiek wymaga jawnej deklaracji. Brak deklaracji = naruszenie procesu.
Proces  musi mieć binding gate — żeby nie pozwalać agentowi na "inteligentne" pominięcia bez formalnej deklaracji scope reduction. 

5. Założenia przed działaniem
Agent najpierw deklaruje interpretacje i założenia. Dopiero potem wykonuje.
proces wymusza sekwencję extract → verify → render. żeby agent na przykład nie przeszedł do generowania treści dowolnym momencie 

6. Wymuszona sekwencja
Fazy połączone blokerami. "Dopiero po X", "Nie przechodź zanim". Agent nie może przeskakiwać.

7. Checklist po fazie
Koniec fazy = pytania kontrolne. Odpowiedź negatywna = stop lub powrót.
Proces  wymusza checklisty PO KAŻDEJ fazie - zawsze.

8. Counter-check
Kluczowe twierdzenia wymagają próby obalenia. Agent szuka kontrargumentu i raportuje wynik.
proces ma counter-checks na kluczowe twierdzenia 

9. Egzekucyjny język
Czasowniki rozkazujące + sekwencja + warunki. Nie opisy stanów docelowych.
procesem jest procesem egzekucyjnym ( wymusza JAK i W JAKIEJ KOLEJNOŚCI),  nie jest procesem opisowym (mówi CO powinno się stać) 

10. Widoczne rozumowanie
Wymuś pokazanie kroków myślenia przed odpowiedzią.

11. Instrukcja + dane do niej
Każdy krok zawiera: akcję + minimum informacji potrzebnych do wykonania tej akcji. Nic ponad.

11. proces musi zawierać executable instructions i niezbędne informacje żeby poprawnie wykonać executable instructions (Executable Instructions + Necessary Information)


12. Informacja w momencie użycia
Dane do fazy N pojawiają się przy fazie N. Nie wcześniej.

13. Zero ozdobników
Brak wyjaśnień, kontekstu, uzasadnień. Tylko mechanizmy wykonawcze.

14. Preserves critical facts across document rewrites - YAML frontmatter with facts list,
Mathematical proof of migration lossiness- Formula: L = (unmapped + semantic_loss) / N_source
---
# END VISION.md



