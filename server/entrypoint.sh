#!/bin/sh
set -e

echo "=== 等待資料庫連線 ==="
MAX_RETRIES=30
RETRY_INTERVAL=3
i=0

until node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.\$connect().then(() => { p.\$disconnect(); process.exit(0); }).catch(() => process.exit(1));
" 2>/dev/null; do
  i=$((i + 1))
  if [ "$i" -ge "$MAX_RETRIES" ]; then
    echo "資料庫連線逾時，放棄重試"
    exit 1
  fi
  echo "  資料庫尚未就緒，${RETRY_INTERVAL}s 後重試... ($i/$MAX_RETRIES)"
  sleep "$RETRY_INTERVAL"
done

echo "=== 執行資料庫遷移 ==="
npx prisma migrate deploy

echo "=== 初始化管理員帳號 ==="
node scripts/init-db.js || echo "init-db 發生錯誤（可能已初始化過），繼續啟動..."

echo "=== 啟動應用程式 ==="
exec node server.js
