/**
 * 金屬加工名片系統 - 頁面主要邏輯
 * 檔案：assets/js/main.js
 * 用途：載入樣板資料、渲染名片卡片、處理使用者互動
 */

// ============================================
// 1. 樣板資料：模擬伺服器回傳的名片資料
// ============================================

/**
 * 單一個人名片樣板資料
 * 此資料模擬後端資料庫中預先建立的唯一一筆個人名片
 * 欄位定義請參考 docs/01-requirements.md 與 docs/04-api-spec.md
 * 個人名片系統不會有 card_id、created_at、updated_at 等欄位
 */
const MOCK_CARD = {
  name: '王小明',
  company: '金鋒金屬加工有限公司',
  title: '業務經理',
  phone: '0912345678',
  email: 'ming@jingfeng.tw',
  line_id: 'jingfeng_ming',
  services: ['CNC 加工', '雷射切割', '焊接組裝', '金屬表面處理'],
  tax_id: '12345678',
  fax: '0212345678'
};

// ============================================
// 2. SVG 圖示定義
// ============================================

const ICONS = {
  phone: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
  email: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>',
  line: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
  download: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
  share: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>'
};

// ============================================
// 3. 名片渲染函式
// ============================================

/**
 * 建立單個聯絡資訊項目
 * @param {Object} options - 設定物件
 * @param {string} options.href - 連結網址，若無連結則傳入空字串
 * @param {string} options.iconSvg - SVG 圖示字串
 * @param {string} options.label - 欄位標籤，例如「電話」
 * @param {string} options.value - 顯示文字
 * @param {boolean} [options.wide=false] - 是否在大螢幕佔滿整列
 * @returns {HTMLLIElement} 聯絡資訊 li 元素
 */
function createContactItem({ href, iconSvg, label, value, wide = false }) {
  const item = createElement('li', {
    className: `business-card__contact-item${wide ? ' business-card__contact-item--wide' : ''}`
  });

  const iconWrapper = createElement('span', {
    className: 'business-card__contact-icon'
  });
  iconWrapper.innerHTML = iconSvg;
  item.appendChild(iconWrapper);

  const info = createElement('div', { className: 'business-card__contact-info' });

  const labelEl = createElement('span', {
    className: 'business-card__contact-label',
    textContent: label
  });
  info.appendChild(labelEl);

  const valueEl = href
    ? createElement('a', {
        className: 'business-card__contact-value',
        attributes: { href, target: '_blank', rel: 'noopener noreferrer' },
        textContent: value
      })
    : createElement('span', {
        className: 'business-card__contact-value',
        textContent: value
      });
  info.appendChild(valueEl);

  item.appendChild(info);
  return item;
}

/**
 * 渲染單張名片卡片
 * @param {Object} card - 名片資料物件
 * @returns {HTMLElement} 渲染完成的名片卡片元素
 */
