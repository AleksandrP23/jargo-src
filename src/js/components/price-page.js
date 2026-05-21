const initPricePage = () => {
  const toolbar = document.querySelector('[data-price-toolbar]');

  if (!toolbar) {
    return;
  }

  const modeSwitch = toolbar.querySelector('[data-price-mode-switch]');
  const markupInput = toolbar.querySelector('[data-price-markup]');
  const markupClear = toolbar.querySelector('.price-toolbar__markup-clear');

  const setDiscountMode = (isDiscount) => {
    document.body.classList.toggle('price-toolbar--discount', isDiscount);

    if (modeSwitch) {
      modeSwitch.setAttribute('aria-checked', String(isDiscount));
    }
  };

  if (modeSwitch) {
    modeSwitch.addEventListener('click', () => {
      const isDiscount = modeSwitch.getAttribute('aria-checked') === 'true';
      setDiscountMode(!isDiscount);
    });
  }

  if (markupClear && markupInput) {
    markupClear.addEventListener('click', () => {
      markupInput.value = '0';
      markupInput.focus();
    });
  }

  document.querySelectorAll('[data-price-expand]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-price-group]');

      if (group) {
        group.classList.add('price-group--expanded');
      }
    });
  });

  document.querySelectorAll('[data-price-series-link]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-price-series-link]').forEach((el) => {
        el.classList.remove('price-series-nav__btn--active');
      });
      btn.classList.add('price-series-nav__btn--active');
    });
  });
};

initPricePage();
