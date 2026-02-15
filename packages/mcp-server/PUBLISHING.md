# NPM Publishing Guide

This guide covers the process of publishing `@deep-process/mcp-server` to NPM registry.

## Pre-Publishing Checklist

### 1. Code Quality

- [ ] All TypeScript compiles without errors
- [ ] No linting warnings
- [ ] Code follows project style guidelines
- [ ] All tests pass (see TESTING.md)

```bash
cd packages/mcp-server
pnpm build
# Should complete with no errors
```

### 2. Documentation

- [ ] README.md is complete and accurate
- [ ] CLAUDE-DESKTOP.md is up to date
- [ ] AZURE-AI-FOUNDRY.md is complete
- [ ] LITELLM.md is complete
- [ ] TESTING.md has all test cases
- [ ] Examples are working and documented
- [ ] Changelog is updated

### 3. Package Configuration

- [ ] package.json version is correct
- [ ] package.json metadata is complete (description, keywords, author, license)
- [ ] package.json repository URLs are correct
- [ ] .npmignore is configured correctly
- [ ] dist/ folder contains all necessary files
- [ ] No sensitive data in package

### 4. Dependencies

- [ ] All dependencies are listed in package.json
- [ ] No dev dependencies in production dependencies
- [ ] Dependency versions are pinned or use safe ranges
- [ ] @deep-process/core dependency is published (or will be workspace:* for monorepo)

### 5. Testing

- [ ] Tested in fresh environment
- [ ] Tested with npx execution
- [ ] All 13 processes work correctly
- [ ] Claude Desktop integration tested
- [ ] At least 3 providers tested (OpenAI, Anthropic, Ollama)

## Publishing Steps

### Step 1: Update Version

Follow semantic versioning:
- **Patch** (1.0.X): Bug fixes, documentation updates
- **Minor** (1.X.0): New features, backward compatible
- **Major** (X.0.0): Breaking changes

```bash
cd packages/mcp-server

# For patch release
npm version patch

# For minor release
npm version minor

# For major release
npm version major

# Or manually update package.json version
```

### Step 2: Update Changelog

Edit CHANGELOG.md:

```markdown
## [1.0.0] - 2026-02-15

### Added
- Initial release
- 13 Deep Process workflows as MCP tools
- Multi-provider support (OpenAI, Anthropic, Azure, Bedrock, Ollama, Gemini)
- 40+ MCP resources
- 16 MCP prompts
- CLI with stdio transport
- Claude Desktop integration
- Comprehensive documentation

### Changed
- N/A

### Fixed
- N/A
```

### Step 3: Build for Production

```bash
# Clean previous build
rm -rf dist/

# Build fresh
pnpm build

# Verify build output
ls -la dist/
# Should see: cli.js, index.js, server.js, tools.js, resources.js, prompts.js
# Plus .d.ts and .js.map files
```

### Step 4: Test Package Locally

```bash
# Pack package (creates tarball)
npm pack

# This creates @deep-process-mcp-server-1.0.0.tgz

# Test installation in another directory
cd /tmp
mkdir test-install
cd test-install
npm init -y
npm install /path/to/@deep-process-mcp-server-1.0.0.tgz

# Test execution
npx deep-process-mcp --help

# Should show help message

# Cleanup
cd ..
rm -rf test-install
```

### Step 5: Login to NPM

```bash
# Login to NPM (if not already logged in)
npm login

# Verify login
npm whoami

# Should show your NPM username
```

### Step 6: Publish to NPM

#### Option A: Publish to Public Registry

```bash
# Publish (will trigger prepublishOnly script)
npm publish --access public

# For scoped packages like @deep-process/mcp-server,
# --access public is required for first publish
```

#### Option B: Dry Run First

```bash
# Dry run (see what would be published)
npm publish --dry-run

# Review output:
# - Check file list
# - Verify version
# - Confirm package size
# - Ensure no sensitive files

# If everything looks good, publish for real
npm publish --access public
```

### Step 7: Verify Publication

```bash
# Check package on NPM
npm view @deep-process/mcp-server

# Should show:
# - Version
# - Description
# - Dependencies
# - Dist info

# Install from NPM to verify
cd /tmp
mkdir verify-npm
cd verify-npm
npm install @deep-process/mcp-server
npx deep-process-mcp --version

# Should show correct version
```

### Step 8: Tag Release in Git

