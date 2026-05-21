/**
 * Липкая шапка: после скролла — fixed и отступ hero (margin под высоту шапки).
 * Полоса категорий `.header-scroll`: адаптивное меню (MaxGraph JS №8) —
 * лишние пункты переносятся в выпадающий список «ещё».
 */

const initHeaderScrollBehavior = () => {
  const header = document.querySelector('.header');
  const hero = document.querySelector('.top-shell .hero');

  if (!header) {
    return;
  }

  const scrollThreshold = 10;
  let ticking = false;

  /** При блокировке скролла (`disableScroll`) в `data-position` пишется реальный scrollY, а `window.scrollY` становится 0 — без этого снимется `header--fixed` и выпадающее меню уезжает вверх. */
  const getEffectiveScrollY = () => {
    const raw = document.body.dataset.position;
    if (raw !== undefined && raw !== '') {
      const locked = parseInt(raw, 10);
      if (!Number.isNaN(locked)) {
        return locked;
      }
    }
    return window.scrollY;
  };

  const setFixedState = (isFixed) => {
    if (isFixed) {
      header.classList.add('header--fixed');
      if (hero) {
        hero.style.marginTop = `${header.offsetHeight}px`;
      }
    } else {
      header.classList.remove('header--fixed');
      if (hero) {
        hero.style.marginTop = '';
      }
    }
  };

  const update = () => {
    const scrollY = getEffectiveScrollY();

    header.classList.toggle('header--scrolled', scrollY > scrollThreshold);

    if (scrollY <= scrollThreshold) {
      setFixedState(false);
    } else {
      setFixedState(true);
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    if (header.classList.contains('header--fixed') && hero) {
      hero.style.marginTop = `${header.offsetHeight}px`;
    }
  });

  update();
};

/**
 * Динамический перенос пунктов из основной строки в `.header-scroll__list--overflow`.
 */
const initHeaderScrollOverflow = () => {
  const scrollRoot = document.querySelector('.header-scroll');
  const bar = document.querySelector('[data-header-scroll-bar]');
  const main = document.querySelector('[data-header-scroll-main]');
  const overflowList = document.querySelector('[data-header-scroll-overflow]');
  const moreWrap = document.querySelector('[data-header-scroll-more]');
  const moreBtn = document.querySelector('[data-header-scroll-more-btn]');

  if (!scrollRoot || !bar || !main || !overflowList || !moreWrap || !main.children.length) {
    return;
  }

  const readVars = () => {
    const cs = getComputedStyle(scrollRoot);
    return {
      gap: parseFloat(cs.getPropertyValue('--header-scroll-gap')) || 10,
      fudge: 28,
    };
  };

  /** Доступная ширина под основную строку; если в overflow ещё есть пункты — резервируем место под кнопку «ещё». */
  const outerAvailable = (reserveMoreSlot) => {
    const cs = getComputedStyle(scrollRoot);
    const moreW = parseFloat(cs.getPropertyValue('--header-scroll-more-width')) || 44;
    const moreM = parseFloat(cs.getPropertyValue('--header-scroll-more-margin')) || 10;
    const { fudge } = readVars();
    let reserve = 0;
    if (reserveMoreSlot) {
      reserve += moreW + moreM;
    }

    return Math.max(0, bar.offsetWidth - reserve - fudge);
  };

  const updateMoreUi = () => {
    const hasOverflow = overflowList.children.length > 0;
    moreWrap.classList.toggle('header-scroll__more--active', hasOverflow);
    moreBtn?.setAttribute('aria-expanded', hasOverflow ? 'true' : 'false');
    if (!hasOverflow) {
      moreWrap.classList.remove('header-scroll__more--open');
    }
  };

  const resetAllToMain = () => {
    while (overflowList.firstElementChild) {
      main.appendChild(overflowList.firstElementChild);
    }
  };

  const contract = () => {
    const { gap } = readVars();
    const avail = outerAvailable(true);

    const items = [...main.children];
    let w = 0;

    for (let i = 0; i < items.length; i++) {
      if (i > 0) {
        w += gap;
      }
      w += items[i].offsetWidth;

      if (w > avail) {
        const toMove = items.slice(i);
        for (let j = toMove.length - 1; j >= 0; j--) {
          overflowList.prepend(toMove[j]);
        }
        break;
      }
    }

    updateMoreUi();
  };

  const balance = () => {
    if (bar.offsetWidth <= 0) {
      return;
    }

    resetAllToMain();
    contract();
  };

  let resizeTick = false;
  const onResize = () => {
    if (!resizeTick) {
      resizeTick = true;
      requestAnimationFrame(() => {
        resizeTick = false;
        balance();
      });
    }
  };

  window.addEventListener('resize', onResize);

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => balance());
    ro.observe(bar);
  }

  moreBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    moreWrap.classList.toggle('header-scroll__more--open');
  });

  document.addEventListener('click', () => {
    moreWrap.classList.remove('header-scroll__more--open');
  });

  moreWrap.addEventListener('click', (e) => e.stopPropagation());

  balance();
};

initHeaderScrollBehavior();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeaderScrollOverflow);
} else {
  initHeaderScrollOverflow();
}
