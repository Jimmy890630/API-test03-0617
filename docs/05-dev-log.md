# 開發 Log

## 專案：金屬加工名片系統

---

### 2026-06-17

- **建立文件骨架**：完成 `docs/` 資料夾與以下規劃文件：
  - `01-requirements.md`：需求規格書，定義名片欄位、技術規範與開發規則。
  - `02-file-structure.md`：檔案關係文件，說明目錄結構、檔案職責與前端載入順序。
  - `03-ui-design.md`：UI / 基礎樣式設計文件，包含配色、字型、版面與響應式規劃。
  - `04-api-spec.md`：API 規格文件，定義資料模型與預留端點。
  - `05-dev-log.md`：本文件，記錄開發歷程。
  - `06-reusable-utils.md`：共用 JS 方法規格（待建立）。
- **待完成**：
  - 建立 `06-reusable-utils.md`。

### 2026-06-17（續）

- **建立 UI 範本**：收到使用者指示後，建立無需 API 的靜態名片列表頁面。
  - `index.html`：入口頁面，包含頁首、名片網格容器與頁尾。
  - `assets/css/main.css`：全站 CSS 變數、Reset、版面網格與響應式規則。
  - `assets/css/card.css`：名片卡片視覺樣式、懸停互動與服務標籤。
  - `assets/js/utils.js`：可重複使用工具方法（格式化、驗證、DOM 輔助、錯誤處理）。
  - `assets/js/main.js`：樣板資料與名片渲染邏輯，目前不透過網路請求 API。
- **樣板資料**：內建 5 筆金屬加工產業名片，涵蓋必填與選填欄位。

### 2026-06-17（續 - Skill 安裝）

- **安裝全域 skill `ui-ux-pro-max`**：
  - Clone GitHub repo 至 `/Users/lgimmy405/Documents/Cline/MCP/ui-ux-pro-max`。
  - 安裝 `uipro-cli`（v2.2.3），發現該版本不支援 `--global` 選項。
  - 改為手動將 repo 內 `.claude/skills/ui-ux-pro-max/` 複製到 `~/.claude/skills/ui-ux-pro-max/`，實現全域可用。
  - 修正 skill 內 `data` 與 `scripts` 的 symlink，改為從 `src/ui-ux-pro-max/` 複製實際資料夾，避免路徑失效。
- **測試 skill**：執行 `search.py` 與設計系統生成功能均正常運作。

### 2026-06-17（續 - 單人名片 UI 完成品）

- **調整為單人名片完成品 UI**：依使用者指示，將原本多名片列表改為單張個人名片展示頁面。
  - `index.html`：更新註解、description 與副標，改為單張名片語意。
  - `assets/css/main.css`：主內容改為 flex 置中，名片容器最大寬度 560px。
  - `assets/css/card.css`：強化單張名片完成品視覺，加大姓名字級、調整聯絡資訊兩欄排版、加大服務標籤、強化陰影與懸停效果。
  - `assets/js/main.js`：移除多名片陣列，改為單一 `MOCK_CARD` 物件，並新增 `renderSingleCardPage()` 渲染單張名片。
- **不讀取 API**：頁面持續使用本地樣板資料，未串接 API。
- **後台表單未建立**：依指示暫不設計表單。

### 2026-06-17（續 - 運用 skill 重寫設計）

- **建立 PRODUCT.md**：透過 impeccable `init` 流程，確認專案定位為 brand（展示型名片頁面），並記錄使用者、目的、品牌個性（專業、穩重、精準）、反參考與設計原則。
- **建立 DESIGN.md**：使用 ui-ux-pro-max 產生設計系統，並參考 impeccable 的 palette 建議，採用 OKLCH 色彩空間，以深靛藍 `oklch(0.400 0.110 250.0)` 為主色、琥珀金 `oklch(0.650 0.140 80.0)` 為強調色。
- **重寫樣式檔案**：
  - `assets/css/main.css`：改用 OKLCH 變數、載入 Inter 字體、加入 `prefers-reduced-motion` 支援。
  - `assets/css/card.css`：以 OKLCH 變數重新定義名片視覺，強化完成品質感與無障礙焦點狀態。
  - `docs/03-ui-design.md`：同步更新為 OKLCH 色彩系統與單張名片規格。
  - `index.html`：新增 Google Fonts 預先連線。

---

## 開發原則備註

- 所有程式碼須待正式「開始開發」指令後才可生成。
- 禁止未經詢問修改既有文件。
- 所有 JS 方法須具備中文使用方式註解。
- 禁止重複撰寫可共用方法，須集中於 `assets/js/utils.js`。
