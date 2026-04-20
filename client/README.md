# 前端（client）

**Vue 3** + **Vite 6** + **TypeScript**，樣式以 **Tailwind CSS** 為主，狀態管理 **Pinia**，路由 **Vue Router**，多語系 **vue-i18n**（`locales/` 內建 en、zh-TW、zh-CN、ja 等）。透過 `src/services/api.ts`（Axios）呼叫後端，**`baseURL` 來自 `VITE_API_URL`，預設後端掛在 `/api` 下**（本機常設為 `http://localhost:5000/api`）。

---

## 需求

- Node.js **>= 18**
- npm（或 pnpm／yarn，本 repo 以 npm 為準）

---

## 安裝與開發

```bash
cd client
npm install
```

建立 `.env`（至少）：

```env
VITE_API_URL=http://localhost:5000/api
```

`src/config/api.ts`：`VITE_API_URL` 未設定時會退回 `'/api'`（適合同域代理）。

```bash
npm run dev       # Vite 開發伺服器
npm run build     # vue-tsc -b && vite build，產出 dist/
npm run preview   # 預覽 dist
```

---

## 目錄與責任（精簡）

```
client/src/
├── App.vue / main.ts
├── router/index.ts           # 公開路由 + /admin 子路由（requiresAuth / requiresAdmin）
├── components/
│   ├── layout/               # Navbar, Footer, MainLayout
│   ├── blog/                 # BlogCard, BlogEditor（Quill）
│   ├── portfolio/            # ProjectCard 等
│   └── common/               # 共用 UI、RichTextEditor、ResumeDialog …
├── views/
│   ├── Home, Blog, BlogPost, Portfolio, Resume, Contact, Auth, NotFound
│   └── admin/                # Dashboard, Posts, EditPost, Projects, Files
├── store/                    # Pinia：authStore, blogStore, portfolioStore, themeStore …
├── services/                 # blogService, projectService, contactService, api 實例
├── locales/                  # i18n JSON
├── utils/
├── assets/
├── style.css                 # Tailwind + 全域主題／元件樣式
├── tailwind.config.js
└── vite.config.ts
```

---

## 主要依賴（節錄）

| 套件 | 用途 |
|------|------|
| vue, vue-router, pinia | 核心架構 |
| axios | HTTP |
| vue-i18n | 多語系 |
| @vueup/vue-quill, quill | 後台文章編輯器 |
| marked, highlight.js | 文章內容顯示（Markdown／語法高亮） |
| @tailwindcss/typography | 文章 prose 樣式 |
| @headlessui/vue, @heroicons/vue | 部分互動與圖示 |

實際版本請以 `package.json` 為準。

---

## 建置產物

`npm run build` 後輸出至 **`dist/`**。正式環境由後端 `server.js` 在 `NODE_ENV=production` 時以 `express.static` 提供此目錄，並對非 `/api` 路徑回傳 `index.html`（SPA fallback）。

---

## 後端與根目錄

- 同層 **`../server`** 為 API 實作說明：[server/README.md](../server/README.md)  
- 聚合指令見根目錄 [README.md](../README.md)  

---

*最後更新：2026 年 4 月*
