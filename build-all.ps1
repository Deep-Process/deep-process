#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Build all Deep Process packages without publishing
.DESCRIPTION
    This script builds all packages in the monorepo:
    - @deep-process/core (shared utilities)
    - deep-process CLI (npm package)
    - VS Code extension (.vsix package)

    Does NOT publish to npm or VS Code Marketplace.
.EXAMPLE
    .\build-all.ps1
    Build all packages with default options
.EXAMPLE
    .\build-all.ps1 -SkipInstall
    Build without running pnpm install
.EXAMPLE
    .\build-all.ps1 -Verbose
    Build with verbose output
#>

param(
    [switch]$SkipInstall,
    [switch]$Clean,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$VerbosePreference = if ($Verbose) { "Continue" } else { "SilentlyContinue" }

# Colors for output
function Write-Section {
    param([string]$Message)
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "→ $Message" -ForegroundColor Yellow
}

# Check if pnpm is installed
function Test-Pnpm {
    Write-Verbose "Checking for pnpm..."
    $pnpmVersion = pnpm --version 2>$null
    if (-not $pnpmVersion) {
        Write-Error "pnpm is not installed. Install it with: npm install -g pnpm"
        exit 1
    }
    Write-Verbose "Found pnpm version: $pnpmVersion"
    return $true
}

# Clean build artifacts
function Invoke-Clean {
    Write-Section "Cleaning build artifacts"

    Write-Info "Removing node_modules..."
    Get-ChildItem -Path . -Filter "node_modules" -Recurse -Directory -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

    Write-Info "Removing dist directories..."
    Get-ChildItem -Path "packages" -Filter "dist" -Recurse -Directory -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

    Write-Info "Removing .vsix files..."
    Get-ChildItem -Path "packages/vscode" -Filter "*.vsix" -File | Remove-Item -Force -ErrorAction SilentlyContinue

    Write-Success "Clean complete"
}

# Install dependencies
function Install-Dependencies {
    Write-Section "Installing dependencies"

    Push-Location $PSScriptRoot
    try {
        Write-Info "Running pnpm install..."
        pnpm install --frozen-lockfile
        if ($LASTEXITCODE -ne 0) {
            throw "pnpm install failed with exit code $LASTEXITCODE"
        }
        Write-Success "Dependencies installed"
    }
    finally {
        Pop-Location
    }
}

# Build core package
function Build-Core {
    Write-Section "Building @deep-process/core"

    Push-Location "$PSScriptRoot/packages/core"
    try {
        Write-Info "Compiling TypeScript..."
        pnpm run build
        if ($LASTEXITCODE -ne 0) {
            throw "Core build failed with exit code $LASTEXITCODE"
        }

        # Verify output
        if (-not (Test-Path "dist/index.js")) {
            throw "Core build output not found: dist/index.js"
        }

        Write-Success "Core package built successfully"

        # Show output stats
        $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum
        Write-Verbose "Core dist size: $([math]::Round($distSize/1KB, 2)) KB"
    }
    finally {
        Pop-Location
    }
}

# Build CLI package
function Build-CLI {
    Write-Section "Building deep-process CLI"

    Push-Location "$PSScriptRoot/packages/cli"
    try {
        Write-Info "Compiling TypeScript..."
        pnpm run build
        if ($LASTEXITCODE -ne 0) {
            throw "CLI build failed with exit code $LASTEXITCODE"
        }

        # Verify output
        if (-not (Test-Path "dist/cli.js")) {
            throw "CLI build output not found: dist/cli.js"
        }

        Write-Success "CLI package built successfully"

        # Show output stats
        $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum
        Write-Verbose "CLI dist size: $([math]::Round($distSize/1KB, 2)) KB"
    }
    finally {
        Pop-Location
    }
}

# Build VS Code extension
function Build-VSCode {
    Write-Section "Building VS Code Extension"

    Push-Location "$PSScriptRoot/packages/vscode"
    try {
        Write-Info "Bundling with esbuild..."
        pnpm run build
        if ($LASTEXITCODE -ne 0) {
            throw "VS Code build failed with exit code $LASTEXITCODE"
        }

        # Verify output
        if (-not (Test-Path "dist/extension.js")) {
            throw "VS Code build output not found: dist/extension.js"
        }

        $bundleSize = (Get-Item "dist/extension.js").Length
        Write-Verbose "Bundle size: $([math]::Round($bundleSize/1KB, 2)) KB"

        Write-Info "Packaging extension..."
        pnpm run package
        if ($LASTEXITCODE -ne 0) {
            throw "VS Code packaging failed with exit code $LASTEXITCODE"
        }

        # Find .vsix file
        $vsixFile = Get-ChildItem -Filter "*.vsix" | Select-Object -First 1
        if (-not $vsixFile) {
            throw "VSIX file not found after packaging"
        }

        $vsixSize = $vsixFile.Length
        Write-Success "VS Code extension packaged: $($vsixFile.Name) ($([math]::Round($vsixSize/1KB, 2)) KB)"
        Write-Info "Install with: code --install-extension $($vsixFile.FullName)"
    }
    finally {
        Pop-Location
    }
}

# Main build process
function Start-Build {
    $startTime = Get-Date

    Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║   Deep Process - Build All Packages   ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Magenta

    try {
        # Check prerequisites
        Test-Pnpm | Out-Null

        # Clean if requested
        if ($Clean) {
            Invoke-Clean
        }

        # Install dependencies
        if (-not $SkipInstall) {
            Install-Dependencies
        }
        else {
            Write-Info "Skipping dependency installation (--SkipInstall)"
        }

        # Build packages in order (respecting dependencies)
        Build-Core
        Build-CLI
        Build-VSCode

        # Summary
        $duration = (Get-Date) - $startTime
        Write-Section "Build Summary"
        Write-Success "All packages built successfully!"
        Write-Info "Total time: $($duration.TotalSeconds.ToString('0.00')) seconds"

        # Show artifacts
        Write-Host "`nBuild Artifacts:" -ForegroundColor Cyan
        Write-Host "  • packages/core/dist/          - Core utilities" -ForegroundColor Gray
        Write-Host "  • packages/cli/dist/           - CLI package" -ForegroundColor Gray
        Write-Host "  • packages/vscode/dist/        - VS Code bundle" -ForegroundColor Gray

        $vsixFile = Get-ChildItem -Path "packages/vscode" -Filter "*.vsix" | Select-Object -First 1
        if ($vsixFile) {
            Write-Host "  • packages/vscode/$($vsixFile.Name) - VS Code extension package" -ForegroundColor Gray
        }

        Write-Host "`nNext Steps:" -ForegroundColor Cyan
        Write-Host "  Test CLI:        cd packages/cli && node dist/cli.js --help" -ForegroundColor Gray
        Write-Host "  Test VS Code:    code --install-extension packages/vscode/*.vsix" -ForegroundColor Gray
        Write-Host "  Or press F5 in VS Code (packages/vscode) to launch Extension Development Host" -ForegroundColor Gray

    }
    catch {
        Write-Host "`n" -NoNewline
        Write-Error "Build failed: $_"
        Write-Host "`nStack trace:" -ForegroundColor Red
        Write-Host $_.ScriptStackTrace -ForegroundColor Red
        exit 1
    }
}

# Run the build
Start-Build
