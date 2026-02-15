# Step Decision Point: Conflict Resolution (Rozwiązywanie konfliktów)

## Purpose / Cel

Prowadzenie użytkownika przez proces rozwiązywania wykrytych sprzeczności.
Gdy system wykryje konflikt (metoda #154), tworzy Decision Point i czeka na wybór użytkownika.

## Trigger / Wyzwalacz

- Wybór [2] Decyzje z menu PRZEGLĄD (SENSE)
- Wybór [D] Przejdź do decyzji z ekranu konfliktu w fazie ACT
- Artefakt w statusie AWAITING_USER_INPUT

## Execution / Wykonanie

### Phase DP.1: List Pending Decisions / Lista oczekujących decyzji

Gdy więcej niż jeden punkt decyzji:

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: DECYZJA] [Oczekujące: {count}]                          │
└─────────────────────────────────────────────────────────────────┘

PUNKTY DECYZJI — wybierz do rozwiązania

{for each decision_point where status = AWAITING_USER_INPUT}
  [{index}] {dp_id}: {short_description}
      Wykryto przez: {detecting_method_pl} (#{method_number})
      Blokuje: {blocked_artifacts_count} artefaktów
      Utworzono: {created_at}
{end}

Dostępne akcje:
[numer] Wybierz punkt decyzji do rozwiązania
[H] Pomoc    - Wyjaśnienie punktów decyzji
[Q] Wróć     - Powrót do przeglądu

Wpisz numer:
```

### Phase DP.2: Show Decision Point / Pokaż punkt decyzji

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: DECYZJA] [Punkt: {dp_id}]                               │
└─────────────────────────────────────────────────────────────────┘

⚠️  WYMAGANA DECYZJA

{decision_point.question.prompt}

Wykryto przez: {detecting_method_pl} (metoda #{method_number})

┌─ Źródło A: {source_a.name} ({source_a.path}) ──────────────────┐
│                                                                 │
│  "{quoted_text_a}"                                              │
│                                                                 │
│  Kluczowy fakt: "{source_a.relevant_semantic_hash_fact}"        │
└─────────────────────────────────────────────────────────────────┘

┌─ Źródło B: {source_b.name} ({source_b.path}) ──────────────────┐
│                                                                 │
│  "{quoted_text_b}"                                              │
│                                                                 │
│  Kluczowy fakt: "{source_b.relevant_semantic_hash_fact}"        │
└─────────────────────────────────────────────────────────────────┘

ANALIZA KONFLIKTU:
{detailed_explanation_why_these_conflict_in_polish}

════════════════════════════════════════════════════════════════════

DOSTĘPNE OPCJE:

{for each option in decision_point.options}
[{option.id}] {option.label}

    {option.description}

    Wpływ:
    {for each impact in option.impacts}
      • {impact.action_pl}: {impact.target_path}
        {if impact.changes_semantic_hash}
        ⚠️  Zmieni kluczowe fakty w tym pliku
        {end}
    {end}

{end}

════════════════════════════════════════════════════════════════════

Dostępne akcje:
{for each option}
[{option.id}] Wybierz opcję {option.id}
{end}
[D] Szczegóły    - Zobacz pełną analizę obu źródeł
[C] Porównaj     - Porównanie opcji obok siebie
[H] Pomoc        - Wyjaśnienie punktów decyzji
[Q] Odłóż        - Wróć do przeglądu (decyzja pozostanie)

Wpisz wybór:
```

### Phase DP.3: Option Details / Szczegóły opcji (gdy [D])

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: DECYZJA] [Widok: SZCZEGÓŁY]                             │
└─────────────────────────────────────────────────────────────────┘

ANALIZA SZCZEGÓŁOWA

📂 Loading full content: {source_a.path}
📂 Loading full content: {source_b.path}

┌─ ŹRÓDŁO A: {source_a.name} ─────────────────────────────────────┐
│                                                                 │
│  Typ: {source_a.dp_type}                                        │
│  Status: {source_a.dp_status_pl}                                │
│  Ostatnia zmiana: {source_a.modified_at}                        │
│                                                                 │
│  Kluczowe fakty:                                                │
│  {for each fact in source_a.semantic_hash}                      │
│    • "{fact}"                                                   │
│  {end}                                                          │
│                                                                 │
│  Relevantna sekcja:                                             │
│  ───────────────────────────────────────────────────────────────│
│  {relevant_section_content_from_a}                              │
│  ───────────────────────────────────────────────────────────────│
└─────────────────────────────────────────────────────────────────┘

