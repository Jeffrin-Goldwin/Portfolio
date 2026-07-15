# build.ps1 — bundle src/App.jsx (+ React, ReactDOM, Framer Motion) into src/app.bundle.js.
#
# Only needed when you change the APP itself (src/App.jsx — layout, sections, animations).
# CONTENT edits (src/data.js) need NO build: they load separately at runtime.
#
# Zero-install: downloads a standalone esbuild.exe and the library tarballs on first run
# (no Node/npm). Requires Windows 10 1803+ (ships `tar`). Later runs reuse the cache.
#
#   powershell -ExecutionPolicy Bypass -File .\build.ps1

$ErrorActionPreference = "Stop"
$esbuildVersion = "0.24.2"
$root = $PSScriptRoot
$toolsDir = Join-Path $root ".tools"
$esbuildExe = Join-Path $toolsDir "esbuild.exe"
$nm = Join-Path $root "node_modules"

New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null

function Get-Tarball($url, $destDir) {
  $tmp = Join-Path $toolsDir "dl.tgz"
  Invoke-WebRequest -Uri $url -OutFile $tmp
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  tar -xzf $tmp -C $destDir --strip-components=1   # Windows 10/11 bsdtar handles .tgz
  Remove-Item $tmp -Force
}

# esbuild (one-time)
if (-not (Test-Path $esbuildExe)) {
  Write-Host "Fetching esbuild $esbuildVersion (one-time)..."
  $pkg = Join-Path $toolsDir "esbuild-pkg"
  Get-Tarball "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-$esbuildVersion.tgz" $pkg
  Copy-Item (Join-Path $pkg "esbuild.exe") $esbuildExe -Force
  Remove-Item $pkg -Recurse -Force
}

# Runtime libraries to bundle (name = version). Fetched once into ./node_modules.
# Keep these versions in sync with README/CLAUDE notes if you upgrade.
$deps = [ordered]@{
  "react"         = "18.3.1"
  "react-dom"     = "18.3.1"
  "scheduler"     = "0.23.2"
  "loose-envify"  = "1.4.0"
  "js-tokens"     = "4.0.0"
  "framer-motion" = "11.3.24"
  "tslib"         = "2.8.1"
}
foreach ($name in $deps.Keys) {
  $dest = Join-Path $nm $name
  if (Test-Path (Join-Path $dest "package.json")) { continue }
  $ver = $deps[$name]
  $file = ($name -split "/")[-1]
  Write-Host "Fetching $name@$ver (one-time)..."
  Get-Tarball "https://registry.npmjs.org/$name/-/$file-$ver.tgz" $dest
}

Write-Host "Bundling -> src/app.bundle.js ..."
# NOTE: the define value must reach esbuild as the STRING "production", quotes included,
# so React's dev code is dropped. PowerShell mangles bare quotes when calling native exes,
# so escape them as \" inside a single-quoted literal (works in PowerShell 5.1 and 7).
& $esbuildExe "src/App.jsx" "--bundle" "--format=esm" "--minify" `
  '--define:process.env.NODE_ENV=\"production\"' "--external:@data" `
  "--outfile=src/app.bundle.js"

Write-Host ""
Write-Host "Done -> src/app.bundle.js"
Write-Host "Re-upload it to S3 and run a CloudFront invalidation ( /* )."
