# Deep Process Cloud API - Database Schema

## Overview

The Deep Process Cloud API uses a **schema-per-tenant** approach in PostgreSQL for data isolation and security. This provides strong tenant isolation while maintaining operational simplicity.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────┐           │
│  │         SHARED SCHEMA (shared)          │           │
│  ├─────────────────────────────────────────┤           │
│  │  • tenants (tenant metadata)            │           │
│  │  • subscriptions (billing plans)        │           │
│  │  • processes (process registry)         │           │
│  │  • api_keys (global API keys)           │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
│  ┌─────────────────────────────────────────┐           │
│  │      TENANT SCHEMA (tenant_abc123)      │           │
│  ├─────────────────────────────────────────┤           │
│  │  • executions (workflow runs)           │           │
│  │  • audit_log (immutable events)         │           │
│  │  • users (tenant users)                 │           │
│  │  • webhooks (webhook configs)           │           │
│  │  • exports (generated files)            │           │
│  │  • quota_usage (usage tracking)         │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
│  ┌─────────────────────────────────────────┐           │
│  │      TENANT SCHEMA (tenant_xyz789)      │           │
│  ├─────────────────────────────────────────┤           │
│  │  • executions                           │           │
│  │  • audit_log                            │           │
│  │  • users                                │           │
│  │  • webhooks                             │           │
│  │  • exports                              │           │
│  │  • quota_usage                          │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Shared Schema (`shared`)

### Table: `tenants`

Stores tenant metadata and configuration.

```sql
CREATE TABLE shared.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,  -- e.g., 'acme-corp'
  schema_name VARCHAR(63) NOT NULL UNIQUE,  -- e.g., 'tenant_abc123'

  -- Subscription
  subscription_tier VARCHAR(50) NOT NULL DEFAULT 'free',  -- free, starter, professional, enterprise
  subscription_status VARCHAR(50) NOT NULL DEFAULT 'active',  -- active, suspended, cancelled

  -- Contact
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),

  -- Features
  features JSONB DEFAULT '{}',  -- enabled features
  settings JSONB DEFAULT '{}',  -- tenant-specific settings

  -- Quotas
  quota_monthly_executions INT DEFAULT 100,
  quota_concurrent_executions INT DEFAULT 3,
  quota_storage_gb INT DEFAULT 10,

  -- Billing
  billing_email VARCHAR(255),
  stripe_customer_id VARCHAR(255),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,  -- soft delete

  -- Constraints
  CHECK (slug ~ '^[a-z0-9-]+$'),
  CHECK (schema_name ~ '^tenant_[a-z0-9]+$')
);

CREATE INDEX idx_tenants_slug ON shared.tenants(slug);
CREATE INDEX idx_tenants_email ON shared.tenants(email);
CREATE INDEX idx_tenants_subscription_tier ON shared.tenants(subscription_tier);
```

### Table: `subscriptions`

Defines subscription tiers and their quotas.

```sql
CREATE TABLE shared.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Tier
  tier VARCHAR(50) NOT NULL UNIQUE,  -- free, starter, professional, enterprise
  name VARCHAR(100) NOT NULL,
  description TEXT,

  -- Pricing
  price_monthly_usd DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price_yearly_usd DECIMAL(10, 2) NOT NULL DEFAULT 0,

  -- Quotas
  quota_monthly_executions INT NOT NULL DEFAULT 100,
  quota_concurrent_executions INT NOT NULL DEFAULT 3,
  quota_storage_gb INT NOT NULL DEFAULT 10,
  quota_api_requests_per_minute INT NOT NULL DEFAULT 60,
  quota_users INT NOT NULL DEFAULT 5,

  -- Features
  features JSONB DEFAULT '{}',  -- feature flags

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default subscription tiers
INSERT INTO shared.subscriptions (tier, name, price_monthly_usd, price_yearly_usd, quota_monthly_executions, quota_concurrent_executions, quota_storage_gb, quota_api_requests_per_minute, quota_users, features) VALUES
  ('free', 'Free', 0, 0, 100, 3, 10, 60, 5, '{"basic_processes": true}'),
  ('starter', 'Starter', 49, 490, 500, 10, 50, 300, 10, '{"basic_processes": true, "advanced_processes": true, "exports": true}'),
  ('professional', 'Professional', 199, 1990, 2500, 25, 200, 1000, 50, '{"basic_processes": true, "advanced_processes": true, "exports": true, "webhooks": true, "priority_support": true}'),
  ('enterprise', 'Enterprise', 999, 9990, 10000, 100, 1000, 5000, -1, '{"basic_processes": true, "advanced_processes": true, "exports": true, "webhooks": true, "white_label": true, "sso": true, "priority_support": true, "dedicated_account_manager": true}');
```

