# #83 Closure Check

**Tier:** 3 (On-Complete - Finalization)
**Purpose:** Verify no incomplete markers, TODOs, or unresolved placeholders remain in generated documentation.

## What to do

1. Scan ALL generated documentation files for incomplete markers
2. Check for unresolved placeholders from templates
3. Check for empty sections that should have content
4. Verify all conditional documents were either generated or explicitly skipped

## Step-by-step

```
1. Scan for incomplete markers (exact patterns):
   Primary:
   - "_(To be generated)_" (Deep Document standard marker)
   - "_(TBD)_"
   - "_(TODO)_"
   - "_(Coming soon)_"

   Secondary:
   - "TODO:" or "TODO " (case insensitive)
   - "TBD" (standalone)
   - "PLACEHOLDER"
   - "FIXME"
   - "XXX"

2. Scan for unresolved template placeholders:
   - "[PLACEHOLDER_NAME]" (BRACKET convention from templates)
   - "{{variable_name}}" (HANDLEBARS convention — should not appear in output)

3. Check for empty sections:
   FOR each generated document:
     Parse markdown headings (## and ###)
     FOR each heading:
       Check if content between this heading and next heading is:
       - Empty (whitespace only)
       - Single line "N/A" or "None"
       - Just a placeholder

4. Check conditional document coverage:
   FROM state file, get:
   - Expected documents (from project type flags)
   - Generated documents (from outputs_generated)
   - Explicitly skipped (from state, with reason)

   Missing = Expected - Generated - Skipped
   Any unaccounted missing documents -> FINDING

5. Check index.md markers:
   Scan index.md specifically for "_(To be generated)_"
   Any remaining markers mean documentation is incomplete
```

## Output format

```
Closure Check
=============

Incomplete markers found:
| File | Line | Marker | Context |
|------|------|--------|---------|
| [file] | [line] | [marker] | [surrounding text] |

Total markers: [count]

Unresolved placeholders:
| File | Placeholder | Type |
|------|-------------|------|
| [file] | [placeholder] | BRACKET/HANDLEBARS |

Total unresolved: [count]

Empty sections:
| File | Section Heading | Status |
|------|-----------------|--------|
| [file] | [heading] | Empty / Placeholder only |

Total empty: [count]

Document coverage:
- Expected: [count]
- Generated: [count]
- Skipped (with reason): [count]
- MISSING (unaccounted): [count]

Closure status:
[ ] CLOSED — No markers, no empty sections, all docs accounted
[ ] NEAR-CLOSED — Minor markers remain ([count])
[ ] OPEN — Significant incomplete work ([count] items)

FINDING (if any): [description]
QUOTE: "[marker or empty section]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
