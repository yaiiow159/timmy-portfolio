#!/bin/sh

echo "等待資料庫連接..."
sleep 10

echo "執行資料庫遷移..."
# 確保 Prisma 目錄存在並有正確權限
mkdir -p prisma
chmod -R 777 prisma

# 生成 Prisma 客戶端
npx prisma generate

# 執行 Prisma 遷移
npx prisma migrate dev --name init --create-only
npx prisma migrate deploy

echo "初始化資料庫和管理員帳戶..."
node scripts/init-db.js

echo "啟動開發伺服器..."
npm run dev
