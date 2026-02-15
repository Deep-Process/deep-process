# Deep-Process v3.6 — Semantic Reality Engine (SRE-Convergent)

## CORE PHILOSOPHY

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS = SEMANTIC OS + TRANSACTIONAL DETERMINISM + HUMAN ANCHOR     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  System nie jest chatbotem. Jest Semantycznym Systemem Operacyjnym,        │
│  który wymusza determinizm na probabilistycznym silniku (LLM)              │
│  poprzez 5 nienaruszalnych Filarów.                                        │
│                                                                             │
│  INPUT:  Projekt, wymagania, procesy zewnętrzne                            │
│  OUTPUT: Graf artefaktów ze spójnością semantyczną                         │
│                                                                             │
│  EXECUTION: LLM CLI (Claude, Gemini, Native Shell)                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## THREE-LAYER ARCHITECTURE

System operuje w trzech warstwach dziedziczenia:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 1: META-CLASS (Deep-Process Framework)                              │
│  Location: src/core/deep-process/                                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • workflow.md          — JAK wykonywać procesy                     │   │
│  │  • data/enforcer.md     — BIOS, Method Translator                   │   │
│  │  • data/method-procedures/ — 17 metod weryfikacji                   │   │
│  │  • agents/              — PM, Validator, Implementation Agent       │   │
│  │  • steps/               — Deep-Pulse loop (SENSE→PLAN→ACT→...)     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    ↓ inherits                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 2: PROCESS CLASSES (SRE-Convergent Process Definitions)             │
│  Location: src/core/deep-process/processes/                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • _manifest.yaml       — Registry of available processes           │   │
│  │  • onboarding/          — Process "Onboarding" definition           │   │
│  │  • code-review/         — Process "Code Review" definition          │   │
│  │  • sprint-planning/     — Process "Sprint Planning" definition      │   │
│  │  • ...                  — More transformed processes                │   │
│  │                                                                     │   │
│  │  Each process:                                                      │   │
│  │    ├── process.yaml     — Steps, gates, methods, artifacts          │   │
│  │    └── templates/       — Artifact templates for this process       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    ↓ instantiates                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 3: PROCESS INSTANCES (Runtime Executions)                           │
│  Location: artifacts/processes/{instance-id}/                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Tracked in: .deep-process/registry.json                            │   │
│  │                                                                     │   │
│  │  artifacts/processes/                                               │   │
│  │    ├── onboarding-client-acme-001/    — Instance 1 of Onboarding   │   │
│  │    │     ├── instance-state.json                                   │   │
│  │    │     └── *.md (generated artifacts)                            │   │
│  │    ├── onboarding-client-beta-002/    — Instance 2 of Onboarding   │   │
│  │    └── code-review-feature-auth-001/  — Instance of Code Review    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Contains | Responsibility |
|-------|----------|----------------|
| **Meta-Class** | Framework | HOW to execute (methods, validation, orchestration) |
| **Process Class** | Definitions | WHAT to execute (steps, artifacts, gates) |
| **Instance** | Artifacts | EXECUTION results (generated files, decisions) |

### Instance Tracking

All running/completed instances are tracked in `.deep-process/registry.json`:

```json
{
  "active_instance": "onboarding-client-acme-001",
  "instances": [
    {
      "instance_id": "onboarding-client-acme-001",
      "process_type": "PROC-ONBOARDING",
      "process_path": "processes/onboarding/",
      "artifacts_path": "artifacts/processes/onboarding-client-acme-001/",
      "status": "RUNNING",
      "progress": { "current_step": "step-03", "percentage": 40 }
    }
  ]
}
```

This enables:
- **Resume:** Return to paused process instance
- **Switch:** Change between active instances
- **Audit:** Review all instances of a process type

---

## THE 5 PILLARS OF ARCHITECTURE

### Pillar 1: Transactional Processes (Saga Pattern)
- Każda operacja zapisu jest transakcją
- Brak `[UPDATE_STATE]` w odpowiedzi = `ROLLBACK`
- Stan "pomiędzy" jest niedopuszczalny

