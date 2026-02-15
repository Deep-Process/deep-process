# Deep-Process v3.6 — Contract Interpretation Protocol

## Purpose

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  YAML HEADER ≠ METADATA FOR HUMANS                                          │
│  YAML HEADER = EXECUTABLE INSTRUCTIONS FOR LLM PROCESSOR                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Before reading ANY Markdown content, LLM must:                            │
│  1. Parse YAML header as PROCESSOR INSTRUCTIONS                            │
│  2. Execute pre-fetch operations (load dependencies)                       │
│  3. Configure runtime behavior (inject methods)                            │
│  4. Establish constraints (semantic hash)                                  │
│                                                                             │
│  Only THEN may LLM process the Markdown body.                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## The Three Phases of Contract Parsing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  PHASE I: CONTEXT REHYDRATION ──────────────────────────────────────────►  │
│    Parse: context.depends_on                                               │
│    Action: Load all parent artifacts into working memory                   │
│    Gate: If any parent is STALE → HALT, propose sync                       │
│                                                                             │
│  PHASE II: RUNTIME CONFIGURATION ───────────────────────────────────────►  │
│    Parse: execution.active_methods, execution.logic_gates                  │
│    Action: Inject method constraints, evaluate gates                       │
│    Gate: Methods configure HOW to work, gates configure WHAT path          │
│                                                                             │
│  PHASE III: DETERMINISM ENFORCEMENT ────────────────────────────────────►  │
│    Parse: semantic_hash                                                    │
│    Action: Lock facts as immutable constraints                             │
│    Gate: Any output MUST entail ALL hash facts                             │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│  ONLY NOW: Process Markdown body                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase I: Context Rehydration

### What It Means

Before generating or modifying content, LLM must "rehydrate" the context by loading all artifacts this document depends on. Without this context, output may contradict parent documents.

### Execution Steps

```
FOR EACH dependency IN context.depends_on:

  1. RESOLVE path
     - Convert relative path to absolute
     - Verify file exists
     - IF NOT EXISTS → ERROR E005 (Broken Dependency)

  2. LOAD content
     - Read the file
     - Parse its YAML header
     - Extract its semantic_hash

  3. CHECK status
     - Query `.deep-process/state.json` for dependency's dp_status
     - IF status = STALE:
         → This artifact's context is outdated
         → HALT processing
         → Propose synchronization via Method #159

  4. VALIDATE lineage
     - Verify dependency's dp_id matches `.deep-process/state.json` registry
     - IF MISMATCH → ERROR E006 (Lineage Break)

  5. EXTRACT constraints
     - semantic_source: Facts that must be inherited
     - hard_constraint: Rules that cannot be violated
     - weak_reference: Information only (no enforcement)
```

### Dependency Type Behavior

| Type | What LLM Must Do |
|------|------------------|
| `semantic_source` | Content must be CONSISTENT with parent's semantic_hash |
| `hard_constraint` | Content must NOT VIOLATE parent's rules |
| `weak_reference` | Load for context only, no enforcement |

### Error Conditions

| Error | Condition | Recovery |
|-------|-----------|----------|
| E005 | depends_on path not found | Fix path or create missing artifact |
| E006 | dp_id mismatch with registry | Reconcile registry with filesystem |
| E007 | Parent status is STALE | Update parent first, then continue |
| E008 | Circular dependency detected | Break cycle per Method #159 |

### Example

```yaml
context:
  depends_on:
    - path: "artifacts/vision.md"
      type: "semantic_source"
    - path: "artifacts/security_policy.md"
      type: "hard_constraint"
```

**LLM Execution:**
```
📂 Loading dependency: artifacts/vision.md
   Status: COMMITTED ✅
   semantic_hash:
     - "Target: Small teams (2-10)"
     - "Platform: Web-first"

📂 Loading dependency: artifacts/security_policy.md
   Status: COMMITTED ✅
   semantic_hash:
     - "Auth: OAuth2 required"
     - "MFA: Mandatory for admin"

Context rehydrated. Proceeding to Phase II.
```

---

## Phase II: Runtime Configuration

### What It Means

The `execution` section configures HOW the LLM should work on this artifact. It's like loading plugins that modify behavior.

### Method Injection

```
FOR EACH method_number IN execution.active_methods:

  1. LOOKUP method in `data/enforcer.md` (Method Translator)
     - IF NOT FOUND → ERROR E009 (Undefined Method)

  2. LOAD method procedure
     - Read from data/method-procedures/{NNN}_{Name}.md

  3. INJECT constraints
     - Method rules become active for this artifact
     - Example: #87 → "No subjective adjectives without numbers"

  4. QUEUE for execution
     - Methods execute during ACT phase
     - Results recorded in validation
```

