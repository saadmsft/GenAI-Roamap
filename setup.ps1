#!/usr/bin/env pwsh

Write-Host "🚀 Setting up Enhanced GenAI Roadmap Tracker..." -ForegroundColor Green
Write-Host "   📚 Now with 500+ curated study resources!" -ForegroundColor Cyan
Write-Host "   📅 Google Calendar export functionality!" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Navigate to web-app directory
Set-Location "web-app"

Write-Host "📦 Installing enhanced dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    
    Write-Host "🌟 Setup complete! Starting the enhanced application..." -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 GenAI Roadmap Tracker - Enhanced Edition" -ForegroundColor Magenta
    Write-Host "   The application will open at http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🆕 NEW FEATURES:" -ForegroundColor Yellow
    Write-Host "  📅 Calendar Export - Export your learning plan to Google Calendar or any calendar app" -ForegroundColor White
    Write-Host "  📚 Enhanced Resources - 500+ curated study materials for all 126 daily tasks" -ForegroundColor White
    Write-Host "  🎯 Smart Scheduling - Customizable start dates and reminder settings" -ForegroundColor White
    Write-Host "  📖 Resource Metadata - Difficulty levels, time estimates, and priority rankings" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 LEARNING PATH:" -ForegroundColor Yellow
    Write-Host "  📊 Dashboard - Track your overall progress across 5 phases" -ForegroundColor White
    Write-Host "  🗺️  Enhanced Roadmap - 126 detailed tasks with rich study resources" -ForegroundColor White
    Write-Host "  🚀 Projects - 5 capstone portfolio projects for hands-on experience" -ForegroundColor White
    Write-Host "  🧠 Skills - Technical, platform, and business skill progression" -ForegroundColor White
    Write-Host "  📈 Analytics - Visual progress tracking and learning insights" -ForegroundColor White
    Write-Host ""
    Write-Host "🎓 CAREER FOCUS:" -ForegroundColor Yellow
    Write-Host "  • Senior GenAI Architect roles at major cloud providers" -ForegroundColor White
    Write-Host "  • Cross-cloud expertise (Azure OpenAI, AWS Bedrock, Google Vertex AI)" -ForegroundColor White
    Write-Host "  • Enterprise AI implementation and strategy" -ForegroundColor White
    Write-Host "  • Technical leadership in AI transformation" -ForegroundColor White
    Write-Host ""
    Write-Host "📅 CALENDAR EXPORT GUIDE:" -ForegroundColor Yellow
    Write-Host "  1. Click 'Export to Calendar' button in the Roadmap page" -ForegroundColor White
    Write-Host "  2. Select tasks/weeks you want to schedule" -ForegroundColor White
    Write-Host "  3. Set your preferred start date and reminders" -ForegroundColor White
    Write-Host "  4. Download ICS file or export directly to Google Calendar" -ForegroundColor White
    Write-Host "  5. Import into any calendar app for seamless learning schedule" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the development server" -ForegroundColor Gray
    Write-Host ""
    
    # Start the development server
    npm start
} else {
    Write-Host "❌ Failed to install dependencies. Please check the error messages above." -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "  • Ensure you have Node.js 18+ installed" -ForegroundColor White
    Write-Host "  • Check your internet connection" -ForegroundColor White
    Write-Host "  • Try running 'npm cache clean --force' and retry" -ForegroundColor White
    exit 1
}