function renderCard(card) {
  const safeCard = card || {};
  const name = safeCard.name || '未提供姓名';
  const company = safeCard.company || '未提供公司';
  const title = safeCard.title || '';

  const cardElement = createElement('article', {
    className: 'business-card business-card--animate',
    attributes: {
      'aria-labelledby': 'cardName cardCompany'
    }
  });

  // 頂部：公司名稱與職稱
  const header = createElement('header', { className: 'business-card__header' });
  const companyGroup = createElement('div', { className: 'business-card__company-group' });
  const companyEl = createElement('h2', {
    id: 'cardCompany',
    className: 'business-card__company',
    textContent: company
  });
  companyGroup.appendChild(companyEl);

  if (title) {
    const titleEl = createElement('p', {
      className: 'business-card__title',
      textContent: title
    });
    companyGroup.appendChild(titleEl);
  }

  header.appendChild(companyGroup);
  cardElement.appendChild(header);

  // 主體：姓名與聯絡資訊
  const body = createElement('div', { className: 'business-card__body' });
  const nameEl = createElement('h1', {
    id: 'cardName',
    className: 'business-card__name',
    textContent: name
  });
  body.appendChild(nameEl);

  const roleNote = createElement('p', {
    className: 'business-card__role-note',
    textContent: '如有任何金屬加工需求，歡迎直接聯繫'
  });
  body.appendChild(roleNote);

  const contactList = createElement('ul', { className: 'business-card__contact-list' });

  if (safeCard.phone) {
    contactList.appendChild(
      createContactItem({
        href: `tel:${safeCard.phone}`,
        iconSvg: ICONS.phone,
        label: '電話',
        value: formatPhone(safeCard.phone),
        wide: false
      })
    );
  }

  if (safeCard.email) {
    contactList.appendChild(
      createContactItem({
        href: `mailto:${safeCard.email}`,
        iconSvg: ICONS.email,
        label: '電子信箱',
        value: safeCard.email,
        wide: true
      })
    );
  }

  if (safeCard.line_id) {
    contactList.appendChild(
      createContactItem({
        href: '',
        iconSvg: ICONS.line,
        label: 'LINE ID',
        value: safeCard.line_id,
        wide: false
      })
    );
  }

  body.appendChild(contactList);
  cardElement.appendChild(body);

  // 底部：服務標籤、輔助資訊與行動按鈕
  const footer = createElement('div', { className: 'business-card__footer' });

  const servicesContainer = createElement('div', {
    className: 'business-card__services',
    attributes: { 'aria-label': '服務項目' }
  });
  if (Array.isArray(safeCard.services) && safeCard.services.length > 0) {
    renderServices(safeCard.services, servicesContainer);
  }
  footer.appendChild(servicesContainer);

  const meta = createElement('div', { className: 'business-card__meta' });

  if (safeCard.tax_id) {
    const tax = createElement('span', {
      className: 'business-card__meta-item',
      attributes: { 'aria-label': `統一編號 ${formatTaxId(safeCard.tax_id)}` }
    });
    tax.innerHTML = `<span class="business-card__meta-label">統編</span>${formatTaxId(safeCard.tax_id)}`;
    meta.appendChild(tax);
  }

  if (safeCard.fax) {
    const fax = createElement('span', {
      className: 'business-card__meta-item',
      attributes: { 'aria-label': `傳真 ${formatFax(safeCard.fax)}` }
    });
    fax.innerHTML = `<span class="business-card__meta-label">傳真</span>${formatFax(safeCard.fax)}`;
    meta.appendChild(fax);
  }

  footer.appendChild(meta);

  const actions = createElement('div', { className: 'business-card__actions' });

  const saveButton = createElement('button', {
    className: 'business-card__action business-card__action--primary',
    attributes: { type: 'button' },
    textContent: '儲存聯絡人'
  });
  saveButton.insertAdjacentHTML('afterbegin', ICONS.download);
  saveButton.addEventListener('click', () => {
    try {
      const success = downloadVCard(safeCard, `${safeCard.name}_名片`);
      if (!success) {
        window.alert('無法產生聯絡人檔案，請確認名片資料完整。');
      }
    } catch (error) {
      console.error('下載 vCard 失敗：', handleError(error));
      window.alert('下載失敗，請稍後再試。');
    }
  });
  actions.appendChild(saveButton);

  const shareButton = createElement('button', {
    className: 'business-card__action business-card__action--secondary',
    attributes: { type: 'button' },
    textContent: '分享名片'
  });
  shareButton.insertAdjacentHTML('afterbegin', ICONS.share);
  shareButton.addEventListener('click', async () => {
    try {
      const shareText = `${name} - ${company}${title ? ` (${title})` : ''}\n電話：${formatPhone(safeCard.phone) || '未提供'}`;
      if (navigator.share) {
        await navigator.share({
          title: `${name} 數位名片`,
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        window.alert('名片連結與資訊已複製到剪貼簿');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('分享名片失敗：', handleError(error));
      }
    }
  });
  actions.appendChild(shareButton);

  footer.appendChild(actions);
  cardElement.appendChild(footer);

  return cardElement;
}

/**
 * 渲染錯誤提示
 * @param {string} message - 錯誤訊息
 * @returns {HTMLElement} 錯誤提示元素
 */
function renderError(message) {
  const errorEl = createElement('div', {
    className: 'business-card business-card--error',
    attributes: { role: 'alert' }
  });
  errorEl.innerHTML = `<strong>名片載入失敗</strong>${escapeHtml(message)}`;
  return errorEl;
}

/**
 * 將特殊字元轉為 HTML 實體，避免 XSS
 * @param {string} text - 原始文字
 * @returns {string} 轉義後文字
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 渲染單張個人名片頁面
 * 清空名片容器並將單一名片資料渲染為完成品名片
 * @param {Object} [card] - 要渲染的名片資料，未提供則使用 MOCK_CARD
 * @returns {void}
 */
function renderCardPage(card) {
  const container = document.getElementById('cardContainer');

  if (!container) {
    console.error('找不到名片容器元素 #cardContainer');
    return;
  }

  container.innerHTML = '';

  try {
    const cardElement = renderCard(card || MOCK_CARD);
    container.appendChild(cardElement);
  } catch (error) {
    console.error('渲染名片時發生錯誤：', handleError(error));
    container.appendChild(renderError(handleError(error, '無法顯示名片，請重新整理頁面。')));
  }
}

// ============================================
// 4. 頁面初始化
// ============================================

/**
 * 初始化頁面：先嘗試從 API 讀取名片資料，失敗時使用本地 Mock 資料
 * @returns {Promise<void>}
 */
async function init() {
  try {
    const config = await loadApiConfig('assets/config/api.json');
    const response = await callApi(config.apiUrl, 'get', {});

    if (response.status === 'success' && response.data) {
      const apiCard = response.data;
      renderCardPage(apiCard);
      return;
    }

    console.warn('API 回應狀態非 success，改用本地 Mock 資料');
    renderCardPage(MOCK_CARD);
  } catch (error) {
    console.warn('從 API 載入名片失敗，改用本地 Mock 資料：', handleError(error));
    renderCardPage(MOCK_CARD);
  }
}

// 等待 DOM 載入完成後初始化
document.addEventListener('DOMContentLoaded', init);
