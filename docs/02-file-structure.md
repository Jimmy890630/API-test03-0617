# 檔案關係文件

## 1. 目錄結構

```
API test03-0617/
├── index.html              # 入口頁：展示所有名片或搜尋頁面（視需求決定）
├── card.html               # 單張名片展示頁（選用，視需求決定是否建立）
├── assets/
│   ├── css/
│   │   ├── main.css        # 全站共用基礎樣式（Reset、Variables、Layout）
│   │   └── card.css        # 名片元件專用樣式
│   ├── js/
│   │   ├── main.js         # 頁面主要邏輯：初始化、事件綁定、資料渲染
│   │   └── utils.js        # 共用工具方法：格式化、驗證、輔助函式
│   ├── images/             # 圖片資源（公司 LOGO、背景圖等）
│   └── fonts/              # 自訂字型檔案（若需要）
└── docs/
    ├── 01-requirements.md  # 需求規格書
    ├── 02-file-structure.md # 本文件：檔案關係說明
    ├── 03-ui-design.md     # UI / 樣式設計文件
    ├── 04-api-spec.md      # API 規格文件
    ├── 05-dev-log.md       # 開發 log
    └── 06-reusable-utils.md # 共用 JS 方法規格
```

## 2. 檔案職責與關聯

### HTML 檔案

| 檔案 | 職責 | 相依 CSS | 相依 JS |
|------|------|---------|---------|
| `index.html` | 網站入口，負責名片列表或搜尋介面 | `main.css`、`card.css` | `main.js`、`utils.js` |
| `card.html` | 單張名片詳細展示（可選） | `main.css`、`card.css` | `main.js`、`utils.js` |

### CSS 檔案

| 檔案 | 職責 | 被誰引用 |
|------|------|---------|
| `assets/css/main.css` | 定義全站樣式變數、Reset、版面網格、通用元件 | `index.html`、`card.html` |
| `assets/css/card.css` | 定義名片卡片的專屬樣式，保持獨立以便日後複用 | `index.html`、`card.html` |

### JS 檔案

| 檔案 | 職責 | 被誰引用 |
|------|------|---------|
| `assets/js/utils.js` | 提供可重複使用的工具函式，所有頁面共用 | `main.js`（透過模組或全域方式載入） |
| `assets/js/main.js` | 初始化頁面、綁定事件、串接 API、渲染資料 | `index.html`、`card.html` |

## 3. 前端載入順序

```
index.html / card.html
    ↓
載入 assets/css/main.css
    ↓
載入 assets/css/card.css
    ↓
載入 assets/js/utils.js   （優先載入，確保工具函式可用）
    ↓
載入 assets/js/main.js    （最後載入，使用 utils 與 DOM 操作）
```

## 4. 資料流規劃

1. `index.html` 初始化時，`main.js` 呼叫 `utils.js` 中的 HTTP 工具取得名片資料。
2. 資料經 `utils.js` 格式化後，由 `main.js` 渲染至頁面中的名片容器。
3. 使用者互動（如搜尋、展開詳細資訊）由 `main.js` 處理，並再次使用 `utils.js` 工具。

## 5. 注意事項

- 本文件為規劃文件，尚未產生實際程式碼。
- 開始開發後，應根據實際需求調整是否建立 `card.html`。
- 所有 JS 方法須具備中文使用說明註解。
