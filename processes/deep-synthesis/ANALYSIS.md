# ANALIZA ZGODNOŚCI Z 13 ZASADAMI

## Stan obecny procesu deep-synthesis

### Zasada 0: Tylko rzeczy służące wykonaniu
❌ **NARUSZENIE**
- reference.md (200 linii dokumentacji teoretycznej)
- docs/ (README, obrazy)
- theoretical-foundations.yaml (tylko informacyjne)
- Opisy celów faz ("Purpose")
- Wyjaśnienia czasu ("Time: 15-30 min")

### Zasada 1: Self-contained (JIT loading)
✅ **SPEŁNIONE**
- Ładuje metody when needed z `data/method-procedures/`
- Każdy krok zawiera minimum informacji

### Zasada 2: Completeness > tokens
✅ **SPEŁNIONE**
- Używa "wszystkie", "każdy"
- "Systematyczne" podejście

### Zasada 3: Mechanizm zamiast intencji
❌ **CZĘŚCIOWE NARUSZENIE**
Przykłady intencji zamiast mechanizmów:
- "Should be answerable" → brak akcji gdy nie jest
- "Prevents infinite scope" → brak mechanizmu wymuszania
- "Quality over quantity" → brak konkretnej reguły

### Zasada 4: Binding gate
❌ **NARUSZENIE**
- Brak wymuszania deklaracji pominięć
- Agent może przeskakiwać bez formalnej deklaracji
- "Skipped (note why)" nie wymusza formatu

### Zasada 5: Założenia przed działaniem
❌ **NARUSZENIE**
- Brak wymuszonej sekwencji extract → verify → render
- Agent może zacząć renderować w dowolnym momencie
- Brak checkpointów wymuszających deklarację założeń

### Zasada 6: Wymuszona sekwencja
⚠️ **CZĘŚCIOWE SPEŁNIENIE**
- Jest sekwencja faz
- Słabe blokery ("If... then...")
- Możliwe przeskoki bez formalnego zatwierdzenia

### Zasada 7: Checklist po fazie
✅ **SPEŁNIONE**
- Każda faza ma Output section z checklistą

### Zasada 8: Counter-check
⚠️ **CZĘŚCIOWE SPEŁNIENIE**
- Jest #105 Counter-Source Search
- Brak systematycznych counter-checks na kluczowe twierdzenia
- Brak wymuszania próby obalenia wniosków

### Zasada 9: Egzekucyjny język
❌ **NARUSZENIE**
Przykłady opisów zamiast rozkazów:
- "Purpose: Select synthesis depth..."
- "This prevents..."
- "Quality dimensions:"
- Dużo wyjaśnień i kontekstu

### Zasada 10: Widoczne rozumowanie
❌ **NARUSZENIE**
- Brak wymuszania pokazania kroków myślenia
- Agent może wydać wynik bez pokazania procesu

### Zasada 11: Instrukcja + dane do niej (minimum)
✅ **SPEŁNIONE**
- JIT loading dostarcza minimum danych

### Zasada 12: Informacja w momencie użycia
✅ **SPEŁNIONE**
- Metody ładowane when needed

### Zasada 13: Zero ozdobników
❌ **NARUSZENIE**
- Linie dekoracyjne: `+-------------+`, `╔═══════╗`
- Wyjaśnienia kontekstowe
- Teoretyczne uzasadnienia
- Przykłady w checklistach

## Wynik: 4/13 pełne spełnienie, 3/13 częściowe, 6/13 naruszenie

---

# PLAN REWIZJI

## Teoretyczne podstawy do włączenia (22 algorytmy)

1. **Shannon Information Theory** → #606 Novel Information Test (już jest)
2. **Kolmogorov Complexity** → #405 Knowledge Compression (już jest)
3. **Hegel's Dialectic** → #302, #401 (już jest)
4. **Peirce's Abduction** → #404 Abductive Integration (już jest)
5. **Piaget** → Mechanizm asymilacji/akomodacji w INTEGRATE
6. **Bloom** → Poziomy kognitywne jako gate
7. **Glass Meta-Analysis** → #102, #204 (już jest)
8. **Denzin Triangulation** → #103, #301 (już jest)
9. **Nonaka SECI** → #402 Framework Unification (już jest)
10. **Weick Sensemaking** → #504 Narrative Construction (już jest)
11. **Kuhn Paradigm** → #202, #203 (już jest)
12. **Lakatos Research Programmes** → #302 (już jest)
13. **Popper Falsification** → #503, #604 (już jest)
14. **Bayesian Inference** → Nowy: Bayesian Source Weighting
15. **Dempster-Shafer** → Nowy: Evidence Combination
16. **Formal Concept Analysis** → Nowy: Concept Lattice
17. **Rough Set Theory** → Nowy: Boundary Region Analysis
18. **Ensemble Methods** → Nowy: Multi-Model Synthesis
19. **Information Integration** → Nowy: Cognitive Algebra
20. **MDL** → Połączyć z #405 Compression
21. **AGM Belief Revision** → Nowy: Belief Update Protocol
22. **Deep InfoMax** → Nowy: MI Maximization (advanced)

