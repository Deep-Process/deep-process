# Step Audit: Full System Verification (Pełna weryfikacja systemu)

## Purpose / Cel

Wykonanie pełnej weryfikacji spójności wszystkich artefaktów w systemie.
Uruchamia Validator Agent na całym grafie zależności.

## Trigger / Wyzwalacz

- Wybór [A] Audyt z menu PRZEGLĄD (SENSE)
- Jawne polecenie "audit" lub "weryfikuj"

## Execution / Wykonanie

### Phase A.1: Load Context / Ładowanie kontekstu

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Narzędzie: AUDYT] [Proces: {process_name}]                    │
└─────────────────────────────────────────────────────────────────┘

AUDYT SYSTEMU — Pełna weryfikacja spójności

📂 Loading `.deep-process/state.json`
📂 Loading `.deep-process/registry.json`
📂 Loading `agents/validator-agent.yaml`

Znalezione artefakty: {total_count}
  • COMMITTED: {committed_count}
  • STALE: {stale_count}
  • BLOCKED: {blocked_count}
  • FAILED: {failed_count}
  • NOW: {now_count}

Rozpocząć pełny audyt? To może zająć chwilę.

Dostępne akcje:
[Y] Tak, rozpocznij   - Uruchom pełną weryfikację
[S] Tylko COMMITTED   - Sprawdź tylko zatwierdzone artefakty
[H] Pomoc             - Wyjaśnienie audytu
[Q] Anuluj            - Wróć do przeglądu

Wpisz wybór:
```

### Phase A.2: Graph Traversal / Przejście grafu

Dla każdego artefaktu w kolejności topologicznej (od korzeni do liści):

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Narzędzie: AUDYT] [Postęp: {current}/{total}]                 │
└─────────────────────────────────────────────────────────────────┘

AUDYT W TOKU...

Aktualnie sprawdzany: {artifact_name}
Ścieżka: {artifact.path}

[████████████░░░░░░░░] {percentage}%

Dotychczasowe wyniki:
  ✅ Zaliczone:    {pass_count}
  ⚠️  Ostrzeżenia: {warning_count}
  ❌ Błędy:        {error_count}

(Naciśnij [Q] aby przerwać audyt)
```

### Phase A.3: Per-Artifact Validation / Walidacja każdego artefaktu

Dla każdego artefaktu wykonaj:

```markdown
## Artifact Validation: {dp_id}

📂 Loading artifact: {path}

### 1. Structural Checks / Sprawdzenia strukturalne

| Check | Result |
|-------|--------|
| YAML header present | {✅/❌} |
| YAML header valid | {✅/❌} |
| dp_id matches filename | {✅/❌} |
| version = 3.6 | {✅/❌} |

### 2. Dependency Checks / Sprawdzenia zależności

| Dependency | Exists | Status | Hash Match |
|------------|--------|--------|------------|
| {dep_1.path} | {✅/❌} | {status} | {✅/❌/N/A} |
| {dep_2.path} | {✅/❌} | {status} | {✅/❌/N/A} |

### 3. Semantic Hash Verification / Weryfikacja kluczowych faktów

| # | Fact | Found in Content | Status |
|---|------|------------------|--------|
| 1 | "{fact_1}" | Line {n}: "{quote}" | {✅/❌} |
| 2 | "{fact_2}" | Line {n}: "{quote}" | {✅/❌} |

### 4. Coherence Methods (Subset) / Metody spójności (wybrane)

#### #100 Vocabulary Consistency
- Synonyms found: {list or "none"}
- Homonyms found: {list or "none"}
- Result: {PASS/FLAG}

#### #93 DNA Inheritance Check
- Naming convention: {MATCH/MISMATCH}
- Structure pattern: {MATCH/MISMATCH}
- Result: {PASS/FLAG}

### Artifact Result: {PASS / WARNING / FAIL}

{if FAIL}
Required fixes:
  1. {fix_description_1}
  2. {fix_description_2}
{end}
```

### Phase A.4: Cross-Artifact Checks / Sprawdzenia między artefaktami

Po sprawdzeniu wszystkich artefaktów indywidualnie:

