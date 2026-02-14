#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Build and install VS Code extension locally for testing
.DESCRIPTION
    Builds the VS Code extension, uninstalls any existing version, and installs the new .vsix locally
    Perfect for rapid development and testing cycle
.EXAMPLE
    .\vscode-dev.ps1
.EXAMPLE
    .\vscode-dev.ps1 -SkipBuild
    Install existing .vsix without rebuilding
.EXAMPLE
    .\vscode-dev.ps1 -NoReload
    Install without prompting to reload VS Code
#>

param(
    [switch]$SkipBuild,
    [switch]$NoReload,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$VerbosePreference = if ($Verbose) { "Continue" } else { "SilentlyContinue" }

$rootDir = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$vscodePath = "$rootDir/packages/vscode"

Write-Host "`n═══════════════════════════════════" -ForegroundColor Cyan
Write-Host "  VS Code Extension - Dev Mode" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════`n" -ForegroundColor Cyan

try {
    # Build if needed
    if (-not $SkipBuild) {
        Write-Host "→ Building extension..." -ForegroundColor Yellow
        Push-Location $vscodePath
        try {
            pnpm run build
            if ($LASTEXITCODE -ne 0) { throw "Build failed" }

            pnpm run package
            if ($LASTEXITCODE -ne 0) { throw "Packaging failed" }

            Write-Host "✓ Build complete" -ForegroundColor Green
        }
        finally {
            Pop-Location
        }
    }

    # Find .vsix file
    Push-Location $vscodePath
    try {
        $vsixFile = Get-ChildItem -Filter "*.vsix" | Select-Object -First 1
        if (-not $vsixFile) {
            throw "VSIX file not found. Run without -SkipBuild to build first."
        }

        $vsixPath = $vsixFile.FullName
        $vsixSize = [math]::Round($vsixFile.Length/1MB, 2)
        Write-Host "→ Found: $($vsixFile.Name) ($vsixSize MB)" -ForegroundColor Cyan

        # Uninstall existing
        Write-Host "→ Uninstalling existing extension..." -ForegroundColor Yellow
        code --uninstall-extension deep-process.deep-process-vscode 2>&1 | Out-Null
        Start-Sleep -Milliseconds 500
        Write-Host "✓ Uninstalled" -ForegroundColor Green

        # Install new version
        Write-Host "→ Installing extension..." -ForegroundColor Yellow
        code --install-extension $vsixPath --force
        if ($LASTEXITCODE -ne 0) { throw "Installation failed" }
        Write-Host "✓ Installed successfully" -ForegroundColor Green

        Write-Host "`n✓ Extension ready for testing`n" -ForegroundColor Green

        if (-not $NoReload) {
            Write-Host "Next steps:" -ForegroundColor Cyan
            Write-Host "  1. Reload VS Code (Ctrl+Shift+P → Developer: Reload Window)" -ForegroundColor Gray
            Write-Host "  2. Check Output panel (Ctrl+Shift+U → 'Extension Host')" -ForegroundColor Gray
            Write-Host "  3. Click Deep Process icon in Activity Bar" -ForegroundColor Gray
            Write-Host "`nOr press F5 to launch Extension Development Host" -ForegroundColor Yellow
        }
    }
    finally {
        Pop-Location
    }
}
catch {
    Write-Host "`n✗ Failed: $_" -ForegroundColor Red
    exit 1
}
