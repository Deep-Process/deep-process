#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Uninstall VS Code extension
.DESCRIPTION
    Uninstalls the deep-process VS Code extension from your local VS Code installation
.EXAMPLE
    .\vscode-uninstall.ps1
#>

$ErrorActionPreference = "Stop"

Write-Host "`n===================================" -ForegroundColor Cyan
Write-Host "  Uninstalling VS Code Extension" -ForegroundColor Cyan
Write-Host "===================================`n" -ForegroundColor Cyan

try {
    # Check if installed
    $installed = code --list-extensions | Select-String "deepprocess.deep-process-vscode"

    if (-not $installed) {
        Write-Host "[SKIP] Extension not installed (nothing to do)" -ForegroundColor Yellow
        exit 0
    }

    Write-Host "> Uninstalling deep-process-vscode..." -ForegroundColor Yellow
    code --uninstall-extension deepprocess.deep-process-vscode

    if ($LASTEXITCODE -ne 0) {
        throw "Uninstall failed"
    }

    Write-Host "[OK] Extension uninstalled successfully`n" -ForegroundColor Green
    Write-Host "Reload VS Code to complete removal" -ForegroundColor Cyan
}
catch {
    Write-Host "`n[ERROR] Uninstall failed: $_" -ForegroundColor Red
    exit 1
}
