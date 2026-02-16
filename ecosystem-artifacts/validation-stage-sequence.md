# Coherence Pipeline - Validation Stage Sequence v1.0

**ARCHITECT-TASK.yaml task_07 deliverable**

## Stage Sequence

```
Artifact → [Stage 1] → [Stage 2] → [Stage 3] → [Stage 4] → Validated
           Syntax     Schema      Semantic     Coherence
            ↓FAIL      ↓FAIL       ↓ERROR       ↓WARNING
           HALT       HALT        Continue      Continue
```

## Stage 1: Syntax Validation

**Input**: Raw artifact file
**Validator**: YAML/JSON parser
**Output**: Well-formed document OR syntax error

```python
def validate_syntax(artifact_path):
    try:
        content = load_yaml(artifact_path)
        return PASS(content)
    except YAMLSyntaxError as e:
        return FAIL(f"Syntax error: {e}")
```

## Stage 2: Schema Validation

**Input**: Parsed document from Stage 1
**Validator**: JSON Schema validator
**Output**: Schema-compliant document OR violation list

```python
def validate_schema(content, schema_ref):
    schema = load_schema(schema_ref)
    errors = validate_against_schema(content, schema)
    if len(errors) > 0:
        return FAIL(errors)
    return PASS(content)
```

## Stage 3: Semantic Validation

**Input**: Schema-valid document from Stage 2
**Validators**: Cross-reference checker, vocabulary checker
**Output**: Semantically consistent document OR warning list

```python
def validate_semantic(artifact):
    issues = []

    # Check references
    refs = extract_references(artifact)
    for ref in refs:
        if not exists(ref):
            issues.append(f"Broken reference: {ref}")

    # Check vocabulary
    terms = extract_terms(artifact)
    vocab_issues = check_vocabulary_consistency(terms)
    issues.extend(vocab_issues)

    if len(issues) > 0:
        return WARNINGS(issues)
    return PASS(artifact)
```

## Stage 4: Coherence Validation

**Input**: Semantically consistent document from Stage 3
**Validators**: Coherence methods (#93-100)
**Output**: Coherent artifact OR coherence warnings

```python
def validate_coherence(artifact):
    issues = []

    # Check dependency graph
    deps = get_dependency_graph()
    if has_cycle(deps):
        issues.append("Cycle detected in dependencies")

    # Check temporal consistency
    if has_temporal_paradox(artifact):
        issues.append("Temporal paradox detected")

    if len(issues) > 0:
        return WARNINGS(issues)
    return PASS(artifact)
```

## Checklist After Each Stage

- [ ] Stage output logged
- [ ] Violations (if any) recorded
- [ ] Severity assessed
- [ ] Remediation triggered (if ERROR)

---
**END**