```bash
# Create git tag
git tag -a v1.0.0 -m "Release v1.0.0 - MCP Server Package"

# Push tag to remote
git push origin v1.0.0

# Or push all tags
git push --tags
```

### Step 9: Create GitHub Release

1. Go to GitHub repository
2. Navigate to "Releases"
3. Click "Draft a new release"
4. Select tag: v1.0.0
5. Release title: "v1.0.0 - MCP Server Package"
6. Description: Copy from CHANGELOG.md
7. Attach tarball (optional)
8. Publish release

## Post-Publishing

### 1. Announce Release

- [ ] Post on GitHub Discussions
- [ ] Update documentation website
- [ ] Announce on social media (if applicable)
- [ ] Send email to users (if applicable)

### 2. Monitor

- [ ] Watch for issues on GitHub
- [ ] Monitor NPM download stats: `npm info @deep-process/mcp-server`
- [ ] Check for security vulnerabilities: `npm audit`

### 3. Update Dependencies

Projects depending on this package:
- [ ] Update in monorepo (if applicable)
- [ ] Update in example projects
- [ ] Update in documentation

## Troubleshooting

### Error: Package Already Published

```bash
# If version already exists on NPM
npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/@deep-process%2fmcp-server - You cannot publish over the previously published versions: 1.0.0.

# Solution: Bump version
npm version patch
npm publish --access public
```

### Error: Authentication Failed

```bash
# Re-login
npm logout
npm login

# Verify
npm whoami
```

### Error: Files Missing from Package

```bash
# Check .npmignore
# Ensure dist/ is NOT ignored
# Ensure README.md, LICENSE are NOT ignored

# Test with npm pack
npm pack
tar -tzf deep-process-mcp-server-1.0.0.tgz

# Should show all necessary files
```

### Error: Build Fails on Publish

```bash
# prepublishOnly script fails

# Debug build
pnpm build --verbose

# Fix TypeScript errors
# Re-publish
```

## Versioning Strategy

### Pre-Release Versions

For beta testing:

```bash
# Create beta version
npm version 1.1.0-beta.1

# Publish with beta tag
npm publish --tag beta --access public

# Users can install with:
npm install @deep-process/mcp-server@beta
```

### Release Candidates

```bash
# Create RC version
npm version 1.1.0-rc.1

# Publish with rc tag
npm publish --tag rc --access public
```

### Stable Release

```bash
# Promote RC to stable
npm dist-tag add @deep-process/mcp-server@1.1.0 latest

# Or publish new stable version
npm version 1.1.0
npm publish --access public
```

## Security

### Audit Package

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (if possible)
npm audit fix
```

### Enable 2FA

```bash
# Enable two-factor authentication for NPM account
# Go to https://www.npmjs.com/settings/your-username/profile
# Enable 2FA under "Two-Factor Authentication"
```

### Package Provenance

```bash
# Publish with provenance (requires GitHub Actions)
npm publish --provenance --access public

# This creates attestation of package authenticity
```

## Rollback

If you need to unpublish:

```bash
# Unpublish specific version (within 72 hours)
npm unpublish @deep-process/mcp-server@1.0.0

# Or deprecate (preferred over unpublish)
npm deprecate @deep-process/mcp-server@1.0.0 "Use version 1.0.1 instead"
```

**Note:** Only unpublish in emergency (security issue). Prefer deprecation.

## Maintenance

### Regular Updates

- [ ] Update dependencies monthly: `npm outdated`
- [ ] Security patches: `npm audit`
- [ ] TypeScript version: Keep up to date
- [ ] Node.js version: Test with latest LTS

### Long-Term Support

Define LTS policy:
- Critical bugs: Patch within 48 hours
- Security issues: Patch within 24 hours
- Feature requests: Review monthly
- Breaking changes: Announce 3 months in advance

## Checklist Summary

**Pre-Publish:**
- [ ] Code quality verified
- [ ] Documentation complete
- [ ] Package.json configured
- [ ] Dependencies correct
- [ ] Testing complete (50+ tests)
- [ ] Version updated
- [ ] Changelog updated

**Publish:**
- [ ] Build successful
- [ ] Local test passed
- [ ] NPM login verified
- [ ] Publish completed
- [ ] NPM verification passed
- [ ] Git tag created
- [ ] GitHub release created

**Post-Publish:**
- [ ] Announcement made
- [ ] Monitoring enabled
- [ ] Dependencies updated
- [ ] Documentation website updated

---

**Questions?** Open an issue at https://github.com/your-org/deep-process/issues
