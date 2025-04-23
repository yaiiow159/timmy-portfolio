#!/usr/bin/env bash
set -e

# 顯示歡迎信息
echo "========================================"
echo "  Timmy's Portfolio 部署腳本"
echo "========================================"
echo ""

# 檢查 Docker 是否安裝
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null
then
    echo "錯誤: 未檢測到 Docker 或 Docker Compose"
    echo "請先安裝 Docker 和 Docker Compose 後再運行此腳本"
    exit 1
fi

# 檢查環境變數文件
if [ ! -f "./server/.env" ]; then
    echo "警告: 未找到 server/.env 文件"
    echo "正在創建默認環境變數文件..."
    cat > ./server/.env << EOF
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
EOF
    echo "已創建默認環境變數文件，請根據需要修改 server/.env"
fi

# 檢查前端環境變數文件
if [ ! -f "./client/.env" ]; then
    echo "警告: 未找到 client/.env 文件"
    echo "正在創建默認環境變數文件..."
    cat > ./client/.env << EOF
VITE_API_URL=http://localhost:5000
EOF
    echo "已創建默認環境變數文件，請根據需要修改 client/.env"
fi

# 停止並移除現有容器
echo "停止並移除現有容器..."
docker-compose down

# 構建並啟動容器
echo "構建並啟動容器..."
docker-compose up -d --build

# 等待後端服務啟動
echo "等待服務啟動..."
sleep 10

# 檢查並創建資料庫（如不存在）
echo "檢查資料庫 timmy_portfolio 是否存在..."
if ! docker-compose exec postgres psql -U root -tc "SELECT 1 FROM pg_database WHERE datname='timmy_portfolio';" | grep -q 1; then
  echo "資料庫不存在，正在創建 timmy_portfolio ..."
  docker-compose exec postgres psql -U root -c "CREATE DATABASE timmy_portfolio;"
else
  echo "資料庫已存在，跳過創建步驟。"
fi

# 運行數據庫遷移
echo "運行數據庫遷移..."
docker-compose exec backend npx prisma migrate deploy

# 檢查容器狀態
echo ""
echo "檢查容器狀態..."
docker-compose ps

echo ""
echo "========================================"
echo "  部署完成!"
echo "  前端: http://localhost:3000"
echo "  後端 API: http://localhost:5000"
echo "  管理員面板: http://localhost:3000/admin"
echo "========================================"
echo ""
echo "提示: 如需修改配置，請編輯 .env 文件後重新運行此腳本"
