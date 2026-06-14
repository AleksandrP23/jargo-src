const DISCLAIMER_PARAGRAPHS = [
  'Данный подбор дымоходной системы является предварительным и носит ориентировочный характер.',
  'Для точного подбора состава системы, уточнения количества элементов и согласования монтажного решения обратитесь к менеджерам ЖарGO.',
  'Мы поможем подобрать дымоход любой сложности и конфигурации.',
];

const resolveAssetUrl = (path) => {
  if (!path || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const baseUrl = document.querySelector('base')?.href ?? window.location.href;

  return new URL(path, baseUrl).href;
};

const getSiteLabel = () => {
  const host = window.location.host || '';

  if (!host || host.startsWith('localhost') || host.startsWith('127.0.0.1')) {
    return 'жарго.рф';
  }

  return host;
};

const getItemNote = (name, index) => {
  if (index === 0) {
    return 'Первый элемент от печи';
  }

  if (name === 'ППУ') {
    return 'Проходной узел';
  }

  return '';
};

const buildPrintStyles = () => {
  const fontRegular = resolveAssetUrl('fonts/GolosTextRegular.woff2');
  const fontMedium = resolveAssetUrl('fonts/GolosTextMedium.woff2');

  return `
    @font-face {
      font-family: 'Golos Text';
      src: url('${fontRegular}') format('woff2');
      font-weight: 400;
      font-style: normal;
    }

    @font-face {
      font-family: 'Golos Text';
      src: url('${fontMedium}') format('woff2');
      font-weight: 500;
      font-style: normal;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      color: #363636;
      font-family: 'Golos Text', Arial, sans-serif;
      background: #fff;
    }

    .pdf {
      display: flex;
      flex-direction: column;
      width: 1160px;
      min-height: 1641px;
      margin: 0 auto;
      padding: 10px;
      box-sizing: border-box;
      background: #fff;
    }

    .pdf__header {
      padding: 0 0 10px;
      border-radius: 0 0 20px 20px;
      min-height: 132px;
      box-sizing: border-box;
      overflow: hidden;
    }

    .pdf__header-inner {
      display: flex;
      align-items: center;
      gap: 40px;
      width: 100%;
      min-height: 122px;
      padding: 0 0 2px;
      box-sizing: border-box;
    }

    .pdf__logo {
      flex-shrink: 0;
      width: 120px;
      height: 120px;
    }

    .pdf__logo img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .pdf__tagline {
      margin: 0;
      width: 690px;
      max-width: 690px;
      font-weight: 500;
      font-size: 40px;
      line-height: 1.2;
      text-transform: uppercase;
    }

    .pdf__site {
      margin-left: auto;
      flex-shrink: 0;
      font-weight: 500;
      font-size: 25px;
      line-height: 1.2;
      white-space: nowrap;
    }

    .pdf__body {
      flex: 1;
      padding: 39px 10px 0;
    }

    .pdf__section-head {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
      gap: 40px;
    }

    .pdf__section-head__line {
      flex: 1 1 0;
      min-width: 0;
      height: 1px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .pdf__section-head__line--left {
      background: linear-gradient(90deg, rgb(237 116 7 / 0) 0%, #ed7407 100%);
    }

    .pdf__section-head__line--right {
      background: linear-gradient(270deg, rgb(237 116 7 / 0) 0%, #ed7407 100%);
    }

    .pdf__section-head__title {
      flex: 0 1 auto;
      margin: 0;
      max-width: 534px;
      font-weight: 500;
      font-size: 30px;
      line-height: 1.2;
      text-align: center;
      text-transform: uppercase;
      color: #363636;
    }

    .pdf__content {
      display: flex;
      align-items: flex-start;
      gap: 40px;
      margin-bottom: 60px;
    }

    .pdf__scheme {
      flex-shrink: 0;
      width: 375px;
    }

    .pdf__scheme img {
      display: block;
      width: 375px;
      height: auto;
      max-height: 450px;
      object-fit: contain;
    }

    .pdf__result {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .pdf__chips {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    .pdf__chip {
      border-radius: 1000px;
      padding: 5px 10px;
      font-weight: 400;
      font-size: 16px;
      line-height: 1.4;
      color: #585858;
      background-color: #f4f4f4;
    }

    .pdf__lists {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .pdf__list-block {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .pdf__item {
      display: flex;
      align-items: center;
      gap: 20px;
      border-radius: 4px;
      padding: 8px 20px;
      min-height: 66px;
      background-color: #f4f4f4;
    }

    .pdf__item-num {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 29px;
      height: 29px;
      font-weight: 400;
      font-size: 16px;
      line-height: 1;
      color: #fff;
      background-color: #ed7407;
    }

    .pdf__item-body {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 5px;
      min-width: 0;
    }

    .pdf__item-name {
      font-weight: 500;
      font-size: 18px;
      line-height: 1.4;
      color: #363636;
    }

    .pdf__item-note {
      font-weight: 400;
      font-size: 14px;
      line-height: 1.4;
      color: #585858;
    }

    .pdf__item-qty {
      flex-shrink: 0;
      font-weight: 500;
      font-size: 18px;
      line-height: 1.4;
      color: #ed7407;
      white-space: nowrap;
    }

    .pdf__notes {
      margin: 0;
      color: #585858;
      font-weight: 400;
      font-size: 18px;
      line-height: 1.3;
    }

    .pdf__notes p {
      margin: 0 0 15px;
    }

    .pdf__notes p:last-child {
      margin-bottom: 0;
    }

    .pdf__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-top: auto;
      padding: 10px 0;
      border-top: 1px solid rgba(0, 0, 0, 0.2);
      font-size: 20px;
      line-height: 1.2;
      box-sizing: border-box;
    }

    .pdf__footer-legal {
      flex: 0 0 auto;
      margin: 0;
      font-weight: 400;
      white-space: nowrap;
    }

    .pdf__footer-aside {
      display: flex;
      align-items: center;
      gap: 30px;
      flex: 0 0 auto;
      margin-left: auto;
    }

    .pdf__footer-contact {
      display: flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
    }

    .pdf__footer-icon {
      flex-shrink: 0;
      width: 30px;
      height: 30px;
    }

    .pdf__footer-icon path {
      stroke: #ed7407;
    }

    @page {
      margin: 0;
    }

    @media print {
      body {
        margin: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .pdf {
        width: 1160px;
        min-height: 1641px;
        margin: 0 auto;
        padding: 10px;
      }
    }
  `;
};

const buildItemHtml = (item, index) => {
  const note = getItemNote(item.name, index);
  const noteHtml = note ? `<span class="pdf__item-note">${note}</span>` : '';

  return `
    <li class="pdf__item">
      <span class="pdf__item-num">${index + 1}</span>
      <span class="pdf__item-body">
        <span class="pdf__item-name">${item.name}</span>
        ${noteHtml}
      </span>
      <span class="pdf__item-qty">${item.quantity} шт</span>
    </li>
  `;
};

const buildListHtml = (items) => {
  const visibleItems = items.filter((item) => item.quantity > 0);
  const midpoint = Math.ceil(visibleItems.length / 2);
  const blocks = [
    visibleItems.slice(0, midpoint),
    visibleItems.slice(midpoint),
  ];

  return blocks.map((blockItems, blockIndex) => {
    const offset = blockIndex === 0 ? 0 : midpoint;

    return `
      <ol class="pdf__list-block">
        ${blockItems.map((item, index) => buildItemHtml(item, offset + index)).join('')}
      </ol>
    `;
  }).join('');
};

const buildPrintHtml = ({ schemeTitle, chips, items, schemeId }) => {
  const logoUrl = resolveAssetUrl('img/logo-pdf.svg');
  const siteLabel = getSiteLabel();
  const schemeImageUrl = resolveAssetUrl(`img/chimneys/scheme-${schemeId}.svg`);
  const chipsHtml = chips.map((chip) => `<span class="pdf__chip">${chip}</span>`).join('');
  const notesHtml = DISCLAIMER_PARAGRAPHS.map((text) => `<p>${text}</p>`).join('');

  const phoneIcon = `
    <svg class="pdf__footer-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#ed7407" stroke-width="1.25"/>
    </svg>
  `;

  const calendarIcon = `
    <svg class="pdf__footer-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="#ed7407" stroke-width="1.25" stroke-linecap="round"/>
    </svg>
  `;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Конфигуратор дымохода — результат</title>
  <style>${buildPrintStyles()}</style>
</head>
<body>
  <div class="pdf">
    <header class="pdf__header">
      <div class="pdf__header-inner">
        <div class="pdf__logo">
          <img src="${logoUrl}" alt="ЖарGO" width="120" height="120">
        </div>
        <h1 class="pdf__tagline">Инженерные решения для&nbsp;бани, дома и&nbsp;огня</h1>
        <div class="pdf__site">${siteLabel}</div>
      </div>
    </header>

    <main class="pdf__body">
      <div class="pdf__section-head">
        <span class="pdf__section-head__line pdf__section-head__line--left" aria-hidden="true"></span>
        <h2 class="pdf__section-head__title">${schemeTitle}</h2>
        <span class="pdf__section-head__line pdf__section-head__line--right" aria-hidden="true"></span>
      </div>

      <div class="pdf__content">
        <div class="pdf__scheme">
          <img src="${schemeImageUrl}" alt="" width="375" height="450">
        </div>
        <div class="pdf__result">
          <div class="pdf__chips">${chipsHtml}</div>
          <div class="pdf__lists">${buildListHtml(items)}</div>
        </div>
      </div>

      <div class="pdf__notes">${notesHtml}</div>
    </main>

    <footer class="pdf__footer">
      <p class="pdf__footer-legal">ООО «ДымоходСервис»&nbsp;&nbsp;ИНН&nbsp;5257131935&nbsp;&nbsp;ОГРН&nbsp;1125257006731</p>
      <div class="pdf__footer-aside">
        <div class="pdf__footer-contact">
          ${phoneIcon}
          <span>8 (800) 500-54-42</span>
        </div>
        <div class="pdf__footer-contact">
          ${calendarIcon}
          <span>Пн-Пт с 9:00 до 18:00</span>
        </div>
      </div>
    </footer>
  </div>
</body>
</html>`;
};

const waitForImages = (doc) => {
  const images = Array.from(doc.images || []);

  if (images.length === 0) {
    return Promise.resolve();
  }

  return Promise.all(images.map((img) => {
    if (img.complete) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  }));
};

const waitForFonts = (doc) => {
  if (doc.fonts?.ready) {
    return doc.fonts.ready.catch(() => {});
  }

  return Promise.resolve();
};

const removePrintFrame = (frame) => {
  frame?.parentNode?.removeChild(frame);
};

export const printChimneyResult = ({ schemeTitle, chips, items, schemeId }) => {
  removePrintFrame(document.getElementById('chimney-print-frame'));

  const frame = document.createElement('iframe');
  frame.id = 'chimney-print-frame';
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;left:-9999px;top:0;width:1160px;height:1700px;border:0;';
  document.body.appendChild(frame);

  const printWindow = frame.contentWindow;
  const printDocument = printWindow.document;

  printDocument.open();
  printDocument.write(buildPrintHtml({ schemeTitle, chips, items, schemeId }));
  printDocument.close();

  const startPrint = () => {
    Promise.all([waitForImages(printDocument), waitForFonts(printDocument)]).then(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();

          printWindow.addEventListener('afterprint', () => {
            removePrintFrame(frame);
          }, { once: true });

          setTimeout(() => {
            removePrintFrame(frame);
          }, 30000);
        }, 250);
      });
    });
  };

  if (printDocument.readyState === 'complete') {
    startPrint();
  } else {
    printWindow.addEventListener('load', startPrint, { once: true });
  }
};
