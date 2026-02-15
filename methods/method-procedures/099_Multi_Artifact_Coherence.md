# #99 Multi-Artifact Coherence

**Tier:** 2 (On-Verify - Validation)
**Purpose:** Ensure consistency across all generated documentation files as a coherent set.

## What to do

1. Build artifact relationship graph across all generated documents
2. Check reference integrity — all links/paths resolve
3. Check naming consistency — same terms for same concepts
4. Check interface compatibility — declared APIs match usage across docs
5. Check duplication drift — similar content in different docs stays aligned

## Step-by-step

```
1. Build artifact graph:
   Generated docs: [architecture.md, api-contracts.md, data-models.md,
                     development-guide.md, source-tree-analysis.md, index.md]

   Cross-references:
   - architecture.md -> api-contracts.md (references API endpoints)
   - architecture.md -> data-models.md (references data layer)
   - index.md -> all documents

2. Reference integrity:
   FOR each document:
     Extract all markdown links [text](target)
     Check: does target file exist in output folder?
     Check: does target anchor exist in target file?

3. Naming consistency:
   Extract key entity names from each document:
   - architecture.md: "User", "Authentication Service"
   - api-contracts.md: "user", "AuthController"
   - data-models.md: "users" table, "User" entity

   Check: Are naming patterns consistent?
   - "User" vs "user" vs "users" -> context-appropriate? ✓
   - "Authentication Service" vs "AuthController" -> clear mapping? ✓

4. Interface compatibility:
   - API endpoints in api-contracts match architecture description
   - Model fields in data-models match API request/response schemas
   - Development commands in dev-guide match package.json scripts

5. Duplication drift:
   - Technology stack listed in architecture AND project-overview
     -> Do versions match?
   - Setup instructions in dev-guide AND README reference
     -> Are they aligned?
```

## Output format

```
Artifact Graph:
- Documents analyzed: [count]
- Cross-references found: [count]

Reference Integrity:
- Links checked: [count]
- Valid: [count]
- Broken: [count]
- [List broken references with source -> target]

Naming Consistency:
- Concepts checked: [count]
- Aligned: [count]
- Misaligned: [count]
- [List recommendations]

Interface Compatibility:
- Interfaces checked: [count]
- Compatible: [count]
- Incompatible: [count]
- [List issues]

Duplication Drift:
- Duplicates found: [count]
- Aligned: [count]
- Drifted: [count]
- [List drift with quotes from each location]

FINDING (if any): [description]
QUOTE: "[Doc A text]" vs "[Doc B text]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
