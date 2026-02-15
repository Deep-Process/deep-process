# #169 Staleness Detection (Temporal Grounding)

**Tier:** 2 (On-Verify - Validation)
**Purpose:** Compare modification timestamps of documentation artifacts vs source code to detect stale documentation that no longer reflects current reality.
**Condition:** Execute only in `full_rescan` mode (pre-existing docs). Skip in `initial_scan`.

## What to do

1. For each generated document, identify the source files it covers
2. Compare modification timestamps: artifact vs source
3. Classify staleness: Fresh (0-7d), Aging (8-30d), Stale (31-90d), Critical (90+d)
4. Flag documents where source changed after last documentation generation
5. Prioritize refresh recommendations by staleness severity

## Step-by-step

```
1. Collect artifact-source mappings:
   FOR each generated doc in outputs_generated:
     Map doc → source files it documents
     Example:
       architecture.md → src/**/*.ts (structural files)
       api-contracts.md → src/routes/**, src/controllers/**
       data-models.md → src/models/**, prisma/schema.prisma

2. Compare timestamps:
   FOR each mapping (doc, sources[]):
     doc_time = GetModificationTime(doc)
     FOR each source in sources:
       source_time = GetModificationTime(source)
       IF source_time > doc_time:
         drift = source_time - doc_time
         Record: {doc, source, drift}

3. Classify staleness per document:
   FOR each doc with drifts:
     max_drift = MAX(all drift values)
     changed_source_count = COUNT(sources where source_time > doc_time)
     total_source_count = COUNT(all mapped sources)
     change_ratio = changed_source_count / total_source_count

     Classification:
     - FRESH: max_drift < 7 days AND change_ratio < 0.1
     - AGING: max_drift < 30 days OR change_ratio < 0.3
     - STALE: max_drift < 90 days OR change_ratio < 0.6
     - CRITICAL: max_drift >= 90 days OR change_ratio >= 0.6

4. Impact assessment:
   FOR each STALE or CRITICAL doc:
     - Which specific sections are affected?
     - Are changes structural (new files, moved files) or content (modified logic)?
     - Structural changes = higher priority
```

## Output format

```
Staleness analysis:
| Document | Sources Changed | Max Drift | Change Ratio | Classification |
|----------|----------------|-----------|--------------|----------------|
| [doc]    | [N/total]      | [days]    | [%]          | [F/A/S/C]      |

F = Fresh, A = Aging, S = Stale, C = Critical

Refresh priority queue:
1. [doc] — CRITICAL: [N] sources changed, [max_drift] days drift
2. [doc] — STALE: [N] sources changed, [max_drift] days drift

Structural changes detected:
- [source file] added/moved/deleted since last scan
- Affects: [doc sections]

FINDING (if any): Document "[X]" is [STALE/CRITICAL] — [N]% of sources changed since last generation
SEVERITY: CRITICAL (>90d or >60% changed), IMPORTANT (30-90d), MINOR (<30d)
```
