# ---------------------------------------------------------------------------
#  Local preview server — no Node/Python needed.
#  Run:   powershell -ExecutionPolicy Bypass -File .\serve.ps1
#  Then open http://localhost:8000  (opens automatically).
#  Stop with Ctrl+C.
#  (A local http server is required because the browser fetches the ES modules;
#   opening index.html directly via file:// will not work.)
# ---------------------------------------------------------------------------
param([int]$Port = 8000)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$mime = @{
  ".html"="text/html"; ".css"="text/css"; ".js"="text/javascript"; ".jsx"="text/javascript";
  ".mjs"="text/javascript"; ".json"="application/json"; ".svg"="image/svg+xml";
  ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".gif"="image/gif";
  ".webp"="image/webp"; ".ico"="image/x-icon"; ".pdf"="application/pdf"; ".woff2"="font/woff2"
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
try { $listener.Start() } catch {
  Write-Host "Could not start on port $Port. Try another: .\serve.ps1 -Port 8080" -ForegroundColor Red
  exit 1
}
Write-Host "Serving $root at http://localhost:$Port/  (Ctrl+C to stop)" -ForegroundColor Green
Start-Process "http://localhost:$Port/"

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart("/")
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "index.html" }
    $path = Join-Path $root $rel
    if (Test-Path $path -PathType Container) { $path = Join-Path $path "index.html" }
    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      $ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $b = [Text.Encoding]::UTF8.GetBytes("404 Not Found: $rel")
      $ctx.Response.OutputStream.Write($b, 0, $b.Length)
    }
    $ctx.Response.OutputStream.Close()
  } catch { }
}
