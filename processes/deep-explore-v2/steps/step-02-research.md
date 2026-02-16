# PHASE 2: RESEARCH

## ENFORCED SEQUENCE

```
1. OBSERVE
2. DECLARE_ASSUMPTIONS
3. ORIENT (EXTRACT → VERIFY → DECLARE)
4. DECIDE
5. ACT (RENDER)
6. COUNTER_CHECK
7. CHECKLIST
8. GATE_2
```

## 1. OBSERVE

```
PRECONDITION: GATE_1 = OPEN
IF GATE_1 ≠ OPEN → HALT

LOAD: knowledge-gaps.yaml
LOAD: data/research-methods.yaml

EXTRACT: research_queue FROM knowledge-gaps.yaml
VERIFY: research_queue NOT empty
```

## 2. DECLARE_ASSUMPTIONS

```
DECLARE:
  assumption_009: "research methods appropriate for gap types"
  assumption_010: "sources accessible within timeframe"
  assumption_011: "EVERY gap in queue researchable"
```

## 3. ORIENT (EXTRACT → VERIFY → DECLARE)

### 3A. EXTRACT
```
FOR EACH gap IN research_queue:
  EXTRACT research_method FROM data/research-methods.yaml WHERE gap.type
  EXTRACT source_criteria FROM credibility_rules
```

### 3B. VERIFY
```
VERIFY EVERY gap has assigned method
VERIFY EVERY method has fallback
```

### 3C. DECLARE
```
DECLARE research_strategy FOR EACH gap
```

## 4. DECIDE

```
FOR EACH gap IN research_queue:
  IF method.primary available THEN use_primary
  ELSE IF method.fallback available THEN use_fallback
  ELSE mark_unreachable
```

## 5. ACT (RENDER)

```
CREATE: research-results.yaml WITH findings FOR EVERY researched gap
```

## 6. COUNTER_CHECK

```
CLAIM: "research findings credible"
ATTEMPT TO DISPROVE: CHECK FOR contradicting sources
```

## 7. CHECKLIST

```
□ knowledge-gaps.yaml loaded?
□ assumptions declared BEFORE research?
□ research method extracted FOR EACH gap?
□ methods verified?
□ strategy declared BEFORE execution?
□ EVERY gap researched OR marked unreachable?
□ research-results.yaml created?
□ counter-check executed?
```

## 8. GATE_2

```
IF research-results.yaml EXISTS
   AND EVERY queued gap addressed
   AND counter_check_executed = true:
  GATE_2 = OPEN
  NEXT: steps/step-03-map.md
ELSE:
  GATE_2 = CLOSED
  HALT OR SCOPE_REDUCTION
```
