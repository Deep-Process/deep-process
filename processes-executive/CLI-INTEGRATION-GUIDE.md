# CLI INTEGRATION GUIDE

**How to integrate Executive Orchestrator with claude-code CLI**

---

## OVERVIEW

Executive Orchestrator is invoked via the `/executive` slash command.

This guide explains:
1. How skill registration works
2. How to test the command
3. How entry point (workflow.md) is invoked
4. Integration testing checklist

---

## SKILL REGISTRATION

### Skill Definition File

**Location:** `processes-executive/skills/executive.skill.yaml`

```yaml
skill_id: executive
skill_name: "Executive Orchestrator"
version: 1.0.0
command: /executive

invocation:
  command_pattern: /executive
  args_optional: true
  entry_point: processes-executive/executive-orchestrator/workflow.md
```

### How Claude Code CLI Finds Skills

Claude Code CLI scans for skills in configured directories:

```bash
# Check where skills are loaded from
# (This depends on claude-code CLI configuration)

# Typical locations:
~/.claude/skills/
./skills/
./processes-executive/skills/
```

### Registration Options

#### Option 1: Symlink (Recommended)
```bash
# Create symlink from CLI skills directory to our skill
ln -s \
  "$(pwd)/processes-executive/skills/executive.skill.yaml" \
  ~/.claude/skills/executive.skill.yaml

# Verify
ls -l ~/.claude/skills/executive.skill.yaml
```

#### Option 2: Copy
```bash
# Copy skill definition to CLI skills directory
cp processes-executive/skills/executive.skill.yaml \
   ~/.claude/skills/executive.skill.yaml
```

#### Option 3: Configure Skill Path
```bash
# Add processes-executive/skills/ to CLI skill paths
# (Edit claude-code configuration)
```

---

## COMMAND INVOCATION

### User Types: `/executive`

```bash
# In claude-code CLI:
/executive

# Or with initial vision:
/executive "Chcę stworzyć system CRM"
```

### What Happens

```yaml
1. CLI parses command:
   command = "/executive"
   args = [] OR ["Chcę stworzyć system CRM"]

2. CLI finds skill:
   SEARCH: skills directory for "executive"
   LOAD: executive.skill.yaml
   EXTRACT: entry_point = "processes-executive/executive-orchestrator/workflow.md"

3. CLI invokes entry point:
   EXECUTE: workflow.md as markdown prompt
   PROVIDE: args (if any) as context

4. workflow.md determines session type:
   IF state/current-session.yaml EXISTS:
     session_type = RESUME
     GOTO: phase-01-intake.md section_resume
   ELSE:
     session_type = NEW
     GOTO: phase-01-intake.md section_new

5. Execution begins:
   Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
```

---

## ENTRY POINT: workflow.md

**File:** `processes-executive/executive-orchestrator/workflow.md`

### Structure

```markdown
# Executive Orchestrator — Workflow

## ENTRY POINT

User invokes: /executive "Chcę stworzyć [opis projektu]"

OR

User resumes: /executive (loads last session)

## EXECUTION FLOW

START
  ↓
[INTAKE] Phase 1: Extract vision, declare goal, confirm
  ↓ GATE_1: goal declared AND user approved
[PLAN] Phase 2: Create execution plan, build backlog (HIDDEN)
  ↓ GATE_2: plan exists AND backlog not empty
[EXECUTE] Phase 3: Execute backlog, report progress, adapt
  ↓ GATE_3: all tasks done/blocked AND blockers resolved
[VALIDATE] Phase 4: Check goal alignment, detect drift
  ↓ GATE_4: alignment >= 90% OR user accepted gap
[DELIVER] Phase 5: Package deliverables, save state
  ↓ GATE_5: summary exists AND state saved
END

## PHASE 1: INTAKE

... (rest of workflow description)
```

### How CLI Executes workflow.md

```yaml
# CLI treats workflow.md as a structured prompt

1. Reads workflow.md content
2. Identifies execution instructions
3. Follows sequence: Phase 1 → 2 → 3 → 4 → 5
4. Executes each phase file in sequence
5. Enforces gates (cannot proceed if gate closed)
```

---

## TESTING THE COMMAND

### Test 1: Command Recognition

```bash
# In claude-code CLI
/executive

# Expected output:
# "Nowa sesja executive orchestration.
#  Opisz co chcesz stworzyć (1-2 zdania, business level):"
```

**If it fails:**
- Check skill is registered: `ls ~/.claude/skills/executive.skill.yaml`
- Check entry_point path is correct
- Check workflow.md exists: `ls processes-executive/executive-orchestrator/workflow.md`

---

### Test 2: New Session Flow

```bash
/executive "Chcę stworzyć prosty web server"

# Expected flow:
# 1. Vision extracted: "prosty web server"
# 2. Questions about constraints (budget, timeline, etc.)
# 3. Goal declaration
# 4. User confirmation
# 5. Planning (hidden)
# 6. Execution starts
```

