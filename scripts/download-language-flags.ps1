$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $PSScriptRoot
$flagsDir = Join-Path $root "public\images\flags\lang"
New-Item -ItemType Directory -Force -Path $flagsDir | Out-Null

$content = Get-Content (Join-Path $root "src\data\languages.ts") -Raw
$codes = [regex]::Matches($content, 'flag: "([^"]+)"') |
  ForEach-Object { $_.Groups[1].Value } |
  Sort-Object -Unique

$ok = 0
$fail = 0
foreach ($code in $codes) {
  $out = Join-Path $flagsDir "$code.png"
  if ((Test-Path $out) -and ((Get-Item $out).Length -gt 500)) {
    $ok++
    continue
  }
  Start-Sleep -Milliseconds 400
  $url = "https://flagcdn.com/w80/$code.png"
  curl.exe -L -A "Mozilla/5.0" -o $out $url -s
  if ((Test-Path $out) -and ((Get-Item $out).Length -gt 500)) {
    $ok++
  } else {
    $fail++
    Remove-Item $out -Force -ErrorAction SilentlyContinue
    Write-Host "FAIL $code"
  }
}

Write-Host "Flags OK: $ok / $($codes.Count)  Failed: $fail"
