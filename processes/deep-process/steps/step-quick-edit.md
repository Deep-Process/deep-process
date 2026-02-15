# Quick Edit Mode (Tryb szybkiej edycji)

## Purpose / Cel

Umożliwia małe zmiany w artefaktach bez przechodzenia pełnej pętli 5 faz.
Dla drobnych poprawek, literówek, aktualizacji pojedynczych wartości.

## When to Use / Kiedy używać

Quick Edit jest dostępny gdy:
- Zmiana dotyczy **jednego artefaktu**
- Zmiana jest **kosmetyczna** (literówki, formatowanie, drobne poprawki tekstu)
- Zmiana **nie wpływa na semantic_hash** (nie zmienia kluczowych faktów)
- Artefakt ma status **COMMITTED** (jest już zatwierdzony)

Quick Edit **NIE jest dostępny** gdy:
- Zmiana wpływa na kluczowe fakty (semantic_hash)
- Artefakt ma zależności które mogą być naruszone
- Zmiana wymaga walidacji metodami weryfikacji
- Artefakt jest w statusie STALE, BLOCKED lub FAILED

## Trigger / Wyzwalacz

Z ekranu PRZEGLĄD (SENSE):
```
[E] Szybka edycja  - Drobne poprawki bez pełnej walidacji
```

## Execution / Wykonanie

### Phase E.1: Select Artifact / Wybór artefaktu

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Narzędzie: SZYBKA EDYCJA] [Proces: {process_name}]                 │
└─────────────────────────────────────────────────────────────────┘

SZYBKA EDYCJA — wybierz artefakt do edycji

Dostępne artefakty (tylko COMMITTED):
{for each artifact where status = COMMITTED}
  [{index}] {artifact_name}
      Ścieżka: {artifact.path}
      Ostatnia zmiana: {artifact.modified_at}
{end}

{if no COMMITTED artifacts}
⚠️  Brak artefaktów dostępnych do szybkiej edycji.
    Szybka edycja wymaga artefaktów w statusie COMMITTED.
{end}

Dostępne akcje:
[numer] Wybierz artefakt do edycji
[H] Pomoc    - Wyjaśnienie trybu szybkiej edycji
[Q] Wróć     - Powrót do przeglądu

Wpisz numer artefaktu:
```

### Phase E.2: Show Current Content / Pokaż aktualną treść

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Narzędzie: SZYBKA EDYCJA] [Artefakt: {artifact_name}]              │
└─────────────────────────────────────────────────────────────────┘

📂 Loading artifact: {artifact.path}

AKTUALNA TREŚĆ:

┌─ Kluczowe fakty (NIE MOŻNA ZMIENIĆ w Quick Edit) ───────────────┐
{for each fact in semantic_hash}
│  • "{fact}"                                                     │
{end}
└─────────────────────────────────────────────────────────────────┘

┌─ Treść (można edytować) ────────────────────────────────────────┐
{artifact content with line numbers}
└─────────────────────────────────────────────────────────────────┘

Dostępne akcje:
[L] Zmień linię    - Podaj numer linii i nową treść
[D] Dodaj tekst    - Dodaj tekst po wskazanej linii
[R] Usuń linię     - Usuń wskazaną linię
[P] Podgląd        - Zobacz zmiany przed zapisaniem
[S] Zapisz         - Zapisz zmiany (z mini-walidacją)
[H] Pomoc          - Wyjaśnienie opcji edycji
[Q] Anuluj         - Odrzuć zmiany i wróć

Wpisz akcję:
```

### Phase E.3: Edit Operations / Operacje edycji

#### [L] Change Line / Zmiana linii

```
ZMIANA LINII

Podaj numer linii do zmiany: _

Aktualna treść linii {n}:
> "{current_line_content}"

Nowa treść linii {n}:
> _

[ENTER] Zatwierdź | [Q] Anuluj
```

#### [D] Add Text / Dodawanie tekstu

```
DODAWANIE TEKSTU

Dodaj tekst po linii numer: _

Nowa treść (ENTER aby zakończyć):
> _

[ENTER] Zatwierdź | [Q] Anuluj
```

#### [R] Remove Line / Usuwanie linii

```
USUWANIE LINII

Podaj numer linii do usunięcia: _

Linia do usunięcia:
> "{line_content}"

Czy na pewno usunąć? [Y/n]:
```

### Phase E.4: Preview Changes / Podgląd zmian

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Narzędzie: SZYBKA EDYCJA] [Status: PODGLĄD ZMIAN]                  │
└─────────────────────────────────────────────────────────────────┘

PODGLĄD ZMIAN

Plik: {artifact.path}
Liczba zmian: {change_count}

┌─ Zmiany ────────────────────────────────────────────────────────┐
{for each change}
Linia {line_number}:
  - BYŁO:  "{old_content}"
  + JEST:  "{new_content}"
{end}
└─────────────────────────────────────────────────────────────────┘

Dostępne akcje:
[S] Zapisz zmiany   - Wykonaj mini-walidację i zapisz
[E] Edytuj dalej    - Wróć do edycji
[Q] Anuluj          - Odrzuć wszystkie zmiany

