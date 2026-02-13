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
$otp = Read-Host "`nEnter npm OTP code (or 'n' to cancel)"
if ($otp -eq "n" -or $otp -eq "") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

Write-Host "`nPublishing deep-process@$version..." -ForegroundColor Yellow
$ErrorActionPreference = "SilentlyContinue"
$pubOutput = npm publish --access public --otp $otp 2>&1 | Out-String
$pubExit = $LASTEXITCODE
$ErrorActionPreference = "Stop"
if ($pubExit -ne 0) {
    Write-Host $pubOutput -ForegroundColor Red
    throw "Publish failed"
}
Write-Host "=== Published deep-process@$version ===" -ForegroundColor Green
