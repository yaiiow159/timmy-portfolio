Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Timmy's Portfolio 部署腳本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    docker --version | Out-Null
    docker-compose --version | Out-Null
}
catch {
    Write-Host "錯誤: 未檢測到 Docker 或 Docker Compose" -ForegroundColor Red
    Write-Host "請先安裝 Docker Desktop 後再運行此腳本" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path -Path "./server/.env")) {
    Write-Host "警告: 未找到 server/.env 文件" -ForegroundColor Yellow
    Write-Host "正在創建默認環境變數文件..." -ForegroundColor Yellow
    
    @"
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://root:root@postgres:5432/timmy_portfolio?schema=public
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=Lh2xP9fK7rT3vM8qZ6bY4nA5cX1jW0dG
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=true
EMAIL_USER=examyou076@gmail.com
EMAIL_PASS=bclr hmql svwx nmwd
"@ | Out-File -FilePath "./server/.env" -Encoding utf8
    
    Write-Host "已創建默認環境變數文件，請根據需要修改 server/.env" -ForegroundColor Yellow
}

# 檢查前端環境變數文件
if (-not (Test-Path -Path "./client/.env")) {
    Write-Host "警告: 未找到 client/.env 文件" -ForegroundColor Yellow
    Write-Host "正在創建默認環境變數文件..." -ForegroundColor Yellow
    
    @"
VITE_API_URL=http://localhost:5000
"@ | Out-File -FilePath "./client/.env" -Encoding utf8
    
    Write-Host "已創建默認環境變數文件，請根據需要修改 client/.env" -ForegroundColor Yellow
}

# 停止並移除現有容器
Write-Host "停止並移除現有容器..." -ForegroundColor Yellow
docker-compose down

# 構建並啟動容器
Write-Host "構建並啟動容器..." -ForegroundColor Yellow
docker-compose up -d --build

# 等待服務啟動
Write-Host "等待服務啟動..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 檢查並創建資料庫（如不存在）
Write-Host "檢查資料庫 timmy_portfolio 是否存在..." -ForegroundColor Yellow
$exists = docker-compose exec postgres psql -U root -tAc "SELECT 1 FROM pg_database WHERE datname='timmy_portfolio';"
if ($exists.Trim() -ne "1") {
    Write-Host "資料庫不存在，正在創建 timmy_portfolio ..." -ForegroundColor Yellow
    docker-compose exec postgres psql -U root -c "CREATE DATABASE timmy_portfolio;"
} else {
    Write-Host "資料庫已存在，跳過創建步驟。" -ForegroundColor Green
}

# 運行數據庫遷移
Write-Host "運行數據庫遷移..." -ForegroundColor Yellow
docker-compose exec backend npx prisma migrate deploy

# 檢查容器狀態
Write-Host ""
Write-Host "檢查容器狀態..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  部署完成!" -ForegroundColor Green
Write-Host "  前端: http://localhost:3000" -ForegroundColor Green
Write-Host "  後端 API: http://localhost:5000" -ForegroundColor Green
Write-Host "  管理員面板: http://localhost:3000/admin" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "提示: 如需修改配置，請編輯 .env 文件後重新運行此腳本" -ForegroundColor Cyan
