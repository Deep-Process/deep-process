# Step 03: ACT Phase (Faza Tworzenia)

## Purpose / Cel
Execute content generation with Implementation Agent, applying injected methods.
Generowanie zawartości artefaktu z zastosowaniem wybranych metod weryfikacji.

## Trigger / Wyzwalacz
- Plan phase completed and confirmed / Faza planowania zatwierdzona
- Skeleton file created with YAML header / Szkielet pliku utworzony

## Execution / Wykonanie

### Phase 3.1: Load Context / Ładowanie kontekstu

Display progress header:

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: TWORZENIE] [Proces: {process_name}] [Artefakt: {dp_id}] │
└─────────────────────────────────────────────────────────────────┘

Ładowanie kontekstu...

📂 Loading `data/enforcer.md` (BIOS)
📂 Loading skeleton: {artifact_path}

Pliki źródłowe (dependencies):
{for each dependency in depends_on}
📂 {dependency.path}
   Typ: {dependency.type_pl}
   Status: {dependency.status_pl}
   Kluczowe fakty:
   {for each fact in dependency.semantic_hash}
     • "{fact}"
   {end}
{end}

Trwa generowanie... (możesz poczekać lub wcisnąć [H] dla pomocy)
```

### Phase 3.2: Method Execution

Apply each injected method sequentially:

```markdown
## Method Execution

### Method #{method_1}: {name_1}

📂 Loading method procedure: {file}

**Execution:**
{method-specific output following procedure template}

**Findings:**
- {finding_1}
- {finding_2}

---

### Method #{method_2}: {name_2}

📂 Loading method procedure: {file}

**Execution:**
{method-specific output}

**Findings:**
- {finding_1}

---

{repeat for all methods}
```

### Phase 3.3: Content Generation

Generate content informed by method outputs:

```markdown
## Content Generation

### Constraints from Methods

| Method | Constraint | Applied How |
|--------|------------|-------------|
| #87 | All claims must be falsifiable | Each claim has test criteria |
| #114 | Reasoning must be reversible | Sources cited for all decisions |
| #154 | No definitional contradictions | Requirements cross-checked |

### Content Sections

{Generate actual content for each section in skeleton}

## Overview

{Generated overview that:
- Addresses all parent semantic_hash facts
- Incorporates method findings
- Avoids banned words without quantification
}

## Details

{Generated details that:
- Follow method constraints
- Include specific, measurable claims
- Cite dependencies where relevant
}
```

### Phase 3.4: Semantic Hash Generation

Extract facts from generated content:

```markdown
## Semantic Hash Generation

### Extracted Facts

From content, the following facts MUST remain true:

1. "{Category}: {Specific fact}"
   - Source: Section {X}, Line {Y}
   - Falsifiable: Yes, test by {method}

2. "{Category}: {Specific fact}"
   - Source: Section {X}
   - Falsifiable: Yes, test by {method}

3. "{Category}: {Specific fact}"
   - Source: {location}
   - Falsifiable: Yes

### Semantic Hash (for YAML)

```yaml
semantic_hash:
  - "{fact_1}"
  - "{fact_2}"
  - "{fact_3}"
```
```

### Phase 3.5: Self-Validation

Quick validation before passing to Validator:

```markdown
## Self-Validation Checklist

### #114 Reversibility Check
[ ] All conclusions trace back to sources
[ ] No "obvious" or "everyone knows" statements
[ ] Calculations shown, not just results

### #87 Falsifiability Check
[ ] No banned words without quantification
[ ] Each claim has disproof criteria
[ ] No unfalsifiable claims

### Conflict Scan
[ ] No contradictions with parent hashes
[ ] No definitional impossibilities (#154)
[ ] Dependencies don't conflict

### Result
{PASS → proceed to VALIDATE}
{CONFLICT DETECTED → create Decision Point, HALT}
```

### Phase 3.6: Handle Conflicts / Obsługa konfliktów

If conflict detected, display:

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: TWORZENIE] [Status: WYKRYTO KONFLIKT]                   │
└─────────────────────────────────────────────────────────────────┘

⚠️  WYKRYTO SPRZECZNOŚĆ

Metoda wykrywająca: {detecting_method_pl} (#{detecting_method})
Typ konfliktu:      {contradiction_type_pl}

┌─ Element A (z: {source_a}) ─────────────────────────────────────┐
│  "{quoted_text_a}"                                              │
└─────────────────────────────────────────────────────────────────┘

┌─ Element B (z: {source_b}) ─────────────────────────────────────┐
│  "{quoted_text_b}"                                              │
└─────────────────────────────────────────────────────────────────┘

Analiza:
{Why these conflict - in Polish}

CO DALEJ?
System utworzy punkt decyzji (DP-{sequence}) i poczeka na Twój wybór.
Nie można kontynuować bez rozstrzygnięcia sprzeczności.

Dostępne akcje:
[D] Przejdź do decyzji - Zobacz opcje rozwiązania konfliktu
[H] Pomoc              - Wyjaśnienie co się stało
[Q] Wróć do przeglądu  - Odłóż decyzję na później

Wpisz wybór:
```

### Help Content for Conflict

```
┌─────────────────────────────────────────────────────────────────┐
│  POMOC — Wykryto konflikt                                       │
└─────────────────────────────────────────────────────────────────┘

CO SIĘ STAŁO?
  System podczas tworzenia artefaktu wykrył, że dwa źródłowe
  dokumenty zawierają sprzeczne informacje.

DLACZEGO TO WAŻNE?
  Gdyby system zignorował sprzeczność, wygenerowany artefakt
  mógłby zawierać błędne lub niespójne informacje.

CO TO JEST PUNKT DECYZJI?
  To miejsce gdzie TY musisz rozstrzygnąć, która wersja jest
  prawidłowa. System nie może zgadywać.

JAK ROZWIĄZAĆ?
  1. Wpisz [D] aby zobaczyć opcje
  2. Przeczytaj każdą opcję i jej konsekwencje
  3. Wybierz opcję która jest zgodna z Twoim zamiarem
  4. System zaktualizuje odpowiednie pliki

CZY MOGĘ ODŁOŻYĆ DECYZJĘ?
  Tak, wpisz [Q] aby wrócić do przeglądu.
  Konflikt pozostanie do rozwiązania później.

Naciśnij ENTER aby wrócić...
```

### Phase 3.7: Fix Mode / Tryb poprawek

When ACT receives a fix handoff from VALIDATE (user selected [P] Popraw):

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: TWORZENIE] [Tryb: POPRAWKI] [Artefakt: {dp_id}]         │
└─────────────────────────────────────────────────────────────────┘

