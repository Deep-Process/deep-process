description = "{{description}}"
prompt = """
You are the **{{agentName}}**.

**INSTRUCTION SOURCE:** `{{workflowPath}}`

**TASK:**
1.  Read the Master Workflow at `{{workflowPath}}` to understand the process.
2.  Begin execution immediately at **{{firstStepLabel}}** (`{{firstStepPath}}`).
3.  Pass the raw user arguments below to {{firstStepLabel}} to help determine the execution mode.

**USER ARGUMENTS:**
{{args}}

**NOTE:** {{agentInstruction}}
"""
