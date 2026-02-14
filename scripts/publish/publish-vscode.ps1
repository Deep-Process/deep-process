#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Publish VS Code Extension to Marketplace
.DESCRIPTION
    Builds, packages, and publishes the deep-process VS Code extension
    Requires VSCE_PAT environment variable or in scripts/config/.secrets
.EXAMPLE
    .\publish-vscode.ps1
.EXAMPLE
    .\publish-vscode.ps1 -BumpType minor
.EXAMPLE
    .\publish-vscode.ps1 -DryRun
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
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "   Publishing VS Code Extension" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan

    # Load secrets if available
    $secretsFile = "$PSScriptRoot/../config/.secrets"
    if (Test-Path $secretsFile) {
        Write-Host "> Loading secrets from config..." -ForegroundColor Yellow
        $secrets = Get-Content $secretsFile | ConvertFrom-Json
        if ($secrets.VSCE_PAT) {
            $env:VSCE_PAT = $secrets.VSCE_PAT
        }
    }

    # Check for VSCE token
    if (-not $env:VSCE_PAT) {
        Write-Host "[ERROR] VSCE_PAT not found" -ForegroundColor Red
        Write-Host "`nSet token with:" -ForegroundColor Yellow
        Write-Host '  $env:VSCE_PAT="your-personal-access-token"' -ForegroundColor Gray
        Write-Host "Or create: scripts/config/.secrets (see secrets.example.json)" -ForegroundColor Gray
        Write-Host "`nGet token from: https://dev.azure.com/[org]/_usersSettings/tokens" -ForegroundColor Cyan
        exit 1
    }

    Push-Location "packages/vscode"
    try {
        # Bump version
        Write-Host "> [1/5] Bumping version ($BumpType)..." -ForegroundColor Yellow
        $currentVersion = (Get-Content package.json | ConvertFrom-Json).version
        npm version $BumpType --no-git-tag-version 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "Version bump failed" }

        $newVersion = (Get-Content package.json | ConvertFrom-Json).version
        Write-Host "  $currentVersion -> $newVersion" -ForegroundColor Green

        # Build
        if (-not $SkipBuild) {
            Write-Host "`n> [2/5] Building extension..." -ForegroundColor Yellow
            pnpm run build
            if ($LASTEXITCODE -ne 0) { throw "Build failed" }
            Write-Host "  [OK] Build complete" -ForegroundColor Green
        }
        else {
            Write-Host "`n> [2/5] Skipping build..." -ForegroundColor Yellow
        }

        # Package
        Write-Host "`n> [3/5] Packaging extension..." -ForegroundColor Yellow
        pnpm run package
        if ($LASTEXITCODE -ne 0) { throw "Packaging failed" }

        $vsixFile = Get-ChildItem -Filter "*.vsix" | Select-Object -First 1
        if (-not $vsixFile) {
            throw "VSIX file not found"
        }

        $vsixSize = [math]::Round($vsixFile.Length/1MB, 2)
        Write-Host "  [OK] Packaged: $($vsixFile.Name) ($vsixSize MB)" -ForegroundColor Green

        if ($DryRun) {
            Write-Host "`n========================================" -ForegroundColor Yellow
            Write-Host "   DRY RUN COMPLETE" -ForegroundColor Yellow
            Write-Host "========================================" -ForegroundColor Yellow
            Write-Host "`nWould publish: deep-process-vscode@$newVersion" -ForegroundColor Cyan
            Write-Host "File: $($vsixFile.Name) ($vsixSize MB)" -ForegroundColor Cyan
            exit 0
        }

        # Confirm
        Write-Host "`n> [4/5] Confirmation..." -ForegroundColor Yellow
        Write-Host "  Package: deep-process-vscode@$newVersion" -ForegroundColor Cyan
        Write-Host "  File: $($vsixFile.Name) ($vsixSize MB)" -ForegroundColor Cyan
        Write-Host ""
        $confirm = Read-Host "Publish to VS Code Marketplace? (y/n)"
        if ($confirm -ne "y") {
            Write-Host "Cancelled." -ForegroundColor Red
            exit 0
        }

        # Publish
        Write-Host "`n> [5/5] Publishing to Visual Studio Marketplace..." -ForegroundColor Yellow
        vsce publish -p $env:VSCE_PAT
        if ($LASTEXITCODE -ne 0) { throw "Publish failed" }

        Write-Host "`n========================================" -ForegroundColor Green
        Write-Host "   PUBLISHED SUCCESSFULLY" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "`nExtension: deep-process-vscode@$newVersion" -ForegroundColor Cyan
        Write-Host "View at: https://marketplace.visualstudio.com/items?itemName=deep-process.deep-process-vscode" -ForegroundColor Cyan
    }
    finally {
        Pop-Location
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
    Pop-Location
}