┌─ ŹRÓDŁO B: {source_b.name} ─────────────────────────────────────┐
│                                                                 │
│  Typ: {source_b.dp_type}                                        │
│  Status: {source_b.dp_status_pl}                                │
│  Ostatnia zmiana: {source_b.modified_at}                        │
│                                                                 │
│  Kluczowe fakty:                                                │
│  {for each fact in source_b.semantic_hash}                      │
│    • "{fact}"                                                   │
│  {end}                                                          │
│                                                                 │
│  Relevantna sekcja:                                             │
│  ───────────────────────────────────────────────────────────────│
│  {relevant_section_content_from_b}                              │
│  ───────────────────────────────────────────────────────────────│
└─────────────────────────────────────────────────────────────────┘

DLACZEGO TO JEST KONFLIKT?

{extended_analysis_of_conflict}

Metoda #{method_number} ({method_name}) wykryła, że:
  • {specific_contradiction_explanation}

Naciśnij ENTER aby wrócić do wyboru opcji...
```

### Phase DP.4: Compare Options / Porównanie opcji (gdy [C])

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: DECYZJA] [Widok: PORÓWNANIE]                            │
└─────────────────────────────────────────────────────────────────┘

PORÓWNANIE OPCJI

┌─────────────────────────────┬─────────────────────────────────────┐
│  OPCJA A                    │  OPCJA B                            │
├─────────────────────────────┼─────────────────────────────────────┤
│  {option_a.label}           │  {option_b.label}                   │
├─────────────────────────────┼─────────────────────────────────────┤
│  Zmieni:                    │  Zmieni:                            │
│  • {file_1}                 │  • {file_1}                         │
│  • {file_2}                 │  • {file_2}                         │
├─────────────────────────────┼─────────────────────────────────────┤
│  Kluczowe fakty:            │  Kluczowe fakty:                    │
│  {how_facts_change_a}       │  {how_facts_change_b}               │
├─────────────────────────────┼─────────────────────────────────────┤
│  Konsekwencje:              │  Konsekwencje:                      │
│  • {consequence_a_1}        │  • {consequence_b_1}                │
│  • {consequence_a_2}        │  • {consequence_b_2}                │
├─────────────────────────────┼─────────────────────────────────────┤
│  Artefakty do aktualizacji: │  Artefakty do aktualizacji:         │
│  {count_a}                  │  {count_b}                          │
└─────────────────────────────┴─────────────────────────────────────┘

Naciśnij ENTER aby wrócić do wyboru opcji...
```

### Phase DP.5: Confirm Choice / Potwierdzenie wyboru

Po wybraniu opcji [A], [B], etc.:

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: DECYZJA] [Status: POTWIERDZENIE]                        │
└─────────────────────────────────────────────────────────────────┘

POTWIERDZENIE WYBORU

Wybrałeś opcję [{selected_option.id}]: {selected_option.label}

Ta decyzja spowoduje:

1. ZMIANY W PLIKACH:
{for each impact}
   • {impact.target_path}
     Akcja: {impact.action_pl}
     {if impact.changes_semantic_hash}
     Nowy kluczowy fakt: "{impact.new_fact}"
     Zastępuje: "{impact.old_fact}"
     {end}
{end}

2. ARTEFAKTY DO AKTUALIZACJI:
   Po tej zmianie {stale_count} artefaktów zostanie oznaczonych
   jako "do aktualizacji" ponieważ zależą od zmienionych plików:
{for each dependent}
   • {dependent.name}
{end}

3. ROZWIĄZANIE KONFLIKTU:
   Punkt decyzji {dp_id} zostanie oznaczony jako RESOLVED.

════════════════════════════════════════════════════════════════════

Czy na pewno chcesz kontynuować?

[Y] Tak, wykonaj    - Zastosuj zmiany
[N] Nie, wróć       - Wróć do wyboru opcji
[H] Pomoc           - Wyjaśnienie co się stanie

