# Test Gemini CLI detection
Write-Host "`nTesting Gemini CLI detection..." -ForegroundColor Cyan

$commands = @('gemini', 'gemini-cli', 'gcloud', 'google-gemini')
$found = $false

foreach ($cmd in $commands) {
    Write-Host "`nTrying: $cmd --version" -ForegroundColor Yellow
    try {
        $output = & $cmd --version 2>&1
        if ($LASTEXITCODE -eq 0 -or $output) {
            Write-Host "  SUCCESS: $output" -ForegroundColor Green
            $found = $true
            break
        }
    }
    catch {
        Write-Host "  FAILED: $_" -ForegroundColor Red
    }
}

if (-not $found) {
    Write-Host "`nGemini CLI NOT DETECTED" -ForegroundColor Red
    Write-Host "Extension will show as 'Not installed'" -ForegroundColor Yellow
}
else {
    Write-Host "`nGemini CLI DETECTED!" -ForegroundColor Green
}

Write-Host "`nChecking GitHub Copilot extensions..." -ForegroundColor Cyan
$copilotExts = code --list-extensions | Select-String "copilot"
Write-Host $copilotExts -ForegroundColor Green
