# Step 02: PLAN Phase

## Purpose
Analyze task type, inject appropriate methods, and create artifact skeleton.

## Trigger
- Operator selects "Update STALE" or "New artifact" from SENSE menu
- Migration process initiated

## Execution

### Phase 2.1: Task Analysis

Determine task type through analysis:

```markdown
## Task Analysis

**Task:** {user_provided_description}

### Type Detection

| Indicator | Present? | Task Type |
|-----------|----------|-----------|
| Code, API, technical design | {yes/no} | Technical |
| Vision, brainstorming, exploration | {yes/no} | Creative |
| External process import | {yes/no} | Migration |
| Quality, verification | {yes/no} | Validation |

**Detected Type:** {type}
```

### Phase 2.2: Method Injection

Based on task type, select methods:

```markdown
## Method Injection

**Task Type:** {detected_type}

### Injected Methods

| # | Method | Purpose |
|---|--------|---------|
{for technical}
| 87 | Falsifiability Check | Ensure claims are testable |
| 114 | Reversibility Test | Verify reasoning traceability |
| 154 | Definitional Contradiction | Detect impossible requirements |
{end}

{for creative}
| 71 | First Principles Analysis | Strip assumptions |
| 79 | Operational Definition | Make concepts measurable |
| 152 | Socratic Decomposition | Break into atomic questions |
{end}

{for migration}
| 90 | Dependency Topology Mapping | Find hidden couplings |
| 159 | Transitive Dependency Closure | Build full graph |
| 100 | Vocabulary Consistency | Standardize terms |
{end}

### Validation Methods (Always Applied)
| 56 | Liar's Trap | Anti-bias |
| 59 | CUI BONO Test | Anti-bias |
| 60 | Approval Gradient | Anti-bias |
| 93 | DNA Inheritance | Coherence |
| 95 | Structural Isomorphism | Coherence |
| 99 | Multi-Artifact Coherence | Coherence |
| 100 | Vocabulary Consistency | Coherence |
```

### Phase 2.3: Dependency Resolution

Identify what must be loaded:

```markdown
## Dependency Resolution

### For STALE Update

**Target:** {dp_id}
**Changed Parent:** {parent_id}

Dependencies to load:
{for each in depends_on}
  📂 {path} ({type})
{end}

### For New Artifact

**Probable dependencies based on type:**
{suggest dependencies based on artifact type}
```

### Phase 2.4: Skeleton Creation

Generate artifact skeleton with YAML header:

```markdown
## Skeleton Generation

**File:** artifacts/{path}/{name}.md

---
dp_id: "{TYPE}-{NAME}"
dp_type: "artifact"
dp_status: "NOW"
version: "3.6"

context:
  depends_on:
    - path: "{dependency_1}"
      type: "semantic_source"
    - path: "{dependency_2}"
      type: "hard_constraint"

semantic_hash:
  - "PLACEHOLDER: Replace with actual facts"

execution:
  active_methods: [{injected_methods}]
  logic_gates: {}

transaction:
  saga_id: "{new_saga_id}"
  previous_hash: "{hash_if_update}"
---

# {Title}

## Overview

{Content to be generated in ACT phase}

## Details

{Details section}
```

### Phase 2.5: Confirmation

Present plan to Operator:

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: PLANOWANIE] [Proces: {process_name}] [Artefakt: {dp_id}]│
└─────────────────────────────────────────────────────────────────┘

Zadanie: {description}
Typ:     {detected_type_pl}

Metody do zastosowania:
  • {name_1_pl} (metoda #{method_1})
  • {name_2_pl} (metoda #{method_2})
  • {name_3_pl} (metoda #{method_3})

Pliki źródłowe do załadowania:
  • {dep_1}
  • {dep_2}

Plik docelowy: {path}

Dostępne akcje:
[Y] Tak, wykonaj    - Przejdź do tworzenia artefaktu
[N] Nie, wróć       - Wróć do ekranu przeglądu
[M] Zmień metody    - Dostosuj listę metod weryfikacji
[H] Pomoc           - Wyjaśnienie tego ekranu

Kontynuować? [Y/n/m/h]:
```

### Help Content for PLAN Phase

When [H] is selected, display:

```
┌─────────────────────────────────────────────────────────────────┐
│  POMOC — Faza planowania (PLAN)                                 │
└─────────────────────────────────────────────────────────────────┘

GDZIE JESTEŚ?
  System przygotował plan utworzenia/aktualizacji artefaktu.
  Teraz możesz zatwierdzić plan lub go zmodyfikować.

CO WIDZISZ NA EKRANIE?
  • Zadanie      = Co system ma zrobić
  • Typ          = Kategoria zadania (techniczne/kreatywne/migracja)
  • Metody       = Techniki weryfikacji które zostaną użyte
  • Pliki źródłowe = Dokumenty od których zależy ten artefakt
  • Plik docelowy = Gdzie zostanie zapisany wynik

CO TO SĄ METODY?
  Metody to techniki weryfikacji jakości, np.:
  • "Analiza pierwszych zasad" - rozbija problem na fundamenty
  • "Test odwracalności" - sprawdza czy można odtworzyć rozumowanie
  • "Detektor sprzeczności" - szuka konfliktów w wymaganiach

CO ROBIĆ?
  • Zgadzasz się z planem? → Wpisz [Y]
  • Chcesz wrócić i wybrać coś innego? → Wpisz [N]
  • Chcesz dodać/usunąć metody? → Wpisz [M]

Naciśnij ENTER aby wrócić do planu...
```

## Decision Logic

### Task Type Heuristics

| Signal | Type |
|--------|------|
| Contains "implement", "build", "code", "API" | Technical |
| Contains "design", "explore", "vision", "brainstorm" | Creative |
| Contains "import", "migrate", "transform", "convert" | Migration |
| Contains "verify", "audit", "check", "validate" | Validation |

### Method Selection Override

When [M] is selected, display method selection menu:

```
┌─────────────────────────────────────────────────────────────────┐
│  WYBÓR METOD WERYFIKACJI                                        │
└─────────────────────────────────────────────────────────────────┘

Aktualne metody dla typu "{type_pl}":

  [✓] Analiza pierwszych zasad (#71)
      Rozbija problem na fundamentalne elementy

  [✓] Definicja operacyjna (#79)
      Zamienia abstrakcje na mierzalne kryteria

  [✓] Dekompozycja sokratejska (#152)
      Dzieli problem na atomowe pod-pytania

Dostępne dodatkowe metody:

  [ ] Test odwracalności (#114)
      Sprawdza czy rozumowanie można odtworzyć wstecz

  [ ] Detektor sprzeczności (#154)
      Szuka definicyjnych konfliktów w wymaganiach

  [ ] Mapowanie zależności (#90)
      Odkrywa ukryte powiązania między elementami

Wpisz numer metody aby włączyć/wyłączyć, lub ENTER aby zatwierdzić:
```

This approach replaces comma-separated numbers with interactive toggle selection.

## State Update

Update state with new artifact in NOW status:

```
[UPDATE_STATE]
{
  "saga_id": "{new_saga_id}",
  "operations": [
    {"type": "CREATE", "target": "{dp_id}", "path": "{path}"}
  ],
  "flag_stale": []
}
[/UPDATE_STATE]
```

## Output

The PLAN phase produces:
1. **Artifact skeleton** with YAML header
2. **Method list** for Implementation Agent
3. **Dependency list** to load in ACT phase

## Next Step

Proceed to **Step 03: ACT** with:
- Skeleton file path
- Injected methods
- Dependency paths
