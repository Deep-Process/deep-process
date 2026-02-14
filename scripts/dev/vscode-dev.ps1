#!/usr/bin/env pwsh
param(
    [switch]$SkipBuild,
    [switch]$NoReload,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$VerbosePreference = if ($Verbose) { "Continue" } else { "SilentlyContinue" }

$rootDir = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$vscodePath = "$rootDir/packages/vscode"

Write-Host "`n===================================" -ForegroundColor Cyan
Write-Host "  VS Code Extension - Dev Mode" -ForegroundColor Cyan
Write-Host "===================================`n" -ForegroundColor Cyan

try {
    if (-not $SkipBuild) {
        Write-Host "> Building extension..." -ForegroundColor Yellow
        Push-Location $vscodePath
        try {
            pnpm run build
            if ($LASTEXITCODE -ne 0) { throw "Build failed" }
            pnpm run package
            if ($LASTEXITCODE -ne 0) { throw "Packaging failed" }
            Write-Host "[OK] Build complete" -ForegroundColor Green
        }
        finally {
            Pop-Location
        }
    }

    Push-Location $vscodePath
    try {
        $vsixFile = Get-ChildItem -Filter "*.vsix" | Select-Object -First 1
        if (-not $vsixFile) {
            throw "VSIX file not found. Run without -SkipBuild to build first."
        }

        $vsixPath = $vsixFile.FullName
        $vsixSize = [math]::Round($vsixFile.Length/1MB, 2)
        Write-Host "> Found: $($vsixFile.Name) ($vsixSize MB)" -ForegroundColor Cyan

        Write-Host "> Uninstalling existing extension..." -ForegroundColor Yellow
        code --uninstall-extension deep-process.deep-process-vscode 2>&1 | Out-Null
        Start-Sleep -Milliseconds 500
        Write-Host "[OK] Uninstalled" -ForegroundColor Green

        Write-Host "> Installing extension..." -ForegroundColor Yellow
        code --install-extension $vsixPath --force
        if ($LASTEXITCODE -ne 0) { throw "Installation failed" }
        Write-Host "[OK] Installed successfully" -ForegroundColor Green

        Write-Host "`n[OK] Extension ready for testing`n" -ForegroundColor Green

        if (-not $NoReload) {
            Write-Host "Next steps:" -ForegroundColor Cyan
            Write-Host "  1. Reload VS Code (Ctrl+Shift+P -> Developer: Reload Window)" -ForegroundColor Gray
            Write-Host "  2. Check Output panel (Ctrl+Shift+U -> 'Extension Host')" -ForegroundColor Gray
            Write-Host "  3. Click Deep Process icon in Activity Bar" -ForegroundColor Gray
            Write-Host "`nOr press F5 to launch Extension Development Host" -ForegroundColor Yellow
        }
    }
    finally {
        Pop-Location
    }
}
catch {
    Write-Host "`n[ERROR] Failed: $_" -ForegroundColor Red
    exit 1
}
