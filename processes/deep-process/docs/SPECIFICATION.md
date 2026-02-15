# TECHNICAL SPECIFICATION: Deep-Process v3.7 (Semantic Reality Engine)

**Codename:** SRE-Convergent
**Version:** 3.7.0
**Architecture:** File-Based, LLM-Executed, Human-Anchored Graph Database
**Target Runtime:** Claude CLI / Gemini CLI / Native Shell
**Last Updated:** 2026-02-04

> **v3.7 Changes:** Added Pillar 6 (Provable Transformation), Artifact Hierarchy (Self-Extension),
> Granular Propagation Modes, Parallel Paths (Fork/Join).
> See RFC-001 in `docs/` for full rationale.

---

## 1. CORE PHILOSOPHY & INVARIANTS

System nie jest chatbotem. Jest **Semantycznym Systemem Operacyjnym**, który wymusza determinizm na probabilistycznym silniku (LLM) poprzez 5 nienaruszalnych Filarów.

### 1.1. The 6 Pillars of Architecture
1.  **Transactional Processes (Saga Pattern):**
    *   Każda operacja zapisu jest transakcją.
    *   Brak `[UPDATE_STATE]` w odpowiedzi = `ROLLBACK` (odrzucenie odpowiedzi przez Operatora).
    *   Stan "pomiędzy" jest niedopuszczalny.
2.  **Structured Rails (Schema Enforcement):**
    *   LLM nie "pisze" dokumentów; LLM "wypełnia" schematy zdefiniowane w kontraktach YAML.
    *   Walidacja następuje *przed* zapisem (Pre-commit hook w postaci Sub-Agenta).
3.  **Topology Awareness (Change Coupling):**
    *   System mapuje zależności (`depends_on`).
    *   Zmiana w węźle A propaguje do węzłów zależnych zgodnie z **Propagation Mode** (patrz: 4.4).
    *   Tryby: `IMMEDIATE` (natychmiastowe STALE), `DEFERRED` (odroczone), `VERSION_PINNED` (zamrożone), `CONDITIONAL`.
4.  **Semantic Lineage (Traceability):**
    *   Każdy artefakt posiada wskaźnik `source_id`.
    *   Można prześledzić drogę od Tasku (kod) przez Epik aż do Wizji.
    *   **Wersjonowanie:** Każdy artefakt ma `version_history` z pełną historią zmian.
5.  **Convergent Determinism:**
    *   Determinizm nie jest binarny (identyczność znaków), lecz semantyczny (zgodność faktów).
    *   Wymuszenie: `semantic_hash` w każdym artefakcie + weryfikacja przez Operatora (Human Anchor).
    *   Realizacja przez metody #87 (Falsifiability), #114 (Reversibility), #154 (Definitional Contradiction).
6.  **Provable Transformation (NEW in v3.7):**
    *   Każda transformacja procesu zewnętrznego do SRE-Convergent musi być **dowodowo bezstratna** lub **udokumentowanie stratna**.
    *   Wymuszenie: Method #160 (Transformation Proof) generuje `transformation-proof.json`.
    *   Test odwracalności: P → SRE → P' gdzie P ≈ P' w granicach akceptowalnej delty.
    *   Metryki: `lossiness_score` (0 = bezstratna), `reversibility_score` (1 = w pełni odwracalna).

---

## 2. FILESYSTEM ARCHITECTURE (The Hardware)

Architektura oparta na modelu obiektowym z **trzema warstwami dziedziczenia**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 1: META-CLASS (Deep-Process Framework)                              │
│  Location: src/core/deep-process/                                          │
│  Provides: HOW to execute (methods, validation, orchestration)             │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 2: PROCESS CLASSES (SRE-Convergent Process Definitions)             │
│  Location: src/core/deep-process/processes/                                │
│  Provides: WHAT to execute (steps, artifacts, gates)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 3: PROCESS INSTANCES (Runtime Executions)                           │
│  Location: artifacts/processes/{instance-id}/                              │
│  Tracked in: .deep-process/registry.json                                   │
│  Provides: EXECUTION results (generated artifacts)                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.1. Framework Definition (Layer 1)

```text
src/core/deep-process/              # META-CLASS (Framework)
├── workflow.md                     # Main documentation
├── data/
│   ├── enforcer.md                 # BIOS: Law 0-6 + Method Translator
│   ├── contract-interpretation-protocol.md  # YAML parsing as executable
│   ├── state-schema.yaml           # Schema for state.json (extended v3.7)
│   ├── registry-schema.yaml        # Schema for registry.json (extended v3.7)
│   ├── contract-schema.yaml        # Universal Contract schema (extended v3.7)
│   ├── decision-point-schema.yaml  # Decision Point schema
│   ├── method-translator.yaml      # Method definitions (18 methods)
│   ├── display-modes.yaml          # Display mode configuration (friendly/expert)
│   ├── help-reference.md           # User help documentation
│   │
│   │   # === NEW v3.7 SCHEMAS ===
│   ├── universal-process-schema.yaml    # UPS: Source process format
│   ├── transformation-proof-schema.yaml # Migration proof document
│   ├── artifact-hierarchy-schema.yaml   # Artifact hierarchy within instance
│   ├── fork-join-schema.yaml            # Parallel path definitions
│   │
│   ├── templates/                  # Universal templates
│   │   ├── artifact-template.md
│   │   └── decision-point-template.md
│   └── method-procedures/          # 18 method procedures (17 + #160)
│       ├── 056_Liars_Trap.md
│       ├── 059_CUI_BONO_Test.md
│       ├── 060_Approval_Gradient_Test.md
│       ├── 071_First_Principles_Analysis.md
│       ├── 072_5_Whys_Deep_Dive.md
│       ├── 079_Operational_Definition.md
│       ├── 080_Inversion.md
│       ├── 087_Falsifiability_Check.md
│       ├── 090_Dependency_Topology_Mapping.md
│       ├── 093_DNA_Inheritance_Check.md
│       ├── 095_Structural_Isomorphism.md
│       ├── 099_Multi_Artifact_Coherence.md
│       ├── 100_Vocabulary_Consistency.md
│       ├── 114_Reversibility_Test.md
│       ├── 152_Socratic_Decomposition_Pre_Analysis.md
│       ├── 154_Definitional_Contradiction_Detector.md
│       ├── 159_Transitive_Dependency_Closure.md
│       └── 160_Transformation_Proof.md       # NEW v3.7
├── steps/                          # Deep-Pulse phases + auxiliary steps
│   ├── step-00-bootstrap.md        # System initialization
│   ├── step-01-sense.md            # SENSE phase
│   ├── step-02-plan.md             # PLAN phase
│   ├── step-03-act.md              # ACT phase
│   ├── step-04-validate.md         # VALIDATE phase
│   ├── step-05-sync.md             # SYNC phase
│   ├── step-06-extend.md           # EXTEND phase (artifact hierarchy) [NEW v3.7]
│   ├── step-audit.md               # Full system audit procedure
│   ├── step-decision-point.md      # Decision point resolution
│   └── step-quick-edit.md          # Quick edit mode (minor changes)
├── agents/                         # Agent manifests
│   ├── pm-agent.yaml               # Project Manager / Orchestrator
│   ├── validator-agent.yaml        # Validator (anti-bias + coherence)
│   └── implementation-agent.yaml   # Implementation (11 methods)
└── processes/                      # LAYER 2: Process Definitions
    ├── _manifest.yaml              # Registry of available processes
    └── _process-template/          # Template for creating new processes
        ├── process.yaml            # Extended with self_extension, fork/join
        ├── transformation-proof.json  # Proof document [NEW v3.7]
        └── templates/
```

