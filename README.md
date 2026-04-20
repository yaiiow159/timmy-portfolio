# Timmy Portfolio

全端個人作品集與部落格：**Vue 3 + Vite** 前端、**Express + Prisma + PostgreSQL** 後端，可選 **Docker** 一鍵開發環境。正式環境下由 **同一支 Node 服務** 提供 REST API 並代管前端建置產物（`client/dist`）。

**技術摘要：** Vue 3、TypeScript、Vue Router、Pinia、Tailwind CSS、vue-i18n | Express、Prisma、PostgreSQL、JWT、Nodemailer、Cloudinary、Multer、Helmet、compression、express-rate-limit

---

## 目錄

- [專案結構](#專案結構)
- [環境需求](#環境需求)
- [本機開發（前後端分開跑）](#本機開發前後端分開跑)
- [根目錄 npm 指令](#根目錄-npm-指令)
- [Docker 開發](#docker-開發)
- [正式環境建置](#正式環境建置)
- [環境變數總覽](#環境變數總覽)
- [說明文件](#說明文件)

---

## 專案結構

```
timmy-portfolio/
├── client/                    # 前端（Vite + Vue 3）
│   ├── public/
│   ├── src/
│   │   ├── components/        # layout, blog, portfolio, common …
│   │   ├── views/             # 公開頁 + views/admin 後台
│   │   ├── router/
│   │   ├── store/             # Pinia（auth, blog, portfolio, theme …）
│   │   ├── services/          # Axios 呼叫 API
│   │   ├── locales/           # i18n JSON
│   │   ├── config/            # 例如 API_BASE_URL（VITE_API_URL）
│   │   └── style.css          # 全域樣式 + Tailwind
│   ├── package.json
│   └── README.md
├── server/                    # 後端（Express）
│   ├── routes/                # auth, posts, projects, contact, uploads, admin, files, activity
│   ├── middleware/            # auth, adminAuth, upload
│   ├── config/                # env, logger, cloudinary, admin
│   ├── lib/prisma.js
│   ├── prisma/schema.prisma
│   ├── scripts/init-db.js     # 建立／更新管理員帳號（需 ADMIN_* 環境變數）
│   ├── uploads/               # 本機上傳目錄（亦掛載於 Docker）
│   ├── server.js
│   ├── package.json
│   └── README.md
├── docker-compose.yml         # 正式取向組態
├── docker-compose.dev.yml     # 開發組態
├── Dockerfile.frontend / .backend / *.dev
└── package.json               # 根層便捷指令（聚合 client/server）
```

---

## 環境需求

| 項目 | 說明 |
|------|------|
| Node.js | **>= 18**（與根 `package.json` engines 一致） |
| npm | 與 Node 搭配的版本即可 |
| PostgreSQL | 本機或 Docker 內資料庫；連線字串 `DATABASE_URL` |
| Docker（選用） | 使用 `docker-compose.dev.yml` 時需要 |

---

## 本機開發（前後端分開跑）

### 1. 後端 `server/`

```bash
cd server
npm install
```

在 `server/.env` 設定至少：`DATABASE_URL`、`JWT_SECRET`、`CORS_ORIGIN`（可逗號分隔多個來源）、`ADMIN_EMAIL`、`ADMIN_PASSWORD`，以及聯絡表單／Cloudinary 等（詳見 [server/README.md](./server/README.md)）。

```bash
npx prisma generate
npx prisma db push          # 開發同步 schema；正式遷移請用 migrate
npm run db:init             # 寫入管理員（依 ADMIN_*）
npm run dev                 # nodemon，預設埠見 env PORT（預設 5000）
```

### 2. 前端 `client/`

```bash
cd client
npm install
```

在 `client/.env` 設定後端 API 基底（**需含 `/api` 前綴**，與 Axios `baseURL` 一致）：

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev                 # Vite 開發伺服器（預設常為 http://localhost:5173，依終端機為準）
```

本機若前後埠不同，請將 `CORS_ORIGIN` 設為實際前端 origin（例如 `http://localhost:5173`）。

---

## 根目錄 npm 指令

於 **專案根目錄** 執行：

| 指令 | 說明 |
|------|------|
| `npm run install:server` | 安裝 `server` 依賴 |
| `npm run install:client` | 安裝 `client` 依賴 |
| `npm run dev:server` | 在 `server` 跑 `npm run dev` |
| `npm run dev:client` | 在 `client` 跑 `npm run dev` |
| `npm run build:client` | 建置前端至 `client/dist` |
| `npm run build` | 安裝 server + client 依賴並建置前端 |
| `npm start` | 以 `node server/server.js` 啟動（正式模式請搭配 `NODE_ENV=production` 與已建置之 `client/dist`） |

---

## Docker 開發

```bash
docker compose -f docker-compose.dev.yml up -d
```

組態內已帶入資料庫、後端、前端與常見環境變數；修改 `server/prisma` 後可在容器內執行 `npx prisma db push` 等指令同步 schema。細節以 `docker-compose.dev.yml` 為準。

---

## 正式環境建置

1. 建置前端：`cd client && npm ci && npm run build`  
2. 確認 `client/dist` 與 `server` 的相對位置符合 `server.js`（`../client/dist`）。  
3. 設定 `NODE_ENV=production`、`DATABASE_URL`、`JWT_SECRET`、`CORS_ORIGIN` 等。  
4. `cd server && npm ci && npx prisma migrate deploy`（若採用 migrations）。  
5. 啟動：`cd .. && npm start` 或於 `server` 執行 `npm start`。

---

## 環境變數總覽

| 位置 | 重點變數 |
|------|-----------|
| `client/.env` | `VITE_API_URL`（建議 `http(s)://主機:埠/api`） |
| `server/.env` | `PORT`、`NODE_ENV`、`DATABASE_URL`、`JWT_SECRET`、`CORS_ORIGIN`、`ADMIN_EMAIL`、`ADMIN_PASSWORD`、`ADMIN_NAME`、SMTP、Cloudinary 等 |

完整表格與預設值見 **[server/README.md](./server/README.md)**。

---

## 說明文件

- [client/README.md](./client/README.md) — 前端架構、腳本、目錄說明  
- [server/README.md](./server/README.md) — 後端 API 前綴、Prisma、路由與環境變數  

---

*最後更新：2026 年 4 月*
