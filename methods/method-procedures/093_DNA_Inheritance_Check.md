# Method #93: DNA Inheritance Check

## Classification
- **Category:** Coherence
- **Phase:** Validation
- **Purpose:** Ensure new elements inherit system "genes" or justify mutations

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Identify system genes (naming/errors/logging/structure) and check if     │
│   new element inherits or mutates them - mutations need justification"     │
└─────────────────────────────────────────────────────────────────────────────┘
```

## System Genes Defined

Every system has "DNA" - patterns that define its identity:

| Gene Type | Description | Examples |
|-----------|-------------|----------|
| **Naming** | How things are named | `dp_id`, `snake_case`, prefixes |
| **Errors** | How errors are handled | Error codes, messages, recovery |
| **Logging** | How events are recorded | Format, levels, structure |
| **Structure** | How content is organized | Sections, hierarchy, order |
| **Style** | Tone and voice | Formal, technical, concise |
| **Dependencies** | How relations are expressed | `depends_on`, references |

## Execution Protocol

### Step 1: Gene Extraction

Identify the system's current genes from existing artifacts:

```markdown
## System Gene Profile

### Naming Gene
- IDs: `{TYPE}-{NAME}` pattern (e.g., EPIC-USER-LOGIN)
- Files: lowercase with hyphens (e.g., user-auth.md)
- Sections: Title Case (e.g., "## Error Handling")

### Error Gene
- Format: E{XXX} codes (e.g., E001, E002)
- Structure: Code + Message + Recovery
- Style: Technical, action-oriented

### Logging Gene
- Announcement: "📂 Loading [file]"
- State changes: [UPDATE_STATE] blocks
- Decisions: Explicit rationale

### Structure Gene
- YAML header first
- Overview section
- Details section
- Examples section

### Style Gene
- Tone: Technical, direct
- Voice: Second person ("You should...")
- Length: Concise, no fluff

### Dependency Gene
- Format: `depends_on` array
- Types: semantic_source, hard_constraint
- Direction: Child points to parent
```

### Step 2: New Element Analysis

For the new element, check each gene:

```markdown
## Gene Inheritance Analysis

| Gene | System Pattern | New Element | Status |
|------|----------------|-------------|--------|
| Naming | EPIC-XXX | EPIC-AUTH-FLOW | ✅ INHERITED |
| Errors | E{XXX} format | Custom strings | ❌ MUTATION |
| Structure | YAML → Overview → Details | Same | ✅ INHERITED |
| Style | Technical, direct | Casual tone | ❌ MUTATION |
```

### Step 3: Mutation Justification

For each mutation, require explicit justification:

```markdown
## Mutation Justifications

### Error Gene Mutation
- System pattern: E{XXX} codes
- New element: Custom error strings
- Justification: [REQUIRED]
- Options:
  a) Align to system pattern (recommended)
  b) Justify why mutation is necessary
  c) Update system pattern if improvement

### Style Gene Mutation
- System pattern: Technical, direct
- New element: Casual tone
- Justification: [REQUIRED]
```

---

## Output Template

```markdown
## DNA Inheritance Check

### System Gene Profile
[Extract from existing artifacts]

### Gene Inheritance Matrix

| Gene | Expected | Actual | Status | Notes |
|------|----------|--------|--------|-------|
| Naming | {pattern} | {actual} | ✅/❌ | |
| Errors | {pattern} | {actual} | ✅/❌ | |
| Logging | {pattern} | {actual} | ✅/❌ | |
| Structure | {pattern} | {actual} | ✅/❌ | |
| Style | {pattern} | {actual} | ✅/❌ | |
| Dependencies | {pattern} | {actual} | ✅/❌ | |

### Mutations Detected: {count}

**Mutation 1: {Gene}**
- Expected: {pattern}
- Actual: {deviation}
- Justification: {reason or NONE}
- Verdict: ACCEPTABLE / REQUIRES_FIX

### Verdict
[ ] All genes inherited - proceed
[ ] Mutations justified - proceed
[ ] Unjustified mutations - requires fix
```

---

## Integration with Deep-Process

### When to Execute
- **Before COMMITTED** for any new artifact
- **After migration** of external processes
- **On demand** for coherence audits

### Failure Actions
| Outcome | Action |
|---------|--------|
| All inherited | Proceed |
| Justified mutations | Document and proceed |
| Unjustified mutations | Block, require alignment or justification |

### State Update
```yaml
validation:
  dna_check:
    executed: true
    genes_checked: 6
    mutations: 1
    justified: true
```

---

## Common Mutations and Responses

### Naming Mutations
```
Problem: New file uses different naming convention
Response: Rename to match system pattern
Exception: Tool/integration requires specific names
```

### Structure Mutations
```
Problem: New document has different section order
Response: Reorganize to match template
Exception: Content type genuinely requires different structure
```

### Style Mutations
```
Problem: Tone shifts from technical to casual
Response: Rewrite in system voice
Exception: User-facing content may need different voice
```

### Error Mutations
```
Problem: Custom error format instead of standard
Response: Use system error codes
Exception: External system integration requires their format
```

---

## Gene Evolution Protocol

Sometimes mutations are IMPROVEMENTS. If so:

1. **Document** the mutation clearly
2. **Propose** it as a system-wide change
3. **Create Decision Point** for Operator approval
4. **If approved**, update gene profile globally
5. **Migrate** existing artifacts to new pattern

```yaml
dp_type: decision-point
question:
  type: CONFIRMATION
  prompt: "New naming pattern X is clearer than current Y. Adopt system-wide?"
  options:
    - id: A
      label: "Yes, update all artifacts"
      impact: "Mass rename required"
    - id: B
      label: "No, keep current pattern"
      impact: "Revert new element"
```

---

## Anti-Patterns to Avoid

1. **Accepting all mutations** - "It works, so it's fine"
2. **Forcing bad genes** - System pattern may be wrong
3. **Shallow checks** - Only checking obvious things like naming
4. **Ignoring context** - Some mutations are genuinely needed

---

## Method Rationale

This method exists because:
- Systems become incoherent through gradual drift
- Each "small exception" compounds over time
- Consistent patterns reduce cognitive load
- New contributors can learn system faster

The goal is maintaining system identity while allowing justified evolution.
