# Step 04: VALIDATE Phase (Faza Sprawdzania)

## Purpose / Cel
Execute Validator Agent to verify artifact before commit.
Weryfikacja artefaktu przed zapisaniem - sprawdzanie jakości i spójności.

## Trigger / Wyzwalacz
- ACT phase completed without conflicts / Faza tworzenia zakończona bez konfliktów
- Explicit validation request / Jawne żądanie walidacji

## Execution / Wykonanie

### Phase 4.1: Load Validation Context / Ładowanie kontekstu walidacji

Display progress header:

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: SPRAWDZANIE] [Proces: {process_name}] [Artefakt: {dp_id}]│
└─────────────────────────────────────────────────────────────────┘

Trwa weryfikacja jakości...

📂 Loading artifact: {artifact_path}
📂 Loading `agents/validator-agent.yaml`
📂 Loading system genes (from existing COMMITTED artifacts)

Sprawdzany artefakt:
  • Identyfikator: {dp_id}
  • Typ:          {dp_type_pl}
  • Status:       W trakcie tworzenia

Podobne istniejące artefakty (do porównania):
{for structural isomorphism}
  • {artifact_1} (podobieństwo: {similarity_metric}%)
  • {artifact_2} (podobieństwo: {similarity_metric}%)
{end}

Uruchamiam testy weryfikacyjne...
```

### Phase 4.2: Anti-Bias Checks

Execute mandatory anti-bias methods:

```markdown
## Anti-Bias Validation

### Method #56: Liar's Trap

📂 Loading method: `data/method-procedures/056_Liars_Trap.md`

**Deception Vectors Examined:**

Vector 1: {identified_vector}
- Evidence against: {evidence}
- Status: {CLEAR / FLAG}

Vector 2: {identified_vector}
- Evidence against: {evidence}
- Status: {CLEAR / FLAG}

Vector 3: {identified_vector}
- Evidence against: {evidence}
- Status: {CLEAR / FLAG}

**Result:** {PASS / FAIL}

---

### Method #59: CUI BONO Test

📂 Loading method: `data/method-procedures/059_CUI_BONO_Test.md`

| Decision | Beneficiary | Justification |
|----------|-------------|---------------|
| {decision_1} | {USER/AGENT/BOTH} | {why} |
| {decision_2} | {USER/AGENT/BOTH} | {why} |

**Red Flags:** {count}
**Result:** {PASS / FLAG}

---

### Method #60: Approval Gradient Test

📂 Loading method: `data/method-procedures/060_Approval_Gradient_Test.md`

| Claim | Truth ← → Approval | Score | Status |
|-------|-------------------|-------|--------|
| {claim_1} | {position} | {%} | {OK/FLAG} |
| {claim_2} | {position} | {%} | {OK/FLAG} |

**Max Score:** {%}
**Result:** {PASS / FLAG}
```

### Phase 4.3: Coherence Checks

Execute coherence methods:

```markdown
## Coherence Validation

### Method #93: DNA Inheritance Check

📂 Loading method: `data/method-procedures/093_DNA_Inheritance_Check.md`

| Gene | System Pattern | Artifact | Status |
|------|----------------|----------|--------|
| Naming | {pattern} | {actual} | {✅/❌} |
| Structure | {pattern} | {actual} | {✅/❌} |
| Style | {pattern} | {actual} | {✅/❌} |

**Mutations:** {count}
**Justified:** {yes/no}
**Result:** {PASS / FLAG}

---

### Method #95: Structural Isomorphism

📂 Loading method: `data/method-procedures/095_Structural_Isomorphism.md`

| Metric | Baseline | Artifact | Delta | Status |
|--------|----------|----------|-------|--------|
| Nesting | {x} | {y} | {%} | {✅/⚠️} |
| Sections | {x} | {y} | {%} | {✅/⚠️} |
| Lines | {x} | {y} | {%} | {✅/⚠️} |

**Over threshold (30%):** {count}
**Result:** {PASS / FLAG}

---

### Method #99: Multi-Artifact Coherence

📂 Loading method: `data/method-procedures/099_Multi_Artifact_Coherence.md`

| Check | Status | Issues |
|-------|--------|--------|
| Reference integrity | {✅/❌} | {broken refs} |
| Naming consistency | {✅/❌} | {inconsistencies} |
| Interface compatibility | {✅/❌} | {mismatches} |
| Duplication drift | {✅/❌} | {drift found} |

**Result:** {PASS / FAIL}

---

### Method #100: Vocabulary Consistency

📂 Loading method: `data/method-procedures/100_Vocabulary_Consistency.md`

**Synonyms found:** {list}
**Homonyms found:** {list}
**Undefined terms:** {list}

**Result:** {PASS / FLAG}
```

### Phase 4.4: Semantic Hash Verification

Verify content supports declared facts:

```markdown
## Semantic Hash Verification

| # | Fact | Content Support | Status |
|---|------|-----------------|--------|
| 1 | "{fact_1}" | Section 2, Line 15: "{quote}" | ✅ |
| 2 | "{fact_2}" | Section 3, Line 42: "{quote}" | ✅ |
| 3 | "{fact_3}" | NOT FOUND | ❌ VIOLATION |

