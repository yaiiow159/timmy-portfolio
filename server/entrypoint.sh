#!/bin/sh

echo "等待資料庫連接..."
sleep 5

echo "執行資料庫遷移..."
npx prisma migrate deploy

echo "初始化資料庫..."
node scripts/init-db.js

echo "啟動應用程式..."
node server.js