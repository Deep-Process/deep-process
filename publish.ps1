param(
    [string]$BumpType = "patch"  # patch, minor, major
)

$ErrorActionPreference = "Stop"

Write-Host "`n=== Deep Process Publish ===" -ForegroundColor Cyan

# 1. Bump version
Write-Host "`n[1/4] Bumping version ($BumpType)..." -ForegroundColor Yellow
npm version $BumpType --no-git-tag-version 2>$null
$version = (Get-Content package.json | ConvertFrom-Json).version
Write-Host "  Version: $version" -ForegroundColor Green

# 2. Build
Write-Host "`n[2/4] Building..." -ForegroundColor Yellow
npm run build 2>$null
if ($LASTEXITCODE -ne 0) { throw "Build failed" }
Write-Host "  Build OK" -ForegroundColor Green

# 3. Dry run
Write-Host "`n[3/4] Dry run..." -ForegroundColor Yellow
$dryRun = npm publish --dry-run 2>&1 | Out-String
$dryRun -split "`n" | Where-Object { $_ -match "name:|version:|package size:|total files:" } | ForEach-Object {
    Write-Host "  $($_.Trim())" -ForegroundColor Gray
}

# 4. Confirm and publish
$confirm = Read-Host "`nPublish deep-process@$version to npm? (y/N)"
if ($confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

Write-Host "`nPublishing..." -ForegroundColor Yellow
npm publish --access public 2>$null
if ($LASTEXITCODE -ne 0) { throw "Publish failed" }
Write-Host "`n=== Published deep-process@$version ===" -ForegroundColor Green
