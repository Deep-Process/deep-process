# Method 333: Policy-as-Code Framework

**Category:** governance
**Priority:** 🔥 CRITICAL
**Complexity:** HIGH
**Effort:** 4-5 days
**Process:** deep-governance

---

## Description

Git-based governance policy management with version control, code review, and rollback. Policies are YAML/JSON files stored in Git → changes go through PR review → deployed automatically to enforcement engine.

This method enables treating governance policies the same way we treat code: versioned, reviewed, tested, and deployed. This ensures consistency, auditability, and enables rollback when policies cause issues.

---

## Input

```yaml
policy_file:
  type: string
  description: "Path to YAML policy definition"
  example: "policies/bias-threshold-policy.yaml"

change_type:
  type: enum
  values: [CREATE, UPDATE, DELETE]
  description: "Type of policy change"

approval_required:
  type: boolean
  default: true
  description: "Whether change requires approval before deployment"
```

---

## Output

### Policy Format

```yaml
policy:
  id: "POL-BIAS-001"
  name: "Bias Threshold Policy"
  version: "2.1.0"
  effective_date: "2026-03-01"

  scope:
    applies_to: ["all_production_models"]
    excludes: ["experimental_models"]

  rules:
    - rule_id: "BIAS-001"
      description: "Demographic parity difference must be < 5%"
      condition: "demographic_parity_diff < 0.05"
      action_if_violated: "SUSPEND_MODEL"
      notification: ["ml-team@company.com", "compliance@company.com"]

    - rule_id: "BIAS-002"
      description: "Equalized odds difference must be < 10%"
      condition: "equalized_odds_diff < 0.10"
      action_if_violated: "ALERT_ONLY"

  enforcement:
    check_frequency: "daily"
    grace_period: "48h"
    escalation_path: ["ml-team", "compliance-team", "CTO"]

  audit:
    last_modified: "2026-02-14T15:00:00Z"
    modified_by: "john.doe@company.com"
    change_reason: "Tightened bias threshold from 10% to 5%"
    approved_by: ["compliance-officer@company.com"]
```

### Deployment Result

```yaml
deployment:
  policy_id: "POL-BIAS-001"
  version: "2.1.0"
  deployed_at: "2026-02-14T16:00:00Z"
  deployed_by: "automated-deployment-pipeline"

  validation:
    schema_valid: true
    breaking_changes: false
    impact_analysis:
      affected_models: 12
      models_would_violate: 3
      estimated_suspensions: 3

  rollout:
    strategy: "gradual"  # or "immediate"
    phases:
      - phase: 1
        percentage: 10%
        start: "2026-02-14T16:00:00Z"
        duration: "1h"
      - phase: 2
        percentage: 50%
        start: "2026-02-14T17:00:00Z"
        duration: "2h"
      - phase: 3
        percentage: 100%
        start: "2026-02-14T19:00:00Z"

  status: "DEPLOYED_SUCCESSFULLY"
```

---

## Procedure

### Step 1: Policy Development Workflow

```bash
# Developer creates/modifies policy
git checkout -b policy/tighten-bias-threshold
vim policies/bias-policy.yaml

# Change threshold: 10% → 5%
# rules:
#   - rule_id: "BIAS-001"
#     condition: "demographic_parity_diff < 0.05"  # Was 0.10

git add policies/bias-policy.yaml
git commit -m "Tighten bias threshold to 5% per compliance requirement"
git push origin policy/tighten-bias-threshold
```

### Step 2: Automated Validation (CI/CD)

```python
def validate_policy(policy_file: str) -> ValidationResult:
    """
    Validate policy before allowing PR merge.

    Checks:
    1. YAML syntax valid
    2. Schema compliance (all required fields present)
    3. Breaking change detection
    4. Impact analysis (how many models would violate?)
    5. Security checks (no injection vulnerabilities)

    Returns:
        ValidationResult with pass/fail + details
    """
```

**GitHub Actions workflow:**
```yaml
name: Policy Validation
on: pull_request

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate YAML syntax
        run: yamllint policies/*.yaml
      - name: Validate schema
        run: python scripts/validate_policy_schema.py
      - name: Breaking change detection
        run: python scripts/detect_breaking_changes.py
      - name: Impact analysis
        run: python scripts/analyze_policy_impact.py
      - name: Comment results on PR
        uses: actions/github-script@v6
```

