---
name: deep-document
description: >
  Use when user needs to generate documentation from code. Triggers:
  "document this", "generate docs", "write documentation", "README for this
  project", "explain this codebase".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep, Write]
---

# Deep Document

Generate documentation from code where every claim traces to a source file and line.

## What This Adds

Claude already summarizes code. This skill adds:
- **Evidence-based**: every statement references `file:line` — no hallucinated docs
- **Domain ontology extraction**: identifies domain concepts, not just API surfaces
- **"Not Documented" section**: explicitly lists what could NOT be determined from code
- **Evidence vs inference marking**: readers know what's proven vs guessed

## Procedure

### Step 1: Inventory

Scan the codebase to build a map:

1. `Glob` for project files: `**/*.{ts,js,py,java,go,rs,cs,rb,etc.}`
2. Identify: languages, frameworks, build tools, config files
3. Find entry points: `main`, `index`, `app`, `server`, route definitions
4. Map directory structure and note conventions
5. Read `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, etc.

Produce:

```
## File Map
- Languages: {list}
- Frameworks: {list}
- Entry points: {file:line for each}
- Config files: {list}
- Directory structure: {tree, 2 levels deep}
- Dependencies: {from manifest files}
```

### Step 2: Extract

For each significant component/module:

| Field | Source |
|-------|--------|
| Purpose | What does this module do? Reference the main file. |
| Public interfaces | Functions, classes, endpoints exported. `(file:line)` |
| Dependencies | What does it import/require? `(file:line)` |
| Domain concepts | Business terms used in code (variable names, types, comments) |
| Configuration | What env vars, config values does it use? `(file:line)` |
| Side effects | Does it write to DB, call external APIs, emit events? `(file:line)` |

Rules for extraction:
- If a function name implies behavior (e.g., `calculateDiscount`), reference it but mark assumptions about behavior as `[INFERRED]`
- If code has comments or docstrings, quote them as `[FROM CODE]`
- If there are no comments and behavior is complex, note it in "Not Documented"

### Step 3: Organize

Structure the documentation:

1. **Overview** — what this project is, based on evidence
2. **Getting Started** — setup from config files + build scripts (mark gaps)
3. **Architecture** — component relationships from imports/dependencies
4. **API Reference** — endpoints, functions, classes with signatures
5. **Domain Glossary** — business terms extracted from code
6. **Configuration** — all env vars, config files, defaults
7. **Not Documented** — what couldn't be determined

Mark every section header with its evidence basis:
- `[EVIDENCE]` — directly from code
- `[INFERRED]` — reasonable conclusion from code patterns
- `[UNKNOWN]` — could not determine, listed in "Not Documented"

### Step 4: Generate

Write the documentation to the user-specified path.

## Output Format

```markdown
# {Project Name}

## Overview [EVIDENCE]
{What this project does, with references}

## Getting Started [EVIDENCE/INFERRED]
### Prerequisites
{From manifest files (package.json:1, etc.)}
### Installation
{From scripts, Makefile, Dockerfile — mark if inferred}
### Running
{From entry points and scripts}

## Architecture [EVIDENCE]
{Component diagram if warranted}
| Component | Purpose | Key Files |
|-----------|---------|-----------|
| ... | ... | `file:line` |

## API Reference [EVIDENCE]
### {Endpoint/Function}
- **Source**: `file:line`
- **Signature**: `{signature}`
- **Parameters**: ...
- **Returns**: ...

## Domain Glossary [EVIDENCE/INFERRED]
| Term | Meaning | Source |
|------|---------|--------|
| ... | ... | `file:line` |

## Configuration [EVIDENCE]
| Variable | Purpose | Default | Source |
|----------|---------|---------|--------|
| ... | ... | ... | `file:line` |

## Not Documented
{List of things that could not be determined from code:}
- [ ] {What is missing and why}
```

## Rules

- Every factual statement MUST have a `(file:line)` reference
- Never invent functionality not present in code
- If you infer, mark it `[INFERRED]` — do not present guesses as facts
- The "Not Documented" section is mandatory, even if short
- Do not generate docs for generated/vendored code
- If the codebase is too large, document the most important 20% and list the rest in "Not Documented"
- Prefer quoting actual code comments over paraphrasing
