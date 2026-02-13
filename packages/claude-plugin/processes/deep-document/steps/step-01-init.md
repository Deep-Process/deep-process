---
step: 1
name: "Repository Inventory"
state: "STATE_INIT"
time_estimate: "2-5 minutes"
goal: "Scan repository and create file inventory"
requires_completion: true
requires_load: ["rules.md"]  # ALWAYS load shared rules first
next_steps: ["step-02-ontology.md"]
data_dependencies: []
outputs: ["repo_inventory.yaml"]
---

# STATE_INIT

**Input:** Repository path from process-state.yaml, output directory from process-state.yaml
**Output:** deep-artifacts/repo_inventory.yaml
**Mode:** execution_context.mode (FULL/INCREMENTAL/RESUME)

---

## CRITICAL: Load Shared Rules

**Before execution, read:**
```
Read tool: rules.md
```

This loads ALL shared rules (PRIORITY, ANTI-BYPASS, EXECUTION, modes, patterns).
See rules.md for complete ruleset.

---

## ENFORCED SEQUENCE

### STEP 1: SCAN

Execute:
1. Scan repository directory tree recursively
2. Collect all files (exclude: .git/, node_modules/, build/, dist/, .bin/)
3. For each file: record path, size, last_modified

Commands:
```bash
# Linux/Mac
find <repo_path> -type f \
  ! -path "*/.git/*" \
  ! -path "*/node_modules/*" \
  ! -path "*/build/*" \
  ! -path "*/dist/*" \
  ! -path "*/.bin/*"

# Windows
Get-ChildItem -Path <repo_path> -Recurse -File |
  Where-Object { $_.FullName -notmatch '\\(\.git|node_modules|build|dist|\.bin)\\' }
```

Output format:
```yaml
SCAN RESULTS:
total_files: <count>
total_directories: <count>
scan_duration_ms: <duration>

[SCAN_COMPLETE]
```

### STEP 2: ASSUMPTIONS_DECLARED ← REQUIRED

```yaml
assumptions:
  - "Binary files excluded (images, PDFs, executables)"
  - "Hidden directories excluded (.git, .svn, .hg)"
  - "File hashes use SHA256 algorithm"
  - "PD-UNIVERSAL scan uses config.yaml patterns (68 total)"
  - "Empty files included in inventory"
```

### STEP 3: EXTRACT (WITH BATCH PROCESSING - REC-001)

**BATCH PROCESSING for COMPLETENESS (large repos >1000 files)**

#### STEP 3a: PREPARE_BATCHES

1. Load batch_size from config.yaml (default: 200 files per batch)
2. Split scanned_files into batches

Algorithm:
```yaml
# Split files into batches
batch_size: 200  # from config.yaml batch.init_batch_size
total_files: <count from STEP 1>

batches: []
for i in range(0, len(scanned_files), batch_size):
    batch = scanned_files[i:i+batch_size]
    batches.append:
      batch_id: i // batch_size
      files: <batch>
      file_count: <len(batch)>

total_batches: <len(batches)>
```

Log batch plan:
```
STATE_INIT: Processing {total_files} files in {total_batches} batches (batch_size={batch_size})
```

#### STEP 3b: EXTRACT_BATCHES

**Loop over ALL batches (COMPLETENESS requirement)**

For **each batch** in batches:

1. **Log progress:**
   ```
   STATE_INIT: Processing batch {batch_id+1}/{total_batches}: {file_count} files
   ```

2. **Extract file metadata** (per file in batch):
   ```yaml
   for file in batch.files:
       # Hash calculation
       Read tool: file.path (binary mode)
       file.hash_sha256: <SHA256 hexdigest>

       # File type detection
       file.file_type: <extension from path>

       # Line count (text files only)
       if file.file_type in ['.ts', '.js', '.py', '.md', '.yaml', '.json']:
           Read tool: file.path (text mode)
           file.line_count: <line count>

       # PD-UNIVERSAL scan
       Read tool: file.path (text mode)
       for each pattern in config.pd_universal_patterns:
           matches: <regex search for pattern>
           if matches found:
               file.pd_violations.append:
                   pattern: <pattern.name>
                   category: <pattern.category>
                   matches: <matches>
   ```

3. **Store batch results:**
   ```yaml
   batch_results.append:
       batch_id: <batch_id>
       files: <processed_files_with_metadata>
   ```

4. **Continue to next batch** (timeout: 5 minutes per batch from config.yaml)

#### STEP 3c: MERGE_ALL_BATCHES

**Purpose:** Combine results from ALL batches into single inventory

Algorithm:
```yaml
# Merge all batch results
all_processed_files: []
for batch_result in batch_results:
    all_processed_files.extend(batch_result.files)

total_files_processed: <len(all_processed_files)>
total_pd_violations: <sum of pd_violations across all files>
```

