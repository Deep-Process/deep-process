# Step 01: SENSE Phase

Reference: SPECIFICATION.md Section 5, Phase 1

## Purpose
Analyze current system state and present actionable status to Operator.
Display artifact hierarchy within instances [v3.7].

## Trigger
- System startup (after bootstrap)
- Explicit `pm` or `deep-process` command
- After any state change

## Execution

### Phase 1.1: Load State

```
📂 Loading .deep-process/state.json
📂 Loading .deep-process/registry.json
```

Read and parse:
- All nodes and their statuses
- All edges (dependencies)
- Current saga (if active)
- Active processes

### Phase 1.2: Scan for Issues

Query the graph for issues:

```markdown
## Issue Detection

### STALE Nodes (require immediate update)
{for each node where dp_status = "STALE"}
  - {node.dp_id}: {node.path}
    Reason: Parent {changed_parent} modified at {timestamp}
    Propagation: IMMEDIATE
{end}

### STALE_DEFERRED Nodes (update needed, not urgent) [v3.7]
{for each node where dp_status = "STALE_DEFERRED"}
  - {node.dp_id}: {node.path}
    Reason: Parent changed, propagation is DEFERRED
    Deferred since: {deferred_since}
{end}

### COMMITTED_PINNED Nodes (locked to parent version) [v3.7]
{for each node where dp_status = "COMMITTED_PINNED"}
  - {node.dp_id}: Pinned to {parent.dp_id} v{pinned_version}
{end}

### BLOCKED Nodes (cannot proceed)
{for each node where dp_status = "BLOCKED"}
  - {node.dp_id}: Blocked by {blocker_id}
{end}

### AWAITING_USER_INPUT (Decision Points)
{for each node where dp_status = "AWAITING_USER_INPUT"}
  - {node.dp_id}: {node.question.prompt}
{end}

### FAILED Nodes (validation failed)
{for each node where dp_status = "FAILED"}
  - {node.dp_id}: Failed at {timestamp}
{end}
```

### Phase 1.3: Build Topology Summary

Compute graph metrics:

```markdown
## Topology Summary

| Metric | Value |
|--------|-------|
| Total nodes | {count} |
| COMMITTED | {count} |
| COMMITTED_PINNED | {count} |  # [v3.7]
| STALE | {count} |
| STALE_DEFERRED | {count} |  # [v3.7]
| BLOCKED | {count} |
| NOW (in progress) | {count} |
| Decision Points pending | {count} |
| Max dependency depth | {depth} |
| Max artifact depth | {artifact_depth} |  # [v3.7]
| Orphan nodes | {count} |
```

### Phase 1.4: Display Status Menu

Present to Operator:

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.7                                              │
│  [Faza: PRZEGLĄD] [Proces: {process_name}] [ID: {process_id}]   │
│  [Instancja: {instance_id}]                                     │
└─────────────────────────────────────────────────────────────────┘

Podsumowanie statusu:
  ✅ Gotowe:          {count}
  📌 Przypięte:       {pinned_count}     # [v3.7] COMMITTED_PINNED
  🔄 Do aktualizacji: {stale_count}
  ⏸️  Odłożone:        {deferred_count}   # [v3.7] STALE_DEFERRED
  🚫 Zablokowane:     {blocked_count}
  ⏳ Czeka na decyzję: {dp_count}
  ❌ Błędne:          {failed_count}

{if instance has artifact_hierarchy}
Hierarchia artefaktów:
  📁 {instance_id} ──────────────────────── {progress}%
     │
     {for each root_artifact}
     ├── 📄 {artifact.name} ────────────── {artifact.status_icon}
     │   {for each child}
     │   └── 📄 {child.name} ───────────── {child.status_icon}
     │   {end}
     {end}
{end}

{if STALE > 0}
⚠️  {STALE} artefaktów wymaga natychmiastowej aktualizacji.
{end}

{if STALE_DEFERRED > 0}
ℹ️  {STALE_DEFERRED} artefaktów ma odłożoną aktualizację.
{end}

{if AWAITING_USER_INPUT > 0}
🔔 {count} decyzji czeka na Twój wybór.
{end}

{if FAILED > 0}
❌ {count} artefaktów nie przeszło walidacji - wymagany przegląd.
{end}

Dostępne akcje:
[1] Aktualizuj      - Odśwież artefakty wymagające aktualizacji
[2] Decyzje         - Przeglądaj i rozstrzygaj punkty decyzji
[3] Błędy           - Zobacz artefakty z błędami walidacji
[4] Nowy artefakt   - Utwórz nowy dokument (pełna pętla)
[A] Dodaj artefakt  - Rozszerz instancję o nowy artefakt [v3.7]
[5] Zmień proces    - Przełącz na inną instancję procesu
[E] Szybka edycja   - Drobne poprawki bez pełnej walidacji
[V] Waliduj         - Uruchom pełną weryfikację systemu
[X] Zmień tryb      - Przełącz tryb wyświetlania (przyjazny/ekspercki)
[H] Pomoc           - Wyjaśnienie opcji i pojęć
[Q] Wyjdź           - Zapisz stan i zakończ

Wpisz wybór:
```

### Help Content for SENSE Phase

When [H] is selected, display:

```
┌─────────────────────────────────────────────────────────────────┐
│  POMOC — Faza przeglądu (SENSE)                                 │
└─────────────────────────────────────────────────────────────────┘

