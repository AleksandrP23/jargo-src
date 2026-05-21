const initTooltipRoot = (root) => {
  const dots = Array.from(root.querySelectorAll('.article-body__tooltip-dot'));
  const popup = root.querySelector('[data-tooltip-popup]');
  const popupTitle = root.querySelector('[data-tooltip-popup-title]');
  const popupText = root.querySelector('[data-tooltip-popup-text]');

  if (!dots.length || !popup || !popupTitle || !popupText) {
    return;
  }

  // По умолчанию скрываем попап, показываем только при клике по активной точке
  popup.style.display = 'none';

  const setPopup = (dot) => {
    // Повторное нажатие на активную точку: скрываем тултип
    const isAlreadyActive = dot.classList.contains('article-body__tooltip-dot--active');
    if (isAlreadyActive) {
      dots.forEach((item) => item.classList.remove('article-body__tooltip-dot--active'));
      popup.style.display = 'none';
      return;
    }

    popupTitle.textContent = dot.dataset.tooltipTitle ?? '';
    popupText.textContent = dot.dataset.tooltipText ?? '';

    popup.style.display = 'block';

    dots.forEach((item) => item.classList.remove('article-body__tooltip-dot--active'));
    dot.classList.add('article-body__tooltip-dot--active');

    const rootRect = root.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();

    const localLeft = dotRect.left - rootRect.left;
    const localTop = dotRect.top - rootRect.top;

    const isMobile = window.matchMedia?.('(max-width: 560px)').matches ?? window.innerWidth <= 560;

    const minLeft = 10;
    const minTop = 10;
    const maxLeft = rootRect.width - popupRect.width - 10;
    const maxTop = rootRect.height - popupRect.height - 10;

    // Desktop/Tablet: popup стараемся ставить слева от точки,
    // но если слева не помещается — переключаем на правую сторону.
    // Mobile: popup под точкой и на всю ширину блока.
    let left;
    let top;

    if (isMobile) {
      left = 10;
      top = localTop + dotRect.height + 12;
    } else {
      const leftCandidate = localLeft - popupRect.width - 18;
      const rightCandidate = localLeft + dotRect.width + 18;

      const leftFits = leftCandidate >= minLeft && leftCandidate <= maxLeft;
      left = leftFits ? leftCandidate : rightCandidate;
      top = localTop - (popupRect.height / 2) + (dotRect.height / 2);
    }

    left = Math.min(Math.max(left, minLeft), maxLeft);
    top = Math.min(Math.max(top, minTop), maxTop);

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => setPopup(dot));
  });

  // Клик мимо тултипа: скрываем попап и снимаем активность
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (!root.contains(target)) {
      dots.forEach((item) => item.classList.remove('article-body__tooltip-dot--active'));
      popup.style.display = 'none';
    }
  });

  const activeDot = root.querySelector('.article-body__tooltip-dot--active') ?? dots[0];
  setPopup(activeDot);
};

const initArticleTooltips = () => {
  document.querySelectorAll('[data-article-tooltips]').forEach(initTooltipRoot);
};

initArticleTooltips();
