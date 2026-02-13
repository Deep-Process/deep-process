# Publishing Deep Process VS Code Extension

## Automatic Publishing via GitHub Actions

The extension is automatically published to the VS Code Marketplace when the version in `package.json` changes.

### Setup Requirements

#### 1. Create Visual Studio Marketplace Publisher Account

1. Go to [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
2. Sign in with your Microsoft/Azure account
3. Create a publisher if you don't have one
   - Publisher ID should match `package.json` → `"publisher": "deep-process"`
   - Display name: "Deep Process"

#### 2. Generate Personal Access Token (PAT)

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Click on your profile → Security → Personal access tokens
3. Click "New Token"
4. Configure the token:
   - **Name**: `vscode-marketplace-publish`
   - **Organization**: All accessible organizations
   - **Expiration**: Choose duration (recommendation: 90 days or 1 year)
   - **Scopes**: Custom defined
     - **Marketplace**: Check "Manage" (this includes Acquire and Publish)
5. Click "Create"
6. **IMPORTANT**: Copy the token immediately (you won't see it again!)

#### 3. Add GitHub Secret

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `VSCE_PAT`
5. Value: Paste the Personal Access Token from step 2
6. Click "Add secret"

### Publishing Process

#### Automatic (Recommended)

1. Update version in `packages/vscode/package.json`:
   ```json
   {
     "version": "1.0.1"  // Increment version
   }
   ```

2. Commit and push to `main` branch:
   ```bash
   git add packages/vscode/package.json
   git commit -m "chore(vscode): bump version to 1.0.1"
   git push
   ```

3. GitHub Actions will automatically:
   - Detect the version change
   - Install dependencies
   - Compile the extension
   - Package as `.vsix` file
   - Publish to VS Code Marketplace
   - Create GitHub Release with `.vsix` attachment

#### Manual Trigger

You can also manually trigger the workflow:

1. Go to Actions tab in GitHub
2. Select "Publish VS Code Extension" workflow
3. Click "Run workflow"
4. Optionally specify a version
5. Click "Run workflow" button

#### Local Publishing (Development)

For testing locally before publishing:

```bash
cd packages/vscode

# Package (creates .vsix file)
pnpm run package

# Test the .vsix file
# In VS Code: Extensions → ... → Install from VSIX

# Publish to marketplace
pnpm run publish
# You'll be prompted for the PAT if not set in environment
```

### Version Management

Use semantic versioning:
- **Patch** (1.0.x): Bug fixes, minor improvements
- **Minor** (1.x.0): New features, backwards compatible
- **Major** (x.0.0): Breaking changes

Update `CHANGELOG.md` with release notes before publishing.

### Workflow Details

The GitHub Actions workflow (`.github/workflows/publish-vscode.yml`) performs:

1. **Trigger**: Runs when `packages/vscode/package.json` changes or manually triggered
2. **Version Check**: Prevents duplicate publishes by checking for existing Git tags
3. **Build**:
   - Install dependencies with pnpm
   - Build `@deep-process/core` package
   - Compile TypeScript to JavaScript
4. **Package**: Create `.vsix` file using `vsce package`
5. **Publish**: Upload to VS Code Marketplace using `vsce publish` (requires `VSCE_PAT` secret)
6. **Release**: Create GitHub Release with:
   - Tag: `vscode-v{version}`
   - `.vsix` file attachment
   - Auto-generated release notes

### Troubleshooting

#### "VSCE_PAT secret not set"
- Make sure you've added the `VSCE_PAT` secret in GitHub repository settings
- The secret must be named exactly `VSCE_PAT`

#### "Publisher not found"
- Ensure the publisher in `package.json` matches your VS Marketplace publisher ID
- Verify your PAT has "Marketplace → Manage" scope

#### "Extension validation failed"
- Check that `icon` field in `package.json` points to valid PNG file (128x128px)
- Ensure all required fields are filled: name, displayName, description, version, publisher, etc.
- Run `pnpm run package` locally first to catch validation errors

#### "Tag already exists"
- This version was already published
- Increment the version number in `package.json`

#### Build failures
- Ensure `@deep-process/core` package builds successfully
- Check TypeScript compilation errors: `pnpm run compile`
- Verify all dependencies are listed in `package.json`

### Pre-Release Testing

Before publishing to marketplace:

1. **Local Package Test**:
   ```bash
   cd packages/vscode
   pnpm run package
   # Install the .vsix file in VS Code to test
   ```

2. **Check for Errors**:
   - No TypeScript compilation errors
   - Extension activates without errors
   - All commands work
   - Chat participant loads
   - Configuration panel displays correctly

3. **Update Documentation**:
   - Update `CHANGELOG.md` with changes
   - Update `README.md` if features changed
   - Update version in `package.json`

### Continuous Deployment Strategy

**Recommended Flow**:
1. Develop features in feature branches
2. Merge to `main` via PR
3. For release, create a release PR that:
   - Updates version in `package.json`
   - Updates `CHANGELOG.md`
   - Updates documentation
4. Merge release PR → Auto-publish triggered

**Alternative: Release Branches**:
1. Develop in `main`
2. Create release branches: `release/v1.0.1`
3. Update workflow to trigger on release branches
4. Merge to `main` after successful publish

### Marketplace Management

After publishing, you can manage your extension at:
- [VS Code Marketplace Publisher Management](https://marketplace.visualstudio.com/manage/publishers/deep-process)

Features available:
- View download statistics
- Respond to reviews
- Update extension metadata
- Unpublish versions (if needed)

### Additional Resources

- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce CLI Reference](https://github.com/microsoft/vscode-vsce)
- [Extension Manifest Reference](https://code.visualstudio.com/api/references/extension-manifest)
- [Azure DevOps PAT Documentation](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate)
