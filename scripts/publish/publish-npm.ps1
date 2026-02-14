#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Publish NPM package to npmjs.com
.DESCRIPTION
    Bumps version, builds, and publishes deep-process to npm registry
    Requires NPM_TOKEN environment variable or in scripts/config/.secrets
.EXAMPLE
    .\publish-npm.ps1
.EXAMPLE
    .\publish-npm.ps1 -BumpType minor
#>

param(
    [ValidateSet("patch", "minor", "major")]
    [string]$BumpType = "patch"
)

$ErrorActionPreference = "Stop"

$rootDir = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Push-Location $rootDir

try {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "   Publishing NPM Package" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan

    # Load secrets if available
    $secretsFile = "$PSScriptRoot/../config/.secrets"
    if (Test-Path $secretsFile) {
        Write-Host "> Loading secrets from config..." -ForegroundColor Yellow
        $secrets = Get-Content $secretsFile | ConvertFrom-Json
        if ($secrets.NPM_TOKEN) {
            $env:NPM_TOKEN = $secrets.NPM_TOKEN
        }
    }

    # Check for NPM token
    if (-not $env:NPM_TOKEN) {
        Write-Host "[ERROR] NPM_TOKEN not found" -ForegroundColor Red
        Write-Host "`nSet token with:" -ForegroundColor Yellow
        Write-Host '  $env:NPM_TOKEN="npm_xxxxxxxxxxxxx"' -ForegroundColor Gray
        Write-Host "Or create: scripts/config/.secrets (see secrets.example.json)" -ForegroundColor Gray
        Write-Host "`nGet token from: https://www.npmjs.com/settings/[username]/tokens" -ForegroundColor Cyan
        exit 1
    }

    # 1. Bump version
    Write-Host "> [1/4] Bumping version ($BumpType)..." -ForegroundColor Yellow
    npm version $BumpType --no-git-tag-version 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Version bump failed" }

    $version = (Get-Content package.json | ConvertFrom-Json).version
    Write-Host "  Version: $version" -ForegroundColor Green

    # 2. Build
    Write-Host "`n> [2/4] Building..." -ForegroundColor Yellow
    $buildOutput = npm run build 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        Write-Host $buildOutput -ForegroundColor Red
        throw "Build failed"
    }
    Write-Host "  [OK] Build complete" -ForegroundColor Green

    # 3. Dry run
    Write-Host "`n> [3/4] Dry run..." -ForegroundColor Yellow
    $dryRun = npm publish --dry-run 2>&1 | Out-String
    $dryRun -split "`n" | Where-Object { $_ -match "name:|version:|package size:|total files:" } | ForEach-Object {
        Write-Host "  $($_.Trim())" -ForegroundColor Gray
    }

    # 4. Confirm and publish
    Write-Host ""
    $confirm = Read-Host "Publish deep-process@$version to npm? (y/n)"
    if ($confirm -ne "y") {
        Write-Host "Cancelled." -ForegroundColor Red
        exit 0
    }

    Write-Host "`n> [4/4] Publishing to npm..." -ForegroundColor Yellow

    # Configure npm auth
    npm config set "//registry.npmjs.org/:_authToken" $env:NPM_TOKEN

    # Publish
    npm publish --access public
    if ($LASTEXITCODE -ne 0) {
        throw "Publish failed"
    }

    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "   PUBLISHED SUCCESSFULLY" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "`nPackage: deep-process@$version" -ForegroundColor Cyan
    Write-Host "View at: https://www.npmjs.com/package/deep-process" -ForegroundColor Cyan
}
catch {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "   PUBLISH FAILED" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "`nError: $_" -ForegroundColor Red
    exit 1
}
finally {
    Pop-Location
}