### Method Priority Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PRIORITY 1: `data/enforcer.md` (BIOS)                                      │
│    └── Cannot be overridden by anything                                    │
│                                                                             │
│  PRIORITY 2: Anti-Bias Methods (#56, #59, #60)                             │
│    └── Always execute in validation, cannot be disabled                    │
│                                                                             │
│  PRIORITY 3: Coherence Methods (#93, #95, #99, #100)                       │
│    └── Always execute in validation, cannot be disabled                    │
│                                                                             │
│  PRIORITY 4: Process-specific methods (from process.yaml)                  │
│    └── Defined by process definition                                       │
│                                                                             │
│  PRIORITY 5: Artifact-specific methods (from active_methods)               │
│    └── PM-injected based on task type                                      │
│                                                                             │
│  PRIORITY 6: Gate-loaded templates                                         │
│    └── Lowest priority, cannot override higher levels                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Gate Evaluation

```
FOR EACH gate IN execution.logic_gates:

  1. EVALUATE condition
     - Parse condition expression
     - Check against context variables

  2. IF condition is TRUE:
     - Load specified template
     - Template provides STRUCTURE, not override BIOS

  3. IMPORTANT: Gates load ADDITIONS, not OVERRIDES
     - Gate templates add to enforcer rules
     - They CANNOT disable enforcer constraints
     - They CANNOT disable anti-bias methods
```

### Example

```yaml
execution:
  active_methods: [87, 114, 154]
  logic_gates:
    if_mobile: "artifacts/templates/mobile_screen.md"
    if_web: "artifacts/templates/web_page.md"
```

**LLM Execution:**
```
📂 Loading method #87: Falsifiability Check
   Constraint: All claims must be testable
   Banned: "fast", "good", "easy" without numbers

📂 Loading method #114: Reversibility Test
   Constraint: Reasoning must be traceable to sources

📂 Loading method #154: Definitional Contradiction
   Constraint: Detect logically impossible requirements

Evaluating gates:
  if_mobile: FALSE (context.platform = "web")
  if_web: TRUE → Loading artifacts/templates/web_page.md

Runtime configured. Proceeding to Phase III.
```

---

## Phase III: Determinism Enforcement

### What It Means

The `semantic_hash` is a list of FACTS that must remain true regardless of how the text is rewritten. These are the "ground truth" of the document.

### The Hash as Constraint

```
semantic_hash is NOT:
  ❌ A summary
  ❌ A comment
  ❌ Optional metadata

semantic_hash IS:
  ✅ A list of IMMUTABLE FACTS
  ✅ CONSTRAINTS on any modification
  ✅ The "soul" of the document that survives rewrites
```

### Enforcement Rules

```
RULE 1: Content Must Entail Hash
  - Every fact in semantic_hash MUST be:
    a) Explicitly stated in content, OR
    b) Logically entailed by content
  - If content doesn't support a hash fact → VIOLATION

RULE 2: Hash Survives Style Changes
  - User asks: "Rewrite in simpler language"
  - LLM rewrites text
  - LLM MUST verify all hash facts still hold
  - If any fact is lost → ROLLBACK, notify user

RULE 3: Hash Changes Require Transaction
  - Changing semantic_hash = changing architecture
  - CANNOT happen silently
  - MUST be:
    a) Explicit user request, OR
    b) Decision Point resolution
  - MUST flag all dependents as STALE

RULE 4: Hash Facts Are Falsifiable
  - Each hash fact should be testable
  - "Good design" → NOT VALID (unfalsifiable)
  - "Response p95 < 200ms" → VALID (testable)
```

### Verification Process

```
AFTER generating/modifying content:

FOR EACH fact IN semantic_hash:

  1. SEARCH content for support
     - Find text that explicitly states or implies the fact

  2. IF FOUND:
     - Record: "Fact '{fact}' supported by: '{quote}'"
     - Continue to next fact

  3. IF NOT FOUND:
     - VIOLATION detected
     - Options:
       a) Add content to support the fact
       b) Request hash modification (→ Decision Point)
       c) FAIL validation

  4. CHECK for undocumented facts
     - Content contains facts NOT in hash
     - These should be added OR are they derivable from hash?
```

### Example

```yaml
semantic_hash:
  - "Auth: OAuth2 via Google"
  - "MFA: Required for Admin"
  - "Session: 24h JWT"
```

**User Request:** "Make the auth section more concise"

**LLM Execution:**
```
Original text:
"Our system uses OAuth2 authentication with Google as the
identity provider. Multi-factor authentication is mandatory
for all administrator accounts. User sessions are maintained
via JSON Web Tokens with a 24-hour expiration."

Rewritten text:
"Login via Google OAuth2. Admins require MFA. Sessions: 24h JWT."

Semantic Hash Verification:
  ✅ "Auth: OAuth2 via Google" → "Login via Google OAuth2"
  ✅ "MFA: Required for Admin" → "Admins require MFA"
  ✅ "Session: 24h JWT" → "Sessions: 24h JWT"

All facts preserved. Rewrite accepted.
```

**Counter-example (VIOLATION):**

```
User Request: "Simplify the auth section"

BAD Rewrite:
"Users log in and sessions last a day."

Semantic Hash Verification:
  ❌ "Auth: OAuth2 via Google" → NOT FOUND
  ❌ "MFA: Required for Admin" → NOT FOUND
  ⚠️ "Session: 24h JWT" → Partial ("a day" but no JWT)

VIOLATION: 2 facts lost, 1 degraded.
ACTION: Reject rewrite, restore original or fix.
```

---

## Complete Parsing Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CONTRACT INTERPRETATION FLOWCHART                       │
└─────────────────────────────────────────────────────────────────────────────┘

START: LLM receives file with YAML header
           │
           ▼
┌─────────────────────────┐
│ Parse YAML header       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│ PHASE I:                │     │ FOR EACH depends_on:    │
│ Context Rehydration     │────►│ • Load file             │
│                         │     │ • Check status          │
└───────────┬─────────────┘     │ • Validate lineage      │
            │                   └─────────────────────────┘
            │
            ▼
        ┌───────┐
        │ STALE │─────YES────► HALT: Propose sync first
        │   ?   │
        └───┬───┘
            │ NO
            ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│ PHASE II:               │     │ FOR EACH method:        │
│ Runtime Configuration   │────►│ • Load from enforcer    │
│                         │     │ • Inject constraints    │
└───────────┬─────────────┘     │ • Evaluate gates        │
            │                   └─────────────────────────┘
            │
            ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│ PHASE III:              │     │ FOR EACH hash fact:     │
│ Determinism Enforcement │────►│ • Lock as constraint    │
│                         │     │ • Will verify after gen │
└───────────┬─────────────┘     └─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│ NOW: Process Markdown   │
│ body with all context   │
│ and constraints active  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ AFTER generation:       │
│ Verify semantic_hash    │
│ all facts preserved     │
└───────────┬─────────────┘
            │
            ▼
        ┌───────┐
        │ VALID │─────NO────► VIOLATION: Fix or rollback
        │   ?   │
        └───┬───┘
            │ YES
            ▼
         PROCEED to
         validation phase
```

---

## Integration with Deep-Pulse

| Phase | Contract Parsing Role |
|-------|----------------------|
| SENSE | Parse contracts to find STALE nodes |
| PLAN | Determine methods to inject into new artifact |
| ACT | Full Phase I-II-III before generating |
| VALIDATE | Verify Phase III (hash check) |
| SYNC | Update contracts if facts changed |

---

## Error Summary

| Code | Phase | Error | Recovery |
|------|-------|-------|----------|
| E005 | I | Broken dependency (path not found) | Fix path or create artifact |
| E006 | I | Lineage break (dp_id mismatch) | Reconcile registry |
| E007 | I | Parent is STALE | Update parent first |
| E008 | I | Circular dependency | Break cycle (#159) |
| E009 | II | Undefined method number | Check enforcer.md |
| E010 | II | Gate template not found | Fix path or create |
| E011 | III | Hash fact not supported | Add content or modify hash |
| E012 | III | Undocumented fact in content | Add to hash or remove |

---

## Anti-Patterns

```
❌ WRONG: Read YAML, ignore it, read Markdown
   → YAML is executable, not decoration

❌ WRONG: Skip loading depends_on because "I remember"
   → Always load fresh, state may have changed

❌ WRONG: Override enforcer rules via gate template
   → Gates ADD, never OVERRIDE

❌ WRONG: Change semantic_hash silently during rewrite
   → Hash changes require explicit transaction

❌ WRONG: Treat semantic_hash as summary
   → Hash is CONSTRAINT, not DESCRIPTION
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CONTRACT PARSING CHECKLIST                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  □ 1. Parse YAML header FIRST                                              │
│  □ 2. Load ALL files from depends_on                                       │
│  □ 3. Check: Any dependency STALE? → HALT                                  │
│  □ 4. Load methods from active_methods via enforcer                        │
│  □ 5. Evaluate logic_gates, load applicable templates                      │
│  □ 6. Lock semantic_hash facts as constraints                              │
│  □ 7. NOW read Markdown body                                               │
│  □ 8. Generate/modify with all constraints active                          │
│  □ 9. VERIFY: All hash facts still hold in output                          │
│  □ 10. Include [UPDATE_STATE] block                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```