**What to verify:**
- [ ] Vision extracted correctly
- [ ] Constraint questions asked
- [ ] Goal displayed for confirmation
- [ ] Planning phase hidden (user sees "Planowanie...")
- [ ] Execution starts with progress updates

---

### Test 3: Resume Session Flow

```bash
# First session
/executive "Chcę stworzyć API"
# ... let it run for a while
# Close VSC

# Reopen VSC
/executive

# Expected output:
# "Witaj ponownie!
#  Ostatnia sesja: [timestamp]
#  Cel: Stworzyć API
#  Faza: [current phase]
#  Kontynuować? (tak/nie)"
```

**What to verify:**
- [ ] current-session.yaml was created
- [ ] Resume prompt displayed
- [ ] State restored correctly
- [ ] Execution continues from correct position

---

### Test 4: Subprocess Invocation

```bash
/executive "Chcę API"
# Let it proceed to Phase 3 (Execute)

# Watch for subprocess invocations:
# Expected: "Aktualnie: Requirements gathering"
# Then: "✓ Requirements complete. Captured: ..."
```

**What to verify:**
- [ ] Subprocess invoked (deep-requirements, deep-architect, etc.)
- [ ] Technical output hidden from user
- [ ] Business summary displayed
- [ ] Progress percentage updating
- [ ] State snapshots saving

---

### Test 5: Decision Handling

```bash
/executive "Chcę system bazodanowy"
# Let it reach architecture phase

# Expected: Decision prompt about database choice
# "Decyzja potrzebna:
#  Pytanie: Jak przechowywać dane?
#  Opcja A: Relational (PostgreSQL)
#  Opcja B: Document (MongoDB)
#  ..."
```

**What to verify:**
- [ ] Decision presented in business terms
- [ ] Options have pros/cons/impact
- [ ] User can choose A or B
- [ ] Decision recorded
- [ ] Execution continues with choice

---

### Test 6: Goal Alignment Validation

```bash
# Let session complete all phases
# Watch Phase 4 (Validate)

# Expected:
# "Walidacja: Alignment X% (EXCELLENT/GOOD/ACCEPTABLE/MISALIGNED)
#  Cel był: ...
#  Osiągnięcia: ...
#  Alignment: X%"
```

**What to verify:**
- [ ] Alignment score calculated
- [ ] Classification assigned
- [ ] If alignment < 90%, user decision required
- [ ] If alignment >= 90%, auto-proceeds to delivery

---

### Test 7: Executive Summary Generation

```bash
# Let session complete to Phase 5 (Deliver)

# Expected: 2-page executive summary displayed
# Format:
# "═══════════════════════════════════
#  PROJEKT ZAKOŃCZONY
#  ═══════════════════════════════════
#  CEL: ...
#  STATUS: ...
#  ..."
```

**What to verify:**
- [ ] Summary is max 2 pages
- [ ] No technical jargon
- [ ] Business value clear
- [ ] Deliverables listed
- [ ] Next steps provided

---

## INTEGRATION TESTING CHECKLIST

### Phase 1: Intake ✅

- [ ] `/executive` command recognized
- [ ] New session: vision extraction works
- [ ] Constraint questions asked
- [ ] Goal declared correctly
- [ ] User confirmation required
- [ ] goal-declaration.yaml created
- [ ] constraints.yaml created
- [ ] GATE_1 enforced

### Phase 2: Plan ✅

- [ ] Planning phase HIDDEN from user
- [ ] User sees only "Planowanie..."
- [ ] execution-plan.yaml created
- [ ] backlog.yaml created
- [ ] Backlog not empty
- [ ] Dependencies correct
- [ ] No circular dependencies
- [ ] GATE_2 enforced

### Phase 3: Execute ✅

- [ ] Progress updates displayed
- [ ] Goal reminder in each update
- [ ] Subprocess invocation works
- [ ] Technical output hidden
- [ ] Business summary displayed
- [ ] State snapshot after each task
- [ ] Recursive fix pattern works (if tests fail)
- [ ] Direction change works (if user changes goal)
- [ ] Critical decisions escalated
- [ ] GATE_3 enforced

### Phase 4: Validate ✅

- [ ] Alignment score calculated
- [ ] Classification assigned
- [ ] Counter-check performed
- [ ] User decision if alignment < 90%
- [ ] Auto-proceeds if alignment >= 90%
- [ ] validation-report.yaml created
- [ ] GATE_4 enforced

### Phase 5: Deliver ✅

- [ ] Executive summary generated
- [ ] Summary max 2 pages
- [ ] No technical jargon
- [ ] Deliverables packaged
- [ ] session-complete.yaml created
- [ ] User sees summary
- [ ] Next action prompt
- [ ] GATE_5 enforced

### Session Continuity ✅

- [ ] State snapshots work
- [ ] current-session.yaml updated
- [ ] Resume prompt displayed
- [ ] State restoration works
- [ ] Execution continues correctly

