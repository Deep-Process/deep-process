# Compact Report Template

```
═══════════════════════════════════════════════════════════════
VERIFICATION SUMMARY
═══════════════════════════════════════════════════════════════

ARTIFACT: [artifact_name]
VERDICT: [REJECT / ACCEPT / UNCERTAIN / ESCALATE]
CONFIDENCE: [HIGH / MEDIUM / LOW]
DATE: [ISO date]

───────────────────────────────────────────────────────────────
CONCLUSION
───────────────────────────────────────────────────────────────

[2-3 sentence summary explaining verdict]

───────────────────────────────────────────────────────────────
CRITICAL ISSUES [IF verdict = REJECT]
───────────────────────────────────────────────────────────────

[FOR EACH finding WHERE severity = CRITICAL:]

[N]. [description]
   Location: [file:line or section]
   Quote: "[exact text]"
   Why critical: [one sentence]

[OMIT section IF verdict != REJECT]

───────────────────────────────────────────────────────────────
IMPORTANT FINDINGS [IF any exist]
───────────────────────────────────────────────────────────────

[FOR EACH finding WHERE severity = IMPORTANT:]

• [description] — [location]

[OMIT section IF count(IMPORTANT) = 0]

───────────────────────────────────────────────────────────────
RECOMMENDATIONS
───────────────────────────────────────────────────────────────

[IF verdict = REJECT:]
Next steps:
1. [actionable step 1]
2. [actionable step 2]

[IF verdict = ACCEPT:]
Caveats:
• [caveat 1]
• [caveat 2]

[IF verdict = UNCERTAIN:]
Need to clarify:
• [question 1]
• [question 2]

[IF verdict = ESCALATE:]
Expert review needed for:
[specific question]

───────────────────────────────────────────────────────────────
SCOPE
───────────────────────────────────────────────────────────────

Checked:
• [aspect 1]
• [aspect 2]
• [aspect 3]

Not checked:
• [aspect 1] — [reason]
• [aspect 2] — [reason]

───────────────────────────────────────────────────────────────
METADATA
───────────────────────────────────────────────────────────────

Mode: [Quick / Standard / Deep] Verify
Methods: [count]
Score: [final_score]
Duration: [time]
Quality: Validated via #082, #083, #084, #088, #089
Workflow: Deep Verify V2.1

═══════════════════════════════════════════════════════════════
```