Wpisz akcję:
```

### Phase E.5: Mini-Validation / Mini-walidacja

Quick Edit wykonuje uproszczoną walidację:

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Narzędzie: SZYBKA EDYCJA] [Status: MINI-WALIDACJA]                 │
└─────────────────────────────────────────────────────────────────┘

MINI-WALIDACJA (Quick Edit)

Sprawdzam...

[1/3] Czy semantic_hash pozostał nienaruszony?
      📂 Comparing semantic_hash facts with content...
      {for each fact}
        • "{fact}" — {FOUND/NOT_FOUND}
      {end}
      Wynik: {PASS/FAIL}

[2/3] Czy struktura dokumentu jest poprawna?
      • YAML header: {VALID/INVALID}
      • Markdown syntax: {VALID/INVALID}
      Wynik: {PASS/FAIL}

[3/3] Czy nie wprowadzono nowych sprzeczności?
      📂 Quick scan for obvious conflicts...
      Wynik: {PASS/FAIL}

═══════════════════════════════════════════════════════════════════

{if ALL PASS}
✅ MINI-WALIDACJA ZALICZONA

Zmiany są bezpieczne do zapisania.
Pełna walidacja zostanie pominięta.

Zapisać zmiany? [Y/n]:
{end}

{if ANY FAIL}
❌ MINI-WALIDACJA NIE ZALICZONA

Wykryto problemy:
{for each failed check}
  • {problem_description}
{end}

Quick Edit nie może być użyty dla tych zmian.
Użyj pełnej pętli edycji (wybierz artefakt z menu głównego).

[Q] Wróć do przeglądu
{end}
```

### Phase E.6: Quick Save / Szybki zapis

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Narzędzie: SZYBKA EDYCJA] [Status: ZAPISYWANIE]                    │
└─────────────────────────────────────────────────────────────────┘

SZYBKI ZAPIS

📂 Creating backup: .deep-process/backups/{artifact_id}_{timestamp}.md
📂 Writing changes to: {artifact.path}
📂 Updating `.deep-process/state.json` (modified_at only)

✅ ZMIANY ZAPISANE

Artefakt: {artifact_name}
Ścieżka: {artifact.path}
Status: COMMITTED (bez zmian)
Liczba zmian: {change_count}

⚠️  UWAGA: Quick Edit nie flaguje zależnych artefaktów jako STALE.
    Jeśli Twoje zmiany wpływają na inne dokumenty, użyj pełnej edycji.

Powrót do przeglądu za 2 sekundy...
```

## State Update / Aktualizacja stanu

Quick Edit aktualizuje tylko:
- `modified_at` w node
- NIE zmienia `status` (pozostaje COMMITTED)
- NIE flaguje dependents jako STALE
- NIE tworzy nowej transakcji (saga)

```
[UPDATE_STATE]
{
  "saga_id": null,
  "operations": [
    {
      "type": "QUICK_EDIT",
      "target": "{dp_id}",
      "path": "{artifact.path}",
      "changes": {change_count},
      "full_validation_skipped": true
    }
  ],
  "flag_stale": []
}
[/UPDATE_STATE]
```

## Integration with SENSE Menu / Integracja z menu PRZEGLĄD

Dodaj do step-01-sense.md w sekcji menu:

```
Dostępne akcje:
[1] Aktualizuj      - Odśwież artefakty wymagające aktualizacji
[2] Decyzje         - Przeglądaj i rozstrzygaj punkty decyzji
[3] Błędy           - Zobacz artefakty z błędami walidacji
[4] Nowy artefakt   - Utwórz nowy dokument (pełna pętla)
[5] Zmień proces    - Przełącz na inną instancję procesu
[E] Szybka edycja   - Drobne poprawki bez pełnej walidacji ← NOWE
[A] Audyt           - Uruchom pełną weryfikację systemu
[X] Zmień tryb      - Przełącz tryb wyświetlania ← NOWE
[H] Pomoc           - Wyjaśnienie opcji i pojęć
[Q] Wyjdź           - Zapisz stan i zakończ
```

## Help Content / Pomoc

```
┌─────────────────────────────────────────────────────────────────┐
│  POMOC — Szybka edycja (Quick Edit)                             │
└─────────────────────────────────────────────────────────────────┘

CO TO JEST SZYBKA EDYCJA?
  Tryb do drobnych poprawek bez przechodzenia pełnej walidacji.
  Idealny do: literówek, formatowania, drobnych zmian tekstu.

KIEDY UŻYWAĆ?
  ✅ Poprawka literówki
  ✅ Zmiana formatowania
  ✅ Aktualizacja daty/wersji
  ✅ Drobne poprawki stylistyczne

KIEDY NIE UŻYWAĆ?
  ❌ Zmiana kluczowych faktów (semantic_hash)
  ❌ Dodawanie nowych sekcji
  ❌ Zmiany wpływające na inne dokumenty
  ❌ Zmiany wymagające walidacji

CO SIĘ DZIEJE W QUICK EDIT?
  1. Mini-walidacja sprawdza czy zmiany są bezpieczne
  2. Jeśli tak — zapis bez pełnej pętli
  3. Jeśli nie — system kieruje do pełnej edycji

CZY TO BEZPIECZNE?
  Tak, ale z ograniczeniami:
  • Zmiany nie są w pełni walidowane
  • Zależne artefakty nie są flagowane
  • Backup jest tworzony na wszelki wypadek

Naciśnij ENTER aby wrócić...
```

## Restrictions / Ograniczenia

Quick Edit **BLOKUJE** zapis jeśli:

1. **Semantic hash violation** — zmiana naruszyła któryś z kluczowych faktów
2. **YAML header corrupted** — edycja uszkodziła nagłówek
3. **New content conflicts** — wprowadzono oczywiste sprzeczności
4. **Artifact not COMMITTED** — artefakt nie jest w stanie zatwierdzonym

W tych przypadkach użytkownik musi użyć pełnej pętli edycji.
