# 🌟 Timmy's Portfolio - 啟動指南

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

</div>

<p align="center">
這份文檔提供了如何在開發環境和生產環境中啟動前後端應用的詳細說明。
</p>

---

## 📋 目錄

- [💻 系統需求](#-系統需求)
- [🏗️ 專案結構](#️-專案結構)
- [🚀 開發環境設置](#-開發環境設置)
  - [🖥️ 前端開發環境](#️-前端開發環境)
  - [⚙️ 後端開發環境](#️-後端開發環境)
  - [🐳 使用 Docker 進行開發](#-使用-docker-進行開發)
- [🌐 生產環境部署](#-生產環境部署)
  - [📜 使用部署腳本](#-使用部署腳本)
  - [🛠️ 手動部署](#️-手動部署)
  - [⚙️ 環境變數配置](#️-環境變數配置)
- [❓ 常見問題解答](#-常見問題解答)

---

## 💻 系統需求

<table>
  <tr>
    <td>✅ Node.js 18.x 或更高版本</td>
    <td>✅ npm 9.x 或更高版本</td>
  </tr>
  <tr>
    <td>✅ PostgreSQL 16.x (如果不使用 Docker)</td>
    <td>✅ Docker 和 Docker Compose (推薦)</td>
  </tr>
</table>

---

## 🏗️ 專案結構

```
timmy-portfolio/
├── client/                 # 前端 Vue.js 應用
│   ├── public/             # 靜態資源
│   ├── src/                # 源代碼
│   └── package.json        # 前端依賴
├── server/                 # 後端 Node.js 應用
│   ├── prisma/             # 數據庫模型和遷移
│   ├── routes/             # API 路由
│   ├── scripts/            # 腳本文件
│   └── package.json        # 後端依賴
├── docker-compose.yml      # Docker 配置
├── Dockerfile.frontend     # 前端 Docker 配置
├── Dockerfile.backend      # 後端 Docker 配置
├── deploy.sh               # Linux/macOS 部署腳本
└── deploy.ps1              # Windows 部署腳本
```

---

## 🚀 開發環境設置

### 🖥️ 前端開發環境

<details>
<summary><b>展開查看詳細步驟</b></summary>

1. 進入前端目錄：

```bash
cd client
```

2. 安裝依賴：

```bash
npm install
```

3. 創建 `.env` 文件並設置 API URL：

```
VITE_API_URL=http://localhost:5000
```

4. 啟動開發服務器：

```bash
npm run dev
```

前端應用將在 http://localhost:3000 運行。

</details>

### ⚙️ 後端開發環境

<details>
<summary><b>展開查看詳細步驟</b></summary>

1. 進入後端目錄：

```bash
cd server
```

2. 安裝依賴：

```bash
npm install
```

3. 創建 `.env` 文件並設置環境變數：

```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/timmy_portfolio?schema=public
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_jwt_secret_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_RECIPIENT=your-email@gmail.com
```

4. 設置數據庫：

```bash
npx prisma migrate dev
```

5. 初始化數據庫：

```bash
node scripts/init-db.js
```

6. 啟動開發服務器：

```bash
npm run dev
```

後端 API 將在 http://localhost:5000 運行。

</details>

### 🐳 使用 Docker 進行開發

<details>
<summary><b>展開查看詳細步驟</b></summary>

使用 Docker 是最簡單的開發方式，可以避免環境配置問題。

1. 在項目根目錄下運行：

```bash
# Linux/macOS
./deploy.sh

# Windows
.\deploy.ps1
```

或者手動運行 Docker Compose：

```bash
docker-compose up -d
```

這將啟動前端、後端和數據庫服務。前端將在 http://localhost:3000 運行，後端 API 將在 http://localhost:5000 運行。

</details>

---

## 🌐 生產環境部署

### 📜 使用部署腳本

<details>
<summary><b>展開查看詳細步驟</b></summary>

1. 確保已安裝 Docker 和 Docker Compose。

2. 修改環境變數文件以適應生產環境：
   - `server/.env`：設置生產環境的數據庫連接、郵件配置等
   - `client/.env`：設置正確的 API URL

3. 運行部署腳本：

```bash
# Linux/macOS
./deploy.sh

# Windows
.\deploy.ps1
```

</details>

### 🛠️ 手動部署

<details>
<summary><b>展開查看前端部署步驟</b></summary>

#### 前端部署

1. 進入前端目錄：

```bash
cd client
```

2. 安裝依賴：

```bash
npm install
```

3. 構建生產版本：

```bash
npm run build
```

4. 將 `dist` 目錄中的文件部署到您的 Web 服務器。

</details>

<details>
<summary><b>展開查看後端部署步驟</b></summary>

#### 後端部署

1. 進入後端目錄：

```bash
cd server
```

2. 安裝依賴（僅生產依賴）：

```bash
npm install --production
```

3. 設置環境變數（參見環境變數配置部分）。

4. 運行數據庫遷移：

```bash
npx prisma migrate deploy
```

5. 初始化數據庫：

```bash
node scripts/init-db.js
```

6. 啟動服務器：

```bash
npm start
```

</details>

### ⚙️ 環境變數配置

<details>
<summary><b>展開查看前端環境變數</b></summary>

#### 前端環境變數 (client/.env)

| 變數名 | 說明 | 示例 |
|:--------|:------|:------|
| `VITE_API_URL` | 後端 API 的 URL | http://api.example.com |

</details>

<details>
<summary><b>展開查看後端環境變數</b></summary>

#### 後端環境變數 (server/.env)

| 變數名 | 說明 | 示例 |
|:--------|:------|:------|
| `PORT` | 服務器端口 | 5000 |
| `NODE_ENV` | 環境模式 | production |
| `DATABASE_URL` | PostgreSQL 連接字符串 | postgresql://user:pass@host:5432/db |
| `CORS_ORIGIN` | 允許的跨域來源 | https://example.com |
| `JWT_SECRET` | JWT 令牌密鑰 | your_secret_key |
| `EMAIL_HOST` | SMTP 服務器 | smtp.gmail.com |
| `EMAIL_PORT` | SMTP 端口 | 587 |
| `EMAIL_SECURE` | 是否使用 SSL/TLS | false |
| `EMAIL_USER` | 郵箱用戶名 | your-email@gmail.com |
| `EMAIL_PASS` | 郵箱密碼或應用密碼 | your-app-password |
| `EMAIL_RECIPIENT` | 接收郵件的地址 | your-email@gmail.com |
| `ADMIN_EMAIL` | 管理員郵箱 | admin@example.com |
| `ADMIN_PASSWORD` | 管理員密碼 | secure_password |

</details>

---

## ❓ 常見問題解答

<details>
<summary><b>數據庫連接問題</b></summary>

如果遇到數據庫連接問題，請檢查：
- DATABASE_URL 環境變數是否正確
- PostgreSQL 服務是否運行
- 數據庫用戶是否有正確的權限

</details>

<details>
<summary><b>郵件發送失敗</b></summary>

如果聯繫表單郵件發送失敗，請檢查：
- EMAIL_* 環境變數是否正確配置
- 如果使用 Gmail，確保已設置應用密碼
- 檢查郵件服務器的防火牆設置

</details>

<details>
<summary><b>Docker 容器無法啟動</b></summary>

如果 Docker 容器無法啟動，請嘗試：
- 檢查 Docker 和 Docker Compose 是否正確安裝
- 運行 `docker-compose down` 然後重新啟動
- 檢查日誌 `docker-compose logs`

</details>

<details>
<summary><b>前端無法連接到後端 API</b></summary>

如果前端無法連接到後端 API，請檢查：
- VITE_API_URL 是否正確設置
- 後端服務是否正在運行
- CORS 設置是否正確

</details>

---

<div align="center">

**Made with ❤️ by Timmy**

</div>
