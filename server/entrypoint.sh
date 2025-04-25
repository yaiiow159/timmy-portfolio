#!/bin/sh

# 等待資料庫連接
echo "等待資料庫連接..."
sleep 5

# 執行 Prisma 遷移（生產環境使用 deploy）
echo "執行資料庫遷移..."
npx prisma migrate deploy

# 初始化資料庫
echo "初始化資料庫..."
node scripts/init-db.js

# 啟動應用程式
echo "啟動應用程式..."
node server.js