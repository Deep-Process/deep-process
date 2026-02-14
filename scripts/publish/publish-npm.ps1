param(
    [string]$BumpType = "patch"  # patch, minor, major
)

Write-Host "`n=== Deep Process Publish ===" -ForegroundColor Cyan

# 1. Bump version
Write-Host "`n[1/4] Bumping version ($BumpType)..." -ForegroundColor Yellow
$ErrorActionPreference = "SilentlyContinue"
npm version $BumpType --no-git-tag-version 2>&1 | Out-Null
$ErrorActionPreference = "Stop"
$version = (Get-Content package.json | ConvertFrom-Json).version
Write-Host "  Version: $version" -ForegroundColor Green

# 2. Build
Write-Host "`n[2/4] Building..." -ForegroundColor Yellow
$ErrorActionPreference = "SilentlyContinue"
$buildOutput = npm run build 2>&1 | Out-String
$buildExit = $LASTEXITCODE
$ErrorActionPreference = "Stop"
if ($buildExit -ne 0) {
    Write-Host $buildOutput -ForegroundColor Red
    throw "Build failed"
}
Write-Host "  Build OK" -ForegroundColor Green

# 3. Dry run
Write-Host "`n[3/4] Dry run..." -ForegroundColor Yellow
$ErrorActionPreference = "SilentlyContinue"
$dryRun = npm publish --dry-run 2>&1 | Out-String
$ErrorActionPreference = "Stop"
$dryRun -split "`n" | Where-Object { $_ -match "name:|version:|package size:|total files:" } | ForEach-Object {
    Write-Host "  $($_.Trim())" -ForegroundColor Gray
}

# 4. Confirm and publish
$confirm = Read-Host "`nPublish deep-process@$version? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

Write-Host "`nPublishing deep-process@$version (browser auth may open)..." -ForegroundColor Yellow
# Run npm publish directly (not captured) so browser-based 2FA works
npm publish --access public
if ($LASTEXITCODE -ne 0) {
    throw "Publish failed"
}
Write-Host "`n=== Published deep-process@$version ===" -ForegroundColor Green
