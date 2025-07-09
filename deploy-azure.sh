#!/bin/bash

# Azure Deployment Script for GenAI Roadmap (Bash Version)
# Run this script to deploy your GenAI Roadmap to Azure Static Web Apps

set -e  # Exit on any error

# Default values
APP_NAME=""
RESOURCE_GROUP="genai-roadmap-rg"
LOCATION="West Europe"
GITHUB_REPO=""
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --app-name)
            APP_NAME="$2"
            shift 2
            ;;
        --resource-group)
            RESOURCE_GROUP="$2"
            shift 2
            ;;
        --location)
            LOCATION="$2"
            shift 2
            ;;
        --github-repo)
            GITHUB_REPO="$2"
            shift 2
            ;;
        --branch)
            BRANCH="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 --app-name <name> [options]"
            echo "Options:"
            echo "  --app-name <name>          Required: Unique name for the Azure app"
            echo "  --resource-group <name>    Resource group name (default: genai-roadmap-rg)"
            echo "  --location <location>      Azure region (default: 'East US')"
            echo "  --github-repo <url>        GitHub repository URL for auto-deployment"
            echo "  --branch <branch>          Git branch (default: main)"
            echo "  -h, --help                 Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option $1"
            exit 1
            ;;
    esac
done

# Validate required arguments
if [ -z "$APP_NAME" ]; then
    print_color $RED "❌ Error: --app-name is required"
    echo "Usage: $0 --app-name <unique-app-name>"
    exit 1
fi

print_color $BLUE "🚀 GenAI Roadmap - Azure Deployment Script"
print_color $BLUE "==========================================="

# Validate location for Azure Static Web Apps
VALID_LOCATIONS=("West US 2" "Central US" "East US 2" "West Europe" "East Asia")
if [[ ! " ${VALID_LOCATIONS[@]} " =~ " ${LOCATION} " ]]; then
    print_color $YELLOW "⚠️ Warning: '$LOCATION' may not be available for Azure Static Web Apps."
    print_color $YELLOW "Valid locations are: ${VALID_LOCATIONS[*]}"
    LOCATION="West Europe"
    print_color $GREEN "Using default location: $LOCATION"
fi

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_color $RED "❌ Azure CLI not found. Please install Azure CLI first."
    print_color $YELLOW "Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

print_color $GREEN "✅ Azure CLI is installed"

# Check if user is logged in to Azure
print_color $YELLOW "🔐 Checking Azure login status..."
if ! az account show &> /dev/null; then
    print_color $YELLOW "🔑 Please login to Azure..."
    az login
    if [ $? -ne 0 ]; then
        print_color $RED "❌ Azure login failed"
        exit 1
    fi
else
    USER_EMAIL=$(az account show --query user.name -o tsv)
    print_color $GREEN "✅ Logged in as: $USER_EMAIL"
fi

# Validate app name availability
print_color $YELLOW "🔍 Checking app name availability..."
EXISTING_APPS=$(az staticwebapp list --query "[?name=='$APP_NAME']" -o json)
if [ "$EXISTING_APPS" != "[]" ]; then
    print_color $RED "❌ App name '$APP_NAME' is already taken. Please choose a different name."
    exit 1
fi

# Create resource group if it doesn't exist
print_color $YELLOW "📁 Creating resource group '$RESOURCE_GROUP'..."
if ! az group exists --name "$RESOURCE_GROUP" | grep -q "true"; then
    az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output table
    if [ $? -eq 0 ]; then
        print_color $GREEN "✅ Resource group created successfully"
    else
        print_color $RED "❌ Failed to create resource group"
        exit 1
    fi
else
    print_color $GREEN "✅ Resource group already exists"
fi

# Build the application
print_color $YELLOW "🔨 Building the application..."
cd "$(dirname "$0")/web-app"

# Install dependencies
print_color $YELLOW "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_color $RED "❌ npm install failed"
    exit 1
fi

# Build the app
print_color $YELLOW "🏗️ Building the app..."
npm run build
if [ $? -ne 0 ]; then
    print_color $RED "❌ npm build failed"
    exit 1
fi

print_color $GREEN "✅ Build completed successfully"
cd - > /dev/null