### Step 3: Code Review

```
Pull Request: #123 - Tighten bias threshold to 5%

Reviewers:
  - compliance-team (REQUIRED)
  - ml-team (OPTIONAL)

Automated Checks:
  ✅ YAML syntax valid
  ✅ Schema compliant
  ⚠️ BREAKING CHANGE: 3 models would violate new threshold
  ✅ Impact analysis: Low risk (models can be retrained)
  ✅ Security: No injection vulnerabilities

Comments:
  compliance-officer: "Approved - aligns with new EU AI Act guidance"
  ml-lead: "3 models will need retraining - can complete within 48h grace period"

Status: APPROVED
```

### Step 4: Deployment

```python
def deploy_policy(policy_file: str, strategy: str = "gradual") -> DeploymentResult:
    """
    Deploy approved policy to production.

    Strategies:
    - "immediate": Deploy to all systems now
    - "gradual": Phased rollout (10% → 50% → 100%)
    - "canary": Deploy to test models first

    Steps:
    1. Load policy from Git
    2. Validate one final time
    3. Deploy to enforcement engine
    4. Monitor for issues
    5. Rollback if needed

    Returns:
        DeploymentResult with status and metrics
    """
```

### Step 5: Enforcement

```python
def enforce_policy(policy: Dict, model: str) -> EnforcementResult:
    """
    Check model against policy and take action if violated.

    For each rule in policy:
    1. Evaluate condition (e.g., "demographic_parity_diff < 0.05")
    2. If violated:
       - Log violation to audit trail (Method #328)
       - Take action (SUSPEND_MODEL / ALERT_ONLY / etc.)
       - Send notifications
    3. Record enforcement event

    Returns:
        EnforcementResult with pass/fail + actions taken
    """
```

### Step 6: Monitoring & Rollback

```python
def monitor_policy_impact(policy_id: str, duration: str = "24h") -> MonitoringReport:
    """
    Monitor policy impact after deployment.

    Metrics:
    - Models affected
    - Violations detected
    - Actions taken (suspensions, alerts)
    - False positive rate
    - Performance impact

    If issues detected → trigger rollback
    """

def rollback_policy(policy_id: str, to_version: str) -> RollbackResult:
    """
    Rollback policy to previous version.

    Steps:
    1. Identify previous version from Git history
    2. Validate previous version still works
    3. Deploy previous version
    4. Verify rollback successful
    5. Notify stakeholders

    Returns:
        RollbackResult with status
    """
```

---

## Implementation

**File:** `methods/implementations/policy_as_code_framework.py`

```python
from typing import Dict, List, Optional
import yaml
from pathlib import Path
from datetime import datetime

class PolicyAsCodeFramework:
    """
    Git-based governance policy management framework.

    Example:
        >>> framework = PolicyAsCodeFramework(repo_path="policies/")
        >>> policy = framework.load_policy("bias-policy.yaml")
        >>> result = framework.deploy_policy(policy, strategy="gradual")
        >>> print(result.status)
        "DEPLOYED_SUCCESSFULLY"
    """

    def __init__(
        self,
        repo_path: str,
        enforcement_engine: Optional[object] = None
    ):
        self.repo_path = Path(repo_path)
        self.enforcement_engine = enforcement_engine or DefaultEnforcementEngine()

    def validate_policy(self, policy_file: str) -> Dict:
        """Validate policy before deployment."""
        # Implementation...
        pass

    def deploy_policy(
        self,
        policy_file: str,
        strategy: str = "gradual"
    ) -> Dict:
        """Deploy policy to production."""
        # Implementation...
        pass

    def enforce_policy(self, policy: Dict, model: str) -> Dict:
        """Enforce policy on model."""
        # Implementation...
        pass

    def rollback_policy(self, policy_id: str, to_version: str) -> Dict:
        """Rollback policy to previous version."""
        # Implementation...
        pass
```

---

## Examples

### Example 1: Create and Deploy New Policy

```python
framework = PolicyAsCodeFramework("policies/")

# 1. Create policy file
policy = {
    "id": "POL-HALLUC-001",
    "name": "Hallucination Threshold Policy",
    "version": "1.0.0",
    "scope": {"applies_to": ["all_production_models"]},
    "rules": [{
        "rule_id": "HALLUC-001",
        "description": "Hallucination rate must be < 2%",
        "condition": "hallucination_rate < 0.02",
        "action_if_violated": "ALERT_ONLY"
    }]
}

# 2. Validate
validation = framework.validate_policy(policy)
assert validation["schema_valid"] == True

# 3. Deploy
deployment = framework.deploy_policy(policy, strategy="gradual")
assert deployment["status"] == "DEPLOYED_SUCCESSFULLY"
```