### Table: `processes`

Registry of available Deep Process workflows.

```sql
CREATE TABLE shared.processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  process_id VARCHAR(100) NOT NULL UNIQUE,  -- e.g., 'deep-risk'
  name VARCHAR(255) NOT NULL,
  version VARCHAR(50) NOT NULL,

  -- Details
  description TEXT,
  category VARCHAR(100),  -- 'risk', 'architecture', 'compliance', etc.

  -- Execution
  min_subscription_tier VARCHAR(50) NOT NULL DEFAULT 'free',  -- minimum tier required
  estimated_duration_minutes INT,  -- estimated execution time

  -- Metadata
  manifest JSONB NOT NULL,  -- full process manifest
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_processes_process_id ON shared.processes(process_id);
CREATE INDEX idx_processes_category ON shared.processes(category);
```

### Table: `api_keys`

Global API keys for authentication.

```sql
CREATE TABLE shared.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Ownership
  tenant_id UUID NOT NULL REFERENCES shared.tenants(id) ON DELETE CASCADE,
  user_id UUID,  -- optional: which user created this key

  -- Key
  key_hash VARCHAR(255) NOT NULL UNIQUE,  -- SHA-256 hash of API key
  key_prefix VARCHAR(20) NOT NULL,  -- first 8 chars for identification

  -- Metadata
  name VARCHAR(255) NOT NULL,  -- user-friendly name
  description TEXT,

  -- Permissions
  scopes TEXT[] DEFAULT ARRAY['read', 'write'],  -- API scopes

  -- Lifecycle
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CHECK (key_prefix ~ '^dp_[a-zA-Z0-9]+$')
);

CREATE INDEX idx_api_keys_tenant_id ON shared.api_keys(tenant_id);
CREATE INDEX idx_api_keys_key_hash ON shared.api_keys(key_hash);
CREATE INDEX idx_api_keys_key_prefix ON shared.api_keys(key_prefix);
```

## Tenant Schema Template (`tenant_{id}`)

Each tenant gets their own PostgreSQL schema with the following tables:

### Table: `executions`

Stores workflow execution records.

```sql
CREATE TABLE {schema}.executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Process
  process_id VARCHAR(100) NOT NULL,
  process_name VARCHAR(255) NOT NULL,

  -- Input
  user_input TEXT NOT NULL,
  depth VARCHAR(50) NOT NULL,  -- quick, standard, comprehensive, critical
  context_files JSONB DEFAULT '[]',

  -- Execution
  status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, running, completed, failed, cancelled
  progress INT DEFAULT 0,  -- 0-100
  current_step VARCHAR(255),

  -- Results
  result JSONB,  -- final workflow result
  error TEXT,  -- error message if failed

  -- Steps
  steps JSONB DEFAULT '[]',  -- array of step results
  gates JSONB DEFAULT '[]',  -- array of gate results
  scope_reductions JSONB DEFAULT '[]',  -- array of scope reductions

  -- Metrics
  execution_time_ms INT,
  token_usage JSONB,  -- prompt_tokens, completion_tokens, total_tokens
  cost_usd DECIMAL(10, 4),  -- estimated cost

  -- Provider
  llm_provider VARCHAR(100),
  llm_model VARCHAR(100),

  -- Metadata
  created_by UUID,  -- user who initiated
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_executions_status ON {schema}.executions(status);
CREATE INDEX idx_executions_process_id ON {schema}.executions(process_id);
CREATE INDEX idx_executions_created_at ON {schema}.executions(created_at DESC);
CREATE INDEX idx_executions_created_by ON {schema}.executions(created_by);
```

### Table: `audit_log`

Immutable audit trail of all tenant actions.