```markdown
## Cross-Artifact Analysis

### Method #99: Multi-Artifact Coherence

📂 Loading method: `data/method-procedures/099_Multi_Artifact_Coherence.md`

#### Reference Integrity
| Source | References | Target Exists | Status |
|--------|------------|---------------|--------|
| {artifact_1} | {ref} | {✅/❌} | {OK/BROKEN} |

#### Naming Consistency
| Concept | Used In | Variations | Status |
|---------|---------|------------|--------|
| {concept} | {artifacts} | {variations} | {CONSISTENT/INCONSISTENT} |

#### Duplication Drift
| Information | Found In | Consistent | Status |
|-------------|----------|------------|--------|
| {info} | {artifact_1}, {artifact_2} | {✅/❌} | {OK/DRIFT} |

### Method #159: Transitive Dependency Closure

📂 Loading method: `data/method-procedures/159_Transitive_Dependency_Closure.md`

#### Cycle Detection
{if cycles found}
⚠️  CYCLES DETECTED:
  • {A} → {B} → {C} → {A}
{else}
✅ No cycles detected
{end}

#### Missing Dependencies
{if missing}
❌ MISSING DEPENDENCIES:
  • {artifact} references {missing_path} which does not exist
{else}
✅ All dependencies resolved
{end}

#### Transitive Conflicts
{if conflicts}
⚠️  TRANSITIVE CONFLICTS:
  • {A} conflicts with {C} through {B}
    - {A}.semantic_hash: "{fact_a}"
    - {C}.semantic_hash: "{fact_c}"
{else}
✅ No transitive conflicts
{end}
```

### Phase A.5: Audit Report / Raport audytu

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Narzędzie: AUDYT] [Status: ZAKOŃCZONO]                        │
└─────────────────────────────────────────────────────────────────┘

RAPORT AUDYTU

════════════════════════════════════════════════════════════════════

Sprawdzone artefakty: {total_count}
Czas trwania:         {duration}

┌──────────────────────┬───────────────────────────────────────────┐
│ Kategoria            │ Wynik                                     │
├──────────────────────┼───────────────────────────────────────────┤
│ Struktura            │ {pass}/{total} ✅                         │
│ Zależności           │ {pass}/{total} ✅                         │
│ Kluczowe fakty       │ {pass}/{total} ✅                         │
│ Spójność słownictwa  │ {pass}/{total} {emoji}                    │
│ Dziedziczenie wzorców│ {pass}/{total} {emoji}                    │
│ Integralność referencji│ {pass}/{total} {emoji}                  │
│ Cykle zależności     │ {status}                                  │
└──────────────────────┴───────────────────────────────────────────┘

{if all pass}
════════════════════════════════════════════════════════════════════
✅ AUDYT ZAKOŃCZONY POMYŚLNIE

System jest spójny. Wszystkie artefakty przeszły weryfikację.
════════════════════════════════════════════════════════════════════
{end}

{if warnings only}
════════════════════════════════════════════════════════════════════
⚠️  AUDYT ZAKOŃCZONY Z OSTRZEŻENIAMI

Wykryto {warning_count} ostrzeżeń (nie blokują pracy):
{for each warning}
  • [{artifact}] {warning_description}
{end}

Rozważ naprawę tych ostrzeżeń gdy będziesz miał czas.
════════════════════════════════════════════════════════════════════
{end}

{if errors}
════════════════════════════════════════════════════════════════════
❌ AUDYT WYKRYŁ PROBLEMY

Wykryto {error_count} błędów wymagających naprawy:

{for each error, grouped by artifact}
┌─ {artifact_name} ({artifact.path}) ────────────────────────────┐
│  ❌ {error_1_description}                                       │
│  ❌ {error_2_description}                                       │
└─────────────────────────────────────────────────────────────────┘
{end}

Zalecane działania:
{for each artifact with errors}
  {n}. Napraw {artifact_name}: użyj [4] Nowy artefakt lub [E] Szybka edycja
{end}
════════════════════════════════════════════════════════════════════
{end}

Dostępne akcje:
[R] Raport szczegółowy - Zobacz pełne wyniki każdego testu
[F] Napraw pierwszy    - Rozpocznij naprawę pierwszego błędu
[E] Eksportuj          - Zapisz raport do pliku
[H] Pomoc              - Wyjaśnienie wyników
[Q] Wróć               - Powrót do przeglądu