### Example 2: Update Existing Policy

```python
# Load current policy
policy = framework.load_policy("POL-BIAS-001")
assert policy["version"] == "2.0.0"

# Update threshold
policy["rules"][0]["condition"] = "demographic_parity_diff < 0.05"  # Was 0.10
policy["version"] = "2.1.0"

# Validate breaking changes
validation = framework.validate_policy(policy)
assert validation["breaking_changes"] == True
assert validation["impact_analysis"]["models_would_violate"] == 3

# Deploy with approval
deployment = framework.deploy_policy(
    policy,
    strategy="gradual",
    require_approval=True
)
```

### Example 3: Enforce Policy

```python
policy = framework.load_policy("POL-BIAS-001")

# Check model against policy
enforcement = framework.enforce_policy(policy, model_id="customer-support-ai")

if enforcement["violated"]:
    print(f"Violation: {enforcement['rule_violated']}")
    print(f"Action taken: {enforcement['action']}")
    # Output: "Action taken: SUSPEND_MODEL"

assert enforcement["action"] == "SUSPEND_MODEL"
assert "notification_sent" in enforcement
```

### Example 4: Rollback Policy

```python
# Policy v2.1.0 causing issues → rollback to v2.0.0
rollback = framework.rollback_policy(
    policy_id="POL-BIAS-001",
    to_version="2.0.0"
)

assert rollback["status"] == "ROLLBACK_SUCCESSFUL"
assert rollback["current_version"] == "2.0.0"
```

---

## Integration

### Used By
- Method #336: Bias Metric Calculator (uses policy thresholds)
- Method #337: Guardrail Orchestrator (enforces policies)
- Method #339: Automated Remediation Engine (policy-driven remediation)
- deep-governance process (PHASE 2: Policy Definition)

### Uses
- Method #328: Audit Trail Generator (logs policy changes)
- Git (version control)

### Synergizes With
- Method #335: Model Drift Detector (drift policies)
- Method #340: Governance Dashboard (visualizes policy compliance)

---

## Testing

### Unit Tests

```python
class TestPolicyAsCodeFramework:

    def test_validate_policy_schema(self):
        """Test policy schema validation."""

    def test_validate_policy_breaking_changes(self):
        """Test breaking change detection."""

    def test_deploy_policy_immediate(self):
        """Test immediate deployment strategy."""

    def test_deploy_policy_gradual(self):
        """Test gradual deployment strategy."""

    def test_enforce_policy_pass(self):
        """Test policy enforcement when model complies."""

    def test_enforce_policy_violation(self):
        """Test policy enforcement when model violates."""

    def test_rollback_policy(self):
        """Test policy rollback to previous version."""

    def test_git_integration(self):
        """Test Git workflow (commit, PR, merge)."""
```

### Integration Tests

```python
def test_end_to_end_policy_workflow():
    """Test full workflow: create → validate → deploy → enforce → rollback."""

def test_integration_with_method_336_bias_calculator():
    """Test that Bias Calculator uses policy thresholds."""

def test_integration_with_method_328_audit_trail():
    """Test that policy changes are logged to audit trail."""
```

---

## Troubleshooting

### Issue: Policy validation fails in CI

**Solution:**
```bash
# Run validation locally
python scripts/validate_policy_schema.py policies/my-policy.yaml

# Check YAML syntax
yamllint policies/my-policy.yaml

# Review schema docs
cat policies/schema.yaml
```

### Issue: Deployment fails due to breaking changes

**Solution:**
```python
# Analyze impact
impact = framework.analyze_policy_impact("POL-BIAS-001", new_version="2.1.0")
print(f"Models affected: {impact['models_would_violate']}")

# Option 1: Retrain models first
# Option 2: Deploy with longer grace period
# Option 3: Rollback change
```

---

## Status

- [x] Specification complete
- [ ] Implementation started
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Code reviewed
- [ ] Merged to main

**Assignee:** @team-b-lead
**Week:** Week 1
**Deadline:** Friday, Feb 21, 2026
