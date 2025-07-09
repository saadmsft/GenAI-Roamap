# Azure Deployment Script for GenAI Roadmap
# Run this script to deploy your GenAI Roadmap to Azure Static Web Apps

param(
    [Parameter(Mandatory=$true)]
    [string]$AppName,
    
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "genai-roadmap-rg",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "West Europe",
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubRepo,
    
    [Parameter(Mandatory=$false)]
    [string]$Branch = "main"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

Write-ColorOutput "🚀 GenAI Roadmap - Azure Deployment Script" $Blue
Write-ColorOutput "============================================" $Blue

# Validate location for Azure Static Web Apps
$validLocations = @("West US 2", "Central US", "East US 2", "West Europe", "East Asia")
if ($Location -notin $validLocations) {
    Write-ColorOutput "⚠️ Warning: '$Location' may not be available for Azure Static Web Apps." $Yellow
    Write-ColorOutput "Valid locations are: $($validLocations -join ', ')" $Yellow
    $Location = "West Europe"  # Default to a known working location
    Write-ColorOutput "Using default location: $Location" $Green
}

# Check if Azure CLI is installed
try {
    $azVersion = az version --output tsv 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ Azure CLI is installed" $Green
    }
} catch {
    Write-ColorOutput "❌ Azure CLI not found. Please install Azure CLI first." $Red
    Write-ColorOutput "Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" $Yellow
    exit 1
}

# Check if user is logged in to Azure
Write-ColorOutput "🔐 Checking Azure login status..." $Yellow
$account = az account show --output json 2>$null | ConvertFrom-Json
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "🔑 Please login to Azure..." $Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "❌ Azure login failed" $Red
        exit 1
    }
} else {
    Write-ColorOutput "✅ Logged in as: $($account.user.name)" $Green
}

# Validate app name availability
Write-ColorOutput "🔍 Checking app name availability..." $Yellow
$nameCheck = az staticwebapp list --query "[?name=='$AppName']" --output json | ConvertFrom-Json
if ($nameCheck.Count -gt 0) {
    Write-ColorOutput "❌ App name '$AppName' is already taken. Please choose a different name." $Red
    exit 1
}

# Create resource group if it doesn't exist
Write-ColorOutput "📁 Creating resource group '$ResourceGroupName'..." $Yellow
$rgExists = az group exists --name $ResourceGroupName
if ($rgExists -eq "false") {
    az group create --name $ResourceGroupName --location $Location --output table
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ Resource group created successfully" $Green
    } else {
        Write-ColorOutput "❌ Failed to create resource group" $Red
        exit 1
    }
} else {
    Write-ColorOutput "✅ Resource group already exists" $Green
}

# Build the application
Write-ColorOutput "🔨 Building the application..." $Yellow
Push-Location "$PSScriptRoot\web-app"
try {
    # Install dependencies
    Write-ColorOutput "📦 Installing dependencies..." $Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }

    # Build the app
    Write-ColorOutput "🏗️ Building the app..." $Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "npm build failed"
    }
    
    Write-ColorOutput "✅ Build completed successfully" $Green
} catch {
    Write-ColorOutput "❌ Build failed: $_" $Red
    Pop-Location
    exit 1
}
Pop-Location

# Deploy to Azure Static Web Apps
Write-ColorOutput "☁️ Deploying to Azure Static Web Apps..." $Yellow

# Build the Azure CLI command
$azArgs = @(
    "staticwebapp", "create",
    "--name", $AppName,
    "--resource-group", $ResourceGroupName,
    "--location", $Location,
    "--app-location", "/web-app",
    "--output-location", "dist"
)

if ($GitHubRepo) {
    $azArgs += @("--source", $GitHubRepo)
    $azArgs += @("--branch", $Branch)
    $azArgs += @("--login-with-github")
}

Write-ColorOutput "Executing: az $($azArgs -join ' ')" $Yellow
& az @azArgs

if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput "✅ Azure Static Web App created successfully!" $Green
    
    # Get the app URL
    Write-ColorOutput "🔍 Retrieving app information..." $Yellow
    $appJson = az staticwebapp show --name $AppName --resource-group $ResourceGroupName --output json 2>$null
    if ($appJson) {
        $app = $appJson | ConvertFrom-Json
        $appUrl = $app.defaultHostname
        Write-ColorOutput "🌐 Your app is available at: https://$appUrl" $Green
    } else {
        Write-ColorOutput "⚠️ App created but URL retrieval failed. Check Azure Portal for details." $Yellow
        $appUrl = "$AppName.azurestaticapps.net"
        Write-ColorOutput "🌐 Expected URL: https://$appUrl" $Yellow
    }
    
    # If no GitHub repo was provided, show manual deployment instructions
    if (-not $GitHubRepo) {
        Write-ColorOutput "📝 Manual Deployment Instructions:" $Yellow
        Write-ColorOutput "1. Get deployment token:" $Yellow
        Write-ColorOutput "   az staticwebapp secrets list --name '$AppName' --resource-group '$ResourceGroupName'" $Yellow
        Write-ColorOutput "2. Deploy manually using Azure Static Web Apps CLI:" $Yellow
        Write-ColorOutput "   swa deploy ./web-app/dist --deployment-token <TOKEN>" $Yellow
    }
    
} else {
    Write-ColorOutput "❌ Failed to create Azure Static Web App" $Red
    exit 1
}

# Optional: Set up custom domain
Write-ColorOutput "🌐 Domain Configuration" $Blue
$setupDomain = Read-Host "Do you want to configure a custom domain? (y/N)"
if ($setupDomain -eq "y" -or $setupDomain -eq "Y") {
    $customDomain = Read-Host "Enter your custom domain (e.g., genai-roadmap.yourdomain.com)"
    if ($customDomain) {
        Write-ColorOutput "🔧 Configuring custom domain..." $Yellow
        az staticwebapp hostname set --name $AppName --resource-group $ResourceGroupName --hostname $customDomain
        
        Write-ColorOutput "📋 DNS Configuration Required:" $Yellow
        Write-ColorOutput "Add the following CNAME record to your DNS:" $Yellow
        Write-ColorOutput "Name: $customDomain" $Yellow
        Write-ColorOutput "Value: $appUrl" $Yellow
    }
}

# Display summary
Write-ColorOutput "🎉 Deployment Summary" $Blue
Write-ColorOutput "===================" $Blue
Write-ColorOutput "App Name: $AppName" $Green
Write-ColorOutput "Resource Group: $ResourceGroupName" $Green
Write-ColorOutput "Location: $Location" $Green
Write-ColorOutput "URL: https://$appUrl" $Green

if ($GitHubRepo) {
    Write-ColorOutput "GitHub Integration: Enabled" $Green
    Write-ColorOutput "Repository: $GitHubRepo" $Green
    Write-ColorOutput "Branch: $Branch" $Green
    Write-ColorOutput "Auto-deployment: Enabled on push to $Branch" $Green
} else {
    Write-ColorOutput "GitHub Integration: Not configured" $Yellow
    Write-ColorOutput "Deployment: Manual" $Yellow
}

Write-ColorOutput "🚀 Your GenAI Roadmap is now live on Azure!" $Green
Write-ColorOutput "Share your learning journey with the world!" $Green

# Optional: Open the app in browser
$openApp = Read-Host "Open the app in your default browser? (Y/n)"
if ($openApp -ne "n" -and $openApp -ne "N") {
    Start-Process "https://$appUrl"
}

Write-ColorOutput "✨ Deployment completed successfully!" $Green
