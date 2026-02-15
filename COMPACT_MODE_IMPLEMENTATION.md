# Compact Mode Implementation — Deep Verify

**Date:** 2026-02-15
**Status:** Implemented
**Version:** Deep Verify V2.1

---

## Cel

Proces deep-verify prezentuje tylko wyniki końcowe w zwięzłej formie, bez przytłaczania użytkownika szczegółami, przy zachowaniu tej samej jakości weryfikacji.

---

## Co zostało zmienione

### 1. Nowy szablon raportu

**Plik:** `processes/deep-verify/data/compact-report-template.md`

**Zawartość:**
- **Conclusion** — 2-3 zdania podsumowania
- **Critical Issues** — tylko CRITICAL findings z cytatami
- **Important Findings** — lista IMPORTANT findings (jedna linia każdy)
- **Recommendations** — konkretne, wykonywalne kroki
- **Scope** — co sprawdzono i czego nie sprawdzono
- **Metadata** — tryb, liczba metod, score, czas

**Czego NIE ma:**
- Szczegółowy breakdown scoringu
- Lista wszystkich wykonanych metod z wynikami
- Szczegóły walidacji adversarial
- Logi hipotez i counter-checks
- Wyniki Tier 1/Tier 2 methods

### 2. Walidacja jakości (5 metod)

Compact mode używa metod z `methods/methods.csv` aby zapewnić jakość mimo zwięzłości:

#### Method #082: Scope Integrity Audit
- **Cel:** Sprawdza czy nie pominięto elementów zadania
- **Test CUI BONO:** Czy pominięcie przynosi korzyść agentowi (łatwiejsza praca)?
- **Wynik:** PASS jeśli wszystkie pominięcia są uzasadnione

#### Method #083: Closure Check
- **Cel:** Weryfikuje kompletność
- **Sprawdza:** Brak TODO/TBD/PLACEHOLDER, wszystkie cytaty dokładne, wszystkie lokalizacje precyzyjne
- **Wynik:** PASS jeśli raport jest samodzielny i kompletny

#### Method #084: Coherence Check
- **Cel:** Sprawdza spójność
- **Sprawdza:** Verdict pasuje do findings, confidence pasuje do evidence, recommendations adresują findings
- **Wynik:** PASS jeśli wewnętrznie spójny

#### Method #088: Executability Check
- **Cel:** Weryfikuje czy instrukcje są wykonywalne
- **Klasyfikacja:** ACTIONABLE / BLOCKED / UNCLEAR
- **Wynik:** PASS jeśli wszystkie rekomendacje są ACTIONABLE

#### Method #089: Output Quality Score
- **Wymiary:** completeness (1-5), correctness (1-5), clarity (1-5), usefulness (1-5)
- **Próg:** Wszystkie wymiary ≥ 4
- **Wynik:** PASS jeśli wszystkie wymiary spełniają próg

### 3. Modyfikacje procesu

#### `steps/step-00-setup.md`
- Dodano flagę `--compact` / `-c`
- Dodano `report_mode: [full / compact]` do frontmatter
- Rozszerzono menu wyboru o tryb raportu

#### `steps/step-05-report.md`
- Dodano sekcję 5.0: Template Selection (wybór szablonu)
- Dodano sekcję 5.2: Quality Validation (5 metod walidacyjnych dla compact mode)
- Zmodyfikowano sekcję 5.4: Output Report (obsługa obu trybów)

#### `workflow.md`
- Dodano sekcję "REPORT MODES"
- Zaktualizowano "DATA FILES (Just-In-Time Loading)" o compact-report-template.md i metody walidacyjne
- Wyjaśniono że compact mode wykonuje WSZYSTKIE fazy, zmienia tylko prezentację

#### `docs/README.md`
- Dodano sekcję "Report Modes" z wyjaśnieniem
- Dodano przykład compact report
- Dodano instrukcje użycia `--compact`

---

## Jak to działa

### Przepływ Compact Mode

```
1. User wywołuje: deep-verify --compact artifact.py

2. Phase 0: Setup
   ├─ Wykrywa flagę --compact
   ├─ Ustawia report_mode = "compact"
   └─ Zapisuje w frontmatter

3. Phases 1-4: [IDENTYCZNE jak w full mode]
   ├─ Phase 1: Pattern Scan (wszystkie Tier 1 methods)
   ├─ Phase 2: Targeted Verification (wybrane Tier 2 methods)
   ├─ Phase 3: Adversarial Validation (full adversarial review)
   └─ Phase 4: Verdict (calculate score, determine verdict)

4. Phase 5: Report
   ├─ 5.0: Wykrywa report_mode == "compact"
   ├─ 5.0: Ładuje compact-report-template.md
   ├─ 5.1: Wypełnia sekcje (WSZYSTKIE dane są dostępne)
   │
   ├─ 5.2: Quality Validation (TYLKO dla compact mode)
   │   ├─ Method #082: Scope Integrity Audit → PASS/FAIL
   │   ├─ Method #083: Closure Check → PASS/FAIL
   │   ├─ Method #084: Coherence Check → PASS/FAIL
   │   ├─ Method #088: Executability Check → PASS/FAIL
   │   └─ Method #089: Output Quality Score → PASS/FAIL
   │   └─ IF ANY FAIL: Popraw raport → Powtórz walidację
   │
   ├─ 5.3: Validate Report (ogólna walidacja)
   └─ 5.4: Output Report
       └─ Pokaż TYLKO compact report (ukryj szczegóły)

5. User otrzymuje: Zwięzły raport z tylko kluczowymi informacjami
```