GDZIE JESTEŚ?
  To jest główny ekran statusu. Stąd widzisz stan całego procesu
  i decydujesz co robić dalej.

CO OZNACZAJĄ STATUSY?
  ✅ Gotowe          = Artefakt zatwierdzony, nie wymaga zmian
  📌 Przypięte       = Artefakt przypięty do wersji rodzica (ignoru zmiany) [v3.7]
  🔄 Do aktualizacji = Plik źródłowy się zmienił, trzeba zaktualizować natychmiast
  ⏸️  Odłożone        = Aktualizacja potrzebna, ale nie pilna [v3.7]
  🚫 Zablokowane     = Czeka na rozwiązanie innego problemu
  ⏳ Czeka na decyzję = System wykrył konflikt, potrzebny Twój wybór
  ❌ Błędne          = Walidacja nie przeszła, trzeba poprawić

HIERARCHIA ARTEFAKTÓW [v3.7]:
  • Artefakty tworzą drzewo wewnątrz instancji
  • Każdy artefakt może mieć dzieci (np. EPIC → STORY → TASK)
  • Typy artefaktów są definiowane przez proces, nie framework

CO ROBIĆ DALEJ?
  • Masz "Do aktualizacji"?  → Wybierz [1]
  • Masz "Czeka na decyzję"? → Wybierz [2]
  • Masz "Błędne"?           → Wybierz [3]
  • Chcesz rozszerzyć?       → Wybierz [A] dodaj artefakt [v3.7]
  • Wszystko OK?             → Utwórz [4] nowy artefakt lub [Q] wyjdź
  • Mała poprawka?           → Wybierz [E] szybka edycja

NAWIGACJA:
  • Zawsze możesz wrócić tutaj przez [Q] z dowolnego miejsca
  • [5] pozwala zmienić aktywny proces bez utraty postępu
  • [E] szybka edycja - dla drobnych poprawek bez pełnej walidacji
  • [X] zmiana trybu - przełącza między widokiem przyjaznym/eksperckim
  • [A] dodaj artefakt - rozszerza instancję o nowy artefakt [v3.7]

Naciśnij ENTER aby wrócić do menu...
```

## Decision Logic

### If STALE nodes exist:
- Prioritize by dependency order (leaves first)
- Offer bulk update or selective update

### If Decision Points exist:
- Show in order of blocking impact
- Most blockers first

### If FAILED nodes exist:
- Show failure reasons
- Offer to return to NOW for revision

## State Update

SENSE phase is read-only. No state update unless user takes action.

## Output

The SENSE phase produces:
1. **Status display** for Operator
2. **Issue list** prioritized by severity
3. **Recommended actions** based on state

## Next Steps

Based on Operator choice:
- **Update STALE** → Step 02: PLAN
- **Decision Points** → Present DP, await input
- **New artifact** → Step 02: PLAN
- **Audit** → Invoke Validator Agent on full graph

## Example Output

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.7                                              │
│  [Faza: PRZEGLĄD] [Proces: feature-auth] [ID: PROC-DEV-001]     │
│  [Instancja: feature-auth-001]                                  │
└─────────────────────────────────────────────────────────────────┘

Podsumowanie statusu:
  ✅ Gotowe:          5
  📌 Przypięte:       1
  🔄 Do aktualizacji: 2
  ⏸️  Odłożone:        1
  🚫 Zablokowane:     1
  ⏳ Czeka na decyzję: 1
  ❌ Błędne:          0

Hierarchia artefaktów:
  📁 feature-auth-001 ────────────────────── 60%
     │
     ├── 📄 vision.md ─────────────────────── ✅ COMMITTED
     ├── 📄 arch.md ───────────────────────── 🔄 STALE
     │
     ├── 📁 epics/
     │   ├── 📄 epic-auth.md ──────────────── 60%
     │   │   ├── 📄 story-login.md ────────── ✅ COMMITTED
     │   │   └── 📄 story-logout.md ───────── 🔄 STALE
     │   └── 📄 epic-admin.md ─────────────── ⏸️  DEFERRED

⚠️  2 artefakty wymagają natychmiastowej aktualizacji:
    - ARCH-001 (zależy od VISION-001, zmieniono 2h temu)
    - STORY-LOGOUT-001 (zależy od EPIC-AUTH-001)

ℹ️  1 artefakt ma odłożoną aktualizację:
    - EPIC-ADMIN-001 (propagacja: DEFERRED)

🔔 1 decyzja czeka na Twój wybór:
    - DP-003: OAuth vs SAML dla SSO enterprise

Dostępne akcje:
[1] Aktualizuj      - Odśwież artefakty wymagające aktualizacji
[2] Decyzje         - Rozstrzygnij DP-003
[4] Nowy artefakt   - Utwórz nowy dokument (pełna pętla)
[A] Dodaj artefakt  - Rozszerz instancję o nowy artefakt
[E] Szybka edycja   - Drobne poprawki bez pełnej walidacji
[V] Waliduj         - Uruchom pełną weryfikację
[X] Zmień tryb      - Przełącz tryb wyświetlania
[H] Pomoc           - Wyjaśnienie opcji
[Q] Wyjdź           - Zapisz i zakończ

Wpisz wybór:
```
