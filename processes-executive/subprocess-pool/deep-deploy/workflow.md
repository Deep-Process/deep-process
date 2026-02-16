# Deep-Deploy Subprocess — Wrapper

> Delegates to processes/deep-deploy
> Handles deployment OR creates manual deployment guide

---

## ENTRY POINT

```yaml
Invoked by: Executive Orchestrator Phase 3
Task type: SUBPROCESS_INVOCATION
Subprocess: deep-deploy
Trigger: After deep-verify passes
```

---

## INPUTS (from Executive Orchestrator)

```yaml
REQUIRED:
  - implementation_artifacts: Tested, verified system
  - deployment_model: From architecture (target environment)
  - constraints: Budget, timeline constraints from Phase 1

OPTIONAL:
  - deployment_scope: staging | production | both
  - rollback_strategy: how to rollback if deployment fails
```

---

## EXECUTION PATTERN

```yaml
1. CHECK DEPLOYMENT FEASIBILITY:

   LOAD: constraints.yaml

   IF constraints.budget = "minimal":
     deployment_mode = MANUAL
     SKIP automated deployment
     CREATE manual deployment guide instead
     GOTO: section_manual_deployment

   ELSE:
     deployment_mode = AUTOMATED
     PROCEED to automated deployment

2. PREPARE DEPLOYMENT:

   LOAD: implementation artifacts (from deep-implement)
   LOAD: deployment_model (from architecture.yaml)
   LOAD: deployment_scope (from task definition)

   IDENTIFY: deployment target
     IF deployment_model contains "cloud":
       target = CLOUD (AWS/Azure/GCP)
     IF deployment_model contains "on-premise":
       target = ON_PREMISE
     IF deployment_model contains "serverless":
       target = SERVERLESS
     IF deployment_model contains "containerized":
       target = CONTAINERS

3. DELEGATE TO ORIGINAL PROCESS:

   LOCATION: ../../../processes/deep-deploy/

   LOAD: process.yaml
   EXECUTE: steps in sequence

   FOR EACH deployment step:
     EXECUTE step with context {artifacts, target, scope}
     MONITOR progress
     CAPTURE results

4. MONITOR DEPLOYMENT:

   TRACK: deployment progress
   LOG: each deployment action

   IF deployment takes > 5 minutes:
     CHECKPOINT every minute:
       SAVE: deployment progress
       REPORT to user: "Deploying... {progress}%"

   IF deployment fails:
     TRIGGER: automatic rollback
     GOTO: section_rollback

5. CAPTURE OUTPUTS:

   FROM: ../../../processes/deep-deploy/artifacts/

   EXPECTED ARTIFACTS:
     - deployment_log.yaml (what was deployed, where)
     - access_urls.yaml (URLs to access system)
     - deployment_configs.yaml (deployment configuration)
     - rollback_procedure.yaml (how to rollback)

6. VERIFY DEPLOYMENT:

   FOR EACH access_url:
     TEST: URL is accessible
     CHECK: System responds correctly
     VERIFY: Health check passes

   IF any verification fails:
     MARK: deployment as PARTIAL
     ESCALATE: to user

7. TRANSLATE TO BUSINESS TERMS:

   Technical artifacts → Business value:

   "Deployed to AWS EC2 with Docker containers" →
   "System deployed and accessible"

   "CI/CD pipeline configured with GitHub Actions" →
   "Automated deployment process in place"

   "Access URL: https://app.example.com" →
   "System available at: https://app.example.com"

8. FORMAT BUSINESS SUMMARY:

   business_summary:
     subprocess: "Deployment"
     status: "Complete"
     achievements:
       - "System deployed to {target}"
       - "Accessible at: {URLs}"
       - "Automated deployment configured"
     artifacts:
       - "Deployment documentation"
       - "Rollback procedure"
     business_value:
       "System live and ready for use"

9. RETURN TO EXECUTIVE ORCHESTRATOR:

   OUTPUTS:
     - deployment_artifacts (configs, logs)
     - access_urls.yaml (for user)
     - business_summary (for user display)

   LOG:
     - Technical deployment details to execution-log.yaml
```

---

## SECTION: MANUAL DEPLOYMENT

```yaml
When budget = "minimal" OR automated deployment not feasible:

1. CREATE MANUAL DEPLOYMENT GUIDE:

   LOAD: implementation artifacts
   LOAD: architecture.yaml (for deployment requirements)

   GENERATE: deployment-guide.md

   Content:
     # Manual Deployment Guide

     ## Prerequisites
     - {list required software, services}
     - {list required configurations}

     ## Step-by-Step Deployment

     ### Step 1: Prepare Environment
     - {detailed instructions}

     ### Step 2: Configure System
     - {configuration steps}

     ### Step 3: Deploy Application
     - {deployment commands}

     ### Step 4: Verify Deployment
     - {verification steps}

     ## Rollback Procedure
     - {how to rollback if issues}

     ## Access URLs
     - After deployment: {where to access}

2. PACKAGE ARTIFACTS:

   CREATE: deployment-package/
     ├── source_code/
     ├── configuration/
     ├── deployment-guide.md
     └── rollback-procedure.md

3. TRANSLATE TO BUSINESS:

   business_summary:
     subprocess: "Deployment"
     status: "Manual deployment package ready"
     achievements:
       - "Deployment guide created"
       - "All artifacts packaged"
       - "Ready for manual deployment"
     instructions:
       "Follow deployment-guide.md for step-by-step instructions"
     business_value:
       "System ready to deploy when budget allows"

4. RETURN: manual deployment package
```

---

## SECTION: ROLLBACK

