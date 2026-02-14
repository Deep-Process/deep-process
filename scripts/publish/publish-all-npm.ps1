#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Publish all npm packages (core + CLI)
.DESCRIPTION
    Publishes @deep-process/core and deep-process CLI to npm in correct order
    Requires NPM_TOKEN environment variable or in scripts/config/.secrets
.EXAMPLE
    .\publish-all-npm.ps1
.EXAMPLE
    .\publish-all-npm.ps1 -BumpType minor
.EXAMPLE
    .\publish-all-npm.ps1 -CoreOnly
#>

param(
    [ValidateSet("patch", "minor", "major")]
    [string]$BumpType = "patch",
    [switch]$CoreOnly,
    [switch]$CliOnly
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "   Publishing NPM Packages" -ForegroundColor Magenta
Write-Host "========================================`n" -ForegroundColor Magenta

try {
    # 1. Publish @deep-process/core first
    if (-not $CliOnly) {
        Write-Host "`n[1/2] Publishing @deep-process/core..." -ForegroundColor Cyan
        Write-Host "========================================`n" -ForegroundColor Cyan

        & "$PSScriptRoot/publish-core.ps1" -BumpType $BumpType
        if ($LASTEXITCODE -ne 0) {
            throw "Core publish failed"
        }

        if ($CoreOnly) {
            Write-Host "`n[DONE] Core published (CLI skipped with -CoreOnly)" -ForegroundColor Yellow
            exit 0
        }

        # Wait a bit for npm registry to update
        Write-Host "`nWaiting for npm registry to update..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }

    # 2. Update CLI to use new core version
    if (-not $CoreOnly) {
        Write-Host "`n[2/2] Publishing deep-process CLI..." -ForegroundColor Cyan
        Write-Host "========================================`n" -ForegroundColor Cyan

        # Get core version
        $coreVersion = (Get-Content "$rootDir/packages/core/package.json" | ConvertFrom-Json).version
        Write-Host "> Updating CLI to use @deep-process/core@^$coreVersion..." -ForegroundColor Yellow

        # Update CLI dependency
        $cliPackageJson = Get-Content "$rootDir/packages/cli/package.json" | ConvertFrom-Json
        $cliPackageJson.dependencies.'@deep-process/core' = "^$coreVersion"
        $cliPackageJson | ConvertTo-Json -Depth 10 | Set-Content "$rootDir/packages/cli/package.json"

        # Publish CLI
        & "$PSScriptRoot/publish-npm.ps1" -BumpType $BumpType
        if ($LASTEXITCODE -ne 0) {
            throw "CLI publish failed"
        }
    }

    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "   ALL PACKAGES PUBLISHED" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green

    if (-not $CliOnly) {
        $coreVer = (Get-Content "$rootDir/packages/core/package.json" | ConvertFrom-Json).version
        Write-Host "@deep-process/core@$coreVer" -ForegroundColor Cyan
    }
    if (-not $CoreOnly) {
        $cliVer = (Get-Content "$rootDir/packages/cli/package.json" | ConvertFrom-Json).version
        Write-Host "deep-process@$cliVer" -ForegroundColor Cyan
    }

    Write-Host "`nTest installation:" -ForegroundColor Yellow
    Write-Host "  npx deep-process@latest init" -ForegroundColor Gray
}
catch {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "   PUBLISH FAILED" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "`nError: $_" -ForegroundColor Red
    exit 1
}
