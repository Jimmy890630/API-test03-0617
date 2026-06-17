# 共用 JS 方法規格

> 本文件規劃可重複使用的 JavaScript 工具方法，未來實作時集中於 `assets/js/utils.js`。
> 目前僅做規格定義，尚未產生任何程式碼。

## 1. HTTP 請求工具

### `fetchCards(baseUrl)`

- **用途**：向 API 取得名片列表。
- **參數**：
  - `baseUrl`（string）：API 基底位址。
- **回傳**：Promise<Array<BusinessCard>>
- **使用範例**：

```js
fetchCards('http://localhost:3000/api')
  .then(cards => renderCards(cards))
  .catch(err => showError(err));
```

---

### `fetchCardById(baseUrl, id)`

- **用途**：向 API 取得單張名片資料。
- **參數**：
  - `baseUrl`（string）：API 基底位址。
  - `id`（string）：名片識別碼。
- **回傳**：Promise<BusinessCard>
- **使用範例**：

```js
fetchCardById('http://localhost:3000/api', 'card-001')
  .then(card => renderCardDetail(card));
```

---

## 2. 資料格式化工具

### `formatPhone(phone)`

- **用途**：格式化台灣電話號碼，例：0978-123-456、02-1234-5678。
- **參數**：
  - `phone`（string）：原始電話號碼。
- **回傳**：string
- **使用範例**：

```js
formatPhone('0912345678'); // "0912-345-678"
```

---

### `formatFax(fax)`

- **用途**：格式化傳真號碼，形式與電話相同。
- **參數**：
  - `fax`（string）：原始傳真號碼。
- **回傳**：string
- **使用範例**：

```js
formatFax('0212345678'); // "02-1234-5678"
```

---

### `formatTaxId(taxId)`

- **用途**：格式化公司統一編號，例：12345678 → 1234-5678。
- **參數**：
  - `taxId`（string）：原始統編。
- **回傳**：string
- **使用範例**：

```js
formatTaxId('12345678'); // "1234-5678"
```

---

## 3. 資料驗證工具

### `isValidEmail(email)`

- **用途**：驗證電子信箱格式。
- **參數**：
  - `email`（string）：待驗證信箱。
- **回傳**：boolean
- **使用範例**：

```js
isValidEmail('example@company.com'); // true
```

---

### `isValidPhone(phone)`

- **用途**：驗證台灣電話號碼格式（行動或市話）。
- **參數**：
  - `phone`（string）：待驗證電話。
- **回傳**：boolean
- **使用範例**：

```js
isValidPhone('0912345678'); // true
```

---

### `isValidTaxId(taxId)`

- **用途**：驗證公司統一編號是否為 8 位數字。
- **參數**：
  - `taxId`（string）：待驗證統編。
- **回傳**：boolean
- **使用範例**：

```js
isValidTaxId('12345678'); // true
```

---

## 4. DOM／渲染輔助工具

### `createElement(tag, options)`

- **用途**：簡化 DOM 元素建立，可同時設定 class、attribute、textContent。
- **參數**：
  - `tag`（string）：HTML 標籤名稱。
  - `options`（object）：包含 `className`、`attributes`、`textContent` 等屬性。
- **回傳**：HTMLElement
- **使用範例**：

```js
const div = createElement('div', {
  className: 'card',
  textContent: '名片內容'
});
```

---

### `renderServices(services, container)`

- **用途**：將服務項目陣列渲染為標籤元素並插入至指定容器。
- **參數**：
  - `services`（Array<string>）：服務項目文字陣列。
  - `container`（HTMLElement）：目標容器元素。
- **回傳**：void
- **使用範例**：

```js
renderServices(['CNC 加工', '雷射切割'], cardFooter);
```

---

## 5. 錯誤處理工具

### `handleError(error, fallbackMessage)`

- **用途**：統一處理 API 或程式錯誤，回傳友善訊息。
- **參數**：
  - `error`（Error | object）：錯誤物件。
  - `fallbackMessage`（string）：預設錯誤訊息。
- **回傳**：string
- **使用範例**：

```js
const message = handleError(err, '載入失敗，請稍後再試');
alert(message);
```

---

## 6. 注意事項

- 本文件為規劃文件，尚未產生實際程式碼。
- 開始開發後，所有方法須在 `assets/js/utils.js` 中實作，並以中文 JSDoc 風格註解說明參數與回傳值。
- 禁止在不同 JS 檔案中重複實作相同功能。
