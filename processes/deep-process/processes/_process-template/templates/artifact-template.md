---
dp_id: "{ARTIFACT_TYPE}-{INSTANCE_CONTEXT}-{SEQ}"
dp_type: "artifact"
dp_status: "NOW"
version: "3.6"

# Process context
process:
  process_type: "{PROC-ID}"
  instance_id: "{instance-id}"
  step: "{step-id}"

context:
  depends_on:
    - path: "{previous_artifact_path}"
      type: "semantic_source"

semantic_hash:
  - "{Category}: {Fact}"

execution:
  active_methods: []

transaction:
  saga_id: "{saga_id}"
  previous_hash: null
---

# {Artifact Title}

## Context

**Process:** {process_name}
**Instance:** {instance_id}
**Step:** {step_name}

## Content

{Generated content following process requirements}

## Outputs

{What this artifact delivers}
