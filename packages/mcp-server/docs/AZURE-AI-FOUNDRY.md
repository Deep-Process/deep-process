# Azure AI Foundry Integration Guide

This guide shows you how to deploy Deep Process MCP Server to Azure AI Foundry and make it available in the MCP catalog.

## Overview

Azure AI Foundry supports Model Context Protocol (MCP) servers, allowing AI applications to discover and use Deep Process workflows as tools.

**Deployment Options:**
1. **Azure Container Instances** - Simple, serverless deployment
2. **Azure Kubernetes Service (AKS)** - Scalable, production deployment
3. **Azure App Service** - PaaS deployment with easy scaling

## Prerequisites

- Azure subscription
- Azure CLI installed (`az`)
- Docker installed (for containerization)
- `@deep-process/mcp-server` package built

## Option 1: Azure Container Instances (Recommended for Testing)

### Step 1: Create Docker Image

Create `Dockerfile` in `packages/mcp-server/`:

```dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built files
COPY dist/ ./dist/

# Copy process files (required for execution)
COPY ../../processes/ ./processes/

# Expose port (if using HTTP transport in future)
# EXPOSE 3000

# Set entrypoint
ENTRYPOINT ["node", "dist/cli.js"]

# Default arguments (can be overridden)
CMD ["--provider", "ollama"]
```

### Step 2: Build Docker Image

```bash
cd packages/mcp-server
pnpm build

# Build Docker image
docker build -t deep-process-mcp:latest .

# Test locally
docker run -it deep-process-mcp:latest --help
```

### Step 3: Push to Azure Container Registry

```bash
# Create Azure Container Registry
az acr create \
  --resource-group deep-process-rg \
  --name deepprocessacr \
  --sku Basic \
  --location eastus

# Login to ACR
az acr login --name deepprocessacr

# Tag image
docker tag deep-process-mcp:latest deepprocessacr.azurecr.io/deep-process-mcp:1.0.0

# Push image
docker push deepprocessacr.azurecr.io/deep-process-mcp:1.0.0
```

### Step 4: Deploy to Azure Container Instances

```bash
# Create container instance with Ollama
az container create \
  --resource-group deep-process-rg \
  --name deep-process-mcp \
  --image deepprocessacr.azurecr.io/deep-process-mcp:1.0.0 \
  --registry-username deepprocessacr \
  --registry-password $(az acr credential show --name deepprocessacr --query passwords[0].value -o tsv) \
  --cpu 2 \
  --memory 4 \
  --restart-policy Always \
  --environment-variables \
    OLLAMA_HOST=http://your-ollama-instance:11434

# Or with OpenAI
az container create \
  --resource-group deep-process-rg \
  --name deep-process-mcp-openai \
  --image deepprocessacr.azurecr.io/deep-process-mcp:1.0.0 \
  --registry-username deepprocessacr \
  --registry-password $(az acr credential show --name deepprocessacr --query passwords[0].value -o tsv) \
  --cpu 2 \
  --memory 4 \
  --restart-policy Always \
  --environment-variables \
    OPENAI_API_KEY=sk-your-openai-key \
  --command-line "node dist/cli.js --provider openai"

# Check status
az container show \
  --resource-group deep-process-rg \
  --name deep-process-mcp \
  --query instanceView.state

# View logs
az container logs \
  --resource-group deep-process-rg \
  --name deep-process-mcp
```

### Step 5: Test Deployment

```bash
# Get container IP
CONTAINER_IP=$(az container show \
  --resource-group deep-process-rg \
  --name deep-process-mcp \
  --query ipAddress.ip -o tsv)

echo "MCP Server running at: $CONTAINER_IP"

# Test stdio connection (if exposed)
# Note: stdio is for local use, Azure deployment may need HTTP transport
```

## Option 2: Azure Kubernetes Service (Production)

### Step 1: Create AKS Cluster

```bash
# Create AKS cluster
az aks create \
  --resource-group deep-process-rg \
  --name deep-process-aks \
  --node-count 3 \
  --node-vm-size Standard_D2s_v3 \
  --enable-managed-identity \
  --generate-ssh-keys

# Get credentials
az aks get-credentials \
  --resource-group deep-process-rg \
  --name deep-process-aks
```

### Step 2: Create Kubernetes Deployment

Create `k8s-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deep-process-mcp
  labels:
    app: deep-process-mcp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: deep-process-mcp
  template:
    metadata:
      labels:
        app: deep-process-mcp
    spec:
      containers:
      - name: mcp-server
        image: deepprocessacr.azurecr.io/deep-process-mcp:1.0.0
        args: ["--provider", "openai"]
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-secret
              key: api-key
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        ports:
        - containerPort: 3000  # If using HTTP transport
---
apiVersion: v1
kind: Service
metadata:
  name: deep-process-mcp-service
spec:
  type: LoadBalancer
  selector:
    app: deep-process-mcp
  ports:
  - port: 80
    targetPort: 3000
```

### Step 3: Create Secrets

```bash
# Create secret for OpenAI API key
kubectl create secret generic openai-secret \
  --from-literal=api-key=sk-your-openai-key
```

### Step 4: Deploy to AKS

```bash
# Apply deployment
kubectl apply -f k8s-deployment.yaml

# Check deployment
kubectl get deployments
kubectl get pods
kubectl get services

# Get external IP
kubectl get service deep-process-mcp-service
```

## Azure AI Foundry MCP Catalog Submission

### Step 1: Prepare Metadata

Create `azure-mcp-manifest.json`:

