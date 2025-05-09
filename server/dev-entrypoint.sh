#!/bin/sh

echo "等待資料庫連接..."
sleep 10

echo "執行資料庫遷移..."
mkdir -p prisma
chmod -R 777 prisma

npx prisma generate

npx prisma migrate dev --name init --create-only
npx prisma migrate deploy

echo "初始化資料庫和管理員帳戶..."
node scripts/init-db.js

echo "啟動開發伺服器..."
npm run dev
