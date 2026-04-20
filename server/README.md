# 後端（server）

**Express 4** 單體應用，進入點 **`server.js`**。資料庫 **PostgreSQL**，ORM **Prisma**（`prisma/schema.prisma`）。驗證採 **JWT**（`jsonwebtoken` + `middleware/auth.js`、`middleware/adminAuth.js`）。檔案／圖片可經 **Cloudinary** 與本機 **`uploads/`** 目錄（啟動時會自動建立子目錄）。

---

## 需求

- Node.js **>= 18**
- PostgreSQL（本機或 Docker）
- npm

---

## 安裝

```bash
cd server
npm install
```

複製並編輯 `.env`（範例鍵名如下；**`JWT_SECRET` 未設定時行程會直接結束**）。

---

## npm 指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | nodemon 監聽 `server.js` |
| `npm start` | 正式啟動 `node server.js` |
| `npm run prisma:generate` | 產生 Prisma Client |
| `npm run prisma:migrate` | `prisma migrate dev`（本機遷移開發） |
| `npm run prisma:studio` | Prisma Studio |
| `npm run db:init` | 執行 `scripts/init-db.js`（**需** `ADMIN_EMAIL`、`ADMIN_PASSWORD`） |

---

## 重要環境變數

`config/env.js` 會載入 `dotenv` 並解析 **`CORS_ORIGIN`**（逗號分隔多個 origin；未設時預設 `http://localhost:3000`）。

| 變數 | 說明 |
|------|------|
| `PORT` | 監聽埠，預設 `5000` |
| `NODE_ENV` | `development` / `production`；**production** 時會掛載 `../client/dist` 並 SPA fallback |
| `DATABASE_URL` | Prisma PostgreSQL 連線字串 |
| `JWT_SECRET` | **必填**，JWT 簽章 |
| `CORS_ORIGIN` | 允許的前端 origin，可複數逗號分隔 |
| `ADMIN_EMAIL` | `db:init` 管理員信箱 **必填** |
| `ADMIN_PASSWORD` | `db:init` 管理員密碼 **必填** |
| `ADMIN_NAME` | 選填，預設 `Admin` |
| `CLOUDINARY_*` | Cloudinary（上傳路由使用） |
| `EMAIL_HOST` … | Nodemailer（`routes/contact.js`） |

Cloudinary 欄位：`CLOUDINARY_CLOUD_NAME`、`CLOUDINARY_API_KEY`、`CLOUDINARY_API_SECRET`。

---

## HTTP 路由前綴（`server.js`）

所有 API 位於 **`/api`** 下（並套用 **rate limit** 與 **compression**）：

| 路徑 | 用途 |
|------|------|
| `GET /api/health` | 健康檢查 |
| `/api/auth` | 註冊、登入等（見 `routes/auth.js`） |
| `/api/posts` | 文章列表、單篇、留言、管理 CRUD（依方法與路由檔案） |
| `/api/projects` | 作品集 CRUD 與精選等 |
| `/api/contact` | 聯絡表單 |
| `/api/uploads` | 上傳（Multer + Cloudinary 等） |
| `/api/admin` | 後台相關 |
| `/api/files` | 檔案管理 |
| `/api/activities` | 活動紀錄 |

實際方法與路徑請以各 `routes/*.js` 為準。

---

## 目錄結構（精簡）

```
server/
├── server.js
├── lib/prisma.js             # PrismaClient 單例
├── config/
│   ├── env.js                # PORT、CORS、JWT、uploads 路徑
│   ├── logger.js
│   ├── cloudinary.js
│   └── admin.js              # ADMIN_EMAIL / ADMIN_PASSWORD（init-db 用）
├── middleware/
│   ├── auth.js
│   ├── adminAuth.js
│   └── upload.js
├── routes/
│   ├── auth.js
│   ├── posts.js
│   ├── projects.js
│   ├── contact.js
│   ├── uploads.js
│   ├── admin.js
│   ├── files.js
│   └── activity.js
├── prisma/schema.prisma
├── scripts/init-db.js
├── uploads/
└── utils/                      # responseHandler、jwtHelper …
```

---

## Prisma 與資料庫

- Schema：`prisma/schema.prisma`（`Project`、`Post`、`Comment`、`User`、`Contact`、`Activity` 等）。
- 開發可：`npx prisma generate` + `npx prisma db push`。  
- 正式環境建議：`prisma migrate dev` 建立遷移後，部署時 `prisma migrate deploy`。

---

## 安全與中介層

- **helmet**（含自訂 CSP）、**cors**（依 `CORS_ORIGIN`）、**express-rate-limit**（`/api` 每 15 分鐘 200 次）、JSON body 大小上限等見 `server.js`。

---

## 與前端的關係

- Axios **baseURL** 應指向 **`http(s)://後端主機:埠/api`**（見 client `src/config/api.ts`）。  
- 前端建置後目錄 **`client/dist`** 須存在，且相對於 `server` 資料夾位於 **`../client/dist`**，正式模式才可由同一進程提供靜態檔與 API。

---

*最後更新：2026 年 4 月*
