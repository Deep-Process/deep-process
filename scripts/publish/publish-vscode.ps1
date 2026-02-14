#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Publish VS Code Extension to Marketplace
.DESCRIPTION
    Builds, packages, and publishes the deep-process VS Code extension to the Visual Studio Marketplace
    Requires VSCE_PAT environment variable or token in scripts/config/.secrets
.EXAMPLE
    .\publish-vscode.ps1
.EXAMPLE
    .\publish-vscode.ps1 -BumpType minor
.EXAMPLE
    $env:VSCE_PAT="your-token"; .\publish-vscode.ps1
#>

param(
    [ValidateSet("patch", "minor", "major")]
    [string]$BumpType = "patch",
    [switch]$SkipBuild,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$rootDir = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Push-Location $rootDir

try {
    Write-Host "`n═══════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  Publishing VS Code Extension" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════`n" -ForegroundColor Cyan

    # Load secrets if available
    $secretsFile = "$PSScriptRoot/../config/.secrets"
    if (Test-Path $secretsFile) {
        Write-Host "→ Loading secrets from config..." -ForegroundColor Yellow
        $secrets = Get-Content $secretsFile | ConvertFrom-Json
        if ($secrets.VSCE_PAT) {
            $env:VSCE_PAT = $secrets.VSCE_PAT
        }
    }

    # Check for VSCE token
    if (-not $env:VSCE_PAT) {
        Write-Host "✗ VSCE_PAT not found" -ForegroundColor Red
        Write-Host "`nSet token with:" -ForegroundColor Yellow
        Write-Host '  $env:VSCE_PAT="your-personal-access-token"' -ForegroundColor Gray
        Write-Host "Or create: scripts/config/.secrets (see secrets.example.json)" -ForegroundColor Gray
        Write-Host "`nGet token from: https://dev.azure.com/[org]/_usersSettings/tokens" -ForegroundColor Cyan
        exit 1
    }

    Push-Location "packages/vscode"
    try {
        # Bump version
        Write-Host "→ Bumping version ($BumpType)..." -ForegroundColor Yellow
        $currentVersion = (Get-Content package.json | ConvertFrom-Json).version
        npm version $BumpType --no-git-tag-version 2>&1 | Out-Null
        $newVersion = (Get-Content package.json | ConvertFrom-Json).version
        Write-Host "  $currentVersion → $newVersion" -ForegroundColor Green

        # Build
        if (-not $SkipBuild) {
            Write-Host "→ Building extension..." -ForegroundColor Yellow
            pnpm run build
            if ($LASTEXITCODE -ne 0) { throw "Build failed" }
            Write-Host "✓ Build complete" -ForegroundColor Green
        }

        # Package
        Write-Host "→ Packaging extension..." -ForegroundColor Yellow
        pnpm run package
        if ($LASTEXITCODE -ne 0) { throw "Packaging failed" }

        $vsixFile = Get-ChildItem -Filter "*.vsix" | Select-Object -First 1
        if (-not $vsixFile) {
            throw "VSIX file not found"
        }
        Write-Host "✓ Packaged: $($vsixFile.Name)" -ForegroundColor Green

        if ($DryRun) {
            Write-Host "`n✓ DRY RUN complete (would publish $newVersion)" -ForegroundColor Yellow
            exit 0
        }

        # Confirm
        $confirm = Read-Host "`nPublish deep-process-vscode@$newVersion to Marketplace? (y/n)"
        if ($confirm -ne "y") {
            Write-Host "Cancelled." -ForegroundColor Red
            exit 0
        }

        # Publish
        Write-Host "`n→ Publishing to Visual Studio Marketplace..." -ForegroundColor Yellow
        vsce publish -p $env:VSCE_PAT
        if ($LASTEXITCODE -ne 0) { throw "Publish failed" }

        Write-Host "`n✓ Published deep-process-vscode@$newVersion" -ForegroundColor Green
        Write-Host "`nView at: https://marketplace.visualstudio.com/items?itemName=deep-process.deep-process-vscode" -ForegroundColor Cyan
    }
    finally {
        Pop-Location
    }
}
catch {
    Write-Host "`n✗ Publish failed: $_" -ForegroundColor Red
    exit 1
}
finally {
    Pop-Location
}
