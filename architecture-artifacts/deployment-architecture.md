# Deployment Architecture — Deep-* Process Platform

**Version:** 1.0.0
**Date:** 2026-02-15
**Status:** Approved

---

## 1. DEPLOYMENT OVERVIEW

### 1.1 Deployment Models

The Deep-* Process Platform supports 3 deployment models to serve diverse enterprise requirements:

| Model | Target Customer | Characteristics | Use Cases |
|-------|----------------|-----------------|-----------|
| **SaaS Multi-Tenant** | SMB, Mid-Market | Shared infrastructure, schema-per-tenant isolation | Fast onboarding, cost-efficient, CL-001 Fast Market |
| **Hybrid Cloud** | Enterprise (Mixed Requirements) | Compliance on-prem, analytics cloud | GDPR data residency + cloud analytics |
| **On-Prem Single-Tenant** | HIPAA/FedRAMP Customers | Dedicated infrastructure, air-gapped option | Healthcare, pharma, government, financial services |

### 1.2 Recommended Deployment Path

**Start:** SaaS Multi-Tenant (MVP, Months 1-6)
**Add:** Hybrid Cloud (Enterprise expansion, Months 6-12)
**Optional:** On-Prem (HIPAA demand, Months 12-24)

---

## 2. SAAS MULTI-TENANT DEPLOYMENT (AWS PRIMARY)

### 2.1 Infrastructure Topology

**See:** `diagrams/deployment.mermaid` - AWS Cloud section

**VPC:** us-east-1 (Primary region)

**Public Subnet:**
- Application Load Balancer (ALB): TLS 1.3 termination, routing to API Gateway
- NAT Gateway: Outbound internet for private subnet

**Private Subnet - EKS Cluster:**
- API Gateway Pods: 3 replicas (auto-scaling 3-10)
- Orchestrator Pods: 2 replicas
- Executor Pool: 5-100 replicas (Horizontal Pod Autoscaler based on SQS queue depth)
- Process Services: 5 dedicated + 1 common pool
- Infrastructure Services: IAM, Artifact Storage, LLM Integration, MCP Server, Webhooks
- Observability: Prometheus, Grafana, Jaeger

**Data Layer:**
- RDS PostgreSQL Multi-AZ (db.r6g.2xlarge) + Read Replica
- Automated backups (7-day retention), point-in-time recovery

**Managed Services:**
- S3 Bucket: Versioned, lifecycle policies (Standard → IA @30d → Glacier @90d)
- SQS FIFO Queue + DLQ
- EventBridge Custom Event Bus (7-day archive)
- Secrets Manager: LLM API keys, database credentials
- CloudWatch Logs: 30-day retention (info), 90-day (errors), 7-year (audit)

### 2.2 Kubernetes Configuration

**EKS Version:** 1.28+
**Node Groups:**
- **System Node Pool:** 3 nodes (t3.large) for platform services (ALB Ingress Controller, CoreDNS, kube-proxy)
- **Application Node Pool:** 3-10 nodes (c6i.2xlarge, 8 vCPU, 16GB RAM) for process services
- **Executor Node Pool:** 2-50 nodes (c6i.4xlarge, 16 vCPU, 32GB RAM) for executor pool (auto-scaling)

**Networking:**
- CNI: AWS VPC CNI (native VPC integration)
- Service Mesh: Istio (optional for v2, not MVP)
- Ingress: AWS Load Balancer Controller

**Storage:**
- EBS CSI Driver for persistent volumes (PostgreSQL local cache, observability data)
- S3 CSI Driver for artifact mounting (optional)

### 2.3 Deployment Manifests

**API Gateway Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: deep-process
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: deep-process/api-gateway:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: IAM_SERVICE_URL
          value: "http://iam-service:8081"
        - name: ORCHESTRATOR_URL
          value: "http://orchestrator:8082"
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"
          limits:
            cpu: "2000m"
            memory: "2Gi"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
  namespace: deep-process
