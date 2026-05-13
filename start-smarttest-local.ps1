$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendRoot = Join-Path $projectRoot 'backend'
$pgHome = 'D:\Smat Test and Python\PostgreSQL\16'
$pgBin = Join-Path $pgHome 'bin'
$pgData = Join-Path $pgHome 'data'
$pgLog = Join-Path $pgHome 'postgresql-smarttest.log'
$tsxCmd = Join-Path $backendRoot 'node_modules\.bin\tsx.cmd'

function Test-PortListening {
  param([int]$Port)

  return [bool](Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' })
}

if (!(Test-Path (Join-Path $pgData 'PG_VERSION'))) {
  throw "PostgreSQL data directory is not initialized: $pgData"
}

$env:Path = "$pgBin;$env:Path"

if (!(Test-PortListening 5432)) {
  Write-Host 'Starting PostgreSQL on localhost:5432...'
  & (Join-Path $pgBin 'pg_ctl.exe') -D $pgData -l $pgLog -o '-p 5432' start | Out-Null
  Start-Sleep -Seconds 2
}

if (!(Test-Path $tsxCmd)) {
  throw "Missing tsx runner: $tsxCmd"
}

if (!(Test-PortListening 5001)) {
  Write-Host 'Starting SmartTest Pro backend on localhost:5001...'
  Start-Process cmd.exe -ArgumentList '/k', "cd /d `"$backendRoot`" && `"$tsxCmd`" src/index.ts"
} else {
  Write-Host 'Backend is already running on localhost:5001.'
}

if (!(Test-PortListening 5173)) {
  Write-Host 'Starting SmartTest Pro web on localhost:5173...'
  Start-Process cmd.exe -ArgumentList '/k', "cd /d `"$projectRoot`" && npm run dev:web"
} else {
  Write-Host 'Web app is already running on localhost:5173.'
}

Write-Host 'SmartTest Pro is ready.'
