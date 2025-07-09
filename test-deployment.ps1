# Test Azure deployment
# This script verifies that your GenAI Roadmap app is working correctly on Azure

param(
    [Parameter(Mandatory=$true)]
    [string]$AppUrl
)

Write-Host "🧪 Testing Azure deployment at: $AppUrl" -ForegroundColor Blue

# Test 1: Basic connectivity
Write-Host "1. Testing basic connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://$AppUrl" -Method GET -TimeoutSec 30
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ App is accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected status code: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Connection failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: SPA routing
Write-Host "2. Testing SPA routing..." -ForegroundColor Yellow
$routes = @("/", "/roadmap", "/projects", "/skills", "/progress", "/content")
foreach ($route in $routes) {
    try {
        $response = Invoke-WebRequest -Uri "https://$AppUrl$route" -Method GET -TimeoutSec 15
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Route $route works" -ForegroundColor Green
        } else {
            Write-Host "❌ Route $route failed with status: $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        Write-Host "⚠️ Route $route error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Test 3: Static assets
Write-Host "3. Testing static assets..." -ForegroundColor Yellow
$assets = @("/assets/", "/favicon.ico")
foreach ($asset in $assets) {
    try {
        $response = Invoke-WebRequest -Uri "https://$AppUrl$asset" -Method HEAD -TimeoutSec 10
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
            Write-Host "✅ Asset path $asset accessible" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Asset path $asset returned: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️ Asset $asset test failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Test 4: Performance check
Write-Host "4. Testing performance..." -ForegroundColor Yellow
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
try {
    $response = Invoke-WebRequest -Uri "https://$AppUrl" -Method GET -TimeoutSec 30
    $stopwatch.Stop()
    $loadTime = $stopwatch.ElapsedMilliseconds
    
    if ($loadTime -lt 3000) {
        Write-Host "✅ Fast load time: ${loadTime}ms" -ForegroundColor Green
    } elseif ($loadTime -lt 5000) {
        Write-Host "⚠️ Moderate load time: ${loadTime}ms" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Slow load time: ${loadTime}ms" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Performance test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Security headers
Write-Host "5. Testing security headers..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://$AppUrl" -Method GET -TimeoutSec 15
    $headers = $response.Headers
    
    $securityChecks = @{
        "X-Content-Type-Options" = "Security header for MIME type protection"
        "X-Frame-Options" = "Clickjacking protection"
        "Referrer-Policy" = "Referrer policy header"
    }
    
    foreach ($header in $securityChecks.Keys) {
        if ($headers.ContainsKey($header)) {
            Write-Host "✅ $header present" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $header missing: $($securityChecks[$header])" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "❌ Security header test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Deployment verification complete!" -ForegroundColor Blue
Write-Host "Your GenAI Roadmap app is live at: https://$AppUrl" -ForegroundColor Green

# Optional: Open in browser
$openBrowser = Read-Host "Open the app in your browser? (Y/n)"
if ($openBrowser -ne "n" -and $openBrowser -ne "N") {
    Start-Process "https://$AppUrl"
}
