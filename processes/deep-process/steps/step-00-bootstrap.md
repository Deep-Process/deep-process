# Step 00: Bootstrap Protocol

## Purpose
Initialize Deep-Process v3.6 system in a new project directory.

## Prerequisites
- Empty or existing project directory
- LLM CLI available (Claude, Gemini, or compatible)
- Access to Deep-Process framework source (this folder)

## Path Reference / Referencja ścieżek

**IMPORTANT:** During bootstrap, files are copied from the **framework source** to the **user's project**.

```
FRAMEWORK SOURCE (read-only):
  src/core/deep-process/           ← Framework location (this folder)
    ├── data/enforcer.md           ← Source for enforcer
    ├── data/state-schema.yaml     ← Schema for state.json
    ├── data/registry-schema.yaml  ← Schema for registry.json
    ├── data/help-reference.md     ← Help documentation
    ├── data/display-modes.yaml    ← Display mode config
    ├── agents/                    ← Agent definitions
    │   ├── pm-agent.yaml
    │   ├── validator-agent.yaml
    │   └── implementation-agent.yaml
    └── processes/_manifest.yaml   ← Available process definitions

USER'S PROJECT (write):
  {project-root}/                  ← User's project directory
    ├── .deep-process/             ← Runtime kernel (created by bootstrap)
    │   ├── state.json
    │   ├── registry.json
    │   ├── config.json
    │   ├── enforcer.md
    │   ├── agents/
    │   └── backups/
    └── artifacts/                 ← Generated artifacts (output)
```

## Execution

### Phase 1: Directory Structure Creation

Create the system kernel in **user's project directory**:

```
📂 CREATING IN: {project-root}/

📁 Create .deep-process/
   ├── state.json
   │   └── Initialize using schema from: src/core/deep-process/data/state-schema.yaml
   │
   ├── registry.json
   │   └── Initialize using schema from: src/core/deep-process/data/registry-schema.yaml
   │
   ├── config.json
   │   └── Initialize with default config (see Phase 2)
   │
   ├── enforcer.md
   │   └── COPY FROM: src/core/deep-process/data/enforcer.md
   │
   ├── backups/
   │   └── Create empty directory
   │
   ├── agents/
   │   ├── pm-agent.yaml
   │   │   └── COPY FROM: src/core/deep-process/agents/pm-agent.yaml
   │   ├── validator-agent.yaml
   │   │   └── COPY FROM: src/core/deep-process/agents/validator-agent.yaml
   │   └── implementation-agent.yaml
   │       └── COPY FROM: src/core/deep-process/agents/implementation-agent.yaml
   │
   └── processes/
       └── Create empty directory (instances will be tracked here)

📁 Create artifacts/
   └── (initially empty, will hold generated output)

📁 Create .claude/commands/ (or .gemini/commands/) [OPTIONAL]
   ├── deep-process.json   # CLI shim for launching PM
   └── audit.json          # CLI shim for audit
```

### Phase 2: State Initialization

Initialize `.deep-process/state.json`:

```json
{
  "version": "3.6",
  "initialized_at": "{ISO_TIMESTAMP}",
  "last_modified": "{ISO_TIMESTAMP}",
  "current_saga": null,
  "nodes": {},
  "edges": [],
  "transactions": []
}
```

Initialize `.deep-process/registry.json`:

```json
{
  "version": "3.6",
  "processes": [],
  "active_process": null
}
```

Initialize `.deep-process/config.json`:

```json
{
  "version": "3.6",
  "display_mode": "friendly",
  "language": "pl",
  "created_at": "{ISO_TIMESTAMP}"
}
```

### Phase 3: Load BIOS (Enforcer)

Copy enforcer content to `.deep-process/enforcer.md`:

```
SOURCE:      src/core/deep-process/data/enforcer.md
DESTINATION: {project-root}/.deep-process/enforcer.md
```

The enforcer contains:
- Method Translator definitions
- Invariant Laws
- Response Protocol

### Phase 4: Verification

Verify initialization:

```markdown
## Bootstrap Verification Checklist

[ ] .deep-process/state.json exists and is valid JSON
[ ] .deep-process/registry.json exists and is valid JSON
[ ] .deep-process/config.json exists and is valid JSON
[ ] .deep-process/enforcer.md exists
[ ] .deep-process/agents/ contains all 3 agent files:
    [ ] pm-agent.yaml
    [ ] validator-agent.yaml
    [ ] implementation-agent.yaml
[ ] .deep-process/backups/ directory exists
[ ] .deep-process/processes/ directory exists
[ ] artifacts/ directory exists
[ ] CLI shims created (if applicable)
```

### Phase 5: Display Main Menu

After successful bootstrap, display:

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: START] [Proces: brak] [Status: ZAINICJALIZOWANY]        │
└─────────────────────────────────────────────────────────────────┘

System gotowy. Brak aktywnych procesów.

Dostępne akcje:
[N] Nowy proces     - Utwórz pierwszą instancję procesu
[I] Importuj        - Migruj zewnętrzny proces do formatu SRE
[H] Pomoc           - Pokaż dokumentację i wyjaśnienia