### 2.2. Runtime Instance (Layer 3)

```text
/project-root/                      # USER PROJECT
├── .deep-process/                  # RUNTIME KERNEL
│   ├── state.json                  # Graph DB (all artifacts)
│   ├── registry.json               # Instance tracking
│   ├── artifact-hierarchy.json     # Artifact hierarchy within instance [NEW v3.7]
│   ├── config.json                 # User preferences (display mode, language)
│   ├── enforcer.md                 # Copied from framework
│   ├── agents/                     # Copied agent manifests
│   │   ├── pm-agent.yaml
│   │   ├── validator-agent.yaml
│   │   └── implementation-agent.yaml
│   └── backups/                    # Saga rollback storage
│
├── artifacts/                      # USER SPACE
│   └── processes/                  # LAYER 3: Process Instances
│       └── {instance-id}/          # Each process instance
│           ├── instance-state.json # Instance-specific state
│           └── *.md                # Generated artifacts
│
└── .claude/commands/               # CLI INTERFACE (optional)
    ├── deep-process.json
    └── audit.json
```

### 2.3. Self-Extension (Instance Internal Growth) [NEW v3.7]

Self-Extension to mechanizm **rozszerzania instancji o kolejne artefakty wewnątrz niej**, nie tworzenie nowych instancji potomnych. Mechanizm jest **generyczny** — może być użyty dla dowolnych typów artefaktów i dowolnych procesów.

**Kluczowa zasada:**
- Instancja to **kontener na artefakty**
- Gdy tworzymy nowy artefakt, staje się on **częścią** tej samej instancji
- NIE ma hierarchii instancji — jest **hierarchia artefaktów wewnątrz instancji**

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  SELF-EXTENSION = INTERNAL ARTIFACT HIERARCHY (GENERIC)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  artifacts/processes/{instance-id}/         # JEDNA instancja               │
│  ├── instance-state.json                    # Stan całej instancji          │
│  ├── {root-artifact-1}.md                   # Artefakt poziomu 0            │
│  ├── {root-artifact-2}.md                   # Artefakt poziomu 0            │
│  │                                                                          │
│  ├── {child-group-1}/                       # Grupa artefaktów poziomu 1    │
│  │   ├── {child-artifact-1}.md              # Artefakt poziomu 1            │
│  │   ├── {grandchild-1}.md                  # Artefakt poziomu 2            │
│  │   └── {grandchild-2}.md                  # Artefakt poziomu 2            │
│  │                                                                          │
│  └── {child-group-2}/                       # Inna grupa poziomu 1          │
│      └── ...                                                                │
│                                                                             │
│  Hierarchia artefaktów: .deep-process/state.json (edges typu "contains")   │
│  Schema: data/artifact-hierarchy-schema.yaml                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Mechanizm Self-Extension:**
1. Instancja definiuje w `process.yaml` jakie typy artefaktów mogą być tworzone
2. Typy artefaktów są **definiowane przez proces**, nie przez framework
3. Gdy Operator wywołuje metodę "Dodaj [typ]", instancja **rozszerza się** o nowy artefakt
4. Nowy artefakt dziedziczy kontekst z artefaktu rodzica (context inheritance)
5. Wszystko pozostaje **wewnątrz** tej samej instancji

**Agregacja statusu (wewnątrz instancji):**
```text
Instance.status = COMPLETED ⟺ ALL contained artifacts.status = COMMITTED
Instance.progress = weighted_average(artifact_progress by depth_level)
```

**Konfiguracja w process.yaml (przykład — typy artefaktów zależą od procesu):**
```yaml
self_extension:
  enabled: true
  description: "Instance can extend itself with child artifacts"

  # Typy artefaktów które mogą być dodawane do instancji
  # (definiowane przez proces, nie przez framework)
  extensible_artifacts:
    - artifact_type: "{LEVEL_1_TYPE}"        # np. "PHASE", "MODULE", "SECTION"
      depth_level: 1
      can_contain: ["{LEVEL_2_TYPE}"]
      template: "templates/{level1}-template.md"
    - artifact_type: "{LEVEL_2_TYPE}"        # np. "STEP", "COMPONENT", "ITEM"
      depth_level: 2
      can_contain: ["{LEVEL_3_TYPE}"]
      template: "templates/{level2}-template.md"

  # Konfiguracja hierarchii artefaktów
  artifact_hierarchy:
    max_depth: 4                              # Maksymalna głębokość
    depth_labels: ["{L0}", "{L1}", "{L2}", "{L3}"]  # Etykiety poziomów

  # Agregacja
  aggregation:
    strategy: "ALL_ARTIFACTS"
    incomplete_artifact_blocks_parent: true
```