Wpisz wybór:
```

### Phase A.6: Detailed Report (Optional) / Raport szczegółowy

Gdy użytkownik wybierze [R]:

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Narzędzie: AUDYT] [Widok: RAPORT SZCZEGÓŁOWY]                 │
└─────────────────────────────────────────────────────────────────┘

RAPORT SZCZEGÓŁOWY — strona {page}/{total_pages}

{for each artifact on this page}
────────────────────────────────────────────────────────────────────
ARTEFAKT: {artifact_name}
Ścieżka:  {artifact.path}
Status:   {PASS/WARNING/FAIL}

Testy:
  [✅] Nagłówek YAML poprawny
  [✅] Zależności istnieją
  [✅] Kluczowe fakty zweryfikowane
  [⚠️] Spójność słownictwa: znaleziono synonim "user"/"użytkownik"
  [✅] Dziedziczenie wzorców

{if warnings or errors}
Szczegóły:
  • {detail_1}
  • {detail_2}
{end}
────────────────────────────────────────────────────────────────────
{end}

[N] Następna strona | [P] Poprzednia | [Q] Wróć do podsumowania
```

## Help Content / Pomoc

```
┌─────────────────────────────────────────────────────────────────┐
│  POMOC — Audyt systemu                                          │
└─────────────────────────────────────────────────────────────────┘

CO TO JEST AUDYT?
  Pełna weryfikacja spójności wszystkich artefaktów w systemie.
  Sprawdza czy dokumenty są poprawne, spójne między sobą,
  i czy nie ma ukrytych problemów.

CO SPRAWDZA AUDYT?

  1. STRUKTURA
     • Czy każdy plik ma poprawny nagłówek YAML
     • Czy wersja jest zgodna z systemem (v3.6)

  2. ZALEŻNOŚCI
     • Czy wszystkie wskazane pliki źródłowe istnieją
     • Czy nie ma cykli (A zależy od B, B od C, C od A)

  3. KLUCZOWE FAKTY
     • Czy treść dokumentu potwierdza zadeklarowane fakty
     • Czy fakty nie są ze sobą sprzeczne

  4. SPÓJNOŚĆ
     • Czy używane jest to samo słownictwo w całym systemie
     • Czy struktura dokumentów jest podobna
     • Czy referencje między dokumentami są poprawne

KIEDY URUCHOMIĆ AUDYT?
  • Po dłuższej przerwie w pracy
  • Przed ważnym kamieniem milowym
  • Gdy podejrzewasz niespójności
  • Regularnie, np. raz w tygodniu

CO ROBIĆ GDY AUDYT WYKRYJE BŁĘDY?
  1. Przeczytaj listę błędów
  2. Wybierz [F] aby naprawić pierwszy błąd
  3. Lub wróć do przeglądu i napraw ręcznie
  4. Uruchom audyt ponownie po naprawach

Naciśnij ENTER aby wrócić...
```

## State Update / Aktualizacja stanu

Audyt jest operacją tylko do odczytu — nie modyfikuje stanu.
Wyjątek: może flagować artefakty które wcześniej były COMMITTED a teraz mają błędy.

```
[UPDATE_STATE]
{
  "saga_id": null,
  "operations": [
    {
      "type": "AUDIT",
      "timestamp": "{ISO_TIMESTAMP}",
      "result": "{PASS/WARNING/FAIL}",
      "artifacts_checked": {count},
      "errors_found": {count},
      "warnings_found": {count}
    }
  ],
  "flag_stale": [{artifacts_with_errors}]
}
[/UPDATE_STATE]
```

## Error Handling / Obsługa błędów

| Błąd | Przyczyna | Rozwiązanie |
|------|-----------|-------------|
| Artifact not readable | Plik usunięty/przeniesiony | Usuń z state.json lub przywróć |
| Circular dependency | Cykl w grafie | Usuń jedną z zależności |
| Missing dependency | Wskazany plik nie istnieje | Utwórz brakujący plik lub usuń zależność |

## Integration / Integracja

### Powiązanie z pm-agent.yaml

```yaml
commands:
  audit:
    trigger: ["audit", "a"]
    action: "invoke_validator_full"
    description: "Run full system audit"
    file: "steps/step-audit.md"
```

### Powiązanie z step-01-sense.md

W menu PRZEGLĄD:
```
[A] Audyt           - Uruchom pełną weryfikację systemu
```

Po wybraniu [A] → załaduj i wykonaj step-audit.md

## Next Step / Następny krok

Po zakończeniu audytu:
- Powrót do **Step 01: SENSE** z zaktualizowanymi informacjami o błędach
- Jeśli wybrano [F] Napraw pierwszy → przejdź do odpowiedniego artefaktu
