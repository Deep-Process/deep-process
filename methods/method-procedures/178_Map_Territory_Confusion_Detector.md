# #178 Map-Territory Confusion Detector

**Tier:** 1 (Default - Generation Quality)
**Purpose:** Scan generated documentation for language patterns that confuse the map (documentation) with the territory (actual system). Based on Korzybski's principle: "The map is not the territory."

## What to do

1. Scan generated documents for identity language ("X IS Y") vs descriptive language ("X DOES Y")
2. Flag patterns where documentation presents itself as the system rather than a description of it
3. Check for absolutist claims without qualification
4. Suggest rewrites that maintain proper map-territory distinction

## Step-by-step

```
1. Scan for identity patterns (high confidence):
   PATTERN 1 — Document as system:
     "This document IS the API specification"
     → Should be: "This document DESCRIBES the API"

   PATTERN 2 — Absolutist architecture claims:
     "The system IS a microservice architecture"
     → Should be: "The system FOLLOWS a microservice architecture pattern"

   PATTERN 3 — Static claims about dynamic system:
     "The database HAS 15 tables"
     → Should be: "At scan time, the database schema defines 15 tables"

   PATTERN 4 — Exhaustive claims:
     "All endpoints are documented below"
     → Should be: "Detected endpoints are documented below"

2. Scan for presentation patterns (medium confidence):
   PATTERN 5 — Missing temporal qualification:
     "The project uses React 18.2"
     → Better: "The project uses React 18.2 (per package.json at scan time)"

   PATTERN 6 — Omitted scan-level caveat:
     "The full dependency graph:"
     → Better: "Dependency graph (scan level: {{scan_level}}):"

   PATTERN 7 — Authority confusion:
     "According to the architecture, service A calls B"
     → Should reference code: "Code analysis shows service A imports/calls B"

3. Assess severity:
   - CRITICAL: Document claims to BE the system (identity confusion)
   - IMPORTANT: Absolutist/exhaustive claims without qualification
   - MINOR: Missing temporal or scan-level caveats

4. Generate rewrite suggestions:
   FOR each finding:
     Provide original text and suggested replacement
     Keep suggestions minimal — don't over-qualify
```

## Output format

```
Patterns scanned: [N] documents, [N] sections

Map-territory confusion findings:
| Document | Section | Pattern | Severity |
|----------|---------|---------|----------|
| [doc]    | [section] | Identity confusion | CRITICAL |
| [doc]    | [section] | Absolutist claim | IMPORTANT |
| [doc]    | [section] | Missing caveat | MINOR |

Rewrite suggestions:
1. [doc:section]
   ORIGINAL: "[exact text]"
   SUGGESTED: "[rewritten text]"
   REASON: [pattern type]

2. [doc:section]
   ORIGINAL: "[exact text]"
   SUGGESTED: "[rewritten text]"
   REASON: [pattern type]

Summary:
- Identity confusions: [count]
- Absolutist claims: [count]
- Missing caveats: [count]

FINDING (if any): [N] map-territory confusions found — documentation presents itself as system in [N] places
SEVERITY: CRITICAL (identity confusion), IMPORTANT (absolutist claims), MINOR (missing caveats)
```
