# Configuration

## Secrets Management

### Setup

1. Copy the example file:
   ```powershell
   cp secrets.example.json .secrets
   ```

2. Edit `.secrets` and fill in your tokens (see instructions below)

3. The `.secrets` file is gitignored - never commit it!

### Required Tokens

#### NPM_TOKEN
For publishing to npm registry.

**Get it:**
1. Go to https://www.npmjs.com/settings/[your-username]/tokens
2. Click "Generate New Token" → "Automation"
3. Copy the token

**Set it:**
```json
{
  "NPM_TOKEN": "npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Or use environment variable:**
```powershell
$env:NPM_TOKEN = "npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

#### VSCE_PAT
For publishing to VS Code Marketplace.

**Get it:**
1. Go to https://dev.azure.com/[your-org]/_usersSettings/tokens
2. Click "New Token"
3. Name: "VS Code Marketplace Publishing"
4. Organization: "All accessible organizations"
5. Scopes: "Marketplace" → "Manage"
6. Click "Create"
7. Copy the token (you won't see it again!)

**Set it:**
```json
{
  "VSCE_PAT": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Or use environment variable:**
```powershell
$env:VSCE_PAT = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

#### CLAUDE_API_KEY (Optional)
For Claude Code plugin testing/automation.

**Get it:**
1. Go to https://console.anthropic.com/settings/keys
2. Create a new API key

**Set it:**
```json
{
  "CLAUDE_API_KEY": "sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

#### GITHUB_TOKEN (Optional)
For automated GitHub releases.

**Get it:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: "Deep Process Releases"
4. Expiration: Choose your preference (e.g., 90 days, 1 year)
5. **Select scopes:**
   - ✅ `repo` (Full control of private repositories)
     - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
     - **Required for:** Creating releases, uploading assets, managing tags
   - ✅ `workflow` (Update GitHub Action workflows)
     - **Required if:** Scripts need to trigger or modify workflows
     - **Optional if:** Only creating releases manually

6. Click "Generate token"
7. **Copy immediately** - you won't see it again!

**Minimum required scopes:**
- For **public repositories**: `public_repo` (subset of `repo`)
- For **private repositories**: `repo` (full scope)
- For **workflow automation**: Add `workflow` scope

**Recommended scopes for Deep Process:**
- ✅ `repo` - covers everything (releases, tags, code)
- ✅ `workflow` - allows GitHub Actions automation

**Set it:**
```json
{
  "GITHUB_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## GitHub Actions Secrets

For CI/CD, add these secrets to your GitHub repository:

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each token:
   - `NPM_TOKEN` - for npm publishing
   - `VSCE_PAT` - for VS Code Marketplace
   - `CLAUDE_API_KEY` - (optional) for Claude plugin

## Security Notes

- **Never commit `.secrets` file**
- **Never share tokens** in issues, PRs, or public channels
- **Rotate tokens regularly** (at least every 6 months)
- **Use minimal scopes** - only grant permissions needed
- **Revoke unused tokens** when no longer needed

## Troubleshooting

### "Token not found" error

1. Check `.secrets` file exists in `scripts/config/`
2. Verify JSON is valid (use a JSON validator)
3. Ensure token names match exactly (case-sensitive)
4. Try setting environment variable directly instead

### Token expired

1. Regenerate token on the respective platform
2. Update `.secrets` file
3. Try again
