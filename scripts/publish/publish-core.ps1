#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Publish @deep-process/core to npm
.DESCRIPTION
    Bumps version, builds, and publishes @deep-process/core to npm registry
    Requires NPM_TOKEN environment variable or in scripts/config/.secrets
.EXAMPLE
    .\publish-core.ps1
.EXAMPLE
    .\publish-core.ps1 -BumpType minor
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
    Write-Host "   Publishing @deep-process/core" -ForegroundColor Cyan
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
        exit 1
    }

    # Navigate to core package
    Push-Location "packages/core"
    try {
        # 1. Bump version
        Write-Host "> [1/4] Bumping version ($BumpType)..." -ForegroundColor Yellow
        $currentVersion = (Get-Content package.json | ConvertFrom-Json).version
        npm version $BumpType --no-git-tag-version 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "Version bump failed" }

        $newVersion = (Get-Content package.json | ConvertFrom-Json).version
        Write-Host "  $currentVersion -> $newVersion" -ForegroundColor Green

        # 2. Build
        Write-Host "`n> [2/4] Building core..." -ForegroundColor Yellow
        pnpm run build
        if ($LASTEXITCODE -ne 0) { throw "Build failed" }
        Write-Host "  [OK] Build complete" -ForegroundColor Green

        # 3. Dry run
        Write-Host "`n> [3/4] Dry run..." -ForegroundColor Yellow
        $ErrorActionPreference = "Continue"
        $dryRunOutput = npm publish --dry-run 2>&1 | Out-String
        $dryRunExitCode = $LASTEXITCODE
        $ErrorActionPreference = "Stop"

        if ($dryRunExitCode -eq 0) {
            $dryRunOutput -split "`n" | Where-Object { $_ -match "name:|version:|package size:|total files:" } | ForEach-Object {
                Write-Host "  $($_.Trim())" -ForegroundColor Gray
            }
        }

        # 4. Confirm and publish
        Write-Host ""
        $confirm = Read-Host "Publish @deep-process/core@$newVersion to npm? (y/n)"
        if ($confirm -ne "y") {
            Write-Host "Cancelled." -ForegroundColor Red
            exit 0
        }

        Write-Host "`n> [4/4] Publishing to npm..." -ForegroundColor Yellow

        # Configure npm auth
        $env:NODE_AUTH_TOKEN = $env:NPM_TOKEN
        $npmrcContent = "//registry.npmjs.org/:_authToken=$env:NPM_TOKEN"
        $npmrcPath = Join-Path $PWD ".npmrc"
        $npmrcBackup = $null

        if (Test-Path $npmrcPath) {
            $npmrcBackup = Get-Content $npmrcPath -Raw
        }

        try {
            Set-Content $npmrcPath $npmrcContent

            npm publish --access public
            if ($LASTEXITCODE -ne 0) {
                throw "Publish failed"
            }

            Write-Host "`n========================================" -ForegroundColor Green
            Write-Host "   PUBLISHED SUCCESSFULLY" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "`nPackage: @deep-process/core@$newVersion" -ForegroundColor Cyan
            Write-Host "View at: https://www.npmjs.com/package/@deep-process/core" -ForegroundColor Cyan
        }
        finally {
            if ($npmrcBackup) {
                Set-Content $npmrcPath $npmrcBackup
            }
            elseif (Test-Path $npmrcPath) {
                Remove-Item $npmrcPath
            }
        }
    }
    finally {
        Pop-Location  # Exit packages/core
    }
}
catch {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "   PUBLISH FAILED" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "`nError: $_" -ForegroundColor Red
    exit 1
}
finally {
    Pop-Location  # Exit root
}
