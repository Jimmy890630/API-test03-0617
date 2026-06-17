/**
 * 金屬加工名片系統 - 頁面主要邏輯
 * 檔案：assets/js/main.js
 * 用途：載入樣板資料、渲染名片卡片、處理使用者互動
 */

// ============================================
// 1. 樣板資料：模擬伺服器回傳的名片資料
// ============================================

/**
 * 樣板名片資料陣列
 * 欄位定義請參考 docs/01-requirements.md 與 docs/04-api-spec.md
 */
const MOCK_CARDS = [
  {
    card_id: 'card-001',
    name: '王小明',
    company: '金鋒金屬加工有限公司',
    title: '業務經理',
    phone: '0912345678',
    email: 'ming@jingfeng.tw',
    line_id: 'jingfeng_ming',
    services: ['CNC 加工', '雷射切割', '焊接組裝'],
    tax_id: '12345678',
    fax: '0212345678'
  },
  {
    card_id: 'card-002',
    name: '陳雅芳',
    company: '鋼藝精密工業',
    title: '業務代表',
    phone: '0928765432',
    email: 'yafang@gangyi.tw',
    line_id: 'gangyi_yafang',
    services: ['金屬沖壓', '表面處理'],
    tax_id: '87654321',
    fax: ''
  },
  {
    card_id: 'card-003',
    name: '李志豪',
    company: '銳捷切削科技',
    title: '總經理',
    phone: '0933567890',
    email: 'howard@ruijie.tw',
    line_id: 'ruijie_howard',
    services: ['車床加工', '銑床加工', '模具開發'],
    tax_id: '24681357',
    fax: '0323456789'
  },
  {
    card_id: 'card-004',
    name: '張立婷',
    company: '鐵信機械工程',
    title: '專案管理師',
    phone: '0911223344',
    email: 'liting@tiexin.tw',
    line_id: 'tiexin_liting',
    services: ['機械組裝', '設備維修'],
    tax_id: '13579246',
    fax: ''
  },
  {
    card_id: 'card-005',
    name: '黃國棟',
    company: '鑫源金屬科技有限公司',
    title: '業務副理',
    phone: '0955889966',
    email: 'guodong@sinyuan.tw',
    line_id: 'sinyuan_guodong',
    services: ['鋁擠型加工', '陽極處理', '精密研磨'],
    tax_id: '36925814',
    fax: '0423456789'
  }
];

// ============================================
// 2. 名片渲染函式
// ============================================

/**
 * 建立單個聯絡資訊項目
 * @param {string} href - 連結網址，若無連結則傳入空字串
 * @param {string} iconSvg - SVG 圖示字串
 * @param {string} text - 顯示文字
 * @returns {HTMLLIElement} 聯絡資訊 li 元素
 */
function createContactItem(href, iconSvg, text) {
  const item = createElement('li', {
    className: 'business-card__contact-item'
  });

  // 插入圖示
  const iconWrapper = createElement('span', {
    className: 'business-card__contact-icon'
  });
  iconWrapper.innerHTML = iconSvg;
  item.appendChild(iconWrapper);

  // 有連結時顯示為 a，無連結時顯示為 span
  if (href) {
    const link = createElement('a', {
      className: 'business-card__contact-link',
      attributes: { href: href, target: '_blank', rel: 'noopener noreferrer' },
      textContent: text
    });
    item.appendChild(link);
  } else {
    const span = createElement('span', { textContent: text });
    item.appendChild(span);
  }

  return item;
}

/**
 * 渲染單張名片卡片
 * @param {Object} card - 名片資料物件
 * @returns {HTMLElement} 渲染完成的名片卡片元素
 */
function renderCard(card) {
  // 建立卡片容器
  const cardElement = createElement('article', {
    className: 'business-card',
    attributes: { 'data-card-id': card.card_id || '' }
  });

  // 頂部：公司名稱與職稱
  const header = createElement('header', { className: 'business-card__header' });
  const company = createElement('h2', {
    className: 'business-card__company',
    textContent: card.company || ''
  });
  const title = createElement('p', {
    className: 'business-card__title',
    textContent: card.title || ''
  });
  header.appendChild(company);
  header.appendChild(title);
  cardElement.appendChild(header);

  // 主體：姓名
  const body = createElement('div', { className: 'business-card__body' });
  const name = createElement('h3', {
    className: 'business-card__name',
    textContent: card.name || ''
  });
  body.appendChild(name);

  // 聯絡資訊列表
  const contactList = createElement('ul', { className: 'business-card__contact-list' });

  // 電話圖示：簡約電話 icon
  const phoneIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
  contactList.appendChild(
    createContactItem(
      card.phone ? `tel:${card.phone}` : '',
      phoneIcon,
      formatPhone(card.phone) || '未提供電話'
    )
  );

  // 信箱圖示
  const emailIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>';
  contactList.appendChild(
    createContactItem(
      card.email ? `mailto:${card.email}` : '',
      emailIcon,
      card.email || '未提供信箱'
    )
  );

  // LINE ID 圖示：使用對話氣泡
  const lineIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  const lineText = card.line_id ? `LINE：${card.line_id}` : '未提供 LINE ID';
  contactList.appendChild(createContactItem('', lineIcon, lineText));

  body.appendChild(contactList);
  cardElement.appendChild(body);

  // 底部：服務標籤與輔助資訊
  const footer = createElement('div', { className: 'business-card__footer' });
  const servicesContainer = createElement('div', { className: 'business-card__services' });
  if (Array.isArray(card.services) && card.services.length > 0) {
    renderServices(card.services, servicesContainer);
  }
  footer.appendChild(servicesContainer);

  const meta = createElement('div', { className: 'business-card__meta' });
  if (card.tax_id) {
    const tax = createElement('span', {
      textContent: `統編：${formatTaxId(card.tax_id)}`
    });
    meta.appendChild(tax);
  }
  if (card.fax) {
    const fax = createElement('span', {
      textContent: `傳真：${formatFax(card.fax)}`
    });
    meta.appendChild(fax);
  }
  footer.appendChild(meta);
  cardElement.appendChild(footer);

  return cardElement;
}

/**
 * 渲染多張名片到指定容器
 * @param {Object[]} cards - 名片資料陣列
 * @param {HTMLElement} container - 渲染目標容器
 * @returns {void}
 */
function renderCards(cards, container) {
  if (!container) return;

  // 清空容器現有內容
  container.innerHTML = '';

  // 若無資料，顯示提示訊息
  if (!Array.isArray(cards) || cards.length === 0) {
    const empty = createElement('p', {
      className: 'card-grid__empty',
      textContent: '目前沒有名片資料'
    });
    container.appendChild(empty);
    return;
  }

  // 逐一渲染每張名片
  cards.forEach((card) => {
    try {
      const cardElement = renderCard(card);
      container.appendChild(cardElement);
    } catch (error) {
      console.error('渲染名片時發生錯誤：', handleError(error));
    }
  });
}

// ============================================
// 3. 頁面初始化
// ============================================

/**
 * 初始化頁面：取得樣板資料並渲染名片列表
 * @returns {void}
 */
function init() {
  const container = document.getElementById('cardContainer');

  if (!container) {
    console.error('找不到名片容器元素 #cardContainer');
    return;
  }

  // 使用本地樣板資料直接渲染，不發送 API 請求
  renderCards(MOCK_CARDS, container);
}

// 等待 DOM 載入完成後初始化
document.addEventListener('DOMContentLoaded', init);
