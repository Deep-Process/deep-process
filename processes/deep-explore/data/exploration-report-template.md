# Exploration Report Template V3.0

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                      DEEP EXPLORE V3.0 REPORT                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  DECISION: [one sentence from Step 0]                                      ║
║  DATE: [exploration date]                                                  ║
║                                                                            ║
║  DEPTH: [quick | standard | deep]                                          ║
║  FEAR ANALYSIS: [on | off] (auto-detected)                                 ║
║                                                                            ║
║  COVERAGE SCORE: [C] points — [COMPREHENSIVE/ADEQUATE/PARTIAL/INSUFFICIENT]║
║  QUALITY GATE: [PASSED / FAILED]                                           ║
║                                                                            ║
║  PROCESS INTEGRITY:                                                        ║
║  ├── Gates passed: [N]/7                                                   ║
║  ├── Scope reductions: [N]                                                 ║
║  ├── Counter-checks: [N]                                                   ║
║  ├── Assumptions declared: [N]                                             ║
║  └── EVR compliance: [N]/7 phases                                          ║
║                                                                            ║
║  QUALITY METRICS:                                                          ║
║  ├── Verification ratio: [X]% (required: [Y]%)                            ║
║  ├── Verified consequences: [N] (required: [M])                           ║
║  ├── Assumptions tested: [N] (required: [M])                              ║
║  └── Challenge items: [N] (premortem + biases)                            ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝


══════════════════════════════════════════════════════════════════════════════
 SECTION 1: WHAT WE LEARNED
══════════════════════════════════════════════════════════════════════════════

KEY DISCOVERIES:
• [discovery 1] — impact: ___ — status: VERIFIED/ASSUMED
• [discovery 2] — impact: ___ — status: VERIFIED/ASSUMED
• [discovery 3] — impact: ___ — status: VERIFIED/ASSUMED

SURPRISES:
• [what was unexpected]

CHANGED ASSUMPTIONS:
• Original: ___ → Now: ___ — evidence: ___


══════════════════════════════════════════════════════════════════════════════
 SECTION 2: WHAT WE STILL DON'T KNOW
══════════════════════════════════════════════════════════════════════════════

CRITICAL UNKNOWNS:
• [unknown] — how to learn: ___

TRUE UNCERTAINTIES (cannot know):
• [uncertainty] — must decide despite this

FLAGGED FOR EXPERT:
• [question] — expert type: ___


══════════════════════════════════════════════════════════════════════════════
 SECTION 3: OPTION MAP
══════════════════════════════════════════════════════════════════════════════

DIMENSION 1: [name] — status: [VERIFIED/ASSUMED]
├── Option A: [description]
├── Option B: [description]
└── Option C: [description]

DIMENSION 2: [name] — status: [VERIFIED/ASSUMED]
├── Option A: [description]
└── Option B: [description]

[... more dimensions ...]

CONSTRAINTS:
• [constraint] — confidence: ___ — status: [VERIFIED/ASSUMED]

VALID COMBINATIONS: [N] of [total]


══════════════════════════════════════════════════════════════════════════════
 SECTION 4: STRATEGIC CLUSTERS
══════════════════════════════════════════════════════════════════════════════

CLUSTER A: "[name]"
├── Configuration: [D1:X + D2:Y + ...]
├── Best for: [situation]
├── Risk: [level]
└── Trade-off: [what you sacrifice]

CLUSTER B: "[name]"
├── Configuration: [D1:A + D2:B + ...]
├── Best for: [situation]
├── Risk: [level]
└── Trade-off: [what you sacrifice]


══════════════════════════════════════════════════════════════════════════════
 SECTION 5: CONSEQUENCE MAP
══════════════════════════════════════════════════════════════════════════════

CLUSTER A:
├── ✓ [verified consequence] — source: [ref]
├── ? [assumed consequence] — confidence: ___
└── ✗ [risk] — probability: ___

CLUSTER B:
├── ✓ [verified consequence] — source: [ref]
├── ? [assumed consequence] — confidence: ___
└── ✗ [risk] — probability: ___


══════════════════════════════════════════════════════════════════════════════
 SECTION 6: DECISION READINESS
══════════════════════════════════════════════════════════════════════════════

SEQUENCE:
1. First: [decision]
2. Next: [decision]
3. Can wait: [decision]

