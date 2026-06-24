/**
 * 金屬加工名片系統 - 名片資料更新頁邏輯
 * 檔案：assets/js/update.js
 * 用途：載入現有名片資料填入表單，並將修改後的資料送回 API 更新
 */

// ============================================
// 1. DOM 元素參考
// ============================================

const form = document.getElementById('cardForm');
const submitBtn = document.getElementById('submitBtn');
const messageEl = document.getElementById('formMessage');

/**
 * 載入時取得的原始名片資料
 * 用於比對哪些欄位有變更，更新時只傳送變更的欄位
 */
let originalCard = null;

const fields = {
  name: document.getElementById('name'),
  company: document.getElementById('company'),
  title: document.getElementById('title'),
  phone: document.getElementById('phone'),
  email: document.getElementById('email'),
  line_id: document.getElementById('line_id'),
  services: document.getElementById('services'),
  tax_id: document.getElementById('tax_id'),
  fax: document.getElementById('fax')
};

// ============================================
// 2. 畫面狀態提示
// ============================================

/**
 * 顯示表單訊息
 * @param {string} text - 訊息文字
 * @param {string} type - 訊息類型：success / error / info
 */
function showMessage(text, type = 'info') {
  messageEl.textContent = text;
  messageEl.className = `card-form__message card-form__message--${type}`;
}

/**
 * 清除表單訊息
 */
function clearMessage() {
  messageEl.textContent = '';
  messageEl.className = 'card-form__message';
}

/**
 * 設定表單是否處於處理中狀態
 * @param {boolean} isLoading - 是否載入/儲存中
 */
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  Object.values(fields).forEach((field) => {
    if (field) field.disabled = isLoading;
  });
}

// ============================================
// 3. 資料轉換
// ============================================

/**
 * 將服務項目字串轉換為陣列
 * 支援逗號、換行、頓號分隔
 * @param {string} text - 原始服務項目文字
 * @returns {string[]} 服務項目陣列
 */
function parseServices(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .split(/[,，、\n]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/**
 * 將服務項目陣列轉換為顯示文字
 * @param {string[]|string} services - 服務項目陣列或字串
 * @returns {string} 以逗號分隔的文字
 */
function formatServicesForInput(services) {
  if (!services) return '';
  if (Array.isArray(services)) return services.join(', ');
  if (typeof services === 'string') return services;
  return '';
}

/**
 * 比較兩個值是否相同
 * 用於判斷欄位是否有變更
 * @param {*} a - 原始值
 * @param {*} b - 新值
 * @returns {boolean} 相同回傳 true
 */
function isSameValue(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => item === b[index]);
  }
  return String(a || '') === String(b || '');
}

/**
 * 從表單收集名片資料
 * 只收集與原始資料不同的欄位，符合 docs/04-api-spec.md 5.2 節規範：
 * 「data 內只需傳入要修改的欄位，未傳入的欄位保留原值」
 * @returns {Object} 要更新的名片資料
 */
function collectFormData() {
  const data = {};

  if (!originalCard) {
    throw new Error('原始名片資料尚未載入，無法判斷哪些欄位有變更');
  }

  const newValues = {
    name: fields.name.value.trim(),
    company: fields.company.value.trim(),
    title: fields.title.value.trim(),
    phone: fields.phone.value.trim(),
    email: fields.email.value.trim(),
    line_id: fields.line_id.value.trim(),
    services: parseServices(fields.services.value),
    tax_id: fields.tax_id.value.trim(),
    fax: fields.fax.value.trim()
  };

  Object.entries(newValues).forEach(([key, value]) => {
    const originalValue = originalCard[key];

    // 若新值與原始值不同，則加入更新資料
    if (!isSameValue(originalValue, value)) {
      data[key] = value;
    }
  });

  return data;
}

// ============================================
// 4. 表單驗證
// ============================================

/**
 * 驗證表單資料
 * 只驗證「有變更」的欄位，避免未修改的欄位被誤判
 * @param {Object} data - 表單資料
 * @returns {string|null} 錯誤訊息，驗證通過則回傳 null
 */
function validateForm(data) {
  if ('name' in data && !data.name) return '姓名不可空白';
  if ('company' in data && !data.company) return '公司名稱不可空白';
  if ('phone' in data && !data.phone) return '電話不可空白';
  if ('phone' in data && !isValidPhone(data.phone)) return '電話格式不正確';
  if ('email' in data && !data.email) return '電子信箱不可空白';
  if ('email' in data && !isValidEmail(data.email)) return '電子信箱格式不正確';
  if ('services' in data && (!data.services || data.services.length === 0)) return '服務項目不可空白';
  if ('tax_id' in data && data.tax_id && !/^\d{8}$/.test(data.tax_id)) return '統一編號須為 8 位數字';
  return null;
}

// ============================================
// 5. 載入與儲存
// ============================================

/**
 * 載入現有名片資料並填入表單
 * @returns {Promise<void>}
 */
async function loadCardData() {
  setLoading(true);
  showMessage('正在載入名片資料...', 'info');

  try {
    const config = await loadApiConfig('assets/config/api.json');
    const response = await callApi(config.apiUrl, 'get', {}, 10000);

    // 支援標準 API 格式 { status, data } 與扁平格式
    let card = null;
    if (response && response.status === 'success' && response.data) {
      card = response.data;
    } else if (response && typeof response.name === 'string') {
      card = response;
    }

    if (!card) {
      throw new Error('API 回應中找不到名片資料');
    }

    fields.name.value = card.name || '';
    fields.company.value = card.company || '';
    fields.title.value = card.title || '';
    fields.phone.value = card.phone || '';
    fields.email.value = card.email || '';
    fields.line_id.value = card.line_id || '';
    fields.services.value = formatServicesForInput(card.services);
    fields.tax_id.value = card.tax_id || '';
    fields.fax.value = card.fax || '';

    // 保存原始資料，供 collectFormData 比對變更
    originalCard = {
      name: card.name || '',
      company: card.company || '',
      title: card.title || '',
      phone: card.phone || '',
      email: card.email || '',
      line_id: card.line_id || '',
      services: Array.isArray(card.services) ? [...card.services] : (card.services ? [card.services] : []),
      tax_id: card.tax_id || '',
      fax: card.fax || ''
    };

    clearMessage();
  } catch (error) {
    console.error('載入名片資料失敗：', handleError(error));
    showMessage(`載入失敗：${handleError(error, '無法取得名片資料')}`, 'error');
  } finally {
    setLoading(false);
  }
}

/**
 * 儲存更新後的名片資料
 * @returns {Promise<void>}
 */
async function saveCardData() {
  clearMessage();

  const data = collectFormData();
  const error = validateForm(data);
  if (error) {
    showMessage(error, 'error');
    return;
  }

  setLoading(true);
  showMessage('正在儲存...', 'info');

  try {
    const config = await loadApiConfig('assets/config/api.json');
    const response = await callApi(config.apiUrl, 'update', data, 10000);

    if (response && response.status === 'success') {
      showMessage(response.message || '更新成功', 'success');
    } else {
      throw new Error((response && response.message) || '更新失敗');
    }
  } catch (error) {
    console.error('儲存名片資料失敗：', handleError(error));
    showMessage(`儲存失敗：${handleError(error, '請稍後再試')}`, 'error');
  } finally {
    setLoading(false);
  }
}

// ============================================
// 6. 事件綁定與初始化
// ============================================

form.addEventListener('submit', (event) => {
  event.preventDefault();
  saveCardData();
});

document.addEventListener('DOMContentLoaded', loadCardData);
