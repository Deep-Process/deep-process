---
name: deep-deploy
description: >
  Use when user needs to plan a deployment. Triggers: "deployment plan",
  "how to deploy this", "release plan", "go-live checklist", "deployment
  strategy", "rollout plan".
version: "1.0.0"
allowed-tools: [Read, Glob, Grep, Bash]
---

# Deep Deploy — Deployment Planning

## Purpose

Produce a deployment runbook: strategy selection, pre-deployment checklist, step-by-step procedure, rollback plan, post-deployment verification.

## When to Use

- System is ready to deploy and needs a structured rollout plan
- User wants to evaluate deployment strategies (blue-green, canary, etc.)
- Release planning with rollback procedures

## Process

### Step 1: Inventory

| Item | Value |
|------|-------|
| What's being deployed | Services, components, versions |
| Target environment | Staging, production, region |
| Dependencies | Databases, external APIs, shared services |
| Current state | What's running now, what version |
| Data migrations | Schema changes, data backfills |
| Breaking changes | API changes, config changes |

Scan project for: Dockerfiles, CI/CD configs, infrastructure-as-code, deployment scripts, environment configs.

### Step 2: Strategy Selection

| Strategy | When to Use | Trade-offs |
|----------|-------------|------------|
| **Big bang** | Small system, low risk, dev/staging | Simple but all-or-nothing |
| **Rolling** | Stateless services, can handle mixed versions | Gradual but mixed-version window |
| **Blue-green** | Need instant rollback, can afford 2x resources | Fast rollback but resource heavy |
| **Canary** | High-risk changes, need to validate with real traffic | Safe but complex routing |

Select and justify based on: system characteristics, risk level, available infrastructure.

### Step 3: Pre-Deployment Checklist

- [ ] All tests passing on the deployment branch
- [ ] Database migrations tested on staging
- [ ] Environment variables / secrets configured
- [ ] Monitoring and alerting configured for key metrics
- [ ] Rollback procedure documented and tested
- [ ] Communication sent to stakeholders (if applicable)
- [ ] Backup taken (database, config)
- [ ] Deployment window agreed (if applicable)
- [ ] Feature flags configured (if applicable)
- [ ] Dependency services verified healthy

### Step 4: Rollback Plan

| Trigger | Condition | Action |
|---------|-----------|--------|
| Error rate | >X% increase in 5xx errors | Revert to previous version |
| Latency | >Xms p99 latency for >5 min | Revert to previous version |
| Data issue | Data inconsistency detected | Stop, assess, restore from backup |
| Smoke test | Critical smoke test fails | Revert immediately |

Rollback steps:
1. Specific commands/actions to revert
2. Database rollback procedure (if migrations involved)
3. Cache/state cleanup
4. Verification that rollback succeeded

### Step 5: Produce Output

## Output Format

### Deployment Strategy

Selected strategy with justification.

### Pre-Deployment Checklist

The checklist from Step 3, customized for this specific deployment.

### Deployment Steps

Numbered, specific steps:
1. Take database backup: `[specific command]`
2. Run database migration: `[specific command]`
3. Deploy service version X.Y.Z: `[specific command]`
4. Run smoke tests: `[specific command]`
5. Monitor for 15 minutes: check [specific dashboard/metrics]
6. Confirm deployment complete

### Rollback Procedure

The rollback table and steps from Step 4.

### Post-Deployment Verification

- [ ] Smoke tests passing
- [ ] Key metrics within normal range (list specific metrics)
- [ ] No error spikes in logs
- [ ] External integrations functioning
- [ ] User-facing functionality spot-checked

## Scope Transparency

This skill does NOT:
- Execute the deployment (it produces a runbook)
- Configure CI/CD pipelines (it plans the deployment)
- Manage infrastructure provisioning (it assumes infra exists)
- Handle organizational change management or communications beyond noting them