# Deploy to Azure Static Web Apps
print_color $YELLOW "☁️ Deploying to Azure Static Web Apps..."

# Build Azure CLI command
DEPLOY_CMD="az staticwebapp create --name $APP_NAME --resource-group $RESOURCE_GROUP --location \"$LOCATION\" --app-location /web-app --output-location dist"

if [ -n "$GITHUB_REPO" ]; then
    DEPLOY_CMD="$DEPLOY_CMD --source \"$GITHUB_REPO\" --branch $BRANCH --login-with-github"
    print_color $YELLOW "Deploying with GitHub integration..."
else
    print_color $YELLOW "Deploying without GitHub integration (manual deployment)..."
fi

print_color $YELLOW "Executing: $DEPLOY_CMD"
eval $DEPLOY_CMD

if [ $? -eq 0 ]; then
    print_color $GREEN "✅ Azure Static Web App created successfully!"
    
    # Get the app URL
    print_color $YELLOW "🔍 Retrieving app information..."
    APP_URL=$(az staticwebapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query defaultHostname -o tsv 2>/dev/null)
    
    if [ -n "$APP_URL" ]; then
        print_color $GREEN "🌐 Your app is available at: https://$APP_URL"
    else
        print_color $YELLOW "⚠️ App created but URL retrieval failed. Check Azure Portal for details."
        APP_URL="$APP_NAME.azurestaticapps.net"
        print_color $YELLOW "🌐 Expected URL: https://$APP_URL"
    fi
    
    # If no GitHub repo was provided, show manual deployment instructions
    if [ -z "$GITHUB_REPO" ]; then
        print_color $YELLOW "📝 Manual Deployment Instructions:"
        print_color $YELLOW "1. Get deployment token:"
        print_color $YELLOW "   az staticwebapp secrets list --name '$APP_NAME' --resource-group '$RESOURCE_GROUP'"
        print_color $YELLOW "2. Deploy manually using Azure Static Web Apps CLI:"
        print_color $YELLOW "   swa deploy ./web-app/dist --deployment-token <TOKEN>"
    fi
    
else
    print_color $RED "❌ Failed to create Azure Static Web App"
    exit 1
fi

# Optional: Set up custom domain
print_color $BLUE "🌐 Domain Configuration"
read -p "Do you want to configure a custom domain? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your custom domain (e.g., genai-roadmap.yourdomain.com): " CUSTOM_DOMAIN
    if [ -n "$CUSTOM_DOMAIN" ]; then
        print_color $YELLOW "🔧 Configuring custom domain..."
        az staticwebapp hostname set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --hostname "$CUSTOM_DOMAIN"
        
        print_color $YELLOW "📋 DNS Configuration Required:"
        print_color $YELLOW "Add the following CNAME record to your DNS:"
        print_color $YELLOW "Name: $CUSTOM_DOMAIN"
        print_color $YELLOW "Value: $APP_URL"
    fi
fi

# Display summary
print_color $BLUE "🎉 Deployment Summary"
print_color $BLUE "==================="
print_color $GREEN "App Name: $APP_NAME"
print_color $GREEN "Resource Group: $RESOURCE_GROUP"
print_color $GREEN "Location: $LOCATION"
print_color $GREEN "URL: https://$APP_URL"

if [ -n "$GITHUB_REPO" ]; then
    print_color $GREEN "GitHub Integration: Enabled"
    print_color $GREEN "Repository: $GITHUB_REPO"
    print_color $GREEN "Branch: $BRANCH"
    print_color $GREEN "Auto-deployment: Enabled on push to $BRANCH"
else
    print_color $YELLOW "GitHub Integration: Not configured"
    print_color $YELLOW "Deployment: Manual"
fi

print_color $GREEN "🚀 Your GenAI Roadmap is now live on Azure!"
print_color $GREEN "Share your learning journey with the world!"

# Optional: Open the app in browser
read -p "Open the app in your default browser? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "https://$APP_URL"
    elif command -v open &> /dev/null; then
        open "https://$APP_URL"
    else
        print_color $YELLOW "Please open https://$APP_URL in your browser"
    fi
fi

print_color $GREEN "✨ Deployment completed successfully!"
