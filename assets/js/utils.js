/**
 * 金屬加工名片系統 - 共用工具函式
 * 檔案：assets/js/utils.js
 * 用途：提供格式化、驗證、DOM 輔助、錯誤處理與 vCard 匯出等可重複使用方法
 */

/**
 * 建立 DOM 元素並設定屬性
 * @param {string} tag - HTML 標籤名稱，例如 "div"、"span"
 * @param {Object} options - 設定物件，可包含 className、textContent、attributes
 * @returns {HTMLElement} 建立完成的 DOM 元素
 * @example
 * const el = createElement('div', {
 *   className: 'card',
 *   textContent: '名片內容',
 *   attributes: { 'data-id': '001' }
 * });
 */
function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.textContent !== undefined && options.textContent !== null) {
    element.textContent = options.textContent;
  }

  if (options.attributes && typeof options.attributes === 'object') {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element;
}

/**
 * 格式化台灣電話號碼
 * 行動電話：09xx-xxx-xxx；市話：0x-xxxx-xxxx
 * @param {string} phone - 原始電話號碼
 * @returns {string} 格式化後的電話號碼，若無法格式化則回傳原始值
 * @example
 * formatPhone('0912345678'); // "0912-345-678"
 * formatPhone('0212345678'); // "02-1234-5678"
 */
function formatPhone(phone) {
  if (!phone || typeof phone !== 'string') return '';

  const digits = phone.replace(/\D/g, '');

  if (/^09\d{8}$/.test(digits)) {
    return digits.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1-$2-$3');
  }

  if (/^0\d{8,9}$/.test(digits)) {
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
  }

  return phone;
}

/**
 * 格式化傳真號碼
 * 規則與市話相同，直接複用 formatPhone
 * @param {string} fax - 原始傳真號碼
 * @returns {string} 格式化後的傳真號碼
 * @example
 * formatFax('0212345678'); // "02-1234-5678"
 */
function formatFax(fax) {
  return formatPhone(fax);
}

/**
 * 格式化公司統一編號
 * @param {string} taxId - 原始統編，應為 8 位數字
 * @returns {string} 格式化後的統編，例如 "1234-5678"
 * @example
 * formatTaxId('12345678'); // "1234-5678"
 */
function formatTaxId(taxId) {
  if (!taxId || typeof taxId !== 'string') return '';
  const digits = taxId.replace(/\D/g, '');
  if (digits.length !== 8) return taxId;
  return digits.replace(/^(\d{4})(\d{4})$/, '$1-$2');
}

/**
 * 將服務項目陣列渲染為標籤元素
 * @param {string[]} services - 服務項目文字陣列
 * @param {HTMLElement} container - 要插入標籤的父容器
 * @returns {void}
 * @example
 * renderServices(['CNC 加工', '雷射切割'], servicesContainer);
 */
function renderServices(services, container) {
  if (!Array.isArray(services) || !container) return;

  services.forEach((service) => {
    const tag = createElement('span', {
      className: 'business-card__service-tag',
      textContent: service
    });
    container.appendChild(tag);
  });
}

/**
 * 統一錯誤處理，回傳友善的錯誤訊息
 * @param {Error|Object|string} error - 錯誤物件或文字
 * @param {string} fallbackMessage - 預設錯誤訊息
 * @returns {string} 錯誤訊息
 * @example
 * const msg = handleError(err, '載入失敗');
 */
function handleError(error, fallbackMessage = '發生錯誤，請稍後再試') {
  if (!error) return fallbackMessage;

  if (typeof error === 'string') return error;

  if (error.message && typeof error.message === 'string') {
    return error.message;
  }

  return fallbackMessage;
}

/**
 * 驗證電子信箱格式
 * @param {string} email - 待驗證信箱
 * @returns {boolean} 格式正確回傳 true，否則 false
 * @example
 * isValidEmail('test@example.com'); // true
 */
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(String(email || '').trim());
}

/**
 * 驗證台灣電話或傳真格式（行動或市話）
 * @param {string} phone - 待驗證號碼
 * @returns {boolean} 格式正確回傳 true，否則 false
 * @example
 * isValidPhone('0912345678'); // true
 */
function isValidPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return /^(09\d{8}|0\d{8,9})$/.test(digits);
}

/**
 * 將名片物件轉換為 vCard 3.0 文字內容
 * @param {Object} card - 名片資料物件
 * @param {string} card.name - 姓名
 * @param {string} card.company - 公司名稱
 * @param {string} [card.title] - 職稱
 * @param {string} [card.phone] - 電話
 * @param {string} [card.email] - 信箱
 * @param {string} [card.line_id] - LINE ID
 * @param {string[]} [card.services] - 服務項目
 * @param {string} [card.tax_id] - 統編
 * @param {string} [card.fax] - 傳真
 * @returns {string} vCard 文字內容
 */
function createVCardString(card) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:;${escapeVCardValue(card.name)};;;`,
    `FN:${escapeVCardValue(card.name)}`
  ];

  if (card.company) {
    lines.push(`ORG:${escapeVCardValue(card.company)}`);
  }

  if (card.title) {
    lines.push(`TITLE:${escapeVCardValue(card.title)}`);
  }

  if (card.phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${escapeVCardValue(card.phone)}`);
  }

  if (card.fax) {
    lines.push(`TEL;TYPE=FAX:${escapeVCardValue(card.fax)}`);
  }

  if (card.email) {
    lines.push(`EMAIL;TYPE=WORK:${escapeVCardValue(card.email)}`);
  }

  const notes = [];
  if (card.line_id) notes.push(`LINE ID：${card.line_id}`);
  if (Array.isArray(card.services) && card.services.length > 0) {
    notes.push(`服務項目：${card.services.join('、')}`);
  }
  if (card.tax_id) notes.push(`統編：${formatTaxId(card.tax_id)}`);

  if (notes.length > 0) {
    lines.push(`NOTE:${escapeVCardValue(notes.join('\\n'))}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * 轉義 vCard 特殊字元
 * @param {string} value - 原始文字
 * @returns {string} 轉義後文字
 */
function escapeVCardValue(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/**
 * 觸發下載 vCard 檔案
 * @param {Object} card - 名片資料物件
 * @param {string} [filename] - 檔案名稱
 * @returns {boolean} 下載是否成功觸發
 */
function downloadVCard(card, filename) {
  if (!card || !card.name) return false;

  const vCardString = createVCardString(card);
  const blob = new Blob([vCardString], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const safeName = String(filename || `${card.name} 名片`).replace(/\s+/g, '_');

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${safeName}.vcf`;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();

  // 清理資源
  requestAnimationFrame(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  });

  return true;
}
