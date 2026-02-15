# Integration Patterns — Deep-* Process Platform

**Version:** 1.0.0
**Date:** 2026-02-15
**Status:** Approved

---

## Overview

The Deep-* Process Platform supports 4 primary integration patterns to serve diverse enterprise use cases:

1. **MCP Protocol Integration** (IDE/Chat interfaces)
2. **REST API Integration** (Programmatic access)
3. **Webhook Integration** (Event-driven notifications)
4. **CI/CD Plugin Integration** (Pipeline automation)

---

## 1. MCP Protocol Integration

### 1.1 Use Case

Developers invoke processes directly from IDE (Claude Code, GitHub Copilot, Cursor) or AI chat interfaces.

**Example User Flow:**
1. Developer in Claude Code types: "Run deep-explore on whether to adopt GraphQL vs REST API"
2. MCP server translates to API call: `POST /v1/jobs {process_id: "deep-explore", inputs: {decision: "GraphQL vs REST"}}`
3. MCP server polls job status every 10 seconds
4. When complete, MCP returns summary: "Option Map: CL-001 REST (recommended), CL-002 GraphQL, CL-003 Hybrid. Download full report: [link]"

### 1.2 MCP Tools Exposed

```typescript
// MCP Tool Catalog
const tools = [
  {
    name: "run_deep_explore",
    description: "Explore a decision with option mapping and strategic clustering",
    inputSchema: {
      decision: "string (required) - Decision to explore",
      depth: "enum: quick|standard|deep (optional, default: standard)",
      inputs: "object (optional) - Additional context"
    }
  },
  {
    name: "run_deep_compliance",
    description: "Assess regulatory compliance (GDPR, HIPAA, SOC2, EU AI Act)",
    inputSchema: {
      regulation: "string (required) - Regulation to assess",
      system_inventory: "string (required) - System description or YAML",
      depth: "enum (optional)"
    }
  },
  {
    name: "run_deep_risk",
    description: "Perform 5D risk assessment with cascade analysis",
    inputSchema: {
      scenario: "string (required) - Risk scenario to assess",
      depth: "enum (optional)"
    }
  },
  {
    name: "run_deep_architect",
    description: "Design software architecture with adversarial validation",
    inputSchema: {
      brief: "string (required) - Project brief or requirements",
      depth: "enum (optional)"
    }
  },
  {
    name: "get_job_status",
    description: "Get status of a running job",
    inputSchema: {
      job_id: "string (required) - UUID of job"
    }
  },
  {
    name: "get_job_artifacts",
    description: "Download artifacts from completed job",
    inputSchema: {
      job_id: "string (required)"
    }
  },
  {
    name: "cancel_job",
    description: "Cancel a running job",
    inputSchema: {
      job_id: "string (required)"
    }
  }
];
```

### 1.3 MCP Server Implementation

**Technology:** TypeScript (MCP SDK)
**Deployment:** C-018 (MCP Server container in K8s)

**Key Features:**
- Status polling (10s interval, max 30 minutes)
- Progress updates streamed to IDE
- Artifact summary extraction (key findings vs full YAML)
- Error handling (gate failures, timeouts)

**Limitations:**
- MCP timeout: 30 minutes (jobs longer than 30 min require webhook notification)
- No bidirectional streaming (polling only)

---

## 2. REST API Integration

### 2.1 Use Case

Programmatic access for custom applications, internal tools, workflow automation.

### 2.2 API Endpoints

**Base URL:** `https://api.deep-process.com/v1`

#### 2.2.1 Submit Job

```http
POST /v1/jobs
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "process_id": "deep-compliance",
  "inputs": {
    "regulation": "GDPR",
    "system_inventory": "..."
  },
  "config": {
    "depth": "deep",
    "priority": "high"
  },
  "webhook_url": "https://customer.com/webhooks/deep-process" (optional)
}

Response: 202 Accepted
{
  "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "queued",
  "created_at": "2026-02-15T20:00:00Z",
  "webhook_url": "https://customer.com/webhooks/deep-process",
  "links": {
    "self": "/v1/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "artifacts": "/v1/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890/artifacts"
  }
}
```

#### 2.2.2 Get Job Status

```http
GET /v1/jobs/{job_id}
Authorization: Bearer {jwt_token}

Response: 200 OK
{
  "job_id": "a1b2c3d4-...",
  "status": "running",
  "current_phase": "Phase 3: ADVERSARY",
  "progress_pct": 50,
  "started_at": "2026-02-15T20:05:00Z",
  "estimated_completion": "2026-02-15T22:00:00Z",
  "gate_status": {
    "GATE_0": "OPEN",
    "GATE_1": "OPEN",
    "GATE_2": "OPEN",
    "GATE_3": "EVALUATING"
  }
}
```

