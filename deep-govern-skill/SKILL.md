---
name: deep-govern
description: >
  Use when user needs ongoing governance of a project — health checks,
  decision tracking, escalation handling. Triggers: "project health",
  "governance review", "weekly status", "how is the project doing",
  "decision log", "escalate this".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep]
---

# Deep Govern

Governance dashboard and health monitoring for ongoing projects.

## Procedure

### Step 1 — Status

Collect current project state:

- **Milestones**: list all milestones, mark status (done / in progress / not started / at risk)
- **Blockers**: identify active blockers, owner, age in days
- **Decisions pending**: list decisions awaiting resolution
- **Risks active**: list risks that have materialized or are imminent

### Step 2 — Health

Score project health across four dimensions:

| Dimension | Score Options |
|-----------|-------------|
| Scope | On track / Off track |
| Timeline | Ahead / On schedule / Behind |
| Quality | High / Medium / Low |
| Team | Healthy / Stressed / Blocked |

Provide one-sentence justification for each score.

### Step 3 — Decisions

Log pending decisions in this format:

| Decision | Who Decides | Deadline | Impact of Delay |
|----------|------------|----------|----------------|
| ... | ... | ... | ... |

Flag decisions past deadline or missing an owner.

### Step 4 — Escalations

Identify items needing escalation:

- **Criteria**: blocked > 3 days, risk probability > 70%, decision past deadline, cross-team dependency stalled
- **To whom**: name the escalation target (role or person)
- **Urgency**: immediate / this week / next review

### Step 5 — Output

Produce the governance dashboard:

```
## Governance Dashboard — [Project Name] — [Date]

### Health Scores
| Dimension | Score | Justification |
|-----------|-------|---------------|

### Milestone Status
| Milestone | Status | Notes |

### Pending Decisions
| Decision | Owner | Deadline | Delay Impact |

### Active Risks
| Risk | Probability | Impact | Mitigation |

### Escalations
| Item | To Whom | Urgency | Reason |

### Recommended Actions
1. ...
2. ...
3. ...
```

## Checklist

- [ ] All milestones listed with status
- [ ] Health scores have justifications
- [ ] Every pending decision has an owner and deadline
- [ ] Escalation criteria applied consistently
- [ ] Recommended actions are specific and actionable
