# Step 05: SYNC Phase (Faza Zapisywania)

Reference: SPECIFICATION.md Section 5, Phase 5

## Purpose / Cel
Commit validated artifact to file system and update graph state.
Zapisanie zatwierdzonego artefaktu i aktualizacja grafu zależności.
Update version history and trigger extension if configured [v3.7].

## Trigger / Wyzwalacz
- VALIDATE phase returned COMMITTED verdict / Walidacja zwróciła ZATWIERDZONO
- VALIDATE phase returned CONDITIONAL and Operator approved / Warunkowo zatwierdzono i operator potwierdził

## Execution / Wykonanie

### Phase 5.1: Operator Confirmation / Potwierdzenie operatora

Present final artifact to Operator:

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.7                                              │
│  [Faza: ZAPISYWANIE] [Proces: {process_name}] [Artefakt: {dp_id}]│
└─────────────────────────────────────────────────────────────────┘

POTWIERDZENIE ZAPISU

Artefakt:     {dp_id}
Ścieżka:      {file_path}
Werdykt:      {verdict_pl}

┌─ Podgląd nagłówka ──────────────────────────────────────────────┐
│  dp_id: "{dp_id}"                                               │
│  dp_type: "{dp_type}"                                           │
│  dp_status: "COMMITTED"                                         │
│  ...                                                            │
└─────────────────────────────────────────────────────────────────┘

┌─ Podgląd treści (pierwsze 10 linii) ────────────────────────────┐
│  {First 10 lines of content}                                    │
│  ...                                                            │
└─────────────────────────────────────────────────────────────────┘

Kluczowe fakty (semantic hash):
{for each fact}
  • "{fact}"
{end}

Podsumowanie walidacji:
  ✅ Obiektywność    - zaliczone
  ✅ Spójność        - zaliczone
  ✅ Kluczowe fakty  - zweryfikowane

{if CONDITIONAL}
⚠️  Udokumentowane ostrzeżenia:
  • {warning_1_pl}
  • {warning_2_pl}
{end}

Dostępne akcje:
[Y] Zapisz          - Zapisz plik i zaktualizuj graf zależności
[V] Zobacz pełny    - Pokaż całą treść artefaktu
[H] Pomoc           - Wyjaśnienie tego kroku
[N] Anuluj          - NIE zapisuj, wróć do przeglądu

Zapisać plik? [Y/n]:
```

### Phase 5.2: File Write

Upon confirmation, write artifact:

```markdown
## File Write

Writing to: {file_path}

{if file exists}
  Creating backup: .deep-process/backups/{dp_id}_{timestamp}.md
  Backup created ✅
{end}

Writing artifact...
Write complete ✅

Verifying write...
Checksum: {hash}
Verification: ✅
```

### Phase 5.3: State Update

Update `.deep-process/state.json` with committed artifact:

```markdown
## State Update

### Node Update

```json
{
  "dp_id": "{dp_id}",
  "dp_status": "COMMITTED",
  "modified_at": "{timestamp}",
  "semantic_hash": [{facts}]
}
```

### Edge Verification

Checking declared dependencies exist:
{for each in depends_on}
  - {path}: ✅ exists
{end}

### Dependent Flagging

Finding nodes that depend on {dp_id}:
{for each dependent}
  - {dependent.dp_id}: Flagging as STALE
{end}
```

### Phase 5.4: Transaction Commit

Close the saga transaction:

```markdown
## Transaction Commit

```json
{
  "saga_id": "{saga_id}",
  "status": "COMMITTED",
  "started_at": "{start_time}",
  "completed_at": "{now}",
  "operations": [
    {"type": "CREATE/UPDATE", "target": "{dp_id}", "path": "{path}"}
  ]
}
```

Transaction logged ✅
```

### Phase 5.5: Propagation [UPDATED v3.7]

Apply propagation modes and flag dependents:

```markdown
## Propagation

### Version Update [v3.7]

Updating artifact version:
  - Previous version: {current_version}
  - New version: {current_version + 1}
  - Adding to version_history: ✅

### Nodes depending on {dp_id}:

{for each dependent}
| Node | Dependency Type | Propagation Mode | New Status |
|------|-----------------|------------------|------------|
| {dep.dp_id} | {dep.type} | IMMEDIATE | STALE |
| {dep.dp_id} | {dep.type} | DEFERRED | STALE_DEFERRED |
| {dep.dp_id} | {dep.type} | VERSION_PINNED | (no change, pinned to v{N}) |
| {dep.dp_id} | {dep.type} | CONDITIONAL | {evaluated status} |
{end}

Total flagged STALE: {count_immediate}
Total flagged STALE_DEFERRED: {count_deferred}
Total unchanged (pinned): {count_pinned}
```

### Phase 5.6: Extension Trigger [NEW v3.7]

Check if auto-extension should trigger:

```markdown
## Extension Check