**Violations:** {count}
**Result:** {PASS / FAIL}
```

### Phase 4.5: Verdict / Werdykt

Compile results and determine verdict:

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: SPRAWDZANIE] [Status: ZAKOŃCZONO]                       │
└─────────────────────────────────────────────────────────────────┘

WYNIKI WERYFIKACJI

┌──────────────────────┬──────────────────────┬───────────────────┐
│ Kategoria            │ Testy                │ Wynik             │
├──────────────────────┼──────────────────────┼───────────────────┤
│ Obiektywność         │ Pułapka kłamcy (#56) │ {status_emoji}    │
│                      │ Test CUI BONO (#59)  │ {status_emoji}    │
│                      │ Gradient zgody (#60) │ {status_emoji}    │
├──────────────────────┼──────────────────────┼───────────────────┤
│ Spójność             │ Dziedziczenie (#93)  │ {status_emoji}    │
│                      │ Izomorfizm (#95)     │ {status_emoji}    │
│                      │ Multi-artefakt (#99) │ {status_emoji}    │
│                      │ Słownictwo (#100)    │ {status_emoji}    │
├──────────────────────┼──────────────────────┼───────────────────┤
│ Kluczowe fakty       │ Weryfikacja hash     │ {status_emoji}    │
└──────────────────────┴──────────────────────┴───────────────────┘

{if blockers}
❌ BLOKADY (wymagają naprawy):
{for each blocker}
   • {blocker_description_pl}
{end}
{end}

{if warnings}
⚠️  OSTRZEŻENIA (nie blokują):
{for each warning}
   • {warning_description_pl}
{end}
{end}

═══════════════════════════════════════════════════════════════════

{if COMMITTED}
✅ WERDYKT: ZATWIERDZONO

Artefakt przeszedł wszystkie testy. Gotowy do zapisania.

Dostępne akcje:
[Y] Zapisz           - Przejdź do zapisywania artefaktu
[R] Powtórz testy    - Uruchom walidację ponownie
[H] Pomoc            - Wyjaśnienie wyników
[Q] Anuluj           - Wróć do przeglądu (artefakt NIE zostanie zapisany)

Wpisz wybór:
{end}

{if FAILED}
❌ WERDYKT: ODRZUCONO

Artefakt nie przeszedł walidacji. Wymagane poprawki:
{for each fix}
   {n}. [{fix.category}] {fix.description_pl}
       Źródło: {fix.detecting_method_pl} (#{fix.method_number})
       Dotyczy: {fix.location} (linia {fix.line_number})
       Sugestia: {fix.suggestion_pl}
{end}

Dostępne akcje:
[P] Popraw           - Wróć do fazy tworzenia z listą poprawek
[D] Szczegóły        - Zobacz pełne wyjaśnienie każdego błędu
[H] Pomoc            - Wyjaśnienie co poszło nie tak
[Q] Anuluj           - Wróć do przeglądu

Wpisz wybór:
{end}

{if CONDITIONAL}
⚠️  WERDYKT: WARUNKOWO ZATWIERDZONO

Artefakt ma ostrzeżenia, ale brak blokad:
{for each warning}
   • {warning_description_pl}
{end}

Czy kontynuować mimo ostrzeżeń?

Dostępne akcje:
[Y] Tak, zapisz      - Akceptuję ostrzeżenia, przejdź do zapisywania
[P] Popraw           - Wróć do tworzenia aby naprawić ostrzeżenia
[H] Pomoc            - Wyjaśnienie ostrzeżeń
[Q] Anuluj           - Wróć do przeglądu

Wpisz wybór:
{end}
```

### Help Content for VALIDATE Phase

When [H] is selected, display:

```
┌─────────────────────────────────────────────────────────────────┐
│  POMOC — Faza sprawdzania (VALIDATE)                            │
└─────────────────────────────────────────────────────────────────┘

GDZIE JESTEŚ?
  System właśnie sprawdził jakość wygenerowanego artefaktu.
  Teraz widzisz wyniki testów.

CO OZNACZAJĄ KATEGORIE?

  OBIEKTYWNOŚĆ (Anti-Bias):
    Sprawdza czy artefakt nie jest stronniczy, nie pomija
    trudnych aspektów, i czy decyzje są uzasadnione.

  SPÓJNOŚĆ (Coherence):
    Sprawdza czy artefakt pasuje do reszty systemu:
    nazewnictwo, struktura, terminologia.

  KLUCZOWE FAKTY (Semantic Hash):
    Sprawdza czy treść faktycznie zawiera to co deklaruje
    w sekcji "kluczowe fakty".

CO OZNACZAJĄ WYNIKI?
  ✅ = Test zaliczony
  ⚠️ = Ostrzeżenie (można kontynuować)
  ❌ = Blokada (wymaga naprawy)

CO ROBIĆ JEŚLI ODRZUCONO?
  1. Przeczytaj listę wymaganych poprawek
  2. Wpisz [P] aby wrócić do tworzenia
  3. System pomoże Ci naprawić problemy
  4. Po poprawkach walidacja uruchomi się ponownie

Naciśnij ENTER aby wrócić...
```