### Communication Protocol ✅

- [ ] User sees only business terms
- [ ] No technical jargon leaks
- [ ] Max 2 pages per summary
- [ ] Goal always visible
- [ ] Progress updates brief (max half page)

---

## DEBUGGING

### Enable Verbose Logging

```bash
# If claude-code CLI supports verbose mode
/executive --verbose "Chcę API"

# Or check logs
tail -f ~/.claude/logs/executive-orchestrator.log
```

### Check State Files

```bash
# After running /executive
ls -la processes-executive/state/

# Should see:
# current-session.yaml
# goal-declaration.yaml
# constraints.yaml
# execution-plan.yaml
# backlog.yaml
# snapshots/
```

### Verify Subprocess Execution

```bash
# Check execution log
cat processes-executive/state/execution-log.yaml

# Should contain:
# - Subprocess invocations
# - Technical outputs (hidden from user)
# - Timestamps
# - Task state changes
```

---

## KNOWN ISSUES & WORKAROUNDS

### Issue 1: Command Not Recognized

**Symptom:** `/executive` does nothing or shows "unknown command"

**Fix:**
```bash
# Check skill registration
ls ~/.claude/skills/executive.skill.yaml

# If missing, register skill
ln -s "$(pwd)/processes-executive/skills/executive.skill.yaml" \
      ~/.claude/skills/executive.skill.yaml

# Restart claude-code CLI
```

---

### Issue 2: Entry Point Not Found

**Symptom:** "Cannot find workflow.md"

**Fix:**
```bash
# Check path in skill definition
cat processes-executive/skills/executive.skill.yaml
# entry_point should be: processes-executive/executive-orchestrator/workflow.md

# Check file exists
ls processes-executive/executive-orchestrator/workflow.md

# Verify working directory is project root
pwd
```

---

### Issue 3: State Not Persisting

**Symptom:** Resume doesn't work after VSC reopen

**Fix:**
```bash
# Check state directory exists
ls -la processes-executive/state/

# Check permissions
chmod -R u+w processes-executive/state/

# Verify current-session.yaml created
cat processes-executive/state/current-session.yaml
```

---

### Issue 4: Subprocess Fails to Invoke

**Symptom:** "Cannot find subprocess: deep-requirements"

**Fix:**
```bash
# Check subprocess adapter exists
ls processes-executive/subprocess-pool/deep-requirements/manifest.yaml

# Check original process exists
ls processes/deep-requirements/

# Verify path in adapter manifest
cat processes-executive/subprocess-pool/deep-requirements/manifest.yaml
# Should reference: ../../../processes/deep-requirements
```

---

## PRODUCTION READINESS

### Pre-deployment Checklist

- [ ] All 6 subprocess adapters created
- [ ] All 3 wrapper workflows created
- [ ] VALIDATION-REPORT.md reviewed
- [ ] RUNTIME-GUIDE.md reviewed
- [ ] CLI-INTEGRATION-GUIDE.md (this doc) reviewed
- [ ] Skill registered with CLI
- [ ] `/executive` command tested
- [ ] New session flow tested
- [ ] Resume session flow tested
- [ ] Subprocess invocation tested
- [ ] State persistence tested
- [ ] Goal alignment validation tested
- [ ] Executive summary generation tested

### Performance Baseline

**Expected execution times:**
- Phase 1 (Intake): 5-10 minutes
- Phase 2 (Plan): 1-3 minutes (hidden)
- Phase 3 (Execute): 4-8 hours (varies by scope)
- Phase 4 (Validate): 5-15 minutes
- Phase 5 (Deliver): 5-10 minutes

**Total: ~4-9 hours** for typical project

### Success Criteria

✅ User invokes `/executive`
✅ Vision extracted, goal declared
✅ User confirms goal
✅ Planning happens (hidden)
✅ Execution proceeds with progress updates
✅ Subprocesses invoked successfully
✅ Technical details hidden, business summaries shown
✅ Goal alignment validated
✅ Executive summary generated (max 2 pages)
✅ Session can be paused/resumed
✅ All state persists across VSC sessions

---

## NEXT STEPS

After CLI integration is complete:

1. **User Acceptance Testing**
   - Run real project scenarios
   - Collect user feedback
   - Identify improvements

2. **Documentation Updates**
   - Update README.md with latest findings
   - Add troubleshooting entries
   - Document common patterns

3. **Performance Optimization**
   - Profile slow subprocesses
   - Optimize state snapshot frequency
   - Improve subprocess delegation

4. **Feature Enhancements**
   - Parallel task execution (if feasible)
   - Enhanced decision AI (recommendation quality)
   - Improved business translation (better glossary)

---

## SUPPORT

**Issues:** Report at GitHub repository
**Questions:** Check README.md, RUNTIME-GUIDE.md
**Feedback:** Provide via `/feedback` command

---

# END CLI-INTEGRATION-GUIDE.md
