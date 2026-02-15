# Method #101: Cognitive Snapshot (The Cartographer)

**ROLE:** You are the Code Cartographer.
**GOAL:** Create a semantic map of the codebase (L2 Registry) by analyzing file paths and headers *without* executing code.
**INPUT:** List of files in `src/` (provided by `list_directory` tool or context).

---

## PROCEDURE

### Phase 1: SCAN (The Surveyor)
1.  **List Files:** Look at the file tree provided in the context.
2.  **Filter:** Ignore standard ignore patterns (`.git`, `node_modules`, `__pycache__`).
3.  **Identify Structure:** Group files by directory depth.

### Phase 2: ABSTRACTION (The Interpreter)
For each relevant file, extract the **Semantic Metadata**.
*Do NOT read the full file body if not necessary. Use filenames and directories as primary cues.*

**Extraction Schema:**
*   **Path:** `src/auth/login.ts`
*   **Component:** `Auth` (derived from directory)
*   **Intent:** "Handles user login logic" (inferred from name)
*   **Risk:** "High" (Security critical)

### Phase 3: SYNTHESIS (The Mapmaker)
Generate the **L2 Registry** table.

**Rules for Registry:**
1.  **Grouping:** Group rows by L1 Component.
2.  **Brevity:** Intent description must be < 20 words.
3.  **Dependencies:** List only *major* cross-component dependencies (e.g., `Auth` depends on `Database`).
4.  **Implicit Rules:** Note any assumptions you detect (e.g., "No error handling visible in interface").

### Phase 4: ORPHAN DETECTION
Identify files that do not fit into the established L1 Architecture.
*   "Why is `utils/stuff.py` here? Who uses it?"
*   Flag these as **Orphans** for review.

---

## OUTPUT FORMAT

Produce the content for `L2-registry.md` following its template:

```markdown
| File Path | Component | Intent | Dependencies | Implicit Rules |
|-----------|-----------|--------|--------------|----------------|
| ...       | ...       | ...    | ...          | ...            |
```