```sql
CREATE TABLE {schema}.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event
  event_type VARCHAR(100) NOT NULL,  -- execution.created, execution.completed, export.generated, etc.
  event_category VARCHAR(50) NOT NULL,  -- execution, export, config, auth, etc.

  -- Actor
  actor_type VARCHAR(50) NOT NULL,  -- user, system, api_key
  actor_id UUID NOT NULL,
  actor_name VARCHAR(255),

  -- Resource
  resource_type VARCHAR(100),  -- execution, export, webhook, etc.
  resource_id UUID,

  -- Details
  event_data JSONB DEFAULT '{}',  -- detailed event data

  -- Request
  ip_address INET,
  user_agent TEXT,

  -- Timestamp (immutable)
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_audit_log_timestamp ON {schema}.audit_log(timestamp DESC);
CREATE INDEX idx_audit_log_event_type ON {schema}.audit_log(event_type);
CREATE INDEX idx_audit_log_actor_id ON {schema}.audit_log(actor_id);
CREATE INDEX idx_audit_log_resource_id ON {schema}.audit_log(resource_id);

-- Make audit_log append-only (prevent updates/deletes)
CREATE RULE audit_log_no_update AS ON UPDATE TO {schema}.audit_log DO INSTEAD NOTHING;
CREATE RULE audit_log_no_delete AS ON DELETE TO {schema}.audit_log DO INSTEAD NOTHING;
```

### Table: `users`

Tenant-specific users.

```sql
CREATE TABLE {schema}.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),

  -- Auth (for SSO, store external ID)
  auth_provider VARCHAR(50),  -- 'local', 'azure-ad', 'okta', 'google'
  auth_provider_id VARCHAR(255),  -- external user ID
  password_hash VARCHAR(255),  -- for local auth (bcrypt)

  -- Roles & Permissions
  role VARCHAR(50) NOT NULL DEFAULT 'user',  -- admin, user, auditor, approver
  permissions TEXT[] DEFAULT ARRAY['read', 'execute'],

  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'active',  -- active, invited, suspended, deleted

  -- Metadata
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON {schema}.users(email);
CREATE INDEX idx_users_role ON {schema}.users(role);
```

### Table: `webhooks`

Webhook configurations for event notifications.

```sql
CREATE TABLE {schema}.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Configuration
  name VARCHAR(255) NOT NULL,
  url VARCHAR(2048) NOT NULL,
  secret VARCHAR(255) NOT NULL,  -- for HMAC signature

  -- Events
  events TEXT[] NOT NULL,  -- ['execution.completed', 'gate.failed', etc.]

  -- Filters
  filters JSONB DEFAULT '{}',  -- filter by process_id, status, etc.

  -- Delivery
  enabled BOOLEAN DEFAULT TRUE,
  retry_count INT DEFAULT 3,
  timeout_seconds INT DEFAULT 30,

  -- Status
  status VARCHAR(50) DEFAULT 'active',  -- active, failed, disabled
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  last_success_at TIMESTAMP WITH TIME ZONE,
  last_failure_at TIMESTAMP WITH TIME ZONE,
  failure_count INT DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_webhooks_enabled ON {schema}.webhooks(enabled) WHERE enabled = TRUE;
```

### Table: `exports`

Generated export files (PDF, Excel, PowerPoint).

```sql
CREATE TABLE {schema}.exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source
  execution_id UUID NOT NULL REFERENCES {schema}.executions(id) ON DELETE CASCADE,

  -- Export
  format VARCHAR(50) NOT NULL,  -- pdf, xlsx, pptx
  template VARCHAR(255),  -- template used

  -- File
  filename VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT,
  file_url TEXT,  -- blob storage URL

  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, generating, completed, failed
  error TEXT,

  -- Metadata
  generated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,  -- optional expiration
  download_count INT DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_exports_execution_id ON {schema}.exports(execution_id);
CREATE INDEX idx_exports_status ON {schema}.exports(status);
CREATE INDEX idx_exports_created_at ON {schema}.exports(created_at DESC);
```

### Table: `quota_usage`

Tracks quota usage for rate limiting.

```sql
CREATE TABLE {schema}.quota_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Period
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Usage
  executions_count INT DEFAULT 0,
  storage_bytes BIGINT DEFAULT 0,
  api_requests_count INT DEFAULT 0,

  -- Metadata
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one record per period
  UNIQUE(period_start, period_end)
);

CREATE INDEX idx_quota_usage_period ON {schema}.quota_usage(period_start, period_end);
```

## Migration Strategy

### Initial Setup

```sql
-- 1. Create shared schema
CREATE SCHEMA IF NOT EXISTS shared;

-- 2. Create shared tables
-- (tenants, subscriptions, processes, api_keys)

-- 3. For each new tenant:
--    a. Generate unique schema name: tenant_{random_id}
--    b. Create schema: CREATE SCHEMA tenant_abc123
--    c. Run tenant template SQL
--    d. Insert tenant record in shared.tenants
```