### Kluczowe zasady

✅ **TA SAMA JAKOŚĆ:**
- Wszystkie 6 faz wykonują się w pełni
- Wszystkie metody Tier 1 i wybrane Tier 2 działają
- Adversarial validation w pełni aktywna
- Scoring identyczny
- Verdict calculation identyczny

✅ **WALIDACJA JAKOŚCI:**
- 5 metod sprawdza czy compact report jest kompletny
- Jeśli którakolwiek metoda FAIL → popraw i powtórz
- Nie pokazuj użytkownikowi walidacji, tylko wynik końcowy

✅ **TYLKO PREZENTACJA:**
- Cała analiza wewnętrzna jest UKRYTA
- User widzi: verdict, findings, recommendations, scope
- User NIE widzi: scoring details, method outputs, adversarial details

---

## Przykład użycia

### Wywołanie

```bash
# CLI
deep-verify --compact security-spec.md

# Claude Code
/deep-verify --compact security-spec.md

# VS Code Extension
> Deep Verify: Run (Compact Mode)
```

### Co użytkownik widzi (compact mode)

```
═══════════════════════════════════════════════════════════════
VERIFICATION SUMMARY
═══════════════════════════════════════════════════════════════

ARTIFACT: security-spec.md
VERDICT: REJECT
CONFIDENCE: HIGH
DATE: 2026-02-15

───────────────────────────────────────────────────────────────
CONCLUSION
───────────────────────────────────────────────────────────────

The security specification contains a fundamental contradiction...

───────────────────────────────────────────────────────────────
CRITICAL ISSUES
───────────────────────────────────────────────────────────────

1. PFS contradicts key escrow capability
   Location: Sections 2.1 and 4.3
   Quote 1: "Perfect forward secrecy..."
   Quote 2: "Enterprise key recovery..."
   Why critical: Definitionally mutually exclusive

───────────────────────────────────────────────────────────────
RECOMMENDATIONS
───────────────────────────────────────────────────────────────

Next steps:
1. Choose one: PFS OR key escrow (cannot have both)
2. If PFS: Remove key escrow mechanisms
3. If key escrow: Remove PFS claims

═══════════════════════════════════════════════════════════════
```

### Co użytkownik NIE widzi (ukryte wewnętrznie)

```
[HIDDEN]
- Phase 1 extracted 47 claims, 23 terms, detected 3 signals
- Method #71 (First Principles): Found 2 assumptions
- Method #100 (Vocabulary): Found 5 inconsistencies
- Method #17 (Abstraction): Identified 3 levels
- Pattern Library: Matched DC-001 (PFS_ESCROW)
- Phase 2 selected methods: #153, #154, #162
- Method #153 (Impossibility): CRITICAL finding
- Phase 3 adversarial: 4/4 prompts tested, 0 weakened
- Steel-man: Generated 3 arguments, all failed
- Final score: S = 3 + 1 + 0.3 - 0.5 + 1 = 4.8... [full calculation]
- Method #082: PASS
- Method #083: PASS
- Method #084: PASS
- Method #088: PASS
- Method #089: completeness=5, correctness=5, clarity=5, usefulness=5 → PASS
```

---

## Porównanie trybów

| Aspekt | Full Report | Compact Report |
|--------|-------------|----------------|
| **Fazy wykonane** | 6 (0-5 lub 0-6) | 6 (0-5 lub 0-6) — IDENTYCZNE |
| **Metody Tier 1** | Wszystkie (3) | Wszystkie (3) — IDENTYCZNE |
| **Metody Tier 2** | Wybrane (1-4) | Wybrane (1-4) — IDENTYCZNE |
| **Adversarial** | Pełna | Pełna — IDENTYCZNE |
| **Scoring** | Pełny | Pełny — IDENTYCZNE |
| **Walidacja** | Standard | Standard + 5 dodatkowych metod |
| **Długość raportu** | 500-1500 linii | 30-100 linii |
| **Pokazane sekcje** | 15+ | 5 |
| **Scoring breakdown** | ✅ Widoczny | ❌ Ukryty |
| **Method outputs** | ✅ Widoczne | ❌ Ukryte |
| **Adversarial details** | ✅ Widoczne | ❌ Ukryte |
| **Findings** | Wszystkie | CRITICAL + IMPORTANT |
| **Recommendations** | Szczegółowe | Zwięzłe, actionable |
| **Use case** | Audit trail, dokumentacja | Szybkie decyzje, daily workflow |