```yaml
If deployment fails:

1. TRIGGER AUTOMATIC ROLLBACK:

   LOAD: rollback_procedure.yaml
   EXECUTE: rollback steps

   FOR EACH rollback step:
     EXECUTE: undo deployment action
     VERIFY: system reverted to previous state

2. VERIFY ROLLBACK:

   CHECK: previous version is running
   CHECK: no data loss
   CHECK: system functional

3. ANALYZE FAILURE:

   EXTRACT: deployment error from logs
   CLASSIFY: error type

   COMMON ERRORS:
     - configuration_error: Wrong config values
     - resource_insufficient: Not enough resources
     - external_dependency: External service unavailable
     - permission_denied: Access rights issue

4. ESCALATE TO USER:

   DISPLAY:
     "Deployment failed and rolled back.

      Error: {error_description}

      System reverted to previous version (safe).

      Opcje:
      A) Fix configuration and retry
      B) Manual intervention needed
      C) Skip deployment (provide package)"

   WAIT: user decision

5. HANDLE USER DECISION:

   IF user chooses A (fix and retry):
     CREATE: fix_task for configuration
     INJECT: into backlog
     UPDATE: current deploy task → TODO (will retry)

   IF user chooses B (manual):
     GOTO: section_manual_deployment

   IF user chooses C (skip):
     MARK: deployment task as SKIPPED
     CREATE: manual deployment package
     CONTINUE: to delivery phase
```

---

## CRITICAL DECISION HANDLING

```yaml
If deployment_target not specified in architecture:

ESCALATE to user:
  "Deployment target not specified.

   Gdzie deployować system?

   Opcja A: Cloud (AWS/Azure/GCP)
     Korzyści: Łatwe, skalowalne, niezawodne
     Koszty: Miesięczne opłaty (~$20-100/miesiąc)

   Opcja B: On-premise server
     Korzyści: Kontrola, jednorazowy koszt
     Koszty: Wymaga infrastruktury, zarządzania

   Opcja C: Manual deployment
     Korzyści: Pełna kontrola, bez automated cost
     Koszty: Więcej pracy manualnej

   Rekomendacja: Cloud (łatwiejsze dla małego projektu)"

WAIT: user decision
RECORD: decision
PROCEED: with selected target
```

---

## ERROR HANDLING

```yaml
IF deployment_failure:
  AUTOMATIC: Rollback to previous version
  ESCALATE: to user with options

IF rollback_failure:
  CRITICAL: Both deployment and rollback failed
  ESCALATE: immediately to user
  PROVIDE: manual recovery instructions

IF timeout:
  SAVE: deployment progress
  CHECK: is system in deployable state?
  IF yes: RESUME deployment
  IF no: ROLLBACK and retry

IF resource_exhaustion:
  ERROR: "Insufficient resources for deployment"
  OPTIONS:
    A) Upgrade resources (cost)
    B) Reduce deployment scope
    C) Manual deployment
  ESCALATE: to user

IF external_dependency_failure:
  ERROR: "External service unavailable: {service}"
  RETRY: with exponential backoff (3 attempts)
  IF still fails: ESCALATE to user
```

---

## BUSINESS TRANSLATION EXAMPLES

### Example 1: Successful Cloud Deployment
```
TECHNICAL:
  "Deployed to AWS EC2 (t2.medium)"
  "Docker container: app:v1.0.0"
  "Load balancer configured: elb-xyz"
  "SSL certificate: app.example.com"
  "Health check: passing"
  "Access URL: https://app.example.com"

BUSINESS:
  "System deployed to cloud successfully"
  "Accessible at: https://app.example.com"
  "Secure connection (SSL) configured"
  "System health: ✓ All checks passing"
  "Ready for users"
```

### Example 2: Manual Deployment Package
```
TECHNICAL:
  "Created deployment-package/ with:"
  "  - source_code/ (all implementation)"
  "  - config/ (environment configs)"
  "  - deployment-guide.md (25 steps)"
  "  - rollback-procedure.md"
  "Target: On-premise server"

BUSINESS:
  "Manual deployment package ready"
  "Includes step-by-step guide (25 steps)"
  "All files packaged and documented"
  "Ready to deploy on your server"
  "Estimated deployment time: 1-2 hours"
```

### Example 3: Deployment Failure + Rollback
```
TECHNICAL:
  "Deployment failed: connection timeout to target"
  "Rollback initiated"
  "Reverted to previous version: v0.9.0"
  "Rollback successful"
  "System status: running (previous version)"

BUSINESS:
  "Deployment encountered issues"
  "System safely reverted to previous version"
  "No data loss, system still functional"
  "Need to fix: {connection issue}"
  "Will retry after fix"
```

---

## VALIDATION

```yaml
BEFORE returning:

CHECK 1: deployment_log.yaml EXISTS
CHECK 2: deployment status = SUCCESS | MANUAL | ROLLED_BACK

IF status = SUCCESS:
  CHECK 3: access_urls.yaml EXISTS and not empty
  CHECK 4: System accessible at URLs
  CHECK 5: Health check passes

IF status = MANUAL:
  CHECK 3: deployment-guide.md EXISTS
  CHECK 4: deployment-package/ complete

IF status = ROLLED_BACK:
  CHECK 3: Previous version running
  CHECK 4: No data loss

IF any check fails:
  ESCALATE: to user with error details

IF all checks pass:
  RETURN: status with artifacts
```

---

## NOTES

- Deployment may be SKIPPED if budget constraint
- Manual deployment is NOT an error - valid alternative
- Rollback is AUTOMATIC if deployment fails
- User approval required ONLY for critical decisions
- Deployment can take 5-30 minutes (cloud) or longer (on-premise)

---

# END workflow.md
