# TEST: /executive Command

**Status:** ✅ Command registered in `.claude-plugin/commands/executive.md`

---

## QUICK TEST (Right Now!)

Ponieważ jesteś już w sesji Claude Code, komenda powinna być **natychmiast dostępna**.

### Test 1: Sprawdź czy komenda jest rozpoznawana

**W tym samym oknie Claude Code, napisz:**

```
/executive
```

**Oczekiwany output:**

```
[Agent should read workflow.md and start Phase 1]

"Nowa sesja executive orchestration.

 Opisz co chcesz stworzyć (1-2 zdania, business level):"
```

**Jeśli to zobaczysz → ✅ Komenda działa!**

---

## Test 2: Pełny flow z prostym projektem

**Komenda:**
```
/executive "Chcę stworzyć prosty web server w Node.js"
```

**Oczekiwany flow:**

1. **Phase 1: Intake (1-2 minuty)**
   ```
   Agent: "Rozumiem: prosty web server w Node.js.
           Kilka pytań o ograniczenia:
           1. Budget?"

   Odpowiedz: reasonable

   Agent: "2. Timeline?"

   Odpowiedz: 1 tydzień

   Agent: "3. Compliance?"

   Odpowiedz: brak

   Agent: "Cel: Stworzyć prosty web server w Node.js,
           budget reasonable, timeline 1 tydzień.
           Poprawnie?"

   Odpowiedz: tak
   ```

2. **Phase 2: Plan (30 sekund, HIDDEN)**
   ```
   Agent: "✓ Cel zatwierdzony. Planowanie..."
   Agent: "✓ Plan gotowy. 4 fazy, 8 zadań. Rozpoczynam..."
   ```

3. **Phase 3: Execute (będzie długi, 1-2 godziny)**
   ```
   Agent: "CEL: Stworzyć prosty web server...
           Progress: 12% (1/8 tasks)
           Aktualnie: Requirements gathering
           Dlaczego: Need to capture what server must do"

   [... subprocess executes ...]

   Agent: "✓ Requirements complete.
           Captured: HTTP server, routing, basic endpoints"

   Agent: "Progress: 25% (2/8 tasks)
           Aktualnie: Architecture design"

   [... continues ...]
   ```

**Co MUSISZ sprawdzić:**
- [ ] Goal jest wyświetlany w KAŻDYM progress update
- [ ] Widzisz TYLKO business-level komunikaty (no code, no file names)
- [ ] Progress percentage się aktualizuje
- [ ] Subprocessy są wywoływane (requirements, architect, implement...)

---

## Test 3: Session Resume

**Scenariusz:**
1. Rozpocznij sesję `/executive "test project"`
2. Poczekaj aż Phase 3 się zacznie
3. **Zamknij VSCode całkowicie**
4. Otwórz VSCode ponownie
5. W nowej sesji Claude Code napisz: `/executive`

**Oczekiwany output:**
```
"Witaj ponownie!

 Ostatnia sesja: [timestamp]
 Cel: test project
 Faza: 3/5 (Execute) - 25% complete
 Następny krok: Implementation

 Kontynuować? (tak/nie)"
```

**Jeśli to zobaczysz → ✅ Session continuity działa!**

---

## DEBUGGING - Jeśli coś nie działa

### Problem 1: Komenda nie rozpoznana

**Symptom:** `/executive` → "Unknown command" lub nic się nie dzieje

**Diagnoza:**
```bash
# Sprawdź czy plik istnieje
ls -la .claude-plugin/commands/executive.md

# Sprawdź czy plugin.json jest OK
cat .claude-plugin/plugin.json
```

**Fix:**
- Restart Claude Code (zamknij i otwórz ponownie)
- Sprawdź czy jesteś w katalogu deep-process_org

---

### Problem 2: Agent nie czyta workflow.md

**Symptom:** Agent mówi "I don't know what to do"

**Diagnoza:**
```bash
# Sprawdź czy workflow.md istnieje
ls processes-executive/executive-orchestrator/workflow.md
```

**Fix:**
- Upewnij się że ścieżka w executive.md jest poprawna
- Ścieżki są relative do plugin root (deep-process_org/)

---

### Problem 3: Subprocess nie działa

**Symptom:** "Cannot find subprocess: deep-requirements"

**Diagnoza:**
```bash
# Sprawdź subprocess adaptery
ls processes-executive/subprocess-pool/deep-requirements/
ls processes-executive/subprocess-pool/deep-requirements/workflow.md
```

**Fix:**
- Wszystkie 6 subprocess adapters powinny być utworzone
- Każdy powinien mieć manifest.yaml + workflow.md

---

### Problem 4: Technical details leak to user

**Symptom:** Widzisz: "Implemented UserService class"

**Should see:** "Created user management capability"

**Diagnoza:** Translation layer nie działa

**Fix:**
- To jest bug w subprocess workflow.md
- Subprocess powinien zwracać business_summary, nie technical_output
- Sprawdź czy executive-interface komponent jest używany

---

## SUCCESS CRITERIA

Komenda `/executive` działa poprawnie jeśli:

- ✅ Komenda jest rozpoznawana
- ✅ Phase 1 (Intake) rozpoczyna się
- ✅ Pytania o constraints są zadawane
- ✅ Goal jest deklarowany i potwierdzany przez usera
- ✅ Planning phase jest HIDDEN (user widzi tylko "Planowanie...")
- ✅ Execute phase pokazuje progress updates
- ✅ Goal jest wyświetlany w KAŻDYM update
- ✅ User widzi TYLKO business terms (NO technical jargon)
- ✅ Session resume działa po zamknięciu VSCode

---

## NEXT STEPS AFTER SUCCESSFUL TEST

1. **Report Results:**
   - Które testy passed ✅
   - Które testy failed ❌
   - Jakie problemy napotkałeś

2. **If all tests pass:**
   - Uruchom pełny projekt (2-4 godziny)
   - Przetestuj wszystkie scenariusze z RUNTIME-GUIDE.md
   - Dokumentuj findings

3. **If tests fail:**
   - Zgłoś konkretne błędy
   - Dostarczę fix
   - Retest

---

## READY TO TEST?

**W tym samym oknie Claude Code, po prostu napisz:**

```
/executive
```

**Lub z vision:**

```
/executive "Chcę stworzyć prosty kalkulator"
```

**I zobacz co się stanie!** 🚀

---

# END TEST-EXECUTIVE-COMMAND.md
