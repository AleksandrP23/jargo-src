export const QUIZ_LABELS = {
  wall: {
    vagon: 'Вагонка / утеплённые',
    breven: 'Брёвна / толстый брус',
  },
  saunaType: {
    russian: 'Русская баня',
    finnish: 'Финская сауна',
  },
  firebox: {
    ktk: 'КТК (из парной)',
    vynos: 'Выносная (из предбанника)',
  },
  door: {
    glass: 'Со стеклом',
    plain: 'Без стекла',
  },
  material: {
    stal: 'Конструкционная сталь',
    chugun: 'Чугун',
  },
};

const DISCLAIMER_PARAGRAPHS = [
  'Калькулятор подбора помогает определить расчётный объём парной и подобрать подходящие модели печей ЖарGO.',
  'Рекомендации носят предварительный характер. Для уточнения комплектации, монтажа и дымохода обратитесь к специалисту.',
  'Актуальные цены, наличие и технические характеристики уточняйте у менеджера или на официальном сайте.',
];

const DEFAULT_MODEL_DESCRIPTION = 'Универсальная сталь. Подходит для обоих типов парной.';

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

const formatDimensions = (answers, volume) => {
  return `${answers.length}×${answers.width}×${answers.height} м (${volume} м³)`;
};

const formatUninsulated = (answers) => {
  return answers.uninsulatedArea > 0 ? `${answers.uninsulatedArea} м²` : '0 м²';
};

export const getQuizModelDescription = (model) => {
  if (model.description) {
    return model.description;
  }

  if (model.id === 'taganay-22') {
    return 'Сталь. Для просторных парных и смешанного режима.';
  }

  return DEFAULT_MODEL_DESCRIPTION;
};

const buildParamRow = (label, value) => {
  return `
    <div class="param-row">
      <span class="param-row__label">${label}</span>
      <span class="param-row__value">${value}</span>
    </div>
  `;
};

const buildModelsHtml = (models) => {
  return models.map((model) => {
    const description = getQuizModelDescription(model);
    const details = model.details ?? '';

    return `
      <article class="model-row">
        <div class="model-row__image">
          <img src="${resolveAssetUrl(model.image)}" alt="${model.title}" width="215" height="150">
        </div>
        <div class="model-row__content">
          <div class="model-row__head">
            <h3 class="model-row__title">${model.title}</h3>
            <p class="model-row__desc">${description}</p>
          </div>
          ${details ? `<p class="model-row__details">${details}</p>` : ''}
        </div>
      </article>
    `;
  }).join('');
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
      padding: 39px 0 0;
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
      flex: 0 0 auto;
      margin: 0;
      font-weight: 500;
      font-size: 30px;
      line-height: 1.2;
      text-align: center;
      color: #363636;
      white-space: nowrap;
    }

    .pdf__result {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 60px;
    }

    .pdf__params {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
      font-size: 16px;
      line-height: 1.4;
    }

    .pdf__params-col {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .param-row {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      align-items: baseline;
    }

    .param-row__label {
      color: #585858;
      font-weight: 400;
    }

    .param-row__value {
      color: #363636;
      font-weight: 500;
    }

    .pdf__divider {
      height: 1px;
      margin: 0;
      background: rgba(218, 218, 218, 0.4);
    }

    .pdf__volume {
      display: flex;
      gap: 10px;
      margin: 0;
      font-weight: 500;
      font-size: 16px;
      line-height: 1.4;
    }

    .pdf__volume-value {
      color: #ed7407;
    }

    .pdf__subtitle {
      margin: 0;
      font-weight: 500;
      font-size: 16px;
      line-height: 1.4;
      color: rgba(54, 54, 54, 0.6);
    }

    .pdf__models {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .model-row {
      display: flex;
      gap: 15px;
      align-items: flex-start;
    }

    .model-row__image {
      flex-shrink: 0;
      border-radius: 10px;
    }

    .model-row__image img {
      display: block;
      width: 215px;
      height: 150px;
      object-fit: contain;
    }

    .model-row__content {
      flex: 1;
      min-width: 0;
    }

    .model-row__head {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 15px;
    }

    .model-row__title {
      margin: 0;
      font-weight: 500;
      font-size: 20px;
      line-height: 1.2;
    }

    .model-row__desc {
      margin: 0;
      color: #585858;
      font-weight: 400;
      font-size: 16px;
      line-height: 1.4;
    }

    .model-row__details {
      margin: 0;
      color: #585858;
      font-weight: 400;
      font-size: 18px;
      line-height: 1.3;
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

const buildPrintHtml = ({ answers, volume, models }) => {
  const logoUrl = resolveAssetUrl('img/logo-pdf.svg');
  const siteLabel = getSiteLabel();

  const leftParams = [
    buildParamRow('Размеры:', formatDimensions(answers, volume)),
    buildParamRow('Материал стен:', QUIZ_LABELS.wall[answers.wallMaterial] ?? '—'),
    buildParamRow('Топка:', QUIZ_LABELS.firebox[answers.firebox] ?? '—'),
    buildParamRow('Неутеплённые поверхности:', formatUninsulated(answers)),
  ].join('');

  const rightParams = [
    buildParamRow('Тип парной:', QUIZ_LABELS.saunaType[answers.saunaType] ?? '—'),
    buildParamRow('Материал печи:', QUIZ_LABELS.material[answers.material] ?? '—'),
    buildParamRow('Дверца:', QUIZ_LABELS.door[answers.door] ?? '—'),
  ].join('');

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
  <title>Подбор банной печи — результат</title>
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
        <h2 class="pdf__section-head__title">Результат</h2>
        <span class="pdf__section-head__line pdf__section-head__line--right" aria-hidden="true"></span>
      </div>

      <div class="pdf__result">
        <div class="pdf__params">
          <div class="pdf__params-col">${leftParams}</div>
          <div class="pdf__params-col">${rightParams}</div>
        </div>

        <div class="pdf__divider" aria-hidden="true"></div>

        <p class="pdf__volume">
          <span>Расчетный объем:</span>
          <span class="pdf__volume-value">${volume} м³</span>
        </p>

        <div class="pdf__divider" aria-hidden="true"></div>

        <p class="pdf__subtitle">Подходящие печи ЖарGO</p>

        <div class="pdf__models">${buildModelsHtml(models)}</div>
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

export const printQuizResult = ({ answers, volume, models }) => {
  removePrintFrame(document.getElementById('quiz-print-frame'));

  const frame = document.createElement('iframe');
  frame.id = 'quiz-print-frame';
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;left:-9999px;top:0;width:1160px;height:1700px;border:0;';
  document.body.appendChild(frame);

  const printWindow = frame.contentWindow;
  const printDocument = printWindow.document;

  printDocument.open();
  printDocument.write(buildPrintHtml({ answers, volume, models }));
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