#### 2.2.3 List Artifacts

```http
GET /v1/jobs/{job_id}/artifacts
Authorization: Bearer {jwt_token}

Response: 200 OK
{
  "artifacts": [
    {
      "artifact_id": "art-001",
      "name": "context-assessment.yaml",
      "type": "yaml",
      "size_bytes": 12345,
      "created_at": "2026-02-15T20:10:00Z",
      "url": "/v1/artifacts/art-001"
    },
    {
      "artifact_id": "art-002",
      "name": "canonical-operations.yaml",
      "type": "yaml",
      "size_bytes": 54321,
      "created_at": "2026-02-15T20:30:00Z",
      "url": "/v1/artifacts/art-002"
    }
  ]
}
```

#### 2.2.4 Download Artifact

```http
GET /v1/artifacts/{artifact_id}
Authorization: Bearer {jwt_token}
Accept: application/yaml (or application/json)

Response: 200 OK
Content-Type: application/yaml
X-Artifact-Checksum: sha256:abcd1234...

---
metadata:
  version: "1.2.0"
  ...
```

### 2.3 Authentication

**Primary:** JWT Bearer token (issued by IAM service after SSO login)
**Secondary:** API Key for service accounts

```http
Authorization: Bearer {jwt_token}
# OR
Authorization: ApiKey {api_key}
```

### 2.4 Rate Limiting

| Tier | Requests/Minute | Jobs/Month |
|------|----------------|------------|
| Free | 10 | 10 |
| Basic ($20/mo) | 60 | 100 |
| Pro ($100/mo) | 300 | 500 |
| Enterprise (custom) | Unlimited | Unlimited |

**Response Headers:**
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1634567890
```

### 2.5 Error Handling

```json
{
  "error_code": "GATE_LOCKED",
  "message": "Gate GATE_3 failed evaluation",
  "details": {
    "gate_id": "GATE_3",
    "conditions_failed": [
      "G3-02: STRIDE coverage incomplete (4/6 categories)"
    ]
  },
  "timestamp": "2026-02-15T20:45:00Z",
  "request_id": "req-abc123"
}
```

**Standard HTTP Codes:**
- `200 OK`: Successful retrieval
- `202 Accepted`: Job submitted, processing async
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid auth token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Job or artifact not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Platform error
- `503 Service Unavailable`: Platform maintenance

---

## 3. Webhook Integration

### 3.1 Use Case

Asynchronous notifications for job lifecycle events to external systems (Slack, email, CI/CD pipelines).

### 3.2 Event Types

| Event Type | Trigger | Payload |
|------------|---------|---------|
| `job.queued` | Job submitted to queue | {job_id, process_id, priority} |
| `job.started` | Executor begins processing | {job_id, started_at} |
| `job.phase.started` | New phase begins | {job_id, phase_id, phase_name} |
| `job.gate.passed` | Gate evaluation succeeds | {job_id, gate_id} |
| `job.gate.failed` | Gate evaluation fails | {job_id, gate_id, failures[]} |
| `job.completed` | All phases complete | {job_id, artifacts_url, duration_sec} |
| `job.failed` | Execution error | {job_id, error_code, error_message} |

### 3.3 Webhook Payload Format

```json
{
  "event": "job.completed",
  "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "tenant_id": "tenant-xyz",
  "process_id": "deep-compliance",
  "status": "completed",
  "artifacts_url": "https://api.deep-process.com/v1/jobs/a1b2c3d4-.../artifacts",
  "duration_sec": 3600,
  "timestamp": "2026-02-15T21:00:00Z",
  "metadata": {
    "depth": "deep",
    "gates_passed": 7,
    "gates_failed": 0
  }
}
```

### 3.4 Webhook Security

**HMAC Signature (SHA-256):**
```http
POST {customer_webhook_url}
Content-Type: application/json
X-Signature: sha256=abcd1234567890...
X-Timestamp: 1634567890

{webhook_payload}
```

**Verification (Customer Side):**
```python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

### 3.5 Retry Policy

- **Max Retries:** 5
- **Backoff:** Exponential (1s, 2s, 4s, 8s, 16s)
- **Timeout:** 10s per attempt
- **Failure:** After 5 failed attempts, webhook marked as `failed`, notification sent to tenant admin

---

## 4. CI/CD Plugin Integration

### 4.1 Use Case

Automated process execution in CI/CD pipelines (GitHub Actions, Azure DevOps, GitLab CI).