### Pillar 2: Structured Rails (Schema Enforcement)
- LLM nie "pisze" dokumentów; LLM "wypełnia" schematy
- Walidacja następuje *przed* zapisem (Pre-commit via Validator Sub-Agent)

### Pillar 3: Topology Awareness (Change Coupling)
- System mapuje zależności (`depends_on`)
- Zmiana w węźle A automatycznie flaguje węzły zależne jako `STALE`

### Pillar 4: Semantic Lineage (Traceability)
- Każdy artefakt posiada wskaźnik `source_id`
- Pełna droga od Tasku przez Epik aż do Wizji

### Pillar 5: Convergent Determinism (Method #108)
- Determinizm semantyczny (zgodność faktów) zamiast identyczności znaków
- `semantic_hash` w każdym artefakcie + weryfikacja przez Operatora

---

## METHOD ARCHITECTURE

### Anti-Bias Methods (Wymuszenie Obiektywności)

| # | Method | Purpose | File |
|---|--------|---------|------|
| 56 | Liar's Trap | Wymuś samoobserwację potencjalnych dróg oszustwa | `data/method-procedures/056_Liars_Trap.md` |
| 59 | CUI BONO Test | Kto korzysta z decyzji? Agent vs User | `data/method-procedures/059_CUI_BONO_Test.md` |
| 60 | Approval Gradient Test | Wykryj people-pleasing vs truth-telling | `data/method-procedures/060_Approval_Gradient_Test.md` |

### Coherence Methods (Spójność Wyniku)

| # | Method | Purpose | File |
|---|--------|---------|------|
| 93 | DNA Inheritance Check | Czy element dziedziczy "geny" systemu? | `data/method-procedures/093_DNA_Inheritance_Check.md` |
| 95 | Structural Isomorphism | Porównanie struktury nowego vs istniejącego | `data/method-procedures/095_Structural_Isomorphism.md` |
| 99 | Multi-Artifact Coherence | Spójność między powiązanymi artefaktami | `data/method-procedures/099_Multi_Artifact_Coherence.md` |
| 100 | Vocabulary Consistency | Spójność terminologii w całym systemie | `data/method-procedures/100_Vocabulary_Consistency.md` |

### Implementation Methods (Dla Implementation Agenta)

| # | Method | Purpose | File |
|---|--------|---------|------|
| 71 | First Principles Analysis | Fundamentalna analiza od podstaw | `data/method-procedures/071_First_Principles_Analysis.md` |
| 72 | 5 Whys Deep Dive | Dotarcie do root cause | `data/method-procedures/072_5_Whys_Deep_Dive.md` |
| 79 | Operational Definition | Operacjonalizacja abstrakcyjnych pojęć | `data/method-procedures/079_Operational_Definition.md` |
| 80 | Inversion | Jak zagwarantować porażkę? Unikaj tego | `data/method-procedures/080_Inversion.md` |
| 87 | Falsifiability Check | Czy twierdzenia są mierzalne i testowalne? | `data/method-procedures/087_Falsifiability_Check.md` |
| 90 | Dependency Topology Mapping | Mapowanie ukrytych zależności | `data/method-procedures/090_Dependency_Topology_Mapping.md` |
| 114 | Reversibility Test | Czy można odtworzyć input z output? | `data/method-procedures/114_Reversibility_Test.md` |
| 152 | Socratic Decomposition | Dekompozycja na atomowe pod-pytania | `data/method-procedures/152_Socratic_Decomposition_Pre_Analysis.md` |
| 154 | Definitional Contradiction | Wykrywanie sprzeczności definicyjnych | `data/method-procedures/154_Definitional_Contradiction_Detector.md` |
| 159 | Transitive Dependency Closure | Pełny graf zależności z cyklami | `data/method-procedures/159_Transitive_Dependency_Closure.md` |

---