{if process.self_extension.auto_extend == true}
  Checking auto_extend configuration...

  {if artifact_type can_contain child types}
    Auto-extension available for:
    {for each allowed_child_type}
      - {child_type}
    {end}

    Prompt operator: "Add {child_type} under {dp_id}? [y/N]"
  {else}
    No child types available for this artifact type.
  {end}
{else}
  Auto-extension disabled for this process.
{end}
```

## State Update Block [UPDATED v3.7]

```
[UPDATE_STATE]
{
  "saga_id": "{saga_id}",
  "operations": [
    {
      "type": "COMMIT",
      "target": "{dp_id}",
      "path": "{file_path}",
      "backup_path": "{backup_path}",
      "new_version": {version_number}
    },
    {
      "type": "VERSION_HISTORY",
      "target": "{dp_id}",
      "version": {version_number},
      "semantic_hash": [{facts}],
      "committed_at": "{timestamp}",
      "change_summary": "{summary}"
    }
  ],
  "flag_stale": ["{immediate_deps}"],
  "flag_stale_deferred": ["{deferred_deps}"],
  "unchanged_pinned": ["{pinned_deps}"]
}
[/UPDATE_STATE]
```

## Output

The SYNC phase produces:
1. **Written artifact** in file system
2. **Backup** of previous version (if update)
3. **Updated `.deep-process/state.json`** with new status
4. **Version history entry** tracking the change [v3.7]
5. **STALE flags** on dependent nodes (IMMEDIATE propagation)
6. **STALE_DEFERRED flags** on deferred dependents [v3.7]
7. **Extension prompt** if auto_extend enabled [v3.7]

## Completion Display / Ekran zakończenia

```
┌─────────────────────────────────────────────────────────────────┐
│  DEEP-PROCESS v3.7                                              │
│  [Faza: ZAPISYWANIE] [Status: ZAKOŃCZONO]                       │
└─────────────────────────────────────────────────────────────────┘

✅ ZAPIS ZAKOŃCZONY POMYŚLNIE

Zapisany artefakt: {dp_id}
Ścieżka:          {file_path}
Status:           Gotowy (COMMITTED)

{if dependents_flagged > 0}
⚠️  {count} powiązanych artefaktów wymaga aktualizacji:
{for each}
   • {dependent.dp_id}
{end}

Wybierz [1] Aktualizuj w menu głównym aby odświeżyć te artefakty.
{end}

Transakcja: {saga_id} — zatwierdzona

───────────────────────────────────────────────────────────────────

Powrót do ekranu przeglądu za 3 sekundy...
(lub naciśnij ENTER aby przejść natychmiast)
```

### Help Content for SYNC Phase

When [H] is selected during confirmation:

```
┌─────────────────────────────────────────────────────────────────┐
│  POMOC — Faza zapisywania (SYNC)                                │
└─────────────────────────────────────────────────────────────────┘

GDZIE JESTEŚ?
  To ostatni krok przed zapisaniem artefaktu na dysk.
  Po zatwierdzeniu [Y] plik zostanie utworzony/zaktualizowany.

CO SIĘ STANIE PO ZAPISIE?
  1. Plik zostanie zapisany w podanej ścieżce
  2. Jeśli plik istniał, zostanie utworzona kopia zapasowa
  3. Graf zależności zostanie zaktualizowany
  4. Pliki zależne od tego artefaktu zostaną oznaczone
     jako "do aktualizacji"

CZY MOGĘ COFNĄĆ?
  Tak! System tworzy kopie zapasowe w folderze:
  .deep-process/backups/

  Możesz przywrócić poprzednią wersję ręcznie lub
  poprosić o to system w kolejnej sesji.

CO TO SĄ "PLIKI DO AKTUALIZACJI"?
  Jeśli inne artefakty zależą od tego który właśnie zapisujesz,
  system automatycznie oznaczy je do przeglądu — bo ich źródło
  się zmieniło. To chroni przed niespójnościami.

Naciśnij ENTER aby wrócić...
```

## Error Handling

| Error | Cause | Recovery |
|-------|-------|----------|
| Write failed | Disk full / permissions | Retry or escalate |
| State update failed | Concurrent modification | Reload state, retry |
| Backup failed | Cannot create backup | Warn, allow proceed |

### Rollback Protocol

If SYNC fails after partial write:

```markdown
## Rollback Required

Error at: {error_point}

Rolling back:
1. Restore from backup: {backup_path}
2. Revert `.deep-process/state.json` to pre-SYNC
3. Clear STALE flags set during SYNC

Rollback complete. Artifact in previous state.

Returning to VALIDATE phase...
```

## Next Step

After successful SYNC:
- Return to **Step 01: SENSE** for next action
- System is ready for next operation

## Saga Pattern Compliance

The SYNC phase ensures:
1. **Atomicity:** All-or-nothing commit
2. **Backup:** Previous version preserved
3. **State consistency:** Graph updated atomically
4. **Propagation:** Dependents notified based on propagation_mode [v3.7]
5. **Version history:** Changes tracked for rollback [v3.7]
6. **Extension support:** Auto-extend triggers if configured [v3.7]

If any step fails, the entire SYNC rolls back.

## Integration with Step 06: EXTEND [v3.7]

After successful SYNC, if `process.yaml.self_extension.auto_extend = true`:
- System checks if committed artifact type can contain children
- Prompts operator to add child artifact (see step-06-extend.md)
- Extension operates within the SAME instance