### 4.2 GitHub Actions Integration

**Installation:** GitHub Marketplace → "Deep Process Runner"

**Workflow Example:**
```yaml
name: Compliance Check
on: [push]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Deep Compliance Check
        uses: deep-process/run@v1
        with:
          process: deep-compliance
          regulation: GDPR
          system_inventory_file: ./system-inventory.yaml
          depth: standard
          api_key: ${{ secrets.DEEP_PROCESS_API_KEY }}
          fail_on_gate_failure: true

      - name: Upload Compliance Report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: compliance-report
          path: compliance-report.yaml
```

**Plugin Behavior:**
1. Reads inputs from workflow file
2. Submits job to API: `POST /v1/jobs`
3. Polls job status every 30s
4. Downloads artifacts when complete
5. Fails build if `fail_on_gate_failure: true` and any gate locked

### 4.3 Azure DevOps Integration

**Installation:** Azure DevOps Marketplace → "Deep Process Task"

**Pipeline Example:**
```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: DeepProcessTask@1
    inputs:
      process: 'deep-risk'
      scenario: 'Multi-tenant data breach'
      depth: 'comprehensive'
      apiKey: '$(DEEP_PROCESS_API_KEY)'
      failOnGateFailure: true
      artifactOutputPath: '$(Build.ArtifactStagingDirectory)/risk-report.yaml'

  - task: PublishBuildArtifacts@1
    inputs:
      pathToPublish: '$(Build.ArtifactStagingDirectory)'
      artifactName: 'risk-assessment'
```

### 4.4 GitLab CI Integration

**Installation:** `.gitlab-ci.yml` with Docker image

**Pipeline Example:**
```yaml
compliance_check:
  stage: test
  image: deep-process/cli:latest
  script:
    - deep-process run deep-compliance
        --regulation GDPR
        --system-inventory system.yaml
        --depth deep
        --api-key $DEEP_PROCESS_API_KEY
        --output compliance-report.yaml
  artifacts:
    paths:
      - compliance-report.yaml
    expire_in: 30 days
  only:
    - main
```

---

## 5. Integration Comparison Matrix

| Feature | MCP | REST API | Webhooks | CI/CD Plugins |
|---------|-----|----------|----------|---------------|
| **Use Case** | IDE/Chat | Custom apps | Async notifications | Pipeline automation |
| **Latency** | Real-time polling | Sync + async | Push (1-5s) | Polling (30s) |
| **Complexity** | Low (built-in) | Medium (implement API client) | Low (webhook receiver) | Low (marketplace install) |
| **Auth** | SSO (IDE) | JWT/API Key | HMAC signature | API Key |
| **Best For** | Developer productivity | Programmatic control | Event-driven integration | Automated quality gates |
| **Timeout** | 30 min | Unlimited (async) | N/A | Pipeline timeout (60 min typical) |

---

## 6. Integration Best Practices

### 6.1 Authentication

- **Use SSO** for human users (Okta, Azure AD)
- **Use API Keys** for service accounts, CI/CD pipelines (rotate every 90 days)
- **Never commit** API keys to git (use secrets management)

### 6.2 Error Handling

- **Implement retries** for transient errors (5xx, network failures)
- **Exponential backoff** to avoid thundering herd
- **Circuit breaker** for external webhook URLs (disable after 5 consecutive failures)

### 6.3 Performance

- **Cache job status** (poll every 30-60s, not 1s)
- **Use webhooks** for long-running jobs (>5 minutes) instead of polling
- **Batch artifact downloads** (use artifact list endpoint, then selective download)

### 6.4 Security

- **Validate webhook signatures** (HMAC-SHA256)
- **Use HTTPS** for all integrations (TLS 1.3)
- **Scope API keys** to minimum required permissions
- **Monitor for anomalies** (sudden spike in API calls, unusual access patterns)

---

## 7. Integration Roadmap

### Phase 1 (MVP - Months 1-6)
- ✅ REST API (core endpoints)
- ✅ MCP server (Claude Code, GitHub Copilot)
- ✅ GitHub Actions plugin
- ✅ Webhooks (7 event types)

### Phase 2 (Months 6-12)
- Azure DevOps plugin
- GitLab CI plugin
- Slack bot integration (conversational interface)
- Zapier/Make integration (no-code automation)

### Phase 3 (Months 12-24)
- VS Code extension (native UI)
- JetBrains plugin (IntelliJ, PyCharm)
- Jira integration (create issues from compliance gaps)
- ServiceNow integration (enterprise ITSM)

---

**Document Status:** Approved
**Maintained By:** Platform Team
**Review Cadence:** Quarterly
