# Deploy GenAI Roadmap to Azure

This guide will help you deploy your GenAI Roadmap web application to Azure using Azure Static Web Apps.

## 🎯 Deployment Options

### Option 1: Azure Static Web Apps (Recommended)
**Best for**: Frontend applications with automatic CI/CD from GitHub
**Cost**: Free tier available
**Features**: Global CDN, custom domains, automatic HTTPS

### Option 2: Azure App Service
**Best for**: Full-stack applications needing server-side functionality
**Cost**: Paid service with various tiers
**Features**: Scaling, monitoring, custom domains

### Option 3: Azure Storage Static Websites
**Best for**: Simple static hosting
**Cost**: Very low cost storage
**Features**: Basic static hosting

## 🚀 Option 1: Azure Static Web Apps (Recommended)

### Prerequisites
- Azure account (free tier available)
- GitHub repository
- Azure CLI (optional, for command-line deployment)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
```bash
cd "q:\vibe\GenAI Roamap"
git init
git add .
git commit -m "Initial commit: GenAI Roadmap App"
git branch -M main
git remote add origin https://github.com/yourusername/genai-roadmap.git
git push -u origin main
```

2. **Verify the GitHub workflow file** is in place:
   - File: `.github/workflows/azure-static-web-apps.yml` ✅ (already created)

### Step 2: Create Azure Static Web App

#### Using Azure Portal:

1. **Go to Azure Portal** (https://portal.azure.com)
2. **Create a resource** → Search for "Static Web App" → Create
3. **Configure the app**:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `genai-roadmap-app` (must be globally unique)
   - **Plan type**: Free (for personal use)
   - **Region**: Choose closest region
   - **Source**: GitHub
   - **GitHub Account**: Authorize and select your account
   - **Organization**: Your GitHub username
   - **Repository**: Your forked/created repository
   - **Branch**: main
   - **Build Presets**: React
   - **App location**: `/web-app`
   - **Api location**: (leave empty)
   - **Output location**: `dist`

4. **Review and create** the resource

#### Using Azure CLI:

```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name genai-roadmap-rg --location "West Europe"

# Create static web app
az staticwebapp create \
  --name genai-roadmap-app \
  --resource-group genai-roadmap-rg \
  --source https://github.com/yourusername/genai-roadmap \
  --location "West Europe" \
  --branch main \
  --app-location "/web-app" \
  --output-location "dist" \
  --login-with-github
```

### Step 3: Configure GitHub Secrets

After creating the Static Web App, Azure will automatically:
1. Fork your repository (if needed)
2. Add the GitHub Action workflow
3. Set up the required secrets in your repository

**Verify the secret exists**:
- Go to your GitHub repository
- Settings → Secrets and variables → Actions
- Check for `AZURE_STATIC_WEB_APPS_API_TOKEN`

### Step 4: Deploy

The deployment happens automatically when you push to the main branch:

```bash
# Make any changes to your app
git add .
git commit -m "Deploy to Azure"
git push origin main
```

**Monitor deployment**:
- GitHub: Actions tab in your repository
- Azure Portal: Static Web App → GitHub Actions runs

### Step 5: Access Your App

Once deployed, your app will be available at:
`https://genai-roadmap-app.azurestaticapps.net`

## 🔧 Configuration Files Created

### 1. GitHub Actions Workflow
**File**: `.github/workflows/azure-static-web-apps.yml`
- Automatic deployment on push to main
- Build and deploy React app
- PR preview environments

### 2. Static Web App Configuration
**File**: `web-app/public/staticwebapp.config.json`
- SPA routing configuration
- Security headers
- MIME type settings

## 🎨 Customization Options

### Custom Domain
1. **Azure Portal** → Your Static Web App → Custom domains
2. **Add custom domain** → Enter your domain
3. **Update DNS records** as instructed
4. **Validate and configure**

### Environment Variables
If you need environment variables:
1. **Azure Portal** → Your Static Web App → Configuration
2. **Add application settings**
3. **Reference in your app** using `import.meta.env.VITE_VARIABLE_NAME`

### Staging Environments
Azure Static Web Apps automatically creates staging environments for PRs:
- Each PR gets a unique preview URL
- Test changes before merging to main

## 🚀 Option 2: Azure App Service

If you need server-side functionality later:

### Create App Service
```bash
# Create App Service plan
az appservice plan create \
  --name genai-roadmap-plan \
  --resource-group genai-roadmap-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --name genai-roadmap-webapp \
  --resource-group genai-roadmap-rg \
  --plan genai-roadmap-plan \
  --runtime "NODE|18-lts"

# Configure deployment
az webapp deployment source config \
  --name genai-roadmap-webapp \
  --resource-group genai-roadmap-rg \
  --repo-url https://github.com/yourusername/genai-roadmap \
  --branch main \
  --manual-integration
```

## 🔧 Build Optimization for Production

Update your `package.json` build script:

```json
{
  "scripts": {
    "build": "vite build",
    "build:azure": "vite build --base=/",
    "preview": "vite preview"
  }
}
```

## 📊 Monitoring and Analytics

### Azure Application Insights
Add monitoring to track user behavior:

1. **Create Application Insights** resource
2. **Add to your app**:
```javascript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: 'YOUR_INSTRUMENTATION_KEY'
  }
});
appInsights.loadAppInsights();
appInsights.trackPageView();
```

### Custom Analytics
Track learning progress and content engagement:
- Task completion rates
- Content generation usage
- Calendar export frequency
- Popular learning paths

## 🔒 Security Considerations

### Content Security Policy
The `staticwebapp.config.json` includes security headers:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options

### Data Privacy
- All data stored locally in browser
- No sensitive information transmitted
- HTTPS enforced by Azure

## 💡 Pro Tips

1. **Use Azure DevOps** instead of GitHub if preferred
2. **Set up custom domain** early for professional branding
3. **Monitor costs** using Azure Cost Management
4. **Use staging slots** for testing major changes
5. **Enable diagnostics** for troubleshooting

## 🎯 Next Steps After Deployment

1. **Share your app** with the GenAI community
2. **Collect feedback** and iterate
3. **Add analytics** to understand usage patterns
4. **Consider monetization** if building for others
5. **Scale** based on user adoption

## 📈 Cost Estimation

### Azure Static Web Apps (Free Tier)
- **Bandwidth**: 100 GB/month
- **Storage**: 0.5 GB
- **Custom domains**: 2 included
- **Cost**: $0/month

### Azure Static Web Apps (Standard Tier)
- **Bandwidth**: 100 GB/month (additional costs for overage)
- **Storage**: 0.5 GB (additional costs for overage)
- **Custom domains**: Unlimited
- **Cost**: ~$9/month

## 🆘 Troubleshooting

### Common Issues

1. **Build fails**: Check Node.js version compatibility
2. **Routing issues**: Verify `staticwebapp.config.json` configuration
3. **Environment variables**: Use `VITE_` prefix for client-side variables
4. **CORS errors**: Configure allowed origins in Azure

### Getting Help
- Azure documentation: https://docs.microsoft.com/azure/static-web-apps/
- GitHub issues: Create in your repository
- Azure support: Available through Azure portal

---

Your GenAI Roadmap app is now ready for Azure deployment! This will give you a professional, scalable platform to share your learning journey and help others in the GenAI community. 🚀