Wpisz polecenie:
```

### Help Content (displayed when [H] selected)

```
┌─────────────────────────────────────────────────────────────────┐
│  POMOC — Ekran startowy                                         │
└─────────────────────────────────────────────────────────────────┘

CO TO JEST DEEP-PROCESS?
  System do zarządzania dokumentami i artefaktami projektowymi
  z automatycznym śledzeniem zależności i walidacją spójności.

PODSTAWOWE POJĘCIA:
  • Proces    = Zdefiniowany przepływ pracy (np. onboarding klienta)
  • Instancja = Konkretne wykonanie procesu (np. onboarding-klient-ABC)
  • Artefakt  = Dokument wygenerowany w ramach procesu

JAK ZACZĄĆ?
  1. Wpisz [N] aby utworzyć nowy proces
  2. Wybierz typ procesu z listy
  3. Podaj wymagane informacje kontekstowe
  4. System przeprowadzi Cię przez kolejne kroki

NAWIGACJA:
  • [N] = Nowy proces
  • [I] = Import istniejącego procesu
  • [H] = Ta pomoc

Naciśnij ENTER aby wrócić do menu...
```

## Bootstrap Prompt / Prompt inicjalizacyjny

Use this prompt to initialize / Użyj tego promptu do inicjalizacji:

```
Zatrzymaj tryb konwersacyjny. Inicjalizuję Deep-Process v3.6.

FRAMEWORK LOCATION:
  Definicje frameworka znajdują się w: src/core/deep-process/

TWOJE DYREKTYWY (BIOS):
1. Jesteś Systemem Operacyjnym plików Markdown. Twoja pamięć to `.deep-process/state.json`.
2. Każdy plik, który wygenerujesz, MUSI mieć nagłówek YAML zgodny ze Specyfikacją v3.6.
3. Twoim priorytetem jest DETERMINIZM SEMANTYCZNY. Używaj `semantic_hash` do weryfikacji.
4. Jeśli wykryjesz sprzeczność (Metoda #154), nie zgaduj. Stwórz `decision-point`.
5. WSZYSTKIE komunikaty dla użytkownika wyświetlaj PO POLSKU.
6. Każdy ekran MUSI zawierać nagłówek kontekstowy i opcję [H] Pomoc.

ZADANIE STARTOWE:
1. Zmapuj obecną strukturę plików w katalogu projektu.
2. Utwórz folder `.deep-process/` i zainicjalizuj `state.json` oraz `registry.json`.
3. Skopiuj `src/core/deep-process/data/enforcer.md` do `.deep-process/enforcer.md`.
4. Skopiuj agentów z `src/core/deep-process/agents/` do `.deep-process/agents/`.
5. Załaduj `src/core/deep-process/data/help-reference.md` jako źródło pomocy kontekstowej.
6. Zgłoś gotowość wyświetlając Menu Główne z nagłówkiem kontekstowym.
```

## LLM Execution Guide / Instrukcja dla LLM

When executing bootstrap, follow this exact sequence:

```
STEP 1: READ framework files
  📂 Read src/core/deep-process/data/state-schema.yaml
  📂 Read src/core/deep-process/data/registry-schema.yaml
  📂 Read src/core/deep-process/data/enforcer.md
  📂 Read src/core/deep-process/agents/pm-agent.yaml
  📂 Read src/core/deep-process/agents/validator-agent.yaml
  📂 Read src/core/deep-process/agents/implementation-agent.yaml

STEP 2: CREATE directories in project
  📁 Create {project-root}/.deep-process/
  📁 Create {project-root}/.deep-process/backups/
  📁 Create {project-root}/.deep-process/agents/
  📁 Create {project-root}/.deep-process/processes/
  📁 Create {project-root}/artifacts/

STEP 3: WRITE initialization files
  📝 Write {project-root}/.deep-process/state.json (from schema)
  📝 Write {project-root}/.deep-process/registry.json (from schema)
  📝 Write {project-root}/.deep-process/config.json (defaults)
  📝 Copy {project-root}/.deep-process/enforcer.md
  📝 Copy {project-root}/.deep-process/agents/*.yaml

STEP 4: VERIFY and DISPLAY
  ✅ Verify all files exist
  🖥️ Display main menu
```

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Framework not found | Cannot locate src/core/deep-process/ | Verify framework installation |
| Directory not writable | Permissions | Check write access to project directory |
| state.json corrupt | Invalid JSON | Delete and reinitialize |
| Missing enforcer | Incomplete bootstrap | Re-run bootstrap |
| Missing agents | Incomplete copy | Copy agents from framework |

## State Update

After successful bootstrap:

```
[UPDATE_STATE]
{
  "saga_id": "tx-0001",
  "operations": [
    {"type": "INIT", "target": "SYSTEM", "path": ".deep-process/"}
  ],
  "flag_stale": []
}
[/UPDATE_STATE]
```

## Next Step

After bootstrap, proceed to:
- **Step 01: Sense** - For ongoing operation
- **Migration Protocol** - If importing external process