spec:
  selector:
    app: api-gateway
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP
```

**Executor Pool HPA:**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: executor-pool-hpa
  namespace: deep-process
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: executor-pool
  minReplicas: 5
  maxReplicas: 100
  metrics:
  - type: External
    external:
      metric:
        name: sqs_queue_depth
        selector:
          matchLabels:
            queue_name: deep-process-jobs
      target:
        type: AverageValue
        averageValue: "10" # Scale up if >10 messages per pod
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### 2.4 Infrastructure-as-Code (Terraform)

**VPC Module:**
```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"

  name = "deep-process-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = false  # One NAT per AZ for HA

  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Environment = "production"
    Project     = "deep-process"
  }
}
```

**EKS Cluster:**
```hcl
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.16.0"

  cluster_name    = "deep-process-eks"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_public_access = true

  eks_managed_node_groups = {
    system = {
      min_size     = 3
      max_size     = 5
      desired_size = 3
      instance_types = ["t3.large"]
      labels = {
        role = "system"
      }
    }

    application = {
      min_size     = 3
      max_size     = 10
      desired_size = 5
      instance_types = ["c6i.2xlarge"]
      labels = {
        role = "application"
      }
    }

    executor = {
      min_size     = 2
      max_size     = 50
      desired_size = 5
      instance_types = ["c6i.4xlarge"]
      labels = {
        role = "executor"
      }
      taints = [{
        key    = "workload"
        value  = "executor"
        effect = "NoSchedule"
      }]
    }
  }
}
```

**RDS PostgreSQL:**
```hcl
module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.1.0"

  identifier = "deep-process-db"

  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.r6g.2xlarge"
  allocated_storage = 500
  storage_encrypted = true

  multi_az               = true
  db_subnet_group_name   = module.vpc.database_subnet_group
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  create_db_parameter_group = true
  parameter_group_name      = "deep-process-pg15"
  family                    = "postgres15"

  parameters = [
    {
      name  = "log_connections"
      value = "1"
    },
    {
      name  = "log_disconnections"
      value = "1"
    },
    {
      name  = "rds.force_ssl"
      value = "1"
    }
  ]
}
```

---

## 3. HYBRID CLOUD DEPLOYMENT (AWS + AZURE)

### 3.1 Architecture

**AWS (Primary):** Deep-explore, deep-document, deep-diagram, deep-feasibility (cloud-native, analytics-heavy)
**Azure (Secondary):** Deep-compliance, deep-risk (potential on-prem deployment for HIPAA customers)

### 3.2 Data Synchronization

**Cross-Cloud Sync:**
- Job metadata: PostgreSQL replication (AWS RDS → Azure PostgreSQL Flexible Server) via logical replication
- Artifacts: S3 → Azure Blob via AWS DataSync or Rclone
- Events: EventBridge → Azure Event Grid via webhook relay

**Latency:** 1-5 seconds for metadata sync, 10-60 seconds for artifact sync

### 3.3 Deployment Mapping

| Process | AWS | Azure | Rationale |
|---------|-----|-------|-----------|
| deep-explore | ✓ | | Analytics-heavy, cloud-optimized |
| deep-compliance | ✓ | ✓ | Replicated for on-prem option (HIPAA) |
| deep-risk | ✓ | ✓ | Replicated for on-prem option |
| deep-architect | ✓ | | Cloud-native, diagram generation |
| deep-document | ✓ | | Cloud-native |
| Others | ✓ | | Cloud-native (common pool) |

---

## 4. ON-PREM DEPLOYMENT (HIPAA CUSTOMERS)

### 4.1 Architecture

**Customer Data Center:**
- Kubernetes Cluster (self-managed or Rancher)
- PostgreSQL (customer-managed, no cloud replication)
- MinIO Object Storage (S3-compatible)
- Air-gapped option (no internet connectivity)

### 4.2 Deployment Package

**Deliverables:**
- Helm chart: `deep-process-onprem-1.0.0.tgz`
- Container images: Exported to customer registry (ECR private, Azure ACR, or Harbor)
- Database migration scripts: Flyway or Liquibase
- Installation guide: 50-page PDF
- Support: 24/7 on-call engineer during deployment (first 30 days)

### 4.3 Air-Gapped Deployment

**Challenges:**
- No LLM API access (Anthropic, OpenAI external)
- No automatic updates
- No telemetry data sent to vendor

**Solutions:**
1. **Local LLM Deployment:** Deploy Azure OpenAI in customer's Azure tenant (not air-gapped) OR Ollama/vLLM for open-source models (degraded quality)
2. **Manual Updates:** Quarterly update packages shipped via secure transfer (USB, SFTP)
3. **Offline Activation:** License key validation without internet (phone home once per year)

### 4.4 Cost Model

**On-Prem Pricing:**
- **License:** $250K/year (unlimited users, unlimited jobs for single customer)
- **Professional Services:** $100K one-time (deployment, training, customization)
- **Support:** $50K/year (24/7 on-call, quarterly updates)
- **Total Year 1:** $400K
- **Total Year 2+:** $300K/year

**Customer Infrastructure Costs (estimated):**
- Kubernetes Cluster: 10 nodes × $500/month = $60K/year
- PostgreSQL: $20K/year (licenses, storage, backups)
- Object Storage: $5K/year (10TB)
- **Total Infrastructure:** $85K/year

**Grand Total (Customer Pays):** $485K Year 1, $385K Year 2+

---

## 5. NETWORKING & SECURITY

### 5.1 Network Topology

**SaaS Multi-Tenant:**
- ALB: Public IP, TLS 1.3 termination
- API Gateway: Private IP (10.0.1.x)
- All other services: Private IPs (no public access)
- Egress: Via NAT Gateway for LLM API calls, webhook delivery

**Hybrid Cloud:**
- AWS VPC Peering with Azure VNet (optional for low-latency sync)
- VPN Tunnel: AWS VPC → Customer Data Center (IPsec, 100 Mbps)
- Private Link: AWS PrivateLink for S3, RDS access from on-prem

### 5.2 Security Groups

**ALB Security Group:**
- Inbound: 443 (HTTPS) from 0.0.0.0/0
- Outbound: All to API Gateway SG

**API Gateway Security Group:**
- Inbound: 8080 from ALB SG
- Outbound: All to Orchestrator SG, IAM SG

**RDS Security Group:**
- Inbound: 5432 (PostgreSQL) from EKS Node SG
- Outbound: None

**EKS Node Security Group:**
- Inbound: All from EKS Control Plane SG, pod-to-pod communication
- Outbound: All (internet via NAT Gateway)

### 5.3 Encryption

**In Transit:**
- TLS 1.3 for all HTTPS (ALB, API Gateway, webhooks)
- mTLS for service-to-service (Istio service mesh in v2)
- PostgreSQL SSL/TLS connections (rds.force_ssl=1)

**At Rest:**
- RDS: AES-256 encryption (AWS KMS)
- S3: SSE-S3 (AES-256)
- EBS Volumes: Encrypted (AWS KMS)

### 5.4 Secrets Management

**AWS Secrets Manager:**
- LLM API keys (Anthropic, OpenAI)
- Database credentials (master password, read-only user)
- SSO client secrets (Okta, Azure AD)
- Webhook HMAC signing keys

**Rotation:**
- LLM API keys: Manual rotation every 90 days
- Database passwords: Auto-rotation every 30 days (RDS feature)
- SSO secrets: Manual rotation every 180 days

---

## 6. DISASTER RECOVERY & BUSINESS CONTINUITY

### 6.1 Backup Strategy

**RDS PostgreSQL:**
- Automated daily backups (7-day retention)
- Manual snapshots before major deployments
- Cross-region snapshot copy to us-west-2 (disaster recovery)
- Point-in-time recovery (PITR) enabled

**S3 Artifacts:**
- Versioning enabled (retain all versions)
- Cross-region replication to us-west-2
- Lifecycle policies: Glacier Deep Archive after 365 days

**Kubernetes State:**
- etcd backups to S3 every 6 hours (Velero)
- Helm chart values in git repository (GitOps)

### 6.2 Recovery Objectives

**RTO (Recovery Time Objective):**
- RDS failover: 1-5 minutes (Multi-AZ automatic failover)
- EKS cluster rebuild: 30-60 minutes (Terraform + Helm)
- Full region failure recovery: 2-4 hours (fail over to us-west-2)

**RPO (Recovery Point Objective):**
- Database: <5 minutes (PITR to any point in last 7 days)
- Artifacts: <1 minute (S3 cross-region replication)
- Application state: <6 hours (Velero backup interval)

### 6.3 Disaster Scenarios

**Scenario 1: Single AZ Failure**
- **Impact:** 1/3 of nodes down, RDS fails over to standby in another AZ
- **Recovery:** Automatic (EKS reschedules pods, RDS Multi-AZ failover)
- **Downtime:** 1-5 minutes

**Scenario 2: RDS Primary Failure**
- **Impact:** Database writes unavailable
- **Recovery:** Automatic Multi-AZ failover to standby
- **Downtime:** 1-5 minutes
- **Data Loss:** None (synchronous replication)

**Scenario 3: S3 Bucket Deletion (Accidental)**
- **Impact:** All artifacts lost
- **Recovery:** Restore from versioning or cross-region replica
- **Downtime:** 2-4 hours (restore + re-index)
- **Data Loss:** None (versioning + replication)

**Scenario 4: Entire Region Failure (us-east-1)**
- **Impact:** Full platform outage
- **Recovery:** Manual failover to us-west-2 DR region
- **Downtime:** 2-4 hours (DNS update, RDS snapshot restore, Terraform apply)
- **Data Loss:** <5 minutes (RDS PITR)

---

## 7. MONITORING & ALERTING

**See:** architecture-comprehensive.md Section 7 (Operational Model)

**Key Metrics:**
- API Gateway: Request rate, error rate (5xx, 4xx), P95 latency
- Executor Pool: Active jobs, queue depth, job duration
- RDS: CPU, memory, IOPS, connection count, replication lag
- S3: Bucket size, request rate, 4xx/5xx errors
- EKS: Node CPU/memory, pod count, pending pods

**Critical Alerts:**
- RDS failover (PagerDuty)
- API Gateway >50% 5xx errors (PagerDuty)
- Executor pool queue depth >1000 (PagerDuty)
- S3 4xx errors >10% (Slack)
- EKS node Not Ready (PagerDuty)

---

## 8. COST OPTIMIZATION

### 8.1 AWS Cost Breakdown (Monthly)

| Resource | Configuration | Cost |
|----------|--------------|------|
| EKS Control Plane | $0.10/hour | $73 |
| EC2 Nodes (Application) | 5 × c6i.2xlarge (On-Demand) | $509 |
| EC2 Nodes (Executor) | 5 × c6i.4xlarge (Spot, 70% discount) | $458 |
| RDS PostgreSQL | db.r6g.2xlarge Multi-AZ | $900 |
| S3 Standard (1TB) | 1024 GB | $23 |
| S3 Glacier (10TB after 90 days) | 10240 GB | $41 |
| SQS | 1M requests | $0.40 |
| EventBridge | 500K events | $0.50 |
| NAT Gateway | 3 × $32/month + data transfer | $100 |
| ALB | $16/month + LCU | $25 |
| CloudWatch Logs | 100 GB ingested | $50 |
| Secrets Manager | 10 secrets | $4 |
| **Total Infrastructure** | | **$2,183** |
| LLM API (Anthropic) | 100 jobs/day × $0.50/job × 30 days | $1,500 |
| **Grand Total** | | **$3,683/month** |

**Annual:** $44K infrastructure + LLM

### 8.2 Cost Optimization Strategies

1. **Spot Instances for Executor Pool:** 70% discount on c6i.4xlarge (already applied)
2. **Reserved Instances:** Commit to 1-year RDS Reserved Instance → save 30% ($270/month)
3. **S3 Lifecycle Policies:** Standard (0-30d) → IA (30-90d) → Glacier (90d+) → save $800/month on 100TB
4. **Executor Pool Right-Sizing:** Monitor CPU/memory utilization, downgrade from c6i.4xlarge to c6i.2xlarge if <50% utilized → save $450/month
5. **LLM API Cost Control:** Implement caching (repeat prompts), prompt optimization (shorter prompts), model selection (use cheaper models for non-critical tasks) → save $300-$500/month

**Potential Savings:** $1,820/month (40% reduction) = **$2,900/month** optimized run rate

---

## 9. DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] AWS account created, billing alerts configured
- [ ] Terraform state backend (S3 + DynamoDB for locking)
- [ ] Domain name registered, Route 53 hosted zone created
- [ ] SSL certificate requested (ACM for *.deep-process.com)
- [ ] Secrets created in Secrets Manager (database password, LLM API keys)
- [ ] IAM roles created for EKS, RDS, S3 access
- [ ] VPC CIDR planned (no conflicts with customer VPNs)

### Deployment

- [ ] Terraform apply: VPC, EKS, RDS, S3, SQS, EventBridge
- [ ] EKS cluster accessible (kubectl get nodes)
- [ ] Helm charts deployed: api-gateway, orchestrator, executor-pool, process services
- [ ] Database migrations applied (Flyway)
- [ ] Smoke tests passed (health checks, sample job submission)
- [ ] Monitoring configured (Prometheus, Grafana dashboards)
- [ ] Alerting configured (PagerDuty integration)

### Post-Deployment

- [ ] DNS records updated (deep-process.com → ALB)
- [ ] Load testing (100 concurrent jobs, measure P95 latency)
- [ ] Security scan (Trivy, Snyk, SonarQube)
- [ ] Penetration testing (external firm, SQL injection, tenant isolation)
- [ ] Runbook documented (incident response, rollback procedures)
- [ ] On-call rotation established

---

**Document Status:** Approved
**Maintained By:** Platform Team (DevOps/SRE)
**Review Cadence:** Quarterly
**Next Review:** 2026-05-15