TRYB POPRAWEK — Naprawianie błędów walidacji

📂 Loading artifact: {artifact_path}
📂 Loading fix list: {fix_count} poprawek do wykonania

════════════════════════════════════════════════════════════════════
LISTA POPRAWEK DO WYKONANIA:
════════════════════════════════════════════════════════════════════

{for each fix in fixes_required}
┌─ {fix.fix_id} [{fix.severity_pl}] ─────────────────────────────────┐
│                                                                    │
│  Metoda: {fix.detecting_method_pl} (#{fix.detecting_method})       │
│  Lokalizacja: {fix.location}, linia {fix.line_number}              │
│                                                                    │
│  PROBLEM:                                                          │
│  {fix.description_pl}                                              │
│                                                                    │
│  AKTUALNIE:                                                        │
│  > "{fix.current_value}"                                           │
│                                                                    │
│  SUGESTIA:                                                         │
│  {fix.suggestion_pl}                                               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

{end}

════════════════════════════════════════════════════════════════════

Trwa wykonywanie poprawek...
```

#### Fix Execution Process

```markdown
## Fix Execution

### Fix {fix.fix_id}: {fix.description_pl}

📂 Loading original content from line {fix.line_number}

**Original:**
```
{original_content_around_line}
```

**Applying fix based on suggestion:**
{fix.suggestion_pl}

**Corrected:**
```
{corrected_content}
```

**Verification:**
- Re-running method #{fix.detecting_method}...
- Result: {PASS/STILL_FAILING}

{if STILL_FAILING}
⚠️  Poprawka nie rozwiązała problemu.
    Dodatkowa analiza wymagana.
{end}

---
{repeat for all fixes}
```

#### Fix Mode Completion

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: TWORZENIE] [Tryb: POPRAWKI] [Status: ZAKOŃCZONO]        │
└─────────────────────────────────────────────────────────────────┘

POPRAWKI WYKONANE

Podsumowanie:
  ✅ Naprawione:      {fixed_count}/{total_count}
  ❌ Nienaprawione:   {unfixed_count}/{total_count}

{if all fixed}
Wszystkie poprawki zostały wykonane.
Przechodzę do ponownej walidacji...
{end}

{if some unfixed}
⚠️  Nie wszystkie poprawki zostały wykonane:
{for each unfixed}
   • {fix.fix_id}: {fix.description_pl}
     Powód: {reason_pl}
{end}

Dostępne akcje:
[R] Ponów walidację  - Sprawdź czy częściowe poprawki wystarczą
[E] Edytuj ręcznie   - Otwórz artefakt do ręcznej edycji
[H] Pomoc            - Wyjaśnienie problemu
[Q] Anuluj           - Wróć do przeglądu bez zapisywania
{end}

Wpisz wybór:
```

#### Fix Mode State

Fix mode maintains state to track which fixes were applied:

```json
{
  "mode": "FIX",
  "original_artifact_hash": "{hash}",
  "fixes_received": {fix_list},
  "fixes_applied": [
    {"fix_id": "FIX-001", "status": "APPLIED", "timestamp": "..."},
    {"fix_id": "FIX-002", "status": "FAILED", "reason": "..."}
  ],
  "revalidation_required": true
}
```

## Output

The ACT phase produces:
1. **Completed artifact** with content and semantic_hash
2. **Method execution records** for audit trail
3. **Decision Points** if conflicts detected
4. **Fix application records** if in Fix Mode

## State Update

```
[UPDATE_STATE]
{
  "saga_id": "{current_saga}",
  "operations": [
    {"type": "UPDATE", "target": "{dp_id}", "path": "{path}"}
  ],
  "flag_stale": []
}
[/UPDATE_STATE]
```

## Next Step

- **If no conflicts:** Proceed to **Step 04: VALIDATE**
- **If conflict:** Wait for Decision Point resolution, then re-run ACT