READINESS:
┌─────────────────────┬────────────┬────────────────────────────┐
│ Decision            │ Readiness  │ What would help            │
├─────────────────────┼────────────┼────────────────────────────┤
│ [decision 1]        │ READY      │ -                          │
│ [decision 2]        │ ALMOST     │ [what's needed]            │
│ [decision 3]        │ NOT READY  │ [what's needed]            │
└─────────────────────┴────────────┴────────────────────────────┘


══════════════════════════════════════════════════════════════════════════════
 SECTION 7: SUGGESTED NEXT STEPS
══════════════════════════════════════════════════════════════════════════════

IF YOU WANT MORE CLARITY:
• Research: ___
• Experiment: ___
• Consult: ___

IF YOU'RE READY TO DECIDE:
• Start with: ___
• Key factors: ___
• Watch out for: ___

IF YOU WANT DEEPER EXPLORATION:
• [area that needs more work]


══════════════════════════════════════════════════════════════════════════════
 SECTION 8: FEAR RESOLUTION (only when fear_analysis = on)
══════════════════════════════════════════════════════════════════════════════

ORIGINAL FEARS (from Step 0):
┌────────────────────────────────┬─────────────┬────────────────────────────┐
│ Fear                           │ Type        │ Resolution                 │
├────────────────────────────────┼─────────────┼────────────────────────────┤
│ [fear 1]                       │ STR/OPR/COG │ RESOLVED/ADDRESSED/REMAINS │
│ [fear 2]                       │ STR/OPR/COG │ RESOLVED/ADDRESSED/REMAINS │
└────────────────────────────────┴─────────────┴────────────────────────────┘

MINIMAL TESTS DESIGNED:
• [test 1] → learns: [what success/failure teaches]
• [test 2] → learns: [what success/failure teaches]

GROWTH ASSESSMENT:
• High growth options: [list options worth doing even if "fail"]
• Gambling options: [list options to reconsider]

CONTROL ZONE CLARITY:
• Actionable (CTRL): [things user can directly change]
• Influenceable (INF): [things user can affect]
• Let go (NO): [things user must accept]

WALLS ANALYSIS:
• False walls cleared: [blockers that weren't real]
• True walls confirmed: [real limits, saved wasted effort]


══════════════════════════════════════════════════════════════════════════════
 SECTION 9: PROCESS INTEGRITY (V3.0)
══════════════════════════════════════════════════════════════════════════════

ENFORCEMENT COMPLIANCE:
┌─────────────────────────────┬────────┬──────────────────────────┐
│ Phase                       │ Status │ Notes                    │
├─────────────────────────────┼────────┼──────────────────────────┤
│ Phase 0: ASSUMPTIONS_DECLARED│ Y/N   │ count: ___               │
│ Phase 0: EVR Sequence        │ Y/N   │                          │
│ Phase 0: Checklist           │ PASS/F │                          │
│ Phase 0: Gate                │ OPEN/L │                          │
│ Phase 1: ASSUMPTIONS_DECLARED│ Y/N   │ count: ___               │
│ Phase 1: EVR Sequence        │ Y/N   │                          │
│ Phase 1: Counter-checks      │ Y/N   │ count: ___               │
│ Phase 1: Checklist           │ PASS/F │                          │
│ Phase 1: Gate                │ OPEN/L │                          │
│ [... phases 2-6 ...]        │        │                          │
└─────────────────────────────┴────────┴──────────────────────────┘

SCOPE REDUCTIONS:
• [SR-1]: gate: ___, item: ___, reason: ___, impact: ___
• [SR-2]: ...
• (if none: "No scope reductions — full compliance")

ASSUMPTIONS FINAL STATUS:
• Total declared: [count]
• Confirmed: [count]
• Falsified: [count]
• Still hypothetical: [count]


══════════════════════════════════════════════════════════════════════════════
 EXPLORATION METADATA
══════════════════════════════════════════════════════════════════════════════

Depth selected: [quick | standard | deep]
Steps completed: [0-6]
Methods used: [list]
Research items: [count]
Iterations: [count]

SCORING BREAKDOWN:
┌─────────────────────────────┬────────┬────────┐
│ Category                    │ Count  │ Points │
├─────────────────────────────┼────────┼────────┤
│ Dimensions discovered       │ [N]    │ [×1.5] │
│ Options enumerated          │ [N]    │ [×0.5] │
│ Consequences VERIFIED       │ [N]    │ [×2.0] │
│ Consequences ASSUMED        │ [N]    │ [×0.2] │
│ Assumptions tested          │ [N]    │ [×1.5] │
│ Assumptions falsified       │ [N]    │ [×2.0] │
│ Unknown unknowns            │ [N]    │ [×1.5] │
│ Boundaries identified       │ [N]    │ [×1.0] │
│ Premortem causes            │ [N]    │ [×0.5] │
│ Black swans                 │ [N]    │ [×0.5] │
│ Biases checked              │ [N]    │ [×0.3] │
│ Gates passed clean          │ [N]    │ [×1.0] │
│ Counter-checks              │ [N]    │ [×0.5] │
├─────────────────────────────┼────────┼────────┤
│ TOTAL                       │        │ [sum]  │
└─────────────────────────────┴────────┴────────┘

QUALITY GATE CHECK:
• Verification ratio: [verified/(verified+assumed)]% — [✓/✗]
• Minimums met: [all/partial/none] — [✓/✗]
• Counter-checks met: [Y/N] — [✓/✗]

Limitations:
• [what wasn't explored]
• [what was assumed]

╔═══════════════════════════════════════════════════════════════════════════╗
║                          END OF REPORT                                     ║
╚═══════════════════════════════════════════════════════════════════════════╝
```