**Przykłady użycia (różne domeny):**
| Domena | L0 | L1 | L2 | L3 |
|--------|----|----|----|----|
| Software | Project | Epic | Story | Task |
| Documentation | Document | Chapter | Section | Paragraph |
| Research | Study | Phase | Experiment | Trial |
| Manufacturing | Product | Assembly | Component | Part |

---

## 3. DATA STRUCTURES (The Logic Layer)

### 3.1. The Universal Contract (YAML Header)
Każdy plik `.md` w `artifacts/` i `processes/` **MUSI** zaczynać się od tego bloku.

**⚠️ CRITICAL: YAML Header = Executable Instructions**

YAML header NIE jest metadanymi dla ludzi — jest **instrukcjami wykonawczymi dla LLM**.
Przed czytaniem treści Markdown, LLM MUSI wykonać **Contract Interpretation Protocol**:

```text
PHASE I:  Context Rehydration    → Load all depends_on, check STALE
PHASE II: Runtime Configuration  → Inject active_methods, evaluate gates
PHASE III: Determinism Enforcement → Lock semantic_hash as constraints
═══════════════════════════════════════════════════════════════════════
ONLY NOW: Read Markdown body
```

Pełny protokół: `src/core/deep-process/data/contract-interpretation-protocol.md`

```yaml
---
dp_id: "EPIC-USER-LOGIN"       # Unique ID
dp_type: "artifact"            # [artifact | process | decision-point]
dp_status: "STALE"             # [NOW | STALE | STALE_DEFERRED | COMMITTED | COMMITTED_PINNED | FAILED | AWAITING_USER_INPUT]
version: "3.7"

# === VERSIONING (NEW v3.7) ===
artifact_version: 3                      # Current version number
version_history:                         # Tracked automatically
  - version: 1
    committed_at: "2025-01-15T10:00:00Z"
    change_summary: "Initial creation"
  - version: 2
    committed_at: "2025-01-20T14:30:00Z"
    change_summary: "Updated auth method"
  - version: 3
    committed_at: "2025-02-01T09:00:00Z"
    change_summary: "Added MFA requirement"

# === TOPOLOGY & LINEAGE ===
context:
  depends_on:
    - path: "artifacts/vision.md"
      type: "semantic_source"       # Changes here invalidate content
      propagation_mode: "IMMEDIATE" # [IMMEDIATE | DEFERRED | VERSION_PINNED | CONDITIONAL]
    - path: "artifacts/security_policy.md"
      type: "hard_constraint"       # Changes here invalidate logic
      propagation_mode: "VERSION_PINNED"  # Ignore changes, use pinned version
      pinned_version: 2                    # Lock to specific version

# === CONVERGENT DETERMINISM ===
# Lista faktów, które muszą pozostać prawdziwe niezależnie od redakcji tekstu.
semantic_hash:
  - "Auth: OAuth2 via Google"
  - "MFA: Required for Admin"
  - "Session: 24h JWT"

# === EXECUTION LOGIC ===
execution:
  active_methods: [154, 114, 87] # Metody wstrzyknięte przez PM-a
  logic_gates:                   # Warunkowe ścieżki wykonania
    if_mobile: "Use artifact/templates/mobile_screen.md"
    if_web: "Use artifact/templates/web_page.md"

# === TRANSACTION ===
transaction:
  saga_id: "tx-9912"
  previous_hash: "a1b2c3d4"
---
```

### 3.1.1. Propagation Modes (NEW v3.7)

Każda zależność (`depends_on`) może mieć określony tryb propagacji zmian:

| Mode | Behavior | Use Case |
|------|----------|----------|
| `IMMEDIATE` | Zmiana rodzica → dziecko natychmiast `STALE` | Aktywny development, spójność krytyczna |
| `DEFERRED` | Zmiana rodzica → dziecko `STALE_DEFERRED` (niski priorytet) | Zależności informacyjne, niski priorytet |
| `VERSION_PINNED` | Zmiana rodzica ignorowana, używana wersja `pinned_version` | Stabilne referencje, opublikowane dokumenty |
| `CONDITIONAL` | Propagacja tylko gdy warunek spełniony | Selektywne aktualizacje, major versions only |

**Nowe statusy:**
*   `STALE_DEFERRED` — wymaga aktualizacji, ale nie jest pilne
*   `COMMITTED_PINNED` — zatwierdzony, ignoruje zmiany rodzica (VERSION_PINNED)

### 3.2. Decision Point Contract (Human-in-the-Loop)
Gdy system napotyka sprzeczność, nie zgaduje. Generuje plik typu `decision-point`.

```yaml
---
dp_id: "DP-005"
dp_type: "decision-point"
dp_status: "AWAITING_USER_INPUT"

question:
  type: "EXCLUSIVE_CHOICE"
  trigger: "Conflict detected via Method #154"
  prompt: "Wizja zakłada 'Szybki MVP', a Architektura 'Mikroserwisy'. To sprzeczne."
  options:
    - id: "A"
      label: "Zmień na Monolit (Zgodność z MVP)"
      impact: "Update artifacts/architecture.md"
    - id: "B"
      label: "Wydłuż czas (Zgodność z Mikroserwisami)"
      impact: "Update artifacts/timeline.md"
---
```

---

## 4. SYSTEM KERNEL (BIOS Definition)

Plik `data/enforcer.md` jest ładowany do każdego kontekstu. Zawiera "Prawa Niezmienne", "Tłumacza Metod" i "Zasady Fizyki".

### 4.0. Law 0: CONTRACT PARSING (Prime Directive)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  YAML HEADER ≠ METADATA FOR HUMANS                                          │
│  YAML HEADER = EXECUTABLE INSTRUCTIONS FOR LLM PROCESSOR                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Before reading ANY Markdown content in an artifact file:                  │
│    1. PARSE YAML header as processor instructions                          │
│    2. EXECUTE Phase I: Load all depends_on (Context Rehydration)           │
│    3. EXECUTE Phase II: Inject active_methods (Runtime Configuration)      │
│    4. EXECUTE Phase III: Lock semantic_hash (Determinism Enforcement)      │
│    5. ONLY THEN read Markdown body                                         │
│                                                                             │
│  Full protocol: data/contract-interpretation-protocol.md                   │
│                                                                             │
│  VIOLATION: Reading Markdown before executing YAML = undefined behavior    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.1. Method Translator (Instrukcje Wykonawcze)
Jak LLM ma rozumieć liczby w `active_methods`:

**Anti-Bias Methods (Mandatory in Validation):**
*   **#56 (Liar's Trap):** "List 3 ways you could be deceiving the Operator. Provide evidence you're NOT doing each."
*   **#59 (CUI BONO Test):** "Who benefits? AGENT benefits = RED FLAG, USER benefits = OK."
*   **#60 (Approval Gradient):** "Rate claims 0-100% (truth vs what user wants). Score > 60% = PEOPLE-PLEASING FLAG."

**Coherence Methods (Mandatory in Validation):**
*   **#93 (DNA Inheritance):** "Does new element inherit system 'genes'? Mutations need justification."
*   **#95 (Structural Isomorphism):** "Compare structure with existing. Delta > 30% needs justification."
*   **#99 (Multi-Artifact Coherence):** "Check reference integrity, naming consistency, interface compatibility."
*   **#100 (Vocabulary Consistency):** "Standardize synonyms, disambiguate homonyms."

**Implementation Methods:**
*   **#71 (First Principles):** "Strip assumptions, rebuild from verified fundamentals."
*   **#72 (5 Whys):** "Drill down to root cause through 5 levels of 'why'."
*   **#79 (Operational Definition):** "Make abstract concepts measurable: 'fast' → '< 200ms p95'."
*   **#80 (Inversion):** "How would I GUARANTEE FAILURE? Then avoid those paths."
*   **#87 (Falsifiability):** "Banned: 'fast', 'good', 'easy' without numbers. Claims must be testable."
*   **#90 (Dependency Topology):** "Map explicit + implicit dependencies. Find ghosts and dead links."
*   **#114 (Reversibility Test):** "Can you reconstruct INPUT from OUTPUT? If not, info was lost."
*   **#152 (Socratic Decomposition):** "Decompose to atomic sub-questions, answer independently, check contradictions."
*   **#154 (Definitional Contradiction):** "Find requirements that are LOGICALLY IMPOSSIBLE by definition."
*   **#159 (Transitive Dependency Closure):** "Build full graph via DFS. Detect cycles, missing nodes, transitive conflicts."

**Migration Methods (NEW v3.7):**
*   **#160 (Transformation Proof):** "Prove that process transformation is lossless. Generate proof document with lossiness_score and reversibility_score. Round-trip test: P → SRE → P' where delta(P, P') < threshold."

### 4.2. Invariant Laws (Prawa Niezmienne)

