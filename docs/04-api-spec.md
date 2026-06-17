# API 規格文件

> 本文件定義個人名片系統前後端溝通的 JSON 資料格式。個人名片只會有一筆資料預先建立於資料庫，前端透過 API 讀取與更新這筆資料，不提供新增、刪除或搜尋功能。
> JSON 結構嚴格控制在兩層以內，確保前後端解析與維護的簡潔性。

---

## 1. 通訊規範

| 項目 | 規格 |
|------|------|
| HTTP 方法 | 僅使用 `POST` |
| Content-Type | `application/json; charset=utf-8` |
| 資料交換格式 | JSON，層數最多兩層 |
| 編碼 | UTF-8 |
| 開發用 API 位址 | `http://localhost:3000/api/card` |

---

## 2. 通用請求格式

所有請求統一以下列 JSON 結構送出，透過 `action` 告知後端要執行的動作，`data` 內放置該動作所需的參數。

```json
{
  "action": "string",
  "data": {}
}
```

### 請求欄位說明

| 欄位 | 型別 | 必填 | 說明 |
|------|------|:----:|------|
| `action` | string | 是 | 動作名稱，僅允许：`get`、`update` |
| `data` | object | 是 | 該動作所需的資料物件，內容依動作而定 |

---

## 3. 通用回應格式

後端統一以下列 JSON 結構回應，`status` 表示處理結果，`message` 提供可讀訊息，`data` 放置回傳資料。

```json
{
  "status": "success",
  "message": "string",
  "data": {}
}
```

### 回應欄位說明

| 欄位 | 型別 | 必填 | 說明 |
|------|------|:----:|------|
| `status` | string | 是 | `success` 表示成功，`error` 表示失敗 |
| `message` | string | 是 | 處理結果說明，例如「取得成功」、「儲存失敗：姓名不可空白」 |
| `data` | object | 否 | 回傳資料，成功時依動作回傳名片物件或空物件，失敗時可為空物件 |

---

## 4. 名片資料欄位對照表

以下為名片資料的欄位定義，前後端交換資料時均使用這些欄位名稱。個人名片系統只有一筆資料，因此不須 `card_id`、建立時間或修改時間。

| 欄位名稱 | 型別 | 必填 | 說明 |
|---------|------|:----:|------|
| `name` | string | 是 | 姓名 |
| `company` | string | 是 | 服務單位 / 公司名稱 |
| `title` | string | 否 | 職稱 |
| `phone` | string | 是 | 連絡電話 |
| `email` | string | 是 | 電子信箱 |
| `line_id` | string | 否 | LINE ID |
| `services` | array<string> | 是 | 服務項目清單，例如 `["CNC 加工", "雷射切割"]` |
| `tax_id` | string | 否 | 公司統一編號 |
| `fax` | string | 否 | 傳真號碼 |

---

## 5. 各動作請求與回應範例

### 5.1 取得名片資料（`action: "get"`）

用途：讀取資料庫中預先建立的唯一一筆個人名片資料。

#### 請求

```json
{
  "action": "get",
  "data": {}
}
```

#### 成功回應

```json
{
  "status": "success",
  "message": "取得成功",
  "data": {
    "name": "王小明",
    "company": "金鋒金屬加工有限公司",
    "title": "業務經理",
    "phone": "0912345678",
    "email": "ming@jingfeng.tw",
    "line_id": "jingfeng_ming",
    "services": ["CNC 加工", "雷射切割", "焊接組裝", "金屬表面處理"],
    "tax_id": "12345678",
    "fax": "0212345678"
  }
}
```

#### 失敗回應

```json
{
  "status": "error",
  "message": "查詢失敗：名片資料不存在",
  "data": {}
}
```

---

### 5.2 更新名片資料（`action: "update"`）

用途：更新資料庫中唯一一筆個人名片資料。`data` 內只需傳入要修改的欄位，未傳入的欄位保留原值。

#### 請求

```json
{
  "action": "update",
  "data": {
    "title": "資深業務經理",
    "email": "ming_new@jingfeng.tw"
  }
}
```

#### 成功回應

```json
{
  "status": "success",
  "message": "更新成功",
  "data": {}
}
```

#### 失敗回應

```json
{
  "status": "error",
  "message": "更新失敗：資料格式錯誤",
  "data": {}
}
```

---

## 6. 動作彙總表

| 動作 | `action` 值 | 用途 |
|------|------------|------|
| 取得 | `get` | 取得資料庫中唯一一筆個人名片資料 |
| 更新 | `update` | 更新資料庫中唯一一筆個人名片資料 |

---

## 7. 儲存成功 / 失敗統一處理方式

前端在收到回應後，一律先檢查 `status` 欄位：

- 若 `status === "success"`：視為儲存成功，後續依 `message` 顯示提示，需要時讀取 `data` 更新畫面。
- 若 `status === "error"`：視為儲存失敗，依 `message` 顯示錯誤訊息。

### 成功範例

```json
{
  "status": "success",
  "message": "更新成功",
  "data": {}
}
```

### 失敗範例

```json
{
  "status": "error",
  "message": "更新失敗：電子信箱格式不正確",
  "data": {}
}
```

---

## 8. JSON 層級規範檢核

為確保結構不超過兩層，所有資料禁止出現下列形式：

```json
{
  "data": {
    "card": {
      "info": { ... }   // 第三層，禁止
    }
  }
}
```

正確形式應將名片欄位直接放在 `data` 下：

```json
{
  "status": "success",
  "message": "取得成功",
  "data": {
    "name": "王小明",
    "company": "金鋒金屬加工有限公司",
    "services": ["CNC 加工"]
  }
}
```

---

## 9. 前端串接原則

1. HTTP 請求統一由 `assets/js/utils.js` 中的工具方法處理，禁止重複撰寫請求程式碼。
2. API 基底位址集中管理，開發時預設 `http://localhost:3000/api/card`，正式環境可透過設定檔切換。
3. 所有請求與回應須經過錯誤處理，錯誤訊息以後端回傳的 `message` 為主。
4. `data` 內的資料欄位使用前應先確認是否存在，避免欄位缺失造成畫面錯誤。
5. 個人名片只有一筆資料，前端不須也不應提供新增、刪除或搜尋功能。

---

## 10. 待後端確認項目

- [ ] API 基底位址是否為 `/api/card`
- [ ] 是否需認證機制（如 Token）
- [ ] CORS 是否允許前端本地開發

---

## 11. 注意事項

- 本文件為規劃文件，尚未產生實際程式碼。
- 開始開發後，若 API 尚未就緒，前端可先使用本地 Mock 資料配合此格式進行介面開發。
- 所有 API 相關 JS 方法須具備中文使用說明註解。
- 個人名片不須 `card_id`、`created_at`、`updated_at` 等欄位，前後端交換資料時請勿包含這些欄位。
