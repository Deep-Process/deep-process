# Method #100: Vocabulary Consistency

## Classification
- **Category:** Coherence
- **Phase:** Validation
- **Purpose:** Standardize terminology across the system

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Extract all key terms and identify synonyms (same concept, different     │
│   words) and homonyms (same word, different concepts)"                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Vocabulary Issues

| Issue Type | Definition | Problem |
|------------|------------|---------|
| **Synonym** | Same concept, different words | Reader confusion, search failure |
| **Homonym** | Same word, different concepts | Ambiguity, misunderstanding |
| **Undefined** | Term used without definition | Assumed shared understanding |
| **Inconsistent** | Same term, different spellings | "log-in" vs "login" vs "log in" |

## Execution Protocol

### Step 1: Term Extraction

Extract all significant terms from the artifact:

```markdown
## Term Extraction

### Domain Terms
- authentication, auth
- user, account, profile
- session, token, credential
- login, sign-in, log in
- permission, role, access

### Technical Terms
- API, endpoint, service
- JWT, OAuth, OIDC
- hash, encrypt, encode
- validate, verify, check

### Project-Specific Terms
- deep-process, SRE
- artifact, node, graph
- semantic_hash
```

### Step 2: Synonym Detection

Group terms that refer to the same concept:

```markdown
## Synonym Groups

### Group 1: "User Access Action"
Terms found: login, sign-in, log in, sign in
Recommendation: Standardize to "login" (noun) / "log in" (verb)

### Group 2: "User Identity"
Terms found: user, account, profile
Analysis:
- "user" = the person
- "account" = the system record
- "profile" = the displayed info
Status: NOT synonyms (different concepts) ✅

### Group 3: "Token Types"
Terms found: session token, access token, JWT
Analysis:
- All refer to different things
Status: NOT synonyms ✅

### Group 4: "Validation Action"
Terms found: validate, verify, check
Recommendation: Define which means what
- validate = check format/structure
- verify = confirm truth/authenticity
- check = general inspection
```

### Step 3: Homonym Detection

Find words used with multiple meanings:

```markdown
## Homonym Detection

### Homonym: "token"

Usage 1 (Section 2.3):
> "The user receives a token for authentication"
Meaning: JWT or session identifier

Usage 2 (Section 4.1):
> "Parse the input into tokens"
Meaning: Lexical units in parsing

Conflict: YES - same word, different concepts
Recommendation: "auth_token" for auth, "lexical_token" for parsing

### Homonym: "state"

Usage 1 (YAML header):
> "dp_status: COMMITTED"
Meaning: Artifact lifecycle status

Usage 2 (Section 3):
> "Manage application state"
Meaning: Runtime data

Conflict: YES - same word, different concepts
Recommendation: Use "status" for lifecycle, "state" for runtime
```

### Step 4: Undefined Term Check

List terms used without definition:

```markdown
## Undefined Terms

| Term | First Usage | Definition Found? |
|------|-------------|-------------------|
| semantic_hash | Line 15 | ❌ NO |
| saga pattern | Line 42 | ❌ NO |
| topology | Line 67 | ❌ NO |

Recommendation: Add glossary or inline definitions
```

---

## Output Template

```markdown
## Vocabulary Consistency Analysis

### Terms Extracted: {count}

### Synonym Analysis

| Concept | Terms Found | Recommended Standard |
|---------|-------------|---------------------|
| {concept} | term1, term2 | {standard} |
| {concept} | term3, term4 | {standard} |

### Homonym Analysis

| Word | Meanings | Recommendation |
|------|----------|----------------|
| {word} | meaning1, meaning2 | {disambiguate how} |

### Undefined Terms

| Term | First Usage | Action |
|------|-------------|--------|
| {term} | {location} | Define or link to definition |

### Consistency Score
- Synonyms found: {count} (target: 0)
- Homonyms found: {count} (target: 0)
- Undefined terms: {count} (target: 0)
- Overall: {GOOD / NEEDS_WORK / POOR}

### Recommendations
1. [Specific fix 1]
2. [Specific fix 2]

### Verdict
[ ] Vocabulary consistent - proceed
[ ] Minor issues - document and proceed
[ ] Major issues - fix before commit
```

---

## Project Glossary Integration

Maintain a canonical glossary:

```yaml
# .deep-process/glossary.yaml

terms:
  authentication:
    definition: "Process of verifying user identity"
    abbreviation: "auth"
    not: ["authorization"]  # Often confused with

  authorization:
    definition: "Process of verifying user permissions"
    abbreviation: "authz"
    not: ["authentication"]

  semantic_hash:
    definition: "List of facts that must remain true regardless of text changes"
    context: "Deep-Process specific"

  artifact:
    definition: "Any document managed by Deep-Process"
    types: ["vision", "architecture", "epic", "task"]

  saga:
    definition: "A transaction that spans multiple operations"
    context: "Saga pattern from distributed systems"
```

### Glossary Check
```
For each term in artifact:
  1. Check if in glossary
  2. If yes, verify usage matches definition
  3. If no, flag as candidate for glossary addition
```

---

## Integration with Deep-Process

### When to Execute
- **Before COMMITTED** on any artifact
- **After glossary updates** system-wide
- **During migration** of external content

### Failure Actions
| Issue | Severity | Action |
|-------|----------|--------|
| Synonym detected | MEDIUM | Standardize or document exception |
| Homonym detected | HIGH | Disambiguate required |
| Undefined critical term | MEDIUM | Add definition |
| Glossary mismatch | MEDIUM | Align with glossary |

### State Update
```yaml
validation:
  vocabulary_consistency:
    executed: true
    terms_analyzed: 45
    synonyms: 2
    homonyms: 1
    undefined: 3
    glossary_coverage: 85%
```

---

## Common Vocabulary Traps

### 1. Jargon Overload
```
Problem: Too many technical terms without explanation
Solution: Define on first use or link to glossary
```

### 2. Marketing vs Technical
```
Problem: "Revolutionary AI" vs "GPT-4 API call"
Solution: Be specific in technical documents
```

### 3. Abbreviation Soup
```
Problem: SRE, LLM, YAML, CLI, BIOS, PM...
Solution: Define abbreviations on first use
```

### 4. False Friends
```
Problem: Terms that sound similar but differ
Example: "authentication" vs "authorization"
Solution: Explicit definitions, avoid abbreviating both as "auth"
```

### 5. Evolving Terminology
```
Problem: Terms change meaning over time
Example: "serverless" definitions vary
Solution: Pin definitions in glossary with date
```

---

## Method Rationale

This method exists because:
- Communication requires shared vocabulary
- Ambiguous terms cause misunderstandings
- Search and navigation depend on consistent terms
- Onboarding is harder with inconsistent language

The goal is a shared, precise vocabulary that reduces cognitive load and prevents misunderstandings.