**Validation:**
- Verify total_files_processed == total_files from STEP 1 (COMPLETENESS check)
- If mismatch → ERROR (some files not processed)

Output format:
```yaml
RAW EXTRACTION for repo_inventory (WITH BATCH PROCESSING):
total_files: <count>
total_size_bytes: <bytes>
batch_metadata:
  batch_size: 200
  total_batches: <count>
  processing_mode: "BATCH" | "SEQUENTIAL"  # BATCH if total_files >= 100
file_sample_3:
  - file_path: <path1>
    hash_sha256: <hash>
    file_type: <type>
    line_count: <count>
    batch_id: <which batch this file was in>
  - file_path: <path2>
    hash_sha256: <hash>
    file_type: <type>
    batch_id: <batch_id>
  - file_path: <path3>
    hash_sha256: <hash>
    file_type: <type>
    batch_id: <batch_id>
pd_universal_violations: <count>
completeness_check:
  expected_files: <from STEP 1>
  processed_files: <from STEP 3c>
  match: true | false

[EXTRACT_COMPLETE for repo_inventory]
```

### STEP 4: VERIFY

Execute:
1. Method #168 Phantom Hunt: verify all files exist on disk
2. Verify hash calculations valid (64 chars hex)
3. Verify PD-UNIVERSAL scan covered 68 patterns

Output format:
```yaml
VERIFICATION RESULTS for repo_inventory:
- phantom_hunt: PASS/FAIL (<count> files verified)
- hash_validation: PASS/FAIL (all 64 chars hex)
- pd_universal_coverage: PASS/FAIL (68/68 patterns scanned)

[VERIFY_COMPLETE for repo_inventory]
```

### STEP 5: RENDER

Execute:
1. Write deep-artifacts/repo_inventory.yaml per schema

Output format:
```yaml
FINAL OUTPUT for repo_inventory:
<show first 3 files + metadata summary>

[RENDER_COMPLETE for repo_inventory]
```

Schema (repo_inventory.yaml):
```yaml
metadata:
  scan_timestamp: <ISO8601>
  repository_path: <path>
  total_files: <count>
  total_size_bytes: <bytes>
  scan_duration_ms: <duration>

files:
  - file_path: <path>
    file_type: <type>
    size_bytes: <bytes>
    hash_sha256: <hash>
    last_modified: <ISO8601>
    line_count: <count>
    pd_universal_violations: []

statistics:
  total_files: <count>
  total_directories: <count>
  total_size_bytes: <bytes>
  file_types:
    <type>: <count>
  largest_files:
    - file_path: <path>
      size_bytes: <bytes>

pd_universal_scan:
  scan_timestamp: <ISO8601>
  total_patterns_scanned: 68
  total_violations: <count>
  violations_by_category:
    ellipsis: <count>
    generic_names: <count>
    bracketed: <count>
    handlebars: <count>
    xml_style: <count>
    todos: <count>
    filler: <count>
    metavariables: <count>
  files_with_violations: []
```

### STEP 6: COUNTER-CHECKS ← REQUIRED

- **CC1 (Method #85 Grounding):** Sample 3 random files, verify exist on disk → BLOCKER if fail
- **CC2 (Method #168 Phantom):** Scan inventory for phantom files (in YAML but not on disk) → BLOCKER if >0
- **CC3 (Method #84 Coherence):** Verify statistics.total_files == len(files[]) → ERROR if mismatch

### STEP 7: CHECKLIST (GATE_0) ← BINDING

```
[ ] G0-01: repo_inventory.yaml exists (BLOCKER)
[ ] G0-02: All directories scanned (BLOCKER)
[ ] G0-03: File metadata complete (CRITICAL)
[ ] G0-04: No phantom files (BLOCKER)
[ ] G0-05: Exclusions logged with justification (ERROR)
[ ] G0-06: Counter-checks executed with results (ERROR)
[ ] G0-07: Inventory version incremented (WARNING)
[ ] G0-08: Hash validation passed (CRITICAL)
[ ] G0-09: PD-UNIVERSAL scan complete (ERROR)
[ ] G0-10: Assumptions declared (ERROR)
[ ] G0-11: Batch completeness verified (NEW V7.1.1 - REC-001) (CRITICAL)
        IF total_files >= 100:
          - Verify batch_metadata exists in repo_inventory.yaml
          - Verify batch_metadata.processing_mode == "BATCH"
          - Verify completeness_check.match == true
          - Verify completeness_check.processed_files == expected_files
        IF mismatch → BLOCKER (incomplete batch processing)
```

### STEP 8: TRANSITION

- IF GATE_0 PASS → return to orchestrator for STATE_ONTOLOGY_EXTRACTION
- IF GATE_0 FAIL → return to orchestrator for STATE_ERROR
- IF mode == INCREMENTAL → evaluate GATE_0_INCREMENTAL_VERIFY instead