### Tenant Provisioning

```typescript
async function provisionTenant(tenantData: {
  name: string;
  email: string;
  subscriptionTier: string;
}): Promise<Tenant> {
  const db = await getDbConnection();

  try {
    await db.query('BEGIN');

    // 1. Generate schema name
    const randomId = generateRandomId();
    const schemaName = `tenant_${randomId}`;
    const slug = slugify(tenantData.name);

    // 2. Create tenant record
    const tenant = await db.query(
      `INSERT INTO shared.tenants (name, slug, schema_name, email, subscription_tier)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tenantData.name, slug, schemaName, tenantData.email, tenantData.subscriptionTier]
    );

    // 3. Create schema
    await db.query(`CREATE SCHEMA ${schemaName}`);

    // 4. Create tenant tables
    await db.query(getTenantSchemaTemplate(schemaName));

    await db.query('COMMIT');

    return tenant.rows[0];
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}
```

## Indexes & Performance

### Key Indexes

- **Shared Schema:**
  - `tenants.slug` - Fast tenant lookup
  - `api_keys.key_hash` - Fast API key validation

- **Tenant Schema:**
  - `executions.status` - Filter by status
  - `executions.created_at DESC` - Recent executions first
  - `audit_log.timestamp DESC` - Recent audit events
  - `webhooks.enabled` - Active webhooks only

### Query Optimization

```sql
-- Set search_path per request for tenant isolation
SET search_path TO tenant_abc123, public;

-- Now all queries use tenant schema
SELECT * FROM executions WHERE status = 'completed';
```

## Security

### Row-Level Security (Optional Enhancement)

```sql
ALTER TABLE {schema}.executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_executions ON {schema}.executions
  FOR SELECT
  USING (created_by = current_user_id());
```

### Audit Log Protection

```sql
-- Audit log is append-only
CREATE RULE audit_log_no_update AS ON UPDATE TO {schema}.audit_log DO INSTEAD NOTHING;
CREATE RULE audit_log_no_delete AS ON DELETE TO {schema}.audit_log DO INSTEAD NOTHING;

-- Use write-only role for audit inserts
GRANT INSERT ON {schema}.audit_log TO audit_writer;
REVOKE UPDATE, DELETE ON {schema}.audit_log FROM audit_writer;
```

## Backup & Recovery

### Backup Strategy

```bash
# Full database backup
pg_dump -Fc deepprocess > backup_$(date +%Y%m%d).dump

# Tenant-specific backup
pg_dump -Fc -n tenant_abc123 deepprocess > tenant_abc123_backup.dump

# Shared schema only
pg_dump -Fc -n shared deepprocess > shared_backup.dump
```

### Point-in-Time Recovery

```sql
-- Enable WAL archiving
ALTER SYSTEM SET wal_level = 'replica';
ALTER SYSTEM SET archive_mode = 'on';
ALTER SYSTEM SET archive_command = 'cp %p /archive/%f';
```

## Monitoring

### Key Metrics

```sql
-- Tenant count
SELECT COUNT(*) FROM shared.tenants WHERE deleted_at IS NULL;

-- Active executions
SELECT COUNT(*) FROM {schema}.executions WHERE status IN ('pending', 'running');

-- Quota usage
SELECT
  t.name,
  q.executions_count,
  t.quota_monthly_executions,
  (q.executions_count::FLOAT / t.quota_monthly_executions * 100) as usage_pct
FROM shared.tenants t
LEFT JOIN {schema}.quota_usage q ON q.period_start = date_trunc('month', NOW())
WHERE t.schema_name = '{schema}';
```

## Maintenance

### Cleanup Old Data

```sql
-- Delete old audit logs (optional, if not required for compliance)
DELETE FROM {schema}.audit_log
WHERE timestamp < NOW() - INTERVAL '7 years';

-- Delete expired exports
DELETE FROM {schema}.exports
WHERE expires_at < NOW() AND status = 'completed';
```

### Vacuum & Analyze

```bash
# Vacuum all tenant schemas
psql -c "SELECT 'VACUUM ANALYZE ' || nspname || ';'
         FROM pg_namespace
         WHERE nspname LIKE 'tenant_%'" \
  | psql -d deepprocess
```

---

**Next Steps:**
1. Create migration files
2. Implement tenant provisioning service
3. Build tenant resolver middleware
4. Implement quota manager