## Metody z methods.csv do dodania

### Anti-bias (56-61)
- #056 Liar's Trap → VERIFY phase
- #057 Mirror Trap → VERIFY phase
- #059 CUI BONO Test → decision points
- #060 Approval Gradient Test → OUTPUT phase

### Sanity (82-90)
- #082 Scope Integrity Audit → po SCOPE
- #083 Alignment Check → po każdej fazie
- #084 Closure Check → przed OUTPUT
- #085 Grounding Check → ACQUIRE + DECOMPOSE
- #086 Topological Hole Detection → RELATE

### Grounding (167-178)
- #167 Baseline Census → start ACQUIRE
- #168 Existence Verification → DECOMPOSE
- #169 Staleness Detection → ACQUIRE

### Epistemology (112-121)
- #152 Semantic Entropy Validation → CRYSTALLIZE
- #121 Competence Boundary Mapping → OUTPUT

---

# NOWA STRUKTURA PROCESU

## Usunąć:
- reference.md
- docs/
- theoretical-foundations.yaml
- Wszystkie sekcje "Purpose", "Time", "Inputs", "Outputs"
- Wszystkie ozdobniki graficzne

## Pozostawić:
- workflow.md (zredukowany do 50% obecnej wielkości)
- steps/*.md (przerobione na egzekucyjne)
- data/method-procedures/*.md (JIT)
- manifest.yaml
- process.yaml

## Nowy workflow.md (struktura):

```
# EXECUTION PROGRAM

## INITIALIZE
1. Load step-00-scope.md
2. Execute commands in sequence
3. HALT when commanded

## CRITICAL RULES
[tylko mechanizmy, zero filozofii]

## STEP SEQUENCE
[tylko nazwy plików + binding gates]

## DEPTH-METHOD MAP
[tabelka]
```

## Nowy step format:

```
# STEP N: [NAZWA]

## EXECUTE

### N.1 [Metoda]
TRIGGER: [warunek]
ACTION:
1. [rozkaz]
2. [rozkaz]
OUTPUT: [co zapisać]
VERIFY: [counter-check]
GATE: [binding gate - wymuszenie deklaracji]

### N.2 [Metoda]
...

## TRANSITION

IF [warunek]: LOAD step-[N+1].md
ELSE IF [warunek]: HALT "message"
ELSE: [akcja]
```

---

# KLUCZOWE ZMIANY

## 1. Binding Gates
Po każdej metodzie:
```
BINDING GATE:
LIST all elements from source landscape
DECLARE:
- PROCESSED: [lista]
- OMITTED: [lista + uzasadnienie CUI BONO]
- DEFERRED: [lista + powód]

IF any OMITTED without CUI BONO justification: HALT
```

## 2. Extract-Verify-Render sekwencja
```
PHASE 1: EXTRACT
Execute methods → raw outputs

PHASE 2: VERIFY
Apply counter-checks:
- Liar's Trap (#056)
- Mirror Trap (#057)
- Semantic Entropy (#152)

PHASE 3: RENDER
IF all verifications PASS: Generate deliverable
ELSE: HALT with verification failures
```

## 3. Widoczne rozumowanie
```
REASONING LOG (mandatory):
1. Assumption: [założenie]
2. Evidence: [dowód]
3. Inference: [wniosek]
4. Confidence: [H/M/L + uzasadnienie]
5. Falsification test: [co by obaliło]
```

## 4. Counter-checks wbudowane
Po każdej kluczowej syntezie:
```
COUNTER-CHECK:
1. State synthesis: [S]
2. Generate counter-argument: [NOT-S strongest form]
3. Evaluate:
   IF counter-argument stronger: REJECT S
   IF equal strength: FLAG as contested
   IF S stronger: ACCEPT with confidence = strength delta
```

## 5. Egzekucyjny język - przykłady transformacji

**BYŁO:**
"Purpose: Select synthesis depth..."

**BĘDZIE:**
"EXECUTE depth selection protocol:
1. DISPLAY dialog
2. READ user input
3. SET depth = input
4. IF depth invalid: HALT 'Invalid depth'
5. PROCEED"

**BYŁO:**
"Quality assessment ensures..."

**BĘDZIE:**
"ASSESS quality:
FOR each source:
1. SCORE on 7 dimensions
2. COMPUTE grade
3. IF grade < C: FLAG
THRESHOLD: IF >50% flagged: HALT 'Quality insufficient'"
