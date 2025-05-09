Write-Host "Starting development environment with database reset..." -ForegroundColor Green

# Stop any running containers
Write-Host "Stopping any running containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml down -v

# Remove any existing volumes to ensure clean state
Write-Host "Removing volumes for clean state..." -ForegroundColor Yellow
docker volume rm timmy-portfolio_postgres-dev-data 2>$null

# Ensure node_modules directories exist
Write-Host "Ensuring node_modules diredocker-compose -f docker-compose.dev.yml logs -fctories exist..." -ForegroundColor Yellow
if (-not (Test-Path -Path ".\server\node_modules")) {
    New-Item -ItemType Directory -Path ".\server\node_modules" -Force | Out-Null
}

# Build and start containers
Write-Host "Building and starting containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml up --build -d

# Wait for backend to be ready
Write-Host "Waiting for backend to initialize (this may take a minute)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Show logs
Write-Host "Development environment is running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "Admin credentials: admin123@gmail.com / admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Showing logs (press Ctrl+C to exit logs, containers will continue running)..." -ForegroundColor Green
docker-compose -f docker-compose.dev.yml logs -f