---

## Walidacja jakości — szczegóły

### Dlaczego 5 metod?

Każda metoda chroni przed innym typem błędu:

1. **#082 (Scope Integrity)** → Chroni przed pomijaniem trudnych części
2. **#083 (Closure)** → Chroni przed niekompletnością
3. **#084 (Coherence)** → Chroni przed wewnętrznymi sprzecznościami
4. **#088 (Executability)** → Chroni przed vague recommendations
5. **#089 (Quality Score)** → Ogólna kontrola jakości

### Próg jakości

**Wszystkie 5 metod MUSZĄ zwrócić PASS.**

Jeśli którakolwiek metoda zwróci FAIL:
1. Agent analizuje powód failure
2. Agent poprawia raport
3. Agent powtarza WSZYSTKIE 5 metod
4. Powtarza do momentu gdy wszystkie PASS

**Użytkownik nie widzi tego procesu** — tylko finalny, walidowany raport.

---

## Pliki zmodyfikowane

```
processes/deep-verify/
├── data/
│   └── compact-report-template.md          [NOWY]
├── steps/
│   ├── step-00-setup.md                    [ZMIENIONY]
│   └── step-05-report.md                   [ZMIENIONY]
├── workflow.md                             [ZMIENIONY]
└── docs/
    └── README.md                           [ZMIENIONY]

methods/
└── methods.csv                             [BEZ ZMIAN - tylko używane]
```

---

## Backward Compatibility

✅ **Pełna kompatybilność wstecz:**
- Brak flagi `--compact` → domyślnie full report
- Wszystkie istniejące skrypty działają bez zmian
- Stare wywołania nie wymagają modyfikacji

---

## Testing Checklist

Przed wdrożeniem, przetestuj:

- [ ] Full mode działa jak wcześniej (bez regresji)
- [ ] Compact mode wykrywa flagę `--compact`
- [ ] Compact report zawiera wszystkie CRITICAL findings
- [ ] Compact report ma dokładne cytaty
- [ ] Wszystkie 5 metod walidacyjnych działają
- [ ] Metoda #082 wykrywa pominięcia
- [ ] Metoda #083 wykrywa TODO/TBD
- [ ] Metoda #084 wykrywa sprzeczności
- [ ] Metoda #088 klasyfikuje recommendations
- [ ] Metoda #089 scoruje wszystkie wymiary
- [ ] Failure którejkolwiek metody → raport jest poprawiany
- [ ] User NIE widzi walidacji (tylko wynik końcowy)
- [ ] Verdict w compact = verdict w full (ta sama analiza)
- [ ] Score w metadata compact = score w full

---

## Następne kroki (opcjonalne)

### Potencjalne rozszerzenia:

1. **Format JSON** dla compact mode → łatwiejsza integracja z CI/CD
2. **Configurable verbosity levels** → ultra-compact, compact, standard, verbose
3. **Interactive mode** → user może rozwinąć sekcje na żądanie
4. **Diff mode** → porównanie przed/po dla re-verification
5. **Template customization** → user może dodać własne sekcje do compact

---

## Podsumowanie

### Problem
Proces deep-verify generował bardzo szczegółowe raporty (500-1500 linii), co było przytłaczające dla szybkich decyzji.

### Rozwiązanie
Dodano **compact mode**, który:
- ✅ Wykonuje TĘ SAMĄ analizę (wszystkie 6 faz)
- ✅ Waliduje jakość 5 metodami (#082, #083, #084, #088, #089)
- ✅ Prezentuje TYLKO wynik końcowy (30-100 linii)
- ✅ Ukrywa szczegóły wewnętrzne (scoring, method outputs, adversarial)
- ✅ Pokazuje: verdict, critical findings, recommendations, scope

### Korzyści
- **Dla użytkownika:** Szybkie, actionable wyniki bez information overload
- **Dla jakości:** Ta sama dokładność + dodatkowa walidacja (5 metod)
- **Dla procesu:** Backward compatible, łatwe przełączanie między trybami

### Kluczowa zasada
**Compact mode zmienia PREZENTACJĘ, nie PROCES.**
Cała analiza wykonuje się w pełni, tylko raport jest zwięzły.

---

**Implementation Date:** 2026-02-15
**Implemented By:** Deep Process Core Team
**Status:** ✅ Complete
**Next Review:** 2026-03-15