Wpisz wybór [Y/n]:
```

### Phase DP.6: Execute Resolution / Wykonanie rozwiązania

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: DECYZJA] [Status: WYKONYWANIE]                          │
└─────────────────────────────────────────────────────────────────┘

WYKONYWANIE DECYZJI...

{for each impact}
📂 Loading {impact.target_path}...

{if impact.action = "UPDATE_SEMANTIC_HASH"}
  Aktualizacja kluczowych faktów:
    - Usuwam: "{impact.old_fact}"
    + Dodaję: "{impact.new_fact}"
{end}

{if impact.action = "UPDATE_CONTENT"}
  Aktualizacja treści:
    Sekcja: {impact.section}
    Zmiana: {impact.change_description}
{end}

  Tworzenie kopii zapasowej: .deep-process/backups/{filename}_{timestamp}.md
  Zapisywanie zmian...
  ✅ Zapisano: {impact.target_path}

{end}

📂 Updating `.deep-process/state.json`...
  • Oznaczam {dp_id} jako RESOLVED
  • Flaguję {stale_count} artefaktów jako STALE

✅ DECYZJA WYKONANA
```

### Phase DP.7: Completion / Zakończenie

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.6                                              │
│  [Faza: DECYZJA] [Status: ZAKOŃCZONO]                           │
└─────────────────────────────────────────────────────────────────┘

✅ KONFLIKT ROZWIĄZANY

Punkt decyzji: {dp_id}
Wybrana opcja: [{selected_option.id}] {selected_option.label}

Zastosowane zmiany:
{for each impact}
  ✅ {impact.target_path} — {impact.action_pl}
{end}

{if stale_count > 0}
⚠️  {stale_count} artefaktów wymaga aktualizacji:
{for each dependent}
   • {dependent.name}
{end}

Wybierz [1] Aktualizuj w menu głównym aby odświeżyć te artefakty.
{end}

{if more_decisions_pending}
ℹ️  Pozostało {remaining_count} punktów decyzji do rozwiązania.
{end}

────────────────────────────────────────────────────────────────────

Powrót do przeglądu za 3 sekundy...
(lub naciśnij ENTER aby przejść natychmiast)
```

## Decision Point Schema / Schemat punktu decyzji

Każdy Decision Point w state.json ma strukturę:

```json
{
  "dp_id": "DP-005",
  "dp_type": "decision-point",
  "dp_status": "AWAITING_USER_INPUT",
  "created_at": "2026-02-04T10:30:00Z",
  "detecting_method": 154,
  "question": {
    "type": "EXCLUSIVE_CHOICE",
    "prompt": "Wizja zakłada 'Szybki MVP', a Architektura 'Mikroserwisy'. To sprzeczne.",
    "sources": {
      "a": {
        "path": "artifacts/vision.md",
        "quote": "Priorytet: Szybki MVP w 2 miesiące",
        "semantic_hash_fact": "Timeline: MVP w 2 miesiące"
      },
      "b": {
        "path": "artifacts/architecture.md",
        "quote": "Architektura: System oparty na mikroserwisach",
        "semantic_hash_fact": "Architektura: Mikroserwisy"
      }
    }
  },
  "options": [
    {
      "id": "A",
      "label": "Zmień na Monolit (Zgodność z MVP)",
      "description": "Architektura zostanie uproszczona do monolitu, co pozwoli na szybsze wdrożenie.",
      "impacts": [
        {
          "target_path": "artifacts/architecture.md",
          "action": "UPDATE_SEMANTIC_HASH",
          "old_fact": "Architektura: Mikroserwisy",
          "new_fact": "Architektura: Monolit"
        }
      ]
    },
    {
      "id": "B",
      "label": "Wydłuż czas (Zgodność z Mikroserwisami)",
      "description": "Zachowaj mikroserwisy, ale dostosuj harmonogram do 4-6 miesięcy.",
      "impacts": [
        {
          "target_path": "artifacts/vision.md",
          "action": "UPDATE_SEMANTIC_HASH",
          "old_fact": "Timeline: MVP w 2 miesiące",
          "new_fact": "Timeline: MVP w 4-6 miesięcy"
        },
        {
          "target_path": "artifacts/timeline.md",
          "action": "UPDATE_CONTENT",
          "section": "Milestone 1",
          "change_description": "Przesunięcie deadline z 2 na 4-6 miesięcy"
        }
      ]
    }
  ],
  "resolution": null
}
```

Po rozwiązaniu:

```json
{
  "dp_status": "RESOLVED",
  "resolution": {
    "selected_option": "A",
    "resolved_at": "2026-02-04T11:15:00Z",
    "resolved_by": "operator"
  }
}
```

## Help Content / Pomoc

```
┌─────────────────────────────────────────────────────────────────┐
│  POMOC — Punkty decyzji                                         │
└─────────────────────────────────────────────────────────────────┘