## THE ORCHESTRATION LOOP (Deep-Pulse) / PĘTLA ORKIESTRACJI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ALGORYTM DEEP-PULSE (Cykl pracy)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FAZA 1: PRZEGLĄD (SENSE) ──────────────────────────────────────────────►  │
│    └── Load `.deep-process/state.json` → Scan for STALE/BLOCKED → Menu     │
│                                                                             │
│  FAZA 2: PLANOWANIE (PLAN) ─────────────────────────────────────────────►  │
│    └── Analyze task type → Inject methods → Create skeleton with YAML      │
│                                                                             │
│  FAZA 3: TWORZENIE (ACT) ───────────────────────────────────────────────►  │
│    └── Load `data/enforcer.md` → Generate content + semantic_hash          │
│                                                                             │
│  FAZA 4: SPRAWDZANIE (VALIDATE) ────────────────────────────────────────►  │
│    └── Load `agents/validator-agent.yaml` → Check → COMMITTED/FAILED       │
│                                                                             │
│  FAZA 5: ZAPISYWANIE (SYNC) ────────────────────────────────────────────►  │
│    └── Operator approval → Write files → Update `.deep-process/state.json` │
│                                                                             │
│  [Q] WYJDŹ ─────────────────────────────────────────────────────────────►  │
│    └── Save state → Release locks → Return to Project Manager              │
└─────────────────────────────────────────────────────────────────────────────┘

NAWIGACJA MIĘDZY FAZAMI:
┌─────────┐     ┌───────────┐     ┌──────────┐     ┌────────────┐     ┌───────────┐
│ PRZEGLĄD│────►│PLANOWANIE │────►│ TWORZENIE│────►│SPRAWDZANIE │────►│ZAPISYWANIE│
└────┬────┘     └─────┬─────┘     └────┬─────┘     └──────┬─────┘     └─────┬─────┘
     │                │                │                  │                 │
     │ [Q] Wyjdź      │ [N] Wróć       │ [konflikt]       │ [P] Popraw      │ ✅
     ▼                ▼                ▼                  ▼                 ▼
  KONIEC         PRZEGLĄD          DECYZJA           TWORZENIE         PRZEGLĄD
```

---

## QUICK EXECUTION PATH

**AUTO-BOOTSTRAP RULE:**
If `.deep-process/` directory is missing → STOP reading. EXECUTE "BOOTSTRAP PROTOCOL" IMMEDIATELY.

**Standard orchestration sequence:**

```
📂 Loading data/state-schema.yaml

1. BOOTSTRAP / PROJECT MANAGER (Launcher)
   □ Initialize/Load `.deep-process/` structure
   □ Display Project Manager Menu ([N]ew, [M]igrate, [R]esume)
   □ Operator selects Instance → Load Context

2. SENSE PHASE (Deep-Pulse Loop Start)
   📂 Loading .deep-process/state.json
   □ Scan graph for STALE and BLOCKED nodes
   □ Build dependency topology
   □ Present status menu to Operator (include [Q]uit option)