```json
{
  "name": "Deep Process",
  "version": "1.0.0",
  "description": "13 AI-powered workflows for risk assessment, architecture design, compliance verification, and more",
  "publisher": "Deep Process Contributors",
  "category": "Development Tools",
  "tags": [
    "risk-assessment",
    "architecture",
    "compliance",
    "verification",
    "governance",
    "mcp"
  ],
  "endpoints": {
    "mcp": {
      "transport": "stdio",
      "command": "npx",
      "args": ["@deep-process/mcp-server"]
    }
  },
  "tools": [
    {
      "name": "deep-process:deep-verify",
      "description": "Vertical + horizontal verification of systems and designs"
    },
    {
      "name": "deep-process:deep-risk",
      "description": "Comprehensive 6-phase risk assessment"
    },
    {
      "name": "deep-process:deep-architect",
      "description": "Solution design and architecture workflow"
    }
    // ... all 13 tools
  ],
  "requirements": {
    "node": ">=20.0.0"
  },
  "documentation": "https://github.com/your-org/deep-process/tree/main/packages/mcp-server",
  "license": "MIT"
}
```

### Step 2: Submit to Catalog

1. **Login to Azure AI Foundry Portal**
   - Visit https://ai.azure.com/
   - Navigate to "Model Catalog" → "MCP Servers"

2. **Submit New MCP Server**
   - Click "Add MCP Server"
   - Upload `azure-mcp-manifest.json`
   - Provide deployment details (Container Registry URL)
   - Add screenshots and examples

3. **Verification Process**
   - Azure team will verify the submission
   - Test tool functionality
   - Review documentation

4. **Publication**
   - Once approved, MCP server appears in catalog
   - Users can discover and add to their AI applications

### Step 3: Update Listing

```bash
# Update version in package.json
npm version patch  # or minor/major

# Rebuild and push
pnpm build
docker build -t deepprocessacr.azurecr.io/deep-process-mcp:1.0.1 .
docker push deepprocessacr.azurecr.io/deep-process-mcp:1.0.1

# Update manifest
# Re-submit to catalog
```

## Configuration for Azure OpenAI

### Using Azure OpenAI Service

```bash
# Deploy with Azure OpenAI
az container create \
  --resource-group deep-process-rg \
  --name deep-process-mcp-azure \
  --image deepprocessacr.azurecr.io/deep-process-mcp:1.0.0 \
  --registry-username deepprocessacr \
  --registry-password $(az acr credential show --name deepprocessacr --query passwords[0].value -o tsv) \
  --cpu 2 \
  --memory 4 \
  --environment-variables \
    AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com \
    AZURE_OPENAI_KEY=your-azure-openai-key \
  --command-line "node dist/cli.js --provider azure --endpoint https://your-resource.openai.azure.com --api-key your-key"
```

## Monitoring & Logging

### Azure Monitor Integration

1. **Enable Container Insights**
```bash
az aks enable-addons \
  --resource-group deep-process-rg \
  --name deep-process-aks \
  --addons monitoring
```

2. **View Logs in Azure Portal**
   - Navigate to Azure Portal → Container Instances
   - Select your container
   - Go to "Logs" or "Metrics"

3. **Create Alerts**
   - Set up alerts for container failures
   - Monitor CPU/memory usage
   - Track execution times

### Application Insights

Add Application Insights to track usage:

```typescript
// In server.ts (future enhancement)
import { TelemetryClient } from 'applicationinsights';

const appInsights = new TelemetryClient({
  instrumentationKey: process.env.APPINSIGHTS_KEY
});

// Track tool executions
appInsights.trackEvent({
  name: 'ToolExecution',
  properties: {
    processId,
    depth,
    executionTime,
    success: result.success
  }
});
```

## Cost Optimization

### Estimated Monthly Costs

**Azure Container Instances:**
- 2 vCPU, 4 GB RAM
- 24/7 runtime: ~$70-90/month

**Azure Kubernetes Service:**
- 3 nodes (Standard_D2s_v3)
- 24/7 runtime: ~$200-250/month

**Azure OpenAI:**
- Depends on usage (token consumption)
- ~$20-100/month for moderate use

### Cost Reduction Strategies

1. **Use Ollama for Development**
   - Free local execution
   - No API costs

2. **Auto-Scaling**
   - Scale down during low usage
   - Use Azure Functions for event-driven execution

3. **Spot Instances (AKS)**
   - Use spot VMs for non-critical workloads
   - Save up to 90% on compute

## Security Best Practices

1. **API Key Management**
   - Use Azure Key Vault for secrets
   - Never hardcode API keys

2. **Network Security**
   - Use Virtual Networks (VNet)
   - Implement Network Security Groups (NSG)
   - Use Private Endpoints for ACR

3. **Authentication**
   - Enable Azure AD authentication
   - Use Managed Identities

4. **Container Security**
   - Scan images for vulnerabilities
   - Use minimal base images (alpine)
   - Keep dependencies updated

## Troubleshooting

### Container Won't Start

```bash
# Check logs
az container logs --resource-group deep-process-rg --name deep-process-mcp

# Check events
az container show --resource-group deep-process-rg --name deep-process-mcp --query instanceView
```

### MCP Tools Not Working

1. Verify process directories are copied to container
2. Check environment variables
3. Verify LLM provider configuration
4. Check container resource limits

### Performance Issues

1. Increase CPU/memory allocation
2. Use faster LLM models
3. Implement caching
4. Optimize container image size

## Support

- **Azure Documentation**: https://docs.microsoft.com/azure
- **Deep Process Issues**: https://github.com/your-org/deep-process/issues
- **Azure AI Foundry**: https://ai.azure.com/support

## Next Steps

1. Deploy to Azure Container Instances
2. Test all 13 processes
3. Submit to Azure AI Foundry catalog
4. Monitor usage and performance
5. Optimize costs and performance