CO TO JEST PUNKT DECYZJI?
  Miejsce gdzie system wykrył sprzeczność między dokumentami
  i potrzebuje Twojego wyboru aby kontynuować.

DLACZEGO SYSTEM NIE ROZWIĄZUJE SAM?
  Deep-Process nigdy nie zgaduje. Gdy dwa dokumenty mówią
  różne rzeczy, tylko Ty wiesz która wersja jest prawidłowa.
  System może tylko pokazać opcje i ich konsekwencje.

JAK POWSTAJĄ PUNKTY DECYZJI?
  1. Podczas tworzenia artefaktu metoda #154 skanuje źródła
  2. Jeśli znajdzie fakty które się wykluczają — tworzy DP
  3. Artefakt nie może być dokończony bez rozwiązania DP

CO OZNACZAJĄ OPCJE?
  Każda opcja to jeden sposób rozwiązania konfliktu:
  • Opcja może zmienić treść jednego lub więcej dokumentów
  • Opcja może zmienić kluczowe fakty (semantic_hash)
  • System pokazuje dokładnie CO się zmieni po wyborze

CO SIĘ DZIEJE PO WYBORZE?
  1. System zmieni wskazane pliki
  2. Utworzy kopie zapasowe (na wszelki wypadek)
  3. Oznaczy zależne artefakty jako "do aktualizacji"
  4. Punkt decyzji zostanie zamknięty

CZY MOGĘ ODŁOŻYĆ DECYZJĘ?
  Tak! Wpisz [Q] aby wrócić do przeglądu.
  Punkt decyzji pozostanie otwarty do momentu rozwiązania.
  Ale artefakty które go potrzebują będą zablokowane.

CZY MOGĘ ZMIENIĆ DECYZJĘ PÓŹNIEJ?
  Tak, ale pośrednio:
  1. Edytuj dokument który został zmieniony
  2. Jeśli wprowadzisz sprzeczność — powstanie nowy DP
  3. Kopie zapasowe pozwalają przywrócić poprzedni stan

Naciśnij ENTER aby wrócić...
```

## State Update / Aktualizacja stanu

```
[UPDATE_STATE]
{
  "saga_id": "tx-{new_id}",
  "operations": [
    {
      "type": "RESOLVE_DECISION_POINT",
      "target": "{dp_id}",
      "selected_option": "{option.id}",
      "impacts": [
        {"path": "{path_1}", "action": "{action_1}"},
        {"path": "{path_2}", "action": "{action_2}"}
      ]
    },
    {
      "type": "UPDATE",
      "target": "{impacted_artifact_1}",
      "path": "{path_1}"
    }
  ],
  "flag_stale": ["{dependent_1}", "{dependent_2}"]
}
[/UPDATE_STATE]
```

## Integration / Integracja

### Powiązanie z step-01-sense.md

W menu PRZEGLĄD gdy są oczekujące decyzje:
```
🔔 {count} decyzji czeka na Twój wybór.

[2] Decyzje         - Rozstrzygnij punkty decyzji
```

### Powiązanie z step-03-act.md

Gdy ACT wykryje konflikt:
```
[D] Przejdź do decyzji - Zobacz opcje rozwiązania konfliktu
```

Po wybraniu [D] → załaduj i wykonaj step-decision-point.md

### Powiązanie z pm-agent.yaml

Dodaj w sekcji commands:
```yaml
commands:
  decision:
    trigger: ["decision", "d", "decide"]
    action: "resolve_decision_point"
    description: "Resolve pending decision point"
    file: "steps/step-decision-point.md"
```

## Next Step / Następny krok

Po rozwiązaniu punktu decyzji:
- Powrót do **Step 01: SENSE** z zaktualizowanym statusem
- Artefakty zależne są oznaczone jako STALE
- Użytkownik może kontynuować pracę lub rozwiązać kolejne DP