3. PLAN PHASE
   □ Operator selects action
   □ PM Agent analyzes task type:
     → Technical Task: Inject [#87, #114, #154]
     → Creative Task: Inject [#71, #79, #152]
     → Migration Task: Inject [#90, #159, #100]
   □ Create skeleton file with YAML header

4. ACT PHASE
   📂 Loading data/enforcer.md (BIOS)
   □ LLM-Executor receives skeleton
   □ Method Translator enforces work style
   □ Generate content adhering to constraints
   □ Compute semantic_hash

5. VALIDATE PHASE
   📂 Loading agents/validator-agent.yaml
   □ Anti-Bias Check: Execute #56, #59, #60
   □ Coherence Check: Execute #93, #95, #99, #100
   □ Hash Verification: Content vs Hash vs Parents
   □ Verdict: COMMITTED or FAILED

6. SYNC PHASE
   □ Display result to Operator
   □ If valid → Operator approves
   □ Write file + Update `.deep-process/state.json`
   □ Flag dependent nodes as STALE

```

---

## FILESYSTEM ARCHITECTURE

### Framework Definition (src/core/deep-process/)

```
src/core/deep-process/              # LAYER 1: META-CLASS (Framework)
├── workflow.md                     # Main documentation
├── data/
│   ├── enforcer.md                 # BIOS: Method Translator & Invariants
│   ├── state-schema.yaml           # Schema for state.json
│   ├── registry-schema.yaml        # Schema for registry.json
│   ├── contract-schema.yaml        # Universal Contract schema
│   ├── decision-point-schema.yaml  # Decision Point schema
│   ├── method-translator.yaml      # Method definitions
│   ├── method-procedures/          # 17 method procedures
│   └── templates/                  # Universal templates
├── steps/                          # Deep-Pulse phases
│   ├── step-00-bootstrap.md
│   ├── step-01-sense.md
│   ├── step-02-plan.md
│   ├── step-03-act.md
│   ├── step-04-validate.md
│   └── step-05-sync.md
├── agents/                         # Agent manifests
│   ├── pm-agent.yaml
│   ├── validator-agent.yaml
│   └── implementation-agent.yaml
└── processes/                      # LAYER 2: PROCESS DEFINITIONS
    ├── _manifest.yaml              # Registry of SRE-Convergent processes
    ├── _process-template/          # Template for new processes
    │   ├── process.yaml
    │   └── templates/
    └── [process-name]/             # Each transformed process
        ├── process.yaml            # Process definition
        └── templates/              # Process-specific templates
```

### Runtime Instance (project-root)

```
/project-root/                      # USER PROJECT
├── .deep-process/                  # RUNTIME KERNEL
│   ├── state.json                  # Graph DB (all artifacts)
│   ├── registry.json               # Instance tracking
│   ├── enforcer.md                 # Copied from framework
│   └── backups/                    # Saga rollback storage
│
├── artifacts/                      # USER SPACE (Output)
│   ├── vision.md                   # Project-level artifacts
│   ├── architecture.md
│   └── processes/                  # LAYER 3: PROCESS INSTANCES
│       ├── onboarding-client-acme-001/
│       │   ├── instance-state.json # Instance-specific state
│       │   └── *.md                # Generated artifacts
│       ├── onboarding-client-beta-002/
│       └── code-review-feature-auth-001/
│
└── .claude/commands/               # CLI shims
    ├── deep-process.json
    └── audit.json
```

### Relationship Between Layers

```
┌───────────────────────────────────────────────────────────────────────┐
│ FRAMEWORK (src/core/deep-process/)                                    │
│   defines HOW                                                         │
│   └── processes/ contains WHAT (process definitions)                  │
│         └── Each definition can have multiple INSTANCES in runtime    │
│               └── artifacts/processes/{instance-id}/                  │
└───────────────────────────────────────────────────────────────────────┘

`.deep-process/registry.json` tracks:
  - Which instances exist
  - Where their artifacts are stored
  - Current status and progress
  - How to resume each instance
```

---

## UNIVERSAL CONTRACT (YAML Header)

Every artifact MUST start with this header.

**CRITICAL:** YAML header is NOT metadata — it is EXECUTABLE INSTRUCTIONS.
Before reading Markdown content, LLM must load and execute `data/contract-interpretation-protocol.md`.

```yaml
---
dp_id: "EPIC-USER-LOGIN"       # Unique ID
dp_type: "artifact"            # [artifact | process | decision-point]
dp_status: "STALE"             # [NOW | STALE | COMMITTED | FAILED | AWAITING_USER_INPUT]
version: "3.6"

# === TOPOLOGY & LINEAGE ===
context:
  depends_on:
    - path: "artifacts/vision.md"
      type: "semantic_source"  # Changes invalidate content
    - path: "artifacts/security_policy.md"
      type: "hard_constraint"  # Changes invalidate logic

# === CONVERGENT DETERMINISM ===
semantic_hash:
  - "Auth: OAuth2 via Google"
  - "MFA: Required for Admin"
  - "Session: 24h JWT"

# === EXECUTION LOGIC ===
execution:
  active_methods: [154, 114, 87]
  logic_gates:
    if_mobile: "Use artifacts/templates/mobile_screen.md"
    if_web: "Use artifacts/templates/web_page.md"

# === TRANSACTION ===
transaction:
  saga_id: "tx-9912"
  previous_hash: "a1b2c3d4"
---
```

---

## DECISION POINT CONTRACT / KONTRAKT PUNKTU DECYZJI

When system encounters contradiction, it generates a decision-point.
Gdy system wykryje sprzeczność, generuje punkt decyzji:

```yaml
---
dp_id: "DP-005"
dp_type: "decision-point"
dp_status: "AWAITING_USER_INPUT"

question:
  type: "EXCLUSIVE_CHOICE"
  trigger: "Wykryto konflikt metodą #154 (Detektor sprzeczności)"
  prompt: "Wizja zakłada 'Szybki MVP', a Architektura 'Mikroserwisy'. To sprzeczne."
  options:
    - id: "A"
      label: "Zmień na Monolit (Zgodność z MVP)"
      impact: "Zaktualizuj artifacts/architecture.md"
    - id: "B"
      label: "Wydłuż czas (Zgodność z Mikroserwisami)"
      impact: "Zaktualizuj artifacts/timeline.md"
---
```

### Decision Point Display / Wyświetlanie punktu decyzji

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: DECYZJA] [Punkt: DP-005]                                │
└─────────────────────────────────────────────────────────────────┘

⚠️  WYMAGANA DECYZJA

Wykryto sprzeczność: Wizja zakłada 'Szybki MVP', a Architektura
zakłada 'Mikroserwisy'. Te założenia są wzajemnie wykluczające.

Dostępne opcje:

[A] Zmień na Monolit
    Architektura zostanie uproszczona do monolitu.
    Wpływ: Zaktualizuje artifacts/architecture.md

[B] Wydłuż czas projektu
    Zachowaj mikroserwisy, ale dostosuj harmonogram.
    Wpływ: Zaktualizuje artifacts/timeline.md

Dostępne akcje:
[A] lub [B]   - Wybierz opcję
[D] Szczegóły - Zobacz pełną analizę konfliktu
[H] Pomoc     - Wyjaśnienie punktów decyzji
[Q] Odłóż     - Wróć do przeglądu (decyzja pozostanie do rozwiązania)

Wpisz wybór:
```

---

## CLI COMMANDS / POLECENIA CLI

### `deep-process` (Menedżer Projektów)
- **Cel:** Główny pulpit i uruchamianie procesów
- **Działanie:** Załaduj `.deep-process/registry.json`, wyświetl aktywne procesy, oferuj akcje

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6 — Menedżer Projektów                         │
│  [Faza: PRZEGLĄD] [Aktywny: feature-login]                      │
└─────────────────────────────────────────────────────────────────┘

Aktywne procesy:
  [1] PROC-MIGRATION (legacy-import-v1)
      Status: Zablokowany | Postęp: 30%
  [2] PROC-DEV (feature-login)
      Status: W trakcie | Postęp: 65%

Dostępne akcje:
[N] Nowy proces      - Utwórz nową instancję procesu
[S] Przełącz         - Zmień aktywny proces
[U] Aktualizuj       - Odśwież artefakty wymagające aktualizacji
[A] Audyt            - Uruchom pełną weryfikację systemu
[H] Pomoc            - Wyjaśnienie opcji i pojęć
[Q] Wyjdź            - Zapisz stan i zakończ

Wpisz polecenie:
```

### `audit` (Weryfikator)
- **Cel:** Wymuś weryfikację spójności
- **Działanie:** Przejdź cały graf, sprawdź wszystkie hashe

### `fix` (Auto-naprawa)
- **Cel:** Szybka naprawa drobnych błędów
- **Działanie:** Automatycznie regeneruj STALE pliki z rodziców

---

## QUICK EDIT MODE / TRYB SZYBKIEJ EDYCJI

Dla drobnych poprawek bez pełnej pętli 5 faz.

### Kiedy używać Quick Edit:
- ✅ Literówki i błędy pisowni
- ✅ Formatowanie tekstu
- ✅ Drobne poprawki stylistyczne
- ✅ Aktualizacja dat/wersji

### Kiedy NIE używać Quick Edit:
- ❌ Zmiany kluczowych faktów (semantic_hash)
- ❌ Nowe sekcje lub znaczące treści
- ❌ Zmiany wpływające na inne dokumenty

### Dostęp:
```
[E] Szybka edycja   - Drobne poprawki bez pełnej walidacji
```

### Przepływ Quick Edit:
```
PRZEGLĄD → [E] → Wybór artefaktu → Edycja → Mini-walidacja → Szybki zapis → PRZEGLĄD
```

Szczegóły: `steps/step-quick-edit.md`

---

## DISPLAY MODES / TRYBY WYŚWIETLANIA

System obsługuje trzy tryby wyświetlania informacji:

### Tryb przyjazny (domyślny)
- Ukrywa szczegóły techniczne (`saga_id`, `dp_id`, itp.)
- Polskie nazwy statusów (✅ Gotowy, 🔄 Do aktualizacji)
- Uproszczone listy zależności
- Nazwy metod zamiast numerów

### Tryb ekspercki
- Pokazuje wszystkie szczegóły techniczne
- Surowe statusy (COMMITTED, STALE, BLOCKED)
- Pełne ścieżki plików i identyfikatory
- Numery i nazwy metod

### Przełączanie trybu:
```
[X] Zmień tryb      - Przełącz tryb wyświetlania
```

ℹ️ Wybór trybu jest zapamiętywany między sesjami.

Konfiguracja: `data/display-modes.yaml`
Preferencje zapisywane w: `.deep-process/config.json`

---

## SYSTEM POMOCY / HELP SYSTEM

Każdy ekran zawiera opcję `[H] Pomoc` która wyświetla kontekstową pomoc:

### Struktura pomocy

```
┌─────────────────────────────────────────────────────────────────┐
│  POMOC — {Nazwa fazy}                                           │
└─────────────────────────────────────────────────────────────────┘

GDZIE JESTEŚ?
  {Opis aktualnego miejsca w systemie}

{SEKCJA SPECYFICZNA DLA FAZY}
  {Wyjaśnienia kontekstowe}

CO ROBIĆ?
  {Sugerowane następne kroki}

NAWIGACJA:
  {Lista dostępnych opcji z wyjaśnieniami}

Naciśnij ENTER aby wrócić...
```

### Dostępna pomoc w każdej fazie

| Faza | Klawisz | Zawartość pomocy |
|------|---------|------------------|
| START | [H] | Wyjaśnienie podstawowych pojęć, jak zacząć |
| PRZEGLĄD | [H] | Znaczenie statusów, co robić dalej |
| PLANOWANIE | [H] | Czym są metody, jak modyfikować plan |
| TWORZENIE | [H] | Co się dzieje podczas generowania |
| SPRAWDZANIE | [H] | Znaczenie testów, jak interpretować wyniki |
| ZAPISYWANIE | [H] | Co się stanie po zapisie, kopie zapasowe |

### Słownik pojęć (dostępny z każdego [H])

| Termin | Znaczenie |
|--------|-----------|
| Proces | Zdefiniowany przepływ pracy |
| Instancja | Konkretne wykonanie procesu |
| Artefakt | Dokument wygenerowany w procesie |
| Kluczowe fakty | Lista faktów które muszą być prawdziwe |
| Punkt decyzji | Miejsce wymagające Twojego wyboru |
| Graf zależności | Mapa powiązań między artefaktami |

---

## BOOTSTRAP PROTOCOL / PROTOKÓŁ URUCHOMIENIA

Initialize system with this prompt / Zainicjalizuj system tym promptem:

```
Zatrzymaj tryb konwersacyjny. Inicjalizuję Deep-Process v3.6.

TWOJE DYREKTYWY (BIOS):
1. Jesteś Systemem Operacyjnym plików Markdown. Twoja pamięć to `.deep-process/state.json`.
2. Każdy plik, który wygenerujesz, MUSI mieć nagłówek YAML zgodny ze Specyfikacją v3.6.
3. Twoim priorytetem jest DETERMINIZM SEMANTYCZNY. Używaj `semantic_hash` do weryfikacji.
4. Jeśli wykryjesz sprzeczność (Metoda #154), nie zgaduj. Stwórz `decision-point`.
5. WSZYSTKIE komunikaty dla użytkownika wyświetlaj PO POLSKU.
6. Każdy ekran MUSI zawierać nagłówek kontekstowy i opcję [H] Pomoc.

ZADANIE STARTOWE:
1. Zmapuj obecną strukturę plików.
2. Utwórz folder `.deep-process/` i zainicjalizuj `state.json` oraz `registry.json`.
3. Skopiuj `data/enforcer.md` do `.deep-process/enforcer.md`.
4. Zgłoś gotowość wyświetlając Menu Główne z nagłówkiem kontekstowym.
```

### Template nagłówka kontekstowego (wymagany na każdym ekranie):

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: {NAZWA_FAZY}] [Proces: {nazwa_procesu}] [Status: {status}]│
└─────────────────────────────────────────────────────────────────┘
```

### Template sekcji pomocy (wymagany na każdym ekranie):

```
Dostępne akcje:
{lista akcji z opisami}
[H] Pomoc            - Wyjaśnienie opcji i pojęć
[Q] Wyjdź/Wróć       - Powrót do poprzedniego ekranu
```

---

## MIGRATION PROTOCOL (SRE Transformer)

### Transformation Pipeline

```
KROK 1: Dekompozycja Zasad (Methods #71, #72)
  └── Oddziel "rytuały" od "funkcji"
  └── Wypisz łańcuch przyczynowo-skutkowy

KROK 2: Izomorfizm Strukturalny (Method #95)
  └── Mapowanie:
      Dokument/E-mail → dp_type: artifact
      Decyzja/Spotkanie → dp_type: decision-point
      Procedura/Instrukcja → dp_type: process
      Rola/Osoba → dp_type: agent

KROK 3: Wykrywanie Punktów Styku (Method #90)
  └── Każde "zatwierdzenie/opinia/wybór" → Decision Point

KROK 4: Generowanie Kontraktów (Method #79)
  └── Dla każdego kroku: plik .md z YAML header

KROK 5: Weryfikacja Wierności (Methods #114, #100)
  └── Test Entropii: czy informacja zginęła?
  └── Test Odwracalności: czy można odtworzyć oryginał?
```

---

## DIRECTORY STRUCTURE

```
src/core/deep-process/
├── workflow.md                     ← YOU ARE HERE
│
├── data/                           # FRAMEWORK DATA
│   ├── state-schema.yaml           # Schema for state.json
│   ├── registry-schema.yaml        # Schema for registry.json (instance tracking)
│   ├── contract-schema.yaml        # Universal Contract schema
│   ├── decision-point-schema.yaml  # Decision Point schema
│   ├── enforcer.md                 # BIOS - Method Translator & Law 0
│   ├── contract-interpretation-protocol.md  # How to parse YAML as executable
│   ├── method-translator.yaml      # Method definitions
│   ├── display-modes.yaml          # Display mode configuration
│   ├── help-reference.md           # User help documentation
│   ├── method-procedures/          # Individual method files (17 methods)
│   │   ├── 056_Liars_Trap.md           # Anti-bias
│   │   ├── 059_CUI_BONO_Test.md        # Anti-bias
│   │   ├── 060_Approval_Gradient_Test.md # Anti-bias
│   │   ├── 093_DNA_Inheritance_Check.md  # Coherence
│   │   ├── 095_Structural_Isomorphism.md # Coherence
│   │   ├── 099_Multi_Artifact_Coherence.md # Coherence
│   │   ├── 100_Vocabulary_Consistency.md # Coherence
│   │   ├── 071_First_Principles_Analysis.md # Implementation
│   │   ├── 072_5_Whys_Deep_Dive.md     # Implementation
│   │   ├── 079_Operational_Definition.md # Implementation
│   │   ├── 080_Inversion.md            # Implementation
│   │   ├── 087_Falsifiability_Check.md # Implementation
│   │   ├── 090_Dependency_Topology_Mapping.md # Implementation
│   │   ├── 114_Reversibility_Test.md   # Implementation
│   │   ├── 152_Socratic_Decomposition_Pre_Analysis.md # Implementation
│   │   ├── 154_Definitional_Contradiction_Detector.md # Implementation
│   │   └── 159_Transitive_Dependency_Closure.md # Implementation
│   └── templates/
│       ├── artifact-template.md
│       └── decision-point-template.md
│
├── steps/                          # DEEP-PULSE PHASES
│   ├── step-00-bootstrap.md
│   ├── step-01-sense.md
│   ├── step-02-plan.md
│   ├── step-03-act.md
│   ├── step-04-validate.md
│   ├── step-05-sync.md
│   └── step-quick-edit.md          # Quick Edit mode (minor changes)
│
├── agents/                         # AGENT MANIFESTS
│   ├── pm-agent.yaml               # Project Manager / Orchestrator
│   ├── validator-agent.yaml        # Validator (anti-bias + coherence)
│   └── implementation-agent.yaml   # Implementation (10 methods)
│
└── processes/                      # SRE-CONVERGENT PROCESS DEFINITIONS
    ├── _manifest.yaml              # Registry of available processes
    ├── _process-template/          # Template for creating new processes
    │   ├── process.yaml            # Process definition template
    │   └── templates/
    │       └── artifact-template.md
    └── [process-name]/             # Each transformed process
        ├── process.yaml            # Process steps, gates, methods
        └── templates/              # Process-specific artifact templates
```

### Runtime Files (created in user project)

```
project-root/
├── .deep-process/
│   ├── state.json                  # Graph DB (artifacts)
│   ├── registry.json               # Instance tracking
│   └── backups/                    # Rollback storage
│
└── artifacts/
    └── processes/
        └── {instance-id}/          # Each process instance
            ├── instance-state.json
            └── *.md                # Generated artifacts
```

---

## CRITICAL RULES

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SYSTEM COMMANDMENTS                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  0. CONTRACT PARSING (Law 0 - Prime Directive)                              │
│     YAML header = executable instructions, NOT metadata                     │
│     Phase I: Load depends_on (Context Rehydration)                          │
│     Phase II: Inject methods (Runtime Configuration)                        │
│     Phase III: Lock semantic_hash (Determinism Enforcement)                 │
│     ONLY THEN read Markdown body                                            │
│     See: data/contract-interpretation-protocol.md                           │
│                                                                             │
│  1. READ-BEFORE-WRITE                                                       │
│     Never generate content without first reading `.deep-process/state.json` │
│                                                                             │
│  2. ATOMIC COMMIT                                                           │
│     Response without [UPDATE_STATE] block = system failure (ROLLBACK)       │
│                                                                             │
│  3. NO GUESSING                                                             │
│     If contradiction detected → create decision-point, don't resolve        │
│                                                                             │
│  4. SEMANTIC HASH = GROUND TRUTH                                            │
│     Content must match semantic_hash; hash survives text rewrites           │
│                                                                             │
│  5. TOPOLOGY IS LAW                                                         │
│     Changes propagate through dependency graph automatically                │
│                                                                             │
│  6. HUMAN ANCHOR                                                            │
│     Operator (Human) is final arbiter; system proposes, human disposes      │
│                                                                             │
│  7. ANTI-BIAS IS MANDATORY                                                  │
│     Methods #56, #59, #60 run on EVERY validation phase                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## VERSION

- **Deep-Process:** V3.6
- **Codename:** SRE-Convergent
- **Architecture:** File-Based, LLM-Executed, Human-Anchored Graph Database
