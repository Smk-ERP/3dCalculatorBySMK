# ─────────────────────────────────────────────────────────────────────────────
#  build.ps1 — bundles src\ + lib\ into a single self-contained index.html
#
#  Run:  powershell -ExecutionPolicy Bypass -File "D:\3D Print Calculater\build.ps1"
#  Or just double-click Rebuild.bat
#
#  The output index.html needs NO internet and NO web server.
# ─────────────────────────────────────────────────────────────────────────────

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Get-Text($relPath) {
    $full = Join-Path $root $relPath
    if (-not (Test-Path $full)) { throw "Missing file: $full" }
    return [System.IO.File]::ReadAllText($full, [System.Text.Encoding]::UTF8)
}

Write-Host "Reading sources..." -ForegroundColor Cyan
$react    = Get-Text "lib\react.js"
$reactDom = Get-Text "lib\react-dom.js"
$htm      = Get-Text "lib\htm.js"
$css      = Get-Text "src\styles.css"
$app      = Get-Text "src\app.js"

$parts = New-Object System.Collections.Generic.List[string]
$parts.Add('<!DOCTYPE html>')
$parts.Add('<html lang="en">')
$parts.Add('<head>')
$parts.Add('<meta charset="UTF-8">')
$parts.Add('<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">')
$parts.Add('<meta name="theme-color" content="#0f172a">')
$parts.Add('<meta name="apple-mobile-web-app-capable" content="yes">')
$parts.Add('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">')
$parts.Add('<title>3D Printing Price Calculator</title>')
$parts.Add('<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>&#x1F5A8;</text></svg>">')
$parts.Add('<style>')
$parts.Add($css)
$parts.Add('</style>')
$parts.Add('</head>')
$parts.Add('<body>')
$parts.Add('<div id="root"></div>')
$parts.Add('<script>/* React 18 (production) */')
$parts.Add($react)
$parts.Add('</' + 'script>')
$parts.Add('<script>/* ReactDOM 18 (production) */')
$parts.Add($reactDom)
$parts.Add('</' + 'script>')
$parts.Add('<script>/* htm 3 */')
$parts.Add($htm)
$parts.Add('</' + 'script>')
$parts.Add('<script>/* app */')
$parts.Add($app)
$parts.Add('</' + 'script>')
$parts.Add('</body>')
$parts.Add('</html>')

$out = [string]::Join("`n", $parts)

# UTF-8 without BOM
$outPath = Join-Path $root "index.html"
$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outPath, $out, $utf8)

$kb = [math]::Round((Get-Item $outPath).Length / 1KB)
Write-Host "Built index.html  ($kb KB, fully self-contained)" -ForegroundColor Green