## Fix Handoff Mechanism / Mechanizm przekazywania poprawek

When user selects [P] Popraw, the system creates a **fix list** that is passed to ACT phase:

### Fix List Structure

```json
{
  "handoff_type": "VALIDATION_FIXES",
  "artifact_id": "{dp_id}",
  "artifact_path": "{path}",
  "validation_timestamp": "{ISO_TIMESTAMP}",
  "fixes_required": [
    {
      "fix_id": "FIX-001",
      "category": "SEMANTIC_HASH",
      "severity": "BLOCKING",
      "detecting_method": 100,
      "detecting_method_pl": "Spójność słownictwa",
      "description": "Inconsistent terminology: 'user' vs 'użytkownik'",
      "description_pl": "Niespójne słownictwo: 'user' vs 'użytkownik'",
      "location": "Section: Overview",
      "line_number": 15,
      "current_value": "The user can login...",
      "suggestion": "Standardize to 'użytkownik' throughout",
      "suggestion_pl": "Użyj 'użytkownik' w całym dokumencie"
    },
    {
      "fix_id": "FIX-002",
      "category": "ANTI_BIAS",
      "severity": "BLOCKING",
      "detecting_method": 59,
      "detecting_method_pl": "Test CUI BONO",
      "description": "Decision benefits agent over user",
      "description_pl": "Decyzja faworyzuje agenta kosztem użytkownika",
      "location": "Section: Technical Approach",
      "line_number": 42,
      "current_value": "We recommend the simpler approach...",
      "suggestion": "Justify why simpler is better for user, not just easier to implement",
      "suggestion_pl": "Uzasadnij dlaczego prostsze jest lepsze dla użytkownika, nie tylko łatwiejsze do implementacji"
    }
  ],
  "warnings_optional": [
    {
      "warning_id": "WARN-001",
      "category": "STRUCTURAL",
      "detecting_method": 95,
      "description_pl": "Dokument jest 40% dłuższy niż podobne artefakty"
    }
  ]
}
```

### Handoff Display (when [P] selected)

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: SPRAWDZANIE] [Status: PRZEKAZYWANIE DO POPRAWKI]        │
└─────────────────────────────────────────────────────────────────┘

PRZEKAZUJĘ DO POPRAWY

Artefakt: {dp_id}
Liczba poprawek: {fix_count}

Lista poprawek do wykonania:

┌─ FIX-001 [BLOKUJĄCA] ───────────────────────────────────────────┐
│  Kategoria: Spójność słownictwa (metoda #100)                   │
│  Lokalizacja: Sekcja "Overview", linia 15                       │
│                                                                 │
│  Problem:                                                       │
│    Niespójne słownictwo: 'user' vs 'użytkownik'                │
│                                                                 │
│  Sugestia:                                                      │
│    Użyj 'użytkownik' w całym dokumencie                        │
└─────────────────────────────────────────────────────────────────┘

┌─ FIX-002 [BLOKUJĄCA] ───────────────────────────────────────────┐
│  Kategoria: Test CUI BONO (metoda #59)                          │
│  Lokalizacja: Sekcja "Technical Approach", linia 42             │
│                                                                 │
│  Problem:                                                       │
│    Decyzja faworyzuje agenta kosztem użytkownika               │
│                                                                 │
│  Sugestia:                                                      │
│    Uzasadnij dlaczego prostsze jest lepsze dla użytkownika    │
└─────────────────────────────────────────────────────────────────┘

Przechodzę do fazy TWORZENIE z powyższą listą poprawek...
(naciśnij ENTER aby kontynuować)
```

### Integration with ACT Phase

When ACT receives fix handoff, it:

1. **Loads the original artifact** with its current content
2. **Displays fix list** at the top of the editing context
3. **Highlights** the specific lines/sections that need fixes
4. **Re-runs only the failed methods** after fixes are applied

See: `step-03-act.md` section "Phase 3.7: Fix Mode"

## Decision Logic

### Verdict Rules

| Condition | Verdict |
|-----------|---------|
| Any BLOCK_ON_FAIL fails | FAILED |
| Semantic hash violation | FAILED |
| Only FLAG_ON_FAIL warnings | CONDITIONAL |
| All checks pass | COMMITTED |

## Output

The VALIDATE phase produces:
1. **Validation Report** with all method results
2. **Verdict** (COMMITTED, FAILED, or CONDITIONAL)
3. **Action items** if FAILED

## State Update

```
[UPDATE_STATE]
{
  "saga_id": "{current_saga}",
  "operations": [
    {"type": "VALIDATE", "target": "{dp_id}", "result": "{verdict}"}
  ],
  "flag_stale": []
}
[/UPDATE_STATE]
```

## Next Step

- **COMMITTED:** Proceed to **Step 05: SYNC**
- **FAILED:** Return to **Step 03: ACT** with fixes
- **CONDITIONAL:** Operator decides, then SYNC or ACT