| Law | Name | Rule |
|-----|------|------|
| **0** | Contract Parsing | YAML header = executable. Execute 3 phases before reading Markdown |
| **1** | Read-Before-Write | Never generate content without reading `.deep-process/state.json` first |
| **2** | Atomic Commit | Response without [UPDATE_STATE] block = ROLLBACK |
| **3** | No Guessing | Contradiction detected → create decision-point, don't resolve |
| **4** | Semantic Hash = Ground Truth | Content must entail all hash facts |
| **5** | Topology Propagation | Node change → propagate based on edge's `propagation_mode` (see 4.4) |
| **6** | Provable Migration | Process transformation requires proof document (Method #160) |

### 4.3. Method Priority Hierarchy

```text
PRIORITY 1: `data/enforcer.md` (BIOS)    → Cannot be overridden
PRIORITY 2: Anti-Bias Methods (#56,59,60) → Always execute in validation
PRIORITY 3: Coherence Methods (#93,95,99,100) → Always execute in validation
PRIORITY 4: Process-specific methods      → From process.yaml
PRIORITY 5: Artifact-specific methods     → From active_methods
PRIORITY 6: Gate-loaded templates         → Lowest priority, cannot override
```

### 4.4. Propagation Modes (Law 5 Extended) [NEW v3.7]

Law 5 (Topology Propagation) działa według trybu zdefiniowanego na każdej krawędzi:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAW 5: TOPOLOGY PROPAGATION (Extended)                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  WHEN node A changes:                                                       │
│    1. Query state.json for all edges where `to = A.dp_id`                  │
│    2. For each edge (B → A):                                               │
│                                                                             │
│       CASE edge.propagation_mode:                                          │
│                                                                             │
│         IMMEDIATE (default):                                                │
│           - Set B.dp_status = STALE                                        │
│           - Add to update queue (high priority)                            │
│                                                                             │
│         DEFERRED:                                                           │
│           - Set B.dp_status = STALE_DEFERRED                               │
│           - Set edge.deferred_since = NOW                                  │
│           - Add to update queue (low priority)                             │
│                                                                             │
│         VERSION_PINNED:                                                     │
│           - Do nothing to B                                                │
│           - B continues using edge.pinned_version                          │
│           - Log: "Change to {A} ignored for {B} (pinned to v{N})"         │
│                                                                             │
│         CONDITIONAL:                                                        │
│           - Evaluate edge.propagation_condition                            │
│           - IF true: treat as IMMEDIATE                                    │
│           - IF false: treat as VERSION_PINNED                              │
│                                                                             │
│    3. Recurse for transitive dependencies (respect propagation modes)      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Przykład warunku (CONDITIONAL):**
```yaml
propagation_condition: "parent.artifact_version.major > child.parent_version.major"
# Propaguj tylko przy zmianie major version
```

---

## 5. THE ORCHESTRATION LOOP (Runtime Protocol)

Algorytm "Deep-Pulse", który steruje cyklem życia projektu.

**FAZA 1: SENSE (Analiza)**
1.  Użytkownik wywołuje `pm` (via CLI Shim).
2.  Agent PM ładuje `.deep-process/state.json`.
3.  Agent skanuje graf pod kątem statusów `STALE` i `BLOCKED`.
4.  Wyświetla Menu: *"Wykryto 3 nieaktualne Epiki. [1] Aktualizuj, [2] Ignoruj"*.

**FAZA 2: PLAN (Metoda #152)**
1.  Użytkownik wybiera "[1] Aktualizuj".
2.  Agent PM analizuje typ zadania i **wstrzykuje metody**:
    *   Zadanie Techniczne -> Wstrzykuje [#87, #114].
    *   Zadanie Kreatywne -> Wstrzykuje [#102, #17].
3.  Agent tworzy pusty plik (szkielet) z nagłówkiem YAML.

**FAZA 3: ACT (Egzekucja)**
1.  Uruchamia się LLM-Executor na nowym pliku.
2.  **Contract Interpretation Protocol:**
    *   Phase I: Load all `depends_on` files (Context Rehydration)
    *   Phase II: Inject `active_methods` via Method Translator (Runtime Config)
    *   Phase III: Lock `semantic_hash` facts as constraints (Determinism)
3.  DOPIERO TERAZ: LLM czyta Markdown body i generuje treść.
4.  LLM generuje/aktualizuje `semantic_hash`.

**FAZA 4: VALIDATE (Convergent Check)**
1.  Uruchamia się LLM-Validator (Sub-Agent).
2.  Sprawdza zgodność: Treść vs Hash vs Rodzice.
3.  Werdykt: `COMMITTED` lub `FAILED`.

**FAZA 5: SYNC (Zapis)**
1.  Operator (Ty) widzisz wynik w terminalu.
2.  Jeśli blok stanu jest poprawny -> Zatwierdzasz (zapis pliku).
3.  Python/CLI aktualizuje `.deep-process/state.json`.

**FAZA 6: EXTEND (opcjonalna) [NEW v3.7]**
1.  Jeśli artefakt ma typ zdefiniowany w `extensible_artifacts` → uruchom extend.
2.  Rozszerz bieżącą instancję o nowy artefakt (np. Epic dodaje Story).
3.  Zaktualizuj `.deep-process/state.json` o nowe węzły i krawędzie.
4.  Przekaż context z artefaktu rodzica do artefaktu dziecka (w tej samej instancji).

### 5.1. Parallel Paths (Fork/Join) [NEW v3.7]

Deep-Process definiuje **strukturalną równoległość** (niezależność), nie runtime równoległość.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  PARALLEL PATHS = STRUCTURAL INDEPENDENCE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  NOT about: Running things at the same wall-clock time                      │
│  IS about:  Declaring that elements have no sequential dependency           │
│                                                                             │
│  FORK:  "After step A, both B and C can proceed independently"             │
│  JOIN:  "Step D requires both B and C to be complete"                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Definicja w process.yaml:**
```yaml
steps:
  - id: "step-01"
    name: "Initial analysis"
    type: "artifact"

  # FORK: Po step-01, obie ścieżki mogą działać niezależnie
  - id: "fork-01"
    type: "fork"
    after: "step-01"
    branches:
      - branch_id: "branch-tech"
        starts_with: "step-02a"
      - branch_id: "branch-business"
        starts_with: "step-02b"

  # Branch A (Technical)
  - id: "step-02a"
    name: "Technical analysis"
    branch: "branch-tech"

  # Branch B (Business)
  - id: "step-02b"
    name: "Business analysis"
    branch: "branch-business"

  # JOIN: Wymaga obu gałęzi
  - id: "join-01"
    type: "join"
    requires_branches: ["branch-tech", "branch-business"]
    join_type: "AND"  # [AND | OR | N_OF_M]
    creates: "step-03"

  - id: "step-03"
    name: "Integrated design"
    depends_on: ["join-01"]
```

**Join Types:**
| Type | Behavior |
|------|----------|
| `AND` | Wszystkie gałęzie muszą być complete |
| `OR` | Którakolwiek gałąź complete |
| `N_OF_M` | N z M gałęzi complete (wymaga `n_required`) |

---

## 6. CLI INTERFACE & UX (Punkty Styku)

System jest obsługiwany przez aliasy w folderze `.claude/commands` lub `.gemini/commands`.

### 6.1. Komenda `deep-process` (Project Manager)
*   **Cel:** Główny dashboard i Launcher Procesów.
*   **Prompt Startowy:** "Działaj jako Orchestrator. Przeczytaj `.deep-process/registry.json`. Wyświetl aktywne procesy."
*   **Dynamiczne Menu:**
    ```text
    ┌─────────────────────────────────────────────────────────────────┐
    │  DEEP-PROCESS v3.7 — Menedżer Projektów                         │
    │  [Faza: PRZEGLĄD] [Aktywny: brak]                               │
    └─────────────────────────────────────────────────────────────────┘

    Aktywne procesy:
      (brak aktywnych procesów - wybierz [N] aby utworzyć nowy)

    Dostępne akcje:
    [N] Nowy proces      - Utwórz nową instancję procesu
    [S] Przełącz         - Zmień aktywny proces
    [U] Aktualizuj       - Odśwież artefakty wymagające aktualizacji
    [E] Szybka edycja    - Drobne poprawki bez pełnej walidacji
    [A] Audyt            - Uruchom pełną weryfikację systemu
    [X] Zmień tryb       - Przełącz tryb wyświetlania (przyjazny/ekspercki)
    [H] Pomoc            - Wyjaśnienie opcji i pojęć
    [Q] Wyjdź            - Zapisz stan i zakończ
    ```
*   **Logika Instancjonowania:**
    Gdy użytkownik wybiera [N], deep-process pyta:
    1.  Jaki proces? (z `.deep-process/processes/`)
    2.  Jaka nazwa wykonania? (np. `sprint-12`)
    3.  **Akcja:** Tworzy folder `artifacts/[PROCES]/[NAZWA]/`, inicjuje tam pusty `instance-state.json` i dodaje wpis do `.deep-process/registry.json`.

### 6.2. Komenda `audit` (Validator)
*   **Cel:** Wymuszona weryfikacja spójności.
*   **Zachowanie:** Przechodzi przez cały graf. Jeśli Hash A != Hash B, zgłasza alarm.
*   **Prompt:** "Działaj jako Validator. Użyj metody #159 (Transitive Closure). Czy graf jest spójny?"
*   **Procedura:** `steps/step-audit.md`

### 6.3. Komenda `quick-edit` (Szybka edycja)
*   **Cel:** Drobne poprawki bez pełnej walidacji.
*   **Kiedy używać:**
    *   ✅ Literówki i błędy pisowni
    *   ✅ Formatowanie tekstu
    *   ✅ Aktualizacja dat/wersji
    *   ❌ NIE dla zmian kluczowych faktów (semantic_hash)
*   **Procedura:** `steps/step-quick-edit.md`

### 6.4. Tryby wyświetlania
System obsługuje dwa tryby wyświetlania informacji:

*   **Tryb przyjazny (domyślny):**
    *   Ukrywa szczegóły techniczne (`saga_id`, `dp_id`)
    *   Polskie nazwy statusów (✅ Gotowy, 🔄 Do aktualizacji)
    *   Nazwy metod zamiast numerów

*   **Tryb ekspercki:**
    *   Pokazuje wszystkie szczegóły techniczne
    *   Surowe statusy (COMMITTED, STALE, BLOCKED)
    *   Numery i nazwy metod

*   **Konfiguracja:** `data/display-modes.yaml`
*   **Preferencje użytkownika:** `.deep-process/config.json`

### 6.5. System pomocy
Każdy ekran zawiera opcję `[H] Pomoc` wyświetlającą kontekstową pomoc.

*   **Struktura pomocy:**
    ```text
    ┌─────────────────────────────────────────────────────────────────┐
    │  POMOC — {Nazwa fazy}                                           │
    └─────────────────────────────────────────────────────────────────┘

    GDZIE JESTEŚ?
      {Opis aktualnego miejsca w systemie}

    CO ROBIĆ?
      {Sugerowane następne kroki}

    NAWIGACJA:
      {Lista dostępnych opcji z wyjaśnieniami}
    ```

*   **Słownik pojęć:**
    | Termin | Znaczenie |
    |--------|-----------|
    | Proces | Zdefiniowany przepływ pracy |
    | Instancja | Konkretne wykonanie procesu |
    | Artefakt | Dokument wygenerowany w procesie |
    | Kluczowe fakty | Lista faktów które muszą być prawdziwe (semantic_hash) |
    | Punkt decyzji | Miejsce wymagające wyboru użytkownika |

*   **Dokumentacja:** `data/help-reference.md`

### 6.6. Obsługa punktów decyzji (Decision Points)
Gdy system wykryje sprzeczność lub potrzebuje wyboru użytkownika:

1.  Tworzy plik `decision-point` z opcjami
2.  Wyświetla menu decyzji:
    ```text
    ⚠️  WYMAGANA DECYZJA

    Wykryto sprzeczność: {opis problemu}

    Dostępne opcje:
    [A] {opcja A} - Wpływ: {opis}
    [B] {opcja B} - Wpływ: {opis}

    [D] Szczegóły - Zobacz pełną analizę
    [Q] Odłóż     - Wróć później
    ```
3.  Po wyborze użytkownika aktualizuje powiązane artefakty

*   **Procedura:** `steps/step-decision-point.md`
*   **Schema:** `data/decision-point-schema.yaml`

---

## 7. BOOTSTRAP PROTOCOL (Jak zacząć)

Aby zainicjować system w nowym katalogu, wyślij do modelu poniższy prompt. To jest "Iskra", która podpala silnik.

**SYSTEM BOOTSTRAP PROMPT:**
```text
Zatrzymaj tryb konwersacyjny. Inicjalizuję Deep-Process v3.7 - Semantic Reality Engine.

TWOJE DYREKTYWY (BIOS):
0. YAML header = instrukcje wykonawcze. Przed czytaniem Markdown, wczytaj i wykonaj `data/contract-interpretation-protocol.md` (3 fazy).
1. Jesteś Systemem Operacyjnym plików Markdown. Twoja pamięć to `.deep-process/state.json`.
2. Każdy plik, który wygenerujesz, MUSI mieć nagłówek YAML zgodny ze Specyfikacją v3.7.
3. Twoim priorytetem jest DETERMINIZM SEMANTYCZNY. Używaj `semantic_hash` do weryfikacji swojej pracy.
4. Jeśli wykryjesz sprzeczność (Metoda #154 - `data/method-procedures/154_Definitional_Contradiction_Detector.md`), nie zgaduj. Stwórz plik `decision-point` i pytaj Operatora.

ZADANIE STARTOWE:
1. Zmapuj obecną strukturę plików.
2. Utwórz folder `.deep-process/` i pusty `.deep-process/state.json`.
3. Skopiuj `data/enforcer.md` do `.deep-process/enforcer.md`.
4. Zgłoś gotowość wyświetlając Menu Główne deep-process.
```

---

## 8. UNIVERSAL MIGRATION PROTOCOL (The SRE Transformer)

Mechanizm importu procesów zewnętrznych (Legacy/Mental/External) do standardu SRE-Convergent.

### 8.1. Algorytm Transformacji (The Pipeline)

**KROK 1: Dekompozycja Zasad (Method #71 & #72)**
*   **Cel:** Oddzielenie "rytuałów" od "funkcji".
*   **Metody:** First Principles (#71) + 5 Whys (#72)
*   **Akcja:** LLM analizuje opis procesu źródłowego i wyodrębnia łańcuch przyczynowo-skutkowy.
*   **Prompt:** "Zignoruj nazwy spotkań i ról. Wypisz listę transformacji danych: Co wchodzi? Co wychodzi? Jaki jest warunek sukcesu?"

**KROK 2: Izomorfizm Strukturalny (Method #95)**
*   **Cel:** Mapowanie obiektów obcych na kontenery SRE.
*   **Tabela Mapowania:**
    | Element źródłowy | Typ SRE |
    |------------------|---------|
    | Dokument/E-mail | `dp_type: artifact` |
    | Decyzja/Spotkanie | `dp_type: decision-point` |
    | Procedura/Instrukcja | `dp_type: process` |
    | Rola/Osoba | `dp_type: agent` |

**KROK 3: Wykrywanie Punktów Styku (Method #90)**
*   **Cel:** Identyfikacja, gdzie System musi się zatrzymać.
*   **Metoda:** Dependency Topology (#90)
*   **Analiza:** Każdy moment w oryginale, który wymaga "zatwierdzenia", "opinii" lub "wyboru", jest konwertowany na `Decision Point Contract` z wymuszoną pauzą `AWAITING_USER_INPUT`.

**KROK 4: Generowanie Kontraktów (Method #79)**
*   **Cel:** Operacjonalizacja.
*   **Metoda:** Operational Definition (#79)
*   **Akcja:** Dla każdego wyodrębnionego kroku, system generuje plik `.md` z nagłówkiem YAML, definiując `input`, `output` i `active_methods`.

**KROK 5: Weryfikacja Wierności (Method #100 & #114)**
*   **Test Spójności (#100):** Vocabulary Consistency - czy terminologia jest spójna?
*   **Test Odwracalności (#114):** Symulacja: "Mając tylko te nowe pliki SRE, odtwórz opis oryginalnego procesu". Jeśli opis różni się od oryginału -> BŁĄD TRANSFORMACJI.

### 8.2. Metody używane w migracji

Pełna lista metod transformacji (z `processes/_manifest.yaml`):

| # | Metoda | Cel w migracji |
|---|--------|----------------|
| 71 | First Principles Analysis | Dekompozycja do fundamentów |
| 72 | 5 Whys Deep Dive | Dotarcie do root cause |
| 79 | Operational Definition | Operacjonalizacja kroków |
| 90 | Dependency Topology Mapping | Mapa zależności |
| 95 | Structural Isomorphism | Mapowanie struktur |
| 100 | Vocabulary Consistency | Spójność terminologii |
| 114 | Reversibility Test | Test odwracalności |
| 159 | Transitive Dependency Closure | Pełny graf zależności |

### 8.3. Obsługa Plików i Rejestracja

Proces migracji tworzy nową **Klasę Procesu**, która dziedziczy po Meta-Klasie Deep-Process.

1.  **Nowa Klasa Procesu (Definicja):**
    *   System generuje folder: `src/core/deep-process/processes/[NAZWA_PROCESU]/`
    *   Tworzy `process.yaml` z krokami, bramkami i artefaktami
    *   W sekcji `inherits` wskazuje na `deep-process` v3.7

2.  **Rejestracja:**
    *   Nowy proces jest dodawany do `processes/_manifest.yaml`
    *   Od tej pory można go instancjonować komendą `[N] Nowy proces`

3.  **Struktura wymaganego folderu:**
    ```text
    processes/{nazwa-procesu}/
    ├── process.yaml            # Definicja procesu
    ├── transformation-proof.json  # Dowód transformacji [NEW v3.7]
    └── templates/              # Szablony artefaktów
        └── *.md
    ```

### 8.4. Transformation Proof (Dowód Transformacji) [NEW v3.7]

**Każda migracja MUSI generować dokument dowodowy** zgodnie z Pillar 6 i Law 6.

#### 8.4.1. Universal Process Schema (UPS)

Przed transformacją, proces źródłowy jest parsowany do **Universal Process Schema** — formalnej reprezentacji dowolnego procesu:

```yaml
# Universal Process Schema (UPS)
ups_id: "source-onboarding-v1"
source_system: "BPMN"  # lub: "Confluence", "Jira", "manual", "email"
elements:
  - ups_id: "ups-001"
    ups_type: "task"           # task | document | decision | gateway | role | event
    content:
      name: "Review application"
      description: "..."
    dp_mapping_hint: "artifact"  # Suggested Deep-Process mapping
    unmappable_properties: []    # Properties that cannot be mapped

flows:
  - from: "ups-001"
    to: "ups-002"
    type: "sequence"
```

#### 8.4.2. Transformation Proof Document

Po transformacji, system generuje `transformation-proof.json`:

```json
{
  "proof_version": "1.0",
  "generated_at": "2026-02-04T10:00:00Z",
  "method_used": "#160 (Transformation Proof)",

  "source_process": {
    "ups_id": "source-onboarding-v1",
    "source_system": "BPMN",
    "element_count": 15,
    "flow_count": 18
  },

  "target_process": {
    "proc_id": "PROC-ONBOARDING",
    "artifact_count": 12,
    "edge_count": 14
  },

  "element_mapping": [
    {
      "source_ups_id": "ups-001",
      "target_dp_id": "ARTIFACT-REVIEW-001",
      "mapping_type": "direct",
      "notes": "Task → Artifact (1:1)"
    },
    {
      "source_ups_id": "ups-005",
      "target_dp_id": null,
      "mapping_type": "unmapped",
      "notes": "Notification event has no DP equivalent"
    }
  ],

  "lossiness_report": {
    "total_source_elements": 15,
    "mapped_elements": 12,
    "unmapped_elements": 3,
    "lossiness_score": 0.08,
    "lossiness_formula": "(unmapped + semantic_loss) / total",
    "semantic_losses": [
      {
        "element": "ups-005",
        "lost_property": "email_notification_trigger",
        "severity": "info",
        "mitigation": "Document in process notes"
      }
    ],
    "verdict": "PROVEN_ACCEPTABLE"
  },

  "reversibility_test": {
    "executed": true,
    "executed_at": "2026-02-04T10:05:00Z",
    "reverse_transformation": {
      "attempted": true,
      "result_ups_id": "reverse-onboarding-v1",
      "structural_delta": 0.05,
      "semantic_delta": 0.03,
      "missing_elements": ["ups-005"],
      "added_elements": []
    },
    "reversibility_score": 0.92,
    "verdict": "MOSTLY_REVERSIBLE"
  },

  "final_verdict": "PROVEN_ACCEPTABLE",
  "proof_signature": "sha256:a1b2c3d4..."
}
```

#### 8.4.3. Verdict Definitions

| Lossiness | Reversibility | Verdict |
|-----------|---------------|---------|
| L = 0 | R = 1 | `PROVEN_LOSSLESS` |
| L < 0.1 | R > 0.9 | `PROVEN_ACCEPTABLE` |
| L < 0.3 | R > 0.7 | `DOCUMENTED_LOSSES` |
| else | else | `TRANSFORMATION_FAILED` |

**Uwaga:** `TRANSFORMATION_FAILED` wymaga interwencji człowieka i decyzji czy kontynuować mimo strat.

---

## 9. KNOWN LIMITATIONS & MITIGATIONS

### 9.1. Context Window
*   **Problem:** Przy dużych grafach `.deep-process/state.json` może spuchnąć.
*   **Mitigacja:** Dzielenie stanu na `.deep-process/active_state.json` (bieżący sprint) i `.deep-process/archive_state.json`.

### 9.2. LLM Drift
*   **Problem:** Model może "zapomnieć" o rygorze YAML w długiej konwersacji.
*   **Mitigacja:** Każda nowa komenda CLI to "świeża" sesja z załadowanym BIOSem (Stateless Execution).

### 9.3. Parallel Execution [NEW v3.7]
*   **Ważne:** Deep-Process definiuje **strukturalną równoległość** (niezależność sekwencyjną), nie runtime równoległość.
*   Fork/Join gates deklarują, że ścieżki nie mają zależności sekwencyjnej.
*   Faktyczna kolejność wykonania zależy od LLM/Operatora.
*   **Ograniczenie:** Przy `isolation_level: COOPERATIVE` możliwe konflikty na współdzielonych artefaktach.
*   **Mitigacja:** Użyj `conflict_resolution: MANUAL` dla krytycznych artefaktów.

### 9.4. Self-Extension Depth [NEW v3.7]
*   Głębokość hierarchii artefaktów jest ograniczona przez `self_extension.artifact_hierarchy.max_depth`.
*   **Domyślnie:** 4 poziomy (Project → Epic → Story → Task).
*   Przekroczenie głębokości generuje ostrzeżenie i wymaga explicit override.
*   **Ograniczenie:** Głębokie hierarchie artefaktów wewnątrz instancji mogą być trudne do zarządzania.

### 9.5. Version Pinning Trade-offs [NEW v3.7]
*   `VERSION_PINNED` edges tworzą "zamrożone" zależności.
*   **Trade-off:** Spójność vs. aktualność.
*   Artefakty z VERSION_PINNED mogą być nieaktualne względem rodzica.
*   **Mitigacja:** Komenda `audit` ostrzega o pinned artefaktach starszych niż konfigurowalny próg.

### 9.6. Transformation Proof Completeness [NEW v3.7]
*   Universal Process Schema (UPS) może nie pokrywać wszystkich typów procesów.
*   **Ograniczenie:** Procesy z bardzo specyficznymi elementami (np. custom BPMN extensions) mogą mieć `unmapped` elementy.
*   **Mitigacja:** Dokument `transformation-proof.json` zawsze listuje wszystkie straty; Operator decyduje o akceptacji.

### 9.7. Artifact Hierarchy Consistency [NEW v3.7]
*   Hierarchia artefaktów w `.deep-process/state.json` musi być spójna z plikami w `artifacts/`.
*   **Ograniczenie:** Manual edycja plików może powodować niespójności w relacjach parent-child artefaktów.
*   **Mitigacja:** Komenda `audit` sprawdza spójność hierarchii artefaktów wewnątrz instancji.

---

## 10. SCHEMA INVENTORY [NEW v3.7]

Pełna lista schematów definiujących struktury danych Deep-Process:

| Schema | Location | Purpose | Status |
|--------|----------|---------|--------|
| `state-schema.yaml` | `data/` | Graph DB structure (nodes, edges, transactions) | Existing, extended |
| `registry-schema.yaml` | `data/` | Instance tracking | Existing, extended |
| `contract-schema.yaml` | `data/` | YAML header format | Existing, extended |
| `decision-point-schema.yaml` | `data/` | Human-in-the-loop | Existing |
| `method-translator.yaml` | `data/` | Method definitions | Existing, +#160 |
| `universal-process-schema.yaml` | `data/` | Source process format (UPS) | **NEW v3.7** |
| `transformation-proof-schema.yaml` | `data/` | Migration proof document | **NEW v3.7** |
| `artifact-hierarchy-schema.yaml` | `data/` | Artifact hierarchy within instance | **NEW v3.7** |
| `fork-join-schema.yaml` | `data/` | Parallel path definitions | **NEW v3.7** |

### 10.1. Extended Schemas (v3.7)

Istniejące schematy zostały rozszerzone o:

**state-schema.yaml:**
- `node.version_history` — historia wersji artefaktu
- `node.current_version` — numer aktualnej wersji
- `edge.propagation_mode` — tryb propagacji zmian
- `edge.pinned_version` — dla VERSION_PINNED
- `fork` i `join` definitions — równoległe ścieżki

**registry-schema.yaml:**
- `instance.artifact_count` — liczba artefaktów w instancji
- `instance.artifact_depth_max` — maksymalna głębokość hierarchii artefaktów
- `instance.root_artifacts` — lista artefaktów korzeniowych (depth=0)
- `instance.isolation_level` — FULL/SHARED/COOPERATIVE
- `active_instances` (array) zamiast `active_instance` (string)

**contract-schema.yaml:**
- `artifact_version` — numer wersji
- `version_history` — automatyczna historia
- `depends_on[].propagation_mode` — tryb propagacji
- `depends_on[].pinned_version` — dla VERSION_PINNED

---

## 11. VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| **3.7.0** | **2026-02-04** | **Major update:** Added Pillar 6 (Provable Transformation), Law 6 (Provable Migration), Method #160 (Transformation Proof), Artifact Hierarchy (Self-Extension), Propagation Modes (IMMEDIATE/DEFERRED/VERSION_PINNED/CONDITIONAL), Parallel Paths (Fork/Join), Version History tracking, Universal Process Schema (UPS), 4 new schemas, extended Known Limitations. See RFC-001 for full rationale. |
| 3.6.1 | 2026-02-04 | Synchronizacja specyfikacji z kodem: dodano brakujące pliki (display-modes, help-reference, step-audit, step-quick-edit, step-decision-point), usunięto nieistniejące elementy (Method #108, fix command, przykładowe procesy), poprawiono ścieżki i przykłady |
| 3.6.0 | 2026-02-03 | Initial release |