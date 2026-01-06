#!/usr/bin/env pwsh
# Health Tracker - Startup Script

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Health Tracker App" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "[1/3] Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[1/3] Dependencies already installed" -ForegroundColor Green
}

# Check if .env.local exists and has the project ID configured
Write-Host "[2/3] Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "your_base44_project_id_here") {
        Write-Host ""
        Write-Host "WARNING: Please configure your Base44 project ID in .env.local" -ForegroundColor Red
        Write-Host "Edit .env.local and replace 'your_base44_project_id_here' with your actual project ID" -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host "Environment configured" -ForegroundColor Green
    }
} else {
    Write-Host "WARNING: .env.local file not found" -ForegroundColor Red
}

Write-Host "[3/3] Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "The app will be available at http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
