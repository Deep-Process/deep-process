param(
    [string]$BumpType = "patch"  # patch, minor, major
)

$ErrorActionPreference = "Stop"

Write-Host "`n=== Deep Process Publish ===" -ForegroundColor Cyan

# 1. Bump version
Write-Host "`n[1/4] Bumping version ($BumpType)..." -ForegroundColor Yellow
npm version $BumpType --no-git-tag-version
$version = (Get-Content package.json | ConvertFrom-Json).version
Write-Host "  Version: $version" -ForegroundColor Green

# 2. Build
Write-Host "`n[2/4] Building..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

# 3. Dry run
Write-Host "`n[3/4] Dry run..." -ForegroundColor Yellow
npm publish --dry-run 2>&1 | Select-String "name|version|package size|total files"

# 4. Confirm and publish
$confirm = Read-Host "`nPublish deep-process@$version to npm? (y/N)"
if ($confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

npm publish --access public
Write-Host "`n=== Published deep-process@$version ===" -ForegroundColor Green
